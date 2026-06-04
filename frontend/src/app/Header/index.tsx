"use client";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";

const navLinks = [
  { name: "Festival", href: "/festival" },
  { name: "Baby", href: "/baby" },
  { name: "Wedding", href: "/wedding" },
  { name: "Corporates", href: "/corporates" },
  { name: "Blog", href: "/blog" },
];

// Pages where the header starts transparent over a full-bleed hero
const HERO_PAGES = ["/", "/festival", "/wedding", "/baby", "/corporates", "/contact"];

export default function Nav() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  const isHeroPage = HERO_PAGES.some((p) =>
    p === "/" ? pathname === "/" : pathname?.startsWith(p)
  );
  const transparent = isHeroPage && !scrolled;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close menu on route change
  useEffect(() => setMenuOpen(false), [pathname]);

  return (
    <>
      {/* ─── Fixed header ───────────────────────────────────────────── */}
      <header
        className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
          transparent
            ? "bg-transparent"
            : "bg-white/98 backdrop-blur-md shadow-sm border-b border-gray-100/80"
        }`}
      >
        {/* Announcement bar */}
        <div
          className={`text-center py-1.5 text-[11px] font-light tracking-widest transition-colors duration-300 ${
            transparent
              ? "bg-black/30 text-white/90"
              : "bg-[#3A5A40] text-white/90"
          }`}
        >
          Free Shipping in Delhi NCR&nbsp;&nbsp;•&nbsp;&nbsp;Limited Time Offer
        </div>

        {/* Main nav row */}
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-[60px]">

            {/* Logo */}
            <Link href="/" className="flex-shrink-0">
              <Image
                src={transparent ? "/logo_white.png" : "/logo.png"}
                alt="Kevasiya"
                width={160}
                height={56}
                className="h-9 w-auto transition-all duration-300"
                priority
              />
            </Link>

            {/* Desktop nav links */}
            <nav className="hidden lg:flex items-center gap-7">
              {navLinks.map((link) => {
                const active = pathname?.startsWith(link.href);
                return (
                  <Link
                    key={link.name}
                    href={link.href}
                    className={`relative text-[13px] font-medium font-serif tracking-wide transition-colors duration-200 group ${
                      transparent
                        ? "text-white/85 hover:text-white"
                        : "text-gray-600 hover:text-[#3A5A40]"
                    }`}
                  >
                    {link.name}
                    <span
                      className={`absolute -bottom-0.5 left-0 h-px bg-[#AE8F65] transition-all duration-300 ${
                        active ? "w-full" : "w-0 group-hover:w-full"
                      }`}
                    />
                  </Link>
                );
              })}
            </nav>

            {/* Enquiry CTA + mobile burger */}
            <div className="flex items-center gap-3">
              <Link
                href="/contact"
                className={`hidden lg:inline-flex items-center px-4 py-1.5 rounded-full text-[12px] font-medium tracking-wide border transition-all duration-200 ${
                  transparent
                    ? "border-white/50 text-white hover:bg-white hover:text-[#3A5A40]"
                    : "border-[#AE8F65] text-[#AE8F65] hover:bg-[#AE8F65] hover:text-white"
                }`}
              >
                Enquiry
              </Link>

              <button
                aria-label="Open menu"
                onClick={() => setMenuOpen(true)}
                className={`lg:hidden p-1.5 rounded-md transition-colors ${
                  transparent
                    ? "text-white hover:bg-white/10"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* ─── Mobile slide-in panel ──────────────────────────────────── */}
      <AnimatePresence>
        {menuOpen && (
          <div className="fixed inset-0 z-[100]">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="absolute inset-0 bg-black/50 backdrop-blur-sm"
              onClick={() => setMenuOpen(false)}
            />

            {/* Panel */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ duration: 0.3, ease: [0.32, 0.72, 0, 1] }}
              className="absolute right-0 top-0 h-full w-72 bg-white flex flex-col shadow-2xl"
            >
              {/* Panel header */}
              <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
                <Image src="/logo.png" alt="Kevasiya" width={120} height={42} className="h-8 w-auto" />
                <button
                  aria-label="Close menu"
                  onClick={() => setMenuOpen(false)}
                  className="text-gray-400 hover:text-gray-700 transition-colors p-1"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Links */}
              <nav className="flex-1 flex flex-col px-6 py-8 gap-1">
                {navLinks.map((link, i) => {
                  const active = pathname?.startsWith(link.href);
                  return (
                    <motion.div
                      key={link.name}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.05 + i * 0.06, duration: 0.25 }}
                    >
                      <Link
                        href={link.href}
                        className={`flex items-center justify-between py-4 text-xl font-serif border-b border-gray-50 transition-colors ${
                          active ? "text-[#AE8F65]" : "text-gray-800 hover:text-[#AE8F65]"
                        }`}
                      >
                        {link.name}
                        {active && <span className="w-1.5 h-1.5 rounded-full bg-[#AE8F65]" />}
                      </Link>
                    </motion.div>
                  );
                })}

                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.35, duration: 0.25 }}
                  className="mt-6"
                >
                  <Link
                    href="/contact"
                    className="block text-center py-3 px-6 bg-[#3A5A40] text-white rounded-full text-sm font-medium tracking-wide hover:bg-[#2e4a33] transition-colors"
                  >
                    Get in Touch
                  </Link>
                </motion.div>
              </nav>

              {/* Bottom brand line */}
              <p className="px-6 pb-6 text-[11px] text-gray-300 tracking-widest uppercase text-center">
                Luxury Gift Hampers
              </p>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
