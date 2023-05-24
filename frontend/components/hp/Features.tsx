import React from "react";
import Image from "next/image";
import Tilt from "react-parallax-tilt";

// Content Imports
import { features } from "../../constants";

// Framer-Motion Imports
import { motion } from "framer-motion";
import { fadeIn, textVariant } from "../../utils/motion";

const Features = () => {
  return (
    <div id="features">
      <motion.h1
        variants={textVariant()}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.25 }}
        className="xl:text-7xl lg:text-6xl md:text-4xl sm:text-3xl text-4xl font-extrabold"
      >
        Features
      </motion.h1>
      <div className="sm:grid flex flex-col grid-cols-2 sm:gap-16 gap-32 place-items-center sm:mt-24 mt-16">
        {features.map((feature, index) => {
          return (
            // Card
            <Tilt key={index}>
              <motion.div
                variants={fadeIn("right", 1.25, index)}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.25 }}
                className="blue-transparent-green-gradient-vertical xl:w-[450px] lg:w-[350px] lg:p-[3px] p-[2px] sm:min-h-0 min-h-[300px] rounded-2xl grid place-items-center"
              >
                <div className="bg-bg_primary w-full h-full flex flex-col xl:px-8 lg:px-6 sm:px-3 px-4 xl:py-12 lg:py-10 py-8 rounded-2xl">
                  {/* Card Heading */}
                  <div className="flex flex-row items-center lg:gap-8 sm:gap-1 gap-8">
                    <Image
                      src={feature.image}
                      alt={feature.title}
                      className="w-auto xl:h-[70px] lg:h-[50px] sm:h-[40px] h-[60px]"
                    />
                    <h2 className="xl:text-4xl lg:text-3xl sm:text-xl text-2xl font-extrabold">
                      {feature.title}
                    </h2>
                  </div>
                  {/* Card Description */}
                  <p className="mt-8 px-6 font-normal xl:text-2xl lg:text-xl sm:text-sm text-xl">
                    {feature.description}
                  </p>
                </div>
              </motion.div>
            </Tilt>
          );
        })}
      </div>
    </div>
  );
};

export default Features;
