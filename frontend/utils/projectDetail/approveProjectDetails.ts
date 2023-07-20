// Asset Imports
import { IconNotificationWarning } from "../../assets";

// Interface Imports
import {
  DisplayProjectDetailsInterface,
  NotificationConfigurationInterface,
} from "../../interfaces";

// Utils Imports
import { updateProjectDetails } from "../";

export const approveProjectDetails = async (signTypedDataAsync) => {
  try {
    const signedConfirmation = await signTypedDataAsync();
    return signedConfirmation;
  } catch (error) {
    throw new Error("Error approving the project");
  }
};
