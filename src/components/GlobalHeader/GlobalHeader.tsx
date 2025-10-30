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

export interface GlobalHeaderProps {
  onSignInClick?: () => void;
  onProfileClick?: () => void;
  isAuthenticated?: boolean;
}

const navigationItems = [
  { 
    label: 'Buy / Research Cars', 
    href: '#',
    subItems: [
      { label: 'New Cars', href: '#' },
      { label: 'Used Cars', href: '#' },
      { label: 'Car Reviews', href: '#' },
      { label: 'Rankings & Awards', href: '#' },
      { label: 'Compare Vehicles', href: '#' },
      { label: 'EV Hub', href: '#' }
    ]
  },
  { 
    label: 'News & Reviews', 
    href: '#',
    subItems: [
      { label: 'Latest News', href: '#' },
      { label: 'Expert Reviews', href: '#' },
      { label: 'First Drives', href: '#' },
      { label: 'Long-Term Tests', href: '#' },
      { label: 'Industry Trends', href: '#' }
    ]
  },
  { 
    label: 'Videos', 
    href: '#',
    subItems: [
      { label: 'Latest Videos', href: '#' },
      { label: 'Editorial Features', href: '#' },
      { label: 'Car Walkarounds & Reviews', href: '#' },
      { label: 'How-To & Explainers', href: '#' },
      { label: 'Motorsports Highlights', href: '#' }
    ]
  },
  { 
    label: 'Features & Gear', 
    href: '#',
    subItems: [
      { label: 'Feature Stories', href: '#' },
      { label: 'Gear & Accessories', href: '#' },
      { label: 'Car Culture', href: '#' },
      { label: 'Events', href: '#' }
    ]
  },
  { 
    label: 'Community', 
    href: '#',
    subItems: [
      { label: 'Forums', href: '#' },
      { label: 'Contests', href: '#' },
      { label: 'Car Clubs', href: '#' },
      { label: 'Events Calendar', href: '#' }
    ]
  }
];

export const GlobalHeader: React.FC<GlobalHeaderProps> = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [userData, setUserData] = useState<{
    name: string;
    avatar?: string;
  } | null>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const navMenuRef = useRef<HTMLDivElement>(null);
  
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
          setUserData(prev => {
            const newData = {
              name: data.name || prev?.name || 'User',
              avatar: data.avatar
            };
            console.log('GlobalHeader: Setting user data to:', newData);
            return newData;
          });
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
          setUserData(prev => {
            const newData = {
              name: data.name || prev?.name || 'User',
              avatar: data.avatar
            };
            console.log('GlobalHeader: Setting user data from storage to:', newData);
            return newData;
          });
        } catch (error) {
          console.error('Error parsing storage data:', error);
        }
      }
    });

    // Also check for updates when the window regains focus
    window.addEventListener('focus', handleUpdate);
    
    // Also add a periodic check to ensure data stays in sync
    const intervalId = setInterval(() => {
      try {
        const onboardingData = localStorage.getItem('onboardingData');
        if (onboardingData) {
          const data = JSON.parse(onboardingData);
          setUserData(prev => {
            if (prev?.name !== data.name || prev?.avatar !== data.avatar) {
              console.log('GlobalHeader: Periodic check - data changed from', prev, 'to', { name: data.name, avatar: data.avatar });
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
    }, 500); // Check every 500ms for more responsive updates

    return () => {
      window.removeEventListener('onboardingDataUpdated', handleUpdate);
      window.removeEventListener('storage', handleUpdate);
      window.removeEventListener('focus', handleUpdate);
      clearInterval(intervalId);
    };
  }, []);

  // Handle click outside to close dropdowns
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setShowUserDropdown(false);
      }
      if (navMenuRef.current && !navMenuRef.current.contains(event.target as Node)) {
        setActiveDropdown(null);
      }
    };

    if (showUserDropdown || activeDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showUserDropdown, activeDropdown]);

  const handleUserMenuClick = () => {
    setShowUserDropdown(!showUserDropdown);
  };

  const handleNavHover = (label: string) => {
    setActiveDropdown(label);
  };

  const handleNavLeave = () => {
    setActiveDropdown(null);
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
          <nav className="global-header__nav" ref={navMenuRef}>
            {navigationItems.map((item) => (
              <div 
                key={item.label} 
                className="global-header__nav-item"
                onMouseEnter={() => handleNavHover(item.label)}
                onMouseLeave={handleNavLeave}
              >
                <a 
                  href={item.href} 
                  className="global-header__nav-link"
                >
                  {item.label}
                  <Icon name="keyboard_arrow_down" size={16} />
                </a>
                {activeDropdown === item.label && item.subItems && (
                  <div className="global-header__dropdown">
                    {item.subItems.map((subItem) => (
                      <a 
                        key={subItem.label}
                        href={subItem.href} 
                        className="global-header__dropdown-item"
                      >
                        {subItem.label}
                      </a>
                    ))}
                  </div>
                )}
              </div>
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
                    key={userData.avatar} // Force re-render when avatar changes
                    src={userData.avatar} 
                    alt={userData.name || 'User'} 
                    className="global-header__user-avatar-img"
                  />
                ) : (
                  <img 
                    src="https://d2kde5ohu8qb21.cloudfront.net/files/68fabbe380bc4f00028943ef/mt40.svg" 
                    alt="MotorTrend" 
                    className="global-header__user-avatar-img"
                  />
                )}
              </button>
              
              {showUserDropdown && (
                <div className="global-header__user-dropdown">
                  <div className="global-header__user-info">
                    <div className="global-header__user-avatar">
                      {userData?.avatar ? (
                        <img 
                          key={userData.avatar} // Force re-render when avatar changes
                          src={userData.avatar} 
                          alt={userData.name || 'User'} 
                          className="global-header__user-avatar-img"
                        />
                      ) : (
                        <img 
                          src="https://d2kde5ohu8qb21.cloudfront.net/files/68fabbe380bc4f00028943ef/mt40.svg" 
                          alt="MotorTrend" 
                          className="global-header__user-avatar-img"
                        />
                      )}
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

