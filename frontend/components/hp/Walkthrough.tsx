import React, { useState } from "react";
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
  const [activeTab, setActiveTab] = useState("enterprise");

  return (
    <div id="howtouse">
      <motion.h1
        variants={textVariant()}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.25 }}
        className="xl:text-7xl lg:text-6xl md:text-4xl sm:text-4xl text-4xl font-extrabold"
      >
        How to Use
      </motion.h1>
      <p className="text-3xl mt-7 mb-36">Qube is super simple to use! No Complexity!</p>
      <div className="sm:flex flex-row items-start md:gap-16 sm:gap-8 sm:mt-24 mt-16">

        {/* For Enterprises */}
        <div className="flex-1 max-w-4xl mx-auto">
          <h2 
            className={`text-5xl font-semibold mb-6 ${activeTab === "enterprise" ? "underline text-white" : ""}`}
            onClick={() => setActiveTab("enterprise")}
          >
            For Enterprises
          </h2>
          
          <div className="flex items-center mb-4">
            <div className="flex-shrink-0 bg-blue-500 text-white rounded-full w-16 h-16 flex items-center justify-center mr-4 text-2xl">
              1
            </div>
            <div>
              <h3 className="text-2xl font-semibold">Connect your wallet</h3>
            </div>
          </div>

          <div className="flex items-center mb-4">
            <div className="flex-shrink-0 bg-green-500 text-white rounded-full w-16 h-16 flex items-center justify-center mr-4 text-2xl">
              2
            </div>
            <div>
              <h3 className="text-2xl font-semibold">Create a project & copy the Link</h3>
            </div>
          </div>

          <div className="flex items-center mb-4">
            <div className="flex-shrink-0 bg-indigo-500 text-white rounded-full w-16 h-16 flex items-center justify-center mr-4 text-2xl">
              3
            </div>
            <div>
              <h3 className="text-2xl font-semibold">Share with the Freelancer</h3>
            </div>
          </div>

          <div className="flex items-center mb-4">
            <div className="flex-shrink-0 bg-yellow-500 text-white rounded-full w-16 h-16 flex items-center justify-center mr-4 text-2xl">
              4
            </div>
            <div>
              <h3 className="text-2xl font-semibold">Send your money to Escrow</h3>
            </div>
          </div>

          <div className="flex items-center mb-4">
            <h3 className="text-2xl font-semibold">Here you go! Leave the rest to Qube! </h3>
          </div>
        </div>

        {/* For Individuals */}
        <div className="flex-1 max-w-4xl mx-auto">
          <h2 
            className={`text-5xl font-semibold mb-6 ${activeTab === "individuals" ? "underline text-white" : ""}`}
            onClick={() => setActiveTab("individuals")}
          >
            For Individuals
          </h2>
          
          <div className="flex items-center mb-4">
            <div className="flex-shrink-0 bg-blue-500 text-white rounded-full w-16 h-16 flex items-center justify-center mr-4 text-2xl">
              1
            </div>
            <div>
              <h3 className="text-2xl font-semibold">Open the link using your wallet</h3>
            </div>
          </div>

          <div className="flex items-center mb-4">
            <div className="flex-shrink-0 bg-green-500 text-white rounded-full w-16 h-16 flex items-center justify-center mr-4 text-2xl">
              2
            </div>
            <div>
              <h3 className="text-2xl font-semibold">check the details and sign </h3>
            </div>
          </div>

          <div className="flex items-center mb-4">
            <h3 className="text-2xl font-semibold">Done! The payment will be executed automatically after the work is done!</h3>
          </div>
        </div>

        {/* <DemoVideo /> */}
        {/* <motion.div
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
        </motion.div> */}
      </div>
    </div>
  );
};

export default Walkthrough;
