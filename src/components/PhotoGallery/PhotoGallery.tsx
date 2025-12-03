/**
 * Photo Gallery Component - Lead Generation Focused
 * Redesigned to prioritize helping users find the best vehicle lead
 * 
 * Key Improvements:
 * - Split-screen layout: 60% photos, 40% listings (desktop)
 * - Prominent listing cards with clear CTAs
 * - Quick filters for price, mileage, condition
 * - Sticky "Best Deal" highlight
 * - Mobile-optimized with swipeable tabs
 */

import React, { useState, useEffect, useRef } from 'react';
import { ModalShell } from '../atoms/ModalShell';
import Icon from '../Icon';
import { Badge } from '../atoms/Badge/Badge';
import { SavedModal } from '../SavedModal';
import type { LocalListing } from '../LocalListingsSidebar/LocalListingsSidebar';
import { isLeadSaved, toggleSaveLead } from '../../utils/savedLeads';
import './PhotoGallery.css';

interface PhotoGalleryProps {
  images: string[];
  isOpen: boolean;
  onClose: () => void;
  initialIndex?: number;
  vehicleName?: string;
  localListings?: LocalListing[];
  onViewAllListings?: () => void;
  onListingClick?: (listing: LocalListing) => void;
}

type SortOption = 'price-low' | 'price-high' | 'mileage-low' | 'distance';
type FilterCondition = 'all' | 'new' | 'used' | 'cpo';

export const PhotoGallery: React.FC<PhotoGalleryProps> = ({
  images,
  isOpen,
  onClose,
  initialIndex = 0,
  vehicleName,
  localListings = [],
  onViewAllListings,
  onListingClick
}) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [sortBy, setSortBy] = useState<SortOption>('price-low');
  const [filterCondition, setFilterCondition] = useState<FilterCondition>('all');
  const [activeTab, setActiveTab] = useState<'photos' | 'listings'>('photos');
  const [currentListingPhotoIndex, setCurrentListingPhotoIndex] = useState<Record<string, number>>({});
  const [savedLeads, setSavedLeads] = useState<Set<string>>(new Set());
  const [isSavedModalOpen, setIsSavedModalOpen] = useState(false);
  const [savedLeadTitle, setSavedLeadTitle] = useState('');
  const [localImages, setLocalImages] = useState<string[]>(images);
  const thumbnailsRef = useRef<HTMLDivElement>(null);
  const thumbnailRefs = useRef<(HTMLButtonElement | null)[]>([]);
  
  const hasListings = localListings && localListings.length > 0;

  // Update local images when prop changes
  useEffect(() => {
    setLocalImages(images);
    setCurrentIndex(0);
  }, [images]);

  // Load saved leads on mount and when listings change
  useEffect(() => {
    if (localListings.length > 0) {
      const saved = new Set<string>();
      localListings.forEach(listing => {
        if (isLeadSaved(listing.id)) {
          saved.add(listing.id);
        }
      });
      setSavedLeads(saved);
    }
  }, [localListings]);

  // Update index when initialIndex changes
  useEffect(() => {
    setCurrentIndex(initialIndex);
  }, [initialIndex]);

  // Update index and reset when images change (e.g., clicking on different listing)
  useEffect(() => {
    if (localImages.length > 0) {
      const validIndex = initialIndex >= 0 && initialIndex < localImages.length ? initialIndex : 0;
      setCurrentIndex(validIndex);
    } else {
      setCurrentIndex(0);
    }
  }, [localImages, initialIndex]);

  // Ensure currentIndex is always valid
  useEffect(() => {
    if (localImages.length > 0 && currentIndex >= localImages.length) {
      setCurrentIndex(0);
    }
  }, [localImages.length, currentIndex]);

  // Scroll active thumbnail into view
  useEffect(() => {
    if (thumbnailRefs.current[currentIndex] && thumbnailsRef.current) {
      const thumbnail = thumbnailRefs.current[currentIndex];
      const container = thumbnailsRef.current;
      
      if (thumbnail) {
        const containerRect = container.getBoundingClientRect();
        const thumbnailRect = thumbnail.getBoundingClientRect();
        
        // Check if thumbnail is outside visible area
        if (thumbnailRect.left < containerRect.left) {
          thumbnail.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'start' });
        } else if (thumbnailRect.right > containerRect.right) {
          thumbnail.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'end' });
        }
      }
    }
  }, [currentIndex]);

  // Handle keyboard navigation
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
    if (localImages.length > 0) {
      setCurrentIndex((prev) => (prev + 1) % localImages.length);
    }
  };

  const handlePrevious = () => {
    if (localImages.length > 0) {
      setCurrentIndex((prev) => (prev - 1 + localImages.length) % localImages.length);
    }
  };

  // Filter and sort listings
  const filteredAndSortedListings = React.useMemo(() => {
    let filtered = [...localListings];

    // Apply condition filter
    if (filterCondition !== 'all') {
      filtered = filtered.filter(listing => {
        if (filterCondition === 'new') return listing.condition === 'New';
        if (filterCondition === 'used') return listing.condition === 'Used';
        if (filterCondition === 'cpo') return listing.condition === 'Certified Pre-Owned';
        return true;
      });
    }

    // Apply sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'price-low':
          return a.price - b.price;
        case 'price-high':
          return b.price - a.price;
        case 'mileage-low':
          return a.mileage - b.mileage;
        case 'distance':
          return a.distance - b.distance;
        default:
          return 0;
      }
    });

    return filtered;
  }, [localListings, sortBy, filterCondition]);

  const formatPrice = (price: number): string => {
    return `$${price.toLocaleString()}`;
  };

  const formatMileage = (mileage: number): string => {
    if (mileage === 0) return 'New';
    return `${mileage.toLocaleString()} mi`;
  };

  const handleListingPhotoNav = (listingId: string, direction: 'prev' | 'next', photoCount: number) => {
    setCurrentListingPhotoIndex(prev => {
      const current = prev[listingId] || 0;
      const next = direction === 'next' 
        ? (current + 1) % photoCount
        : (current - 1 + photoCount) % photoCount;
      return { ...prev, [listingId]: next };
    });
  };

  const handleListingCardClick = (listing: LocalListing) => {
    const listingPhotos = listing.photoUrls || [listing.imageUrl];
    if (listingPhotos.length > 0) {
      // Update local images immediately
      setLocalImages(listingPhotos);
      setCurrentIndex(0);
      // Switch to photos tab
      setActiveTab('photos');
      // Call the parent callback to update the images (for persistence)
      if (onListingClick) {
        onListingClick(listing);
      }
    }
  };

  const handleSaveLead = (listing: LocalListing, e: React.MouseEvent) => {
    e.stopPropagation();
    
    const wasSaved = toggleSaveLead(listing, vehicleName || '');
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

  const renderListingCard = (listing: LocalListing, isBestDeal: boolean = false) => {
    const photos = listing.photoUrls || [listing.imageUrl];
    const currentPhotoIdx = currentListingPhotoIndex[listing.id] || 0;
    const hasMultiplePhotos = photos.length > 1;

    return (
      <div 
        key={listing.id} 
        className={`photo-gallery__listing-card ${isBestDeal ? 'photo-gallery__listing-card--best' : ''}`}
        onClick={() => handleListingCardClick(listing)}
        style={{ cursor: 'pointer' }}
      >
        {isBestDeal && (
          <div className="photo-gallery__best-deal-badge">
            <Icon name="star" variant="filled" size={16} />
            <span>Best Deal</span>
          </div>
        )}

        {/* Listing Image with Navigation */}
        <div className="photo-gallery__listing-image">
          <img src={photos[currentPhotoIdx]} alt={`${listing.year} ${vehicleName}`} />
          
          {/* Save Button */}
          <button
            className={`photo-gallery__listing-save ${savedLeads.has(listing.id) ? 'photo-gallery__listing-save--saved' : ''}`}
            onClick={(e) => handleSaveLead(listing, e)}
            aria-label={savedLeads.has(listing.id) ? 'Unsave lead' : 'Save lead'}
          >
            <Icon 
              name={savedLeads.has(listing.id) ? 'bookmark' : 'bookmark_border'} 
              variant={savedLeads.has(listing.id) ? 'filled' : 'outlined'}
              size={20} 
            />
          </button>
          
          {hasMultiplePhotos && (
            <>
              <button
                className="photo-gallery__listing-nav photo-gallery__listing-nav--prev"
                onClick={(e) => {
                  e.stopPropagation();
                  handleListingPhotoNav(listing.id, 'prev', photos.length);
                }}
                aria-label="Previous photo"
              >
                <Icon name="chevron_left" size={20} />
              </button>
              <button
                className="photo-gallery__listing-nav photo-gallery__listing-nav--next"
                onClick={(e) => {
                  e.stopPropagation();
                  handleListingPhotoNav(listing.id, 'next', photos.length);
                }}
                aria-label="Next photo"
              >
                <Icon name="chevron_right" size={20} />
              </button>
              <div className="photo-gallery__listing-photo-counter">
                {currentPhotoIdx + 1}/{photos.length}
              </div>
            </>
          )}
        </div>

        {/* Listing Details */}
        <div className="photo-gallery__listing-details">
          <div className="photo-gallery__listing-header">
            <div className="photo-gallery__listing-title">
              {listing.year} {vehicleName}{listing.trim ? ` ${listing.trim}` : ''}
            </div>
            <Badge 
              variant={listing.condition === 'New' ? 'success' : listing.condition === 'Certified Pre-Owned' ? 'info' : 'neutral'} 
              size="sm"
            >
              {listing.condition === 'Certified Pre-Owned' ? 'CPO' : listing.condition}
            </Badge>
          </div>
          
          <div className="photo-gallery__listing-price">{formatPrice(listing.price)}</div>
          
          <div className="photo-gallery__listing-info">
            <div className="photo-gallery__listing-info-item">
              <Icon name="speed" size={16} />
              <span>{formatMileage(listing.mileage)}</span>
            </div>
          </div>
          
          <div className="photo-gallery__listing-dealer">
            <Icon name="store" size={16} />
            <span className="photo-gallery__listing-dealer-name">{listing.dealerName}</span>
          </div>
          
          <div className="photo-gallery__listing-location">
            <Icon name="location_on" size={16} />
            <span>{listing.location} • {listing.distance} mi away</span>
          </div>
          
          {listing.exteriorColor && (
            <div className="photo-gallery__listing-colors">
              <span className="photo-gallery__listing-color-label">Exterior:</span>
              <span className="photo-gallery__listing-color-value">{listing.exteriorColor}</span>
              {listing.interiorColor && (
                <>
                  <span className="photo-gallery__listing-color-separator">•</span>
                  <span className="photo-gallery__listing-color-label">Interior:</span>
                  <span className="photo-gallery__listing-color-value">{listing.interiorColor}</span>
                </>
              )}
            </div>
          )}
          
          <button 
            className="photo-gallery__listing-cta"
            onClick={(e) => {
              e.stopPropagation();
              // Handle view details action
            }}
          >
            View Details
            <Icon name="arrow_forward" size={16} />
          </button>
        </div>
      </div>
    );
  };

  return (
    <ModalShell
      isOpen={isOpen}
      onClose={onClose}
      overlayVariant="dark"
      maxWidth="100vw"
      maxHeight="100vh"
      closeOnOverlayClick={false}
      closeOnEscape={true}
      className="photo-gallery photo-gallery--lead-focused"
      zIndex={10000}
    >
      <div className="photo-gallery__container">
        {/* Header */}
        <div className="photo-gallery__header">
          <div className="photo-gallery__header-left">
            <h2 className="photo-gallery__title">{vehicleName}</h2>
            {hasListings && (
              <Badge variant="info" size="md">
                {filteredAndSortedListings.length} Available
              </Badge>
            )}
          </div>
          <button 
            className="photo-gallery__close"
            onClick={onClose}
            aria-label="Close gallery"
          >
            <Icon name="close" size={28} />
          </button>
        </div>

        {/* Mobile Tabs */}
        <div className="photo-gallery__mobile-tabs">
          <button
            className={`photo-gallery__mobile-tab ${activeTab === 'photos' ? 'photo-gallery__mobile-tab--active' : ''}`}
            onClick={() => setActiveTab('photos')}
          >
            <Icon name="photo_library" size={20} />
            <span>Photos ({localImages.length})</span>
          </button>
          <button
            className={`photo-gallery__mobile-tab ${activeTab === 'listings' ? 'photo-gallery__mobile-tab--active' : ''}`}
            onClick={() => setActiveTab('listings')}
          >
            <Icon name="local_offer" size={20} />
            <span>Deals ({filteredAndSortedListings.length})</span>
          </button>
        </div>

        {/* Main Content */}
        <div className="photo-gallery__content">
          {/* Left Side: Photos */}
          <div className={`photo-gallery__photos-section ${activeTab === 'photos' ? 'photo-gallery__photos-section--active' : ''}`}>
            <div className="photo-gallery__main-image">
            {localImages.length > 0 && localImages[currentIndex] ? (
              <img
                key={`img-${currentIndex}-${localImages[currentIndex]}`}
                src={localImages[currentIndex]}
                alt={`${vehicleName || 'Vehicle'} - Photo ${currentIndex + 1}`}
                className="photo-gallery__image"
              />
            ) : localImages.length === 0 ? (
              <div className="photo-gallery__image-placeholder">
                <Icon name="image" size={48} />
                <p>No images available</p>
              </div>
            ) : null}
              
              {/* Navigation Arrows */}
              {localImages.length > 1 && (
                <>
                  <button
                    className="photo-gallery__nav photo-gallery__nav--prev"
                    onClick={handlePrevious}
                    aria-label="Previous image"
                  >
                    <Icon name="chevron_left" size={48} />
                  </button>
          <button
            className="photo-gallery__nav photo-gallery__nav--next"
            onClick={handleNext}
            aria-label="Next image"
          >
            <Icon name="chevron_right" size={48} />
          </button>
                </>
              )}

              {/* Photo Counter */}
              {localImages.length > 0 && (
                <div className="photo-gallery__photo-counter">
                  {currentIndex + 1} / {localImages.length}
                </div>
              )}
        </div>

        {/* Thumbnails */}
        {localImages.length > 1 && (
          <div className="photo-gallery__thumbnails" ref={thumbnailsRef}>
              {localImages.map((image, index) => (
                <button
                  key={index}
                  ref={(el) => {
                    thumbnailRefs.current[index] = el;
                  }}
                  className={`photo-gallery__thumbnail ${
                    index === currentIndex ? 'photo-gallery__thumbnail--active' : ''
                  }`}
                    onClick={() => setCurrentIndex(index)}
                  aria-label={`View photo ${index + 1}`}
                >
                  <img src={image} alt={`Thumbnail ${index + 1}`} />
                </button>
              ))}
            </div>
            )}
          </div>

          {/* Right Side: Listings */}
          {hasListings && (
            <div className={`photo-gallery__listings-section ${activeTab === 'listings' ? 'photo-gallery__listings-section--active' : ''}`}>
              {/* Filters and Sort */}
              <div className="photo-gallery__controls">
                <div className="photo-gallery__filters">
                  <button
                    className={`photo-gallery__filter-btn ${filterCondition === 'all' ? 'photo-gallery__filter-btn--active' : ''}`}
                    onClick={() => setFilterCondition('all')}
                  >
                    All
                  </button>
                  <button
                    className={`photo-gallery__filter-btn ${filterCondition === 'new' ? 'photo-gallery__filter-btn--active' : ''}`}
                    onClick={() => setFilterCondition('new')}
                  >
                    New
                  </button>
                  <button
                    className={`photo-gallery__filter-btn ${filterCondition === 'used' ? 'photo-gallery__filter-btn--active' : ''}`}
                    onClick={() => setFilterCondition('used')}
                  >
                    Used
                  </button>
                  <button
                    className={`photo-gallery__filter-btn ${filterCondition === 'cpo' ? 'photo-gallery__filter-btn--active' : ''}`}
                    onClick={() => setFilterCondition('cpo')}
                  >
                    CPO
                  </button>
                </div>

                <div className="photo-gallery__sort">
                  <Icon name="sort" size={18} />
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as SortOption)}
                    className="photo-gallery__sort-select"
                  >
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                    <option value="mileage-low">Mileage: Low to High</option>
                    <option value="distance">Distance: Nearest</option>
                  </select>
                </div>
              </div>

              {/* Listings Grid */}
              <div className="photo-gallery__listings-grid">
                {filteredAndSortedListings.length > 0 ? (
                  filteredAndSortedListings.map((listing, index) => 
                    renderListingCard(listing, index === 0 && sortBy === 'price-low')
                  )
                ) : (
                  <div className="photo-gallery__no-results">
                    <Icon name="search_off" size={48} />
                    <p>No listings match your filters</p>
                    <button 
                      className="photo-gallery__reset-filters"
                      onClick={() => setFilterCondition('all')}
                    >
                      Reset Filters
                    </button>
                  </div>
                )}
              </div>

              {/* View All CTA */}
              {onViewAllListings && filteredAndSortedListings.length > 0 && (
                <div className="photo-gallery__view-all">
                  <button 
                    className="photo-gallery__view-all-btn"
                    onClick={onViewAllListings}
                  >
                    View All {localListings.length} Listings
                    <Icon name="open_in_new" size={20} />
                  </button>
                </div>
              )}
          </div>
        )}
        </div>
      </div>

      {/* Saved Modal */}
      <SavedModal
        isOpen={isSavedModalOpen}
        onClose={() => setIsSavedModalOpen(false)}
        itemTitle={savedLeadTitle}
        itemType="lead"
      />
    </ModalShell>
  );
};

export default PhotoGallery;
