import { setupTests } from "./test-setup";
import { Chain } from "../bridge/chain";
import { Address, Id256, Id256Factory } from "../validation";
import { Principal } from "@dfinity/principal";
import canisterIds from "../ic/canister_ids.json";
import { CACHE_KEYS, TEST_TOKEN_PRINCIPAL } from "../constants";
import { TransactionReceipt, TransactionResponse, ethers } from "ethers";
jest.setTimeout(120000);

describe("Bridge class", () => {
  let bridge: Chain;
  let signedMintOrder: ethers.BytesLike | undefined;
  let ercToken: Address;
  let tokenInId256: Id256;
  let operation_id: number;
  let burnTxHash: string | undefined;

  beforeAll(async () => {
    tokenInId256 = Id256Factory.fromPrincipal(
      Principal.fromText(TEST_TOKEN_PRINCIPAL),
    );
    const { bridge: initializedBridge } = await setupTests();
    bridge = initializedBridge;
  });

  beforeEach(async () => {
    await new Promise((resolve) => setTimeout(resolve, 5000));
  });

  describe("Add Operation points", () => {
    it("should return a TransactionReceipt", async () => {
      const result = await bridge.add_operation_points();
      expect(result).toEqual(expect.any(TransactionReceipt));
    });
  });

  describe("get_bft_bridge_contract", () => {
    it("should return the bridge contract address", async () => {
      const result = await bridge.get_bft_bridge_contract();

      expect(result).toEqual(expect.any(Address));
    });
  });

  describe("deploy_bft_wrapped_token icrc", () => {
    it("should return the wrapped token address", async () => {
      ercToken = await bridge.deploy_bft_wrapped_token(
        "Token",
        "TKN",
        tokenInId256,
      );

      expect(ercToken).toEqual(expect.any(Address));
    });
  });

  describe("Get base token principal from wrapped erc20 token address", () => {
    it("should return the base token principal", async () => {
      const result = await bridge.get_base_token(ercToken.getAddress());
      expect(result?.toText()).toEqual(canisterIds.token.local);
    });
  });

  describe("deploy_bft_wrapped_token icrc", () => {
    it("should return the wrapped token address", async () => {
      ercToken = await bridge.deploy_bft_wrapped_token(
        "Token",
        "TKN",
        tokenInId256,
      );

      expect(ercToken).toEqual(expect.any(Address));
    });
  });

  describe("burn icrc tokens and create erc20 mint order", () => {
    it("should return Ok result", async () => {
      operation_id = bridge.generateOperationId();
      const result = await bridge.burn_icrc2_tokens(
        Principal.fromText(canisterIds.token.local),
        1000000,
        operation_id,
      );
      signedMintOrder = result;
      expect(result).toEqual(expect.any(Uint8Array));
    });
  });

  describe("Mint ERC20 Token", () => {
    it("should return Transaction response", async () => {
      const result = await bridge.mintOrder(signedMintOrder!);
      console.log("mint result", result);
      expect(result).toEqual(expect.any(TransactionResponse));
    }, 60000);
  });

  describe("burn erc20 token", () => {
    it("should return hash string", async () => {
      burnTxHash = await bridge.burn_erc_20_tokens(ercToken, 1000000, 0);
      expect(burnTxHash).toEqual(expect.any(String));
    }, 60000);
  });

  describe("Get Operation id from burnt transaction hash", () => {
    it("should return a number", async () => {
      const result = await bridge.get_operation_id(
        Principal.fromText(canisterIds.evm.local),
        burnTxHash!,
      );
      operation_id = result ?? 0;
      expect(operation_id).toEqual(expect.any(Number));
    });
  });

  describe("mint icrc tokens after burning erc20 token", () => {
    it("should return Ok result", async () => {
      const result = await bridge.mint_icrc_tokens(
        operation_id,
        Principal.fromText(canisterIds.token.local),
      );
      console.log("mint icrc result", result);
      expect(result).toEqual(expect.any(BigInt));
    }, 120000);
  });

  describe("Get all cached Transaction", () => {
    it("should return a cached array", async () => {
      const cachedTxArray = await bridge.getCacheTx();
      const cachedMintTx = await bridge.getCacheTx(CACHE_KEYS.MINT);
      expect(cachedTxArray.length).toBeGreaterThan(0);
      expect(cachedMintTx.length).toBeGreaterThan(0);
    });
  });
});
