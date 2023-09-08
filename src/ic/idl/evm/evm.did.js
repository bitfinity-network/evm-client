export const idlFactory = ({ IDL }) => {
    const Permission = IDL.Variant({
        'ReadLogs': IDL.Null,
        'Admin': IDL.Null,
        'UpdateLogsConfiguration': IDL.Null,
    });
    const Duration = IDL.Record({ 'secs': IDL.Nat64, 'nanos': IDL.Nat32 });
    const LogSettings = IDL.Record({
        'log_filter': IDL.Opt(IDL.Text),
        'in_memory_records': IDL.Opt(IDL.Nat64),
        'enable_console': IDL.Bool,
    });
    const EvmCanisterInitData = IDL.Record({
        'permissions': IDL.Opt(
            IDL.Vec(IDL.Tuple(IDL.Principal, IDL.Vec(Permission)))
        ),
        'owner': IDL.Principal,
        'network': IDL.Text,
        'min_gas_price': IDL.Nat,
        'chain_id': IDL.Nat64,
        'signature_verification_principal': IDL.Principal,
        'genesis_accounts': IDL.Vec(IDL.Tuple(IDL.Text, IDL.Opt(IDL.Text))),
        'transaction_processing_interval': IDL.Opt(Duration),
        'log_settings': IDL.Opt(LogSettings),
    });
    const BasicAccount = IDL.Record({ 'balance': IDL.Text, 'nonce': IDL.Text });
    const PermissionList = IDL.Record({ 'permissions': IDL.Vec(Permission) });
    const TransactionPoolError = IDL.Variant({
        'InvalidNonce': IDL.Record({ 'actual': IDL.Text, 'expected': IDL.Text }),
        'TransactionAlreadyExists': IDL.Null,
        'TxReplacementUnderpriced': IDL.Null,
        'TooManyTransactions': IDL.Null,
    });
    const HaltError = IDL.Variant({
        'DesignatedInvalid': IDL.Null,
        'OutOfOffset': IDL.Null,
        'Continue': IDL.Null,
        'CallGasCostMoreThanGasLimit': IDL.Null,
        'InvalidChainId': IDL.Null,
        'Revert': IDL.Opt(IDL.Text),
        'InvalidRange': IDL.Null,
        'CreateContractLimit': IDL.Null,
        'CallerGasLimitMoreThanBlock': IDL.Null,
        'InvalidOpcode': IDL.Null,
        'StateChangeDuringStaticCall': IDL.Null,
        'CreateEmpty': IDL.Null,
        'LackOfFundForGasLimit': IDL.Null,
        'InvalidCode': IDL.Nat8,
        'GasPriceLessThanBasefee': IDL.Null,
        'InvalidJump': IDL.Null,
        'OutOfFund': IDL.Null,
        'NonceTooLow': IDL.Null,
        'PrecompileError': IDL.Null,
        'OpcodeNotFound': IDL.Null,
        'NotActivated': IDL.Null,
        'PCUnderflow': IDL.Null,
        'OverflowPayment': IDL.Null,
        'PrevrandaoNotSet': IDL.Null,
        'OutOfGas': IDL.Null,
        'Other': IDL.Text,
        'CallNotAllowedInsideStatic': IDL.Null,
        'NonceTooHigh': IDL.Null,
        'RejectCallerWithCode': IDL.Null,
        'CallTooDeep': IDL.Null,
        'NonceOverflow': IDL.Null,
        'FatalExternalError': IDL.Null,
        'GasMaxFeeGreaterThanPriorityFee': IDL.Null,
        'CreateContractWithEF': IDL.Null,
        'CreateCollision': IDL.Null,
        'StackOverflow': IDL.Null,
        'CreateInitcodeSizeLimit': IDL.Null,
        'StackUnderflow': IDL.Null,
    });
    const ExitFatal = IDL.Variant({
        'UnhandledInterrupt': IDL.Null,
        'NotSupported': IDL.Null,
        'Other': IDL.Text,
        'CallErrorAsFatal': HaltError,
    });
    const EvmError = IDL.Variant({
        'Internal': IDL.Text,
        'TransactionSignature': IDL.Text,
        'StableStorageError': IDL.Text,
        'InsufficientBalance': IDL.Record({
            'actual': IDL.Text,
            'expected': IDL.Text,
        }),
        'TransactionPool': TransactionPoolError,
        'NotAuthorized': IDL.Null,
        'AnonymousPrincipal': IDL.Null,
        'GasTooLow': IDL.Record({ 'minimum': IDL.Text }),
        'BlockDoesNotExist': IDL.Text,
        'NoHistoryDataForBlock': IDL.Text,
        'InvalidGasPrice': IDL.Text,
        'NotProcessableTransactionError': HaltError,
        'ReservationFailed': IDL.Text,
        'FatalEvmExecutorError': ExitFatal,
    });
    const Result = IDL.Variant({ 'Ok': PermissionList, 'Err': EvmError });
    const Result_1 = IDL.Variant({ 'Ok': IDL.Null, 'Err': EvmError });
    const Result_2 = IDL.Variant({ 'Ok': IDL.Text, 'Err': EvmError });
    const Result_3 = IDL.Variant({ 'Ok': IDL.Text, 'Err': EvmError });
    const Block = IDL.Record({
        'miner': IDL.Text,
        'totalDifficulty': IDL.Text,
        'receiptsRoot': IDL.Text,
        'stateRoot': IDL.Text,
        'hash': IDL.Text,
        'difficulty': IDL.Text,
        'size': IDL.Opt(IDL.Text),
        'uncles': IDL.Vec(IDL.Text),
        'baseFeePerGas': IDL.Opt(IDL.Text),
        'extraData': IDL.Text,
        'sealFields': IDL.Vec(IDL.Text),
        'transactionsRoot': IDL.Text,
        'sha3Uncles': IDL.Text,
        'nonce': IDL.Text,
        'number': IDL.Text,
        'timestamp': IDL.Text,
        'transactions': IDL.Vec(IDL.Text),
        'gasLimit': IDL.Text,
        'logsBloom': IDL.Text,
        'parentHash': IDL.Text,
        'gasUsed': IDL.Text,
        'mixHash': IDL.Text,
    });
    const AccessListItem = IDL.Record({
        'storageKeys': IDL.Vec(IDL.Text),
        'address': IDL.Text,
    });
    const Transaction = IDL.Record({
        'r': IDL.Text,
        's': IDL.Text,
        'v': IDL.Text,
        'to': IDL.Opt(IDL.Text),
        'gas': IDL.Text,
        'maxFeePerGas': IDL.Opt(IDL.Text),
        'gasPrice': IDL.Opt(IDL.Text),
        'value': IDL.Text,
        'blockNumber': IDL.Opt(IDL.Text),
        'from': IDL.Text,
        'hash': IDL.Text,
        'blockHash': IDL.Opt(IDL.Text),
        'type': IDL.Opt(IDL.Text),
        'accessList': IDL.Opt(IDL.Vec(AccessListItem)),
        'transactionIndex': IDL.Opt(IDL.Text),
        'nonce': IDL.Text,
        'maxPriorityFeePerGas': IDL.Opt(IDL.Text),
        'input': IDL.Text,
        'chainId': IDL.Opt(IDL.Text),
    });
    const Block_1 = IDL.Record({
        'miner': IDL.Text,
        'totalDifficulty': IDL.Text,
        'receiptsRoot': IDL.Text,
        'stateRoot': IDL.Text,
        'hash': IDL.Text,
        'difficulty': IDL.Text,
        'size': IDL.Opt(IDL.Text),
        'uncles': IDL.Vec(IDL.Text),
        'baseFeePerGas': IDL.Opt(IDL.Text),
        'extraData': IDL.Text,
        'sealFields': IDL.Vec(IDL.Text),
        'transactionsRoot': IDL.Text,
        'sha3Uncles': IDL.Text,
        'nonce': IDL.Text,
        'number': IDL.Text,
        'timestamp': IDL.Text,
        'transactions': IDL.Vec(Transaction),
        'gasLimit': IDL.Text,
        'logsBloom': IDL.Text,
        'parentHash': IDL.Text,
        'gasUsed': IDL.Text,
        'mixHash': IDL.Text,
    });
    const BlockResult = IDL.Variant({
        'NoBlockFound': IDL.Null,
        'WithHash': Block,
        'WithTransaction': Block_1,
    });
    const Result_4 = IDL.Variant({ 'Ok': BlockResult, 'Err': EvmError });
    const Result_5 = IDL.Variant({ 'Ok': IDL.Nat64, 'Err': EvmError });
    const Result_6 = IDL.Variant({
        'Ok': IDL.Opt(Transaction),
        'Err': EvmError,
    });
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
    const Result_7 = IDL.Variant({
        'Ok': IDL.Opt(TransactionReceipt),
        'Err': EvmError,
    });
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
    const HttpRequest = IDL.Record({
        'url': IDL.Text,
        'method': IDL.Text,
        'body': IDL.Vec(IDL.Nat8),
        'headers': IDL.Vec(IDL.Tuple(IDL.Text, IDL.Text)),
    });
    const HttpResponse = IDL.Record({
        'body': IDL.Vec(IDL.Nat8),
        'headers': IDL.Vec(IDL.Tuple(IDL.Text, IDL.Text)),
        'upgrade': IDL.Opt(IDL.Bool),
        'status_code': IDL.Nat16,
    });
    const Result_8 = IDL.Variant({ 'Ok': IDL.Vec(IDL.Text), 'Err': EvmError });
    const EvmStats = IDL.Record({
        'block_number': IDL.Nat64,
        'cycles': IDL.Nat64,
        'chain_id': IDL.Nat64,
        'pending_transactions': IDL.Vec(Transaction),
        'pending_transactions_count': IDL.Nat64,
        'block_gas_limit': IDL.Nat64,
        'state_root': IDL.Text,
    });
    const Result_9 = IDL.Variant({ 'Ok': EvmStats, 'Err': EvmError });
    return IDL.Service({
        'account_basic': IDL.Func([IDL.Text], [BasicAccount], ['query']),
        'admin_ic_permissions_add': IDL.Func(
            [IDL.Principal, IDL.Vec(Permission)],
            [Result],
            [],
        ),
        'admin_ic_permissions_get': IDL.Func([IDL.Principal], [Result], ['query']),
        'admin_ic_permissions_remove': IDL.Func(
            [IDL.Principal, IDL.Vec(Permission)],
            [Result],
            [],
        ),
        'admin_set_block_gas_limit': IDL.Func([IDL.Nat64], [Result_1], []),
        'admin_set_blockchain_history_size': IDL.Func([IDL.Nat64], [Result_1], []),
        'admin_set_evm_state_history_size': IDL.Func([IDL.Nat64], [Result_1], []),
        'admin_set_min_gas_price': IDL.Func([IDL.Text], [Result_1], []),
        'eth_accounts': IDL.Func([], [IDL.Vec(IDL.Text)], ['query']),
        'eth_block_number': IDL.Func([], [IDL.Nat64], ['query']),
        'eth_call': IDL.Func(
            [
                IDL.Opt(IDL.Text),
                IDL.Opt(IDL.Text),
                IDL.Opt(IDL.Text),
                IDL.Nat64,
                IDL.Opt(IDL.Text),
                IDL.Opt(IDL.Text),
            ],
            [Result_2],
            ['query'],
        ),
        'eth_chain_id': IDL.Func([], [IDL.Nat64], ['query']),
        'eth_estimate_gas': IDL.Func(
            [IDL.Text, IDL.Opt(IDL.Text), IDL.Nat64, IDL.Text, IDL.Text],
            [Result_3],
            ['query'],
        ),
        'eth_get_balance': IDL.Func([IDL.Text, IDL.Text], [Result_3], ['query']),
        'eth_get_block_by_hash': IDL.Func(
            [IDL.Text, IDL.Bool],
            [Result_4],
            ['query'],
        ),
        'eth_get_block_by_number': IDL.Func(
            [IDL.Text, IDL.Bool],
            [Result_4],
            ['query'],
        ),
        'eth_get_block_transaction_count_by_block_number': IDL.Func(
            [IDL.Text],
            [Result_5],
            ['query'],
        ),
        'eth_get_block_transaction_count_by_hash': IDL.Func(
            [IDL.Text],
            [IDL.Nat64],
            ['query'],
        ),
        'eth_get_block_transaction_count_by_number': IDL.Func(
            [IDL.Text],
            [Result_5],
            ['query'],
        ),
        'eth_get_code': IDL.Func([IDL.Text, IDL.Text], [Result_3], ['query']),
        'eth_get_storage_at': IDL.Func(
            [IDL.Text, IDL.Text, IDL.Text],
            [Result_3],
            ['query'],
        ),
        'eth_get_transaction_by_block_hash_and_index': IDL.Func(
            [IDL.Text, IDL.Nat64],
            [IDL.Opt(Transaction)],
            ['query'],
        ),
        'eth_get_transaction_by_block_number_and_index': IDL.Func(
            [IDL.Text, IDL.Nat64],
            [Result_6],
            ['query'],
        ),
        'eth_get_transaction_by_hash': IDL.Func(
            [IDL.Text],
            [IDL.Opt(Transaction)],
            ['query'],
        ),
        'eth_get_transaction_count': IDL.Func(
            [IDL.Text, IDL.Text],
            [Result_3],
            ['query'],
        ),
        'eth_get_transaction_receipt': IDL.Func([IDL.Text], [Result_7], ['query']),
        'eth_hashrate': IDL.Func([], [IDL.Nat64], ['query']),
        'eth_mining': IDL.Func([], [IDL.Bool], ['query']),
        'eth_protocol_version': IDL.Func([], [IDL.Nat64], ['query']),
        'eth_syncing': IDL.Func([], [IDL.Bool], ['query']),
        'get_block_gas_limit': IDL.Func([], [IDL.Nat64], ['query']),
        'get_blockchain_state_history_size': IDL.Func([], [IDL.Nat64], ['query']),
        'get_curr_metrics': IDL.Func([], [MetricsData], ['query']),
        'get_evm_state_history_size': IDL.Func([], [IDL.Nat64], ['query']),
        'get_metrics': IDL.Func([], [MetricsStorage], ['query']),
        'get_min_gas_price': IDL.Func([], [IDL.Text], ['query']),
        'http_request': IDL.Func([HttpRequest], [HttpResponse], ['query']),
        'http_request_update': IDL.Func([HttpRequest], [HttpResponse], []),
        'ic_logs': IDL.Func([IDL.Nat64], [Result_8], []),
        'ic_stats': IDL.Func([], [Result_9], ['query']),
        'is_address_reserved': IDL.Func(
            [IDL.Principal, IDL.Text],
            [IDL.Bool],
            ['query'],
        ),
        'mint_native_tokens': IDL.Func([IDL.Text, IDL.Text], [Result_3], []),
        'net_listening': IDL.Func([], [IDL.Bool], ['query']),
        'net_peer_count': IDL.Func([], [IDL.Nat64], ['query']),
        'net_version': IDL.Func([], [IDL.Nat64], ['query']),
        'reserve_address': IDL.Func([IDL.Principal, IDL.Text], [Result_1], []),
        'send_raw_transaction': IDL.Func([Transaction], [Result_3], []),
        'set_logger_filter': IDL.Func([IDL.Text], [Result_1], []),
        'web3_client_version': IDL.Func([], [IDL.Text], ['query']),
        'web3_sha3': IDL.Func([IDL.Text], [Result_3], ['query']),
    });
};
export const init = ({ IDL }) => {
    const Permission = IDL.Variant({
        'ReadLogs': IDL.Null,
        'Admin': IDL.Null,
        'UpdateLogsConfiguration': IDL.Null,
    });
    const Duration = IDL.Record({ 'secs': IDL.Nat64, 'nanos': IDL.Nat32 });
    const LogSettings = IDL.Record({
        'log_filter': IDL.Opt(IDL.Text),
        'in_memory_records': IDL.Opt(IDL.Nat64),
        'enable_console': IDL.Bool,
    });
    const EvmCanisterInitData = IDL.Record({
        'permissions': IDL.Opt(
            IDL.Vec(IDL.Tuple(IDL.Principal, IDL.Vec(Permission)))
        ),
        'owner': IDL.Principal,
        'network': IDL.Text,
        'min_gas_price': IDL.Nat,
        'chain_id': IDL.Nat64,
        'signature_verification_principal': IDL.Principal,
        'genesis_accounts': IDL.Vec(IDL.Tuple(IDL.Text, IDL.Opt(IDL.Text))),
        'transaction_processing_interval': IDL.Opt(Duration),
        'log_settings': IDL.Opt(LogSettings),
    });
    return [EvmCanisterInitData];
};
