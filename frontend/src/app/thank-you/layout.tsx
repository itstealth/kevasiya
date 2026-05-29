import { GoogleTagManager } from "@next/third-parties/google";

export default function ThankYouLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {/* Google Tag Manager */}
      {process.env.NODE_ENV === "production" && (
        <GoogleTagManager gtmId="GTM-K7QBFHLL" />
      )}
      {children}
    </>
  );
}
