import Image from "next/image";
import InfoWeCollect from "@/public/(privacyPage)/infoWeCollect.svg";
import User from "@/public/(privacyPage)/user.svg";
import PaymentSecurity from "@/public/(privacyPage)/paymentSecurity.svg";
import ThirdPartyServices from "@/public/(privacyPage)/thirdPartyServices.svg";
import DataProtection from "@/public/(privacyPage)/dataProtection.svg";
import Cookies from "@/public/(privacyPage)/cookies.svg";
import UserConsent from "@/public/(privacyPage)/userConsent.svg";
import ContactUs from "@/public/(privacyPage)/contactus.svg";

interface PolicyItem {
  icon: string;
  title: string;
  description: string;
}

const PRIVACY_POLICY_ITEMS: PolicyItem[] = [
  {
    icon: InfoWeCollect.src,
    title: "Information We Collect",
    description:
      "We may collect your name, mobile number, email address, billing & shipping address, GST information, payment details, and order history.",
  },
  {
    icon: User.src,
    title: "How We Use Your Information",
    description:
      "Your information is used for order processing, customer support, shipping & delivery coordination, invoice generation, GST compliance, and website improvement",
  },
  {
    icon: PaymentSecurity.src,
    title: "Payment Security",
    description:
      "We use secure payment methods and trusted payment gateways. However, SGOI Pvt Ltd does not store sensitive banking credentials such as debit/credit card PINs or passwords.",
  },
  {
    icon: ThirdPartyServices.src,
    title: "Third-Party Services",
    description:
      "We may use third-party services including payment gateways, courier & logistics partners, and website analytics tools. These services operate under their own privacy policies.",
  },
  {
    icon: DataProtection.src,
    title: "Data Protection",
    description:
      "We take reasonable security measures to protect your data from unauthorized access, misuse, or disclosure.",
  },
  {
    icon: Cookies.src,
    title: "Cookies",
    description:
      "Our website may use cookies to improve user experience and website performance.",
  },
  {
    icon: UserConsent.src,
    title: "User Consent",
    description:
      "By using our website or purchasing products/services from us, you consent to this Privacy Policy.",
  },
  {
    icon: ContactUs.src,
    title: "Contact us",
    description:
      "For privacy-related concerns, contact us at support@sgoi.in or WhatsApp +91 8595877895",
  },
];

function PolicyRow({ icon, title, description }: PolicyItem) {
  return (
    <li className="flex items-start gap-5 py-7 sm:gap-7 sm:py-8">
      <div className="shrink-0 flex items-center justify-center w-[72px] h-[72px] sm:w-20 sm:h-20 rounded-xl border border-gray-200 bg-white">
        <Image src={icon} width={40} height={40} alt="" aria-hidden="true" />
      </div>

      <div className="flex-1 min-w-0 pt-1">
        <h3 className="text-sm font-bold text-black sm:text-lg mb-1.5 sm:mb-2">
          {title}
        </h3>
        <p className="text-sm sm:text-base leading-relaxed text-black-600">
          {description}
        </p>
      </div>
    </li>
  );
}

export default function PrivacyPolicyPage() {
  return (
    <main>
      <section className="w-full bg-white" aria-label="Privacy policy sections">
        <div className="mx-auto max-w-full px-4 sm:px-6 lg:px-13 py-10 sm:py-14">
          <ul role="list" className="divide-y divide-gray-200">
            {PRIVACY_POLICY_ITEMS.map((item) => (
              <PolicyRow key={item.title} {...item} />
            ))}
          </ul>
        </div>
      </section>
    </main>
  );
}
