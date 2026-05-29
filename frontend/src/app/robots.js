import { headers } from "next/headers";

export default async function robots() {
  const headersList = await headers();
  const domain = headersList.get("host") || "kevasiya.com";
  const protocol = process.env.NODE_ENV === "production" ? "https" : "http";
  const baseUrl = `${protocol}://${domain}`;

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/admin",
          "/api",
          "/_next",
          "/static",
          "/private",
          "/temp",
          "/uploads/admin",
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
