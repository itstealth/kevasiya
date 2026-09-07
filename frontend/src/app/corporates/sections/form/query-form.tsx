"use client";

import ContactCTA from "@/components/ui/contact-cta";

/**
 * Corporate gifting contact card.
 *
 * This was a seven-field enquiry form. The site no longer collects enquiries
 * through a form - every lead arrives over WhatsApp or the phone - so the
 * panel keeps its heading and slot in the layout and offers those two instead.
 */
export default function QueryForm() {
  return (
    <div
      className="w-full p-4 sm:p-8 rounded-[2px] shadow-lg"
      style={{ backgroundColor: "#f8e8d8" }}
    >
      <h2
        className="text-lg font-medium sm:text-3xl sm:mb-6 mb-3 text-center font-serif"
        style={{ color: "#3a5a40" }}
      >
        Get Your Customized <br /> Corporate Gifting Solution
      </h2>
      <h2
        className="text-xs sm:text-lg mb-4 sm:mb-6 text-center font-serif"
        style={{ color: "#3a5a40" }}
      >
        Talk to us on WhatsApp or give us a call
      </h2>

      <ContactCTA
        whatsappMessage="Hello! I'd like a customized corporate gifting solution for my company."
        className="justify-center"
      />

      <p
        className="text-xs sm:text-sm mt-4 sm:mt-6 text-center font-serif"
        style={{ color: "#3a5a40" }}
      >
        Share your occasion, quantity and budget and our team will put a
        proposal together for you.
      </p>
    </div>
  );
}
