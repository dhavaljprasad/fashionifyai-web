"use client";
import { Marquee } from "../ui/marquee";

const marqueeItems = [
  "Virtual try-on",
  "Wardrobe styling",
  "Any product link",
  "Fabric to fit",
  "Outfit remixes",
  "10-second reenders",
  "Every body type",
  "Shop-ready exports",
];

export const LandingPageRollingMarquee = () => {
  return (
    <div className="mt-4 h-auto w-full bg-contrast md:mt-0">
      <Marquee pauseOnHover className="[--duration:20s]">
        {marqueeItems.map((item) => (
          <div
            key={item}
            className="cursor-pointer px-4 text-sm font-semibold text-black transition-colors duration-200 hover:text-accent"
          >
            {item}
          </div>
        ))}
      </Marquee>
    </div>
  );
};
