/**
 * Location Autocomplete Component
 * Migrated to inline styles for Tailwind compatibility
 */

import React, { useRef, useEffect, useState } from 'react';
import { useLocationAutocomplete, type LocationSuggestion } from '../../hooks/useLocationAutocomplete';
import Icon from '../Icon';

interface LocationAutocompleteProps {
  value: string;
  onChange: (value: string) => void;
  onDetectLocation?: () => void;
  isDetectingLocation?: boolean;
  placeholder?: string;
  label?: string;
  required?: boolean;
  className?: string;
}

export const LocationAutocomplete: React.FC<LocationAutocompleteProps> = ({
  value,
  onChange,
  onDetectLocation,
  isDetectingLocation = false,
  placeholder = "Current Location",
  label = "Where are you located? (Optional)",
  required = false,
  className = '',
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
  const [isFocused, setIsFocused] = useState(false);
  const [isLocationBtnHovered, setIsLocationBtnHovered] = useState(false);

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

  // Container styles
  const containerStyle: React.CSSProperties = {
    position: 'relative',
    width: '100%',
  };

  // Field container styles
  const fieldContainerStyle: React.CSSProperties = {
    position: 'relative',
    width: '100%',
  };

  // Text field styles
  const textFieldStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    width: '100%',
  };

  // Label styles
  const labelStyle: React.CSSProperties = {
    fontFamily: 'var(--font-body, Geist, sans-serif)',
    fontWeight: 500,
    fontSize: '14px',
    lineHeight: '1.5em',
    color: 'var(--color-neutrals-4, #6E7481)',
  };

  // Required asterisk styles
  const requiredStyle: React.CSSProperties = {
    color: 'var(--color-primary-1, #E90C17)',
    marginLeft: '4px',
  };

  // Input container styles
  const inputContainerStyle: React.CSSProperties = {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
  };

  // Input styles
  const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '12px 16px',
    paddingRight: onDetectLocation ? '56px' : '16px',
    fontFamily: 'var(--font-body, Geist, sans-serif)',
    fontWeight: 400,
    fontSize: '16px',
    lineHeight: '1.5em',
    color: 'var(--color-neutrals-1, #141416)',
    backgroundColor: 'var(--color-white, #FFFFFF)',
    border: `1px solid ${isFocused ? 'var(--color-primary-1, #E90C17)' : 'var(--color-neutrals-6, #E6E8EC)'}`,
    borderRadius: 'var(--border-radius-md, 8px)',
    outline: 'none',
    transition: 'border-color 150ms ease-in-out, box-shadow 150ms ease-in-out',
    boxShadow: isFocused ? '0 0 0 3px rgba(233, 12, 23, 0.15)' : 'none',
  };

  // Location button styles
  const locationBtnStyle: React.CSSProperties = {
    position: 'absolute',
    top: '50%',
    right: '12px',
    transform: 'translateY(-50%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '28px',
    height: '28px',
    background: isLocationBtnHovered && !isDetectingLocation 
      ? 'var(--color-neutrals-6, #E6E8EC)' 
      : 'var(--color-neutrals-7, #F4F5F6)',
    border: '1px solid var(--color-neutrals-6, #E6E8EC)',
    color: isLocationBtnHovered && !isDetectingLocation 
      ? 'var(--color-primary-1, #E90C17)' 
      : 'var(--color-neutrals-4, #6E7481)',
    cursor: isDetectingLocation ? 'not-allowed' : 'pointer',
    zIndex: 2,
    borderRadius: '100px',
    boxShadow: 'var(--shadow-depth-1, 0 1px 2px rgba(20, 20, 22, 0.02))',
    opacity: isDetectingLocation ? 0.7 : 1,
  };

  // Suggestions dropdown styles
  const suggestionsStyle: React.CSSProperties = {
    position: 'absolute',
    top: '100%',
    left: 0,
    right: 0,
    marginTop: '4px',
    backgroundColor: 'var(--color-neutrals-1, #141416)',
    border: '1px solid var(--color-neutrals-6, #E6E8EC)',
    borderRadius: 'var(--border-radius-lg, 16px)',
    boxShadow: 'var(--shadow-dropdown, 0 4px 20px rgba(20, 20, 22, 0.1))',
    zIndex: 1000,
    maxHeight: '192px',
    overflowY: 'auto',
  };

  // Suggestion item styles
  const getSuggestionItemStyle = (isSelected: boolean, isLast: boolean): React.CSSProperties => ({
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    padding: '8px 24px',
    fontFamily: 'var(--font-body, Geist, sans-serif)',
    fontWeight: 400,
    fontSize: '16px',
    lineHeight: 1.5,
    color: 'var(--color-neutrals-2, #23262F)',
    cursor: 'pointer',
    transition: 'background-color 150ms ease-in-out',
    borderBottom: isLast ? 'none' : '1px solid var(--color-neutrals-6, #E6E8EC)',
    backgroundColor: isSelected ? 'var(--color-neutrals-3, #353945)' : 'transparent',
  });

  // Suggestion content styles
  const suggestionContentStyle: React.CSSProperties = {
    flex: 1,
    minWidth: 0,
  };

  // Suggestion name styles
  const getSuggestionNameStyle = (isSelected: boolean): React.CSSProperties => ({
    fontFamily: 'var(--font-body, Geist, sans-serif)',
    fontWeight: 500,
    fontSize: '16px',
    lineHeight: 1.5,
    color: isSelected ? 'var(--color-neutrals-8, #FCFCFD)' : 'var(--color-neutrals-2, #23262F)',
    marginBottom: '2px',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  });

  // Suggestion details styles
  const getSuggestionDetailsStyle = (isSelected: boolean): React.CSSProperties => ({
    fontFamily: 'var(--font-body, Geist, sans-serif)',
    fontWeight: 400,
    fontSize: '14px',
    lineHeight: 1.4,
    color: isSelected ? 'var(--color-neutrals-8, #FCFCFD)' : 'var(--color-neutrals-4, #6E7481)',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  });

  // Icon styles
  const getIconStyle = (isSelected: boolean): React.CSSProperties => ({
    flexShrink: 0,
    color: isSelected ? 'var(--color-neutrals-8, #FCFCFD)' : 'var(--color-primary-1, #E90C17)',
  });

  return (
    <div className={className} style={containerStyle} ref={containerRef}>
      <div style={fieldContainerStyle}>
        <div style={textFieldStyle}>
          {label && (
            <label style={labelStyle}>
              {label}
              {required && <span style={requiredStyle}>*</span>}
            </label>
          )}
          <div style={inputContainerStyle}>
            <input
              ref={inputRef}
              type="text"
              style={inputStyle}
              placeholder={placeholder}
              value={value}
              onChange={handleInputChangeInternal}
              onKeyDown={handleKeyDownInternal}
              onFocus={() => {
                setIsFocused(true);
                if (suggestions.length > 0) {
                  setIsOpen(true);
                }
              }}
              onBlur={() => setIsFocused(false)}
              autoComplete="off"
            />
            {onDetectLocation && (
              <button
                type="button"
                style={locationBtnStyle}
                onClick={onDetectLocation}
                onMouseEnter={() => setIsLocationBtnHovered(true)}
                onMouseLeave={() => setIsLocationBtnHovered(false)}
                disabled={isDetectingLocation}
                title={isDetectingLocation ? 'Detecting location...' : 'Auto-detect location'}
              >
                <Icon 
                  name={isDetectingLocation ? "refresh" : "my_location"} 
                  size={20}
                />
              </button>
            )}
          </div>
        </div>

        {isOpen && (suggestions.length > 0 || isLoading) && (
          <div style={suggestionsStyle}>
            {isLoading ? (
              <div style={{ ...getSuggestionItemStyle(false, true), justifyContent: 'center', gap: '8px', color: '#6b7280' }}>
                <Icon name="refresh" size={16} />
                <span>Searching locations...</span>
              </div>
            ) : (
              suggestions.map((suggestion, index) => {
                const isSelected = index === selectedIndex;
                const isLast = index === suggestions.length - 1;
                return (
                  <div
                    key={suggestion.id}
                    style={getSuggestionItemStyle(isSelected, isLast)}
                    onClick={() => handleSuggestionClick(suggestion)}
                    onMouseEnter={() => setSelectedIndex(index)}
                  >
                    <Icon name="location_on" size={16} style={getIconStyle(isSelected)} />
                    <div style={suggestionContentStyle}>
                      <div style={getSuggestionNameStyle(isSelected)}>{suggestion.name}</div>
                      <div style={getSuggestionDetailsStyle(isSelected)}>
                        {suggestion.state && `${suggestion.state}, `}{suggestion.country}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default LocationAutocomplete;
