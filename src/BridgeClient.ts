import Web3 from "web3";
import _ ,{ IcConnector, MinterIDL, MinterService } from "./ic";
import BftBridgeABI from "./abi/BftBridge.json";
import WrappedTokenABI from "./abi/WrappedToken.json";
import { isAddress } from "web3-validator";
import { MintReason} from "./ic/idl/minter/minter.did";

import {
  Address,
  Id256,
} from "./types/common";
import { Principal} from "@dfinity/principal";
import { BridgeInterface, SwapResult, TxHash } from "./BridgeInterface";
import {TransactionReceipt} from 'web3-types'
import {AbiItem} from 'web3-utils'

type SignedMintOrder = Uint8Array | number[];

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

  public async createMintOrder(mintReason: MintReason): Promise<SignedMintOrder> {
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

  public async burn_erc_20_tokens(
    w3: Web3,
    from_token: Address,
    dstToken: Id256, 
    recipient: Id256,
    dstChainId: number,
    amount: number): Promise<TxHash| undefined> {
      const bridgeAddress = await this.get_bft_bridge_contract(w3);
      const bridge = new w3.eth.Contract(BftBridgeABI as AbiItem[], bridgeAddress?.getAddress());
      const WrappedToken = new w3.eth.Contract(WrappedTokenABI as AbiItem[], from_token.getAddress());
      await WrappedToken.methods
          .approve(BftBridgeABI, amount)
          .send();

      //TODO
      //TODO!
      //TODO: Issue the transaction and send it

      const result = await bridge.methods
            .burn(amount, from_token, recipient, dstToken, dstChainId)
      if (result && result.transactionHash){
        return result.transactionHash;
      } else {
        throw Error("Transaction not successful")
      }
    }

    public async burn_native_tokens(
      w3: Web3,
      dstToken: Id256, 
      recipient: Id256,
      dstChainId: number,
      amount: number): Promise<TxHash| undefined> {
        const bridgeAddress = await this.get_bft_bridge_contract(w3);
        const bridge = new w3.eth.Contract(BftBridgeABI as AbiItem[], bridgeAddress?.getAddress());
        
      //TODO
      //TODO!
      //TODO: Issue the transaction and send it
        //TODO: Issue the transaction and send it

        const result = await bridge.methods
              .burn(recipient, dstToken, dstChainId)
              .send({amount});

        if (result && result.transactionHash){
          return result.transactionHash;
        } else {
          throw Error("Transaction not successful")
        }
      }

      async mintOrder(w3: Web3, encodedOrder: SignedMintOrder): Promise<TransactionReceipt> {

        const bridge = await this.get_bft_bridge_contract(w3);
        const encodedOrderBytes = Web3.utils.bytesToHex([...encodedOrder]);
        const contract = new w3.eth.Contract(
            BftBridgeABI as AbiItem[],
            bridge?.getAddress()
          );
          const result = await contract.methods
            .mint(encodedOrderBytes)
            .send();
        
            if (result && result.transactionHash){
              return result;
            } else {
              throw Error("Transaction not successful")
            }
      }

    async public mint_erc_20_tokens(
        w3: Web3,
        burn_tx_hash: TxHash,
        burn_chain_id: number
    ): Promise<TransactionReceipt> {

      const reason = {
          Erc20Burn: {
            burn_tx_hash,
            chain_id: burn_chain_id
        }
      };
      const order: SignedMintOrder = await this.createMintOrder(reason);
      return await this.mintOrder(w3, order);
    }

    mint_native_tokens: (
        reason: MintReason,
    ) => Promise<TransactionReceipt>


  register_bft_bridge_contract: (provider) => Promise<Address>
  create_bft_bridge_contract: (provider) => Promise<Address>
    
    swap_tokens: (
        from_provider, 
        to_provider, 
        from_token: Id256,
        to_token: Id256, 
        amount: number
    ) => Promise<SwapResult>
    
    

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
