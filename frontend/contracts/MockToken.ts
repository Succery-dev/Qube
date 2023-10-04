import { ethers } from "ethers";
import { getSigner, getJsonRpcProvider } from "../utils/ethers";
// import MockTokenArtifact from "../../backend/artifacts/contracts/mocks/MockToken.sol/MockToken.json";
import USDCMumbai from "./USDC_mumbai.json";
// import USDC from "./USDC.json"

const MockTokenAddress = "0x0FA8781a83E46826621b3BC094Ea2A0212e71B23";

export function getMockTokenContract(signerOrProvider: ethers.Signer | ethers.providers.Provider): ethers.Contract {
  return new ethers.Contract(MockTokenAddress, USDCMumbai, signerOrProvider);
}

export async function balanceOf(account: string) {
  const provider = getJsonRpcProvider();
  const contract = getMockTokenContract(provider);
  return ethers.utils.formatEther(await contract.balanceOf(account));
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
  const tx = await contract.approve(spender, amount, {
    gasPrice: ethers.utils.parseUnits("100", "gwei")
  });
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

export async function implementation() {
  const signer = getSigner();
  const contract = getMockTokenContract(signer);
  return await contract.implementation();
}