import Image, { StaticImageData } from "next/image";
import Package from "@/public/icons/stock.svg";
import Quality from "@/public/icons/quality.svg";
import Delivery from "@/public/icons/delivery.svg";
import Support from "@/public/icons/support.svg";
interface TrustBadge {
  icon: string;
  title: string;
  subtitle: string;
}

const TRUST_BADGES: TrustBadge[] = [
  { icon: Package.src, title: "Ready Stocks", subtitle: "Quick Dispatch" },
  { icon: Quality.src, title: "Quality Assured", subtitle: "100% Tested" },
  {
    icon: Delivery.src,
    title: "Global Delivery",
    subtitle: "Worldwide Shipping",
  },
  { icon: Support.src, title: "Expert Support", subtitle: "24/7 Assistance" },
];

function TrustBadgeItem({ icon, title, subtitle }: TrustBadge) {
  return (
    <li className="flex items-start gap-3">
      <span className="shrink-0 mt-0.5">
        <Image src={icon} width={25} height={25} alt="" aria-hidden="true" />
      </span>
      <div className="flex flex-col min-w-0">
        <p className="text-white text-sm font-semibold leading-snug">{title}</p>
        <p className="text-xs text-gray-400 leading-snug mt-0.5">{subtitle}</p>
      </div>
    </li>
  );
}
export type HeadingVariant = "split" | "plain";

export interface PageHeroProps {
  eyebrow: string;
  heading: string;
  description: string;
  imageSrc: StaticImageData | string;
  imageAlt: string;
  headingVariant?: HeadingVariant;
  headingId?: string;
}

function PageHeroHeading({
  heading,
  variant,
  id,
}: {
  heading: string;
  variant: HeadingVariant;
  id: string;
}) {
  if (variant === "split") {
    const [first, ...rest] = heading.split(" ");
    return (
      <h1
        id={id}
        className="text-4xl sm:text-5xl font-black leading-tight text-white mb-5"
      >
        <span className="text-[var(--color-primary)]">{first}</span>
        {rest.length > 0 && (
          <span className="text-white"> {rest.join(" ")}</span>
        )}
      </h1>
    );
  }

  return (
    <h1
      id={id}
      className="text-4xl sm:text-5xl font-black leading-tight text-white mb-5"
    >
      {heading}
    </h1>
  );
}

export default function PageHero({
  eyebrow,
  heading,
  description,
  imageSrc,
  imageAlt,
  headingVariant = "plain",
  headingId = "page-hero-heading",
}: PageHeroProps) {
  return (
    <section className="w-full bg-[#0a0a0a]" aria-labelledby={headingId}>
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-center md:gap-8 lg:gap-12 py-10 sm:py-0">
          <div className="flex-1 min-w-0">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--color-primary)] mb-4">
              {eyebrow}
            </p>
            <PageHeroHeading
              heading={heading}
              variant={headingVariant}
              id={headingId}
            />

            <p className="text-base sm:text-lg leading-relaxed text-white max-w-lg mb-8 sm:mb-10">
              {description}
            </p>

            <ul
              className="grid grid-cols-2 mt-20 gap-x-6 gap-y-5 sm:grid-cols-4 sm:gap-x-6 lg:gap-x-8"
              role="list"
              aria-label="Key strengths"
            >
              {TRUST_BADGES.map((badge) => (
                <TrustBadgeItem key={badge.title} {...badge} />
              ))}
            </ul>
          </div>

          <div className="hidden md:block md:flex-shrink-0 md:w-[42%] lg:w-[46%]">
            <div className="relative w-full aspect-[4/3]">
              <Image
                src={imageSrc}
                alt={imageAlt}
                fill
                className="object-contain"
                priority
                sizes="(max-width: 1024px) 42vw, 46vw"
              />
            </div>
          </div>
        </div>

        <div
          className="border-t border-white/10"
          role="separator"
          aria-hidden="true"
        />
      </div>
    </section>
  );
}
