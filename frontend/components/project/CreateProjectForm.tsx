import React, { useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import Datepicker from "react-tailwindcss-datepicker";

// Interfaces Imports
import {
  CreateProjectFieldInterface,
  CreateProjectFormInterface,
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
import { useAccount } from "wagmi";
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

// Firebase Imports
import { collection, addDoc, doc, getDoc } from "firebase/firestore";
import { database } from "../../utils";

// Status Enum Import
import { StatusEnum, TokenAddress } from "../../enums";

const getTomorrow = () => {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  return tomorrow;
}

const getPaymentDate = (date: string) => {
  const submissionDate = new Date(date);
  submissionDate.setDate(submissionDate.getDate() + 7);
  return {
    startDate: submissionDate.toString(),
    endDate: submissionDate.toString(),
  };
}

const FormFields = ({
  formField,
  index,
  form,
  setForm,
  updateFormField,
}: {
  formField: CreateProjectFieldInterface;
  index: number;
  form: CreateProjectFormInterface;
  setForm: React.Dispatch<React.SetStateAction<CreateProjectFormInterface>>;
  updateFormField: (
    e:
      | React.ChangeEvent<HTMLTextAreaElement>
      | React.ChangeEvent<HTMLInputElement>
      | string,
    formFieldtitle: string
  ) => void;
}): JSX.Element => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const tokenTypes = ["USDC", "USDT", "MATIC", "JPYC"];
  const [tokenType, setTokenType] = useState("USDC");

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
        {formField.title === "Deadline(UTC)" ? (
          <div className="flex flex-row gap-5">
            <p className="w-1/2">Submission Date (UTC)*</p>
            <p className="text-gray-500">Payment Date (UTC)</p>
          </div>
        ) : formField.title === "Reward(USDC)" ? "Reward*" : `${formField.title}*`}
      </h2>
      <div className="grid place-items-center w-full bg-slate-700 rounded-sm">
        {formField.type === "textArea" ? (
          <textarea
            className="w-full h-full border-none bg-slate-800 focus:bg-slate-900 rounded-sm px-2 py-[0.3rem] text-sm outline-none text-white"
            placeholder={formField.placeholder}
            rows={4}
            value={form[formField.title as keyof typeof form]}
            onChange={(e) => updateFormField(e, formField.title)}
            required
          />
        ) : formField.title === "Deadline(UTC)" ? (
          <div className="flex flex-row w-full">
            <Datepicker
              inputId={formField.title}
              inputName={formField.title}
              inputClassName="w-full h-full border-none bg-slate-800 focus:bg-slate-900 rounded-sm px-2 py-[0.3rem] text-sm outline-none text-white"
              value={{startDate: form["Deadline(UTC)"], endDate: form["Deadline(UTC)"]}} 
              onChange={(newDate) => {
                setForm({
                  ...form,
                  ["Deadline(UTC)" as keyof typeof form]: newDate.startDate,
                });
              }} 
              asSingle={true} 
              useRange={false}
              minDate={getTomorrow()}
              startFrom={getTomorrow()}
              placeholder="YYYY/MM/DD 21:00"
              displayFormat="YYYY/MM/DD 21:00"
            />
            <span className="w-[100px] bg-black"></span>
            <Datepicker
              inputClassName="w-full h-full border-none bg-slate-800 focus:bg-slate-900 rounded-sm px-2 py-[0.3rem] text-sm outline-none text-gray-500"
              value={getPaymentDate(form["Deadline(UTC)"])}
              onChange={() => {}}
              asSingle={true}
              placeholder="YYYY/MM/DD 21:30"
              displayFormat="YYYY/MM/DD 21:30"
              disabled={true}
            />
          </div>
        ) : formField.title === "Reward(USDC)" ? (
          <div className="flex w-full">
            <input
              type={formField.type}
              name={formField.title}
              id={formField.title}
              className="w-full h-full border-none bg-slate-800 focus:bg-slate-900 rounded-sm px-2 py-[0.3rem] text-sm outline-none text-white"
              placeholder={formField.placeholder}
              min={0}
              value={form[formField.title as keyof typeof form]}
              onChange={(e) => updateFormField(e, formField.title)}
              required
            />
            <div className="relative grow">
              <button type="button" className="relative w-full rounded-md cursor-default bg-slate-800 h-full pr-10 pl-3 shadow-sm ring-1 ring-inset ring-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 sm:text-sm sm:leading-6" aria-haspopup="listbox" aria-expanded="true" aria-labelledby="listbox-label" onClick={() => setIsDropdownOpen(!isDropdownOpen)}>
                <span className="ml-3 block truncate font-bold">{tokenType}</span>
                <span className="pointer-events-none absolute inset-y-0 right-0 ml-3 flex items-center pr-2">
                  <svg className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fill-rule="evenodd" d="M10 3a.75.75 0 01.55.24l3.25 3.5a.75.75 0 11-1.1 1.02L10 4.852 7.3 7.76a.75.75 0 01-1.1-1.02l3.25-3.5A.75.75 0 0110 3zm-3.76 9.2a.75.75 0 011.06.04l2.7 2.908 2.7-2.908a.75.75 0 111.1 1.02l-3.25 3.5a.75.75 0 01-1.1 0l-3.25-3.5a.75.75 0 01.04-1.06z" clip-rule="evenodd" />
                  </svg>
                </span>
              </button>
              {isDropdownOpen &&
                <ul className="absolute z-10 mt-1 max-h-56 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm" role="listbox" aria-labelledby="listbox-label" aria-activedescendant="listbox-option-3" tabIndex={-1}>
                  {tokenTypes.filter(type => type !== tokenType).map((type, index) => (
                    <li 
                      key={index} 
                      className="text-gray-900 relative cursor-default select-none py-2" 
                      role="option"
                      onClick={(e) => {
                        setTokenType(type); 
                        updateFormField(type, "tokenSymbol");
                        setIsDropdownOpen(false);
                      }}
                    >
                      <p className="block truncate font-bold text-center">{type}</p>
                    </li>
                  ))}
                </ul>
              }
            </div>
          </div>
        ) : (
          <input
            type={formField.type}
            name={formField.title}
            id={formField.title}
            className="w-full h-full border-none bg-slate-800 focus:bg-slate-900 rounded-sm px-2 py-[0.3rem] text-sm outline-none text-white"
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
  // nftAddressDetails,
  // setnftAddressDetails,
  setShowProjectModal,
  setProjectDetailLink,
  setUserType,
  // setShowSubmitModal,
  // projectId,
}: {
  form: CreateProjectFormInterface;
  setForm: React.Dispatch<React.SetStateAction<CreateProjectFormInterface>>;
  // nftAddressDetails: NftAddressDetailsInterface;
  // setnftAddressDetails: React.Dispatch<React.SetStateAction<NftAddressDetailsInterface>>;
  setShowProjectModal: React.Dispatch<React.SetStateAction<boolean>>;
  setProjectDetailLink: React.Dispatch<React.SetStateAction<string>>;
  setUserType: React.Dispatch<React.SetStateAction<string>>;
  // setShowSubmitModal: React.Dispatch<React.SetStateAction<boolean>>;
  // projectId?: string;
}): JSX.Element => {
  // useEffect(() => {
  //   const fetchData = async () => {
  //     try {
  //       console.log("Fetching project data...");
  //       const res = await axios.get(`/api/projectDetail/${projectId}`);
  //       const projectData = res.data;

  //       setForm((prevForm) => ({
  //         ...prevForm,
  //         Title: projectData.Title,
  //         Detail: projectData.Detail,
  //         "Deadline(UTC)": projectData.Deadline,
  //         "Reward(USDC)": projectData.Reward,
  //         "Lancer's Wallet Address": projectData.LancerAddress,
  //       }));
  //     } catch (error) {
  //       console.log("Error has occured with /api/project/[walletAddress].ts");
  //     }
  //   };
  
  //   fetchData();
  // }, []);

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
      | React.ChangeEvent<HTMLInputElement>
      | string,
    formFieldtitle: string
  ) => {
    const value = typeof e === "string" ? e : e.target.value;
    setForm({
      ...form,
      [formFieldtitle as keyof typeof form]: value,
    });
  };

  /**
   * @dev DEMO firebase functions
   */
  const databaseRef = collection(database, "projects");
  const addDataToFirestore = async (form: StoreProjectDetailsInterface) => {
    if (isConnected) {
      try {
        const regex = /^[1-9]\d*$/;
        if (!regex.test(form["Reward(USDC)"].toString())) {
          throw new Error("Invalid Reward Value. Only natural numbers are allowed.");
        }

        const docRef = doc(database, "users", address);
        const docSnapshot = await getDoc(docRef);
        const docData = docSnapshot.data();
        const userType = docData.userType;

        form.createdBy = userType;
        setUserType(userType);

        const date = new Date(form["Deadline(UTC)"]);
        const submissionDeadline = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate(), 21, 0, 0, 0));
        form["Deadline(UTC)"] = submissionDeadline.toISOString();
        date.setDate(date.getDate() + 7);
        const paymentDeadline = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate(), 21, 30, 0, 0));
        form["Deadline(UTC) For Payment"] = paymentDeadline.toISOString();
        form["Client's Wallet Address"] = userType === "depositor" ? address : addressZero;
        form["Lancer's Wallet Address"] = userType === "depositor" ? addressZero : address;
        form.approveProof = "";
        form.fileDeliverable = [];
        form.textDeliverable = [];
        form.Status = StatusEnum.WaitingForConnectingLancersWallet;
        form.DeadlineExtensionRequest = false;
        form.InDispute = false;
        form.RequestedDeadlineExtension = "";
        form.prepayTxHash = "";
        form.tokenAddress = TokenAddress[form.tokenSymbol];
        form.feedbackComment = "";
        form.projectRating = 0;

        const now = new Date();
        form.createdAt = now.toISOString();

        const response = await addDoc(databaseRef, form);
        const projectDetailLink =
          /**
           * @Todo use https:// for production
           */
          // `https://${window.location.host}/ProjectDetail/${response.id}`;
          `http://${window.location.host}/projectDetails/${response.id}`;

        setProjectDetailLink(projectDetailLink);

        setNotificationConfiguration({
          modalColor: "#62d140",
          title: "Successfully created the project",
          message: `Share the link and wait till the ${userType === "depositor" ? "creator" : "company"} signs to the project!`,
          icon: IconNotificationSuccess,
        });

        setShowProjectModal(true);
      } catch (error) {
        setNotificationConfiguration({
          modalColor: "#d14040",
          title: "Error",
          message: error.message,
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
      className="lg:w-1/2 lg:max-w-auto lg:mx-0 md:max-w-[70vw] mx-auto rounded-lg lg:p-[3px] p-[2px] border border-[#DF57EA] shadow-custom-pink"
    >
      <div className="w-full h-full rounded-lg bg-black px-6 py-14">
        {/* Heading */}
        <motion.h1
          variants={textVariant()}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.25 }}
          className="xl:text-4xl lg:text-3xl md:text-4xl sm:text-xl text-3xl font-extrabold text-[#DF57EA]"
        >
          Create Project

          {/* ================================================================== */}
          {/* Comment out because of the merge conflict in PR#131 */}
          {/* {pathname === "/createProject"
            ? "Create Project"
            : pathname === "/project/[projectId]"
            ? "Project Detail"
            : null} */}
          {/* ========================================================= */}

        </motion.h1>

        {/* Form Fields */}
        <div className="flex flex-col gap-6 pt-8">
          {createProjectFields.map((formField, index) => {
            return (
              formField.title != "Lancer's Wallet Address" && (

            // ==================================================================
            // Comment out because of the merge conflict in PR#131
            // if (pathname === "/createProject") {
            //   return (
            //     formField.title != "Lancer's Wallet Address" && (
            //       <FormFields
            //         formField={formField}
            //         index={index}
            //         form={form}
            //         updateFormField={updateFormField}
            //         key={index}
            //       />
            //     )
            //   );
            // } else if (pathname === "/project/[projectId]") {
            //   return (
            // ==================================================================

                <FormFields
                  formField={formField}
                  index={index}
                  form={form}
                  setForm={setForm}
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
              // nftAddressDetails.isNftAddress
                // ? "2/2 Create Project"
                "Create Project"
                // : "1/2 Verify NFT Address"
            }
            styles="w-full bg-[#DF57EA] rounded-md text-center text-lg font-semibold text-white py-[4px] px-7 hover:bg-[#A9209C] mt-12"
            type="button"
            onClick={(e) => {
              e.preventDefault();

              // if (nftAddressDetails.isNftAddress) {
                addDataToFirestore(form as StoreProjectDetailsInterface);
              // } else {
              //   isNftContract(
              //     form["NFT(Contract Address)"],
              //     setNotificationConfiguration,
              //     setShowNotification,
              //     setnftAddressDetails
              //   );
              // }
            }}
          />

          {/* ================================================================== */}
          {/* Comment out because of the merge conflict in PR#131 */}
          {/* {pathname === "/createProject" ? (
            <CustomButton
              text="Create"
              styles="w-full bg-[#3E8ECC] rounded-md text-center text-lg font-semibold text-white py-[4px] px-7 hover:bg-[#377eb5] mt-12"
              type="submit"
              onClick={async (e) => {
                e.preventDefault();
                await onSubmit();
              }}
            />
          ) : pathname === "/project/[projectId]" ? (
            <div className="w-full flex flex-col gap-6 mt-12 justify-between"> */}
              {/* Prepay Escrow Button */}
              {/* <CustomButton
                text="Prepay Escrow"
                styles="bg-[#3E8ECC] rounded-md text-center text-lg font-semibold text-white py-[4px] px-7 hover:bg-[#377eb5]"
                type="submit"
                onClick={(e) => {
                  e.preventDefault();
                }}
              /> */}
              {/* Pay Lancer Button */}
              {/* <CustomButton
                text="Pay Lancer"
                styles="bg-[#40d1d1] rounded-md text-center text-lg font-semibold text-white py-[4px] px-7 hover:bg-[#31d1d1]"
                type="submit"
                onClick={(e) => {
                  e.preventDefault();
                }}
              /> */}
              {/* Verify and Confirm Button */}
              {/* <CustomButton
                text="Confirm"
                styles="bg-[#d14040] rounded-md text-center text-lg font-semibold text-white py-[4px] px-7 hover:bg-[#d13131]"
                type="submit"
                onClick={(e) => signProjectDetail(e)}
              /> */}

              {/* Submit Project Button */}
              {/* {pathname === "/project/[projectId]" && (
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
          ) : null} */}
          {/* ========================================================= */}

        </div>
      </div>
    </motion.div>
  );
};

export default CreateProjectForm;
