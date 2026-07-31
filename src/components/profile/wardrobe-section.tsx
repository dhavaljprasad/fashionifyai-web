"use client";

import { ButtonPrimary, ButtonSecondary } from "../modular/button";
import { useRouter } from "next/navigation";
import { Marquee } from "../ui/marquee";
import { Separator } from "../ui/separator";
import { Plus, Trash2 } from "lucide-react";
import { api } from "@/lib/api";
import { useEffect, useState } from "react";

type WardrobeSectionProps = {
  openWardrobeUploadPopUp: (
    model_name?: string | null,
    model_id?: string | null,
  ) => void;
};

type WardrobeItem = {
  image_url: string;
  item_id: string;
  name: string;
};

export type WardrobeData = {
  title: string;
  items: WardrobeItem[];
  model_id: string;
};

export const WardrobeSection = ({
  openWardrobeUploadPopUp,
}: WardrobeSectionProps) => {
  const [wardrobeData, setWardrobeData] = useState<WardrobeData[]>([]);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const router = useRouter();

  const getAllWardrobe = async () => {
    try {
      const wardrobeRes = await api.get("/api/wardrobe");
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
        setWardrobeData((prev) =>
          prev.map((section) => ({
            ...section,
            items: section.items.filter((item) => item.item_id !== item_id),
          })),
        );
      }
    } catch (e) {
      console.log("Unexpected error occurred deleting wardrobe item:", e);
    }
  };

  useEffect(() => {
    getAllWardrobe();
  }, []);

  return (
    <div className="flex w-full flex-col items-start justify-start gap-4">
      <div className="flex w-full items-center justify-between">
        <h1 className="text-2xl font-semibold text-contrast">Wardrobe</h1>
      </div>
      <Separator className="w-full bg-accent" />
      {wardrobeData.map((item, index) => {
        return (
          <div
            key={index}
            className="w-full h-auto flex flex-col items-center justify-center gap-2"
          >
            <div className="w-full flex items-center justify-between">
              <span className="text-accent font-semibold max-w-[50%] truncate">
                {item.title} Wardrobe
              </span>
              <div className="flex items-center justify-end gap-2">
                <ButtonPrimary
                  icon={Plus}
                  onClick={() =>
                    openWardrobeUploadPopUp(item.title, item.model_id)
                  }
                />
                {item.items.length > 0 && (
                  <ButtonSecondary
                    text="View All"
                    onClick={() =>
                      router.push(`/app/wardrobe/${item.model_id}`)
                    }
                    buttonClass="w-fit"
                  />
                )}
              </div>
            </div>
            {item.items.length > 0 ? (
              <div className="relative w-full h-auto bg-background-secondary flex items-center justify-center overflow-x-hidden">
                <Marquee
                  pauseOnHover
                  className="[--duration:20s] w-full"
                  repeat={1}
                >
                  {item.items.map((wardrobeItem, wardrobeIndex) => (
                    <div
                      className="w-fit h-auto flex flex-col items-center"
                      key={wardrobeIndex}
                      onMouseEnter={() => setHoveredIndex(wardrobeIndex)}
                      onMouseLeave={() => setHoveredIndex(null)}
                    >
                      <div className="relative">
                        <img
                          src={wardrobeItem.image_url}
                          className="h-64 aspect-[2/3]"
                        />

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
                </Marquee>
              </div>
            ) : (
              <div className="w-full h-64 bg-background-secondary flex items-center justify-center">
                <span className="text-xs text-text">No Item for preview</span>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};
