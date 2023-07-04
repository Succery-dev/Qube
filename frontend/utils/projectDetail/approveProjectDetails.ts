// Asset Imports
import { IconNotificationWarning } from "../../assets";

// Interface Imports
import {
  DisplayProjectDetailsInterface,
  NotificationConfigurationInterface,
} from "../../interfaces";

// Utils Imports
import { updateProjectDetails } from "../";

export const approveProjectDetails = async (
  nftOwnerAddress: `0x${string}`,
  signTypedDataAsync,
  setNotificationConfiguration: React.Dispatch<
    React.SetStateAction<NotificationConfigurationInterface>
  >,
  setShowNotification: React.Dispatch<React.SetStateAction<boolean>>,
  openConnectModal,
  projectId: string,
  setProjectDetails: React.Dispatch<
    React.SetStateAction<DisplayProjectDetailsInterface>
  >,
  setIsAssigned: React.Dispatch<React.SetStateAction<boolean>>
) => {
  if (nftOwnerAddress) {
    try {
      const signedConfirmation = await signTypedDataAsync();
      console.log(signedConfirmation);

      await updateProjectDetails(
        signedConfirmation,
        projectId,
        nftOwnerAddress,
        setNotificationConfiguration,
        setShowNotification,
        setProjectDetails,
        setIsAssigned
      );
    } catch (error) {
      setNotificationConfiguration({
        modalColor: "#d14040",
        title: "Failed",
        message: "Error signing the project details",
        icon: IconNotificationWarning,
      });
      setShowNotification(true);
    }
  } else {
    console.log("connect and try again");
    setNotificationConfiguration({
      modalColor: "#d1d140",
      title: "Address not Found",
      message: "Please connect Wallet and try again",
      icon: IconNotificationWarning,
    });
    setShowNotification(true);

    openConnectModal();
  }
};
