/**
 * Global Header Component
 * Based on Figma Community design system
 */

import React from 'react';
import './GlobalHeader.css';
import motorTrendLogo from '../../assets/images/motortrend-logo.svg';

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
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M21 21L16.65 16.65M19 11C19 15.4183 15.4183 19 11 19C6.58172 19 3 15.4183 3 11C3 6.58172 6.58172 3 11 3C15.4183 3 19 6.58172 19 11Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          {isAuthenticated ? (
            <button 
              className="global-header__profile-btn" 
              onClick={onProfileClick}
              aria-label="Profile"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21" stroke="#B1B5C3" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M12 11C14.2091 11 16 9.20914 16 7C16 4.79086 14.2091 3 12 3C9.79086 3 8 4.79086 8 7C8 9.20914 9.79086 11 12 11Z" stroke="#B1B5C3" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
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

