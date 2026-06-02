import { notFound } from "next/navigation";
import { Metadata } from "next";
import { getApiUrl } from "@/lib/utils";
import { Product } from "@/types/product";
import Breadcrumb from "@/components/ui/Breadcrumb";
import ProductPageClient from "./ProductPageClient";

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
  text.toString().toLowerCase()
    .replace(/\s+/g, "-").replace(/[^\w\-]+/g, "")
    .replace(/\-\-+/g, "-").replace(/^-+/, "").replace(/-+$/, "");

async function getProduct(slug: string): Promise<Product | null> {
  try {
    const res = await fetch(`${getApiUrl()}/products?slug=${slug}`, {
      next: { revalidate: 3600 },
    });
    if (!res.ok) return null;
    const products: ApiProduct[] = await res.json();
    if (!products || products.length === 0) return null;

    const p = products[0];
    return {
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
      category: { id: p.category_id, name: p.category_name, slug: slugify(p.category_name) },
      subcategory: p.subcategory_id && p.subcategory_name
        ? { id: p.subcategory_id, name: p.subcategory_name, slug: slugify(p.subcategory_name), category_id: p.category_id }
        : null,
    };
  } catch {
    return null;
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProduct(slug);
  if (!product) return {};

  const title = `${product.name} | Kevasiya`;
  const canonical = `https://kevasiya.com/products/${slug}`;

  return {
    title,
    description: product.description || `Shop ${product.name} – a premium gift hamper by Kevasiya.`,
    alternates: { canonical },
    openGraph: { title, url: canonical, siteName: "Kevasiya" },
  };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await getProduct(slug);
  if (!product) notFound();

  const breadcrumbItems = [
    { label: "Collections", href: "/collections" },
    { label: product.category.name, href: `/collections/${product.category.slug}` },
    ...(product.subcategory
      ? [{ label: product.subcategory.name, href: `/collections/${product.category.slug}/${product.subcategory.slug}` }]
      : []),
    { label: product.name },
  ];

  return (
    <>
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 sm:pt-32 pb-0 bg-gray-50">
        <Breadcrumb items={breadcrumbItems} />
      </div>
      <ProductPageClient product={product} />
    </>
  );
}
