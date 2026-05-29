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

export default async function Page() {
  const trendingProducts = await getFeaturedProducts();
  return <Home trendingProducts={trendingProducts} />;
}
