import type { Principal } from "@dfinity/principal";
import type { ActorMethod } from "@dfinity/agent";

export type ApproveError =
  | {
      GenericError: { message: string; error_code: bigint };
    }
  | { TemporarilyUnavailable: null }
  | { Duplicate: { duplicate_of: bigint } }
  | { BadFee: { expected_fee: bigint } }
  | { AllowanceChanged: { current_allowance: bigint } }
  | { CreatedInFuture: { ledger_time: bigint } }
  | { TooOld: null }
  | { Expired: { ledger_time: bigint } }
  | { InsufficientFunds: { balance: bigint } };
export interface Duration {
  secs: bigint;
  nanos: number;
}
export type Error =
  | { CallFailed: [RejectionCode, string] }
  | { JsonRpcFailure: string }
  | { IcethError: IcethError }
  | { SerializationError: string };
export type Error_1 =
  | { Internal: string }
  | { InvalidNonce: { got: bigint; minimum: bigint } }
  | { InvalidBurnTransaction: string }
  | { EvmAlreadyRegistered: string }
  | { Icrc2ApproveError: ApproveError }
  | { UnknownExternalEvm: number }
  | { Icrc2TransferFromError: TransferFromError }
  | { NotAuthorized: null }
  | { AnonymousPrincipal: null }
  | { BftBridgeDoesNotExist: null }
  | { JsonRpcCallFailed: string }
  | { InsufficientOperationPoints: { got: number; expected: number } }
  | { EvmNotFound: number }
  | { InvalidBftBridgeContract: null }
  | { ExternalEvmError: Error };
export type IcethError =
  | { ServiceUrlHostNotAllowed: null }
  | { HttpRequestError: { code: number; message: string } }
  | { TooFewCycles: string }
  | { ServiceUrlParseError: null }
  | { ServiceUrlHostMissing: null }
  | { ProviderNotFound: null }
  | { NoPermission: null };
export interface InitData {
  evm_chain_id: number;
  evm_gas_price: string;
  evm_principal: Principal;
  signing_strategy: SigningStrategy;
  owner: Principal;
  spender_principal: Principal;
  iceth_principal: Principal;
  log_settings: [] | [LogSettings];
  process_transactions_results_interval: [] | [Duration];
}
export type Interval =
  | { PerHour: null }
  | { PerWeek: null }
  | { PerDay: null }
  | { Period: { seconds: bigint } }
  | { PerMinute: null };
export interface LogSettings {
  log_filter: [] | [string];
  in_memory_records: [] | [bigint];
  enable_console: boolean;
}
export interface MetricsData {
  stable_memory_size: bigint;
  cycles: bigint;
  heap_memory_size: bigint;
}
export interface MetricsMap {
  map: Array<[bigint, MetricsData]>;
  interval: Interval;
  history_length_nanos: bigint;
}
export interface MetricsStorage {
  metrics: MetricsMap;
}
export type MintReason =
  | {
      Erc20Burn: { burn_tx_hash: string; chain_id: number };
    }
  | {
      Icrc2Burn: {
        recipient_chain_id: number;
        icrc1_token_principal: Principal;
        operation_id: number;
        from_subaccount: [] | [Uint8Array | number[]];
        recipient_address: string;
        amount: string;
      };
    };
export interface OperationPricing {
  erc20_mint: number;
  evm_registration: number;
  evmc_notification: number;
  icrc_mint_approval: number;
  icrc_transfer: number;
}
export type RejectionCode =
  | { NoError: null }
  | { CanisterError: null }
  | { SysTransient: null }
  | { DestinationInvalid: null }
  | { Unknown: null }
  | { SysFatal: null }
  | { CanisterReject: null };
export type Result = { Ok: bigint } | { Err: Error_1 };
export type Result_1 = { Ok: Uint8Array | number[] } | { Err: Error_1 };
export type Result_2 = { Ok: string } | { Err: Error_1 };
export type Result_3 = { Ok: Array<string> } | { Err: Error_1 };
export type Result_4 = { Ok: null } | { Err: Error_1 };
export type SigningKeyId =
  | { Dfx: null }
  | { Production: null }
  | { Test: null };
export type SigningStrategy =
  | {
      Local: { private_key: Uint8Array | number[] };
    }
  | { ManagementCanister: { key_id: SigningKeyId } };
export interface TransactionReceipt {
  to: [] | [string];
  status: [] | [string];
  output: [] | [Uint8Array | number[]];
  transactionHash: string;
  cumulativeGasUsed: string;
  blockNumber: string;
  from: string;
  logs: Array<TransactionReceiptLog>;
  blockHash: string;
  root: [] | [string];
  type: [] | [string];
  transactionIndex: string;
  effectiveGasPrice: [] | [string];
  logsBloom: string;
  contractAddress: [] | [string];
  gasUsed: [] | [string];
}
export interface TransactionReceiptLog {
  transactionHash: string;
  blockNumber: string;
  data: string;
  blockHash: string;
  transactionIndex: string;
  topics: Array<string>;
  address: string;
  logIndex: string;
  removed: boolean;
}
export type TransferFromError =
  | {
      GenericError: { message: string; error_code: bigint };
    }
  | { TemporarilyUnavailable: null }
  | { InsufficientAllowance: { allowance: bigint } }
  | { BadBurn: { min_burn_amount: bigint } }
  | { Duplicate: { duplicate_of: bigint } }
  | { BadFee: { expected_fee: bigint } }
  | { CreatedInFuture: { ledger_time: bigint } }
  | { TooOld: null }
  | { InsufficientFunds: { balance: bigint } };
export interface _SERVICE {
  approve_icrc2_mint: ActorMethod<[number, string], Result>;
  create_erc_20_mint_order: ActorMethod<[MintReason], Result_1>;
  get_bft_bridge_contract: ActorMethod<[[] | [number]], [] | [string]>;
  get_curr_metrics: ActorMethod<[], MetricsData>;
  get_evm_principal: ActorMethod<[], Principal>;
  get_metrics: ActorMethod<[], MetricsStorage>;
  get_minter_canister_evm_address: ActorMethod<[], Result_2>;
  get_operation_pricing: ActorMethod<[], OperationPricing>;
  get_owner: ActorMethod<[], Principal>;
  get_user_operation_points: ActorMethod<[[] | [Principal]], number>;
  ic_logs: ActorMethod<[bigint], Result_3>;
  list_mint_orders: ActorMethod<
    [Uint8Array | number[], Uint8Array | number[]],
    Array<[number, Uint8Array | number[]]>
  >;
  mint_native_token: ActorMethod<[MintReason], Result_2>;
  minter_eth_address: ActorMethod<[], Result_2>;
  on_evm_transaction_notification: ActorMethod<
    [[] | [TransactionReceipt], Uint8Array | number[]],
    [] | [null]
  >;
  register_evm_bft_bridge: ActorMethod<[string], Result_4>;
  register_external_evm: ActorMethod<[string, string], Result_4>;
  set_evm_principal: ActorMethod<[Principal], Result_4>;
  set_logger_filter: ActorMethod<[string], Result_4>;
  set_operation_pricing: ActorMethod<[OperationPricing], Result_4>;
  set_owner: ActorMethod<[Principal], Result_4>;
  transfer_icrc2: ActorMethod<[number, string, bigint], Result>;
}

type T0 = Parameters<IDL.InterfaceFactory>;
export function idlFactory({ IDL }: T0[0]): ReturnType<IDL.InterfaceFactory>;
