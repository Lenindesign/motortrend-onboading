/**
 * Onboarding Step 4: Let's Keep In Touch
 * Based on Figma Community design system
 */

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
// Using SVG illustration from URL
const step4Illustration = 'https://d2kde5ohu8qb21.cloudfront.net/files/68f5600ea481f700027e1851/group1318348096.svg';
import './OnboardingStep4.css';
import Icon from '../../components/Icon';

export interface OnboardingStep4Props {
  onNext?: (data: { newsletters: string[] }) => void;
  onPrevious?: () => void;
  onSkip?: () => void;
  initialData?: {
    newsletters?: string[];
  };
}

const newsletterOptions = [
  {
    id: 'motortrend',
    title: 'Subscribe to MotorTrend Newsletter',
    description: 'Get the latest automotive news and insights delivered to your inbox',
    logo: 'motortrend',
  },
  {
    id: 'hotrod',
    title: 'Subscribe to HOT ROD Newsletter',
    description: 'Get the latest automotive news and insights delivered to your inbox',
    logo: 'hotrod',
  },
];

export const OnboardingStep4: React.FC<OnboardingStep4Props> = () => {
  const navigate = useNavigate();
  const [selectedNewsletters, setSelectedNewsletters] = useState<string[]>([]);

  const toggleNewsletter = (id: string) => {
    setSelectedNewsletters((prev) =>
      prev.includes(id) ? prev.filter((n) => n !== id) : [...prev, id]
    );
  };

  const handleComplete = () => {
    // Store newsletter preferences in localStorage
    const existingData = JSON.parse(localStorage.getItem('onboardingData') || '{}');
    localStorage.setItem('onboardingData', JSON.stringify({
      ...existingData,
      newsletters: selectedNewsletters
    }));
    navigate('/welcome');
  };

  const handlePrevious = () => {
    navigate('/onboarding/step3');
  };

  const handleSkip = () => {
    navigate('/welcome');
  };

  return (
    <div className="onboarding-step">
      <div className="onboarding-card onboarding-card--wide">
        {/* Header with Progress */}
        <div className="onboarding-card__header">
          {/* Progress Illustration */}
          <div className="onboarding-card__illustration">
            <img 
              src={step4Illustration} 
              alt="Step 4 illustration" 
              className="step-illustration-image"
            />
          </div>
          
          <div className="onboarding-card__step">STEP 4/4</div>
        </div>

        {/* Title Section */}
        <div className="onboarding-card__title-section">
          <h1 className="onboarding-card__title">Let's Keep In Touch</h1>
          <p className="onboarding-card__subtitle onboarding-card__subtitle--larger">
            With Personalized Car Information and Inspiration
          </p>
        </div>

        {/* Newsletter Options */}
        <div className="newsletter-section">
          {newsletterOptions.map((newsletter) => (
            <button
              key={newsletter.id}
              type="button"
              className={`newsletter-card ${
                selectedNewsletters.includes(newsletter.id)
                  ? 'newsletter-card--selected'
                  : ''
              }`}
              onClick={() => toggleNewsletter(newsletter.id)}
            >
              <div className="newsletter-card__content">
                {/* Logo */}
                <div className="newsletter-card__logo">
                  {newsletter.logo === 'motortrend' ? (
                    <img 
                      src="https://d2kde5ohu8qb21.cloudfront.net/files/68f64a2ae852a20002f9bc03/mt-nl.svg" 
                      alt="MotorTrend Newsletter" 
                      width="72" 
                      height="72"
                      style={{ borderRadius: '8px' }}
                    />
                  ) : (
                    <img 
                      src="https://d2kde5ohu8qb21.cloudfront.net/files/68f64aa7e852a20002f9bc04/hr-nl.svg" 
                      alt="HOT ROD Newsletter" 
                      width="72" 
                      height="72"
                      style={{ borderRadius: '8px' }}
                    />
                  )}
                </div>

                {/* Text Content */}
                <div className="newsletter-card__text">
                  <div className="newsletter-card__checkbox-row">
                    <div className="checkbox-container">
                      <div className={`checkbox ${selectedNewsletters.includes(newsletter.id) ? 'checkbox--checked' : ''}`}>
                        {selectedNewsletters.includes(newsletter.id) && (
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M20 6L9 17L4 12" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        )}
                      </div>
                    </div>
                    <h3 className="newsletter-card__title">{newsletter.title}</h3>
                  </div>
                  <p className="newsletter-card__description">{newsletter.description}</p>
                </div>

                {/* MotorTrend logo watermark for selected state */}
                {newsletter.logo === 'motortrend' && selectedNewsletters.includes(newsletter.id) && (
                  <div className="newsletter-card__watermark">
                    <svg width="60" height="12" viewBox="0 0 60 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M0 0H60V12H0V0Z" fill="#E90C17" fillOpacity="0.15"/>
                    </svg>
                  </div>
                )}
              </div>
            </button>
          ))}

          {/* Privacy Message */}
          <div className="privacy-message">
            <p className="privacy-message__text">
              <strong>Your privacy matters</strong>
              <br />
              We'll never share your email address. You can unsubscribe at any time with one click.
            </p>
          </div>
        </div>

        {/* Navigation Buttons */}
        <div className="onboarding-card__navigation">
          <div className="onboarding-card__nav-row">
            <button
              className="onboarding-nav-btn onboarding-nav-btn--previous"
              onClick={handlePrevious}
            >
              <Icon name="chevron_left" size={20} />
              <span>Previous</span>
            </button>

            <button
              className="onboarding-skip-btn"
              onClick={handleSkip}
              type="button"
            >
              Skip for now
            </button>

            <button
              className="onboarding-nav-btn onboarding-nav-btn--next"
              onClick={handleComplete}
            >
              <span>Complete</span>
              <Icon name="chevron_right" size={20} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OnboardingStep4;

