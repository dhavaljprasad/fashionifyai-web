"use client";
import { X } from "lucide-react";

type PopUpSizeType = "small" | "large";

export const PopUp = ({
  size,
  header,
  closePopUp,
  component,
}: {
  size: PopUpSizeType;
  header: string;
  closePopUp: () => void;
  component: React.ReactNode;
}) => {
  return (
    <div className="fixed inset-0 z-[10000] flex items-center justify-center bg-background-secondary/50 p-3 sm:p-6">
      <div
        className={`flex flex-col overflow-hidden bg-background-primary ${size === "small" ? "h-64 w-96" : "h-[90vh] sm:h-fit w-[90vw] max-h-[900px] max-w-[1200px]"}`}
      >
        <div className="flex h-14 w-full items-center justify-between p-4">
          <h1 className="text-xl font-bold text-contrast sm:text-2xl m-0">
            {header}
          </h1>
          <X
            size={24}
            className="cursor-pointer text-contrast"
            onClick={closePopUp}
          />
        </div>
        <div className="min-h-0 w-full h-fit overflow-hidden p-2 sm:p-4">
          <div className="h-full w-full overflow-auto">{component}</div>
        </div>
      </div>
    </div>
  );
};
