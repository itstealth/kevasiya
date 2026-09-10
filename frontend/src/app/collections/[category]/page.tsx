import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getApiUrl } from "@/lib/utils";
import { getMetadataForRoute } from "@/lib/metadata";
import WhatsAppCTA from "@/components/ui/whatsapp-cta";
import Breadcrumb from "@/components/ui/Breadcrumb";
import Accordion from "@/components/ui/Accordion";

const CATEGORY_CONTENT_OVERLAY = {
  corporates: {
    name: "Corporate Gift Hampers",
    subtext: "Sophisticated, premium gifting solutions for clients, employees, and every corporate occasion, curated by Kevasiya, delivered across India.",
    description: "Kevasiya's corporate gift hampers are designed to make your brand unforgettable. Whether you're rewarding top performers, welcoming new hires, celebrating workanniversaries, or gifting valued clients each hamper is curated with premium products and presented in elegant, branded packaging. We handle bulk orders with ease and offer full personalisation including custom branding, logo printing, and tailored messaging. Trusted by businesses across Delhi NCR and India.",
    faqs: [
      {
        question: "Do you accept bulk corporate gifting orders?",
        answer: "Yes, we specialise in bulk orders for corporates. Reach out via the Enquiry form or WhatsApp for custom pricing."
      },
      {
        question: "Can the hampers be branded with our company logo?",
        answer: "Absolutely. We offer custom branding, logo printing on packaging, and personalised inserts."
      },
      {
        question: "What occasions do your corporate hampers cover?",
        answer: "We have curated collections for employee rewards, onboarding kits, work anniversaries, and special occasions."
      },
      {
        question: "Do you deliver corporate hampers pan-India?",
        answer: "Yes. We deliver across India with free shipping within Delhi NCR."
      }
    ]
  }
};

interface Product {
  id: number;
  name: string;
  slug: string;
  image: string;
  description: string;
}

interface Subcategory {
  id: number;
  name: string;
  slug: string;
  image?: string;
}

interface Category {
  id: number;
  name: string;
  slug: string;
  description: string;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string }>;
}): Promise<Metadata> {
  const { category } = await params;
  return getMetadataForRoute(`/collections/${category}`);
}

async function getCategoryPageData(categorySlug: string) {
  const apiUrl = getApiUrl();
  let category: Category | null = null;
  let subcategories: Subcategory[] = [];
  let products: Product[] = [];

  try {
    // 1. Fetch the category by slug
    const catRes = await fetch(`${apiUrl}/categories?slug=${categorySlug}`, {
      next: { revalidate: 60 },
    });
    if (!catRes.ok)
      throw new Error(`Failed to fetch category with slug: ${categorySlug}`);
    const categories: Category[] = await catRes.json();
    if (!categories[0]) {
      notFound();
    }
    category = categories[0];

    // 2. Fetch its subcategories
    const subCatRes = await fetch(
      `${apiUrl}/subcategories?category_id=${category.id}`,
      {
        next: { revalidate: 60 },
      }
    );
    if (!subCatRes.ok)
      throw new Error(
        `Failed to fetch subcategories for category ID: ${category.id}`
      );
    subcategories = await subCatRes.json();

    // 3. If NO subcategories exist, fetch products for this category directly
    if (subcategories.length === 0) {
      const prodRes = await fetch(
        `${apiUrl}/products?category_id=${category.id}`,
        {
          next: { revalidate: 60 },
        }
      );
      if (!prodRes.ok)
        throw new Error(
          "Failed to fetch products for category"
        );
      products = await prodRes.json();
    }
  } catch (error) {
    console.error("Error fetching category page data:", error);
    // If anything fails, especially finding the category, treat as not found
    notFound();
  }

  return { category, subcategories, products };
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category: categorySlug } = await params;
  const { category, subcategories, products } = await getCategoryPageData(
    categorySlug
  );

  return (
    <div className="bg-white">
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-32">
        <div className="mb-8">
          <Breadcrumb
            items={[
              { label: "Collections", href: "/collections" },
              { label: category.name },
            ]}
          />
        </div>

        {/* Custom display variables */}
        {(() => {
          const isCorporate = categorySlug === "corporates";
          const customContent = isCorporate ? CATEGORY_CONTENT_OVERLAY.corporates : null;
          const displayName = customContent ? customContent.name : category.name;
          const displaySubtext = customContent ? customContent.subtext : (category.description || `Browse our exclusive selection of ${category.name.toLowerCase()} gift hampers.`);

          return (
            <div className="text-center mt-10">
              <h1 className="text-4xl font-serif text-[#B38463] sm:text-5xl leading-tight">
                {displayName}
              </h1>
              <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-600">
                {displaySubtext}
              </p>
            </div>
          );
        })()}

        {subcategories.length > 0 ? (
          <div className="mt-16 grid grid-cols-1 gap-y-12 sm:grid-cols-2 sm:gap-x-6 lg:grid-cols-4 lg:gap-x-8">
            {subcategories.map((sub) => (
              <Link
                key={sub.id}
                href={`/collections/${categorySlug}/${sub.slug}`}
                className="group block"
              >
                <div className="relative h-[400px] w-full overflow-hidden rounded-lg shadow-lg group-hover:shadow-2xl transition-shadow duration-300">
                  <Image
                    src={sub.image || "/images/placeholder.svg"}
                    alt={sub.name}
                    width={500}
                    height={500}
                    loading="lazy"
                    className="h-full w-full object-cover object-center transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-x-0 bottom-0 h-36 bg-gradient-to-t from-black to-transparent opacity-80" />
                  <div className="absolute inset-x-0 bottom-0 p-6">
                    <h3 className="text-2xl font-serif text-white">
                      {sub.name}
                    </h3>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : products.length > 0 ? (
          <div className="mt-16 grid grid-cols-1 gap-y-12 sm:grid-cols-2 sm:gap-x-6 lg:grid-cols-3 lg:gap-x-8">
            {products.map((product) => (
              <Link
                key={product.id}
                href={`/products/${product.slug}`}
                className="group block"
              >
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
                    <h3 className="text-2xl font-serif text-white">
                      {product.name}
                    </h3>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center mt-16">
            <p className="text-lg text-gray-600">
              No items found in this collection yet.
            </p>
            <Link
              href="/collections"
              className="mt-4 inline-block text-lg font-medium text-gray-900 hover:text-gray-700"
            >
              &larr; Back to all collections
            </Link>
          </div>
        )}

        {categorySlug === "corporates" && (
          <div className="mt-24 pt-16 border-t border-gray-200">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
              <div>
                <h2 className="text-3xl font-serif text-green-900 mb-6 font-semibold">
                  About Our Corporate Gifting
                </h2>
                <p className="text-gray-600 text-lg leading-relaxed mb-6">
                  {CATEGORY_CONTENT_OVERLAY.corporates.description}
                </p>
                <div className="bg-[#B38463]/10 border-l-4 border-[#B38463] p-5 rounded-r-lg">
                  <p className="text-[#B38463] font-medium text-base">
                    Need tailor-made corporate hampers? Contact our sales team directly on WhatsApp or fill out the enquiry form.
                  </p>
                </div>
              </div>
              <div>
                <h3 className="text-3xl font-serif text-green-900 mb-6 font-semibold">
                  Frequently Asked Questions
                </h3>
                <Accordion items={CATEGORY_CONTENT_OVERLAY.corporates.faqs} />
              </div>
            </div>
          </div>
        )}
      </div>
      
      <WhatsAppCTA 
        message={`Hello! I'm interested in your ${category.name} collection. Can you help me?`}
      />
    </div>
  );
}
