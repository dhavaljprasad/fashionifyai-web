"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { ButtonPrimary } from "@/components/modular/button";
import { ArrowLeft, Trash2 } from "lucide-react";
import { WardrobeData } from "@/components/profile/wardrobe-section";
import { api } from "@/lib/api";

function WardrobePage() {
  const [wardrobeData, setWardrobeData] = useState<WardrobeData>();
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const router = useRouter();

  const params = useParams();
  const model_id = params.model_id as string;

  const getWardrobe = async (model_id: string) => {
    try {
      const wardrobeRes = await api.get(`/api/wardrobe?model_id=${model_id}`);
      if (wardrobeRes.status === 200) {
        setWardrobeData(wardrobeRes.data);
      }
    } catch (e) {
      console.log("Unexpected error occured fetching all wardrobe as: ", e);
    }
  };

  const deleteItem = async (item_id: string) => {
    try {
      const delRes = await api.post("/api/wardrobe/delete", {
        item_id,
      });

      if (delRes.status === 200 && delRes.data) {
        setWardrobeData((prev) => {
          if (!prev) return prev;

          return {
            ...prev,
            items: prev.items.filter((item) => item.item_id !== item_id),
          };
        });
      }
    } catch (e) {
      console.log("Unexpected error occurred deleting wardrobe item:", e);
    }
  };

  useEffect(() => {
    if (!model_id || model_id === "null") {
      getWardrobe("general");
    } else {
      getWardrobe(model_id);
    }
  }, [model_id]);

  return (
    <div className="flex min-h-[100dvh] w-full flex-col gap-4 bg-background-primary p-4 sm:px-16">
      <ButtonPrimary
        text="Back"
        onClick={() => router.back()}
        icon={ArrowLeft}
      />
      <div className="grid w-full grid-cols-3 gap-2 sm:grid-cols-4 sm:gap-4">
        {wardrobeData?.items.map((wardrobeItem, wardrobeIndex) => (
          <div
            className="w-full h-full flex flex-col items-center"
            key={wardrobeIndex}
            onMouseEnter={() => setHoveredIndex(wardrobeIndex)}
            onMouseLeave={() => setHoveredIndex(null)}
          >
            <div className="relative">
              <img src={wardrobeItem.image_url} className="full aspect-[2/3]" />

              <button
                onClick={() => deleteItem(wardrobeItem.item_id)}
                className={`absolute top-2 right-2 p-1.5 bg-white/90 shadow-md transition-opacity duration-200 hover:bg-red-500 hover:text-white cursor-pointer ${
                  hoveredIndex === wardrobeIndex
                    ? "opacity-100"
                    : "opacity-0 pointer-events-none"
                }`}
              >
                <Trash2 size={16} />
              </button>
            </div>

            <span className="mt-2 text-sm text-text truncate max-w-43">
              {wardrobeItem.name}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default WardrobePage;
