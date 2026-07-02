import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ClientLayout from "../components/ClientLayout";
import { GoogleTagManager } from "@next/third-parties/google";
import { getMetadataForRoute, generateStructuredData } from "../lib/metadata";
import { headers } from "next/headers";
import Script from "next/script";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export async function generateMetadata() {
  const headersList = await headers();
  const pathname = headersList.get("x-pathname") || "/";

  return getMetadataForRoute(pathname);
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* Meta Tags for SEO */}
        <meta name="robots" content="index, follow" />
        <meta name="googlebot" content="index, follow" />
        <meta name="bingbot" content="index, follow" />

        {/* Favicons */}
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon1.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon2.png" />
        <link rel="shortcut icon" href="/favicon1.png" />
        <link rel="apple-touch-icon" href="/favicon1.png" />

        {/* Google Site Verification */}
        <meta
          name="google-site-verification"
          content="Z1D8DnIGB1qz3ZIhMCPEZxgZWqLmlKWIB0bHPBRNZZM"
        />
        <meta
          name="google-site-verification"
          content="TtjV-2UwCCDQXzXLCTn2whLJBDUQ2_kK6dD9nqO3B0I"
        />

        {/* Structured Data */}
        <Script
          id="structured-data"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(generateStructuredData("/")),
          }}
        />

        {/* Google Tag Manager */}
        {process.env.NODE_ENV === "production" && (
          <GoogleTagManager gtmId="GTM-K7QBFHLL" />
        )}
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        suppressHydrationWarning={true}
      >
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
