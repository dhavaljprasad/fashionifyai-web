"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Info, Users, Shirt, CalendarSync, Cog } from "lucide-react";
import { useAuth } from "@/app/providers/auth";
import { ButtonPrimary } from "@/components/modular/button";
import { PopUp, type PopUpSizeType } from "@/components/modular/pop-up";
import { ModelUploadPopUp } from "@/components/modular/pop-up/model-upload";
import { ModelRenderPopUp } from "@/components/modular/pop-up/model-render";
import { SegmentedControlButtons } from "@/components/profile/segmented-control-button";
import { DetailsSection } from "@/components/profile/details-section";
import { SettingsSection } from "@/components/profile/settings-section";
import {
  ModelsSection,
  ModelDataType,
} from "@/components/profile/models-section";
import { WardrobeSection } from "@/components/profile/wardrobe-section";
import { WardrobeUploadPopUp } from "@/components/modular/pop-up/wardrobe-upload";

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

type ActivePopUp = {
  size: PopUpSizeType;
  header: string;
  component: React.ReactNode;
};

function Page() {
  const [activePopUp, setActivePopUp] = useState<ActivePopUp | null>(null);
  const [selectedTab, setSelectedTab] = useState<SelectedTabTypes>("Details");
  const router = useRouter();
  const { user } = useAuth();

  const closePopUp = () => {
    setActivePopUp(null);
  };

  const openNewModelUploadPopUp = () => {
    setActivePopUp({
      size: "large",
      header: "New Model",
      component: <ModelUploadPopUp onClose={closePopUp} />,
    });
  };

  const openModelPopUp = (model: ModelDataType) => {
    setActivePopUp({
      size: "large",
      header: "Model",
      component: <ModelRenderPopUp data={model} onClose={closePopUp} />,
    });
  };

  const openWardrobeUploadPopUp = (model: ModelDataType | null) => {
    setActivePopUp({
      size: "large",
      header: model ? `${model.name} Wardrobe` : "General Wardrobe",
      component: <WardrobeUploadPopUp onClose={closePopUp} model={model} />,
    });
  };

  return (
    <div className="relative flex min-h-screen w-full flex-col p-4 sm:px-16">
      {activePopUp && (
        <PopUp
          size={activePopUp.size}
          header={activePopUp.header}
          closePopUp={closePopUp}
          component={activePopUp.component}
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
              openModelPopUp={openModelPopUp}
            />
          ) : selectedTab === "Settings" ? (
            <SettingsSection />
          ) : selectedTab === "Wardrobe" ? (
            <WardrobeSection
              openWardrobeUploadPopUp={openWardrobeUploadPopUp}
            />
          ) : (
            <></>
          )}
        </div>
      </div>
    </div>
  );
}

export default Page;
