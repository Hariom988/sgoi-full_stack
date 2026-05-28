import Image from "next/image";
import Package from "@/public/(homePage)/featureSection/stock.svg";
import Quality from "@/public/(homePage)/featureSection//quality.svg";
import Delivery from "@/public/(homePage)/featureSection/delivery.svg";
import Support from "@/public/(homePage)/featureSection/support.svg";
interface TrustBadge {
  icon: string;
  title: string;
  subtitle: string;
}
function TrustBadgeItem({ icon: Icon, title, subtitle }: TrustBadge) {
  return (
    <>
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
    </>
  );
}
const TrustBadge = () => {
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
  return (
    <>
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
    </>
  );
};

export default TrustBadge;
