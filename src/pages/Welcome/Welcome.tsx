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
import { getCurrentJoinDate } from '../../utils/dateUtils';
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

  const { name = 'Guest', vehicles = [], userType } = onboardingData;

  // Rating handlers

  const handleRatingSubmit = (rating: number) => {
    const updatedVehicles = vehicles.map(vehicle => 
      vehicle.name === ratingModal.vehicleName 
        ? { ...vehicle, rating }
        : vehicle
    );
    
    const updatedData = { ...onboardingData, vehicles: updatedVehicles };
    setOnboardingData(updatedData);
    localStorage.setItem('onboardingData', JSON.stringify(updatedData));
    
    setRatingModal({ isOpen: false, vehicleName: '', currentRating: 0 });
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
            <h1 className="welcome-title">Welcome {name}</h1>
            <p className="welcome-subtitle">
              Based on your interest in {userType === 'buyer' ? 'buying a car' : userType === 'enthusiast' ? 'automotive enthusiasm' : 'automotive content'}, 
              I've personalized your MotorTrend experience.
            </p>
          </div>

          {/* Membership Card Section */}
          <div className="membership-section">
            <MembershipCard 
              name={onboardingData?.name || 'User'}
              memberSince={onboardingData?.joinDate || getCurrentJoinDate()}
              car={vehicles.length > 0 ? vehicles[0].name : 'No vehicle selected'}
              newsletter="MotorTrend"
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="welcome-actions">
          <button
            className="welcome-btn welcome-btn--primary"
            onClick={() => navigate('/')}
          >
            <span>Go to Home Page</span>
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M8 16L14 10L8 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>

          <button
            className="welcome-btn welcome-btn--secondary"
            onClick={() => navigate('/onboarding/step1')}
          >
            Start Over
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
      />
    </div>
  );
};

export default Welcome;

