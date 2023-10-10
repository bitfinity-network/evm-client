import { Address, Id256, SignedMintOrder } from "../validation";
import { Principal } from "@dfinity/principal";
import { IcConnector } from "../ic";
import { Signer, Provider, TransactionResponse, JsonRpcSigner } from "ethers";

export interface IcWithBatchTransactions extends IcConnector {
  batchTransactions: unknown;
}
export interface ChainConfig {
  minterCanister: string;
  Ic: IcConnector;
  signer: JsonRpcSigner | Signer;
  provider: Provider;
  rpcUrl: string;
  icHost: string;
}
export type TxHash = string;
export type SwapResult = SuccessResult | FailResult;

export type QueryFunction<T extends unknown[], R> = (...args: T) => R;

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
    amount: number,
  ) => Promise<SwapResult>;
}
export interface Cache {
  get(key: string): string | undefined;
  set(key: string, value: string): void;
}
export interface ICEVMBridgeIface {
  swap_ic_to_evm: (
    from_token: Id256,
    to_token: Id256,
    amount: number,
  ) => Promise<SwapResult>;
  swap_evm_to_ic: (
    from_token: Id256,
    to_token: Id256,
    amount: number,
  ) => Promise<SwapResult>;
}

export interface chainManagerIface {
  minterCanister: string;
  Ic: IcConnector;
  signer: JsonRpcSigner | Signer;
  provider: Provider;

  check_erc20_balance: (token: Address) => Promise<number>;
  get_bft_bridge_contract: () => Promise<Address | undefined>;
  register_bft_bridge_contract: () => Promise<Address>;
  create_bft_bridge_contract: () => Promise<Address>;
  get_wrapped_token_address: (fromToken: Id256) => Promise<Address | undefined>;

  burn_icrc2_tokens: (
    token: Principal,
    amount: number,
    operation_id: number,
  ) => Promise<SignedMintOrder>;

  get_chain_id: () => Promise<number>;

  burn_erc_20_tokens: (
    from_token: Address,
    amount: number,
    chainId: number,
  ) => Promise<string | undefined>;

  burn_native_tokens: (
    recipient: Id256,
    dstChainId: number,
    amount: number,
  ) => Promise<TxHash | undefined>;

  /*   mint_erc_20_tokens: (
    burn_tx_hash: TxHash,
    chain_id: number,
  ) => Promise<TransactionResponse | undefined>; */

  mintOrder: (
    encodedOrder: SignedMintOrder,
  ) => Promise<TransactionResponse | undefined>;

  /*   mint_native_tokens: (
    reason: MintReason,
  ) => Promise<TransactionReceipt | null>; */
}
