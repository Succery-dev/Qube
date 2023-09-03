// React-Dropzone Interface
import { FileWithPath } from "react-dropzone";

// Utils Imports
import { encryptionSignature } from ".";

// LightHouse Imports
import { uploadEncrypted } from "@lighthouse-web3/sdk";

// Interface Imports
import { ProgressDataInterface } from "../../interfaces";

const uploadFileEncrypted = async (
  address: `0x${string}`,
  file: FileWithPath[],
  progressCallback: (progressData: ProgressDataInterface) => void
) => {
  try {
    const { publicKey, signedMessage } = await encryptionSignature(address);

    console.log("uploading");
    console.log("file: ", file);
    console.log("publicKey, signedMessage: ", publicKey, signedMessage);
    const response = await uploadEncrypted(
      file,
      "d6ca5379.1ea7da96c2fc41c7bfcfd4d7a64f5b4e",
      publicKey,
      signedMessage,
      progressCallback
    );
    console.log("Response: ", response);

    return response.data[0];
  } catch (error) {
    throw new Error("Error uploading file");
  }
};

export { uploadFileEncrypted };
