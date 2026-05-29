"use client";

import { usePathname } from "next/navigation";
import Nav from "../app/Header";
import Footer from "../app/footer";

interface ClientLayoutProps {
  children: React.ReactNode;
}

export default function ClientLayout({ children }: ClientLayoutProps) {
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
