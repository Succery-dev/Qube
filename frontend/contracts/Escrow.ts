import { ethers, Contract, BigNumber, BigNumberish, utils } from "ethers";
import { getSigner } from "../utils/ethers";
import { signMetaTxRequest } from "../utils/signer";
import deployedContracts from "../../backend/deploy.json";
import EscrowAbi from "./abi/escrow.json";
import { getForwarderContract } from "./Forwarder";

export function getEscrowContract(): Contract {
  const signer = getSigner();
  return new Contract(deployedContracts.Escrow, EscrowAbi, signer);
}

async function sendMetaTx(contract: Contract, signer: ethers.providers.JsonRpcSigner, methodName: string, args: any[]): Promise<string> {
  console.log(`Sending ${methodName} meta-tx`);

  const url = process.env.NEXT_PUBLIC_WEBHOOK_URL;
  if (!url) throw new Error("Missing relayer url");

  const forwarder = getForwarderContract();
  const from = await signer.getAddress();
  const data = contract.interface.encodeFunctionData(methodName, args);
  const to = contract.address;
  
  const signedRequest = await signMetaTxRequest(signer, forwarder, { to, from, data });

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(signedRequest),
    });

    console.log("response: ", response);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const responseData = await response.json();
    console.log("responseData: ", responseData);
    const parsedResult = JSON.parse(responseData.result);
    return parsedResult.txHash;

  } catch (error) {
    console.error(`Failed to send meta-transaction: ${error}`);
    throw error;
  }
}

export async function depositTokens(recipient: string, amount: BigNumber, depositId: string): Promise<string> {
  const signer = getSigner();
  const contract = getEscrowContract();

  try {
    const txHash = await sendMetaTx(contract, signer, "depositTokens", [recipient, amount, depositId]);
    console.log(`Transaction successful: ${txHash}`);
    return txHash;
  } catch (error) {
    console.error(`Transaction failed: ${error}`);
  }
}

export async function withdrawTokensToRecipientByDepositor(depositId: string) {
  const signer = getSigner();
  const contract = getEscrowContract();

  try {
    const txHash = await sendMetaTx(contract, signer, "withdrawTokensToRecipientByDepositor", [depositId]);
    console.log(`Transaction successful: ${txHash}`);
    return txHash;
  } catch (error) {
    console.error(`Transaction failed: ${error}`);
  }
}

export async function getDepositedAmount() {
  const signer = getSigner();
  const contract = getEscrowContract();
  const address = await signer.getAddress();
  return await contract.deposits(address).then((amount: BigNumberish) => utils.formatEther(amount));
}