"use client";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { AppPageHeader } from "@/components/app-page/header";
import { SideBar } from "@/components/modular/side-bar";
import { ModelCard, ModelCardDataType } from "@/components/app-page/model-card";
import { api } from "@/lib/api";
import { useAuth } from "../providers/auth";
import { upload } from "@imagekit/next";
import { Check, X, Images } from "lucide-react";

const NEXT_PUBLIC_IMGKIT_PUBLIC_KEY =
  process.env.NEXT_PUBLIC_IMGKIT_PUBLIC_KEY || "";

function AppPage() {
  const [showSidebar, setShowSidebar] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string>("");
  const [recentImages, setRecentImages] = useState<string[]>([]);
  const [userModels, setUserModels] = useState<ModelCardDataType[]>([]);
  const [userModelSelected, setUserModelSelected] = useState<boolean>(false);
  const [uploading, setUploading] = useState(false);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const { user } = useAuth();
  const router = useRouter();

  // camera functions
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

    const image = canvas.toDataURL("image/webp", 0.8);
    setCapturedImage(image);
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
          setCapturedImage(finalUrl); // same pattern as your previous version
        },
        "image/webp",
        0.8,
      );

      URL.revokeObjectURL(url);
    };

    img.src = url;
  };

  // loaded image functions
  const onDiscardImage = () => {
    if (uploading) return;
    setCapturedImage("");
    startCamera();
    setUserModelSelected(false);
  };

  const onConfirmImage = async () => {
    try {
      if (uploading) return;
      setUploading(true);
      const convRes = await api.get("/api/conversation/init");

      if (convRes.status === 200) {
        const conversation_id = convRes.data.conversation_id;
        const { token, expire, signature } = convRes.data.imgkit_auth;
        const file_name = "user_image.webp";

        // uploading image
        const res = await fetch(capturedImage);
        const blob = await res.blob();
        const uploadResponse = await upload({
          // Authentication parameters
          expire: expire,
          token: token,
          signature: signature,
          publicKey: NEXT_PUBLIC_IMGKIT_PUBLIC_KEY,
          file: blob,
          fileName: file_name,
          folder: `/${user?.id}/uploads/${conversation_id}`,
          useUniqueFileName: false,
        });

        // saving the uploaded image to the conversation
        try {
          const selectedModel = userModelSelected
            ? userModels.find((model) => model.image_url === capturedImage)
            : undefined;

          const savePayload: {
            conversation_id: string;
            file_name: string;
            message?: string;
          } = {
            conversation_id: conversation_id,
            file_name: uploadResponse.name || "",
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
      setUploading(false);
    } catch (e) {
      console.log(
        "Unexpected error occured uploading the image and geting conversation_id as",
        e,
      );
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
  const userModelSelectionFunc = (img_url: string) => {
    setCapturedImage(img_url);
    setUserModelSelected(true);
  };

  useEffect(() => {
    startCamera();
    getUserUploadedImages();
  }, []);

  return (
    <div className="flex h-full w-full flex-col items-center justify-start gap-4 bg-background-primary px-4 sm:px-16">
      <AppPageHeader
        showSidebar={showSidebar}
        setShowSidebar={() => setShowSidebar(!showSidebar)}
      />
      {showSidebar && <SideBar />}
      <div className="flex h-full w-full flex-col items-center justify-between pt-22 sm:flex-row sm:justify-center sm:gap-4 sm:pt-24">
        {capturedImage ? (
          <div className="relative aspect-[2/3] h-fit max-h-[70dvh] sm:max-h-[90dvh]">
            <img src={capturedImage} className="h-full w-full object-cover" />
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
            <div className="absolute -bottom-12 left-1/2 h-24 w-full -translate-x-1/2 flex flex-row items-center justify-evenly">
              <div
                className="h-24 w-24  bg-accent"
                onClick={() => captureImage()}
              />
              <div
                className="h-24 w-24 bg-contrast flex items-center justify-center"
                onClick={() => inputRef.current?.click()}
              >
                <Images className=" text-accent" size={24} />
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
                  selectImage={() => userModelSelectionFunc(img.image_url)}
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
                  onClick={() => setCapturedImage(img)}
                />
              ))}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}

export default AppPage;
