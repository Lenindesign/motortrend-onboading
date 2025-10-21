/**
 * Onboarding Step 2: Tell Us Your Interests
 * Based on Figma Community design system
 */

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
// Using new graphics for user types
const buyerImage = 'https://d2kde5ohu8qb21.cloudfront.net/files/68f669499911d50002cef1a2/buyer2.png';
const enthusiastImage = 'https://d2kde5ohu8qb21.cloudfront.net/files/68f6694843a62400020366cc/enthusiast2.png';
const bothImage = 'https://d2kde5ohu8qb21.cloudfront.net/files/68f814a00a2fc80002ec5f02/both.png';
// Step illustration for progress
const step2Illustration = 'https://d2kde5ohu8qb21.cloudfront.net/files/68f56010a481f700027e1855/group1318348098.svg';
import './OnboardingStep2.css';
import Icon from '../../components/Icon';

export interface OnboardingStep2Props {
  onNext?: (data: { interests: string[] }) => void;
  onPrevious?: () => void;
  onSkip?: () => void;
  initialData?: {
    interests?: string[];
  };
}


export const OnboardingStep2: React.FC<OnboardingStep2Props> = () => {
  const navigate = useNavigate();
  const [selectedUserType, setSelectedUserType] = useState<string>('buyer');

  const handleUserTypeSelect = (userType: string) => {
    setSelectedUserType(userType);
  };

  const handleNext = () => {
    console.log('Step 2 data:', selectedUserType);
    // Store data in localStorage
    const existingData = JSON.parse(localStorage.getItem('onboardingData') || '{}');
    localStorage.setItem('onboardingData', JSON.stringify({ ...existingData, userType: selectedUserType }));
    navigate('/onboarding/step3');
  };

  return (
    <div className="onboarding-step">
      <div className="onboarding-card onboarding-card--wide">
        {/* Header with Progress */}
        <div className="onboarding-card__header">
          {/* Progress Illustration */}
          <div className="onboarding-card__illustration">
            <img 
              src={step2Illustration} 
              alt="Step 2 illustration" 
              className="step-illustration-image"
            />
          </div>
          
          <div className="onboarding-card__step">STEP 2/4</div>
        </div>

        {/* Title Section */}
        <div className="onboarding-card__title-section">
          <h1 className="onboarding-card__title">What describes you best?</h1>
          <p className="onboarding-card__subtitle onboarding-card__subtitle--larger">
            Choose the option that best fits your automotive interests
          </p>
        </div>

        {/* User Type Selection */}
        <div className="user-type-selection">
          <button
            className={`user-type-option ${selectedUserType === 'buyer' ? 'user-type-option--selected' : ''}`}
            onClick={() => handleUserTypeSelect('buyer')}
            type="button"
          >
            <div className="user-type-image">
              <img 
                src={buyerImage} 
                alt="Car Buyer" 
                className="user-type-img"
              />
            </div>
            <h3 className="user-type-title">Car Buyer</h3>
            <p className="user-type-description">
              Looking to purchase a new or used vehicle
            </p>
          </button>
          
          <button
            className={`user-type-option ${selectedUserType === 'enthusiast' ? 'user-type-option--selected' : ''}`}
            onClick={() => handleUserTypeSelect('enthusiast')}
            type="button"
          >
            <div className="user-type-image">
              <img 
                src={enthusiastImage} 
                alt="Car Enthusiast" 
                className="user-type-img"
              />
            </div>
            <h3 className="user-type-title">Car Enthusiast</h3>
            <p className="user-type-description">
              Passionate about cars, reviews, and automotive culture
            </p>
          </button>
          
          <button
            className={`user-type-option ${selectedUserType === 'both' ? 'user-type-option--selected' : ''}`}
            onClick={() => handleUserTypeSelect('both')}
            type="button"
          >
            <div className="user-type-image">
              <img 
                src={bothImage} 
                alt="Both" 
                className="user-type-img"
              />
            </div>
            <h3 className="user-type-title">Both</h3>
            <p className="user-type-description">
              Passionate about cars and always in the market for your next ride
            </p>
          </button>
        </div>

        {/* Navigation Buttons */}
        <div className="onboarding-card__navigation">
          <div className="onboarding-card__nav-row">
            <button
              className="onboarding-nav-btn onboarding-nav-btn--previous"
              onClick={() => navigate('/onboarding/step1')}
            >
              <Icon name="chevron_left" size={20} />
              <span>Previous</span>
            </button>

            <button
              className="onboarding-skip-btn"
              onClick={() => navigate('/profile')}
              type="button"
            >
              Skip for now
            </button>

            <button
              className="onboarding-nav-btn onboarding-nav-btn--next"
              onClick={handleNext}
            >
              <span>Next</span>
              <Icon name="chevron_right" size={20} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OnboardingStep2;

