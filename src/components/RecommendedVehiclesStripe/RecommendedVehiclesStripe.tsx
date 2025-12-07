/**
 * Recommended Vehicles Stripe Component
 * Migrated to inline styles for Tailwind compatibility
 */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { VehicleCard } from '../VehicleCard';
import { parseVehicleName } from '../../utils/vehicleImages';
import { getVehicleBodyStyle } from '../../utils/vehicleBodyStyles';

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
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const styleId = 'recommended-vehicles-stripe-scrollbar';
    if (!document.getElementById(styleId)) {
      const style = document.createElement('style');
      style.id = styleId;
      style.textContent = `
        .recommended-vehicles-stripe__container::-webkit-scrollbar { height: 8px; }
        .recommended-vehicles-stripe__container::-webkit-scrollbar-track { background: transparent; }
        .recommended-vehicles-stripe__container::-webkit-scrollbar-thumb { background-color: var(--color-neutrals-4, #6E7481); border-radius: 4px; }
        .recommended-vehicles-stripe__container::-webkit-scrollbar-thumb:hover { background-color: var(--color-neutrals-3, #353945); }
      `;
      document.head.appendChild(style);
    }
  }, []);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleVehicleClick = (vehicle: RecommendedVehicle) => {
    if (onVehicleClick) {
      onVehicleClick(vehicle);
    } else {
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
      if (!data.vehicles) data.vehicles = [];
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

  if (!vehicles || vehicles.length === 0) return null;

  // Styles
  const stripeStyle: React.CSSProperties = { width: '100%', marginBottom: 'var(--spacing-6, 48px)' };
  const headerStyle: React.CSSProperties = { marginBottom: isMobile ? 'var(--spacing-3, 24px)' : 'var(--spacing-4, 32px)', padding: isMobile ? '0 var(--spacing-3, 24px)' : '0 var(--spacing-4, 32px)' };
  const titleStyle: React.CSSProperties = { fontFamily: 'var(--font-heading)', fontSize: isMobile ? 'var(--font-size-xl, 20px)' : 'var(--font-size-2xl, 24px)', fontWeight: 600, lineHeight: 1.2, color: 'var(--color-neutrals-1, #141416)', margin: 0 };
  const containerStyle: React.CSSProperties = { width: '100%', overflowX: 'auto', overflowY: 'hidden', WebkitOverflowScrolling: 'touch', scrollbarWidth: 'thin', scrollbarColor: 'var(--color-neutrals-4, #6E7481) transparent', paddingBottom: 'var(--spacing-2, 16px)' };
  const scrollStyle: React.CSSProperties = { display: 'flex', gap: isMobile ? 'var(--spacing-2, 16px)' : 'var(--spacing-4, 32px)', padding: isMobile ? '0 var(--spacing-2, 16px)' : '0 var(--spacing-4, 32px)', width: 'max-content' };
  const itemStyle: React.CSSProperties = { flexShrink: 0, width: isMobile ? '260px' : '320px' };

  return (
    <div className={className} style={stripeStyle}>
      <div style={headerStyle}>
        <h2 style={titleStyle}>{title}</h2>
      </div>
      <div className="recommended-vehicles-stripe__container" style={containerStyle}>
        <div style={scrollStyle}>
          {vehicles.map((vehicle) => {
            const bodyStyles = getVehicleBodyStyle(vehicle.name);
            const bodyStyle = bodyStyles[0] || 'Sedan';
            return (
              <div key={vehicle.id} style={itemStyle}>
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
