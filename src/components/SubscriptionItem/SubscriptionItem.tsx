import React from 'react';
import './SubscriptionItem.css';

export interface SubscriptionItemProps {
  name: string;
  logo?: string;
  isActive?: boolean;
  isFindMore?: boolean;
  onClick?: () => void;
}

export const SubscriptionItem: React.FC<SubscriptionItemProps> = ({ 
  name, 
  logo, 
  isActive = false,
  isFindMore = false,
  onClick 
}) => {
  return (
    <div className="subscription-item" onClick={onClick}>
      <div className="subscription-item__logo-container">
        {logo ? (
          <img src={logo} alt={name} className="subscription-item__logo" />
        ) : (
          <div className="subscription-item__logo-placeholder">
            {isFindMore && (
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M12 5V19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M5 12H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            )}
          </div>
        )}
        {isActive && (
          <div className="subscription-item__badge">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="12" fill="#E90C17"/>
              <path d="M7 12L10 15L17 8" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        )}
        {!isActive && !isFindMore && (
          <div className="subscription-item__badge subscription-item__badge--empty">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="11" stroke="#E6E8EC" strokeWidth="2"/>
            </svg>
          </div>
        )}
      </div>
      <p className="subscription-item__name">{name}</p>
    </div>
  );
};

