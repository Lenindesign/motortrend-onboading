/**
 * Vehicles Section Component
 * Section with heading and vehicle cards grid
 * Now powered by the Vehicles API for better filtering
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
import './VehiclesSection.css';

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
    setSearchQuery(`${vehicle.year} ${vehicle.make} ${vehicle.model}`);
    setShowAutocomplete(false);
  };
  
  const handleSearchClear = () => {
    setSearchQuery('');
    setShowAutocomplete(false);
  };

  return (
    <section className="vehicles-section">
      <div className="vehicles-section__header">
        {/* Title and Top Filters on Same Row */}
        <div className="vehicles-section__title-row">
          <h2 className="vehicles-section__title">{title}</h2>
          
          {/* Top Filter Bar: Type and Price */}
          <div className="vehicles-section__top-filters">
          <button
            className={`vehicles-section__top-filter-btn ${filterMode === 'type' ? 'vehicles-section__top-filter-btn--active' : ''}`}
            onClick={handleTypeClick}
            type="button"
          >
            Type
          </button>
          <button
            className={`vehicles-section__top-filter-btn ${filterMode === 'price' ? 'vehicles-section__top-filter-btn--active' : ''}`}
            onClick={handlePriceClick}
            type="button"
          >
            Price
          </button>
          
          {/* Search Input with Autocomplete */}
          <div className="vehicles-section__search-container">
            <input
              ref={searchInputRef}
              type="text"
              className="vehicles-section__search-input"
              placeholder="Search by make, model, or year"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => {
                if (searchQuery.length >= 1) {
                  setShowAutocomplete(true);
                }
              }}
            />
            {searchQuery && (
              <button
                className="vehicles-section__search-clear"
                onClick={handleSearchClear}
                type="button"
                aria-label="Clear search"
              >
                ×
              </button>
            )}
            <Icon 
              name="search" 
              size={20} 
              className="vehicles-section__search-icon"
            />
            
            {/* Autocomplete Dropdown */}
            {showAutocomplete && autocompleteResults.length > 0 && (
              <div ref={autocompleteRef} className="vehicles-section__autocomplete">
                {autocompleteResults.map((vehicle) => (
                  <button
                    key={vehicle.id}
                    className="vehicles-section__autocomplete-item"
                    onClick={() => handleAutocompleteSelect(vehicle)}
                    type="button"
                  >
                    <span className="vehicles-section__autocomplete-text">
                      {vehicle.year} {vehicle.make} {vehicle.model}
                    </span>
                    <span className="vehicles-section__autocomplete-type">
                      {vehicle.bodyStyle}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
        </div>
        
        {/* Dynamic Filters - Show Type or Price based on filterMode */}
        {filterMode === 'type' && availableBodyStyles.length > 0 && (
          <div className="vehicles-section__filters">
            <button
              className={`vehicles-section__filter-btn ${selectedBodyStyle === null ? 'vehicles-section__filter-btn--active' : ''}`}
              onClick={() => setSelectedBodyStyle(null)}
              type="button"
            >
              All
            </button>
            {availableBodyStyles.map((bodyStyle) => (
              <button
                key={bodyStyle}
                className={`vehicles-section__filter-btn ${selectedBodyStyle === bodyStyle ? 'vehicles-section__filter-btn--active' : ''}`}
                onClick={() => setSelectedBodyStyle(selectedBodyStyle === bodyStyle ? null : bodyStyle)}
                type="button"
              >
                {bodyStyle === 'Truck' ? 'Top Trucks' : bodyStyle === 'Sedan' ? 'Top Sedans' : bodyStyle === 'SUV' ? 'Top SUVs' : bodyStyle === 'Coupe' ? 'Top Coupes' : bodyStyle === 'Hatchback' ? 'Top Hatchbacks' : bodyStyle === 'Convertible' ? 'Top Convertibles' : bodyStyle === 'Wagon' ? 'Top Wagons' : `Top ${bodyStyle}s`}
              </button>
            ))}
          </div>
        )}
        
        {/* Price Range Filters */}
        {filterMode === 'price' && (
          <div className="vehicles-section__filters">
            <button
              className={`vehicles-section__filter-btn ${selectedPriceRange === null ? 'vehicles-section__filter-btn--active' : ''}`}
              onClick={() => setSelectedPriceRange(null)}
              type="button"
            >
              All
            </button>
            {PRICE_RANGES.map((range) => (
              <button
                key={range.label}
                className={`vehicles-section__filter-btn ${selectedPriceRange === range.label ? 'vehicles-section__filter-btn--active' : ''}`}
                onClick={() => setSelectedPriceRange(selectedPriceRange === range.label ? null : range.label)}
                type="button"
              >
                {range.label}
              </button>
            ))}
          </div>
        )}
      </div>
      <div className="vehicles-section__grid">
        {filteredVehicles.slice(0, vehiclesToShow).map((vehicle) => {
          // Use API ratings as primary source (single source of truth)
          // Only fallback to generated ratings if API data is missing
          const staffRating = vehicle.staffRating ?? generateStaffRating(vehicle.name);
          const communityRating = vehicle.communityRating ?? generateCommunityRating(vehicle.name);
          const userRating = getUserRating(vehicle.name);
          
          return (
            <VehicleCard
              key={vehicle.name}
              image={vehicle.image || vehicleImageFor(vehicle.name)}
              name={vehicle.name}
              type=""
              rating1={staffRating}
              rating2={communityRating}
              hasMultipleRatings={true}
              onBookmark={() => handleBookmark(vehicle.name)}
              isBookmarked={isBookmarked(vehicle.name)}
              onViewDetails={() => handleViewDetails(vehicle.name)}
              onRate={() => handleRate(vehicle.name)}
              userRating={userRating}
            />
          );
        })}
      </div>
      {filteredVehicles.length > vehiclesToShow && (
        <div className="vehicles-section__display-more">
          <button
            className="vehicles-section__display-more-btn"
            onClick={() => setVehiclesToShow(prev => prev + 6)}
            type="button"
            aria-label="Display more vehicles"
          >
            <span>Display More</span>
            <svg
              className="vehicles-section__display-more-chevron"
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M5 7.5L10 12.5L15 7.5"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>
      )}
      
      {/* Rating Modal */}
      <RatingModal
        isOpen={isRatingModalOpen}
        onClose={handleCloseRatingModal}
        onRate={handleSubmitRating}
        vehicleName={ratingVehicle}
        currentRating={ratingVehicle ? getUserRating(ratingVehicle) : 0}
        onRateAndReview={handleRateAndReview}
        onClear={handleClearRating}
      />
      
      {/* Write Review Modal */}
      <WriteReviewModal
        key={`${ratingVehicle}-${reviewModalRating || 'new'}`}
        isOpen={isWriteReviewModalOpen}
        onClose={() => {
          setIsWriteReviewModalOpen(false);
          setReviewModalRating(undefined);
        }}
        vehicleName={ratingVehicle}
        vehicleImage={ratingVehicle ? vehicleImageFor(ratingVehicle) : undefined}
        onSubmit={handleSubmitReview}
        initialRating={reviewModalRating}
      />
    </section>
  );
};

export default VehiclesSection;

