/**
 * Global Header Component
 * Based on Figma Community design system
 */

import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import './GlobalHeader.css';
// Using MotorTrend main logo from URL
const motorTrendLogo = 'https://d2kde5ohu8qb21.cloudfront.net/files/68f6570b3ed26800022d87b6/mt-logo2.svg';
import Icon from '../Icon';
import { useResponsiveNavigation } from '../../hooks/useResponsiveNavigation';

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
  
  // Use responsive navigation hook
  const { visibleItems, hiddenItems, navRef, showMoreMenu, setShowMoreMenu } = useResponsiveNavigation(navigationItems);
  
  // Check if user is authenticated (you can implement your own logic here)
  const isAuthenticated = location.pathname !== '/signin';

  // Load user data from localStorage
  useEffect(() => {
    if (isAuthenticated) {
      try {
        const onboardingData = localStorage.getItem('onboardingData');
        console.log('GlobalHeader: Loading user data from localStorage:', onboardingData);
        if (onboardingData) {
          const data = JSON.parse(onboardingData);
          console.log('GlobalHeader: Parsed user data:', data);
          setUserData({
            name: data.name || 'User',
            avatar: data.avatar
          });
        } else {
          console.log('GlobalHeader: No onboarding data found, using default');
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
          console.log('GlobalHeader: Updating user data from event:', data);
          setUserData(prev => ({
            name: data.name || prev?.name || 'User',
            avatar: data.avatar
          }));
        }
      } catch (e) {
        console.error('Error updating user data:', e);
      }
    };
    
    // Listen for custom events
    window.addEventListener('onboardingDataUpdated', handleUpdate);
    
    // Also listen for storage events (when localStorage changes in other tabs)
    window.addEventListener('storage', (e) => {
      if (e.key === 'onboardingData' && e.newValue) {
        try {
          const data = JSON.parse(e.newValue);
          console.log('GlobalHeader: Updating user data from storage event:', data);
          setUserData(prev => ({
            name: data.name || prev?.name || 'User',
            avatar: data.avatar
          }));
        } catch (error) {
          console.error('Error parsing storage data:', error);
        }
      }
    });
    
    // Also add a periodic check to ensure data stays in sync
    const intervalId = setInterval(() => {
      try {
        const onboardingData = localStorage.getItem('onboardingData');
        if (onboardingData) {
          const data = JSON.parse(onboardingData);
          setUserData(prev => {
            if (prev?.name !== data.name) {
              console.log('GlobalHeader: Periodic check - name changed from', prev?.name, 'to', data.name);
              return {
                name: data.name || 'User',
                avatar: data.avatar
              };
            }
            return prev;
          });
        }
      } catch (error) {
        console.error('Error in periodic check:', error);
      }
    }, 1000); // Check every second

    return () => {
      window.removeEventListener('onboardingDataUpdated', handleUpdate);
      window.removeEventListener('storage', handleUpdate);
      clearInterval(intervalId);
    };
  }, []);

  // Handle click outside to close dropdowns
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setShowUserDropdown(false);
      }
      // Close more menu if clicking outside
      if (!(event.target as Element).closest('.global-header__more-menu')) {
        setShowMoreMenu(false);
      }
    };

    if (showUserDropdown || showMoreMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showUserDropdown, showMoreMenu]);

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
          <nav className="global-header__nav" ref={navRef}>
            {visibleItems.map((item) => (
              <a 
                key={item.label} 
                href={item.href} 
                className="global-header__nav-link"
              >
                {item.label}
              </a>
            ))}
            {hiddenItems.length > 0 && (
              <div className="global-header__more-menu">
                <button 
                  className="global-header__more-btn"
                  onClick={() => setShowMoreMenu(!showMoreMenu)}
                  aria-label="More navigation items"
                >
                  More
                  <Icon name="expand_more" size={16} />
                </button>
                {showMoreMenu && (
                  <div className="global-header__more-dropdown">
                    {hiddenItems.map((item) => (
                      <a 
                        key={item.label} 
                        href={item.href} 
                        className="global-header__more-link"
                        onClick={() => setShowMoreMenu(false)}
                      >
                        {item.label}
                      </a>
                    ))}
                  </div>
                )}
              </div>
            )}
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
                <img 
                  src="https://d2kde5ohu8qb21.cloudfront.net/files/68fabbe380bc4f00028943ef/mt40.svg" 
                  alt="MotorTrend" 
                  className="global-header__user-avatar-img"
                />
              </button>
              
              {showUserDropdown && (
                <div className="global-header__user-dropdown">
                  <div className="global-header__user-info">
                    <div className="global-header__user-avatar">
                      <img 
                        src="https://d2kde5ohu8qb21.cloudfront.net/files/68fabbe380bc4f00028943ef/mt40.svg" 
                        alt="MotorTrend" 
                        className="global-header__user-avatar-img"
                      />
                    </div>
                    <div className="global-header__user-details">
                      <div className="global-header__user-name">{userData?.name || 'User'}</div>
                      <div className="global-header__user-email">user@example.com</div>
                    </div>
                  </div>
                  <div className="global-header__dropdown-divider"></div>
                  <button 
                    className="global-header__dropdown-item"
                    onClick={() => {
                      navigate('/my-account/profile');
                      setShowUserDropdown(false);
                    }}
                  >
                    <Icon name="account_circle" size={16} />
                    Profile
                  </button>
                  <button 
                    className="global-header__dropdown-item"
                    onClick={() => {
                      navigate('/my-account/saved-items');
                      setShowUserDropdown(false);
                    }}
                  >
                    <Icon name="bookmark_border" size={16} />
                    Saved Items
                  </button>
                  <button 
                    className="global-header__dropdown-item"
                    onClick={() => {
                      navigate('/my-account/subscriptions');
                      setShowUserDropdown(false);
                    }}
                  >
                    <Icon name="newspaper" size={16} />
                    Subscriptions
                  </button>
                  <button 
                    className="global-header__dropdown-item"
                    onClick={() => {
                      navigate('/my-account/settings');
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

