import { ethers } from "ethers";
import { getSigner, getJsonRpcProvider } from "../utils/ethers";
import MockTokenArtifact from "../../backend/artifacts/contracts/mocks/MockToken.sol/MockToken.json";

const MockTokenAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";

export function getMockTokenContract(signer: ethers.Signer): ethers.Contract {
  return new ethers.Contract(MockTokenAddress, MockTokenArtifact.abi, signer);
}

export async function balanceOf(account: string) {
  const provider = getJsonRpcProvider();
  const contract = getMockTokenContract(provider);
  return ethers.formatEther(await contract.balanceOf(account));
}

export async function transfer(recipient: string, amount: ethers.BigNumberish) {
  const signer = getSigner();
  const contract = getMockTokenContract(signer);
  const tx = await contract.transfer(recipient, amount);
  return await tx.wait();
}

export async function approve(spender: string, amount: ethers.BigNumberish) {
  const signer = getSigner();
  const contract = getMockTokenContract(signer);
  const tx = await contract.approve(spender, amount);
  return await tx.wait();
}

export async function allowance(owner: string, spender: string) {
  const signer = getSigner();
  const contract = getMockTokenContract(signer);
  return await contract.allowance(owner, spender);
}

export async function mint(to: string, amount: ethers.BigNumberish) {
  const signer = getSigner();
  const contract = getMockTokenContract(signer);
  const tx = await contract.mint(to, amount);
  return await tx.wait();
}