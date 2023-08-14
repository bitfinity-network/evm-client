import { IcConnector } from "../ic";
import { connectToWallet, getIdentity, mintTesttIcrcToken } from "./utils";
import { Chain } from "../bridge/chain";
import { IC_HOST, MINTER_CANISTER } from "../constants";

export const setupTests = async () => {
  await mintTesttIcrcToken();
  const identity = await getIdentity();
  const Ic = new IcConnector({ host: IC_HOST, identity });
  const { provider, wallet } = await connectToWallet();
  const bridge = new Chain(MINTER_CANISTER, Ic, wallet, provider);
  return { bridge };
};
