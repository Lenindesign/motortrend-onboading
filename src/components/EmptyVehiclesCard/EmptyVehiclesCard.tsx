/**
 * Empty Vehicles Card Component
 * Displays when users have no vehicles in their saved items
 * Based on Figma Community design system
 */

import React from 'react';
import Icon from '../Icon';
import { Button } from '../../design-system/components';
import './EmptyVehiclesCard.css';

export interface EmptyVehiclesCardProps {
  onAddVehicle?: () => void;
}

export const EmptyVehiclesCard: React.FC<EmptyVehiclesCardProps> = ({
  onAddVehicle
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
            onClick={onAddVehicle}
            style={{ cursor: 'pointer' }}
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
        
        {/* Action Button */}
        <Button
          color="neutrals3"
          variant="solid"
          size="default"
          onClick={onAddVehicle}
          className="empty-vehicles-card__button"
        >
          <Icon name="add" size={20} />
          Add Your First Vehicle
        </Button>
      </div>
    </div>
  );
};

export default EmptyVehiclesCard;
