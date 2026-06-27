"use client";

import { useState } from "react";
import Image from "next/image";
import { track } from "@/lib/analytics";

type Props = {
  src: string;
  title: string;
};

// Lazy MP4 player for Cloudinary-hosted videos. Shows the auto-generated
// poster (swap .mp4 → .jpg) until clicked, so the video bytes only load on play.
export default function ShowcaseVideo({ src, title }: Props) {
  const [active, setActive] = useState(false);
  const poster = src.replace(/\.mp4$/, ".jpg");

  return (
    <div className="relative aspect-video w-full overflow-hidden rounded-xl bg-navy shadow-md ring-1 ring-navy/10">
      {active ? (
        <video
          src={src}
          poster={poster}
          controls
          autoPlay
          preload="auto"
          playsInline
          className="absolute inset-0 h-full w-full bg-black"
        >
          <track kind="captions" />
        </video>
      ) : (
        <button
          type="button"
          onClick={() => {
            track("showcase_video_play", { video: title });
            setActive(true);
          }}
          aria-label={`Play video: ${title}`}
          className="group absolute inset-0 flex h-full w-full cursor-pointer items-center justify-center focus:outline-none focus-visible:ring-4 focus-visible:ring-green"
        >
          <Image
            src={poster}
            alt={title}
            fill
            sizes="(max-width: 768px) 100vw, 560px"
            className="object-cover opacity-90 transition group-hover:opacity-100"
            unoptimized
          />
          <span className="absolute inset-0 bg-navy/30 transition group-hover:bg-navy/20" />
          <span className="relative flex h-16 w-16 items-center justify-center rounded-full bg-green shadow-xl transition group-hover:scale-110">
            <svg
              viewBox="0 0 24 24"
              fill="currentColor"
              className="ml-1 h-8 w-8 text-white"
              aria-hidden="true"
            >
              <path d="M8 5v14l11-7z" />
            </svg>
          </span>
        </button>
      )}
    </div>
  );
}
