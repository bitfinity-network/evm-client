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
  | { Internal: string }
  | { InvalidNonce: { got: bigint; minimum: bigint } }
  | { Icrc2ApproveError: ApproveError }
  | { BftBridgeAlreadyRegistered: string }
  | { Icrc2TransferFromError: TransferFromError }
  | { NotAuthorized: null }
  | { AnonymousPrincipal: null }
  | { BftBridgeDoesNotExist: null }
  | { JsonRpcCallFailed: string }
  | { InsufficientOperationPoints: { got: number; expected: number } }
  | { InvalidBftBridgeContract: null }
  | { InvalidBurnOperation: string };
export interface Icrc2Burn {
  recipient_chain_id: number;
  operation_id: number;
  from_subaccount: [] | [Uint8Array | number[]];
  icrc2_token_principal: Principal;
  recipient_address: string;
  amount: string;
}
export interface InitData {
  evm_chain_id: number;
  evm_gas_price: string;
  evm_principal: Principal;
  signing_strategy: SigningStrategy;
  owner: Principal;
  spender_principal: Principal;
  iceth_principal: Principal;
  bft_bridge_contract: [] | [string];
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
export interface OperationPricing {
  erc20_mint: number;
  evm_registration: number;
  evmc_notification: number;
  endpoint_query: number;
  icrc_mint_approval: number;
  icrc_transfer: number;
}
export type Result = { Ok: bigint } | { Err: Error };
export type Result_1 = { Ok: Uint8Array | number[] } | { Err: Error };
export type Result_2 = { Ok: [] | [string] } | { Err: Error };
export type Result_3 = { Ok: string } | { Err: Error };
export type Result_4 = { Ok: Array<string> } | { Err: Error };
export type Result_5 = { Ok: null } | { Err: Error };
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
  approve_icrc2_mint: ActorMethod<[string, number], Result>;
  create_erc_20_mint_order: ActorMethod<[Icrc2Burn], Result_1>;
  get_bft_bridge_contract: ActorMethod<[], Result_2>;
  get_curr_metrics: ActorMethod<[], MetricsData>;
  get_evm_principal: ActorMethod<[], Principal>;
  get_metrics: ActorMethod<[], MetricsStorage>;
  get_minter_canister_evm_address: ActorMethod<[], Result_3>;
  get_operation_pricing: ActorMethod<[], OperationPricing>;
  get_owner: ActorMethod<[], Principal>;
  get_user_operation_points: ActorMethod<[[] | [Principal]], number>;
  ic_logs: ActorMethod<[bigint], Result_4>;
  list_mint_orders: ActorMethod<
    [Uint8Array | number[], Uint8Array | number[]],
    Array<[number, Uint8Array | number[]]>
  >;
  minter_eth_address: ActorMethod<[], Result_3>;
  on_evm_transaction_notification: ActorMethod<
    [[] | [TransactionReceipt], Uint8Array | number[]],
    [] | [null]
  >;
  register_evmc_bft_bridge: ActorMethod<[string], Result_5>;
  set_evm_principal: ActorMethod<[Principal], Result_5>;
  set_logger_filter: ActorMethod<[string], Result_5>;
  set_operation_pricing: ActorMethod<[OperationPricing], Result_5>;
  set_owner: ActorMethod<[Principal], Result_5>;
  transfer_icrc2: ActorMethod<
    [number, string, Principal, Principal, bigint],
    Result
  >;
}

type T0 = Parameters<IDL.InterfaceFactory>;
export function idlFactory({ IDL }: T0[0]): ReturnType<IDL.InterfaceFactory>;
