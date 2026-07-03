"use client";

import { useState } from "react";
import Image from "next/image";
import { Package } from "lucide-react";

interface ProductGalleryProps {
  images: string[];
  productName: string;
}

export default function ProductGallery({ images, productName }: ProductGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  if (images.length === 0) {
    return (
      <div className="aspect-square w-full rounded-lg border border-gray-200 bg-gray-50 flex items-center justify-center">
        <Package size={48} className="text-gray-200" aria-hidden="true" />
      </div>
    );
  }

  return (
    <div className="flex gap-3">
      {images.length > 1 && (
        <div className="flex flex-col gap-3 shrink-0">
          {images.map((src, i) => (
            <button
              key={src + i}
              type="button"
              onClick={() => setActiveIndex(i)}
              aria-label={`View image ${i + 1} of ${productName}`}
              aria-current={i === activeIndex}
              className={`
                relative h-20 w-20 rounded-lg border-2 overflow-hidden bg-gray-50 shrink-0
                transition-colors duration-150
                ${i === activeIndex ? "border-[var(--color-primary)]" : "border-gray-200 hover:border-gray-300"}
              `}
            >
              <Image
                src={src}
                alt=""
                fill
                className="object-contain p-1.5"
                sizes="80px"
              />
            </button>
          ))}
        </div>
      )}

      <div className="relative flex-1 aspect-square rounded-lg border border-gray-200 bg-white overflow-hidden">
        <Image
          src={images[activeIndex]}
          alt={productName}
          fill
          className="object-contain p-6"
          sizes="(max-width: 1024px) 90vw, 45vw"
          priority
        />
      </div>
    </div>
  );
}
