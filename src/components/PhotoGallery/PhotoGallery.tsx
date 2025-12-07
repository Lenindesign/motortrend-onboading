/**
 * Photo Gallery Component - Lead Generation Focused
 * Migrated to inline React styles - no external CSS dependency
 */

import React, { useState, useEffect, useRef } from 'react';
import { ModalShell } from '../atoms/ModalShell';
import Icon from '../Icon';
import { Badge } from '../atoms/Badge/Badge';
import { SavedModal } from '../SavedModal';
import type { LocalListing } from '../LocalListingsSidebar/LocalListingsSidebar';
import { isLeadSaved, toggleSaveLead } from '../../utils/savedLeads';

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
  
  // Responsive state
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [isTablet, setIsTablet] = useState(window.innerWidth <= 1024);
  
  // Hover states
  const [isCloseHovered, setIsCloseHovered] = useState(false);
  const [isClosePressed, setIsClosePressed] = useState(false);
  const [hoveredNav, setHoveredNav] = useState<string | null>(null);
  const [hoveredThumbnail, setHoveredThumbnail] = useState<number | null>(null);
  const [hoveredFilter, setHoveredFilter] = useState<string | null>(null);
  const [hoveredListingCard, setHoveredListingCard] = useState<string | null>(null);
  const [hoveredListingNav, setHoveredListingNav] = useState<string | null>(null);
  const [hoveredListingSave, setHoveredListingSave] = useState<string | null>(null);
  const [hoveredListingCta, setHoveredListingCta] = useState<string | null>(null);
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

  const formatPrice = (price: number): string => `$${price.toLocaleString()}`;
  const formatMileage = (mileage: number): string => mileage === 0 ? 'New' : `${mileage.toLocaleString()} mi`;

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
      setLocalImages(listingPhotos);
      setCurrentIndex(0);
      setActiveTab('photos');
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
    borderRadius: '50%',
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
    gridTemplateColumns: isMobile ? '1fr' : (isTablet ? '1fr 280px' : '1fr 300px'),
    flex: 1,
    overflow: 'hidden',
    minHeight: 0,
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
    borderRadius: '50%',
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
    borderRadius: '20px',
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
    borderRadius: '8px',
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
    borderRadius: '8px',
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
    borderRadius: '8px',
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

  const getListingCardStyle = (listingId: string, isBest: boolean): React.CSSProperties => ({
    display: 'flex',
    flexDirection: 'column',
    gap: 'var(--spacing-1, 8px)',
    flexShrink: 0,
    position: 'relative',
    cursor: 'pointer',
    transition: 'transform 0.2s ease, box-shadow 0.2s ease',
    borderRadius: '8px',
    overflow: 'hidden',
    transform: hoveredListingCard === listingId ? 'translateY(-2px)' : 'translateY(0)',
    boxShadow: hoveredListingCard === listingId ? '0 4px 12px rgba(0, 0, 0, 0.15)' : 'none',
  });

  const listingImageContainerStyle: React.CSSProperties = {
    position: 'relative',
    width: '100%',
    aspectRatio: '16 / 9',
    backgroundColor: 'var(--color-neutrals-7, #F4F5F6)',
    borderRadius: '8px',
    overflow: 'hidden',
    display: 'flex',
    alignItems: 'flex-end',
    justifyContent: 'center',
  };

  const listingImageStyle: React.CSSProperties = {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    objectPosition: 'center bottom',
  };

  const getListingNavStyle = (listingId: string, direction: 'prev' | 'next'): React.CSSProperties => ({
    position: 'absolute',
    top: '50%',
    transform: hoveredListingNav === `${listingId}-${direction}` ? 'translateY(-50%) scale(1.1)' : 'translateY(-50%)',
    left: direction === 'prev' ? '8px' : undefined,
    right: direction === 'next' ? '8px' : undefined,
    width: '28px',
    height: '28px',
    borderRadius: '50%',
    backgroundColor: hoveredListingNav === `${listingId}-${direction}` ? 'rgba(0, 0, 0, 0.8)' : 'rgba(0, 0, 0, 0.6)',
    backdropFilter: 'blur(4px)',
    border: 'none',
    color: 'var(--color-white, #FFFFFF)',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.2s ease',
    opacity: hoveredListingCard ? 1 : 0,
    zIndex: 2,
  });

  const getListingSaveStyle = (listingId: string, isSaved: boolean): React.CSSProperties => ({
    position: 'absolute',
    top: '8px',
    left: '8px',
    width: '36px',
    height: '36px',
    borderRadius: '50%',
    backgroundColor: isSaved ? 'var(--color-primary-1, #E90C17)' : (hoveredListingSave === listingId ? 'rgba(0, 0, 0, 0.8)' : 'rgba(0, 0, 0, 0.6)'),
    backdropFilter: 'blur(4px)',
    border: 'none',
    color: 'var(--color-white, #FFFFFF)',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.2s ease',
    opacity: isSaved || hoveredListingCard === listingId ? 1 : 0,
    zIndex: 3,
    transform: hoveredListingSave === listingId ? 'scale(1.1)' : 'scale(1)',
  });

  const listingPhotoCounterStyle: React.CSSProperties = {
    position: 'absolute',
    bottom: '8px',
    right: '8px',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    backdropFilter: 'blur(4px)',
    borderRadius: '4px',
    padding: '4px 8px',
    color: 'var(--color-white, #FFFFFF)',
    fontFamily: 'var(--font-body, Geist, sans-serif)',
    fontSize: '11px',
    fontWeight: 600,
    zIndex: 2,
  };

  const listingDetailsStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    padding: '12px',
  };

  const listingHeaderStyle: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '4px',
  };

  const listingTitleStyle: React.CSSProperties = {
    fontFamily: 'var(--font-body, Geist, sans-serif)',
    fontSize: '14px',
    fontWeight: 600,
    color: 'var(--color-neutrals-1, #141416)',
    margin: 0,
    lineHeight: 1.3,
  };

  const listingPriceStyle: React.CSSProperties = {
    fontFamily: 'var(--font-heading, Poppins, sans-serif)',
    fontWeight: 700,
    fontSize: '18px',
    color: 'var(--color-neutrals-1, #141416)',
    marginBottom: '4px',
  };

  const listingInfoStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
    fontFamily: 'var(--font-body, Geist, sans-serif)',
    fontSize: '12px',
    color: 'var(--color-neutrals-3, #353945)',
    paddingBottom: '8px',
    borderBottom: '1px solid var(--color-neutrals-7, #F4F5F6)',
  };

  const listingInfoItemStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
  };

  const getListingCtaStyle = (listingId: string): React.CSSProperties => ({
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '6px',
    background: hoveredListingCta === listingId ? 'var(--color-neutrals-1, #141416)' : 'var(--color-white, #FFFFFF)',
    color: hoveredListingCta === listingId ? 'var(--color-white, #FFFFFF)' : 'var(--color-neutrals-1, #141416)',
    border: `1px solid ${hoveredListingCta === listingId ? 'var(--color-neutrals-1, #141416)' : 'var(--color-neutrals-6, #E6E8EC)'}`,
    borderRadius: '4px',
    padding: '10px 16px',
    fontFamily: 'var(--font-body, Geist, sans-serif)',
    fontSize: '13px',
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
    marginTop: 'auto',
  });

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
    borderRadius: '8px',
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
    borderRadius: '8px',
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

  const bestDealBadgeStyle: React.CSSProperties = {
    position: 'absolute',
    top: '8px',
    left: '8px',
    background: 'linear-gradient(135deg, #FFD700, #FFA500)',
    color: '#000',
    padding: '4px 10px',
    borderRadius: '4px',
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    fontFamily: 'var(--font-body, Geist, sans-serif)',
    fontSize: '11px',
    fontWeight: 700,
    zIndex: 3,
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  };

  const renderListingCard = (listing: LocalListing, isBestDeal: boolean = false) => {
    const photos = listing.photoUrls || [listing.imageUrl];
    const currentPhotoIdx = currentListingPhotoIndex[listing.id] || 0;
    const hasMultiplePhotos = photos.length > 1;
    const isSaved = savedLeads.has(listing.id);

    return (
      <div 
        key={listing.id} 
        style={getListingCardStyle(listing.id, isBestDeal)}
        onClick={() => handleListingCardClick(listing)}
        onMouseEnter={() => setHoveredListingCard(listing.id)}
        onMouseLeave={() => setHoveredListingCard(null)}
      >
        {isBestDeal && (
          <div style={bestDealBadgeStyle}>
            <Icon name="star" variant="filled" size={16} />
            <span>Best Deal</span>
          </div>
        )}

        <div style={listingImageContainerStyle}>
          <img src={photos[currentPhotoIdx]} alt={`${listing.year} ${vehicleName}`} style={listingImageStyle} />
          
          <button
            style={getListingSaveStyle(listing.id, isSaved)}
            onClick={(e) => handleSaveLead(listing, e)}
            onMouseEnter={() => setHoveredListingSave(listing.id)}
            onMouseLeave={() => setHoveredListingSave(null)}
            aria-label={isSaved ? 'Unsave lead' : 'Save lead'}
          >
            <Icon name={isSaved ? 'bookmark' : 'bookmark_border'} variant={isSaved ? 'filled' : 'outlined'} size={20} />
          </button>
          
          {hasMultiplePhotos && (
            <>
              <button
                style={getListingNavStyle(listing.id, 'prev')}
                onClick={(e) => { e.stopPropagation(); handleListingPhotoNav(listing.id, 'prev', photos.length); }}
                onMouseEnter={() => setHoveredListingNav(`${listing.id}-prev`)}
                onMouseLeave={() => setHoveredListingNav(null)}
                aria-label="Previous photo"
              >
                <Icon name="chevron_left" size={20} />
              </button>
              <button
                style={getListingNavStyle(listing.id, 'next')}
                onClick={(e) => { e.stopPropagation(); handleListingPhotoNav(listing.id, 'next', photos.length); }}
                onMouseEnter={() => setHoveredListingNav(`${listing.id}-next`)}
                onMouseLeave={() => setHoveredListingNav(null)}
                aria-label="Next photo"
              >
                <Icon name="chevron_right" size={20} />
              </button>
              <div style={listingPhotoCounterStyle}>{currentPhotoIdx + 1}/{photos.length}</div>
            </>
          )}
        </div>

        <div style={listingDetailsStyle}>
          <div style={listingHeaderStyle}>
            <div style={listingTitleStyle}>{listing.year} {vehicleName}{listing.trim ? ` ${listing.trim}` : ''}</div>
            <Badge variant={listing.condition === 'New' ? 'success' : listing.condition === 'Certified Pre-Owned' ? 'info' : 'neutral'} size="sm">
              {listing.condition === 'Certified Pre-Owned' ? 'CPO' : listing.condition}
            </Badge>
          </div>
          
          <div style={listingPriceStyle}>{formatPrice(listing.price)}</div>
          
          <div style={listingInfoStyle}>
            <div style={listingInfoItemStyle}>
              <Icon name="speed" size={16} />
              <span>{formatMileage(listing.mileage)}</span>
            </div>
          </div>
          
          <div style={{ ...listingInfoItemStyle, marginBottom: '6px' }}>
            <Icon name="store" size={16} />
            <span style={{ fontWeight: 500, color: 'var(--color-neutrals-1, #141416)' }}>{listing.dealerName}</span>
          </div>
          
          <div style={{ ...listingInfoItemStyle, marginBottom: '6px' }}>
            <Icon name="location_on" size={16} />
            <span>{listing.location} • {listing.distance} mi away</span>
          </div>
          
          {listing.exteriorColor && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '11px', color: 'var(--color-neutrals-3, #353945)', marginBottom: '10px', flexWrap: 'wrap' }}>
              <span style={{ fontWeight: 500 }}>Exterior:</span>
              <span style={{ color: 'var(--color-neutrals-1, #141416)' }}>{listing.exteriorColor}</span>
              {listing.interiorColor && (
                <>
                  <span style={{ margin: '0 4px' }}>•</span>
                  <span style={{ fontWeight: 500 }}>Interior:</span>
                  <span style={{ color: 'var(--color-neutrals-1, #141416)' }}>{listing.interiorColor}</span>
                </>
              )}
            </div>
          )}
          
          <button 
            style={getListingCtaStyle(listing.id)}
            onClick={(e) => e.stopPropagation()}
            onMouseEnter={() => setHoveredListingCta(listing.id)}
            onMouseLeave={() => setHoveredListingCta(null)}
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
