"use client";
import { useState, useEffect, type Dispatch, type SetStateAction } from "react";
import { ButtonPrimary } from "../modular/button";
import { ModelCard } from "./model-card";
import { api } from "@/lib/api";
import { Separator } from "@/components/ui/separator";

export type MaleMeasurements = {
  height: number;
  body_type:
    | "SLIM"
    | "REGULAR"
    | "ATHLETIC"
    | "MUSCULAR"
    | "BROAD"
    | "HEAVYSET";
  shoulder_width: number;
  chest: number;
  waist: number;
  belly: number;
  hips: number;
  pant_waist: number;
  thigh: number;
};

export type FemaleMeasurements = {
  height: number;
  body_shape:
    | "HOURGLASS"
    | "PEAR"
    | "APPLE"
    | "RECTANGLE"
    | "INVERTED_TRIANGLE";
  shoulder_width: number;
  bust: number;
  underbust: number;
  waist: number;
  hips: number;
  pant_waist: number;
  thigh: number;
};

export type ModelDataType = {
  model_id: string;
  name: string;
  gender: "male" | "female";
  image_url: string;
  measurements: MaleMeasurements | FemaleMeasurements;
};

type ModelsSectionProps = {
  openNewModelPopUp: () => void;
  setPopUpModelData: Dispatch<SetStateAction<ModelDataType | null>>;
  setNewModelPopUp: (value: boolean) => void;
  setShowPopUp: (value: boolean) => void;
};

export const ModelsSection = ({
  openNewModelPopUp,
  setPopUpModelData,
  setNewModelPopUp,
  setShowPopUp,
}: ModelsSectionProps) => {
  const [models, setModels] = useState<ModelDataType[]>([]);

  const getUserModels = async () => {
    try {
      const models = await api.get("/api/model");
      setModels(models.data.models);
    } catch (e) {
      console.log("Unexpected error occured getting user models");
    }
  };

  const openUserModelPopUp = (model_id: string) => {
    const selectedModel =
      models.find((model) => model.model_id === model_id) ?? null;
    setPopUpModelData(selectedModel);
    setNewModelPopUp(false);
    setShowPopUp(true);
  };

  useEffect(() => {
    getUserModels();
  }, []);

  return (
    <div className="w-full h-auto flex flex-col gap-4 items-center justify-between">
      <div className="flex w-full items-center justify-between">
        <h1 className="text-2xl font-semibold text-contrast">
          Registered Models
        </h1>
        <ButtonPrimary
          text="Upload New Model"
          onClick={() => openNewModelPopUp()}
        />
      </div>
      <Separator className="w-full bg-accent" />

      <div className="w-full h-auto grid gap-2 grid-cols-2 md:grid-cols-3">
        {models.map((item, index) => (
          <ModelCard data={item} key={index} onClick={openUserModelPopUp} />
        ))}
      </div>
    </div>
  );
};
