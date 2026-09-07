"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import ContactCTA from "@/components/ui/contact-cta";
import { Heart, Mail, Gift, Users } from "lucide-react";

export function CTASection() {
  return (
    <section className="py-20 px-4 bg-gradient-to-r from-[#3A5A40] to-[#334d38]">
      <div className="max-w-4xl mx-auto text-center">
        <div className="mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Make Every Celebration Unforgettable
          </h2>
          <p className="text-xl text-[#e3e7e3] leading-relaxed">
            Join our community to get exclusive offers, gift ideas, and updates
            on our latest festival collections. Let&apos;s make every occasion
            special together.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="text-left">
            <h3 className="text-2xl font-bold text-white mb-6">
              Get the Best Festive Offers
            </h3>
            <div className="space-y-4">
              <div className="flex items-center text-[#e3e7e3]">
                <Mail className="w-5 h-5 mr-3" />
                <span>Get weekly updates on new arrivals</span>
              </div>
              <div className="flex items-center text-[#e3e7e3]">
                <Gift className="w-5 h-5 mr-3" />
                <span>Exclusive access to our festival collections</span>
              </div>
              <div className="flex items-center text-[#e3e7e3]">
                <Users className="w-5 h-5 mr-3" />
                <span>Invitations to special sale events</span>
              </div>
              <div className="flex items-center text-[#e3e7e3]">
                <Heart className="w-5 h-5 mr-3" />
                <span>Share the joy with our community</span>
              </div>
            </div>
          </div>

          <Card
            className="bg-white/95 backdrop-blur-sm border-0 shadow-2xl"
            id="book"
          >
            <CardHeader>
              <CardTitle className="text-2xl text-[#3A5A40] text-center">
                Talk to Us
              </CardTitle>
              <CardDescription className="text-center text-[#AE8F65]">
                Reach us on WhatsApp or give us a call and we will help you plan your festival gifting.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ContactCTA
                whatsappMessage="Hello! I'd like to know more about your festival gifting collection."
                className="justify-center"
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
