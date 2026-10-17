"use client";

import { useState } from "react";
import Image from "next/image";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

export default function ProjectGallery({ images, alt }: { images: string[]; alt: string }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  if (images.length === 0) return null;

  return (
    <>
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
        {images.map((url, index) => (
          <button
            key={url + index}
            onClick={() => setOpenIndex(index)}
            className="relative aspect-square overflow-hidden rounded-2xl"
          >
            <Image
              src={url}
              alt={`${alt} ${index + 1}`}
              fill
              className="object-cover transition duration-300 hover:scale-105"
              sizes="(max-width: 768px) 50vw, 33vw"
            />
          </button>
        ))}
      </div>

      {openIndex !== null && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
          onClick={() => setOpenIndex(null)}
        >
          <button
            onClick={() => setOpenIndex(null)}
            aria-label="Cerrar"
            className="absolute right-4 top-4 text-white/70 hover:text-white"
          >
            <X className="h-8 w-8" />
          </button>

          {images.length > 1 && (
            <>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setOpenIndex((i) => (i! - 1 + images.length) % images.length);
                }}
                aria-label="Anterior"
                className="absolute left-4 text-white/70 hover:text-white"
              >
                <ChevronLeft className="h-10 w-10" />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setOpenIndex((i) => (i! + 1) % images.length);
                }}
                aria-label="Siguiente"
                className="absolute right-4 text-white/70 hover:text-white"
              >
                <ChevronRight className="h-10 w-10" />
              </button>
            </>
          )}

          <div
            className="relative h-[80vh] w-full max-w-4xl"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={images[openIndex]}
              alt={`${alt} ${openIndex + 1}`}
              fill
              className="object-contain"
            />
          </div>
        </div>
      )}
    </>
  );
}
