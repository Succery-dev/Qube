import { ethers } from "ethers";

// JSON RPC Provider
const LOCAL_NODE_URL = "http://127.0.0.1:8545/";
const jsonRpcProvider = new ethers.JsonRpcProvider(LOCAL_NODE_URL);

export function getJsonRpcProvider(): ethers.JsonRpcProvider {
  return jsonRpcProvider;
}

// Web3 Provider (e.t. Metamask)
let web3Provider: ethers.BrowserProvider | undefined;

export function initializeWeb3Provider() {
  if (typeof window !== "undefined" && (window as any).ethereum) {
    web3Provider = new ethers.BrowserProvider((window as any).ethereum);
  }
}

export function getWeb3Provider(): ethers.BrowserProvider | undefined {
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