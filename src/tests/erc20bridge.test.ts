import { setupTests } from "./test-setup";
import { Chain } from "../bridge/chain";
import {
  Address,
  AddressWithChainID,
  Id256,
  Id256Factory,
} from "../validation";
import { TransactionResponse } from "ethers";
import { CACHE_KEYS } from "../constants";
jest.setTimeout(30000);

describe("Bridge class", () => {
  let bridge: Chain;
  let ercToken: Address;
  let wrappedToken: Address;
  let tokenInId256: Id256;
  let burnTxHash: string | undefined;
  let chainId: number;

  beforeAll(async () => {
    const { bridge: initializedBridge, erc20TokenAddress } = await setupTests();
    bridge = initializedBridge;

    ercToken = new Address(erc20TokenAddress);
    tokenInId256 = Id256Factory.fromAddress(
      new AddressWithChainID(erc20TokenAddress, await bridge.get_chain_id()),
    );
    chainId = await bridge.get_chain_id();
  });

  afterAll(() => {
    jest.clearAllMocks();
  });

  describe("get_bft_bridge_contract", () => {
    it("should return the bridge contract address", async () => {
      const result = await bridge.get_bft_bridge_contract();
      expect(result).toEqual(expect.any(Address));
    });
  });

  describe("deploy_bft_wrapped_token of erc20 token", () => {
    it("should return the wrapped token address", async () => {
      wrappedToken = await bridge.deploy_bft_wrapped_token(
        "Token",
        "TKN",
        tokenInId256,
      );

      expect(wrappedToken).toEqual(expect.any(Address));
    });
  });

  describe("burn erc20 tokens", () => {
    it("should return the wrapped token address", async () => {
      burnTxHash = await bridge.burn_erc_20_tokens(ercToken, 1000000, chainId);

      expect(burnTxHash).toEqual(expect.any(String));
    });
  });

  describe("Create mint order and mint wrapped erc20 token", () => {
    it("should return the wrapped token address", async () => {
      const result = await bridge.mint_erc_20_tokens(burnTxHash!, chainId);
      expect(result).toEqual(expect.any(TransactionResponse));
    });
  });

  describe("Check Wrapped Token balance", () => {
    it("should return the wrapped token address", async () => {
      const result = await bridge.check_erc20_balance(wrappedToken);
      expect(Number(result)).toBeGreaterThan(0);
    });
  });

  describe("burn wrapped tokens", () => {
    it("should return the wrapped token address", async () => {
      burnTxHash = await bridge.burn_erc_20_tokens(
        wrappedToken,
        1000000,
        chainId,
      );

      expect(burnTxHash).toEqual(expect.any(String));
    });
  });

  describe("Create mint order and mint erc20 tokens back", () => {
    it("should return the wrapped token address", async () => {
      const result = await bridge.mint_erc_20_tokens(burnTxHash!, chainId);
      expect(result).toEqual(expect.any(TransactionResponse));
    });
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
