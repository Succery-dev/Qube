import React, { useCallback, useState } from "react";
import { useDropzone, FileWithPath } from "react-dropzone";
import Image from "next/image";

// Image Imports
import { IconUploadFile } from "../../assets";

// Framer-Motion Imports
import { motion } from "framer-motion";
import { fadeIn } from "../../utils/motion";

// Interface Imports
import {
  SubmitDeliverablesInterface,
  SumbitFileInterface,
} from "../../interfaces";

const Dropbox = ({
  deliverables,
  setDeliverables,
}: {
  deliverables: SubmitDeliverablesInterface;
  setDeliverables: React.Dispatch<
    React.SetStateAction<SubmitDeliverablesInterface>
  >;
}) => {
  const onDrop = useCallback((acceptedFiles: FileWithPath[]) => {
    setDeliverables((prevDeliverable) => {
      const updatedDeliverable = {
        ...prevDeliverable,
        files: [] as SumbitFileInterface[],
      };
      return updatedDeliverable;
    });
    acceptedFiles.map(async (file) => {
      console.log("final file::: ", file);

      const newFile = Object.assign(file, { progress: 0 });

      console.log("newFile::: ", newFile);

      setDeliverables((prevDeliverables) => {
        console.log(
          "prevFiles::: ",
          prevDeliverables.files,
          "IsArray::: ",
          Array.isArray(prevDeliverables.files)
        );
        let updatedDeliverables: SubmitDeliverablesInterface;
        if (Array.isArray(prevDeliverables.files)) {
          updatedDeliverables = {
            text: prevDeliverables.text,
            files: [...prevDeliverables.files, newFile],
          };
        } else {
          updatedDeliverables = {
            text: prevDeliverables.text,
            files: [newFile],
          };
        }
        return updatedDeliverables;
      });
    });
  }, []);

  const { getRootProps, getInputProps } = useDropzone({ onDrop });

  return (
    <div className="w-full md:w-[90%] lg:w-[80%] xl:w-[70%] mx-auto flex flex-col justify-between items-center">
      <motion.div
        variants={fadeIn("down", 1.25)}
        className="grid place-items-center w-full blue-transparent-green-gradient lg:p-[1.5px] p-[1px] rounded-lg cursor-pointer"
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
            <p className="text-[#c7c7cd] text-sm lg:text-base xl:text-lg">
              Drag and Drop Files
              <br />
              OR
              <br />
              <span>Click to Browse</span>
            </p>
          </div>
        </div>
      </motion.div>

      <aside className="flex flex-row flex-wrap mt-4 w-full">
        {deliverables.files &&
          deliverables.files.map((file, index) => {
            return (
              <motion.div
                variants={fadeIn("down", 0.4, index)}
                className="w-full my-2"
                key={index}
              >
                <div className="w-full flex justify-between items-center">
                  <p>{file.path}</p>
                </div>
                <div className=" h-1 w-full bg-[#c7c7cd]">
                  <div
                    className="h-full progressBar"
                    style={{ width: `${file.progress}%` }}
                  ></div>
                </div>
              </motion.div>
            );
          })}
      </aside>
    </div>
  );
};

export default Dropbox;
