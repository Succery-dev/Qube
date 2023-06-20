import React from "react";
import Link from "next/link";
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
          alt="70%"
          className="xl:h-[200px] lg:h-[150px] sm:h-[100px] h-[150px]"
        />
      </div>
      <p className="font-extrabold xl:text-3xl lg:text-2xl sm:text-xl text-xl grow sm:w-full w-2/3">
        {problem.description.main}
      </p>
      {/* TODO: edit links */}
      <Link href="/">
        <p className="font-normal xl:text-xl lg:text-lg md:text-sm">
          {problem.description.footer}
        </p>
      </Link>
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
        Why Qube
      </motion.h1>
      <div className="sm:flex sm:flex-row justify-between lg:mt-32 sm:mt-16">
        {currentSystemProblems.map(
          (problem: ProblemsInterface, index: number) => {
            return (
              <CurrentSystemProblemsCard
                problem={problem}
                index={index}
                key={index}
              />
            );
          }
        )}
      </div>
    </div>
  );
};

export default CurrentSystemProblems;
