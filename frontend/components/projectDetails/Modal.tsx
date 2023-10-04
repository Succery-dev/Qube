// TODO: fix this, based on /QubePay/frontend/components/project/CreateProjectModal.tsx
import React, { useState } from "react";
import Image from "next/image";

// Asset Imports
import { CrossIcon, Spinner } from "../../assets";

// Framer-Motion Imports
import { AnimatePresence, motion } from "framer-motion";
import { modalVariant } from "../../utils";

const Modal = ({
  showModal,
  setShowModal,
  title,
  description,
  onConfirm,
}: {
  showModal: boolean;
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
  title: string;
  description: string;
  onConfirm: () => Promise<void>;
}) => {
  const [isLoading, setIsLoading] = useState(false);

  return (
    <AnimatePresence>
      {showModal && (
        <motion.div
          variants={modalVariant()}
          initial="hidden"
          animate="visible"
          exit="hidden"
          className={`fixed w-screen h-screen top-0 left-0 backdrop-blur-md z-[100] grid grid-cols-12 text-white font-nunito`}
        >
          <div className=" col-start-2 col-end-12 xl:col-start-4 xl:col-end-10 grid place-items-center">
            <div className=" w-full blue-transparent-green-gradient rounded-xl p-[2px] flex flex-row items-center shadow-lg">
              <div className="w-full max-h-[95vh] bg-black rounded-xl px-4 py-6 sm:p-8 md:p-10 lg:p-8 xl:p-10 relative">
                {/* Header */}
                <div className="w-full">
                  <div className="flex flex-row w-full justify-between items-center top-0 right-0 z-[100]">
                    <h2 className={`text-2xl sm:text-3xl md:text-4xl font-bold ${title === "Disapprove The Deliverables" ? "text-red-500" : "text-secondary"}`}>
                      {title}
                    </h2>
                    {!isLoading &&
                      <Image
                        src={CrossIcon}
                        alt="cross"
                        className="h-4 w-auto cursor-pointer"
                        onClick={() => setShowModal(false)}
                      />
                    }
                  </div>
                  {/* Main */}
                  <div className="flex flex-col w-full gap-4 mt-8">
                    <p className={title === "Disapprove The Deliverables" ? "text-red-800" : "text-[#959595]"}>
                      {description}
                    </p>
                    {isLoading
                      ? (
                        <div className="flex flex-row items-center justify-center text-2xl text-green-400">
                          <Image
                            src={Spinner}
                            alt="spinner"
                            className="animate-spin-slow h-20 w-auto"
                          />
                          Processing...
                        </div>
                      ) : (
                        <div className="flex flex-row items-center justify-end gap-14 py-4 px-4">
                          <button
                            className={`${title === "Disapprove The Deliverables" ? "bg-red-500 hover:bg-red-600" : "bg-blue-500 hover:bg-blue-600"} text-white py-2 px-4 rounded transition duration-150`}
                            onClick={async () => {
                              setIsLoading(true);
                              await onConfirm();
                              setIsLoading(false);
                              setShowModal(false);
                            }}
                          >
                            Confirm
                          </button>
                          <button
                            className="bg-gray-300 text-gray-600 py-2 px-4 rounded hover:bg-gray-400 transition duration-150"
                            onClick={() => setShowModal(false)}
                          >
                            Cancel
                          </button>
                        </div>
                      )
                    }
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Modal;
