import React, { useState } from "react";
import { useRouter } from "next/router";

// Interfaces Imports
import {
  CreateProjectFieldInterface,
  CreateProjectFormInterface,
  NftAddressDetailsInterface,
} from "../../interfaces";

// Custom Components Imports
import CustomButton from "../CustomButton";

// Constants Imports
import { createProjectFields, signProjectEip712 } from "../../constants";

// Framer Motion Imports
import { motion } from "framer-motion";
import { fadeIn, textVariant } from "../../utils";

// Ethers/Wagmi Imports
import { useSignTypedData } from "wagmi";

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
}: {
  form: CreateProjectFormInterface;
  setForm: React.Dispatch<React.SetStateAction<CreateProjectFormInterface>>;
  nftAddressDetails: NftAddressDetailsInterface;
  setnftAddressDetails: React.Dispatch<
    React.SetStateAction<NftAddressDetailsInterface>
  >;
}): JSX.Element => {
  // Notification Context
  const context = useNotificationContext();
  const setShowNotification = context.setShowNotification;
  const setNotificationConfiguration = context.setNotificationConfiguration;

  const { signTypedDataAsync } = useSignTypedData({
    domain: signProjectEip712.domain,
    types: signProjectEip712.types,
    value: {
      title: form.Title,
      detail: form.Detail,
      deadline: form["Deadline(UTC)"],
      reward: form["Reward(USDC)"],
      "NFT Address": form["NFT(Contract Address)"],
      lancerAddress: form["Lancer's Wallet Address"],
    },
  });

  // Next Router
  const router = useRouter();
  const { pathname } = router;

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

  const signProjectDetail = async (e: React.MouseEvent) => {
    e.preventDefault();
    try {
      await signTypedDataAsync();
      setNotificationConfiguration({
        modalColor: "#62d140",
        title: "Success",
        message: "Project Verified!",
        icon: IconNotificationSuccess,
      });
    } catch (error) {
      if (String(error).includes("invalid address")) {
        setNotificationConfiguration({
          modalColor: "#d1d140",
          title: "Invalid Address",
          message: "Invalid Address for signing Project Detail!",
          icon: IconNotificationWarning,
        });
      } else if (String(error).includes("UserRejectedRequestError")) {
        setNotificationConfiguration({
          modalColor: "#d14040",
          title: "Rejected",
          message: "Rejected Signing Project Detail",
          icon: IconNotificationError,
        });
      } else {
        setNotificationConfiguration({
          modalColor: "#d14040",
          title: "Error",
          message: "Some error signing the Project Detail",
          icon: IconNotificationError,
        });
      }
    }
    setShowNotification(true);
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
          {pathname === "/createProject"
            ? "Create Project"
            : pathname === "/projectDetail"
            ? "Project Detail"
            : null}
        </motion.h1>

        {/* Form Fields */}
        <div className="flex flex-col gap-6 pt-8">
          {createProjectFields.map((formField, index) => {
            if (pathname === "/createProject") {
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
            } else if (pathname === "/projectDetail") {
              return (
                formField.title != "NFT(Contract Address)" && (
                  <FormFields
                    formField={formField}
                    index={index}
                    form={form}
                    updateFormField={updateFormField}
                    key={index}
                  />
                )
              );
            } else return null;
          })}
        </div>

        {/* Buttons */}
        <div className="w-full flex flex-row justify-end">
          {pathname === "/createProject" ? (
            // "Create Project Button"
            nftAddressDetails.isNftAddress === false ? (
              <CustomButton
                text="1/2 Verify NFT Address"
                styles="w-full bg-[#3E8ECC] rounded-md text-center text-lg font-semibold text-white py-[4px] px-7 hover:bg-[#377eb5] mt-12"
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  isNftContract(
                    form["NFT(Contract Address)"],
                    setNotificationConfiguration,
                    setShowNotification,
                    setnftAddressDetails
                  );
                }}
              />
            ) : (
              <CustomButton
                text="2/2 Create Project"
                styles="w-full bg-[#3E8ECC] rounded-md text-center text-lg font-semibold text-white py-[4px] px-7 hover:bg-[#377eb5] mt-12"
                type="submit"
                onClick={(e) => {
                  e.preventDefault();
                  router.push("/projectDetail");
                }}
              />
            )
          ) : pathname === "/projectDetail" ? (
            <div className="w-full flex flex-col gap-6 mt-12 justify-between">
              {/* Prepay Escrow Button */}
              <CustomButton
                text="Prepay Escrow"
                styles="bg-[#3E8ECC] rounded-md text-center text-lg font-semibold text-white py-[4px] px-7 hover:bg-[#377eb5]"
                type="submit"
                onClick={(e) => {
                  e.preventDefault();
                }}
              />
              {/* Pay Lancer Button */}
              <CustomButton
                text="Pay Lancer"
                styles="bg-[#40d1d1] rounded-md text-center text-lg font-semibold text-white py-[4px] px-7 hover:bg-[#31d1d1]"
                type="submit"
                onClick={(e) => {
                  e.preventDefault();
                }}
              />
              {/* Verify and Confirm Button */}
              <CustomButton
                text="Confirm"
                styles="bg-[#d14040] rounded-md text-center text-lg font-semibold text-white py-[4px] px-7 hover:bg-[#d13131]"
                type="submit"
                onClick={(e) => signProjectDetail(e)}
              />
            </div>
          ) : null}
        </div>
      </div>
    </motion.div>
  );
};

export default CreateProjectForm;
