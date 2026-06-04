import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { getApiUrl } from "@/lib/utils";
import Breadcrumb from "@/components/ui/Breadcrumb";
import WhatsAppCTA from "@/components/ui/whatsapp-cta";

export const metadata: Metadata = {
  title: "House Warming Gift Hampers in Delhi NCR | Kevasiya",
  description:
    "Welcome loved ones to their new home with Kevasiya's premium house warming gift hampers. Thoughtfully curated hampers delivered across Delhi NCR — Gurgaon, Noida, Faridabad.",
  keywords:
    "house warming gifts Delhi, griha pravesh gift hampers, new home gifts Delhi NCR, house warming hamper delivery, griha pravesh hamper India",
  alternates: { canonical: "https://kevasiya.com/collections/house-warming" },
  openGraph: {
    title: "House Warming Gift Hampers in Delhi NCR | Kevasiya",
    description:
      "Premium house warming gift hampers for Griha Pravesh and new home celebrations. Delivered across Delhi, Gurgaon, Noida and NCR.",
    url: "https://kevasiya.com/collections/house-warming",
    siteName: "Kevasiya",
  },
};

const houseWarmingSchema = {
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  name: "House Warming Gift Hampers",
  description:
    "Luxury house warming and Griha Pravesh gift hampers — delivered across Delhi NCR.",
  url: "https://kevasiya.com/collections/house-warming",
  breadcrumb: {
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://kevasiya.com" },
      { "@type": "ListItem", position: 2, name: "Collections", item: "https://kevasiya.com/collections" },
      { "@type": "ListItem", position: 3, name: "House Warming" },
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

export default async function HouseWarmingPage() {
  const products = await getProducts();

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(houseWarmingSchema) }}
      />

      <div className="bg-white">
        {/* Hero banner */}
        <div className="relative bg-gradient-to-br from-[#AE8F65] to-[#8a6f4a] overflow-hidden">
          <div className="absolute inset-0 opacity-10 bg-[url('/images/categories/categories (3).webp')] bg-cover bg-center" />
          <div className="relative max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-16 text-center">
            <Breadcrumb
              variant="dark"
              items={[
                { label: "Collections", href: "/collections" },
                { label: "House Warming" },
              ]}
            />
            <h1 className="mt-6 text-4xl sm:text-5xl font-serif text-white font-bold leading-tight">
              House Warming Gift Hampers
            </h1>
            <p className="mt-4 max-w-2xl mx-auto text-lg text-white/80">
              Celebrate Griha Pravesh and new home milestones with a thoughtfully
              curated hamper — delivered fresh across Delhi NCR.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-3 text-sm text-white/70">
              <span className="px-3 py-1 rounded-full border border-white/30">Griha Pravesh</span>
              <span className="px-3 py-1 rounded-full border border-white/30">New Apartment</span>
              <span className="px-3 py-1 rounded-full border border-white/30">First Home</span>
              <span className="px-3 py-1 rounded-full border border-white/30">Corporate Office Inauguration</span>
            </div>
          </div>
        </div>

        {/* Why choose section */}
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
            {[
              { title: "Auspicious Selection", desc: "Items chosen to bring prosperity, warmth and good fortune" },
              { title: "Delhi NCR Delivery", desc: "Same-day and next-day delivery across Delhi, Gurgaon & Noida" },
              { title: "Branded Packaging", desc: "Premium boxes with custom ribbon, message cards and wrapping" },
            ].map((item) => (
              <div key={item.title} className="p-6 rounded-2xl bg-[#AE8F65]/8 border border-[#AE8F65]/15">
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
            Every hamper can be personalised with a message and custom packaging for your house warming occasion.
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

        <WhatsAppCTA message="Hello! I'm looking for a house warming gift hamper. Can you help me?" />
      </div>
    </>
  );
}
