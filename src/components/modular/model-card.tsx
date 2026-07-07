"use client";

type ModelCardDataType = {
  name?: string;
  model_name?: string;
  gender?: string;
  image_url?: string;
  measurements?: unknown;
};

export const ModelCard = ({ data }: { data: ModelCardDataType }) => {
  const name = data.name ?? data.model_name ?? "Model";
  const gender = data.gender ?? "Unknown";
  const imageUrl = data.image_url;

  return (
    <div className="w-40 overflow-hidden rounded-2xl border border-white/15 bg-white/10 shadow-sm backdrop-blur-sm">
      <div className="aspect-[2/3] w-full bg-zinc-900/70">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={name}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-sm text-zinc-400">
            No image
          </div>
        )}
      </div>

      <div className="space-y-1 p-3">
        <p className="truncate text-sm font-semibold text-white">{name}</p>
        <p className="text-xs capitalize text-zinc-300">{gender}</p>
      </div>
    </div>
  );
};
