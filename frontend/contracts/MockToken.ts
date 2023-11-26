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

  // 動的にガス価格を取得する
  const gasPrice = await signer.getGasPrice();
  console.log(`gasPrice: ${ethers.utils.formatUnits(gasPrice, "gwei")}gwei`);

  // 推定ガスリミットを取得する
  const estimatedGasLimit = await contract.estimateGas.approve(spender, amount).catch((error) => {
  console.error("Error estimating gas:", error);
  return ethers.BigNumber.from("100000"); // フォールバックとしてデフォルト値を設定
  });
  console.log("estimatedGasLimit: ", estimatedGasLimit.toString());

  // ガスリミットにバッファを加える（例: 推定値の20%を加える）
  const gasLimitWithBuffer = estimatedGasLimit.mul(120).div(100);
  console.log("gasLimitWithBuffer: ", gasLimitWithBuffer.toString());

  const tx = await contract.approve(spender, amount, {
  gasPrice: gasPrice, // 動的に取得したガス価格を使用
  gasLimit: gasLimitWithBuffer // バッファ付きのガスリミットを設定
  });

  return await tx.wait();
}

export async function allowance(owner: string, spender: string, tokenAddress: string) {
  const signer = getSigner();
  const contract = getMockTokenContract(signer, tokenAddress);
  return await contract.allowance(owner, spender);
}