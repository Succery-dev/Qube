// Wagmi/core Imports
import { signMessage } from "@wagmi/core";

// Lighthouse Imports
import { getAuthMessage } from "@lighthouse-web3/sdk";

const encryptionSignature = async (address: `0x${string}`) => {
  try {
    const messageRequested = (await getAuthMessage(address)).data.message;
    const signedMessage = await signMessage({ message: messageRequested });
    return {
      signedMessage: signedMessage,
      publicKey: address,
    };
  } catch (error) {
    console.log("error: ", error);
  }
};

export { encryptionSignature };
