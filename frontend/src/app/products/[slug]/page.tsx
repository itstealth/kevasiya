"use client";

import { useState, useEffect } from "react";
import { notFound } from "next/navigation";
import ProductDetailsClient from "./product-details-client";
import { Product } from "@/types/product";
import { getApiUrl } from "@/lib/utils";
import WhatsAppCTA from "@/components/ui/whatsapp-cta";
import ContactDock from "@/app/corporates/components/ContactDock";
import PopupQueryForm from "@/app/corporates/components/PopupQueryForm";

interface ApiProduct {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  price: string;
  included_items: string[] | null;
  packaging: string | null;
  image: string;
  images: string[] | null;
  category_id: number;
  category_name: string;
  subcategory_id: number | null;
  subcategory_name: string | null;
}

const slugify = (text: string) =>
  text
    .toString()
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^\w\-]+/g, "")
    .replace(/\-\-+/g, "-")
    .replace(/^-+/, "")
    .replace(/-+$/, "");

export default function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const [product, setProduct] = useState<Product | null>(null);
  const [isQueryOpen, setIsQueryOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [notFoundPage, setNotFoundPage] = useState(false);

  useEffect(() => {
    async function fetchProduct() {
      try {
        const { slug } = await params;
        const res = await fetch(`${getApiUrl()}/products?slug=${slug}`);

        if (!res.ok) {
          console.error(`API Error: ${res.status} ${res.statusText}`);
          setNotFoundPage(true);
          setLoading(false);
          return;
        }

        const products: ApiProduct[] = await res.json();
        if (!products || products.length === 0) {
          setNotFoundPage(true);
          setLoading(false);
          return;
        }

        const p = products[0];
        const subcategory =
          p.subcategory_id && p.subcategory_name
            ? {
                id: p.subcategory_id,
                name: p.subcategory_name,
                slug: slugify(p.subcategory_name),
                category_id: p.category_id,
              }
            : null;

        const productData: Product = {
          id: p.id,
          name: p.name,
          slug: p.slug,
          description: p.description,
          price: p.price,
          included_items: p.included_items,
          packaging: p.packaging,
          image: p.image,
          images: p.images,
          thumbnail: p.image,
          category: {
            id: p.category_id,
            name: p.category_name,
            slug: slugify(p.category_name),
          },
          subcategory: subcategory,
        };

        setProduct(productData);
        setLoading(false);
      } catch (error) {
        console.error("Fetch Error:", error);
        setNotFoundPage(true);
        setLoading(false);
      }
    }

    fetchProduct();
  }, [params]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (notFoundPage || !product) {
    notFound();
  }

  return (
    <>
      <ProductDetailsClient product={product} />
      {/* Desktop WhatsApp CTA */}
      <div className="hidden sm:hidden">
        <WhatsAppCTA
          message={`Hello! I'm interested in your ${product.name} product. Can you help me?`}
        />
      </div>

      <ContactDock
        onContactClick={() => setIsQueryOpen(true)}
        whatsappMessage={`Hello! I'm interested in your ${product.name} product. Can you help me?`}
      />
      <PopupQueryForm open={isQueryOpen} onOpenChange={setIsQueryOpen} />
    </>
  );
}

// This function helps Next.js generate static pages at build time.
// By commenting it out, we make the pages dynamic, which fixes build-time data fetching issues.
// export async function generateStaticParams() {
//   try {
//     const res = await fetch(`${getApiUrl()}/products`);
//     if (!res.ok) return [];
//
//     const products: Product[] = await res.json();
//
//     return products.map((product) => ({
//       slug: product.slug,
//     }));
//   } catch (error) {
//     console.error("Could not generate static params for products:", error);
//     return [];
//   }
// }
