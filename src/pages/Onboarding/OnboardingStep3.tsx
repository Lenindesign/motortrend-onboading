/**
 * Onboarding Step 3: Tell Us About Your Ride
 * Based on Figma Community design system with autocomplete car search
 */

import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import step3Illustration from '../../assets/images/step3-illustration.png';
import './OnboardingStep3.css';
import Icon from '../../components/Icon';

// Car database for autocomplete
const carDatabase = [
  '2015 Subaru WRX',
  '2021 Subaru WRX',
  '2018 Subaru WRX',
  '2017 Subaru WRX',
  '2024 Subaru WRX',
  '2022 Subaru WRX',
  '2020 Honda Civic',
  '2021 Honda Civic',
  '2022 Honda Civic',
  '2023 Honda Civic',
  '2024 Honda Civic',
  '2019 Toyota Camry',
  '2020 Toyota Camry',
  '2021 Toyota Camry',
  '2022 Toyota Camry',
  '2023 Toyota Camry',
  '2024 Toyota Camry',
  '2020 Ford Mustang',
  '2021 Ford Mustang',
  '2022 Ford Mustang',
  '2023 Ford Mustang',
  '2024 Ford Mustang',
  '2021 Tesla Model 3',
  '2022 Tesla Model 3',
  '2023 Tesla Model 3',
  '2024 Tesla Model 3',
  '2020 BMW 3 Series',
  '2021 BMW 3 Series',
  '2022 BMW 3 Series',
  '2023 BMW 3 Series',
  '2024 BMW 3 Series',
  '2019 Audi A4',
  '2020 Audi A4',
  '2021 Audi A4',
  '2022 Audi A4',
  '2023 Audi A4',
  '2024 Audi A4',
  '2020 Mercedes C-Class',
  '2021 Mercedes C-Class',
  '2022 Mercedes C-Class',
  '2023 Mercedes C-Class',
  '2024 Mercedes C-Class',
  '2021 Nissan Altima',
  '2022 Nissan Altima',
  '2023 Nissan Altima',
  '2024 Nissan Altima',
  '2020 Chevrolet Camaro',
  '2021 Chevrolet Camaro',
  '2022 Chevrolet Camaro',
  '2023 Chevrolet Camaro',
  '2024 Chevrolet Camaro',
  '2021 Dodge Challenger',
  '2022 Dodge Challenger',
  '2023 Dodge Challenger',
  '2024 Dodge Challenger',
  '2020 Lexus IS',
  '2021 Lexus IS',
  '2022 Lexus IS',
  '2023 Lexus IS',
  '2024 Lexus IS',
  '2021 Infiniti Q50',
  '2022 Infiniti Q50',
  '2023 Infiniti Q50',
  '2024 Infiniti Q50',
  '2020 Acura TLX',
  '2021 Acura TLX',
  '2022 Acura TLX',
  '2023 Acura TLX',
  '2024 Acura TLX',
  '2021 Genesis G70',
  '2022 Genesis G70',
  '2023 Genesis G70',
  '2024 Genesis G70',
  '2020 Volvo S60',
  '2021 Volvo S60',
  '2022 Volvo S60',
  '2023 Volvo S60',
  '2024 Volvo S60',
  '2021 Cadillac CT4',
  '2022 Cadillac CT4',
  '2023 Cadillac CT4',
  '2024 Cadillac CT4',
  '2020 Jaguar XE',
  '2021 Jaguar XE',
  '2022 Jaguar XE',
  '2023 Jaguar XE',
  '2024 Jaguar XE',
  '2021 Alfa Romeo Giulia',
  '2022 Alfa Romeo Giulia',
  '2023 Alfa Romeo Giulia',
  '2024 Alfa Romeo Giulia',
  '2020 Kia Stinger',
  '2021 Kia Stinger',
  '2022 Kia Stinger',
  '2023 Kia Stinger',
  '2024 Kia Stinger',
  '2021 Hyundai Sonata',
  '2022 Hyundai Sonata',
  '2023 Hyundai Sonata',
  '2024 Hyundai Sonata',
  '2020 Mazda6',
  '2021 Mazda6',
  '2022 Mazda6',
  '2023 Mazda6',
  '2024 Mazda6',
  '2020 Subaru Legacy',
  '2021 Subaru Legacy',
  '2022 Subaru Legacy',
  '2023 Subaru Legacy',
  '2024 Subaru Legacy',
  '2020 Subaru Impreza',
  '2021 Subaru Impreza',
  '2022 Subaru Impreza',
  '2023 Subaru Impreza',
  '2024 Subaru Impreza',
  '2020 Subaru Outback',
  '2021 Subaru Outback',
  '2022 Subaru Outback',
  '2023 Subaru Outback',
  '2024 Subaru Outback',
  '2020 Subaru Forester',
  '2021 Subaru Forester',
  '2022 Subaru Forester',
  '2023 Subaru Forester',
  '2024 Subaru Forester',
  '2020 Subaru Ascent',
  '2021 Subaru Ascent',
  '2022 Subaru Ascent',
  '2023 Subaru Ascent',
  '2024 Subaru Ascent',
  '2020 Subaru Crosstrek',
  '2021 Subaru Crosstrek',
  '2022 Subaru Crosstrek',
  '2023 Subaru Crosstrek',
  '2024 Subaru Crosstrek',
  '2020 Subaru BRZ',
  '2021 Subaru BRZ',
  '2022 Subaru BRZ',
  '2023 Subaru BRZ',
  '2024 Subaru BRZ',
  '2020 Subaru WRX STI',
  '2021 Subaru WRX STI',
  '2022 Subaru WRX STI',
  '2023 Subaru WRX STI',
  '2024 Subaru WRX STI'
];

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
  const [vehicleType, setVehicleType] = useState<'own' | 'want'>('own');
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredCars, setFilteredCars] = useState<string[]>([]);
  const [selectedCars, setSelectedCars] = useState<string[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const [showAddAnother, setShowAddAnother] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Filter cars based on search query
  useEffect(() => {
    if (searchQuery.length > 0) {
      const filtered = carDatabase.filter(car =>
        car.toLowerCase().includes(searchQuery.toLowerCase())
      ).slice(0, 6); // Limit to 6 results
      setFilteredCars(filtered);
      setShowDropdown(true);
    } else {
      setFilteredCars([]);
      setShowDropdown(false);
    }
    setHighlightedIndex(-1);
  }, [searchQuery]);

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
  };

  const handleCarSelect = (car: string) => {
    if (!selectedCars.includes(car)) {
      setSelectedCars([...selectedCars, car]);
    }
    setSearchQuery('');
    setShowDropdown(false);
    setShowAddAnother(true);
  };

  const handleRemoveCar = (carToRemove: string) => {
    const updatedCars = selectedCars.filter(car => car !== carToRemove);
    setSelectedCars(updatedCars);
    if (updatedCars.length === 0) {
      setShowAddAnother(false);
    }
  };

  const handleAddAnother = () => {
    setSearchQuery('');
    setShowAddAnother(false);
    inputRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showDropdown) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setHighlightedIndex(prev => 
          prev < filteredCars.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setHighlightedIndex(prev => prev > 0 ? prev - 1 : -1);
        break;
      case 'Enter':
        e.preventDefault();
        if (highlightedIndex >= 0 && filteredCars[highlightedIndex]) {
          handleCarSelect(filteredCars[highlightedIndex]);
        }
        break;
      case 'Escape':
        setShowDropdown(false);
        setHighlightedIndex(-1);
        break;
    }
  };

  const handleNext = () => {
    if (selectedCars.length > 0) {
      console.log('Step 3 data:', { vehicleType, vehicles: selectedCars });
      // Store data in localStorage
      const existingData = JSON.parse(localStorage.getItem('onboardingData') || '{}');
      localStorage.setItem('onboardingData', JSON.stringify({ 
        ...existingData, 
        vehicleType, 
        vehicles: selectedCars 
      }));
      navigate('/onboarding/step4');
    }
  };

  const handlePrevious = () => {
    navigate('/onboarding/step2');
  };

  const handleSkip = () => {
    navigate('/profile');
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
          <p className="onboarding-card__subtitle">The Cars you Drive and Want</p>

          {/* Vehicle Search Section */}
          <div className="vehicle-search-section">
            <div className="vehicle-search__header">
              <label className="vehicle-search__label">Search for a vehicle</label>
              
              {/* Radio Buttons */}
              <div className="vehicle-search__radio-group">
                <label className="vehicle-search__radio-label">
                  <input
                    type="radio"
                    name="vehicleType"
                    value="own"
                    checked={vehicleType === 'own'}
                    onChange={(e) => setVehicleType(e.target.value as 'own' | 'want')}
                    className="vehicle-search__radio-input"
                  />
                  <span className="vehicle-search__radio-custom"></span>
                  <span className="vehicle-search__radio-text">I Own This Car</span>
                </label>
                
                <label className="vehicle-search__radio-label">
                  <input
                    type="radio"
                    name="vehicleType"
                    value="want"
                    checked={vehicleType === 'want'}
                    onChange={(e) => setVehicleType(e.target.value as 'own' | 'want')}
                    className="vehicle-search__radio-input"
                  />
                  <span className="vehicle-search__radio-custom"></span>
                  <span className="vehicle-search__radio-text">I Want This Car</span>
                </label>
              </div>
            </div>

            {/* Selected Cars Display */}
            {selectedCars.length > 0 && (
              <div className="selected-cars">
                {selectedCars.map((car, index) => (
                  <div key={index} className="selected-car-item">
                    <span className="selected-car-name">{car}</span>
                    <button
                      type="button"
                      className="selected-car-remove"
                      onClick={() => handleRemoveCar(car)}
                      aria-label={`Remove ${car}`}
                    >
                      <Icon name="close" size={16} />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Search Input with Autocomplete */}
            {(!showAddAnother || selectedCars.length === 0) && (
              <div className="vehicle-search__input-container" ref={searchRef}>
                <div className="vehicle-search__input-wrapper">
                  <Icon name="search" size={20} className="vehicle-search__search-icon" />
                  <input
                    ref={inputRef}
                    type="text"
                    value={searchQuery}
                    onChange={handleInputChange}
                    onKeyDown={handleKeyDown}
                    onFocus={() => searchQuery.length > 0 && setShowDropdown(true)}
                    placeholder="Start typing to search..."
                    className="vehicle-search__input"
                  />
                </div>

                {/* Autocomplete Dropdown */}
                {showDropdown && filteredCars.length > 0 && (
                  <div className="vehicle-search__dropdown">
                    {filteredCars.map((car, index) => (
                      <div
                        key={car}
                        className={`vehicle-search__dropdown-item ${
                          index === highlightedIndex ? 'vehicle-search__dropdown-item--highlighted' : ''
                        }`}
                        onClick={() => handleCarSelect(car)}
                        onMouseEnter={() => setHighlightedIndex(index)}
                      >
                        {car}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Add Another Vehicle Button */}
            {showAddAnother && selectedCars.length > 0 && (
              <button
                type="button"
                className="add-another-vehicle-btn"
                onClick={handleAddAnother}
              >
                <Icon name="add" size={20} />
                <span>Add Another Vehicle</span>
              </button>
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

export default OnboardingStep3;