import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const getApiUrl = () => {
  // If the code is running on the server, use the internal URL.
  // This is used for Server Components and API routes.
  if (typeof window === "undefined") {
    const internalApiUrl = process.env.INTERNAL_API_URL;
    if (!internalApiUrl) {
      console.warn(
        "INTERNAL_API_URL is not defined. Falling back to http://localhost:5001"
      );
    }
    // Server-side always uses the full base URL, and we append /api
    return `${internalApiUrl || "http://localhost:5001"}/api`;
  }

  // For client-side, in production, we want to use a relative path
  // so that requests are proxied by Next.js.
  if (process.env.NODE_ENV === "production") {
    return "/api";
  }

  // In development, we use the full URL from NEXT_PUBLIC_API_URL.
  const publicApiUrl = process.env.NEXT_PUBLIC_API_URL;
  if (!publicApiUrl) {
    console.warn(
      "NEXT_PUBLIC_API_URL is not defined in dev. Falling back to /api."
    );
    return "/api";
  }

  return `${publicApiUrl}/api`;
};

// Function to extract UTM parameters from URL
export const extractUTMParams = () => {
  if (typeof window === "undefined") return {};

  const urlParams = new URLSearchParams(window.location.search);
  const utmParams: Record<string, string> = {};

  // Extract UTM parameters
  const utmKeys = [
    "utm_source",
    "utm_medium",
    "utm_campaign",
    "utm_term",
    "utm_content",
  ];

  utmKeys.forEach((key) => {
    const value = urlParams.get(key);
    if (value) {
      utmParams[key] = value;
    }
  });

  return utmParams;
};
