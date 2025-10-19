/**
 * Onboarding Step 3: Tell Us About Your Ride
 * Based on Figma Community design system
 */

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import step3Illustration from '../../assets/images/step3-illustration.png';
import './OnboardingStep3.css';
import Icon from '../../components/Icon';

export interface OnboardingStep3Props {
  onNext?: (data: { vehicleType: 'own' | 'want'; vehicle: string }) => void;
  onPrevious?: () => void;
  onSkip?: () => void;
  initialData?: {
    vehicleType?: 'own' | 'want';
    vehicle?: string;
  };
}

export const OnboardingStep3: React.FC<OnboardingStep3Props> = ({
  onNext,
  onPrevious,
  onSkip,
  initialData,
}) => {
  const [vehicleType, setVehicleType] = useState<'own' | 'want'>(
    initialData?.vehicleType || 'own'
  );
  const [vehicle, setVehicle] = useState(initialData?.vehicle || '');
  const [noVehicle, setNoVehicle] = useState(false);

  const handleNext = () => {
    if (noVehicle || vehicle.trim()) {
      onNext?.({ vehicleType, vehicle: noVehicle ? 'none' : vehicle });
    }
  };

  const handleNoVehicleClick = () => {
    setNoVehicle(true);
    setVehicle('');
  };

  const handleVehicleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setVehicle(e.target.value);
    setNoVehicle(false);
  };

  return (
    <div className="onboarding-step">
      <div className="onboarding-card onboarding-card--wide">
        {/* Header with Progress */}
        <div className="onboarding-card__header">
          {/* Progress Illustration */}
          <div className="onboarding-card__illustration">
            <img 
              src={step3Illustration} 
              alt="Step 3 illustration" 
              className="step-illustration-image"
            />
          </div>
          
          <div className="onboarding-card__step">STEP 3/4</div>
        </div>

        {/* Title Section */}
        <div className="onboarding-card__title-section">
          <h1 className="onboarding-card__title">Tell Us About Your Ride</h1>
          <p className="onboarding-card__subtitle onboarding-card__subtitle--larger">
            The Cars you Drive and Want
          </p>
        </div>

        {/* Vehicle Search Section */}
        <div className="vehicle-search">
          <div className="vehicle-search__container">
            {/* Header with Radio Buttons */}
            <div className="vehicle-search__header">
              <span className="vehicle-search__label">Search for a vehicle</span>
              
              <div className="vehicle-search__radio-group">
                <button
                  type="button"
                  className={`radio-option ${vehicleType === 'own' ? 'radio-option--selected' : ''}`}
                  onClick={() => setVehicleType('own')}
                >
                  <div className="radio-button">
                    {vehicleType === 'own' && <div className="radio-button__dot" />}
                  </div>
                  <span className="radio-option__label">I Own This Car</span>
                </button>

                <button
                  type="button"
                  className={`radio-option ${vehicleType === 'want' ? 'radio-option--selected' : ''}`}
                  onClick={() => setVehicleType('want')}
                >
                  <div className="radio-button">
                    {vehicleType === 'want' && <div className="radio-button__dot" />}
                  </div>
                  <span className="radio-option__label">I Want This Car</span>
                </button>
              </div>
            </div>

            {/* Search Input */}
            <div className="vehicle-search__input-wrapper">
              <div className="vehicle-search__input-container">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="vehicle-search__icon">
                  <path d="M21 21L16.65 16.65M19 11C19 15.4183 15.4183 19 11 19C6.58172 19 3 15.4183 3 11C3 6.58172 6.58172 3 11 3C15.4183 3 19 6.58172 19 11Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <input
                  type="text"
                  className="vehicle-search__input"
                  placeholder="Search"
                  value={vehicle}
                  onChange={handleVehicleChange}
                  disabled={noVehicle}
                />
              </div>

              <button
                type="button"
                className="vehicle-search__no-vehicle"
                onClick={handleNoVehicleClick}
              >
                I don't currently own a vehicle
              </button>
            </div>
          </div>
        </div>

        {/* Navigation Buttons */}
        <div className="onboarding-card__navigation">
          <div className="onboarding-card__nav-row">
            <button
              className="onboarding-nav-btn onboarding-nav-btn--previous"
              onClick={onPrevious}
            >
                <Icon name="chevron_left" size={20} />
              <span>Previous</span>
            </button>

            <button
              className="onboarding-skip-btn"
              onClick={onSkip}
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

export default OnboardingStep3;

