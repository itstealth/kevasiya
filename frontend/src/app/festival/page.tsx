"use client";

import { useState, useEffect } from "react";
import { HeroSection } from "./sections/hero-section";
import { BestChoicesSection } from "./sections/best-choices-section";
import { ProductListSection } from "./sections/product-list-section";
import { TestimonialsSection } from "./sections/testimonials-section";
import { CTASection } from "./sections/cta-section";
import { getApiUrl } from "@/lib/utils";
import WhatsAppCTA from "@/components/ui/whatsapp-cta";
import ContactDock from "../corporates/components/ContactDock";
import PopupQueryForm from "../corporates/components/PopupQueryForm";

// --- Data Types ---
interface Subcategory {
  id: number;
  name: string;
  slug: string;
  description: string;
  image: string;
}

interface Category {
  id: number;
  name: string;
  slug: string;
  description: string;
}

interface Product {
  id: number;
  name: string;
  slug: string;
  image: string;
  price: number | string;
  subcategory_name?: string; // from API
  subcategoryName?: string; // for component
  rating?: number;
}

export default function FestivalPage() {
  const [category, setCategory] = useState<Category | null>(null);
  const [subcategories, setSubcategories] = useState<Subcategory[]>([]);
  const [randomProducts, setRandomProducts] = useState<Product[]>([]);
  const [isQueryOpen, setIsQueryOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function getFestivalPageData() {
      const apiUrl = getApiUrl();
      const categorySlug = "festival";

      try {
        // 1. Fetch the parent category
        const catRes = await fetch(`${apiUrl}/categories?slug=${categorySlug}`);
        if (!catRes.ok) throw new Error("Failed to fetch category");
        const categories: Category[] = await catRes.json();
        const categoryData = categories[0];
        if (!categoryData)
          return { category: null, subcategories: [], randomProducts: [] };

        // 2. Fetch all subcategories for the parent
        const subCatRes = await fetch(
          `${apiUrl}/subcategories?category_id=${categoryData.id}`
        );
        if (!subCatRes.ok) throw new Error("Failed to fetch subcategories");
        const subcategoriesData: Subcategory[] = await subCatRes.json();

        // 3. Fetch all products for the parent category in one go
        const prodRes = await fetch(
          `${apiUrl}/products?category_id=${categoryData.id}`
        );
        if (!prodRes.ok) throw new Error("Failed to fetch products");
        const products: Product[] = await prodRes.json();

        // 4. Process the products: augment, shuffle, and slice
        const processedProducts = products
          .map((p) => ({
            ...p,
            subcategoryName: p.subcategory_name, // Map snake_case to camelCase
            rating: Math.floor(Math.random() * 2) + 4, // Random rating: 4 or 5
          }))
          .sort(() => Math.random() - 0.5); // Shuffle for randomness

        const randomProductsData = processedProducts.slice(0, 12); // Take max 12

        return {
          category: categoryData,
          subcategories: subcategoriesData,
          randomProducts: randomProductsData,
        };
      } catch (error) {
        console.error("Error fetching festival page data:", error);
        // Return empty state to prevent page crash
        return { category: null, subcategories: [], randomProducts: [] };
      }
    }

    getFestivalPageData().then((data) => {
      setCategory(data.category);
      setSubcategories(data.subcategories);
      setRandomProducts(data.randomProducts);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-cream-50 to-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-cream-50 to-white">
      <HeroSection />
      <ProductListSection products={randomProducts} />
      <BestChoicesSection subcategories={subcategories} category={category} />
      <TestimonialsSection />
      <CTASection />

      {/* Desktop WhatsApp CTA */}
      <div className="hidden sm:hidden">
        <WhatsAppCTA message="Hello! I'm interested in your festival hampers and seasonal gifts. Can you help me?" />
      </div>

      {/* Mobile Contact Dock */}
      <ContactDock
        onContactClick={() => setIsQueryOpen(true)}
        whatsappMessage="Hello! I'm interested in your festival hampers and seasonal gifts. Can you help me?"
      />

      {/* Popup query form modal */}
      <PopupQueryForm open={isQueryOpen} onOpenChange={setIsQueryOpen} />
    </div>
  );
}
