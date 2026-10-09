'use client';

import { useState } from 'react';
import Image from 'next/image';

export default function ProductGallery({
  title,
  images,
}: {
  title: string;
  images: string[];
}) {
  const galleryImages = Array.from(new Set(images.filter(Boolean)));
  const [selectedImage, setSelectedImage] = useState(galleryImages[0] ?? null);
  const selectedIndex = selectedImage ? galleryImages.indexOf(selectedImage) : -1;

  return (
    <section aria-label={`${title} images`}>
      <div className="relative aspect-square overflow-hidden bg-muted">
        {selectedImage ? (
          <Image
            src={selectedImage}
            alt={`${title}, image ${selectedIndex + 1}`}
            fill
            loading="eager"
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-contain p-6 sm:p-10"
          />
        ) : (
          <p className="flex h-full items-center justify-center text-muted-foreground">No image available</p>
        )}
      </div>

      {galleryImages.length > 1 && (
        <ul aria-label="Choose product image" className="mt-4 flex flex-wrap gap-3">
          {galleryImages.map((image, index) => (
            <li key={image}>
              <button
                type="button"
                aria-label={`Show image ${index + 1} of ${galleryImages.length}`}
                aria-pressed={image === selectedImage}
                onClick={() => setSelectedImage(image)}
                className={`thumbnail-choice relative size-16 overflow-hidden border border-border bg-surface sm:size-20 ${
                  image === selectedImage ? 'opacity-100' : 'opacity-45 hover:opacity-70'
                }`}
              >
                <Image src={image} alt="" fill sizes="80px" className="object-contain p-2" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
