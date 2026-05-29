"use client";

import { usePathname } from "next/navigation";
import Nav from "@/app/Header";
import Footer from "@/app/footer";

export default function NavigationWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isAdminPage = pathname.startsWith("/admin");

  return (
    <>
      {!isAdminPage && <Nav />}
      {children}
      {!isAdminPage && <Footer />}
    </>
  );
}

