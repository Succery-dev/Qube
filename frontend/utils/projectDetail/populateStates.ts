// Interface Imports
import {
  DisplayFileDeliverableInterface,
  DisplayTextDeliverableInterface,
  NotificationConfigurationInterface,
  ProjectDisplayInterface,
  ProjectsCollectionInterface,
} from "../../interfaces";

// Asset Imports
import { IconNotificationError } from "../../assets";

// Utils Imports
import { getFirestoreProjectData } from "./getDataFromFireStore";

// Axoios Imports
import axios from "axios";

export const populateStates = async (
  projectId: string,
  setProjectDetails: React.Dispatch<
    React.SetStateAction<ProjectDisplayInterface>
  >,
  setFileDeliverables: React.Dispatch<
    React.SetStateAction<DisplayFileDeliverableInterface[] | undefined>
  >,
  setNotificationConfiguration: React.Dispatch<
    React.SetStateAction<NotificationConfigurationInterface>
  >,
  setShowNotification: React.Dispatch<React.SetStateAction<boolean>>,
  setTextDeliverables: React.Dispatch<
    React.SetStateAction<DisplayTextDeliverableInterface[] | undefined>
  >
) => {
  try {
    const {
      lancerInfoObj: { uid: lancerUid, address: lancerWalletAddress },
      clientInfoObj: { uid: clientUid, address: clientWalletAddress },
      ...commonObj
    }: ProjectsCollectionInterface = await getFirestoreProjectData(projectId);

    const displayProjectData: ProjectDisplayInterface = {
      ...commonObj,
      "Client's Wallet Address": clientWalletAddress,
      "Lancer's Wallet Address": lancerWalletAddress,
    };

    setProjectDetails(displayProjectData);

    const textDeliverables: DisplayTextDeliverableInterface[] =
      await Promise.all(
        displayProjectData.textDeliverable.map(async (textDeliverable) => {
          const text = (await axios.get(textDeliverable)).data;
          return {
            text: text,
            showText: false,
          };
        })
      );

    setTextDeliverables(textDeliverables);

    const updatedFileDeliverables =
      displayProjectData.fileDeliverable as DisplayFileDeliverableInterface[];

    updatedFileDeliverables.forEach((fileDeliverable) => {
      fileDeliverable.progress = "";
    });

    setFileDeliverables(updatedFileDeliverables);

    return true;
  } catch (error) {
    if (`${error}`.includes("Missing or insufficient permissions")) {
      setNotificationConfiguration({
        modalColor: "#d14040",
        title: "Error getting data",
        message: "Invalid connected wallet address",
        icon: IconNotificationError,
      });
      setShowNotification(true);

      return false;
    } else {
      setNotificationConfiguration({
        modalColor: "#d14040",
        title: "Error",
        message: "Error fetching project details.",
        icon: IconNotificationError,
      });
    }
    setShowNotification(true);
    return true;
  }
};
