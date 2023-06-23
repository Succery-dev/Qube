// Wagmi Imports
import { readContract } from "@wagmi/core";

// Interface Imports
import { NotificationConfigurationInterface } from "../../interfaces";

// Asset Imports
import { IconNotificationError, IconNotificationSuccess } from "../../assets";

/**
 * @dev Checking if the entered NFT Address is in Valid Ethereum Address format
 * @param nftAddress : NFT address entered by the client when creating the contract
 *  */
export const isValidEthereumContractAddress = (nftAddress: `0x${string}`) => {
  const ethereumContractAddressRegex = /^0x[0-9a-fA-F]{40}$/;
  return ethereumContractAddressRegex.test(nftAddress);
};

/**
 * @dev Using EIP-165 to determine wether a contract DECLARE itself as an NFT contract. Word DECLARE here is important as any arbitrary contract wheter it follows any EIP for NFTs or not can declare itself as an NFT contract by mistake or maliciously. This test does NOT guarantees that the entered contract address belongs to an NFT. There is no 100% sure way to determine if the contract adheres to a particular spec. So, we shift the risk to client creating the contract that he/she are using contract address that belongs to NFT. More Info here: https://github.com/ethers-io/ethers.js/discussions/2941
 */
//
export const isNftContract = async (
  nftAddress: `0x${string}`,
  setNotificationConfiguration: React.Dispatch<
    React.SetStateAction<NotificationConfigurationInterface>
  >,
  setShowNotification: React.Dispatch<React.SetStateAction<boolean>>,
  setIsNftAddress: React.Dispatch<React.SetStateAction<boolean>>
) => {
  const isValidAddress = isValidEthereumContractAddress(nftAddress);
  console.log(nftAddress);
  if (isValidAddress) {
    try {
      const contractABI = [
        {
          constant: true,
          inputs: [
            {
              name: "interfaceID",
              type: "bytes4",
            },
          ],
          name: "supportsInterface",
          outputs: [
            {
              name: "",
              type: "bool",
            },
          ],
          payable: false,
          stateMutability: "view",
          type: "function",
        },
      ];

      const erc721InterfaceId = "0x80ac58cd";
      console.log({
        address: nftAddress,
        abi: contractABI,
        functionName: "supportsInterface",
        args: [erc721InterfaceId],
      });
      const data = await readContract({
        address: nftAddress,
        abi: contractABI,
        functionName: "supportsInterface",
        args: [erc721InterfaceId],
      });

      console.log("Data:: ", data);

      if (data === true) {
        setIsNftAddress(true);
        setNotificationConfiguration({
          modalColor: "#62d140",
          title: "Success",
          message: "NFT Address Verified!",
          icon: IconNotificationSuccess,
        });
        setShowNotification(true);
      } else {
        throw new Error("Failed to Verify NFT Address");
      }
    } catch (error) {
      console.log(error);
      setIsNftAddress(false);
      setNotificationConfiguration({
        modalColor: "#d14040",
        title: "Failed",
        message: "Failed to verify NFT Address",
        icon: IconNotificationError,
      });
      setShowNotification(true);

      return false;
    }
  } else {
    return false;
  }
};
