"use client"; // Required for Framer Motion hooks

import dynamic from "next/dynamic";
import { useState } from "react";
import Hero from "./sections/hero/Hero";
import WhatsAppCTA from "@/components/ui/whatsapp-cta";
import GiftCategories from "./sections/giftcategories/GiftCategories";
import PopupQueryForm from "./components/PopupQueryForm";
import ContactDock from "./components/ContactDock";

const InstagramFeedsCorporate = dynamic(
  () => import("./sections/instagram-feeds/InstagramFeedsCorporate")
);
const GiftOcassion = dynamic(
  () => import("./sections/giftOcassion/GiftOcassion")
);
// const SeasonalGift = dynamic(
//   () => import("./sections/seasonalGift/SeasonalGift")
// );
const Services = dynamic(() => import("./sections/servicesPage/Services"));
const Form = dynamic(() => import("./sections/form/Form"));
const FAQ = dynamic(() => import("./sections/faq/FAQ"));

export default function Home() {
  const [isQueryOpen, setIsQueryOpen] = useState(false);
  return (
    <section className="overflow-hidden">
      {/* <Header /> */}
      <Hero />
      <GiftCategories />
      <GiftOcassion />
      {/* <SeasonalGift /> */}
      <InstagramFeedsCorporate />
      <Services />
      {/* <WhyCorporate /> */}
      <Form />
      <FAQ />
      <div className="hidden sm:hidden">
        <WhatsAppCTA
          phoneNumber="919220229789"
          message="Hello! I'm interested in your corporate gifting services. Can you help me?"
        />
      </div>

      {/* Floating contact dock */}
      <ContactDock
        onContactClick={() => setIsQueryOpen(true)}
        whatsappMessage="Hello! I'm interested in your corporate gifting services. Can you help me?"
      />

      {/* Popup query form modal */}
      <PopupQueryForm open={isQueryOpen} onOpenChange={setIsQueryOpen} />
    </section>
  );
}
