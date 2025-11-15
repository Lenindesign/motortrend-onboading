/**
 * Ad Container Component
 * Container for advertisement placeholders
 */

import React from 'react';
import './AdContainer.css';

export interface AdContainerProps {
  width?: number;
  height?: number;
  label?: string;
  position?: 'right-column' | 'inline';
  imageUrl?: string;
}

export const AdContainer: React.FC<AdContainerProps> = ({
  width = 300,
  height = 250,
  label,
  position = 'right-column',
  imageUrl,
}) => {
  const displayLabel = label || `${width} x ${height}`;
  const positionClass = `ad-container--${position}`;

  return (
    <div className={`ad-container ${positionClass}`}>
      <div className="ad-container__placeholder">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt="Advertisement"
            className="ad-container__image"
          />
        ) : (
          <>
            <div className="ad-container__rectangle"></div>
            <div className="ad-container__label">{displayLabel}</div>
          </>
        )}
      </div>
    </div>
  );
};

export default AdContainer;

