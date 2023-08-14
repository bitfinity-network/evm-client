import { setupTests } from "./test-setup";
import { Chain } from "../bridge/chain";
import { Address, AddressWithChainID, Id256Factory } from "../validation";
import { Principal } from "@dfinity/principal";
import canisterIds from "../ic/canister_ids.json";
import { TEST_TOKEN_PRINCIPAL } from "../constants";
jest.setTimeout(30000);

describe("Bridge class", () => {
  let bridge: Chain;

  beforeAll(async () => {
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
      const buf = Id256Factory.fromPrincipal(
        Principal.fromText(TEST_TOKEN_PRINCIPAL)
      );
      const result = await bridge.deploy_bft_wrapped_token("Token", "TKN", buf);
      expect(result).toEqual(expect.any(Address));
    });
  });

  describe("burn ", () => {
    it("should return Ok result", async () => {
      const buf = Id256Factory.fromPrincipal(
        Principal.fromText(TEST_TOKEN_PRINCIPAL)
      );
      const result = await bridge.burn_icrc2_tokens(
        Principal.fromText(canisterIds.token.local),
        1000000
      );

      expect(result).toEqual(expect.any(Address));
    });
  });
});
