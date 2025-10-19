/**
 * Global Header Component
 * Based on Figma Community design system
 */

import React from 'react';
import './GlobalHeader.css';
import motorTrendLogo from '../../assets/images/motortrend-logo.svg';
import Icon from '../Icon';

export interface GlobalHeaderProps {
  onSignInClick?: () => void;
  onProfileClick?: () => void;
  isAuthenticated?: boolean;
}

const navigationItems = [
  { label: 'News', href: '#' },
  { label: 'Reviews', href: '#' },
  { label: "Buyer's Guide", href: '#' },
  { label: 'Events', href: '#' },
  { label: 'Magazines', href: '#' },
  { label: 'The Future', href: '#' },
  { label: 'Videos', href: '#' },
];

export const GlobalHeader: React.FC<GlobalHeaderProps> = ({ onSignInClick, onProfileClick, isAuthenticated = false }) => {
  return (
    <header className="global-header">
      <div className="global-header__content">
        {/* Logo and Navigation */}
        <div className="global-header__left">
          <img 
            src={motorTrendLogo} 
            alt="MotorTrend" 
            className="global-header__logo"
          />
          <nav className="global-header__nav">
            {navigationItems.map((item) => (
              <a 
                key={item.label} 
                href={item.href} 
                className="global-header__nav-link"
              >
                {item.label}
              </a>
            ))}
          </nav>
        </div>

        {/* Search and Sign In */}
        <div className="global-header__right">
          <button 
            className="global-header__search-btn"
            aria-label="Search"
          >
            <Icon name="search" size={24} />
          </button>
          {isAuthenticated ? (
            <button 
              className="global-header__profile-btn" 
              onClick={onProfileClick}
              aria-label="Profile"
            >
              <Icon name="account_circle" size={24} />
            </button>
          ) : (
            <button 
              className="global-header__sign-in-btn"
              onClick={onSignInClick}
            >
              Sign In
            </button>
          )}
        </div>
      </div>
    </header>
  );
};

export default GlobalHeader;

