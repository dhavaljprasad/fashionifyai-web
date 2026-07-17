"use client";
import { useRouter } from "next/navigation";
import { ArrowRight, Play } from "lucide-react";
import { ButtonSecondary, ButtonPrimary } from "../modular/button";
import { useAuth } from "@/app/providers/auth";

export const LandingPageHeroFooter = () => {
  const { user } = useAuth();
  const router = useRouter();

  return (
    <div className="flex h-fit w-full flex-col items-start justify-between gap-4 bg-accent px-4 py-16 sm:px-16 lg:flex-row lg:items-center">
      <div className="flex h-auto w-full flex-col items-start justify-center gap-4 lg:max-w-2xl">
        <span className="text-xs font-semibold text-contrast">TRY IT NOW</span>

        <h1 className="text-6xl font-bold text-contrast">
          Ready to love your closet?
        </h1>

        <span className="text-sm text-contrast">
          Get 5 free renders. Your AI wardrobe stylist, live in 60 seconds. No
          credit card required. No commitment
        </span>
      </div>
      <div className="flex h-full w-full items-center justify-end gap-4">
        {user ? (
          <ButtonPrimary
            text="Start Now"
            buttonClass="hover:border border-background-secondary"
            onClick={() => router.push("/app")}
            icon={ArrowRight}
          />
        ) : (
          <ButtonPrimary
            text="Start Free Trial"
            icon={ArrowRight}
            buttonClass="hover:border border-background-secondary"
            onClick={() => router.push("/auth")}
          />
        )}

        <ButtonSecondary text="See Demo" icon={Play} onClick={() => {}} />
      </div>
    </div>
  );
};
