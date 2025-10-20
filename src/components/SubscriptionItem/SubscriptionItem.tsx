import React from 'react';
import './SubscriptionItem.css';

export interface SubscriptionItemProps {
  name: string;
  logo?: string;
  isActive?: boolean;
  isFindMore?: boolean;
  onClick?: () => void;
  onToggleSubscription?: (name: string, isActive: boolean) => void;
}

export const SubscriptionItem: React.FC<SubscriptionItemProps> = ({ 
  name, 
  logo, 
  isActive = false,
  isFindMore = false,
  onClick,
  onToggleSubscription
}) => {
  const handleBadgeClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent triggering the main onClick
    if (onToggleSubscription && !isFindMore) {
      onToggleSubscription(name, isActive);
    }
  };

  return (
    <div className="subscription-item" onClick={onClick}>
      <div className="subscription-item__logo-container">
        {logo ? (
          <img src={logo} alt={name} className="subscription-item__logo" />
        ) : (
          <div className="subscription-item__logo-placeholder">
            {isFindMore && (
              <img 
                src="https://d2kde5ohu8qb21.cloudfront.net/files/68f64af5e852a20002f9bc06/more.svg" 
                alt="Find More" 
                width="116" 
                height="116"
                style={{ borderRadius: '8px' }}
              />
            )}
          </div>
        )}
        {isActive && (
          <div 
            className="subscription-item__badge subscription-item__badge--clickable" 
            onClick={handleBadgeClick}
            title="Click to unsubscribe"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="12" fill="#E90C17"/>
              <path d="M7 12L10 15L17 8" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        )}
        {!isActive && !isFindMore && (
          <div 
            className="subscription-item__badge subscription-item__badge--empty subscription-item__badge--clickable" 
            onClick={handleBadgeClick}
            title="Click to subscribe"
          >
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

