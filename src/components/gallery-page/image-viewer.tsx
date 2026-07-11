"use client";

import * as React from "react";
import { X } from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel";
import { ButtonPrimary } from "../modular/button";
import { ImagesType } from "@/app/app/gallery/page";

export const ImageViewer = ({
  images,
  initialIndex,
  close,
}: {
  images: ImagesType[];
  initialIndex: number;
  close: () => void;
}) => {
  const [api, setApi] = React.useState<CarouselApi | null>(null);
  const [activeIndex, setActiveIndex] = React.useState(initialIndex);

  React.useEffect(() => {
    if (!api) return;

    const updateActiveIndex = () => {
      setActiveIndex(api.selectedScrollSnap());
    };

    updateActiveIndex();
    api.on("select", updateActiveIndex);

    return () => {
      api.off("select", updateActiveIndex);
    };
  }, [api]);

  const currentImage = images[activeIndex] ?? images[0];

  const handleDownload = () => {
    if (!currentImage) return;
    const link = document.createElement("a");
    link.href = currentImage.image_url;
    link.download = `image-${activeIndex + 1}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="absolute inset-0 z-20 flex h-screen w-full flex-col items-center justify-start backdrop-blur-sm">
      <div className="flex w-full items-center justify-between p-4 sm:px-16">
        <h1>Image Viewer</h1>
        <div className="flex w-auto items-center justify-end gap-2">
          <ButtonPrimary text="Download" onClick={handleDownload} />
          <ButtonPrimary text="Close" onClick={() => close()} icon={X} />
        </div>
      </div>

      <div className="flex h-full w-full items-center justify-center p-4">
        {images.length > 1 ? (
          <Carousel
            className="w-full max-w-[90vw]"
            opts={{
              loop: true,
              startIndex: initialIndex,
            }}
            setApi={setApi}
          >
            <CarouselContent>
              {images.map((imageUrl, index) => (
                <CarouselItem
                  key={index}
                  className="flex items-center justify-center"
                >
                  <img
                    src={imageUrl.image_url}
                    alt={`Image ${index + 1}`}
                    className="h-auto max-h-[80vh] w-auto max-w-[80vw] rounded-2xl object-contain shadow-xl"
                  />
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="hidden sm:flex" />
            <CarouselNext className="hidden sm:flex" />
          </Carousel>
        ) : (
          <img
            src={images[0].image_url}
            alt="Image"
            className="h-auto max-h-[80vh] w-auto max-w-[80vw] rounded-2xl object-contain shadow-xl"
          />
        )}
      </div>
    </div>
  );
};
