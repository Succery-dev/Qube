import React, { useState } from "react";
import { useDropzone, FileWithPath } from "react-dropzone";
import Image from "next/image";

// Image Imports
import {
  IconNotificationError,
  IconNotificationSuccess,
  IconUploadFile,
} from "../../assets";

// Framer-Motion Imports
import { motion } from "framer-motion";
import { fadeIn } from "../../utils/motion";

// Firebase Imports
import { formatBytes, populateStates } from "../../utils";

// Interface Imports
import {
  DisplayFileDeliverableInterface,
  DisplayTextDeliverableInterface,
  NotificationConfigurationInterface,
  ProjectDisplayInterface,
  StoreFileDeliverableInterface,
} from "../../interfaces";
import Link from "next/link";

// Lighthouse Imports
import { httpsCallable } from "firebase/functions";
import { functions } from "../../utils/firebase";
import lighthouse from "@lighthouse-web3/sdk";
import { IUploadProgressCallback } from "@lighthouse-web3/sdk/dist/types";

const Dropbox = ({
  fileDeliverables,
  setFileDeliverables,
  projectId,
  setProjectDetails,
  setNotificationConfiguration,
  setShowNotification,
  setTextDeliverables,
}: {
  fileDeliverables: DisplayFileDeliverableInterface[] | undefined;
  setFileDeliverables: React.Dispatch<
    React.SetStateAction<DisplayFileDeliverableInterface[] | undefined>
  >;
  projectId: string;
  setProjectDetails: React.Dispatch<
    React.SetStateAction<ProjectDisplayInterface>
  >;
  setNotificationConfiguration: React.Dispatch<
    React.SetStateAction<NotificationConfigurationInterface>
  >;
  setShowNotification: React.Dispatch<React.SetStateAction<boolean>>;
  projectDetails: ProjectDisplayInterface;
  setTextDeliverables: React.Dispatch<
    React.SetStateAction<DisplayTextDeliverableInterface[] | undefined>
  >;
}) => {
  // States
  const [isDropable, setIsDropable] = useState(true);

  const onDrop = async (acceptedFiles: FileWithPath[]) => {
    if (!isDropable) {
      return;
    }
    let lastFileDeliverableArr: DisplayFileDeliverableInterface[] | undefined;
    try {
      setIsDropable(false);

      setFileDeliverables((prevFileDeliverablesArray) => {
        lastFileDeliverableArr =
          prevFileDeliverablesArray === undefined
            ? undefined
            : [...prevFileDeliverablesArray];
        const newFileDeliverablesArr = acceptedFiles.map((file) => {
          return {
            fileName: file.name,
            fileSize: `${file.size}`,
            progress: "0",
            downloadUrl: "",
          } as DisplayFileDeliverableInterface;
        });
        if (prevFileDeliverablesArray === undefined) {
          return newFileDeliverablesArr;
        } else {
          return [...prevFileDeliverablesArray, ...newFileDeliverablesArr];
        }
      });

      const getProgressCallback =
        (index: number) => (progressData: IUploadProgressCallback) => {
          let percentageDone =
            100 - progressData?.total / progressData?.uploaded;
          setFileDeliverables((prevFileDeliverables) => {
            let updatedFileDeliverables: DisplayFileDeliverableInterface[];

            if (prevFileDeliverables !== undefined) {
              updatedFileDeliverables = prevFileDeliverables;
              updatedFileDeliverables[
                prevFileDeliverables.length - acceptedFiles.length + index
              ].progress = `${percentageDone}`;
              return updatedFileDeliverables;
            }
          });
        };
      const uploadPromisesArr = acceptedFiles.map((file, index) => {
        return (async (index: number) => {
          const response = await lighthouse.upload(
            [file],
            "ba2eb9ed.bc5b618732274d51a2262957031957fe",
            false,
            undefined,
            getProgressCallback(index)
          );
          return response;
        })(index);
      });

      const uploadResponseArr = await Promise.all(uploadPromisesArr);

      const storeFileDeliverablesArr = uploadResponseArr.map((uploadedFile) => {
        return {
          fileName: uploadedFile.data.Name,
          fileSize: uploadedFile.data.Size,
          downloadUrl: `https://gateway.lighthouse.storage/ipfs/${uploadedFile.data.Hash}`,
        } as StoreFileDeliverableInterface;
      });

      const submitFileDeliverables = httpsCallable(
        functions,
        "submitFileDeliverables"
      );
      const submitFileDeliverablesCall = await submitFileDeliverables({
        projectId,
        fileDeliverables: storeFileDeliverablesArr,
      });
      const submitFileDeliverableCallObj = submitFileDeliverablesCall.data;

      await populateStates(
        projectId,
        setProjectDetails,
        setFileDeliverables,
        setNotificationConfiguration,
        setShowNotification,
        setTextDeliverables
      );

      setNotificationConfiguration({
        modalColor: "#62d140",
        title: "Success",
        message: "Submitted the files",
        icon: IconNotificationSuccess,
      });
      setIsDropable(true);
    } catch (error) {
      if (
        `${error}`.includes("You must be authenticated to create a project.")
      ) {
        setNotificationConfiguration({
          modalColor: "#d14040",
          title: "Upload Error",
          message: "Invalid or unauthenticated wallet address",
          icon: IconNotificationError,
        });
      } else if (`${error}`.includes("Invalid ProjectId")) {
        setNotificationConfiguration({
          modalColor: "#d14040",
          title: "Upload Error",
          message: "Invalid project Id provided",
          icon: IconNotificationError,
        });
      } else if (`${error}`.includes("Unauthorized to submit deliverables")) {
        setNotificationConfiguration({
          modalColor: "#d14040",
          title: "Upload Error",
          message: "connected address not authorized to submit files",
          icon: IconNotificationError,
        });
      } else if (
        `${error}`.includes("Invalid file deliverables for the files")
      ) {
        setNotificationConfiguration({
          modalColor: "#d14040",
          title: "Upload Error",
          message: "Invalid files provided",
          icon: IconNotificationError,
        });
      } else {
        setNotificationConfiguration({
          modalColor: "#d14040",
          title: "Upload Error",
          message: "Unknown error occoured",
          icon: IconNotificationError,
        });
      }
      setFileDeliverables(lastFileDeliverableArr);
    } finally {
      setShowNotification(true);
    }
  };

  const { getRootProps, getInputProps } = useDropzone({ onDrop });

  return (
    <>
      <div className="xl:my-12 lg:my-10 my-8 w-full md:w-[90%] lg:w-[80%] xl:w-[70%] mx-auto flex flex-col justify-between items-center">
        <motion.div
          variants={fadeIn("down", 1.25)}
          className={`grid place-items-center w-full ${
            !isDropable
              ? "bg-[#a1a1a1] cursor-not-allowed"
              : "blue-transparent-green-gradient"
          } lg:p-[1.5px] p-[1px] rounded-lg cursor-pointer`}
        >
          <div
            {...getRootProps({
              className:
                "w-full h-full border-none bg-bg_primary py-4 sm:py-8 md:py-10 lg:py-12 xl:py-20 hover:bg-[#080e26] rounded-lg",
            })}
          >
            <input {...getInputProps()} />
            <div className="grid place-items-center gap-4 xl:gap-8 text-center">
              <Image src={IconUploadFile} alt="" className="h-20 xl:h-28" />

              {isDropable ? (
                <p className="text-[#c7c7cd] text-sm lg:text-base xl:text-lg">
                  Drag and Drop File
                  <br />
                  OR
                  <br />
                  <span>Click to Browse</span>
                </p>
              ) : (
                <p className="text-[#c7c7cd] text-sm lg:text-base xl:text-lg">
                  Loading
                </p>
              )}
            </div>
          </div>
        </motion.div>
      </div>

      {fileDeliverables && fileDeliverables.length > 0 && (
        <aside className="w-full">
          <motion.div
            variants={fadeIn("down", 0.4)}
            className="w-full my-4 flex flex-col"
          >
            {/* Headers */}
            <div className="w-full flex flex-row gap-4 text-white text-base">
              <h2 className="basis-0 flex-grow lg:max-w-[40%] max-w-[60%]">
                Name
              </h2>
              <h2 className="basis-0 flex-grow lg:max-w-[30%] lg:block hidden whitespace-nowrap overflow-ellipsis overflow-hidden">
                Size
              </h2>
              <h2 className="basis-0 flex-grow lg:max-w-[30%] max-w-[40%]">
                Download
              </h2>
            </div>

            <div className="max-h-[30vh] overflow-y-scroll hideScrollbar">
              {fileDeliverables.map((fileDeliverable, index) => {
                return (
                  <div
                    className="w-full flex flex-row items-center gap-4 my-2"
                    key={`file-${index}`}
                  >
                    {/* Name */}
                    <p
                      className="basis-0 flex-grow text-sm xl:text-base lg:max-w-[40%] max-w-[60%] whitespace-nowrap overflow-ellipsis overflow-hidden"
                      key={`Name-${index}`}
                    >
                      {fileDeliverable.fileName}
                    </p>
                    {/* Size */}
                    <p
                      className="basis-0 flex-grow text-sm xl:text-base lg:max-w-[30%] lg:block hidden"
                      key={`Size-${index}`}
                    >
                      {formatBytes(Number(fileDeliverable.fileSize))}
                    </p>
                    {/* Download */}
                    {fileDeliverable.downloadUrl.length > 0 ? (
                      <Link
                        href={fileDeliverable.downloadUrl}
                        key={`downloadUrl-${index}`}
                        className="basis-0 flex-grow text-sm xl:text-base lg:max-w-[30%] max-w-[40%]"
                      >
                        <p className=" bg-[#3E8ECC] text-white text-center rounded-sm text-sm xl:text-base w-full">
                          Download
                        </p>
                      </Link>
                    ) : (
                      <div
                        className="h-4 text-center rounded-sm bg-slate-400 basis-0 flex-grow lg:max-w-[30%] max-w-[30%]"
                        key={`progressbar-${index}`}
                      >
                        <div
                          className="progressBar h-full"
                          style={{ width: `${fileDeliverable.progress}%` }}
                        ></div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </motion.div>
        </aside>
      )}
    </>
  );
};

export default Dropbox;
