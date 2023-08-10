import { Chain } from "../bridge-clients/chain";
import { IcConnector } from "../ic";
import { Address, AddressWithChainID, Id256Factory } from "../types/common";
import ethers, { Signer } from "ethers";
import { Principal } from "@dfinity/principal";
import { connectToWallet } from "../base";

jest.setTimeout(30000);

const IC_HOST = "http://127.0.0.1:8080/";
const MINTER_CANISTER = "be2us-64aaa-aaaaa-qaabq-cai";
const sampleTokenPrincipal = "b77ix-eeaaa-aaaaa-qaada-cai";

describe("Bridge class", () => {
  let bridge: Chain;
  let Ic: IcConnector;

  beforeEach(async () => {
    Ic = new IcConnector({ host: IC_HOST });
    const { provider, wallet } = await connectToWallet();
    console.log("provider", provider);
    console.log("signer", wallet);
    bridge = new Chain(MINTER_CANISTER, Ic, wallet);
  });

  afterEach(() => {
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
        Principal.fromText(sampleTokenPrincipal)
      );
      const result = await bridge.deploy_bft_wrapped_token("Token", "TKN", buf);
      expect(result).toEqual(expect.any(Address));
    });
  });

  describe("burn ", () => {
    it("should return Ok result", async () => {
      const buf = Id256Factory.fromPrincipal(
        Principal.fromText(sampleTokenPrincipal)
      );
      const result = await bridge.deploy_bft_wrapped_token("Token", "TKN", buf);
      expect(result).toEqual(expect.any(Address));
    });
  });
});
