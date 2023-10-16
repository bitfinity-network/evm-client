export const idlFactory = ({ IDL }) => {
  const Icrc2Burn = IDL.Record({
    'operation_id': IDL.Nat32,
    'from_subaccount': IDL.Opt(IDL.Vec(IDL.Nat8)),
    'icrc2_token_principal': IDL.Principal,
    'recipient_address': IDL.Text,
    'amount': IDL.Text,
  });
  const ApproveError = IDL.Variant({
    'GenericError': IDL.Record({
      'message': IDL.Text,
      'error_code': IDL.Nat,
    }),
    'TemporarilyUnavailable': IDL.Null,
    'Duplicate': IDL.Record({ 'duplicate_of': IDL.Nat }),
    'BadFee': IDL.Record({ 'expected_fee': IDL.Nat }),
    'AllowanceChanged': IDL.Record({ 'current_allowance': IDL.Nat }),
    'CreatedInFuture': IDL.Record({ 'ledger_time': IDL.Nat64 }),
    'TooOld': IDL.Null,
    'Expired': IDL.Record({ 'ledger_time': IDL.Nat64 }),
    'InsufficientFunds': IDL.Record({ 'balance': IDL.Nat }),
  });
  const TransferFromError = IDL.Variant({
    'GenericError': IDL.Record({
      'message': IDL.Text,
      'error_code': IDL.Nat,
    }),
    'TemporarilyUnavailable': IDL.Null,
    'InsufficientAllowance': IDL.Record({ 'allowance': IDL.Nat }),
    'BadBurn': IDL.Record({ 'min_burn_amount': IDL.Nat }),
    'Duplicate': IDL.Record({ 'duplicate_of': IDL.Nat }),
    'BadFee': IDL.Record({ 'expected_fee': IDL.Nat }),
    'CreatedInFuture': IDL.Record({ 'ledger_time': IDL.Nat64 }),
    'TooOld': IDL.Null,
    'InsufficientFunds': IDL.Record({ 'balance': IDL.Nat }),
  });
  const Error = IDL.Variant({
    'Internal': IDL.Text,
    'InvalidNonce': IDL.Record({ 'got': IDL.Nat64, 'minimum': IDL.Nat64 }),
    'Icrc2ApproveError': ApproveError,
    'InvalidTokenAddress': IDL.Null,
    'BftBridgeAlreadyRegistered': IDL.Text,
    'Icrc2TransferFromError': TransferFromError,
    'NotAuthorized': IDL.Null,
    'AnonymousPrincipal': IDL.Null,
    'BftBridgeDoesNotExist': IDL.Null,
    'JsonRpcCallFailed': IDL.Text,
    'InsufficientOperationPoints': IDL.Record({
      'got': IDL.Nat32,
      'expected': IDL.Nat32,
    }),
    'InvalidBftBridgeContract': IDL.Null,
    'InvalidBurnOperation': IDL.Text,
  });
  const Result = IDL.Variant({ 'Ok': IDL.Vec(IDL.Nat8), 'Err': Error });
  const Result_1 = IDL.Variant({ 'Ok': IDL.Nat, 'Err': Error });
  const Result_2 = IDL.Variant({ 'Ok': IDL.Opt(IDL.Text), 'Err': Error });
  const MetricsData = IDL.Record({
    'stable_memory_size': IDL.Nat64,
    'cycles': IDL.Nat64,
    'heap_memory_size': IDL.Nat64,
  });
  const Interval = IDL.Variant({
    'PerHour': IDL.Null,
    'PerWeek': IDL.Null,
    'PerDay': IDL.Null,
    'Period': IDL.Record({ 'seconds': IDL.Nat64 }),
    'PerMinute': IDL.Null,
  });
  const MetricsMap = IDL.Record({
    'map': IDL.Vec(IDL.Tuple(IDL.Nat64, MetricsData)),
    'interval': Interval,
    'history_length_nanos': IDL.Nat64,
  });
  const MetricsStorage = IDL.Record({ 'metrics': MetricsMap });
  const Result_3 = IDL.Variant({ 'Ok': IDL.Text, 'Err': Error });
  const OperationPricing = IDL.Record({
    'erc20_mint': IDL.Nat32,
    'evm_registration': IDL.Nat32,
    'evmc_notification': IDL.Nat32,
    'endpoint_query': IDL.Nat32,
    'icrc_mint_approval': IDL.Nat32,
    'icrc_transfer': IDL.Nat32,
  });
  const Result_4 = IDL.Variant({ 'Ok': IDL.Vec(IDL.Text), 'Err': Error });
  const TransactionReceiptLog = IDL.Record({
    'transactionHash': IDL.Text,
    'blockNumber': IDL.Text,
    'data': IDL.Text,
    'blockHash': IDL.Text,
    'transactionIndex': IDL.Text,
    'topics': IDL.Vec(IDL.Text),
    'address': IDL.Text,
    'logIndex': IDL.Text,
    'removed': IDL.Bool,
  });
  const TransactionReceipt = IDL.Record({
    'to': IDL.Opt(IDL.Text),
    'status': IDL.Opt(IDL.Text),
    'output': IDL.Opt(IDL.Vec(IDL.Nat8)),
    'transactionHash': IDL.Text,
    'cumulativeGasUsed': IDL.Text,
    'blockNumber': IDL.Text,
    'from': IDL.Text,
    'logs': IDL.Vec(TransactionReceiptLog),
    'blockHash': IDL.Text,
    'root': IDL.Opt(IDL.Text),
    'type': IDL.Opt(IDL.Text),
    'transactionIndex': IDL.Text,
    'effectiveGasPrice': IDL.Opt(IDL.Text),
    'logsBloom': IDL.Text,
    'contractAddress': IDL.Opt(IDL.Text),
    'gasUsed': IDL.Opt(IDL.Text),
  });
  const Result_5 = IDL.Variant({ 'Ok': IDL.Null, 'Err': Error });
  return IDL.Service({
    'create_erc_20_mint_order': IDL.Func([Icrc2Burn], [Result], []),
    'finish_icrc2_mint': IDL.Func(
      [IDL.Nat32, IDL.Text, IDL.Principal, IDL.Principal, IDL.Nat],
      [Result_1],
      [],
    ),
    'get_bft_bridge_contract': IDL.Func([], [Result_2], []),
    'get_curr_metrics': IDL.Func([], [MetricsData], ['query']),
    'get_evm_principal': IDL.Func([], [IDL.Principal], ['query']),
    'get_metrics': IDL.Func([], [MetricsStorage], ['query']),
    'get_minter_canister_evm_address': IDL.Func([], [Result_3], []),
    'get_operation_pricing': IDL.Func([], [OperationPricing], ['query']),
    'get_owner': IDL.Func([], [IDL.Principal], ['query']),
    'get_user_operation_points': IDL.Func(
      [IDL.Opt(IDL.Principal)],
      [IDL.Nat32],
      ['query'],
    ),
    'ic_logs': IDL.Func([IDL.Nat64], [Result_4], []),
    'list_mint_orders': IDL.Func(
      [IDL.Vec(IDL.Nat8), IDL.Vec(IDL.Nat8)],
      [IDL.Vec(IDL.Tuple(IDL.Nat32, IDL.Vec(IDL.Nat8)))],
      ['query'],
    ),
    'on_evm_transaction_notification': IDL.Func(
      [IDL.Opt(TransactionReceipt), IDL.Vec(IDL.Nat8)],
      [IDL.Opt(IDL.Null)],
      [],
    ),
    'register_evmc_bft_bridge': IDL.Func([IDL.Text], [Result_5], []),
    'set_evm_principal': IDL.Func([IDL.Principal], [Result_5], []),
    'set_logger_filter': IDL.Func([IDL.Text], [Result_5], []),
    'set_operation_pricing': IDL.Func([OperationPricing], [Result_5], []),
    'set_owner': IDL.Func([IDL.Principal], [Result_5], []),
    'start_icrc2_mint': IDL.Func([IDL.Text, IDL.Nat32], [Result_1], []),
  });
};
export const init = ({ IDL }) => { return []; };
