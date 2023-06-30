import React from "react";
import Link from "next/link";
import Image from "next/image";

// Image Imports
import { TwitterIcon } from "../../assets";

// Content Imports
import { footerLinks } from "../../constants";

// Framer-Motion Imports
import { motion } from "framer-motion";
import { fadeIn } from "../../utils";

const FooterSocial = (): JSX.Element => {
  return (
    <Link
      href="https://twitter.com/0xQube"
      className="flex flex-row items-center gap-4"
      target="_blank"
    >
      <Image src={TwitterIcon} alt="Twitter" height={30} />
      <p>Twitter</p>
    </Link>
  );
};

const FooterLegal = (): JSX.Element => {
  return (
    <div className="flex sm:flex-row flex-col sm:items-center sm:gap-8 gap-16">
      {footerLinks.map((footerLink, index) => {
        return (
          <Link
            href={footerLink.link}
            key={footerLink.id}
            target={footerLink.id != "2023_SUCCERY_FZCO" ? "_blank" : ""}
          >
            <p>{footerLink.title}</p>
          </Link>
        );
      })}
    </div>
  );
};

const Footer = () => {
  return (
    <motion.footer
      variants={fadeIn("up", 1.25)}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.25 }}
      className=" sm:pt-48 sm:pb-24 pt-36 pb-12  flex sm:flex-row flex-col sm:justify-between sm:items-center sm:gap-0 gap-16 col-start-2 col-end-12 xl:text-xl lg:text-lg sm:text-sm text-xl font-medium"
    >
      <FooterSocial />
      <FooterLegal />
    </motion.footer>
  );
};

export default Footer;
