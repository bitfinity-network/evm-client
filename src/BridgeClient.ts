import Web3 from "web3";
import _ ,{ IcConnector, MinterIDL, MinterService } from "./ic";
import { WrappedTokenParams, TokenProp } from "./types/bridge";
import BftBridgeABI from "./abi/BftBridge.json";
import {
  Address,
  AddressWithChainID,
  Id256Factory,
  Id256,
} from "./types/common";
import { Account, Subaccount, Timestamp, Tokens } from "./ic/idl/icrc/icrc.did";
import { Principal} from "@dfinity/principal";
import { BridgeInterface, SwapResult, TxHash } from "./BridgeInterface";
import {TransactionReceipt} from 'web3-types'
import {MintReason} from "./ic/idl/minter/minter.did";
import {AbiItem} from 'web3-utils'

export class Bridge implements BridgeInterface {

  private minterCanister: Principal;
  private Ic: IcConnector; 

  constructor(minterCanister: Principal, Ic: IcConnector){
    this.minterCanister = minterCanister;
    this.Ic = Ic 
  }

  check_erc20_balance: (w3: Web3, token: Address) => Promise<number>
  
  public async get_bft_bridge_contract(w3: Web3): Promise<Address | undefined> {
      const chainId = Number(await w3.eth.getChainId());
      const result = await this.Ic.actor<MinterService>(
        this.minterCanister,
        MinterIDL
      ).get_bft_bridge_contract([chainId]);
      if (result.length) {
        return new Address(result[0]);
      }
      return undefined;
  }

  public async get_wrapped_token_address(
    w3: Web3,
    fromToken: Id256): Promise<Address | undefined> {

    const bridge = await this.get_bft_bridge_contract(w3);
    const contract = new w3.eth.Contract(BftBridgeABI as AbiItem[], bridge?.getAddress());
    const wrappedToken = 
      await contract.methods
      .getWrappedToken(fromToken)
      .call();
  
    if (new Address(wrappedToken).isZero()) {
      return undefined;
    }
    return wrappedToken;
  }

  public async deploy_bft_wrapped_token(
    w3: Web3,   
    name: string,
    symbol: string,
    fromToken: Id256,
  ): Promise<Address | undefined> {

      const bridge = await this.get_bft_bridge_contract(w3);
      const contract = new w3.eth.Contract(BftBridgeABI as AbiItem[], bridge?.getAddress());
      const result = await contract.methods
          .deployERC20(name, symbol, fromToken)
      const WrappedTokenAddress =
          result.events.NewWrappedToken.returnValues.wrappedAddress;
        if (WrappedTokenAddress) {
          return new Address(WrappedTokenAddress);
        }
        return undefined;
  }


  register_bft_bridge_contract: (provider) => Promise<Address>
  create_bft_bridge_contract: (provider) => Promise<Address>
    
    swap_tokens: (
        from_provider, 
        to_provider, 
        from_token: Id256,
        to_token: Id256, 
        amount: number
    ) => Promise<SwapResult>
    
    async burn_erc_20_tokens: (
        w3: Web3,
        from_token: Address,
        to_token: Id256, 
        recipient: Id256,
        amount: number ): Promise<TxHash | undefined> {
          return undefined;
        }

    burn_native_tokens: (
        provider,
        to_token: Id256,
        bridge: Address,
        amount: number) => Promise<TxHash | undefined>

    mint_erc_20_tokens: (
        provider,
        burn_tx_hash: TxHash,
    ) => Promise<TransactionReceipt>

    mint_native_tokens: (
        reason: MintReason,
    ) => Promise<TransactionReceipt>
}








  
  public async burnWrappedToken(
    provider,
    fromToken: Address,
    recipient: AddressWithChainID | Principal,
    wrappedToken:AddressWithChainID | Principal,  // 
    amount: number, // lowest denomination
    bftBridge: Address,
  ): Promise<string | undefined> {
    try {
      const wrappedTokenID = Id256Factory.from(wrappedToken);
      if (externalToken) {
        const contract = provider(BftBridgeABI, bftBridge);
        await contract.methods
          .approve(BftBridgeABI, amountInWei)
          .send();
        const result = await contract.methods
          .burn(amountInWei, token)
        if (result && result.transactionHash) return result.transactionHash;
      }
      return undefined;
    } catch (error) {
      throw new Error(error);
    }
  }

  public async transferIcrcTokens(icProvider, {fee = [], memo = [], fromSubaccount = [], createdAtTime =[], amount, expectedAllowance, expiresAt, spender}: transferIcrcTokensParams) {
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
  } 

  //async deployERC20
}
