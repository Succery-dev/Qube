import React from "react";
import Image from "next/image";

// Interfaces Imports
import { WalkthroughInterface } from "../../interfaces";

// Image Imports
import { GradientBlueGreenArrow } from "../../assets";

// Content Imports
import { walkthrough } from "../../constants";

// Framer-Motion Imports
import { motion } from "framer-motion";
import { fadeIn, textVariant } from "../../utils";

const WalkthroughCard = ({
  walkthroughStep,
  index,
}: {
  walkthroughStep: WalkthroughInterface;
  index: number;
}): JSX.Element => {
  return (
    <>
      <div className="w-full lg:p-[3px] p-[2px] rounded-lg blue-transparent-green-gradient grid place-items-center">
        <div
          className="bg-black w-full rounded-lg px-2 py-2 lg:min-h-[80px] sm:min-h-[50px] min-h-[80px] flex flex-row items-center sm:text-xs lg:text-lg "
          key={walkthroughStep.id}
        >
          <p> {walkthroughStep.description}</p>
        </div>
      </div>
      <Image
        className={`${
          walkthrough.length === index + 1 ? " hidden" : " block"
        } lg:h-[20px] sm:h-[10px] h-[20px]`}
        src={GradientBlueGreenArrow}
        alt="▼"
      />
    </>
  );
};

const DemoVideo = (): JSX.Element => {
  return (
    <motion.div
      variants={fadeIn("right", 1.25)}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.25 }}
      className="xl:w-1/2 lg:w-[85%] lg:p-[3px] p-[2px] grid place-items-center green-transparent-blue-gradient rounded-lg"
    >
      <video autoPlay loop controls className="rounded-lg w-full">
        <source src="/videos/demo.mp4" type="video/mp4" />
      </video>
    </motion.div>
  );
};

const Walkthrough = (): JSX.Element => {
  return (
    <div id="walkthrough">
      <motion.h1
        variants={textVariant()}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.25 }}
        className="xl:text-7xl lg:text-6xl md:text-4xl sm:text-4xl text-4xl font-extrabold"
      >
        User-Friendly <br /> and Secure
      </motion.h1>
      <div className="sm:flex flex-row items-center md:gap-16 sm:gap-8 sm:mt-24 mt-16">
        <DemoVideo />
        <motion.div
          variants={fadeIn("left", 1.25)}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.25 }}
          className="flex flex-col sm:mt-0 mt-16"
        >
          {walkthrough.map((step, index) => {
            return (
              <motion.div
                variants={fadeIn("down", 1.25, index)}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.25 }}
                className="flex flex-col items-center"
                key={step.id}
              >
                <WalkthroughCard walkthroughStep={step} index={index} />
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </div>
  );
};

export default Walkthrough;
