import React, { useState, useEffect } from 'react';
import { Icon } from '../Icon/Icon';
import { PhotoGallery } from '../PhotoGallery';
import { SavedModal } from '../SavedModal';
import { isLeadSaved, toggleSaveLead } from '../../utils/savedLeads';
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
  
  // Track current photo index for each listing
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState<Record<string, number>>({});
  // Track which listing card is currently focused/hovered
  const [focusedListingId, setFocusedListingId] = useState<string | null>(null);
  // Track gallery modal state
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [galleryImages, setGalleryImages] = useState<string[]>([]);
  const [galleryStartIndex, setGalleryStartIndex] = useState(0);
  const [galleryVehicleName, setGalleryVehicleName] = useState('');
  const [currentGalleryListingId, setCurrentGalleryListingId] = useState<string | null>(null);
  
  // Saved leads state
  const [savedLeads, setSavedLeads] = useState<Set<string>>(new Set());
  const [isSavedModalOpen, setIsSavedModalOpen] = useState(false);
  const [savedLeadTitle, setSavedLeadTitle] = useState('');

  // Load saved leads on mount
  useEffect(() => {
    const saved = new Set<string>();
    listings.forEach(listing => {
      if (isLeadSaved(listing.id)) {
        saved.add(listing.id);
      }
    });
    setSavedLeads(saved);
  }, [listings]);
  
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
    setCurrentGalleryListingId(listing.id);
    setIsGalleryOpen(true);
  };

  const handleSaveLead = (listing: LocalListing, e: React.MouseEvent) => {
    e.stopPropagation();
    
    const wasSaved = toggleSaveLead(listing, vehicleName);
    const listingTitle = `${listing.year} ${vehicleName}${listing.trim ? ` ${listing.trim}` : ''}`;
    
    if (wasSaved) {
      setSavedLeads(prev => new Set(prev).add(listing.id));
      setSavedLeadTitle(listingTitle);
      setIsSavedModalOpen(true);
    } else {
      setSavedLeads(prev => {
        const newSet = new Set(prev);
        newSet.delete(listing.id);
        return newSet;
      });
    }
  };

  const handleListingClickInGallery = (listing: LocalListing) => {
    const photos = listing.photoUrls || [listing.imageUrl];
    const currentIndex = currentPhotoIndex[listing.id] || 0;
    setGalleryImages(photos);
    setGalleryStartIndex(currentIndex);
    setGalleryVehicleName(`${listing.year} ${vehicleName}${listing.trim ? ` ${listing.trim}` : ''}`);
    setCurrentGalleryListingId(listing.id);
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
                
                {/* Save Button */}
                <button
                  className={`local-listings-sidebar__save ${savedLeads.has(listing.id) ? 'local-listings-sidebar__save--saved' : ''}`}
                  onClick={(e) => handleSaveLead(listing, e)}
                  aria-label={savedLeads.has(listing.id) ? 'Unsave lead' : 'Save lead'}
                >
                  <Icon 
                    name={savedLeads.has(listing.id) ? 'bookmark' : 'bookmark_border'} 
                    variant={savedLeads.has(listing.id) ? 'filled' : 'outlined'}
                    size={20} 
                  />
                </button>
                
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
                <h4 className="local-listings-sidebar__item-title">
                  {listing.year} {vehicleName}
                  {listing.trim && <span className="local-listings-sidebar__trim"> {listing.trim}</span>}
                </h4>
                <span className="local-listings-sidebar__condition">{listing.condition}</span>
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
        key={currentGalleryListingId || 'gallery'}
        images={galleryImages}
        isOpen={isGalleryOpen}
        initialIndex={galleryStartIndex}
        onClose={() => {
          setIsGalleryOpen(false);
          setCurrentGalleryListingId(null);
        }}
        vehicleName={galleryVehicleName}
        localListings={listings}
        onViewAllListings={onViewAllListings}
        onListingClick={handleListingClickInGallery}
      />

      {/* Saved Modal */}
      <SavedModal
        isOpen={isSavedModalOpen}
        onClose={() => setIsSavedModalOpen(false)}
        itemTitle={savedLeadTitle}
        itemType="lead"
      />
    </div>
  );
};

export default LocalListingsSidebar;

