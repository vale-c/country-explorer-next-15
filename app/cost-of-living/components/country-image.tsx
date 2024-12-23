'use client';

import Image from 'next/image';
import { useState } from 'react';

interface CountryImageProps {
  src: string;
  alt: string;
}

export function CountryImage({ src, alt }: CountryImageProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);

  return (
    <div className="relative w-full h-40 rounded-t-lg overflow-hidden bg-gray-200">
      <Image
        src={error ? '/images/placeholder.jpg' : src}
        alt={alt}
        fill
        className={`object-cover transition-opacity duration-300 ${
          isLoading ? 'opacity-0' : 'opacity-100'
        }`}
        onLoad={() => setIsLoading(false)}
        onError={() => {
          setError(true);
          setIsLoading(false);
        }}
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        priority={true}
      />
      {isLoading && (
        <div className="absolute inset-0 bg-gray-200 animate-pulse" />
      )}
    </div>
  );
}
