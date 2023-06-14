import React from "react";

// Framer-Motion Imports
import { motion } from "framer-motion";
import { glowVariant } from "../../utils/motion";

const Glow = ({ styles }: { styles: object[] }) => {
  return (
    <>
      {styles.map((glowStyle, index) => {
        return (
          <motion.div
            variants={glowVariant()}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.25 }}
            className="absolute"
            style={glowStyle}
            key={`${glowStyle}-${index}`}
          ></motion.div>
        );
      })}
    </>
  );
};

export default Glow;
