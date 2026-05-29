"use client";

import dynamic from "next/dynamic";
import Hero from "./hero";
import WhatsAppCTA from "@/components/ui/whatsapp-cta";
import { TrendingProduct } from "./b2b-cards";
import ContactDock from "../../corporates/components/ContactDock";
import PopupQueryForm from "../../corporates/components/PopupQueryForm";
import { useState } from "react";

const CardSection = dynamic(() => import("./card-section"));
const ClientsSlider = dynamic(() =>
  import("./clientslider").then((mod) => mod.ClientsSlider)
);
const SpecialOccasions = dynamic(() => import("./special-occasions"));
const WhyKevasiya = dynamic(() => import("./why-kevasiya"));
const TrendingCarousel = dynamic(() => import("./b2b-cards"));
// const OurProcessStepper = dynamic(() => import("./how-we-work"));
const InstagramFeeds = dynamic(() => import("./InstagramFeeds"));

const icons = [
  { src: "/images/home/logos/logo (1).png", alt: "logo 1" },
  { src: "/images/home/logos/logo (2).png", alt: "logo 2" },
  { src: "/images/home/logos/logo (3).png", alt: "logo 3" },
  { src: "/images/home/logos/logo (4).png", alt: "logo 4" },
  { src: "/images/home/logos/logo (5).png", alt: "logo 5" },
  { src: "/images/home/logos/logo (6).png", alt: "logo 6" },
  { src: "/images/home/logos/logo (7).png", alt: "logo 7" },
  { src: "/images/home/logos/logo (8).png", alt: "logo 8" },
  { src: "/images/home/logos/logo (9).png", alt: "logo 9" },
  { src: "/images/home/logos/logo (10).png", alt: "logo 10" },
];

export default function Home({
  trendingProducts,
}: {
  trendingProducts?: TrendingProduct[];
}) {
  const [isQueryOpen, setIsQueryOpen] = useState(false);
  return (
    <div>
      <Hero />
      <CardSection />
      <TrendingCarousel initialProducts={trendingProducts} />
      <ClientsSlider icons={icons} />
      {/* <OurProcessStepper /> */}

      {/* kevasiya instagram feeds*/}
      <InstagramFeeds />
      <SpecialOccasions />
      <WhyKevasiya />

      <div className="hidden sm:hidden">  
      <WhatsAppCTA
          phoneNumber="919220229789"
          message="Hello! I'm interested in your services. Can you help me?"
        />
      </div>

      {/* Mobile Contact Dock */}
      <ContactDock
        onContactClick={() => setIsQueryOpen(true)}
        whatsappMessage="Hello! I'm interested in your services. Can you help me?"
      />
      <PopupQueryForm open={isQueryOpen} onOpenChange={setIsQueryOpen} />
    </div>
  );
}
