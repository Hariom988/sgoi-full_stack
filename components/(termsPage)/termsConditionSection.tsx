"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

interface FAQItem {
  id: number;
  question: string;
  answer: React.ReactNode;
}

const bulletList = (items: string[], green = false) => (
  <ul className="space-y-1.5 pl-1">
    {items.map((item) => (
      <li
        key={item}
        className="flex items-start gap-2.5 text-sm text-gray-700 leading-relaxed"
      >
        <span
          className={`mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full ${green ? "bg-[#16a34a]" : "bg-gray-500"}`}
          aria-hidden
        />
        {item}
      </li>
    ))}
  </ul>
);

const para = (text: string) => (
  <p className="text-sm text-gray-700 leading-relaxed">{text}</p>
);

const FAQ_ITEMS: FAQItem[] = [
  {
    id: 1,
    question: "Definitions",
    answer: bulletList([
      `"Website" refers to the official website of SGOI Pvt Ltd.`,
      `"Seller", "we", "us", "our" refer to SGOI Pvt Ltd.`,
      `"Buyer", "you", "your" refer to any person or business purchasing products/services from us.`,
      `"Products" refer to goods or services sold by SGOI Pvt Ltd.`,
      `"3PL/Carrier/Courier" means third-party logistics or courier providers.`,
    ]),
  },
  {
    id: 2,
    question: "Acceptance of Terms",
    answer: para(
      "By accessing our website, placing an order, or making a payment, you agree to these Terms & Conditions and our Privacy Policy.",
    ),
  },
  {
    id: 3,
    question: "Product Information",
    answer: para(
      "Product specifications, images, availability, and pricing may change without prior notice.",
    ),
  },
  {
    id: 4,
    question: "Pricing & Taxes",
    answer: bulletList(
      [
        "Prices are exclusive of GST unless specified.",
        "Additional charges such as shipping, handling, or taxes may apply.",
        "Pricing errors may be corrected without prior notice.",
      ],
      true,
    ),
  },
  {
    id: 5,
    question: "Orders & Cancellations",
    answer: bulletList([
      "Orders are confirmed only after successful payment.",
      "SGOI Pvt Ltd reserves the right to cancel orders due to stock issues, pricing errors, or suspicious activity.",
      "Customized or special orders may not be cancelled.",
    ]),
  },
  {
    id: 6,
    question: "Payments terms",

    answer: bulletList([
      "Full advance payment may be required before dispatch.",
      "Payment is considered successful only after funds are credited to our bank account.",
      "Payment delays caused by banks or gateways are not our responsibility.",
    ]),
  },
  {
    id: 7,
    question: "Shipping & Delivery",

    answer: bulletList([
      "Delivery timelines are estimated and may vary.",
      "Risk transfers to the buyer once products are handed over to the courier/logistics provider.",
      "Transit insurance, if required, must be arranged by the buyer.",
    ]),
  },
  {
    id: 8,
    question: "Inspection & Claims",
    answer: (
      <div className="space-y-3">
        <p className="text-sm text-gray-700 leading-relaxed">
          Customers should inspect products immediately upon delivery.
          <br />
          For missing or damaged items:
        </p>
        <ul className="space-y-1.5 pl-1">
          {[
            { text: "Report within 12 hours of delivery", italic: false },
            { text: "Share unboxing video and images", italic: false },
            { text: "Include invoice/order details", italic: true },
          ].map(({ text, italic }) => (
            <li
              key={text}
              className="flex items-start gap-2.5 text-sm text-gray-700 leading-relaxed"
            >
              <span
                className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-gray-500"
                aria-hidden
              />
              {italic ? <em>{text}</em> : text}
            </li>
          ))}
        </ul>
      </div>
    ),
  },
  {
    id: 9,
    question: "Returns & Replacements",
    answer: (
      <div className="space-y-3">
        <p className="text-sm text-gray-700 leading-relaxed">
          Returns are accepted only for approved cases such as:
        </p>
        {bulletList([
          "Wrong Product",
          "Verified Dispatch Shortage",
          "Damaged Product (subject to verification)",
        ])}
        <p className="text-sm text-gray-700 leading-relaxed">
          Products must remain unused and in original packaging.
        </p>
      </div>
    ),
  },
  {
    id: 10,
    question: "Warranty Disclaimer",
    answer: (
      <div className="space-y-2">
        {para(
          `Products are provided "as-is" unless explicitly stated otherwise.`,
        )}
        {para(
          "SGOI Pvt Ltd disclaims all implied warranties to the extent permitted by law.",
        )}
      </div>
    ),
  },
  {
    id: 11,
    question: "Limitation of Liability",
    answer: (
      <div className="space-y-3">
        <p className="text-sm text-gray-700 leading-relaxed">
          SGOI Pvt Ltd shall not be liable for:
        </p>
        {bulletList([
          "Indirect Losses",
          "Business Loss",
          "Profit Loss",
          "Delivery Delays",
          "Courier Damages",
        ])}
        <p className="text-sm text-gray-700 leading-relaxed">
          Maximum liability shall not exceed the product purchase amount.
        </p>
      </div>
    ),
  },
  {
    id: 12,
    question: "Intellectual Property",

    answer: para(
      "All website content including logos, images, text, and graphics belongs to SGOI Pvt Ltd and may not be reused without permission.",
    ),
  },
  {
    id: 13,
    question: "Governing Law",

    answer: (
      <div className="space-y-2">
        {para("These Terms shall be governed by the laws of India.")}
        {para(
          "Any disputes shall fall under the jurisdiction of the appropriate courts in India.",
        )}
      </div>
    ),
  },
  {
    id: 14,
    question: "Contact Information",
    answer: (
      <div className="space-y-3">
        {para("SGOI Pvt Ltd")}
        {bulletList([
          "CIN: [ADD CIN]",
          "GSTIN: [ADD GST]",
          "Address: [ADD ADDRESS]",
          "WhatsApp: [ADD NUMBER]",
          "Email: [ADD EMAIL]",
        ])}
      </div>
    ),
  },
];

function AccordionRow({
  item,
  isOpen,
  onToggle,
}: {
  item: FAQItem;
  isOpen: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="border-b border-gray-200 last:border-b-0">
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={isOpen}
        aria-controls={`faq-answer-${item.id}`}
        id={`faq-trigger-${item.id}`}
        className="
        cursor-pointer
          flex w-full items-center justify-between
          gap-4 px-4 py-5 sm:px-6
          text-left
          transition-colors duration-150
          hover:bg-gray-50
          focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#16a34a]
        "
      >
        <span className="text-sm font-bold text-gray-900 sm:text-base">
          {item.id}.&nbsp; {item.question}
        </span>

        <ChevronDown
          size={18}
          strokeWidth={2}
          className={`shrink-0 text-gray-500 transition-transform duration-300 ${isOpen ? "rotate-180" : "rotate-0"}`}
          aria-hidden
        />
      </button>

      <div
        id={`faq-answer-${item.id}`}
        role="region"
        aria-labelledby={`faq-trigger-${item.id}`}
        className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? "max-h-[600px] opacity-100" : "max-h-0 opacity-0"}`}
      >
        <div className="px-4 pb-6 pt-1 sm:px-6">{item.answer}</div>
      </div>
    </div>
  );
}

export default function TermsAccordion() {
  const [openId, setOpenId] = useState<number | null>(null);

  function handleToggle(id: number) {
    setOpenId((prev) => (prev === id ? null : id));
  }

  return (
    <section
      className="w-full bg-white py-10 sm:py-14"
      aria-label="Terms and conditions"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-lg border border-gray-200 overflow-hidden">
          {FAQ_ITEMS.map((item) => (
            <AccordionRow
              key={item.id}
              item={item}
              isOpen={openId === item.id}
              onToggle={() => handleToggle(item.id)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
