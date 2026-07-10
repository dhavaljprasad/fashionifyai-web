"use client";
import type { ModelDataType } from "./models-section";

type ModelCardType = Pick<
  ModelDataType,
  "name" | "model_id" | "image_url" | "gender"
>;

export const ModelCard = ({
  data,
  onClick,
}: {
  data: ModelCardType;
  onClick: (id: string) => void;
}) => {
  return (
    <div
      className="w-full h-auto flex flex-col items-center justify-center"
      onClick={() => onClick(data.model_id)}
    >
      <img className="w-full aspect-[2/3] object-cover" src={data.image_url} />
      <div className="w-full flex items-center justify-between bg-background-secondary p-4">
        <h1 className="text-sm font-semibold text-contrast">{data.name}</h1>
        <span className="text-xs text-contrast">{data.gender}</span>
      </div>
    </div>
  );
};

export default ModelCard;
