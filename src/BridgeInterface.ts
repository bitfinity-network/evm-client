import Web3 from "web3";
import Ic, { IcConnector, MinterIDL, MinterService } from "./ic";
import { WrappedTokenParams, TokenProp } from "./types/bridge";
import BftBridgeABI from "./abi/BftBridge.json";
import {TransactionReceipt} from 'web3-types'

import {
  Address,
  AddressWithChainID,
  Id256Factory,
  Id256,
} from "./types/common";
import { Account, Subaccount, Timestamp, Tokens, TxIndex } from "./ic/idl/icrc/icrc.did";
import { Principal} from "@dfinity/principal";
import {MintReason} from "./ic/idl/minter/minter.did";

export type TxHash = string; 
export type SwapResult = SuccessResult | FailResult;
interface SuccessResult {
  burn_tx_hash: TxHash;
  mint_tx_hash: TxHash;
}
export interface FailResult {
  error: Error;
  burn_tx_hash?: TxHash;
  mint_tx_hash?: TxHash;
}

export interface BridgeInterface {
    //constructor(minterCanister: Principal, Ic: IcConnector):any

    check_erc20_balance: (w3: Web3, token: Address) => Promise<number>
    get_bft_bridge_contract: (w3: Web3) => Promise<Address | undefined>
    register_bft_bridge_contract: (w3: Web3) => Promise<Address>
    create_bft_bridge_contract: (w3: Web3) => Promise<Address>
    get_wrapped_token_address: (w3: Web3, fromToken: Id256) => Promise<Address | undefined>
    swap_tokens: (
        from_w3: Web3, 
        to_w3: Web3, 
        from_token: Id256,
        to_token: Id256, 
        amount: number
    ) => Promise<SwapResult>;
    
    burn_erc_20_tokens: (
        w3: Web3,
        from_token: Address,
        to_token: Id256, 
        recipient: Id256,
        amount: number ) =>Promise<TxHash | undefined>

    burn_native_tokens: (
        w3: Web3,
        to_token: Id256,
        bridge: Address,
        amount: number) => Promise<TxHash | undefined>

    mint_erc_20_tokens: (
        w3: Web3,
        burn_tx_hash: TxHash,
    ) => Promise<TransactionReceipt>

    mint_native_tokens: (
        reason: MintReason,
    ) => Promise<TransactionReceipt>
}