import {
  EvmIDL,
  EvmService,
  IcConnector,
  IcrcIDL,
  MinterIDL,
  MinterService,
} from "../ic";
import { IDL } from "@dfinity/candid";
import BftBridgeABI from "../abi/BftBridge.json";
import WrappedTokenABI from "../abi/WrappedToken.json";
import { Icrc2Burn } from "../ic/idl/minter/minter.did";
import {
  Signer,
  ethers,
  Provider,
  TransactionResponse,
  JsonRpcSigner,
} from "ethers";

import {
  Address,
  AddressWithChainID,
  Id256,
  Id256Factory,
  SignedMintOrder,
} from "../validation";
import { chainManagerIface, TxHash } from "./Interfaces";
import { numberToHex } from "web3-utils";
import { ApproveArgs } from "../ic/idl/icrc/icrc.did";
import { IcrcService } from "../ic";
import { Principal } from "@dfinity/principal";
import erc20TokenAbi from "../abi/erc20Token.json";
import { ActorSubclass } from "@dfinity/agent";
import { CacheManager } from "./cache";
import { CACHE_KEYS } from "../constants";
import { WrappedProvider } from "./provider";

export { CACHE_KEYS };
export class Chain implements chainManagerIface {
  public minterCanister: string;
  public Ic: IcConnector;
  public signer: JsonRpcSigner | Signer;
  public provider: Provider;
  public cache: CacheManager;

  constructor(
    minterCanister: string,
    Ic: IcConnector,
    signer: JsonRpcSigner | Signer,
    provider: Provider,
  ) {
    this.minterCanister = minterCanister;
    this.Ic = Ic;
    this.signer = signer;
    this.provider = new WrappedProvider(provider).provider;
    this.cache = new CacheManager(100);
  }

  private getActor<T>(
    canisterId: string,
    interfaceFactory: IDL.InterfaceFactory,
  ): ActorSubclass<T> {
    if ("createActor" in this.Ic) {
      if (this.Ic && this.Ic?.createActor) {
        return this.Ic.createActor({ canisterId, interfaceFactory });
      }
    }
    return this.Ic.actor(canisterId, interfaceFactory);
  }

  public wrappedProvider(): Provider {
    // const latestBlockNumber = await this.provider.getBlockNumber()
    return this.provider;
  }

  public async get_bft_bridge_contract(): Promise<Address | undefined> {
    await this.add_operation_points();
    const result = await this.getActor<MinterService>(
      this.minterCanister,
      MinterIDL,
    ).get_bft_bridge_contract();
    if ("Ok" in result) {
      const address = result.Ok.length ? result.Ok[0] : "";
      return new Address(address);
    }
    return undefined;
  }

  public async get_wrapped_token_address(
    fromToken: Id256,
  ): Promise<Address | undefined> {
    const bridge = await this.get_bft_bridge_contract();

    if (bridge) {
      const contract = new ethers.Contract(
        bridge?.getAddress(),
        BftBridgeABI,
        this.provider,
      );
      const wrappedToken = await contract.getWrappedToken(fromToken);
      console.log("wrappedToken", wrappedToken);
      if (new Address(wrappedToken).isZero()) {
        return undefined;
      }
      return new Address(wrappedToken);
    }
  }

  public async deploy_bft_wrapped_token(
    name: string,
    symbol: string,
    fromToken: Id256,
  ): Promise<Address> {
    console.log("getting wrapped token");
    const bridge = await this.get_bft_bridge_contract();
    console.log("getting bridge address");
    const bridgeAddress = bridge?.getAddress();
    console.log("getting wrapped token");
    let tokenAddress = await this.get_wrapped_token_address(fromToken);

    if (!tokenAddress && bridgeAddress) {
      const contract = new ethers.Contract(
        bridgeAddress,
        BftBridgeABI,
        this.signer,
      );
      const nonce = await this.get_nonce();
      const tx = await contract.deployERC20(name, symbol, fromToken, {
        nonce,
      });
      await tx.wait();
      tokenAddress = await this.get_wrapped_token_address(fromToken);
    }
    return tokenAddress!;
  }

  public async get_icrc_token_fee(
    principal: Principal,
  ): Promise<number | undefined> {
    const result = await this.getActor<IcrcService>(
      principal.toText(),
      IcrcIDL,
    ).icrc1_fee();
    if (result) {
      return Number(result);
    }
    return undefined;
  }

  public async add_operation_points() {
    const userPrincipal = this.Ic.getPrincipal();
    const tx_hash = new Uint8Array(32);
    const receiver_canister = Id256Factory.principalToBytes32(
      Principal.fromText(this.minterCanister),
    );
    const user_data = userPrincipal?.toUint8Array();

    const ABI = [
      "function evm_canister_notification_needed(bytes32 tx_hash, bytes32 principal, bytes user_data)",
    ];
    const iface = new ethers.Interface(ABI);
    const encodedData = iface.encodeFunctionData(
      "evm_canister_notification_needed",
      [tx_hash, receiver_canister, user_data],
    );
    await this.send_notification_tx(encodedData);
  }

  async send_notification_tx(notification: string) {
    const userAddress = await this.signer.getAddress();
    const nonce = await this.wrappedProvider().getTransactionCount(userAddress);
    const gasPrice = (await this.wrappedProvider().getFeeData()).gasPrice;
    const chainId = await this.get_chain_id();

    const transactionArgs = {
      from: userAddress,
      to: userAddress,
      gasLimit: BigInt(30000),
      nonce,
      gasPrice,
      value: ethers.parseEther("0"),
      chainId,
      data: notification,
    };
    const tx = await this.signer.sendTransaction(transactionArgs);
    console.log("result", tx);
    const receipt = await tx.wait();
    return receipt;
  }

  public async burn_icrc2_tokens(
    token: Principal,
    amount: number,
    operation_id: number,
  ): Promise<SignedMintOrder> {
    const fee = await this.get_icrc_token_fee(token);
    const approve: ApproveArgs = {
      fee: [],
      memo: [],
      from_subaccount: [],
      created_at_time: [],
      amount: BigInt(amount + fee!),
      expected_allowance: [],
      expires_at: [],
      spender: {
        owner: Principal.fromText(this.minterCanister),
        subaccount: [],
      },
    };
    console.log("approve args", approve);
    const approvalResult = await this.getActor<IcrcService>(
      token.toText(),
      IcrcIDL,
    ).icrc2_approve(approve);
    if ("Ok" in approvalResult) {
      this.cacheTx(CACHE_KEYS.BURNT_TX, {
        time: new Date(),
        value: Number(approvalResult.Ok),
      });
      console.log("approvalResult", approvalResult);

      const recipient_chain_id = await this.get_chain_id();
      await this.add_operation_points();

      const tokenAddress = await this.get_wrapped_token_address(
        Id256Factory.fromPrincipal(token),
      );
      console.log("tokenAddress", tokenAddress);
      if (tokenAddress) {
        const mintReason: Icrc2Burn = {
          recipient_chain_id,
          operation_id,
          icrc2_token_principal: token,
          from_subaccount: [],
          recipient_address: await this.signer.getAddress(),
          amount: numberToHex(amount),
        };
        console.log("mintReason", mintReason);
        return await this.createMintOrder(mintReason);
      }
    }

    throw Error("Impossible");
  }

  public async createMintOrder(
    mintReason: Icrc2Burn,
  ): Promise<SignedMintOrder> {
    const result = await this.getActor<MinterService>(
      this.minterCanister,
      MinterIDL,
    ).create_erc_20_mint_order(mintReason);
    if ("Err" in result) {
      console.log(result.Err);
      throw result.Err;
    }
    this.cacheTx(CACHE_KEYS.MINT_ORDER, {
      time: new Date(),
      value: result.Ok,
    });
    return ethers.getBytes(new Uint8Array(result.Ok));
  }

  public async mint_icrc_tokens(
    operation_id: number,
    icrcToken: Principal,
  ): Promise<bigint | undefined> {
    const userAddress = await this.signer.getAddress();

    console.log("args", { userAddress, operation_id });
    const result = await this.getActor<MinterService>(
      this.minterCanister,
      MinterIDL,
    ).approve_icrc2_mint(userAddress, operation_id);
    console.log("mint approval result", result);

    if ("Ok" in result) {
      await this.finish_burn(operation_id);
      const fee = await this.get_icrc_token_fee(icrcToken);
      const approvedAmount = Number(result.Ok) - fee!;
      console.log("approved Amount", approvedAmount);
      //console.log("approved Amount", "0x" + approvedAmount.toString(16));
      const spenderResult = await this.getActor<MinterService>(
        this.minterCanister,
        MinterIDL,
      ).transfer_icrc2(
        operation_id,
        userAddress,
        icrcToken,
        this.Ic.getPrincipal()!,
        BigInt(approvedAmount),
      );
      console.log("spenderResult", spenderResult);
      if ("Ok" in spenderResult) {
        return spenderResult.Ok;
      }
    }
  }

  public async burn_erc_20_tokens(
    from_token: Address,
    amount: number,
    chainId: number = 0,
  ): Promise<string | undefined> {
    const bridge = await this.get_bft_bridge_contract();
    const bridgeAddress = bridge?.getAddress();
    if (bridgeAddress) {
      const bftContract = new ethers.Contract(
        bridgeAddress,
        BftBridgeABI,
        this.signer,
      );
      const WrappedTokenContract = new ethers.Contract(
        from_token.getAddress(),
        WrappedTokenABI,
        this.signer,
      );
      const userAddress = await this.signer.getAddress();

      const approveTx = await WrappedTokenContract.approve(
        bridgeAddress,
        String(amount),
        { nonce: await this.get_nonce() },
      );
      await approveTx.wait();
      const txReceipt = await this.wrappedProvider().getTransaction(
        approveTx.hash,
      );
      console.log("approvedTransfer", txReceipt);
      console.log("Burn ERC 20 Tokens");
      const recipient = chainId
        ? Id256Factory.fromAddress(new AddressWithChainID(userAddress, chainId))
        : Id256Factory.fromPrincipal(this.Ic.getPrincipal()!);
      const tx = await bftContract.burn(
        Number(amount),
        from_token.getAddress(),
        recipient,
        chainId,
        {
          nonce: await this.get_nonce(),
          gasLimit: 350000,
        },
      );
      this.cacheTx(CACHE_KEYS.BURNT_TX, {
        time: new Date(),
        value: tx.hash,
        info: {
          userAddress,
        },
      });
      await tx.wait();

      //decode data

      if (tx) {
        return tx.hash;
      } else {
        throw Error("Transaction not successful");
      }
    }
  }

  public async get_operation_id(
    evm_canister_id: Principal,
    hash: string,
  ): Promise<number | undefined> {
    const result = await this.getActor<EvmService>(
      evm_canister_id.toString(),
      EvmIDL,
    ).eth_get_transaction_receipt(hash);
    if ("Ok" in result) {
      const { Ok } = result;
      if (Ok.length) {
        console.log("output number", Ok[0].output[0] as number[]);
        const blobData = Ok[0].output[0] as number[];
        const numberArray = Array.from(blobData);
        const numberString = numberArray.join("");
        const operation_id = parseInt(numberString, 10);
        return operation_id;
      }
    }
  }

  public async finish_burn(
    operation_id: number,
  ): Promise<TransactionResponse | undefined> {
    const bridgeAddress = await this.get_bft_bridge_contract();

    const nonce = await this.get_nonce();
    if (bridgeAddress && bridgeAddress.getAddress()) {
      const bridge = new ethers.Contract(
        bridgeAddress.getAddress(),
        BftBridgeABI,
        this.signer,
      );
      const tx = await bridge.finishBurn(operation_id, {
        nonce,
        gasLimit: 200000,
      });
      await tx.wait();
      return tx;
    }
  }

  public async burn_native_tokens(
    recipient: Id256,
    dstChainId: number,
    amount: number,
  ): Promise<TxHash | undefined> {
    const bridgeAddress = await this.get_bft_bridge_contract();
    if (bridgeAddress && bridgeAddress.getAddress()) {
      const bridge = new ethers.Contract(
        bridgeAddress.getAddress(),
        BftBridgeABI,
        this.signer,
      );
      const result = await bridge.burn(recipient, dstChainId, {
        value: amount,
        nonce: await this.get_nonce(),
        gasLimit: 200000,
      });
      this.cacheTx(CACHE_KEYS.BURNT_TX, {
        time: new Date(),
        value: result.hash,
      });
      await result.wait();
      if (result && result.hash) {
        return result.hash;
      } else {
        throw Error("Transaction not successful");
      }
    }
  }

  async mintOrder(
    encodedOrder: SignedMintOrder,
  ): Promise<TransactionResponse | undefined> {
    const bridgeAddress = await this.get_bft_bridge_contract();
    const nonce = await this.get_nonce();
    if (bridgeAddress && bridgeAddress.getAddress()) {
      const bridge = new ethers.Contract(
        bridgeAddress.getAddress(),
        BftBridgeABI,
        this.signer,
      );
      const tx = await bridge.mint(encodedOrder, { nonce, gasLimit: 200000 });
      await tx.wait();
      this.cacheTx(CACHE_KEYS.MINT, { time: new Date(), value: tx.hash });
      const txReceipt = await this.wrappedProvider().getTransaction(tx.hash);
      if (txReceipt) {
        return txReceipt;
      }
    }
  }

  /*   public async mint_erc_20_tokens(
    burn_tx_hash: TxHash,
    burn_chain_id: number,
  ): Promise<TransactionResponse | undefined> {
    await this.add_operation_points();
    const reason = {
      Erc20Burn: {
        burn_tx_hash,
        chain_id: burn_chain_id,
      },
    };
    const order: SignedMintOrder = await this.createMintOrder(reason);
    return await this.mintOrder(order);
  } */

  /*   public async mint_native_tokens(
    reason: MintReason,
  ): Promise<TransactionReceipt | null> {
    const result = await this.getActor<MinterService>(
      this.minterCanister,
      MinterIDL,
    ).mint_native_token(reason);
    if ("Ok" in result) {
      const txHash = result.Ok;
      this.cacheTx(CACHE_KEYS.MINT, { time: new Date(), value: txHash });
      const receipt = await this.provider.getTransactionReceipt(txHash);
      return receipt ?? null;
    }
    throw Error("Not found");
  } */

  public async get_chain_id(): Promise<number> {
    const { chainId } = await this.provider.getNetwork();
    return Number(chainId);
  }

  public async check_erc20_balance(token: Address): Promise<number> {
    const contract = new ethers.Contract(
      token.getAddress(),
      erc20TokenAbi.abi,
      this.signer,
    );
    const result = await contract.balanceOf(await this.signer.getAddress());
    console.log("balance of", result);
    return Number(result);
  }

  public async get_nonce(): Promise<number> {
    const userAddress = await this.signer.getAddress();
    return await this.provider.getTransactionCount(userAddress);
  }

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore

  register_bft_bridge_contract(): Promise<Address> {}

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  create_bft_bridge_contract(): Promise<Address> {}

  public cacheTx(key: string, value: object) {
    const serializedData = this.cache.get(key);

    if (!serializedData) {
      this.cache.set(key, JSON.stringify([value]));
    } else {
      const cachedData = JSON.parse(serializedData);
      const newCachecData = [...cachedData, value];
      this.cache.set(key, JSON.stringify(newCachecData));
    }
  }

  public getCacheTx(key = CACHE_KEYS.BURNT_TX) {
    const serializedData = this.cache.get(key);
    if (serializedData) return JSON.parse(serializedData);
    return [];
  }

  public generateOperationId() {
    const timestamp = Date.now();
    const randomNum = Math.floor(Math.random() * 0x100000000);
    const uniqueId = (timestamp + randomNum) % 0x100000000;
    return uniqueId;
  }
}
