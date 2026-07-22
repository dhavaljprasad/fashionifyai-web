"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Info, Users, Shirt, CalendarSync, Cog } from "lucide-react";
import { useAuth } from "@/app/providers/auth";
import { ButtonPrimary } from "@/components/modular/button";
import { PopUp } from "@/components/modular/pop-up";
import { ModelUploadPopUp } from "@/components/modular/pop-up/model-upload";
import { ModelRenderPopUp } from "@/components/modular/pop-up/model-render";
import { SegmentedControlButtons } from "@/components/profile/segmented-control-button";
import { DetailsSection } from "@/components/profile/details-section";
import { SettingsSection } from "@/components/profile/settings-section";
import {
  ModelsSection,
  ModelDataType,
} from "@/components/profile/models-section";

type SelectedTabTypes =
  | "Details"
  | "Models"
  | "Wardrobe"
  | "Subscription"
  | "Settings";

const tabsHeaderData = [
  {
    label: "Details",
    icon: Info,
  },
  {
    label: "Models",
    icon: Users,
  },
  {
    label: "Wardrobe",
    icon: Shirt,
  },
  {
    label: "Subscription",
    icon: CalendarSync,
  },
  {
    label: "Settings",
    icon: Cog,
  },
];

function Page() {
  const [showPopUp, setShowPopUp] = useState<boolean>(false);
  const [newModelPopUp, setNewModelPopUp] = useState<boolean>(false);
  const [popUpModelData, setPopUpModelData] = useState<ModelDataType | null>(
    null,
  );
  const [selectedTab, setSelectedTab] = useState<SelectedTabTypes>("Details");
  const router = useRouter();
  const { user } = useAuth();

  const openNewModelUploadPopUp = () => {
    setNewModelPopUp(true);
    setShowPopUp(true);
  };

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
        <div className="flex w-full sm:w-1/3 flex-col items-center justify-center pb-8 text-center gap-4 lg:pr-12 lg:pb-0">
          <div className="relative">
            <div className="absolute inset-0 rounded-full bg-accent/20 blur-2xl" />
            <img
              src={user?.image_url}
              alt={user?.name}
              referrerPolicy="no-referrer"
              className="relative h-32 w-32 rounded-full border border-accent/35 object-cover sm:h-40 sm:w-40 lg:h-52 lg:w-52"
            />
          </div>

          <h1 className="w-full text-3xl leading-tight font-semibold text-contrast sm:text-4xl">
            {user?.name}
          </h1>

          <SegmentedControlButtons
            data={tabsHeaderData}
            selected={selectedTab}
            onChange={(label: string) =>
              setSelectedTab(label as SelectedTabTypes)
            }
          />
        </div>

        <div className="flex w-full sm:w-2/3 flex-col items-start justify-start">
          {selectedTab === "Details" ? (
            <DetailsSection />
          ) : selectedTab === "Models" ? (
            <ModelsSection
              openNewModelPopUp={openNewModelUploadPopUp}
              setPopUpModelData={setPopUpModelData}
              setNewModelPopUp={setNewModelPopUp}
              setShowPopUp={setShowPopUp}
            />
          ) : selectedTab === "Settings" ? (
            <SettingsSection />
          ) : (
            <></>
          )}
        </div>
      </div>
    </div>
  );
}

export default Page;
