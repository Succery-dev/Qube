// Asset Imports
import { httpsCallable } from "firebase/functions";

// Interface Imports
import { ProjectDisplayInterface } from "../../interfaces";

// Ethers Imports
import * as ethers from "ethers";
import { functions } from "../firebase";

// Wagmi Imports
import { signTypedData } from "@wagmi/core";

const generateSignature = async (
  value: Partial<ProjectDisplayInterface>,
  userAddress: `0x${string}`
) => {
  const eip712DomainAndTypes = {
    domain: {
      name: "QubePay-Sign-Project",
      chainId: 80001,
    },
    types: {
      ProjectDetail: [
        { name: "Title", type: "string" },
        { name: "Detail", type: "string" },
        { name: "Deadline(UTC)", type: "string" },
        { name: "Reward(USDC)", type: "uint256" },
        { name: "NFT(Contract Address)", type: "address" },
        { name: "Client's Wallet Address", type: "address" },
      ],
    },
  };

  const approveProof = await signTypedData({
    domain: eip712DomainAndTypes.domain,
    message: value,
    types: eip712DomainAndTypes.types,
    primaryType: "ProjectDetail",
  });

  const recoveredAddress = ethers.verifyTypedData(
    eip712DomainAndTypes.domain,
    eip712DomainAndTypes.types,
    value,
    approveProof
  );

  return approveProof;
};

export const assingProject = async (
  projectId: string,
  // approveProof: `0x${string}`
  value: Partial<ProjectDisplayInterface>,
  userAddress: `0x${string}`
) => {
  const approveProject = httpsCallable(functions, "approveProject");

  const approveProof = await generateSignature(value, userAddress);

  const approveProjectCall = await approveProject({
    projectId,
    approveProof,
  });
  const approveProjectObj = approveProjectCall.data as {
    success: true;
    message: "Project assigned successfully.";
  };
};
