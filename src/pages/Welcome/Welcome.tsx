/**
 * Welcome Page - Onboarding Complete
 * Based on Figma Community design system
 */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import motortrendLogo from '../../assets/images/motortrend-logo.png';
import Icon from '../../components/Icon';
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
  vehicles?: Array<{name: string, ownership: 'own' | 'want'}>;
  newsletters?: string[];
}

export const Welcome: React.FC<WelcomeProps> = () => {
  const navigate = useNavigate();
  const [onboardingData, setOnboardingData] = useState<OnboardingData>({});

  // Load onboarding data from localStorage
  useEffect(() => {
    const data = localStorage.getItem('onboardingData');
    if (data) {
      try {
        setOnboardingData(JSON.parse(data));
      } catch (error) {
        console.error('Error parsing onboarding data:', error);
      }
    }
  }, []);

  const { name = 'Guest', location, interests = [], vehicles = [], newsletters = [] } = onboardingData;

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
                    <strong>Current Vehicles:</strong> {vehicles.length}
                  </p>
                  <p className="profile-detail">
                    <strong>Newsletter:</strong> {newsletters.length > 0 ? 'Subscribed' : 'Not subscribed'}
                  </p>
                </div>
              </div>

              <div className="profile-divider" />

              {/* Vehicle Section */}
              {vehicles.length > 0 && (
                <div className="vehicle-section">
                  <p className="vehicle-section__title">Your Vehicles:</p>
                  
                  <div className="selected-cars">
                    {vehicles.map((vehicle, index) => (
                      <div key={index} className="selected-car-card">
                        <div className="selected-car-image">
                          <img 
                            src="https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=100&h=100&fit=crop&crop=center" 
                            alt={vehicle.name}
                            className="car-image"
                          />
                        </div>
                        <div className="selected-car-details">
                          <h3 className="selected-car-name">{vehicle.name}</h3>
                          <button
                            type="button"
                            className="change-vehicle-btn"
                            onClick={() => navigate('/onboarding/step3')}
                          >
                            Change Vehicle
                          </button>
                          <div className="ownership-options">
                            <label className="ownership-option">
                              <input
                                type="radio"
                                name={`ownership-${index}`}
                                value="own"
                                checked={vehicle.ownership === 'own'}
                                readOnly
                              />
                              <div className="radio-icon">
                                {vehicle.ownership === 'own' ? (
                                  <Icon name="radio_button_checked" size={20} style={{ color: "#DC3545" }} />
                                ) : (
                                  <Icon name="radio_button_unchecked" size={20} style={{ color: "#CED4DA" }} />
                                )}
                              </div>
                              <span className="radio-text">I Own This Car</span>
                            </label>
                            <label className="ownership-option">
                              <input
                                type="radio"
                                name={`ownership-${index}`}
                                value="want"
                                checked={vehicle.ownership === 'want'}
                                readOnly
                              />
                              <div className="radio-icon">
                                {vehicle.ownership === 'want' ? (
                                  <Icon name="radio_button_checked" size={20} style={{ color: "#DC3545" }} />
                                ) : (
                                  <Icon name="radio_button_unchecked" size={20} style={{ color: "#CED4DA" }} />
                                )}
                              </div>
                              <span className="radio-text">I Want This Car</span>
                            </label>
                          </div>
                        </div>
                        <button
                          type="button"
                          className="selected-car-remove"
                          onClick={() => console.log('Remove vehicle')}
                          aria-label={`Remove ${vehicle.name}`}
                        >
                          <Icon name="close" size={16} />
                        </button>
                      </div>
                    ))}
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
            Customize Again
          </button>
        </div>
      </div>
    </div>
  );
};

export default Welcome;

