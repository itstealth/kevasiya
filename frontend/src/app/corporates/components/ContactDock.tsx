"use client";

import React from "react";
import Image from "next/image";
import { FiPhone } from "react-icons/fi";

/**
 * Floating contact dock.
 *
 * The dock used to lead with an "Enquiry" button that opened PopupQueryForm.
 * The site no longer takes enquiries through a form, so the button and the
 * popup are gone and the dock is WhatsApp + phone only.
 *
 * The phone button stays mobile-only (sm:hidden) as before - tapping a tel:
 * link is only useful on a device that can place the call. The number is
 * still reachable on desktop from the footer and the contact page.
 */

interface ContactDockProps {
  phoneNumber?: string; // E.164 without + for WhatsApp link convenience
  whatsappMessage?: string; // Custom WhatsApp message for each page
}

const ContactDock: React.FC<ContactDockProps> = ({
  phoneNumber = "919310010810",
  whatsappMessage = "Hello! I'm interested in your services. Can you help me?",
}) => {
  return (
    <div className="fixed bottom-6 left-0 right-0 z-50  flex justify-center pointer-events-none w-screen">
      <div className="pointer-events-auto flex items-center sm:justify-end gap-3 bg-white/95 backdrop-blur rounded-full shadow-xl border border-[#3A5834F5]/20 px-3 py-2 sm:bg-transparent sm:border-none sm:shadow-none sm:px-0 sm:py-0 sm:gap-0 sm:w-[95%] sm:backdrop-blur-none flex-row">
        <a
          href={`tel:+${phoneNumber}`}
          className="flex items-center gap-2 px-4 py-2 rounded-full text-white font-medium bg-[#3A5834F5] hover:opacity-95 transition sm:hidden"
          aria-label="Call"
        >
          <FiPhone className="text-white" />
          <span>Call</span>
        </a>

        <a
          href={`https://wa.me/${phoneNumber}?text=${encodeURIComponent(
            whatsappMessage
          )}`}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="WhatsApp"
        >
          <Image
            src="/images/whatsapp.png"
            alt="WhatsApp"
            width={50}
            height={50}
            className="w-10 h-10 sm:w-12 sm:h-12"
          />
        </a>
      </div>
    </div>
  );
};

export default ContactDock;
