"use client";

import { SendHorizontal } from "lucide-react";

interface InputBoxProps {
  value: string;
  setValue: (value: string) => void;
}

export const InputBox = ({ value, setValue }: InputBoxProps) => {
  return (
    <div className="fixed bottom-4 z-5 h-14 w-full px-4 sm:px-16">
      <div className="flex h-full w-full items-center justify-center gap-2 bg-white/80 p-2 transition-colors duration-200 focus-within:bg-white">
        <input
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          className="flex-1 bg-transparent text-base sm:text-lg font-semibold text-background-primary outline-none"
        />
        <div className="flex aspect-square h-full items-center justify-center bg-accent">
          <SendHorizontal size={24} className="text-white" />
        </div>
      </div>
    </div>
  );
};
