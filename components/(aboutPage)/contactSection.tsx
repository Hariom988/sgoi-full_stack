import Image from "next/image";
import SupportImage from "@/public/(aboutusPage)/contactSectionImage.png";
import User from "@/public/(aboutusPage)/(contactSection)/user.svg";
import Phone from "@/public/(aboutusPage)/(contactSection)/phone.svg";
import Massage from "@/public/(aboutusPage)/(contactSection)/massage.svg";
import Location from "@/public/(aboutusPage)/(contactSection)/location.svg";
import Link from "next/link";
import TrustBadge from "../trustBadge";

interface ContactRow {
  icon: string;
  lines: string[];
  ariaLabel: string;
  href?: string;
}

const CONTACT_ROWS: ContactRow[] = [
  {
    icon: User.src,
    lines: ["SGOI Pvt Ltd."],
    ariaLabel: "Company name",
  },
  {
    icon: Massage.src,
    lines: ["sgoicompany@gmail.com"],
    ariaLabel: "Email address",
    href: "mailto:sgoicompany@gmail.com",
  },
  {
    icon: Location.src,
    lines: ["41 DSIIDC, Scheme 1, Okhla Phase 2, New Delhi 110020"],
    ariaLabel: "Office address",
  },
  {
    icon: Phone.src,
    lines: ["Customer care no", "+91  8527169717"],
    ariaLabel: "Customer care phone number",
    href: "tel:+918527169717",
  },
];

function ContactRowItem({ icon, lines, ariaLabel, href }: ContactRow) {
  const content = (
    <div className="flex flex-col gap-0.5">
      {lines.map((line, i) => (
        <span
          key={i}
          className={
            lines.length > 1 && i === 0
              ? "text-sm text-gray-400"
              : "text-sm text-white sm:text-base"
          }
        >
          {line}
        </span>
      ))}
    </div>
  );

  return (
    <li className="flex items-start gap-4" aria-label={ariaLabel}>
      <Image src={icon} width={20} height={20} alt={ariaLabel} />

      {href ? (
        <Link
          href={href}
          className="transition-opacity duration-150 hover:opacity-70"
        >
          {content}
        </Link>
      ) : (
        content
      )}
    </li>
  );
}

export default function ContactSection() {
  return (
    <>
      <section
        id="contact"
        className="w-full scroll-mt-20 bg-[#0a0a0a]"
        aria-labelledby="contact-heading"
      >
        <div className="mx-auto flex max-w-screen-xl flex-col md:flex-row md:items-stretch">
          <div className="flex flex-1 flex-col justify-center px-4 py-12 sm:px-6 sm:py-14 lg:px-8 lg:py-16">
            <div className="mb-8 sm:mb-10">
              <h2
                id="contact-heading"
                className="text-xl  font-bold text-white sm:text-2xl lg:text-3xl"
              >
                Contact Information
              </h2>
              <span
                className="mt-1  block h-1 w-20 rounded-full bg-[#16a34a]"
                aria-hidden="true"
              />
            </div>

            <ul
              className="flex flex-col gap-6 sm:gap-7"
              role="list"
              aria-label="Contact details"
            >
              {CONTACT_ROWS.map((row) => (
                <ContactRowItem key={row.ariaLabel} {...row} />
              ))}
            </ul>
          </div>

          <div className="relative h-56 w-full md:h-auto md:w-[45%] md:flex-shrink-0 lg:w-[42%]">
            <Image
              src={SupportImage}
              alt="SGOI Pvt Ltd customer support team assisting clients"
              fill
              className="object-contain"
              sizes="(max-width: 768px) 100vw, 45vw"
              priority={false}
            />
          </div>
        </div>
      </section>
      <TrustBadge />
    </>
  );
}
