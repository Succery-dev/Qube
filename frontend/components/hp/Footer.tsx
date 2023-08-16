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
    <div className="bg-gray-900 px-24 xl:px-52 text-white pt-20 pb-40 grid grid-cols-10 space-y-5 md:space-y-0 text-center md:text-left">
      <div className="col-span-10 md:col-span-4 space-y-5">
        <div className="flex justify-center md:justify-start items-center space-x-5">
          <Image
            src="/images/logo.png"
            width="100"
            height="100"
            alt="Q"
            className="rounded-md h-[40px] w-auto shadow-indigo-500/50"
          />
          <h1 className="text-2xl text-primary font-extrabold">
            Qube
          </h1>
        </div>
        <div className="flex justify-center md:justify-start items-center space-x-10">
            <Link href="/">
              <Image src={TwitterIcon} alt="Twitter" height={30} />
            </Link>
            <Link href="/">
              <Image src={MediumIcon} alt="Medium" height={30} />
            </Link>
        </div>
      </div>
      <div className="col-span-10 md:col-span-3">
        <h3 className="text-xl font-semibold mb-4">Resources</h3>
        <ul>
          <li className="mb-2"><a href="/" className="text-white hover:text-gray-500">FAQ's</a></li>
          <li className="mb-2"><a href="/" className="text-white hover:text-gray-500">Whitepaper</a></li>
          <li className="mb-2"><a href="/" className="text-white hover:text-gray-500">Sample</a></li>
        </ul>
      </div>
      <div className="col-span-10 md:col-span-3">
        <h3 className="text-xl font-semibold mb-4">Contacts</h3>
        <ul>
          <li className="mb-2"><a href="/" className="text-white hover:text-gray-500">[メアド]</a></li>
          <li className="mb-2"><a href="/" className="text-white hover:text-gray-500">Sample</a></li>
          <li className="mb-2"><a href="/" className="text-white hover:text-gray-500">Sample</a></li>
        </ul>
      </div>
    </div>
  );
};

export default Footer;
