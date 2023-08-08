import { AbiItem } from "web3-utils";
import { IcConnector } from "../ic"; // Update the path to your IcConnector module
import Web3 from "web3";

export const sampleAddress = "0xe61a469bba251d21e4442dffabbc76a77530b443";
export const mockIc = {
  actor: jest.fn().mockReturnValue({
    get_bft_bridge_contract: jest.fn().mockResolvedValue([sampleAddress]),
  }),
};

export const mockWeb3 = {
  eth: {
    Contract: jest.fn(() => {
      const mockContractInstance = {
        methods: {
          getWrappedToken: jest.fn().mockReturnValue({
            call: jest.fn().mockResolvedValue(sampleAddress),
          }),
          deployERC20: jest.fn().mockReturnValue({
            send: jest.fn().mockResolvedValue({
              events: {
                NewWrappedToken: {
                  returnValues: { wrappedAddress: sampleAddress },
                },
              },
            }),
          }),
          // deployERC20: jest.fn().mockReturnThis(),
        },
      };
      return mockContractInstance as unknown as any; // Cast as Contract
    }),
    getChainId: jest.fn().mockResolvedValue(355113),
    // ... mock other methods as needed ...
  },
};

export { IcConnector, Web3 };
