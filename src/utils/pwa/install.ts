import { BeforeInstallPromptEvent } from "./types";

let deferredPrompt: BeforeInstallPromptEvent | null = null;
let initialized = false;

export function initializePWAInstall() {
  if (typeof window === "undefined" || initialized) return;

  initialized = true;

  window.addEventListener("beforeinstallprompt", (event) => {
    event.preventDefault();
    deferredPrompt = event as BeforeInstallPromptEvent;
  });

  window.addEventListener("appinstalled", () => {
    deferredPrompt = null;
  });
}

export function canInstall() {
  return deferredPrompt !== null;
}

export async function triggerInstall() {
  if (!deferredPrompt) return false;

  await deferredPrompt.prompt();

  const { outcome } = await deferredPrompt.userChoice;

  deferredPrompt = null;

  return outcome === "accepted";
}
