"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import PopupQueryForm from "../app/corporates/components/PopupQueryForm";

const STORAGE_KEY = "kevasiya_auto_popup_shown";
const DELAY_MS = 10000;

export default function AutoEnquiryPopup() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (sessionStorage.getItem(STORAGE_KEY)) return;

    const timer = setTimeout(() => {
      sessionStorage.setItem(STORAGE_KEY, "1");
      if (!pathname.startsWith("/contact") && !pathname.startsWith("/admin")) {
        setOpen(true);
      }
    }, DELAY_MS);

    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <PopupQueryForm open={open} onOpenChange={setOpen} />;
}
