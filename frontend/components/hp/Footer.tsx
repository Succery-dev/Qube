import React from "react";
import Link from "next/link";
import Image from "next/image";

// Image Imports
import { TwitterIcon, MediumIcon, Discord, Game } from "../../assets";

// Content Imports
import { footerLinks } from "../../constants";

// Framer-Motion Imports
import { motion } from "framer-motion";
import { fadeIn } from "../../utils";

import dotenv from "dotenv";
dotenv.config();

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
    <div className="bg-gray-900">
      <div className="flex lg:flex-row flex-col pt-10 px-20 lg:gap-0 gap-10">
        <Image
          src={Game}
          alt="Game"
          className="lg:h-[200px] mx-auto flex-1 p-5"
        />
        <div className="w-1 h-[200px] bg-gradient-to-b from-transparent via-[#E220CF] to-transparent lg:block hidden"></div>
        <div className="flex-1 flex flex-col items-center">
          <p className="text-2xl font-bold mb-3">RESOURCES</p>
          <ul className="list-disc list-inside">
            <li className="text-xl hover:underline">
              <Link href="https://github.com/Succery-dev/Qube" target="_blank">
                Github
              </Link>
            </li>
            <li className="text-xl hover:underline">
              <Link href="https://qube-1.gitbook.io/qube-whitepaper-japanese/" target="_blank">
                Whitepaper Jap
              </Link>
            </li>
            <li className="text-xl hover:underline">
              <Link href="https://qube-1.gitbook.io/qube-whitepaper/" target="_blank">
                Whitepaper Eng
              </Link>
            </li>
            <li className="text-xl hover:underline">
              <Link href="https://immunefi.com/" target="_blank">
                Bug Bounty
              </Link>
            </li>
          </ul>
        </div>
        <div className="w-1 h-[200px] bg-gradient-to-b from-transparent via-[#E220CF] to-transparent lg:block hidden"></div>
        <div className="flex-1 flex flex-col items-center">
          <p className="text-2xl font-bold mb-3">CONTACT</p>
          <ul className="list-disc list-inside">
            <li className="text-xl hover:underline">
              <Link href="mailto:official@0xqube.xyz" target="_blank">
                Mail Address
              </Link>
            </li>
          </ul>
        </div>
        <div className="w-1 h-[200px] bg-gradient-to-b from-transparent via-[#E220CF] to-transparent lg:block hidden"></div>
        <div className="flex-1 flex flex-col items-center">
          <p className="text-2xl font-bold mb-3">SOCIAL ACCOUNTS</p>
          <div className="flex flex-row gap-5">
            <Link href="https://twitter.com/0xQube" target="_blank">
              <Image src={TwitterIcon} alt="Twitter" height={30} className="bg-[#613D5D] hover:bg-[#E220CF] ease-in duration-300 rounded-full h-[50px] w-[50px] p-1 border border-[#E220CF]" />
            </Link>
            <Link href={`${process.env.NEXT_PUBLIC_DISCORD_LINK}`} target="_blank">
              <Image src={Discord} alt="Discord" height={30} className="bg-[#613D5D] hover:bg-[#E220CF] ease-in duration-300 rounded-full h-[50px] w-[50px] p-1 border border-[#E220CF]" />
            </Link>
            <Link href="https://medium.com/@0xqube" target="_blank">
              <Image src={MediumIcon} alt="Medium" height={30} className="bg-[#613D5D] hover:bg-[#E220CF] ease-in duration-300 rounded-full h-[50px] w-[50px] p-1 border border-[#E220CF]" />
            </Link>
          </div>
        </div>
      </div>
      <hr className="w-2/3 h-[1px] bg-gradient-to-r from-transparent via-[#E220CF] to-transparent border-none mx-auto my-16" />
      <p className="text-center pb-16 hover:underline">
        <Link href="/">
          2023 © SUCCERY FZCO - ALL RIGHTS RESERVED
        </Link>
      </p>
    </div>
  );
};

export default Footer;
