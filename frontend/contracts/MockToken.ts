import { ethers } from "ethers";
import { getSigner, getJsonRpcProvider } from "../utils/ethers";
// import MockTokenArtifact from "../../backend/artifacts/contracts/mocks/MockToken.sol/MockToken.json";
import USDCMumbai from "./USDC_mumbai.json";
import USDC from "./USDC.json";
import Erc20Abi from "./abi/erc20.json";

const MockTokenAddress = "0x0FA8781a83E46826621b3BC094Ea2A0212e71B23";

export function getMockTokenContract(signerOrProvider: ethers.Signer | ethers.providers.Provider, tokenAddress: string): ethers.Contract {
  return new ethers.Contract(tokenAddress, Erc20Abi, signerOrProvider);
}

export async function approve(spender: string, amount: ethers.BigNumberish, tokenAddress: string) {
  const signer = getSigner();
  const contract = getMockTokenContract(signer, tokenAddress);
  const tx = await contract.approve(spender, amount, {
    gasPrice: ethers.utils.parseUnits("100", "gwei")
  });
  return await tx.wait();
}

export async function allowance(owner: string, spender: string, tokenAddress: string) {
  const signer = getSigner();
  const contract = getMockTokenContract(signer, tokenAddress);
  return await contract.allowance(owner, spender);
}