/**
 * ListingCard Component
 * Unified card component for vehicle listings used across the app
 * Standardized design following atomic design principles
 */

import React, { useState } from 'react';
import Icon from '../Icon';
import { isLeadSaved, toggleSaveLead } from '../../utils/savedLeads';
import type { LocalListing } from '../LocalListingsSidebar';

export interface ListingCardProps {
  /** Listing data */
  listing: LocalListing;
  /** Vehicle name (make + model) */
  vehicleName: string;
  /** Optional vehicle year override */
  vehicleYear?: string;
  /** Card variant - compact for carousels, full for sidebars */
  variant?: 'compact' | 'full';
  /** Called when card is clicked */
  onClick?: () => void;
  /** Called when image is clicked to open gallery */
  onImageClick?: (photos: string[], currentIndex: number) => void;
  /** Called when save state changes */
  onSaveChange?: (isSaved: boolean) => void;
  /** Called when View Details is clicked */
  onViewDetails?: () => void;
  /** Hide the CTA button */
  hideCta?: boolean;
  /** Custom class name */
  className?: string;
}

export const ListingCard: React.FC<ListingCardProps> = ({
  listing,
  vehicleName,
  vehicleYear,
  variant = 'compact',
  onClick,
  onImageClick,
  onSaveChange,
  onViewDetails,
  hideCta = false,
  className = '',
}) => {
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [isSaveHovered, setIsSaveHovered] = useState(false);
  const [isNavHovered, setIsNavHovered] = useState<'prev' | 'next' | null>(null);
  const [isCtaHovered, setIsCtaHovered] = useState(false);
  const [isSaved, setIsSaved] = useState(() => isLeadSaved(listing.id));

  const photos = listing.photoUrls || [listing.imageUrl];
  const hasMultiplePhotos = photos.length > 1;
  const isCompact = variant === 'compact';
  const year = vehicleYear || listing.year;

  const formatPrice = (price: number): string => `$${price.toLocaleString()}`;
  const formatMileage = (mileage: number): string => 
    mileage === 0 ? 'New' : `${mileage.toLocaleString()} mi`;

  const handlePrevPhoto = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentPhotoIndex(prev => (prev - 1 + photos.length) % photos.length);
  };

  const handleNextPhoto = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentPhotoIndex(prev => (prev + 1) % photos.length);
  };

  const handleSave = (e: React.MouseEvent) => {
    e.stopPropagation();
    const wasSaved = toggleSaveLead(listing, vehicleName);
    setIsSaved(wasSaved);
    onSaveChange?.(wasSaved);
  };

  const handleImageClick = () => {
    if (onImageClick) {
      onImageClick(photos, currentPhotoIndex);
    }
  };

  // Styles
  const cardStyle: React.CSSProperties = {
    background: 'var(--color-neutrals-7, #F4F5F6)',
    borderRadius: 'var(--border-radius-md, 8px)',
    overflow: 'hidden',
    transition: 'transform 0.2s ease, box-shadow 0.2s ease',
    border: '1px solid var(--color-neutrals-6, #E6E8EC)',
    transform: isHovered ? 'translateY(-2px)' : 'none',
    boxShadow: isHovered ? '0 4px 12px rgba(0, 0, 0, 0.1)' : 'none',
    cursor: onClick ? 'pointer' : 'default',
  };

  const imageContainerStyle: React.CSSProperties = {
    position: 'relative',
    width: '100%',
    aspectRatio: '16 / 9',
    overflow: 'hidden',
    background: 'var(--color-neutrals-1, #141416)',
    cursor: onImageClick ? 'pointer' : 'default',
  };

  const imageStyle: React.CSSProperties = {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    transition: 'transform 0.3s ease',
    transform: isHovered ? 'scale(1.05)' : 'scale(1)',
  };

  const saveBtnStyle: React.CSSProperties = {
    position: 'absolute',
    top: '8px',
    left: '8px',
    width: isCompact ? '32px' : '36px',
    height: isCompact ? '32px' : '36px',
    borderRadius: 'var(--border-radius-circle, 50%)',
    backgroundColor: isSaved 
      ? 'var(--color-primary-1, #E90C17)' 
      : isSaveHovered 
        ? 'rgba(0, 0, 0, 0.9)' 
        : 'rgba(0, 0, 0, 0.7)',
    backdropFilter: 'blur(4px)',
    border: 'none',
    color: 'var(--color-white, #FFFFFF)',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.2s ease',
    opacity: isSaved || isHovered ? 1 : 0,
    zIndex: 3,
    transform: isSaveHovered ? 'scale(1.1)' : 'scale(1)',
  };

  const getNavBtnStyle = (direction: 'prev' | 'next'): React.CSSProperties => ({
    position: 'absolute',
    top: '50%',
    transform: isNavHovered === direction ? 'translateY(-50%) scale(1.1)' : 'translateY(-50%)',
    left: direction === 'prev' ? '6px' : 'auto',
    right: direction === 'next' ? '6px' : 'auto',
    width: isCompact ? '28px' : '32px',
    height: isCompact ? '28px' : '32px',
    borderRadius: 'var(--border-radius-circle, 50%)',
    backgroundColor: isNavHovered === direction ? 'rgba(255, 255, 255, 1)' : 'rgba(255, 255, 255, 0.9)',
    border: '1px solid rgba(0, 0, 0, 0.1)',
    color: 'var(--color-neutrals-1, #141416)',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2,
    transition: 'all 0.2s ease',
    opacity: isHovered ? 1 : 0,
  });

  const photoCounterStyle: React.CSSProperties = {
    fontFamily: "'Geist', sans-serif",
    position: 'absolute',
    bottom: '8px',
    right: '8px',
    padding: '4px 8px',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    color: 'var(--color-white, #FFFFFF)',
    fontSize: '12px',
    fontWeight: 500,
    borderRadius: 'var(--border-radius-sm, 4px)',
    zIndex: 2,
  };

  const badgeStyle: React.CSSProperties = {
    fontFamily: "'Geist', sans-serif",
    position: 'absolute',
    top: '8px',
    right: '8px',
    background: 'var(--color-primary-1, #E90C17)',
    color: 'var(--color-white, #FFFFFF)',
    padding: '4px 8px',
    borderRadius: 'var(--border-radius-sm, 4px)',
    fontSize: '11px',
    fontWeight: 600,
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    zIndex: 3,
  };

  const contentStyle: React.CSSProperties = {
    padding: isCompact ? 'var(--spacing-component-sm, 8px) var(--spacing-component-md, 12px)' : 'var(--spacing-component-md, 12px) var(--spacing-2, 16px)',
    color: 'var(--color-black, #000000)',
  };

  const headerStyle: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 'var(--spacing-1, 8px)',
    marginBottom: isCompact ? 'var(--spacing-1, 8px)' : 'var(--spacing-component-md, 12px)',
  };

  const titleStyle: React.CSSProperties = {
    fontFamily: "'Poppins', sans-serif",
    fontSize: isCompact ? '13px' : '14px',
    fontWeight: 600,
    color: 'var(--color-neutrals-1, #141416)',
    margin: 0,
    lineHeight: 1.3,
    flex: 1,
  };

  const trimStyle: React.CSSProperties = {
    fontFamily: "'Geist', sans-serif",
    color: 'var(--color-neutrals-4, #6E7481)',
    fontWeight: 400,
  };

  const conditionStyle: React.CSSProperties = {
    fontFamily: "'Geist', sans-serif",
    fontSize: '11px',
    color: 'var(--color-neutrals-4, #6E7481)',
    background: 'var(--color-neutrals-6, #E6E8EC)',
    padding: '4px 8px',
    borderRadius: 'var(--border-radius-sm, 4px)',
    whiteSpace: 'nowrap',
  };

  const detailsStyle: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: isCompact ? 'var(--spacing-1, 8px)' : 'var(--spacing-component-md, 12px)',
    paddingBottom: isCompact ? 'var(--spacing-1, 8px)' : 'var(--spacing-component-md, 12px)',
    borderBottom: '1px solid var(--color-neutrals-6, #E6E8EC)',
  };

  const priceStyle: React.CSSProperties = {
    fontFamily: "'Geist', sans-serif",
    fontSize: isCompact ? '16px' : '18px',
    fontWeight: 600,
    color: 'var(--color-black, #000000)',
  };

  const mileageStyle: React.CSSProperties = {
    fontFamily: 'var(--font-body, Geist, sans-serif)',
    display: 'flex',
    alignItems: 'center',
    gap: 'var(--spacing-gap-xs, 4px)',
    fontSize: isCompact ? '12px' : '13px',
    color: 'var(--color-neutrals-4, #6E7481)',
  };

  const infoRowStyle: React.CSSProperties = {
    fontFamily: 'var(--font-body, Geist, sans-serif)',
    display: 'flex',
    alignItems: 'center',
    gap: 'var(--spacing-gap-sm, 4px)',
    fontSize: isCompact ? '11px' : '12px',
    color: 'var(--color-neutrals-4, #6E7481)',
    marginBottom: 'var(--spacing-gap-sm, 4px)',
  };

  const dealerNameStyle: React.CSSProperties = {
    fontFamily: 'var(--font-body, Geist, sans-serif)',
    fontWeight: 'var(--font-weight-medium, 500)',
    color: 'var(--color-neutrals-1, #141416)',
  };

  const ctaStyle: React.CSSProperties = {
    fontFamily: 'var(--font-body, Geist, sans-serif)',
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 'var(--spacing-gap-sm, 4px)',
    background: isCtaHovered ? 'var(--color-neutrals-1, #141416)' : 'var(--color-white, #FFFFFF)',
    color: isCtaHovered ? 'var(--color-white, #FFFFFF)' : 'var(--color-neutrals-1, #141416)',
    border: '1px solid var(--color-neutrals-6, #E6E8EC)',
    borderRadius: 'var(--border-radius-sm, 4px)',
    padding: isCompact ? 'var(--spacing-1, 8px) var(--spacing-component-md, 12px)' : 'var(--spacing-component-md, 12px) var(--spacing-2, 16px)',
    fontSize: isCompact ? '12px' : '13px',
    fontWeight: 'var(--font-weight-bold, 600)',
    cursor: 'pointer',
    transition: 'all var(--transition-fast, 0.2s ease)',
    marginTop: isCompact ? 'var(--spacing-1, 8px)' : 'var(--spacing-component-md, 12px)',
  };

  return (
    <div
      className={className}
      style={cardStyle}
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image Section */}
      <div style={imageContainerStyle} onClick={handleImageClick}>
        <img
          src={photos[currentPhotoIndex]}
          alt={`${year} ${vehicleName}`}
          style={imageStyle}
          loading="lazy"
          onError={(e) => {
            (e.target as HTMLImageElement).src = 'https://d2kde5ohu8qb21.cloudfront.net/files/placeholder-vehicle.jpg';
          }}
        />

        {/* Save Button */}
        <button
          style={saveBtnStyle}
          onClick={handleSave}
          onMouseEnter={() => setIsSaveHovered(true)}
          onMouseLeave={() => setIsSaveHovered(false)}
          aria-label={isSaved ? 'Unsave lead' : 'Save lead'}
        >
          <Icon
            name={isSaved ? 'bookmark' : 'bookmark_border'}
            variant={isSaved ? 'filled' : 'outlined'}
            size={isCompact ? 18 : 20}
          />
        </button>

        {/* CPO Badge */}
        {listing.condition === 'Certified Pre-Owned' && (
          <span style={badgeStyle}>CPO</span>
        )}

        {/* Photo Navigation */}
        {hasMultiplePhotos && (
          <>
            <button
              style={getNavBtnStyle('prev')}
              onClick={handlePrevPhoto}
              onMouseEnter={() => setIsNavHovered('prev')}
              onMouseLeave={() => setIsNavHovered(null)}
              aria-label="Previous photo"
            >
              <Icon name="chevron_left" size={isCompact ? 18 : 20} />
            </button>
            <button
              style={getNavBtnStyle('next')}
              onClick={handleNextPhoto}
              onMouseEnter={() => setIsNavHovered('next')}
              onMouseLeave={() => setIsNavHovered(null)}
              aria-label="Next photo"
            >
              <Icon name="chevron_right" size={isCompact ? 18 : 20} />
            </button>
            <div style={photoCounterStyle}>
              {currentPhotoIndex + 1} / {photos.length}
            </div>
          </>
        )}
      </div>

      {/* Content Section */}
      <div style={contentStyle}>
        <div style={headerStyle}>
          <h4 style={titleStyle}>
            {year} {vehicleName}
            {listing.trim && <span style={trimStyle}> {listing.trim}</span>}
          </h4>
          <span style={conditionStyle}>{listing.condition}</span>
        </div>

        <div style={detailsStyle}>
          <div style={priceStyle}>{formatPrice(listing.price)}</div>
          <div style={mileageStyle}>
            <Icon name="speed" size={isCompact ? 14 : 16} />
            {formatMileage(listing.mileage)}
          </div>
        </div>

        <div style={infoRowStyle}>
          <Icon name="store" size={isCompact ? 14 : 16} />
          <span style={dealerNameStyle}>{listing.dealerName}</span>
        </div>

        <div style={infoRowStyle}>
          <Icon name="location_on" size={isCompact ? 14 : 16} />
          <span>{listing.location} • {listing.distance} mi away</span>
        </div>

        {/* CTA Button */}
        {!hideCta && onViewDetails && (
          <button
            style={ctaStyle}
            onClick={(e) => {
              e.stopPropagation();
              onViewDetails();
            }}
            onMouseEnter={() => setIsCtaHovered(true)}
            onMouseLeave={() => setIsCtaHovered(false)}
          >
            View Details
            <Icon name="arrow_forward" size={isCompact ? 14 : 16} />
          </button>
        )}
      </div>
    </div>
  );
};

export default ListingCard;

