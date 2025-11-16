/**
 * Vehicles Section Component
 * Section with heading and vehicle cards grid
 */

import React, { useState, useEffect, useMemo } from 'react';
import { VehicleCard } from '../VehicleCard';
import { vehicleImageFor } from '../../utils/vehicleImages';
import { generateStaffRating, generateCommunityRating } from '../../utils/vehicleRatings';
import { useRating } from '../../contexts/RatingContext';
import { useNavigate } from 'react-router-dom';
import { parseVehicleName } from '../../utils/vehicleImages';
import { RatingModal } from '../RatingModal';
import WriteReviewModal from '../WriteReviewModal';
import { getVehicleBodyStyle, type BodyStyleCategory, BODY_STYLE_CATEGORIES } from '../../utils/vehicleBodyStyles';
import './VehiclesSection.css';

export interface VehicleItem {
  name: string;
}

export interface VehiclesSectionProps {
  title: string;
  vehicles: VehicleItem[];
  onShowMore?: () => void;
  showMoreVisible?: boolean;
}

export const VehiclesSection: React.FC<VehiclesSectionProps> = ({
  title,
  vehicles,
}) => {
  const navigate = useNavigate();
  const { getUserRating, setUserRating, clearRating } = useRating();
  
  // Pagination state - show 6 initially
  const [vehiclesToShow, setVehiclesToShow] = useState(6);
  
  // State for body style filter
  const [selectedBodyStyle, setSelectedBodyStyle] = useState<BodyStyleCategory | null>(null);
  
  // State for rating modal
  const [isRatingModalOpen, setIsRatingModalOpen] = useState(false);
  const [ratingVehicle, setRatingVehicle] = useState<string>('');
  
  // State for write review modal
  const [isWriteReviewModalOpen, setIsWriteReviewModalOpen] = useState(false);
  const [reviewModalRating, setReviewModalRating] = useState<number | undefined>(undefined);
  
  // State for bookmarked vehicles
  const [bookmarkedVehicles, setBookmarkedVehicles] = useState<Set<string>>(new Set());
  
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
    let filtered = vehicles;
    
    // Apply body style filter if selected
    if (selectedBodyStyle) {
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
  }, [vehicles, selectedBodyStyle, wantedVehicles]);

  // Reset pagination when filter changes
  useEffect(() => {
    setVehiclesToShow(6);
  }, [selectedBodyStyle]);

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

  return (
    <section className="vehicles-section">
      <div className="vehicles-section__header">
        <h2 className="vehicles-section__title">{title}</h2>
        {availableBodyStyles.length > 0 && (
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
                {bodyStyle === 'Truck' ? 'Trucks' : bodyStyle === 'Sedan' ? 'Sedans' : bodyStyle === 'SUV' ? 'SUVs' : bodyStyle === 'Coupe' ? 'Coupes' : bodyStyle === 'Hatchback' ? 'Hatchbacks' : bodyStyle === 'Convertible' ? 'Convertibles' : bodyStyle === 'Wagon' ? 'Wagons' : bodyStyle}
              </button>
            ))}
          </div>
        )}
      </div>
      <div className="vehicles-section__grid">
        {filteredVehicles.slice(0, vehiclesToShow).map((vehicle) => {
          const staffRating = generateStaffRating(vehicle.name);
          const communityRating = generateCommunityRating(vehicle.name);
          const userRating = getUserRating(vehicle.name);
          
          return (
            <VehicleCard
              key={vehicle.name}
              image={vehicleImageFor(vehicle.name)}
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

