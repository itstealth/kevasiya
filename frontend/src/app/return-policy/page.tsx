import type { Metadata } from "next";
import Link from "next/link";
import WhatsAppCTA from "@/components/ui/whatsapp-cta";
import Breadcrumb from "@/components/ui/Breadcrumb";

export const metadata: Metadata = {
  title: "Return & Refund Policy | Kevasiya Luxury Gift Hampers",
  description:
    "Read Kevasiya's return and refund policy for luxury gift hampers. We stand behind every order — learn how to request a replacement, exchange or refund.",
  alternates: {
    canonical: "https://kevasiya.com/return-policy",
  },
};

export default function ReturnPolicyPage() {
  return (
    <div className="bg-stone-50 font-sans">
      <div className="container mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:pt-36 lg:pb-20 lg:px-8">
        <div className="mb-6">
          <Breadcrumb items={[{ label: "Return Policy" }]} />
        </div>

        <div className="bg-white p-8 shadow-md rounded-lg md:p-12">
          <div className="mb-10 text-center">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
              Return &amp; Refund Policy
            </h1>
            <p className="mt-3 text-sm text-gray-500">Last updated: June 2026</p>
          </div>

          <div className="prose prose-lg max-w-none prose-stone prose-headings:font-serif prose-headings:text-[#3A5A40] prose-a:text-[#AE8F65] hover:prose-a:text-[#3A5A40]">

            <p>
              At Kevasiya, every hamper is crafted with care and dispatched only after a
              thorough quality check. We want you to be completely delighted with your
              purchase. If something is not right, we will make it right.
            </p>

            <h2>1. Eligibility for Returns</h2>
            <p>You may request a return, replacement or refund if:</p>
            <ul>
              <li>The hamper arrived damaged or broken during transit.</li>
              <li>The wrong product or incorrect variant was delivered.</li>
              <li>One or more items listed in the hamper were missing.</li>
              <li>The product is significantly different from what was described on the website.</li>
            </ul>
            <p>
              Requests must be raised within <strong>48 hours</strong> of delivery by
              sharing unboxing photos or a video clearly showing the issue.
            </p>

            <h2>2. Non-Returnable Items</h2>
            <p>Due to the perishable and personalised nature of our hampers, the following
            cannot be returned:</p>
            <ul>
              <li>Opened or partially consumed food and beverage items.</li>
              <li>Custom-engraved, monogrammed or personalised products.</li>
              <li>Hampers where the complaint is raised after 48 hours of delivery.</li>
              <li>Items damaged due to improper storage or handling after delivery.</li>
            </ul>

            <h2>3. How to Raise a Request</h2>
            <ol>
              <li>
                Email us at{" "}
                <a href="mailto:info@kevasiya.com">info@kevasiya.com</a> or WhatsApp us
                at <a href="tel:+919310010810">+91-9310010810</a> within 48 hours of
                receiving your order.
              </li>
              <li>Include your order number, a brief description of the issue, and clear photos or a video of the damaged/incorrect items.</li>
              <li>Our team will review your request within 1 business day and suggest the best resolution.</li>
            </ol>

            <h2>4. Resolutions We Offer</h2>
            <p>Depending on the nature of the issue, we will offer one of the following:</p>
            <ul>
              <li><strong>Replacement:</strong> We re-dispatch the item or full hamper at no extra cost — our preferred resolution for transit damage.</li>
              <li><strong>Store Credit:</strong> Full credit applied to your next order.</li>
              <li><strong>Refund:</strong> Processed to the original payment method within 7–10 business days, subject to verification.</li>
            </ul>

            <h2>5. Order Cancellations</h2>
            <p>
              Cancellations are accepted within <strong>12 hours of placing the order</strong>,
              provided the hamper has not yet been dispatched. To cancel, contact us
              immediately on WhatsApp at{" "}
              <a href="tel:+919310010810">+91-9310010810</a>.
            </p>
            <p>
              Orders cancelled after dispatch are not eligible for a refund but may be
              eligible for store credit at our discretion.
            </p>

            <h2>6. Refund Timeline</h2>
            <p>
              Once approved, refunds are processed within <strong>7–10 business days</strong>.
              The time for the credit to reflect in your account depends on your bank
              or payment provider.
            </p>

            <h2>7. Contact Us</h2>
            <p>For any questions about returns, replacements or refunds:</p>
            <ul>
              <li>Email: <a href="mailto:info@kevasiya.com">info@kevasiya.com</a></li>
              <li>Phone / WhatsApp: <a href="tel:+919310010810">+91-9310010810</a></li>
              <li>Address: 52 North Avenue Road, West Punjabi Bagh, New Delhi 110026</li>
            </ul>

            <p>
              You can also{" "}
              <Link href="/contact">fill out our contact form</Link> and our team
              will get back to you within 24 hours.
            </p>
          </div>
        </div>
      </div>

      <WhatsAppCTA message="Hello! I have a question about my order return or refund. Can you help me?" />
    </div>
  );
}
