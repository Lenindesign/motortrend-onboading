import { useState, useEffect } from 'react';

const DEFAULT_FALLBACK_IMAGE = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="300" height="200" viewBox="0 0 300 200"%3E%3Crect fill="%23374151" width="300" height="200"/%3E%3Ctext fill="%239CA3AF" font-family="system-ui" font-size="14" text-anchor="middle" x="150" y="100"%3EImage unavailable%3C/text%3E%3C/svg%3E';

export const useImageFallback = (initialImage: string | undefined, fallbackImage: string = DEFAULT_FALLBACK_IMAGE) => {
  const [imgSrc, setImgSrc] = useState(initialImage || fallbackImage);
  const [imgError, setImgError] = useState(false);

  useEffect(() => {
    setImgSrc(initialImage || fallbackImage);
    setImgError(false);
  }, [initialImage, fallbackImage]);

  const handleImageError = () => {
    if (!imgError) {
      setImgError(true);
      setImgSrc(fallbackImage);
    }
  };

  return { imgSrc, imgError, handleImageError };
};

