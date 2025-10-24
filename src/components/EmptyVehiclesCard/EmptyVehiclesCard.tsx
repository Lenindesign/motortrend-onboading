/**
 * Empty Vehicles Card Component
 * Displays when users have no vehicles in their saved items
 * Based on Figma Community design system
 */

import React from 'react';
import { VehicleSearch } from '../VehicleSearch';
import './EmptyVehiclesCard.css';

export interface EmptyVehiclesCardProps {
  onVehicleSelect?: (vehicle: { name: string; ownership: 'own' | 'want' }) => void;
}

export const EmptyVehiclesCard: React.FC<EmptyVehiclesCardProps> = ({
  onVehicleSelect
}) => {
  return (
    <div className="empty-vehicles-card">
      <div className="empty-vehicles-card__content">
        {/* Icon */}
        <div className="empty-vehicles-card__icon">
          <img 
            src="https://d2kde5ohu8qb21.cloudfront.net/files/68f64af5e852a20002f9bc06/more.svg"
            alt="Vehicles"
            className="empty-vehicles-card__icon-img"
          />
        </div>
        
        {/* Title */}
        <h3 className="empty-vehicles-card__title">
          No vehicles saved yet
        </h3>
        
        {/* Description */}
        <p className="empty-vehicles-card__description">
          Start building your collection by saving vehicles you're interested in or own.
        </p>
        
        {/* Search Input */}
        {onVehicleSelect && (
          <VehicleSearch
            onVehicleSelect={onVehicleSelect}
            placeholder="Search for a vehicle..."
            className="empty-vehicles-card__search"
          />
        )}
      </div>
    </div>
  );
};

export default EmptyVehiclesCard;
