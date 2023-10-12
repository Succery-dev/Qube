import React from "react";

// Framer-Motion Imports
import { motion } from "framer-motion";
import { fadeIn } from "../utils";

// Type Imports
import { buttonType } from "../types";

const CustomButton = ({
  text,
  styles,
  onClick,
  type,
}: {
  text: string;
  styles: string;
  onClick: (e: React.MouseEvent<HTMLElement>) => void;
  type: buttonType;
}) => {
  return (
    <motion.button
      variants={fadeIn("down", 1.25)}
      initial="hidden"
      animate="visible"
      className={styles}
      type={type}
      onClick={(e) => onClick(e)}
    >
      {text}
    </motion.button>
  );
};

export default CustomButton;
