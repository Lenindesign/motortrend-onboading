/**
 * Photo Gallery Component - Lead Generation Focused
 * Migrated to inline React styles - no external CSS dependency
 */

import React, { useState, useEffect, useRef } from 'react';
import { ModalShell } from '../atoms/ModalShell';
import Icon from '../Icon';
import { Badge } from '../atoms/Badge/Badge';
import { SavedModal } from '../SavedModal';
import { ListingCard } from '../ListingCard';
import type { LocalListing } from '../LocalListingsSidebar/LocalListingsSidebar';

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
  const [isSavedModalOpen, setIsSavedModalOpen] = useState(false);
  const [savedLeadTitle, setSavedLeadTitle] = useState('');
  const [localImages, setLocalImages] = useState<string[]>(images);
  const thumbnailsRef = useRef<HTMLDivElement>(null);
  const thumbnailRefs = useRef<(HTMLButtonElement | null)[]>([]);
  
  // Responsive state
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [isTablet, setIsTablet] = useState(window.innerWidth <= 1024);
  
  // Hover states
  const [isCloseHovered, setIsCloseHovered] = useState(false);
  const [isClosePressed, setIsClosePressed] = useState(false);
  const [hoveredNav, setHoveredNav] = useState<string | null>(null);
  const [hoveredThumbnail, setHoveredThumbnail] = useState<number | null>(null);
  const [hoveredFilter, setHoveredFilter] = useState<string | null>(null);
  const [isViewAllHovered, setIsViewAllHovered] = useState(false);
  const [isResetHovered, setIsResetHovered] = useState(false);
  const [isMainImageHovered, setIsMainImageHovered] = useState(false);
  
  const hasListings = localListings && localListings.length > 0;

  // Inject keyframes and scrollbar styles
  useEffect(() => {
    const styleId = 'photo-gallery-styles';
    if (!document.getElementById(styleId)) {
      const style = document.createElement('style');
      style.id = styleId;
      style.textContent = `
        @keyframes kenBurnsZoom {
          0% { transform: scale(1); }
          100% { transform: scale(1.05); }
        }
        .photo-gallery-thumbnails::-webkit-scrollbar { height: 6px; }
        .photo-gallery-thumbnails::-webkit-scrollbar-track { background: transparent; }
        .photo-gallery-thumbnails::-webkit-scrollbar-thumb { background-color: rgba(255, 255, 255, 0.3); border-radius: 3px; }
        .photo-gallery-thumbnails::-webkit-scrollbar-thumb:hover { background-color: rgba(255, 255, 255, 0.5); }
        .photo-gallery-listings-grid::-webkit-scrollbar { width: 8px; }
        .photo-gallery-listings-grid::-webkit-scrollbar-track { background: transparent; }
        .photo-gallery-listings-grid::-webkit-scrollbar-thumb { background-color: var(--color-neutrals-5, #B1B5C3); border-radius: 4px; }
      `;
      document.head.appendChild(style);
    }
    return () => {
      const existing = document.getElementById(styleId);
      if (existing) existing.remove();
    };
  }, []);

  // Responsive handler
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
      setIsTablet(window.innerWidth <= 1024);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    setLocalImages(images);
    setCurrentIndex(0);
  }, [images]);


  useEffect(() => {
    setCurrentIndex(initialIndex);
  }, [initialIndex]);

  useEffect(() => {
    if (localImages.length > 0) {
      const validIndex = initialIndex >= 0 && initialIndex < localImages.length ? initialIndex : 0;
      setCurrentIndex(validIndex);
    } else {
      setCurrentIndex(0);
    }
  }, [localImages, initialIndex]);

  useEffect(() => {
    if (localImages.length > 0 && currentIndex >= localImages.length) {
      setCurrentIndex(0);
    }
  }, [localImages.length, currentIndex]);

  useEffect(() => {
    if (thumbnailRefs.current[currentIndex] && thumbnailsRef.current) {
      const thumbnail = thumbnailRefs.current[currentIndex];
      const container = thumbnailsRef.current;
      
      if (thumbnail) {
        const containerRect = container.getBoundingClientRect();
        const thumbnailRect = thumbnail.getBoundingClientRect();
        
        if (thumbnailRect.left < containerRect.left) {
          thumbnail.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'start' });
        } else if (thumbnailRect.right > containerRect.right) {
          thumbnail.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'end' });
        }
      }
    }
  }, [currentIndex]);

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

  const filteredAndSortedListings = React.useMemo(() => {
    let filtered = [...localListings];

    if (filterCondition !== 'all') {
      filtered = filtered.filter(listing => {
        if (filterCondition === 'new') return listing.condition === 'New';
        if (filterCondition === 'used') return listing.condition === 'Used';
        if (filterCondition === 'cpo') return listing.condition === 'Certified Pre-Owned';
        return true;
      });
    }

    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'price-low': return a.price - b.price;
        case 'price-high': return b.price - a.price;
        case 'mileage-low': return a.mileage - b.mileage;
        case 'distance': return a.distance - b.distance;
        default: return 0;
      }
    });

    return filtered;
  }, [localListings, sortBy, filterCondition]);

  // ==================== INLINE STYLES ====================

  const containerStyle: React.CSSProperties = {
    width: '100%',
    height: '100%',
    maxHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: 'var(--color-neutrals-8, #FCFCFD)',
    overflow: 'hidden',
  };

  const headerStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: isMobile ? '16px 20px' : '20px 32px',
    backgroundColor: 'var(--color-neutrals-9, #FFFFFF)',
    borderBottom: '1px solid var(--color-neutrals-6, #E6E8EC)',
    flexShrink: 0,
    zIndex: 100,
    position: 'relative',
  };

  const headerLeftStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
  };

  const titleStyle: React.CSSProperties = {
    fontFamily: 'var(--font-heading, Poppins, sans-serif)',
    fontSize: isMobile ? '20px' : '24px',
    fontWeight: 'var(--font-weight-bold, 600)',
    color: 'var(--color-neutrals-1, #141416)',
    margin: 0,
  };

  const closeStyle: React.CSSProperties = {
    width: isMobile ? '40px' : '48px',
    height: isMobile ? '40px' : '48px',
    borderRadius: 'var(--border-radius-circle, 50%)',
    backgroundColor: isCloseHovered ? 'rgba(0, 0, 0, 0.8)' : 'rgba(0, 0, 0, 0.6)',
    backdropFilter: 'blur(10px)',
    WebkitBackdropFilter: 'blur(10px)',
    border: `1px solid ${isCloseHovered ? 'rgba(255, 255, 255, 0.5)' : 'rgba(255, 255, 255, 0.3)'}`,
    color: 'var(--color-white, #FFFFFF)',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.2s ease',
    flexShrink: 0,
    zIndex: 100,
    position: 'relative',
    transform: isClosePressed ? 'scale(0.95)' : (isCloseHovered ? 'scale(1.1)' : 'scale(1)'),
  };

  const mobileTabsStyle: React.CSSProperties = {
    display: isMobile ? 'flex' : 'none',
    backgroundColor: 'var(--color-neutrals-9, #FFFFFF)',
    borderBottom: '1px solid var(--color-neutrals-6, #E6E8EC)',
    padding: '0 16px',
  };

  const getMobileTabStyle = (isActive: boolean): React.CSSProperties => ({
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    padding: '16px',
    background: 'none',
    border: 'none',
    borderBottom: `3px solid ${isActive ? 'var(--color-primary, #E90C17)' : 'transparent'}`,
    color: isActive ? 'var(--color-primary, #E90C17)' : 'var(--color-neutrals-3, #353945)',
    fontFamily: 'var(--font-body, Geist, sans-serif)',
    fontSize: '14px',
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  });

  const contentStyle: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: isMobile ? '1fr' : (isTablet ? '1fr 280px' : '1fr 320px'),
    flex: 1,
    overflow: 'hidden',
    minHeight: 0,
    maxHeight: '100%',
    position: isMobile ? 'relative' : undefined,
  };

  const photosSectionStyle: React.CSSProperties = {
    display: isMobile ? (activeTab === 'photos' ? 'flex' : 'none') : 'flex',
    flexDirection: 'column',
    backgroundColor: '#000',
    position: 'relative',
    minHeight: 0,
    overflow: 'hidden',
  };

  const mainImageStyle: React.CSSProperties = {
    flex: 1,
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    minHeight: 0,
    maxHeight: '100%',
  };

  const imageStyle: React.CSSProperties = {
    width: '100%',
    height: '100%',
    objectFit: 'contain',
    userSelect: 'none',
    animation: isMainImageHovered ? 'none' : 'kenBurnsZoom 15s ease-in-out infinite',
    animationPlayState: isMainImageHovered ? 'paused' : 'running',
  };

  const getNavStyle = (direction: 'prev' | 'next', disabled: boolean = false): React.CSSProperties => ({
    position: 'absolute',
    top: '50%',
    transform: hoveredNav === direction && !disabled ? 'translateY(-50%) scale(1.1)' : 'translateY(-50%)',
    left: direction === 'prev' ? (isMobile ? '12px' : '24px') : undefined,
    right: direction === 'next' ? (isMobile ? '12px' : '24px') : undefined,
    width: isMobile ? '44px' : '56px',
    height: isMobile ? '44px' : '56px',
    borderRadius: 'var(--border-radius-circle, 50%)',
    backgroundColor: hoveredNav === direction && !disabled ? 'rgba(30, 30, 32, 0.8)' : 'rgba(20, 20, 22, 0.6)',
    backdropFilter: 'blur(10px)',
    WebkitBackdropFilter: 'blur(10px)',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    color: 'var(--color-white, #FFFFFF)',
    cursor: disabled ? 'not-allowed' : 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.2s ease',
    zIndex: 5,
    opacity: disabled ? 0.3 : 1,
  });

  const photoCounterStyle: React.CSSProperties = {
    position: 'absolute',
    bottom: '24px',
    left: '50%',
    transform: 'translateX(-50%)',
    backgroundColor: 'rgba(20, 20, 22, 0.8)',
    backdropFilter: 'blur(10px)',
    WebkitBackdropFilter: 'blur(10px)',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    borderRadius: 'var(--border-radius-xl, 20px)',
    padding: '8px 16px',
    color: 'var(--color-white, #FFFFFF)',
    fontFamily: 'var(--font-body, Geist, sans-serif)',
    fontSize: '14px',
    fontWeight: 600,
    zIndex: 5,
  };

  const thumbnailsStyle: React.CSSProperties = {
    display: 'flex',
    flexWrap: 'nowrap',
    gap: isMobile ? '10px' : '12px',
    padding: isMobile ? '12px 16px' : '16px 24px',
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    overflowX: 'auto',
    overflowY: 'hidden',
    flexShrink: 0,
    flexGrow: 0,
    maxHeight: isMobile ? '88px' : '102px',
    height: isMobile ? '88px' : '102px',
    scrollbarWidth: 'thin',
    scrollbarColor: 'rgba(255, 255, 255, 0.3) transparent',
    scrollBehavior: 'smooth',
    WebkitOverflowScrolling: 'touch',
    width: '100%',
    minWidth: 0,
    boxSizing: 'border-box',
  };

  const getThumbnailStyle = (index: number, isActive: boolean): React.CSSProperties => ({
    width: isMobile ? '80px' : '100px',
    minWidth: isMobile ? '80px' : '100px',
    height: isMobile ? '56px' : '70px',
    borderRadius: 'var(--border-radius-md, 8px)',
    overflow: 'hidden',
    border: `2px solid ${isActive ? 'var(--color-primary, #E90C17)' : (hoveredThumbnail === index ? 'rgba(255, 255, 255, 0.5)' : 'transparent')}`,
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    flexShrink: 0,
    background: 'none',
    padding: 0,
    transform: hoveredThumbnail === index && !isActive ? 'scale(1.05)' : 'scale(1)',
  });

  const listingsSectionStyle: React.CSSProperties = {
    display: isMobile ? (activeTab === 'listings' ? 'flex' : 'none') : (hasListings ? 'flex' : 'none'),
    flexDirection: 'column',
    backgroundColor: 'var(--color-neutrals-8, #FCFCFD)',
    borderLeft: isMobile ? 'none' : '1px solid var(--color-neutrals-6, #E6E8EC)',
    overflow: 'hidden',
    minHeight: 0,
    height: '100%',
    maxHeight: '100%',
  };

  const controlsStyle: React.CSSProperties = {
    padding: isMobile ? '16px' : '20px',
    backgroundColor: 'var(--color-neutrals-9, #FFFFFF)',
    borderBottom: '1px solid var(--color-neutrals-6, #E6E8EC)',
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
    flexShrink: 0,
  };

  const filtersStyle: React.CSSProperties = {
    display: 'flex',
    gap: '8px',
  };

  const getFilterBtnStyle = (filter: string, isActive: boolean): React.CSSProperties => ({
    flex: 1,
    padding: '10px 16px',
    backgroundColor: isActive ? 'var(--color-primary, #E90C17)' : (hoveredFilter === filter ? 'var(--color-neutrals-6, #E6E8EC)' : 'var(--color-neutrals-7, #F4F5F6)'),
    border: `1px solid ${isActive ? 'var(--color-primary, #E90C17)' : (hoveredFilter === filter ? 'var(--color-neutrals-4, #6E7481)' : 'var(--color-neutrals-5, #B1B5C3)')}`,
    borderRadius: 'var(--border-radius-md, 8px)',
    color: isActive ? '#FFFFFF' : 'var(--color-neutrals-2, #23262F)',
    fontFamily: 'var(--font-body, Geist, sans-serif)',
    fontSize: '14px',
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  });

  const sortStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    color: 'var(--color-neutrals-2, #23262F)',
  };

  const sortSelectStyle: React.CSSProperties = {
    flex: 1,
    padding: '10px 36px 10px 16px',
    backgroundColor: 'var(--color-neutrals-7, #F4F5F6)',
    border: '1px solid var(--color-neutrals-5, #B1B5C3)',
    borderRadius: 'var(--border-radius-md, 8px)',
    color: 'var(--color-neutrals-1, #141416)',
    fontFamily: 'var(--font-body, Geist, sans-serif)',
    fontSize: '14px',
    cursor: 'pointer',
    appearance: 'none',
    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23353945' d='M6 9L1 4h10z'/%3E%3C/svg%3E")`,
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'right 12px center',
  };

  const listingsGridStyle: React.CSSProperties = {
    flex: 1,
    overflowY: 'auto',
    overflowX: 'hidden',
    padding: isMobile ? '16px' : '20px',
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
    scrollbarWidth: 'thin',
    scrollbarColor: 'var(--color-neutrals-5, #B1B5C3) transparent',
    minHeight: 0,
  };

  const noResultsStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '60px 20px',
    textAlign: 'center',
    color: 'var(--color-neutrals-3, #353945)',
    gap: '16px',
  };

  const resetFiltersStyle: React.CSSProperties = {
    padding: '12px 24px',
    backgroundColor: isResetHovered ? '#c70a15' : 'var(--color-primary, #E90C17)',
    border: 'none',
    borderRadius: 'var(--border-radius-md, 8px)',
    color: 'var(--color-white, #FFFFFF)',
    fontFamily: 'var(--font-body, Geist, sans-serif)',
    fontSize: '14px',
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    transform: isResetHovered ? 'translateY(-2px)' : 'translateY(0)',
  };

  const viewAllStyle: React.CSSProperties = {
    padding: '16px 20px',
    backgroundColor: 'var(--color-neutrals-9, #FFFFFF)',
    borderTop: '1px solid var(--color-neutrals-6, #E6E8EC)',
    flexShrink: 0,
  };

  const viewAllBtnStyle: React.CSSProperties = {
    width: '100%',
    padding: '14px 20px',
    backgroundColor: isViewAllHovered ? 'var(--color-neutrals-6, #E6E8EC)' : 'var(--color-neutrals-7, #F4F5F6)',
    border: `1px solid ${isViewAllHovered ? 'var(--color-neutrals-4, #6E7481)' : 'var(--color-neutrals-5, #B1B5C3)'}`,
    borderRadius: 'var(--border-radius-md, 8px)',
    color: 'var(--color-neutrals-1, #141416)',
    fontFamily: 'var(--font-body, Geist, sans-serif)',
    fontSize: '15px',
    fontWeight: 600,
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '10px',
    transition: 'all 0.2s ease',
    transform: isViewAllHovered ? 'translateY(-2px)' : 'translateY(0)',
  };

  const renderListingCard = (listing: LocalListing, _isBestDeal: boolean = false) => {
    // Extract make/model from vehicleName (which may include year like "2025 Kia Stinger")
    const nameWithoutYear = vehicleName?.replace(/^\d{4}\s+/, '') || '';
    
    return (
      <ListingCard
        key={listing.id}
        listing={listing}
        vehicleName={nameWithoutYear}
        vehicleYear={listing.year}
        variant="compact"
        onImageClick={(photos) => {
          setLocalImages(photos);
          setCurrentIndex(0);
          setActiveTab('photos');
          if (onListingClick) {
            onListingClick(listing);
          }
        }}
        onSaveChange={(isSaved) => {
          if (isSaved) {
            setSavedLeadTitle(`${listing.year} ${nameWithoutYear}`);
            setIsSavedModalOpen(true);
          }
        }}
        onViewDetails={() => {
          // View details handler
        }}
      />
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
      zIndex={10000}
      style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column' }}
    >
      <div style={containerStyle}>
        <div style={headerStyle}>
          <div style={headerLeftStyle}>
            <h2 style={titleStyle}>{vehicleName}</h2>
            {hasListings && (
              <Badge variant="info" size="md">{filteredAndSortedListings.length} Available</Badge>
            )}
          </div>
          <button 
            style={closeStyle}
            onClick={onClose}
            onMouseEnter={() => setIsCloseHovered(true)}
            onMouseLeave={() => { setIsCloseHovered(false); setIsClosePressed(false); }}
            onMouseDown={() => setIsClosePressed(true)}
            onMouseUp={() => setIsClosePressed(false)}
            aria-label="Close gallery"
          >
            <Icon name="close" size={28} />
          </button>
        </div>

        <div style={mobileTabsStyle}>
          <button style={getMobileTabStyle(activeTab === 'photos')} onClick={() => setActiveTab('photos')}>
            <Icon name="photo_library" size={20} />
            <span>Photos ({localImages.length})</span>
          </button>
          <button style={getMobileTabStyle(activeTab === 'listings')} onClick={() => setActiveTab('listings')}>
            <Icon name="local_offer" size={20} />
            <span>Deals ({filteredAndSortedListings.length})</span>
          </button>
        </div>

        <div style={contentStyle}>
          <div style={photosSectionStyle}>
            <div 
              style={mainImageStyle}
              onMouseEnter={() => setIsMainImageHovered(true)}
              onMouseLeave={() => setIsMainImageHovered(false)}
            >
              {localImages.length > 0 && localImages[currentIndex] ? (
                <img
                  key={`img-${currentIndex}-${localImages[currentIndex]}`}
                  src={localImages[currentIndex]}
                  alt={`${vehicleName || 'Vehicle'} - Photo ${currentIndex + 1}`}
                  style={imageStyle}
                />
              ) : localImages.length === 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px', color: 'var(--color-neutrals-5, #B1B5C3)' }}>
                  <Icon name="image" size={48} />
                  <p style={{ margin: 0 }}>No images available</p>
                </div>
              ) : null}
              
              {localImages.length > 1 && (
                <>
                  <button
                    style={getNavStyle('prev')}
                    onClick={handlePrevious}
                    onMouseEnter={() => setHoveredNav('prev')}
                    onMouseLeave={() => setHoveredNav(null)}
                    aria-label="Previous image"
                  >
                    <Icon name="chevron_left" size={48} />
                  </button>
                  <button
                    style={getNavStyle('next')}
                    onClick={handleNext}
                    onMouseEnter={() => setHoveredNav('next')}
                    onMouseLeave={() => setHoveredNav(null)}
                    aria-label="Next image"
                  >
                    <Icon name="chevron_right" size={48} />
                  </button>
                </>
              )}

              {localImages.length > 0 && (
                <div style={photoCounterStyle}>{currentIndex + 1} / {localImages.length}</div>
              )}
            </div>

            {localImages.length > 1 && (
              <div style={thumbnailsStyle} ref={thumbnailsRef} className="photo-gallery-thumbnails">
                {localImages.map((image, index) => (
                  <button
                    key={index}
                    ref={(el) => { thumbnailRefs.current[index] = el; }}
                    style={getThumbnailStyle(index, index === currentIndex)}
                    onClick={() => setCurrentIndex(index)}
                    onMouseEnter={() => setHoveredThumbnail(index)}
                    onMouseLeave={() => setHoveredThumbnail(null)}
                    aria-label={`View photo ${index + 1}`}
                  >
                    <img src={image} alt={`Thumbnail ${index + 1}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </button>
                ))}
              </div>
            )}
          </div>

          {hasListings && (
            <div style={listingsSectionStyle}>
              <div style={controlsStyle}>
                <div style={filtersStyle}>
                  {(['all', 'new', 'used', 'cpo'] as FilterCondition[]).map(filter => (
                    <button
                      key={filter}
                      style={getFilterBtnStyle(filter, filterCondition === filter)}
                      onClick={() => setFilterCondition(filter)}
                      onMouseEnter={() => setHoveredFilter(filter)}
                      onMouseLeave={() => setHoveredFilter(null)}
                    >
                      {filter === 'all' ? 'All' : filter === 'cpo' ? 'CPO' : filter.charAt(0).toUpperCase() + filter.slice(1)}
                    </button>
                  ))}
                </div>

                <div style={sortStyle}>
                  <Icon name="sort" size={18} />
                  <select value={sortBy} onChange={(e) => setSortBy(e.target.value as SortOption)} style={sortSelectStyle}>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                    <option value="mileage-low">Mileage: Low to High</option>
                    <option value="distance">Distance: Nearest</option>
                  </select>
                </div>
              </div>

              <div style={listingsGridStyle} className="photo-gallery-listings-grid">
                {filteredAndSortedListings.length > 0 ? (
                  filteredAndSortedListings.map((listing, index) => 
                    renderListingCard(listing, index === 0 && sortBy === 'price-low')
                  )
                ) : (
                  <div style={noResultsStyle}>
                    <Icon name="search_off" size={48} />
                    <p style={{ fontSize: '16px', margin: 0 }}>No listings match your filters</p>
                    <button 
                      style={resetFiltersStyle}
                      onClick={() => setFilterCondition('all')}
                      onMouseEnter={() => setIsResetHovered(true)}
                      onMouseLeave={() => setIsResetHovered(false)}
                    >
                      Reset Filters
                    </button>
                  </div>
                )}
              </div>

              {onViewAllListings && filteredAndSortedListings.length > 0 && (
                <div style={viewAllStyle}>
                  <button 
                    style={viewAllBtnStyle}
                    onClick={onViewAllListings}
                    onMouseEnter={() => setIsViewAllHovered(true)}
                    onMouseLeave={() => setIsViewAllHovered(false)}
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
