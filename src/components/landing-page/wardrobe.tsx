"use client";

import { Camera, Sparkles, Calendar, Recycle } from "lucide-react";
import { Separator } from "../ui/separator";

const wardrobeItems = [
  {
    label: "Digitize your closet",
    description:
      "Snap each piece once. StitchAI tags fabric, color, cut, and season automatically.",
    icon: Camera,
  },
  {
    label: "Outfits from what you own",
    description:
      "AI pairs pieces you'd never think to combine — hundreds of looks, zero shopping.",
    icon: Sparkles,
  },
  {
    label: "Styled for the occasion",
    description:
      "Tell it 'Friday dinner' or 'first day back' — get 5 outfit ideas, previewed on you.",
    icon: Calendar,
  },
  {
    label: "Wear more, buy less",
    description:
      "Rediscover the 80% of your closet you forgot about. Shop only what fills a real gap.",
    icon: Recycle,
  },
];

export const LandingPageWardrobe = ({ id }: { id?: string }) => {
  return (
    <div
      id={id}
      className="flex h-fit w-full flex-col items-center bg-background-secondary justify-center gap-4 px-4 py-16 sm:px-16"
    >
      <div className="w-full h-auto flex flex-col items-center gap-8 justify-between lg:flex-row">
        <img
          src={
            "https://res.cloudinary.com/dli14hm5i/image/upload/v1782983957/wardrobe-flatlay_imuqbm.jpg"
          }
          alt="AI stylist image"
          className=" w-full lg:w-1/3"
        />
        <div className="w-full flex flex-col items-start justify-center gap-2">
          <span className="text-xs font-semibold text-text">
            AI WARDROBE STYLIST
          </span>
          <h1 className="text-left text-6xl font-bold text-text">
            A personal stylist that knows{" "}
            <span className="text-accent">every piece you own.</span>
          </h1>
          <span className="text-left text-sm text-text">
            Most people wear 20% of their wardrobe. FashionifyAI photographs
            your closet, understands each garment, and builds outfit
            combinations from what's already hanging in front of you — no
            shopping required
          </span>
        </div>
      </div>
      <div className="w-full h-auto grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        {wardrobeItems.map((item, index) => (
          <div key={index} className="w-full py-4">
            <div className="flex items-center gap-2">
              <item.icon size={18} className="text-accent" />
              <span className="text-sm font-semibold text-accent">
                {item.label}
              </span>
            </div>
            <span className="text-sm text-text block mt-2">
              {item.description}
            </span>
            <Separator className="bg-text mt-4" />
          </div>
        ))}
      </div>
    </div>
  );
};
