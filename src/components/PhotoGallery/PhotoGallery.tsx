/**
 * Photo Gallery Component
 * Full-screen modal photo gallery with navigation
 */

import React, { useState, useEffect } from 'react';
import Icon from '../Icon';
import './PhotoGallery.css';

interface PhotoGalleryProps {
  images: string[];
  isOpen: boolean;
  onClose: () => void;
  initialIndex?: number;
  vehicleName?: string;
}

export const PhotoGallery: React.FC<PhotoGalleryProps> = ({
  images,
  isOpen,
  onClose,
  initialIndex = 0,
  vehicleName
}) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);

  // Update index when initialIndex changes
  useEffect(() => {
    setCurrentIndex(initialIndex);
  }, [initialIndex]);

  // Handle keyboard navigation
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowLeft') {
        handlePrevious();
      } else if (e.key === 'ArrowRight') {
        handleNext();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, currentIndex]);

  // Prevent body scroll when gallery is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const handleThumbnailClick = (index: number) => {
    setCurrentIndex(index);
  };

  if (!isOpen) return null;

  return (
    <div className="photo-gallery">
      <div className="photo-gallery__overlay" onClick={onClose} />
      
      <div className="photo-gallery__content">
        {/* Header */}
        <div className="photo-gallery__header">
          <div className="photo-gallery__title">
            {vehicleName && <h2>{vehicleName}</h2>}
            <span className="photo-gallery__counter">
              {currentIndex + 1} / {images.length}
            </span>
          </div>
          <button 
            className="photo-gallery__close"
            onClick={onClose}
            aria-label="Close gallery"
          >
            <Icon name="close" size={28} />
          </button>
        </div>

        {/* Main Image */}
        <div className="photo-gallery__main">
          <button
            className="photo-gallery__nav photo-gallery__nav--prev"
            onClick={handlePrevious}
            disabled={images.length <= 1}
            aria-label="Previous image"
          >
            <Icon name="chevron_left" size={48} />
          </button>

          <div className="photo-gallery__image-container">
            <img
              src={images[currentIndex]}
              alt={`${vehicleName || 'Vehicle'} - Photo ${currentIndex + 1}`}
              className="photo-gallery__image"
            />
          </div>

          <button
            className="photo-gallery__nav photo-gallery__nav--next"
            onClick={handleNext}
            disabled={images.length <= 1}
            aria-label="Next image"
          >
            <Icon name="chevron_right" size={48} />
          </button>
        </div>

        {/* Thumbnails */}
        {images.length > 1 && (
          <div className="photo-gallery__thumbnails">
            <div className="photo-gallery__thumbnails-scroll">
              {images.map((image, index) => (
                <button
                  key={index}
                  className={`photo-gallery__thumbnail ${
                    index === currentIndex ? 'photo-gallery__thumbnail--active' : ''
                  }`}
                  onClick={() => handleThumbnailClick(index)}
                  aria-label={`View photo ${index + 1}`}
                >
                  <img src={image} alt={`Thumbnail ${index + 1}`} />
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PhotoGallery;


