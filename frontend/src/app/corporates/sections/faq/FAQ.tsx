"use client";

import { useState, useRef } from "react";
import { motion, useInView, AnimatePresence, Variants } from "framer-motion";

const faqData = [
  {
    question: "Shall I get the affordable deals on bulk purchase?",
    answer:
      "Yes, of course, we are the bulk seller. We usually deal in bulk only while maintaining the price limit.",
  },
  {
    question: "Can we customize the packages according to our company logo?",
    answer:
      "Yes, why not, As we already declared, we are the bulk seller; this is our signature personality; we can initially transform the gift according to your company branding.",
  },
  {
    question: "In how many ways can you transform the available gifts?",
    answer:
      "Our core value is personalized, versatile creativity, such as embroidery, printing, embossing, screen printing, and engraving. Apart from that, we can acquire greeting cards & create the packaging that reflects your company.",
  },
  {
    question: "What will be the exact quantity of the order at Kevasiya?",
    answer:
      "Well, the exact quantity will depend on which type of gifts you have selected, whether it is a properly customized hamper or you have just selected a readymade hamper. Basically, that customization hampers acquiring more often.",
  },
  {
    question: "Would you suggest the appropriate gifts for my employees?",
    answer:
      "Shortlist the products that you have liked the most, within your estimated budget, whereas Kevasiya will create a personalized microsite for your employees to select their preferred gift hampers. If you are facing obstruction in choosing the gifts, then you may feel free to contact our dedicated sales team, who are active 24/7 to resolve your issues.",
  },
  {
    question: "How do I repurchase my order from my history?",
    answer:
      "It's quite easy to reorder the product by visiting my purchase page and hitting the Reorder button. You can reorder the gifts and send them to the same address or a different one.",
  },
  {
    question: "Which type of payment gateway do you accept?",
    answer:
      "We would accept payment from all ends, such as credit cards and national cards; we also accept payments via net banking and UPI.",
  },
  {
    question: "Is it necessary to create an account before placing an order?",
    answer:
      "Yes, it is quite necessary to create an account. It would hardly take 5 minutes. With a registered account, creating your own custom wishlist and order history will become more convenient, and you will enjoy preview access to our finest collection.",
  },
  {
    question: "Shall I place the order on call at Kevasiya?",
    answer:
      "No, you cannot place the order via call; you may only get assistance on call about placing the bulk order. Moreover. If you get stuck anywhere on our website. You can call this number, +91 9220229789, but orders are placed on the website itself.",
  },
];

export default function Component() {
  const [openItems, setOpenItems] = useState<number[]>([]);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.1 });

  const sectionFadeInUp: Variants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.7,
        delay: 0.2,
        ease: "easeOut",
        staggerChildren: 0.2,
      },
    },
  };

  const titleFadeInUp: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" },
    },
  };

  const listContainerFadeInUp: Variants = {
    hidden: { opacity: 0, y: 40 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut", staggerChildren: 0.1 },
    },
  };

  const faqItemFadeInUp: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4, ease: "easeOut" },
    },
  };

  const answerReveal: Variants = {
    hidden: { opacity: 0, height: 0, y: -10 },
    visible: {
      opacity: 1,
      height: "auto",
      y: 0,
      transition: { duration: 0.3, ease: "easeOut" },
    },
    exit: {
      opacity: 0,
      height: 0,
      y: -10,
      transition: { duration: 0.2, ease: "easeIn" },
    },
  };

  const toggleItem = (index: number) => {
    setOpenItems((prev) =>
      prev.includes(index)
        ? prev.filter((item) => item !== index)
        : [...prev, index]
    );
  };

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={sectionFadeInUp}
      className="min-h-screen bg-gradient-to-b from-[#3A5834F5] to-[#3A5834F5] flex items-center justify-center py-14 flex-col"
    >
      <div className="w-full max-w-2xl px-8 sm:px-0">
        <motion.h2
          variants={titleFadeInUp}
          className="text-4xl font-serif text-white text-center mb-12 sm:font-semibold"
        >
          FAQs
        </motion.h2>

        <motion.div variants={listContainerFadeInUp} className="space-y-1">
          {faqData.map((faq, index) => (
            <motion.div
              key={index}
              variants={faqItemFadeInUp}
              className="border-b border-green-700/50"
            >
              <button
                onClick={() => toggleItem(index)}
                className="w-full flex items-center justify-between py-6 px-2 text-left text-white hover:bg-green-700/20 transition-colors duration-200 group"
              >
                <span className="text-lg font-light pr-4">{faq.question}</span>
                <motion.span
                  animate={{ rotate: openItems.includes(index) ? 45 : 0 }}
                  transition={{ duration: 0.2 }}
                  className={`text-2xl font-light transition-transform duration-200`}
                >
                  +
                </motion.span>
              </button>

              <AnimatePresence initial={false}>
                {openItems.includes(index) && (
                  <motion.div
                    variants={answerReveal}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    className="px-2 pb-6 text-white/80 text-base leading-relaxed overflow-hidden"
                  >
                    <p>{faq.answer}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </motion.div>
      </div>
      {/* <div className="w-full max-w-full py-5 bg-[#FBE0C2]">
        <p className="text-[#3A5834F5] text-center">Copyright © 2025 All Rights Reserved</p>
      </div> */}
    </motion.div>
  );
}
