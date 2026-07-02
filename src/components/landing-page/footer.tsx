"use client";
import { useRouter } from "next/navigation";

const companyLinks = [
  {
    name: "About",
    href: "/about-us",
  },
  {
    name: "Privacy Policy",
    href: "/privacy-policy",
  },
  { name: "Refund Policy", href: "/refund-policy" },
  { name: "Terms and Conditions", href: "/terms-and-conditions" },
];
export const LandingPageFooter = () => {
  const router = useRouter();

  return (
    <div className="flex h-fit w-full flex-col items-center justify-center gap-4 bg-background-primary px-4 py-8 sm:px-16">
      <div className="grid w-full grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="w-full flex flex-col items-start justify-center gap-2">
          <div className="flex items-center justify-center text-xl font-semibold">
            <h1 className="m-0">Fashionify</h1>
            <h1 className="m-0 text-accent">AI</h1>
          </div>
          <span className="text-sm text-text">
            An AI fashion visualization studio in your pocket; built for the
            tailors and cloth shops and fashion fanatics of Bharat.
          </span>
        </div>
        <div className="w-full flex flex-col items-start justify-center gap-2">
          <h1 className="text-lg font-semibold">Company</h1>
          <div className="w-full h-auto grid grid-cols-2 gap-2 ">
            {companyLinks.map((link) => (
              <span
                key={link.name}
                className="text-sm text-text hover:text-accent cursor-pointer"
                onClick={() => router.push(link.href)}
              >
                {link.name}
              </span>
            ))}
          </div>
        </div>
        <div className="w-full flex flex-col items-start justify-center gap-2">
          <h1 className="text-lg font-semibold">Contact</h1>
          <span className="text-sm text-text">
            Email:{" "}
            <a
              href="mailto:dhavaljprasad@gmail.com"
              className="text-accent hover:underline"
            >
              dhavaljprasad@gmail.com
            </a>
          </span>

          <span className="text-sm text-text">
            © 2026 FashionifyAI. All rights reserved.
          </span>
        </div>
      </div>
    </div>
  );
};
