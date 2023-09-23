// Firebase Imports
import {
  database,
  // firebaseApp
} from "../";
import {
  getDoc,
  doc,
  // updateDoc
} from "firebase/firestore";

// Interfaces Imports
import {
  ProjectDisplayInterface,
  ProjectsCollectionInterface,
  UsersCollectionIterface,
} from "../../interfaces";

// Interface Imports
// import {
//   StoreProjectDetailsInterface,
//   DisplayProjectDetailsInterface,
//   NotificationConfigurationInterface,
// } from "../../interfaces";

// // Constant Imports
// import { DisplayProjectDetailsInterfaceKeys } from "../../constants";

// // Asset Imports
// import { IconNotificationWarning } from "../../assets";

// export const getDataFromFireStore = async (
//   projectId: string
// ): Promise<[StoreProjectDetailsInterface, DisplayProjectDetailsInterface]> => {
//   try {
//     const databaseRef = doc(database, "projects", projectId);
//     const response = await getDoc(databaseRef);
//     const responseData = response.data() as StoreProjectDetailsInterface;

//     const displayProjectDetails = { ...responseData };
//     delete displayProjectDetails.approveProof;

//     return [
//       responseData as StoreProjectDetailsInterface,
//       displayProjectDetails as DisplayProjectDetailsInterface,
//     ];
//   } catch (error) {
//     throw new Error("Error fetching the data");
//   }
// };

export const getFirestoreProjectData = async (projectId: string) => {
  const projectRef = doc(database, "projects", projectId);
  const response = await getDoc(projectRef);
  if (response.exists()) {
    const projectData = response.data() as ProjectsCollectionInterface;

    return projectData;
  } else {
    throw Error("This project does not exists");
  }
};

export const getFirestoreUserData = async (userId: string) => {
  const userRef = doc(database, "users", userId);
  const response = await getDoc(userRef);
  if (response.exists()) {
    const userData = response.data() as UsersCollectionIterface;
    return userData;
  } else {
    throw "Invalid userId";
  }
};
