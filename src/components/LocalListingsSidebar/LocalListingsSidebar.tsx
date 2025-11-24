import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Icon } from '../Icon/Icon';
import { PhotoGallery } from '../PhotoGallery';
import { parseVehicleName } from '../../utils/vehicleImages';
import './LocalListingsSidebar.css';

export interface LocalListing {
  id: string;
  dealerName: string;
  price: number;
  mileage: number;
  year: string;
  condition: 'New' | 'Used' | 'Certified Pre-Owned';
  location: string;
  distance: number;
  imageUrl: string;
  photoUrls?: string[]; // Array of all available photos
  trim?: string;
  exteriorColor?: string;
  interiorColor?: string;
  vin?: string;
  stockNumber?: string;
}

export interface LocalListingsSidebarProps {
  vehicleName: string;
  listings: LocalListing[];
  onViewAllListings?: () => void;
}

export const LocalListingsSidebar: React.FC<LocalListingsSidebarProps> = ({
  vehicleName,
  listings,
  onViewAllListings
}) => {
  console.log('🚗 LocalListingsSidebar rendering:', { vehicleName, listingsCount: listings.length });
  
  const navigate = useNavigate();
  
  // Track current photo index for each listing
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState<Record<string, number>>({});
  // Track which listing card is currently focused/hovered
  const [focusedListingId, setFocusedListingId] = useState<string | null>(null);
  // Track gallery modal state
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [galleryImages, setGalleryImages] = useState<string[]>([]);
  const [galleryStartIndex, setGalleryStartIndex] = useState(0);
  const [galleryVehicleName, setGalleryVehicleName] = useState('');
  
  // Helper to navigate to vehicle detail page
  const navigateToVehicleDetail = (year: string, scrollToId?: string) => {
    const parsed = parseVehicleName(vehicleName);
    const path = `/vehicles/${year}/${parsed.make}/${parsed.model}`;
    if (scrollToId) {
      navigate(path);
      // Scroll after navigation
      setTimeout(() => {
        const element = document.getElementById(scrollToId);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);
    } else {
      navigate(path);
    }
  };
  
  const formatPrice = (price: number): string => {
    return `$${price.toLocaleString()}`;
  };

  const formatMileage = (mileage: number): string => {
    if (mileage === 0) return 'New';
    return `${mileage.toLocaleString()} mi`;
  };

  const handlePrevPhoto = (listingId: string, photoCount: number) => {
    setCurrentPhotoIndex(prev => ({
      ...prev,
      [listingId]: ((prev[listingId] || 0) - 1 + photoCount) % photoCount
    }));
  };

  const handleNextPhoto = (listingId: string, photoCount: number) => {
    setCurrentPhotoIndex(prev => ({
      ...prev,
      [listingId]: ((prev[listingId] || 0) + 1) % photoCount
    }));
  };

  const handleImageClick = (photos: string[], currentIndex: number, listing: LocalListing) => {
    setGalleryImages(photos);
    setGalleryStartIndex(currentIndex);
    setGalleryVehicleName(`${listing.year} ${vehicleName}${listing.trim ? ` ${listing.trim}` : ''}`);
    setIsGalleryOpen(true);
  };

  // Keyboard navigation for photos
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!focusedListingId) return;
      
      const listing = listings.find(l => l.id === focusedListingId);
      if (!listing) return;
      
      const photos = listing.photoUrls || [listing.imageUrl];
      if (photos.length <= 1) return;
      
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        handlePrevPhoto(focusedListingId, photos.length);
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        handleNextPhoto(focusedListingId, photos.length);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [focusedListingId, listings]);

  return (
    <div className="local-listings-sidebar">
      <div className="local-listings-sidebar__header">
        <h3 className="local-listings-sidebar__title">Local Listings</h3>
        <p className="local-listings-sidebar__subtitle">
          {listings.length} {vehicleName} {listings.length === 1 ? 'listing' : 'listings'} near you
        </p>
      </div>

      <div className="local-listings-sidebar__list">
        {listings.map((listing) => {
          const photos = listing.photoUrls || [listing.imageUrl];
          const currentIndex = currentPhotoIndex[listing.id] || 0;
          const hasMultiplePhotos = photos.length > 1;

          return (
            <div 
              key={listing.id} 
              className="local-listings-sidebar__item"
              onMouseEnter={() => setFocusedListingId(listing.id)}
              onMouseLeave={() => setFocusedListingId(null)}
              tabIndex={0}
              onFocus={() => setFocusedListingId(listing.id)}
              onBlur={() => setFocusedListingId(null)}
            >
              <div 
                className="local-listings-sidebar__item-image"
                onClick={() => handleImageClick(photos, currentIndex, listing)}
                style={{ cursor: 'pointer' }}
              >
                <img 
                  src={photos[currentIndex]} 
                  alt={`${listing.year} ${vehicleName}`}
                  loading="lazy"
                />
                {listing.condition === 'Certified Pre-Owned' && (
                  <span className="local-listings-sidebar__badge">CPO</span>
                )}
                
                {/* Photo Navigation */}
                {hasMultiplePhotos && (
                  <>
                    <button
                      className="local-listings-sidebar__photo-nav local-listings-sidebar__photo-nav--prev"
                      onClick={(e) => {
                        e.stopPropagation();
                        handlePrevPhoto(listing.id, photos.length);
                      }}
                      aria-label="Previous photo"
                    >
                      <Icon name="chevron_left" size={20} />
                    </button>
                    <button
                      className="local-listings-sidebar__photo-nav local-listings-sidebar__photo-nav--next"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleNextPhoto(listing.id, photos.length);
                      }}
                      aria-label="Next photo"
                    >
                      <Icon name="chevron_right" size={20} />
                    </button>
                    
                    {/* Photo Counter */}
                    <div className="local-listings-sidebar__photo-counter">
                      {currentIndex + 1} / {photos.length}
                    </div>
                  </>
                )}
              </div>

            <div className="local-listings-sidebar__item-content">
              <div className="local-listings-sidebar__item-header">
                <h4 
                  className="local-listings-sidebar__item-title local-listings-sidebar__item-title--clickable"
                  onClick={() => navigateToVehicleDetail(listing.year)}
                  style={{ cursor: 'pointer' }}
                >
                  {listing.year} {vehicleName}
                  {listing.trim && <span className="local-listings-sidebar__trim"> {listing.trim}</span>}
                </h4>
                <span 
                  className="local-listings-sidebar__condition local-listings-sidebar__condition--clickable"
                  onClick={() => navigateToVehicleDetail(listing.year)}
                  style={{ cursor: 'pointer' }}
                >
                  {listing.condition}
                </span>
              </div>

              <div className="local-listings-sidebar__item-details">
                <div className="local-listings-sidebar__price">
                  {formatPrice(listing.price)}
                </div>
                <div className="local-listings-sidebar__mileage">
                  <Icon name="speed" size={16} />
                  {formatMileage(listing.mileage)}
                </div>
              </div>

              <div className="local-listings-sidebar__dealer">
                <Icon name="store" size={16} />
                <span className="local-listings-sidebar__dealer-name">{listing.dealerName}</span>
              </div>

              <div className="local-listings-sidebar__location">
                <Icon name="location_on" size={16} />
                <span>{listing.location} • {listing.distance} mi away</span>
              </div>

              {listing.exteriorColor && (
                <div className="local-listings-sidebar__colors">
                  <span className="local-listings-sidebar__color-label">Exterior:</span>
                  <span className="local-listings-sidebar__color-value">{listing.exteriorColor}</span>
                  {listing.interiorColor && (
                    <>
                      <span className="local-listings-sidebar__color-separator">•</span>
                      <span className="local-listings-sidebar__color-label">Interior:</span>
                      <span className="local-listings-sidebar__color-value">{listing.interiorColor}</span>
                    </>
                  )}
                </div>
              )}

              <button className="local-listings-sidebar__cta cta cta--primary cta--small">
                View Details
                <Icon name="arrow_forward" size={16} />
              </button>
            </div>
          </div>
          );
        })}
      </div>

      {listings.length > 0 && (
        <button 
          className="local-listings-sidebar__view-all cta cta--secondary cta--default"
          onClick={onViewAllListings}
        >
          View All {listings.length} Listings
          <Icon name="arrow_forward" size={20} />
        </button>
      )}

      {listings.length === 0 && (
        <div className="local-listings-sidebar__empty">
          <Icon name="search_off" size={48} />
          <p>No local listings found</p>
          <p className="local-listings-sidebar__empty-subtitle">
            Try expanding your search radius or check back later
          </p>
        </div>
      )}

      {/* Photo Gallery Modal */}
      <PhotoGallery
        images={galleryImages}
        isOpen={isGalleryOpen}
        initialIndex={galleryStartIndex}
        onClose={() => setIsGalleryOpen(false)}
        vehicleName={galleryVehicleName}
      />
    </div>
  );
};

export default LocalListingsSidebar;

