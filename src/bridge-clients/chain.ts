import { IcConnector, IcrcIDL, MinterIDL, MinterService } from "../ic";
import BftBridgeABI from "../abi/BftBridge.json";
import WrappedTokenABI from "../abi/WrappedToken.json";
import { MintReason } from "../ic/idl/minter/minter.did";
import { Signer, ethers, Provider } from "ethers";

import { Address, Id256, SignedMintOrder } from "../types/common";
import { chainManagerIface, SwapResult, TxHash } from "./Interfaces";
import { TransactionReceipt } from "web3-core";
import { AbiItem } from "web3-utils";
import { ApproveArgs } from "../ic/idl/icrc/icrc.did";
import { IcrcService } from "../../dist";
import { Principal } from "@dfinity/principal";

export class Chain implements chainManagerIface {
  private minterCanister: string;
  private Ic: IcConnector;
  private signer: Signer;
  private provider: Provider;

  constructor(minterCanister: string, Ic: IcConnector, signer: Signer) {
    this.minterCanister = minterCanister;
    this.Ic = Ic;
    this.signer = signer;
    this.provider = signer.provider;
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
      return wrappedToken;
    }
  }

  public async deploy_bft_wrapped_token(
    name: string,
    symbol: string,
    fromToken: Id256
  ): Promise<Address | undefined> {
    try {
      const bridge = await this.get_bft_bridge_contract();
      if (bridge) {
        const contract = new ethers.Contract(
          bridge?.getAddress(),
          BftBridgeABI,
          this.signer
        );
        // let signer = await this.provider.getSigner()
        await contract.deployERC20(name, symbol, fromToken);
        const wrappedAddress = await this.get_wrapped_token_address(fromToken);
        if (wrappedAddress) {
          return new Address(wrappedAddress);
        }
      }
      return undefined;
    } catch (error) {
      console.error("error", error);
    }
  }

  public async burnIcrcToken(
    ApproveArgs: ApproveArgs,
    tokenPrincipal: Principal
  ) {
    const result = await this.Ic.actor<IcrcService>(
      tokenPrincipal.toText(),
      IcrcIDL
    ).icrc2_approve(ApproveArgs);
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
    return result.Ok;
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
      bridge?.getAddress(),
      BftBridgeABI,
      this.signer
    );
    const WrappedTokenContract = new ethers.Contract(
      from_token.getAddress(),
      WrappedTokenABI as AbiItem[],
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
    provider: Web3,
    dstToken: Id256,
    recipient: Id256,
    dstChainId: number,
    amount: number
  ): Promise<TxHash | undefined> {
    const bridgeAddress = await this.get_bft_bridge_contract();
    const bridge = new this.provider.eth.Contract(
      BftBridgeABI as AbiItem[],
      bridgeAddress?.getAddress()
    );
    const WrappedToken = new this.provider.eth.Contract(
      WrappedTokenABI as AbiItem[],
      from_token.getAddress()
    );
    await WrappedToken.methods.approve(BftBridgeABI, amount).send();

    //TODO
    //TODO!
    //TODO: Issue the transaction and send it

    const result = await bridge.methods
      .burn(amount, from_token, recipient, dstToken, dstChainId)
      .on();
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
    const bridge = new this.provider.eth.Contract(
      BftBridgeABI as AbiItem[],
      bridgeAddress?.getAddress()
    );

    //TODO
    //TODO!
    //TODO: Issue the transaction and send it
    //TODO: Issue the transaction and send it

    const result = await bridge.methods
      .burn(recipient, dstToken, dstChainId)
      .send({ amount });

    if (result && result.transactionHash) {
      return result.transactionHash;
    } else {
      throw Error("Transaction not successful");
    }
  }

  async mintOrder(encodedOrder: SignedMintOrder): Promise<TransactionReceipt> {
    const bridge = await this.get_bft_bridge_contract();
    const encodedOrderBytes = Web3.utils.bytesToHex([...encodedOrder]);
    const contract = new this.provider.eth.Contract(
      BftBridgeABI as AbiItem[],
      bridge?.getAddress()
    );
    return await contract.methods.mint(encodedOrderBytes).send();
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
      return this.provider.eth.getTransactionReceipt(txHash);
    } else {
      throw Error("Not found");
    }
  }

  burn_icrc2_tokens: (
    wrapped_token: Address,
    amount: number
  ) => SignedMintOrder;
  check_erc20_balance: (token: Address) => Promise<number>;
  register_bft_bridge_contract: () => Promise<Address>;
  create_bft_bridge_contract: () => Promise<Address>;

  swap_tokens: (
    from_provider,
    to_provider,
    from_token: Id256,
    to_token: Id256,
    amount: number
  ) => Promise<SwapResult>;

  swap_tokens: (
    from_provider,
    to_provider,
    from_token: Id256,
    to_token: Id256,
    amount: number
  ) => Promise<SwapResult>;
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
