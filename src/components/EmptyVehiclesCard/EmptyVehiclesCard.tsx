/**
 * Empty Vehicles Card Component
 * Migrated to inline styles for Tailwind compatibility
 */

import React, { useEffect } from 'react';
import { VehicleSearch } from '../VehicleSearch';

export interface EmptyVehiclesCardProps {
  onVehicleSelect?: (vehicle: { name: string; ownership: 'own' | 'want' }) => void;
  className?: string;
}

export const EmptyVehiclesCard: React.FC<EmptyVehiclesCardProps> = ({
  onVehicleSelect,
  className = '',
}) => {
  // Inject responsive styles
  useEffect(() => {
    const styleId = 'empty-vehicles-card-responsive';
    if (!document.getElementById(styleId)) {
      const style = document.createElement('style');
      style.id = styleId;
      style.textContent = `
        @media (max-width: 768px) {
          .empty-vehicles-card--responsive {
            min-height: 192px !important;
            padding: 32px !important;
          }
          .empty-vehicles-card__content--responsive {
            gap: 16px !important;
          }
          .empty-vehicles-card__icon--responsive {
            width: 60px !important;
            height: 60px !important;
          }
          .empty-vehicles-card__title--responsive {
            font-size: 18px !important;
          }
          .empty-vehicles-card__description--responsive {
            font-size: 14px !important;
          }
        }
      `;
      document.head.appendChild(style);
    }
  }, []);

  // Container styles
  const containerStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    minHeight: '288px',
    backgroundColor: 'var(--color-neutrals-7, #F4F5F6)',
    border: '2px dashed var(--color-neutrals-5, #B1B5C3)',
    borderRadius: 'var(--border-radius-lg, 16px)',
    padding: '48px',
    boxShadow: 'var(--shadow-depth-1, 0 1px 2px rgba(20, 20, 22, 0.02))',
  };

  // Content styles
  const contentStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
    gap: '24px',
    maxWidth: '500px',
  };

  // Icon container styles
  const iconStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '72px',
    height: '72px',
    backgroundColor: 'var(--color-neutrals-6, #E6E8EC)',
    borderRadius: 'var(--border-radius-circle, 400px)',
    marginBottom: '16px',
  };

  // Icon image styles
  const iconImgStyle: React.CSSProperties = {
    width: '100%',
    height: '100%',
    objectFit: 'contain',
    cursor: 'pointer',
  };

  // Title styles
  const titleStyle: React.CSSProperties = {
    fontFamily: 'var(--font-heading, Poppins, sans-serif)',
    fontWeight: 600,
    fontSize: '20px',
    lineHeight: '1.3em',
    color: 'var(--color-neutrals-2, #23262F)',
    margin: 0,
  };

  // Description styles
  const descriptionStyle: React.CSSProperties = {
    fontFamily: 'var(--font-body, Geist, sans-serif)',
    fontWeight: 400,
    fontSize: '16px',
    lineHeight: '1.5em',
    color: 'var(--color-neutrals-3, #353945)',
    margin: 0,
    maxWidth: '400px',
  };

  // Search styles
  const searchStyle: React.CSSProperties = {
    marginTop: '16px',
    width: '100%',
    maxWidth: '500px',
  };

  return (
    <div className={`empty-vehicles-card--responsive ${className}`} style={containerStyle}>
      <div className="empty-vehicles-card__content--responsive" style={contentStyle}>
        <div className="empty-vehicles-card__icon--responsive" style={iconStyle}>
          <img 
            src="https://d2kde5ohu8qb21.cloudfront.net/files/68f64af5e852a20002f9bc06/more.svg"
            alt="Vehicles"
            style={iconImgStyle}
          />
        </div>
        
        <h3 className="empty-vehicles-card__title--responsive" style={titleStyle}>
          No vehicles saved yet
        </h3>
        
        <p className="empty-vehicles-card__description--responsive" style={descriptionStyle}>
          Start building your collection by saving vehicles you're interested in or own.
        </p>
        
        {onVehicleSelect && (
          <VehicleSearch
            onVehicleSelect={onVehicleSelect}
            placeholder="Search for a vehicle..."
            style={searchStyle}
          />
        )}
      </div>
    </div>
  );
};

export default EmptyVehiclesCard;
