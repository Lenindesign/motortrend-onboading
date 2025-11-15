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
import { parseVehicleName } from '../../utils/vehicleImages';

// Car database for search autocomplete (same as VehicleSearch component)
const carDatabase = [
  '2015 Subaru WRX', '2021 Subaru WRX', '2018 Subaru WRX', '2017 Subaru WRX', '2024 Subaru WRX', '2022 Subaru WRX', '2023 Subaru WRX', '2025 Subaru WRX',
  '2020 Honda Civic', '2021 Honda Civic', '2022 Honda Civic', '2023 Honda Civic', '2024 Honda Civic',
  '2019 Toyota Camry', '2020 Toyota Camry', '2021 Toyota Camry', '2022 Toyota Camry', '2023 Toyota Camry', '2024 Toyota Camry',
  '2020 Ford Mustang', '2021 Ford Mustang', '2022 Ford Mustang', '2023 Ford Mustang', '2024 Ford Mustang',
  '2021 Tesla Model 3', '2022 Tesla Model 3', '2023 Tesla Model 3', '2024 Tesla Model 3',
  '2020 BMW 3 Series', '2021 BMW 3 Series', '2022 BMW 3 Series', '2023 BMW 3 Series', '2024 BMW 3 Series',
  '2019 Audi A4', '2020 Audi A4', '2021 Audi A4', '2022 Audi A4', '2023 Audi A4', '2024 Audi A4',
  '2020 Mercedes C-Class', '2021 Mercedes C-Class', '2022 Mercedes C-Class', '2023 Mercedes C-Class', '2024 Mercedes C-Class',
  '2021 Nissan Altima', '2022 Nissan Altima', '2023 Nissan Altima', '2024 Nissan Altima',
  '2020 Chevrolet Camaro', '2021 Chevrolet Camaro', '2022 Chevrolet Camaro', '2023 Chevrolet Camaro', '2024 Chevrolet Camaro',
  '2021 Dodge Challenger', '2022 Dodge Challenger', '2023 Dodge Challenger', '2024 Dodge Challenger',
  '2020 Lexus IS', '2021 Lexus IS', '2022 Lexus IS', '2023 Lexus IS', '2024 Lexus IS',
  '2021 Infiniti Q50', '2022 Infiniti Q50', '2023 Infiniti Q50', '2024 Infiniti Q50',
  '2020 Acura TLX', '2021 Acura TLX', '2022 Acura TLX', '2023 Acura TLX', '2024 Acura TLX',
  '2021 Genesis G70', '2022 Genesis G70', '2023 Genesis G70', '2024 Genesis G70',
  '2020 Volvo S60', '2021 Volvo S60', '2022 Volvo S60', '2023 Volvo S60', '2024 Volvo S60',
  '2021 Cadillac CT4', '2022 Cadillac CT4', '2023 Cadillac CT4', '2024 Cadillac CT4',
  '2020 Jaguar XE', '2021 Jaguar XE', '2022 Jaguar XE', '2023 Jaguar XE', '2024 Jaguar XE',
  '2021 Alfa Romeo Giulia', '2022 Alfa Romeo Giulia', '2023 Alfa Romeo Giulia', '2024 Alfa Romeo Giulia',
  '2020 Kia Stinger', '2021 Kia Stinger', '2022 Kia Stinger', '2023 Kia Stinger', '2024 Kia Stinger',
  '2021 Hyundai Sonata', '2022 Hyundai Sonata', '2023 Hyundai Sonata', '2024 Hyundai Sonata',
  '2020 Mazda6', '2021 Mazda6', '2022 Mazda6', '2023 Mazda6', '2024 Mazda6',
  '2020 Subaru Legacy', '2021 Subaru Legacy', '2022 Subaru Legacy', '2023 Subaru Legacy', '2024 Subaru Legacy',
  '2020 Subaru Impreza', '2021 Subaru Impreza', '2022 Subaru Impreza', '2023 Subaru Impreza', '2024 Subaru Impreza',
  '2020 Subaru Outback', '2021 Subaru Outback', '2022 Subaru Outback', '2023 Subaru Outback', '2024 Subaru Outback',
  '2020 Subaru Forester', '2021 Subaru Forester', '2022 Subaru Forester', '2023 Subaru Forester', '2024 Subaru Forester',
  '2020 Subaru Ascent', '2021 Subaru Ascent', '2022 Subaru Ascent', '2023 Subaru Ascent', '2024 Subaru Ascent',
  '2020 Subaru Crosstrek', '2021 Subaru Crosstrek', '2022 Subaru Crosstrek', '2023 Subaru Crosstrek', '2024 Subaru Crosstrek',
  '2020 Subaru BRZ', '2021 Subaru BRZ', '2022 Subaru BRZ', '2023 Subaru BRZ', '2024 Subaru BRZ',
  '2020 Subaru WRX STI', '2021 Subaru WRX STI', '2022 Subaru WRX STI', '2023 Subaru WRX STI', '2024 Subaru WRX STI',
  '2020 Ford F-150', '2021 Ford F-150', '2022 Ford F-150', '2023 Ford F-150', '2024 Ford F-150', '2025 Ford F-150', '2026 Ford F-150',
  '2020 Ford Explorer', '2021 Ford Explorer', '2022 Ford Explorer', '2023 Ford Explorer', '2024 Ford Explorer',
  '2020 Ford Escape', '2021 Ford Escape', '2022 Ford Escape', '2023 Ford Escape', '2024 Ford Escape',
  '2020 Ford Edge', '2021 Ford Edge', '2022 Ford Edge', '2023 Ford Edge', '2024 Ford Edge',
  '2020 Ford Bronco', '2021 Ford Bronco', '2022 Ford Bronco', '2023 Ford Bronco', '2024 Ford Bronco',
  '2020 Ford Bronco Sport', '2021 Ford Bronco Sport', '2022 Ford Bronco Sport', '2023 Ford Bronco Sport', '2024 Ford Bronco Sport',
  '2020 Ford Ranger', '2021 Ford Ranger', '2022 Ford Ranger', '2023 Ford Ranger', '2024 Ford Ranger',
  '2020 Ford Maverick', '2021 Ford Maverick', '2022 Ford Maverick', '2023 Ford Maverick', '2024 Ford Maverick',
  '2020 Chevrolet Silverado', '2021 Chevrolet Silverado', '2022 Chevrolet Silverado', '2023 Chevrolet Silverado', '2024 Chevrolet Silverado',
  '2020 Toyota RAV4', '2021 Toyota RAV4', '2022 Toyota RAV4', '2023 Toyota RAV4', '2024 Toyota RAV4',
  '2020 Honda CR-V', '2021 Honda CR-V', '2022 Honda CR-V', '2023 Honda CR-V', '2024 Honda CR-V',
  '2020 Mazda CX-5', '2021 Mazda CX-5', '2022 Mazda CX-5', '2023 Mazda CX-5', '2024 Mazda CX-5',
  '2020 Mazda CX-30', '2021 Mazda CX-30', '2022 Mazda CX-30', '2023 Mazda CX-30', '2024 Mazda CX-30'
];

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
      { label: 'Used Cars', href: '#' },
      { label: 'Car Reviews', href: '#' },
      { label: 'Rankings & Awards', href: '/rankings-awards' },
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
  const [showProfileNotification, setShowProfileNotification] = useState(false);
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

  // Check for profile notification (blinking dot) visibility
  useEffect(() => {
    const checkNotification = () => {
      const onboardingComplete = localStorage.getItem('onboardingComplete') === 'true';
      const notificationSeen = localStorage.getItem('profileNotificationSeen') === 'true';
      setShowProfileNotification(onboardingComplete && !notificationSeen);
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
      .slice(0, 6); // Limit to 6 results
      
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
                      subItem.href === '#' ? (
                        <a 
                          key={subItem.label}
                          href={subItem.href} 
                          className="global-header__dropdown-item"
                        >
                          {subItem.label}
                        </a>
                      ) : (
                        <Link 
                          key={subItem.label}
                          to={subItem.href} 
                          className="global-header__dropdown-item"
                          onClick={() => setActiveDropdown(null)}
                        >
                          {subItem.label}
                        </Link>
                      )
                    ))}
                  </div>
                )}
              </div>
            ))}
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
                  {showProfileNotification && (
                    <span className="global-header__profile-notification-dot" aria-label="New profile notification"></span>
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

