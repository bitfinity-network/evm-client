import { Signer, ethers } from "ethers";
import { mnemonicToSeed } from "bip39";
import { Secp256k1KeyIdentity } from "@dfinity/identity-secp256k1";
import { Actor, ActorMethod, ActorSubclass, Identity } from "@dfinity/agent";
import { Principal } from "@dfinity/principal";
import { createAgent } from "@dfinity/utils";
import { IDL } from "@dfinity/candid";
import erc20TokenAbi from "../abi/erc20Token.json";
import fs from "fs";
import { Ed25519KeyIdentity } from "@dfinity/identity";
import {
  DEFAULT_IDENTITY,
  IC_HOST,
  LOCAL_TEST_SEED_PHRASE,
  RPC_URL,
} from "../constants";
const { exec, spawn } = require("child_process");

const hdkey = require("hdkey");
const pemfile = require("pem-file");

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

export const mintTesttIcrcToken = async () => {
  const id = await identityFromSeed(LOCAL_TEST_SEED_PHRASE);
  const principalText = id.getPrincipal().toText();
  const mintCommand = `dfx canister call b77ix-eeaaa-aaaaa-qaada-cai icrc1_transfer '(record { to = record { owner = principal "${principalText}"; }; amount = 1000000000:nat;})'`;
  exec(mintCommand, (error: any, stdout: any, stderr: any) => {
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
  phrase: string
): Promise<Secp256k1KeyIdentity> => {
  const seed = await mnemonicToSeed(phrase);
  const root = hdkey.fromMasterSeed(seed);
  const addrnode = root.derive("m/44'/223'/0'/0/0");

  const id = Secp256k1KeyIdentity.fromSecretKey(addrnode.privateKey);
  return id;
};

export const IcConnector = async <T = Record<string, ActorMethod>>(
  canisterId: string | Principal,
  idl: IDL.InterfaceFactory
): Promise<ActorSubclass<T>> => {
  const identity = await decodeFile(DEFAULT_IDENTITY);
  const agent = await createAgent({ identity, host: IC_HOST });
  return Actor.createActor(idl, { agent, canisterId });
};

export const getIdentity = async () => {
  return await identityFromSeed(LOCAL_TEST_SEED_PHRASE);
};

export function decodeFile(file: string) {
  console.log("file", file);
  const rawKey = fs.readFileSync(file).toString();
  console.log("before trim", rawKey.length);
  const trimmedPattern = rawKey
    .replace(
      /(-----BEGIN EC PRIVATE KEY-----|-----END EC PRIVATE KEY-----)/g,
      ""
    )
    .trim();
  console.log("rawkey", trimmedPattern);
  console.log("after trim", trimmedPattern.length);

  return decode(rawKey);
}

export function decode(rawKey: string) {
  var buf = pemfile.decode(rawKey);
  console.log("buf", buf.length, buf);
  if (buf.length != 85) {
    throw "expecting byte length 85 but got " + buf.length;
  }
  let secretKey = Buffer.concat([buf.slice(16, 48), buf.slice(53, 85)]);
  return Ed25519KeyIdentity.fromSecretKey(secretKey);
}

export async function deployERC20Token(signer: Signer) {
  // Deploy the ERC20 token contract
  const ERC20TokenContractFactory = new ethers.ContractFactory(
    erc20TokenAbi.abi,
    erc20TokenAbi.bytecode,
    signer
  );
  const contract = await ERC20TokenContractFactory.deploy();
  await contract.waitForDeployment();
  return await contract.getAddress();
}
