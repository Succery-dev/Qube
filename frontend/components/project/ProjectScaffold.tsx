import React from "react";

// Custom components Imports
import { Glow } from "../";
import { LogoCanvas } from "./3d";
import CreateProjectForm from "./CreateProjectForm";

// Context Imports
import { useProjectContext } from "../../context";

// Constants Imports
import { aesthetics } from "../../constants";

// Framer-Motion Imports
import { motion } from "framer-motion";

// Interface Imports
import { SectionWrapperPropsInterface } from "../../interfaces";

const SectionWrapper: React.FC<SectionWrapperPropsInterface> = ({
  children,
  bgColor,
  glowStyles,
}): JSX.Element => {
  return (
    <motion.div
      className={`w-full grid grid-cols-12 ${bgColor} py-28 overflow-hidden relative min-h-screen`}
    >
      {glowStyles && <Glow styles={glowStyles} />}
      <div className="col-start-2 col-end-12 font-semibold relative flex flex-col justify-center">
        {children}
      </div>
    </motion.div>
  );
};

const ProjectScaffold = ({
  setShowSubmitModal,
  projectId,
}: {
  setShowSubmitModal: React.Dispatch<React.SetStateAction<boolean>>;
  projectId?: string;
}): JSX.Element => {
  const context = useProjectContext();
  const form = context.form;
  const setForm = context.setForm;

  return (
    <div className="font-nunito text-secondary">
      {/* Create Project Section */}
      <SectionWrapper
        bgColor="bg-bg_primary"
        glowStyles={aesthetics.glow.createProjectGlowStyles}
      >
        {/* Create Project Form */}
        <div className="block lg:flex flex-row items-center gap-16">
          {/* Form */}
          <CreateProjectForm
            form={form}
            setForm={setForm}
            setShowSubmitModal={setShowSubmitModal}
            projectId={projectId}
          />
          {/* 3D Logo */}
          <div className="w-1/2 h-[500px] lg:block hidden">
            <LogoCanvas />
          </div>
        </div>
      </SectionWrapper>
    </div>
  );
};

export default ProjectScaffold;
