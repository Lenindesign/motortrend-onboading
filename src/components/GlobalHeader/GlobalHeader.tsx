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
import { Badge } from '../../design-system/components';
import { parseVehicleName } from '../../utils/vehicleImages';
import { carDatabase } from '../../utils/vehicleDatabase';

export interface GlobalHeaderProps {
  onSignInClick?: () => void;
  onProfileClick?: () => void;
  isAuthenticated?: boolean;
}

const navigationItems = [
  { 
    label: 'Buy / Research Cars', 
    href: '/vehicles',
    subItems: [
      { label: 'New Cars', href: '/new-cars' },
      { label: 'Used Cars', href: '/used-cars' },
      { label: 'Car Reviews', href: '/car-reviews' },
      { label: 'Rankings & Awards', href: '/rankings-awards' },
      { label: 'Compare Vehicles', href: '/compare-vehicles' },
      { label: 'EV Hub', href: '/ev-hub' }
    ]
  },
  { 
    label: 'News & Reviews', 
    href: '/news-reviews',
    subItems: [
      { label: 'Latest News', href: '/latest-news' },
      { label: 'Expert Reviews', href: '/car-reviews' },
      { label: 'First Drives', href: '#' },
      { label: 'Long-Term Tests', href: '#' },
      { label: 'Industry Trends', href: '#' }
    ]
  },
  { 
    label: 'Videos', 
    href: '/videos',
    subItems: [
      { label: 'Latest Videos', href: '/videos' },
      { label: 'Editorial Features', href: '#' },
      { label: 'Car Walkarounds & Reviews', href: '#' },
      { label: 'How-To & Explainers', href: '#' },
      { label: 'Motorsports Highlights', href: '#' }
    ]
  },
  { 
    label: 'Community', 
    href: '/community',
    subItems: [
      { label: 'Forums', href: '/community' },
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

  // Check if a section is active based on current pathname
  const isSectionActive = (item: typeof navigationItems[0]): boolean => {
    const pathname = location.pathname;
    
    // Check if current path matches the section's main href
    if (item.href !== '#' && pathname === item.href) {
      return true;
    }
    
    // For "Buy / Research Cars" section, also check vehicle detail pages
    if (item.href === '/vehicles' && pathname.startsWith('/vehicles/')) {
      // Exclude paths that belong to other sections
      const excludedPaths = ['/vehicles/new-cars', '/vehicles/used-cars'];
      if (!excludedPaths.some(excluded => pathname.startsWith(excluded))) {
        return true;
      }
    }
    
    // Check if current path matches any subItem href
    if (item.subItems) {
      return item.subItems.some(subItem => {
        if (subItem.href === '#') return false;
        // Exact match
        if (pathname === subItem.href) return true;
        return false;
      });
    }
    
    return false;
  };

  // Check if a subItem is active
  const isSubItemActive = (subItemHref: string): boolean => {
    const pathname = location.pathname;
    if (subItemHref === '#') return false;
    
    // Exact match
    if (pathname === subItemHref) return true;
    
    // For vehicle details pages (/vehicles/:year/:make/:model), check if subItem is /vehicles
    if (subItemHref === '/vehicles' && pathname.startsWith('/vehicles/')) {
      // Only match if it's a vehicle detail page (has 3 path segments after /vehicles/)
      const pathSegments = pathname.split('/').filter(Boolean);
      if (pathSegments.length === 4 && pathSegments[0] === 'vehicles') {
        return true;
      }
    }
    
    return false;
  };
  const [userData, setUserData] = useState<{
    name: string;
    avatar?: string;
  } | null>(null);
  const [notificationCount, setNotificationCount] = useState(0);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const navMenuRef = useRef<HTMLDivElement>(null);
  
  // Search state
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredCars, setFilteredCars] = useState<string[]>([]);
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);
  const [highlightedSearchIndex, setHighlightedSearchIndex] = useState(-1);
  const searchRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  
  // Check if user is authenticated by checking for onboarding data
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check authentication status on mount and when pathname changes
  useEffect(() => {
    const checkAuth = () => {
      try {
        const onboardingData = localStorage.getItem('onboardingData');
        // User is authenticated if they have onboarding data (completed sign in)
        const authenticated = !!onboardingData;
        setIsAuthenticated(authenticated);
        
        // Only load user data if authenticated
        if (authenticated && onboardingData) {
          const data = JSON.parse(onboardingData);
          console.log('GlobalHeader: Loading user data from localStorage:', data);
          setUserData({
            name: data.name || 'User',
            avatar: data.avatar
          });
        } else {
          setUserData(null);
        }
      } catch (error) {
        console.error('Error checking authentication:', error);
        setIsAuthenticated(false);
        setUserData(null);
      }
    };

    // Check on mount and when pathname changes
    checkAuth();

    // Listen for storage changes (when user signs in/out in another tab)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'onboardingData') {
        checkAuth();
      }
    };

    // Listen for custom events (when user signs in/out in same tab)
    const handleCustomEvent = () => {
      checkAuth();
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('onboardingDataUpdated', handleCustomEvent);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('onboardingDataUpdated', handleCustomEvent);
    };
  }, [location.pathname]);

  // Check for notification count
  useEffect(() => {
    const checkNotification = () => {
      const onboardingComplete = localStorage.getItem('onboardingComplete') === 'true';
      const notificationSeen = localStorage.getItem('profileNotificationSeen') === 'true';
      
      // Calculate notification count (profile completion + new features)
      let count = 0;
      if (onboardingComplete && !notificationSeen) {
        count += 1; // Profile completion notification
      }
      setNotificationCount(count);
    };

    // Check on mount
    checkNotification();

    // Listen for storage changes
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'onboardingComplete' || e.key === 'profileNotificationSeen') {
        checkNotification();
      }
    };

    // Listen for custom events
    const handleCustomEvent = () => {
      checkNotification();
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('profileNotificationUpdated', handleCustomEvent);

    // Periodic check
    const intervalId = setInterval(checkNotification, 500);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('profileNotificationUpdated', handleCustomEvent);
      clearInterval(intervalId);
    };
  }, []);

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

  // Filter cars based on search query
  useEffect(() => {
    if (searchQuery.length > 0) {
      const queryLower = searchQuery.toLowerCase().trim();
      const queryWords = queryLower.split(/\s+/).filter(word => word.length > 0);
      
      const filtered = carDatabase.filter(car => {
        const carLower = car.toLowerCase();
        // Check if all words in the query appear in the vehicle name (order-independent)
        return queryWords.every(word => carLower.includes(word));
      })
      .sort((a, b) => {
        // Extract year from vehicle name (e.g., "2025 Subaru WRX" -> 2025)
        const yearA = parseInt(a.match(/\d{4}/)?.[0] || '0');
        const yearB = parseInt(b.match(/\d{4}/)?.[0] || '0');
        // Sort by year descending (newest first)
        return yearB - yearA;
      })
      .slice(0, 15); // Limit to 15 results
      
      setFilteredCars(filtered);
      setShowSearchDropdown(true);
    } else {
      setFilteredCars([]);
      setShowSearchDropdown(false);
    }
    setHighlightedSearchIndex(-1);
  }, [searchQuery]);

  // Handle click outside to close dropdowns
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setShowUserDropdown(false);
      }
      if (navMenuRef.current && !navMenuRef.current.contains(event.target as Node)) {
        setActiveDropdown(null);
      }
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSearchDropdown(false);
      }
    };

    if (showUserDropdown || activeDropdown || showSearchDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showUserDropdown, activeDropdown, showSearchDropdown]);

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

  // Search handlers
  const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
  };

  const handleVehicleSelect = (vehicleName: string) => {
    const { year, make, model } = parseVehicleName(vehicleName);
    setSearchQuery('');
    setShowSearchDropdown(false);
    navigate(`/vehicles/${year}/${make}/${model}`);
  };

  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setHighlightedSearchIndex(prev => 
          prev < filteredCars.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setHighlightedSearchIndex(prev => prev > 0 ? prev - 1 : -1);
        break;
      case 'Enter':
        e.preventDefault();
        if (highlightedSearchIndex >= 0 && filteredCars[highlightedSearchIndex]) {
          handleVehicleSelect(filteredCars[highlightedSearchIndex]);
        } else if (filteredCars.length > 0) {
          handleVehicleSelect(filteredCars[0]);
        }
        break;
      case 'Escape':
        setShowSearchDropdown(false);
        setHighlightedSearchIndex(-1);
        break;
    }
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
            {navigationItems.map((item) => {
              const isActive = isSectionActive(item);
              return (
                <div 
                  key={item.label} 
                  className={`global-header__nav-item ${isActive ? 'global-header__nav-item--active' : ''}`}
                  onMouseEnter={() => handleNavHover(item.label)}
                  onMouseLeave={handleNavLeave}
                >
                  <a 
                    href={item.href} 
                    className={`global-header__nav-link ${isActive ? 'global-header__nav-link--active' : ''}`}
                  >
                    {item.label}
                    <Icon name="keyboard_arrow_down" size={16} />
                  </a>
                  {activeDropdown === item.label && item.subItems && (
                    <div className="global-header__dropdown">
                      {item.subItems.map((subItem) => {
                        const isSubActive = isSubItemActive(subItem.href);
                        return subItem.href === '#' ? (
                          <a 
                            key={subItem.label}
                            href={subItem.href} 
                            className={`global-header__dropdown-item ${isSubActive ? 'global-header__dropdown-item--active' : ''}`}
                          >
                            {subItem.label}
                          </a>
                        ) : (
                          <Link 
                            key={subItem.label}
                            to={subItem.href} 
                            className={`global-header__dropdown-item ${isSubActive ? 'global-header__dropdown-item--active' : ''}`}
                            onClick={() => setActiveDropdown(null)}
                          >
                            {subItem.label}
                          </Link>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </nav>
        </div>

        {/* Search and Sign In */}
        <div className="global-header__right">
          <div className="global-header__search" ref={searchRef}>
            <div className="global-header__search-container">
              <Icon name="search" size={20} className="global-header__search-icon" />
              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={handleSearchInputChange}
                onKeyDown={handleSearchKeyDown}
                onFocus={() => searchQuery.length > 0 && setShowSearchDropdown(true)}
                placeholder="Search year, make, model..."
                className="global-header__search-input"
              />
            </div>
            {/* Search Dropdown */}
            {showSearchDropdown && filteredCars.length > 0 && (
              <div className="global-header__search-dropdown">
                {filteredCars.map((car, index) => (
                  <div
                    key={car}
                    className={`global-header__search-dropdown-item ${
                      index === highlightedSearchIndex ? 'global-header__search-dropdown-item--highlighted' : ''
                    }`}
                    onClick={() => handleVehicleSelect(car)}
                    onMouseEnter={() => setHighlightedSearchIndex(index)}
                  >
                    {car}
                  </div>
                ))}
              </div>
            )}
          </div>
          {isAuthenticated ? (
            <div className="global-header__user-menu" ref={userMenuRef}>
              <button 
                className="global-header__user-btn" 
                onClick={handleUserMenuClick}
                aria-label="User menu"
              >
                <div className="global-header__user-avatar-wrapper">
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
                  {notificationCount > 0 && (
                    <div className="global-header__notification-badge">
                      <Badge variant="error" size="sm" aria-label={`${notificationCount} new notification${notificationCount > 1 ? 's' : ''}`}>
                        {notificationCount}
                      </Badge>
                    </div>
                  )}
                </div>
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
                    Saved
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

