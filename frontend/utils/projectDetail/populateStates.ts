// Utils Imports
import { getDataFromFireStore } from "./";

// Interface Imports
import {
  DisplayFileDeliverableInterface,
  DisplayProjectDetailsInterface,
  DisplayTextDeliverableInterface,
  NotificationConfigurationInterface,
} from "../../interfaces";

// Asset Imports
import { IconNotificationError } from "../../assets";

export const populateStates = async (
  projectId: string,
  setIsAssigned: React.Dispatch<React.SetStateAction<boolean>>,
  setProjectDetails: React.Dispatch<
    React.SetStateAction<DisplayProjectDetailsInterface>
  >,
  setFileDeliverables: React.Dispatch<
    React.SetStateAction<DisplayFileDeliverableInterface[]>
  >,
  setNotificationConfiguration: React.Dispatch<
    React.SetStateAction<NotificationConfigurationInterface>
  >,
  setShowNotification: React.Dispatch<React.SetStateAction<boolean>>,
  setTextDeliverables: React.Dispatch<
    React.SetStateAction<DisplayTextDeliverableInterface[]>
  >
) => {
  try {
    const [storeProjectDetails, updatedProjectDetails] =
      await getDataFromFireStore(projectId);
    const approveProof = storeProjectDetails.approveProof;
    if (approveProof === "") {
      setIsAssigned(false);
    } else {
      setIsAssigned(true);
    }

    setProjectDetails(updatedProjectDetails);

    const textDeliverables: DisplayTextDeliverableInterface[] =
      updatedProjectDetails.textDeliverable.map((textDeliverable, index) => {
        return {
          text: textDeliverable,
          showText: false,
        };
      });

    setTextDeliverables(textDeliverables);

    const updatedFileDeliverables =
      updatedProjectDetails.fileDeliverable as DisplayFileDeliverableInterface[];

    updatedFileDeliverables.forEach((fileDeliverable, index) => {
      fileDeliverable.progress = null as string;
    });

    setFileDeliverables(updatedFileDeliverables);
  } catch (error) {
    setNotificationConfiguration({
      modalColor: "#d1d140",
      title: "Error",
      message: "Error fetching project details.",
      icon: IconNotificationError,
    });
    setShowNotification(true);
  }
};
