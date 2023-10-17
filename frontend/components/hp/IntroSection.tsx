import React from "react";
import { useRouter } from "next/router";
import Image from "next/image";

// Custom Imports
import CustomButton from "../CustomButton";

// Framer-Motion Imports
import { motion } from "framer-motion";
import { textVariant } from "../../utils";

// Waitlist URL Import
import { waitlistUrl } from "../../constants";

import { Game } from "../../assets";

const IntroSection = (): JSX.Element => {
  const router = useRouter();
  const { userType } = router.query;

  return (
    <div className="relative h-full flex flex-col items-center justify-center lg:gap-12 sm:gap-8 gap-16 mt-5 md:mt-0">
      <h1 className="lg:text-6xl text-4xl">MAKE COLLABORATION</h1>
      <h2 className="lg:text-6xl text-4xl text-[#E220CF]">STRESS FREE</h2>
      <p className="lg:text-2xl text-xl text-center font-extralight">
        Qube is an escrow-based payment tool that
        <br />
        bridges trust between P2P payments.
      </p>
      <CustomButton
        text="JOIN WAITLIST"
        styles="border-none xs:text-sm sm:text-xl lg:text-2xl font-semibold text-black bg-gradient-to-b from-slate-200 to-[#E220CF] lg:px-8 lg:py-4 px-4 py-2 rounded-full lg:mt-12 sm:mt-8 mt-16"
        type="button"
        onClick={(e) => 
          window.open(waitlistUrl, "_blank")
        }
      />
      <Image
        src={Game}
        alt="Game"
        className="absolute md:-right-20 -right-10 lg:bottom-14 -bottom-10 w-auto xl:h-[350px] lg:h-[250px] sm:h-[200px] h-[130px]"
      />
    </div>
  );
};

export default IntroSection;
