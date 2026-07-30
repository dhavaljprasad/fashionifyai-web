"use client";

import { ButtonPrimary, ButtonSecondary } from "../modular/button";
import { Separator } from "../ui/separator";
import { Plus } from "lucide-react";
import { ModelDataType } from "./models-section";

type WardrobeSectionProps = {
  openWardrobeUploadPopUp: (model: ModelDataType | null) => void;
};

export const WardrobeSection = ({
  openWardrobeUploadPopUp,
}: WardrobeSectionProps) => {
  return (
    <div className="flex w-full flex-col items-start justify-start gap-4">
      <div className="flex w-full items-center justify-between">
        <h1 className="text-2xl font-semibold text-contrast">Wardrobe</h1>
      </div>
      <Separator className="w-full bg-accent" />
      <div className="w-full h-auto flex items-center justify-center gap-2">
        <div className="w-full items-center justify-between">
          <span className="text-accent font-semibold">Common Wardrobe</span>
        </div>
        <div className="w-full flex items-center justify-end gap-2">
          <ButtonPrimary
            onClick={() => openWardrobeUploadPopUp(null)}
            buttonClass=""
            icon={Plus}
          />
          <ButtonSecondary
            text="View All"
            onClick={() => {}}
            buttonClass="w-fit"
          />
        </div>
        <div></div>
      </div>
    </div>
  );
};
