"use client";

import { useState } from "react";
import Image from "next/image";
import { Play } from "lucide-react";

export default function VideoFacade({
  embedUrl,
  thumbnailUrl,
  title,
  className = "",
}: {
  embedUrl: string;
  thumbnailUrl?: string;
  title: string;
  className?: string;
}) {
  const [playing, setPlaying] = useState(false);

  const youtubeId = embedUrl.match(/embed\/([a-zA-Z0-9_-]+)/)?.[1];
  const fallbackThumbnail = youtubeId
    ? `https://i.ytimg.com/vi/${youtubeId}/hqdefault.jpg`
    : undefined;
  const thumbnail = thumbnailUrl || fallbackThumbnail;

  if (playing) {
    return (
      <iframe
        className={className}
        src={`${embedUrl}?autoplay=1`}
        title={title}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
    );
  }

  return (
    <button
      type="button"
      onClick={() => setPlaying(true)}
      className={`group relative flex items-center justify-center overflow-hidden ${className}`}
      aria-label={`Reproducir video: ${title}`}
    >
      {thumbnail && (
        <Image
          src={thumbnail}
          alt={title}
          fill
          unoptimized
          className="object-cover transition group-hover:scale-105"
        />
      )}
      <span className="relative z-10 flex h-16 w-16 items-center justify-center rounded-full bg-brand-red text-white shadow-lg transition group-hover:scale-110">
        <Play className="ml-1 h-6 w-6" fill="currentColor" />
      </span>
    </button>
  );
}
