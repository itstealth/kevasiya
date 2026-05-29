"use client";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion, Variants } from "framer-motion";
// import { Festive } from "next/font/google";

export default function Nav() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();

  // Check if current page is collections or products
  const isCollectionsOrProducts =
    pathname?.startsWith("/collections") ||
    pathname?.startsWith("/products") ||
    pathname?.startsWith("/about") ||
    pathname?.startsWith("/privacy-policy") ||
    pathname?.startsWith("/terms-conditions") ||
    pathname?.startsWith("/blog") ;

  const isCorporates = pathname?.startsWith("/corporates");
  const isThankYou = pathname?.startsWith("/thank-you");
  // const isAbout = pathname?.startsWith("/about");
  // const isContact = pathname?.startsWith("/contact");
  // const isPrivacy = pathname?.startsWith("/privacy-policy");
  // const isTerms = pathname?.startsWith("/terms-conditions");

  const navLinks = [
    { name: "Festival", href: "/festival" },
    // { name: "Categories", href: "/collections" },
    { name: "Baby", href: "/baby" },
    // { name: "Baby", href: "/collections/baby" },
    // { name: "Wedding", href: "/collections/wedding" },
    { name: "Wedding", href: "/wedding" },
    // { name: "Occasions", href: "/collections/occasions" },
    { name: "Corporates", href: "/corporates" },
    // { name: "About", href: "/about" },
    // { name: "Contact", href: "/contact" },
  ];

  // Right-side sheet animation for the panel
  const panelVariants: Variants = {
    hidden: { x: "100%" },
    visible: { x: 0, transition: { duration: 0.5, ease: "easeInOut" } },
    exit: { x: "100%", transition: { duration: 0.4, ease: "easeInOut" } },
  };

  const linkVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: { delay: 0.3 + i * 0.1, ease: "easeOut" },
    }),
  };

  return (
    <>
      <div className="absolute top-0 inset-x-0 z-50 ">
        {/* Premium Top Bar */}
        <div className="bg-gray-600 text-white text-center py-2 text-xs font-light tracking-wider">
          <p>Free Shipping in Delhi NCR • Limited Time Offer</p>
        </div>
        {/* Elegant Navbar */}
        <header className="relative h-16 mx-auto py-12">
          <nav
            className={`md:max-w-screen-xl lg:max-w-[1440px] mx-auto px-4 flex items-center justify-between w-full h-full ${
              isCollectionsOrProducts ? "text-gray-700" : "text-gray-200"
            }`}
          >
            {/* Left Section */}
            <div className="flex items-center gap-6 cursor-pointer">
              {/* Logo Link */}
              <Link
                href="/"
                className="flex items-center"
                data-testid="nav-store-link"
              >
                <Image
                  src={
                    isCollectionsOrProducts ? "/logo.png" : "/logo_white.png"
                  }
                  alt="Kevasiya"
                  width={200}
                  height={200}
                />
              </Link>
            </div>

            {/* Right Section */}
            <div className="flex items-center gap-8 ">
              {/* Mobile: hamburger on the right */}
              <div className="lg:hidden">
                <button
                  aria-label="Open menu"
                  className={`${
                    isCollectionsOrProducts
                      ? "text-gray-700 hover:text-[#AE8F65]"
                      : "text-gray-200 hover:text-[#AE8F65]"
                  } transition-colors duration-300 cursor-pointer`}
                  onClick={() => setIsMenuOpen(true)}
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={1.5}
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
                    />
                  </svg>
                </button>
              </div>

              {/* Desktop: show nav or hamburger depending on route */}
              {!isCorporates ? (
                <div className="hidden lg:flex items-center  gap-8">
                  {navLinks.map((link) => (
                    <Link
                      key={link.name}
                      href={link.href}
                      className={`relative font-medium font-serif transition-colors duration-300 group cursor-pointer ${
                        isCollectionsOrProducts
                          ? "text-gray-800 hover:text-[#AE8F65]"
                          : "text-gray-200 hover:text-[#AE8F65]"
                      }`}
                    >
                      <span>
                        {link.name}
                        <span
                          className={`absolute bottom-0 left-0 w-0 h-px transition-all duration-300 group-hover:w-full ${
                            isCollectionsOrProducts
                              ? "bg-[#AE8F65]"
                              : "bg-cyan-700"
                          }`}
                        ></span>
                      </span>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="hidden lg:flex items-center">
                  <button
                    aria-label="Open menu"
                    className={`${
                      isCollectionsOrProducts || isThankYou
                        ? "text-gray-700 hover:text-[#AE8F65]"
                        : "text-gray-200 hover:text-[#AE8F65]"
                    } transition-colors duration-300 cursor-pointer`}
                    onClick={() => setIsMenuOpen(true)}
                  >
                    <svg
                      className="w-7 h-7"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={1.5}
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
                      />
                    </svg>
                  </button>
                </div>
              )}
            </div>
          </nav>
        </header>
      </div>
      {/* Sheet Menu (mobile + corporates desktop) */}
      <AnimatePresence>
        {isMenuOpen && (
          <div className="fixed  inset-0 z-[100]">
            {/* Backdrop */}
            <div
              className="absolute inset-0 bg-gray-900 bg-opacity-70 backdrop-blur-sm"
              onClick={() => setIsMenuOpen(false)}
            ></div>
            {/* Sliding Panel (Right) */}
            <motion.div
              initial="hidden"
              animate="visible"
              exit="exit"
              variants={panelVariants}
              className="absolute right-0 top-0 h-full w-5/5 max-w-screen bg-gray-900 p-8 shadow-2xl"
            >
              <div className="flex justify-end mb-8">
                <button
                  aria-label="Close menu"
                  className="text-gray-400 hover:text-white transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <svg
                    className="w-8 h-8"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
              <div className="flex flex-col items-center justify-center h-[calc(100%-4rem)] -mt-16">
                <nav>
                  <ul className="flex flex-col items-center gap-8">
                    {navLinks.map((link, i) => (
                      <motion.li
                        key={link.name}
                        custom={i}
                        variants={linkVariants}
                        initial="hidden"
                        animate="visible"
                      >
                        <Link
                          href={link.href}
                          onClick={() => setIsMenuOpen(false)}
                          className="text-3xl font-serif text-gray-300 hover:text-white transition-colors"
                        >
                          {link.name}
                        </Link>
                      </motion.li>
                    ))}
                  </ul>
                </nav>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
