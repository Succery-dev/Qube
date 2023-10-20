import React from "react";
import Image from "next/image";
import Link from "next/link";
import Tilt from "react-parallax-tilt";
import { useRouter } from "next/router";

// Custom Component Imports
import { Glow } from "../aesthetics";

// Framer-Motion Imports
import { motion } from "framer-motion";
import { fadeIn, textVariant } from "../../utils";

// Content Imports
import { currentSystemProblems, aesthetics } from "../../constants";

// Interface Imports
import { ProblemsInterface } from "../../interfaces";

import { WhyUs } from "../../assets";

const CurrentSystemProblemsCard = ({
  problem,
  index,
}: {
  problem: ProblemsInterface;
  index: number;
}): JSX.Element => {
  return (
    <motion.div
      variants={fadeIn("right", 1.25, index)}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.25 }}
      className="sm:basis-[28%] flex flex-col sm:items-start items-center gap-8 sm:py-0 py-16"
      key={problem.id}
    >
      <div className="relative">
        <Glow styles={aesthetics.glow.currentSystemProblemsStyles} />
        <Image
          src={problem.image}
          alt="Image"
          width="200"
          className="xl:h-[200px] lg:h-[150px] sm:h-[100px] h-[150px]"
        />
      </div>
      <p className="font-extrabold xl:text-3xl lg:text-2xl sm:text-xl text-xl grow sm:w-full w-2/3">
        {problem.description}
      </p>
    </motion.div>
  );
};

const problemsForClients = [
  {
    title: "Demanding Prepay",
    description: "Freelancers sometimes demand prepayment before beginning work, which many companies find uncomfortable.",
  },
  {
    title: "Scams",
    description: "The prevalence of scams poses a significant challenge. Those in charge of collaborations have to expend considerable effort in vetting potential freelancers.",
  },
  {
    title: "Risk of Disputes",
    description: "Disputes regarding the quality of work can arise, making it challenging to reach a resolution that satisfies both parties.",
  },
];

const problemsForFreelancers = [
  {
    title: "Trust Issue",
    description: "Lots of freelancers are facing non payment or delayed payment. This is the biggest risk a freelancer always had to take.",
  },
  {
    title: "Risk of Disputes",
    description: "There is possibility of having problems over the quality of submission. It's very hard to come to a mutual point once this happens.",
  },
  {
    title: "High cost of platforms",
    description: "Existing platforms provide escrow based payment solution but the platform fee is too expensive. Qube doesn't cost any transaction fee.",
  },
];

const whyUsForClient = [
  {
    title: "Delayed Delivery",
    description: "Clients often experience delayed delivery or inappropriate deliveries. Qube's Escrow payment and arbitration will free you from these concerns.",
  },
  {
    title: "Complexity in Management",
    description: "While companies collaborate with several creators it's quite confusing managing all of those. Qube makes it way easier to manage payments to creators.",
  },
  {
    title: "High Platform Fees",
    description: "Existing platforms provide escrow-based payment solutions but the platform fee is too expensive. Qube doesn't cost any transaction fee.",
  },
];

const whyUsForFreelancer = [
  {
    title: "NO / DELAYED PAYMENTS",
    description: "Qube secures the payment using a Smart Contract-based escrow service to ensure that creators don't face any Delayed or Non payments in collaboration.",
  },
  {
    title: "NO RISK OF DISPUTES",
    description: "It's very hard to come to a mutual point once dispute happens. Qube provide a fair resolution process powered by Kleros, an decentralized arbritation.",
  },
  {
    title: "Proof of works",
    description: "Still it's hard to showcase your experiences using on-chain data.  Qube Provides a on-chain data based resume system which will prove your experience.",
  },
];

const CurrentSystemProblems = (): JSX.Element => {
  const router = useRouter();
  const { userType } = router.query;

  return (
    <div id="whyus">
      <motion.h1
        variants={textVariant()}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.25 }}
        className="lg:text-6xl text-4xl text-center mb-10"
      >
        WHY US ?
      </motion.h1>
      <div className="flex flex-col xl:flex-row gap-10">
        <Image
          src={WhyUs}
          width="500"
          height="500"
          alt="WhyUs"
          className="flex-1 mx-auto"
        />
        <div className="flex-1">
          {(userType === "COMPANY" ? whyUsForClient : whyUsForFreelancer).map((why, index) => {
            return (
              <>
                <motion.p
                  variants={fadeIn("right", 1.25, index)}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, amount: 0.25 }}
                  className="text-2xl my-5"
                >
                  {why.title}
                </motion.p>
                <motion.p
                  variants={fadeIn("right", 1.25, index)}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, amount: 0.25 }}
                  className="border-2 border-[#613D5D] shadow-custom-pink-rb rounded-2xl p-5 text-lg"
                >
                  {why.description}
                </motion.p>
              </>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default CurrentSystemProblems;
