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

/**
 * @dev DEMO firebase functions
 */

export const getDataFromFireStore = async (
  projectId: string,
  setProjectDetails: React.Dispatch<
    React.SetStateAction<DisplayProjectDetailsInterface>
  >,
  setNotificationConfiguration: React.Dispatch<
    React.SetStateAction<NotificationConfigurationInterface>
  >,
  setShowNotification: React.Dispatch<React.SetStateAction<boolean>>,
  setIsAssigned: React.Dispatch<React.SetStateAction<boolean>>
) => {
  try {
    console.log("Feteching doc ", projectId);
    const databaseRef = doc(database, "project-details", projectId);
    const response = await getDoc(databaseRef);
    const responseData = response.data() as StoreProjectDetailsInterface;
    console.log("Response Data: ", responseData);

    if (responseData.approveProof.length > 0) {
      setIsAssigned(true);
    } else {
      setIsAssigned(false);
    }

    const displayProjectDetails = DisplayProjectDetailsInterfaceKeys.reduce(
      (accumulator, current) => {
        return { ...accumulator, [current]: responseData[current] };
      },
      {} as DisplayProjectDetailsInterface
    );

    console.log("displayProjectDetails: ", displayProjectDetails);

    setProjectDetails(displayProjectDetails);
  } catch (error) {
    setNotificationConfiguration({
      modalColor: "#d14040",
      title: "Failed",
      message: "Error fetching the project details",
      icon: IconNotificationWarning,
    });
    setShowNotification(true);
  }
};
