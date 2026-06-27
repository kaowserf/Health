"use client";

import { useState } from "react";
import Image from "next/image";
import { track } from "@/lib/analytics";

type Props = {
  id: string;
  title: string;
};

// Lazy YouTube embed (PRD §7.5): renders only the thumbnail + play button
// until the user clicks, avoiding the heavy iframe on initial paint.
export default function LiteYouTube({ id, title }: Props) {
  const [active, setActive] = useState(false);
  // maxresdefault is missing for some videos (404). Fall back through the
  // thumbnails that always exist so the poster never appears broken.
  const fallbacks = [
    `https://i.ytimg.com/vi/${id}/sddefault.jpg`,
    `https://i.ytimg.com/vi/${id}/hqdefault.jpg`,
    `https://i.ytimg.com/vi/${id}/mqdefault.jpg`,
  ];
  const [thumbIndex, setThumbIndex] = useState(0);

  const handlePlay = () => {
    track("video_play", { video_id: id });
    setActive(true);
  };

  return (
    <div className="relative aspect-video w-full overflow-hidden rounded-xl bg-navy shadow-lg ring-1 ring-navy/10">
      {active ? (
        <iframe
          className="absolute inset-0 h-full w-full"
          src={`https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0`}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      ) : (
        <button
          type="button"
          onClick={handlePlay}
          aria-label={`Play video: ${title}`}
          className="group absolute inset-0 flex h-full w-full cursor-pointer items-center justify-center focus:outline-none focus-visible:ring-4 focus-visible:ring-green"
        >
          <Image
            src={fallbacks[thumbIndex]}
            alt={title}
            fill
            sizes="(max-width: 768px) 100vw, 800px"
            className="object-cover opacity-90 transition group-hover:opacity-100"
            unoptimized
            onError={() =>
              setThumbIndex((i) => Math.min(i + 1, fallbacks.length - 1))
            }
          />
          <span className="absolute inset-0 bg-navy/30 transition group-hover:bg-navy/20" />
          <span className="relative flex h-20 w-20 items-center justify-center rounded-full bg-green shadow-xl transition group-hover:scale-110">
            <svg
              viewBox="0 0 24 24"
              fill="currentColor"
              className="ml-1 h-9 w-9 text-navy"
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
