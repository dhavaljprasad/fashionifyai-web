"use client";

import {
  LocalImageSelection,
  IMAGE_WEBP_CONTENT_TYPE,
  uploadBlobToPresignedUrl,
} from "@/lib/upload";
import { api } from "@/lib/api";
import { Images, Plus, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { ButtonPrimary } from "@/components/modular/button";

const MAX_WARDROBE_IMAGES = 5;

export const WardrobeUploadPopUp = ({
  onClose,
  model_id,
}: {
  onClose: () => void;
  model_id?: string | null;
}) => {
  const [selectedImages, setSelectedImages] = useState<LocalImageSelection[]>(
    [],
  );
  const [activePreviewUrl, setActivePreviewUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const selectedImagesRef = useRef<LocalImageSelection[]>([]);

  const activePreview = activePreviewUrl
    ? (selectedImages.find((image) => image.previewUrl === activePreviewUrl) ??
      null)
    : null;

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
        audio: false,
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.error(err);
    }
  };

  const onDiscardImage = (previewUrl: string) => {
    const imageToRemove = selectedImages.find(
      (image) => image.previewUrl === previewUrl,
    );
    if (imageToRemove) {
      URL.revokeObjectURL(imageToRemove.previewUrl);
    }

    const nextImages = selectedImages.filter(
      (image) => image.previewUrl !== previewUrl,
    );
    setSelectedImages(nextImages);
    setActivePreviewUrl(nextImages.at(-1)?.previewUrl ?? null);

    if (nextImages.length === 0) {
      startCamera();
    }
  };

  const captureImage = () => {
    if (selectedImages.length >= MAX_WARDROBE_IMAGES) return;

    const video = videoRef.current;
    if (!video) return;

    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d")!;

    const videoWidth = video.videoWidth;
    const videoHeight = video.videoHeight;

    const targetRatio = 2 / 3;

    let cropWidth = videoWidth;
    let cropHeight = videoWidth / targetRatio;

    if (cropHeight > videoHeight) {
      cropHeight = videoHeight;
      cropWidth = videoHeight * targetRatio;
    }

    const startX = (videoWidth - cropWidth) / 2;
    const startY = (videoHeight - cropHeight) / 2;

    const targetWidth = 1024;
    const targetHeight = 1536;

    canvas.width = targetWidth;
    canvas.height = targetHeight;

    ctx.drawImage(
      video,
      startX,
      startY,
      cropWidth,
      cropHeight,
      0,
      0,
      targetWidth,
      targetHeight,
    );

    canvas.toBlob(
      (blob) => {
        if (!blob) return;

        const nextImage: LocalImageSelection = {
          kind: "local",
          previewUrl: URL.createObjectURL(blob),
          blob,
          contentType: IMAGE_WEBP_CONTENT_TYPE,
        };

        setSelectedImages((prev) => {
          if (prev.length >= MAX_WARDROBE_IMAGES) {
            URL.revokeObjectURL(nextImage.previewUrl);
            return prev;
          }

          return [...prev, nextImage];
        });
        setActivePreviewUrl(nextImage.previewUrl);
      },
      IMAGE_WEBP_CONTENT_TYPE,
      0.8,
    );
  };

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (selectedImages.length >= MAX_WARDROBE_IMAGES) return;

    const file = e.target.files?.[0];
    if (!file) return;

    const img = new Image();
    const url = URL.createObjectURL(file);

    img.onload = () => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const targetRatio = 2 / 3;

      let cropWidth = img.width;
      let cropHeight = img.width / targetRatio;

      if (cropHeight > img.height) {
        cropHeight = img.height;
        cropWidth = img.height * targetRatio;
      }

      const startX = (img.width - cropWidth) / 2;
      const startY = (img.height - cropHeight) / 2;

      const targetWidth = 1024;
      const targetHeight = 1536;

      canvas.width = targetWidth;
      canvas.height = targetHeight;

      ctx.drawImage(
        img,
        startX,
        startY,
        cropWidth,
        cropHeight,
        0,
        0,
        targetWidth,
        targetHeight,
      );

      canvas.toBlob(
        (blob) => {
          if (!blob) return;

          const nextImage: LocalImageSelection = {
            kind: "local",
            previewUrl: URL.createObjectURL(blob),
            blob,
            contentType: IMAGE_WEBP_CONTENT_TYPE,
          };

          setSelectedImages((prev) => {
            if (prev.length >= MAX_WARDROBE_IMAGES) {
              URL.revokeObjectURL(nextImage.previewUrl);
              return prev;
            }

            return [...prev, nextImage];
          });
          setActivePreviewUrl(nextImage.previewUrl);
        },
        IMAGE_WEBP_CONTENT_TYPE,
        0.8,
      );

      URL.revokeObjectURL(url);
    };

    img.src = url;
    e.target.value = "";
  };

  const addAnotherImage = () => {
    if (selectedImages.length >= MAX_WARDROBE_IMAGES) return;

    setActivePreviewUrl(null);
    startCamera();
  };

  const handleUpload = async () => {
    if (uploading || selectedImages.length === 0) return;

    try {
      setUploading(true);

      const fileNames = selectedImages.map(
        (_, index) =>
          `wardrobe_${Date.now()}_${index}_${Math.random().toString(36).slice(2, 8)}.webp`,
      );

      const uploadCreds = await api.post("/api/wardrobe/init-upload", {
        file_names: fileNames,
        model_id: model_id ?? null,
      });

      const uploadCredsArray = uploadCreds.data.r2_creds;

      const imageUrls: string[] = [];

      await Promise.all(
        selectedImages.map((image, index) => {
          const { upload_url, url } = uploadCredsArray[index];
          imageUrls.push(url);
          return uploadBlobToPresignedUrl({
            uploadUrl: upload_url,
            blob: image.blob,
            contentType: image.contentType,
          });
        }),
      );

      await api.post("/api/wardrobe/upload", {
        img_urls: imageUrls,
        model_id: model_id ?? null,
      });
    } catch (e) {
      console.log("Unexpected error occured uploading wardrobe images", e);
      setUploading(false);
      onClose();
    } finally {
      window.location.reload();
    }
  };

  useEffect(() => {
    startCamera();
  }, []);

  useEffect(() => {
    selectedImagesRef.current = selectedImages;
  }, [selectedImages]);

  useEffect(() => {
    return () => {
      selectedImagesRef.current.forEach((image) =>
        URL.revokeObjectURL(image.previewUrl),
      );
    };
  }, []);

  return (
    <div className="flex h-full w-full flex-col items-center gap-4">
      <div className="flex w-full max-w-[min(360px,calc(52dvh*2/3),calc(90vw-2rem))] flex-col items-start justify-start gap-2">
        {activePreview ? (
          <div className="w-full pb-12">
            <div className="relative w-full">
              <div className="overflow-hidden rounded-2xl bg-black shadow-lg">
                <div className="aspect-[2/3] w-full">
                  <img
                    src={activePreview.previewUrl}
                    alt="Captured preview"
                    className="h-full w-full object-cover"
                  />
                </div>
              </div>

              <div className="absolute inset-x-0 -bottom-12 flex h-24 items-center justify-around bg-gradient-to-t from-black/70 via-black/40 to-transparent">
                <button
                  type="button"
                  className="flex h-24 w-24 items-center justify-center  bg-contrast shadow-lg"
                  onClick={() =>
                    uploading ? null : onDiscardImage(activePreview.previewUrl)
                  }
                >
                  <X className="text-accent" />
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="w-full pb-12">
            <div className="relative w-full">
              <div className="overflow-hidden rounded-2xl bg-black shadow-lg">
                <div className="aspect-[2/3] w-full">
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    className="h-full w-full object-cover"
                  />
                </div>
              </div>

              <div className="absolute inset-x-0 -bottom-12 z-100 flex h-24 items-center justify-evenly bg-gradient-to-t from-black/70 via-black/40 to-transparent">
                <button
                  type="button"
                  className={`flex h-24 w-24 items-center justify-center bg-contrast shadow-lg ${
                    uploading || selectedImages.length >= MAX_WARDROBE_IMAGES
                      ? "cursor-not-allowed opacity-60"
                      : "cursor-pointer"
                  }`}
                  onClick={() => (uploading ? null : inputRef.current?.click())}
                >
                  <Images className="text-accent" size={24} />
                </button>
                <button
                  type="button"
                  className={`h-24 w-24 bg-accent shadow-lg ${
                    uploading || selectedImages.length >= MAX_WARDROBE_IMAGES
                      ? "cursor-not-allowed opacity-60"
                      : "cursor-pointer"
                  }`}
                  onClick={() => (uploading ? null : captureImage())}
                />
              </div>
            </div>
          </div>
        )}
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFile}
        />
        <div className="flex w-full items-center gap-2 overflow-x-auto rounded-2xl bg-background-primary/70 p-2 scrollbar-thin scrollbar-thumb-text scrollbar-track-transparent">
          {selectedImages.map((image, index) => (
            <button
              type="button"
              key={image.previewUrl}
              className={`relative h-20 w-14 shrink-0 overflow-hidden rounded-xl border transition-colors duration-200 ${
                activePreview?.previewUrl === image.previewUrl
                  ? "border-accent"
                  : "border-transparent"
              }`}
              onClick={() => setActivePreviewUrl(image.previewUrl)}
            >
              <img
                src={image.previewUrl}
                alt={`Wardrobe item ${index + 1}`}
                className="h-full w-full object-cover"
              />
              <span className="absolute bottom-1 left-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-black/70 px-1 text-[10px] font-semibold text-white">
                {index + 1}
              </span>
            </button>
          ))}
          <button
            type="button"
            className={`flex h-20 w-14 shrink-0 items-center justify-center rounded-xl border border-dashed border-accent/70 bg-background-secondary text-accent transition-colors duration-200 hover:bg-background-primary ${
              selectedImages.length >= MAX_WARDROBE_IMAGES
                ? "cursor-not-allowed opacity-50"
                : uploading
                  ? "cursor-not-allowed opacity-50"
                  : "cursor-pointer"
            }`}
            onClick={() => (uploading ? null : addAnotherImage())}
            aria-label="Add another wardrobe image"
          >
            <Plus size={20} />
          </button>
          <span className="ml-auto shrink-0 text-xs font-semibold text-text">
            {selectedImages.length}/{MAX_WARDROBE_IMAGES}
          </span>
        </div>
      </div>
      <div className="flex w-full max-w-[min(360px,calc(52dvh*2/3),calc(90vw-2rem))] justify-end">
        <ButtonPrimary
          text={uploading ? "Uploading..." : "Upload"}
          onClick={handleUpload}
          buttonClass={
            uploading || selectedImages.length === 0
              ? "pointer-events-none opacity-50"
              : ""
          }
        />
      </div>
    </div>
  );
};
