import React from "react";
import Image from "next/image";
import Tilt from "react-parallax-tilt";
import Link from "next/link";
import { useRouter } from "next/router";

// Content Imports
import { featuresForClients, featuresForFreelancers } from "../../constants";

// Framer-Motion Imports
import { motion } from "framer-motion";
import { fadeIn, textVariant } from "../../utils";

const Features = () => {
  const router = useRouter();
  const { userType } = router.query;

  return (
    <div id="features">
      <motion.h1
        variants={textVariant()}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.25 }}
        className="lg:text-6xl text-4xl text-center mb-10"
      >
        FEATURES
      </motion.h1>
      <div className="grid lg:grid-cols-2 grid-cols-1 lg:gap-20 gap-10">
        {(userType === "COMPANY" ? featuresForClients : featuresForFreelancers).map((feature, index) => {
          return (
            // Card
            <motion.div
              variants={fadeIn("right", 1.25, index)}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.25 }}
              className="border-2 border-[#613D5D] shadow-custom-pink-rb rounded-2xl text-lg flex flex-row lg:h-[300px] h-[230px] items-center"
            >
              {/* Image */}
              <Image
                src={feature.image}
                alt={feature.title}
                className="w-1/3 h-[100px] mx-10"
              />
              <div>
                {/* Card Heading */}
                <h1 className="xl:text-4xl lg:text-3xl sm:text-xl text-2xl font-extrabold">
                  {feature.title}
                </h1>
                {/* Card Description */}
                <p className="font-normal xl:text-2xl lg:text-lg text-md mr-10">
                  {feature.description}
                </p>
              </div>
            </motion.div>
          );
        })}
      </div>
      <p className="text-6xl text-center mt-20 bg-gradient-to-r from-[#DF57EA] to-slate-200 bg-clip-text text-transparent">Qube's Premium Features, Now at Zero Cost! Don't Miss Out - Join Today!</p>
    </div>
  );
};

export default Features;
