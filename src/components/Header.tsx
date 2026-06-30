import Image from "next/image";
import { BRAND, LOGO_SRC } from "@/lib/seminar";
import CtaButton from "./CtaButton";
import PhoneLink from "./PhoneLink";

export default function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-navy/10 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80">
      <div className="mx-auto flex max-w-content items-center justify-between gap-4 px-4 py-2.5 sm:px-6">
        <a href="#top" className="flex items-center" aria-label={`${BRAND.name} home`}>
          <Image
            src={LOGO_SRC}
            alt={`${BRAND.name} Financial Services`}
            width={471}
            height={229}
            priority
            className="h-12 w-auto sm:h-14"
          />
        </a>

        <div className="flex items-center gap-2 sm:gap-4">
          <PhoneLink
            location="header"
            className="hidden items-center gap-2 text-sm font-semibold text-navy hover:text-green-700 sm:inline-flex"
          >
            <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4" aria-hidden="true">
              <path d="M6.62 10.79a15.05 15.05 0 006.59 6.59l2.2-2.2a1 1 0 011.05-.24 11.36 11.36 0 003.57.57 1 1 0 011 1V20a1 1 0 01-1 1A17 17 0 013 4a1 1 0 011-1h3.5a1 1 0 011 1 11.36 11.36 0 00.57 3.57 1 1 0 01-.24 1.05l-2.2 2.17z" />
            </svg>
            {BRAND.phoneDisplay}
          </PhoneLink>
          <CtaButton location="header" className="px-5 py-2.5 text-sm">
            Register
          </CtaButton>
        </div>
      </div>
    </header>
  );
}
