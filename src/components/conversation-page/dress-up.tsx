"use client";
import {
  useState,
  useEffect,
  useRef,
  useCallback,
  type Dispatch,
  type SetStateAction,
} from "react";
import { ConversationData } from "../../app/app/visualizer/[conversation_id]/page";
import { useParams } from "next/navigation";
import { ButtonGroup } from "../modular/button";
import { DressUpConfig } from "../../utils/dress-up";
import { api } from "@/lib/api";
import { Plus, X, Images, ArrowRight, SwitchCamera } from "lucide-react";
import {
  IMAGE_WEBP_CONTENT_TYPE,
  uploadBlobToPresignedUrl,
} from "@/lib/upload";

interface CapturedImagesType {
  for: string;
  previewUrl: string;
  blob: Blob;
  contentType: typeof IMAGE_WEBP_CONTENT_TYPE;
}

export const DressUpComponent = ({
  setConversationData,
  setPoolingId,
}: {
  setPoolingId: Dispatch<SetStateAction<string>>;
  setConversationData: Dispatch<SetStateAction<ConversationData[]>>;
}) => {
  const [activeTab, setActiveTab] =
    useState<keyof typeof DressUpConfig>("Women");
  const [selectedOutfit, setSelectedOutfit] = useState<string>("");
  const [capturedImages, setCapturedImages] = useState<CapturedImagesType[]>(
    [],
  );
  const [cameraFor, setCameraFor] = useState<string>("");
  const [openCamera, setOpenCamera] = useState<boolean>(false);
  const [uploading, setUploading] = useState<boolean>(false);
  const [customInstruction, setCustomInstruction] = useState("");
  const [rearCameras, setRearCameras] = useState<MediaDeviceInfo[]>([]);
  const [currentCameraIndex, setCurrentCameraIndex] = useState(0);

  const [showAllOutfits, setShowAllOutfits] = useState(false);

  const selectedOutfitConfig = DressUpConfig[activeTab].find(
    (item) => item.name === selectedOutfit,
  );
  const requiredNeeds =
    selectedOutfitConfig?.needs.filter((item) => !item.optional) ?? [];
  const hasRequiredFabricImages =
    requiredNeeds.length > 0 &&
    requiredNeeds.every((item) =>
      capturedImages.some((img) => img.for === item.name),
    );

  const outfits = DressUpConfig[activeTab];

  const visibleOutfits = showAllOutfits ? outfits : outfits.slice(0, 5);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const params = useParams();

  const handleTabChange = (tab: keyof typeof DressUpConfig) => {
    setActiveTab(tab);
    setSelectedOutfit("");
    setCapturedImages([]);
    setCustomInstruction("");
    setShowAllOutfits(false);
  };

  const tabsData = [
    {
      text: "Women",
      onClick: () => handleTabChange("Women"),
    },
    {
      text: "Men",
      onClick: () => handleTabChange("Men"),
    },
    {
      text: "Others",
      onClick: () => handleTabChange("Others"),
    },
  ];

  const clearSelectedOutfit = () => {
    setSelectedOutfit("");
    setCapturedImages([]);
    setCustomInstruction("");
    setOpenCamera(false);
    setCameraFor("");
  };

  const stopCamera = useCallback(() => {
    if (!videoRef.current?.srcObject) return;

    const oldStream = videoRef.current.srcObject as MediaStream;
    oldStream.getTracks().forEach((track) => track.stop());
    videoRef.current.srcObject = null;
  }, []);

  const startCamera = useCallback(async (deviceId?: string) => {
    try {
      stopCamera();

      const stream = await navigator.mediaDevices.getUserMedia({
        video: deviceId
          ? { deviceId: { exact: deviceId } }
          : { facingMode: { ideal: "environment" } },
        audio: false,
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.error(err);
    }
  }, [stopCamera]);

  const onClickOfFabric = (itemName: string) => {
    setCameraFor(itemName);
    setOpenCamera(true);
  };

  const openPicker = () => {
    inputRef.current?.click();
  };

  const captureImage = () => {
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

        setCapturedImages((prev) => [
          ...prev.filter((img) => img.for !== cameraFor),
          {
            for: cameraFor,
            previewUrl: URL.createObjectURL(blob),
            blob,
            contentType: IMAGE_WEBP_CONTENT_TYPE,
          },
        ]);
        setOpenCamera(false);
        setCameraFor("");
      },
      IMAGE_WEBP_CONTENT_TYPE,
      0.8,
    );
  };

  const switchCamera = async () => {
    if (rearCameras.length <= 1) return;

    const nextIndex = (currentCameraIndex + 1) % rearCameras.length;

    await startCamera(rearCameras[nextIndex].deviceId);

    setCurrentCameraIndex(nextIndex);
  };

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
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

          const finalUrl = URL.createObjectURL(blob);
          setCapturedImages((prev) => [
            ...prev.filter((img) => img.for !== cameraFor),
            {
              for: cameraFor,
              previewUrl: finalUrl,
              blob,
              contentType: IMAGE_WEBP_CONTENT_TYPE,
            },
          ]);
          setOpenCamera(false);
          setCameraFor("");
        },
        IMAGE_WEBP_CONTENT_TYPE,
        0.8,
      );

      URL.revokeObjectURL(url);
    };
    img.src = url;
  };

  const onDiscardImage = (forItem: string) => {
    setCapturedImages((prev) => prev.filter((img) => img.for !== forItem));
  };

  const onSelectOutfit = (itemName: string) => {
    setSelectedOutfit(itemName);
    setCapturedImages([]);
    setCustomInstruction("");
  };

  const onGeneratePreview = async () => {
    if (uploading) return;
    if (!selectedOutfit || !hasRequiredFabricImages) return;

    setUploading(true);

    try {
      const conversation_id = params.conversation_id as string;

      const file_names = capturedImages.map(
        (item) => `${item.for.replace(/\s+/g, "_")}.webp`,
      );

      const convRes = await api.post(
        "/api/conversation/init-multiple-uploads",
        {
          conversation_id,
          file_names,
        },
      );

      if (convRes.status !== 200) return;

      const r2_creds = convRes.data.r2_creds || [];

      if (r2_creds.length !== capturedImages.length) {
        throw new Error("Mismatch between images and upload credentials.");
      }

      const uploadedImages: string[] = [];
      const uploadedImagesUrl: string[] = [];

      for (let index = 0; index < capturedImages.length; index += 1) {
        const item = capturedImages[index];
        const { upload_url, url, file_path } = r2_creds[index];

        await uploadBlobToPresignedUrl({
          uploadUrl: upload_url,
          blob: item.blob,
          contentType: item.contentType,
        });

        uploadedImages.push(file_path.split("/").pop()!);
        uploadedImagesUrl.push(url);
      }

      const trimmedInstruction = customInstruction?.trim();

      const user_message = `Let's go with ${selectedOutfit}${
        trimmedInstruction ? ` & Custom Prompt: ${trimmedInstruction}` : ""
      }`;

      const saveMsgRes = await api.post(
        "/api/conversation/save-dress-up-images",
        {
          conversation_id,
          file_names: uploadedImages,
          text: user_message,
        },
      );

      if (saveMsgRes.status === 200) {
        const dressUpRes = await api.post("/api/conversation/dress-up", {
          conversation_id,
          uploaded_images: uploadedImages,
          dress: selectedOutfit,
          custom_instruction: customInstruction,
        });

        setConversationData((prev) => [
          ...prev,
          {
            role: "user",
            text: user_message,
            images: uploadedImagesUrl,
          },
        ]);

        setPoolingId(dressUpRes.data.pooling_id);
      }

      console.log("Uploaded images", uploadedImages);
    } catch (e) {
      console.error("Unexpected error occurred:", e);
    } finally {
      setUploading(false);
    }
  };

  useEffect(() => {
    if (!openCamera) return;

    let cancelled = false;

    const setupCamera = async () => {
      await startCamera();
      const devices = await navigator.mediaDevices.enumerateDevices();

      if (!cancelled) {
        setRearCameras(devices.filter((device) => device.kind === "videoinput"));
      }
    };

    setupCamera();

    return () => {
      cancelled = true;
      stopCamera();
    };
  }, [openCamera, startCamera, stopCamera]);

  return (
    <div
      className={`flex w-full flex-col items-center justify-center gap-3 bg-background-secondary p-4 transition-opacity duration-200 ${
        uploading ? "opacity-50" : "opacity-100"
      }`}
    >
      <span className="w-full text-left text-sm text-text">Who is it for?</span>
      <ButtonGroup
        data={tabsData}
        activeText={activeTab}
        wholeClass="w-full"
        buttonClass="w-full flex items-center justify-center"
      />
      <span className="w-full text-left text-sm text-text">Outfit Type</span>
      <div className="flex w-full flex-wrap gap-2">
        {selectedOutfit ? (
          <button
            type="button"
            className="flex cursor-pointer items-center gap-2 bg-background-primary px-3 py-2 text-sm font-semibold text-contrast"
            onClick={clearSelectedOutfit}
          >
            {selectedOutfit}
            <X size={16} className="text-accent" />
          </button>
        ) : (
          <>
            {visibleOutfits.map((item) => (
              <button
                type="button"
                key={item.name}
                className="cursor-pointer bg-background-primary px-3 py-2 text-sm font-semibold text-text transition-colors duration-200 hover:bg-contrast hover:text-background-primary"
                onClick={() => onSelectOutfit(item.name)}
              >
                {item.name}
              </button>
            ))}

            {outfits.length > 5 && (
              <button
                type="button"
                onClick={() => setShowAllOutfits((prev) => !prev)}
                className="cursor-pointer px-3 py-2 text-sm font-semibold text-accent"
              >
                {showAllOutfits ? "View less" : `+${outfits.length - 5} more`}
              </button>
            )}
          </>
        )}
      </div>
      {selectedOutfit && !openCamera && (
        <div className="flex h-auto w-full flex-col items-center justify-center gap-2">
          <span className="w-full text-left text-sm text-text">
            Fabric Images
          </span>
          <div className="grid h-auto w-full grid-cols-1 gap-2 md:grid-cols-2">
            {selectedOutfitConfig?.needs.map((item, key) => (
                <div
                  key={key}
                  className="flex h-auto w-full cursor-pointer items-center justify-between gap-2 bg-background-primary/70 p-2 transition-colors duration-200 hover:bg-background-primary"
                  onClick={() => onClickOfFabric(item.name)}
                >
                  <div className="flex items-center justify-start gap-2">
                    <div className="flex h-16 w-16 items-center justify-center overflow-hidden bg-background-primary">
                      {capturedImages.find((img) => img.for === item.name) ? (
                        <img
                          src={
                            capturedImages.find((img) => img.for === item.name)
                              ?.previewUrl
                          }
                          alt={item.name}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <Plus className="h-8 w-8 text-accent" />
                      )}
                    </div>
                    <h3 className="m-0 text-sm text-text">
                      {item.name} {item.optional && "(Optional)"}
                    </h3>
                  </div>
                  {capturedImages.find((img) => img.for === item.name) ? (
                    <X
                      className="text-accent"
                      onClick={(event) => {
                        event.stopPropagation();
                        onDiscardImage(item.name);
                      }}
                    />
                  ) : null}
                </div>
              ))}
          </div>
          {hasRequiredFabricImages && (
            <>
              <span className="w-full text-left text-sm text-text">
                Additional Prompt
              </span>
              <input
                className="w-full border-none bg-white/75 p-2 text-sm text-black outline-none transition-colors duration-200 focus:bg-white focus:ring-0 focus:outline-none"
                placeholder="Custom Instruction"
                value={customInstruction}
                onChange={(e) => setCustomInstruction(e.target.value)}
              />
            </>
          )}
        </div>
      )}
      {openCamera && (
        <div className="flex h-[80dvh] w-full flex-col items-center gap-3">
          <div className="flex w-full items-center justify-between bg-background-primary px-3 py-2">
            <div className="flex flex-col">
              <span className="text-xs text-text">Adding fabric for</span>
              <span className="text-sm font-semibold text-contrast">
                {cameraFor}
              </span>
            </div>
            <button
              type="button"
              className="flex h-9 w-9 cursor-pointer items-center justify-center bg-contrast"
              onClick={() => {
                setOpenCamera(false);
                setCameraFor("");
              }}
            >
              <X size={18} className="text-background-primary" />
            </button>
          </div>
          <div className="relative aspect-[2/3] h-fit max-h-[70dvh]">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              className="h-full w-full object-cover"
            />

            <div
              className="absolute right-6 top-6 flex flex-col items-center bg-accent p-2"
              onClick={() => switchCamera()}
            >
              <SwitchCamera className="text-contrast" />
            </div>

            <div className="absolute -bottom-12 z-5 flex h-24 w-full items-center justify-around">
              <div
                className="flex h-24 w-24 items-center justify-center bg-contrast"
                onClick={() => openPicker()}
              >
                <Images className="text-accent" />
              </div>

              <div
                className="flex h-24 w-24 items-center justify-center bg-accent"
                onClick={() => captureImage()}
              ></div>
            </div>

            <input
              ref={inputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFile}
            />
          </div>
        </div>
      )}
      <div
        className={`flex h-auto w-full items-center justify-center gap-2 text-accent ${
          uploading || !hasRequiredFabricImages
            ? "cursor-not-allowed opacity-60"
            : "cursor-pointer"
        }`}
        onClick={() => (uploading ? null : onGeneratePreview())}
      >
        <span className="text-sm font-semibold">Generate Preview</span>
        <ArrowRight />
      </div>
    </div>
  );
};
