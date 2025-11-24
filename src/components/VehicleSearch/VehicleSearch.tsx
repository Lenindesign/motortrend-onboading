/**
 * Vehicle Search Component
 * Reusable car search with autocomplete functionality
 */

import React, { useState, useRef, useEffect, useMemo } from 'react';
import Icon from '../Icon';
import { getVehicles } from '../../api/vehiclesApi';
import './VehicleSearch.css';

export interface VehicleSearchProps {
  onVehicleSelect: (vehicle: { name: string; ownership: 'own' | 'want' }) => void;
  placeholder?: string;
  className?: string;
  defaultOwnership?: 'own' | 'want';
  autoFocus?: boolean;
}

export const VehicleSearch: React.FC<VehicleSearchProps> = ({
  onVehicleSelect,
  placeholder = "Start typing to search...",
  className = "",
  defaultOwnership = 'own',
  autoFocus = false
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredCars, setFilteredCars] = useState<string[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Get all vehicles as name strings
  const vehicleNames = useMemo(() => {
    return getVehicles().map(v => `${v.year} ${v.make} ${v.model}`);
  }, []);

  // Filter cars based on search query
  useEffect(() => {
    if (searchQuery.length > 0) {
      const queryLower = searchQuery.toLowerCase().trim();
      const queryWords = queryLower.split(/\s+/).filter(word => word.length > 0);
      
      const filtered = vehicleNames.filter(car => {
        const carLower = car.toLowerCase();
        // Check if all words in the query appear in the vehicle name (order-independent)
        return queryWords.every(word => carLower.includes(word));
      })
      .sort((a, b) => {
        // Extract year from vehicle name (e.g., "2025 Subaru WRX" -> 2025)
        const yearA = parseInt(a.match(/\d{4}/)?.[0] || '0');
        const yearB = parseInt(b.match(/\d{4}/)?.[0] || '0');
        // Sort by year descending (newest first)
        return yearB - yearA;
      })
      .slice(0, 15); // Limit to 15 results
      
      setFilteredCars(filtered);
      setShowDropdown(true);
    } else {
      setFilteredCars([]);
      setShowDropdown(false);
    }
    setHighlightedIndex(-1);
  }, [searchQuery, vehicleNames]);

  // Auto-focus input when component is shown
  useEffect(() => {
    if (autoFocus && inputRef.current) {
      // Small delay to ensure DOM is ready
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
    const value = e.target.value;
    setSearchQuery(value);
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

  return (
    <div className={`vehicle-search ${className}`} ref={searchRef}>
      <div className="vehicle-search__input-container">
        <Icon name="search" size={20} className="vehicle-search__search-icon" />
        <input
          ref={inputRef}
          type="text"
          value={searchQuery}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={() => searchQuery.length > 0 && setShowDropdown(true)}
          placeholder={placeholder}
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
  );
};

export default VehicleSearch;

