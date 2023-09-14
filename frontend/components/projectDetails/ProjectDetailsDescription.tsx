import React, { useEffect } from "react";

// Interface Imports
import {
  DescriptionProjectDetailsInterface,
  DisplayFileDeliverableInterface,
  DisplayProjectDetailsInterface,
  DisplayTextDeliverableInterface,
  NotificationConfigurationInterface,
  StoreProjectDetailsInterface,
} from "../../interfaces";

// Constant Imports
import {
  DescriptionProjectDetailsInterfaceKeys,
  addressZero,
} from "../../constants";

// Custom Component Imports
import { CustomButton } from "..";

// Utils Imports
import {
  approveProjectDetails,
  assignProject,
  populateStates,
  updateProjectDetails,
} from "../../utils";

// Context Imports
import { useNotificationContext } from "../../context";
import { IconNotificationError, IconNotificationSuccess } from "../../assets";

import { ethers } from "ethers";
import { approve } from "../../contracts/MockToken";
import { EscrowAddress, depositTokens } from "../../contracts/Escrow";
import { StatusEnum } from "../../enums";
import { getDataFromFireStore } from "../../utils";
import { useAccount } from "wagmi";

const ProjectDetailsDescription = ({
  isAssigned,
  openConnectModal,
  signTypedDataAsync,
  // nftOwnerAddress,
  freelancerAddress,
  setFileDeliverables,
  projectId,
  setIsAssigned,
  setProjectDetails,
  setNotificationConfiguration,
  setShowNotification,
  setTextDeliverables,
  projectDetails,
}: {
  isAssigned: boolean;
  openConnectModal: unknown;
  signTypedDataAsync: unknown;
  // nftOwnerAddress: `0x${string}`;
  freelancerAddress: `0x${string}`;
  setFileDeliverables: React.Dispatch<
    React.SetStateAction<DisplayFileDeliverableInterface[]>
  >;
  projectId: string;
  setIsAssigned: React.Dispatch<React.SetStateAction<boolean>>;
  setProjectDetails: React.Dispatch<
    React.SetStateAction<DisplayProjectDetailsInterface>
  >;
  setNotificationConfiguration: React.Dispatch<
    React.SetStateAction<NotificationConfigurationInterface>
  >;
  setShowNotification: React.Dispatch<React.SetStateAction<boolean>>;
  projectDetails: DisplayProjectDetailsInterface;
  setTextDeliverables: React.Dispatch<
    React.SetStateAction<DisplayTextDeliverableInterface[]>
  >;
}) => {
  delete projectDetails.fileDeliverable;
  delete projectDetails.textDeliverable;
  const descriptionProjectDetails: DescriptionProjectDetailsInterface =
    projectDetails;

  const { address, isConnected } = useAccount();

  return (
    <>
      <div className="flex flex-col gap-4 xs:mt-8 mt-4 sm:w-[80%] w-full">
        {DescriptionProjectDetailsInterfaceKeys.map(
          (descriptionSection, index) => {
            let descriptionText = descriptionProjectDetails[descriptionSection];
            if (
              descriptionSection === "Lancer's Wallet Address" &&
              descriptionText === addressZero
            ) {
              descriptionText = new String("unassigned").toUpperCase();
            }
            return (
              <div key={`description-section-${index}`}>
                <h2 className="xs:text-base text-sm text-white">
                  {descriptionSection}
                </h2>
                {descriptionSection.toLowerCase().includes("address") ? (
                  <p
                    className={`text-[10px] xs:text-base font-normal break-words`}
                  >
                    {descriptionText}
                  </p>
                ) : (
                  <p className={`xs:text-base text-xs font-normal break-words`}>
                    {descriptionText}
                  </p>
                )}
              </div>
            );
          }
        )}
      </div>
      {projectDetails.Status === StatusEnum.WaitingForConnectingLancersWallet && (
        <CustomButton
          text="Approve Project By Freelancer"
          type="button"
          onClick={() => {
            assignProject(
              // nftOwnerAddress,
              freelancerAddress,
              projectDetails["Client's Wallet Address"],
              // projectDetails["NFT(Contract Address)"],
              openConnectModal,
              signTypedDataAsync,
              projectId,
              setProjectDetails,
              setIsAssigned,
              setNotificationConfiguration,
              setShowNotification
            );
          }}
          styles="w-full mx-auto block bg-[#3E8ECC] hover:bg-[#377eb5] rounded-md text-center text-lg font-semibold text-white py-[4px] px-7 mt-6"
        />
      )}
      {projectDetails.Status === StatusEnum.PayInAdvance && (
        <CustomButton
          text="Prepay Escrow"
          styles="w-full mx-auto block bg-[#3E8ECC] hover:bg-[#377eb5] rounded-md text-center text-lg font-semibold text-white py-[4px] px-7 mt-6"
          type="submit"
          onClick={async (e) => {
            e.preventDefault();

            if (isConnected && address == projectDetails["Client's Wallet Address"]) {
              try {
                // Prepay amount
                console.log("Reward: %sUSDC", projectDetails["Reward(USDC)"]);
                const amount = ethers.utils.parseEther(projectDetails["Reward(USDC)"].toString());

                // Approve tokens
                const approveResult = await approve(EscrowAddress, amount);
                console.log("Approve Result: ", approveResult);

                // Deposit tokens
                console.log("Recipient: %s, ProjectId: %s", projectDetails["Lancer's Wallet Address"], projectId);
                const depositResult = await depositTokens(projectDetails["Lancer's Wallet Address"], amount, projectId);
                console.log("Deposit Result: ", depositResult);

                // Update the status to "Waiting for Submission"
                const updatedSubsetProjectDetail: Partial<StoreProjectDetailsInterface> =
                  {
                    "Status": StatusEnum.WaitingForSubmission,
                  };
                await updateProjectDetails(projectId, updatedSubsetProjectDetail);
                const [_, updatedProjectDetails] = await getDataFromFireStore(
                  projectId
                );

                setProjectDetails(updatedProjectDetails);

                setNotificationConfiguration({
                  modalColor: "#62d140",
                  title: "Sucess",
                  message: "Successfully prepaid tokens",
                  icon: IconNotificationSuccess,
                });
                setShowNotification(true);
              } catch (error) {
                console.log("Prepay Failed: ", error);
                setNotificationConfiguration({
                  modalColor: "#d14040",
                  title: "Error",
                  message: "Error prepaying tokens",
                  icon: IconNotificationError,
                });
                setShowNotification(true);
              }
            } else {
              setNotificationConfiguration({
                modalColor: "#d14040",
                title: "Error",
                message: "Please connect your right wallet account",
                icon: IconNotificationError,
              });
              setShowNotification(true);
            }
            

          }}
        />
      )}
    </>
  );
};

export default ProjectDetailsDescription;
