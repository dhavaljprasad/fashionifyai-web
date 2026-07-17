"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { GoogleSignInButton } from "@/components/auth-page/google-button";
import { VolumeOff, Volume2 } from "lucide-react";

function AuthPage() {
  const [muted, setMuted] = useState(true);
  const router = useRouter();
  return (
    <div className="w-full h-full flex lg:flex-row items-center justify-between">
      <div className="w-4/5 h-fit lg:w-full lg:h-full absolute lg:relative top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 lg:top-auto lg:left-auto lg:translate-x-0 lg:translate-y-0 p-8 bg-white/20 lg:bg-background-primary backdrop-blur-xs lg:p-16 flex flex-col items-start justify-center gap-2">
        <h1 className="text-2xl lg:text-4xl font-semibold">
          Step into <span className="text-accent">the studio</span>
        </h1>
        <div className="w-full flex items-center justify-center mt-4">
          <GoogleSignInButton />
        </div>
        <span className="text-xs text-contrast">
          Please refresh if Google Auth button is not visible
        </span>
        <div>
          <span className="text-xs lg:text-sm">
            By continuing you agree to FashionifyAI's{" "}
            <span
              className="text-accent hover:underline cursor-pointer"
              onClick={() => router.push("/terms-and-conditions")}
            >
              Terms
            </span>{" "}
            and{" "}
            <span
              className="text-accent hover:underline cursor-pointer"
              onClick={() => router.push("/privacy-policy")}
            >
              Privacy Policy
            </span>
          </span>
        </div>
      </div>
      <div className="relative-auto w-full h-screen lg:p-16 lg:aspect-[4/5]">
        <video
          className="w-full h-full object-cover"
          autoPlay
          muted={muted}
          loop
          src="https://res.cloudinary.com/dli14hm5i/video/upload/v1783005987/LoginVideo_bwrxau.mp4"
        />
        <div
          className="absolute bottom-8 right-8 lg:bottom-24 lg:right-24 bg-background-secondary p-4 hover:bg-accent transition-all duration-300"
          onClick={() => setMuted(!muted)}
        >
          {muted ? (
            <VolumeOff className="cursor-pointer" />
          ) : (
            <Volume2 className="cursor-pointer" />
          )}
        </div>
      </div>
    </div>
  );
}

export default AuthPage;
