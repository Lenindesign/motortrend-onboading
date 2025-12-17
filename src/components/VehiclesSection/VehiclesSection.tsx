/**
 * Vehicles Section Component
 * Migrated to inline styles for Tailwind compatibility
 */

import React, { useState, useEffect, useMemo, useRef } from 'react';
import { VehicleCard } from '../VehicleCard';
import { vehicleImageFor } from '../../utils/vehicleImages';
import { generateStaffRating, generateCommunityRating } from '../../utils/vehicleRatings';
import { useRating } from '../../contexts/RatingContext';
import { useNavigate } from 'react-router-dom';
import { parseVehicleName } from '../../utils/vehicleImages';
import { RatingModal } from '../RatingModal';
import WriteReviewModal from '../WriteReviewModal';
import { getVehicleBodyStyle, type BodyStyleCategory, BODY_STYLE_CATEGORIES } from '../../utils/vehicleBodyStyles';
import { getVehicles, searchVehicles } from '../../api/vehiclesApi';
import Icon from '../Icon';
import { addSearchedVehicle } from '../PersonalizedVehicles';

export interface VehicleItem {
  name: string;
  image?: string;
  staffRating?: number;
  communityRating?: number;
}

export interface VehiclesSectionProps {
  title: string;
  vehicles: VehicleItem[];
  onShowMore?: () => void;
  showMoreVisible?: boolean;
  useApi?: boolean; // Toggle to use API or legacy data
}

// Price range options - defined outside component to prevent recreation
const PRICE_RANGES = [
  { label: 'Under $30k', min: 0, max: 30000 },
  { label: '$30k - $50k', min: 30000, max: 50000 },
  { label: '$50k - $75k', min: 50000, max: 75000 },
  { label: '$75k - $100k', min: 75000, max: 100000 },
  { label: '$100k+', min: 100000, max: Infinity }
];

export const VehiclesSection: React.FC<VehiclesSectionProps> = ({
  title,
  vehicles,
  useApi = false,
}) => {
  const navigate = useNavigate();
  const { getUserRating, setUserRating, clearRating } = useRating();
  
  // Pagination state - show 6 initially
  const [vehiclesToShow, setVehiclesToShow] = useState(6);
  
  // State for body style filter
  const [selectedBodyStyle, setSelectedBodyStyle] = useState<BodyStyleCategory | null>(null);
  
  // State for price range filter
  const [selectedPriceRange, setSelectedPriceRange] = useState<string | null>(null);
  
  // State for which filter mode is active (type or price)
  const [filterMode, setFilterMode] = useState<'type' | 'price'>('type');
  
  // State for search
  const [searchQuery, setSearchQuery] = useState('');
  const [showAutocomplete, setShowAutocomplete] = useState(false);
  const [autocompleteResults, setAutocompleteResults] = useState<any[]>([]);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const autocompleteRef = useRef<HTMLDivElement>(null);
  
  // State for rating modal
  const [isRatingModalOpen, setIsRatingModalOpen] = useState(false);
  const [ratingVehicle, setRatingVehicle] = useState<string>('');
  
  // State for write review modal
  const [isWriteReviewModalOpen, setIsWriteReviewModalOpen] = useState(false);
  const [reviewModalRating, setReviewModalRating] = useState<number | undefined>(undefined);
  
  // State for bookmarked vehicles
  const [bookmarkedVehicles, setBookmarkedVehicles] = useState<Set<string>>(new Set());
  
  // Get vehicles from API if enabled
  const apiVehicles = useMemo(() => {
    if (!useApi) return [];
    
    const bodyStyleMap: Record<string, string> = {
      'SUV': 'SUV',
      'Sedan': 'Sedan',
      'Truck': 'Truck',
      'Coupe': 'Coupe',
      'Hatchback': 'Hatchback',
      'Convertible': 'Convertible',
      'Wagon': 'Wagon'
    };
    
    // Get selected price range
    const selectedRange = PRICE_RANGES.find(r => r.label === selectedPriceRange);
    
    return getVehicles({
      bodyStyle: selectedBodyStyle ? [bodyStyleMap[selectedBodyStyle]] : undefined,
      priceMin: selectedRange?.min,
      priceMax: selectedRange?.max === Infinity ? undefined : selectedRange?.max,
      search: searchQuery,
      sortBy: 'year',
      sortOrder: 'desc'
    });
  }, [useApi, selectedBodyStyle, selectedPriceRange, searchQuery]);
  
  // Available body styles - show all body styles
  const availableBodyStyles = useMemo(() => {
    // Return all body styles in a preferred order: SUV, Sedan, Truck, Coupe, Hatchback, Convertible, Wagon
    return BODY_STYLE_CATEGORIES;
  }, []);
  
  // Get user's "want" vehicles from onboarding
  const wantedVehicles = useMemo(() => {
    try {
      const onboardingData = localStorage.getItem('onboardingData');
      if (!onboardingData) return new Set<string>();
      
      const data = JSON.parse(onboardingData);
      if (!data.vehicles || !Array.isArray(data.vehicles)) return new Set<string>();
      
      const wanted = new Set<string>();
      data.vehicles.forEach((v: { name: string; ownership: 'own' | 'want' }) => {
        if (v.ownership === 'want') {
          wanted.add(v.name);
        }
      });
      
      return wanted;
    } catch (error) {
      console.error('Error loading wanted vehicles:', error);
      return new Set<string>();
    }
  }, []);

  // Filter and sort vehicles - wanted vehicles first, then body style filter
  const filteredVehicles = useMemo(() => {
    // Use API vehicles if enabled, otherwise use legacy data
    let filtered = useApi 
      ? apiVehicles.map(v => ({ 
          name: `${v.year} ${v.make} ${v.model}`, 
          image: v.image,
          staffRating: v.staffRating,
          communityRating: v.communityRating
        }))
      : vehicles;
    
    // Apply body style filter if selected (only for legacy data)
    if (selectedBodyStyle && !useApi) {
      filtered = vehicles.filter(vehicle => {
        const vehicleStyles = getVehicleBodyStyle(vehicle.name);
        return vehicleStyles.includes(selectedBodyStyle);
      });
    }
    
    // Sort to prioritize "want" vehicles from onboarding
    return [...filtered].sort((a, b) => {
      const aIsWanted = wantedVehicles.has(a.name);
      const bIsWanted = wantedVehicles.has(b.name);
      
      // Wanted vehicles come first
      if (aIsWanted && !bIsWanted) return -1;
      if (!aIsWanted && bIsWanted) return 1;
      
      // Otherwise maintain original order
      return 0;
    });
  }, [vehicles, selectedBodyStyle, wantedVehicles, useApi, apiVehicles]);

  // Handle search input change with autocomplete
  useEffect(() => {
    if (searchQuery.length >= 1 && useApi) {
      const results = searchVehicles(searchQuery, 10);
      setAutocompleteResults(results);
      setShowAutocomplete(true);
    } else {
      setAutocompleteResults([]);
      setShowAutocomplete(false);
    }
  }, [searchQuery, useApi]);
  
  // Close autocomplete when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        autocompleteRef.current &&
        !autocompleteRef.current.contains(event.target as Node) &&
        searchInputRef.current &&
        !searchInputRef.current.contains(event.target as Node)
      ) {
        setShowAutocomplete(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
  
  // Reset pagination when filter changes
  useEffect(() => {
    setVehiclesToShow(6);
  }, [selectedBodyStyle, selectedPriceRange, searchQuery]);
  
  // Handle Type button click
  const handleTypeClick = () => {
    setFilterMode('type');
    setSelectedPriceRange(null);
  };
  
  // Handle Price button click
  const handlePriceClick = () => {
    setFilterMode('price');
    setSelectedBodyStyle(null);
  };

  const handleViewDetails = (vehicleName: string) => {
    const { year, make, model } = parseVehicleName(vehicleName);
    navigate(`/vehicles/${encodeURIComponent(year)}/${encodeURIComponent(make)}/${encodeURIComponent(model)}`);
  };

  const handleRate = (vehicleName: string) => {
    setRatingVehicle(vehicleName);
    setIsRatingModalOpen(true);
  };
  
  const handleCloseRatingModal = () => {
    setIsRatingModalOpen(false);
    setRatingVehicle('');
  };
  
  const handleSubmitRating = (rating: number) => {
    if (ratingVehicle) {
      setUserRating(ratingVehicle, rating);
    }
    setIsRatingModalOpen(false);
    setRatingVehicle('');
  };
  
  const handleRateAndReview = (rating: number) => {
    if (ratingVehicle) {
      setUserRating(ratingVehicle, rating);
      setReviewModalRating(rating);
      setIsRatingModalOpen(false);
      setTimeout(() => {
        setIsWriteReviewModalOpen(true);
      }, 50);
    }
  };
  
  const handleClearRating = () => {
    if (ratingVehicle) {
      clearRating(ratingVehicle);
    }
    setIsRatingModalOpen(false);
    setRatingVehicle('');
  };
  
  const handleSubmitReview = () => {
    // Review is saved in the WriteReviewModal component
    setIsWriteReviewModalOpen(false);
    setReviewModalRating(undefined);
  };

  // Load bookmarked vehicles from localStorage on mount
  useEffect(() => {
    const loadBookmarkedVehicles = () => {
      try {
        const onboardingData = localStorage.getItem('onboardingData');
        if (!onboardingData) return;
        
        const data = JSON.parse(onboardingData);
        if (!data.vehicles || !Array.isArray(data.vehicles)) return;
        
        const bookmarked = new Set<string>();
        data.vehicles.forEach((v: { name: string }) => {
          bookmarked.add(v.name);
        });
        
        setBookmarkedVehicles(bookmarked);
      } catch (error) {
        console.error('Error loading bookmarked vehicles:', error);
      }
    };
    
    loadBookmarkedVehicles();
    
    // Listen for storage changes (in case bookmarks are updated in another tab)
    window.addEventListener('storage', loadBookmarkedVehicles);
    
    return () => {
      window.removeEventListener('storage', loadBookmarkedVehicles);
    };
  }, []);

  const handleBookmark = (vehicleName: string) => {
    // Toggle bookmark status
    try {
      const onboardingData = localStorage.getItem('onboardingData');
      const data = onboardingData ? JSON.parse(onboardingData) : {};
      
      if (!data.vehicles) {
        data.vehicles = [];
      }
      
      const vehicleIndex = data.vehicles.findIndex(
        (v: { name: string }) => v.name === vehicleName
      );
      
      const isCurrentlyBookmarked = bookmarkedVehicles.has(vehicleName);
      
      if (vehicleIndex >= 0) {
        // Remove from saved
        data.vehicles.splice(vehicleIndex, 1);
      } else {
        // Add to saved
        data.vehicles.push({
          name: vehicleName,
          ownership: 'want'
        });
      }
      
      localStorage.setItem('onboardingData', JSON.stringify(data));
      
      // Update state to trigger re-render
      setBookmarkedVehicles(prev => {
        const updated = new Set(prev);
        if (isCurrentlyBookmarked) {
          updated.delete(vehicleName);
        } else {
          updated.add(vehicleName);
        }
        return updated;
      });
    } catch (error) {
      console.error('Error toggling bookmark:', error);
    }
  };

  const isBookmarked = (vehicleName: string): boolean => {
    return bookmarkedVehicles.has(vehicleName);
  };
  
  const handleAutocompleteSelect = (vehicle: any) => {
    const vehicleName = `${vehicle.year} ${vehicle.make} ${vehicle.model}`;
    setSearchQuery(vehicleName);
    setShowAutocomplete(false);
    // Track searched vehicle for personalization
    addSearchedVehicle(searchQuery || vehicleName, vehicleName);
  };
  
  const handleSearchClear = () => {
    setSearchQuery('');
    setShowAutocomplete(false);
  };

  // Hover states
  const [hoveredFilterBtn, setHoveredFilterBtn] = useState<string | null>(null);
  const [hoveredTopFilter, setHoveredTopFilter] = useState<string | null>(null);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [hoveredAutocomplete, setHoveredAutocomplete] = useState<string | null>(null);
  const [isDisplayMoreHovered, setIsDisplayMoreHovered] = useState(false);

  // Styles
  const sectionStyle: React.CSSProperties = { width: '100%', marginBottom: 'var(--section-spacing-vertical, 32px)', padding: 0 };
  const headerStyle: React.CSSProperties = { marginBottom: 'var(--spacing-3, 24px)' };
  const titleRowStyle: React.CSSProperties = { display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--spacing-2, 16px)', gap: 'var(--spacing-3, 24px)' };
  const titleStyle: React.CSSProperties = { fontFamily: 'var(--font-heading)', fontWeight: 600, fontSize: '24px', lineHeight: '1.2em', color: 'var(--color-neutrals-1, #141416)', margin: 0, textAlign: 'left', flexShrink: 0 };
  const topFiltersStyle: React.CSSProperties = { display: 'flex', alignItems: 'center', gap: 'var(--spacing-2, 16px)', flexWrap: 'wrap', justifyContent: 'flex-end' };
  
  const getTopFilterBtnStyle = (id: string, isActive: boolean): React.CSSProperties => {
    const isHovered = hoveredTopFilter === id;
    return { padding: '8px 20px', backgroundColor: isActive ? 'var(--color-neutrals-3, #353945)' : (isHovered ? 'var(--color-neutrals-7, #F4F5F6)' : 'var(--color-neutrals-8, #FCFCFD)'), border: `1px solid ${isActive ? 'var(--color-neutrals-3)' : (isHovered ? 'var(--color-neutrals-3)' : 'var(--color-neutrals-6, #E6E8EC)')}`, borderRadius: 'var(--border-radius-sm, 4px)', fontFamily: 'var(--font-body)', fontSize: '14px', fontWeight: 600, color: isActive ? 'var(--color-neutrals-8, #FCFCFD)' : 'var(--color-neutrals-2, #23262F)', cursor: 'pointer', transition: 'all 150ms ease-in-out', whiteSpace: 'nowrap', flexShrink: 0 };
  };

  const searchContainerStyle: React.CSSProperties = { position: 'relative', flex: 1, minWidth: '200px', maxWidth: '400px' };
  const searchInputStyle: React.CSSProperties = { width: '100%', padding: '8px 40px 8px 16px', backgroundColor: isSearchFocused ? 'var(--color-neutrals-7, #F4F5F6)' : 'var(--color-neutrals-8, #FCFCFD)', border: `1px solid ${isSearchFocused ? 'var(--color-neutrals-3)' : 'var(--color-neutrals-6, #E6E8EC)'}`, borderRadius: 'var(--border-radius-sm, 4px)', fontFamily: 'var(--font-body)', fontSize: '14px', color: 'var(--color-neutrals-1, #141416)', transition: 'all 150ms ease-in-out', outline: 'none' };
  const searchIconStyle: React.CSSProperties = { position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-neutrals-5, #B1B5C3)', pointerEvents: 'none' };
  const searchClearStyle: React.CSSProperties = { position: 'absolute', right: '36px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--color-neutrals-4, #6E7481)', fontSize: '24px', lineHeight: 1, cursor: 'pointer', padding: '0 4px' };
  const autocompleteStyle: React.CSSProperties = { position: 'absolute', top: 'calc(100% + 4px)', left: 0, right: 0, backgroundColor: 'var(--color-neutrals-8, #FCFCFD)', border: '1px solid var(--color-neutrals-6, #E6E8EC)', borderRadius: 'var(--border-radius-sm, 4px)', boxShadow: '0 4px 12px rgba(0,0,0,0.15)', maxHeight: '300px', overflowY: 'auto', zIndex: 100 };
  
  const getAutocompleteItemStyle = (id: string): React.CSSProperties => ({ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', padding: '12px 16px', background: hoveredAutocomplete === id ? 'var(--color-neutrals-7, #F4F5F6)' : 'none', border: 'none', borderBottom: '1px solid var(--color-neutrals-7, #F4F5F6)', textAlign: 'left', cursor: 'pointer', transition: 'background-color 150ms ease-in-out' });
  
  const autocompleteTextStyle: React.CSSProperties = { fontFamily: 'var(--font-body)', fontSize: '14px', fontWeight: 600, color: 'var(--color-neutrals-1, #141416)' };
  const autocompleteTypeStyle: React.CSSProperties = { fontFamily: 'var(--font-body)', fontSize: '12px', color: 'var(--color-neutrals-4, #6E7481)', padding: '2px 8px', backgroundColor: 'var(--color-neutrals-7, #F4F5F6)', borderRadius: 'var(--border-radius-sm, 4px)' };
  
  const filtersStyle: React.CSSProperties = { display: 'flex', alignItems: 'center', gap: 'var(--spacing-2, 16px)', flexWrap: 'nowrap', overflowX: 'auto', overflowY: 'hidden', WebkitOverflowScrolling: 'touch', scrollbarWidth: 'none', msOverflowStyle: 'none' };
  
  const getFilterBtnStyle = (id: string, isActive: boolean): React.CSSProperties => {
    const isHovered = hoveredFilterBtn === id;
    return { padding: '6px 16px', backgroundColor: isActive ? 'var(--color-neutrals-3, #353945)' : (isHovered ? 'var(--color-neutrals-7, #F4F5F6)' : 'var(--color-neutrals-8, #FCFCFD)'), border: `1px solid ${isActive ? 'var(--color-neutrals-3)' : (isHovered ? 'var(--color-neutrals-3)' : 'var(--color-neutrals-6, #E6E8EC)')}`, borderRadius: 'var(--border-radius-sm, 4px)', fontFamily: 'var(--font-body)', fontSize: '14px', fontWeight: 600, color: isActive ? 'var(--color-neutrals-8, #FCFCFD)' : 'var(--color-neutrals-2, #23262F)', whiteSpace: 'nowrap', flexShrink: 0, cursor: 'pointer', transition: 'all 150ms ease-in-out' };
  };

  const gridStyle: React.CSSProperties = { display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 'var(--spacing-3, 24px)', width: '100%' };
  const displayMoreStyle: React.CSSProperties = { display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: 'var(--spacing-4, 32px)', width: '100%' };
  const displayMoreBtnStyle: React.CSSProperties = { display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', padding: '12px 16px', background: isDisplayMoreHovered ? 'var(--color-neutrals-7, #F4F5F6)' : 'none', border: `1px solid ${isDisplayMoreHovered ? 'var(--color-neutrals-5, #B1B5C3)' : 'var(--color-neutrals-6, #E6E8EC)'}`, borderRadius: 'var(--border-radius-md, 8px)', fontFamily: 'var(--font-body)', fontSize: '16px', fontWeight: 600, color: 'var(--color-neutrals-2, #23262F)', cursor: 'pointer', transition: 'all 150ms ease-in-out', gap: 'var(--spacing-2, 16px)' };
  const chevronStyle: React.CSSProperties = { flexShrink: 0, width: '20px', height: '20px', color: 'var(--color-neutrals-3, #353945)' };

  return (
    <section style={sectionStyle}>
      <div style={headerStyle}>
        <div style={titleRowStyle}>
          <h2 style={titleStyle}>{title}</h2>
          <div style={topFiltersStyle}>
            <button style={getTopFilterBtnStyle('type', filterMode === 'type')} onClick={handleTypeClick} onMouseEnter={() => setHoveredTopFilter('type')} onMouseLeave={() => setHoveredTopFilter(null)} type="button">Type</button>
            <button style={getTopFilterBtnStyle('price', filterMode === 'price')} onClick={handlePriceClick} onMouseEnter={() => setHoveredTopFilter('price')} onMouseLeave={() => setHoveredTopFilter(null)} type="button">Price</button>
            <div style={searchContainerStyle}>
              <input ref={searchInputRef} type="text" style={searchInputStyle} placeholder="Search by make, model, or year" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} onFocus={() => { setIsSearchFocused(true); if (searchQuery.length >= 1) setShowAutocomplete(true); }} onBlur={() => setIsSearchFocused(false)} />
              {searchQuery && <button style={searchClearStyle} onClick={handleSearchClear} type="button" aria-label="Clear search">×</button>}
              <Icon name="search" size={20} style={searchIconStyle} />
              {showAutocomplete && autocompleteResults.length > 0 && (
                <div ref={autocompleteRef} style={autocompleteStyle}>
                  {autocompleteResults.map((vehicle) => (
                    <button key={vehicle.id} style={getAutocompleteItemStyle(vehicle.id)} onClick={() => handleAutocompleteSelect(vehicle)} onMouseEnter={() => setHoveredAutocomplete(vehicle.id)} onMouseLeave={() => setHoveredAutocomplete(null)} type="button">
                      <span style={autocompleteTextStyle}>{vehicle.year} {vehicle.make} {vehicle.model}</span>
                      <span style={autocompleteTypeStyle}>{vehicle.bodyStyle}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
        {filterMode === 'type' && availableBodyStyles.length > 0 && (
          <div style={filtersStyle}>
            <button style={getFilterBtnStyle('all-type', selectedBodyStyle === null)} onClick={() => setSelectedBodyStyle(null)} onMouseEnter={() => setHoveredFilterBtn('all-type')} onMouseLeave={() => setHoveredFilterBtn(null)} type="button">All</button>
            {availableBodyStyles.map((bodyStyle) => (
              <button key={bodyStyle} style={getFilterBtnStyle(bodyStyle, selectedBodyStyle === bodyStyle)} onClick={() => setSelectedBodyStyle(selectedBodyStyle === bodyStyle ? null : bodyStyle)} onMouseEnter={() => setHoveredFilterBtn(bodyStyle)} onMouseLeave={() => setHoveredFilterBtn(null)} type="button">
                {bodyStyle === 'Truck' ? 'Top Trucks' : bodyStyle === 'Sedan' ? 'Top Sedans' : bodyStyle === 'SUV' ? 'Top SUVs' : bodyStyle === 'Coupe' ? 'Top Coupes' : bodyStyle === 'Hatchback' ? 'Top Hatchbacks' : bodyStyle === 'Convertible' ? 'Top Convertibles' : bodyStyle === 'Wagon' ? 'Top Wagons' : `Top ${bodyStyle}s`}
              </button>
            ))}
          </div>
        )}
        {filterMode === 'price' && (
          <div style={filtersStyle}>
            <button style={getFilterBtnStyle('all-price', selectedPriceRange === null)} onClick={() => setSelectedPriceRange(null)} onMouseEnter={() => setHoveredFilterBtn('all-price')} onMouseLeave={() => setHoveredFilterBtn(null)} type="button">All</button>
            {PRICE_RANGES.map((range) => (
              <button key={range.label} style={getFilterBtnStyle(range.label, selectedPriceRange === range.label)} onClick={() => setSelectedPriceRange(selectedPriceRange === range.label ? null : range.label)} onMouseEnter={() => setHoveredFilterBtn(range.label)} onMouseLeave={() => setHoveredFilterBtn(null)} type="button">{range.label}</button>
            ))}
          </div>
        )}
      </div>
      <div style={gridStyle}>
        {filteredVehicles.slice(0, vehiclesToShow).map((vehicle) => {
          const staffRating = vehicle.staffRating ?? generateStaffRating(vehicle.name);
          const communityRating = vehicle.communityRating ?? generateCommunityRating(vehicle.name);
          const userRating = getUserRating(vehicle.name);
          return (
            <VehicleCard key={vehicle.name} image={vehicle.image || vehicleImageFor(vehicle.name)} name={vehicle.name} type="" rating1={staffRating} rating2={communityRating} hasMultipleRatings={true} onBookmark={() => handleBookmark(vehicle.name)} isBookmarked={isBookmarked(vehicle.name)} onViewDetails={() => handleViewDetails(vehicle.name)} onRate={() => handleRate(vehicle.name)} userRating={userRating} />
          );
        })}
      </div>
      {filteredVehicles.length > vehiclesToShow && (
        <div style={displayMoreStyle}>
          <button style={displayMoreBtnStyle} onClick={() => setVehiclesToShow(prev => prev + 6)} onMouseEnter={() => setIsDisplayMoreHovered(true)} onMouseLeave={() => setIsDisplayMoreHovered(false)} type="button" aria-label="Display more vehicles">
            <span>Display More</span>
            <svg style={chevronStyle} width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M5 7.5L10 12.5L15 7.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </button>
        </div>
      )}
      <RatingModal isOpen={isRatingModalOpen} onClose={handleCloseRatingModal} onRate={handleSubmitRating} vehicleName={ratingVehicle} currentRating={ratingVehicle ? getUserRating(ratingVehicle) : 0} onRateAndReview={handleRateAndReview} onClear={handleClearRating} />
      <WriteReviewModal key={`${ratingVehicle}-${reviewModalRating || 'new'}`} isOpen={isWriteReviewModalOpen} onClose={() => { setIsWriteReviewModalOpen(false); setReviewModalRating(undefined); }} vehicleName={ratingVehicle} vehicleImage={ratingVehicle ? vehicleImageFor(ratingVehicle) : undefined} onSubmit={handleSubmitReview} initialRating={reviewModalRating} />
    </section>
  );
};

export default VehiclesSection;

