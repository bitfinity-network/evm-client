import type { Principal } from "@dfinity/principal";
import type { ActorMethod } from "@dfinity/agent";

export interface AccessListItem {
  storageKeys: Array<string>;
  address: string;
}
export interface BasicAccount {
  balance: string;
  nonce: string;
}
export interface Block {
  miner: string;
  totalDifficulty: string;
  receiptsRoot: string;
  stateRoot: string;
  hash: string;
  difficulty: string;
  size: [] | [string];
  uncles: Array<string>;
  baseFeePerGas: [] | [string];
  extraData: string;
  sealFields: Array<string>;
  transactionsRoot: string;
  sha3Uncles: string;
  nonce: string;
  number: string;
  timestamp: string;
  transactions: Array<string>;
  gasLimit: string;
  logsBloom: string;
  parentHash: string;
  gasUsed: string;
  mixHash: string;
}
export type BlockResult =
  | { NoBlockFound: null }
  | { WithHash: Block }
  | { WithTransaction: Block_1 };
export interface Block_1 {
  miner: string;
  totalDifficulty: string;
  receiptsRoot: string;
  stateRoot: string;
  hash: string;
  difficulty: string;
  size: [] | [string];
  uncles: Array<string>;
  baseFeePerGas: [] | [string];
  extraData: string;
  sealFields: Array<string>;
  transactionsRoot: string;
  sha3Uncles: string;
  nonce: string;
  number: string;
  timestamp: string;
  transactions: Array<Transaction>;
  gasLimit: string;
  logsBloom: string;
  parentHash: string;
  gasUsed: string;
  mixHash: string;
}
export interface Duration {
  secs: bigint;
  nanos: number;
}
export interface EvmCanisterInitData {
  permissions: [] | [Array<[Principal, Array<Permission>]>];
  owner: Principal;
  network: string;
  min_gas_price: bigint;
  chain_id: bigint;
  signature_verification_principal: Principal;
  genesis_accounts: Array<[string, [] | [string]]>;
  transaction_processing_interval: [] | [Duration];
  log_settings: [] | [LogSettings];
}
export type EvmError =
  | { Internal: string }
  | { TransactionSignature: string }
  | { StableStorageError: string }
  | { InsufficientBalance: { actual: string; expected: string } }
  | { TransactionPool: TransactionPoolError }
  | { NotAuthorized: null }
  | { AnonymousPrincipal: null }
  | { GasTooLow: { minimum: string } }
  | { BlockDoesNotExist: string }
  | { NoHistoryDataForBlock: string }
  | { InvalidGasPrice: string }
  | { NotProcessableTransactionError: HaltError }
  | { ReservationFailed: string }
  | { FatalEvmExecutorError: ExitFatal };
export interface EvmStats {
  block_number: bigint;
  cycles: bigint;
  chain_id: bigint;
  pending_transactions: Array<Transaction>;
  pending_transactions_count: bigint;
  block_gas_limit: bigint;
  state_root: string;
}
export type ExitFatal =
  | { UnhandledInterrupt: null }
  | { NotSupported: null }
  | { Other: string }
  | { CallErrorAsFatal: HaltError };
export type HaltError =
  | { DesignatedInvalid: null }
  | { OutOfOffset: null }
  | { Continue: null }
  | { CallGasCostMoreThanGasLimit: null }
  | { InvalidChainId: null }
  | { Revert: [] | [string] }
  | { InvalidRange: null }
  | { CreateContractLimit: null }
  | { CallerGasLimitMoreThanBlock: null }
  | { InvalidOpcode: null }
  | { StateChangeDuringStaticCall: null }
  | { CreateEmpty: null }
  | { LackOfFundForGasLimit: null }
  | { InvalidCode: number }
  | { GasPriceLessThanBasefee: null }
  | { InvalidJump: null }
  | { OutOfFund: null }
  | { NonceTooLow: null }
  | { PrecompileError: null }
  | { OpcodeNotFound: null }
  | { NotActivated: null }
  | { PCUnderflow: null }
  | { OverflowPayment: null }
  | { PrevrandaoNotSet: null }
  | { OutOfGas: null }
  | { Other: string }
  | { CallNotAllowedInsideStatic: null }
  | { NonceTooHigh: null }
  | { RejectCallerWithCode: null }
  | { CallTooDeep: null }
  | { NonceOverflow: null }
  | { FatalExternalError: null }
  | { GasMaxFeeGreaterThanPriorityFee: null }
  | { CreateContractWithEF: null }
  | { CreateCollision: null }
  | { StackOverflow: null }
  | { CreateInitcodeSizeLimit: null }
  | { StackUnderflow: null };
export interface HttpRequest {
  url: string;
  method: string;
  body: Uint8Array | number[];
  headers: Array<[string, string]>;
}
export interface HttpResponse {
  body: Uint8Array | number[];
  headers: Array<[string, string]>;
  upgrade: [] | [boolean];
  status_code: number;
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
export type Permission =
  | { ReadLogs: null }
  | { Admin: null }
  | { UpdateLogsConfiguration: null };
export interface PermissionList {
  permissions: Array<Permission>;
}
export type Result = { Ok: PermissionList } | { Err: EvmError };
export type Result_1 = { Ok: null } | { Err: EvmError };
export type Result_2 = { Ok: string } | { Err: EvmError };
export type Result_3 = { Ok: string } | { Err: EvmError };
export type Result_4 = { Ok: BlockResult } | { Err: EvmError };
export type Result_5 = { Ok: bigint } | { Err: EvmError };
export type Result_6 = { Ok: [] | [Transaction] } | { Err: EvmError };
export type Result_7 = { Ok: [] | [TransactionReceipt] } | { Err: EvmError };
export type Result_8 = { Ok: Array<string> } | { Err: EvmError };
export type Result_9 = { Ok: EvmStats } | { Err: EvmError };
export interface Transaction {
  r: string;
  s: string;
  v: string;
  to: [] | [string];
  gas: string;
  maxFeePerGas: [] | [string];
  gasPrice: [] | [string];
  value: string;
  blockNumber: [] | [string];
  from: string;
  hash: string;
  blockHash: [] | [string];
  type: [] | [string];
  accessList: [] | [Array<AccessListItem>];
  transactionIndex: [] | [string];
  nonce: string;
  maxPriorityFeePerGas: [] | [string];
  input: string;
  chainId: [] | [string];
}
export type TransactionPoolError =
  | {
      InvalidNonce: { actual: string; expected: string };
    }
  | { TransactionAlreadyExists: null }
  | { TxReplacementUnderpriced: null }
  | { TooManyTransactions: null };
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
export interface _SERVICE {
  account_basic: ActorMethod<[string], BasicAccount>;
  admin_ic_permissions_add: ActorMethod<[Principal, Array<Permission>], Result>;
  admin_ic_permissions_get: ActorMethod<[Principal], Result>;
  admin_ic_permissions_remove: ActorMethod<
    [Principal, Array<Permission>],
    Result
  >;
  admin_set_block_gas_limit: ActorMethod<[bigint], Result_1>;
  admin_set_blockchain_history_size: ActorMethod<[bigint], Result_1>;
  admin_set_evm_state_history_size: ActorMethod<[bigint], Result_1>;
  admin_set_min_gas_price: ActorMethod<[string], Result_1>;
  eth_accounts: ActorMethod<[], Array<string>>;
  eth_block_number: ActorMethod<[], bigint>;
  eth_call: ActorMethod<
    [
      [] | [string],
      [] | [string],
      [] | [string],
      bigint,
      [] | [string],
      [] | [string],
    ],
    Result_2
  >;
  eth_chain_id: ActorMethod<[], bigint>;
  eth_estimate_gas: ActorMethod<
    [string, [] | [string], bigint, string, string],
    Result_3
  >;
  eth_get_balance: ActorMethod<[string, string], Result_3>;
  eth_get_block_by_hash: ActorMethod<[string, boolean], Result_4>;
  eth_get_block_by_number: ActorMethod<[string, boolean], Result_4>;
  eth_get_block_transaction_count_by_block_number: ActorMethod<
    [string],
    Result_5
  >;
  eth_get_block_transaction_count_by_hash: ActorMethod<[string], bigint>;
  eth_get_block_transaction_count_by_number: ActorMethod<[string], Result_5>;
  eth_get_code: ActorMethod<[string, string], Result_3>;
  eth_get_storage_at: ActorMethod<[string, string, string], Result_3>;
  eth_get_transaction_by_block_hash_and_index: ActorMethod<
    [string, bigint],
    [] | [Transaction]
  >;
  eth_get_transaction_by_block_number_and_index: ActorMethod<
    [string, bigint],
    Result_6
  >;
  eth_get_transaction_by_hash: ActorMethod<[string], [] | [Transaction]>;
  eth_get_transaction_count: ActorMethod<[string, string], Result_3>;
  eth_get_transaction_receipt: ActorMethod<[string], Result_7>;
  eth_hashrate: ActorMethod<[], bigint>;
  eth_mining: ActorMethod<[], boolean>;
  eth_protocol_version: ActorMethod<[], bigint>;
  eth_syncing: ActorMethod<[], boolean>;
  get_block_gas_limit: ActorMethod<[], bigint>;
  get_blockchain_state_history_size: ActorMethod<[], bigint>;
  get_curr_metrics: ActorMethod<[], MetricsData>;
  get_evm_state_history_size: ActorMethod<[], bigint>;
  get_metrics: ActorMethod<[], MetricsStorage>;
  get_min_gas_price: ActorMethod<[], string>;
  http_request: ActorMethod<[HttpRequest], HttpResponse>;
  http_request_update: ActorMethod<[HttpRequest], HttpResponse>;
  ic_logs: ActorMethod<[bigint], Result_8>;
  ic_stats: ActorMethod<[], Result_9>;
  is_address_reserved: ActorMethod<[Principal, string], boolean>;
  mint_native_tokens: ActorMethod<[string, string], Result_3>;
  net_listening: ActorMethod<[], boolean>;
  net_peer_count: ActorMethod<[], bigint>;
  net_version: ActorMethod<[], bigint>;
  reserve_address: ActorMethod<[Principal, string], Result_1>;
  send_raw_transaction: ActorMethod<[Transaction], Result_3>;
  set_logger_filter: ActorMethod<[string], Result_1>;
  web3_client_version: ActorMethod<[], string>;
  web3_sha3: ActorMethod<[string], Result_3>;
}

type T0 = Parameters<IDL.InterfaceFactory>;
export function idlFactory({ IDL }: T0[0]): ReturnType<IDL.InterfaceFactory>;
