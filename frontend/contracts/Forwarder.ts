import { Contract } from "ethers";
import { getJsonRpcProvider } from "../utils/ethers";
import deployedContracts from "../../backend/deploy.mumbai.json";
import ForwarderAbi from "./abi/forwarder.json";

export function getForwarderContract(): Contract {
  const provider = getJsonRpcProvider();
  return new Contract(deployedContracts.ERC2771Forwarder, ForwarderAbi, provider);
}