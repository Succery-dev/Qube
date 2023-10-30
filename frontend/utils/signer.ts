import { ethers, Contract } from "ethers";

interface EIP712DomainType {
  name: string;
  type: string;
}

const EIP712Domain: EIP712DomainType[] = [
  { name: "name", type: "string" },
  { name: "version", type: "string" },
  { name: "chainId", type: "uint256" },
  { name: "verifyingContract", type: "address" },
];

interface ForwardRequestType {
  name: string;
  type: string;
}

const ForwardRequest: ForwardRequestType[] = [
  { name: "from", type: "address" },
  { name: "to", type: "address" },
  { name: "value", type: "uint256" },
  { name: "gas", type: "uint256" },
  { name: "nonce", type: "uint256" },
  { name: "data", type: "bytes" },
];

interface MetaTxTypeData {
  types: {
    EIP712Domain: EIP712DomainType[];
    ForwardRequest: ForwardRequestType[];
  };
  domain: {
    name: string;
    version: string;
    chainId: number;
    verifyingContract: string;
  };
  primaryType: string;
  message?: RelayRequestInput;
}

function getMetaTxTypeData(chainId: number, verifyingContract: string): MetaTxTypeData {
  return {
    types: {
      EIP712Domain,
      ForwardRequest,
    },
    domain: {
      name: "MinimalForwarder",
      version: "0.0.1",
      chainId,
      verifyingContract,
    },
    primaryType: "ForwardRequest",
  };
}

interface RelayRequestInput {
  from: string;
  to: string;
  value?: number;
  gas?: number;
  nonce?: number;
  data: string;
}

async function signTypedData(signer: ethers.providers.JsonRpcSigner, from: string, data: any): Promise<string> {
  const isHardhat = data.domain.chainId === 31337;
  const [method, argData] = isHardhat
    ? ["eth_signTypedData", data]
    : ["eth_signTypedData_v4", JSON.stringify(data)];
  return await signer.provider.send("eth_signTypedData_v4", [from, argData]);
}

async function buildRequest(forwarder: Contract, input: RelayRequestInput): Promise<RelayRequestInput> {
  const nonce = await forwarder.getNonce(input.from).then((nonce: any) => nonce.toString());
  return { value: 0, gas: 1e6, nonce, ...input };
}

async function buildTypedData(forwarder: Contract, request: RelayRequestInput): Promise<MetaTxTypeData> {
  const chainId = await forwarder.provider.getNetwork().then((n) => n.chainId);
  const typeData = getMetaTxTypeData(chainId, forwarder.address);
  return { ...typeData, message: request };
}

async function signMetaTxRequest(signer: ethers.providers.JsonRpcSigner, forwarder: Contract, input: RelayRequestInput) {
  const request = await buildRequest(forwarder, input);
  const toSign = await buildTypedData(forwarder, request);
  const signature = await signTypedData(signer, input.from, toSign);
  return { signature, request };
}

export { signMetaTxRequest, buildRequest, buildTypedData };
