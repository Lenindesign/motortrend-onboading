/**
 * Welcome Page - Onboarding Complete
 * Based on Figma Community design system
 */

import React from 'react';
import motortrendLogo from '../../assets/images/motortrend-logo.png';
import './Welcome.css';

export interface WelcomeProps {
  userData?: {
    name?: string;
    location?: string;
    interests?: string[];
    vehicle?: string;
    vehicleType?: 'own' | 'want';
    newsletters?: string[];
  };
  onGoHome?: () => void;
  onCustomizeAgain?: () => void;
}

export const Welcome: React.FC<WelcomeProps> = ({
  userData,
  onGoHome,
  onCustomizeAgain,
}) => {
  const { name = 'Guest', location, interests = [], vehicle, vehicleType = 'own', newsletters = [] } = userData || {};

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
              Based on your interests{interests.length > 0 ? ` in ${interests.slice(0, 2).join(' and ')}` : ''}, 
              I've personalized your MotorTrend experience.
            </p>
          </div>

          {/* Profile Summary */}
          <div className="profile-summary">
            <div className="profile-summary__container">
              <div className="profile-summary__header">
                <h2 className="profile-summary__title">Your Profile Summary</h2>
              </div>

              <div className="profile-summary__details">
                <div className="profile-summary__left">
                  <p className="profile-detail">
                    <strong>Name:</strong> {name}
                  </p>
                  <p className="profile-detail">
                    <strong>Location:</strong> {location || 'Not specified'}
                  </p>
                  <p className="profile-detail">
                    <strong>Interests:</strong> {interests.length} selected
                  </p>
                </div>

                <div className="profile-summary__right">
                  <p className="profile-detail">
                    <strong>Current Vehicles:</strong> {vehicle && vehicle !== 'none' ? '1' : '0'}
                  </p>
                  <p className="profile-detail">
                    <strong>Newsletter:</strong> {newsletters.length > 0 ? 'Subscribed' : 'Not subscribed'}
                  </p>
                </div>
              </div>

              <div className="profile-divider" />

              {/* Vehicle Section */}
              {vehicle && vehicle !== 'none' && (
                <div className="vehicle-section">
                  <p className="vehicle-section__title">Your Vehicles:</p>
                  
                  <div className="vehicle-card">
                    <div className="vehicle-card__image">
                      <img 
                        src="https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=260&h=180&fit=crop&q=80" 
                        alt={vehicle}
                        className="vehicle-image"
                      />
                    </div>

                    <div className="vehicle-card__info">
                      <div className="vehicle-card__text">
                        <h3 className="vehicle-name">{vehicle}</h3>
                        <button className="vehicle-change-link" onClick={() => console.log('Change vehicle')}>
                          Change Vehicle
                        </button>
                      </div>
                      
                      <div className="vehicle-type-radios">
                        <label className={`radio-option ${vehicleType === 'own' ? 'radio-option--selected' : ''}`}>
                          <div className="radio-button">
                            {vehicleType === 'own' && <div className="radio-button__dot" />}
                          </div>
                          <span className="radio-option__label">I Own This Car</span>
                        </label>

                        <label className={`radio-option ${vehicleType === 'want' ? 'radio-option--selected' : ''}`}>
                          <div className="radio-button">
                            {vehicleType === 'want' && <div className="radio-button__dot" />}
                          </div>
                          <span className="radio-option__label">I Want This Car</span>
                        </label>
                      </div>
                    </div>

                    <button className="vehicle-card__remove" aria-label="Remove vehicle" onClick={() => console.log('Remove vehicle')}>
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="welcome-actions">
          <button
            className="welcome-btn welcome-btn--primary"
            onClick={onGoHome}
          >
            <span>Go to Home Page</span>
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M8 16L14 10L8 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>

          <button
            className="welcome-btn welcome-btn--secondary"
            onClick={onCustomizeAgain}
          >
            Customize Again
          </button>
        </div>
      </div>
    </div>
  );
};

export default Welcome;

