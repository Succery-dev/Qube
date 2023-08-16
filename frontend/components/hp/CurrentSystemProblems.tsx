import React from "react";
import Image from "next/image";

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

const CurrentSystemProblems = (): JSX.Element => {
  return (
    <div id="whyqube" className="flex flex-col h-full">
      <motion.h1
        variants={textVariant()}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.25 }}
        className="xl:text-7xl lg:text-6xl md:text-4xl sm:text-4xl text-4xl font-extrabold"
      >
        Why use Qube?
      </motion.h1>
      <div className="flex flex-col flex-1 items-center justify-evenly space-y-36 mt-10">
        <div className="space-y-36">
          <div className="w-2/3">
            <h3 className="text-5xl text-green-400">An NFT Gaming Company</h3>
            <p className="text-4xl">Tried to negotiate with NFT promoters to collaborate for a giveaway but most of them want to be prepaid…</p>
          </div>
          <div className="w-2/3 ml-auto text-right">
            <h3 className="text-5xl text-blue-400">But Influencers</h3>
            <p className="text-4xl">Want to get paid before executing the giveaway but the company doesn’t pay because they are pseudonymous…</p>
          </div>
        </div>

        <div className="text-center w-3/4">
          <h2 className="text-7xl underline linear-green-blue-gradient">We got your back!</h2>
          <p className="text-5xl">Qube eliminate50s these concerns by using Escrow based payment system so that everyone can collaborate without any fear!</p>
        </div>

        {/* {currentSystemProblems.map(
          (problem: ProblemsInterface, index: number) => {
            return (
              <CurrentSystemProblemsCard
                problem={problem}
                index={index}
                key={index}
              />
            );
          }
        )} */}
      </div>
    </div>
  );
};

export default CurrentSystemProblems;
