export enum Platform {
  Android = "android",
  IOS = "ios",
  Windows = "windows",
  MacOS = "macos",
  Linux = "linux",
  Unknown = "unknown",
}

export interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;

  userChoice: Promise<{
    outcome: "accepted" | "dismissed";
    platform: string;
  }>;
}
