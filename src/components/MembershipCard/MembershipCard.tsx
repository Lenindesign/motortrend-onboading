/**
 * Membership Card Component
 * Migrated to inline styles for Tailwind compatibility
 */

import React, { useEffect } from 'react';

export interface MembershipCardProps {
  name?: string;
  memberSince?: string;
  car?: string;
  newsletter?: string;
  className?: string;
}

export const MembershipCard: React.FC<MembershipCardProps> = ({
  name = 'Greg Smith',
  memberSince = '09/27/2025',
  car = '2021 Subaru WRX',
  newsletter = 'MotorTrend',
  className = '',
}) => {
  // Inject keyframes animation
  useEffect(() => {
    const styleId = 'membership-card-keyframes';
    if (!document.getElementById(styleId)) {
      const style = document.createElement('style');
      style.id = styleId;
      style.textContent = `
        @keyframes membershipFadeInScale {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
        .membership-card--animated {
          animation: membershipFadeInScale 0.5s ease-out;
        }
      `;
      document.head.appendChild(style);
    }
  }, []);

  // Card container styles
  const cardStyle: React.CSSProperties = {
    width: '100%',
    maxWidth: '600px',
    minWidth: '320px',
    aspectRatio: '1.6 / 1',
    background: 'linear-gradient(145deg, #3a3a3c 0%, #2c2c2e 30%, #1c1c1e 70%, #141416 100%)',
    borderRadius: 'var(--border-radius-xl, 20px)',
    padding: '32px',
    display: 'flex',
    flexDirection: 'column',
    position: 'relative',
    overflow: 'hidden',
    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5), 0 12px 24px -8px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
  };

  // Watermark styles
  const watermarkStyle: React.CSSProperties = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '110%',
    height: '70%',
    backgroundImage: 'url("https://d2kde5ohu8qb21.cloudfront.net/files/6929d1a44c063a0002bb760d/union.svg")',
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'contain',
    backgroundPosition: 'center',
    pointerEvents: 'none',
    zIndex: 0,
    opacity: 0.4,
  };

  // Content styles
  const contentStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    width: '100%',
    position: 'relative',
    zIndex: 1,
  };

  // Header styles
  const headerStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: '20px',
    marginBottom: 'auto',
  };

  // Logo styles
  const logoStyle: React.CSSProperties = {
    width: '88px',
    height: '88px',
    flexShrink: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  };

  const logoImgStyle: React.CSSProperties = {
    width: '100%',
    height: '100%',
    objectFit: 'contain',
  };

  // Title section styles
  const titleSectionStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
  };

  const titleStyle: React.CSSProperties = {
    fontFamily: 'var(--font-heading, Poppins, sans-serif)',
    fontWeight: 600,
    fontSize: '32px',
    lineHeight: 1.1,
    color: 'var(--color-white, #FFFFFF)',
    margin: 0,
    letterSpacing: '-0.5px',
  };

  const subtitleStyle: React.CSSProperties = {
    fontFamily: 'var(--font-body, Geist, sans-serif)',
    fontWeight: 400,
    fontSize: '18px',
    lineHeight: 1.3,
    color: 'var(--color-neutrals-4, #6E7481)',
    margin: 0,
  };

  // Details grid styles
  const detailsStyle: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '24px 48px',
    marginTop: 'auto',
  };

  // Detail item styles
  const detailItemStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
  };

  const detailLabelStyle: React.CSSProperties = {
    fontFamily: 'var(--font-body, Geist, sans-serif)',
    fontWeight: 400,
    fontSize: '14px',
    lineHeight: 1.4,
    color: 'var(--color-neutrals-4, #6E7481)',
    textTransform: 'none',
    letterSpacing: 0,
  };

  const detailValueStyle: React.CSSProperties = {
    fontFamily: 'var(--font-heading, Poppins, sans-serif)',
    fontWeight: 600,
    fontSize: '22px',
    lineHeight: 1.2,
    color: 'var(--color-white, #FFFFFF)',
    letterSpacing: '-0.3px',
  };

  return (
    <div className={`membership-card--animated ${className}`} style={cardStyle}>
      {/* Watermark */}
      <div style={watermarkStyle} />
      
      <div style={contentStyle}>
        {/* Header with Logo and Title */}
        <div style={headerStyle}>
          <div style={logoStyle}>
            <img 
              src="https://d2kde5ohu8qb21.cloudfront.net/files/68fabbe380bc4f00028943ef/mt40.svg" 
              alt="MotorTrend Logo" 
              style={logoImgStyle}
            />
          </div>
          <div style={titleSectionStyle}>
            <h2 style={titleStyle}>Membership Card</h2>
            <p style={subtitleStyle}>MotorTrend Member</p>
          </div>
        </div>
        
        {/* Details Grid - 2x2 layout */}
        <div style={detailsStyle}>
          <div style={detailItemStyle}>
            <span style={detailLabelStyle}>Member Since</span>
            <span style={detailValueStyle}>{memberSince}</span>
          </div>
          <div style={detailItemStyle}>
            <span style={detailLabelStyle}>Name</span>
            <span style={detailValueStyle}>{name}</span>
          </div>
          <div style={detailItemStyle}>
            <span style={detailLabelStyle}>My Car</span>
            <span style={detailValueStyle}>{car || 'No vehicle selected'}</span>
          </div>
          <div style={detailItemStyle}>
            <span style={detailLabelStyle}>Newsletter</span>
            <span style={detailValueStyle}>{newsletter || 'None'}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MembershipCard;
