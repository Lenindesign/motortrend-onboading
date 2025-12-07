/**
 * Local Listings Sidebar Component
 * Migrated to inline styles for Tailwind compatibility
 */

import React, { useState, useEffect } from 'react';
import { Icon } from '../Icon/Icon';
import { PhotoGallery } from '../PhotoGallery';
import { SavedModal } from '../SavedModal';
import { isLeadSaved, toggleSaveLead } from '../../utils/savedLeads';

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
  photoUrls?: string[];
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
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState<Record<string, number>>({});
  const [focusedListingId, setFocusedListingId] = useState<string | null>(null);
  const [hoveredListingId, setHoveredListingId] = useState<string | null>(null);
  const [hoveredNavBtn, setHoveredNavBtn] = useState<string | null>(null);
  const [hoveredSaveBtn, setHoveredSaveBtn] = useState<string | null>(null);
  const [hoveredCta, setHoveredCta] = useState<string | null>(null);
  const [isViewAllHovered, setIsViewAllHovered] = useState(false);
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [galleryImages, setGalleryImages] = useState<string[]>([]);
  const [galleryStartIndex, setGalleryStartIndex] = useState(0);
  const [galleryVehicleName, setGalleryVehicleName] = useState('');
  const [currentGalleryListingId, setCurrentGalleryListingId] = useState<string | null>(null);
  const [savedLeads, setSavedLeads] = useState<Set<string>>(new Set());
  const [isSavedModalOpen, setIsSavedModalOpen] = useState(false);
  const [savedLeadTitle, setSavedLeadTitle] = useState('');
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    const saved = new Set<string>();
    listings.forEach(listing => {
      if (isLeadSaved(listing.id)) {
        saved.add(listing.id);
      }
    });
    setSavedLeads(saved);
  }, [listings]);
  
  const formatPrice = (price: number): string => `$${price.toLocaleString()}`;
  const formatMileage = (mileage: number): string => mileage === 0 ? 'New' : `${mileage.toLocaleString()} mi`;

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

  // Styles
  const sidebarStyle: React.CSSProperties = {
    background: 'var(--color-white, #FFFFFF)',
    borderRadius: '8px',
    padding: isMobile ? '16px' : '20px',
    position: 'relative',
    width: '100%',
    marginBottom: '20px',
    border: '1px solid #E5E5E5'
  };

  const headerStyle: React.CSSProperties = {
    marginBottom: '20px',
    paddingBottom: '16px',
    borderBottom: '1px solid #E5E5E5'
  };

  const titleStyle: React.CSSProperties = {
    fontFamily: "'Poppins', sans-serif",
    fontSize: isMobile ? '18px' : '20px',
    fontWeight: 700,
    color: 'var(--color-neutrals-1, #141416)',
    margin: '0 0 8px 0',
    lineHeight: 1.2
  };

  const subtitleStyle: React.CSSProperties = {
    fontFamily: "'Geist', sans-serif",
    fontSize: '12px',
    color: 'var(--color-neutrals-4, #6E7481)',
    margin: 0
  };

  const listStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
    marginBottom: '20px'
  };

  const getItemStyle = (listingId: string): React.CSSProperties => ({
    background: 'var(--color-neutrals-7, #F4F5F6)',
    borderRadius: '8px',
    overflow: 'hidden',
    transition: 'transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease',
    border: '1px solid #E5E5E5',
    outline: 'none',
    transform: hoveredListingId === listingId ? 'translateY(-2px)' : 'none',
    boxShadow: hoveredListingId === listingId ? '0 4px 12px rgba(0, 0, 0, 0.1)' : 'none'
  });

  const getImageContainerStyle = (listingId: string): React.CSSProperties => ({
    position: 'relative',
    width: '100%',
    aspectRatio: '16 / 9',
    overflow: 'hidden',
    background: 'var(--color-neutrals-1, #141416)',
    cursor: 'pointer'
  });

  const getImageStyle = (listingId: string): React.CSSProperties => ({
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    transition: 'transform 0.3s ease',
    transform: hoveredListingId === listingId ? 'scale(1.05)' : 'scale(1)'
  });

  const getSaveBtnStyle = (listingId: string): React.CSSProperties => {
    const isSaved = savedLeads.has(listingId);
    const isHovered = hoveredSaveBtn === listingId;
    return {
      position: 'absolute',
      top: '8px',
      left: '8px',
      width: '36px',
      height: '36px',
      borderRadius: '50%',
      backgroundColor: isSaved ? 'var(--color-primary-1, #E90C17)' : isHovered ? 'rgba(0, 0, 0, 0.8)' : 'rgba(0, 0, 0, 0.6)',
      backdropFilter: 'blur(4px)',
      border: 'none',
      color: 'var(--color-white, #FFFFFF)',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      transition: 'all 0.2s ease',
      opacity: isSaved || hoveredListingId === listingId ? 1 : 0,
      zIndex: 3,
      transform: isHovered ? 'scale(1.1)' : 'scale(1)'
    };
  };

  const getPhotoNavStyle = (listingId: string, direction: 'prev' | 'next'): React.CSSProperties => {
    const isHovered = hoveredNavBtn === `${listingId}-${direction}`;
    return {
      position: 'absolute',
      top: '50%',
      transform: isHovered ? 'translateY(-50%) scale(1.1)' : 'translateY(-50%)',
      left: direction === 'prev' ? '8px' : 'auto',
      right: direction === 'next' ? '8px' : 'auto',
      width: '32px',
      height: '32px',
      borderRadius: '50%',
      backgroundColor: isHovered ? 'rgba(255, 255, 255, 1)' : 'rgba(255, 255, 255, 0.9)',
      border: '1px solid rgba(0, 0, 0, 0.1)',
      color: 'var(--color-neutrals-1, #141416)',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 2,
      transition: 'all 0.2s ease',
      opacity: hoveredListingId === listingId ? 1 : 0
    };
  };

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
    borderRadius: '4px',
    zIndex: 2
  };

  const badgeStyle: React.CSSProperties = {
    fontFamily: "'Geist', sans-serif",
    position: 'absolute',
    top: '8px',
    right: '8px',
    background: 'var(--color-primary-1, #E90C17)',
    color: 'var(--color-white, #FFFFFF)',
    padding: '4px 8px',
    borderRadius: '4px',
    fontSize: '11px',
    fontWeight: 700,
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    zIndex: 3
  };

  const contentStyle: React.CSSProperties = {
    padding: isMobile ? '10px' : '12px',
    color: 'var(--color-black, #000000)'
  };

  const itemHeaderStyle: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: '8px',
    marginBottom: '10px'
  };

  const itemTitleStyle: React.CSSProperties = {
    fontFamily: "'Poppins', sans-serif",
    fontSize: '14px',
    fontWeight: 600,
    color: 'var(--color-neutrals-1, #141416)',
    margin: 0,
    lineHeight: 1.3,
    flex: 1
  };

  const trimStyle: React.CSSProperties = {
    fontFamily: "'Geist', sans-serif",
    color: 'var(--color-neutrals-4, #6E7481)',
    fontWeight: 400
  };

  const conditionStyle: React.CSSProperties = {
    fontFamily: "'Geist', sans-serif",
    fontSize: '11px',
    color: 'var(--color-neutrals-4, #6E7481)',
    background: 'var(--color-neutrals-6, #E6E8EC)',
    padding: '4px 8px',
    borderRadius: '4px',
    whiteSpace: 'nowrap'
  };

  const detailsStyle: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '10px',
    paddingBottom: '10px',
    borderBottom: '1px solid #E5E5E5'
  };

  const priceStyle: React.CSSProperties = {
    fontFamily: "'Geist', sans-serif",
    fontSize: isMobile ? '16px' : '18px',
    fontWeight: 700,
    color: 'var(--color-black, #000000)'
  };

  const mileageStyle: React.CSSProperties = {
    fontFamily: "'Geist', sans-serif",
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    fontSize: '13px',
    color: '#666666'
  };

  const infoRowStyle: React.CSSProperties = {
    fontFamily: "'Geist', sans-serif",
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    fontSize: '12px',
    color: 'var(--color-neutrals-4, #6E7481)',
    marginBottom: '6px'
  };

  const dealerNameStyle: React.CSSProperties = {
    fontFamily: "'Geist', sans-serif",
    fontWeight: 500,
    color: '#1A1B21'
  };

  const colorsStyle: React.CSSProperties = {
    fontFamily: "'Geist', sans-serif",
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    fontSize: '11px',
    color: 'var(--color-neutrals-4, #6E7481)',
    marginBottom: '10px',
    flexWrap: 'wrap'
  };

  const getCtaStyle = (listingId: string): React.CSSProperties => ({
    fontFamily: "'Geist', sans-serif",
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '6px',
    background: hoveredCta === listingId ? '#1A1B21' : '#FFFFFF',
    color: hoveredCta === listingId ? '#FFFFFF' : '#1A1B21',
    border: '1px solid #E5E5E5',
    borderRadius: '4px',
    padding: '10px 16px',
    fontSize: '13px',
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
  });

  const viewAllStyle: React.CSSProperties = {
    fontFamily: "'Geist', sans-serif",
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    background: isViewAllHovered ? '#F8F8F8' : 'transparent',
    color: 'var(--color-neutrals-1, #141416)',
    border: `1px solid ${isViewAllHovered ? '#CCCCCC' : '#E5E5E5'}`,
    borderRadius: '4px',
    padding: '12px 16px',
    fontSize: '14px',
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'all 0.2s ease'
  };

  const emptyStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '40px 16px',
    textAlign: 'center',
    color: '#A0A1A7'
  };

  return (
    <div style={sidebarStyle}>
      <div style={headerStyle}>
        <h3 style={titleStyle}>Local Listings</h3>
        <p style={subtitleStyle}>
          {listings.length} {vehicleName} {listings.length === 1 ? 'listing' : 'listings'} near you
        </p>
      </div>

      <div style={listStyle}>
        {listings.map((listing) => {
          const photos = listing.photoUrls || [listing.imageUrl];
          const currentIndex = currentPhotoIndex[listing.id] || 0;
          const hasMultiplePhotos = photos.length > 1;

          return (
            <div 
              key={listing.id} 
              style={getItemStyle(listing.id)}
              onMouseEnter={() => setHoveredListingId(listing.id)}
              onMouseLeave={() => setHoveredListingId(null)}
              tabIndex={0}
              onFocus={() => setFocusedListingId(listing.id)}
              onBlur={() => setFocusedListingId(null)}
            >
              <div 
                style={getImageContainerStyle(listing.id)}
                onClick={() => handleImageClick(photos, currentIndex, listing)}
              >
                <img 
                  src={photos[currentIndex]} 
                  alt={`${listing.year} ${vehicleName}`}
                  style={getImageStyle(listing.id)}
                  loading="lazy"
                />
                
                <button
                  style={getSaveBtnStyle(listing.id)}
                  onClick={(e) => handleSaveLead(listing, e)}
                  onMouseEnter={() => setHoveredSaveBtn(listing.id)}
                  onMouseLeave={() => setHoveredSaveBtn(null)}
                  aria-label={savedLeads.has(listing.id) ? 'Unsave lead' : 'Save lead'}
                >
                  <Icon 
                    name={savedLeads.has(listing.id) ? 'bookmark' : 'bookmark_border'} 
                    variant={savedLeads.has(listing.id) ? 'filled' : 'outlined'}
                    size={20} 
                  />
                </button>
                
                {listing.condition === 'Certified Pre-Owned' && (
                  <span style={badgeStyle}>CPO</span>
                )}
                
                {hasMultiplePhotos && (
                  <>
                    <button
                      style={getPhotoNavStyle(listing.id, 'prev')}
                      onClick={(e) => { e.stopPropagation(); handlePrevPhoto(listing.id, photos.length); }}
                      onMouseEnter={() => setHoveredNavBtn(`${listing.id}-prev`)}
                      onMouseLeave={() => setHoveredNavBtn(null)}
                      aria-label="Previous photo"
                    >
                      <Icon name="chevron_left" size={20} />
                    </button>
                    <button
                      style={getPhotoNavStyle(listing.id, 'next')}
                      onClick={(e) => { e.stopPropagation(); handleNextPhoto(listing.id, photos.length); }}
                      onMouseEnter={() => setHoveredNavBtn(`${listing.id}-next`)}
                      onMouseLeave={() => setHoveredNavBtn(null)}
                      aria-label="Next photo"
                    >
                      <Icon name="chevron_right" size={20} />
                    </button>
                    <div style={photoCounterStyle}>{currentIndex + 1} / {photos.length}</div>
                  </>
                )}
              </div>

              <div style={contentStyle}>
                <div style={itemHeaderStyle}>
                  <h4 style={itemTitleStyle}>
                    {listing.year} {vehicleName}
                    {listing.trim && <span style={trimStyle}> {listing.trim}</span>}
                  </h4>
                  <span style={conditionStyle}>{listing.condition}</span>
                </div>

                <div style={detailsStyle}>
                  <div style={priceStyle}>{formatPrice(listing.price)}</div>
                  <div style={mileageStyle}>
                    <Icon name="speed" size={16} />
                    {formatMileage(listing.mileage)}
                  </div>
                </div>

                <div style={infoRowStyle}>
                  <Icon name="store" size={16} />
                  <span style={dealerNameStyle}>{listing.dealerName}</span>
                </div>

                <div style={infoRowStyle}>
                  <Icon name="location_on" size={16} />
                  <span>{listing.location} • {listing.distance} mi away</span>
                </div>

                {listing.exteriorColor && (
                  <div style={colorsStyle}>
                    <span style={{ fontWeight: 500 }}>Exterior:</span>
                    <span style={{ color: 'var(--color-black, #000000)' }}>{listing.exteriorColor}</span>
                    {listing.interiorColor && (
                      <>
                        <span style={{ margin: '0 4px' }}>•</span>
                        <span style={{ fontWeight: 500 }}>Interior:</span>
                        <span style={{ color: 'var(--color-black, #000000)' }}>{listing.interiorColor}</span>
                      </>
                    )}
                  </div>
                )}

                <button 
                  style={getCtaStyle(listing.id)}
                  onMouseEnter={() => setHoveredCta(listing.id)}
                  onMouseLeave={() => setHoveredCta(null)}
                >
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
          style={viewAllStyle}
          onClick={onViewAllListings}
          onMouseEnter={() => setIsViewAllHovered(true)}
          onMouseLeave={() => setIsViewAllHovered(false)}
        >
          View All {listings.length} Listings
          <Icon name="arrow_forward" size={20} />
        </button>
      )}

      {listings.length === 0 && (
        <div style={emptyStyle}>
          <Icon name="search_off" size={48} style={{ color: '#6A6B71', marginBottom: '16px' }} />
          <p style={{ margin: '0 0 8px 0', fontSize: '14px', fontWeight: 500, color: '#1A1B21' }}>No local listings found</p>
          <p style={{ fontSize: '12px', color: '#6A6B71' }}>Try expanding your search radius or check back later</p>
        </div>
      )}

      <PhotoGallery
        key={currentGalleryListingId || 'gallery'}
        images={galleryImages}
        isOpen={isGalleryOpen}
        initialIndex={galleryStartIndex}
        onClose={() => { setIsGalleryOpen(false); setCurrentGalleryListingId(null); }}
        vehicleName={galleryVehicleName}
        localListings={listings}
        onViewAllListings={onViewAllListings}
        onListingClick={handleListingClickInGallery}
      />

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
