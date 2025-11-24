/**
 * Photo Gallery Component
 * Full-screen modal photo gallery with navigation
 * Now uses ModalShell atom for consistent overlay
 */

import React, { useState, useEffect } from 'react';
import { ModalShell } from '../atoms/ModalShell';
import Icon from '../Icon';
import { LocalListingsSidebar, type LocalListing } from '../LocalListingsSidebar/LocalListingsSidebar';
import './PhotoGallery.css';

interface PhotoGalleryProps {
  images: string[];
  isOpen: boolean;
  onClose: () => void;
  initialIndex?: number;
  vehicleName?: string;
  localListings?: LocalListing[];
  onViewAllListings?: () => void;
}

export const PhotoGallery: React.FC<PhotoGalleryProps> = ({
  images,
  isOpen,
  onClose,
  initialIndex = 0,
  vehicleName,
  localListings = [],
  onViewAllListings
}) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const hasListings = localListings && localListings.length > 0;

  // Update index when initialIndex changes
  useEffect(() => {
    setCurrentIndex(initialIndex);
  }, [initialIndex]);

  // Handle keyboard navigation (arrow keys only, escape handled by ModalShell)
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        handlePrevious();
      } else if (e.key === 'ArrowRight') {
        handleNext();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, currentIndex]);

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const handleThumbnailClick = (index: number) => {
    setCurrentIndex(index);
  };

  return (
    <ModalShell
      isOpen={isOpen}
      onClose={onClose}
      overlayVariant="dark"
      maxWidth="100vw"
      maxHeight="100vh"
      closeOnOverlayClick={true}
      closeOnEscape={true}
      className="photo-gallery"
      zIndex={10000}
    >
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

        <div className="photo-gallery__body">
          {/* Full-Screen Image Background */}
          <div className="photo-gallery__main photo-gallery__main--fullscreen">
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

          {/* Collapsible Sidebar Overlay with Local Listings */}
          {hasListings && vehicleName && (
            <>
              <div className={`photo-gallery__sidebar-overlay ${isSidebarOpen ? 'photo-gallery__sidebar-overlay--open' : ''}`}>
                <button 
                  className="photo-gallery__sidebar-toggle"
                  onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                  aria-label={isSidebarOpen ? 'Close listings' : 'Open listings'}
                >
                  <Icon name={isSidebarOpen ? 'chevron_right' : 'chevron_left'} size={24} />
                  {!isSidebarOpen && (
                    <span className="photo-gallery__sidebar-toggle-text">
                      {localListings.length} Listings
                    </span>
                  )}
                </button>
                <div className="photo-gallery__sidebar-content">
                  <LocalListingsSidebar
                    vehicleName={vehicleName}
                    listings={localListings}
                    onViewAllListings={onViewAllListings}
                  />
                </div>
              </div>
            </>
          )}
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
    </ModalShell>
  );
};

export default PhotoGallery;




