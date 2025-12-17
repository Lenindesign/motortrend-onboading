/**
 * Welcome Page - Onboarding Complete
 * Based on Figma Community design system
 */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import confetti from 'canvas-confetti';
// Using MotorTrend main logo from URL
const motortrendLogo = 'https://d2kde5ohu8qb21.cloudfront.net/files/68f3fc9ccfecd100026f4650/mtlogo.png';
import { MembershipCard } from '../../components/MembershipCard';
import RatingModal from '../../components/RatingModal';
import { RatingGrid } from '../../components/RatingGrid';
import { getCurrentJoinDate } from '../../utils/dateUtils';
import { useRating } from '../../contexts/RatingContext';
import { parseVehicleName } from '../../utils/vehicleImages';
import './Welcome.css';

export interface WelcomeProps {
  userData?: {
    name?: string;
    location?: string;
    interests?: string[];
    vehicles?: Array<{name: string, ownership: 'own' | 'want'}>;
    newsletters?: string[];
  };
}

interface OnboardingData {
  name?: string;
  location?: string;
  interests?: string[];
  vehicles?: Array<{name: string, ownership: 'own' | 'want', rating?: number}>;
  newsletters?: string[];
  userType?: string;
  joinDate?: string;
}

export const Welcome: React.FC<WelcomeProps> = () => {
  const navigate = useNavigate();
  const [onboardingData, setOnboardingData] = useState<OnboardingData>({});
  
  // Rating modal state
  const [ratingModal, setRatingModal] = useState<{isOpen: boolean, vehicleName: string, currentRating?: number}>({
    isOpen: false,
    vehicleName: '',
    currentRating: 0
  });
  const { setUserRating } = useRating();

  // Load onboarding data from localStorage
  useEffect(() => {
    const data = localStorage.getItem('onboardingData');
    if (data) {
      try {
        const parsed = JSON.parse(data);
        
        // Auto-detect join date if not already set
        if (!parsed.joinDate) {
          const joinDate = getCurrentJoinDate();
          const updatedData = { ...parsed, joinDate };
          setOnboardingData(updatedData);
          localStorage.setItem('onboardingData', JSON.stringify(updatedData));
        } else {
          setOnboardingData(parsed);
        }
        
        // Mark onboarding as complete - show notification dot on profile avatar
        localStorage.setItem('onboardingComplete', 'true');
        localStorage.setItem('profileNotificationSeen', 'false');
      } catch (error) {
        console.error('Error parsing onboarding data:', error);
      }
    }
  }, []);

  // Trigger confetti effect when component mounts
  useEffect(() => {
    const triggerConfetti = () => {
      // Create a confetti cannon from the center of the screen
      confetti({
        particleCount: 200,
        spread: 120,
        origin: { y: 0.6 },
        colors: ['#DC3545', '#00C2FF', '#28A745', '#FFC107', '#6F42C1', '#E83E8C']
      });

      // Add a second burst after a short delay
      setTimeout(() => {
        confetti({
          particleCount: 50,
          spread: 120,
          origin: { y: 0.4 },
          colors: ['#DC3545', '#00C2FF', '#28A745', '#FFC107', '#6F42C1', '#E83E8C']
        });
      }, 300);
    };

    // Trigger confetti after a short delay to ensure the page is fully loaded
    const timer = setTimeout(triggerConfetti, 500);
    
    return () => clearTimeout(timer);
  }, []);

  const { name = 'Guest', vehicles = [] } = onboardingData;

  // Rating handlers

  const handleRatingSubmit = (rating: number) => {
    setUserRating(ratingModal.vehicleName, rating);
    setRatingModal({ isOpen: false, vehicleName: '', currentRating: 0 });
  };

  const handleRateAndReview = (rating: number) => {
    // Submit the rating first
    setUserRating(ratingModal.vehicleName, rating);
    setRatingModal({ isOpen: false, vehicleName: '', currentRating: 0 });
    
    // Navigate to vehicle details page where they can write a review
    try {
      const { year, make, model } = parseVehicleName(ratingModal.vehicleName);
      navigate(`/vehicles/${year}/${make}/${model}`);
    } catch (error) {
      console.error('Error parsing vehicle name:', error);
      // If parsing fails, just stay on current page
    }
  };

  const handleRatingModalClose = () => {
    setRatingModal({ isOpen: false, vehicleName: '', currentRating: 0 });
  };

  return (
    <div className="welcome-page">
      <div className="welcome-card">
        {/* MotorTrend Logo */}
        <div className="welcome-illustration">
          <img 
            src={motortrendLogo} 
            alt="MotorTrend Logo" 
            className="welcome-logo"
          />
        </div>

        {/* Welcome Message */}
        <div className="welcome-message">
          <div className="welcome-message__content">
            <h1 className="welcome-title">Welcome to the Club, {name}!</h1>
            <p className="welcome-subtitle">
              Enjoy your MotorTrend member benefits.
            </p>
          </div>

          {/* Rating Grid */}
          <RatingGrid
            motorTrendRating={9.2}
            userReviewsRating={4.5}
            userReviewsCount={25}
            onRateClick={() => {
              // Handle rate click - could open rating modal
              if (vehicles.length > 0) {
                setRatingModal({
                  isOpen: true,
                  vehicleName: vehicles[0].name,
                  currentRating: vehicles[0].rating || 0
                });
              }
            }}
          />

          {/* Membership Card Section */}
          <div className="membership-section">
            <MembershipCard 
              name={onboardingData?.name || 'User'}
              memberSince={onboardingData?.joinDate || getCurrentJoinDate()}
              car={vehicles.length > 0 ? vehicles[0].name : 'No vehicle selected'}
              newsletter={(() => {
                // Map newsletter IDs to display names
                const newsletterMap: Record<string, string> = {
                  'motortrend': 'MotorTrend',
                  'hotrod': 'HOT ROD',
                  'events': 'Events'
                };
                
                // Get first newsletter from array, or undefined if empty/not exists
                if (onboardingData?.newsletters && Array.isArray(onboardingData.newsletters) && onboardingData.newsletters.length > 0) {
                  const newsletterId = onboardingData.newsletters[0];
                  return newsletterMap[newsletterId] || newsletterId;
                }
                return undefined;
              })()}
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="welcome-actions">
          <button
            className="welcome-btn welcome-btn--secondary"
            onClick={() => navigate('/onboarding/step4')}
          >
            Back
          </button>

          <button
            className="welcome-btn welcome-btn--primary"
            onClick={() => navigate('/')}
          >
            <span>Close</span>
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M8 16L14 10L8 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>
      </div>
      
      {/* Rating Modal */}
      <RatingModal
        isOpen={ratingModal.isOpen}
        onClose={handleRatingModalClose}
        onRate={handleRatingSubmit}
        vehicleName={ratingModal.vehicleName}
        currentRating={ratingModal.currentRating}
        onRateAndReview={handleRateAndReview}
      />
    </div>
  );
};

export default Welcome;

