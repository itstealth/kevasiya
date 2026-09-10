// src/app/terms-conditions/page.tsx

import type { Metadata } from "next";

import WhatsAppCTA from "@/components/ui/whatsapp-cta";
import Breadcrumb from "@/components/ui/Breadcrumb";

export const metadata: Metadata = {
  title: "Terms & Conditions | Kevasiya",
  description:
    "Read our Terms & Conditions to understand the rules, guidelines, and agreements that govern your use of Kevasiya's services and website.",
  alternates: {
    canonical: "/terms-conditions",
  },
};

const TermsConditionsPage = () => {
  return (
    <div className="bg-stone-50 font-sans">
      <div className="container mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:pt-36 lg:pb-20  lg:px-8">
        <div className="mb-6">
          <Breadcrumb items={[{ label: "Terms & Conditions" }]} />
        </div>
        <div className="bg-white p-8 shadow-md rounded-lg md:p-12">
          <div className="mb-10 text-center">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
              Terms & Conditions
            </h1>
          </div>

          <div className="prose prose-lg max-w-none prose-stone prose-a:text-kevasiya-gold hover:prose-a:text-kevasiya-gold/80">
            <p className="text-lg leading-relaxed text-gray-700 mb-8">
              We value the trust you place in Kevasiya. That&apos;s why we insist
              upon the highest standards for secure transactions and customer
              information privacy. Please read the following statement to learn
              about our terms and conditions. Our terms and conditions are
              subject to change at any time without notice. To make sure you are
              aware of any changes, please review this policy periodically.
            </p>

            <h2 className="text-3xl font-serif font-bold pt-8 pb-4 text-gray-900 border-b-2 border-kevasiya-gold/30">
              Data We Collect
            </h2>
            <p className="mb-4">
              We collect personally identifiable information (email address,
              name, phone number, etc.) from you when you set up a free account
              with Kevasiya. While you can browse some sections of our Website
              without being a registered member, certain activities (such as
              placing an order) do require registration.
            </p>
            <p className="mb-4">
              We do use your contact information to send you offers based on
              your previous orders and your interests. We use personal
              information to provide the services you request. To the extent we
              use your personal information to market to you, we will provide
              you the ability to opt-out of such uses.
            </p>
            <p className="mb-6">
              We use your personal information to resolve disputes, troubleshoot
              problems, help promote a safe service, collect monies owed,
              measure consumer interest in our products and services, inform you
              about online and offline offers, products, services, and updates,
              to customize your experience, detect and protect us against error,
              fraud and other criminal activity, to enforce our terms and
              conditions and as otherwise described to you at the time of
              collection.
            </p>

            <p className="mb-6">
              We accept payment from all ends, such as credit cards and national
              cards; we also accept payments via net banking and UPI. All
              transactions are processed through secure payment gateways to
              ensure the safety of your financial information.
            </p>

            <h2 className="text-3xl font-serif font-bold pt-8 pb-4 text-gray-900 border-b-2 border-kevasiya-gold/30">
              Sharing of Personal Information
            </h2>
            <p className="mb-4">
              We may share personal information with our other corporate
              entities and affiliates to help detect and prevent identity theft,
              fraud and other potentially illegal acts, correlate related or
              multiple accounts to prevent abuse of our services and to
              facilitate joint or co-branded services that you request where
              such services are provided by more than one corporate entity.
              Those entities and affiliates may not market to you as a result of
              such sharing unless you explicitly opt-in.
            </p>
            <p className="mb-4">
              We may disclose personal information if required to do so by law
              or in the good faith belief that such disclosure is reasonably
              necessary, in response to court orders, or other legal process. We
              may disclose personal information to law enforcement offices,
              third party rights owners, or others in the good faith belief that
              such disclosure is reasonably necessary to enforce our Terms or
              Privacy Policy, or to respond to claims that an advertisement,
              posting or other content violates the rights of a third party, or
              to protect the rights, property or personal safety of our users or
              the general public.
            </p>
            <p className="mb-6">
              Kevasiya and its affiliates will share some or all of your
              personal information with another business entity should we (or
              our assets) plan to merge with, or be acquired by that business
              entity. Should such a transaction occur, the other business entity
              (or the new combined entity) will be required to follow this
              privacy policy with respect to your personal information.
            </p>

            <h2 className="text-3xl font-serif font-bold pt-8 pb-4 text-gray-900 border-b-2 border-kevasiya-gold/30">
              Links to Other Sites
            </h2>
            <p className="mb-6">
              Our site links to other websites that may collect personally
              identifiable information about you. Kevasiya is not responsible
              for the privacy practices or the content of those linked websites.
            </p>

            <h2 className="text-3xl font-serif font-bold pt-8 pb-4 text-gray-900 border-b-2 border-kevasiya-gold/30">
              Security
            </h2>
            <p className="mb-4">
              To protect against the loss, misuse and alteration of the
              information under our control, we have in place physical,
              electronic and managerial procedures. Our site has stringent
              security measures in place to protect the loss, misuse, and
              alteration of the information under our control. Whenever you
              change or access your account information, we offer the use of a
              secure server.
            </p>
            <p className="mb-6">
              Once your information is in our possession we adhere to strict
              security guidelines, protecting it against unauthorized access. We
              use industry-standard encryption technologies when transferring
              and receiving consumer data exchanged with our site.
            </p>

            <h2 className="text-3xl font-serif font-bold pt-8 pb-4 text-gray-900 border-b-2 border-kevasiya-gold/30">
              Opting Out of Communications
            </h2>
            <p className="mb-6">
              Kevasiya provides all users with the opportunity to opt-out of
              receiving non-essential (promotional, marketing-related)
              communications from us on behalf of our partners, and from us in
              general, after setting up an account. If you wish to remove your
              contact information from all Kevasiya lists and newsletters,
              please login to your account and edit your newsletter
              subscriptions.
            </p>

            <h2 className="text-3xl font-serif font-bold pt-8 pb-4 text-gray-900 border-b-2 border-kevasiya-gold/30">
              Advertising
            </h2>
            <p className="mb-6">
              We use third-party advertising companies to serve ads when you
              visit our website. These companies may use information (not
              including your name, address, email address, or telephone number)
              about your visits to this and other websites in order to provide
              advertisements about goods and services of interest to you.
            </p>

            <h2 className="text-3xl font-serif font-bold pt-8 pb-4 text-gray-900 border-b-2 border-kevasiya-gold/30">
              Bulk Orders & Customization
            </h2>
            <p className="mb-4">
              We are specialized bulk sellers and usually deal in bulk orders
              while maintaining competitive price limits. We offer customization
              services including embroidery, printing, embossing, screen
              printing, and engraving to transform gifts according to your
              company branding.
            </p>
            <p className="mb-6">
              For corporate orders, we can create personalized microsites for
              your employees to select their preferred gift hampers. Our
              dedicated sales team is available 24/7 to assist with bulk order
              requirements and gift selection.
            </p>

            {/* <h2 className="text-3xl font-serif font-bold pt-8 pb-4 text-gray-900 border-b-2 border-kevasiya-gold/30">
              Account Creation & Ordering
            </h2>
            <p className="mb-4">
              It is necessary to create an account before placing an order.
              Account creation takes approximately 5 minutes and provides access
              to custom wishlists, order history, and preview access to our
              finest collections.
            </p>
            <p className="mb-6">
              Orders cannot be placed via phone calls; you may only get
              assistance on call about placing bulk orders. If you encounter any
              issues on our website, you can contact our support team, but all
              orders must be placed through the website.
            </p> */}

            <h2 className="text-3xl font-serif font-bold pt-8 pb-4 text-gray-900 border-b-2 border-kevasiya-gold/30">
              Questions & Contact
            </h2>
            <p className="mb-6">
              Questions regarding these terms and conditions should be directed
              to our support team. You can reach us through our contact form or
              by calling our dedicated support line for assistance with any
              queries related to our services, orders, or policies.
            </p>
          </div>
        </div>
      </div>
      <WhatsAppCTA />
    </div>
  );
};

export default TermsConditionsPage;
