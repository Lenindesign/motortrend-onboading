import React, { useState, useEffect } from 'react';
import './ProfileCompletionCard.css';
import Icon from '../Icon';

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
  vehicles?: Array<{name: string, ownership: 'own' | 'want'}>;
  newsletters?: string[];
}

export interface ProfileCompletionCardProps {
  onboardingData?: OnboardingData;
  onUpdateStep1?: (data: { name: string; location: string }) => void;
  onUpdateStep2?: (data: { interests: string[] }) => void;
  onUpdateStep3?: (data: { vehicleType: 'own' | 'want'; vehicle: string }) => void;
  onUpdateStep4?: (data: { newsletters: string[] }) => void;
  onDismiss?: () => void;
}

export const ProfileCompletionCard: React.FC<ProfileCompletionCardProps> = ({ 
  onUpdateStep1,
  onUpdateStep2,
  onUpdateStep3,
  onUpdateStep4,
  onDismiss 
}) => {
  const [expandedStep, setExpandedStep] = useState<number | null>(null);
  const [localOnboardingData, setLocalOnboardingData] = useState<OnboardingData>({});
  
  // Load onboarding data from localStorage
  useEffect(() => {
    const data = localStorage.getItem('onboardingData');
    if (data) {
      try {
        const parsed = JSON.parse(data);
        setLocalOnboardingData(parsed);
      } catch (error) {
        console.error('Error parsing onboarding data:', error);
      }
    }
  }, []);
  
  // Local state for each step
  const [step1Name, setStep1Name] = useState('');
  const [step1Location, setStep1Location] = useState('');
  const [step2Interests, setStep2Interests] = useState<string[]>([]);
  const [step3Vehicles, setStep3Vehicles] = useState<Array<{name: string, ownership: 'own' | 'want'}>>([]);
  const [step4Newsletters, setStep4Newsletters] = useState<string[]>([]);

  // Update state when localStorage data is loaded
  useEffect(() => {
    if (localOnboardingData.name !== undefined) {
      setStep1Name(localOnboardingData.name || '');
      setStep1Location(localOnboardingData.location || '');
      setStep2Interests(localOnboardingData.interests || []);
      setStep3Vehicles(localOnboardingData.vehicles || []);
      setStep4Newsletters(localOnboardingData.newsletters || []);
    }
  }, [localOnboardingData]);

  // Calculate completion status based on actual data
  const step1Completed = !!(step1Name && step1Name.trim() !== '');
  const step2Completed = step2Interests.length > 0;
  const step3Completed = step3Vehicles.length > 0;
  const step4Completed = step4Newsletters.length > 0;

  const steps = [
    { number: 1, title: 'Tell us about yourself', completed: step1Completed },
    { number: 2, title: 'Your interests', completed: step2Completed },
    { number: 3, title: 'Your vehicles', completed: step3Completed },
    { number: 4, title: 'Newsletter preferences', completed: step4Completed },
  ];

  const completedCount = steps.filter(step => step.completed).length;
  const totalSteps = steps.length;
  const progressPercentage = (completedCount / totalSteps) * 100;
  const isFullyComplete = completedCount === totalSteps;

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
    if (step3Vehicles.length > 0 && onUpdateStep3) {
      // For backward compatibility, use the first vehicle's data
      const firstVehicle = step3Vehicles[0];
      onUpdateStep3({ vehicleType: firstVehicle.ownership, vehicle: firstVehicle.name });
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
    <div className={`profile-completion-card ${isFullyComplete ? 'profile-completion-card--complete' : ''}`}>
      <div className="profile-completion-card__header">
        <div className="profile-completion-card__title-row">
          <div className="profile-completion-card__icon">
            <Icon name="check_circle" size={24} />
          </div>
          <div className="profile-completion-card__title-content">
            <h3 className="profile-completion-card__title">
              {isFullyComplete 
                ? '✨ Profile Complete!' 
                : `Complete Your Profile (${completedCount} of ${totalSteps})`
              }
            </h3>
            <p className="profile-completion-card__subtitle">
              {isFullyComplete
                ? 'Your profile is all set up! You can edit any information below.'
                : 'Get personalized recommendations and tailored content by completing your profile.'
              }
            </p>
          </div>
          {onDismiss && (
            <button className="profile-completion-card__dismiss" onClick={onDismiss} aria-label="Dismiss">
              <Icon name="close" size={20} />
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
                    <Icon name="check_circle" variant="filled" size={20} style={{ color: '#34A853' }} />
                  ) : (
                    <Icon name="radio_button_unchecked" size={20} style={{ color: '#E6E8EC' }} />
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
                  {step3Vehicles.length > 0 ? (
                    <div className="vehicles-display">
                      <h5 className="vehicles-display__title">Selected Vehicles:</h5>
                      {step3Vehicles.map((vehicle, index) => (
                        <div key={index} className="vehicle-item">
                          <div className="vehicle-item__info">
                            <span className="vehicle-item__name">{vehicle.name}</span>
                            <span className="vehicle-item__ownership">
                              {vehicle.ownership === 'own' ? 'I Own This Car' : 'I Want This Car'}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="no-vehicles">
                      <p>No vehicles selected yet.</p>
                    </div>
                  )}
                </div>
                <button 
                  className="profile-completion-step__save-btn"
                  onClick={handleSaveStep3}
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

