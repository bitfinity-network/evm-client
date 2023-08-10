import { Chain } from "../bridge-clients/chain";
import { IcConnector } from "../ic";
import { Address, AddressWithChainID, Id256Factory } from "../types/common";
import ethers, { Signer } from "ethers";
import { Principal } from "@dfinity/principal";
import { connectToWallet, getIdentity, mintTesttIcrcToken } from "../base";
import canisterIds from "../ic/canister_ids.json";
import { ApproveArgs } from "../ic/idl/icrc/icrc.did";
jest.setTimeout(30000);

const IC_HOST = "http://127.0.0.1:8080/";
const MINTER_CANISTER = "be2us-64aaa-aaaaa-qaabq-cai";
const sampleTokenPrincipal = "b77ix-eeaaa-aaaaa-qaada-cai";

describe("Bridge class", () => {
  let bridge: Chain;
  let Ic: IcConnector;

  beforeEach(async () => {
    await mintTesttIcrcToken();

    const identity = await getIdentity();
    console.log("identit", identity);
    Ic = new IcConnector({ host: IC_HOST, identity });
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
      const approveArgs: ApproveArgs = {
        fee: [],
        memo: [],
        from_subaccount: [],
        created_at_time: [],
        amount: BigInt(100000),
        expected_allowance: [],
        expires_at: [],
        spender: {
          owner: Principal.fromText(canisterIds.spender.local),
          subaccount: [],
        },
      };
      const result = await bridge.burnIcrcToken(
        approveArgs,
        Principal.fromText(canisterIds.token.local)
      );

      expect(result).toEqual(expect.any(Address));
    });
  });
});
