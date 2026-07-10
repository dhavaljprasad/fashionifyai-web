"use client";
import { LucideIcon } from "lucide-react";

type ControlButtonType = {
  label: string;
  icon: LucideIcon;
};

export const SegmentedControlButtons = ({
  data,
  selected,
  onChange,
}: {
  data: ControlButtonType[];
  selected: string;
  onChange: (label: string) => void;
}) => {
  return (
    <div className="w-full h-auto flex bg-background-secondary gap-2 flex-row sm:flex-col items-center sm:justify-center justify-between">
      {data.map((item, index) => {
        const Icon = item.icon;
        return (
          <div
            key={index}
            onClick={() => onChange(item.label)}
            className={`flex w-full items-center justify-center sm:justify-start gap-2 px-4 py-2 cursor-pointer hover:bg-background-primary ${selected == item.label ? "bg-contrast hover:bg-contrast" : ""} `}
          >
            <Icon
              size={18}
              className={`${selected == item.label ? "text-background-primary" : ""}`}
            />
            <span
              className={`hidden sm:block ${selected == item.label ? "text-background-primary" : ""}`}
            >
              {item.label}
            </span>
          </div>
        );
      })}
    </div>
  );
};
