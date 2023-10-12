import React from "react";
import { useRouter } from "next/router";

// Custom Imports
import CustomButton from "../CustomButton";

// Framer-Motion Imports
import { motion } from "framer-motion";
import { textVariant } from "../../utils";

// Waitlist URL Import
import { waitlistUrl } from "../../constants";

const IntroHeaderSection = (): JSX.Element => {
  const router = useRouter();
  const { userType } = router.query;

  return (
    <motion.h1
      variants={textVariant()}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.25 }}
      className="xl:text-7xl lg:text-6xl md:text-5xl sm:text-5xl text-4xl font-extrabold"
    >
      <p className="block">
        {`Redefining Payments ${userType === "CLIENT" ? "to" : "of"} Freelancers with crypto`}
      </p>
    </motion.h1>
  );
}

const IntroFooterSection = (): JSX.Element => (
  <div className="w-[90%] sm:w-full ">
    <motion.h3
      variants={textVariant()}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.25 }}
      className="xl:text-4xl lg:text-3xl sm:text-2xl text-[1.3rem] leading-[2rem] font-medium"
    >
      <p className="block">Qube is a payment gateway for</p>
      <p className="block">freelancers, guaranteeing timely rewards</p>
      <p className="block">and facilitating seamless transactions.</p>
    </motion.h3>
    <CustomButton
      text="Join Waitlist"
      styles="border-none xs:text-lg sm:text-xl lg:text-xl xl:text-2xl sm:text-sm text-xl font-semibold text-primary bg-white lg:px-8 lg:py-4 px-4 py-2 rounded-md lg:mt-12 sm:mt-8 mt-16"
      type="button"
      onClick={(e) => 
        window.open(waitlistUrl, "_blank")
      }
    />
  </div>
);

const IntroSection = (): JSX.Element => {
  return (
    <div className="h-full flex flex-col justify-center lg:gap-12 sm:gap-8 sm:pt-20 lg:pt-0 gap-16 sm:mt-0 py-12">
      <IntroHeaderSection />
      <IntroFooterSection />
    </div>
  );
};

export default IntroSection;
