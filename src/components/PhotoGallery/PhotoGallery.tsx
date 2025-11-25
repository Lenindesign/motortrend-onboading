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

import React, { useState, useEffect } from 'react';
import { ModalShell } from '../atoms/ModalShell';
import Icon from '../Icon';
import { Badge } from '../atoms/Badge/Badge';
import type { LocalListing } from '../LocalListingsSidebar/LocalListingsSidebar';
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

type SortOption = 'price-low' | 'price-high' | 'mileage-low' | 'distance';
type FilterCondition = 'all' | 'new' | 'used' | 'cpo';

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
  const [sortBy, setSortBy] = useState<SortOption>('price-low');
  const [filterCondition, setFilterCondition] = useState<FilterCondition>('all');
  const [activeTab, setActiveTab] = useState<'photos' | 'listings'>('photos');
  const [currentListingPhotoIndex, setCurrentListingPhotoIndex] = useState<Record<string, number>>({});
  
  const hasListings = localListings && localListings.length > 0;

  // Update index when initialIndex changes
  useEffect(() => {
    setCurrentIndex(initialIndex);
  }, [initialIndex]);

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
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
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

  const renderListingCard = (listing: LocalListing, isBestDeal: boolean = false) => {
    const photos = listing.photoUrls || [listing.imageUrl];
    const currentPhotoIdx = currentListingPhotoIndex[listing.id] || 0;
    const hasMultiplePhotos = photos.length > 1;

    return (
      <div 
        key={listing.id} 
        className={`photo-gallery__listing-card ${isBestDeal ? 'photo-gallery__listing-card--best' : ''}`}
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
          
          {hasMultiplePhotos && (
            <>
              <button
                className="photo-gallery__listing-nav photo-gallery__listing-nav--prev"
                onClick={() => handleListingPhotoNav(listing.id, 'prev', photos.length)}
                aria-label="Previous photo"
              >
                <Icon name="chevron_left" size={20} />
              </button>
              <button
                className="photo-gallery__listing-nav photo-gallery__listing-nav--next"
                onClick={() => handleListingPhotoNav(listing.id, 'next', photos.length)}
                aria-label="Next photo"
              >
                <Icon name="chevron_right" size={20} />
              </button>
              <div className="photo-gallery__listing-photo-counter">
                {currentPhotoIdx + 1}/{photos.length}
              </div>
            </>
          )}

          {/* Condition Badge */}
          <div className="photo-gallery__listing-condition">
            <Badge 
              variant={listing.condition === 'New' ? 'success' : listing.condition === 'Certified Pre-Owned' ? 'info' : 'neutral'} 
              size="sm"
            >
              {listing.condition === 'Certified Pre-Owned' ? 'CPO' : listing.condition}
            </Badge>
          </div>
        </div>

        {/* Listing Details */}
        <div className="photo-gallery__listing-details">
          <div className="photo-gallery__listing-price">{formatPrice(listing.price)}</div>
          <div className="photo-gallery__listing-title">
            {listing.year} {vehicleName}{listing.trim ? ` ${listing.trim}` : ''}
          </div>
          <div className="photo-gallery__listing-info">
            <div className="photo-gallery__listing-info-item">
              <Icon name="speed" size={16} />
              <span>{formatMileage(listing.mileage)}</span>
            </div>
            <div className="photo-gallery__listing-info-item photo-gallery__listing-dealer">
              <Icon name="location_on" size={16} />
              <span>{listing.dealerName}</span>
            </div>
          </div>
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
            <span>Photos ({images.length})</span>
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
              <img
                src={images[currentIndex]}
                alt={`${vehicleName || 'Vehicle'} - Photo ${currentIndex + 1}`}
                className="photo-gallery__image"
              />
              
              {/* Navigation Arrows */}
              {images.length > 1 && (
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
              <div className="photo-gallery__photo-counter">
                {currentIndex + 1} / {images.length}
              </div>
            </div>

            {/* Thumbnails */}
            {images.length > 1 && (
              <div className="photo-gallery__thumbnails">
                {images.map((image, index) => (
                  <button
                    key={index}
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
    </ModalShell>
  );
};

export default PhotoGallery;
