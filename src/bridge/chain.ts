import {
  IcConnector,
  IcrcIDL,
  MinterIDL,
  MinterService,
  SpenderIDL,
  SpenderService,
} from "../ic";
import BftBridgeABI from "../abi/BftBridge.json";
import WrappedTokenABI from "../abi/WrappedToken.json";
import { MintReason, Result } from "../ic/idl/minter/minter.did";
import {
  Signer,
  ethers,
  Provider,
  TransactionReceipt,
  Transaction,
  TransactionResponse,
} from "ethers";

import {
  Address,
  AddressWithChainID,
  Id256,
  Id256Factory,
  SignedMintOrder,
} from "../validation";
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
    const chainId = await this.get_chain_id();
    const result = await this.Ic.actor<MinterService>(
      this.minterCanister,
      MinterIDL
    ).get_bft_bridge_contract([chainId]);
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
    let tokenAddress = await this.get_wrapped_token_address(fromToken);
    if (!tokenAddress) {
      const contract = new ethers.Contract(
        bridge!?.getAddress(),
        BftBridgeABI,
        this.signer
      );
      const tx = await contract.deployERC20(name, symbol, fromToken);
      await tx.wait();
      tokenAddress = await this.get_wrapped_token_address(fromToken);
    }
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

  public async add_operation_points(canisterPrincipal: Principal) {
    const userPrincipal = this.Ic.getPrincipal();
    const tx_hash = new Uint8Array(32);
    const receiver_canister =
      Id256Factory.principalToBytes32(canisterPrincipal);
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
    console.log("notify_tx_hash", notify_tx_hash);
  }

  async send_notification_tx(notification: string) {
    const userAddress = await this.signer.getAddress();
    const nonce = await this.provider.getTransactionCount(userAddress);
    const gasPrice = (await this.provider.getFeeData()).gasPrice;
    const chainId = await this.get_chain_id();

    let transactionArgs = {
      from: userAddress,
      to: userAddress,
      gasLimit: BigInt(30000),
      nonce,
      gasPrice,
      value: ethers.parseEther("0"),
      chainId,
      data: notification,
    };
    const tx = await this.signer.sendTransaction(transactionArgs);
    console.log("result", tx);
    const receipt = await tx.wait();
    console.log("receipt", receipt);
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

    const recipient_chain_id = await this.get_chain_id();
    await this.add_operation_points(Principal.fromText(this.minterCanister));

    const tokenAddress = await this.get_wrapped_token_address(
      Id256Factory.fromPrincipal(token)
    );
    console.log("tokenAddress", tokenAddress);
    if (tokenAddress) {
      const mintReason: MintReason = {
        Icrc1Burn: {
          recipient_chain_id,
          icrc1_token_principal: token,
          from_subaccount: [],
          recipient_address: await this.signer.getAddress(),
          amount: numberToHex(amount),
        },
      };
      console.log("mintReason", mintReason);
      return await this.createMintOrder(mintReason);
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
      console.log(result.Err);
      throw result.Err;
    }
    return ethers.getBytes(new Uint8Array(result.Ok));
  }

  public async mint_icrc_tokens(
    burnTxHash: string,
    amount: number,
    spender_principal: Principal,
    icrcToken: Principal
  ): Promise<bigint | undefined> {
    const chainId = await this.get_chain_id();
    console.log("args", { burnTxHash, amount });
    const result = await this.Ic.actor<MinterService>(
      this.minterCanister,
      MinterIDL
    ).approve_icrc_mint(chainId, burnTxHash);
    console.log("mint approval result", result);

    if ("Ok" in result) {
      const fee = await this.get_icrc_token_fee(icrcToken);
      const approvedAmount = Number(result.Ok) - fee!;
      console.log("approved Amount", approvedAmount);
      console.log("approved Amount", "0x" + approvedAmount.toString(16));
      const spenderResult = await this.Ic.actor<SpenderService>(
        spender_principal,
        SpenderIDL
      ).transfer_icrc_tokens(
        chainId,
        burnTxHash,
        "0x" + approvedAmount.toString(16)
      );
      console.log("spenderResult", spenderResult);
      if ("Ok" in spenderResult) {
        return spenderResult.Ok;
      }
    }
  }

  public async burn_erc_20_tokens(
    from_token: Address,
    dstToken: Id256,
    amount: number,
    chainId: number = 0
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
    const balanceOf = await WrappedTokenContract.balanceOf(
      await this.signer.getAddress()
    );
    console.log("balance", balanceOf);

    const approveTx = await WrappedTokenContract.approve(
      bridge!?.getAddress(),
      String(amount),
      { nonce: await this.get_nonce() }
    );
    const approvedTx = await approveTx.wait();
    console.log("burn args", {
      amount: Number(amount),
      from_address: from_token.getAddress(),
      recipient: Id256Factory.fromPrincipal(this.Ic.getPrincipal()!),
      toToken: dstToken,
    });

    const tx = await bftContract.burn(
      Number(amount),
      from_token.getAddress(),
      Id256Factory.fromPrincipal(this.Ic.getPrincipal()!),
      0,
      {
        nonce: await this.get_nonce(),
        gasLimit: 200000,
        //gasPrice: (await this.provider.getFeeData()).gasPrice,
      }
    );
    await tx.wait();
    console.log("tx", tx);
    if (tx) {
      return tx.hash;
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

  async mintOrder(
    encodedOrder: SignedMintOrder
  ): Promise<TransactionResponse | undefined> {
    const bridgeAddress = await this.get_bft_bridge_contract();
    const userAddress = await this.signer.getAddress();
    const nonce = await this.get_nonce();

    const bridge = new ethers.Contract(
      bridgeAddress!?.getAddress(),
      BftBridgeABI,
      this.signer
    );
    console.log("encodedOrder.length", encodedOrder.length);
    const tx = await bridge.mint(encodedOrder, { nonce, gasLimit: 200000 });
    await tx.wait();
    let txReceipt = await this.provider.getTransaction(tx.hash);
    console.log("signer", userAddress);
    console.log("txReceipt", txReceipt);
    if (txReceipt) {
      return txReceipt;
    }
  }

  public async mint_erc_20_tokens(
    burn_tx_hash: TxHash,
    burn_chain_id: number
  ): Promise<TransactionResponse | undefined> {
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

  public async get_nonce(): Promise<number> {
    const userAddress = await this.signer.getAddress();
    return await this.provider.getTransactionCount(userAddress);
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
