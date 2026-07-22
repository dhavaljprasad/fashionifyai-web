"use client";

import { Separator } from "@/components/ui/separator";
import { Sun, Moon, Trash, LogOut } from "lucide-react";
import { useActiveTheme, useToggleTheme } from "@/hooks/use-theme";
import { Switch } from "../ui/switch";
import { ButtonSecondary, ButtonPrimary } from "../modular/button";
import { api } from "@/lib/api";

export const SettingsSection = () => {
  const activeTheme = useActiveTheme();
  const toggleTheme = useToggleTheme();

  const onSignOut = async () => {
    try {
      const signOutRes = await api.post("/auth/sign-out");
      if (signOutRes.status == 200) {
        window.location.reload();
      }
    } catch (e) {
      console.log("Unexpected error occured signing out as: ", e);
    }
  };

  const onAccountDel = async () => {
    try {
      const delRes = await api.post("/auth/delete");
      if (delRes.status == 200) {
        window.location.reload();
      }
    } catch (e) {
      console.log("Unexpected error occured deleting acc as: ", e);
    }
  };

  return (
    <div className="flex w-full flex-col items-start justify-start gap-4">
      <div className="flex w-full items-center justify-between">
        <h1 className="text-2xl font-semibold text-contrast">Settings</h1>
      </div>

      <Separator className="w-full bg-accent" />

      <div className="flex w-full flex-col gap-2 py-4 sm:flex-row sm:items-start sm:justify-between sm:gap-6">
        <div className="flex items-center gap-3 text-text/70">
          {activeTheme === "light" ? (
            <Moon size={18} className="text-accent" />
          ) : (
            <Sun size={18} className="text-accent" />
          )}
          <span className="text-xs font-medium uppercase tracking-[0.22em]">
            {`Toggle Theme (current theme: ${activeTheme})`}
          </span>
        </div>

        <div className="flex items-center space-x-2">
          <Switch
            id="airplane-mode"
            checked={activeTheme === "dark"}
            onCheckedChange={toggleTheme}
          />
          <label htmlFor="airplane-mode" className="text-sm text-contrast">
            {activeTheme === "light" ? "Dark" : "Light"}
          </label>
        </div>
      </div>
      <div className="flex w-full flex-col gap-2 py-4 sm:flex-row sm:items-start sm:justify-between sm:gap-6">
        <div className="flex items-center gap-3 text-text/70">
          <LogOut size={18} className="text-accent" />
          <span className="text-xs font-medium uppercase tracking-[0.22em]">
            Sign Out
          </span>
        </div>

        <ButtonPrimary text="Sign-Out" onClick={() => onSignOut()} />
      </div>
      <div className="flex w-full flex-col gap-2 py-4 sm:flex-row sm:items-start sm:justify-between sm:gap-6">
        <div className="flex items-center gap-3 text-text/70">
          <Trash size={18} className="text-red-500" />
          <span className="text-xs font-medium text-red-500 uppercase tracking-[0.22em]">
            Delete Account (this action can't be undone)
          </span>
        </div>

        <ButtonSecondary
          text="Delete"
          onClick={() => onAccountDel()}
          buttonClass="bg-red-500 hover:bg-red-700 border-red-500 hover:border-red-700"
          buttonTextClass="text-white group-hover:text-white"
        />
      </div>
    </div>
  );
};
