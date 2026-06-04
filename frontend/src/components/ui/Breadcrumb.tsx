import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  /** Use "dark" when the breadcrumb sits on a dark/coloured background */
  variant?: "light" | "dark";
}

export default function Breadcrumb({ items, variant = "light" }: BreadcrumbProps) {
  const fullList = [{ label: "Home", href: "/" }, ...items];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: fullList.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.label,
      ...(item.href ? { item: `https://kevasiya.com${item.href}` } : {}),
    })),
  };

  const styles = {
    light: {
      parent: "text-gray-400 hover:text-[#AE8F65] transition-colors duration-150",
      current: "text-[#3A5A40] font-semibold",
      separator: "text-gray-300",
    },
    dark: {
      parent: "text-white/55 hover:text-white/90 transition-colors duration-150",
      current: "text-white font-semibold",
      separator: "text-white/30",
    },
  }[variant];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <nav aria-label="Breadcrumb">
        <ol className="flex items-center flex-wrap gap-x-1 gap-y-1">
          {fullList.map((item, index) => {
            const isFirst = index === 0;
            const isLast = index === fullList.length - 1;
            return (
              <li key={index} className="flex items-center gap-1">
                {index > 0 && (
                  <ChevronRight className={`w-3 h-3 flex-shrink-0 ${styles.separator}`} />
                )}
                {isLast ? (
                  <span className={`text-[11px] tracking-widest uppercase ${styles.current}`}>
                    {item.label}
                  </span>
                ) : isFirst ? (
                  <Link href={item.href!} aria-label="Home" className={styles.parent}>
                    <Home className="w-3.5 h-3.5" />
                  </Link>
                ) : (
                  <Link
                    href={item.href!}
                    className={`text-[11px] tracking-widest uppercase ${styles.parent}`}
                  >
                    {item.label}
                  </Link>
                )}
              </li>
            );
          })}
        </ol>
      </nav>
    </>
  );
}
