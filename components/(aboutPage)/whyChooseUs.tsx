import PaymentIcon from "@/public/(aboutusPage)/payments.svg";
import QualityIcon from "@/public/(aboutusPage)/quality.svg";
import ReliableIcon from "@/public/(aboutusPage)/reliable.svg";
import SupportIcon from "@/public/(aboutusPage)/support.svg";
import TransparentIcon from "@/public/(aboutusPage)/transparent.svg";
import Image from "next/image";
interface ChooseUsCard {
  icon: string;
  title: string;
  description: string;
}

const SECTION_HEADING = "Why Choose Us SGOI Pvt Ltd.";

const CHOOSE_US_CARDS: ChooseUsCard[] = [
  {
    icon: QualityIcon.src,
    title: "Quality Products",
    description:
      "We offer high quality products with strict quality standards.",
  },
  {
    icon: TransparentIcon.src,
    title: "Transparent Pricing",
    description: "Fair and transparent pricing with no hidden charges.",
  },
  {
    icon: SupportIcon.src,
    title: "Fast Support",
    description: "Dedicated WhatsApp support for quick assistance",
  },
  {
    icon: PaymentIcon.src,
    title: "Secure payments",
    description: "Safe and secure payment options for your peace of mind",
  },
  {
    icon: ReliableIcon.src,
    title: "Reliable Logistics",
    description: "Efficient delivery coordinator through trusted partners",
  },
];

function ChooseUsCardItem({ icon, title, description }: ChooseUsCard) {
  return (
    <li className="group flex flex-col items-center text-center rounded-2xl border border-[var(--color-primary)] bg-white px-5 py-8 transition-shadow duration-300 hover:shadow-lg hover:scale-102 transition-transform duration-300">
      <span className="mb-5 text-[#16a34a]">
        <Image src={icon} width={50} height={50} alt={title} />
      </span>

      <h3 className="mb-2.5 text-lg font-bold text-black">{title}</h3>

      <p className="text-md sm:text-sm leading-relaxed text-black-500">
        {description}
      </p>
    </li>
  );
}

export default function WhyChooseUs() {
  return (
    <section
      className="w-full bg-white py-14 sm:py-16 lg:py-20"
      aria-labelledby="why-choose-us-heading"
    >
      <div className="mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10 flex flex-col items-center sm:mb-12">
          <h2
            id="why-choose-us-heading"
            className="text-center text-xl font-bold text-black sm:text-2xl lg:text-3xl"
          >
            {SECTION_HEADING}
          </h2>
          <span
            className="mt-1 block h-1 w-30 sm:w-50 rounded-full bg-[#16a34a]"
            aria-hidden="true"
          />
        </div>

        <ul
          className="grid grid-cols-1 gap-4 sm:grid-cols-3 sm:gap-5 lg:grid-cols-5 lg:gap-5"
          role="list"
          aria-label="Reasons to choose SGOI Pvt Ltd"
        >
          {CHOOSE_US_CARDS.map((card) => (
            <ChooseUsCardItem key={card.title} {...card} />
          ))}
        </ul>
      </div>
    </section>
  );
}
