/**
 * Staff Rating Tooltip Component
 * Migrated to inline styles for Tailwind compatibility
 */

import React, { useState } from 'react';

export interface StaffRatingScores {
  performance?: number;
  efficiency?: number;
  tech?: number;
  value?: number;
}

export interface StaffRatingTooltipProps {
  overallRating: number;
  scores: StaffRatingScores;
  onRequestClose?: () => void;
  isVisible?: boolean;
  triggerRef?: React.RefObject<HTMLElement | null>;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
}

export const StaffRatingTooltip: React.FC<StaffRatingTooltipProps> = ({
  overallRating,
  scores,
  onRequestClose,
  onMouseEnter,
  onMouseLeave
}) => {
  const [isLinkHovered, setIsLinkHovered] = useState(false);

  // Category labels mapping
  const categoryLabels: { [key: string]: string } = {
    performance: 'Performance',
    efficiency: 'Efficiency/Range',
    tech: 'Tech/Innovation',
    value: 'Value'
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
    fontFamily: 'var(--font-heading, Poppins, sans-serif)',
    fontWeight: 600,
    fontSize: '16px',
    color: 'var(--color-white, #FFFFFF)',
  };

  const totalStyle: React.CSSProperties = {
    fontFamily: 'var(--font-heading, Poppins, sans-serif)',
    fontSize: '14px',
    fontWeight: 600,
    color: 'var(--color-white, #FFFFFF)',
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
    gap: '8px',
    minHeight: '24px',
    width: '100%',
  };

  const ratingLabelStyle: React.CSSProperties = {
    fontFamily: 'var(--font-body, Geist, sans-serif)',
    fontWeight: 400,
    fontSize: '13px',
    color: 'var(--color-neutrals-5, #B1B5C3)',
    minWidth: '100px',
    textAlign: 'left',
  };

  const barContainerStyle: React.CSSProperties = {
    flex: 1,
    height: '8px',
    backgroundColor: 'var(--color-neutrals-2-5, #282a30)',
    borderRadius: '4px',
    overflow: 'hidden',
    position: 'relative',
    minWidth: '60px',
  };

  const getBarFillStyle = (percentage: number): React.CSSProperties => ({
    height: '100%',
    width: `${percentage}%`,
    backgroundColor: 'var(--color-rating-motortrend, #FFB74D)',
    borderRadius: '4px',
    transition: 'width 150ms ease-in-out',
  });

  const scoreStyle: React.CSSProperties = {
    fontFamily: 'var(--font-heading, Poppins, sans-serif)',
    fontSize: '13px',
    fontWeight: 600,
    color: 'var(--color-white, #FFFFFF)',
    minWidth: '28px',
    textAlign: 'right',
  };

  const footerStyle: React.CSSProperties = {
    marginTop: '12px',
    paddingTop: '8px',
    borderTop: '1px solid #333333',
    textAlign: 'center',
  };

  const linkStyle: React.CSSProperties = {
    fontFamily: 'var(--font-body, Geist, sans-serif)',
    fontSize: '12px',
    fontWeight: 600,
    color: 'var(--color-rating-motortrend, #FFB74D)',
    textDecoration: isLinkHovered ? 'underline' : 'none',
    transition: 'color 0.2s ease',
  };

  const categories = ['performance', 'efficiency', 'tech', 'value'] as const;

  return (
    <div 
      style={innerStyle}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <div style={headerStyle}>
        <div style={titleStyle}>MotorTrend</div>
        <div style={totalStyle}>{typeof overallRating === 'number' ? overallRating.toFixed(1) : overallRating}/10</div>
      </div>
      <div style={contentStyle}>
        {categories.map((category) => {
          const score = scores[category];
          if (score === undefined) return null;
          const percentage = (score / 10) * 100;
          return (
            <div key={category} style={barRowStyle}>
              <div style={ratingLabelStyle}>{categoryLabels[category]}</div>
              <div style={barContainerStyle}>
                <div style={getBarFillStyle(percentage)} />
              </div>
              <div style={scoreStyle}>{score.toFixed(1)}</div>
            </div>
          );
        })}
      </div>
      <div style={footerStyle}>
        <a
          href="#staff-rating"
          style={linkStyle}
          onMouseEnter={() => setIsLinkHovered(true)}
          onMouseLeave={() => setIsLinkHovered(false)}
          onClick={() => onRequestClose?.()}
        >
          See Full MotorTrend Review
        </a>
      </div>
    </div>
  );
};
