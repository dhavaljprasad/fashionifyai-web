"use client";

import { useState, useEffect, useRef } from "react";
import { upload } from "@imagekit/next";
import { useAuth } from "@/app/providers/auth";
import { api } from "@/lib/api";
import { X, Images } from "lucide-react";
import { ButtonPrimary } from "@/components/modular/button";

const NEXT_PUBLIC_IMGKIT_PUBLIC_KEY =
  process.env.NEXT_PUBLIC_IMGKIT_PUBLIC_KEY || "";

type Gender = "male" | "female";

type MeasurementField = {
  key: string;
  label: string;
  type: "text" | "number" | "select";
  placeholder: string;
};

const bodyTypeOptions = [
  "SLIM",
  "REGULAR",
  "ATHLETIC",
  "MUSCULAR",
  "BROAD",
  "HEAVYSET",
];

const bodyShapeOptions = [
  "HOURGLASS",
  "PEAR",
  "APPLE",
  "RECTANGLE",
  "INVERTED_TRIANGLE",
];

const maleMeasurementFields: MeasurementField[] = [
  { key: "height", label: "Height", type: "number", placeholder: "175" },
  {
    key: "body_type",
    label: "Body Type",
    type: "select",
    placeholder: "Select body type",
  },
  {
    key: "shoulder_width",
    label: "Shoulder Width",
    type: "number",
    placeholder: "42",
  },
  { key: "chest", label: "Chest", type: "number", placeholder: "95" },
  { key: "waist", label: "Waist", type: "number", placeholder: "80" },
  { key: "belly", label: "Belly", type: "number", placeholder: "88" },
  { key: "hips", label: "Hips", type: "number", placeholder: "95" },
  { key: "pant_waist", label: "Pant Waist", type: "number", placeholder: "82" },
  { key: "thigh", label: "Thigh", type: "number", placeholder: "55" },
];

const femaleMeasurementFields: MeasurementField[] = [
  { key: "height", label: "Height", type: "number", placeholder: "165" },
  {
    key: "body_shape",
    label: "Body Shape",
    type: "select",
    placeholder: "Select body shape",
  },
  {
    key: "shoulder_width",
    label: "Shoulder Width",
    type: "number",
    placeholder: "38",
  },
  { key: "bust", label: "Bust", type: "number", placeholder: "90" },
  { key: "underbust", label: "Underbust", type: "number", placeholder: "75" },
  { key: "waist", label: "Waist", type: "number", placeholder: "70" },
  { key: "hips", label: "Hips", type: "number", placeholder: "95" },
  { key: "pant_waist", label: "Pant Waist", type: "number", placeholder: "78" },
  { key: "thigh", label: "Thigh", type: "number", placeholder: "52" },
];

export const ModelUploadPopUp = ({ onClose }: { onClose: () => void }) => {
  const [capturedImage, setCapturedImage] = useState<string>("");
  const [uploading, setUploading] = useState(false);
  const [gender, setGender] = useState<Gender>("male");
  const [name, setName] = useState<string>("");
  const [maleMeasurements, setMaleMeasurements] = useState<
    Record<string, string>
  >({
    height: "",
    body_type: "",
    shoulder_width: "",
    chest: "",
    waist: "",
    belly: "",
    hips: "",
    pant_waist: "",
    thigh: "",
  });
  const [femaleMeasurements, setFemaleMeasurements] = useState<
    Record<string, string>
  >({
    height: "",
    body_shape: "",
    shoulder_width: "",
    bust: "",
    underbust: "",
    waist: "",
    hips: "",
    pant_waist: "",
    thigh: "",
  });

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const { user } = useAuth();

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
  };

  const onConfirmImage = async () => {
    try {
      const convRes = await api.get("/api/conversation/init");

      if (convRes.status === 200) {
        const { token, expire, signature } = convRes.data.imgkit_auth;
        const file_name = "user_model.webp";

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
          folder: `/${user?.id}/uploads/models/`,
          useUniqueFileName: true,
        });

        return uploadResponse.name;
      }
    } catch (e) {
      console.log(
        "Unexpected error occured uploading the image and geting conversation_id as",
        e,
      );
    }
  };

  const handleMeasurementChange = (key: string, value: string) => {
    if (gender === "male") {
      setMaleMeasurements((prev) => ({ ...prev, [key]: value }));
    } else {
      setFemaleMeasurements((prev) => ({ ...prev, [key]: value }));
    }
  };

  const handleSave = async () => {
    if (!isFormComplete) return;
    if (uploading) return;
    try {
      setUploading(true);
      const payload = gender === "male" ? maleMeasurements : femaleMeasurements;

      const image = await onConfirmImage();

      const saveRes = await api.post("/api/model/init", {
        gender: gender,
        image: image,
        model_name: name,
        measurements: payload,
      });

      console.log("Saving model data", saveRes.data);
      setUploading(false);
      onClose();
    } catch (e) {
      console.log("Unexpected error occured as: ", e);
      setUploading(false);
      onClose();
    }
  };

  useEffect(() => {
    startCamera();
  }, []);

  const measurementFields =
    gender === "male" ? maleMeasurementFields : femaleMeasurementFields;
  const currentMeasurements =
    gender === "male" ? maleMeasurements : femaleMeasurements;
  const isFormComplete =
    Boolean(name.trim()) &&
    Boolean(capturedImage) &&
    measurementFields.every((field) =>
      Boolean(currentMeasurements[field.key]?.toString().trim()),
    );

  return (
    <div className="flex h-full w-full flex-col items-center gap-4 sm:flex-row sm:items-start sm:justify-start">
      <div className="flex w-full flex-col items-start justify-start gap-2 sm:w-1/3">
        {capturedImage ? (
          <div className="relative w-full overflow-hidden rounded-2xl bg-black shadow-lg">
            <div className="aspect-[2/3] w-full">
              <img
                src={capturedImage}
                alt="Captured preview"
                className="h-full w-full object-cover"
              />
            </div>

            <div
              className={`absolute inset-x-0 bottom-0 flex h-24 items-center justify-around bg-gradient-to-t from-black/70 via-black/40 to-transparent ${uploading ? "opacity-50" : ""}`}
            >
              <button
                type="button"
                className="flex h-16 w-16 items-center justify-center  bg-contrast shadow-lg"
                onClick={() => onDiscardImage()}
              >
                <X className="text-accent" />
              </button>
            </div>
          </div>
        ) : (
          <div className="relative w-full overflow-hidden rounded-2xl bg-black shadow-lg ">
            <div className="aspect-[2/3] w-full">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                className="h-full w-full object-cover"
              />
            </div>

            <div className="absolute z-100 inset-x-0 bottom-0 flex h-24 items-center justify-evenly">
              <button
                type="button"
                className="h-16 w-16 bg-accent shadow-lg"
                onClick={() => captureImage()}
              />
              <button
                type="button"
                className="flex h-16 w-16 items-center justify-center bg-contrast shadow-lg"
                onClick={() => inputRef.current?.click()}
              >
                <Images className="text-accent" size={24} />
              </button>
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
      </div>
      <div className="flex h-full w-full flex-col items-start justify-start gap-4 sm:w-2/3">
        <div className="flex w-full flex-col items-start justify-start gap-2 overflow-auto">
          <div className="w-full">
            <label className="mb-1 block text-sm font-medium text-contrast">
              Name
            </label>
            <input
              type="text"
              className="w-full border border-border bg-background-primary p-2 text-text placeholder:text-text/50 focus:outline-none focus:ring-1 focus:ring-accent"
              placeholder="Model name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="w-full">
            <label className="mb-1 block text-sm font-medium text-contrast">
              Gender
            </label>
            <select
              value={gender}
              onChange={(e) => setGender(e.target.value as Gender)}
              className="w-full border border-border bg-background-primary p-2 text-text focus:outline-none focus:ring-1 focus:ring-accent"
            >
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>
          </div>

          <div className="w-full">
            <div className="mb-2 flex items-center justify-between mt-2">
              <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-contrast">
                Body Measurements (cm)
              </h3>
              <span className="text-xs text-text/60">
                {gender === "male" ? "Male" : "Female"}
              </span>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              {measurementFields.map((field) => (
                <div key={field.key} className="flex flex-col gap-1">
                  <label className="text-sm font-medium text-contrast">
                    {field.label}
                  </label>
                  {field.type === "select" ? (
                    <select
                      value={currentMeasurements[field.key] ?? ""}
                      onChange={(e) =>
                        handleMeasurementChange(field.key, e.target.value)
                      }
                      className="w-full border border-border bg-background-primary p-2 text-text focus:outline-none focus:ring-1 focus:ring-accent"
                    >
                      <option value="">{field.placeholder}</option>
                      {(field.key === "body_type"
                        ? bodyTypeOptions
                        : bodyShapeOptions
                      ).map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <input
                      type={field.type}
                      step="0.1"
                      min="0"
                      value={currentMeasurements[field.key] ?? ""}
                      onChange={(e) =>
                        handleMeasurementChange(field.key, e.target.value)
                      }
                      placeholder={field.placeholder}
                      className="w-full border border-border bg-background-primary p-2 text-text placeholder:text-text/50 focus:outline-none focus:ring-1 focus:ring-accent"
                    />
                  )}
                </div>
              ))}
            </div>

            <div className="mt-4 flex w-full justify-end">
              <ButtonPrimary
                text="Save"
                onClick={handleSave}
                buttonClass={
                  isFormComplete ? "" : "pointer-events-none opacity-50"
                }
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
