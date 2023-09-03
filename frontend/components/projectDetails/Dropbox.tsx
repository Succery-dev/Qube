import React, { useCallback, useEffect, useRef, useState } from "react";
import { useDropzone, FileWithPath, FileRejection } from "react-dropzone";
import Image from "next/image";

// Image Imports
import {
  IconNotificationError,
  IconNotificationSuccess,
  IconNotificationWarning,
  IconUploadFile,
} from "../../assets";

// Framer-Motion Imports
import { motion } from "framer-motion";
import { fadeIn } from "../../utils/motion";

// Firebase Imports
import {
  encryptionSignature,
  formatBytes,
  populateStates,
  progressCallback,
  progressCallbackHelper,
  shareFileEncrypted,
  storage,
  updateProjectDetails,
  uploadFileEncrypted,
} from "../../utils";
import { ref, getDownloadURL, uploadBytesResumable } from "firebase/storage";

// Interface Imports
import {
  DisplayFileDeliverableInterface,
  DisplayProjectDetailsInterface,
  DisplayTextDeliverableInterface,
  NotificationConfigurationInterface,
  ProgressDataInterface,
  ShareFileEncryptedResponseInterface,
  StoreFileDeliverableInterface,
  UploadFileEncryptedResponseInterface,
} from "../../interfaces";
import Link from "next/link";

// Lighthouse Imports
import { IFileUploadedResponse } from "@lighthouse-web3/sdk/dist/types";

const Dropbox = ({
  fileDeliverables,
  setFileDeliverables,
  projectId,
  setIsAssigned,
  setProjectDetails,
  setNotificationConfiguration,
  setShowNotification,
  setTextDeliverables,
  projectDetails,
  isAssigned,
  address,
  clientAddress,
  freelancerAddress,
}: {
  fileDeliverables: DisplayFileDeliverableInterface[];
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
  address: `0x${string}`;
  clientAddress: `0x${string}`;
  freelancerAddress: `0x${string}`;
}) => {
  // States
  const [isDropable, setIsDropable] = useState(true);

  const onDrop = useCallback(
    async (acceptedFiles: FileWithPath[], fileRejections: FileRejection[]) => {
      try {
        console.log("was here");

        // if (!isAssigned) {
        //   throw new Error("Not Approved for the project");
        // }

        if (!isDropable) {
          return;
        }

        if (fileRejections.length > 0) {
          throw new Error("Only one file can be selected");
        }

        setIsDropable(false);

        console.log("was here too");

        let updatedFileDeliverables: StoreFileDeliverableInterface[] =
          fileDeliverables.map((fileDeliverable) => {
            return {
              fileName: fileDeliverable.fileName,
              fileSize: fileDeliverable.fileSize,
              downloadUrl: fileDeliverable.downloadUrl,
            };
          });

        const progressCallback = (progressData: ProgressDataInterface) => {
          let percentageDone = progressData?.total / progressData?.uploaded;
          percentageDone = 100 - Number(percentageDone.toFixed(2));

          setFileDeliverables((prevFileDeliverableArray) => {
            const updatedFileDeliverableArray = [...prevFileDeliverableArray];
            console.log("acceptedFile[0", acceptedFiles[0]);
            updatedFileDeliverableArray[fileDeliverables.length] = {
              fileName: acceptedFiles[0].name,
              fileSize: `${acceptedFiles[0].size}`,
              progress: `${percentageDone}`,
              downloadUrl: undefined as string,
            };

            return updatedFileDeliverableArray;
          });
        };

        const uploadResponse: IFileUploadedResponse = await uploadFileEncrypted(
          address,
          acceptedFiles,
          progressCallback
        );

        const shareResponse: ShareFileEncryptedResponseInterface =
          await shareFileEncrypted(
            address,
            [clientAddress],
            uploadResponse.Hash
          );

        setFileDeliverables((prevFileDeliverableArray) => {
          const updatedFileDeliverableArray = [...prevFileDeliverableArray];
          updatedFileDeliverableArray[fileDeliverables.length] = {
            ...updatedFileDeliverableArray[fileDeliverables.length],
            downloadUrl: `https://files.lighthouse.storage/viewFile/${shareResponse.cid}`,
          };

          return updatedFileDeliverableArray;
        });

        const newFileDeliverable = {
          fileName: acceptedFiles[0].name,
          fileSize: `${acceptedFiles[0].size}`,
          downloadUrl: `https://files.lighthouse.storage/viewFile/${shareResponse.cid}`,
        } as StoreFileDeliverableInterface;

        updatedFileDeliverables = [
          ...updatedFileDeliverables,
          newFileDeliverable,
        ];

        await updateProjectDetails(projectId, {
          fileDeliverable: updatedFileDeliverables,
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
          message: "Submitted the file",
          icon: IconNotificationSuccess,
        });
        setIsDropable(true);
      } catch (error) {
        if (error.message === "Not Approved for the project") {
          setNotificationConfiguration({
            modalColor: "#d14040",
            title: "Not Approved",
            message: "Adddress not Approved for project",
            icon: IconNotificationError,
          });
        } else if (error.message === "Only one file can be selected") {
          setNotificationConfiguration({
            modalColor: "#d1d140",
            title: "Invalid selection",
            message: "Only one file can be selected at a time",
            icon: IconNotificationWarning,
          });
        } else if (
          error.message === "Error uploading file" ||
          error.message === "Error Sharing the file"
        ) {
          setNotificationConfiguration({
            modalColor: "#d14040",
            title: "Upload Error",
            message: "Error uploading the file",
            icon: IconNotificationError,
          });
        } else {
          setNotificationConfiguration({
            modalColor: "#d14040",
            title: "Error",
            message: "Error submitting the file",
            icon: IconNotificationError,
          });
        }
      } finally {
        setShowNotification(true);
      }
    },

    [isDropable]
  );

  const { getRootProps, getInputProps } = useDropzone({ onDrop, maxFiles: 1 });

  return (
    <>
      <div className="xl:my-12 lg:my-10 my-8 w-full md:w-[90%] lg:w-[80%] xl:w-[70%] mx-auto flex flex-col justify-between items-center">
        <motion.div
          variants={fadeIn("down", 1.25)}
          className={`grid place-items-center w-full ${
            isDropable ? "blue-transparent-green-gradient" : "bg-slate-500"
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
                    {fileDeliverable.progress === null ? (
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
