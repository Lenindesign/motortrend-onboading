/**
 * Vehicles Section Component
 * Section with heading and vehicle cards grid
 */

import React, { useState, useEffect } from 'react';
import { VehicleCard } from '../VehicleCard';
import { vehicleImageFor } from '../../utils/vehicleImages';
import { generateStaffRating, generateCommunityRating } from '../../utils/vehicleRatings';
import { useRating } from '../../contexts/RatingContext';
import { useNavigate } from 'react-router-dom';
import { parseVehicleName } from '../../utils/vehicleImages';
import { RatingModal } from '../RatingModal';
import WriteReviewModal from '../WriteReviewModal';
import type { ReviewData } from '../UserReviews/UserReviews';
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
  onShowMore,
  showMoreVisible = false,
}) => {
  const navigate = useNavigate();
  const { getUserRating, setUserRating, clearRating } = useRating();
  
  // State for rating modal
  const [isRatingModalOpen, setIsRatingModalOpen] = useState(false);
  const [ratingVehicle, setRatingVehicle] = useState<string>('');
  
  // State for write review modal
  const [isWriteReviewModalOpen, setIsWriteReviewModalOpen] = useState(false);
  const [reviewModalRating, setReviewModalRating] = useState<number | undefined>(undefined);
  
  // State for bookmarked vehicles
  const [bookmarkedVehicles, setBookmarkedVehicles] = useState<Set<string>>(new Set());

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
  
  const handleSubmitReview = (_review: ReviewData) => {
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
      <h2 className="vehicles-section__title">{title}</h2>
      <div className="vehicles-section__grid">
        {vehicles.map((vehicle) => {
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
      {showMoreVisible && onShowMore && (
        <div className="vehicles-section__show-more">
          <button
            className="vehicles-section__show-more-btn"
            onClick={onShowMore}
            type="button"
            aria-label="Show more vehicles"
          >
            <span>Show More</span>
            <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>
              expand_more
            </span>
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

