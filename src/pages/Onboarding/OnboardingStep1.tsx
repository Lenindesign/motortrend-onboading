/**
 * Onboarding Step 1: Start Your Engines
 * Based on Figma Community design system
 */

import React, { useState } from 'react';
import { TextField } from '../../design-system/components';
import step1Illustration from '../../assets/images/step1-illustration.png';
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

export const OnboardingStep1: React.FC<OnboardingStep1Props> = ({
  onNext,
  onPrevious,
  onSkip,
  initialData,
}) => {
  const [name, setName] = useState(initialData?.name || '');
  const [location, setLocation] = useState(initialData?.location || '');

  const handleNext = () => {
    if (name.trim()) {
      onNext?.({ name, location });
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

          <TextField
            label="Where are you located? (Optional)"
            type="text"
            placeholder="Location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            fullWidth
          />
        </div>

        {/* Navigation Buttons */}
        <div className="onboarding-card__navigation">
          <div className="onboarding-card__nav-row">
            <button
              className="onboarding-nav-btn onboarding-nav-btn--previous onboarding-nav-btn--disabled"
              onClick={onPrevious}
              disabled
            >
              <Icon name="chevron_left" size={20} />
              <span>Previous</span>
            </button>

            <div className="onboarding-card__skip-section">
              <button
                className="onboarding-skip-btn"
                onClick={onSkip}
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

