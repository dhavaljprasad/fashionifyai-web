"use client";

type Segment = "visualization" | "ai stylist";

interface SegmentedFloatingButtonProps {
  selected: Segment;
  onChange: (value: Segment) => void;
}

const options: { label: string; value: Segment }[] = [
  {
    label: "Visualization",
    value: "visualization",
  },
  {
    label: "AI Stylist",
    value: "ai stylist",
  },
];

export const SegmentedFloatingButton = ({
  selected,
  onChange,
}: SegmentedFloatingButtonProps) => {
  return (
    <div className="fixed bottom-8 sm:bottom-12 left-1/2 -translate-x-1/2 flex items-center bg-background-secondary  shadow-lg">
      {options.map((option) => {
        const isSelected = selected === option.value;

        return (
          <button
            key={option.value}
            type="button"
            onClick={() => onChange(option.value)}
            className={`p-3 transition-all duration-200 cursor-pointer ${
              isSelected
                ? "bg-contrast text-background-primary"
                : "text-accent hover:bg-background-tertiary"
            }`}
          >
            <span className="font-semibold text-sm sm:text-base">
              {option.label}
            </span>
          </button>
        );
      })}
    </div>
  );
};
