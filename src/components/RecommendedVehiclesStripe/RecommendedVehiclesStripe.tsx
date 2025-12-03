/**
 * Recommended Vehicles Stripe Component
 * Displays a horizontal scrolling stripe of recommended vehicles
 */

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { VehicleCard } from '../VehicleCard';
import { parseVehicleName } from '../../utils/vehicleImages';
import { getVehicleBodyStyle } from '../../utils/vehicleBodyStyles';
import './RecommendedVehiclesStripe.css';

export interface RecommendedVehicle {
  id: string;
  name: string;
  image: string;
  staffRating?: number;
  communityRating?: number;
  year?: string;
  make?: string;
  model?: string;
}

export interface RecommendedVehiclesStripeProps {
  vehicles: RecommendedVehicle[];
  title?: string;
  className?: string;
  onVehicleClick?: (vehicle: RecommendedVehicle) => void;
}

export const RecommendedVehiclesStripe: React.FC<RecommendedVehiclesStripeProps> = ({
  vehicles,
  title = 'Recommended for You',
  className = '',
  onVehicleClick
}) => {
  const navigate = useNavigate();

  const handleVehicleClick = (vehicle: RecommendedVehicle) => {
    if (onVehicleClick) {
      onVehicleClick(vehicle);
    } else {
      // Default navigation to vehicle details page
      const { year, make, model } = vehicle.year && vehicle.make && vehicle.model
        ? { year: vehicle.year, make: vehicle.make, model: vehicle.model }
        : parseVehicleName(vehicle.name);
      
      navigate(`/vehicles/${encodeURIComponent(year)}/${encodeURIComponent(make)}/${encodeURIComponent(model)}`);
    }
  };

  const handleBookmark = (vehicle: RecommendedVehicle) => {
    try {
      const onboardingData = localStorage.getItem('onboardingData');
      let data = onboardingData ? JSON.parse(onboardingData) : { vehicles: [] };
      
      if (!data.vehicles) {
        data.vehicles = [];
      }
      
      const vehicleIndex = data.vehicles.findIndex((v: { name: string }) => v.name === vehicle.name);
      
      if (vehicleIndex >= 0) {
        data.vehicles.splice(vehicleIndex, 1);
      } else {
        data.vehicles.push({ name: vehicle.name });
      }
      
      localStorage.setItem('onboardingData', JSON.stringify(data));
    } catch (error) {
      console.error('Error saving vehicle bookmark:', error);
    }
  };

  const isBookmarked = (vehicle: RecommendedVehicle): boolean => {
    try {
      const onboardingData = localStorage.getItem('onboardingData');
      if (onboardingData) {
        const data = JSON.parse(onboardingData);
        if (data.vehicles && Array.isArray(data.vehicles)) {
          return data.vehicles.some((v: { name: string }) => v.name === vehicle.name);
        }
      }
    } catch (error) {
      console.error('Error checking bookmark:', error);
    }
    return false;
  };

  if (!vehicles || vehicles.length === 0) {
    return null;
  }

  return (
    <div className={`recommended-vehicles-stripe ${className}`}>
      <div className="recommended-vehicles-stripe__header">
        <h2 className="recommended-vehicles-stripe__title">{title}</h2>
      </div>
      <div className="recommended-vehicles-stripe__container">
        <div className="recommended-vehicles-stripe__scroll">
          {vehicles.map((vehicle) => {
            const bodyStyles = getVehicleBodyStyle(vehicle.name);
            const bodyStyle = bodyStyles[0] || 'Sedan';
            
            return (
              <div key={vehicle.id} className="recommended-vehicles-stripe__item">
                <VehicleCard
                  image={vehicle.image}
                  name={vehicle.name}
                  type={bodyStyle}
                  rating1={vehicle.staffRating}
                  rating2={vehicle.communityRating}
                  hasMultipleRatings={!!(vehicle.staffRating && vehicle.communityRating)}
                  onBookmark={() => handleBookmark(vehicle)}
                  isBookmarked={isBookmarked(vehicle)}
                  onViewDetails={() => handleVehicleClick(vehicle)}
                />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default RecommendedVehiclesStripe;

