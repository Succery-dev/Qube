import { ethers } from "ethers";
import dotenv from "dotenv";
dotenv.config();

// JSON RPC Provider
// const LOCAL_NODE_URL = "http://127.0.0.1:8545/";
// const MUMBAI_NODE_URL = `https://polygon-mumbai.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_ALCHEMY_API_KEY}`;
const POLYGON_NODE_URL = `https://polygon-mainnet.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_ALCHEMY_API_KEY}`;
const jsonRpcProvider = new ethers.providers.JsonRpcProvider(POLYGON_NODE_URL);

export function getJsonRpcProvider(): ethers.providers.JsonRpcProvider {
  return jsonRpcProvider;
}

// Web3 Provider (e.t. Metamask)
let web3Provider: ethers.providers.Web3Provider | undefined;

export async function initializeWeb3Provider() {
  if (typeof window !== "undefined" && (window as any).ethereum) {
    await (window as any).ethereum.enable();
    web3Provider = new ethers.providers.Web3Provider((window as any).ethereum);
    console.log("web3Provider: ", web3Provider);
    web3Provider.listAccounts().then(accounts => console.log("Accounts:", accounts));
    web3Provider.getNetwork().then(network => console.log("Network:", network));
  }
}

export function getWeb3Provider(): ethers.providers.Web3Provider | undefined {
  if (!web3Provider) {
    throw new Error("Web3 provider is not initialized. Please call initializeWeb3Provider() first.");
  }
  return web3Provider;
}

export function getSigner(): ethers.providers.JsonRpcSigner | undefined {
  if (!web3Provider) {
    throw new Error("Web3 provider is not initialized. Please call initializeWeb3Provider() first.");
  }
  const signer = web3Provider.getSigner();
  signer.getAddress().then(address => console.log("Signer address:", address));
  return signer;
}