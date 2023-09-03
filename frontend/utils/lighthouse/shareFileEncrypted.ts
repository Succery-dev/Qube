// Utils Imports
import { encryptionSignature } from "./";

// Lighthouse Imports
import { shareFile } from "@lighthouse-web3/sdk";

const shareFileEncrypted = async (
  ownerAddress: `0x${string}`,
  shareToAddresses: [`0x${string}`],
  cid: string
) => {
  try {
    const { publicKey, signedMessage } = await encryptionSignature(
      ownerAddress
    );

    const response = await shareFile(
      publicKey,
      shareToAddresses,
      cid,
      signedMessage
    );

    return response.data;
  } catch (error) {
    throw new Error("Error Sharing the file");
  }
};

export { shareFileEncrypted };
