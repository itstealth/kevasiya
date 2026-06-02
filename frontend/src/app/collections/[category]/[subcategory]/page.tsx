import { Metadata } from "next";
import { getMetadataForRoute } from "@/lib/metadata";
import SubCategoryClient from "./SubCategoryClient";
import Breadcrumb from "@/components/ui/Breadcrumb";

interface PageProps {
  params: Promise<{ category: string; subcategory: string }>;
}

function slugToTitle(slug: string) {
  return slug.split("-").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { category, subcategory } = await params;
  return getMetadataForRoute(`/collections/${category}/${subcategory}`);
}

export default async function SubCategoryPage({ params }: PageProps) {
  const { category, subcategory } = await params;
  return (
    <>
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 sm:pt-32 pb-0">
        <Breadcrumb
          items={[
            { label: "Collections", href: "/collections" },
            { label: slugToTitle(category), href: `/collections/${category}` },
            { label: slugToTitle(subcategory) },
          ]}
        />
      </div>
      <SubCategoryClient categorySlug={category} subcategorySlug={subcategory} />
    </>
  );
}
