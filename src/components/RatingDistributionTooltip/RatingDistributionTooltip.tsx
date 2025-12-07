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
  };

  const headerStyle: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '12px',
    paddingBottom: '8px',
    borderBottom: '1px solid #444444',
  };

  const titleStyle: React.CSSProperties = {
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    fontWeight: 600,
    fontSize: '16px',
    color: '#ffffff',
  };

  const totalStyle: React.CSSProperties = {
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    fontSize: '12px',
    color: '#999999',
  };

  const contentStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
    width: '100%',
  };

  const barRowStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    minHeight: '20px',
    width: '100%',
  };

  const ratingLabelStyle: React.CSSProperties = {
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    fontWeight: 600,
    fontSize: '12px',
    color: '#cccccc',
    minWidth: '16px',
    textAlign: 'center',
  };

  const barContainerStyle: React.CSSProperties = {
    flex: 1,
    height: '8px',
    backgroundColor: '#282a30',
    borderRadius: '4px',
    overflow: 'hidden',
    position: 'relative',
    minWidth: '60px',
  };

  const getBarFillStyle = (percentage: number): React.CSSProperties => ({
    height: '100%',
    width: `${percentage}%`,
    backgroundColor: '#33CCFF',
    borderRadius: '4px',
    transition: 'width 150ms ease-in-out',
  });

  const percentageStyle: React.CSSProperties = {
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    fontSize: '11px',
    color: '#999999',
    minWidth: '32px',
    textAlign: 'right',
  };

  const footerStyle: React.CSSProperties = {
    marginTop: '12px',
    paddingTop: '8px',
    borderTop: '1px solid #333333',
    textAlign: 'center',
  };

  const linkStyle: React.CSSProperties = {
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    fontSize: '12px',
    fontWeight: 600,
    color: isLinkHovered ? '#66D9FF' : '#33CCFF',
    textDecoration: isLinkHovered ? 'underline' : 'none',
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
