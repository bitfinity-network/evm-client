import Web3 from "web3";
import { Bridge } from "../";
import { IcConnector, MinterService } from "../ic";
import { Principal } from "@dfinity/principal";
import { MintReason } from "../ic/idl/minter/minter.did";
import { Address } from "../types/common";

const RPC_URL = "http://127.0.0.1:8545";
const IC_HOST = "http://127.0.0.1:8080/";
const MINTER_CANISTER = "be2us-64aaa-aaaaa-qaabq-cai";

describe("Bridge class", () => {
  let bridge: Bridge;
  let minterCanister: string;
  let Ic: IcConnector;

  beforeEach(() => {
    Ic = new IcConnector({ host: IC_HOST }); // Initialize with appropriate values
    bridge = new Bridge(MINTER_CANISTER, Ic);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("get_bft_bridge_contract", () => {
    it("should return the bridge contract address", async () => {
      const w3 = new Web3(RPC_URL);
      const result = await bridge.get_bft_bridge_contract(w3);

      expect(result).toEqual(expect.any(Address));
    });
  });
});
