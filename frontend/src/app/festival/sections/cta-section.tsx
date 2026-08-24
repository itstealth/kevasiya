"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Heart,
  Mail,
  Gift,
  Users,
  AlertCircle,
  CheckCircle,
} from "lucide-react";
import { getApiUrl, extractUTMParams } from "@/lib/utils";

interface FormData {
  name: string;
  email: string;
  phone: string;
  occasion: string;
  numGifts: string;
  budget: string;
  message: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  phone?: string;
  message?: string;
  occasion?: string;
  numGifts?: string;
  budget?: string;
}

interface UTMData {
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_term?: string;
  utm_content?: string;
}

export function CTASection() {
  const router = useRouter();
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    phone: "",
    occasion: "",
    numGifts: "",
    budget: "",
    message: "",
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [utmData, setUtmData] = useState<UTMData>({});

  // Extract UTM parameters on component mount
  useEffect(() => {
    setUtmData(extractUTMParams());
  }, []);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    // Name validation
    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    } else if (formData.name.trim().length < 2) {
      newErrors.name = "Name must be at least 2 characters";
    } else if (!/^[a-zA-Z\s]+$/.test(formData.name)) {
      newErrors.name = "Name can only contain letters";
    }

    // Email validation
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    // Phone validation - Only validate if provided
    if (
      formData.phone &&
      !/^[6-9]\d{9}$/.test(formData.phone.replace(/[\s\-]/g, ""))
    ) {
      newErrors.phone =
        "Please enter a valid 10-digit phone number starting with 6-9";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear error when user starts typing
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const apiUrl = getApiUrl();
      const response = await fetch(`${apiUrl}/contact-submissions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          firstName: formData.name.split(" ")[0] || formData.name,
          lastName: formData.name.split(" ").slice(1).join(" ") || "",
          email: formData.email,
          phone: formData.phone,
          occasion: formData.occasion || null,
          numGifts: formData.numGifts ? Number(formData.numGifts) : null,
          budget: formData.budget || null,
          message: formData.message,
          productDetails: "Festival Collection Inquiry",
          source: "Festival Page",
          // Add UTM parameters
          utm_source: utmData.utm_source || null,
          utm_medium: utmData.utm_medium || null,
          utm_campaign: utmData.utm_campaign || null,
          utm_term: utmData.utm_term || null,
          utm_content: utmData.utm_content || null,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Submission failed:", errorData);
        alert(`Error: ${errorData.error || "Failed to Submit."}`);
        setIsSubmitting(false);
        return;
      }

      setIsSubmitting(false);
      setIsSubmitted(true);

      // Redirect to thank you page after short delay
      setTimeout(() => {
        router.push("/thank-you");
      }, 1500);
    } catch (error) {
      console.error("An error occurred:", error);
      alert("An unexpected error occurred. Please try again.");
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <section className="py-20 px-4 bg-gradient-to-r from-[#3A5A40] to-[#334d38]">
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-white/95 backdrop-blur-sm rounded-lg shadow-2xl p-12">
            <div className="w-20 h-20 bg-[#3A5A40]/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-10 h-10 text-[#3A5A40]" />
            </div>
            <h2 className="text-3xl font-bold text-[#3A5A40] mb-4">
              Message Sent Successfully!
            </h2>
            <p className="text-gray-600 text-lg">
              Thank you for your interest in our festival collections.
              We&apos;ll get back to you within 24 hours.
            </p>
          </div>
        </div>
      </section>
    );
  }

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
                Get in Touch
              </CardTitle>
              <CardDescription className="text-center text-[#AE8F65]">
                We&apos;d love to help you find the perfect gift
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Input
                    type="text"
                    name="name"
                    placeholder="Your Name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className={`border-[#e8dcc8] focus:border-[#3A5A40] focus:ring-[#3A5A40] ${
                      errors.name ? "border-red-500 focus:border-red-500" : ""
                    }`}
                    required
                  />
                  {errors.name && (
                    <div className="flex items-center gap-2 text-red-600 text-sm mt-1">
                      <AlertCircle className="w-4 h-4" />
                      {errors.name}
                    </div>
                  )}
                </div>
                <div>
                  <Input
                    type="email"
                    name="email"
                    placeholder="Your Email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className={`border-[#e8dcc8] focus:border-[#3A5A40] focus:ring-[#3A5A40] ${
                      errors.email ? "border-red-500 focus:border-red-500" : ""
                    }`}
                  />
                  {errors.email && (
                    <div className="flex items-center gap-2 text-red-600 text-sm mt-1">
                      <AlertCircle className="w-4 h-4" />
                      {errors.email}
                    </div>
                  )}
                </div>
                <div>
                  <Input
                    type="tel"
                    name="phone"
                    placeholder="Your Phone (Optional)"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className={`border-[#e8dcc8] focus:border-[#3A5A40] focus:ring-[#3A5A40] ${
                      errors.phone ? "border-red-500 focus:border-red-500" : ""
                    }`}
                  />
                  {errors.phone && (
                    <div className="flex items-center gap-2 text-red-600 text-sm mt-1">
                      <AlertCircle className="w-4 h-4" />
                      {errors.phone}
                    </div>
                  )}
                </div>

                <div>
                  <Input
                    type="text"
                    name="occasion"
                    placeholder="Occasion"
                    value={formData.occasion}
                    onChange={handleInputChange}
                    className={`border-[#e8dcc8] focus:border-[#3A5A40] focus:ring-[#3A5A40] ${
                      errors.occasion
                        ? "border-red-500 focus:border-red-500"
                        : ""
                    }`}
                  />
                  {errors.occasion && (
                    <div className="flex items-center gap-2 text-red-600 text-sm mt-1">
                      <AlertCircle className="w-4 h-4" />
                      {errors.occasion}
                    </div>
                  )}
                </div>

                <div>
                  <Input
                    type="number"
                    min={1}
                    name="numGifts"
                    placeholder="No. of Hampers/Gifts"
                    value={formData.numGifts}
                    onChange={handleInputChange}
                    className={`border-[#e8dcc8] focus:border-[#3A5A40] focus:ring-[#3A5A40] ${
                      errors.numGifts
                        ? "border-red-500 focus:border-red-500"
                        : ""
                    }`}
                  />
                  {errors.numGifts && (
                    <div className="flex items-center gap-2 text-red-600 text-sm mt-1">
                      <AlertCircle className="w-4 h-4" />
                      {errors.numGifts}
                    </div>
                  )}
                </div>

                <div>
                  <Input
                    type="text"
                    name="budget"
                    placeholder="Any Budget"
                    value={formData.budget}
                    onChange={handleInputChange}
                    className={`border-[#e8dcc8] focus:border-[#3A5A40] focus:ring-[#3A5A40] ${
                      errors.budget ? "border-red-500 focus:border-red-500" : ""
                    }`}
                  />
                  {errors.budget && (
                    <div className="flex items-center gap-2 text-red-600 text-sm mt-1">
                      <AlertCircle className="w-4 h-4" />
                      {errors.budget}
                    </div>
                  )}
                </div>
                <div>
                  <Textarea
                    name="message"
                    placeholder="Share your requirements or any special message..."
                    value={formData.message}
                    onChange={handleInputChange}
                    className="border-[#e8dcc8] focus:border-[#3A5A40] focus:ring-[#3A5A40] min-h-[100px]"
                    rows={4}
                  />
                </div>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-[#3A5A40] hover:bg-[#334d38] text-white py-3 rounded-full text-lg disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <div className="flex items-center gap-3">
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      Sending...
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <Heart className="w-5 h-5" />
                      Submit
                    </div>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
