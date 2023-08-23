import caninsterIds from "./ic/canister_ids.json";
import dotenv from "dotenv";
dotenv.config();

export const RPC_URL = process.env.RPC_URL || "http://127.0.0.1:8545";
export const IC_HOST = process.env.IC_HOST || "http://127.0.0.1:8000/";
export const LOCAL_TEST_SEED_PHRASE = process.env.LOCAL_TEST_SEED_PHRASE || "";
export const DEFAULT_IDENTITY = process.env.PEM_FILE_PATH || "";
export const TEST_TOKEN_PRINCIPAL = caninsterIds.token.local;
export const MINTER_CANISTER = caninsterIds.minter.local;

// Cache Keys
export const CACHE_KEYS = {
  BURNT_TX: "evm_client_burnt_tx_hash",
  MINT_ORDER: "evm_client_mint_order",
  MINT: "evm_client_mint",
};
