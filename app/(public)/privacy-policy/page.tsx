import PolicySections from "@/components/(privacyPage)/policySection";
import PageHero from "@/components/pageHero";
import TrustBadge from "@/components/trustBadge";
import { PAGE_HERO_CONFIG } from "@/lib/pageHeroConfig";

const Page = () => {
  return (
    <>
      <PageHero {...PAGE_HERO_CONFIG.privacy} />
      <PolicySections />
      <TrustBadge />
    </>
  );
};

export default Page;
