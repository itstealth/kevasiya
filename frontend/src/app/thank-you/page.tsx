"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle, ArrowRight, Home, Clock } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { sendGTMEvent } from "@next/third-parties/google";

export default function ThankYouPage() {
  const [countdown, setCountdown] = useState(10);
  const router = useRouter();

  useEffect(() => {
    // GTM Event for successful form submission (via dataLayer)
    try {
      sendGTMEvent({
        event: "form_submission_success",
        event_category: "engagement",
        event_label: "contact_form",
        value: 1,
      });
    } catch {
      // no-op if GTM isn't initialized
    }

    // Start countdown
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          router.push("/");
          return 0;
        }
        return prev - 1;
      });
    }, 100000);

    return () => clearInterval(timer);
  }, [router]);

  const handleGoHome = () => {
    router.push("/");
  };

  return (
    <div className="h-max  bg-gradient-to-tr bg-[#3A5A40]/80 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl mt-30 mx-auto">
        <Card className="shadow-2xl border-0 bg-white overflow-hidden py-0">
          <CardContent className="p-12 text-center space-y-8">
            {/* Logo */}
            <div className="flex justify-center sm:mb-8">
              <Image
                src="/logo.png"
                alt="Kevasiya Logo"
                width={150}
                height={60}
                className="h-12 w-auto"
                priority
              />
            </div>

            {/* Success Icon */}
            <div className="w-24 h-24 bg-gradient-to-br from-[#3A5A40] to-[#3A5A40]/80 rounded-full flex items-center justify-center mx-auto shadow-lg animate-pulse">
              <CheckCircle className="w-12 h-12 text-white" />
            </div>

            {/* Main Content */}
            <div className="space-y-6">
              <h1 className="text-4xl md:text-5xl font-bold text-[#3A5A40] leading-tight">
                Thank You!
              </h1>

              <div className="space-y-4">
                <h2 className="text-2xl font-semibold text-gray-800">
                  Your Message Has Been Sent Successfully
                </h2>
                <p className="text-lg text-gray-600 max-w-lg mx-auto leading-relaxed">
                  We appreciate you reaching out to us. Our team will review
                  your inquiry and get back to you within 24 hours.
                </p>
              </div>

              {/* What's Next Section */}
              <div className="bg-gradient-to-r from-[#AE8F65]/10 to-[#3A5A40]/10 rounded-lg p-6 mx-auto max-w-md">
                <h3 className="text-lg font-semibold text-[#3A5A40] mb-3">
                  What&apos;s Next?
                </h3>
                <ul className="text-sm text-gray-600 space-y-2 text-left">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-[#3A5A40] mt-0.5 flex-shrink-0" />
                    Our team will review your requirements
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-[#3A5A40] mt-0.5 flex-shrink-0" />
                    We&apos;ll prepare personalized recommendations
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-[#3A5A40] mt-0.5 flex-shrink-0" />
                    You&apos;ll receive a detailed proposal
                  </li>
                </ul>
              </div>
            </div>

            {/* Contact Information */}
            <div className="border-t border-gray-100 pt-6">
              <p className="text-sm text-gray-500 mb-2">
                Need immediate assistance?
              </p>
              <div className="flex flex-col sm:flex-row justify-center items-center gap-4 text-sm">
                <a
                  href="tel:+919310010810"
                  className="text-[#3A5A40] hover:text-[#3A5A40]/80 font-medium transition-colors"
                >
                  📞 +91 9310010810
                </a>
                <span className="hidden sm:block text-gray-300">|</span>
                <a
                  href="mailto:rishabh@kevasiya.in"
                  className="text-[#3A5A40] hover:text-[#3A5A40]/80 font-medium transition-colors"
                >
                  ✉️ rishabh@kevasiya.in
                </a>
              </div>
            </div>

            {/* Countdown and Actions */}
            <div className="space-y-6 border-t border-gray-100 pt-8">
              <div className=" items-center justify-center gap-2 text-gray-500 hidden">
                <Clock className="w-4 h-4" />
                <span className="text-sm">
                  Redirecting to home page in{" "}
                  <span className="font-semibold text-[#3A5A40]">
                    {countdown}
                  </span>{" "}
                  seconds
                </span>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  onClick={handleGoHome}
                  className="bg-gradient-to-r from-[#3A5A40] to-[#3A5A40]/90 hover:from-[#3A5A40]/90 hover:to-[#3A5A40]/80 text-white font-semibold text-lg h-12 px-8 transition-all duration-300 transform hover:scale-[1.02] shadow-lg"
                >
                  <Home className="w-5 h-5 mr-2" />
                  Go to Home
                </Button>

                <Button
                  variant="outline"
                  onClick={() => router.push("/collections")}
                  className="border-[#3A5A40] text-[#3A5A40] hover:bg-[#3A5A40] hover:text-white font-semibold text-lg h-12 px-8 transition-all duration-300"
                >
                  Explore Products
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </div>
            </div>

            {/* Decorative Elements */}
            <div className="absolute inset-0 -z-10 overflow-hidden">
              <div className="absolute top-10 left-10 w-20 h-20 bg-[#AE8F65]/10 rounded-full blur-xl"></div>
              <div className="absolute bottom-10 right-10 w-32 h-32 bg-[#3A5A40]/10 rounded-full blur-xl"></div>
              <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-[#AE8F65]/5 rounded-full blur-lg"></div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
