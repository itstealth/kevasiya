"use client";
import React, { useRef, useState, useEffect, useLayoutEffect } from "react";
import { motion, useInView, Variants } from "framer-motion";
import Image from "next/image";

const Hero = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useLayoutEffect(() => {
    if (isMobile && videoRef.current) {
      const video = videoRef.current;
      video.muted = true;
      video.playsInline = true;
      video.setAttribute("webkit-playsinline", "true");
      video.setAttribute("playsinline", "true");
      video.setAttribute("autoplay", "true");
      video.setAttribute("muted", "true");
      video.preload = "auto";
      const playPromise = video.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => {
          video.muted = true;
          video.play().catch(() => {
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

  const sectionFadeInUp: Variants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        delay: 0.1,
        ease: "easeOut",
        staggerChildren: 0.3,
      },
    },
  };

  return (
    <motion.section
      ref={ref}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={sectionFadeInUp}
      className="relative min-h-[650px]  sm:h-[calc(100vh-100px)] w-full overflow-hidden text-white"
    >
      {isMobile ? (
        <>
          <Image
            src="/images/corporate/heroM.webp"
            alt="Hero Banner"
            fill
            className="object-cover absolute inset-0 z-0"
            priority
          />

          {/* Text Overlay for Mobile */}
          <div className="absolute bottom-16 left-0 right-0 z-10 flex flex-col items-center text-center px-4">
            <motion.div
              variants={{
                hidden: { opacity: 0, y: 30 },
                visible: {
                  opacity: 1,
                  y: 0,
                  transition: { duration: 0.8, delay: 0.5 },
                },
              }}
              className="text-center"
              style={{ color: "#b99e85" }}
            >
              <h1 className="text-3xl font- mb-2 font-serif">
                Premium
              </h1>
              <h2 className="text-3xl font- mb-2 font-serif">
                Corporate Gifts
              </h2>
              <p className="text-3xl font- font-serif">
                for a Brighter Diwali
              </p>
            </motion.div>
          </div>
        </>
      ) : (
        <Image
          src="/images/corporate/hero.webp"
          alt="Hero Banner"
          fill
          className="object-cover absolute inset-0 z-0"
          priority
        />
      )}
    </motion.section>
  );
};

export default Hero;
