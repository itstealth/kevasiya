import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { getApiUrl } from "@/lib/utils";
import Breadcrumb from "@/components/ui/Breadcrumb";
import WhatsAppCTA from "@/components/ui/whatsapp-cta";

export const metadata: Metadata = {
  title: "Anniversary Gift Hampers in Delhi NCR | Luxury Gifts | Kevasiya",
  description:
    "Mark every milestone with Kevasiya's premium anniversary gift hampers. Elegant, curated hampers delivered across Delhi NCR. Perfect for 1st, 25th, 50th anniversaries and every year in between.",
  keywords:
    "anniversary gift hampers Delhi, anniversary gifts Delhi NCR, luxury anniversary hampers, wedding anniversary gifts India, anniversary hamper delivery Delhi",
  alternates: { canonical: "https://kevasiya.com/collections/anniversary" },
  openGraph: {
    title: "Anniversary Gift Hampers in Delhi NCR | Kevasiya",
    description:
      "Premium anniversary gift hampers crafted for every milestone. Delivered across Delhi, Gurgaon, Noida and NCR.",
    url: "https://kevasiya.com/collections/anniversary",
    siteName: "Kevasiya",
  },
};

const anniversarySchema = {
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  name: "Anniversary Gift Hampers",
  description:
    "Luxury anniversary gift hampers for every milestone — delivered across Delhi NCR.",
  url: "https://kevasiya.com/collections/anniversary",
  breadcrumb: {
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://kevasiya.com" },
      { "@type": "ListItem", position: 2, name: "Collections", item: "https://kevasiya.com/collections" },
      { "@type": "ListItem", position: 3, name: "Anniversary" },
    ],
  },
};

interface Product {
  id: number;
  name: string;
  slug: string;
  image: string;
  description: string;
}

async function getProducts(): Promise<Product[]> {
  try {
    const res = await fetch(`${getApiUrl()}/products`, {
      next: { revalidate: 3600 },
    });
    if (!res.ok) return [];
    return res.json();
  } catch {
    return [];
  }
}

export default async function AnniversaryPage() {
  const products = await getProducts();

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(anniversarySchema) }}
      />

      <div className="bg-white">
        {/* Hero banner */}
        <div className="relative bg-gradient-to-br from-[#3A5A40] to-[#2d4731] overflow-hidden">
          <div className="absolute inset-0 opacity-10 bg-[url('/images/categories/categories (2).webp')] bg-cover bg-center" />
          <div className="relative max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-16 text-center">
            <Breadcrumb
              variant="dark"
              items={[
                { label: "Collections", href: "/collections" },
                { label: "Anniversary" },
              ]}
            />
            <h1 className="mt-6 text-4xl sm:text-5xl font-serif text-white font-bold leading-tight">
              Anniversary Gift Hampers
            </h1>
            <p className="mt-4 max-w-2xl mx-auto text-lg text-white/80">
              Celebrate every milestone with a luxury hamper crafted to express
              love, gratitude and joy — delivered across Delhi NCR.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-3 text-sm text-white/70">
              <span className="px-3 py-1 rounded-full border border-white/30">1st Anniversary</span>
              <span className="px-3 py-1 rounded-full border border-white/30">Silver Jubilee</span>
              <span className="px-3 py-1 rounded-full border border-white/30">Golden Anniversary</span>
              <span className="px-3 py-1 rounded-full border border-white/30">Custom Milestone</span>
            </div>
          </div>
        </div>

        {/* Why choose section */}
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
            {[
              { title: "Curated with Love", desc: "Every item handpicked to make the moment unforgettable" },
              { title: "Delhi NCR Delivery", desc: "Same-day and next-day delivery across Delhi, Gurgaon & Noida" },
              { title: "Fully Customisable", desc: "Add a personal note, custom packaging or specific items" },
            ].map((item) => (
              <div key={item.title} className="p-6 rounded-2xl bg-[#3A5A40]/5 border border-[#3A5A40]/10">
                <h3 className="font-serif font-semibold text-[#3A5A40] text-lg mb-2">{item.title}</h3>
                <p className="text-gray-500 text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Products grid */}
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
          <h2 className="text-3xl font-serif text-[#3A5A40] font-bold mb-2">
            Our Gift Hampers
          </h2>
          <p className="text-gray-500 mb-8">
            Browse our full collection — every hamper can be personalised for an anniversary occasion.
          </p>

          {products.length > 0 ? (
            <div className="grid grid-cols-1 gap-y-10 sm:grid-cols-2 sm:gap-x-6 lg:grid-cols-4 lg:gap-x-8">
              {products.map((product) => (
                <Link key={product.id} href={`/products/${product.slug}`} className="group block">
                  <div className="relative h-[360px] w-full overflow-hidden rounded-xl shadow-md group-hover:shadow-xl transition-shadow duration-300">
                    <Image
                      src={product.image || "/images/placeholder.svg"}
                      alt={product.name}
                      fill
                      loading="lazy"
                      className="object-cover object-center transition-transform duration-300 group-hover:scale-105"
                    />
                    <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/70 to-transparent" />
                    <div className="absolute inset-x-0 bottom-0 p-4">
                      <p className="text-white font-serif text-lg leading-tight">{product.name}</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-20 text-gray-500">
              <p>Products loading — please check back shortly.</p>
            </div>
          )}
        </div>

        <WhatsAppCTA message="Hello! I'm looking for an anniversary gift hamper. Can you help me?" />
      </div>
    </>
  );
}
