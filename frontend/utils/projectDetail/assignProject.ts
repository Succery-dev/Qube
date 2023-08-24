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

export const assingProject = async (
  nftOwnerAddress: `0x${string}`,
  nftAddress: `0x${string}`,
  openConnectModal,
  signTypedDataAsync,
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
  if (nftOwnerAddress) {
    try {
      const isOwner = await checkNftOwnership(nftAddress, nftOwnerAddress);
      if (isOwner) {
        const approveProof = await approveProjectDetails(signTypedDataAsync);
        const updatedSubsetProjectDetail: Partial<StoreProjectDetailsInterface> =
          {
            approveProof: approveProof,
            "Lancer's Wallet Address": nftOwnerAddress,
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
      } else {
        throw new Error("Not Approved for the project");
      }
    } catch (error) {
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
