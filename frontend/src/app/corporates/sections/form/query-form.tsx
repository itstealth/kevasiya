"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
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

export default function QueryForm() {
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
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    // Phone validation
    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required";
    } else if (!/^[6-9]\d{9}$/.test(formData.phone.replace(/[\s\-]/g, ""))) {
      newErrors.phone =
        "Please enter a valid 10-digit phone number starting with 6-9";
    }

    // Message validation
    if (!formData.message.trim()) {
      newErrors.message = "Message is required";
    } else if (formData.message.trim().length < 1) {
      newErrors.message = "Message must be at least 1 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (
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
          source: "Corporate Page",
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
      <div
        className="w-full p-8 rounded-[2px] shadow-lg"
        style={{ backgroundColor: "#f8e8d8" }}
      >
        <div className="text-center space-y-6">
          <div className="w-20 h-20 bg-[#3a5a40]/10 rounded-full flex items-center justify-center mx-auto">
            <svg
              className="w-10 h-10 text-[#3a5a40]"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <div className="space-y-3">
            <h2 className="text-3xl font-bold text-[#3a5a40]">
              Message Sent Successfully!
            </h2>
            <p className="text-gray-600 text-lg">
              Thank you for your corporate gifting inquiry. We&apos;ll get back
              to you within 24 hours.
            </p>
          </div>
        </div>
      </div>
    );
  }

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
        Fill Out The Form Below!
      </h2>

      <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
        <div>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Name"
            required
            className={`w-full px-2 sm:px-3 py-1.5 sm:py-2 border bg-white border-gray-300 focus:outline-none focus:ring-1 text-sm sm:text-base ${
              errors.name
                ? "border-red-500 focus:ring-red-500"
                : "focus:ring-green-800"
            }`}
          />
          {errors.name && (
            <div className="text-red-600 text-xs sm:text-sm mt-1">
              {errors.name}
            </div>
          )}
        </div>

        <div>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Official Email"
            required
            className={`w-full px-2 sm:px-3 py-1.5 sm:py-2 border bg-white border-gray-300 focus:outline-none focus:ring-1 text-sm sm:text-base ${
              errors.email
                ? "border-red-500 focus:ring-red-500"
                : "focus:ring-green-800"
            }`}
          />
          {errors.email && (
            <div className="text-red-600 text-xs sm:text-sm mt-1">
              {errors.email}
            </div>
          )}
        </div>

        <div>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="Phone No"
            required
            className={`w-full px-2 sm:px-3 py-1.5 sm:py-2 border bg-white border-gray-300 focus:outline-none focus:ring-1 text-sm sm:text-base ${
              errors.phone
                ? "border-red-500 focus:ring-red-500"
                : "focus:ring-green-800"
            }`}
          />
          {errors.phone && (
            <div className="text-red-600 text-xs sm:text-sm mt-1">
              {errors.phone}
            </div>
          )}
        </div>

        <div>
          <input
            type="text"
            name="occasion"
            value={formData.occasion}
            onChange={handleChange}
            placeholder="Occasion"
            required
            className={`w-full px-2 sm:px-3 py-1.5 sm:py-2 border bg-white border-gray-300 focus:outline-none focus:ring-1 text-sm sm:text-base ${
              errors.occasion
                ? "border-red-500 focus:ring-red-500"
                : "focus:ring-green-800"
            }`}
          />
          {errors.occasion && (
            <div className="text-red-600 text-xs sm:text-sm mt-1">
              {errors.occasion}
            </div>
          )}
        </div>

        <div>
          <input
            type="number"
            min={1}
            name="numGifts"
            value={formData.numGifts}
            onChange={handleChange}
            placeholder="No. of Hampers/Gifts"
            required
            className={`w-full px-2 sm:px-3 py-1.5 sm:py-2 border bg-white border-gray-300 focus:outline-none focus:ring-1 text-sm sm:text-base ${
              errors.numGifts
                ? "border-red-500 focus:ring-red-500"
                : "focus:ring-green-800"
            }`}
          />
          {errors.numGifts && (
            <div className="text-red-600 text-xs sm:text-sm mt-1">
              {errors.numGifts}
            </div>
          )}
        </div>

        <div>
          <input
            type="text"
            name="budget"
            value={formData.budget}
            onChange={handleChange}
            placeholder="Any Budget"
            required
            className={`w-full px-2 sm:px-3 py-1.5 sm:py-2 border bg-white border-gray-300 focus:outline-none focus:ring-1 text-sm sm:text-base ${
              errors.budget
                ? "border-red-500 focus:ring-red-500"
                : "focus:ring-green-800"
            }`}
          />
          {errors.budget && (
            <div className="text-red-600 text-xs sm:text-sm mt-1">
              {errors.budget}
            </div>
          )}
        </div>

        <div>
          <textarea
            name="message"
            value={formData.message}
            onChange={handleChange}
            placeholder="Additional Information..."
            required
            rows={3}
            className={`w-full px-2 sm:px-3 py-1.5 sm:py-2 border bg-white border-gray-300 focus:outline-none focus:ring-1 text-sm sm:text-base ${
              errors.message
                ? "border-red-500 focus:ring-red-500"
                : "focus:ring-green-800"
            }`}
          />
          {errors.message && (
            <div className="text-red-600 text-xs sm:text-sm mt-1">
              {errors.message}
            </div>
          )}
        </div>

        <div className="flex justify-center pt-2">
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-4 sm:px-6 py-2 text-white font-medium rounded-md transition-colors disabled:opacity-50 text-sm sm:text-base"
            style={{ backgroundColor: "#3a5a40" }}
          >
            {isSubmitting ? (
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 sm:w-4 sm:h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                Sending...
              </div>
            ) : (
              "Submit"
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
