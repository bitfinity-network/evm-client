import { Signer, ethers } from "ethers";
import { mnemonicToSeed } from "bip39";
import { Secp256k1KeyIdentity } from "@dfinity/identity-secp256k1";
import erc20TokenAbi from "../abi/erc20Token.json";
import canisterIds from "../ic/canister_ids.json";
import { LOCAL_TEST_SEED_PHRASE, RPC_URL } from "../constants";
import { exec } from "child_process";
import hdkey from "hdkey";

export const connectToWallet = async (
  netWorkName: string = "Bitfinity Network",
  chainId: number = 355113,
) => {
  const provider = new ethers.JsonRpcProvider(RPC_URL, {
    chainId,
    name: netWorkName,
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

export const mintTesttIcrcToken = async () => {
  const id = await identityFromSeed(LOCAL_TEST_SEED_PHRASE);
  const principalText = id.getPrincipal().toText();
  const mintCommand = `dfx canister call ${canisterIds.token.local} icrc1_transfer '(record { to = record { owner = principal "${principalText}"; }; amount = 1000000000:nat;})'`;
  exec(mintCommand, (error: Error | null, stdout: string, stderr: string) => {
    if (error) {
      console.error(`Error: ${error.message}`);
      return;
    }
    if (stderr) {
      console.error(`stderr: ${stderr}`);
      return;
    }
    console.log(`stdout: ${stdout}`);
  });
};

export const identityFromSeed = async (
  phrase: string,
): Promise<Secp256k1KeyIdentity> => {
  const seed = await mnemonicToSeed(phrase);
  const root = hdkey.fromMasterSeed(seed);
  const addrnode = root.derive("m/44'/223'/0'/0/0");

  const id = Secp256k1KeyIdentity.fromSecretKey(addrnode.privateKey);
  return id;
};

export const getIdentity = async () => {
  return await identityFromSeed(LOCAL_TEST_SEED_PHRASE);
};

export async function deployERC20Token(signer: Signer) {
  // Deploy the ERC20 token contract
  const ERC20TokenContractFactory = new ethers.ContractFactory(
    erc20TokenAbi.abi,
    erc20TokenAbi.bytecode,
    signer,
  );
  const contract = await ERC20TokenContractFactory.deploy();
  await contract.waitForDeployment();
  return await contract.getAddress();
}
