import React from "react";

// Interface Imports
import { SectionWrapperPropsInterface } from "../interfaces";

// Custom Component Imports
import { CustomButton, Glow, LogoCanvas } from "../components";

// Framer Motion Imports
import { motion } from "framer-motion";

// Constant Imports
import { aesthetics } from "../constants";
import { useRouter } from "next/router";

const SectionWrapper: React.FC<SectionWrapperPropsInterface> = ({
  children,
  bgColor,
  glowStyles,
}): JSX.Element => {
  return (
    <motion.div
      className={`w-full grid grid-cols-12 ${bgColor} xl:py-40 lg:py-32 py-28 overflow-hidden relative min-h-screen font-nunito`}
    >
      {glowStyles && <Glow styles={glowStyles} />}
      <div className="col-start-2 col-end-12 font-semibold relative flex flex-col justify-center">
        {children}
      </div>
    </motion.div>
  );
};

const PageNotFound = () => {
  const router = useRouter();

  return (
    <SectionWrapper
      bgColor="bg-bg_primary"
      glowStyles={aesthetics.glow.pageNotFoundStyles}
    >
      <div className="block lg:flex flex-row items-center gap-16 text-white font-nunito">
        {/* 404 Message */}
        <div className=" flex flex-col items-center gap-12">
          {/* Wrapper Heading */}
          <div className="flex flex-col items-center">
            {/* Heading */}
            <h1 className=" lg:text-[150px] xl:text-[200px] sm:text-[150px] text-[100px] lg:leading-[150px] xl:leading-[200px] sm:leading-[150px] leading-[100px] linear-green-blue-gradient font-extrabold">
              404
            </h1>
            {/* Sub-Heading */}
            <h2 className="lg:text-5xl xl:text-6xl sm:text-6xl xs:text-4xl text-3xl font-bold">
              PAGE NOT FOUND
            </h2>
          </div>
          {/* Wrapper Message */}
          <div className="flex flex-col items-center">
            <p className="lg:text-2xl xs:text-xl text-lg font-medium text-[#a1a1a1] text-center">
              The page you are looking for was moved, removed, renamed or might
              never existed.
            </p>
          </div>
          {/* Home Button */}
          <CustomButton
            text="Back to Home"
            styles="bg-[#3E8ECC] rounded-md text-center xl:text-2xl font-semibold text-white py-[8px] px-12 hover:bg-[#377eb5]"
            type="button"
            onClick={() => {
              router.push("/");
            }}
          />
        </div>
        {/* 3D Logo */}

        <div className="w-1/3 h-[500px] lg:block hidden">
          <LogoCanvas />
        </div>
      </div>
    </SectionWrapper>
  );
};

export default PageNotFound;
