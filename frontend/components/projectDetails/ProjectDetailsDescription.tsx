import React, { useEffect } from "react";

// Interface Imports
import {
  DescriptionProjectDetailsInterface,
  DisplayFileDeliverableInterface,
  DisplayProjectDetailsInterface,
  DisplayTextDeliverableInterface,
  NotificationConfigurationInterface,
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
  assingProject,
  populateStates,
  updateProjectDetails,
} from "../../utils";

// Context Imports
import { useNotificationContext } from "../../context";
import { IconNotificationError, IconNotificationSuccess } from "../../assets";

const ProjectDetailsDescription = ({
  isAssigned,
  openConnectModal,
  signTypedDataAsync,
  nftOwnerAddress,
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
  nftOwnerAddress: `0x${string}`;
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
      {projectDetails && !isAssigned && projectDetails["Lancer's Wallet Address"] === "0x0000000000000000000000000000000000000000" && (
        <CustomButton
          text="Approve Project"
          type="button"
          onClick={() => {
            assingProject(
              nftOwnerAddress,
              projectDetails["NFT(Contract Address)"],
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
      {projectDetails["Lancer's Wallet Address"] !== "0x0000000000000000000000000000000000000000" && (
        <CustomButton
          text="Prepay Escrow"
          styles="w-full mx-auto block bg-[#3E8ECC] hover:bg-[#377eb5] rounded-md text-center text-lg font-semibold text-white py-[4px] px-7 mt-6"
          type="submit"
          onClick={(e) => {
            e.preventDefault();
          }}
        />
      )}
    </>
  );
};

export default ProjectDetailsDescription;
