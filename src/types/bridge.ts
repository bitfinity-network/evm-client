import {
  Address,
  Id256,
} from "./common";

export interface TokenProp {
    id?: string;
    name: string;
    logo?: string;
    type?: string;
    symbol?: string;
    tokenType?: string;
    address?: string;
    balance?: bigint;
    decimals?: bigint | number;
    fee?: bigint;
    showAddress?: boolean;
    network?: "evm" | "ic";
  }

export interface WrappedTokenParams {
  name: string;
  symbol: string;
  from: Address; // User's address
  tokenAddress: Address;
  bftBridgeContractAddress: Address;
  
}

export interface BurnERC20TokenParams {
  token: Address;
  amountInWei: number;
  bftBridge: Address;
  from: Address;
}

interface transferIcrcTokensParams {
  fee: Tokens[];
  memo?: number[];
  fromSubaccount?: Subaccount;
  createdAtTime?: Timestamp[];
  amount: number;
  expectedAllowance?: number[];
  expiresAt?: Timestamp;
  spender: Account;

}