// // Wagmi Imports
// import { readContract } from "@wagmi/core";

// // Interface Imports
// import {
//   NftAddressDetailsInterface,
//   NotificationConfigurationInterface,
// } from "../../interfaces";

// // Asset Imports
// import { IconNotificationError, IconNotificationSuccess } from "../../assets";

// // Axios Imports
// import axios from "axios";

// /**
//  * @dev Checking if the entered NFT Address is in Valid Ethereum Address format
//  * @param nftAddress : NFT address entered by the client when creating the project
//  *  */
// export const isValidEthereumContractAddress = (nftAddress: `0x${string}`) => {
//   const ethereumContractAddressRegex = /^0x[0-9a-fA-F]{40}$/;
//   return ethereumContractAddressRegex.test(nftAddress);
// };

// /**
//  * @dev Getting NFT Collection image url from opensea
//  */
// const fetchNftCollectionImage = async (
//   nftAddress: `0x${string}`,
//   setNotificationConfiguration: React.Dispatch<
//     React.SetStateAction<NotificationConfigurationInterface>
//   >,
//   setShowNotification: React.Dispatch<React.SetStateAction<boolean>>,
//   setnftAddressDetails: React.Dispatch<
//     React.SetStateAction<NftAddressDetailsInterface>
//   >
// ) => {
//   try {
//     const DEMO_OPENSEA_API_KEY = "66b773e28182408fabf7adfc20518f27";
//     const baseUrl = "https://api.opensea.io";
//     const config = {
//       headers: {
//         "X-API-KEY": DEMO_OPENSEA_API_KEY,
//         "accept": "application/json",
//       },
//     };
//     /**
//      * @dev fetching the collection details ASSUMING tokenId "1" exists for now.
//      */
//     const response = await axios.get(
//       `${baseUrl}/v2/chain/matic/contract/${nftAddress}/nfts`,
//       config
//     );
//     const collectionImageUrl = response.data.nfts[0]["image_url"];
//     setnftAddressDetails({
//       isNftAddress: true,
//       nftCollectionImageUrl: collectionImageUrl,
//     });
//     return collectionImageUrl;
//   } catch (error) {
//     setnftAddressDetails({
//       isNftAddress: true,
//       nftCollectionImageUrl: undefined as string,
//     });
//   }
// };

// /**
//  * @dev Using EIP-165 to determine wether a contract DECLARE itself as an NFT contract. Word DECLARE here is important as any arbitrary contract wheter it follows any EIP for NFTs or not can declare itself as an NFT contract by mistake or maliciously. This test does NOT guarantees that the entered contract address belongs to an NFT. There is no 100% sure way to determine if the contract adheres to a particular spec. So, we shift the risk to client creating the contract that he/she are using contract address that belongs to NFT. More Info here: https://github.com/ethers-io/ethers.js/discussions/2941
//  * @param nftAddress: Address of the NFT contract entered by the client
//  * @param setNotificationConfiguration: It will set the Notification aesthetics
//  * @param setShowNotification: It is used to render the Notification
//  * @param setIsNftAddress: It is used to set if the @param nftAddress entered by client DECLARE itself as an NFT contract.
//  */
// //
// export const isNftContract = async (
//   nftAddress: `0x${string}`,
//   setNotificationConfiguration: React.Dispatch<
//     React.SetStateAction<NotificationConfigurationInterface>
//   >,
//   setShowNotification: React.Dispatch<React.SetStateAction<boolean>>,
//   setnftAddressDetails: React.Dispatch<
//     React.SetStateAction<NftAddressDetailsInterface>
//   >
// ) => {
//   const isValidAddress = isValidEthereumContractAddress(nftAddress);
//   if (isValidAddress) {
//     try {
//       const contractABI = [
//         {
//           constant: true,
//           inputs: [
//             {
//               name: "interfaceID",
//               type: "bytes4",
//             },
//           ],
//           name: "supportsInterface",
//           outputs: [
//             {
//               name: "",
//               type: "bool",
//             },
//           ],
//           payable: false,
//           stateMutability: "view",
//           type: "function",
//         },
//       ];

//       const erc721InterfaceId = "0x80ac58cd";

//       const data = await readContract({
//         address: nftAddress,
//         abi: contractABI,
//         functionName: "supportsInterface",
//         args: [erc721InterfaceId],
//         chainId: 137, // Polygon Mainnet's ChainID
//       });

//       if (data === true) {
//         setNotificationConfiguration({
//           modalColor: "#62d140",
//           title: "Success",
//           message: "NFT Address Verified!",
//           icon: IconNotificationSuccess,
//         });
//         setShowNotification(true);
//         // Getting the collection Image
//         await fetchNftCollectionImage(
//           nftAddress,
//           setNotificationConfiguration,
//           setShowNotification,
//           setnftAddressDetails
//         );
//       } else {
//         throw new Error("Failed to Verify NFT Address");
//       }
//     } catch (error) {
//       setnftAddressDetails((prevNftDetails) => ({
//         ...prevNftDetails,
//         isNftAddress: false,
//       }));
//       setNotificationConfiguration({
//         modalColor: "#d14040",
//         title: "Failed",
//         message: "Failed to verify NFT Address",
//         icon: IconNotificationError,
//       });
//       setShowNotification(true);

//       return false;
//     }
//   } else {
//     return false;
//   }
// };
