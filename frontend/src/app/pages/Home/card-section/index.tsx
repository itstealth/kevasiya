"use client";

import { motion, Variants } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ShoppingBagIcon } from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel";

const cardVariants: Variants = {
  hidden: (custom: number) => {
    switch (custom) {
      case 0:
        return { opacity: 0, x: -100, y: -100 };
      case 1:
        return { opacity: 0, x: 100, y: -100 };
      case 2:
        return { opacity: 0, scale: 0.95 };
      case 3:
        return { opacity: 0, x: -100, y: 100 };
      case 4:
        return { opacity: 0, x: 100, y: 100 };
      default:
        return { opacity: 0 };
    }
  },
  visible: {
    opacity: 1,
    x: 0,
    y: 0,
    scale: 1,
    transition: {
      type: "spring",
      damping: 15,
      stiffness: 50,
      mass: 1,
      duration: 0.8,
      delay: 0.1,
    },
  },
};

function AnimatedCard({
  custom,
  image,
  title,
  description,
  className,
}: {
  custom: number;
  image: string;
  title: string;
  description: string;
  className?: string;
}) {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.2,
  });

  return (
    <motion.div
      ref={ref}
      custom={custom}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      variants={cardVariants}
      className={`relative group overflow-hidden rounded-xl shadow-lg ${className}`}
    >
      <Image
        src={image}
        alt={title}
        width={500}
        height={500}
        className="w-full h-full object-cover transition-transform duration-500 ease-in-out group-hover:scale-110"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent" />
      <div className="absolute bottom-0 left-0 p-6 text-white">
        <h3 className="text-2xl font-semibold font-serif">{title}</h3>
        <p className="text-gray-200 mt-1">{description}</p>
      </div>
    </motion.div>
  );
}

function MobileCard({
  image,
  title,
  description,
  className,
}: {
  image: string;
  title: string;
  description: string;
  className?: string;
}) {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.3,
  });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0 }}
      animate={inView ? { opacity: 1 } : { opacity: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={`relative group overflow-hidden rounded-sm shadow-lg flex-shrink-0 ${className}`}
    >
      <Image
        src={image}
        alt={title}
        width={400}
        height={500}
        className="w-full h-full object-cover transition-transform duration-500 ease-in-out group-hover:scale-110"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent" />
      <div className="absolute bottom-0 left-0 p-6 text-white">
        <h3 className="text-xl font-semibold font-sans">{title}</h3>
        <p className="text-gray-200 mt-1 text-sm">{description}</p>
      </div>
    </motion.div>
  );
}

const cardData = [
  {
    custom: 0,
    image: "/images/baby/boy/boy (6).jpeg",
    title: "Baby Hampers",
    description: "A beautiful way to announce the arrival of your baby",
    className: "md:col-span-1 ",
    path: "/baby",
  },
  {
    custom: 1,
    image: "/cardImages/cardOne.webp",
    title: "Corporate Gifting",
    description: "A beautiful way to gift your loved ones",
    className: "md:col-span-1 sm:mt-16",
    path: "/corporates",
  },
  {
    custom: 2,
    image: "/images/wedding/products/wedding (1).webp",
    title: "Wedding Gifts",
    description: "A beautiful way to invite your loved ones",
    className: "md:col-span-1",
    path: "/wedding",
  },
  {
    custom: 4,
    image: "/cardImages/cardTwo.webp",
    title: "Festive Occasions",
    description: "A beautiful way to gift your loved ones",
    className: "md:col-span-1 sm:mt-16",
    path: "/festival",
  },
];

// Animation for floating effect - alternating up and down
const getFloatingAnimation = (index: number) => {
  // Alternate between up and down movement
  const direction = index % 2 === 0 ? 1 : -1;

  return {
    y: [0, 15 * direction, 0],
    transition: {
      duration: 3,
      repeat: Infinity,
      ease: "easeInOut" as const,
    },
  };
};

const itemVariants: Variants = {
  hidden: { y: 30, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring",
      damping: 12,
      stiffness: 100,
    },
  },
};

export default function CardSection() {
  // const [maxScrollWidth, setMaxScrollWidth] = useState(0);

  useEffect(() => {
    // Old scroll width logic removed
  }, []);

  // Old scroll progress logic removed

  return (
    <section className="lg:py-16 py-12 px-4 max-w-7xl mx-auto">
      <div className="block text-center mb-12">
        <motion.div className="text-center mb-5 md:mb-5">
          <h2 className="text-4xl md:text-5xl font-bold font-serif text-[#3a5a40] mb-4">
            Specially Curated
          </h2>
          <motion.p
            variants={itemVariants}
            className="text-lg text-[#5a6d5c] max-w-2xl mx-auto"
          >
            Choose from our carefully curated collection of gifts
          </motion.p>
        </motion.div>

        {/* Animated Divider */}
        <motion.div className="flex justify-center ">
          <div className="h-1 w-32 bg-gradient-to-r from-transparent via-[#AE8F65] to-transparent rounded-full"></div>
        </motion.div>
      </div>

      {/* Desktop Grid - Fixed height and smaller gap */}
      <div className="hidden md:grid grid-cols-4 gap-4 mt-16">
        {cardData.map((card, index) => (
          <Link
            href={card.path}
            key={index}
            className={`cursor-pointer ${card.className}`}
          >
            <motion.div
              animate={getFloatingAnimation(index)}
              style={{ display: "block" }}
            >
              <AnimatedCard {...card} className=" h-[450px]" />
            </motion.div>
          </Link>
        ))}
      </div>

      {/* Mobile Slider (Carousel) */}
      <div className="md:hidden mt-8 relative">
        <MobileSlider cardData={cardData} />
      </div>
    </section>
  );
}

function MobileSlider({
  cardData,
}: {
  cardData: Array<{
    custom: number;
    image: string;
    title: string;
    description: string;
    className?: string;
    path: string;
  }>;
}) {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const [count, setCount] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  useEffect(() => {
    if (!api || !isAutoPlaying) return;
    const interval = setInterval(() => {
      api.scrollNext();
    }, 3500);
    return () => clearInterval(interval);
  }, [api, isAutoPlaying]);

  useEffect(() => {
    if (!api) return;
    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap());
    api.on("select", () => {
      setCurrent(api.selectedScrollSnap());
    });
  }, [api]);

  // Pause autoplay on interaction
  const handleMouseEnter = () => setIsAutoPlaying(false);
  const handleMouseLeave = () => setIsAutoPlaying(true);
  const handleTouchStart = () => setIsAutoPlaying(false);
  const handleTouchEnd = () => setIsAutoPlaying(true);

  const scrollTo = (idx: number) => api?.scrollTo(idx);

  return (
    <div
      className="relative"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <Carousel setApi={setApi} opts={{ align: "start", loop: true }}>
        <CarouselContent>
          {cardData.map((card, idx) => (
            <CarouselItem key={idx}>
              <div className="flex flex-col items-center px-2">
                <Link href={card.path} className="block w-full">
                  <MobileCard
                    image={card.image}
                    title={card.title}
                    description={card.description}
                    className="w-full h-[400px]"
                  />
                </Link>
                <div className="mt-4 w-full">
                  <Link href={card.path} passHref>
                    <Button
                      variant="outline"
                      className="border-2 w-full bg-[#AE8F65] hover:text-white transition-colors duration-300 rounded-sm text-white text-md font-semibold animate-pulse"
                    >
                      Let&apos;s Explore{" "}
                      <ShoppingBagIcon className="ml-2 h-4 w-4 mt-0.5 transition-transform duration-300 " />
                    </Button>
                  </Link>
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        {/* Navigation Arrows */}
        <CarouselPrevious className="hidden md:flex left-2 top-1/2 -translate-y-1/2 z-10 bg-white/80 text-[#AE8F65]" />
        <CarouselNext className="hidden md:flex right-2 top-1/2 -translate-y-1/2 z-10 bg-white/80 text-[#AE8F65]" />
      </Carousel>
      {/* Dots Indicator */}
      <div className="flex justify-center mt-4 gap-2">
        {Array.from({ length: count }).map((_, idx) => (
          <button
            key={idx}
            onClick={() => scrollTo(idx)}
            className={`transition-all duration-300 rounded-full ${
              idx === current
                ? "w-8 h-3 bg-[#AE8F65]"
                : "w-3 h-3 bg-gray-300 hover:bg-gray-400"
            }`}
            aria-label={`Go to slide ${idx + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
