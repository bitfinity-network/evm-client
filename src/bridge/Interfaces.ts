import { Address, Id256, SignedMintOrder } from "../validation";
import { MintReason } from "../ic/idl/minter/minter.did";
import { Principal } from "@dfinity/principal";
import { IcConnector } from "../ic";
import {
  Signer,
  ethers,
  Provider,
  TransactionReceipt,
  TransactionResponse,
} from "ethers";

export type TxHash = string;
export type SwapResult = SuccessResult | FailResult;

export interface NoficationIface {
  about_tx?: string | null;
  receiver_canister?: string;
  user_data?: Uint8Array;
}
interface SuccessResult {
  burn_tx_hash: TxHash;
  mint_tx_hash: TxHash;
}
export interface FailResult {
  error: Error;
  burn_tx_hash?: TxHash;
  mint_tx_hash?: TxHash;
}

export interface EVMBridgeIface {
  swap_evm_tokens: (
    from_token: Id256,
    to_token: Id256,
    amount: number
  ) => Promise<SwapResult>;
}

export interface ICEVMBridgeIface {
  swap_ic_to_evm: (
    from_token: Id256,
    to_token: Id256,
    amount: number
  ) => Promise<SwapResult>;
  swap_evm_to_ic: (
    from_token: Id256,
    to_token: Id256,
    amount: number
  ) => Promise<SwapResult>;
}

export interface chainManagerIface {
  minterCanister: string;
  Ic: IcConnector;
  signer: Signer;
  provider: Provider;

  check_erc20_balance: (token: Address) => Promise<number>;
  get_bft_bridge_contract: () => Promise<Address | undefined>;
  register_bft_bridge_contract: () => Promise<Address>;
  create_bft_bridge_contract: () => Promise<Address>;
  get_wrapped_token_address: (fromToken: Id256) => Promise<Address | undefined>;

  burn_icrc2_tokens: (
    token: Principal,
    amount: number
  ) => Promise<SignedMintOrder>;

  get_chain_id: () => Promise<number>;

  burn_erc_20_tokens: (
    from_token: Address,
    dstToken: Id256,
    amount: number
  ) => Promise<TxHash | undefined>;

  burn_native_tokens: (
    dstToken: Id256,
    recipient: Id256,
    dstChainId: number,
    amount: number
  ) => Promise<TxHash | undefined>;

  mint_erc_20_tokens: (
    burn_tx_hash: TxHash,
    chain_id: number
  ) => Promise<TransactionResponse | undefined>;

  mintOrder: (
    encodedOrder: SignedMintOrder
  ) => Promise<TransactionResponse | undefined>;

  mint_native_tokens: (reason: MintReason) => Promise<TransactionReceipt>;
}
