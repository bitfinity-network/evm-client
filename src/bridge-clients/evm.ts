import { EVMBridgeIface, SwapResult, TxHash } from "./Interfaces";
import Web3 from "web3";
import _ ,{ IcConnector, MinterIDL, MinterService } from "../ic";
import BftBridgeABI from "../abi/BftBridge.json";
import WrappedTokenABI from "../abi/WrappedToken.json";
import { isAddress } from "web3-validator";
import { MintReason} from "../ic/idl/minter/minter.did";
import { ethers } from "ethers";

import {
  Address,
  Id256,
  SignedMintOrder
} from "../types/common";
import { Principal} from "@dfinity/principal";
import {TransactionReceipt} from 'web3-core'
import {AbiItem} from 'web3-utils'

export class EVMBridge implements EVMBridgeIface {
    async public swap_evm_tokens(
        from_w3: Web3, 
        to_w3: Web3, 
        from_token: Id256,
        to_token: Id256, 
        amount: number
      ): Promise<SwapResult> {

      }
}