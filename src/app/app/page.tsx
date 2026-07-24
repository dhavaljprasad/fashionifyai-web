"use client";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { AppPageHeader } from "@/components/app-page/header";
import { SideBar } from "@/components/modular/side-bar";
import { ModelCard, ModelCardDataType } from "@/components/app-page/model-card";
import { SegmentedFloatingButton } from "@/components/app-page/segmented-float-button";
import { api } from "@/lib/api";
import {
  IMAGE_WEBP_CONTENT_TYPE,
  type LocalImageSelection,
  uploadBlobToPresignedUrl,
} from "@/lib/upload";
import { useAuth } from "../providers/auth";
import { Check, X, Images, SwitchCamera } from "lucide-react";
import { CreativeInputBox } from "@/components/app-page/creative-input";
import { getRandomGreeting } from "@/utils/greetings";

type SelectedImage =
  | LocalImageSelection
  | {
      kind: "remote";
      previewUrl: string;
      source: "recent_photo" | "registered_model";
      imageUrl: string;
      modelId?: string;
    };

function AppPage() {
  const [showSidebar, setShowSidebar] = useState(false);
  const [selectedImage, setSelectedImage] = useState<SelectedImage | null>(
    null,
  );
  const [recentImages, setRecentImages] = useState<string[]>([]);
  const [userModels, setUserModels] = useState<ModelCardDataType[]>([]);
  const [uploading, setUploading] = useState(false);
  const [activeSection, setActiveSection] = useState<
    "visualization" | "ai stylist"
  >("visualization");
  const [rearCameras, setRearCameras] = useState<MediaDeviceInfo[]>([]);
  const [currentCameraIndex, setCurrentCameraIndex] = useState(0);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const { user } = useAuth();
  const { line, end } = getRandomGreeting();
  const router = useRouter();

  // camera functions
  const startCamera = async (deviceId?: string) => {
    try {
      // Stop previous stream
      if (videoRef.current?.srcObject) {
        const oldStream = videoRef.current.srcObject as MediaStream;
        oldStream.getTracks().forEach((track) => track.stop());
      }

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

        setSelectedImage({
          kind: "local",
          previewUrl: URL.createObjectURL(blob),
          blob,
          contentType: IMAGE_WEBP_CONTENT_TYPE,
        });
      },
      IMAGE_WEBP_CONTENT_TYPE,
      0.8,
    );
  };

  const getRearCameras = async () => {
    const devices = await navigator.mediaDevices.enumerateDevices();
    const rear = devices.filter((device) => device.kind === "videoinput");
    setRearCameras(rear);
  };

  const switchCamera = async () => {
    if (rearCameras.length <= 1) return;

    const nextIndex = (currentCameraIndex + 1) % rearCameras.length;

    await startCamera(rearCameras[nextIndex].deviceId);

    setCurrentCameraIndex(nextIndex);
  };

  // file functions
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
          setSelectedImage({
            kind: "local",
            previewUrl: finalUrl,
            blob,
            contentType: IMAGE_WEBP_CONTENT_TYPE,
          });
        },
        IMAGE_WEBP_CONTENT_TYPE,
        0.8,
      );

      URL.revokeObjectURL(url);
    };

    img.src = url;
  };

  // loaded image functions
  const onDiscardImage = () => {
    if (uploading) return;
    setSelectedImage(null);
    startCamera();
  };

  const onConfirmImage = async () => {
    try {
      if (uploading || !selectedImage) return;
      setUploading(true);

      const file_name = "user_image.webp";

      const convRes = await api.post("/api/conversation/visualization/init", {
        file_name: file_name,
      });

      if (convRes.status === 200) {
        const conversation_id = convRes.data.conversation_id;
        const { upload_url } = convRes.data.r2_creds;

        console.log(convRes.data.r2_creds, "r2_creds");

        const uploadBlob =
          selectedImage.kind === "local"
            ? selectedImage.blob
            : await fetch(selectedImage.imageUrl).then((res) => res.blob());

        await uploadBlobToPresignedUrl({
          uploadUrl: upload_url,
          blob: uploadBlob,
          contentType: IMAGE_WEBP_CONTENT_TYPE,
        });

        // saving the uploaded image to the conversation
        try {
          const selectedModel =
            selectedImage.kind === "remote" &&
            selectedImage.source === "registered_model"
              ? userModels.find(
                  (model) => model.model_id === selectedImage.modelId,
                )
              : undefined;

          const savePayload: {
            conversation_id: string;
            file_name: string;
            message?: string;
          } = {
            conversation_id: conversation_id,
            file_name: file_name,
          };

          if (selectedModel) {
            savePayload.message = selectedModel.model_id;
          }

          const saveMsgRes = await api.post(
            "/api/conversation/save-user-image",
            savePayload,
          );
          if (saveMsgRes.data.saved) {
            router.push(`/app/visualizer/${conversation_id}`);
          }
        } catch (e) {
          throw e;
        }
      }
    } catch (e) {
      console.log(
        "Unexpected error occured uploading the image and geting conversation_id as",
        e,
      );
    } finally {
      setUploading(false);
    }
  };

  // load user uploaded and model data
  const getUserUploadedImages = async () => {
    try {
      const res = await api.get("/api/app/models-and-images");
      if (res.status === 200) {
        setRecentImages(res.data.data.prev_images);
        setUserModels(res.data.data.user_models);
      }
    } catch (e) {
      console.log("Error fetching user uploaded images", e);
    }
  };

  // on click of user model
  const userModelSelectionFunc = (model: ModelCardDataType) => {
    setSelectedImage({
      kind: "remote",
      source: "registered_model",
      previewUrl: model.image_url,
      imageUrl: model.image_url,
      modelId: model.model_id,
    });
  };

  const onSwitchTabs = (tab: "visualization" | "ai stylist") => {
    setActiveSection(tab);
    if (tab == "visualization") {
      startCamera();
    }
  };

  useEffect(() => {
    startCamera();
    getRearCameras();
    getUserUploadedImages();
  }, []);

  return (
    <div className="flex h-full w-full flex-col items-center justify-start gap-4 bg-background-primary px-4 sm:px-16">
      <AppPageHeader
        showSidebar={showSidebar}
        setShowSidebar={() => setShowSidebar(!showSidebar)}
      />
      {showSidebar && <SideBar />}
      {activeSection == "visualization" ? (
        <div className="flex h-full w-full flex-col items-center justify-between pt-22 sm:flex-row sm:justify-center sm:gap-4 sm:pt-24">
          {selectedImage ? (
            <div className="relative aspect-[2/3] h-fit max-h-[70dvh] sm:max-h-[100dvh]">
              <img
                src={selectedImage.previewUrl}
                className="h-full w-full object-cover"
              />
              <div
                className={`absolute -bottom-12 flex h-24 w-full items-center justify-around ${uploading ? "opacity-50" : ""}`}
              >
                <div
                  className="flex h-24 w-24 items-center justify-center bg-contrast"
                  onClick={() => onDiscardImage()}
                >
                  <X className="text-accent" />
                </div>
                <div
                  className="flex h-24 w-24 items-center justify-center bg-accent"
                  onClick={() => onConfirmImage()}
                >
                  <Check className="text-contrast" />
                </div>
              </div>
            </div>
          ) : (
            <div className="relative aspect-[2/3] h-fit max-h-[70dvh] sm:max-h-[100dvh]">
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
              <div className="absolute -bottom-12 flex h-24 w-full  items-center justify-around">
                <div
                  className="h-24 w-24 bg-contrast flex items-center justify-center"
                  onClick={() => inputRef.current?.click()}
                >
                  <Images className=" text-accent" size={24} />
                </div>
                <div
                  className="h-24 w-24  bg-accent"
                  onClick={() => captureImage()}
                />
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

          <div className="w-full h-auto sm:h-[70dvh] flex flex-col items-start justify-start mt-16 sm:mt-0 gap-2">
            {userModels.length > 0 && (
              <h1 className="text-center text-sm font-semibold text-text m-0">
                REGISTERED MODELS
              </h1>
            )}
            {userModels.length > 0 ? (
              <div className="scrollbar-thin flex gap-2 overflow-auto scrollbar-thumb-text scrollbar-track-transparent">
                {userModels.map((img, index) => (
                  <ModelCard
                    data={img}
                    key={index}
                    selectImage={() => userModelSelectionFunc(img)}
                  />
                ))}
              </div>
            ) : null}
            {recentImages.length > 0 && (
              <h1 className="text-center text-sm font-semibold text-text m-0">
                RECENT PHOTOS
              </h1>
            )}
            {recentImages.length > 0 ? (
              <div className="scrollbar-thin flex gap-2 overflow-auto scrollbar-thumb-text scrollbar-track-transparent sm:overlfolow-none sm:flex-wrap">
                {recentImages.map((img, index) => (
                  <img
                    key={index}
                    src={img}
                    className="w-20 cursor-pointer object-cover"
                    onClick={() =>
                      setSelectedImage({
                        kind: "remote",
                        source: "recent_photo",
                        previewUrl: img,
                        imageUrl: img,
                      })
                    }
                  />
                ))}
              </div>
            ) : null}
            <div className="w-full h-24 sm:hidden" />
          </div>
        </div>
      ) : (
        <div className="flex h-screen w-full flex flex-col gap-4 items-center justify-center">
          <h1 className="text-4xl text-center font-semibold">{`${line}, ${user?.name}${end}`}</h1>
          <CreativeInputBox modelsData={userModels} />
        </div>
      )}
      <SegmentedFloatingButton
        selected={activeSection}
        onChange={(n: "visualization" | "ai stylist") => onSwitchTabs(n)}
      />
    </div>
  );
}

export default AppPage;
