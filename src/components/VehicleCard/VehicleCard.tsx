import React from 'react';
import './VehicleCard.css';

export interface VehicleCardProps {
  image: string;
  name: string;
  type: string;
  rating1?: number;
  rating2?: number;
  hasMultipleRatings?: boolean;
}

export const VehicleCard: React.FC<VehicleCardProps> = ({ 
  image, 
  name, 
  type, 
  rating1, 
  rating2,
  hasMultipleRatings = false 
}) => {
  return (
    <div className="vehicle-card">
      <div className="vehicle-card__image-container">
        <img src={image} alt={name} className="vehicle-card__image" />
        <div className="vehicle-card__gallery-badge">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <rect width="24" height="24" rx="4" fill="currentColor"/>
          </svg>
        </div>
      </div>
      
      <div className="vehicle-card__content">
        <div className="vehicle-card__info">
          <h4 className="vehicle-card__name">{name}</h4>
          <p className="vehicle-card__type">{type}</p>
        </div>
        
        <div className="vehicle-card__actions">
          {hasMultipleRatings && rating1 && rating2 && (
            <div className="vehicle-card__ratings">
              <div className="vehicle-card__rating">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M10 1.5L12.5 8H19L13.5 12.5L16 19L10 14.5L4 19L6.5 12.5L1 8H7.5L10 1.5Z" fill="#FFB74D"/>
                </svg>
                <span>{rating1}</span>
              </div>
              <div className="vehicle-card__rating">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M10 1.5L12.5 8H19L13.5 12.5L16 19L10 14.5L4 19L6.5 12.5L1 8H7.5L10 1.5Z" fill="#33CCFF"/>
                </svg>
                <span>{rating2}</span>
              </div>
            </div>
          )}
          <button className="vehicle-card__button">View Details</button>
        </div>
      </div>
    </div>
  );
};

