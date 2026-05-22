import Image from "next/image";
import Link from "next/link";
import Package from "@/public/icons/stock.svg";
import Quality from "@/public/icons/quality.svg";
import Delivery from "@/public/icons/delivery.svg";
import Support from "@/public/icons/support.svg";

const TRUST_BADGES = [
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
] as const;

interface TrustBadgeProps {
  icon: string;
  title: string;
  subtitle: string;
}

function TrustBadge({ icon: Icon, title, subtitle }: TrustBadgeProps) {
  return (
    <div className="flex items-center gap-2.5 sm:gap-3">
      <Image
        src={Icon}
        height={28}
        width={1.5}
        className="text-white shrink-0 sm:w-8 sm:h-8"
        aria-hidden="true"
        alt={""}
      />
      <div className="flex flex-col">
        <span className="text-white font-semibold text-xs sm:text-sm leading-tight">
          {title}
        </span>
        <span className="text-primary text-[10px] sm:text-xs leading-tight">
          {subtitle}
        </span>
      </div>
    </div>
  );
}

export default function HeroSection() {
  return (
    <section
      className="relative w-full bg-[#0a0a0a] overflow-hidden"
      aria-labelledby="hero-heading"
    >
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-10">
        <div className="relative flex flex-col md:flex-row items-center min-h-[420px] sm:min-h-[500px] md:min-h-[540px] py-10 md:py-0">
          <div className="relative z-10 flex flex-col w-full md:w-1/2 lg:w-[55%] pt-4 md:pt-0 md:pr-6">
            <p className="text-primary font-semibold tracking-widest uppercase text-xs sm:text-sm mb-3 sm:mb-4">
              Powering the Future
            </p>

            <h1
              id="hero-heading"
              className="text-white font-extrabold leading-tight text-3xl sm:text-4xl md:text-[2.6rem] lg:text-5xl xl:text-[3.2rem] mb-4 sm:mb-5"
            >
              Lithium Battery
              <br />
              <span className="text-primary">Solutions</span>{" "}
              <span className="text-white">&amp; Accessories</span>
            </h1>

            <p className="text-gray-300 text-sm sm:text-base leading-relaxed mb-7 sm:mb-8 max-w-lg">
              Your trusted source for Lithium Battery Raw Materials, Testing
              &amp; Assembly Line Solutions, Battery Products knowledge, and
              Global Industry Updates.
            </p>

            <div className="flex flex-wrap items-center gap-3 sm:gap-4">
              <Link
                href="/"
                className="
                  inline-flex items-center gap-2
                  bg-primary hover:bg-primary/90
                  text-white text-xs sm:text-sm font-bold tracking-widest uppercase
                  px-5 sm:px-7 py-3 sm:py-3.5
                  rounded transition-colors duration-200
                  whitespace-nowrap
                "
              >
                Explore Products
                <span aria-hidden="true">→</span>
              </Link>

              <Link
                href="/"
                className="
                  inline-flex items-center gap-2
                  border border-gray-400 hover:border-white
                  text-white text-xs sm:text-sm font-bold tracking-widest uppercase
                  px-5 sm:px-7 py-3 sm:py-3.5
                  rounded transition-colors duration-200
                  whitespace-nowrap
                "
              >
                Our Solutions
                <span aria-hidden="true">→</span>
              </Link>
            </div>
          </div>

          <div
            className="
              relative z-0
              w-full md:w-1/2 lg:w-[45%]
              flex items-center justify-center md:justify-end
              mt-8 md:mt-0
              md:absolute md:right-0 md:top-0 md:bottom-0
            "
            aria-hidden="true"
          >
            <div
              className="
                absolute top-0 right-0
                w-72 h-72 sm:w-96 sm:h-96
                opacity-30 pointer-events-none
                bg-[radial-gradient(ellipse_at_top_right,_#22c55e55_0%,_transparent_70%)]
              "
            />

            <div className="relative w-full max-w-[380px] sm:max-w-[460px] md:max-w-full h-[220px] sm:h-[280px] md:h-[420px] lg:h-[480px]">
              <Image
                src="/(homePage)/hero.png"
                alt="Lithium battery solutions and accessories"
                fill
                className="object-contain object-center md:object-right"
                priority
                sizes="(max-width: 768px) 90vw, 45vw"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10 bg-[#0d0d0d]">
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-10 py-4 sm:py-5">
          <ul
            className="
              grid grid-cols-2 sm:grid-cols-4
              gap-y-4 gap-x-4 sm:gap-x-6
            "
            role="list"
            aria-label="Our guarantees"
          >
            {TRUST_BADGES.map((badge) => (
              <li key={badge.title}>
                <TrustBadge
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
