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
    <section className="py-10 sm:py-20 px-4 bg-gradient-to-r from-[#3A5A40] to-[#334d38]">
      <div className="max-w-4xl mx-auto text-center">
        <div className="mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Celebrate Their Forever
          </h2>
          <p className="text-xl text-[#e3e7e3] leading-relaxed">
            Be part of their love story. Get updates on the celebration, find
            registry details, and share in the joy of their new beginning.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="text-left hidden sm:block">
            <h3 className="text-2xl font-bold text-white mb-6">
              Stay Connected to the Celebration
            </h3>
            <div className="space-y-4">
              <div className="flex items-center text-[#e3e7e3]">
                <Mail className="w-5 h-5 mr-3" />
                <span>Get updates on wedding events</span>
              </div>
              <div className="flex items-center text-[#e3e7e3]">
                <Gift className="w-5 h-5 mr-3" />
                <span>Registry news & gift ideas</span>
              </div>
              <div className="flex items-center text-[#e3e7e3]">
                <Users className="w-5 h-5 mr-3" />
                <span>Information on pre-wedding parties</span>
              </div>
              <div className="flex items-center text-[#e3e7e3]">
                <Heart className="w-5 h-5 mr-3" />
                <span>Share well wishes with the couple</span>
              </div>
            </div>
          </div>

          <Card
            className="bg-white/95 backdrop-blur-sm border-0 shadow-2xl "
            id="book"
          >
            <CardHeader>
              <CardTitle className="text-2xl text-[#3A5A40] text-center">
                Talk to Us
              </CardTitle>
              <CardDescription className="text-center text-[#AE8F65]">
                Reach us on WhatsApp or give us a call and we will help you plan the perfect wedding gifting.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ContactCTA
                whatsappMessage="Hello! I'd like to know more about your wedding gifting collection."
                className="justify-center"
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
