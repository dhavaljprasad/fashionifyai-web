"use client";
import { ButtonPrimary } from "../modular/button";
import { WordRotate } from "../ui/word-rotate";

const wordsArray = ["Amazon", "Flipkart", "Myntra", "Nyka", "Ajio", "Meesho"];

interface PriceCompareHeroSectionTypes {
  value: string;
  setValue: (e: string) => void;
  search: () => void;
}

export const PriceCompareHeroSection = ({
  value,
  setValue,
  search,
}: PriceCompareHeroSectionTypes) => {
  return (
    <div className="flex flex-col gap-4 items-center justify-center">
      <span className="text-2xl sm:text-4xl font-semibold text-center">
        Find Real Deals, Skip the Fake One across
      </span>
      <WordRotate
        words={wordsArray}
        className="text-4xl font-bold text-accent"
      />
      <div className="w-full sm:max-w-4xl flex items-center bg-background-secondary justify-center gap-2  p-4 focus-within:shadow-xl/20 focus-within:shadow-accent">
        <input
          type="text"
          className="w-full flex-1 text-contrast text-base outline-none"
          placeholder="https://www.amazon.in/Amul-Fruit-Nut-Chocolate-Love"
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />
        <ButtonPrimary text="Compare" onClick={() => search()} />
      </div>
    </div>
  );
};
