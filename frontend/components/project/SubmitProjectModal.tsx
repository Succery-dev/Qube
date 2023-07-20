import React, { SetStateAction, useState } from "react";
import Image from "next/image";

// Framer-Motion Imports
import { AnimatePresence } from "framer-motion";
import { motion } from "framer-motion";
import { fadeIn, modalVariant } from "../../utils/motion";

// Assets Imports
import { CrossIcon } from "../../assets";
import Dropbox from "./Dropbox";
import { CustomButton } from "..";

// Interface Imports
import { SubmitDeliverablesInterface } from "../../interfaces";

// Utility Imports
import { uploadDeliverables } from "../../utils";

// Context Imports
import { useNotificationContext } from "../../context";

const SubmitTextArea = ({
  deliverables,
  setDeliverables,
}: {
  deliverables: SubmitDeliverablesInterface;
  setDeliverables: React.Dispatch<
    React.SetStateAction<SubmitDeliverablesInterface>
  >;
}): JSX.Element => {
  return (
    <div className="w-full">
      <motion.div
        variants={fadeIn("down", 1.25)}
        className="w-full md:w-[90%] lg:w-[80%] mx-auto grid place-items-center blue-transparent-green-gradient lg:p-[1.5px] p-[1px] rounded-sm"
      >
        <textarea
          className="w-full h-full border-none bg-bg_primary focus:bg-[#080e26] rounded-sm px-2 py-[0.3rem] text-sm sm:text-base md:text-lg outline-none text-[#D3D3D3]"
          placeholder="Write your text here"
          rows={15}
          required
          value={deliverables.text}
          onChange={(e) => {
            deliverables.text = e.target.value;
            setDeliverables((prevDeliverable) => {
              const updatedDeliverable = {
                ...prevDeliverable,
                text: e.target.value,
              };
              return updatedDeliverable;
            });
          }}
        />
      </motion.div>
    </div>
  );
};

const SubmitProjectModalHeader = ({
  showUploadType,
  setShowUploadType,
  setShowSubmitModal,
}: {
  showUploadType: string;
  setShowUploadType: React.Dispatch<React.SetStateAction<string>>;
  setShowSubmitModal: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const toggleSubmitModal = () => {
    setShowSubmitModal(false);
  };
  return (
    <div className="w-full">
      <div className="flex flex-row w-full justify-between items-center top-0 right-0 z-[100]">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-secondary">
          Submit Project
        </h2>
        <Image
          src={CrossIcon}
          alt="cross"
          className="h-4 w-auto cursor-pointer"
          onClick={toggleSubmitModal}
        />
      </div>
      <div className="flex flex-row items-center justify-around text-xl my-6 sm:my-6 md:my-10 lg:my-6">
        <span
          className={`w-[60%] text-center text-base sm:text-lg md:text-xl ${
            showUploadType === "files" ? "bg-[#3E8ECC]" : ""
          } rounded-md py-1 cursor-pointer`}
          onClick={() => setShowUploadType("files")}
        >
          Files
        </span>
        <span
          className={`w-[60%] text-center text-base sm:text-lg md:text-xl ${
            showUploadType === "text" ? "bg-[#3E8ECC]" : ""
          } rounded-md py-1 cursor-pointer`}
          onClick={() => setShowUploadType("text")}
        >
          Text
        </span>
      </div>
    </div>
  );
};

const SubmitProjectModal = ({
  showSubmitModal,
  setShowSubmitModal,
}: {
  showSubmitModal: boolean;
  setShowSubmitModal: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  // State
  const [showUploadType, setShowUploadType] = useState<"files" | "text">(
    "files"
  );
  const [deliverables, setDeliverables]: [
    SubmitDeliverablesInterface,
    React.Dispatch<React.SetStateAction<SubmitDeliverablesInterface>>
  ] = useState({} as SubmitDeliverablesInterface);
  return (
    <AnimatePresence>
      {showSubmitModal && (
        <motion.div
          variants={modalVariant()}
          initial="hidden"
          animate="visible"
          exit="hidden"
          className={`fixed w-screen h-screen top-0 left-0 backdrop-blur-md z-[100] ${
            showSubmitModal ? "fixed" : "hidden"
          } grid grid-cols-12 text-white font-nunito`}
        >
          <div className=" col-start-2 col-end-12 xl:col-start-3 xl:col-end-11 grid place-items-center">
            <div className=" w-full blue-transparent-green-gradient rounded-xl p-[2px] flex flex-row items-center shadow-lg">
              <div className="w-full h-[600px] sm:h-[700px] md:h-[800px] max-h-[95vh] bg-black rounded-xl px-4 py-6 sm:p-8 md:p-10 lg:p-8 xl:p-10 relative overflow-y-scroll srollbar-hidden">
                <SubmitProjectModalHeader
                  showUploadType={showUploadType}
                  setShowUploadType={setShowUploadType}
                  setShowSubmitModal={setShowSubmitModal}
                />
                <div>
                  {showUploadType === "files" && (
                    <Dropbox
                      deliverables={deliverables}
                      setDeliverables={setDeliverables}
                    />
                  )}
                  {showUploadType === "text" && (
                    <SubmitTextArea
                      deliverables={deliverables}
                      setDeliverables={setDeliverables}
                    />
                  )}
                  <CustomButton
                    text="Submit"
                    styles="w-full block md:w-[90%] lg:w-[80%] mx-auto bg-[#3E8ECC] rounded-md text-center text-lg font-semibold text-white py-[4px] px-7 hover:bg-[#377eb5] my-6 sm:my-6 md:my-10 lg:my-6"
                    type="submit"
                    onClick={(e) => {
                      e.preventDefault();
                      uploadDeliverables(deliverables, setDeliverables);
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SubmitProjectModal;
