// Firebase Imports
import { database } from "../";
import { doc, updateDoc } from "firebase/firestore";

// Interface Imports
import {
  DisplayProjectDetailsInterface,
  NotificationConfigurationInterface,
  StoreProjectDetailsInterface,
} from "../../interfaces";

// Asset Imports
import { IconNotificationSuccess, IconNotificationWarning } from "../../assets";

// Utils Imports
import { getDataFromFireStore } from "./";

// export const updateProjectDetails = async (
//   approveProof: string,
//   projectId: string,
//   nftOwnerAddress: `0x${string}`,
//   setNotificationConfiguration: React.Dispatch<
//     React.SetStateAction<NotificationConfigurationInterface>
//   >,
//   setShowNotification: React.Dispatch<React.SetStateAction<boolean>>,
//   setProjectDetails: React.Dispatch<
//     React.SetStateAction<DisplayProjectDetailsInterface>
//   >,
//   setIsAssigned: React.Dispatch<React.SetStateAction<boolean>>
// ) => {
//   try {
//     const databaseRef = doc(database, "project-details", projectId);
//     await updateDoc(databaseRef, {
//       approveProof: approveProof,
//       "Lancer's Wallet Address": nftOwnerAddress,
//     });

//     await getDataFromFireStore(
//       projectId,
//       setProjectDetails,
//       setNotificationConfiguration,
//       setShowNotification,
//       setIsAssigned
//     );

//     setNotificationConfiguration({
//       modalColor: "#62d140",
//       title: "Sucess",
//       message: "Successfully approved project",
//       icon: IconNotificationSuccess,
//     });
//     setShowNotification(true);
//   } catch (error) {
//     setNotificationConfiguration({
//       modalColor: "#d14040",
//       title: "Failed",
//       message: "Error approving the project",
//       icon: IconNotificationWarning,
//     });
//     setShowNotification(true);
//   }
// };

export const updateProjectDetails = async (
  projectId: string,
  updatedSubset: Partial<StoreProjectDetailsInterface>
) => {
  try {
    const databaseRef = doc(database, "projects", projectId);
    await updateDoc(databaseRef, updatedSubset);
    return true;
  } catch (error) {
    throw new Error("Error updating the data");
  }
};
