import React, { useEffect } from "react";
import { useRouter } from "next/router";
import axios from "axios";

// Interfaces Imports
import {
  CreateProjectFieldInterface,
  CreateProjectFormInterface,
} from "../../interfaces";

// Custom Components Imports
import CustomButton from "../CustomButton";

// Constants Imports
import { createProjectFields, signProjectEip712 } from "../../constants";

// Framer Motion Imports
import { motion } from "framer-motion";
import { fadeIn, textVariant } from "../../utils";

// Ethers/Wagmi Imports
import { useSignTypedData, useAccount } from "wagmi";

// Notification Context Import
import { useNotificationContext } from "../../context";

// Assets/Image Imports
import {
  IconNotificationSuccess,
  IconNotificationWarning,
  IconNotificationError,
} from "../../assets";

// Status Enum Import
import { StatusEnum } from "../../enums";

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
  setShowSubmitModal,
  projectId,
}: {
  form: CreateProjectFormInterface;
  setForm: React.Dispatch<React.SetStateAction<CreateProjectFormInterface>>;
  setShowSubmitModal: React.Dispatch<React.SetStateAction<boolean>>;
  projectId?: string;
}): JSX.Element => {
  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log("Fetching project data...");
        const res = await axios.get(`/api/projectDetail/${projectId}`);
        const projectData = res.data;

        setForm((prevForm) => ({
          ...prevForm,
          Title: projectData.Title,
          Detail: projectData.Detail,
          "Deadline(UTC)": projectData.Deadline,
          "Reward(USDC)": projectData.Reward,
          "Lancer's Wallet Address": projectData.LancerAddress,
        }));
      } catch (error) {
        console.log("Error has occured with /api/project/[walletAddress].ts");
      }
    };
  
    fetchData();
  }, []);

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

  const { address } = useAccount();

  const onSubmit = async() => {
    console.log("Storing project data...");

    const projectData = {
      ...form,
      Created: new Date().toISOString(),
      Client: address,
      Status: StatusEnum.WaitingForConnectingLancersWallet,
    }
    const id = await axios.post("/api/project", projectData);

    console.log(`status: ${id.status}, id: ${id.data["id"]}`);

    router.push(`/project/${id.data["id"]}`);
  }

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
            : pathname === "/project/[projectId]"
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
            } else if (pathname === "/project/[projectId]") {
              return (
                <FormFields
                  formField={formField}
                  index={index}
                  form={form}
                  updateFormField={updateFormField}
                  key={index}
                />
              );
            } else return null;
          })}
        </div>

        {/* Buttons */}
        <div className="w-full flex flex-row justify-end">
          {pathname === "/createProject" ? (
            // "Create Project Button"
            <CustomButton
              text="Create"
              styles="w-full bg-[#3E8ECC] rounded-md text-center text-lg font-semibold text-white py-[4px] px-7 hover:bg-[#377eb5] mt-12"
              type="submit"
              onClick={async (e) => {
                e.preventDefault();
                await onSubmit();
                // router.push("/projectDetail");
              }}
            />
          ) : pathname === "/project/[projectId]" ? (
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

              {/* Submit Project Button */}
              {pathname === "/project/[projectId]" && (
                <CustomButton
                  text="Submit"
                  styles="bg-[#40d1d1] rounded-md text-center text-lg font-semibold text-white py-[4px] px-7 hover:bg-[#31d1d1]"
                  type="submit"
                  onClick={(e) => {
                    e.preventDefault();
                    setShowSubmitModal(true);
                  }}
                />
              )}
            </div>
          ) : null}
        </div>
      </div>
    </motion.div>
  );
};

export default CreateProjectForm;
