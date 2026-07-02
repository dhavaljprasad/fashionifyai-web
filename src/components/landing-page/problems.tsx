"use client";
import { EyeOff, Link2Off, Scissors } from "lucide-react";

const problems = [
  {
    index: "01",
    title: "You can't picture the fit",
    description:
      "Product photos live on other bodies. Fabric swatches say nothing. You buy, you doubt, you return.",
    Icon: EyeOff,
  },
  {
    index: "02",
    title: "Your wardrobe is a mystery",
    description:
      "Half your closet stays untouched. You wear the same five outfits because pairing new looks is hard.",
    Icon: Link2Off,
  },
  {
    index: "03",
    title: "Returns cost everyone",
    description:
      "1 in 4 online fashion orders gets returned. Time, money, and the planet all pay the price.",
    Icon: Scissors,
  },
];

export const LandingPageProblems = ({ id }: { id?: string }) => {
  return (
    <div
      id={id}
      className="flex h-fit w-full flex-col items-start justify-between gap-4 bg-background-secondary px-4 py-16 sm:px-16 lg:flex-row lg:items-center"
    >
      <div className="flex h-fit w-full flex-col items-start justify-center gap-4 lg:max-w-2xl">
        <span className="text-xs font-semibold text-text">THE REALITY</span>

        <h1 className="text-6xl font-bold text-text">
          Shopping Fashion is <span className="text-accent">still broken.</span>
        </h1>

        <span className="text-sm text-text">
          We talked to shoppers, stylists and tailors from New York to Tokyo &
          Dublin to Delhi. The same three frustrations came up everywhere.
        </span>
      </div>
      <div className="flex w-auto flex-col items-center items-stretch justify-center gap-1 md:flex-row">
        {problems.map((item, index) => {
          return (
            <div
              key={index}
              className="flex flex-col items-start gap-2 bg-background-primary p-8"
            >
              <div className="flex w-full items-center justify-between">
                <span className="text-semibold text-sm text-accent">
                  {item.index}
                </span>
                <item.Icon size={20} className="text-contrast" />
              </div>
              <h3 className="text-lg font-semibold text-text">{item.title}</h3>
              <p className="text-sm text-text">{item.description}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
};
