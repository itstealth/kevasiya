"use client";

import ProductDetailsClient from "./product-details-client";
import { Product } from "@/types/product";
import WhatsAppCTA from "@/components/ui/whatsapp-cta";
import ContactDock from "@/app/corporates/components/ContactDock";

export default function ProductPageClient({ product }: { product: Product }) {

  return (
    <>
      <ProductDetailsClient product={product} />
      <div className="hidden sm:hidden">
        <WhatsAppCTA
          message={`Hello! I'm interested in your ${product.name} product. Can you help me?`}
        />
      </div>
      <ContactDock
        whatsappMessage={`Hello! I'm interested in your ${product.name} product. Can you help me?`}
      />
    </>
  );
}
