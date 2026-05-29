"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { Instagram } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel";
import { motion, Variants } from "framer-motion";
import { useRef } from "react";

interface InstagramPost {
  id: string;
  image: string;
  caption: string;
  likes: number;
  comments: number;
  timestamp: string;
  isVideo?: boolean;
  isSponsored?: boolean;
  hashtags: string[];
  permalink: string;
  media_type: string;
  username?: string;
  thumbnail_url?: string;
}

const instagramPosts: InstagramPost[] = [
  {
    id: "1",
    image: "/images/baby/boy/boy (1).jpeg",
    caption:
      "Beautiful baby boy in our latest collection! 👶✨ #BabyFashion #Kevasiya #CuteBaby",
    likes: 1247,
    comments: 89,
    timestamp: "2 hours ago",
    hashtags: ["#BabyFashion", "#Kevasiya", "#CuteBaby"],
    permalink: "",
    media_type: "IMAGE",
  },
  {
    id: "2",
    image: "/images/baby/girl/girl (1).jpeg",
    caption:
      "Adorable little princess in our premium collection 🌸 #BabyGirl #Fashion #Kevasiya",
    likes: 2156,
    comments: 156,
    timestamp: "5 hours ago",
    hashtags: ["#BabyGirl", "#Fashion", "#Kevasiya"],
    permalink: "",
    media_type: "IMAGE",
  },
  {
    id: "3",
    image: "/images/wedding/products/wedding (1).webp",
    caption:
      "Wedding season is here! Check out our exclusive wedding collection 💒 #Wedding #Bridal #Kevasiya",
    likes: 3421,
    comments: 234,
    timestamp: "1 day ago",
    hashtags: ["#Wedding", "#Bridal", "#Kevasiya"],
    permalink: "",
    media_type: "IMAGE",
  },
  {
    id: "4",
    image: "/images/baby/circus/circus (1).jpeg",
    caption:
      "Fun and colorful designs for your little ones! 🎪 #Circus #KidsFashion #Kevasiya",
    likes: 1892,
    comments: 98,
    timestamp: "2 days ago",
    hashtags: ["#Circus", "#KidsFashion", "#Kevasiya"],
    permalink: "",
    media_type: "IMAGE",
  },
  {
    id: "5",
    image: "/images/baby/boy/boy (10).jpeg",
    caption:
      "Stylish and comfortable - that's our promise! 👕 #Style #Comfort #Kevasiya",
    likes: 1678,
    comments: 112,
    timestamp: "3 days ago",
    hashtags: ["#Style", "#Comfort", "#Kevasiya"],
    permalink: "",
    media_type: "IMAGE",
  },
  {
    id: "6",
    image: "/images/baby/girl/girl (10).jpeg",
    caption:
      "Every little girl deserves to feel like a princess 👑 #Princess #Fashion #Kevasiya",
    likes: 2987,
    comments: 187,
    timestamp: "4 days ago",
    hashtags: ["#Princess", "#Fashion", "#Kevasiya"],
    permalink: "",
    media_type: "IMAGE",
  },
];

const API_URL = "/api/instagram-feed";

// Add this type for Instagram API response items
interface InstagramAPIResponseItem {
  id: string;
  caption?: string;
  media_url?: string;
  permalink?: string;
  media_type?: string;
  thumbnail_url?: string;
  timestamp?: string;
  username?: string;
  like_count?: number;
  comments_count?: number;
}

export default function InstagramFeeds() {
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const [count, setCount] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [posts, setPosts] = useState<InstagramPost[]>(instagramPosts); // fallback to static
  const videoRefs = useRef<Record<string, HTMLVideoElement | null>>({});

  // Fetch Instagram posts from backend
  useEffect(() => {
    fetch(API_URL)
      .then((res) => res.json())
      .then((data) => {
        if (data && data.data && Array.isArray(data.data)) {
          const mapped = data.data.map((item: InstagramAPIResponseItem) => ({
            id: item.id,
            image: item.media_url || item.thumbnail_url || "",
            caption: item.caption || "",
            likes: item.like_count ?? 0,
            comments: item.comments_count ?? 0,
            timestamp: item.timestamp,
            hashtags: (item.caption || "").match(/#[A-Za-z0-9_]+/g) || [],
            permalink: item.permalink || "",
            media_type: item.media_type || "IMAGE",
            username: item.username,
            thumbnail_url: item.thumbnail_url || item.media_url, // fallback to media_url for videos
          }));
          setPosts(mapped);
        }
      })
      .catch(() => {
        // fallback to static
      });
  }, []);

  // Auto-slide functionality
  useEffect(() => {
    if (!api || !isAutoPlaying) return;

    const interval = setInterval(() => {
      api.scrollNext();
    }, 4000);

    return () => clearInterval(interval);
  }, [api, isAutoPlaying]);

  // Track carousel state
  useEffect(() => {
    if (!api) return;

    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap());

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap());
    });
  }, [api]);

  // IntersectionObserver for video play/pause
  useEffect(() => {
    const refs = videoRefs.current;
    const observer = new window.IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const video = entry.target as HTMLVideoElement;
          if (entry.isIntersecting) {
            video.play();
          } else {
            video.pause();
            video.currentTime = 0;
          }
        });
      },
      { threshold: 0.5 }
    );
    Object.values(refs).forEach((video) => {
      if (video) observer.observe(video);
    });
    return () => {
      Object.values(refs).forEach((video) => {
        if (video) observer.unobserve(video);
      });
    };
  }, [posts]);

  // Handle dot click
  const scrollTo = useCallback(
    (index: number) => {
      api?.scrollTo(index);
    },
    [api]
  );

  // Pause auto-play on hover
  const handleMouseEnter = () => {
    setIsAutoPlaying(false);
  };

  const handleMouseLeave = () => {
    setIsAutoPlaying(true);
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

  return (
    <section className="py-12 sm:py-16 px-4 bg-gradient-to-br from-[#F9F6F0] to-white">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <motion.div className="text-center mb-8">
          <motion.div
            variants={itemVariants}
            className="flex items-center justify-center gap-3 mb-4"
          >
            <Instagram className="hidden sm:block min-w-8 min-h-8 text-[#E4405F]" />
            <h2 className="text-4xl md:text-5xl font-bold font-serif text-[#3a5a40]">
              Explore Our Instagram
            </h2>
          </motion.div>
          <motion.p
            variants={itemVariants}
            className="text-lg text-[#5a6d5c] max-w-3xl mx-auto"
          >
            Stay updated with our latest collections, behind-the-scenes, and
            customer stories
          </motion.p>
        </motion.div>

        {/* Animated Divider */}
        <motion.div className="flex justify-center mb-8 sm:mb-16">
          <div className="h-1 w-32 bg-gradient-to-r from-transparent via-[#E4405F] to-transparent rounded-full"></div>
        </motion.div>

        {/* Carousel Container */}
        <div
          className="relative"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <Carousel
            setApi={setApi}
            opts={{
              align: "start",
              loop: true,
            }}
            className="w-full carousel-container justify-center items-center"
          >
            <CarouselContent className="carousel-content -ml-2 md:-ml-4">
              {posts.map((post) => (
                <CarouselItem
                  key={post.id}
                  className="carousel-item pl-2 md:pl-4 basis-full sm:basis-1/2 lg:basis-1/3 xl:basis-1/4"
                >
                  <a
                    href={post.permalink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block h-full"
                  >
                    <Card
                      className={`carousel-card group cursor-pointer transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 overflow-hidden h-[450px] sm:h-[400px] py-0 ${
                        hoveredCard === post.id
                          ? "ring-2 ring-[#E4405F] shadow-2xl"
                          : ""
                      }`}
                      onMouseEnter={() => setHoveredCard(post.id)}
                      onMouseLeave={() => setHoveredCard(null)}
                    >
                      <CardContent className="p-0 py-0 h-full relative">
                        {/* Background Image or Video */}
                        <div className="absolute inset-0">
                          {post.media_type === "IMAGE" ? (
                            <Image
                              src={post.image}
                              alt="Instagram post"
                              fill
                              className="object-cover transition-transform duration-700 group-hover:scale-110 h-full"
                              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                            />
                          ) : post.media_type === "VIDEO" ||
                            post.media_type === "REEL" ? (
                            <div className="relative w-full h-full">
                              <video
                                ref={(el) => {
                                  videoRefs.current[post.id] = el;
                                }}
                                src={post.image}
                                controls={false}
                                muted
                                loop
                                playsInline
                                className="object-cover w-full h-full absolute inset-0"
                                poster={
                                  post.thumbnail_url || post.image || undefined
                                }
                                preload="none"
                              />
                              {/* Play button overlay */}
                              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                <svg
                                  width="60"
                                  height="60"
                                  viewBox="0 0 60 60"
                                  fill="none"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <circle
                                    cx="30"
                                    cy="30"
                                    r="30"
                                    fill="rgba(0,0,0,0.4)"
                                  />
                                  <polygon
                                    points="25,20 45,30 25,40"
                                    fill="#fff"
                                  />
                                </svg>
                              </div>
                            </div>
                          ) : null}
                          {/* Gradient Overlay */}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20" />
                        </div>

                        {/* Top Section - Instagram Icon and Timestamp */}
                        <div className="absolute top-4 left-4 right-4 flex justify-between items-start z-10">
                          <div className="flex items-center gap-2">
                            <div className="bg-white/90 backdrop-blur-sm rounded-full p-2 shadow-lg">
                              <Instagram className="w-4 h-4 text-[#E4405F]" />
                            </div>
                            <Badge className="bg-white/90 text-gray-700 text-xs backdrop-blur-sm shadow-lg">
                              @{post.username || "kevasiya.in"}
                            </Badge>
                          </div>

                          {/*
                        <Badge className="bg-black/70 text-white text-xs backdrop-blur-sm shadow-lg">
                          {post.timestamp
                            ? new Date(post.timestamp).toLocaleString(
                                undefined,
                                {
                                  year: "numeric",
                                  month: "short",
                                  day: "numeric",
                                }
                              )
                            : ""}
                        </Badge>
                        */}
                        </div>

                        {/* Bottom Section - Content with slide-up animation */}
                        <div className="absolute bottom-0 left-0 right-0 z-10">
                          {/* Always visible engagement section */}
                          {/*
                        <div
                          className={`engagement-section p-4 pb-2 transition-all duration-500 ease-out ${
                            hoveredCard === post.id
                              ? "transform -translate-y-[200px]"
                              : "transform -translate-y-2"
                          }`}
                        >
                          <div className="bg-white/90 backdrop-blur-md rounded-t-lg p-3 shadow-xl border border-white/20">
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center gap-4">
                                <div className="flex items-center gap-1">
                                  <Heart className="w-4 h-4 text-[#E4405F]" />
                                  <span className="text-sm font-semibold text-gray-700">
                                    {post.likes}
                                  </span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <MessageCircle className="w-4 h-4 text-blue-500" />
                                  <span className="text-sm font-semibold text-gray-700">
                                    {post.comments}
                                  </span>
                                </div>
                              </div>
                              <Share2 className="w-4 h-4 text-gray-600" />
                            </div>
                          </div>
                        </div>
                        */}

                          {/* Expandable content section - now visible only on hover */}
                          <div
                            className={`transition-all duration-500 hidden ease-out absolute bottom-0 left-0 right-0 ${
                              hoveredCard === post.id
                                ? "transform-none opacity-100"
                                : "transform translate-y-full opacity-0"
                            }`}
                          >
                            <div className="p-4 pt-0">
                              <div className="bg-white/90 backdrop-blur-md rounded-lg p-4 shadow-xl border border-white/20">
                                {/* Caption */}
                                <div className="mb-3">
                                  <p className="text-sm text-gray-800 line-clamp-3">
                                    {post.caption}
                                  </p>
                                </div>

                                {/* Hashtags */}
                                {/*
                                <div className="mb-4">
                                  <div className="flex flex-wrap gap-1">
                                    {post.hashtags
                                      .slice(0, 3)
                                      .map((hashtag, index) => (
                                        <Badge
                                          key={index}
                                          variant="outline"
                                          className="text-xs border-[#E4405F]/50 text-[#E4405F] bg-[#E4405F]/10"
                                        >
                                          {hashtag}
                                        </Badge>
                                      ))}
                                  </div>
                                </div>
                                */}

                                {/* CTA Button */}
                                <div className="transition-all duration-300">
                                  <Button
                                    className="w-full font-semibold shadow-lg backdrop-blur-sm border border-white/20 transition-all duration-300 hover:scale-105"
                                    size="sm"
                                    style={{
                                      backgroundColor: "#E4405F",
                                      color: "white",
                                    }}
                                    onClick={(e) => {
                                      e.preventDefault();
                                      window.open(post.permalink, "_blank");
                                    }}
                                  >
                                    View on Instagram
                                  </Button>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </a>
                </CarouselItem>
              ))}
            </CarouselContent>

            {/* Navigation */}
            <CarouselPrevious className="hidden md:flex -left-12 bg-white/90 backdrop-blur-sm shadow-xl border-2 hover:bg-white transition-all duration-300" />
            <CarouselNext className="hidden md:flex -right-12 bg-white/90 backdrop-blur-sm shadow-xl border-2 hover:bg-white transition-all duration-300" />
          </Carousel>

          {/* Animated Dots Indicator */}
          <div className="flex justify-center mt-6 gap-2">
            {Array.from({ length: count }).map((_, index) => (
              <button
                key={index}
                onClick={() => scrollTo(index)}
                className={`transition-all duration-300 rounded-full ${
                  index === current
                    ? "w-8 h-3 bg-[#E4405F]"
                    : "w-3 h-3 bg-gray-300 hover:bg-gray-400"
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>

        {/* Follow Us CTA */}
        <div className="text-center mt-8">
          <Button
            variant="outline"
            size="lg"
            className="border-2 border-[#E4405F] text-[#E4405F] hover:bg-[#E4405F] hover:text-white bg-white/90 backdrop-blur-sm shadow-lg transition-all duration-300 hover:scale-105"
            onClick={() =>
              window.open("https://www.instagram.com/kevasiya.in/", "_blank")
            }
          >
            Follow @kevasiya.in <Instagram className="ml-2 w-4 h-4" />
          </Button>
        </div>
      </div>
    </section>
  );
}
