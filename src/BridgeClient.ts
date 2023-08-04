import Web3, { Contract } from "web3";
import  {IcConnector, IcConnectorOptions, Icrc1IDL, MinterIDL, MinterService } from "./ic";
import { BridgeManagerType, TokenProp } from "./types/bridge";
import BftBridgeABI from "./abi/BftBridge.json";
import WrappedToken from "./abi/WrappedToken.json";
import WrappedTokenABI from "./abi/WrappedToken.json";
import { isAddress } from "web3-validator";
import {
  convertAddressToId256,
  convertPrincipalToId256,
  isZeroAddress,
} from "./utils";
import { Principal } from "@dfinity/principal";
import { Account, Allowance, ApproveResult, Subaccount, Timestamp, Tokens } from "./ic/idl/icrc/icrc.did";
import { MintReason } from "./ic/idl/minter/minter.did";
import { AbiItem } from "web3-utils";

type Address = string;
type PrincipalString = string;

interface BridgeClientType {
  IcConnectorArgs?: IcConnectorOptions
}

interface DeployWrappedTokenParams {
  name: string;
  symbol: string;
  from: Address; // User's address
  tokenAddress: Address;
  bftBridgeContractAddress: Address;
  
}

interface BurnERC20TokenParams {
  token: Address;
  amountInWei: number;
  bftBridge: Address;
  from: Address;
}

interface TransferIcrcTokensParams {
  fee: Tokens[];
  memo?: number[];
  fromSubaccount?: Subaccount;
  createdAtTime?: Timestamp[];
  amount: number;
  expectedAllowance?: number[];
  expiresAt?: Timestamp;
  spender: Account;

}

// TODO: create class Address to handle address and principal validation

class Id256 {
  private id256Value;

  constructor(address: Address) {
    this.id256Value = this.convertAddressToId256(address);
  }

  public convertAddressToId256(tokenAddress: Address) {
    return isAddress(tokenAddress)
      ? convertAddressToId256(tokenAddress)
      : convertPrincipalToId256(Principal.fromText(tokenAddress));
  }

  public valueOf() {
    return this.id256Value;
  }
}

export class BridgeClient {
  private ic: IcConnector;
  constructor(ic: IcConnector) {
    this.ic = ic
  }

  /**
   *
   * This function returns the bft bridge smart
   * contract address
   *
   * @param {minterCanisterPrincipal}
   * @returns
   */
  public async getBftBridgeContract(
    minterCanisterPrincipal: PrincipalString
  ): Promise<Address | undefined> {
    try {
      const result = await this.ic.actor<MinterService>(
        minterCanisterPrincipal,
        MinterIDL
      ).get_bft_bridge_contract([]);
      if (result.length) {
        return result[0];
      }
      return undefined;
    } catch (error) {
      throw new error();
    }
  }

  public async getWrappedTokenAddress(
    provider: Web3,
    contractAddress: Address,
    tokenAddress: Address | PrincipalString
  ): Promise<Address | undefined> {
    const externalToken = new Id256(tokenAddress);
    const web3 = new Web3();
    //new web3.eth.Contract(BftBridgeABI,contractAddress)
    
    const contract = new provider.eth.Contract<>(BftBridgeABI, contractAddress);
    const wrappedTokenAddress = await contract.methods.getWrappedToken(externalToken)
    if (isZeroAddress(wrappedTokenAddress)) {
      return undefined;
    }
    return wrappedTokenAddress;
  }

  public async deployWrappedToken(
    provider,
    {
      name,
      symbol,
      tokenAddress,
      from,
      bftBridgeContractAddress,
    }: DeployWrappedTokenParams
  ): Promise<string | undefined> {
    try {
      const externalToken = new Id256(tokenAddress);
      if (externalToken) {
        const contract = provider(BftBridgeABI, bftBridgeContractAddress);
        const result = await contract.methods
          .deployERC20(name, symbol, externalToken)
          .from({ from });
        const newWrappedTokenAddress =
          result.events.NewWrappedToken.returnValues.wrappedAddress;
        if (newWrappedTokenAddress) {
          return newWrappedTokenAddress;
        }
        return undefined;
      }
    } catch (error) {
      throw new Error(error);
    }
  }

  public async burnERC20Token(
    provider: Web3,
    { token, amountInWei, bftBridge, from }: BurnERC20TokenParams
  ): Promise<string | undefined> {
    try {
      const externalToken = new Id256(token);
      if (externalToken) {
        const contract = provider(BftBridgeABI as AbiItem[], bftBridge);
        await contract.methods
          .approve(BftBridgeABI, amountInWei)
          .send({ from });
        const result = await contract.methods
          .burn(amountInWei, token)
          .from({ from });
        if (result && result.transactionHash) return result.transactionHash;
      }
      return undefined;
    } catch (error) {
      throw new Error(error);
    }
  }

  public async approveIcrcTokens(icProvider, {fee = [], memo = [], fromSubaccount = [], createdAtTime =[], amount, expectedAllowance, expiresAt, spender}: TransferIcrcTokensParams) {
    try {
      const result = await icProvider.icrc2_approve({
        fee,
        memo,
        fromSubaccount,
        createdAtTime,
        amount,
        expectedAllowance,
        expiresAt,
        spender
      })
      if ("Ok" in result) {
        return result.Ok
      }
      if("Err" in result) throw new Error(result.Err)
    } catch (error) {
      throw new Error(error)
    }
  }

  public async createERC20MintOrder(minterCanisterId: string, mintReason: MintReason) {
    try {
      const result = await this.ic.actor<MinterService>(
        minterCanisterId,
        MinterIDL
      ).create_erc_20_mint_order(mintReason);
      if ("Ok" in result) return result.Ok;
      if ("Err" in result) throw result.Err;
    } catch (error) {
      throw new Error(error);
    }
  }

  public async mintOrder(provider: Web3,{bftBridge,encodedOrder, from}) {
    try {
      const chainid = Number(await provider.eth.getChainId())
      const contract = new provider.eth.Contract(BftBridgeABI as AbiItem[], bftBridge);
      const result = await contract.methods.mint(encodedOrder).send({from});
      return result;
    } catch (error) {
      throw new Error(error)
    }
  }

  public async approveIcrcMint(icProvider, {chainId, burnTxHash}) {
    try {
      const result = await icProvider.icrc2_approve({
    } catch (error) {
      
    }
  }

}
