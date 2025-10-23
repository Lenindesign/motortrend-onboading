/**
 * Onboarding Step 3: Tell Us About Your Ride
 * Based on Figma Community design system with autocomplete car search
 */

import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
const step3Illustration = 'https://d2kde5ohu8qb21.cloudfront.net/files/68f56010a481f700027e1853/group1318348095.svg';
import './OnboardingStep3.css';
import Icon from '../../components/Icon';
import VehicleCard from '../../components/VehicleCard';
import { vehicleImageFor } from '../../utils/vehicleImages';
import { VehicleSearch } from '../../components/VehicleSearch';
import RatingModal from '../../components/RatingModal';

// Vehicle list handled by VehicleSearch

export interface OnboardingStep3Props {
  onNext?: (data: { vehicleType: 'own' | 'want'; vehicle: string }) => void;
  onPrevious?: () => void;
  onSkip?: () => void;
  initialData?: {
    vehicleType?: 'own' | 'want';
    vehicle?: string;
  };
}

export const OnboardingStep3: React.FC<OnboardingStep3Props> = () => {
  const navigate = useNavigate();
  // Search input handled within VehicleSearch
  const [selectedCars, setSelectedCars] = useState<Array<{name: string, ownership: 'own' | 'want', rating?: number}>>([]);
  const [showAddAnother, setShowAddAnother] = useState(false);
  const [ratingModal, setRatingModal] = useState<{isOpen: boolean, vehicleName: string, currentRating?: number}>({
    isOpen: false,
    vehicleName: '',
    currentRating: 0
  });
  const inputRef = useRef<HTMLInputElement>(null);

  // VehicleSearch handles filtering and dropdown behavior

  // Input handlers are managed inside VehicleSearch; keep only local state updates elsewhere

  const handleCarSelect = (car: string) => {
    if (!selectedCars.some(selectedCar => selectedCar.name === car)) {
      setSelectedCars([...selectedCars, { name: car, ownership: 'own' }]);
    }
    // Dropdown managed by VehicleSearch
    setShowAddAnother(true);
  };

  const handleRemoveCar = (carToRemove: string) => {
    const updatedCars = selectedCars.filter(car => car.name !== carToRemove);
    setSelectedCars(updatedCars);
    if (updatedCars.length === 0) {
      setShowAddAnother(false);
    }
  };

  const handleOwnershipChange = (carName: string, ownership: 'own' | 'want') => {
    setSelectedCars(selectedCars.map(car => 
      car.name === carName ? { ...car, ownership } : car
    ));
  };

  const handleAddAnother = () => {
    setShowAddAnother(false);
    inputRef.current?.focus();
  };

  const handleRateVehicle = (vehicleName: string) => {
    const vehicle = selectedCars.find(car => car.name === vehicleName);
    setRatingModal({
      isOpen: true,
      vehicleName,
      currentRating: vehicle?.rating || 0
    });
  };

  const handleRatingSubmit = (rating: number) => {
    setSelectedCars(selectedCars.map(car => 
      car.name === ratingModal.vehicleName ? { ...car, rating } : car
    ));
    setRatingModal({ isOpen: false, vehicleName: '', currentRating: 0 });
  };

  const handleRatingModalClose = () => {
    setRatingModal({ isOpen: false, vehicleName: '', currentRating: 0 });
  };

  // Keyboard navigation handled by VehicleSearch as well

  const handleNext = () => {
    if (selectedCars.length > 0) {
      console.log('Step 3 data:', { vehicles: selectedCars });
      // Store data in localStorage
      const existingData = JSON.parse(localStorage.getItem('onboardingData') || '{}');
      localStorage.setItem('onboardingData', JSON.stringify({ 
        ...existingData, 
        vehicles: selectedCars 
      }));
      navigate('/onboarding/step4');
    }
  };

  const handlePrevious = () => {
    navigate('/onboarding/step2');
  };

  const handleSkip = () => {
    navigate('/onboarding/step4');
  };

  const isNextDisabled = selectedCars.length === 0;

  return (
    <div className="onboarding-step">
      <div className="onboarding-card">
        {/* Header with Progress */}
        <div className="onboarding-card__header">
          {/* Progress Illustration */}
          <div className="onboarding-card__illustration">
            <img 
              src={step3Illustration} 
              alt="Step 3 Progress" 
              className="onboarding-card__progress-image"
            />
          </div>
          
          {/* Step Indicator */}
          <div className="onboarding-card__step-indicator">
            <span className="onboarding-card__step-text">STEP 3/4</span>
          </div>
        </div>

        {/* Title and Subtitle */}
        <div className="onboarding-card__content">
          <h1 className="onboarding-card__title">Tell Us About Your Ride</h1>
          <p className="onboarding-card__subtitle">Choose what you drive now and what you’d like next</p>

          {/* Vehicle Search Section */}
          <div className="vehicle-search-section">
            {/* Only show "Search for a vehicle" label when no vehicles are selected */}
            {selectedCars.length === 0 && (
              <div className="vehicle-search__header">
                <label className="vehicle-search__label">Search for a vehicle</label>
              </div>
            )}

            {/* Selected Cars Display using shared VehicleCard */}
            {selectedCars.length > 0 && (
              <div className="profile-vehicles-grid">
                {selectedCars.map((car, index) => (
                  <VehicleCard
                    key={index}
                    image={vehicleImageFor(car.name)}
                    name={car.name}
                    type="Vehicle"
                    rating1={9.1}
                    rating2={8.5}
                    hasMultipleRatings={true}
                    isBookmarked={true}
                    onBookmark={() => handleRemoveCar(car.name)}
                    ownership={car.ownership}
                    onOwnershipChange={(value) => handleOwnershipChange(car.name, value)}
                    onViewDetails={() => console.log('View vehicle details:', car.name)}
                    onRate={() => handleRateVehicle(car.name)}
                    userRating={car.rating}
                  />
                ))}
              </div>
            )}

            {/* Add Another Vehicle Section */}
            {selectedCars.length > 0 && (
              <div className="add-another-section">
                <h3 className="add-another-title">Add Another Vehicle</h3>
                
                {!showAddAnother ? (
                  <button
                    type="button"
                    className="add-another-vehicle-btn"
                    onClick={handleAddAnother}
                  >
                    <Icon name="add" size={20} />
                    <span>Add Another Vehicle</span>
                  </button>
                ) : (
                  <VehicleSearch
                    onVehicleSelect={(vehicle) => handleCarSelect(vehicle.name)}
                    placeholder="Select another Vehicle"
                  />
                )}

                <button
                  type="button"
                  className="no-vehicle-link"
                  onClick={() => navigate('/onboarding/step4')}
                >
                  I don't currently own a vehicle
                </button>
              </div>
            )}

            {/* Initial Search Input */}
            {selectedCars.length === 0 && (
              <VehicleSearch
                onVehicleSelect={(vehicle) => handleCarSelect(vehicle.name)}
                placeholder="Start typing to search..."
              />
            )}
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

            <div className="onboarding-card__skip-section">
              <button
                className="onboarding-skip-btn"
                onClick={handleSkip}
                type="button"
              >
                Skip this step
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

export default OnboardingStep3;