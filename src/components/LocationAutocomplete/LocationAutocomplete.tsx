import React, { useRef, useEffect } from 'react';
import { useLocationAutocomplete, type LocationSuggestion } from '../../hooks/useLocationAutocomplete';
import Icon from '../Icon';
import './LocationAutocomplete.css';

interface LocationAutocompleteProps {
  value: string;
  onChange: (value: string) => void;
  onDetectLocation?: () => void;
  isDetectingLocation?: boolean;
  placeholder?: string;
  label?: string;
  required?: boolean;
}

export const LocationAutocomplete: React.FC<LocationAutocompleteProps> = ({
  value,
  onChange,
  onDetectLocation,
  isDetectingLocation = false,
  placeholder = "Current Location",
  label = "Where are you located? (Optional)",
  required = false
}) => {
  const {
    query,
    suggestions,
    isLoading,
    isOpen,
    selectedIndex,
    handleInputChange,
    handleSuggestionSelect,
    handleKeyDown,
    closeSuggestions,
    setQuery,
    setIsOpen,
    setSelectedIndex
  } = useLocationAutocomplete();

  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Sync external value with internal query
  useEffect(() => {
    if (value !== query) {
      setQuery(value);
    }
  }, [value, query, setQuery]);

  // Handle input changes
  const handleInputChangeInternal = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    handleInputChange(newValue);
    onChange(newValue);
  };

  // Handle suggestion selection
  const handleSuggestionClick = (suggestion: LocationSuggestion) => {
    handleSuggestionSelect(suggestion);
    onChange(suggestion.displayName);
  };

  // Handle keyboard navigation
  const handleKeyDownInternal = (e: React.KeyboardEvent<HTMLInputElement>) => {
    handleKeyDown(e);
  };

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        closeSuggestions();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [closeSuggestions]);

  return (
    <div className="location-autocomplete" ref={containerRef}>
      <div className="location-field-container">
        <div className="text-field">
          {label && (
            <label className="text-field__label">
              {label}
              {required && <span className="text-field__required">*</span>}
            </label>
          )}
          <div className="text-field__input-container">
            <input
              ref={inputRef}
              type="text"
              className="text-field__input"
              placeholder={placeholder}
              value={value}
              onChange={handleInputChangeInternal}
              onKeyDown={handleKeyDownInternal}
              onFocus={() => {
                if (suggestions.length > 0) {
                  setIsOpen(true);
                }
              }}
              autoComplete="off"
            />
            {onDetectLocation && (
              <button
                type="button"
                className="location-icon-btn"
                onClick={onDetectLocation}
                disabled={isDetectingLocation}
                title={isDetectingLocation ? 'Detecting location...' : 'Auto-detect location'}
              >
                <Icon 
                  name={isDetectingLocation ? "refresh" : "my_location"} 
                  size={20} 
                  className={isDetectingLocation ? "spinning" : ""}
                />
              </button>
            )}
          </div>
        </div>

        {/* Suggestions Dropdown */}
        {isOpen && (suggestions.length > 0 || isLoading) && (
          <div className="location-suggestions">
            {isLoading ? (
              <div className="location-suggestion-item location-suggestion-item--loading">
                <Icon name="refresh" size={16} className="spinning" />
                <span>Searching locations...</span>
              </div>
            ) : (
              suggestions.map((suggestion, index) => (
                <div
                  key={suggestion.id}
                  className={`location-suggestion-item ${
                    index === selectedIndex ? 'location-suggestion-item--selected' : ''
                  }`}
                  onClick={() => handleSuggestionClick(suggestion)}
                  onMouseEnter={() => setSelectedIndex(index)}
                >
                  <Icon name="location_on" size={16} />
                  <div className="location-suggestion-content">
                    <div className="location-suggestion-name">{suggestion.name}</div>
                    <div className="location-suggestion-details">
                      {suggestion.state && `${suggestion.state}, `}{suggestion.country}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default LocationAutocomplete;
