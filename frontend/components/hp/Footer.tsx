import React from "react";
import Link from "next/link";
import Image from "next/image";

// Image Imports
import { TwitterIcon, MediumIcon } from "../../assets";

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
      className="py-10 px-20 lg:px-40 space-y-5 md:space-y-0 md:flex md:space-x-5 bg-slate-950"
    >
      {/* <FooterSocial /> */}
      {/* <FooterLegal /> */}
      <div className="flex-1 flex flex-col items-center">
        <div className="space-y-5">
          <div className="flex items-center space-x-5">
            <Image
              src="/images/logo.png"
              width="100"
              height="100"
              alt="Q"
              className="rounded-md xl:h-[80px] lg:h-[70px] sm:h-[60px] h-[60px] w-auto shadow-indigo-500/50"
            />
            <h1 className="xl:text-6xl lg:text-4xl sm:text-2xl text-2xl text-primary font-extrabold">
              Qube
            </h1>
          </div>
          <div className="text-4xl">
            <Link href="/" className="flex gap-2">
              <Image src={TwitterIcon} alt="Twitter" height={30} />
              <p>Twitter</p>
            </Link>
            <Link href="/" className="flex gap-2">
              <Image src={MediumIcon} alt="Medium" height={30} />
              <p>Medium</p>
            </Link>
          </div>
        </div>
      </div>
      <div className="flex-1 text-4xl flex flex-col space-y-5 items-center">
        <Link href="/">Resources</Link>
        <Link href="/">FAQ's</Link>
        <Link href="/">Whitepaper</Link>
      </div>
      <div className="flex-1 text-4xl flex flex-col space-y-5 items-center">
        <Link href="/">Contacts</Link>
        <Link href="/">[メアド]</Link>
      </div>
    </motion.footer>
  );
};

export default Footer;
