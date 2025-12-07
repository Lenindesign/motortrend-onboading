/**
 * CollapsibleSection Component
 * Migrated to inline styles for Tailwind compatibility
 */

import React, { useState } from 'react';

export interface CollapsibleSectionProps {
  title: string;
  description?: string;
  children?: React.ReactNode;
  defaultOpen?: boolean;
  className?: string;
}

export const CollapsibleSection: React.FC<CollapsibleSectionProps> = ({ 
  title, 
  description,
  children,
  defaultOpen = false,
  className = '',
}) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  // Container styles
  const containerStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: 'var(--spacing-3, 24px)',
    padding: 'var(--spacing-card-lg, 24px)',
    background: 'var(--color-neutrals-8, #FCFCFD)',
    border: '1px solid var(--color-neutrals-6, #E6E8EC)',
    boxShadow: 'var(--shadow-depth-5, 0 4px 20px rgba(20, 20, 22, 0.06))',
    width: '100%',
    maxWidth: '968px',
    borderRadius: 'var(--border-radius-lg, 16px)',
  };

  // Header styles
  const headerStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 'var(--spacing-3, 24px)',
    cursor: 'pointer',
    transition: 'background 150ms ease-in-out',
    padding: 'var(--spacing-component-sm, 8px) 0',
  };

  // Content styles
  const contentStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: 'var(--spacing-component-sm, 8px)',
    flex: 1,
  };

  // Title styles
  const titleStyle: React.CSSProperties = {
    fontFamily: 'var(--font-heading, Poppins, sans-serif)',
    fontWeight: 600,
    fontSize: '24px',
    lineHeight: '1.17em',
    color: 'var(--color-neutrals-1, #141416)',
    margin: 0,
  };

  // Description styles
  const descriptionStyle: React.CSSProperties = {
    fontFamily: 'var(--font-body, Geist, sans-serif)',
    fontWeight: 400,
    fontSize: '16px',
    lineHeight: '1.5em',
    color: 'var(--color-neutrals-4, #6E7481)',
    margin: 0,
  };

  // Arrow styles
  const arrowStyle: React.CSSProperties = {
    width: '24px',
    height: '24px',
    color: 'var(--color-neutrals-5, #B1B5C3)',
    transition: 'transform 0.3s ease',
    transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
  };

  // Body styles
  const bodyStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: 'var(--spacing-3, 24px)',
    paddingTop: 'var(--spacing-2, 16px)',
    borderTop: '1px solid var(--color-neutrals-6, #E6E8EC)',
  };

  return (
    <div className={className} style={containerStyle}>
      <div style={headerStyle} onClick={() => setIsOpen(!isOpen)}>
        <div style={contentStyle}>
          <h3 style={titleStyle}>{title}</h3>
          {description && !isOpen && (
            <p style={descriptionStyle}>{description}</p>
          )}
        </div>
        <svg 
          width="24" 
          height="24" 
          viewBox="0 0 24 24" 
          fill="none"
          style={arrowStyle}
        >
          <path d="M6 9L12 15L18 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </div>
      {isOpen && children && (
        <div style={bodyStyle}>
          {children}
        </div>
      )}
    </div>
  );
};

