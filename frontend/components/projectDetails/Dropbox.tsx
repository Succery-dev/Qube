import React, { useCallback, useEffect, useRef, useState } from "react";
import { useDropzone, FileWithPath } from "react-dropzone";
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
  formatBytes,
  populateStates,
  storage,
  updateProjectDetails,
} from "../../utils";
import { ref, getDownloadURL, uploadBytesResumable } from "firebase/storage";

// Interface Imports
import {
  DisplayFileDeliverableInterface,
  DisplayProjectDetailsInterface,
  DisplayTextDeliverableInterface,
  NotificationConfigurationInterface,
  StoreFileDeliverableInterface,
} from "../../interfaces";
import Link from "next/link";

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
}) => {
  // States
  const [isDropable, setIsDropable] = useState(true);

  const onDrop = useCallback(
    async (acceptedFiles: FileWithPath[]) => {
      try {
        if (!isAssigned) {
          throw new Error("Not Approved for the project");
        }

        if (!isDropable) {
          return;
        }

        setIsDropable(false);
        let updatedFileDeliverables: StoreFileDeliverableInterface[] =
          fileDeliverables.map((fileDeliverable) => {
            return {
              fileName: fileDeliverable.fileName,
              fileSize: fileDeliverable.fileSize,
              downloadUrl: fileDeliverable.downloadUrl,
            };
          });

        const uploadPromises: Promise<StoreFileDeliverableInterface>[] =
          acceptedFiles.map((file, acceptedFileIndex) => {
            const index = fileDeliverables.length + acceptedFileIndex;
            // const index = acceptedFileIndex;
            const storageRef = ref(storage, `file/${file.name}`);
            const uploadTask = uploadBytesResumable(storageRef, file);

            return new Promise((resolve, reject) => {
              ((index: number) => {
                uploadTask.on(
                  "state_changed",
                  (snapshot) => {
                    const progress =
                      (snapshot.bytesTransferred / snapshot.totalBytes) * 100;

                    setFileDeliverables((prevFileDeliverableArray) => {
                      const updatedFileDeliverableArray = [
                        ...prevFileDeliverableArray,
                      ];

                      updatedFileDeliverableArray[index] = {
                        fileName: file.name,
                        fileSize: `${file.size}`,
                        progress: `${progress}`,
                        downloadUrl: undefined as string,
                      };

                      return updatedFileDeliverableArray;
                    });
                  },
                  (error) => {
                    reject(undefined as StoreFileDeliverableInterface);
                  },
                  () => {
                    getDownloadURL(uploadTask.snapshot.ref).then(
                      (downloadUrl) => {
                        setFileDeliverables((prevFileDeliverableArray) => {
                          const updatedFileDeliverableArray = [
                            ...prevFileDeliverableArray,
                          ];
                          updatedFileDeliverableArray[index] = {
                            ...updatedFileDeliverableArray[index],
                            downloadUrl: downloadUrl,
                          };

                          resolve({
                            fileName: file.name,
                            fileSize: `${file.size}`,
                            downloadUrl: downloadUrl,
                          } as StoreFileDeliverableInterface);

                          return updatedFileDeliverableArray;
                        });
                      }
                    );
                  }
                );
              })(index);
            });
          });

        const resolvedUploadPromises = await Promise.all(uploadPromises);

        updatedFileDeliverables = [
          ...updatedFileDeliverables,
          ...resolvedUploadPromises,
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
          message: "Submitted the files",
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
        } else {
          setNotificationConfiguration({
            modalColor: "#d14040",
            title: "Error",
            message: "Error submitting the files",
            icon: IconNotificationError,
          });
        }
      } finally {
      }
    },

    [isDropable]
  );

  const { getRootProps, getInputProps } = useDropzone({ onDrop });

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
                  Drag and Drop Files
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
