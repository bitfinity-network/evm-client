import Web3 from "web3";
import Ic, { Icrc1IDL, MinterIDL, MinterService } from "./ic";
import { BridgeManagerType, TokenProp } from "./types/bridge";
import BftBridgeABI from "./abi/BftBridge.json";
import { isAddress } from "web3-validator";
import {
  convertAddressToId256,
  convertPrincipalToId256,
  isZeroAddress,
} from "./utils";
import { Principal } from "@dfinity/principal";
import { Account, Subaccount, Timestamp, Tokens } from "./ic/idl/icrc/icrc.did";

type Address = string;
type PrincipalString = string;

interface BridgeClientType {}

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
// TODO: create class Address to handle address and principal validation

class Id256 {
  constructor(address) {
    convertAddressToId256(address);
  }

  public convertAddressToId256(tokenAddress) {
    return isAddress(tokenAddress)
      ? convertAddressToId256(tokenAddress)
      : convertPrincipalToId256(Principal.fromText(tokenAddress));
  }
}

export class BridgeClient {
  constructor({}: BridgeClientType) {}

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
      const result = await Ic.actor<MinterService>(
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
    provider,
    contractAddress: Address,
    tokenAddress: Address | PrincipalString
  ): Promise<Address | undefined> {
    const externalToken = new Id256(tokenAddress);
    const contract = new provider.eth.Contract(BftBridgeABI, contractAddress);
    const wrappedTokenAddress = await contract.methods
      .getWrappedTokenAddress(externalToken)
      .call();
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
    provider,
    { token, amountInWei, bftBridge, from }: BurnERC20TokenParams
  ): Promise<string | undefined> {
    try {
      const externalToken = new Id256(token);
      if (externalToken) {
        const contract = provider(BftBridgeABI, bftBridge);
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

  public async transferIcrcTokens(icProvider, {fee = [], memo = [], fromSubaccount = [], createdAtTime =[], amount, expectedAllowance, expiresAt, spender}: transferIcrcTokensParams) {
    // approve transfer
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
  } 

  //async deployERC20
}
