import Image from "next/image";
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
  {
    icon: Package.src,
    title: "Ready Stocks",
    subtitle: "Quick Dispatch",
  },
  {
    icon: Quality.src,
    title: "Quality Assured",
    subtitle: "100% Tested",
  },
  {
    icon: Delivery.src,
    title: "Global Delivery",
    subtitle: "Worldwide Shipping",
  },
  {
    icon: Support.src,
    title: "Expert Support",
    subtitle: "24/7 Assistance",
  },
];

function TrustBadgeItem({ icon, title, subtitle }: TrustBadge) {
  return (
    <li className="flex items-start gap-3">
      <span className="shrink-0 mt-0.5 text-gray-400">
        <Image src={icon} width={25} height={25} alt={title} />
      </span>

      <div className="flex flex-col min-w-0">
        <p className="text-white text-sm font-semibold leading-snug">{title}</p>
        <p className="text-xs text-gray-400 leading-snug mt-0.5">{subtitle}</p>
      </div>
    </li>
  );
}

export default function AboutHero() {
  return (
    <section className="w-full bg-[#0a0a0a]" aria-labelledby="about-heading">
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-center md:gap-8 lg:gap-12 py-10 sm:py-0">
          <div className="flex-1 min-w-0">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--color-primary)] mb-4">
              About Us
            </p>

            <h1
              id="about-heading"
              className="text-4xl sm:text-5xl font-black leading-tight text-white mb-5"
            >
              <span className="text-[var(--color-primary)]">SGOI</span>{" "}
              <span className="text-white">Pvt Ltd.</span>
            </h1>

            <p className="text-base sm:text-lg leading-relaxed text-white max-w-lg mb-8 sm:mb-10">
              Your trusted partner for Lithium Battery Raw Materials, Solutions,
              Knowledge, and Global Industry Updates.
            </p>
            <ul
              className="mt-10 grid grid-cols-2 gap-x-6 gap-y-5 sm:grid-cols-4 sm:gap-x-6 lg:gap-x-8"
              role="list"
              aria-label="Key strengths"
            >
              {TRUST_BADGES.map((badge) => (
                <TrustBadgeItem key={badge.title} {...badge} />
              ))}
            </ul>
          </div>
          <div className="mt-8 md:mt-0 md:flex-shrink-0 md:w-[42%] lg:w-[46%]">
            <div className="hidden md:block sm:relative w-full aspect-[4/3]">
              <Image
                src="/(homePage)/hero.png"
                alt="SGOI lithium battery raw materials and components display"
                fill
                className="object-contain"
                priority
                sizes="(max-width: 768px) 100vw, (max-width: 1024px) 42vw, 46vw"
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
