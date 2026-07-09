"use client";

export type ModelCardDataType = {
  name: string;
  gender: string;
  image_url: string;
  model_id: string;
};

export const ModelCard = ({
  data,
  selectImage,
}: {
  data: ModelCardDataType;
  selectImage: () => void;
}) => {
  return (
    <div
      className="w-40 overflow-hidden rounded-2xl border border-white/15 bg-white/10 shadow-sm backdrop-blur-sm"
      onClick={() => selectImage()}
    >
      <div className="aspect-[2/3] w-full bg-zinc-900/70">
        {data.image_url ? (
          <img
            src={data.image_url}
            alt={data.name}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-sm text-zinc-400">
            No image
          </div>
        )}
      </div>

      <div className="space-y-1 p-3">
        <p className="truncate text-sm font-semibold text-white">{data.name}</p>
        <p className="text-xs capitalize text-zinc-300">{data.gender}</p>
      </div>
    </div>
  );
};
