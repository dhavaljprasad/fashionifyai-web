"use client";
import { WordRotate } from "../ui/word-rotate";
import { NumberTicker } from "../ui/number-ticker";
import { Star } from "lucide-react";
import { Separator } from "../ui/separator";

const testimonialsData = [
  {
    rating: 5,
    review:
      "I stopped returning clothes. If it doesn't look right on the try-on, I just don't buy it",
    name: "Amelia Chen",
    shop: "Product Designer, Brooklyn",
    image:
      "https://res.cloudinary.com/dli14hm5i/image/upload/v1782992374/ChatGPT_Image_Jul_2_2026_05_08_10_PM_xyawkb.png",
  },
  {
    rating: 5,
    review:
      "It restyled my closet in an evening. I'm wearing pieces I forgot I owned.",
    name: "Sofia Rossi",
    shop: "Content Creator, Milan",
    image:
      "https://res.cloudinary.com/dli14hm5i/image/upload/v1782992374/ChatGPT_Image_Jul_2_2026_05_08_16_PM_riexyc.png",
  },
  {
    rating: 5,
    review:
      "I send my tailor the exact preview I want. Zero translation loss, first-fit results.",
    name: "Kwame Osei",
    shop: "Consultant, London",
    image:
      "https://res.cloudinary.com/dli14hm5i/image/upload/v1782992374/ChatGPT_Image_Jul_2_2026_05_09_00_PM_fedr6q.png",
  },
];

const testimonialsMetrics = [
  {
    label: "SHOPPERS STYLING",
    value: 149,
    type: "users",
  },
  {
    label: "FEWER RETURNS",
    value: 62,
    type: "sales",
  },
  {
    label: "AVERAGE RATING",
    value: 4,
    type: "rating",
  },
  {
    label: "AVERAGE RENDER TIME",
    value: 10,
    type: "render",
  },
];

export const LandingPageTestimonials = () => {
  return (
    <div className="flex h-fit w-full flex-col items-center justify-center gap-4 bg-contrast px-4 py-16 sm:px-16">
      <span className="text-xs font-semibold text-accent">
        REAL PEOPLE. REAL CLOSETS. REAL RESULTS.
      </span>
      <div className="flex h-auto w-full flex-col items-center justify-center gap-2 md:flex-row">
        <WordRotate
          words={["Shoppers", "Designers", "Shops", "Tailors", "Stylists"]}
          className="text-6xl font-bold text-accent"
        />
        <h1 className="text-center text-6xl font-bold text-background-primary">
          already love it!
        </h1>
      </div>
      <div className="grid h-auto w-full grid-cols-1 gap-1 md:grid-cols-2 lg:grid-cols-3">
        {testimonialsData.map((item, index) => (
          <div key={index} className="flex flex-col items-start gap-4 p-4">
            <div className="flex items-center gap-1">
              {[...Array(item.rating)].map((_, i) => (
                <Star
                  key={i}
                  size={16}
                  color="#d10084"
                  fill="#d10084"
                  // className="text-accent"
                />
              ))}
            </div>
            <h3 className="text-lg font-semibold text-background-primary">
              "{item.review}"
            </h3>
            <Separator className="bg-text" />
            <div className="flex h-auto w-full items-center justify-start gap-2">
              <img
                src={item.image}
                alt={item.name}
                className="h-16 w-16 object-cover"
              />
              <div className="flex flex-col">
                <span className="text-sm font-semibold text-background-primary">
                  {item.name}
                </span>
                <span className="text-xs text-gray-500">{item.shop}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-12 grid h-auto w-full grid-cols-2 gap-1 lg:grid-cols-4">
        {testimonialsMetrics.map((item, index) => (
          <div key={index} className="flex flex-col items-center gap-2">
            <div className="flex items-end justify-center gap-1">
              <NumberTicker
                value={item.value}
                className="text-4xl font-semibold text-background-primary"
              />
              {item.type === "users" && (
                <span className="text-lg font-semibold text-background-primary">
                  +
                </span>
              )}
              {item.type === "sales" && (
                <span className="text-lg font-semibold text-background-primary">
                  %
                </span>
              )}
              {item.type === "rating" && (
                <span className="text-lg font-semibold text-background-primary">
                  /5
                </span>
              )}
              {item.type === "render" && (
                <span className="text-lg font-semibold text-background-primary">
                  s
                </span>
              )}
            </div>
            <span className="text-sm text-background-secondary">
              {item.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
