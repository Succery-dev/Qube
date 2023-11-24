// Asset Imports
import { StatusEnum } from "../../enums";

// Interface Imports
import {
  DisplayProjectDetailsInterface,
  StoreProjectDetailsInterface,
} from "../../interfaces";

// Utils Imports
import {
  approveProjectDetails,
  getDataFromFireStore,
  updateProjectDetails,
} from "./index";

export const assignProject = async (
  address: `0x${string}` | undefined,
  projectDetails: DisplayProjectDetailsInterface,
  signTypedDataAsync: any,
  projectId: string,
  setProjectDetails: React.Dispatch<
    React.SetStateAction<DisplayProjectDetailsInterface>
  >,
  setIsAssigned: React.Dispatch<React.SetStateAction<boolean>>,
) => {
  if (
    (projectDetails.createdBy === "depositor" && address === projectDetails["Client's Wallet Address"])
    || (projectDetails.createdBy === "recipient" && address === projectDetails["Lancer's Wallet Address"])
  ) {
    throw new Error("You can't approve this project");
  }

  const approveProof = await approveProjectDetails(signTypedDataAsync);
  const dynamicKey = projectDetails.createdBy === "depositor" ? "Lancer's Wallet Address" : "Client's Wallet Address";
  const updatedSubsetProjectDetail: Partial<StoreProjectDetailsInterface> =
    {
      approveProof: approveProof,
      [dynamicKey]: address,
      "Status": StatusEnum.PayInAdvance,
    };
  await updateProjectDetails(projectId, updatedSubsetProjectDetail);
  const [_, updatedProjectDetails] = await getDataFromFireStore(
    projectId
  );

  setProjectDetails(updatedProjectDetails);
  setIsAssigned(true);
};
