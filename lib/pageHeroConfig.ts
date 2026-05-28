import type { PageHeroProps } from "@/components/pageHero";
import AboutImage    from "@/public/(homePage)/hero.png";
import PrivacyImage  from "@/public/(heroPages)/privacy.png";
import TermsImage    from "@/public/(homePage)/hero.png"

export const PAGE_HERO_CONFIG = {
  about: {
    eyebrow:        "ABOUT US",
    heading:        "SGOI Pvt Ltd.",
    description:    "Your trusted partner for Lithium Battery Raw Materials, Solutions, Knowledge, and Global Industry Updates.",
    imageSrc:       AboutImage,
    imageAlt:       "SGOI lithium battery raw materials and components display",
    headingVariant: "split",
    headingId:      "about-hero-heading",
  },

  privacy: {
    eyebrow:        "SGOI Pvt Ltd.",
    heading:        "Privacy Policy",
    description:    "We are committed to protecting your personal information and your right to privacy. This policy outlines how we collect, use, and safeguard your data.",
    imageSrc:       PrivacyImage,
    imageAlt:       "SGOI Pvt Ltd privacy and data protection",
    headingVariant: "plain",
    headingId:      "privacy-hero-heading",
  },

  terms: {
    eyebrow:        "SGOI Pvt Ltd.",
    heading:        "Terms & Conditions",
    description:    "Please read these terms carefully before using our platform. By accessing our services, you agree to be bound by the following terms and conditions.",
    imageSrc:       TermsImage,
    imageAlt:       "SGOI Pvt Ltd terms and conditions",
    headingVariant: "plain",
    headingId:      "terms-hero-heading",
  },
} satisfies Record<string, Omit<PageHeroProps, "headingVariant"> & { headingVariant: "split" | "plain" }>;