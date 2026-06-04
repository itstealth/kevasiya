import Home from "./pages/Home";
import { getApiUrl } from "@/lib/utils";
import { TrendingProduct } from "./pages/Home/b2b-cards";

interface ApiProduct {
  id: number;
  slug: string;
  name: string;
  description: string | null;
  category_name: string;
  image: string;
  tags: string[] | null;
  sales: string | null;
  price: string;
  rating?: number;
}

async function getFeaturedProducts(): Promise<TrendingProduct[]> {
  try {
    const apiUrl = getApiUrl();
    const res = await fetch(`${apiUrl}/products?isFeatured=true`, {
      next: { revalidate: 3600 }, // Revalidate every hour
    });

    if (!res.ok) {
      console.error("Failed to fetch featured products, using fallback data.");
      return [];
    }
    const data = await res.json();

    if (data && Array.isArray(data) && data.length > 0) {
      const mappedProducts = data.map((p: ApiProduct): TrendingProduct => {
        let badgeType: "hot" | "top-seller" | "bulk-favorite" = "hot";
        const badgeText = p.tags?.[0] || "Featured";

        if (
          badgeText.toLowerCase().includes("best seller") ||
          badgeText.toLowerCase().includes("top seller")
        ) {
          badgeType = "top-seller";
        } else if (badgeText.toLowerCase().includes("hot")) {
          badgeType = "hot";
        } else if (badgeText.toLowerCase().includes("bulk")) {
          badgeType = "bulk-favorite";
        }

        const salesParts = p.sales?.split(" ") || [];
        const orders = salesParts[0] || "N/A";
        const timeframe = salesParts.slice(2).join(" ") || "recently";

        return {
          id: p.id.toString(),
          slug: p.slug,
          title: p.name,
          description:
            p.description || `A fine selection for ${p.category_name}.`,
          image: p.image,
          badge: {
            text: badgeText,
            type: badgeType,
          },
          stats: {
            orders: orders,
            rating: p.rating || 4.8,
            timeframe: timeframe,
          },
          price: p.price || "Price on Request",
          companyExample: "Corporate Choice",
          imageBrightness: "dark",
          primaryColor: Math.random() > 0.5 ? "#AE8F65" : "#4A674F",
        };
      });
      return mappedProducts;
    }
    return [];
  } catch (error) {
    console.error(
      "Error fetching featured products, using fallback data:",
      error
    );
    return [];
  }
}

const localBusinessSchema = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  name: "Kevasiya",
  image: "https://kevasiya.com/logo.png",
  url: "https://kevasiya.com",
  telephone: "+91-9310010810",
  email: "info@kevasiya.com",
  priceRange: "₹₹₹",
  description:
    "Premium luxury gift hampers for weddings, corporate events, festivals and baby occasions in Delhi NCR. Custom hampers crafted with care for every special occasion.",
  address: {
    "@type": "PostalAddress",
    streetAddress: "52 North Avenue Road, West Punjabi Bagh",
    addressLocality: "New Delhi",
    addressRegion: "Delhi",
    postalCode: "110026",
    addressCountry: "IN",
  },
  geo: {
    "@type": "GeoCoordinates",
    latitude: 28.672801,
    longitude: 77.126091,
  },
  areaServed: [
    { "@type": "City", name: "New Delhi" },
    { "@type": "City", name: "Gurgaon" },
    { "@type": "City", name: "Noida" },
    { "@type": "City", name: "Faridabad" },
    { "@type": "City", name: "Ghaziabad" },
  ],
  openingHoursSpecification: [
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
      opens: "10:00",
      closes: "19:00",
    },
  ],
  hasMap: "https://maps.app.goo.gl/KvrAG625XLWk3eCC9",
  sameAs: [
    "https://www.instagram.com/kevasiya",
  ],
};

export default async function Page() {
  const trendingProducts = await getFeaturedProducts();
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
      />
      <Home trendingProducts={trendingProducts} />
    </>
  );
}
