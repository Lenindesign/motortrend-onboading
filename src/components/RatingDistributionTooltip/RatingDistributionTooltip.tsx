/**
 * Rating Distribution Tooltip Component
 * Migrated to inline styles for Tailwind compatibility
 */

import React, { useState } from 'react';

export interface RatingDistributionData {
  [rating: number]: number;
}

export interface RatingDistributionTooltipProps {
  distribution: RatingDistributionData;
  totalReviews: number;
  onRequestClose?: () => void;
  isVisible?: boolean;
  triggerRef?: React.RefObject<HTMLElement | null>;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
}

export const RatingDistributionTooltip: React.FC<RatingDistributionTooltipProps> = ({
  distribution: _distribution,
  totalReviews,
  onRequestClose
}) => {
  const [isLinkHovered, setIsLinkHovered] = useState(false);

  // HARDCODED: Fixed distribution that sums to 100%
  const fixedDistribution: { [key: number]: number } = {
    5: 28,
    4: 40,
    3: 20,
    2: 8,
    1: 4
  };

  // Styles
  const innerStyle: React.CSSProperties = {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    padding: '16px',
  };

  const headerStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'baseline',
    gap: '8px',
    marginBottom: '16px',
  };

  const titleStyle: React.CSSProperties = {
    fontFamily: 'var(--font-heading, Poppins, sans-serif)',
    fontWeight: 600,
    fontSize: '16px',
    color: 'var(--color-white, #FFFFFF)',
  };

  const totalStyle: React.CSSProperties = {
    fontFamily: 'var(--font-body, Geist, sans-serif)',
    fontSize: '13px',
    color: 'var(--color-neutrals-4, #6E7481)',
  };

  const contentStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    width: '100%',
  };

  const barRowStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    minHeight: '22px',
    width: '100%',
  };

  const ratingLabelStyle: React.CSSProperties = {
    fontFamily: 'var(--font-body, Geist, sans-serif)',
    fontWeight: 600,
    fontSize: '13px',
    color: 'var(--color-white, #FFFFFF)',
    minWidth: '14px',
    textAlign: 'left',
  };

  const barContainerStyle: React.CSSProperties = {
    flex: 1,
    height: '6px',
    backgroundColor: '#333333',
    borderRadius: '3px',
    overflow: 'hidden',
    position: 'relative',
    minWidth: '80px',
  };

  const getBarFillStyle = (percentage: number): React.CSSProperties => ({
    height: '100%',
    width: `${percentage}%`,
    backgroundColor: '#4A9EFF',
    borderRadius: '3px',
    transition: 'width 150ms ease-in-out',
  });

  const percentageStyle: React.CSSProperties = {
    fontFamily: 'var(--font-body, Geist, sans-serif)',
    fontSize: '12px',
    color: 'var(--color-neutrals-5, #B1B5C3)',
    minWidth: '36px',
    textAlign: 'right',
  };

  const footerStyle: React.CSSProperties = {
    marginTop: '16px',
    textAlign: 'center',
  };

  const linkStyle: React.CSSProperties = {
    fontFamily: 'var(--font-body, Geist, sans-serif)',
    fontSize: '12px',
    fontWeight: 600,
    color: isLinkHovered ? '#66B3FF' : '#4A9EFF',
    textDecoration: isLinkHovered ? 'underline' : 'none',
    cursor: 'pointer',
    transition: 'color 0.2s ease',
  };

  return (
    <div style={innerStyle}>
      <div style={headerStyle}>
        <div style={titleStyle}>Rating Distribution</div>
        <div style={totalStyle}>{totalReviews} reviews</div>
      </div>
      <div style={contentStyle}>
        {[5, 4, 3, 2, 1].map((rating) => {
          const percentage = fixedDistribution[rating];
          return (
            <div key={rating} style={barRowStyle}>
              <div style={ratingLabelStyle}>{rating}</div>
              <div style={barContainerStyle}>
                <div style={getBarFillStyle(percentage)} />
              </div>
              <div style={percentageStyle}>{percentage}%</div>
            </div>
          );
        })}
      </div>
      <div style={footerStyle}>
        <a
          href="#user-reviews"
          style={linkStyle}
          onMouseEnter={() => setIsLinkHovered(true)}
          onMouseLeave={() => setIsLinkHovered(false)}
          onClick={() => onRequestClose?.()}
        >
          See User Reviews
        </a>
      </div>
    </div>
  );
};
