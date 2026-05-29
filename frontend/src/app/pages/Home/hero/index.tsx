"use client";

import React, { useState, useEffect, useLayoutEffect } from "react";
import { motion, Variants } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ShoppingBag } from "lucide-react";
// Removed AutoplayVideo import

export default function Hero() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const textVariants: Variants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: "easeOut",
      },
    },
  };

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  };

  const videoRef = React.useRef<HTMLVideoElement | null>(null);

  useLayoutEffect(() => {
    if (isMobile && videoRef.current) {
      const video = videoRef.current;

      // Set all required attributes for iOS Safari
      video.muted = true;
      video.playsInline = true;
      video.setAttribute("webkit-playsinline", "true");
      video.setAttribute("playsinline", "true");
      video.setAttribute("autoplay", "true");
      video.setAttribute("muted", "true");
      video.preload = "auto";

      // Force play programmatically - MUST be in useLayoutEffect for iOS Safari
      const playPromise = video.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => {
          // First fallback: ensure muted and try again
          video.muted = true;
          video.play().catch(() => {
            // Second fallback: try after a small delay
            setTimeout(() => {
              video.play().catch(() => {
                console.log("Video autoplay blocked by browser");
              });
            }, 100);
          });
        });
      }
    }
  }, [isMobile]);

  return (
    <section className="flex overflow-hidden relative justify-center items-center w-full h-[95vh] sm:h-screen">
      {/* Background Media */}
      {isMobile ? (
        <video
          ref={videoRef}
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          webkit-playsinline="true"
          className="object-cover absolute inset-0 z-0 w-full h-full"
        >
          <source src="/videos/video.mp4" type="video/mp4" />
        </video>
      ) : (
        <Image
          src="/hero_home_t.jpg"
          alt="Hero Banner"
          fill
          className="object-cover absolute inset-0 z-0"
          priority
        />
      )}

      {/* Dark Overlay */}
      <div className="absolute inset-0 z-10 bg-black/40" />

      {/* Hero Content */}
      <motion.div
        className="absolute bottom-40 z-20 px-4 mx-auto mt-0 w-full sm:max-w-4xl text-center text-white sm:relative sm:mt-36"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.h1
          className="mb-8 text-5xl font-black tracking-tight leading-none md:text-7xl lg:text-8xl "
          variants={textVariants}
        >
          <span className="block font-serif text-white">KEVASIYA</span>
          <span className="block mt-4 text-2xl font-light tracking-widest text-white md:text-4xl lg:text-5xl">
            CRAFTING EXCELLENCE
          </span>
        </motion.h1>

        <motion.p
          className="mx-auto hidden sm:block mb-12 max-w-3xl text-xl font-light leading-relaxed text-white md:text-2xl lg:text-3xl"
          variants={textVariants}
        >
          Where tradition meets innovation, creating masterpieces that define
          luxury and sophistication
        </motion.p>

        <motion.div
          className="flex flex-col gap-6 justify-center sm:flex-row items-center"
          variants={textVariants}
        >
          <Link href="/collections">
            <button className="px-6  py-4 font-semibold text-black bg-white rounded-md shadow-lg transition-all duration-300 transform sm:px-12 sm:font-bold sm:text-lg hover:bg-gray-100 hover:scale-105 tracking-wider flex justify-center items-center gap-2 w-max">
              Explore Collection
              <span className="inline-block">
                <ShoppingBag
                  className="w-6 h-6"
                  style={{
                    animation: "tiltIcon 3s infinite",
                  }}
                />
                <style jsx>{`
                  @keyframes tiltIcon {
                    0% {
                      transform: rotate(0deg);
                    }
                    20% {
                      transform: rotate(-12deg);
                    }
                    40% {
                      transform: rotate(12deg);
                    }
                    60% {
                      transform: rotate(-12deg);
                    }
                    80% {
                      transform: rotate(12deg);
                    }
                    100% {
                      transform: rotate(0deg);
                    }
                  }
                `}</style>
              </span>
            </button>
          </Link>
        </motion.div>
      </motion.div>
    </section>
  );
}
