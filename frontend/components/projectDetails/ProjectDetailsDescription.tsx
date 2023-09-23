import React, { useState } from "react";

// Interface Imports
import {
  DisplayFileDeliverableInterface,
  DisplayTextDeliverableInterface,
  NotificationConfigurationInterface,
  ProjectDisplayInterface,
} from "../../interfaces";

// Constant Imports
import {
  DescriptionProjectDetailsInterfaceKeys,
  addressZero,
} from "../../constants";

// Custom Component Imports
import { CustomButton } from "..";

// Utils Imports
import { assingProject, populateStates } from "../../utils";

// Context Imports
import { IconNotificationSuccess, IconNotificationError } from "../../assets";
import { useAccount } from "wagmi";

const ProjectDetailsDescription = ({
  setFileDeliverables,
  projectId,
  setProjectDetails,
  setNotificationConfiguration,
  setShowNotification,
  setTextDeliverables,
  projectDetails,
}: {
  setFileDeliverables: React.Dispatch<
    React.SetStateAction<DisplayFileDeliverableInterface[] | undefined>
  >;
  projectId: string;
  setProjectDetails: React.Dispatch<
    React.SetStateAction<ProjectDisplayInterface>
  >;
  setNotificationConfiguration: React.Dispatch<
    React.SetStateAction<NotificationConfigurationInterface>
  >;
  setShowNotification: React.Dispatch<React.SetStateAction<boolean>>;
  projectDetails: ProjectDisplayInterface;
  setTextDeliverables: React.Dispatch<
    React.SetStateAction<DisplayTextDeliverableInterface[] | undefined>
  >;
}) => {
  const { fileDeliverable, textDeliverable, ...projectDetailsDescription } =
    projectDetails;

  const { address, isConnected } = useAccount();

  // States
  const [isLoading, setIsLoading] = useState(false);

  return (
    <>
      <div className="flex flex-col gap-4 xs:mt-8 mt-4 sm:w-[80%] w-full">
        {DescriptionProjectDetailsInterfaceKeys.map(
          (descriptionSection, index) => {
            let descriptionText = projectDetailsDescription[descriptionSection];
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
      {projectDetails["Lancer's Wallet Address"] === "" && (
        <CustomButton
          text={isLoading ? "Approving Project..." : "Approve Project"}
          styles={`w-full mx-auto block ${
            isLoading
              ? "bg-[#a1a1a1] cursor-not-allowed"
              : "bg-[#3E8ECC] hover:bg-[#377eb5]"
          } rounded-md text-center text-lg font-semibold text-white py-[4px] px-7 mt-6`}
          type="button"
          onClick={async () => {
            if (isConnected && address) {
              setIsLoading(true);
              try {
                await assingProject(
                  projectId,
                  {
                    Title: projectDetails.Title,
                    Detail: projectDetails.Detail,
                    "Deadline(UTC)": projectDetails["Deadline(UTC)"],
                    "Reward(USDC)": projectDetails["Reward(USDC)"],
                    "NFT(Contract Address)":
                      projectDetails["NFT(Contract Address)"],
                    "Client's Wallet Address":
                      projectDetails["Client's Wallet Address"],
                  },
                  address
                );

                await populateStates(
                  projectId,
                  setProjectDetails,
                  setFileDeliverables,
                  setNotificationConfiguration,
                  setShowNotification,
                  setTextDeliverables
                );

                setNotificationConfiguration({
                  modalColor: "#62d140",
                  title: "Success",
                  message: "Project Approved",
                  icon: IconNotificationSuccess,
                });
              } catch (error) {
                if (
                  `${error}`.includes(
                    "You must be authenticated to create a project."
                  )
                ) {
                  setNotificationConfiguration({
                    modalColor: "#d14040",
                    title: "Error Approving Project",
                    message:
                      "Invalid or unauthenticated connected wallet address",
                    icon: IconNotificationError,
                  });
                } else if (`${error}`.includes("Project already assigned")) {
                  setNotificationConfiguration({
                    modalColor: "#d14040",
                    title: "Error Approving Project",
                    message: "This project is already assigned",
                    icon: IconNotificationError,
                  });
                } else if (
                  `${error}`.includes(
                    "The provided wallet address does not own any NFTs for this NFT contract"
                  )
                ) {
                  setNotificationConfiguration({
                    modalColor: "#d14040",
                    title: "Error Approving Project",
                    message: "This address does not own required NFT",
                    icon: IconNotificationError,
                  });
                } else if (`${error}`.includes("Invalid projectId")) {
                  setNotificationConfiguration({
                    modalColor: "#d14040",
                    title: "Error Approving Project",
                    message: "Invalid Project Id provided",
                    icon: IconNotificationError,
                  });
                } else if (`${error}`.includes("ChainMismatchError")) {
                  setNotificationConfiguration({
                    modalColor: "#d14040",
                    title: "Error Approving Project",
                    /**
                     * @TODO for production use polygon mainnet
                     */
                    message: "Incorrect chain connected use Mumbai testnet",
                    icon: IconNotificationError,
                  });
                } else {
                  setNotificationConfiguration({
                    modalColor: "#d14040",
                    title: "Error Approving Project",
                    message: "Unknown error occured",
                    icon: IconNotificationError,
                  });
                }
              } finally {
                setShowNotification(true);
                setIsLoading(false);
              }
            } else {
              return;
            }
          }}
        />
      )}
    </>
  );
};

export default ProjectDetailsDescription;
