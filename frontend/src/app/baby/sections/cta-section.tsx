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
            Join Our Journey of Love and Wonder
          </h2>
          <p className="text-xl text-[#e3e7e3] leading-relaxed">
            Be part of our story as we prepare to welcome our little miracle.
            Share in our excitement, get updates on our journey, and help us
            celebrate this incredible chapter.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="text-left">
            <h3 className="text-2xl font-bold text-white mb-6">
              Stay Connected With Us
            </h3>
            <div className="space-y-4">
              <div className="flex items-center text-[#e3e7e3]">
                <Mail className="w-5 h-5 mr-3" />
                <span>Get weekly updates on our baby journey</span>
              </div>
              <div className="flex items-center text-[#e3e7e3]">
                <Gift className="w-5 h-5 mr-3" />
                <span>Exclusive access to our registry updates</span>
              </div>
              <div className="flex items-center text-[#e3e7e3]">
                <Users className="w-5 h-5 mr-3" />
                <span>Invitations to special celebrations</span>
              </div>
              <div className="flex items-center text-[#e3e7e3]">
                <Heart className="w-5 h-5 mr-3" />
                <span>Share in our precious moments</span>
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
                Reach us on WhatsApp or give us a call and we will help you choose the perfect baby gift.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ContactCTA
                whatsappMessage="Hello! I'd like to know more about your baby gifting collection."
                className="justify-center"
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
