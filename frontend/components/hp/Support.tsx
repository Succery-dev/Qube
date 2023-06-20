import React from "react";
import Link from "next/link";
import Image from "next/image";
import Tilt from "react-parallax-tilt";

// Interfaces Imports
import { SupportInterface } from "../../interfaces";

// Content Imports
import { support } from "../../constants";

// Framer-Motion Imports
import { motion } from "framer-motion";
import { fadeIn, textVariant } from "../../utils";

const SupportCard = ({
  support,
  index,
}: {
  support: SupportInterface;
  index: number;
}): JSX.Element => {
  return (
    <Link href={support.hp} target="_blank">
      <motion.div
        variants={fadeIn("right", 1.25, index)}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.25 }}
        className="sm:basis-[28%] flex flex-col sm:items-start items-center gap-8 sm:py-0 py-16"
        key={support.id}
      >
        <Tilt key={support.id}>
          <Image
            src={support.image}
            width="300"
            height="300"
            alt={support.id}
          />
        </Tilt>
        <p className="font-extrabold xl:text-3xl lg:text-2xl sm:text-xl text-xl grow sm:w-full w-2/3">
          {support.name}
        </p>
      </motion.div>
    </Link>
  );
};

const Support = (): JSX.Element => {
  return (
    <div id="support">
      <motion.h1
        variants={textVariant()}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.25 }}
        className="xl:text-7xl lg:text-6xl md:text-4xl sm:text-4xl text-4xl font-extrabold"
      >
        Supported by
      </motion.h1>
      <div className="sm:flex sm:flex-row justify-around lg:mt-32 sm:mt-16">
        {support.map(
          (support: SupportInterface, index: number) => {
            return (
              <SupportCard
                support={support}
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

export default Support;
