"use client";

import { useState } from "react";
import ProductDetailsClient from "./product-details-client";
import { Product } from "@/types/product";
import WhatsAppCTA from "@/components/ui/whatsapp-cta";
import ContactDock from "@/app/corporates/components/ContactDock";
import PopupQueryForm from "@/app/corporates/components/PopupQueryForm";

export default function ProductPageClient({ product }: { product: Product }) {
  const [isQueryOpen, setIsQueryOpen] = useState(false);

  return (
    <>
      <ProductDetailsClient product={product} />
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
