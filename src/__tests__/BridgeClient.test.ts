import Web3 from "web3";
import { Bridge } from "../";
import { IcConnector } from "../ic";
import { Address, AddressWithChainID, Id256Factory } from "../types/common";
import { mockIc, mockWeb3, sampleAddress } from "../mocks/mock"; // Update the path to your mocks file

jest.mock("web3", () => {
  return jest.fn(() => mockWeb3); // Mock Web3 with the mockWeb3 object
});

const RPC_URL = "http://127.0.0.1:8545";
const IC_HOST = "http://127.0.0.1:8080/";
const MINTER_CANISTER = "be2us-64aaa-aaaaa-qaabq-cai";

describe("Bridge class", () => {
  let bridge: Bridge;
  let minterCanister: string;
  let Ic: IcConnector;

  beforeEach(() => {
    // Ic = new IcConnector({ host: IC_HOST }); // Initialize with appropriate values
    bridge = new Bridge(MINTER_CANISTER, mockIc as any);
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

  describe("get_wrapped_token_address", () => {
    it("should return the wrapped token address", async () => {
      const w3 = new Web3(RPC_URL);

      // Set up mock response for .call() method
      const fromToken = new AddressWithChainID(sampleAddress, 355113);
      const buf = Id256Factory.fromAddress(fromToken);
      const result = await bridge.get_wrapped_token_address(w3, buf);
      expect(result).toEqual(expect.any(String));
    });
  });

  describe("deploy_bft_wrapped_token", () => {
    it("should return the wrapped token address", async () => {
      const w3 = new Web3(RPC_URL);

      // Set up mock response for .call() method
      const fromToken = new AddressWithChainID(sampleAddress, 355113);
      const buf = Id256Factory.fromAddress(fromToken);
      const result = await bridge.deploy_bft_wrapped_token(
        w3,
        "Token",
        "TKN",
        buf,
        sampleAddress
      );
      console.log("result", result);
      expect(result).toEqual(expect.any(Address));
    });
  });
});
