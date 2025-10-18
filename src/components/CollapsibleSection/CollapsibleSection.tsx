import React, { useState } from 'react';
import './CollapsibleSection.css';

export interface CollapsibleSectionProps {
  title: string;
  description?: string;
  children?: React.ReactNode;
  defaultOpen?: boolean;
}

export const CollapsibleSection: React.FC<CollapsibleSectionProps> = ({ 
  title, 
  description,
  children,
  defaultOpen = false 
}) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="collapsible-section">
      <div className="collapsible-section__header" onClick={() => setIsOpen(!isOpen)}>
        <div className="collapsible-section__content">
          <h3 className="collapsible-section__title">{title}</h3>
          {description && !isOpen && (
            <p className="collapsible-section__description">{description}</p>
          )}
        </div>
        <svg 
          width="24" 
          height="24" 
          viewBox="0 0 24 24" 
          fill="none"
          className={`collapsible-section__arrow ${isOpen ? 'collapsible-section__arrow--open' : ''}`}
        >
          <path d="M6 9L12 15L18 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </div>
      {isOpen && children && (
        <div className="collapsible-section__body">
          {children}
        </div>
      )}
    </div>
  );
};

