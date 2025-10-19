/**
 * Onboarding Step 2: Tell Us Your Interests
 * Based on Figma Community design system
 */

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
// Using SVG illustration from URL
const step2Illustration = 'https://d2kde5ohu8qb21.cloudfront.net/files/68f4db35cc41280002b024b1/step2.svg';
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

export const OnboardingStep2: React.FC<OnboardingStep2Props> = () => {
  const navigate = useNavigate();
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);

  const toggleInterest = (interest: string) => {
    setSelectedInterests((prev) =>
      prev.includes(interest)
        ? prev.filter((i) => i !== interest)
        : [...prev, interest]
    );
  };

  const handleNext = () => {
    console.log('Step 2 data:', selectedInterests);
    // Store data in localStorage
    const existingData = JSON.parse(localStorage.getItem('onboardingData') || '{}');
    localStorage.setItem('onboardingData', JSON.stringify({ ...existingData, interests: selectedInterests }));
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
          <h1 className="onboarding-card__title">Tell Us Your Interests</h1>
          <p className="onboarding-card__subtitle onboarding-card__subtitle--larger">
            So we can help you on your journey?
          </p>
        </div>

        {/* Interest Tiles */}
        <div className="interest-tiles">
          {interestOptions.map((interest) => (
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

