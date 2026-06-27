"use client";

import { track } from "@/lib/analytics";

type Props = {
  children: React.ReactNode;
  location: string; // where on the page the CTA lives, for analytics
  variant?: "primary" | "secondary";
  className?: string;
  fullWidth?: boolean;
};

// Every CTA anchors to the registration form (#register) per PRD §4.
export default function CtaButton({
  children,
  location,
  variant = "primary",
  className = "",
  fullWidth = false,
}: Props) {
  const base =
    "inline-flex items-center justify-center rounded-lg px-7 py-3.5 text-base font-semibold tracking-wide shadow-sm transition focus:outline-none focus-visible:ring-4 focus-visible:ring-green/40";
  const variants = {
    primary: "bg-green text-white hover:shadow-md",
    secondary: "bg-navy text-white hover:bg-navy-700",
  };

  return (
    <a
      href="#register"
      onClick={() => track("cta_click", { cta_location: location })}
      className={`${base} ${variants[variant]} ${fullWidth ? "w-full" : ""} ${className}`}
    >
      {children}
    </a>
  );
}
