import React from "react";
import Link from "next/link";

// Framer-Motion Imports
import { motion } from "framer-motion";
import { fadeIn } from "../utils";

const CustomButton = ({
  text,
  styles,
}: {
  text: string;
  styles: string;
}): JSX.Element => {
  return (
    <Link
      href="https://docs.google.com/forms/d/e/1FAIpQLSfe3r7ia_OTCHU8tHEtNG_aPY6OpLDsLPl3RDj-wQLutXNTKg/viewform"
      target="_blank"
    >
      <motion.button
        variants={fadeIn("down", 1.25)}
        initial="hidden"
        animate="visible"
        className={styles}
      >
        {text}
      </motion.button>
    </Link>
  );
};

export default CustomButton;
