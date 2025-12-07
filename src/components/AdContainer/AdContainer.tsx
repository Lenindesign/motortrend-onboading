/**
 * Ad Container Component
 * Migrated to inline styles for Tailwind compatibility
 * Container for advertisement placeholders
 */

import React, { useEffect } from 'react';

export interface AdContainerProps {
  width?: number;
  height?: number;
  label?: string;
  position?: 'right-column' | 'inline';
  imageUrl?: string;
  className?: string;
}

// Inject responsive CSS for hiding right-column on smaller screens
const STYLES_ID = 'ad-container-responsive';
const injectResponsiveStyles = () => {
  if (typeof document !== 'undefined' && !document.getElementById(STYLES_ID)) {
    const style = document.createElement('style');
    style.id = STYLES_ID;
    style.textContent = `
      @media (max-width: 1024px) {
        .ad-container--right-column-responsive {
          display: none !important;
        }
      }
    `;
    document.head.appendChild(style);
  }
};

export const AdContainer: React.FC<AdContainerProps> = ({
  width = 300,
  height = 250,
  label,
  position = 'right-column',
  imageUrl,
  className = '',
}) => {
  useEffect(() => {
    injectResponsiveStyles();
  }, []);

  const displayLabel = label || `${width} x ${height}`;
  const isRightColumn = position === 'right-column';

  // Container styles
  const containerStyle: React.CSSProperties = {
    width: '100%',
    backgroundColor: 'var(--color-neutrals-7, #F4F5F6)',
    borderRadius: 'var(--border-radius-md, 8px)',
    padding: 'var(--spacing-2, 16px)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '200px',
    boxShadow: 'var(--shadow-depth-2, 0 2px 8px rgba(20, 20, 22, 0.04))',
    ...(isRightColumn && {
      position: 'sticky',
      top: '20px',
      alignSelf: 'flex-start',
      zIndex: 10,
      marginBottom: 'auto',
    }),
  };

  // Placeholder styles
  const placeholderStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 'var(--spacing-2, 16px)',
    width: '100%',
    height: '100%',
  };

  // Rectangle styles
  const rectangleStyle: React.CSSProperties = {
    width: '100%',
    maxWidth: isRightColumn ? '300px' : '320px',
    aspectRatio: isRightColumn ? '300 / 600' : '300 / 250',
    backgroundColor: 'var(--color-neutrals-4, #6E7481)',
    borderRadius: 'var(--border-radius-sm, 4px)',
  };

  // Image styles
  const imageStyle: React.CSSProperties = {
    width: '100%',
    maxWidth: '300px',
    height: 'auto',
    borderRadius: 'var(--border-radius-sm, 4px)',
    objectFit: 'contain',
    display: 'block',
  };

  // Label styles
  const labelStyle: React.CSSProperties = {
    fontFamily: 'var(--font-heading, Poppins, sans-serif)',
    fontWeight: 600,
    fontSize: '18px',
    lineHeight: '1.2em',
    color: 'var(--color-neutrals-8, #FCFCFD)',
    textAlign: 'center',
    display: isRightColumn ? 'none' : 'block',
  };

  // Add responsive class for right-column hiding
  const responsiveClass = isRightColumn ? 'ad-container--right-column-responsive' : '';

  return (
    <div className={`${responsiveClass} ${className}`} style={containerStyle}>
      <div style={placeholderStyle}>
        {imageUrl ? (
          <img
            src={imageUrl}
            alt="Advertisement"
            style={imageStyle}
          />
        ) : (
          <>
            <div style={rectangleStyle}></div>
            <div style={labelStyle}>{displayLabel}</div>
          </>
        )}
      </div>
    </div>
  );
};

export default AdContainer;

