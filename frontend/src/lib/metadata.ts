import { Metadata } from "next";
import metadataConfig from "./metadata.json";

export interface RouteMetadata {
  path: string;
  title: string;
  description: string;
  keywords: string;
  canonical: string;
  ogImage: string;
}

export interface DefaultMetadata {
  title: string;
  description: string;
  keywords: string;
  canonical: string;
  ogImage: string;
}

export function getMetadataForRoute(pathname: string): Metadata {
  // Find exact match first
  const routeData = metadataConfig.routes.find(
    (route) => route.path === pathname
  );

  // Get the metadata (either from route or default)
  const metadata = routeData || metadataConfig.default;

  // Use self-referencing canonical when no specific route metadata exists
  const selfCanonical = `${metadataConfig.siteUrl}${pathname}`;

  return {
    title: metadata.title,
    description: metadata.description,
    keywords: metadata.keywords,
    authors: [{ name: "Kevasiya" }],
    creator: "Kevasiya",
    publisher: "Kevasiya",
    formatDetection: {
      email: false,
      address: false,
      telephone: false,
    },
    metadataBase: new URL(metadataConfig.siteUrl),
    alternates: {
      canonical: routeData ? metadata.canonical : selfCanonical,
    },
    openGraph: {
      title: metadata.title,
      description: metadata.description,
      url: routeData ? (metadata.canonical || selfCanonical) : selfCanonical,
      siteName: "Kevasiya",
      images: [
        {
          url: metadata.ogImage || "/hero.webp",
          width: 1200,
          height: 630,
          alt: metadata.title,
        },
      ],
      locale: "en_US",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: metadata.title,
      description: metadata.description,
      images: [metadata.ogImage || "/hero.webp"],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
    verification: {
      google: "Z1D8DnIGB1qz3ZIhMCPEZxgZWqLmlKWIB0bHPBRNZZM",
    },
  };
}

export function generateStructuredData(pathname: string) {
  const routeData = metadataConfig.routes.find(
    (route) => route.path === pathname
  );
  const metadata = routeData || metadataConfig.default;

  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Kevasiya",
    url: metadataConfig.siteUrl,
    logo: `${metadataConfig.siteUrl}/logo.png`,
    description: metadata.description,
    contactPoint: {
      "@type": "ContactPoint",
      telephone: "+91-9310010810",
      contactType: "customer service",
    },
    sameAs: [
      // Add social media URLs here
    ],
  };
}
