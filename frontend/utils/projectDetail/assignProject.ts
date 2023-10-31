// Asset Imports
import { IconNotificationSuccess, IconNotificationError } from "../../assets";
import { StatusEnum } from "../../enums";

// Interface Imports
import {
  DisplayProjectDetailsInterface,
  NotificationConfigurationInterface,
  StoreProjectDetailsInterface,
} from "../../interfaces";

// Utils Imports
import {
  approveProjectDetails,
  // checkNftOwnership,
  getDataFromFireStore,
  updateProjectDetails,
} from "./index";

export const assignProject = async (
  // nftOwnerAddress: `0x${string}`,
  // nftAddress: `0x${string}`,
  companyAddress: `0x${string}`,
  creatorAddress: `0x${string}`,
  openConnectModal: any,
  signTypedDataAsync: any,
  projectId: string,
  setProjectDetails: React.Dispatch<
    React.SetStateAction<DisplayProjectDetailsInterface>
  >,
  setIsAssigned: React.Dispatch<React.SetStateAction<boolean>>,
  setNotificationConfiguration: React.Dispatch<
    React.SetStateAction<NotificationConfigurationInterface>
  >,
  setShowNotification: React.Dispatch<React.SetStateAction<boolean>>
) => {
  if (companyAddress) {
    // try {
      // const isOwner = await checkNftOwnership(nftAddress, nftOwnerAddress);
      // if (isOwner) {
        if (creatorAddress === companyAddress) {
          throw new Error("You can't approve this project");
        }
        const approveProof = await approveProjectDetails(signTypedDataAsync);
        const updatedSubsetProjectDetail: Partial<StoreProjectDetailsInterface> =
          {
            approveProof: approveProof,
            "Client's Wallet Address": companyAddress,
            "Status": StatusEnum.PayInAdvance,
          };
        await updateProjectDetails(projectId, updatedSubsetProjectDetail);
        const [_, updatedProjectDetails] = await getDataFromFireStore(
          projectId
        );

        setProjectDetails(updatedProjectDetails);
        setIsAssigned(true);

        // setNotificationConfiguration({
        //   modalColor: "#62d140",
        //   title: "Successfully approved project",
        //   message: "Please prepay the reward!",
        //   icon: IconNotificationSuccess,
        // });
        // setShowNotification(true);
      // } else {
      //   throw new Error("Not Approved for the project");
      // }
    // } catch (error) {
    //   console.log("Error: ", error);
    //   setNotificationConfiguration({
    //     modalColor: "#d14040",
    //     title: "Error",
    //     message: "Error approving the project.",
    //     icon: IconNotificationError,
    //   });

    //   setShowNotification(true);
    // }
  } else {
    openConnectModal();
  }
};
