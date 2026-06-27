import CtaButton from "./CtaButton";
import PhoneLink from "./PhoneLink";

// Persistent reserve bar on mobile for constant form access (PRD §9).
export default function MobileReserveBar() {
  return (
    <div className="fixed inset-x-0 bottom-0 z-50 border-t border-navy/10 bg-white/95 p-3 shadow-[0_-4px_12px_rgba(15,42,71,0.08)] backdrop-blur sm:hidden">
      <div className="flex items-center gap-3">
        <PhoneLink
          location="mobile_bar"
          className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg border border-navy/20 text-navy"
        >
          <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5" aria-hidden="true">
            <path d="M6.62 10.79a15.05 15.05 0 006.59 6.59l2.2-2.2a1 1 0 011.05-.24 11.36 11.36 0 003.57.57 1 1 0 011 1V20a1 1 0 01-1 1A17 17 0 013 4a1 1 0 011-1h3.5a1 1 0 011 1 11.36 11.36 0 00.57 3.57 1 1 0 01-.24 1.05l-2.2 2.17z" />
          </svg>
          <span className="sr-only">Call to reserve</span>
        </PhoneLink>
        <CtaButton location="mobile_bar" fullWidth>
          Reserve Your Seat
        </CtaButton>
      </div>
    </div>
  );
}
