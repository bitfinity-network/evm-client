export const idlFactory = ({ IDL }) => {
    const MetricsData = IDL.Record({
      'stable_memory_size' : IDL.Nat64,
      'cycles' : IDL.Nat64,
      'heap_memory_size' : IDL.Nat64,
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
    const SpenderError = IDL.Variant({
      'Internal' : IDL.Text,
      'TransactionParamsNotFound' : IDL.Null,
      'IcrcTransferFromError' : TransferFromError,
    });
    const Result = IDL.Variant({ 'Ok' : IDL.Nat, 'Err' : SpenderError });
    return IDL.Service({
      'get_curr_metrics' : IDL.Func([], [MetricsData], ['query']),
      'get_metrics' : IDL.Func([], [MetricsStorage], ['query']),
      'transfer_icrc_tokens' : IDL.Func(
          [IDL.Nat32, IDL.Text, IDL.Text],
          [Result],
          [],
        ),
    });
  };
  export const init = ({ IDL }) => { return []; };
  