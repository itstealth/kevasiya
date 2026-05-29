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

interface Product {
  id: number;
  name: string;
  slug: string;
  image: string;
  price: number | string;
}

interface Category {
  id: number;
  name: string;
  slug: string;
}

export default function WeddingPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isQueryOpen, setIsQueryOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function getWeddingProducts() {
      const apiUrl = getApiUrl();
      const categorySlug = "wedding";

      try {
        const catRes = await fetch(`${apiUrl}/categories?slug=${categorySlug}`);
        if (!catRes.ok) throw new Error("Failed to fetch wedding category");
        const categories: Category[] = await catRes.json();
        const category = categories[0];
        if (!category) return [];

        const prodRes = await fetch(
          `${apiUrl}/products?category_id=${category.id}`
        );
        if (!prodRes.ok) throw new Error("Failed to fetch wedding products");

        const productsData: Product[] = await prodRes.json();
        return productsData;
      } catch (error) {
        console.error("Error fetching wedding products:", error);
        return [];
      }
    }

    getWeddingProducts().then((data) => {
      setProducts(data);
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
      <ProductListSection products={products} />
      <BestChoicesSection />
      <TestimonialsSection />
      <CTASection />

      {/* Desktop WhatsApp CTA */}
      <div className="hidden sm:hidden">
        <WhatsAppCTA message="Hello! I'm interested in your wedding gifts and collections. Can you help me plan something special?" />
      </div>

      {/* Mobile Contact Dock */}
      <ContactDock
        onContactClick={() => setIsQueryOpen(true)}
        whatsappMessage="Hello! I'm interested in your wedding gifts and collections. Can you help me plan something special?"
      />

      {/* Popup query form modal */}
      <PopupQueryForm open={isQueryOpen} onOpenChange={setIsQueryOpen} />
    </div>
  );
}
