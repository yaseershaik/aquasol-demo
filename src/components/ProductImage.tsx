"use client";

import React, { useState } from "react";

interface ProductImageProps {
  src: string;
  fallbackSrc?: string;
  alt: string;
  className?: string;
}

export default function ProductImage({
  src,
  fallbackSrc = "/images/real/ro-membrane-4040.jpg",
  alt,
  className = "w-full h-full object-cover",
}: ProductImageProps) {
  const [imgSrc, setImgSrc] = useState(src);

  return (
    <img
      src={imgSrc}
      alt={alt}
      className={className}
      onError={() => {
        if (imgSrc !== fallbackSrc) {
          setImgSrc(fallbackSrc);
        }
      }}
    />
  );
}
