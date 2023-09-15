import { ethers } from "ethers";

// JSON RPC Provider
const LOCAL_NODE_URL = "http://127.0.0.1:8545/";
const jsonRpcProvider = new ethers.providers.JsonRpcProvider(LOCAL_NODE_URL);

export function getJsonRpcProvider(): ethers.providers.JsonRpcProvider {
  return jsonRpcProvider;
}

// Web3 Provider (e.t. Metamask)
let web3Provider: ethers.providers.Web3Provider | undefined;

export function initializeWeb3Provider() {
  if (typeof window !== "undefined" && (window as any).ethereum) {
    web3Provider = new ethers.providers.Web3Provider((window as any).ethereum);
  }
}

export function getWeb3Provider(): ethers.providers.Web3Provider | undefined {
  if (!web3Provider) {
    throw new Error("Web3 provider is not initialized. Please call initializeWeb3Provider() first.");
  }
  return web3Provider;
}

export function getSigner() {
  if (!web3Provider) {
    throw new Error("Web3 provider is not initialized. Please call initializeWeb3Provider() first.");
  }
  return web3Provider.getSigner();
}