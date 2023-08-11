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
    <div id="product">
      <motion.h1
        variants={textVariant()}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.25 }}
        className="xl:text-7xl lg:text-6xl md:text-4xl sm:text-4xl text-4xl font-extrabold"
      >
        Why use Qube?
      </motion.h1>
      {/* <div className="sm:flex sm:flex-row justify-between lg:mt-32 sm:mt-16"> */}
      <div className="space-y-7 mt-20">
        <h3 className="text-4xl">An NFT Gaming Company</h3>
        <p className="text-3xl">Tried to negotiate with NFT promoters to collaborate for a giveaway but most of them want to be prepaid…</p>
        <h3 className="text-4xl">But Influencers</h3>
        <p className="text-3xl">Want to get paid before executing the giveaway but the company doesn’t pay because they are pseudonymous…</p>

        <h2 className="text-5xl">These happen a lot…</h2>
        <p className="text-3xl w-1/2">How can freelancers and influencers trust that they will get paid after work on time?</p>
        <p className="text-3xl w-1/2 ml-auto">How can the hiring party trust that anonymous individuals will not ghost them after receiving advance payment?</p>

        <h2 className="text-5xl">We got your back! </h2>
        <p className="text-3xl">Qube eliminates these concerns by using Escrow based payment system so that everyone can collaborate without any fear!</p>
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
