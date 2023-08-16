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
  let wrappedToken: Address;
  let tokenInId256: Id256;
  let burnTxHash: string | undefined;

  beforeAll(async () => {
    const { bridge: initializedBridge, erc20TokenAddress } = await setupTests();
    bridge = initializedBridge;

    ercToken = new Address(erc20TokenAddress);
    tokenInId256 = Id256Factory.fromAddress(
      new AddressWithChainID(erc20TokenAddress, await bridge.get_chain_id())
    );
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
        tokenInId256
      );

      expect(wrappedToken).toEqual(expect.any(Address));
    });
  });

  describe("burn erc20 tokens", () => {
    it("should return the wrapped token address", async () => {
      await bridge.burn_erc_20_tokens(
        wrappedToken,
        tokenInId256,
        1000000,
        await bridge.get_chain_id()
      );

      expect(ercToken).toEqual(expect.any(Address));
    });
  });
});
