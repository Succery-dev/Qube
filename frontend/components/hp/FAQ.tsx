import React, { useState } from "react";
import { useRouter } from "next/router";
import { motion } from "framer-motion"; // Framer Motionを使用する場合
import { textVariant } from "../../utils";
import Link from "next/link";
import { waitlistUrl } from "../../constants";

const FAQ = () => {
  const router = useRouter();
  const { userType } = router.query;

  const faqForClients = [
    {
      question: "What is Qube?",
      answer: "Qube is an escrow-based payment solution designed to enhance collaboration between projects and creators. Its primary goal is to provide a mutual payment solution, ensuring that both parties can collaborate in a secure and straightforward manner.",
    },
    {
      question: "How much does it Cost?",
      answer: "We are still in our pre-alpha phase. Therefore, we don't charge at the moment. Join us now! We eagerly await your feedback to improve our system.",
    },
    {
      question: "Where can I get details of the Arbitration Solution?",
      answer1: "You can find the details in our",
      answer2: "For further information, you can also contact us at",
    },
    {
      question: "What happens if the creator does not do the work?",
      answer: "If the creator fails to deliver, our system automatically processes a refund to you, ensuring your funds are safe and aren't expended on incomplete tasks.",
    },
    {
      question: "What if the quality of work is unsatisfactory?",
      answer: "If the quality of the work doesn't meet your standards, provisions exist for revisions. The project timeline can be extended, allowing the creator an opportunity to enhance the quality of their work, ensuring the final product aligns with your expectations.",
    },
    {
      question: "What if the creator behaves maliciously?",
      answer: "If a creator displays malicious intent or is uncooperative, you can choose to withhold payment. Qube enables you to begin refund procedures, ensuring your funds aren't wrongfully appropriated by unscrupulous individuals.",
    },
    {
      question: "How can I trust Qube?",
      answer: "Our smart contract source code is open for public review, ensuring transparency and accountability. Additionally, we have subjected our code to a bug bounty program to identify and rectify any vulnerabilities. For more details, please refer to the link at the bottom of our homepage. If you have any further questions or concerns, do not hesitate to reach out to us!",
    },
    {
      question: "How can I get in touch for customer support or with any questions?",
      answer: "We are always here to help with any questions or concerns you might have. Feel free to reach out to us via our Discord channel, or you can email us directly at ",
    },
  ];

  const faqForFreelancers = [
    {
      question: "What is Escrow?",
      answer: "Escrow is a secure payment method where a neutral third party holds funds until both parties fulfill the agreed-upon requirements. This ensures transparent and safe transactions for everyone involved.",
    },
    {
      question: "What is Qube?",
      answer: "Qube is an escrow-based payment solution geared towards shielding creators from scams and ensuring they receive timely payments. It offers a seamless and secure payment process for all creators.",
    },
    {
      question: "How much does it Cost?",
      answer: "We are currently in our pre-alpha phase. Thus, we aren't charging any fees at the moment. Join us! We eagerly await your feedback to enhance our services.",
    },
    {
      question: "Where can I get details of the Arbitration Solution?",
      answer1: "Detailed information is available in our",
      answer2: "Should you require further insights, you can always reach out to us at",
    },
    {
      question: "What chain does it support?",
      answer: "At present, we support only the Polygon chain. However, we plan to extend our support to other chains in the coming months. If there's a specific chain you'd like to see supported, please feel free to inform us.",
    },
    {
      question: "What currency can I use on Qube now?",
      answer: "Currently, we accept USDC, USDT, and MATIC. We'll be integrating additional currencies shortly!",
    },
    {
      question: "How can I get access?",
      answer: "Since we're in our closed beta phase, we're limiting access to Qube. Claim your handle, and join our discord. we'll get in touch with you shortly!",
    },
    {
      question: "What wallet can be used?",
      answer: "We currently support Metamask, Safe, Nsuite, Rainbow, Coinbase, and MyEtherWallet.",
    },
  ];

  const [activeIndex, setActiveIndex] = useState(null);

  const toggleFAQ = (index) => {
    if (activeIndex === index) {
      setActiveIndex(null);
    } else {
      setActiveIndex(index);
    }
  };

  return (
    <>
      <div id="faqs" className="flex lg:flex-row flex-col items-center">
        <motion.h1
          variants={textVariant()}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.25 }}
          className="lg:text-6xl text-4xl w-1/3 text-center lg:mb-0 mb-10"
        >
          FAQs
        </motion.h1>
        <div className="flex flex-col lg:ml-20 gap-5">
          {(userType === "COMPANY" ? faqForClients : faqForFreelancers).map((faq, index) => (
            <div key={index}>
              <motion.div
                className="cursor-pointer xl:text-2xl lg:text-xl text-lg"
                onClick={() => toggleFAQ(index)}
                initial={{ scale: 1 }}
                whileHover={{ scale: 1.05 }}
              >
                {faq.question}
              </motion.div>
              {activeIndex === index && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                  className="xl:text-xl lg:text-lg text-md"
                >
                  {faq.question === "Where can I get details of the Arbitration Solution?"
                    ? (
                      <>
                        {faq.answer1} <Link href="https://qube-1.gitbook.io/qube-whitepaper/" target="_blank" className="underline">Whitepaper</Link>.
                        <br />
                        {faq.answer2} <Link href="mailto:official@0xqube.xyz" target="_blank" className="underline">"official@0xqube.xyz"</Link>.
                      </>
                    )
                    : (
                      <>
                        {faq.answer}
                        {
                          faq.question === "How can I get in touch for customer support or with any questions?"
                            ? <Link href="mailto:official@0xqube.xyz" target="_blank" className="underline">"official@0xqube.xyz".</Link>
                            : null
                        }
                      </>                       
                    )
                  }
                </motion.p>
              )}
            </div>
          ))}
        </div>
      </div>
      <p className="xl:text-5xl lg:text-3xl sm:text-2xl text-[1.2rem] text-center lg:my-20 my-10">
        Feel free to contact us through mail for more questions!
      </p>
    </>
  );
};

export default FAQ;
