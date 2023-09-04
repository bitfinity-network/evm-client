export const idlFactory = ({ IDL }) => {
  const SigningKeyId = IDL.Variant({
    'Dfx': IDL.Null,
    'Production': IDL.Null,
    'Test': IDL.Null,
  });
  const SigningStrategy = IDL.Variant({
    'Local': IDL.Record({ 'private_key': IDL.Vec(IDL.Nat8) }),
    'ManagementCanister': IDL.Record({ 'key_id': SigningKeyId }),
  });
  const LogSettings = IDL.Record({
    'log_filter': IDL.Opt(IDL.Text),
    'in_memory_records': IDL.Opt(IDL.Nat64),
    'enable_console': IDL.Bool,
  });
  const Duration = IDL.Record({ 'secs': IDL.Nat64, 'nanos': IDL.Nat32 });
  const InitData = IDL.Record({
    'evm_chain_id': IDL.Nat32,
    'evm_gas_price': IDL.Text,
    'evm_principal': IDL.Principal,
    'signing_strategy': SigningStrategy,
    'owner': IDL.Principal,
    'spender_principal': IDL.Principal,
    'iceth_principal': IDL.Principal,
    'bft_bridge_contract': IDL.Opt(IDL.Text),
    'log_settings': IDL.Opt(LogSettings),
    'process_transactions_results_interval': IDL.Opt(Duration),
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
    'InvalidBurnTransaction': IDL.Text,
    'Icrc2ApproveError': ApproveError,
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
  });
  const Result = IDL.Variant({ 'Ok': IDL.Nat, 'Err': Error });
  const Icrc2Burn = IDL.Record({
    'recipient_chain_id': IDL.Nat32,
    'operation_id': IDL.Nat32,
    'from_subaccount': IDL.Opt(IDL.Vec(IDL.Nat8)),
    'icrc2_token_principal': IDL.Principal,
    'recipient_address': IDL.Text,
    'amount': IDL.Text,
  });
  const Result_1 = IDL.Variant({ 'Ok': IDL.Vec(IDL.Nat8), 'Err': Error });
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
  const Result_2 = IDL.Variant({ 'Ok': IDL.Text, 'Err': Error });
  const OperationPricing = IDL.Record({
    'erc20_mint': IDL.Nat32,
    'evm_registration': IDL.Nat32,
    'evmc_notification': IDL.Nat32,
    'icrc_mint_approval': IDL.Nat32,
    'icrc_transfer': IDL.Nat32,
  });
  const Result_3 = IDL.Variant({ 'Ok': IDL.Vec(IDL.Text), 'Err': Error });
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
  const Result_4 = IDL.Variant({ 'Ok': IDL.Null, 'Err': Error });
  return IDL.Service({
    'approve_icrc2_mint': IDL.Func([IDL.Nat32, IDL.Text], [Result], []),
    'create_erc_20_mint_order': IDL.Func([Icrc2Burn], [Result_1], []),
    'get_bft_bridge_contract': IDL.Func([], [IDL.Opt(IDL.Text)], ['query']),
    'get_curr_metrics': IDL.Func([], [MetricsData], ['query']),
    'get_evm_principal': IDL.Func([], [IDL.Principal], ['query']),
    'get_metrics': IDL.Func([], [MetricsStorage], ['query']),
    'get_minter_canister_evm_address': IDL.Func([], [Result_2], ['query']),
    'get_operation_pricing': IDL.Func([], [OperationPricing], ['query']),
    'get_owner': IDL.Func([], [IDL.Principal], ['query']),
    'get_user_operation_points': IDL.Func(
      [IDL.Opt(IDL.Principal)],
      [IDL.Nat32],
      ['query'],
    ),
    'ic_logs': IDL.Func([IDL.Nat64], [Result_3], []),
    'list_mint_orders': IDL.Func(
      [IDL.Vec(IDL.Nat8), IDL.Vec(IDL.Nat8)],
      [IDL.Vec(IDL.Tuple(IDL.Nat32, IDL.Vec(IDL.Nat8)))],
      ['query'],
    ),
    'minter_eth_address': IDL.Func([], [Result_2], []),
    'on_evm_transaction_notification': IDL.Func(
      [IDL.Opt(TransactionReceipt), IDL.Vec(IDL.Nat8)],
      [IDL.Opt(IDL.Null)],
      [],
    ),
    'register_evmc_bft_bridge': IDL.Func([IDL.Text], [Result_4], []),
    'set_evm_principal': IDL.Func([IDL.Principal], [Result_4], []),
    'set_logger_filter': IDL.Func([IDL.Text], [Result_4], []),
    'set_operation_pricing': IDL.Func([OperationPricing], [Result_4], []),
    'set_owner': IDL.Func([IDL.Principal], [Result_4], []),
    'transfer_icrc2': IDL.Func([IDL.Nat32, IDL.Text, IDL.Nat], [Result], []),
  });
};
export const init = ({ IDL }) => {
  const SigningKeyId = IDL.Variant({
    'Dfx': IDL.Null,
    'Production': IDL.Null,
    'Test': IDL.Null,
  });
  const SigningStrategy = IDL.Variant({
    'Local': IDL.Record({ 'private_key': IDL.Vec(IDL.Nat8) }),
    'ManagementCanister': IDL.Record({ 'key_id': SigningKeyId }),
  });
  const LogSettings = IDL.Record({
    'log_filter': IDL.Opt(IDL.Text),
    'in_memory_records': IDL.Opt(IDL.Nat64),
    'enable_console': IDL.Bool,
  });
  const Duration = IDL.Record({ 'secs': IDL.Nat64, 'nanos': IDL.Nat32 });
  const InitData = IDL.Record({
    'evm_chain_id': IDL.Nat32,
    'evm_gas_price': IDL.Text,
    'evm_principal': IDL.Principal,
    'signing_strategy': SigningStrategy,
    'owner': IDL.Principal,
    'spender_principal': IDL.Principal,
    'iceth_principal': IDL.Principal,
    'bft_bridge_contract': IDL.Opt(IDL.Text),
    'log_settings': IDL.Opt(LogSettings),
    'process_transactions_results_interval': IDL.Opt(Duration),
  });
  return [InitData];
};
