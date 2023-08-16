import { setupTests } from "./test-setup";
import { Chain } from "../bridge/chain";
import {
  Address,
  AddressWithChainID,
  Id256,
  Id256Factory,
} from "../validation";
import { Principal } from "@dfinity/principal";
import canisterIds from "../ic/canister_ids.json";
import { TEST_TOKEN_PRINCIPAL } from "../constants";
import { TransactionResponse, ethers } from "ethers";
jest.setTimeout(30000);

describe("Bridge class", () => {
  let bridge: Chain;
  let signedMintOrder: ethers.BytesLike;
  let ercToken: Address;
  let tokenInId256: Id256;
  let burnTxHash: string | undefined;

  beforeAll(async () => {
    tokenInId256 = Id256Factory.fromPrincipal(
      Principal.fromText(TEST_TOKEN_PRINCIPAL)
    );
    const { bridge: initializedBridge } = await setupTests();
    bridge = initializedBridge;
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

  describe("deploy_bft_wrapped_token icrc", () => {
    it("should return the wrapped token address", async () => {
      ercToken = await bridge.deploy_bft_wrapped_token(
        "Token",
        "TKN",
        tokenInId256
      );

      expect(ercToken).toEqual(expect.any(Address));
    });
  });

  describe("burn icrc tokens and create erc20 mint order", () => {
    it("should return Ok result", async () => {
      const result = await bridge.burn_icrc2_tokens(
        Principal.fromText(canisterIds.token.local),
        1000000
      );
      signedMintOrder = result;
      expect(result).toEqual(expect.any(Uint8Array));
    });
  });

  describe("Mint ERC20 Token", () => {
    it("should return Transaction response", async () => {
      const result = await bridge.mintOrder(signedMintOrder);
      console.log("mint result", result);
      expect(result).toEqual(expect.any(TransactionResponse));
    });
  });

  describe("burn erc20 token", () => {
    it("should return hash string", async () => {
      burnTxHash = await bridge.burn_erc_20_tokens(
        ercToken,
        tokenInId256,
        1000000,
        0
      );
      console.log("burn erc20 result", burnTxHash);
      expect(burnTxHash).toEqual(expect.any(String));
    });
  });

  describe("mint icrc tokens after burning erc20 token", () => {
    it("should return Ok result", async () => {
      const result = await bridge.mint_icrc_tokens(
        burnTxHash!,
        1000000,
        Principal.fromText(canisterIds.spender.local),
        Principal.fromText(canisterIds.token.local)
      );
      console.log("mint icrc result", result);
      expect(result).toEqual(expect.any(BigInt));
    });
  });
});
