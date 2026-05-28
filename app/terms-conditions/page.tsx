import TermsConditionSection from "@/components/(termsPage)/termsConditionSection";
import PageHero from "@/components/pageHero";
import TrustBadge from "@/components/trustBadge";
import { PAGE_HERO_CONFIG } from "@/lib/pageHeroConfig";

const Page = () => {
  return (
    <>
      <PageHero {...PAGE_HERO_CONFIG.terms} />
      <TermsConditionSection />
      <TrustBadge />
    </>
  );
};

export default Page;
