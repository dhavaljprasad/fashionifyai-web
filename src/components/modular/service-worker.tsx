"use client";
import { useEffect } from "react";

export default function ServiceWorker() {
  useEffect(() => {
    if (!("serviceWorker" in navigator)) return;

    navigator.serviceWorker
      .register("/sw.js")
      .then((registration) => {
        console.log("[PWA] Service Worker registered", registration);
      })
      .catch((err) => {
        console.error("[PWA] Service Worker failed", err);
      });
  }, []);

  return null;
}
