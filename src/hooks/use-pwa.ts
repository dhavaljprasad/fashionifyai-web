"use client";

import { useEffect, useState } from "react";
import { getPlatform } from "@/utils/pwa/platform";
import { Platform } from "@/utils/pwa/types";
import { isInstalled } from "@/utils/pwa/installed";
import {
  initializePWAInstall,
  canInstall,
  triggerInstall,
} from "@/utils/pwa/install";

export function usePWA() {
  const [platform, setPlatform] = useState(Platform.Unknown);
  const [installed, setInstalled] = useState(false);
  const [canInstallState, setCanInstallState] = useState(false);

  useEffect(() => {
    initializePWAInstall();

    setPlatform(getPlatform());
    setInstalled(isInstalled());
    setCanInstallState(canInstall());

    const handleAppInstalled = () => {
      setInstalled(true);
      setCanInstallState(false);
    };

    window.addEventListener("appinstalled", handleAppInstalled);

    return () => {
      window.removeEventListener("appinstalled", handleAppInstalled);
    };
  }, []);

  async function install() {
    switch (platform) {
      case Platform.Android:
      case Platform.Windows:
      case Platform.MacOS: {
        const success = await triggerInstall();

        setCanInstallState(canInstall());
        setInstalled(isInstalled());

        if (success) {
          setInstalled(true);
          setCanInstallState(false);
        }

        break;
      }

      case Platform.IOS:
        // Handle in your iOS modal/component.
        break;

      default:
        break;
    }
  }

  return {
    platform,
    isInstalled: installed,
    canInstall: canInstallState,
    install,
  };
}
