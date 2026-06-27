"use client";

import { track } from "@/lib/analytics";
import { BRAND } from "@/lib/seminar";

type Props = {
  location: string;
  className?: string;
  children?: React.ReactNode;
};

// Click-to-call (PRD §7.6) with conversion tracking.
export default function PhoneLink({ location, className = "", children }: Props) {
  return (
    <a
      href={BRAND.phoneHref}
      onClick={() => track("phone_click", { phone_location: location })}
      className={className}
    >
      {children ?? BRAND.phoneDisplay}
    </a>
  );
}
