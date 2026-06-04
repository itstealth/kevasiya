"use client";

import Image from "next/image";

interface WhatsAppCTAProps {
  phoneNumber?: string;
  message?: string;
  className?: string;
}

export default function WhatsAppCTA({
  phoneNumber = "919310010810",
  message = "Hello! I'm interested in your services. Can you help me?",
  className = "",
}: WhatsAppCTAProps) {
  const encodedMessage = encodeURIComponent(message);
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className={`fixed bottom-0 right-0 sm:right-6 sm:bottom-2 z-50  p-3 drop-shadow-lg animate-bounce transition-all duration-300 hover:scale-110 ${className}`}
      aria-label="Contact us on WhatsApp"
    >
      <Image
        src="/images/whatsapp.png"
        alt="WhatsApp"
        width={48}
        height={48}
        className="w-16 h-16"
      />
    </a>
  );
}
