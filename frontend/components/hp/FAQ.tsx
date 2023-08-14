import React, { useState } from "react";
import { motion } from "framer-motion"; // Framer Motionを使用する場合
import { textVariant } from "../../utils";

const FAQ = () => {
  const faqData = [
    {
      question: "What is Escrow?",
      answer: "Escrow is a safe payment technique in which a neutral third party holds payments until both parties satisfy the requirements agreed upon. It provides secure and transparent transactions for both parties.",
    },
    {
      question: "What is Qube?",
      answer: "Qube is an escrow-based payment solution designed to enhance collaboration between legal entities and pseudonymous individuals. Its primary goal is to create an environment where anonymity is no longer a hurdle, all while ensuring that legal obligations are uncompromised.",
    },
    {
      question: "How much does it Cost?",
      answer: "We are in our pre-alpha phase yet. So we don’t charge for now. Even you don’t have to pay Gas fee. Join us now! we are waiting for your feedback to make it better! [waitlist]",
    },
    {
      question: "Where can I get details of the Arbitration Solution?",
      answer: "You will get the details on our Whitepaper! [Link]",
    },
    {
      question: "What chain does it support?",
      answer: "As we are in our pre-alpha phase, we only support Polygon for now. Within a few months, we will support other chains too!",
    },
    {
      question: "What currency can I use on Qube now?",
      answer: "For now, USDC, MATIC, and ETH can be used in Qube. Other currencies will be able to be used soon!",
    },
    {
      question: "How can I get access?",
      answer: "Join our waitlist and we will contact you soon! ",
    },
    {
      question: "What wallet can be used?",
      answer: "You can use Metamask, Safe, Nsuite, Rainbow, Coinbase, and MyEther wallet for now. ",
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
    <div id="faq">
      <motion.h1
        variants={textVariant()}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.25 }}
        className="xl:text-7xl lg:text-6xl md:text-4xl sm:text-4xl text-4xl font-extrabold"
      >
        FAQ
      </motion.h1>
      <div className="space-y-4 ml-10">
        {faqData.map((faq, index) => (
          <div key={index}>
            <motion.div
              className="cursor-pointer"
              onClick={() => toggleFAQ(index)}
              initial={{ scale: 1 }}
              whileHover={{ scale: 1.05 }}
            >
              <h3 className="text-3xl font-medium">
                {faq.question}
              </h3>
            </motion.div>
            {activeIndex === index && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
                className="mt-2"
              >
                {faq.answer}
              </motion.p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default FAQ;
