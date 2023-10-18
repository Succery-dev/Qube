import { motion } from "framer-motion";
import React from "react";
import { fadeIn } from "../../utils";
import Image from "next/image";
import {
  IconCopy,
  IconDropdown,
} from "../../assets";
import {
  DisplayTextDeliverableInterface,
} from "../../interfaces";

const SubmitTextArea = ({
  textDeliverables,
  setTextDeliverables,
  text,
  setText,
}: {
  textDeliverables: DisplayTextDeliverableInterface[];
  setTextDeliverables: React.Dispatch<
    React.SetStateAction<DisplayTextDeliverableInterface[]>
  >;
  text: string;
  setText: React.Dispatch<React.SetStateAction<string>>;
}) => {
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

  return (
    <>
      <p className="text-white text-md md:text-2xl mr-auto my-4">Text</p>
      <form>
        <motion.div
          variants={fadeIn("down", 1.25)}
          className="w-full h-[150px] sm:h-[200px] md:h-[250px] grid place-items-center bg-[#DF57EA] lg:p-[3.5px] p-[3px] rounded-lg"
        >
          <textarea
            className="w-full h-full border-none bg-bg_primary focus:bg-[#080e26] rounded-sm px-2 py-[0.3rem] text-sm sm:text-base md:text-lg outline-none text-[#D3D3D3]"
            placeholder="Write your text here"
            rows={10}
            required
            value={text}
            onChange={(e) => {
              setText(e.target.value);
            }}
          />
        </motion.div>
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
                    className={`bg-[#DF57EA] h-[2px] rounded-full w-full mb-2 ${
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
    </>
  );
};

export default SubmitTextArea;
