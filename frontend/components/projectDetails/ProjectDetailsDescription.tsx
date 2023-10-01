import React, { useState } from "react";

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
  convertState,
  populateStates,
  updateProjectDetails,
} from "../../utils";

// Context Imports
import { useNotificationContext } from "../../context";
import { IconNotificationError, IconNotificationSuccess } from "../../assets";

import { ethers } from "ethers";
import { approve, allowance } from "../../contracts/MockToken";
import { EscrowAddress, depositTokens, withdrawTokensToRecipientByDepositor } from "../../contracts/Escrow";
import { StatusEnum } from "../../enums";
import { getDataFromFireStore } from "../../utils";
import { useAccount } from "wagmi";
import Modal from "./Modal";

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

  // TODO: fix, these are for the modal
  const [showModal, setShowModal]: [
    showModal: boolean,
    setShowModal: React.Dispatch<React.SetStateAction<boolean>>
  ] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [onConfirm, setOnConfirm] = useState<() => Promise<void>>(() => Promise.resolve());

  const prepayEscrow = async () => {
    if (isConnected && address == projectDetails["Client's Wallet Address"]) {
      try {
        // Prepay amount
        console.log("Reward: %sUSDC", projectDetails["Reward(USDC)"]);
        const amount = ethers.utils.parseUnits(projectDetails["Reward(USDC)"].toString(), 18);

        // Approve tokens
        const approveResult = await approve(EscrowAddress, amount);
        console.log("Approve Result: ", approveResult);
        const approvedTokens = await allowance(projectDetails["Client's Wallet Address"], EscrowAddress);
        console.log("USDC Allowance: ", ethers.utils.formatUnits(approvedTokens, 18));

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
          title: "Successfully prepaid to the escrow",
          message: "Prepaid is done. Wait for the freelancer's submission! Remind the freelancer to submit before the deadline for a smoother transaction.",
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
  }

  const requestDeadlineExtension = async () => {
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
        title: "Successfully requested Deadline-Extension",
        message: "Wait till the freelancer approves the request.",
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
  }

  const acceptDeadlineExtension = async () => {
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
        title: "Successfully accepted Deadline-Extension",
        message: "The submission date has been extended for 2 weeks. Submit your work again before the deadline!",
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
  }

  const rejectDeadlineExtension = async () => {
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
  }

  const disapproveDeliverables = async () => {
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
  }

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
                    {descriptionSection === "Status"
                      ? convertState(descriptionText)
                      : descriptionText
                    }
                  </p>
                )}
              </div>
            );
          }
        )}
      </div>
      {projectDetails.Status === StatusEnum.WaitingForConnectingLancersWallet && (
        <CustomButton
          text="Waiting For Approval"
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
          text="Waiting For Prepay"
          styles="w-full mx-auto block bg-[#3E8ECC] hover:bg-[#377eb5] rounded-md text-center text-lg font-semibold text-white py-[4px] px-7 mt-6"
          type="submit"
          onClick={async (e) => {
            e.preventDefault();

            setTitle("Prepay Escrow");
            setDescription("This is to prepay the money to Qube’s Smart Contract. The money will be held until the submission is approved by you. Do you want to proceed?");
            setOnConfirm(() => prepayEscrow);
            setShowModal(true);
          }}
        />
      )}
      {projectDetails.Status === StatusEnum.WaitingForPayment && !projectDetails.InDispute && (
        <>
          <CustomButton
            text="Waiting For Approval Of The Deliverables"
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
                  title: "Successfully approved the deliverables and paid tokens to the freelancer",
                  message: "Done!",
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
              onClick={async (e) => {
                e.preventDefault();

                setTitle("Disapprove The Deliverables");
                setDescription("If disapproved, the fund will be frozen for 9 months. There is no way you can refund the money before 9 months. This is the ultimate option that should be used if there is no other way. Are you sure you want to disapprove the submission?");
                setOnConfirm(() => disapproveDeliverables);
                setShowModal(true);
              }}
              styles="w-full mx-auto block bg-[#3E8ECC] hover:bg-[#377eb5] rounded-md text-center text-lg font-semibold text-white py-[4px] px-7 mt-6"
            />
          ) : (
            <CustomButton
              text="Request Deadline-Extension"
              type="button"
              onClick={async (e) => {
                e.preventDefault();

                setTitle("Request Deadline-Extension");
                setDescription("This is to extend the submission and payment date for 2 weeks. This can be applied only once. Are you sure you want to extend the deadline? *If yes, let the freelancer know that it has to be approved within a week.");
                setOnConfirm(() => requestDeadlineExtension);
                setShowModal(true);
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
            onClick={async (e) => {
              e.preventDefault();

              setTitle("Accept Deadline-Extension");
              setDescription("By accepting this the submission and payment date will be extended for 2 weeks. If you haven't talked with the opposite person yet, first confirm before pressing accept.");
              setOnConfirm(() => acceptDeadlineExtension);
              setShowModal(true);
            }}
            styles="w-full mx-auto block bg-[#3E8ECC] hover:bg-[#377eb5] rounded-md text-center text-lg font-semibold text-white py-[4px] px-7 mt-6"
          />
          <CustomButton
            text="Reject Deadline-Extension"
            type="button"
            onClick={async (e) => {
              e.preventDefault();

              setTitle("Reject Deadline-Extension");
              setDescription("By denying this, The fund in the escrow will be frozen for 9 months. Are you sure you want to deny it?");
              setOnConfirm(() => rejectDeadlineExtension);
              setShowModal(true);
            }}
            styles="w-full mx-auto block bg-[#FF4B4B] hover:bg-[#E43F3F] rounded-md text-center text-lg font-semibold text-white py-[4px] px-7 mt-6"
          />
        </div>
      )}
      <Modal
        showModal={showModal}
        setShowModal={setShowModal}
        title={title}
        description={description}
        onConfirm={onConfirm}
      />
    </>
  );
};

export default ProjectDetailsDescription;
