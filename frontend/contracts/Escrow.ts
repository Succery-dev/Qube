import { ethers } from "ethers";
import { getSigner } from "../utils/ethers";
import EscrowArtifact from "../../backend/artifacts/contracts/Escrow.sol/Escrow.json";

// export const EscrowAddress = "0x0A2Dd392CBb168fE2aFe63C85a9cC7FD9b100892";
// export const EscrowAddress = "0x99404C0d2dE049111bAE676e9D36Fab4080F4E20";
export const EscrowAddress = "0xC4b96eF9eeA15e7c05FB429d36Fa6fFfDDB2DF01";

export function getEscrowContract(signer: ethers.Signer): ethers.Contract {
  return new ethers.Contract(EscrowAddress, EscrowArtifact.abi, signer);
}

export async function depositTokens(recipient: string, amount: ethers.BigNumberish, depositId: string) {
  const signer = getSigner();
  const contract = getEscrowContract(signer);
  const tx = await contract.depositTokens(recipient, amount, depositId);
  return await tx.wait();
}

export async function withdrawTokensToRecipientByDepositor(depositId: string) {
  const signer = getSigner();
  const contract = getEscrowContract(signer);
  const tx = await contract.withdrawTokensToRecipientByDepositor(depositId);
  return await tx.wait();
}

export async function getDepositedAmount() {
  const signer = getSigner();
  const contract = getEscrowContract(signer);
  const address = await signer.getAddress();
  return await contract.deposits(address).then((amount: ethers.BigNumberish) => ethers.utils.formatEther(amount));
}