/**
 * Onboarding Step 2: Tell Us Your Interests
 * Based on Figma Community design system
 */

import React, { useState } from 'react';
import step2Illustration from '../../assets/images/step2-illustration.png';
import './OnboardingStep2.css';

export interface OnboardingStep2Props {
  onNext?: (data: { interests: string[] }) => void;
  onPrevious?: () => void;
  onSkip?: () => void;
  initialData?: {
    interests?: string[];
  };
}

const interestOptions = [
  'Are you shopping?',
  'Are you browsing?',
  'Vehicle Reviews',
  'Automotive News',
  'Car Comparisons',
  'Buying Guides',
  'Maintenance Tips',
  'Racing & Sports',
];

export const OnboardingStep2: React.FC<OnboardingStep2Props> = ({
  onNext,
  onPrevious,
  onSkip,
  initialData,
}) => {
  const [selectedInterests, setSelectedInterests] = useState<string[]>(
    initialData?.interests || []
  );

  const toggleInterest = (interest: string) => {
    setSelectedInterests((prev) =>
      prev.includes(interest)
        ? prev.filter((i) => i !== interest)
        : [...prev, interest]
    );
  };

  const handleNext = () => {
    onNext?.({ interests: selectedInterests });
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
          <h1 className="onboarding-card__title">Tell Us Your Interests</h1>
          <p className="onboarding-card__subtitle onboarding-card__subtitle--larger">
            So we can help you on your journey?
          </p>
        </div>

        {/* Interest Tiles */}
        <div className="interest-tiles">
          {interestOptions.map((interest, index) => (
            <button
              key={interest}
              className={`interest-tile ${
                selectedInterests.includes(interest) ? 'interest-tile--selected' : ''
              }`}
              onClick={() => toggleInterest(interest)}
              type="button"
            >
              {interest}
            </button>
          ))}
        </div>

        {/* Navigation Buttons */}
        <div className="onboarding-card__navigation">
          <div className="onboarding-card__nav-row">
            <button
              className="onboarding-nav-btn onboarding-nav-btn--previous"
              onClick={onPrevious}
            >
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 16L6 10L12 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
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
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M8 16L14 10L8 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OnboardingStep2;

