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
      answer: "Qube is an escrow-based payment solution designed to enhance collaboration between legal entities and pseudonymous individuals. Its primary goal is to create an environment where anonymity is no longer a hurdle, all while ensuring that legal obligations are uncompromising.",
    },
    {
      question: "How much does it Cost?",
      answer: "We are in our pre-alpha phase yet. So we don't charge for now. Even you don't have to pay Gas fee. Join us now! we are waiting for your feedback to make it better!",
    },
    {
      question: "Where can I get details of the Arbitration Solution?",
      answer: "You will get the details on our Whitepaper!",
    },
    {
      question: "What happens if the freelancer does not do the work?",
      answer: "If the freelancer fails to complete the work, our system automatically processes a refund to the client, ensuring that your funds are secure and not wasted on incomplete tasks.",
    },
    {
      question: "What if the quality of work is not good?",
      answer: "In cases where the work quality is unsatisfactory, provisions are available for adjustments. The project timeline can be extended to allow the freelancer to enhance the quality of their work, ensuring that the final output meets your expectations.",
    },
    {
      question: "What if the freelancer is malicious?",
      answer: "If a freelancer exhibits malicious behavior or is uncooperative, you have the option to halt the payment. Qube allows you to initiate refund procedures, ensuring that your funds are returned and not wrongfully appropriated by unscrupulous individuals.",
    },
    {
      question: "Are there any security assurances since the code is not open-source?",
      answer: "We understand the concerns regarding security as we are in our closed beta phase and cannot open-source the code right now. If you have any specific concerns or need further assurance, we are open to having a conversation. Feel free to reach out to us at ",
    },
    {
      question: "How can I reach out for customer support or any queries?",
      answer: "We are here to assist you with any questions or confusion you might have. You can reach out to us via our Discord channel, contact form, or email us directly at [mail address]. Your concerns are important to us, and we aim to provide prompt and efficient support to resolve them.",
    },
  ];

  const faqForFreelancers = [
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
      answer: "We are in our pre-alpha phase yet. So we don't charge for now. Even you don't have to pay Gas fee. Join us now! we are waiting for your feedback to make it better!",
    },
    {
      question: "Where can I get details of the Arbitration Solution?",
      answer: "You will get the details on our Whitepaper!",
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
      answer: "Join our waitlist and we will contact you soon!",
    },
    {
      question: "What wallet can be used?",
      answer: "You can use Metamask, Safe, Nsuite, Rainbow, Coinbase, and MyEther wallet for now.",
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
    <div id="faqs" className="h-full flex flex-col">
      <motion.h1
        variants={textVariant()}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.25 }}
        className="lg:text-6xl text-4xl text-center mb-10"
      >
        FAQs
      </motion.h1>
      <div className="flex flex-col justify-evenly pl-10 h-full">
        {(userType === "COMPANY" ? faqForClients : faqForFreelancers).map((faq, index) => (
          <div key={index}>
            <motion.div
              className="cursor-pointer"
              onClick={() => toggleFAQ(index)}
              initial={{ scale: 1 }}
              whileHover={{ scale: 1.05 }}
            >
              <h3 className="font-medium xl:text-3xl lg:text-2xl text-xl">
                {faq.question}
              </h3>
            </motion.div>
            {activeIndex === index && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
                className="xl:text-2xl lg:text-xl text-lg"
              >
                {faq.answer}
                {
                  faq.question === "How much does it Cost?" 
                    ? <Link href={waitlistUrl} className="underline" target="_blank">[waitlist]</Link> 
                    : faq.question === "Where can I get details of the Arbitration Solution?"
                      ? <Link href="https://qube-1.gitbook.io/qube-whitepaper/" className="underline" target="_blank">[Link]</Link>
                      : faq.question === "Are there any security assurances since the code is not open-source?"
                        ? <Link href="mailto:official@0xqube.xyz" className="underline" target="_blank">[mail address]</Link>
                        : null
                }
              </motion.p>
            )}
          </div>
        ))}
      </div>
      <p className="xl:text-5xl lg:text-3xl sm:text-2xl text-[1.2rem] text-center">
        Feel free to contact us through mail for more questions!
      </p>
    </div>
  );
};

export default FAQ;
