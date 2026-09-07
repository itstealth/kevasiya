"use client";

import Image from "next/image";
import { FiPhone } from "react-icons/fi";

/**
 * Inline WhatsApp + phone call-to-action.
 *
 * This replaces the enquiry forms that used to sit on the marketing pages.
 * Every enquiry now arrives over WhatsApp or the phone, so these two buttons
 * are the only conversion path the site offers - they are deliberately
 * prominent rather than a footnote under a form.
 *
 * Not to be confused with WhatsAppCTA in ./whatsapp-cta, which is the fixed
 * floating bubble. This one sits in the page flow.
 */

export const KEVASIYA_PHONE = "919310010810";
export const KEVASIYA_PHONE_DISPLAY = "+91 93100 10810";

interface ContactCTAProps {
  /** E.164 without the leading +, for wa.me and tel: links. */
  phoneNumber?: string;
  /** Prefilled WhatsApp message, tailored per page. */
  whatsappMessage?: string;
  /** "light" for dark backgrounds, "dark" for light ones. */
  tone?: "light" | "dark";
  className?: string;
}

export default function ContactCTA({
  phoneNumber = KEVASIYA_PHONE,
  whatsappMessage = "Hello! I'm interested in your services. Can you help me?",
  tone = "dark",
  className = "",
}: ContactCTAProps) {
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(
    whatsappMessage,
  )}`;

  const callClasses =
    tone === "light"
      ? "border-white/40 text-white hover:bg-white hover:text-[#3A5A40]"
      : "border-[#3A5A40]/30 text-[#3A5A40] hover:bg-[#3A5A40] hover:text-white";

  return (
    <div
      className={`flex flex-col sm:flex-row items-stretch sm:items-center gap-4 ${className}`}
    >
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center justify-center gap-3 px-8 py-4 rounded-full bg-[#25D366] text-white font-semibold shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-[1.03]"
        aria-label="Chat with us on WhatsApp"
      >
        <Image
          src="/images/whatsapp.png"
          alt=""
          width={28}
          height={28}
          className="w-7 h-7"
        />
        <span>Chat on WhatsApp</span>
      </a>

      <a
        href={`tel:+${phoneNumber}`}
        className={`flex items-center justify-center gap-3 px-8 py-4 rounded-full border-2 font-semibold transition-all duration-300 hover:scale-[1.03] ${callClasses}`}
        aria-label={`Call us on ${KEVASIYA_PHONE_DISPLAY}`}
      >
        <FiPhone className="w-5 h-5" />
        <span>{KEVASIYA_PHONE_DISPLAY}</span>
      </a>
    </div>
  );
}
