// Wagmi Imports
// import { readContract } from "@wagmi/core";

// Ethers Imports
// import { BigNumber } from "ethers";

// Asset Imports
import { IconNotificationWarning } from "../../assets";

// Interface Imports
import {
  DisplayProjectDetailsInterface,
  NotificationConfigurationInterface,
} from "../../interfaces";

// Utils Imports
import { approveProjectDetails } from "../";

// export const checkNftOwnership = async (
//   nftAddress: `0x${string}`,
//   nftOwnerAddress: `0x${string}`,
//   setNotificationConfiguration: React.Dispatch<
//     React.SetStateAction<NotificationConfigurationInterface>
//   >,
//   setShowNotification: React.Dispatch<React.SetStateAction<boolean>>,
//   signTypedDataAsync,
//   openConnectModal,
//   projectId,
//   setProjectDetails: React.Dispatch<
//     React.SetStateAction<DisplayProjectDetailsInterface>
//   >,
//   setIsAssigned: React.Dispatch<React.SetStateAction<boolean>>
// ) => {
//   try {
//     const abi = [
//       {
//         constant: true,
//         inputs: [
//           {
//             name: "_owner",
//             type: "address",
//           },
//         ],
//         name: "balanceOf",
//         outputs: [
//           {
//             name: "_balance",
//             type: "uint256",
//           },
//         ],
//         payable: false,
//         stateMutability: "view",
//         type: "function",
//       },
//     ];

//     const response = BigNumber.from(
//       await readContract({
//         abi: abi,
//         functionName: "balanceOf",
//         address: nftAddress,
//         /**
//          * @dev Change it to this later BEFORE PR
//          */
//         // args: [address],
//         args: ["0xA7d1BDbCD1a93587E817e8912C7aE1B645DB2360"],
//       })
//     );

//     if (Boolean(response.toNumber())) {
//       approveProjectDetails(
//         nftOwnerAddress,
//         signTypedDataAsync,
//         setNotificationConfiguration,
//         setShowNotification,
//         openConnectModal,
//         projectId,
//         setProjectDetails,
//         setIsAssigned
//       );
//     } else {
//       throw new Error("Failed to verify NFT ownership");
//     }
//   } catch (error) {
//     setNotificationConfiguration({
//       modalColor: "#d14040",
//       title: "Failed",
//       message: "Failed to verify NFT Ownership",
//       icon: IconNotificationWarning,
//     });
//     setShowNotification(true);
//   }
// };

// export const checkNftOwnership = async (
//   nftAddress: `0x${string}`,
//   nftOwnerAddress: `0x${string}`
// ) => {
//   try {
//     const abi = [
//       {
//         constant: true,
//         inputs: [
//           {
//             name: "_owner",
//             type: "address",
//           },
//         ],
//         name: "balanceOf",
//         outputs: [
//           {
//             name: "_balance",
//             type: "uint256",
//           },
//         ],
//         payable: false,
//         stateMutability: "view",
//         type: "function",
//       },
//     ];

//     const response = BigNumber.from(
//       await readContract({
//         abi: abi,
//         functionName: "balanceOf",
//         address: nftAddress,
//         /**
//          * @dev Change it to this later BEFORE PR
//          */
//         args: [nftOwnerAddress],
//         // args: ["0xA7d1BDbCD1a93587E817e8912C7aE1B645DB2360"],
//         chainId: 137,
//       })
//     );

//     return Boolean(response.toNumber());
//   } catch (error) {
//     throw new Error("Error checking NFT ownership");
//   }
// };
