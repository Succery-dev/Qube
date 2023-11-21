import React, { useState } from "react";
import { useRouter } from "next/router";
import { useAccount } from "wagmi";

// Custom components Imports
import { Glow } from "../";
import { LogoCanvas } from "./3d";
import CreateProjectForm from "./CreateProjectForm";
import { CreateProjectModal } from "./index";

// Context Imports
import { useProjectContext } from "../../context";

// Constants Imports
import { aesthetics } from "../../constants";

// Framer-Motion Imports
import { motion } from "framer-motion";

// Interface Imports
import {
  SectionWrapperPropsInterface,
  NftAddressDetailsInterface,
} from "../../interfaces";

const SectionWrapper: React.FC<SectionWrapperPropsInterface> = ({
  children,
  // bgColor,
  // glowStyles,
}): JSX.Element => {
  return (
    <motion.div
      className={`w-full grid grid-cols-12 py-28 overflow-hidden relative min-h-screen bg-custom-background bg-contain`}
    >
      {/* {glowStyles && <Glow styles={glowStyles} />} */}
      <div className="col-start-2 col-end-12 font-semibold relative flex flex-col justify-center">
        {children}
      </div>
    </motion.div>
  );
};

const ProjectScaffold = ({
  // setShowSubmitModal,
  // projectId,
}: {
  // setShowSubmitModal: React.Dispatch<React.SetStateAction<boolean>>;
  // projectId?: string;
}): JSX.Element => {
  const context = useProjectContext();
  const form = context.form;
  const setForm = context.setForm;

  const router = useRouter();
  const { address } = useAccount();

  // const [nftAddressDetails, setnftAddressDetails]: [
  //   nftAddressDetails: NftAddressDetailsInterface,
  //   setnftAddressDetails: React.Dispatch<
  //     React.SetStateAction<NftAddressDetailsInterface>
  //   >
  // ] = useState({
  //   isNftAddress: false,
  //   nftCollectionImageUrl: "",
  // });

  const [projectDetailLink, setProjectDetailLink]: [
    projectDetailLink: string,
    setProjectDetailLink: React.Dispatch<React.SetStateAction<string>>
  ] = useState(undefined as string);

  const [showProjectModal, setShowProjectModal]: [
    showProjectModal: boolean,
    setShowProjectModal: React.Dispatch<React.SetStateAction<boolean>>
  ] = useState(false);

  const [userType, setUserType] = useState("");

  return (
    <div className="font-nunito text-secondary">
      {/* Create Project Section */}
      <SectionWrapper
        bgColor="bg-bg_primary"
        glowStyles={aesthetics.glow.createProjectGlowStyles}
      >
        {/* Return to Dashboard Button */}
        <button className="bg-gradient-to-r from-[#DF57EA] to-slate-200 mb-7 mr-auto px-7 py-3 rounded-full text-black" onClick={() => {
          router.push(`http://${window.location.host}/dashboard/${address}`);
        }}>{`DASHBOARD`}</button>
        {/* Create Project Form */}
        <div className="block lg:flex flex-row items-center gap-16">
          {/* Form */}
          <CreateProjectForm
            form={form}
            setForm={setForm}
            // nftAddressDetails={nftAddressDetails}
            // setnftAddressDetails={setnftAddressDetails}
            setShowProjectModal={setShowProjectModal}
            setProjectDetailLink={setProjectDetailLink}
            setUserType={setUserType}
            // setShowSubmitModal={setShowSubmitModal}
            // projectId={projectId}
          />
          {/* 3D Logo */}
          {/* <div className="w-1/2 h-[500px] lg:block hidden">
            <LogoCanvas
              // nftCollectionImageUrl={nftAddressDetails.nftCollectionImageUrl}
            />
          </div> */}
        </div>

        <CreateProjectModal
          showProjectModal={showProjectModal}
          setShowProjectModal={setShowProjectModal}
          projectDetailLink={projectDetailLink}
          userType={userType}
        />
      </SectionWrapper>
    </div>
  );
};

export default ProjectScaffold;
