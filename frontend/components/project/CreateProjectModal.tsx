import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import Tilt from "react-parallax-tilt";

// Asset Imports
import { CrossIcon, IconCopy, arrow } from "../../assets";

// Framer-Motion Imports
import { AnimatePresence, motion } from "framer-motion";
import { modalVariant } from "../../utils";

const CreateProjectModal = ({
  showProjectModal,
  setShowProjectModal,
  projectDetailLink,
  userType,
}: {
  showProjectModal: boolean;
  setShowProjectModal: React.Dispatch<React.SetStateAction<boolean>>;
  projectDetailLink: string;
  userType: string;
}) => {
  const [isCopiedPopupVisible, setIsCopiedPopupVisible] = useState(false);

  useEffect(() => {
    const timeOut = setTimeout(() => {
      setIsCopiedPopupVisible(false);
    }, 3000);

    return () => {
      clearTimeout(timeOut);
    };
  }, [isCopiedPopupVisible]);

  const handleCopyToClipboard = async () => {
    try {
      setIsCopiedPopupVisible(true);
      const textToCopy = projectDetailLink;
      await navigator.clipboard.writeText(textToCopy);
    } catch (error) {}
  };

  return (
    <AnimatePresence>
      {showProjectModal && (
        <motion.div
          variants={modalVariant()}
          initial="hidden"
          animate="visible"
          exit="hidden"
          className={`fixed w-screen h-screen top-0 left-0 backdrop-blur-md z-[100] grid grid-cols-12 text-white font-nunito`}
        >
          <div className=" col-start-2 col-end-12 xl:col-start-4 xl:col-end-10 grid place-items-center">
            <div className=" w-full bg-[#DF57EA] rounded-xl p-[2px] flex flex-row items-center shadow-lg">
              <div className="w-full max-h-[95vh] bg-black rounded-xl px-4 py-6 sm:p-8 md:p-10 lg:p-8 xl:p-10 relative">
                {/* Header */}
                <div className="w-full">
                  <div className="flex flex-row w-full justify-between items-center top-0 right-0 z-[100]">
                    <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-secondary">
                      Share
                    </h2>
                    <Image
                      src={CrossIcon}
                      alt="cross"
                      className="h-4 w-auto cursor-pointer"
                      onClick={() => {
                        setShowProjectModal(false);
                      }}
                    />
                  </div>
                  {/* Main */}
                  <div className="flex flex-col w-full gap-4 mt-8">
                    <p className="text-[#959595]">
                      Share this link to the {userType === "depositor" ? "creator" : "company"}
                    </p>
                    <div className="flex flex-row relative items-center justify-between gap-2 bg-bg_primary py-4 px-4 rounded-lg">
                      <Link
                        href={projectDetailLink}
                        className="cursor-pointer w-4/5"
                      >
                        <p className="text-[#DF57EA] underline break-words">
                          {projectDetailLink}
                        </p>
                      </Link>
                      <Image
                        src={IconCopy}
                        alt="copy"
                        className="h-6 w-auto cursor-pointer"
                        onClick={() => handleCopyToClipboard()}
                      />
                      {isCopiedPopupVisible && <p className="absolute right-0 bottom-14 bg-slate-500 text-white px-5 rounded-md animate-bounce">Copied</p>}
                    </div>
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

export default CreateProjectModal;
