"use client";
import { useState } from "react";
import { Header } from "@/components/modular/header";
import { SideBar } from "@/components/modular/side-bar";

function UploadModelPage() {
  const [showSidebar, setShowSidebar] = useState(false);
  return (
    <div className="flex h-full w-full flex-col items-center justify-start gap-4 bg-background-primary px-4 sm:px-16">
      <Header
        showSidebar={showSidebar}
        setShowSidebar={() => setShowSidebar(!showSidebar)}
      />
      {showSidebar && <SideBar />}
    </div>
  );
}

export default UploadModelPage;
