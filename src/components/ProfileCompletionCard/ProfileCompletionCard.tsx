import React, { useState } from 'react';
import './ProfileCompletionCard.css';

export interface OnboardingStatus {
  step1: boolean;
  step2: boolean;
  step3: boolean;
  step4: boolean;
}

export interface OnboardingData {
  name?: string;
  location?: string;
  interests?: string[];
  vehicleType?: 'own' | 'want';
  vehicle?: string;
  newsletters?: string[];
}

export interface ProfileCompletionCardProps {
  completionStatus: OnboardingStatus;
  onboardingData?: OnboardingData;
  onUpdateStep1?: (data: { name: string; location: string }) => void;
  onUpdateStep2?: (data: { interests: string[] }) => void;
  onUpdateStep3?: (data: { vehicleType: 'own' | 'want'; vehicle: string }) => void;
  onUpdateStep4?: (data: { newsletters: string[] }) => void;
  onDismiss?: () => void;
}

export const ProfileCompletionCard: React.FC<ProfileCompletionCardProps> = ({ 
  completionStatus, 
  onboardingData = {},
  onUpdateStep1,
  onUpdateStep2,
  onUpdateStep3,
  onUpdateStep4,
  onDismiss 
}) => {
  const [expandedStep, setExpandedStep] = useState<number | null>(null);
  
  // Local state for each step
  const [step1Name, setStep1Name] = useState(onboardingData.name || '');
  const [step1Location, setStep1Location] = useState(onboardingData.location || '');
  const [step2Interests, setStep2Interests] = useState<string[]>(onboardingData.interests || []);
  const [step3VehicleType, setStep3VehicleType] = useState<'own' | 'want'>(onboardingData.vehicleType || 'own');
  const [step3Vehicle, setStep3Vehicle] = useState(onboardingData.vehicle || '');
  const [step4Newsletters, setStep4Newsletters] = useState<string[]>(onboardingData.newsletters || []);

  const steps = [
    { number: 1, title: 'Tell us about yourself', completed: completionStatus.step1 },
    { number: 2, title: 'Your interests', completed: completionStatus.step2 },
    { number: 3, title: 'Your vehicles', completed: completionStatus.step3 },
    { number: 4, title: 'Newsletter preferences', completed: completionStatus.step4 },
  ];

  const completedCount = steps.filter(step => step.completed).length;
  const totalSteps = steps.length;
  const progressPercentage = (completedCount / totalSteps) * 100;
  const isFullyComplete = completedCount === totalSteps;

  if (isFullyComplete) {
    return null; // Don't show if everything is complete
  }

  const handleToggleStep = (stepNumber: number) => {
    setExpandedStep(expandedStep === stepNumber ? null : stepNumber);
  };

  const handleSaveStep1 = () => {
    if (step1Name && onUpdateStep1) {
      onUpdateStep1({ name: step1Name, location: step1Location });
      setExpandedStep(null);
    }
  };

  const handleSaveStep2 = () => {
    if (step2Interests.length > 0 && onUpdateStep2) {
      onUpdateStep2({ interests: step2Interests });
      setExpandedStep(null);
    }
  };

  const handleSaveStep3 = () => {
    if (step3Vehicle && onUpdateStep3) {
      onUpdateStep3({ vehicleType: step3VehicleType, vehicle: step3Vehicle });
      setExpandedStep(null);
    }
  };

  const handleSaveStep4 = () => {
    if (onUpdateStep4) {
      onUpdateStep4({ newsletters: step4Newsletters });
      setExpandedStep(null);
    }
  };

  const toggleInterest = (interest: string) => {
    setStep2Interests(prev => 
      prev.includes(interest) 
        ? prev.filter(i => i !== interest)
        : [...prev, interest]
    );
  };

  const toggleNewsletter = (newsletter: string) => {
    setStep4Newsletters(prev => 
      prev.includes(newsletter) 
        ? prev.filter(n => n !== newsletter)
        : [...prev, newsletter]
    );
  };

  return (
    <div className="profile-completion-card">
      <div className="profile-completion-card__header">
        <div className="profile-completion-card__title-row">
          <div className="profile-completion-card__icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M9 11L12 14L22 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M21 12V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <div className="profile-completion-card__title-content">
            <h3 className="profile-completion-card__title">
              Complete Your Profile ({completedCount} of {totalSteps})
            </h3>
            <p className="profile-completion-card__subtitle">
              Get personalized recommendations and tailored content by completing your profile.
            </p>
          </div>
          {onDismiss && (
            <button className="profile-completion-card__dismiss" onClick={onDismiss} aria-label="Dismiss">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M15 5L5 15M5 5L15 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          )}
        </div>

        <div className="profile-completion-card__progress">
          <div className="profile-completion-card__progress-bar">
            <div 
              className="profile-completion-card__progress-fill" 
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
          <span className="profile-completion-card__progress-text">
            {Math.round(progressPercentage)}% Complete
          </span>
        </div>
      </div>

      <div className="profile-completion-card__steps">
        {steps.map((step) => (
          <div 
            key={step.number} 
            className={`profile-completion-step ${step.completed ? 'profile-completion-step--completed' : ''}`}
          >
            <div className="profile-completion-step__header">
              <div className="profile-completion-step__info">
                <div className="profile-completion-step__icon">
                  {step.completed ? (
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                      <circle cx="10" cy="10" r="9" fill="#34A853" stroke="#34A853" strokeWidth="2"/>
                      <path d="M6 10L8.5 12.5L14 7" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  ) : (
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                      <circle cx="10" cy="10" r="9" stroke="#E6E8EC" strokeWidth="2" fill="white"/>
                    </svg>
                  )}
                </div>
                <div className="profile-completion-step__content">
                  <span className="profile-completion-step__title">Step {step.number}: {step.title}</span>
                </div>
              </div>
              <button 
                className="profile-completion-step__button"
                onClick={() => handleToggleStep(step.number)}
              >
                {expandedStep === step.number ? 'Cancel' : (step.completed ? 'Edit' : 'Complete →')}
              </button>
            </div>

            {expandedStep === step.number && step.number === 1 && (
              <div className="profile-completion-step__form">
                <h4 className="profile-completion-step__form-title">Tell Us About Yourself</h4>
                <div className="profile-completion-step__fields">
                  <div className="profile-field">
                    <label className="profile-field__label">What is Your Name?</label>
                    <input 
                      type="text"
                      className="profile-field__input"
                      placeholder="Name"
                      value={step1Name}
                      onChange={(e) => setStep1Name(e.target.value)}
                    />
                  </div>
                  <div className="profile-field">
                    <label className="profile-field__label">Where are you located? (Optional)</label>
                    <input 
                      type="text"
                      className="profile-field__input"
                      placeholder="Location"
                      value={step1Location}
                      onChange={(e) => setStep1Location(e.target.value)}
                    />
                  </div>
                </div>
                <button 
                  className="profile-completion-step__save-btn"
                  onClick={handleSaveStep1}
                  disabled={!step1Name}
                >
                  Save Changes
                </button>
              </div>
            )}

            {expandedStep === step.number && step.number === 2 && (
              <div className="profile-completion-step__form">
                <h4 className="profile-completion-step__form-title">Tell Us Your Interests</h4>
                <p className="profile-completion-step__form-subtitle">So we can help you on your journey?</p>
                <div className="profile-completion-step__options">
                  {[
                    'Are you shopping?',
                    'Are you browsing?',
                    'Vehicle Reviews',
                    'Automotive News',
                    'Car Comparisons',
                    'Buying Guides',
                    'Maintenance Tips',
                    'Racing & Sports'
                  ].map((interest) => (
                    <label key={interest} className="profile-option">
                      <input
                        type="checkbox"
                        checked={step2Interests.includes(interest)}
                        onChange={() => toggleInterest(interest)}
                      />
                      <span className="profile-option__label">{interest}</span>
                    </label>
                  ))}
                </div>
                <button 
                  className="profile-completion-step__save-btn"
                  onClick={handleSaveStep2}
                  disabled={step2Interests.length === 0}
                >
                  Save Changes
                </button>
              </div>
            )}

            {expandedStep === step.number && step.number === 3 && (
              <div className="profile-completion-step__form">
                <h4 className="profile-completion-step__form-title">Your Vehicles</h4>
                <div className="profile-completion-step__fields">
                  <div className="profile-field">
                    <label className="profile-field__label">Vehicle</label>
                    <input 
                      type="text"
                      className="profile-field__input"
                      placeholder="e.g., 2024 Honda Civic"
                      value={step3Vehicle}
                      onChange={(e) => setStep3Vehicle(e.target.value)}
                    />
                  </div>
                  <div className="profile-field">
                    <label className="profile-field__label">Vehicle Type</label>
                    <div className="profile-radio-group">
                      <label className="profile-radio">
                        <input
                          type="radio"
                          checked={step3VehicleType === 'own'}
                          onChange={() => setStep3VehicleType('own')}
                        />
                        <span>I Own This Car</span>
                      </label>
                      <label className="profile-radio">
                        <input
                          type="radio"
                          checked={step3VehicleType === 'want'}
                          onChange={() => setStep3VehicleType('want')}
                        />
                        <span>I Want This Car</span>
                      </label>
                    </div>
                  </div>
                </div>
                <button 
                  className="profile-completion-step__save-btn"
                  onClick={handleSaveStep3}
                  disabled={!step3Vehicle}
                >
                  Save Changes
                </button>
              </div>
            )}

            {expandedStep === step.number && step.number === 4 && (
              <div className="profile-completion-step__form">
                <h4 className="profile-completion-step__form-title">Let's Keep In Touch</h4>
                <p className="profile-completion-step__form-subtitle">With Personalized Car Information and Inspiration</p>
                <div className="profile-completion-step__options profile-completion-step__options--single-column">
                  {[
                    { id: 'motortrend', label: 'Subscribe to MotorTrend Newsletter' },
                    { id: 'hotrod', label: 'Subscribe to HOT ROD Newsletter' }
                  ].map((newsletter) => (
                    <label key={newsletter.id} className="profile-option">
                      <input
                        type="checkbox"
                        checked={step4Newsletters.includes(newsletter.id)}
                        onChange={() => toggleNewsletter(newsletter.id)}
                      />
                      <span className="profile-option__label">{newsletter.label}</span>
                    </label>
                  ))}
                </div>
                <button 
                  className="profile-completion-step__save-btn"
                  onClick={handleSaveStep4}
                >
                  Save Changes
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

