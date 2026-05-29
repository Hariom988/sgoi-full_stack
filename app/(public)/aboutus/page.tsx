import WhoAreYou from "@/components/(aboutPage)/whoAreYou";
import WhyChooseUs from "@/components/(aboutPage)/whyChooseUs";
import ContactSection from "@/components/(aboutPage)/contactSection";
import { PAGE_HERO_CONFIG } from "@/lib/pageHeroConfig";
import PageHero from "@/components/pageHero";
const Page = () => {
  return (
    <>
      <PageHero {...PAGE_HERO_CONFIG.about} />
      <WhoAreYou />
      <WhyChooseUs />
      <ContactSection />
    </>
  );
};

export default Page;
