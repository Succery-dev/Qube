import React from "react";
import Link from "next/link";

// Framer-Motion Imports
import { motion } from "framer-motion";
import { fadeIn } from "../utils";

const CustomButton = ({
  link,
  text,
  styles,
}: {
  link: string;
  text: string;
  styles: string;
}): JSX.Element => {
  return (
    <Link
      href={link}
      target={text=="Join Waitlist" ? "_blank" : null}
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
