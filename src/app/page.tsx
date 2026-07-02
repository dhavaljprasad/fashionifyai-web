"use client";

// importing page specific components
import { LandingPageHeader } from "@/components/landing-page/header";
import { LandingPageHero } from "@/components/landing-page/hero";
import { LandingPageRollingMarquee } from "@/components/landing-page/rolling-marquee";
import { LandingPageProblems } from "@/components/landing-page/problems";
import { LandingPageHowItWorks } from "@/components/landing-page/how-it-works";
import { LandingPageFeatures } from "@/components/landing-page/features";
import { LandingPagePricing } from "@/components/landing-page/pricing";
import { LandingPageTestimonials } from "@/components/landing-page/testimonials";
import { LandingPageHeroFooter } from "@/components/landing-page/hero-footer";
import { LandingPageFooter } from "@/components/landing-page/footer";
import { LandingPageWardrobe } from "@/components/landing-page/wardrobe";

const navItems = [
  {
    label: "Problem",
    href: "#problems",
  },
  {
    label: "How it works",
    href: "#how-it-works",
  },
  {
    label: "AI Stylist",
    href: "#ai-stylist",
  },
  {
    label: "Features",
    href: "#features",
  },
  {
    label: "Pricing",
    href: "#pricing",
  },
];

export default function Home() {
  return (
    <div className="relative flex min-h-screen w-full flex-col">
      <LandingPageHeader navItems={navItems} />
      <LandingPageHero />
      <LandingPageRollingMarquee />
      <LandingPageProblems id="problems" />
      <LandingPageHowItWorks id="how-it-works" />
      <LandingPageWardrobe id="ai-stylist" />
      <LandingPageFeatures id="features" />
      <LandingPagePricing id="pricing" />
      <LandingPageTestimonials />
      <LandingPageHeroFooter />
      <LandingPageFooter />
    </div>
  );
}
