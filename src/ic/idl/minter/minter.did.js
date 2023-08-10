export const idlFactory = ({ IDL }) => {
  const ApproveError = IDL.Variant({
    'GenericError' : IDL.Record({
      'message' : IDL.Text,
      'error_code' : IDL.Nat,
    }),
    'TemporarilyUnavailable' : IDL.Null,
    'Duplicate' : IDL.Record({ 'duplicate_of' : IDL.Nat }),
    'BadFee' : IDL.Record({ 'expected_fee' : IDL.Nat }),
    'AllowanceChanged' : IDL.Record({ 'current_allowance' : IDL.Nat }),
    'CreatedInFuture' : IDL.Record({ 'ledger_time' : IDL.Nat64 }),
    'TooOld' : IDL.Null,
    'Expired' : IDL.Record({ 'ledger_time' : IDL.Nat64 }),
    'InsufficientFunds' : IDL.Record({ 'balance' : IDL.Nat }),
  });
  const TransferFromError = IDL.Variant({
    'GenericError' : IDL.Record({
      'message' : IDL.Text,
      'error_code' : IDL.Nat,
    }),
    'TemporarilyUnavailable' : IDL.Null,
    'InsufficientAllowance' : IDL.Record({ 'allowance' : IDL.Nat }),
    'BadBurn' : IDL.Record({ 'min_burn_amount' : IDL.Nat }),
    'Duplicate' : IDL.Record({ 'duplicate_of' : IDL.Nat }),
    'BadFee' : IDL.Record({ 'expected_fee' : IDL.Nat }),
    'CreatedInFuture' : IDL.Record({ 'ledger_time' : IDL.Nat64 }),
    'TooOld' : IDL.Null,
    'InsufficientFunds' : IDL.Record({ 'balance' : IDL.Nat }),
  });
  const RejectionCode = IDL.Variant({
    'NoError' : IDL.Null,
    'CanisterError' : IDL.Null,
    'SysTransient' : IDL.Null,
    'DestinationInvalid' : IDL.Null,
    'Unknown' : IDL.Null,
    'SysFatal' : IDL.Null,
    'CanisterReject' : IDL.Null,
  });
  const IcethError = IDL.Variant({
    'ServiceUrlHostNotAllowed' : IDL.Null,
    'HttpRequestError' : IDL.Record({
      'code' : IDL.Nat32,
      'message' : IDL.Text,
    }),
    'TooFewCycles' : IDL.Text,
    'ServiceUrlParseError' : IDL.Null,
    'ServiceUrlHostMissing' : IDL.Null,
    'ProviderNotFound' : IDL.Null,
    'NoPermission' : IDL.Null,
  });
  const Error = IDL.Variant({
    'CallFailed' : IDL.Tuple(RejectionCode, IDL.Text),
    'JsonRpcFailure' : IDL.Text,
    'IcethError' : IcethError,
    'SerializationError' : IDL.Text,
  });
  const Error_1 = IDL.Variant({
    'Internal' : IDL.Text,
    'InvalidNonce' : IDL.Record({ 'got' : IDL.Nat64, 'minimum' : IDL.Nat64 }),
    'InvalidBurnTransaction' : IDL.Text,
    'EvmAlreadyRegistered' : IDL.Text,
    'Icrc2ApproveError' : ApproveError,
    'UnknownExternalEvm' : IDL.Nat32,
    'Icrc2TransferFromError' : TransferFromError,
    'NotAuthorized' : IDL.Null,
    'AnonymousPrincipal' : IDL.Null,
    'BftBridgeDoesNotExist' : IDL.Null,
    'JsonRpcCallFailed' : IDL.Text,
    'InsufficientOperationPoints' : IDL.Record({
      'got' : IDL.Nat32,
      'expected' : IDL.Nat32,
    }),
    'EvmNotFound' : IDL.Nat32,
    'InvalidBftBridgeContract' : IDL.Null,
    'ExternalEvmError' : Error,
  });
  const Result = IDL.Variant({ 'Ok' : IDL.Nat, 'Err' : Error_1 });
  const MintReason = IDL.Variant({
    'Erc20Burn' : IDL.Record({
      'burn_tx_hash' : IDL.Text,
      'chain_id' : IDL.Nat32,
    }),
    'Icrc1Burn' : IDL.Record({
      'recipient_chain_id' : IDL.Nat32,
      'icrc1_token_principal' : IDL.Principal,
      'recipient_token_address' : IDL.Text,
      'from_subaccount' : IDL.Opt(IDL.Vec(IDL.Nat8)),
      'recipient_address' : IDL.Text,
      'amount' : IDL.Text,
    }),
  });
  const Result_1 = IDL.Variant({ 'Ok' : IDL.Vec(IDL.Nat8), 'Err' : Error_1 });
  const MetricsData = IDL.Record({
    'stable_memory_size' : IDL.Nat64,
    'cycles' : IDL.Nat64,
    'heap_memory_size' : IDL.Nat64,
  });
  const IcrcTransferParams = IDL.Record({
    'token' : IDL.Principal,
    'recipient' : IDL.Principal,
  });
  const Interval = IDL.Variant({
    'PerHour' : IDL.Null,
    'PerWeek' : IDL.Null,
    'PerDay' : IDL.Null,
    'Period' : IDL.Record({ 'seconds' : IDL.Nat64 }),
    'PerMinute' : IDL.Null,
  });
  const MetricsMap = IDL.Record({
    'map' : IDL.Vec(IDL.Tuple(IDL.Nat64, MetricsData)),
    'interval' : Interval,
    'history_length_nanos' : IDL.Nat64,
  });
  const MetricsStorage = IDL.Record({ 'metrics' : MetricsMap });
  const Result_2 = IDL.Variant({ 'Ok' : IDL.Text, 'Err' : Error_1 });
  const OperationPricing = IDL.Record({
    'erc20_mint' : IDL.Nat32,
    'evm_registration' : IDL.Nat32,
    'evmc_notification' : IDL.Nat32,
    'icrc_mint' : IDL.Nat32,
  });
  const Result_3 = IDL.Variant({ 'Ok' : IDL.Vec(IDL.Text), 'Err' : Error_1 });
  const TransactionReceiptLog = IDL.Record({
    'transactionHash' : IDL.Text,
    'blockNumber' : IDL.Text,
    'data' : IDL.Text,
    'blockHash' : IDL.Text,
    'transactionIndex' : IDL.Text,
    'topics' : IDL.Vec(IDL.Text),
    'address' : IDL.Text,
    'logIndex' : IDL.Text,
    'removed' : IDL.Bool,
  });
  const TransactionReceipt = IDL.Record({
    'to' : IDL.Opt(IDL.Text),
    'status' : IDL.Opt(IDL.Text),
    'output' : IDL.Opt(IDL.Vec(IDL.Nat8)),
    'transactionHash' : IDL.Text,
    'cumulativeGasUsed' : IDL.Text,
    'blockNumber' : IDL.Text,
    'from' : IDL.Text,
    'logs' : IDL.Vec(TransactionReceiptLog),
    'blockHash' : IDL.Text,
    'root' : IDL.Opt(IDL.Text),
    'type' : IDL.Opt(IDL.Text),
    'transactionIndex' : IDL.Text,
    'effectiveGasPrice' : IDL.Opt(IDL.Text),
    'logsBloom' : IDL.Text,
    'contractAddress' : IDL.Opt(IDL.Text),
    'gasUsed' : IDL.Opt(IDL.Text),
  });
  const Result_4 = IDL.Variant({ 'Ok' : IDL.Null, 'Err' : Error_1 });
  return IDL.Service({
    'approve_icrc_mint' : IDL.Func([IDL.Nat32, IDL.Text], [Result], []),
    'create_erc_20_mint_order' : IDL.Func([MintReason], [Result_1], []),
    'get_bft_bridge_contract' : IDL.Func(
        [IDL.Opt(IDL.Nat32)],
        [IDL.Opt(IDL.Text)],
        ['query'],
      ),
    'get_curr_metrics' : IDL.Func([], [MetricsData], ['query']),
    'get_evm_principal' : IDL.Func([], [IDL.Principal], ['query']),
    'get_icrc_transfer_params' : IDL.Func(
        [IDL.Nat32, IDL.Text],
        [IDL.Opt(IcrcTransferParams)],
        [],
      ),
    'get_metrics' : IDL.Func([], [MetricsStorage], ['query']),
    'get_mint_orders' : IDL.Func(
        [IDL.Vec(IDL.Nat8), IDL.Vec(IDL.Nat8)],
        [IDL.Vec(IDL.Tuple(IDL.Nat32, IDL.Vec(IDL.Nat8)))],
        ['query'],
      ),
    'get_minter_canister_evm_address' : IDL.Func([], [Result_2], ['query']),
    'get_operation_pricing' : IDL.Func([], [OperationPricing], ['query']),
    'get_owner' : IDL.Func([], [IDL.Principal], ['query']),
    'get_user_operation_points' : IDL.Func(
        [IDL.Opt(IDL.Principal)],
        [IDL.Nat32],
        ['query'],
      ),
    'ic_logs' : IDL.Func([IDL.Nat64], [Result_3], []),
    'mint_native_token' : IDL.Func([MintReason], [Result_2], []),
    'minter_eth_address' : IDL.Func([], [Result_2], []),
    'on_evm_transaction_notification' : IDL.Func(
        [IDL.Opt(TransactionReceipt), IDL.Vec(IDL.Nat8)],
        [IDL.Opt(IDL.Null)],
        [],
      ),
    'register_evm_bft_bridge' : IDL.Func([IDL.Text], [Result_4], []),
    'register_external_evm' : IDL.Func([IDL.Text, IDL.Text], [Result_4], []),
    'set_evm_principal' : IDL.Func([IDL.Principal], [Result_4], []),
    'set_logger_filter' : IDL.Func([IDL.Text], [Result_4], []),
    'set_operation_pricing' : IDL.Func([OperationPricing], [Result_4], []),
    'set_owner' : IDL.Func([IDL.Principal], [Result_4], []),
  });
};
export const init = ({ IDL }) => { return []; };
