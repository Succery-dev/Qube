// Axios Imports
import axios, { AxiosResponse, AxiosProgressEvent} from "axios";

import {
  NotificationConfigurationInterface,
  SubmitDeliverablesInterface,
} from "../../interfaces";

/**
 * @dev code inside uploadFiles function is TEMPORARY just to demonstrate the functioning of progress bar. This code is will be changed in the future as per backend requirements.
 */
const uploadFiles = (
  deliverables: SubmitDeliverablesInterface,
  setDeliverables: React.Dispatch<
    React.SetStateAction<SubmitDeliverablesInterface>
  >
) => {
  deliverables.files.map(async (file) => {
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", "docs_upload_example_us_preset");

      const response: AxiosResponse = await axios.post(
        "https://api.cloudinary.com/v1_1/demo/image/upload",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          onUploadProgress(progressEvent: AxiosProgressEvent) {
            if (progressEvent.total) {
              const percentCompleted = Math.round(
                (progressEvent.loaded * 100) / progressEvent.total
              );

              console.log(percentCompleted);

              setDeliverables((prevDeliverables) => {
                const updatedFiles = prevDeliverables.files;

                console.log("Un-UpdatedFiles::: ", updatedFiles);

                const fileIndex = updatedFiles.indexOf(file);

                updatedFiles[fileIndex] = Object.assign(
                  updatedFiles[fileIndex],
                  {
                    progress: percentCompleted,
                  }
                );

                console.log("updatedFiles::: ", updatedFiles);

                const updatedDeliverables = {
                  text: prevDeliverables.text,
                  files: updatedFiles,
                };

                console.log("updatedDeliverables::: ", updatedDeliverables);

                return updatedDeliverables;
              });
            }
          },
        }
      );
    } catch (error) {}
  });
};
/** @dev uploadText function will be updated in the future as per backend requirements. */
const uploadText = () => {};

export const uploadDeliverables = (
  deliverables: SubmitDeliverablesInterface,
  setDeliverables: React.Dispatch<
    React.SetStateAction<SubmitDeliverablesInterface>
  >
) => {
  // uploading Files
  uploadFiles(deliverables, setDeliverables);
  // uploading Text
  uploadText();
};
