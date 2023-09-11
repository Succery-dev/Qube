// Asset Imports
import { IconNotificationSuccess, IconNotificationError } from "../../assets";

// Interface Imports
import {
  DisplayProjectDetailsInterface,
  NotificationConfigurationInterface,
  StoreProjectDetailsInterface,
} from "../../interfaces";

// Utils Imports
import {
  approveProjectDetails,
  checkNftOwnership,
  getDataFromFireStore,
  updateProjectDetails,
} from "./index";

export const assignProject = async (
  // nftOwnerAddress: `0x${string}`,
  // nftAddress: `0x${string}`,
  freelancerAddress: `0x${string}`,
  clientAddress: `0x${string}`,
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
  if (freelancerAddress) {
    try {
      // const isOwner = await checkNftOwnership(nftAddress, nftOwnerAddress);
      // if (isOwner) {
        if (clientAddress === freelancerAddress) {
          throw new Error("You can't approve this project");
        }
        const approveProof = await approveProjectDetails(signTypedDataAsync);
        const updatedSubsetProjectDetail: Partial<StoreProjectDetailsInterface> =
          {
            approveProof: approveProof,
            "Lancer's Wallet Address": freelancerAddress,
          };
        await updateProjectDetails(projectId, updatedSubsetProjectDetail);
        const [_, updatedProjectDetails] = await getDataFromFireStore(
          projectId
        );

        setProjectDetails(updatedProjectDetails);
        setIsAssigned(true);

        setNotificationConfiguration({
          modalColor: "#62d140",
          title: "Sucess",
          message: "Successfully approved project",
          icon: IconNotificationSuccess,
        });
        setShowNotification(true);
      // } else {
      //   throw new Error("Not Approved for the project");
      // }
    } catch (error) {
      console.log("hello: ", error);
      setNotificationConfiguration({
        modalColor: "#d14040",
        title: "Error",
        message: "Error approving the project.",
        icon: IconNotificationError,
      });

      setShowNotification(true);
    }
  } else {
    openConnectModal();
  }
};
