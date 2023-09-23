import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";

// Interfaces Imports
import {
  CreateProjectFieldInterface,
  CreateProjectFormInterface,
} from "../../interfaces";

// Custom Components Imports
import CustomButton from "../CustomButton";

// Constants Imports
import { createProjectFields } from "../../constants";

// Framer Motion Imports
import { motion } from "framer-motion";
import { fadeIn, textVariant } from "../../utils";

// Ethers/Wagmi Imports
import { useAccount } from "wagmi";
// Rainbowkit Imports
import { useConnectModal } from "@rainbow-me/rainbowkit";

// Notification Context Import
import { useNotificationContext } from "../../context";

// Assets/Image Imports
import { IconNotificationSuccess } from "../../assets";

// Status Enum Import
import { httpsCallable } from "firebase/functions";
import { functions } from "../../utils/firebase";

const FormFields = ({
  formField,
  index,
  form,
  updateFormField,
}: {
  formField: CreateProjectFieldInterface;
  index: number;
  form: CreateProjectFormInterface;
  updateFormField: (
    e:
      | React.ChangeEvent<HTMLTextAreaElement>
      | React.ChangeEvent<HTMLInputElement>,
    formFieldtitle: string
  ) => void;
}): JSX.Element => {
  return (
    <motion.div
      variants={fadeIn("down", 1.25, index, 0.15)}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.25 }}
      className="flex flex-col"
      key={`createProject-${formField.title}`}
    >
      <h2 className="text-lg font-semibold text-secondary">
        {formField.title}*
      </h2>
      <div className="grid place-items-center w-full blue-transparent-green-gradient lg:p-[1.5px] p-[1px] rounded-sm">
        {formField.type === "textArea" ? (
          <textarea
            className="w-full h-full border-none bg-bg_primary focus:bg-[#080e26] rounded-sm px-2 py-[0.3rem] text-sm outline-none text-[#D3D3D3]"
            placeholder={formField.placeholder}
            rows={4}
            value={form[formField.title as keyof typeof form]}
            onChange={(e) => updateFormField(e, formField.title)}
            required
          />
        ) : (
          <input
            type={formField.type}
            name={formField.title}
            id={formField.title}
            className="w-full h-full border-none bg-bg_primary focus:bg-[#080e26] rounded-sm px-2 py-[0.3rem] text-sm outline-none text-[#D3D3D3]"
            placeholder={formField.placeholder}
            min={0}
            value={form[formField.title as keyof typeof form]}
            onChange={(e) => updateFormField(e, formField.title)}
            required
          />
        )}
      </div>
    </motion.div>
  );
};

const CreateProjectForm = ({
  form,
  setForm,
  setShowProjectModal,
}: {
  form: CreateProjectFormInterface;
  setForm: React.Dispatch<React.SetStateAction<CreateProjectFormInterface>>;
  setShowProjectModal: React.Dispatch<
    React.SetStateAction<{
      display: boolean;
      projectLink: string;
      collectionImageUrl: string;
    }>
  >;
}): JSX.Element => {
  // Notification Context
  const context = useNotificationContext();
  const setShowNotification = context.setShowNotification;
  const setNotificationConfiguration = context.setNotificationConfiguration;

  // States
  const [isLoading, setIsLoading] = useState(false);

  // Function Update Form Field
  const updateFormField = (
    e:
      | React.ChangeEvent<HTMLTextAreaElement>
      | React.ChangeEvent<HTMLInputElement>,
    formFieldtitle: string
  ) => {
    setForm({
      ...form,
      [formFieldtitle as keyof typeof form]: e.target.value,
    });
  };

  return (
    // Form Wrapper
    <motion.div
      variants={fadeIn("bottom", 0.4)}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.25 }}
      className="lg:w-1/2 lg:max-w-auto lg:mx-0 md:max-w-[70vw] mx-auto rounded-lg lg:p-[3px] p-[2px] blue-transparent-green-gradient"
    >
      <div className="w-full h-full rounded-lg bg-black px-6 py-14">
        {/* Heading */}
        <motion.h1
          variants={textVariant()}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.25 }}
          className="xl:text-4xl lg:text-3xl md:text-4xl sm:text-xl text-3xl font-extrabold"
        >
          Create Project
        </motion.h1>

        {/* Form Fields */}
        <div className="flex flex-col gap-6 pt-8">
          {createProjectFields.map((formField, index) => {
            return (
              formField.title != "Lancer's Wallet Address" && (
                <FormFields
                  formField={formField}
                  index={index}
                  form={form}
                  updateFormField={updateFormField}
                  key={index}
                />
              )
            );
          })}
        </div>

        {/* Buttons */}
        <div className="w-full flex flex-row justify-end">
          {/* Create Project Button */}
          <CustomButton
            text={isLoading ? "Creating Project..." : "Create Project"}
            styles={`w-full rounded-md text-center text-lg font-semibold py-[4px] px-7 ${
              isLoading
                ? "bg-[#a1a1a1] cursor-not-allowed"
                : "bg-[#3E8ECC] hover:bg-[#377eb5]"
            } mt-12`}
            type="button"
            onClick={async (e) => {
              if (!isLoading) {
                try {
                  e.preventDefault();

                  setIsLoading(true);
                  const createProject = httpsCallable(
                    functions,
                    "createProject"
                  );

                  const createProjectCall = await createProject({
                    Title: form.Title,
                    Detail: form.Detail,
                    "Deadline(UTC)": new Date(form["Deadline(UTC)"])
                      .toISOString()
                      .slice(0, 10),
                    "Reward(USDC)": `${form["Reward(USDC)"]}` as string,
                    "NFT(Contract Address)": form["NFT(Contract Address)"],
                  });
                  const createProjectObj = createProjectCall.data;
                  const { projectLink, collectionImageUrl } =
                    createProjectObj as {
                      projectLink: string | "";
                      collectionImageUrl: string;
                    };

                  setNotificationConfiguration({
                    modalColor: "#62d140",
                    title: "Success",
                    message: "Project Created",
                    icon: IconNotificationSuccess,
                  });
                  setShowProjectModal({
                    display: true,
                    projectLink,
                    collectionImageUrl,
                  });
                } catch (error) {
                  if (
                    `${error}`.includes(
                      "You must be authenticated to create a project."
                    )
                  ) {
                    setNotificationConfiguration({
                      modalColor: "#d14040",
                      title: "Error Creating Project",
                      message: "Invalid or unauthenticated wallet address",
                      icon: IconNotificationSuccess,
                    });
                  } else if (`${error}`.includes("invalid-argument")) {
                    setNotificationConfiguration({
                      modalColor: "#d14040",
                      title: "Error Creating Project",
                      message: "Inappropriate project details",
                      icon: IconNotificationSuccess,
                    });
                  } else if (`${error}`.includes("Invalid address format")) {
                    setNotificationConfiguration({
                      modalColor: "#d14040",
                      title: "Error Creating Project",
                      message: "Invalid address format",
                      icon: IconNotificationSuccess,
                    });
                  } else {
                    setNotificationConfiguration({
                      modalColor: "#d14040",
                      title: "Error Creating Project",
                      message: "Unknown error occoured",
                      icon: IconNotificationSuccess,
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
        </div>
      </div>
    </motion.div>
  );
};

export default CreateProjectForm;
