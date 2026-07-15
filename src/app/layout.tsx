import "./globals.css";
import { cn } from "@/lib/utils";
import { Figtree, Lora } from "next/font/google";
import type { Metadata, Viewport } from "next";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { AuthProvider } from "../app/providers/auth";
import ServiceWorker from "@/components/modular/service-worker";

// init heading
const loraHeading = Lora({ subsets: ["latin"], variable: "--font-heading" });
const figtree = Figtree({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  title: "FashionifyAI",
  description:
    "Fashionify AI lets you try on clothes from any online store, upload fabric for custom previews, and get AI-powered outfit suggestions from your own wardrobe.",
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "FashionifyAI",
  },
};

export const viewport: Viewport = {
  themeColor: "#000000",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={cn(
        "h-full",
        "antialiased",
        loraHeading.variable,
        "font-sans",
        figtree.variable,
      )}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col">
        <ServiceWorker />
        <ThemeProvider defaultTheme="system">
          <AuthProvider>{children}</AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
