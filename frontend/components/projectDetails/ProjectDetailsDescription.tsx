import React from "react";

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
import { EscrowAddress, depositTokens, withdrawTokensToRecipientByDepositor } from "../../contracts/Escrow";
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
                  {/* TODO: fix */}
                  {descriptionSection === "Lancer's Wallet Address"
                    ? "Freelancer's Wallet Address"
                    : descriptionSection === "Deadline(UTC)"
                      ? "Submission Date (UTC)"
                      : descriptionSection === "Deadline(UTC) For Payment"
                        ? "Payment Date (UTC)"
                        : descriptionSection
                  }
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
      {projectDetails.Status === StatusEnum.WaitingForPayment && !projectDetails.InDispute && (
        <>
          <CustomButton
            text="Approve The Deliverables"
            type="button"
            onClick={async () => {
              try {
                if (projectDetails["Client's Wallet Address"] != address) {
                  throw new Error("Not authorized to either accept or reject the deadline-extension");
                }

                // ③ Approve The Submission
                const approveResult = await withdrawTokensToRecipientByDepositor(projectId);
                console.log("Approve Result: ", approveResult);

                // Update the status to "Waiting for Submission"
                const updatedSubsetProjectDetail: Partial<StoreProjectDetailsInterface> =
                  {
                    "Status": StatusEnum.CompleteApproval,
                  };
                await updateProjectDetails(projectId, updatedSubsetProjectDetail);
                const [_, updatedProjectDetails] = await getDataFromFireStore(
                  projectId
                );

                setProjectDetails(updatedProjectDetails);

                setNotificationConfiguration({
                  modalColor: "#62d140",
                  title: "Sucess",
                  message: "Successfully approved the deliverables and paid tokens to the freelancer",
                  icon: IconNotificationSuccess,
                });
              } catch (error) {
                console.log(error);
                setNotificationConfiguration({
                  modalColor: "#d14040",
                  title: "Error",
                  message: "Not authorized to approve the deliverables",
                  icon: IconNotificationError,
                });
              }
              setShowNotification(true);
            }}
            styles="w-full mx-auto block bg-[#3E8ECC] hover:bg-[#377eb5] rounded-md text-center text-lg font-semibold text-white py-[4px] px-7 mt-6"
          />
          {projectDetails.DeadlineExtensionRequest ? (
            <CustomButton
              text="Disapprove The Deliverables"
              type="button"
              onClick={async () => {
                try {
                  if (projectDetails["Client's Wallet Address"] != address) {
                    throw new Error("Not authorized to disapprove the deliverables");
                  }

                  // Set to 9 months later
                  const dateObject = new Date(projectDetails["Deadline(UTC) For Payment"]);
                  dateObject.setMonth(dateObject.getMonth() + 9);

                  // Update "Deadline(UTC) For Payment" to return tokens to clients when disapprove
                  const updatedSubsetProjectDetail: Partial<StoreProjectDetailsInterface> =
                    {
                      "Deadline(UTC) For Payment": dateObject.toISOString(),
                      "Status": StatusEnum.CompleteDisapproval,
                    };
                  await updateProjectDetails(projectId, updatedSubsetProjectDetail);
                  const [_, updatedProjectDetails] = await getDataFromFireStore(
                    projectId
                  );

                  setProjectDetails(updatedProjectDetails);

                  setNotificationConfiguration({
                    modalColor: "#62d140",
                    title: "Sucess",
                    message: "Successfully disapproved and will pay back tokens to the client in 9 months",
                    icon: IconNotificationSuccess,
                  });
                } catch (error) {
                  console.log(error);
                  setNotificationConfiguration({
                    modalColor: "#d14040",
                    title: "Error",
                    message: "Not authorized to disapprove the deliverables",
                    icon: IconNotificationError,
                  });
                }
                setShowNotification(true);
              }}
              styles="w-full mx-auto block bg-[#3E8ECC] hover:bg-[#377eb5] rounded-md text-center text-lg font-semibold text-white py-[4px] px-7 mt-6"
            />
          ) : (
            <CustomButton
              text="Request Deadline-Extension"
              type="button"
              onClick={async () => {
                try {
                  if (projectDetails["Client's Wallet Address"] != address) {
                    throw new Error("Not authorized to request deadline-extension");
                  }

                  const now = new Date();
                  const updatedSubsetProjectDetail: Partial<StoreProjectDetailsInterface> =
                    {
                      "InDispute": true,
                      "DeadlineExtensionRequest": true,
                      "RequestedDeadlineExtension": now.toISOString(),
                    };
                  await updateProjectDetails(projectId, updatedSubsetProjectDetail);
                  const [_, updatedProjectDetails] = await getDataFromFireStore(
                    projectId
                  );

                  setProjectDetails(updatedProjectDetails);

                  setNotificationConfiguration({
                    modalColor: "#62d140",
                    title: "Sucess",
                    message: "Successfully requested Deadline-Extension",
                    icon: IconNotificationSuccess,
                  });
                } catch (error) {
                  console.log(error);
                  setNotificationConfiguration({
                    modalColor: "#d14040",
                    title: "Error",
                    message: "Not authorized to request deadline-extension",
                    icon: IconNotificationError,
                  });
                }
                setShowNotification(true);
              }}
              styles="w-full mx-auto block bg-[#3E8ECC] hover:bg-[#377eb5] rounded-md text-center text-lg font-semibold text-white py-[4px] px-7 mt-6"
            />
          )}
        </>
      )}
      {projectDetails.InDispute && (
        <div className="flex space-x-10">
          <CustomButton
            text="Accept Deadline-Extension"
            type="button"
            onClick={async () => {
              try {
                if (projectDetails["Lancer's Wallet Address"] !== freelancerAddress) {
                  throw new Error("Not authorized to either accept or reject the deadline-extension");
                }

                const submissionDeadline = new Date(projectDetails["Deadline(UTC)"]);
                const paymentDeadline = new Date(projectDetails["Deadline(UTC) For Payment"]);
                submissionDeadline.setDate(submissionDeadline.getDate() + 14);
                paymentDeadline.setDate(paymentDeadline.getDate() + 14);
                console.log("New Submission Dealine: ", submissionDeadline.toISOString());
                console.log("New Payment Dealine: ", paymentDeadline.toISOString());

                const updatedSubsetProjectDetail: Partial<StoreProjectDetailsInterface> =
                  {
                    "Deadline(UTC)": submissionDeadline.toISOString(),
                    "Deadline(UTC) For Payment": paymentDeadline.toISOString(),
                    "InDispute": false,
                    Status: StatusEnum.WaitingForSubmissionDER,
                  };
                await updateProjectDetails(projectId, updatedSubsetProjectDetail);
                const [_, updatedProjectDetails] = await getDataFromFireStore(
                  projectId
                );

                setProjectDetails(updatedProjectDetails);

                setNotificationConfiguration({
                  modalColor: "#62d140",
                  title: "Sucess",
                  message: "Successfully accepted Deadline-Extension",
                  icon: IconNotificationSuccess,
                });
                setShowNotification(true);
              } catch (error) {
                console.log(error);
                setNotificationConfiguration({
                  modalColor: "#d14040",
                  title: "Error",
                  message: "Not authorized to either accept or reject the deadline-extension",
                  icon: IconNotificationError,
                });
              }
              setShowNotification(true);
            }}
            styles="w-full mx-auto block bg-[#3E8ECC] hover:bg-[#377eb5] rounded-md text-center text-lg font-semibold text-white py-[4px] px-7 mt-6"
          />
          <CustomButton
            text="Reject Deadline-Extension"
            type="button"
            onClick={async () => {
              try {
                if (projectDetails["Lancer's Wallet Address"] !== freelancerAddress) {
                  throw new Error("Not authorized to either accept or reject the deadline-extension");
                }

                const paymentDeadline = new Date(projectDetails["Deadline(UTC) For Payment"]);
                paymentDeadline.setMonth(paymentDeadline.getMonth() + 9);
                console.log("New Payment Dealine: ", paymentDeadline.toISOString());

                const updatedSubsetProjectDetail: Partial<StoreProjectDetailsInterface> =
                  {
                    "InDispute": false,
                    Status: StatusEnum.InDispute,
                    "Deadline(UTC) For Payment": paymentDeadline.toISOString(),
                  };
                await updateProjectDetails(projectId, updatedSubsetProjectDetail);
                const [_, updatedProjectDetails] = await getDataFromFireStore(
                  projectId
                );

                setProjectDetails(updatedProjectDetails);

                setNotificationConfiguration({
                  modalColor: "#62d140",
                  title: "Sucess",
                  message: "Successfully rejected Deadline-Extension",
                  icon: IconNotificationSuccess,
                });
                setShowNotification(true);
              } catch (error) {
                console.log(error);
                setNotificationConfiguration({
                  modalColor: "#d14040",
                  title: "Error",
                  message: "Not authorized to either accept or reject the deadline-extension",
                  icon: IconNotificationError,
                });
              }
              setShowNotification(true);
            }}
            styles="w-full mx-auto block bg-[#FF4B4B] hover:bg-[#E43F3F] rounded-md text-center text-lg font-semibold text-white py-[4px] px-7 mt-6"
          />
        </div>
      )}
    </>
  );
};

export default ProjectDetailsDescription;
