import {ethers, Wallet} from "ethers";
import EscrowAbi from "./escrow.json";
import dotenv from "dotenv";
dotenv.config();

const LOCAL_NODE_URL = process.env.NODE_URL;
const jsonRpcProvider = new ethers.providers.JsonRpcProvider(LOCAL_NODE_URL);

const ownerPrivateKey = process.env.SECRET_KEY;
if (!ownerPrivateKey) {
  throw new Error("OWNER_PRIVATE_KEY is not defined in .env");
}
const ownerWallet = new Wallet(ownerPrivateKey, jsonRpcProvider);

const EscrowAddress = process.env.ESCROW_ADDRESS as string;

// Get escrow contract
/**
 * This is for getting an escrow contract
 *
 * @param {ethers.Signer | ethers.Provider} signerOrProvider
 *  - A signer or provider to create a contract instance
 * @return {ethers.Contract} - An escrow contract instance
 */
function getEscrowContract(
  signerOrProvider: ethers.Signer | ethers.providers.Provider
): ethers.Contract {
  return new ethers.Contract(
    EscrowAddress, EscrowAbi, signerOrProvider
  );
}

/**
 * Withdraws tokens to the depositor by the owner.
 *
 * @param {string} depositId - The ID of the deposit.
 * @return {Promise<TransactionResponse>}
 *  A promise that resolves to a transaction response.
 */
export async function withdrawToDepositorByOwner(depositId: string) {
  const contract = getEscrowContract(ownerWallet);
  const tx = await contract.withdrawToDepositorByOwner(depositId, {
    gasPrice: ethers.utils.parseUnits("90", "gwei")
  });
  return await tx.wait();
}

/**
 * Withdraws tokens to the recipient by the owner.
 *
 * @param {string} depositId - The ID of the deposit.
 * @return {Promise<TransactionResponse>}
 *  A promise that resolves to a transaction response.
 */
export async function withdrawToRecipientByOwner(depositId: string) {
  const contract = getEscrowContract(ownerWallet);
  const tx = await contract.withdrawToRecipientByOwner(depositId, {
    gasPrice: ethers.utils.parseUnits("90", "gwei")
  });
  return await tx.wait();
}