import React, { useState } from "react";
import { useRouter } from "next/router";

// Interfaces Imports
import {
  CreateProjectFieldInterface,
  CreateProjectFormInterface,
  NftAddressDetailsInterface,
  StoreProjectDetailsInterface,
} from "../../interfaces";

// Custom Components Imports
import CustomButton from "../CustomButton";

// Constants Imports
import { createProjectFields, addressZero } from "../../constants";

// Framer Motion Imports
import { motion } from "framer-motion";
import { fadeIn, textVariant } from "../../utils";

// Ethers/Wagmi Imports
import { useAccount, useSignTypedData } from "wagmi";
// Rainbowkit Imports
import { useConnectModal } from "@rainbow-me/rainbowkit";

// Notification Context Import
import { useNotificationContext } from "../../context";

// Assets/Image Imports
import {
  IconNotificationSuccess,
  IconNotificationWarning,
  IconNotificationError,
} from "../../assets";

// Utils Imports
import { isNftContract } from "../../utils";

// Firebase Imports
import { collection, addDoc } from "firebase/firestore";
import { app, database } from "../../utils";

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
  nftAddressDetails,
  setnftAddressDetails,
  setShowProjectModal,
  setProjectDetailLink,
}: {
  form: CreateProjectFormInterface;
  setForm: React.Dispatch<React.SetStateAction<CreateProjectFormInterface>>;
  nftAddressDetails: NftAddressDetailsInterface;
  setnftAddressDetails: React.Dispatch<
    React.SetStateAction<NftAddressDetailsInterface>
  >;
  setShowProjectModal: React.Dispatch<React.SetStateAction<boolean>>;
  setProjectDetailLink: React.Dispatch<React.SetStateAction<string>>;
}): JSX.Element => {
  // Notification Context
  const context = useNotificationContext();
  const setShowNotification = context.setShowNotification;
  const setNotificationConfiguration = context.setNotificationConfiguration;

  // Next Router
  const router = useRouter();
  const { pathname } = router;

  // Wagmi
  const { isDisconnected, address, isConnected, isConnecting } = useAccount();
  // Rainbowkit
  const { openConnectModal } = useConnectModal();

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

  /**
   * @dev DEMO firebase functions
   */
  const databaseRef = collection(database, "project-details");
  const addDataToFirestore = async (form: StoreProjectDetailsInterface) => {
    if (isConnected) {
      try {
        form["Client's Wallet Address"] = address;
        form["Lancer's Wallet Address"] = addressZero;
        form.approveProof = "";

        console.log("form: ", form);

        const response = await addDoc(databaseRef, form);
        const projectDetailLink =
          /**
           * @Todo use https:// for production
           */
          // `https://${window.location.host}/ProjectDetail/${response.id}`;
          `http://${window.location.host}/projectDetails/${response.id}`;

        console.log("projectDetailLink: ", projectDetailLink);

        setProjectDetailLink(projectDetailLink);

        setNotificationConfiguration({
          modalColor: "#62d140",
          title: "Success",
          message: "Sucessfully created the project",
          icon: IconNotificationSuccess,
        });

        setShowProjectModal(true);
      } catch (error) {
        console.log(error);
        setNotificationConfiguration({
          modalColor: "#d14040",
          title: "Error",
          message: "Error occured creating the project",
          icon: IconNotificationError,
        });
      } finally {
        setShowNotification(true);
      }
    } else {
      setNotificationConfiguration({
        modalColor: "#d1d140",
        title: "Address not Found",
        message: "Please connect Wallet and try again",
        icon: IconNotificationWarning,
      });
      setShowNotification(true);

      openConnectModal();
    }
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
            text={
              nftAddressDetails.isNftAddress
                ? "2/2 Create Project"
                : "1/2 Verify NFT Address"
            }
            styles="w-full bg-[#3E8ECC] rounded-md text-center text-lg font-semibold text-white py-[4px] px-7 hover:bg-[#377eb5] mt-12"
            type="button"
            onClick={(e) => {
              e.preventDefault();

              if (nftAddressDetails.isNftAddress) {
                addDataToFirestore(form as StoreProjectDetailsInterface);
              } else {
                isNftContract(
                  form["NFT(Contract Address)"],
                  setNotificationConfiguration,
                  setShowNotification,
                  setnftAddressDetails
                );
              }
            }}
          />
        </div>
      </div>
    </motion.div>
  );
};

export default CreateProjectForm;
