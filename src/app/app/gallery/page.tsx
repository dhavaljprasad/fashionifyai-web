"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ButtonPrimary } from "@/components/modular/button";
import { ArrowLeft } from "lucide-react";
import { api } from "@/lib/api";
import { ImageViewer } from "@/components/gallery-page/image-viewer";

export type ImagesType = {
  image_url: string;
  conversation_id: string;
  conversation_type: string;
};

function GalleryPage() {
  const [images, setImages] = useState<ImagesType[]>([]);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const router = useRouter();

  const getAllImages = async () => {
    try {
      const imagesRes = await api.get("/api/gallery");
      setImages(imagesRes.data.images);
    } catch (e) {
      console.log("Unexpected error occured getting all Images as :", e);
    }
  };

  useEffect(() => {
    getAllImages();
  }, []);

  return (
    <div className="flex min-h-[100dvh] w-full flex-col gap-4 bg-background-primary p-4 sm:px-16">
      {selectedIndex !== null && (
        <ImageViewer
          images={images}
          initialIndex={selectedIndex}
          close={() => setSelectedIndex(null)}
        />
      )}
      <ButtonPrimary
        text="Back"
        onClick={() => router.back()}
        icon={ArrowLeft}
      />

      <div className="grid w-full grid-cols-3 gap-2 sm:grid-cols-4 sm:gap-4">
        {images.map((image, index) => (
          <div
            onClick={() => setSelectedIndex(index)}
            key={`${image.conversation_id}-${index}`}
            className="aspect-[2/3] overflow-hidden bg-background-secondary"
          >
            <img
              src={image.image_url}
              alt={`Generated image ${index + 1}`}
              className="h-full w-full scale-105 object-cover transition-transform duration-300 hover:scale-100"
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export default GalleryPage;
