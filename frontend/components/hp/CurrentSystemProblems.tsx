import React from "react";
import Image from "next/image";
import Tilt from "react-parallax-tilt";

// Custom Component Imports
import { Glow } from "../aesthetics";

// Framer-Motion Imports
import { motion } from "framer-motion";
import { fadeIn, textVariant } from "../../utils";

// Content Imports
import { currentSystemProblems, aesthetics } from "../../constants";

// Interface Imports
import { ProblemsInterface } from "../../interfaces";

const CurrentSystemProblemsCard = ({
  problem,
  index,
}: {
  problem: ProblemsInterface;
  index: number;
}): JSX.Element => {
  return (
    <motion.div
      variants={fadeIn("right", 1.25, index)}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.25 }}
      className="sm:basis-[28%] flex flex-col sm:items-start items-center gap-8 sm:py-0 py-16"
      key={problem.id}
    >
      <div className="relative">
        <Glow styles={aesthetics.glow.currentSystemProblemsStyles} />
        <Image
          src={problem.image}
          alt="Image"
          width="200"
          className="xl:h-[200px] lg:h-[150px] sm:h-[100px] h-[150px]"
        />
      </div>
      <p className="font-extrabold xl:text-3xl lg:text-2xl sm:text-xl text-xl grow sm:w-full w-2/3">
        {problem.description}
      </p>
    </motion.div>
  );
};

const problems = [
  {
    title: "Trust Issue",
    description: "Lots of freelancers are facing non payment or delayed payment. This is the biggest risk a freelancer always had to take.",
  },
  {
    title: "Risk of Disputes",
    description: "There is possibility of having problems over the quality of submission. It's very hard to come to a mutual point once this happens.",
  },
  {
    title: "High cost of platforms",
    description: "Existing platforms provide escrow based payment solution but the platform fee is too expensive. Qube doesn't cost any transaction fee.",
  },
];

const CurrentSystemProblems = (): JSX.Element => {
  return (
    <div id="whyqube" className="flex flex-col h-full gap-y-10">
      <motion.h1
        variants={textVariant()}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.25 }}
        className="xl:text-7xl lg:text-6xl md:text-4xl sm:text-4xl text-4xl font-extrabold flex-1"
      >
        Freelances face lots of problems..
      </motion.h1>
      <div className="flex flex-col lg:flex-row justify-between gap-y-5 md:gap-x-5">
        {problems.map((problem, index) => {
          return(
            <Tilt key={index}>
              <motion.div
                variants={fadeIn("right", 1.25, index)}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.25 }}
                className="blue-transparent-green-gradient-vertical 2xl:w-[450px] xl:w-[370px] lg:w-[300px] lg:p-[3px] p-[2px] sm:min-h-0 rounded-2xl grid place-items-center h-full"
              >
                <div className="bg-bg_primary w-full h-full flex flex-col xl:px-8 lg:px-4 sm:px-3 px-4 xl:py-12 lg:py-10 py-8 rounded-2xl">
                  {/* Card Heading */}
                  <div className="flex flex-row items-center justify-center lg:gap-8 sm:gap-1 gap-8">
                    <h2 className="xl:text-4xl text-2xl font-extrabold">
                      {problem.title}
                    </h2>
                  </div>
                  {/* Card Description */}
                  <p className="mt-8 px-6 font-normal xl:text-2xl lg:text-xl text-xl">
                    {problem.description}
                  </p>
                </div>
              </motion.div>
            </Tilt>
          );
        })}
      </div>
      <motion.h1
        variants={textVariant()}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.25 }}
        className="xl:text-7xl lg:text-6xl md:text-4xl sm:text-4xl text-4xl font-extrabold flex items-center justify-center flex-1"
      >
        We got your back
      </motion.h1>
    </div>
  );
};

export default CurrentSystemProblems;
