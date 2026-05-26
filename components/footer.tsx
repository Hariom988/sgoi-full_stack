import Link from "next/link";
import { Mail, MapPin, Phone } from "lucide-react";
interface FooterLink {
  label: string;
  href: string;
}

interface FooterColumn {
  heading: string;
  links: FooterLink[];
}

interface ContactItem {
  icon: React.ReactNode;
  lines: string[];
}

const FOOTER_COLUMNS: FooterColumn[] = [
  {
    heading: "Quick Links",
    links: [
      { label: "Home", href: "/" },
      { label: "Products", href: "/" },
      { label: "Learn", href: "/" },
    ],
  },
  {
    heading: "Categories",
    links: [
      { label: "Raw Materials", href: "/" },
      { label: "Battery Cells", href: "/" },
      { label: "Battery Components", href: "/" },
      { label: "Testing Equipment", href: "/" },
      { label: "Assembly Line Solutions", href: "/" },
    ],
  },
  {
    heading: "Company",
    links: [
      { label: "About", href: "/" },
      { label: "Contact Us", href: "/" },
      { label: "Privacy Policy", href: "/" },
      { label: "Term & Conditions", href: "/" },
    ],
  },
];

const CONTACT_ITEMS: ContactItem[] = [
  {
    icon: <Mail size={16} aria-hidden="true" />,
    lines: ["sgoicompany@gmail.com"],
  },
  {
    icon: <MapPin size={16} aria-hidden="true" />,
    lines: [
      "SGOI Pvt Ltd",
      "41 DSIIDC, Scheme 1, Okhla Phase 2,",
      "New Delhi 110020",
    ],
  },
  {
    icon: <Phone size={16} aria-hidden="true" />,
    lines: ["Customer care no", "+91 8527169717"],
  },
];

function FooterBrand() {
  return (
    <div className="flex flex-col gap-4 max-w-xs">
      <div>
        <span
          className="text-4xl font-black tracking-tight leading-none"
          style={{ color: "var(--color-primary)" }}
        >
          SOGI
        </span>
        <p className="text-white font-semibold text-base mt-0.5">Pvt Ltd.</p>
      </div>

      <p
        className="text-sm leading-relaxed"
        style={{ color: "var(--color-text-muted)" }}
      >
        Your trusted partner for Lithium Battery Raw Materials, Solutions,
        Knowledge and Global Industry Updates.
      </p>
    </div>
  );
}

function FooterNav({ heading, links }: FooterColumn) {
  return (
    <nav aria-label={heading}>
      <h3 className="text-white font-semibold text-base mb-4">{heading}</h3>
      <ul className="flex flex-col gap-2.5" role="list">
        {links.map(({ label, href }) => (
          <li key={label}>
            <Link
              href={href}
              className="text-sm transition-colors duration-200 hover:text-white focus-visible:outline-none focus-visible:underline"
              style={{ color: "var(--color-text-muted)" }}
            >
              {label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}

function FooterContact() {
  return (
    <div>
      <h3 className="text-white font-semibold text-base mb-4">Contact Us</h3>
      <ul className="flex flex-col gap-4" role="list">
        {CONTACT_ITEMS.map(({ icon, lines }, idx) => (
          <li key={idx} className="flex items-start gap-3">
            <span
              className="mt-0.5 shrink-0"
              style={{ color: "var(--color-text-muted)" }}
            >
              {icon}
            </span>

            <div className="flex flex-col gap-0.5">
              {lines.map((line, i) => (
                <span
                  key={i}
                  className="text-sm leading-snug"
                  style={{ color: "var(--color-text-muted)" }}
                >
                  {line}
                </span>
              ))}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function Footer() {
  return (
    <footer
      className="w-full"
      style={{ backgroundColor: "var(--color-bg-dark-alt)" }}
      aria-label="Site footer"
    >
      <div className="max-w-7xl mx-auto px-6 py-12 lg:px-8 lg:py-14">
        <div className="grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
          <div className="col-span-2 md:col-span-3 lg:col-span-1">
            <FooterBrand />
          </div>

          {FOOTER_COLUMNS.map((col) => (
            <FooterNav key={col.heading} {...col} />
          ))}

          <div className="col-span-2 sm:col-span-1 lg:col-span-1">
            <FooterContact />
          </div>
        </div>

        <div
          className="mt-12 border-t"
          style={{ borderColor: "rgba(255,255,255,0.1)" }}
          role="separator"
        />
      </div>
    </footer>
  );
}
