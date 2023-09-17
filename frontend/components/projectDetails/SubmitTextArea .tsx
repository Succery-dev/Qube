import { motion } from "framer-motion";
import React, { useEffect, useState } from "react";
import { fadeIn, populateStates, updateProjectDetails, getDataFromFireStore } from "../../utils";
import { CustomButton } from "..";
import Image from "next/image";
import {
  IconCopy,
  IconDropdown,
  IconNotificationError,
  IconNotificationSuccess,
  IconNotificationWarning,
} from "../../assets";
import {
  DisplayFileDeliverableInterface,
  DisplayProjectDetailsInterface,
  DisplayTextDeliverableInterface,
  NotificationConfigurationInterface,
  StoreProjectDetailsInterface,
} from "../../interfaces";
import { StatusEnum } from "../../enums";
import Modal from "./Modal";

const SubmitTextArea = ({
  textDeliverables,
  setFileDeliverables,
  projectId,
  setIsAssigned,
  setProjectDetails,
  setNotificationConfiguration,
  setShowNotification,
  projectDetails,
  setTextDeliverables,
  isAssigned,
}: {
  textDeliverables: DisplayTextDeliverableInterface[];
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
  isAssigned: boolean;
}) => {
  // TODO: fix, these are for the modal
  const [showModal, setShowModal]: [
    showModal: boolean,
    setShowModal: React.Dispatch<React.SetStateAction<boolean>>
  ] = useState(false);
  const title = "Submit Text";
  const description = "Are your submissions appropriate? If it’s not appropriate then you may not get the rewards. If you are sure press the OK button.";

  // States
  const [text, setText] = useState<string>();
  const [isUploading, setIsUploading] = useState<boolean>(false);

  const renderDropMenu = (index: number) => {
    setTextDeliverables((prevTextDeliverables) => {
      const updatedTextDeliverables: DisplayTextDeliverableInterface[] = [
        ...prevTextDeliverables,
      ];

      updatedTextDeliverables[index] = {
        text: updatedTextDeliverables[index].text,
        showText: !updatedTextDeliverables[index].showText,
      };

      return updatedTextDeliverables;
    });
  };

  const submitText = async (text: string) => {
    if (!isUploading && text) {
      try {
        if (!isAssigned) {
          throw new Error("Not Approved for the project");
        }

        // Update the status to "Waiting for Payment"
        if (projectDetails.fileDeliverable === undefined && projectDetails.textDeliverable === undefined) {
          const updatedSubsetProjectDetail: Partial<StoreProjectDetailsInterface> =
            {
              "Status": StatusEnum.WaitingForPayment,
            };
          await updateProjectDetails(projectId, updatedSubsetProjectDetail);
          const [_, updatedProjectDetails] = await getDataFromFireStore(
            projectId
          );
          setProjectDetails(updatedProjectDetails);
        }

        setIsUploading(true);
        const prevTextDeliverableStorage = textDeliverables.map(
          (textDeliverable) => textDeliverable.text
        );
        const updatedTextDeliverables = [...prevTextDeliverableStorage, text];
        await updateProjectDetails(projectId, {
          textDeliverable: updatedTextDeliverables,
        });
        await populateStates(
          projectId,
          setIsAssigned,
          setProjectDetails,
          setFileDeliverables,
          setNotificationConfiguration,
          setShowNotification,
          setTextDeliverables
        );

        setNotificationConfiguration({
          modalColor: "#62d140",
          title: "Success",
          message: "Submitted the Text",
          icon: IconNotificationSuccess,
        });

        setIsUploading(false);
      } catch (error) {
        if (error.message === "Not Approved for the project") {
          setNotificationConfiguration({
            modalColor: "#d14040",
            title: "Not Approved",
            message: "Adddress not Approved for project",
            icon: IconNotificationError,
          });
        } else {
          setNotificationConfiguration({
            modalColor: "#d14040",
            title: "Error",
            message: "Error submitting the text",
            icon: IconNotificationError,
          });
        }
      } finally {
        setShowNotification(true);
      }
    }
  };

  return (
    <div className="xl:mt-12 lg:mt-10 mt-8 w-full">
      <form>
        <motion.div
          variants={fadeIn("down", 1.25)}
          className="w-full md:w-[90%] lg:w-[80%] mx-auto grid place-items-center blue-transparent-green-gradient lg:p-[1.5px] p-[1px] rounded-sm"
        >
          <textarea
            className="w-full h-full border-none bg-bg_primary focus:bg-[#080e26] rounded-sm px-2 py-[0.3rem] text-sm sm:text-base md:text-lg outline-none text-[#D3D3D3]"
            placeholder="Write your text here"
            rows={15}
            required
            value={text}
            onChange={(e) => {
              setText(e.target.value);
            }}
          />
        </motion.div>

        <CustomButton
          text={`${!isUploading ? "Submit Text" : "Uploading..."}`}
          styles={`w-full md:w-[90%] lg:w-[80%] mx-auto block ${
            !isUploading && text
              ? "bg-[#3E8ECC] hover:bg-[#377eb5]"
              : " bg-slate-400"
          } rounded-md text-center text-lg font-semibold text-white py-[4px] px-7  mt-6`}
          type="submit"
          onClick={(e) => {
            e.preventDefault();
            setShowModal(true);
          }}
        />
      </form>

      {/* Submitted Text */}
      <aside className="max-h-[30vh] overflow-y-scroll mt-10 flex flex-col gap-4 hideScrollbar">
        {textDeliverables &&
          textDeliverables.length > 0 &&
          textDeliverables.map((textDeliverable, index) => {
            return (
              <div
                className=" bg-bg_primary rounded-md px-4 w-full"
                key={`file-Deliverable-${index}`}
              >
                {/* Text Header */}
                <div className="w-full">
                  <div className="flex flex-row justify-between items-center w-full">
                    <div
                      className="flex flex-row items-center gap-4 w-[90%]"
                      onClick={() => {
                        navigator.clipboard.writeText(textDeliverable.text);
                      }}
                    >
                      <Image
                        src={IconCopy}
                        alt="Copy"
                        className="cursor-pointer xs:py-4 py-2 px-2 w-8"
                      />
                      <h3 className="max-w-[90%] text-start whitespace-nowrap text-ellipsis overflow-hidden text-white xs:py-4 py-2">
                        {textDeliverable.text.substring(0, 120)}
                      </h3>
                    </div>
                    <Image
                      src={IconDropdown}
                      alt=">"
                      className="cursor-pointer px-2 w-8 xs:py-4 py-2"
                      onClick={() => renderDropMenu(index)}
                    />
                  </div>
                  {/* Blue Line */}
                  <div
                    className={`bg-[#3e8ecc] h-[2px] rounded-full w-full mb-2 ${
                      textDeliverables[index].showText === true
                        ? "block"
                        : "hidden"
                    } `}
                  ></div>
                </div>
                {/* Full Text */}
                <p
                  className={`max-h-[56rem] overflow-scroll hideScrollbar text-sm pb-4 ${
                    textDeliverables[index].showText === true
                      ? "block"
                      : "hidden"
                  }`}
                >
                  {textDeliverable.text}
                </p>
              </div>
            );
          })}
      </aside>
      <Modal
        showModal={showModal}
        setShowModal={setShowModal}
        title={title}
        description={description}
        onConfirm={() => submitText(text)}
      />
    </div>
  );
};

export default SubmitTextArea;
