import { IcConnector, IcrcIDL, MinterIDL, MinterService } from "../ic";
import BftBridgeABI from "../abi/BftBridge.json";
import WrappedTokenABI from "../abi/WrappedToken.json";
import { MintReason } from "../ic/idl/minter/minter.did";
import {
  Signer,
  ethers,
  Provider,
  TransactionReceipt,
  Transaction,
} from "ethers";

import { Address, Id256, Id256Factory, SignedMintOrder } from "../validation";
import {
  chainManagerIface,
  NoficationIface,
  SwapResult,
  TxHash,
} from "./Interfaces";
import { AbiItem, numberToHex } from "web3-utils";
import { ApproveArgs, Tokens } from "../ic/idl/icrc/icrc.did";
import { IcrcService } from "../ic";
import { Principal } from "@dfinity/principal";

export class Chain implements chainManagerIface {
  public minterCanister: string;
  public Ic: IcConnector;
  public signer: Signer;
  public provider: Provider;

  constructor(
    minterCanister: string,
    Ic: IcConnector,
    signer: Signer,
    provider: Provider
  ) {
    this.minterCanister = minterCanister;
    this.Ic = Ic;
    this.signer = signer;
    this.provider = provider;
  }

  public async get_bft_bridge_contract(): Promise<Address | undefined> {
    console.log("provider", this.provider);
    const { chainId } = await this.provider.getNetwork();
    const result = await this.Ic.actor<MinterService>(
      this.minterCanister,
      MinterIDL
    ).get_bft_bridge_contract([Number(chainId)]);
    console.log("bft bridge contract address", result);
    if (result.length) {
      return new Address(result[0]);
    }
    return undefined;
  }

  public async get_wrapped_token_address(
    fromToken: Id256
  ): Promise<Address | undefined> {
    const bridge = await this.get_bft_bridge_contract();
    if (bridge) {
      const contract = new ethers.Contract(
        bridge?.getAddress(),
        BftBridgeABI,
        this.provider
      );
      const wrappedToken = await contract.getWrappedToken(fromToken);
      console.log("wrappedToken", wrappedToken);
      if (new Address(wrappedToken).isZero()) {
        return undefined;
      }
      return new Address(wrappedToken);
    }
  }

  public async deploy_bft_wrapped_token(
    name: string,
    symbol: string,
    fromToken: Id256
  ): Promise<Address> {
    const bridge = await this.get_bft_bridge_contract();
    const contract = new ethers.Contract(
      bridge!?.getAddress(),
      BftBridgeABI,
      this.signer
    );
    await contract.deployERC20(name, symbol, fromToken);
    const tokenAddress = await this.get_wrapped_token_address(fromToken);
    return tokenAddress!;
  }

  public async get_icrc_token_fee(
    principal: Principal
  ): Promise<number | undefined> {
    const result = await this.Ic.actor<IcrcService>(
      principal,
      IcrcIDL
    ).icrc1_fee();
    if (result) {
      return Number(result);
    }
    return undefined;
  }

  public async add_operation_points() {
    const userPrincipal = this.Ic.getPrincipal();
    const tx_hash = new Uint8Array(32);
    console.log(
      "minter canister principal",
      Principal.fromText(this.minterCanister)
    );
    const receiver_canister = Id256Factory.principalToBytes32(
      Principal.fromText(this.minterCanister)
    );
    console.log("receiver_canister", receiver_canister);
    console.log("receiver_canister length", receiver_canister.length);
    const user_data = userPrincipal?.toUint8Array();

    let ABI = [
      "function evm_canister_notification_needed(bytes32 tx_hash, bytes32 principal, bytes user_data)",
    ];
    let iface = new ethers.Interface(ABI);
    const encodedData = iface.encodeFunctionData(
      "evm_canister_notification_needed",
      [tx_hash, receiver_canister, user_data]
    );
    console.log("encodedData", encodedData);

    let notify_tx_hash = await this.send_notification_tx(encodedData);
  }

  async send_notification_tx(notification: string) {
    const userAddress = await this.signer.getAddress();
    const nonce = await this.provider.getTransactionCount(userAddress);
    const gasPrice = (await this.provider.getFeeData()).gasPrice;
    const { chainId } = await this.provider.getNetwork();

    let transaction = {
      from: userAddress,
      to: userAddress,
      gasLimit: BigInt(30000),
      nonce,
      gasPrice,
      value: ethers.parseEther("0"),
      chainId,
      data: notification,
    };
    const result = await this.signer.sendTransaction(transaction);
    console.log("result", result);
    const receipt = await result.wait();
    console.log("reciept", receipt);
    console.log("reciept");
  }

  public async burn_icrc2_tokens(
    token: Principal,
    amount: number
  ): Promise<SignedMintOrder> {
    const fee = await this.get_icrc_token_fee(token);
    const approve: ApproveArgs = {
      fee: [],
      memo: [],
      from_subaccount: [],
      created_at_time: [],
      amount: BigInt(amount + fee!),
      expected_allowance: [],
      expires_at: [],
      spender: {
        owner: Principal.fromText(this.minterCanister),
        subaccount: [],
      },
    };
    console.log("approve args", approve);
    const approvalResult = await this.Ic.actor<IcrcService>(
      token.toText(),
      IcrcIDL
    ).icrc2_approve(approve);
    console.log("approvalResult", approvalResult);

    const { chainId } = await this.provider.getNetwork();
    await this.add_operation_points();

    const tokenAddress = await this.get_wrapped_token_address(
      Id256Factory.fromPrincipal(token)
    );
    console.log("tokenAddress", tokenAddress);
    if (tokenAddress) {
      const mintReason: MintReason = {
        Icrc1Burn: {
          recipient_chain_id: Number(chainId),
          icrc1_token_principal: token,
          from_subaccount: [],
          recipient_address: await this.signer.getAddress(),
          amount: numberToHex(amount),
        },
      };
      console.log("mintReason", mintReason);
      const result = await this.Ic.actor<MinterService>(
        this.minterCanister,
        MinterIDL
      ).create_erc_20_mint_order(mintReason);
      console.log("result", result);
      if ("Ok" in result) {
        return ethers.getBytes(new Uint8Array(result.Ok));
      }
    }
    throw Error("Impossible");
  }

  public async createMintOrder(
    mintReason: MintReason
  ): Promise<SignedMintOrder> {
    const result = await this.Ic.actor<MinterService>(
      this.minterCanister,
      MinterIDL
    ).create_erc_20_mint_order(mintReason);
    if ("Err" in result) {
      //TODO: THROW THIS as an ERROR AS WELL?
      console.log(result.Err);
      throw result;
    }
    return ethers.getBytes(new Uint8Array(result.Ok));
  }

  public async burn_erc_20_tokens(
    from_token: Address,
    dstToken: Id256,
    recipient: Id256,
    dstChainId: number,
    amount: number
  ): Promise<TxHash | undefined> {
    const bridge = await this.get_bft_bridge_contract();
    const bftContract = new ethers.Contract(
      bridge!?.getAddress(),
      BftBridgeABI,
      this.signer
    );
    const WrappedTokenContract = new ethers.Contract(
      from_token.getAddress(),
      WrappedTokenABI,
      this.signer
    );
    await WrappedTokenContract.approve(BftBridgeABI, amount);

    const result = await bftContract.burn(
      amount,
      from_token,
      recipient,
      dstToken,
      dstChainId
    );
    if (result && result.transactionHash) {
      return result.transactionHash;
    } else {
      throw Error("Transaction not successful");
    }
  }

  public async burn_native_tokens(
    dstToken: Id256,
    recipient: Id256,
    dstChainId: number,
    amount: number
  ): Promise<TxHash | undefined> {
    const bridgeAddress = await this.get_bft_bridge_contract();
    const bridge = new ethers.Contract(
      bridgeAddress!?.getAddress(),
      BftBridgeABI,
      this.signer
    );

    const result = await bridge.burn(recipient, dstToken, dstChainId, {
      value: ethers.parseEther(String(amount)),
    });
    if (result && result.transactionHash) {
      return result.transactionHash;
    } else {
      throw Error("Transaction not successful");
    }
  }

  async mintOrder(encodedOrder: SignedMintOrder): Promise<TransactionReceipt> {
    const bridgeAddress = await this.get_bft_bridge_contract();
    const encodedOrderBytes = ethers.hexlify(encodedOrder);
    const bridge = new ethers.Contract(
      bridgeAddress!?.getAddress(),
      BftBridgeABI,
      this.signer
    );
    return await bridge.mint(encodedOrderBytes);
  }

  public async mint_erc_20_tokens(
    burn_tx_hash: TxHash,
    burn_chain_id: number
  ): Promise<TransactionReceipt> {
    const reason = {
      Erc20Burn: {
        burn_tx_hash,
        chain_id: burn_chain_id,
      },
    };
    const order: SignedMintOrder = await this.createMintOrder(reason);
    return await this.mintOrder(order);
  }

  public async mint_native_tokens(
    reason: MintReason
  ): Promise<TransactionReceipt> {
    const result = await this.Ic.actor<MinterService>(
      this.minterCanister,
      MinterIDL
    ).mint_native_token(reason);
    if ("Ok" in result) {
      const txHash = result.Ok;
      const receipt: any = this.provider.getTransactionReceipt(txHash);
      return <TransactionReceipt>receipt;
    }
    throw Error("Not found");
  }
  public async get_chain_id(): Promise<number> {
    const { chainId } = await this.provider.getNetwork();
    return Number(chainId);
  }

  public async check_erc20_balance(token: Address): Promise<number> {
    return 0;
  }

  // @ts-ignore
  // TODO:
  register_bft_bridge_contract(): Promise<Address> {}

  // @ts-ignore
  create_bft_bridge_contract(): Promise<Address> {}
}

/*   public async transferIcrcTokens(icProvider, {fee = [], memo = [], fromSubaccount = [], createdAtTime =[], amount, expectedAllowance, expiresAt, spender}: transferIcrcTokensParams) {
    // approve transfer
    const result = await icProvider.icrc2_approve({
      fee,
      memo,
      fromSubaccount,
      createdAtTime,
      amount,
      expectedAllowance,
      expiresAt,
      spender
    })
    if ("Ok" in result) {
      return result.Ok
    }
    if("Err" in result) throw new Error(result.Err)
  }  */

//async deployERC20
