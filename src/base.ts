import { ethers } from "ethers";

const RPC_URL = "http://127.0.0.1:8545";

export const connectToWallet = async () => {
  const provider = new ethers.JsonRpcProvider(RPC_URL, {
    chainId: 355113,
    name: "Bitfinity Network",
  });
  const { privateKey, address } = ethers.Wallet.createRandom();
  await mintNativeToken(address);
  const wallet = new ethers.Wallet(privateKey, provider);
  wallet.connect(provider);
  return { wallet, provider };
};

export const mintNativeToken = async (address: string) => {
  const requestData = {
    jsonrpc: "2.0",
    id: "1",
    method: "ic_mintNativeToken",
    params: [address, "0x56BC75E2D63100000"],
  };
  const requestOptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(requestData),
  };
  try {
    const response = await fetch(RPC_URL, requestOptions);
    const data = await response.json();
    console.log("Response:", data);
  } catch (error) {
    console.error("Error:", error);
  }
};
