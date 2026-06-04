"use client";

import type React from "react";

import Link from "next/link";
import { motion } from "framer-motion";
import { FaShoppingBag } from "react-icons/fa";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import Marquee from "@/components/ui/marquee";

interface Occasion {
  id: string;
  name: string;
  href: string;
  // icon?: React.ElementType;
  description?: string;
  image: string;
  iconImage: string;
}

const occasionsData: Occasion[] = [
  {
    id: "birthdays",
    name: "BIRTHDAYS",
    href: "/collections/baby-hampers/birthday",
    // icon: FaBirthdayCake,
    iconImage: "/images/home/occasions/cake.png",
    description:
      "Find the perfect gift to celebrate another year of joy and memories",
    image: "/images/baby/boy/boy (2).jpeg",
  },
  {
    id: "anniversary",
    name: "ANNIVERSARY",
    href: "/collections/anniversary",
    // icon: FaHeart,
    iconImage: "/images/home/occasions/heart.png",
    description:
      "Mark your special milestone with a thoughtful and meaningful present",
    image: "/images/categories/categories (2).webp",
  },
  {
    id: "house-warming",
    name: "HOUSE WARMING",
    href: "/collections/house-warming",
    // icon: FaHome,
    iconImage: "/images/home/occasions/home.png",
    description:
      "Welcome them to their new home with a lovely and practical gift",
    image: "/images/categories/categories (3).webp",
  },
  {
    id: "baby-shower",
    name: "BABY CELEBRATION",
    href: "/collections/baby-hampers",
    // icon: FaBaby,
    iconImage: "/images/home/occasions/baby.png",
    description:
      "Celebrate the new arrival with adorable and cherished presents",
    image: "/images/baby/girl/girl (17).jpeg",
  },
  {
    id: "special-gifts",
    name: "FESTIVAL",
    href: "/festival",
    // icon: FaGift,
    iconImage: "/images/home/occasions/festival.png",
    description:
      "Unique presents for those extraordinary and unforgettable moments",
    image: "/images/categories/categories (5).webp",
  },
];

const colors = {
  primary: "#AE8F65", // Warm beige/gold
  secondary: "#4A674F", // Muted green
  background: "#FEFEFE", // Pure white
  backgroundSecondary: "#F8F9FA", // Off white
  textPrimary: "#2D2D2D", // Dark gray for readability
  textSecondary: "#5A5A5A", // Medium gray
  textOnColor: "#FFFFFF", // White for colored backgrounds
};

const OccasionCard = ({
  occasion,
}: {
  occasion: Occasion;
}) => {
  return (
    <motion.article
      className="h-[60vh] w-screen md:h-[50vh] md:w-[50vw] flex flex-col justify-center items-center overflow-hidden relative shrink-0"
    >
      <Image
        src={occasion.image}
        alt={occasion.name}
        fill
        className="absolute inset-0 z-0 object-cover filter blur-sm"
      />
      {/* Dark overlay for better text readability */}
      <div className="absolute inset-0 z-1 bg-black/30" />

      <div className="group text-center p-4 relative z-10 w-full flex flex-col items-center gap-4">
        <motion.div className="transition-transform duration-300 group-hover:scale-110">
          <motion.div
            animate={{
              y: ["-3%", "3%"],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              repeatType: "reverse",
              ease: "easeInOut",
            }}
          >
            <Image
              src={occasion.iconImage}
              alt={`${occasion.name} icon`}
              width={100}
              height={100}
              className="w-28 h-28 md:w-28 md:h-28 lg:w-28 lg:h-28 mx-auto"
            />
          </motion.div>
        </motion.div>

        <div className="relative overflow-hidden  font-sans">
          <motion.h3
            style={{
              color: colors.textOnColor,
            }}
            className="text-4xl md:text-6xl lg:text-2xl xl:text-3xl h-max font-extrabold drop-shadow-lg"
          >
            {occasion.name}
          </motion.h3>
        </div>

        <p
          style={{ color: colors.textOnColor }}
          className="text-base md:text-lg lg:text-xl max-w-sm md:max-w-md mx-auto leading-relaxed drop-shadow-md"
        >
          {occasion.description}
        </p>
        <div>
          <Button
            variant="outline"
            size="lg"
            className="bg-transparent border-white text-white group/button hover:bg-white hover:text-slate-900 transition-all duration-300 ease-in-out transform hover:scale-105  mt-5 animate-bounce rounded-[2px] border-2 text-lg px-8 py-6"
            asChild
          >
            <Link href={occasion.href}>
              Shop Now
              <span className="ml-2 mt-0.5 transition-transform duration-300 group-hover/button:translate-x-1">
                <FaShoppingBag size={20} />
              </span>
            </Link>
          </Button>
        </div>
      </div>
    </motion.article>
  );
};

const SpecialOccasions: React.FC = () => {
  return (
    <section
      className="pt-12 md:pt-16 lg:pt-16 pb-16 md:pb-24 overflow-hidden"
      style={{ backgroundColor: colors.background }}
    >
      <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8 md:mb-12 lg:mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold font-serif mb-4 md:mb-6"
            style={{ color: colors.secondary }}
          >
            Special Occasions
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-base md:text-lg lg:text-lg max-w-3xl mx-auto leading-relaxed"
            style={{ color: colors.textSecondary }}
          >
            Making every celebration memorable with the perfect gift for your
            loved ones.
          </motion.p>

          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="flex justify-center mt-6 md:mt-8"
          >
            <div
              className="h-1 w-24 md:w-32 rounded-full"
              style={{
                background: `linear-gradient(90deg, transparent 0%, ${colors.primary} 50%, transparent 100%)`,
              }}
            />
          </motion.div>
        </div>
      </div>

      <Marquee
        pauseOnHover
        repeat={2}
        className="w-full [--gap:1.5rem] [--duration:28s] px-0 py-0"
      >
        {occasionsData.map((occasion) => (
          <OccasionCard key={occasion.id} occasion={occasion} />
        ))}
      </Marquee>
    </section>
  );
};

export default SpecialOccasions;
