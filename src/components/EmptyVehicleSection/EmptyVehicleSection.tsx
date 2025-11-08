/**
 * Empty Vehicle Section Component
 * Displays empty state for Cars I Own or Cars I Want sections
 * Based on Figma Community design system
 */

import React from 'react';
import './EmptyVehicleSection.css';

export interface EmptyVehicleSectionProps {
  type: 'own' | 'want';
  onClick?: () => void;
}

export const EmptyVehicleSection: React.FC<EmptyVehicleSectionProps> = ({
  type: _type,
  onClick
}) => {
  const text = "Add Vehicle";

  return (
    <div className="empty-vehicle-section" onClick={onClick}>
      <div className="empty-vehicle-section__icon">
        <img 
          src="https://d2kde5ohu8qb21.cloudfront.net/files/68f64af5e852a20002f9bc06/more.svg"
          alt="Add vehicle"
          className="empty-vehicle-section__icon-img"
        />
      </div>
      <p className="empty-vehicle-section__text">{text}</p>
    </div>
  );
};

export default EmptyVehicleSection;

