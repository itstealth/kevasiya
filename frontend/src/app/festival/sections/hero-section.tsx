"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Heart, Gift, PartyPopper } from "lucide-react";
import Image from "next/image";
import { useState, useEffect, useLayoutEffect, useRef } from "react";

export function HeroSection() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const videoRef = useRef<HTMLVideoElement | null>(null);

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
    <section className="relative flex h-max items-center justify-center overflow-hidden pt-28 pb-20 sm:h-max sm:py-20">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0">
        {isMobile ? (
          <video
            ref={videoRef}
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            webkit-playsinline="true"
            className="absolute inset-0 z-0 h-full w-full object-cover"
          >
            <source src="/videos/video.mp4" type="video/mp4" />
          </video>
        ) : (
          <Image
            src="https://images.unsplash.com/photo-1635424785729-c022fc1a61bd?q=80&w=1228&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            alt="Festive background"
            fill
            className="object-cover"
            priority
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-r from-[#2b3f2f]/60 via-[#334d38]/40 to-[#3A5A40]/60"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent"></div>
      </div>

      {/* Floating Elements */}
      <div className="absolute top-20 left-10 w-20 h-20 bg-white/10 rounded-full blur-xl animate-pulse"></div>
      <div className="absolute bottom-32 right-16 w-32 h-32 bg-[#dcc8a8]/20 rounded-full blur-2xl animate-pulse delay-1000"></div>
      <div className="absolute top-1/3 right-1/4 w-16 h-16 bg-[#a3b2a5]/20 rounded-full blur-lg animate-pulse delay-500"></div>

      {/* Content */}
      <div className="relative z-10 text-center px-4 max-w-6xl mx-auto">
        <div className="space-y-4">
          {/* Badge */}
          <div className="flex justify-center">
            <Badge className="bg-white/20 backdrop-blur-md text-white border border-white/30 hover:bg-white/30 text-base sm:text-lg px-4 sm:px-8 py-2 sm:py-3 rounded-full shadow-2xl">
              <PartyPopper className="w-5 h-5 mr-3 text-yellow-300" />
              Celebrate the Moments that Matter
            </Badge>
          </div>

          {/* Main Heading */}
          <div className="space-y-5">
            <h1 className="sr-only">Gifts for Every Celebration</h1>
            <h2 className="text-5xl md:text-7xl lg:text-8xl font-bold text-white mb-6 leading-tight tracking-tight">
              Gifts for Every
              <span className="block bg-gradient-to-r from-[#f2ebe0] to-[#dcc8a8] bg-clip-text text-transparent">
                Celebration
              </span>
              <span className="block text-4xl md:text-5xl lg:text-6xl font-light text-[#f9f6f0]">
                Find the Perfect Present
              </span>
            </h2>

            <p className="text-xl md:text-2xl text-[#f9f6f0]/90 mb-12 leading-relaxed max-w-4xl mx-auto font-light">
              Discover a curated collection of gifts for every festival and
              occasion. Make your celebrations unforgettable with thoughtful and
              unique presents.
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <a href="#products">
              <Button
                size="lg"
                className="bg-white/20 backdrop-blur-md hover:bg-white/30 text-white border border-white/30 px-10 py-6 text-lg rounded-full shadow-2xl transition-all duration-300 hover:scale-105 hover:shadow-3xl"
              >
                <Gift className="w-6 h-6 mr-3" />
                Explore Festival Gifts
              </Button>
            </a>
            <a href="#book">
              <Button
                variant="outline"
                size="lg"
                className="bg-transparent border-2 border-white/50 text-white hover:bg-white hover:text-[#3A5A40] px-10 py-6 text-lg rounded-full backdrop-blur-md transition-all duration-300 hover:scale-105"
              >
                <Heart className="w-6 h-6 mr-3" />
                Customize a Gift
              </Button>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
