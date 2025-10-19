/**
 * Onboarding Step 1: Start Your Engines
 * Based on Figma Community design system
 */

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TextField } from '../../design-system/components';
// Using SVG illustration from URL
const step1Illustration = 'https://d2kde5ohu8qb21.cloudfront.net/files/68f4db351dd8ca0002a8a5ad/step1.svg';
import './OnboardingStep1.css';
import Icon from '../../components/Icon';

export interface OnboardingStep1Props {
  onNext?: (data: { name: string; location: string }) => void;
  onPrevious?: () => void;
  onSkip?: () => void;
  initialData?: {
    name?: string;
    location?: string;
  };
}

export const OnboardingStep1: React.FC<OnboardingStep1Props> = () => {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [location, setLocation] = useState('');
  const [isDetectingLocation, setIsDetectingLocation] = useState(false);

  const handleDetectLocation = async () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by this browser.');
      return;
    }

    setIsDetectingLocation(true);

    try {
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 300000 // 5 minutes
        });
      });

      const { latitude, longitude } = position.coords;
      
      // Use reverse geocoding to get location name
      try {
        const response = await fetch(
          `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`
        );
        const data = await response.json();
        
        if (data.city && data.principalSubdivision) {
          setLocation(`${data.city}, ${data.principalSubdivision}`);
        } else if (data.locality) {
          setLocation(data.locality);
        } else {
          setLocation(`${latitude.toFixed(4)}, ${longitude.toFixed(4)}`);
        }
      } catch (error) {
        console.error('Reverse geocoding failed:', error);
        setLocation(`${latitude.toFixed(4)}, ${longitude.toFixed(4)}`);
      }
    } catch (error) {
      console.error('Geolocation error:', error);
      if (error instanceof GeolocationPositionError) {
        switch (error.code) {
          case error.PERMISSION_DENIED:
            alert('Location access denied. Please enable location permissions and try again.');
            break;
          case error.POSITION_UNAVAILABLE:
            alert('Location information is unavailable. Please try again.');
            break;
          case error.TIMEOUT:
            alert('Location request timed out. Please try again.');
            break;
          default:
            alert('An unknown error occurred while retrieving location.');
            break;
        }
      }
    } finally {
      setIsDetectingLocation(false);
    }
  };

  const handleNext = () => {
    if (name.trim()) {
      console.log('Step 1 data:', { name, location });
      // Store data in localStorage for now
      localStorage.setItem('onboardingData', JSON.stringify({ name, location }));
      navigate('/onboarding/step2');
    }
  };

  const isNextDisabled = !name.trim();

  return (
    <div className="onboarding-step">
      <div className="onboarding-card">
        {/* Header with Progress */}
        <div className="onboarding-card__header">
          {/* Progress Illustration */}
          <div className="onboarding-card__illustration">
            <img 
              src={step1Illustration} 
              alt="Step 1 illustration" 
              className="step-illustration-image"
            />
          </div>
          
          <div className="onboarding-card__step">STEP 1/4</div>
        </div>

        {/* Title Section */}
        <div className="onboarding-card__title-section">
          <h1 className="onboarding-card__title">Start Your Engines</h1>
          <p className="onboarding-card__subtitle">Let's get to know each other</p>
        </div>

        {/* Form Fields */}
        <div className="onboarding-card__form">
          <TextField
            label="What is Your Name?"
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            fullWidth
            required
          />

          <div className="location-field-container">
            <TextField
              label="Where are you located? (Optional)"
              type="text"
              placeholder="Current Location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              fullWidth
            />
            <button
              type="button"
              className="location-icon-btn"
              onClick={handleDetectLocation}
              disabled={isDetectingLocation}
              title={isDetectingLocation ? 'Detecting location...' : 'Auto-detect location'}
            >
              <Icon 
                name={isDetectingLocation ? "refresh" : "my_location"} 
                size={20} 
                className={isDetectingLocation ? "spinning" : ""}
              />
            </button>
          </div>
        </div>

        {/* Navigation Buttons */}
        <div className="onboarding-card__navigation">
          <div className="onboarding-card__nav-row">
            <button
              className="onboarding-nav-btn onboarding-nav-btn--previous onboarding-nav-btn--disabled"
              disabled
            >
              <Icon name="chevron_left" size={20} />
              <span>Previous</span>
            </button>

            <div className="onboarding-card__skip-section">
              <button
                className="onboarding-skip-btn"
                onClick={() => navigate('/profile')}
                type="button"
              >
                Skip for now
              </button>
            </div>

            <button
              className={`onboarding-nav-btn onboarding-nav-btn--next ${isNextDisabled ? 'onboarding-nav-btn--disabled' : ''}`}
              onClick={handleNext}
              disabled={isNextDisabled}
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

export default OnboardingStep1;

