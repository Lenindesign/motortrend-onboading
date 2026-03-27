/**
 * Vehicle Search Component
 * Migrated to inline styles for Tailwind compatibility
 */

import React, { useState, useRef, useEffect, useMemo } from 'react';
import Icon from '../Icon';
import { getVehicles } from '../../api/vehiclesApi';

export interface VehicleSearchProps {
  onVehicleSelect: (vehicle: { name: string; ownership: 'own' | 'want' }) => void;
  placeholder?: string;
  className?: string;
  defaultOwnership?: 'own' | 'want';
  autoFocus?: boolean;
  style?: React.CSSProperties;
  showPopularOnFocus?: boolean;
}

export const VehicleSearch: React.FC<VehicleSearchProps> = ({
  onVehicleSelect,
  placeholder = "Start typing to search...",
  className = "",
  defaultOwnership = 'own',
  autoFocus = false,
  style,
  showPopularOnFocus = false,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredCars, setFilteredCars] = useState<string[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const [isFocused, setIsFocused] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Get all vehicles as name strings
  const vehicleNames = useMemo(() => {
    return getVehicles().map(v => `${v.year} ${v.make} ${v.model}`);
  }, []);

  const popularCars = useMemo(() => {
    if (!showPopularOnFocus) return [];
    const popular = [
      '2026 Toyota Camry', '2026 Honda Civic', '2026 Ford F-150',
      '2026 Chevrolet Silverado', '2025 Tesla Model 3', '2026 Toyota RAV4',
      '2026 Honda CR-V', '2025 BMW 3-Series', '2026 Hyundai Tucson',
      '2026 Mazda CX-5',
    ];
    return popular.filter(name => vehicleNames.includes(name));
  }, [showPopularOnFocus, vehicleNames]);

  // Filter cars based on search query
  useEffect(() => {
    if (searchQuery.length > 0) {
      const queryLower = searchQuery.toLowerCase().trim();
      const queryWords = queryLower.split(/\s+/).filter(word => word.length > 0);
      
      const filtered = vehicleNames.filter(car => {
        const carLower = car.toLowerCase();
        return queryWords.every(word => carLower.includes(word));
      })
      .sort((a, b) => {
        const yearA = parseInt(a.match(/\d{4}/)?.[0] || '0');
        const yearB = parseInt(b.match(/\d{4}/)?.[0] || '0');
        return yearB - yearA;
      })
      .slice(0, 15);
      
      setFilteredCars(filtered);
      setShowDropdown(true);
    } else if (showPopularOnFocus && isFocused) {
      setFilteredCars(popularCars);
      setShowDropdown(true);
    } else {
      setFilteredCars([]);
      setShowDropdown(false);
    }
    setHighlightedIndex(-1);
  }, [searchQuery, vehicleNames, showPopularOnFocus, isFocused, popularCars]);

  // Auto-focus input when component is shown
  useEffect(() => {
    if (autoFocus && inputRef.current) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 0);
    }
  }, [autoFocus]);

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
    setSearchQuery(e.target.value);
  };

  const handleCarSelect = (car: string) => {
    onVehicleSelect({ name: car, ownership: defaultOwnership });
    setSearchQuery('');
    setShowDropdown(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setHighlightedIndex(prev => prev < filteredCars.length - 1 ? prev + 1 : prev);
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

  // Container styles
  const containerStyle: React.CSSProperties = {
    position: 'relative',
    width: '100%',
    ...style,
  };

  // Input container styles
  const inputContainerStyle: React.CSSProperties = {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    width: '100%',
  };

  // Search icon styles
  const searchIconStyle: React.CSSProperties = {
    position: 'absolute',
    left: '16px',
    color: 'var(--color-neutrals-4, #6E7481)',
    zIndex: 1,
  };

  // Input styles
  const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '14px 16px 14px 48px',
    fontFamily: 'var(--font-body, Geist, sans-serif)',
    fontWeight: 400,
    fontSize: '16px',
    lineHeight: '1.5em',
    color: 'var(--color-neutrals-2, #23262F)',
    backgroundColor: 'var(--color-white, #FFFFFF)',
    border: `1px solid ${isFocused ? 'var(--color-primary-1, #E90C17)' : 'var(--color-neutrals-6, #E6E8EC)'}`,
    borderRadius: 'var(--border-radius-md, 8px)',
    outline: 'none',
    boxShadow: isFocused 
      ? 'var(--shadow-depth-5, 0 4px 20px rgba(20, 20, 22, 0.06))' 
      : 'var(--shadow-depth-2, 0 2px 8px rgba(20, 20, 22, 0.04))',
    transition: 'border-color 150ms ease-in-out, box-shadow 150ms ease-in-out',
  };

  // Dropdown styles
  const dropdownStyle: React.CSSProperties = {
    position: 'absolute',
    top: '100%',
    left: 0,
    right: 0,
    marginTop: '4px',
    backgroundColor: 'var(--color-white, #FFFFFF)',
    border: '1px solid var(--color-neutrals-6, #E6E8EC)',
    borderRadius: 'var(--border-radius-md, 8px)',
    boxShadow: 'var(--shadow-depth-5, 0 4px 20px rgba(20, 20, 22, 0.06))',
    zIndex: 1000,
    maxHeight: '240px',
    overflowY: 'auto',
  };

  // Dropdown item styles
  const getDropdownItemStyle = (isHighlighted: boolean, isLast: boolean): React.CSSProperties => ({
    padding: '12px 16px',
    fontFamily: 'var(--font-body, Geist, sans-serif)',
    fontWeight: 400,
    fontSize: '16px',
    lineHeight: '1.5em',
    color: 'var(--color-neutrals-2, #23262F)',
    cursor: 'pointer',
    transition: 'background-color 150ms ease-in-out',
    backgroundColor: isHighlighted ? 'var(--color-neutrals-7, #F4F5F6)' : 'transparent',
    borderBottom: isLast ? 'none' : '1px solid var(--color-neutrals-7, #F4F5F6)',
  });

  return (
    <div className={className} style={containerStyle} ref={searchRef}>
      <div style={inputContainerStyle}>
        <Icon name="search" size={20} style={searchIconStyle} />
        <input
          ref={inputRef}
          type="text"
          value={searchQuery}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={() => {
            setIsFocused(true);
            if (searchQuery.length > 0 || showPopularOnFocus) setShowDropdown(true);
          }}
          onBlur={() => setIsFocused(false)}
          placeholder={placeholder}
          style={inputStyle}
        />
      </div>

      {showDropdown && filteredCars.length > 0 && (
        <div style={dropdownStyle}>
          {showPopularOnFocus && searchQuery.length === 0 && (
            <div style={{
              padding: '10px 16px 6px',
              fontFamily: 'var(--font-body, Geist, sans-serif)',
              fontWeight: 600,
              fontSize: '12px',
              color: 'var(--color-neutrals-4, #6E7481)',
              textTransform: 'uppercase',
              letterSpacing: '1px',
            }}>
              Popular vehicles
            </div>
          )}
          {filteredCars.map((car, index) => (
            <div
              key={car}
              style={getDropdownItemStyle(index === highlightedIndex, index === filteredCars.length - 1)}
              onClick={() => handleCarSelect(car)}
              onMouseEnter={() => setHighlightedIndex(index)}
            >
              {car}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default VehicleSearch;

