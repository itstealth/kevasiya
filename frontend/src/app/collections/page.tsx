"use client";

import { useState, useEffect } from "react";
import CollectionsGrid from "./CollectionsGrid";
import { getApiUrl } from "@/lib/utils";
import WhatsAppCTA from "@/components/ui/whatsapp-cta";
import ContactDock from "../corporates/components/ContactDock";
import PopupQueryForm from "../corporates/components/PopupQueryForm";

interface Collection {
  id: number;
  name: string;
  slug: string;
  description: string;
  image: string;
}

export default function CollectionsPage() {
  const [collections, setCollections] = useState<Collection[]>([]);
  const [isQueryOpen, setIsQueryOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function getCollections() {
      try {
        const apiUrl = getApiUrl();
        const res = await fetch(`${apiUrl}/categories`);
        if (!res.ok) {
          throw new Error(`Failed to fetch collections: ${res.statusText}`);
        }
        return res.json();
      } catch (error) {
        console.error("Error fetching collections:", error);
        return [];
      }
    }

    getCollections().then((data) => {
      setCollections(data);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return (
      <div className="bg-white min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="bg-white">
      <div className="mx-auto max-w-2xl px-4 mt-10  py-24 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8">
        <div className="text-center">
          <h2 className="text-4xl font-bold tracking-tight text-green-900 sm:text-5xl font-serif">
            Our Collections
          </h2>
          <p className="mt-4 text-lg leading-8 text-gray-600">
            Discover our curated selection of luxury hampers, thoughtfully
            designed for every occasion.
          </p>
        </div>

        <CollectionsGrid collections={collections} />
      </div>

      {/* Desktop WhatsApp CTA */}
      <div className="hidden sm:hidden">
        <WhatsAppCTA message="Hello! I'm browsing your collections and need help choosing the perfect gift. Can you assist me?" />
      </div>

      {/* Mobile Contact Dock */}
      <ContactDock
        onContactClick={() => setIsQueryOpen(true)}
        whatsappMessage="Hello! I'm browsing your collections and need help choosing the perfect gift. Can you assist me?"
      />

      {/* Popup query form modal */}
      <PopupQueryForm open={isQueryOpen} onOpenChange={setIsQueryOpen} />
    </div>
  );
}
