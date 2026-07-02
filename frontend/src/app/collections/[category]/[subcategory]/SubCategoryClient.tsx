"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getApiUrl } from "@/lib/utils";
import WhatsAppCTA from "@/components/ui/whatsapp-cta";
import ContactDock from "@/app/corporates/components/ContactDock";
import PopupQueryForm from "@/app/corporates/components/PopupQueryForm";
import Accordion from "@/components/ui/Accordion";

const SUBCATEGORY_CONTENT_OVERLAY = {
  "baby-announcement": {
    h1: "Baby Announcement Hampers, Celebrate Every New Beginning",
    subtext: "A new baby is one of life's most joyful milestones. Whether you're sharing the news with family, welcoming a friend's little one, or looking for the perfect way to honour a pregnancy announcement, Kevasiya's baby announcement hampers are crafted to make the moment truly unforgettable.",
    body: "Each hamper is a labour of love: thoughtfully curated, premium in quality, and wrapped with the elegance Kevasiya is known for. Because the arrival of a new life deserves nothing less.\n\nWhether you are looking for premium baby announcement gifts in Delhi, a birth announcement gift box for family, or a special baby announcement sweet box, our collection covers all your needs. From customized \"its a girl\" or \"its a boy\" gift hampers to luxury baby arrival gift hampers, we deliver the finest new baby gifts across India.",
    faqs: [
      {
        question: "Can I customise a baby announcement hamper?",
        answer: "Yes! We offer personalisation options including custom name cards, printed messages, and personalised keepsake items. Contact us to discuss your requirements."
      },
      {
        question: "How long does delivery take?",
        answer: "Orders within Delhi NCR are typically delivered within 2–3 business days. For other cities across India, delivery takes 4–7 business days depending on your location."
      },
      {
        question: "Do you offer same-day delivery in Delhi?",
        answer: "For urgent orders within Delhi NCR, please contact us directly on WhatsApp and we'll do our best to accommodate you."
      },
      {
        question: "Are your products safe for newborns?",
        answer: "Absolutely. All baby items in our hampers are selected with infant safety as the top priority soft, non-toxic, and gentle on delicate skin."
      },
      {
        question: "Can I order in bulk for a large family announcement?",
        answer: "Yes, we cater to bulk gifting requirements. Reach out to us for special pricing on bulk baby announcement hamper orders."
      },
      {
        question: "What price range are your baby announcement hampers?",
        answer: "Our hampers are available across a range of budgets. Contact us or browse our collection to find the perfect fit."
      }
    ]
  },
  "baby-showers": {
    h1: "Baby Shower Hampers",
    subtext: "Make her baby shower truly memorable with a Kevasiya luxury hamper, beautifully curated for mom and baby, delivered free across Delhi NCR.",
    body: "Our baby shower hampers are designed to celebrate the mother-to-be in the most thoughtful way. Each hamper brings together premium essentials for the newborn and indulgent treats for the new mom, wrapped in Kevasiya's signature packaging. Whether you're gifting at the shower or sending it home, we handle everything from curation to delivery. Personalisation available on request.\n\nWe offer a beautiful selection of baby shower gifts in Delhi, baby shower return gifts, and traditional godh bharai gifts. From elegant gifts for a baby shower to premium baby shower gift hampers, we provide delivery across Delhi NCR and pan-India.",
    faqs: [
      {
        question: "Can I add a personalised message to the hamper?",
        answer: "Yes, custom name cards and heartfelt messages can be added to any order."
      },
      {
        question: "What does a baby shower hamper typically include?",
        answer: "Items vary by hamper but may include baby clothing, skincare essentials, plush toys, mom self-care products, and keepsakes."
      },
      {
        question: "Do you deliver baby shower hampers outside Delhi?",
        answer: "Yes, we ship pan-India. Free shipping is available within Delhi NCR."
      }
    ]
  },
  "baby-shower": {
    h1: "Baby Shower Hampers",
    subtext: "Make her baby shower truly memorable with a Kevasiya luxury hamper, beautifully curated for mom and baby, delivered free across Delhi NCR.",
    body: "Our baby shower hampers are designed to celebrate the mother-to-be in the most thoughtful way. Each hamper brings together premium essentials for the newborn and indulgent treats for the new mom, wrapped in Kevasiya's signature packaging. Whether you're gifting at the shower or sending it home, we handle everything from curation to delivery. Personalisation available on request.\n\nWe offer a beautiful selection of baby shower gifts in Delhi, baby shower return gifts, and traditional godh bharai gifts. From elegant gifts for a baby shower to premium baby shower gift hampers, we provide delivery across Delhi NCR and pan-India.",
    faqs: [
      {
        question: "Can I add a personalised message to the hamper?",
        answer: "Yes, custom name cards and heartfelt messages can be added to any order."
      },
      {
        question: "What does a baby shower hamper typically include?",
        answer: "Items vary by hamper but may include baby clothing, skincare essentials, plush toys, mom self-care products, and keepsakes."
      },
      {
        question: "Do you deliver baby shower hampers outside Delhi?",
        answer: "Yes, we ship pan-India. Free shipping is available within Delhi NCR."
      }
    ]
  }
};

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
  const overlay = SUBCATEGORY_CONTENT_OVERLAY[subcategorySlug as keyof typeof SUBCATEGORY_CONTENT_OVERLAY];
  const displayH1 = overlay ? overlay.h1 : subcategoryName;
  const displaySubtext = overlay ? overlay.subtext : `Discover our curated selection for ${subcategoryName.toLowerCase()}.`;

  return (
    <div className="bg-white">
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-32">
        <div className="text-center mt-10">
          <h1 className="text-4xl font-serif text-[#B38463] sm:text-5xl leading-tight">
            {displayH1}
          </h1>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-600">
            {displaySubtext}
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

        {overlay && (
          <div className="mt-24 pt-16 border-t border-gray-200">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
              <div>
                <h2 className="text-3xl font-serif text-green-900 mb-6 font-semibold">
                  About Our {subcategoryName}
                </h2>
                <p className="text-gray-600 text-lg leading-relaxed mb-6 whitespace-pre-line">
                  {overlay.body}
                </p>
                <div className="bg-[#B38463]/10 border-l-4 border-[#B38463] p-5 rounded-r-lg">
                  <p className="text-[#B38463] font-medium text-base">
                    Looking for custom name cards, printed messages, or personalized keepsakes? Get in touch with us on WhatsApp for bespoke requirements.
                  </p>
                </div>
              </div>
              <div>
                <h3 className="text-3xl font-serif text-green-900 mb-6 font-semibold">
                  Frequently Asked Questions
                </h3>
                <Accordion items={overlay.faqs} />
              </div>
            </div>
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
