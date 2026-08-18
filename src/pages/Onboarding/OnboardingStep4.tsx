/**
 * Onboarding Step 4: Let's Keep In Touch
 * Based on Figma Community design system
 */

import React, { useState, useEffect } from 'react';
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
    description: 'Trust MotorTrend for the best car reviews, news, car rankings, and much more',
    logo: 'motortrend',
  },
  {
    id: 'hotrod',
    title: 'Subscribe to HOT ROD Newsletter',
    description: 'Get the latest automotive news and insights delivered to your inbox',
    logo: 'hotrod',
  },
  {
    id: 'events',
    title: 'Subscribe to Our Events Newsletter',
    description: 'Stay informed on our epic car events!',
    logo: 'events',
  },
];

export const OnboardingStep4: React.FC<OnboardingStep4Props> = () => {
  const navigate = useNavigate();
  const [selectedNewsletters, setSelectedNewsletters] = useState<string[]>([]);

  // Load existing newsletter selections from localStorage
  useEffect(() => {
    const existingData = localStorage.getItem('onboardingData');
    if (existingData) {
      try {
        const parsed = JSON.parse(existingData);
        if (parsed.newsletters && Array.isArray(parsed.newsletters)) {
          setSelectedNewsletters(parsed.newsletters);
        }
      } catch (error) {
        console.error('Error loading onboarding data:', error);
      }
    }
  }, []);

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
                      style={{ borderRadius: 'var(--border-radius-md, 8px)' }}
                    />
                  ) : newsletter.logo === 'hotrod' ? (
                    <img 
                      src="https://d2kde5ohu8qb21.cloudfront.net/files/68f64aa7e852a20002f9bc04/hr-nl.svg" 
                      alt="HOT ROD Newsletter" 
                      width="72" 
                      height="72"
                      style={{ borderRadius: 'var(--border-radius-md, 8px)' }}
                    />
                  ) : (
                    <img 
                      src="https://www.motortrend.com/files/69040ce5e09a72000286cf1d/event.png"
                      alt="Our Events Newsletter" 
                      width="72" 
                      height="72"
                      style={{ borderRadius: 'var(--border-radius-md, 8px)' }}
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
              <span>Back</span>
            </button>

            <button
              className="onboarding-skip-btn"
              onClick={handleSkip}
              type="button"
            >
              <span className="skip-text-desktop">Skip this step</span>
              <span className="skip-text-mobile">Skip</span>
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
