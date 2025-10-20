/**
 * Global Header Component
 * Based on Figma Community design system
 */

import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import './GlobalHeader.css';
// Using MotorTrend main logo from URL
const motorTrendLogo = 'https://d2kde5ohu8qb21.cloudfront.net/files/68f3fc9ccfecd100026f4650/mtlogo.png';
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

export const GlobalHeader: React.FC<GlobalHeaderProps> = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [userData, setUserData] = useState<{
    name: string;
    avatar?: string;
  } | null>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);
  
  // Check if user is authenticated (you can implement your own logic here)
  const isAuthenticated = location.pathname !== '/signin';

  // Load user data from localStorage
  useEffect(() => {
    if (isAuthenticated) {
      try {
        const onboardingData = localStorage.getItem('onboardingData');
        if (onboardingData) {
          const data = JSON.parse(onboardingData);
          setUserData({
            name: data.name || 'User',
            avatar: data.avatar
          });
        } else {
          setUserData({
            name: 'User',
            avatar: undefined
          });
        }
      } catch (error) {
        console.error('Error loading user data:', error);
        setUserData({
          name: 'User',
          avatar: undefined
        });
      }
    }
  }, [isAuthenticated]);

  // Listen for onboarding data updates to keep avatar in sync
  useEffect(() => {
    const handleUpdate = () => {
      try {
        const onboardingData = localStorage.getItem('onboardingData');
        if (onboardingData) {
          const data = JSON.parse(onboardingData);
          setUserData(prev => ({
            name: data.name || prev?.name || 'User',
            avatar: data.avatar
          }));
        }
      } catch (e) {
        /* noop */
      }
    };
    window.addEventListener('onboardingDataUpdated', handleUpdate);
    return () => window.removeEventListener('onboardingDataUpdated', handleUpdate);
  }, []);

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setShowUserDropdown(false);
      }
    };

    if (showUserDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showUserDropdown]);

  const handleUserMenuClick = () => {
    setShowUserDropdown(!showUserDropdown);
  };

  const handleSignOut = () => {
    // Clear user data and redirect to sign in
    localStorage.removeItem('onboardingData');
    setUserData(null);
    setShowUserDropdown(false);
    navigate('/signin');
  };

  return (
    <header className="global-header">
      <div className="global-header__content">
        {/* Logo and Navigation */}
        <div className="global-header__left">
          <Link to="/" className="global-header__logo-link">
            <img 
              src={motorTrendLogo} 
              alt="MotorTrend" 
              className="global-header__logo"
            />
          </Link>
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
            <div className="global-header__user-menu" ref={userMenuRef}>
              <button 
                className="global-header__user-btn" 
                onClick={handleUserMenuClick}
                aria-label="User menu"
              >
                {userData?.avatar ? (
                  <img 
                    src={userData.avatar} 
                    alt={userData.name}
                    className="global-header__user-avatar"
                  />
                ) : (
                  <div className="global-header__user-avatar global-header__user-avatar--default">
                    <img 
                      src="https://d2kde5ohu8qb21.cloudfront.net/files/68f3fc9ccfecd100026f4650/mtlogo.png" 
                      alt="MotorTrend" 
                      className="global-header__user-avatar-img"
                    />
                  </div>
                )}
                <Icon name="keyboard_arrow_down" size={16} className="global-header__dropdown-arrow" />
              </button>
              
              {showUserDropdown && (
                <div className="global-header__user-dropdown">
                  <div className="global-header__user-info">
                    <div className="global-header__user-name">{userData?.name}</div>
                    <div className="global-header__user-email">user@example.com</div>
                  </div>
                  <div className="global-header__dropdown-divider"></div>
                  <button 
                    className="global-header__dropdown-item"
                    onClick={() => {
                      navigate('/profile');
                      setShowUserDropdown(false);
                    }}
                  >
                    <Icon name="person" size={16} />
                    Profile
                  </button>
                  <button 
                    className="global-header__dropdown-item"
                    onClick={() => {
                      navigate('/profile?tab=saved-items');
                      setShowUserDropdown(false);
                    }}
                  >
                    <Icon name="bookmark" size={16} />
                    Saved Items
                  </button>
                  <button 
                    className="global-header__dropdown-item"
                    onClick={() => {
                      navigate('/profile?tab=settings');
                      setShowUserDropdown(false);
                    }}
                  >
                    <Icon name="settings" size={16} />
                    Settings
                  </button>
                  <div className="global-header__dropdown-divider"></div>
                  <button 
                    className="global-header__dropdown-item global-header__dropdown-item--signout"
                    onClick={handleSignOut}
                  >
                    <Icon name="logout" size={16} />
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button 
              className="global-header__sign-in-btn"
              onClick={() => navigate('/signin')}
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

