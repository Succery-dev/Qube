import { ethers } from "ethers";
import { getSigner } from "../utils/ethers";
import EscrowArtifact from "../../backend/artifacts/contracts/Escrow.sol/Escrow.json";

// export const EscrowAddress = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512";
export const EscrowAddress = "0x99404C0d2dE049111bAE676e9D36Fab4080F4E20";
// export const EscrowAddress = "0xC4b96eF9eeA15e7c05FB429d36Fa6fFfDDB2DF01";

export function getEscrowContract(signer: ethers.Signer): ethers.Contract {
  return new ethers.Contract(EscrowAddress, EscrowArtifact.abi, signer);
}

export async function depositTokens(recipient: string, amount: ethers.BigNumberish, depositId: string) {
  const signer = getSigner();
  const contract = getEscrowContract(signer);
  const tx = await contract.depositTokens(recipient, amount, depositId, {
    gasPrice: ethers.utils.parseUnits("100", "gwei")
  });
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