import { Platform } from "./types";

export function getPlatform(): Platform {
  const ua = navigator.userAgent.toLowerCase();

  if (/android/.test(ua)) return Platform.Android;

  if (/iphone|ipad|ipod/.test(ua)) return Platform.IOS;

  if (/win/.test(ua)) return Platform.Windows;

  if (/mac/.test(ua)) return Platform.MacOS;

  if (/linux/.test(ua)) return Platform.Linux;

  return Platform.Unknown;
}
