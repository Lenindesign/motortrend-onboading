/**
 * Empty Vehicle Section Component
 * Migrated to inline styles for Tailwind compatibility
 */

import React, { useState } from 'react';

export interface EmptyVehicleSectionProps {
  type: 'own' | 'want';
  onClick?: () => void;
  className?: string;
}

export const EmptyVehicleSection: React.FC<EmptyVehicleSectionProps> = ({
  onClick,
  className = '',
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const text = "Add Vehicle";

  // Container styles
  const containerStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: '168px',
    minHeight: '168px',
    backgroundColor: 'var(--color-white, #FFFFFF)',
    border: `1px solid ${isHovered ? 'var(--color-neutrals-4, #6E7481)' : 'var(--color-neutrals-6, #E6E8EC)'}`,
    borderRadius: 'var(--border-radius-md-lg, 12px)',
    boxShadow: 'var(--shadow-depth-2, 0 2px 8px rgba(20, 20, 22, 0.04))',
    padding: '48px 24px',
    cursor: 'pointer',
    transition: 'all 150ms ease-in-out',
  };

  // Icon container styles
  const iconContainerStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '16px',
  };

  // Icon image styles
  const iconImgStyle: React.CSSProperties = {
    width: '64px',
    height: '64px',
    objectFit: 'contain',
  };

  // Text styles
  const textStyle: React.CSSProperties = {
    fontFamily: 'var(--font-body, Geist, sans-serif)',
    fontWeight: 600,
    fontSize: '16px',
    lineHeight: '1.5em',
    color: 'var(--color-neutrals-2, #23262F)',
    margin: 0,
    textAlign: 'center',
  };

  return (
    <div 
      className={className}
      style={containerStyle}
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div style={iconContainerStyle}>
        <img 
          src="https://d2kde5ohu8qb21.cloudfront.net/files/68f64af5e852a20002f9bc06/more.svg"
          alt="Add vehicle"
          style={iconImgStyle}
        />
      </div>
      <p style={textStyle}>{text}</p>
    </div>
  );
};

export default EmptyVehicleSection;

