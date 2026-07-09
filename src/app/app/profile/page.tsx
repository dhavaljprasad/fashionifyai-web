"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, BadgeCheck, Mail, UserRound } from "lucide-react";
import { useAuth } from "@/app/providers/auth";
import { ButtonPrimary } from "@/components/modular/button";
import { Separator } from "@/components/ui/separator";
import { PopUp } from "@/components/modular/pop-up";
import { ModelUploadPopUp } from "@/components/modular/pop-up/model-upload";
import { ModelCard } from "../../../components/profile/model-card";
import { ModelRenderPopUp } from "@/components/modular/pop-up/model-render";
import { api } from "@/lib/api";

type MaleMeasurements = {
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

type FemaleMeasurements = {
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

type ModelDataType = {
  model_id: string;
  name: string;
  gender: "male" | "female";
  image_url: string;
  measurements: MaleMeasurements | FemaleMeasurements;
};

function Page() {
  const [showPopUp, setShowPopUp] = useState<boolean>(false);
  const [newModelPopUp, setNewModelPopUp] = useState<boolean>(false);
  const [models, setModels] = useState<ModelDataType[]>([]);
  const [popUpModelData, setPopUpModelData] = useState<ModelDataType | null>(
    null,
  );
  const router = useRouter();
  const { user } = useAuth();

  const openNewModelUploadPopUp = () => {
    setNewModelPopUp(true);
    setShowPopUp(true);
  };

  const openUserModelPopUp = (model_id: string) => {
    const selectedModel =
      models.find((model) => model.model_id === model_id) ?? null;
    setPopUpModelData(selectedModel);
    setNewModelPopUp(false);
    setShowPopUp(true);
  };

  const getUserModels = async () => {
    try {
      const models = await api.get("/api/model");
      setModels(models.data.models);
    } catch (e) {
      console.log("Unexpected error occured getting user models");
    }
  };

  useEffect(() => {
    getUserModels();
  }, []);

  return (
    <div className="relative flex min-h-screen w-full flex-col p-4 sm:px-16">
      {showPopUp && (
        <PopUp
          size="large"
          header={`${newModelPopUp ? "New Model" : "Model"}`}
          closePopUp={() => setShowPopUp(false)}
          component={
            newModelPopUp ? (
              <ModelUploadPopUp onClose={() => setShowPopUp(false)} />
            ) : popUpModelData ? (
              <ModelRenderPopUp
                data={popUpModelData}
                onClose={() => setShowPopUp(false)}
              />
            ) : null
          }
        />
      )}
      <ButtonPrimary
        text="Back"
        onClick={() => router.back()}
        icon={ArrowLeft}
      />
      <div className="flex w-full h-full flex-1 flex-col sm:flex-row gap-8 sm:items-start sm:justify-center items-center justify-start mt-8">
        <div className="flex w-full sm:w-1/3 flex-col items-center justify-center pb-8 text-center  lg:pr-12 lg:pb-0">
          <div className="relative mb-6">
            <div className="absolute inset-0 rounded-full bg-accent/20 blur-2xl" />
            <img
              src={user?.image_url}
              alt={user?.name}
              referrerPolicy="no-referrer"
              className="relative h-32 w-32 rounded-full border border-accent/35 object-cover sm:h-40 sm:w-40 lg:h-52 lg:w-52"
            />
          </div>

          <h1 className="max-w-[12ch] text-3xl leading-tight font-semibold text-contrast sm:text-4xl">
            {user?.name}
          </h1>
        </div>

        <div className="flex w-full sm:w-2/3 flex-col items-start justify-start">
          <div className="flex w-full flex-col gap-2 py-4 sm:flex-row sm:items-start sm:justify-between sm:gap-6">
            <div className="flex items-center gap-3 text-text/70">
              <UserRound size={18} className="text-accent" />
              <span className="text-xs font-medium tracking-[0.22em] uppercase">
                Full Name
              </span>
            </div>
            <p className="text-base font-medium text-contrast sm:max-w-[60%] sm:text-right">
              {user?.name}
            </p>
          </div>

          <div className="flex w-full flex-col gap-2 py-4 sm:flex-row sm:items-start sm:justify-between sm:gap-6">
            <div className="flex items-center gap-3 text-text/70">
              <Mail size={18} className="text-accent" />
              <span className="text-xs font-medium tracking-[0.22em] uppercase">
                Email
              </span>
            </div>
            <p className="text-base font-medium break-all text-contrast sm:max-w-[60%] sm:text-right">
              {user?.email}
            </p>
          </div>

          <div className="flex w-full flex-col gap-2 py-4 sm:flex-row sm:items-start sm:justify-between sm:gap-6">
            <div className="flex items-center gap-3 text-text/70">
              <BadgeCheck size={18} className="text-accent" />
              <span className="text-xs font-medium tracking-[0.22em] uppercase">
                Account Type
              </span>
            </div>
            <p className="text-base font-medium text-contrast capitalize sm:max-w-[60%] sm:text-right">
              {user?.type_of_user}
            </p>
          </div>

          <Separator className="w-full bg-accent" />

          <div className="w-full h-auto flex flex-col gap-4 items-center justify-between mt-4">
            <div className="flex w-full items-center justify-between">
              <h1 className="text-2xl font-bold text-contrast">
                Registered Models
              </h1>
              <ButtonPrimary
                text="Upload New Model"
                onClick={() => openNewModelUploadPopUp()}
              />
            </div>

            <div className="w-full h-auto grid gap-2 grid-cols-1 sm:grid-cols-2">
              {models.map((item, index) => (
                <ModelCard
                  data={item}
                  key={index}
                  onClick={openUserModelPopUp}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Page;
