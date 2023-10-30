import { Contract, ContractTransaction } from "ethers";
import { DefenderRelaySigner, DefenderRelayProvider } from "@openzeppelin/defender-relay-client/lib/ethers";
import * as dotenv from "dotenv";
dotenv.config();

const ForwarderAbi = [
  {
    "inputs": [],
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "inputs": [
      {
        "components": [
          { "internalType": "address", "name": "from", "type": "address" },
          { "internalType": "address", "name": "to", "type": "address" },
          { "internalType": "uint256", "name": "value", "type": "uint256" },
          { "internalType": "uint256", "name": "gas", "type": "uint256" },
          { "internalType": "uint256", "name": "nonce", "type": "uint256" },
          { "internalType": "bytes", "name": "data", "type": "bytes" }
        ],
        "internalType": "struct MinimalForwarder.ForwardRequest",
        "name": "req",
        "type": "tuple"
      },
      { "internalType": "bytes", "name": "signature", "type": "bytes" }
    ],
    "name": "execute",
    "outputs": [
      { "internalType": "bool", "name": "", "type": "bool" },
      { "internalType": "bytes", "name": "", "type": "bytes" }
    ],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "inputs": [
      { "internalType": "address", "name": "from", "type": "address" }
    ],
    "name": "getNonce",
    "outputs": [
      { "internalType": "uint256", "name": "", "type": "uint256" }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "components": [
          { "internalType": "address", "name": "from", "type": "address" },
          { "internalType": "address", "name": "to", "type": "address" },
          { "internalType": "uint256", "name": "value", "type": "uint256" },
          { "internalType": "uint256", "name": "gas", "type": "uint256" },
          { "internalType": "uint256", "name": "nonce", "type": "uint256" },
          { "internalType": "bytes", "name": "data", "type": "bytes" }
        ],
        "internalType": "struct MinimalForwarder.ForwardRequest",
        "name": "req",
        "type": "tuple"
      },
      { "internalType": "bytes", "name": "signature", "type": "bytes" }
    ],
    "name": "verify",
    "outputs": [
      { "internalType": "bool", "name": "", "type": "bool" }
    ],
    "stateMutability": "view",
    "type": "function"
  }
];

const ForwarderAddress: string = "0xBb5db3ecb7597d2d7AA708266b09B5083a3Fc0Fe";
const EscrowAddress: string = "0xde036b34b51123bf34c9E32ca9F21507312a9DE2";

interface RelayRequest {
  to: string;
  gas: string;
}

async function relay(forwarder: Contract, request: RelayRequest, signature: string, whitelist?: string[]): Promise<ContractTransaction> {
  // Decide if we want to relay this request based on a whitelist
  const accepts = !whitelist || whitelist.includes(request.to);
  if (!accepts) throw new Error(`Rejected request to ${request.to}`);

  // Validate request on the forwarder contract
  const valid: boolean = await forwarder.verify(request, signature);
  if (!valid) throw new Error("Invalid request");

  // Send meta-tx through relayer to the forwarder contract
  const gasLimit = (parseInt(request.gas) + 50000).toString();
  return await forwarder.execute(request, signature, { gasLimit });
}

interface HandlerEvent {
  request: {
    body: {
      request: RelayRequest;
      signature: string;
    };
  };
}

async function handler(event: HandlerEvent): Promise<{ txHash: string }> {
  // Parse webhook payload
  if (!event.request || !event.request.body) throw new Error("Missing payload");
  const { request, signature } = event.request.body;
  console.log("Relaying", request);

  // Initialize Relayer provider and signer, and forwarder contract
  const credentials = { apiKey: `${process.env.RELAYER_API_KEY}`, apiSecret: `${process.env.RELAYER_API_SECRET}` };
  const provider = new DefenderRelayProvider(credentials);
  const signer = new DefenderRelaySigner(credentials, provider, { speed: "fast" });
  const forwarder = new Contract(ForwarderAddress, ForwarderAbi, signer);

  // Relay transaction!
  const tx = await relay(forwarder, request, signature, [EscrowAddress]);
  console.log(`Sent meta-tx: ${tx.hash}`);
  return { txHash: tx.hash };
}

export {
  handler,
  relay,
}
