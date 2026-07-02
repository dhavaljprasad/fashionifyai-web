"use client";
import { Smartphone, Cpu, Brush, Zap, Globe, Share2 } from "lucide-react";

const featuresData = [
  {
    index: "01",
    title: "Mobile-first",
    description:
      "Designed for the phone in your hand. Works in any browser, on any device.",
    icon: Smartphone,
  },
  {
    index: "02",
    title: "Every body, every skin tone",
    description:
      "Trained across body types, skin tones, and silhouettes from every corner of the world.",
    icon: Cpu,
  },
  {
    index: "03",
    title: "Design & remix",
    description:
      "Draw on the preview or describe changes in plain words. Style your look, tailor-ready.",
    icon: Brush,
  },
  {
    index: "04",
    title: "10-second renders",
    description:
      "See yourself in a new outfit before the coffee cools. No waiting, no guessing.",
    icon: Zap,
  },
  {
    index: "05",
    title: "Any store, any currency",
    description:
      "Paste links from Zara, Amazon, Shein, Farfetch — anywhere. We handle the rest.",
    icon: Globe,
  },
  {
    index: "06",
    title: "Share-ready exports",
    description:
      "One-tap export to Instagram, WhatsApp, iMessage — or straight to your favorite tailor.",
    icon: Share2,
  },
];

export const LandingPageFeatures = ({ id }: { id?: string }) => {
  return (
    <div
      id={id}
      className="flex h-fit w-full flex-col items-start justify-center gap-4 bg-background-secondary px-4 py-16 sm:px-16"
    >
      <span className="text-xs font-semibold text-text">WHAT YOU GET</span>
      <div className="flex w-full flex-col items-center justify-between gap-4 xl:flex-row xl:items-end xl:gap-0">
        <div className="flex flex-col items-start justify-center gap-2">
          <h1 className="text-center text-6xl font-bold text-text">
            Everything you need.
          </h1>
          <h1 className="text-center text-6xl font-bold text-accent">
            Nothing you don't.
          </h1>
        </div>
        <span className="text-sm text-text">
          Built for anyone who wants to look better, waste less, and actually
          love what's in their closet.
        </span>
      </div>
      <div className="grid w-full grid-cols-1 gap-1 sm:grid-cols-2 lg:grid-cols-3">
        {featuresData.map((feature) => (
          <div
            key={feature.index}
            className="group flex flex-col items-start justify-center gap-4 rounded-lg bg-background-primary p-4 transition-colors duration-200 hover:bg-contrast"
          >
            <div className="flex w-full items-center justify-between gap-2">
              <span className="text-sm font-semibold text-accent">
                {feature.index}
              </span>
              <feature.icon
                size={18}
                className="text-contrast transition-colors duration-200 group-hover:text-background-primary"
              />
            </div>
            <h3 className="text-lg font-bold text-contrast transition-colors duration-200 group-hover:text-background-primary">
              {feature.title}
            </h3>
            <p className="text-sm text-contrast transition-colors duration-200 group-hover:text-background-primary">
              {feature.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};
