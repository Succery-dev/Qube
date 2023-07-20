import React, { useState, useEffect } from "react";

// Interface Imports
import {
  DisplayFileDeliverableInterface,
  DisplayProjectDetailsInterface,
  DisplayTextDeliverableInterface,
  SectionWrapperPropsInterface,
  StoreFileDeliverableInterface,
} from "../../interfaces";

// Framer-Motion Imports
import { motion } from "framer-motion";

// Custom Component Imports
import {
  CustomButton,
  Glow,
  ProjectDetailsDescription,
  Dropbox,
  SubmitTextArea,
} from "../index";

// Constant Imports
import { aesthetics, signProjectEip712 } from "../../constants";

// Wagmi Imports
import { useAccount, useSignTypedData } from "wagmi";

// Rainbowkit Imports
import { useConnectModal } from "@rainbow-me/rainbowkit";

// Context Imports
import { useNotificationContext } from "../../context";

// utils Imports
import { checkNftOwnership, getDataFromFireStore } from "../../utils";
import { assingProject, populateStates } from "../../utils/projectDetail";
import { IconNotificationWarning } from "../../assets";

const SectionWrapper: React.FC<SectionWrapperPropsInterface> = ({
  children,
  bgColor,
  glowStyles,
}): JSX.Element => {
  return (
    <motion.div
      className={`w-full grid grid-cols-12 ${bgColor} xl:py-40 lg:py-32 py-28 overflow-hidden relative min-h-screen font-nunito`}
    >
      {glowStyles && <Glow styles={glowStyles} />}
      <div className="col-start-2 lg:col-end-10 col-end-12 font-semibold relative flex flex-col justify-center">
        {children}
      </div>
    </motion.div>
  );
};

const ProjectDetails = ({ projectId }: { projectId: string }): JSX.Element => {
  // Notification Context
  const context = useNotificationContext();
  const setShowNotification = context.setShowNotification;
  const setNotificationConfiguration = context.setNotificationConfiguration;

  // States
  const [section, setSection] = useState("description");
  const [projectDetails, setProjectDetails] = useState(
    {} as DisplayProjectDetailsInterface
  );
  const [isAssigned, setIsAssigned] = useState(false);
  const [fileDeliverables, setFileDeliverables] =
    useState<DisplayFileDeliverableInterface[]>();
  const [textDeliverables, setTextDeliverables] =
    useState<DisplayTextDeliverableInterface[]>();

  // Wagmi
  const { address } = useAccount();
  const { openConnectModal } = useConnectModal();
  const { signTypedDataAsync } = useSignTypedData({
    domain: signProjectEip712.domain,
    types: signProjectEip712.types,
    value: {
      Title: projectDetails.Title,
      Detail: projectDetails.Detail,
      "Deadline(UTC)": projectDetails["Deadline(UTC)"],
      "Reward(USDC)": projectDetails["Reward(USDC)"],
      "NFT(Contract Address)": projectDetails["NFT(Contract Address)"],
      "Client's Wallet Address": projectDetails["Client's Wallet Address"],
      "Lancer's Wallet Address": address,
    },
  });

  useEffect(() => {
    if (projectId) {
      populateStates(
        projectId,
        setIsAssigned,
        setProjectDetails,
        setFileDeliverables,
        setNotificationConfiguration,
        setShowNotification,
        setTextDeliverables
      );
    }
  }, [projectId]);

  return (
    <SectionWrapper
      bgColor="bg-bg_primary"
      glowStyles={aesthetics.glow.createProjectGlowStyles}
    >
      <div className="w-full lg:p-[3px] p-[2px] rounded-lg blue-transparent-green-gradient-vertical">
        <div className="w-full h-full rounded-lg bg-black">
          <div className="w-full xl:px-8 xl:py-12 px-6 sm:py-10 py-6 text-[#959595]">
            {/* Header */}
            <div className="w-full text-white">
              {section === "description" && (
                <h1 className="sm:text-4xl xs:text-3xl text-3xl">
                  Project for{" "}
                  {projectDetails["Client's Wallet Address"] != undefined
                    ? `${projectDetails["Client's Wallet Address"].slice(
                        0,
                        7
                      )}...${projectDetails["Client's Wallet Address"].slice(
                        -4
                      )}`
                    : ""}
                </h1>
              )}

              {section === "files" && (
                <h1 className="sm:text-4xl xs:text-3xl text-3xl">
                  Submit Files
                </h1>
              )}
              {section === "text" && (
                <h1 className="sm:text-4xl xs:text-3xl text-3xl">
                  Submit Text
                </h1>
              )}

              {/* Detail Sections */}
              <div className="flex flex-row xs:justify-start justify-between sm:gap-8 xs:gap-4 gap-0 xs:mt-6 mt-6">
                <CustomButton
                  text="Description"
                  styles={`${
                    section === "description" ? "bg-[#3E8ECC]" : ""
                  } rounded-md text-center xs:text-base text-sm text-white py-[2px] px-4 hover:bg-[#377eb5]`}
                  onClick={() => {
                    setSection("description");
                  }}
                  type={"button"}
                />
                <CustomButton
                  text="Files"
                  styles={`${
                    section === "files" ? "bg-[#3E8ECC]" : ""
                  } rounded-md text-center xs:text-base text-sm text-white py-[2px] px-4 hover:bg-[#377eb5]`}
                  onClick={() => {
                    setSection("files");
                  }}
                  type={"button"}
                />
                <CustomButton
                  text="Text"
                  styles={`${
                    section === "text" ? "bg-[#3E8ECC]" : ""
                  } rounded-md text-center xs:text-md text-sm text-white py-[2px] px-4 hover:bg-[#377eb5]`}
                  onClick={() => {
                    setSection("text");
                  }}
                  type={"button"}
                />
              </div>
              {/* Separator Line */}
              <div className="w-full py-[0.6px] mt-4 bg-[#1E1E1E]"></div>
            </div>
            {/* Main */}
            {section === "description" && (
              <ProjectDetailsDescription
                isAssigned={isAssigned}
                openConnectModal={openConnectModal}
                signTypedDataAsync={signTypedDataAsync}
                nftOwnerAddress={address}
                setFileDeliverables={setFileDeliverables}
                projectId={projectId}
                setIsAssigned={setIsAssigned}
                setProjectDetails={setProjectDetails}
                setNotificationConfiguration={setNotificationConfiguration}
                setShowNotification={setShowNotification}
                projectDetails={projectDetails}
                setTextDeliverables={setTextDeliverables}
              />
            )}
            {section === "files" && (
              <Dropbox
                fileDeliverables={fileDeliverables}
                setFileDeliverables={setFileDeliverables}
                projectId={projectId}
                setIsAssigned={setIsAssigned}
                isAssigned={isAssigned}
                setProjectDetails={setProjectDetails}
                setNotificationConfiguration={setNotificationConfiguration}
                setShowNotification={setShowNotification}
                projectDetails={projectDetails}
                setTextDeliverables={setTextDeliverables}
              />
            )}
            {section === "text" && (
              <SubmitTextArea
                textDeliverables={textDeliverables}
                setFileDeliverables={setFileDeliverables}
                projectId={projectId}
                setIsAssigned={setIsAssigned}
                isAssigned={isAssigned}
                setProjectDetails={setProjectDetails}
                setNotificationConfiguration={setNotificationConfiguration}
                setShowNotification={setShowNotification}
                projectDetails={projectDetails}
                setTextDeliverables={setTextDeliverables}
              />
            )}
          </div>
        </div>
      </div>
    </SectionWrapper>
  );
};

export default ProjectDetails;
