import React, { useState, useEffect } from "react";

// Interface Imports
import {
  DisplayFileDeliverableInterface,
  DisplayTextDeliverableInterface,
  ProjectDisplayInterface,
  SectionWrapperPropsInterface,
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
import { aesthetics } from "../../constants";

// Wagmi Imports
import { useAccount } from "wagmi";

// Rainbowkit Imports
import { ConnectButton, useConnectModal } from "@rainbow-me/rainbowkit";

// Context Imports
import { useNotificationContext } from "../../context";

// utils Imports
import { populateStates } from "../../utils";

// Firebase Imports
import { auth } from "../../utils/firebase";

const SectionWrapper: React.FC<
  SectionWrapperPropsInterface & { isValidUser: boolean }
> = ({ children, bgColor, glowStyles, isValidUser }): JSX.Element => {
  return (
    <motion.div
      className={`w-full ${
        isValidUser ? "grid grid-cols-12" : "flex justify-center items-center"
      } ${bgColor} xl:py-40 lg:py-32 py-28 overflow-hidden relative min-h-screen font-nunito`}
    >
      {glowStyles && <Glow styles={glowStyles} />}
      <div
        className={`${
          isValidUser
            ? "col-start-2 lg:col-end-10 col-end-12"
            : "max-w-2xl min-w-[312px] lg:w-1/2 w-2/3"
        } font-semibold relative flex flex-col justify-center`}
      >
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
    {} as ProjectDisplayInterface
  );
  const [fileDeliverables, setFileDeliverables] =
    useState<DisplayFileDeliverableInterface[]>();
  const [textDeliverables, setTextDeliverables] =
    useState<DisplayTextDeliverableInterface[]>();

  // Wagmi
  const { address } = useAccount();

  // States
  const [isValidUser, setIsValidUser] = useState(false);

  // Effects
  useEffect(() => {
    if (projectId) {
      if (address) {
        auth.onAuthStateChanged(async (user) => {
          if (user) {
            const validUserStatus = await populateStates(
              projectId,
              setProjectDetails,
              setFileDeliverables,
              setNotificationConfiguration,
              setShowNotification,
              setTextDeliverables
            );

            setIsValidUser(validUserStatus);
          }
        });
      } else {
        setIsValidUser(false);
      }
    }
  }, [projectId, address]);

  return isValidUser ? (
    <SectionWrapper
      bgColor="bg-bg_primary"
      glowStyles={aesthetics.glow.createProjectGlowStyles}
      isValidUser={isValidUser}
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
                    // populateStates(address, projectId);
                  }}
                  type={"button"}
                />
                {projectDetails["Lancer's Wallet Address"] === address && (
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
                )}
                {projectDetails["Lancer's Wallet Address"] === address && (
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
                )}
              </div>
              {/* Separator Line */}
              <div className="w-full py-[0.6px] mt-4 bg-[#1E1E1E]"></div>
            </div>
            {/* Main */}
            {section === "description" && (
              <ProjectDetailsDescription
                setFileDeliverables={setFileDeliverables}
                projectId={projectId}
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
  ) : (
    <SectionWrapper
      bgColor="bg-bg_primary"
      glowStyles={aesthetics.glow.createProjectGlowStyles}
      isValidUser={isValidUser}
    >
      <div className="w-full lg:p-[3px] p-[2px] rounded-lg blue-transparent-green-gradient-vertical">
        <div className="w-full h-full rounded-lg bg-black">
          <div className="w-full px-4 md:px-8 py-8 text-[#959595]">
            {/* Header */}
            <h2 className="text-white sm:text-3xl xs:text-2xl text-xl">
              Connect Wallet to Continue
            </h2>
            <div className="flex flex-col xs:justify-center items-center gap-8 xl:gap-10 xs:mt-4 mt-2 xl:mt-4 mb-4 xl:mb-6">
              <p className="px-[2px] text-[#959595] sm:text-lg xs:text-base text-sm font-light self-start">
                Connecting your wallet is similar to signing in on Web2.
              </p>
              <ConnectButton accountStatus={{ smallScreen: "avatar" }} />
            </div>
          </div>
        </div>
      </div>
    </SectionWrapper>
  );
};

export default ProjectDetails;
