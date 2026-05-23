import Link from "next/link";
import BestQuality from "@/public/(homePage)/featureSection/bestQuality.svg";
import CustomSolution from "@/public/(homePage)/featureSection/customSolution.svg";
import Expert from "@/public/(homePage)/featureSection/expert.svg";
import Image from "next/image";
import Package from "@/public/(homePage)/featureSection/stock.svg";
import Quality from "@/public/(homePage)/featureSection//quality.svg";
import Delivery from "@/public/(homePage)/featureSection/delivery.svg";
import Support from "@/public/(homePage)/featureSection/support.svg";
interface FeatureCard {
  icon: string;
  title: string;
  description: string;
}

interface TrustBadge {
  icon: string;
  title: string;
  subtitle: string;
}

const FEATURE_CARDS: FeatureCard[] = [
  {
    icon: CustomSolution,
    title: "Customized Solutions",
    description: "Tailored to your production needs",
  },
  {
    icon: BestQuality,
    title: "High Quality Equipment",
    description: "Reliable, accurate & efficient machines",
  },
  {
    icon: Expert,
    title: "Expert Guidance",
    description: "Installation, training & after-sales support",
  },
  {
    icon: Expert,
    title: "Complete Support",
    description: "From setup to scaling your production",
  },
];

const TRUST_BADGES: TrustBadge[] = [
  {
    icon: Package,
    title: "Ready Stocks",
    subtitle: "Quick Dispatch",
  },
  {
    icon: Quality,
    title: "Quality Assured",
    subtitle: "100% Tested",
  },
  {
    icon: Delivery,
    title: "Global Delivery",
    subtitle: "Worldwide Shipping",
  },
  {
    icon: Support,
    title: "Expert Support",
    subtitle: "24/7 Assistance",
  },
];

function FeatureCardItem({ icon: Icon, title, description }: FeatureCard) {
  return (
    <article
      className="
        flex flex-col items-center text-center
        border border-primary rounded-lg
        px-4 py-6 sm:px-5 sm:py-7
        bg-transparent
        h-full
      "
    >
      <div className="mb-4 sm:mb-5" aria-hidden="true">
        <Image
          src={Icon}
          width={40}
          height={40}
          className="text-primary sm:w-11 sm:h-11"
          alt={title}
        />
      </div>

      <h3 className="text-white font-bold text-sm sm:text-base leading-snug mb-2">
        {title}
      </h3>

      <p className="text-gray-400 text-xs sm:text-sm leading-relaxed">
        {description}
      </p>
    </article>
  );
}

function TrustBadgeItem({ icon: Icon, title, subtitle }: TrustBadge) {
  return (
    <div className="flex items-center gap-2.5 sm:gap-3">
      <Image
        src={Icon}
        width={28}
        height={28}
        className="text-gray-700 shrink-0 sm:w-8 sm:h-8"
        aria-hidden="true"
        alt={title}
      />
      <div className="flex flex-col">
        <span className="text-gray-900 font-semibold text-xs sm:text-sm leading-tight">
          {title}
        </span>
        <span className="text-gray-500 text-[10px] sm:text-xs leading-tight">
          {subtitle}
        </span>
      </div>
    </div>
  );
}

export default function FeaturesSection() {
  return (
    <section aria-labelledby="features-heading">
      <div className="bg-[var(--color-bg-dark)]">
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-10 py-10 sm:py-12 lg:py-14">
          <div className="flex flex-col lg:flex-row lg:items-center gap-8 lg:gap-12">
            <div className="w-full lg:w-[36%] xl:w-[32%] shrink-0">
              <p className="text-primary font-semibold tracking-widest uppercase text-xs sm:text-sm mb-3">
                We Provide
              </p>

              <h2
                id="features-heading"
                className="text-white font-extrabold text-2xl sm:text-3xl lg:text-[2rem] xl:text-[2.25rem] leading-tight mb-4"
              >
                Testing &amp; Assembly
                <br />
                Line Solutions
              </h2>

              <p className="text-gray-400 text-sm sm:text-[0.9rem] leading-relaxed mb-6 sm:mb-7 max-w-sm">
                End-to-end solutions for battery pack manufacturing with
                advanced technology and reliable equipment.
              </p>

              <Link
                href="/"
                className="
                  inline-flex items-center gap-2
                  bg-primary hover:bg-[var(--color-primary-hover)]
                  text-white text-xs sm:text-sm font-bold tracking-widest uppercase
                  px-6 sm:px-7 py-3 sm:py-3.5
                  rounded transition-colors duration-200
                  whitespace-nowrap
                "
              >
                Explore Products
                <span aria-hidden="true">→</span>
              </Link>
            </div>

            <div className="w-full lg:flex-1">
              <ul
                className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4"
                role="list"
                aria-label="Our features"
              >
                {FEATURE_CARDS.map((card) => (
                  <li key={card.title} className="flex">
                    <FeatureCardItem
                      icon={card.icon}
                      title={card.title}
                      description={card.description}
                    />
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white border-t border-gray-200">
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-10 py-5 sm:py-6">
          <ul
            className="grid grid-cols-2 sm:grid-cols-4 gap-y-5 gap-x-4 sm:gap-x-6"
            role="list"
            aria-label="Our guarantees"
          >
            {TRUST_BADGES.map((badge) => (
              <li key={badge.title}>
                <TrustBadgeItem
                  icon={badge.icon}
                  title={badge.title}
                  subtitle={badge.subtitle}
                />
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
