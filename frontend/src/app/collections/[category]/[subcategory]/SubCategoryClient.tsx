"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getApiUrl } from "@/lib/utils";
import WhatsAppCTA from "@/components/ui/whatsapp-cta";
import ContactDock from "@/app/corporates/components/ContactDock";
import PopupQueryForm from "@/app/corporates/components/PopupQueryForm";

interface Product {
  id: number;
  name: string;
  slug: string;
  image: string;
  price: number | string;
}

interface Subcategory {
  id: number;
  name: string;
  slug: string;
  category_id: number;
}

interface Category {
  id: number;
  name: string;
  slug: string;
}

interface Props {
  categorySlug: string;
  subcategorySlug: string;
}

export default function SubCategoryClient({ categorySlug, subcategorySlug }: Props) {
  const [subcategory, setSubcategory] = useState<Subcategory | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [isQueryOpen, setIsQueryOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [notFoundPage, setNotFoundPage] = useState(false);

  useEffect(() => {
    async function fetchData() {
      try {
        const apiUrl = getApiUrl();
        const catRes = await fetch(`${apiUrl}/categories?slug=${categorySlug}`);
        if (!catRes.ok) { setNotFoundPage(true); setLoading(false); return; }
        const categories: Category[] = await catRes.json();
        const parentCategory = categories[0];
        if (!parentCategory) { setNotFoundPage(true); setLoading(false); return; }

        const subCatRes = await fetch(`${apiUrl}/subcategories?category_id=${parentCategory.id}`);
        if (!subCatRes.ok) { setNotFoundPage(true); setLoading(false); return; }
        const subcategories: Subcategory[] = await subCatRes.json();
        const foundSubcategory = subcategories.find((sc) => sc.slug === subcategorySlug);
        if (!foundSubcategory) { setNotFoundPage(true); setLoading(false); return; }

        setSubcategory(foundSubcategory);

        const prodRes = await fetch(`${apiUrl}/products?subcategory_id=${foundSubcategory.id}`);
        if (prodRes.ok) setProducts(await prodRes.json());

        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setNotFoundPage(true);
        setLoading(false);
      }
    }
    fetchData();
  }, [categorySlug, subcategorySlug]);

  if (loading) {
    return (
      <div className="bg-white min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (notFoundPage || !subcategory) notFound();

  const subcategoryName = subcategory.name;

  return (
    <div className="bg-white">
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-32">
        <div className="text-center mt-10">
          <h1 className="text-4xl font-serif text-[#B38463] sm:text-5xl">
            {subcategoryName}
          </h1>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-600">
            Discover our curated selection for {subcategoryName.toLowerCase()}.
          </p>
        </div>

        <div className="mt-16 grid grid-cols-1 gap-y-12 sm:grid-cols-2 sm:gap-x-6 lg:grid-cols-3 lg:gap-x-8">
          {products.map((product) => (
            <Link key={product.id} href={`/products/${product.slug}`} className="group block">
              <div className="relative h-[450px] w-full overflow-hidden rounded-lg shadow-lg group-hover:shadow-2xl transition-shadow duration-300">
                <Image
                  src={product.image || "/images/placeholder.svg"}
                  alt={product.name}
                  width={500}
                  height={500}
                  loading="lazy"
                  className="h-full w-full object-cover object-center transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-x-0 bottom-0 h-36 bg-gradient-to-t from-black to-transparent opacity-80" />
                <div className="absolute inset-x-0 bottom-0 p-6">
                  <h3 className="text-2xl font-serif text-white">{product.name}</h3>
                  <p className="mt-2 text-sm font-medium text-gray-300">
                    {typeof product.price === "number" ? `₹${product.price}` : product.price}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {products.length === 0 && (
          <div className="text-center mt-16">
            <p className="text-lg text-gray-600">There are no products in this collection yet.</p>
            <Link
              href={`/collections/${categorySlug}`}
              className="mt-4 inline-block text-lg font-medium text-gray-900 hover:text-gray-700"
            >
              &larr; Back to all {categorySlug.replace(/-/g, " ")}
            </Link>
          </div>
        )}
      </div>

      <div className="hidden sm:hidden">
        <WhatsAppCTA message={`Hello! I'm interested in your ${subcategoryName} collection. Can you help me?`} />
      </div>

      <ContactDock
        onContactClick={() => setIsQueryOpen(true)}
        whatsappMessage={`Hello! I'm interested in your ${subcategoryName} collection. Can you help me?`}
      />
      <PopupQueryForm open={isQueryOpen} onOpenChange={setIsQueryOpen} />
    </div>
  );
}
