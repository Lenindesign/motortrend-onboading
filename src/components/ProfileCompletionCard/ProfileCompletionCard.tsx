import React, { useState, useEffect } from 'react';
import './ProfileCompletionCard.css';
import Icon from '../Icon';
import { VehicleSearch } from '../VehicleSearch';
import VehicleCard from '../VehicleCard';
import { vehicleImageFor } from '../../utils/vehicleImages';
import Button from '../../design-system/components/Button';
import RatingModal from '../RatingModal';

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
  vehicles?: Array<{name: string, ownership: 'own' | 'want', rating?: number}>;
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
  const [step3Vehicles, setStep3Vehicles] = useState<Array<{name: string, ownership: 'own' | 'want', rating?: number}>>([]);
  const [step4Newsletters, setStep4Newsletters] = useState<string[]>([]);

  // Rating modal state
  const [ratingModal, setRatingModal] = useState<{isOpen: boolean, vehicleName: string, currentRating?: number}>({
    isOpen: false,
    vehicleName: '',
    currentRating: 0
  });
  
  // Vehicle search is always visible in Step 3 now

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

  // Vehicle search handlers

  const handleVehicleSelect = (vehicle: { name: string; ownership: 'own' | 'want' }) => {
    setStep3Vehicles([...step3Vehicles, vehicle]);
  };

  // Vehicle search is always visible, no cancel needed

  const handleRemoveVehicle = (vehicleName: string) => {
    setStep3Vehicles(step3Vehicles.filter(vehicle => vehicle.name !== vehicleName));
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

  // Rating handlers
  const handleRateVehicle = (vehicleName: string) => {
    const vehicle = step3Vehicles.find(v => v.name === vehicleName);
    setRatingModal({
      isOpen: true,
      vehicleName,
      currentRating: vehicle?.rating || 0
    });
  };

  const handleRatingSubmit = (rating: number) => {
    const updatedVehicles = step3Vehicles.map(v => 
      v.name === ratingModal.vehicleName ? { ...v, rating } : v
    );
    setStep3Vehicles(updatedVehicles);
    setRatingModal({ isOpen: false, vehicleName: '', currentRating: 0 });
  };

  const handleRatingModalClose = () => {
    setRatingModal({ isOpen: false, vehicleName: '', currentRating: 0 });
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
              <Button 
                color="neutrals3" 
                variant="solid" 
                size="default"
                onClick={() => handleToggleStep(step.number)}
              >
                {expandedStep === step.number ? 'Cancel' : (step.completed ? 'Edit' : 'Complete →')}
              </Button>
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
                  {/* Vehicle Search - always visible */}
                  <div className="profile-completion-step__vehicle-search">
                    <div className="profile-completion-step__search-header">
                      <h5>Search for a vehicle</h5>
                    </div>
                    <VehicleSearch
                      onVehicleSelect={handleVehicleSelect}
                      placeholder="Start typing to search..."
                      className="profile-completion-step__search-input"
                    />
                  </div>

                  {/* Selected Vehicles */}
                  {step3Vehicles.length > 0 ? (
                    <div className="vehicles-display">
                      <h5 className="vehicles-display__title">Selected Vehicles:</h5>
                      <div className="profile-vehicles-grid">
                        {step3Vehicles.map((vehicle, index) => (
                          <VehicleCard
                            key={index}
                            image={vehicleImageFor(vehicle.name)}
                            name={vehicle.name}
                            type="Vehicle"
                            rating1={9.1}
                            rating2={8.5}
                            hasMultipleRatings={true}
                            isBookmarked={true}
                            onBookmark={() => handleRemoveVehicle(vehicle.name)}
                            ownership={vehicle.ownership}
                            onOwnershipChange={(value) => {
                              const updatedVehicles = step3Vehicles.map(v => 
                                v.name === vehicle.name ? { ...v, ownership: value } : v
                              );
                              setStep3Vehicles(updatedVehicles);
                            }}
                            onViewDetails={() => console.log('View vehicle details:', vehicle.name)}
                            onRate={() => handleRateVehicle(vehicle.name)}
                            userRating={vehicle.rating}
                          />
                        ))}
                      </div>
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

      {/* Rating Modal */}
      <RatingModal
        isOpen={ratingModal.isOpen}
        onClose={handleRatingModalClose}
        onRate={handleRatingSubmit}
        vehicleName={ratingModal.vehicleName}
        currentRating={ratingModal.currentRating}
      />
    </div>
  );
};

