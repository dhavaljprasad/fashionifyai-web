"use client";
import { useRouter } from "next/navigation";
import { ButtonPrimary } from "../modular/button";
import { InstallButton } from "../modular/button";

import { Menu, X } from "lucide-react";
import { useAuth } from "@/app/providers/auth";

export const AppPageHeader = ({
  showSidebar,
  setShowSidebar,
}: {
  showSidebar: boolean;
  setShowSidebar: () => void;
}) => {
  const { user } = useAuth();
  const router = useRouter();

  return (
    <div className="fixed z-15 flex h-16 w-full items-center justify-between border-b px-4 backdrop-blur-sm sm:px-16">
      <div className="flex items-center justify-center gap-2">
        <div onClick={() => setShowSidebar()}>
          {showSidebar ? (
            <X className="cursor-pointer text-text" />
          ) : (
            <Menu className="cursor-pointer text-text" />
          )}
        </div>

        <div className="flex items-center text-xl font-semibold">
          <h1 className="m-0">Fashionify</h1>
          <h1 className="m-0 text-accent">AI</h1>
        </div>
      </div>
      {user ? (
        <div className="flex items-center justify-center gap-4">
          <InstallButton />
          <div
            className="h-10 w-10 cursor-pointer overflow-hidden border border-accent"
            onClick={() => router.push("/app/profile")}
          >
            <img
              src={user.image_url}
              referrerPolicy="no-referrer"
              className="h-full w-full object-cover"
            />
          </div>
        </div>
      ) : (
        <ButtonPrimary
          text="Start Free Trial"
          onClick={() => router.push("/auth")}
        />
      )}
    </div>
  );
};
