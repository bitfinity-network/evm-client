import { IcConnector } from "../ic"; // Update the path to your IcConnector module
import Web3 from "web3";
export const mockIc = {
  actor: jest.fn().mockReturnValue({
    get_bft_bridge_contract: jest
      .fn()
      .mockResolvedValueOnce(["0xe61a469bba251d21e4442dffabbc76a77530b443"]),
    // ... mock other methods as needed ...
  }),
};

export const mockWeb3 = {
  eth: {
    getChainId: jest.fn().mockResolvedValue(355113),
    // ... mock other methods as needed ...
  },
};

export { IcConnector, Web3 };
