"use client";

import { NumberTicker } from "@/components/magicui/number-ticker";
import { Suspense } from "react";

import { MapPin, Phone, Mail, Clock, Users, Award, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import WhatsAppCTA from "@/components/ui/whatsapp-cta";
import ContactDock from "../corporates/components/ContactDock";
import Breadcrumb from "@/components/ui/Breadcrumb";
import ContactCTA from "@/components/ui/contact-cta";

function ContactContent() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#3A5A40]/5 via-white to-[#AE8F65]/5">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-r from-[#3A5A40] via-[#3A5A40]/95 to-[#3A5A40]/90">
        <div className='absolute inset-0 bg-[url(&apos;data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fillRule="evenodd"%3E%3Cg fill="%23AE8F65" fillOpacity="0.1"%3E%3Ccircle cx="30" cy="30" r="2"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E&apos;)] opacity-30'></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
          <div className="text-center space-y-8">
            <div className="space-y-4">
              <Badge className="bg-[#AE8F65]/20 text-[#AE8F65] border-[#AE8F65]/30 px-4 py-2 text-sm font-medium">
                Get In Touch
              </Badge>
              <h1 className="text-5xl md:text-7xl font-bold text-white leading-tight">
                Contact
                <span className="block text-[#AE8F65]">Our Team</span>
              </h1>
            </div>
            <p className="text-xl md:text-2xl text-white/80 max-w-3xl mx-auto leading-relaxed">
              Ready to find the perfect gift? Let&apos;s discuss your gifting
              needs and create something extraordinary together.
            </p>

            {/* Stats Section */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto pt-12">
              <div className="text-center">
                <div className="w-16 h-16 bg-[#AE8F65]/20 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Users className="w-8 h-8 text-[#AE8F65]" />
                </div>
                <div className="text-3xl font-bold text-white">
                  <NumberTicker
                    value={50}
                    className="text-3xl font-bold text-white"
                  />
                  +
                </div>
                <div className="text-white/70 text-sm">Happy Clients</div>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-[#AE8F65]/20 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Award className="w-8 h-8 text-[#AE8F65]" />
                </div>
                <div className="text-3xl font-bold text-white">
                  <NumberTicker
                    value={500}
                    className="text-3xl font-bold text-white"
                  />
                  +
                </div>
                <div className="text-white/70 text-sm">Products Catalog</div>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-[#AE8F65]/20 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Shield className="w-8 h-8 text-[#AE8F65]" />
                </div>
                <div className="text-3xl font-bold text-white">
                  <NumberTicker
                    value={10}
                    className="text-3xl font-bold text-white"
                  />
                  +
                </div>
                <div className="text-white/70 text-sm">Years Experience</div>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-[#AE8F65]/20 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Clock className="w-8 h-8 text-[#AE8F65]" />
                </div>
                <div className="text-3xl font-bold text-white">
                  <NumberTicker
                    value={24}
                    className="text-3xl font-bold text-white"
                  />
                  h
                </div>
                <div className="text-white/70 text-sm">Response Time</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-0">
        <Breadcrumb items={[{ label: "Contact" }]} />
      </div>

      {/* Main Content Section */}
      <section className="py-20 lg:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-3 gap-12 lg:gap-16">
            {/* Contact details - Takes 2 columns */}
            <div className="lg:col-span-2 space-y-8">
              <div className="text-center lg:text-left">
                <h2 className="text-4xl lg:text-5xl font-bold text-[#3A5A40] mb-4">
                  Let&apos;s Start a Conversation
                </h2>
                <p className="text-xl text-gray-600 max-w-2xl">
                  Message us on WhatsApp or give us a call and our team will
                  help you put together the right gifting for your occasion.
                </p>
              </div>

              <Card className="shadow-2xl border-0 bg-white overflow-hidden pt-0">
                <CardContent className="p-8 lg:p-12 space-y-8">
                  <ContactCTA
                    whatsappMessage="Hello! I would like to talk about gifting with Kevasiya."
                    className="justify-center lg:justify-start"
                  />
                  <p className="text-gray-600">
                    Tell us the occasion, roughly how many gifts you need and
                    your budget, and we will come back to you with options.
                    We reply to WhatsApp messages within a couple of hours
                    during business hours.
                  </p>
                </CardContent>
              </Card>
            </div>
            {/* Contact Info Sidebar - Takes 1 column */}
            <div className="space-y-8">
              {/* Contact Information Card */}
              <Card className="shadow-2xl border-0 bg-white overflow-hidden py-0">
                <CardHeader className="bg-gradient-to-r from-[#AE8F65]/10 to-[#AE8F65]/5 p-6">
                  <CardTitle className="text-2xl text-[#3A5A40]">
                    Contact Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-8 space-y-8">
                  <div className="space-y-6">
                    <div className="flex items-start gap-4">
                      <div className="w-14 h-14 bg-[#3A5A40]/10 rounded-full flex items-center justify-center flex-shrink-0">
                        <Mail className="w-7 h-7 text-[#3A5A40]" />
                      </div>
                      <div className="space-y-1">
                        <h4 className="font-semibold text-[#3A5A40] text-lg">
                          Email Address
                        </h4>
                        <a
                          href="mailto:rishabh@kevasiya.in"
                          className="text-gray-600 cursor-pointer"
                        >
                          rishabh@kevasiya.in
                        </a>
                        <p className="text-sm text-gray-500">
                          We respond within 2 hours
                        </p>
                      </div>
                    </div>

                    <Separator className="bg-gray-100" />

                    <div className="flex items-start gap-4">
                      <div className="w-14 h-14 bg-[#3A5A40]/10 rounded-full flex items-center justify-center flex-shrink-0">
                        <Phone className="w-7 h-7 text-[#3A5A40]" />
                      </div>
                      <div className="space-y-1">
                        <h4 className="font-semibold text-[#3A5A40] text-lg">
                          Phone Number
                        </h4>
                        <a
                          href="tel:+919310010810"
                          className="text-gray-600 cursor-pointer"
                        >
                          +91 9310010810
                        </a>
                        <p className="text-sm text-gray-500">
                          Available 9 AM - 6 PM IST
                        </p>
                      </div>
                    </div>

                    <Separator className="bg-gray-100" />

                    <div className="flex items-start gap-4">
                      <div className="w-14 h-14 bg-[#3A5A40]/10 rounded-full flex items-center justify-center flex-shrink-0">
                        <MapPin className="w-7 h-7 text-[#3A5A40]" />
                      </div>
                      <div className="space-y-1">
                        <h4 className="font-semibold text-[#3A5A40] text-lg">
                          Office Address
                        </h4>
                        <div className="text-gray-600 space-y-1">
                          <p>52 North Avenue Road</p>
                          <p>West Punjabi Bagh</p>
                          <p>New Delhi 110026, India</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Business Hours Card */}
              <Card className="shadow-2xl pb-0 border-0 bg-gradient-to-br from-[#3A5A40] to-[#3A5A40]/90 text-white overflow-hidden ">
                <CardHeader className="p-">
                  <CardTitle className="text-2xl text-white flex items-center gap-3">
                    <Clock className="w-6 h-6" />
                    Business Hours
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-8 pt-0">
                  <div className="space-y-4">
                    <div className="flex justify-between items-center py-2">
                      <span className="text-white/80">Monday - Friday</span>
                      <Badge className="bg-[#AE8F65] text-white border-0">
                        9:00 AM - 6:00 PM
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center py-2">
                      <span className="text-white/80">Saturday</span>
                      <Badge className="bg-[#AE8F65]/80 text-white border-0">
                        10:00 AM - 4:00 PM
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center py-2">
                      <span className="text-white/80">Sunday</span>
                      <Badge
                        variant="secondary"
                        className="bg-white/20 text-white border-0"
                      >
                        Closed
                      </Badge>
                    </div>
                  </div>
                  {/* <Separator className="bg-white/20 my-6" />
                  <div className="text-center">
                    <p className="text-white/80 text-sm">
                      Need urgent assistance?
                    </p>
                    <p className="text-[#AE8F65] font-semibold">
                      Call us for emergency support
                    </p>
                  </div> */}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="py-20 bg-gradient-to-r from-[#3A5A40]/5 to-[#AE8F65]/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h3 className="text-4xl font-bold text-[#3A5A40] mb-4">
              Find Our Office
            </h3>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Visit us at our office in New Delhi or schedule a virtual meeting
            </p>
          </div>

          <Card className="shadow-2xl border-0 overflow-hidden py-0">
            <CardContent className="p-0">
              <div className="h-[480px]">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3500.562977189838!2d77.12609107529067!3d28.672801375642848!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390d031290a1aa77%3A0x444d63f308de1f5b!2sKevasiya!5e0!3m2!1sen!2sin!4v1750769709987!5m2!1sen!2sin"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Kevasiya office location"
                  className="w-full h-full"
                ></iframe>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Social Media & CTA Section */}
      <section className="bg-gradient-to-r from-[#3A5A40] via-[#3A5A40]/95 to-[#3A5A40]/90 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-12">
            <div className="space-y-6">
              <h3 className="text-4xl lg:text-5xl font-bold">Stay Connected</h3>
              <p className="text-xl text-white/80 max-w-3xl mx-auto">
                Follow us on social media for the latest updates, Gift
                showcases, and industry insights
              </p>
            </div>

            <div className="flex flex-col sm:flex-row justify-center gap-6">
              <Button
                size="lg"
                variant="outline"
                className="bg-white/10 border-[#AE8F65]/50 text-white hover:bg-[#AE8F65]/20 hover:border-[#AE8F65] transition-all duration-300 px-8 py-4 text-lg hover:cursor-pointer"
                onClick={() =>
                  window.open("https://www.facebook.com/kevasiya", "_blank")
                }
              >
                Facebook
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="bg-white/10 border-[#AE8F65]/50 text-white hover:bg-[#AE8F65]/20 hover:border-[#AE8F65] transition-all duration-300 px-8 py-4 text-lg hover:cursor-pointer"
                onClick={() =>
                  window.open(
                    "https://www.instagram.com/kevasiya.in/",
                    "_blank"
                  )
                }
              >
                Instagram
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default function ContactPage() {

  return (
    <>
      <Suspense fallback={<div>Loading...</div>}>
        <ContactContent />
      </Suspense>

      {/* Desktop WhatsApp CTA */}
      <div className="hidden sm:hidden">
        <WhatsAppCTA message="Hello! I need help with your services. Can you assist me?" />
      </div>

      {/* Mobile Contact Dock */}
      <ContactDock
        whatsappMessage="Hello! I need help with your services. Can you assist me?"
      />

    </>
  );
}
