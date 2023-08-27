// Firebase Imports
import { database } from "../";
import { getDoc, doc, updateDoc } from "firebase/firestore";

// Interface Imports
import {
  StoreProjectDetailsInterface,
  DisplayProjectDetailsInterface,
  NotificationConfigurationInterface,
} from "../../interfaces";

// Constant Imports
import { DisplayProjectDetailsInterfaceKeys } from "../../constants";

// Asset Imports
import { IconNotificationWarning } from "../../assets";

export const getDataFromFireStore = async (
  projectId: string
): Promise<[StoreProjectDetailsInterface, DisplayProjectDetailsInterface]> => {
  try {
    const databaseRef = doc(database, "projects", projectId);
    const response = await getDoc(databaseRef);
    const responseData = response.data() as StoreProjectDetailsInterface;

    const displayProjectDetails = { ...responseData };
    delete displayProjectDetails.approveProof;

    return [
      responseData as StoreProjectDetailsInterface,
      displayProjectDetails as DisplayProjectDetailsInterface,
    ];
  } catch (error) {
    throw new Error("Error fetching the data");
  }
};
