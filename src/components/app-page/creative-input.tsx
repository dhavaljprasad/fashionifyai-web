"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronDown, Check } from "lucide-react";
import { ButtonSecondary } from "../modular/button";
import { ModelCardDataType } from "./model-card";

export const CreativeInputBox = ({
  modelsData,
}: {
  modelsData: ModelCardDataType[];
}) => {
  const [selectedModel, setSelectedModel] = useState<ModelCardDataType | null>(
    modelsData[0] ?? null,
  );

  return (
    <div className="w-[90vw] sm:w-[50vw] flex flex-col gap-2 bg-background-secondary p-4 focus-within:shadow-xl/20 focus-within:shadow-accent">
      <input
        type="text"
        className="w-full text-contrast text-base outline-none"
        placeholder="How can I help you today?"
      />

      <div className="w-full flex items-center justify-between gap-2">
        {modelsData.length > 0 && selectedModel ? (
          <Dropdown
            modelsData={modelsData}
            selectedModel={selectedModel}
            onSelect={setSelectedModel}
          />
        ) : (
          <div className="h-12 px-3 flex items-center text-accent font-medium">
            Default Wardrobe
          </div>
        )}

        <ButtonSecondary
          text="Send"
          onClick={() => {
            console.log(selectedModel);
          }}
        />
      </div>
    </div>
  );
};

const Dropdown = ({
  modelsData,
  selectedModel,
  onSelect,
}: {
  modelsData: ModelCardDataType[];
  selectedModel: ModelCardDataType;
  onSelect: (model: ModelCardDataType) => void;
}) => {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  return (
    <div ref={dropdownRef} className="relative w-64 h-12">
      {/* Trigger */}
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className={`absolute inset-0 w-full h-12 px-3 flex items-center justify-between transition-all ${
          open
            ? "opacity-0 pointer-events-none"
            : "opacity-100 hover:bg-contrast hover:text-background-primary"
        }`}
      >
        <div className="flex items-center gap-3 min-w-0">
          <img
            src={selectedModel.image_url}
            alt={selectedModel.name}
            className="w-8 h-8 object-cover flex-shrink-0"
          />

          <span className="truncate">{selectedModel.name}</span>
        </div>

        <ChevronDown size={18} className="flex-shrink-0" />
      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute inset-0 w-full bg-background-secondary shadow-xl z-50">
          {modelsData.map((model) => {
            const isSelected = model.model_id === selectedModel.model_id;

            return (
              <button
                key={model.model_id}
                type="button"
                onClick={() => {
                  onSelect(model);
                  setOpen(false);
                }}
                className={`w-full h-12 px-3 flex items-center justify-between transition-colors ${
                  isSelected
                    ? "bg-contrast text-background-primary"
                    : "bg-background-secondary hover:bg-background-primary hover:text-contrast"
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <img
                    src={model.image_url}
                    alt={model.name}
                    className="w-8 h-8 object-cover flex-shrink-0"
                  />

                  <span className="truncate">{model.name}</span>
                </div>

                {isSelected ? (
                  <Check size={18} />
                ) : (
                  <div className="w-[18px]" />
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};
