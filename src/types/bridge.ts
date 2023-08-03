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

export interface BridgeManagerType {
    amount: number;
    token?: TokenProp;
    userEthAddress?: string;
    userPrincipal?: string;
    handleStep?: (step: string, state?: string) => void;
}