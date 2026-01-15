/**
 * Global Header Component
 * Based on Figma Community design system
 * Migrated to inline React styles - no external CSS dependency
 */

import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
// Using MotorTrend main logo from URL
const motorTrendLogo = 'https://d2kde5ohu8qb21.cloudfront.net/files/68f6570b3ed26800022d87b6/mt-logo2.svg';
import Icon from '../Icon';
import { Badge } from '../../design-system/components';
import { parseVehicleName } from '../../utils/vehicleImages';
import { searchVehicles, getFilterOptions, getVehicles } from '../../api/vehiclesApi';
import { addSearchedVehicle } from '../PersonalizedVehicles';

export interface GlobalHeaderProps {
  onSignInClick?: () => void;
  onProfileClick?: () => void;
  isAuthenticated?: boolean;
}

const navigationItems = [
  { 
    label: 'News + Stories', 
    href: '/news',
    hasMegaDropdown: true,
    megaDropdown: {
      type: 'news',
      newsCategories: {
        allNews: { label: 'All News', href: '/news', isActive: true },
        leftColumn: [
          { label: 'SUV News', href: '/news/suv' },
          { label: 'Truck News', href: '/news/truck' },
          { label: 'Sedan News', href: '/news/sedan' }
        ],
        rightColumn: [
          { label: 'EV News', href: '/news/electric' },
          { label: 'Hybrid Car News', href: '/news/hybrid' },
          { label: 'EV Insights', href: '/news/ev' }
        ]
      },
      storiesCategories: [
        { label: 'All Stories', href: '/stories', isActive: true },
        { label: 'Future Cars', href: '/stories/future-cars' },
        { label: 'Car Lists', href: '/stories/car-lists' },
        { label: 'Events', href: '/events', isActive: true }
      ],
      featuredContent: {
        title: 'The Mazda CX-5 is geared for whatever you dream up',
        image: 'https://d2kde5ohu8qb21.cloudfront.net/files/690a603369a9550002fb94bc/021-2026-honda-passport-rtl.jpg',
        badge: 'Sponsored Content',
        href: '/articles/mazda-cx-5'
      }
    },
    subItems: [
      { label: 'Latest News', href: '/latest-news' },
      { label: 'Expert Reviews', href: '/car-reviews' },
      { label: 'First Drives', href: '#' },
      { label: 'Long-Term Tests', href: '#' }
    ]
  },
  { 
    label: 'Research Vehicles', 
    href: '/vehicles',
    hasMegaDropdown: true,
    megaDropdown: {
      type: 'research',
      leftColumn: {
        sections: [
          {
            title: 'Vehicle Reviews',
            href: '/reviews',
            links: [
              { label: 'First Drives', href: '/reviews/first-drives' },
              { label: 'First Tests', href: '/reviews/first-tests' },
              { label: 'Interior Reviews', href: '/reviews/interior' },
              { label: 'Long Term reviews', href: '/reviews/long-term' },
            ]
          },
          {
            title: 'Compare Vehicles',
            href: '/compare',
            links: [
              { label: 'Comparison Tests', href: '/compare/tests' },
            ]
          },
          {
            title: 'More Reviews',
            links: [
              { label: 'Gear Reviews', href: '/reviews/gear' },
            ]
          }
        ]
      },
      middleColumn: {
        title: 'Research Vehicles',
        subtitle: 'by Body Style:',
        bodyStyles: [
          { label: 'SUVs', href: '/vehicles/suv' },
          { label: 'Sedans', href: '/vehicles/sedan' },
          { label: 'Trucks', href: '/vehicles/truck' },
          { label: 'Coupes', href: '/vehicles/coupe' },
          { label: 'Vans', href: '/vehicles/minivan' },
          { label: 'Hybrids', href: '/vehicles/hybrid' },
          { label: 'Electrics', href: '/vehicles/electric' },
          { label: 'Hatchbacks', href: '/vehicles/hatchback' },
          { label: 'Luxury SUVs', href: '/vehicles/luxury-suv' },
          { label: 'Luxury Cars', href: '/vehicles/luxury-car' },
          { label: 'Sports Cars', href: '/vehicles/sports-car' },
          { label: 'Convertibles', href: '/vehicles/convertible' },
        ]
      },
      rightColumn: {
        title: 'By make/model and year:',
      }
    },
    subItems: [
      { label: 'All Vehicles', href: '/vehicles' },
      { label: 'Car Reviews', href: '/car-reviews' },
      { label: 'Compare Vehicles', href: '/compare-vehicles' },
      { label: 'EV Hub', href: '/ev-hub' }
    ]
  },
  { 
    label: 'Rankings + Awards', 
    href: '/rankings-awards',
    hasMegaDropdown: true,
    megaDropdown: {
      type: 'rankings',
      leftColumn: {
        title: 'MotorTrend Ultimate Car Rankings™',
        items: [
          { label: 'SUVs', icon: 'https://d2kde5ohu8qb21.cloudfront.net/files/692ca1db4fe990000234d324/nissanrogue1.svg', href: '/rankings/suv' },
          { label: 'Sedans', icon: 'https://d2kde5ohu8qb21.cloudfront.net/files/692ca1dde758ec00025fed17/sedans.svg', href: '/rankings/sedan' },
          { label: 'Trucks', icon: 'https://d2kde5ohu8qb21.cloudfront.net/files/692ca1df98f9de0002b0c1c1/pickups.svg', href: '/rankings/truck' },
          { label: 'Coupes', icon: 'https://d2kde5ohu8qb21.cloudfront.net/files/692ca1e098f9de0002b0c1c3/coupes.svg', href: '/rankings/coupe' },
          { label: 'Vans', icon: 'https://d2kde5ohu8qb21.cloudfront.net/files/692ca1e1e758ec00025fed1a/vans.svg', href: '/rankings/van' },
          { label: 'Hybrids', icon: 'https://d2kde5ohu8qb21.cloudfront.net/files/692ca1e2e758ec00025fed1c/hybrids.svg', href: '/rankings/hybrid' },
          { label: 'Electrics', icon: 'https://d2kde5ohu8qb21.cloudfront.net/files/692ca1e3e758ec00025fed1e/electrics.svg', href: '/rankings/electric' },
          { label: 'Hatchbacks', icon: 'https://d2kde5ohu8qb21.cloudfront.net/files/692ca1e44fe990000234d326/hatchbacks.svg', href: '/rankings/hatchback' },
          { label: 'Luxury SUVs', icon: 'https://d2kde5ohu8qb21.cloudfront.net/files/692ca1e57e044b0002dc4af2/luxurysuv.svg', href: '/rankings/luxury-suv' },
          { label: 'Luxury Cars', icon: 'https://d2kde5ohu8qb21.cloudfront.net/files/692ca1e6e758ec00025fed20/luxurycars.svg', href: '/rankings/luxury-car' },
          { label: 'Sports Cars', icon: 'https://d2kde5ohu8qb21.cloudfront.net/files/692ca1e77e044b0002dc4af3/sportscars.svg', href: '/rankings/sports-car' },
          { label: 'Convertibles', icon: 'https://d2kde5ohu8qb21.cloudfront.net/files/692ca1e83cdca50002cec96d/convertibles.svg', href: '/rankings/convertible' },
        ]
      },
      rightColumn: {
        title: 'Awards',
        subtitle: 'IntelliChoice Awards',
        items: [
          { title: 'PERFORMANCE VEHICLE OF THE YEAR', icon: 'https://d2kde5ohu8qb21.cloudfront.net/files/692caf463107440002a217ff/motortrendperformanceoftheyear.svg', href: '/awards/performance-vehicle-of-the-year' },
          { title: 'CAR OF THE YEAR', icon: 'https://d2kde5ohu8qb21.cloudfront.net/files/692caf453107440002a217fd/motortrendcaroftheyear.svg', href: '/vehicles/2026/Volkswagen/Golf-GTI-R' },
          { title: 'TRUCK OF THE YEAR', icon: 'https://d2kde5ohu8qb21.cloudfront.net/files/692caf443107440002a217fb/motortrendtruckoftheyear.svg', href: '/awards/truck-of-the-year' },
          { title: 'SUV OF THE YEAR', icon: 'https://d2kde5ohu8qb21.cloudfront.net/files/692caf433107440002a217f9/motortrendsuvoftheyear.svg', href: '/awards/suv-of-the-year' },
        ]
      }
    },
    subItems: [
      { label: 'Top 10 Lists', href: '/top-ten-management' },
      { label: 'Awards', href: '/awards' },
      { label: 'Comparisons', href: '/compare-vehicles' }
    ]
  },
  { 
    label: 'Buy + Sell', 
    href: '/buy-sell',
    hasMegaDropdown: true,
    megaDropdown: {
      type: 'buy-sell',
      leftColumn: {
        sections: [
          {
            title: 'Shop for Cars',
            links: [
              { label: 'Cars For Sale', href: '/cars-for-sale' },
              { label: 'MotorTrend Certified', href: '/certified' },
            ]
          },
          {
            title: 'Car Ownership',
            links: [
              { label: 'Sell Your Car', href: '/sell' },
              { label: 'What\'s My Car Worth?', href: '/trade-in-value' },
            ]
          }
        ]
      },
      middleColumn: {
        logo: 'https://d2kde5ohu8qb21.cloudfront.net/files/692ca3b608d7da000211b79d/marketplace-logo-motortrend-v31.svg',
        description: 'Find your new ride on MotorTrend\'s Collection of New and Used Cars.',
      },
      rightColumn: {
        adImage: 'https://d2kde5ohu8qb21.cloudfront.net/files/692ca3b808d7da000211b79f/ad.png',
        href: '/cars-for-sale' 
      }
    },
    subItems: [
      { label: 'New Cars', href: '/new-cars' },
      { label: 'Used Cars', href: '/used-cars' },
      { label: 'Sell Your Car', href: '/sell' }
    ]
  }
];

export const GlobalHeader: React.FC<GlobalHeaderProps> = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  
  // Responsive state
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [isLargeScreen, setIsLargeScreen] = useState(window.innerWidth >= 1280);
  
  // Hover states
  const [hoveredNavItem, setHoveredNavItem] = useState<string | null>(null);
  const [hoveredDropdownItem, setHoveredDropdownItem] = useState<string | null>(null);
  const [hoveredSearchItem, setHoveredSearchItem] = useState<number>(-1);
  const [hoveredUserDropdownItem, setHoveredUserDropdownItem] = useState<string | null>(null);
  const [isNewsletterHovered, setIsNewsletterHovered] = useState(false);
  const [isSignInHovered, setIsSignInHovered] = useState(false);
  const [_isUserBtnHovered, setIsUserBtnHovered] = useState(false);
  const [hoveredMegaLink, setHoveredMegaLink] = useState<string | null>(null);
  const [hoveredGridItem, setHoveredGridItem] = useState<string | null>(null);
  const [hoveredRankingItem, setHoveredRankingItem] = useState<string | null>(null);
  const [hoveredAwardItem, setHoveredAwardItem] = useState<string | null>(null);
  const [_isSearchFocused, setIsSearchFocused] = useState(false);
  const [isSubmitHovered, setIsSubmitHovered] = useState(false);
  
  // Responsive handler
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
      setIsLargeScreen(window.innerWidth >= 1280);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  // Inject keyframes for animations
  useEffect(() => {
    const styleId = 'global-header-styles';
    if (!document.getElementById(styleId)) {
      const style = document.createElement('style');
      style.id = styleId;
      style.textContent = `
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-8px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `;
      document.head.appendChild(style);
    }
    return () => {
      const existingStyle = document.getElementById(styleId);
      if (existingStyle) existingStyle.remove();
    };
  }, []);

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
  const researchVehiclesNavRef = useRef<HTMLDivElement>(null);
  const rankingsAwardsNavRef = useRef<HTMLDivElement>(null);
  const buySellNavRef = useRef<HTMLDivElement>(null);
  
  // Search state
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredCars, setFilteredCars] = useState<string[]>([]);
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);
  const [highlightedSearchIndex, setHighlightedSearchIndex] = useState(-1);
  const searchRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  
  // Our Brands dropdown state
  const [showBrandsDropdown, setShowBrandsDropdown] = useState(false);
  const brandsRef = useRef<HTMLDivElement>(null);
  const newsStoriesNavRef = useRef<HTMLDivElement>(null);
  const megaDropdownRef = useRef<HTMLDivElement>(null);
  const [indicatorLeft, setIndicatorLeft] = useState<number | null>(null);
  const [indicatorWidth, setIndicatorWidth] = useState<number | null>(null);
  const [contentLeft, setContentLeft] = useState<number | null>(null);
  // State to control the CSS transition class for the mega dropdown
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  
  // Research Vehicles Form State
  const [researchMake, setResearchMake] = useState('');
  const [researchModel, setResearchModel] = useState('');
  const [researchYear, setResearchYear] = useState('');
  const [availableMakes, setAvailableMakes] = useState<string[]>([]);
  const [availableModels, setAvailableModels] = useState<string[]>([]);
  const [availableYears, setAvailableYears] = useState<string[]>([]);

  // Buy + Sell Form State
  const [buySellMake, setBuySellMake] = useState('');
  const [buySellModel, setBuySellModel] = useState('');
  const [buySellZip, setBuySellZip] = useState('');
  const [availableBuySellModels, setAvailableBuySellModels] = useState<string[]>([]);

  // Initialize makes
  useEffect(() => {
    const { makes } = getFilterOptions();
    setAvailableMakes(makes);
  }, []);

  // Update models when make changes
  useEffect(() => {
    if (researchMake) {
      const vehicles = getVehicles({ make: [researchMake] });
      const models = [...new Set(vehicles.map(v => v.model))].sort();
      setAvailableModels(models);
      setResearchModel('');
      setResearchYear('');
    } else {
      setAvailableModels([]);
      setResearchModel('');
      setResearchYear('');
    }
  }, [researchMake]);

  // Update years when model changes
  useEffect(() => {
    if (researchMake && researchModel) {
      const vehicles = getVehicles({ make: [researchMake] });
      const modelVehicles = vehicles.filter(v => v.model === researchModel);
      const years = [...new Set(modelVehicles.map(v => v.year))].sort((a, b) => parseInt(b) - parseInt(a));
      setAvailableYears(years);
      setResearchYear('');
    } else {
      setAvailableYears([]);
      setResearchYear('');
    }
  }, [researchMake, researchModel]);

  // Update Buy + Sell models when make changes
  useEffect(() => {
    if (buySellMake) {
      const vehicles = getVehicles({ make: [buySellMake] });
      const models = [...new Set(vehicles.map(v => v.model))].sort();
      setAvailableBuySellModels(models);
      setBuySellModel('');
    } else {
      setAvailableBuySellModels([]);
      setBuySellModel('');
    }
  }, [buySellMake]);

  const handleResearchSubmit = () => {
    if (researchYear && researchMake && researchModel) {
      navigate(`/vehicles/${researchYear}/${researchMake}/${researchModel}`);
      closeDropdown();
    }
  };

  const handleBuySellSubmit = () => {
    if (buySellMake && buySellModel) {
      navigate(`/cars-for-sale/${buySellMake}/${buySellModel}${buySellZip ? `?zip=${buySellZip}` : ''}`);
      closeDropdown();
    } else if (buySellMake) {
      navigate(`/cars-for-sale/${buySellMake}${buySellZip ? `?zip=${buySellZip}` : ''}`);
      closeDropdown();
    } else {
      navigate(`/cars-for-sale${buySellZip ? `?zip=${buySellZip}` : ''}`);
      closeDropdown();
    }
  };

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

  // Filter cars based on search query using the API
  useEffect(() => {
    if (searchQuery.length > 0) {
      const results = searchVehicles(searchQuery, 15);
      const vehicleNames = results.map(v => `${v.year} ${v.make} ${v.model}`);
      
      setFilteredCars(vehicleNames);
      setShowSearchDropdown(true);
    } else {
      setFilteredCars([]);
      setShowSearchDropdown(false);
    }
    setHighlightedSearchIndex(-1);
  }, [searchQuery]);

  // Calculate indicator position when mega dropdown is active or when route matches
  useEffect(() => {
    // 1. First priority: Active Dropdown
    let targetRef = activeDropdown === 'News + Stories' ? newsStoriesNavRef : 
                     activeDropdown === 'Research Vehicles' ? researchVehiclesNavRef : 
                     activeDropdown === 'Rankings + Awards' ? rankingsAwardsNavRef : 
                     activeDropdown === 'Buy + Sell' ? buySellNavRef : null;

    // 2. Second priority: Active Route (only if no dropdown is open)
    if (!targetRef && !activeDropdown) {
      const activeItem = navigationItems.find(item => isSectionActive(item));
      if (activeItem) {
        if (activeItem.label === 'News + Stories') targetRef = newsStoriesNavRef;
        else if (activeItem.label === 'Research Vehicles') targetRef = researchVehiclesNavRef;
        else if (activeItem.label === 'Rankings + Awards') targetRef = rankingsAwardsNavRef;
        else if (activeItem.label === 'Buy + Sell') targetRef = buySellNavRef;
      }
    }

    if (targetRef?.current) {
      const updateIndicatorPosition = () => {
        if (targetRef?.current && navMenuRef.current) {
          const navRect = navMenuRef.current.getBoundingClientRect();
          const navItemRect = targetRef.current.getBoundingClientRect();
          
          // Position indicator relative to the nav menu container
          // This allows us to place it directly in the nav menu and persist it
          setIndicatorLeft(navItemRect.left - navRect.left);
          setIndicatorWidth(navItemRect.width);
          
          // Only calculate content left if we have an active dropdown to show
          if (activeDropdown) {
            // Calculate content left position to align with nav item
            // The mega dropdown content is centered with max-width 1280px
            const maxWidth = 1280;
            const viewportWidth = window.innerWidth;
            const containerLeft = Math.max(0, (viewportWidth - maxWidth) / 2);
            // Calculate how far the nav item is from the left edge of the centered container
            let contentReferenceRect = navItemRect;
            
            // If Research Vehicles is active, align content with News + Stories
            if (activeDropdown === 'Research Vehicles' && newsStoriesNavRef.current) {
              contentReferenceRect = newsStoriesNavRef.current.getBoundingClientRect();
            } else if (activeDropdown === 'Rankings + Awards' && newsStoriesNavRef.current) {
              // Also align Rankings content with News + Stories for consistency
              contentReferenceRect = newsStoriesNavRef.current.getBoundingClientRect();
            } else if (activeDropdown === 'Buy + Sell' && newsStoriesNavRef.current) {
              // Also align Buy + Sell content with News + Stories for consistency
              contentReferenceRect = newsStoriesNavRef.current.getBoundingClientRect();
            }

            const navItemLeftRelativeToContainer = contentReferenceRect.left - containerLeft;
            // Set padding-left to align the first column with the nav item
            setContentLeft(Math.max(0, navItemLeftRelativeToContainer));
          }
        }
      };

      // Calculate position immediately, before rendering
      updateIndicatorPosition();
      
      // Also update on resize/scroll
      window.addEventListener('resize', updateIndicatorPosition);
      window.addEventListener('scroll', updateIndicatorPosition);
      
      return () => {
        window.removeEventListener('resize', updateIndicatorPosition);
        window.removeEventListener('scroll', updateIndicatorPosition);
      };
    } else {
      setIndicatorLeft(null);
      setIndicatorWidth(null);
      setContentLeft(null);
    }
  }, [activeDropdown, location.pathname]); // Add location.pathname to dependency array

  // Handle click outside to close dropdowns
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setShowUserDropdown(false);
      }
      // Check if click is outside nav menu AND mega dropdown
      // Only close if clicking outside both elements
      const isOutsideNav = navMenuRef.current && !navMenuRef.current.contains(event.target as Node);
      const isOutsideMegaDropdown = megaDropdownRef.current && !megaDropdownRef.current.contains(event.target as Node);
      
      // Check specific nav items
      const isOutsideNewsNav = !newsStoriesNavRef.current || !newsStoriesNavRef.current.contains(event.target as Node);
      const isOutsideResearchNav = !researchVehiclesNavRef.current || !researchVehiclesNavRef.current.contains(event.target as Node);
      const isOutsideRankingsNav = !rankingsAwardsNavRef.current || !rankingsAwardsNavRef.current.contains(event.target as Node);
      const isOutsideBuySellNav = !buySellNavRef.current || !buySellNavRef.current.contains(event.target as Node);
      
      // Only close if clicking outside all relevant elements
      if (isOutsideNav && isOutsideMegaDropdown && isOutsideNewsNav && isOutsideResearchNav && isOutsideRankingsNav && isOutsideBuySellNav) {
        closeDropdown();
      }
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSearchDropdown(false);
      }
      if (brandsRef.current && !brandsRef.current.contains(event.target as Node)) {
        setShowBrandsDropdown(false);
      }
    };

    if (showUserDropdown || activeDropdown || showSearchDropdown || showBrandsDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showUserDropdown, activeDropdown, showSearchDropdown, showBrandsDropdown]);

  const handleUserMenuClick = () => {
    setShowUserDropdown(!showUserDropdown);
  };

  const handleNavHover = (label: string) => {
    // Calculate position synchronously before showing dropdown to prevent jump
    const targetRef = label === 'News + Stories' ? newsStoriesNavRef : 
                     label === 'Research Vehicles' ? researchVehiclesNavRef : 
                     label === 'Rankings + Awards' ? rankingsAwardsNavRef : 
                     label === 'Buy + Sell' ? buySellNavRef : null;

    if (targetRef?.current && navMenuRef.current) {
      const navRect = navMenuRef.current.getBoundingClientRect();
      const navItemRect = targetRef.current.getBoundingClientRect();
      const indicatorPos = navItemRect.left - navRect.left;
      const indicatorW = navItemRect.width;
      
      const maxWidth = 1280;
      const viewportWidth = window.innerWidth;
      const containerLeft = Math.max(0, (viewportWidth - maxWidth) / 2);

      let contentReferenceRect = navItemRect;
      if (label === 'Research Vehicles' && newsStoriesNavRef.current) {
        contentReferenceRect = newsStoriesNavRef.current.getBoundingClientRect();
      } else if (label === 'Rankings + Awards' && newsStoriesNavRef.current) {
        contentReferenceRect = newsStoriesNavRef.current.getBoundingClientRect();
      } else if (label === 'Buy + Sell' && newsStoriesNavRef.current) {
        contentReferenceRect = newsStoriesNavRef.current.getBoundingClientRect();
      }

      const navItemLeftRelativeToContainer = contentReferenceRect.left - containerLeft;
      const contentPos = Math.max(0, navItemLeftRelativeToContainer);
      
      // Set positions first, then show dropdown in next frame to ensure positions are applied
      setIndicatorLeft(indicatorPos);
      setIndicatorWidth(indicatorW);
      setContentLeft(contentPos);
      
      // Ensure dropdown starts invisible state
      setIsDropdownVisible(false);
      
      // Mount the dropdown
      setActiveDropdown(label);
      
      // Trigger animation after mount
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setIsDropdownVisible(true);
        });
      });
    } else {
      setActiveDropdown(label);
    }
  };

  const closeDropdown = () => {
    // Start exit animation
    setIsDropdownVisible(false);
    // Remove from DOM after animation completes (match CSS duration 200ms)
    setTimeout(() => {
      setActiveDropdown(null);
    }, 200);
  };

  const handleNavLeave = () => {
    // Don't close dropdown - let the mega dropdown's mouse handlers manage it
    // This prevents the dropdown from closing when moving from nav to dropdown
    return;
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
    // Track searched vehicle for personalization
    addSearchedVehicle(searchQuery || vehicleName, vehicleName);
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

  // Inline styles
  const headerStyle: React.CSSProperties = {
    backgroundColor: 'var(--color-neutrals-1, #141416)',
    padding: 0,
    width: '100%',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.06)'
  };

  const contentStyle: React.CSSProperties = {
    maxWidth: '1280px',
    width: '100%',
    margin: '0 auto',
    display: 'flex',
    flexDirection: 'column',
    gap: 0,
    padding: isLargeScreen ? '0' : (isMobile ? '0 12px' : '0 24px'),
    minHeight: isMobile ? '56px' : '120px'
  };

  const topRowStyle: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: 'auto 1fr auto',
    alignItems: 'center',
    gap: 'var(--spacing-3, 24px) 0',
    paddingTop: isMobile ? '8px' : '16px',
    paddingBottom: isMobile ? '8px' : '16px',
    paddingLeft: 0,
    paddingRight: 0,
    minHeight: isMobile ? '56px' : '80px'
  };

  const leftSectionStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: isMobile ? '8px' : 'var(--spacing-3, 24px)',
    flexShrink: 0
  };

  const logoLinkStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    textDecoration: 'none'
  };

  const logoStyle: React.CSSProperties = {
    height: isMobile ? '26px' : '36px',
    width: 'auto',
    maxWidth: isMobile ? '112px' : '249px',
    objectFit: 'contain'
  };

  const rightSectionStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: isMobile ? '8px' : '16px',
    paddingRight: isLargeScreen ? 0 : undefined
  };

  const searchContainerStyle: React.CSSProperties = {
    position: 'relative',
    width: isMobile ? '200px' : '432px',
    maxWidth: '432px',
    margin: '0 auto',
    flexShrink: 0,
    minWidth: isMobile ? '150px' : '432px'
  };

  const searchBoxStyle: React.CSSProperties = {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    width: '100%',
    height: '41px'
  };

  const searchSparkleStyle: React.CSSProperties = {
    position: 'absolute',
    left: '16px',
    color: 'var(--color-neutrals-3, #353945)',
    zIndex: 1,
    pointerEvents: 'none'
  };

  const searchIconStyle: React.CSSProperties = {
    position: 'absolute',
    right: isMobile ? '10px' : '16px',
    left: isMobile ? '10px' : undefined,
    color: 'var(--color-neutrals-4, #6E7481)',
    zIndex: 1,
    pointerEvents: 'none',
    opacity: 0.4
  };

  const searchInputStyle: React.CSSProperties = {
    width: '100%',
    height: '41px',
    padding: isMobile ? '8px 10px 8px 36px' : '0 40px 0 40px',
    fontFamily: "'Geist', var(--font-body, sans-serif)",
    fontWeight: 500,
    fontSize: isMobile ? '14px' : '12px',
    lineHeight: '15.6px',
    letterSpacing: '0.6px',
    color: 'var(--color-neutrals-3, #353945)',
    backgroundColor: 'var(--color-white, #FFFFFF)',
    border: '1px solid var(--color-primary-1, #E90C17)',
    borderRadius: 'var(--border-radius-pill, 999px)',
    outline: 'none',
    transition: 'all var(--transition-fast, 150ms ease-in-out)',
    boxSizing: 'border-box',
    boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)'
  };

  const searchDropdownStyle: React.CSSProperties = {
    position: 'absolute',
    top: 'calc(100% + 4px)',
    left: 0,
    right: 0,
    marginTop: 0,
    backgroundColor: 'var(--color-neutrals-1, #141416)',
    border: '1px solid var(--color-neutrals-3, #353945)',
    borderRadius: 'var(--border-radius-md, 8px)',
    boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.15)',
    zIndex: 1000,
    overflow: 'hidden',
    animation: 'slideDown 0.2s ease-out',
    maxHeight: '240px',
    overflowY: 'auto'
  };

  const getSearchDropdownItemStyle = (index: number): React.CSSProperties => ({
    padding: '12px 16px',
    fontFamily: 'var(--font-body, sans-serif)',
    fontWeight: 400,
    fontSize: '14px',
    color: 'var(--color-white, #FFFFFF)',
    cursor: 'pointer',
    transition: 'all var(--transition-fast, 150ms ease-in-out)',
    borderBottom: index < filteredCars.length - 1 ? '1px solid var(--color-neutrals-3, #353945)' : 'none',
    backgroundColor: index === highlightedSearchIndex || hoveredSearchItem === index ? 'var(--color-neutrals-3, #353945)' : 'transparent'
  });

  const newsletterBtnStyle: React.CSSProperties = {
    fontFamily: "'Gilroy', var(--font-body, sans-serif)",
    fontWeight: 500,
    fontSize: '14px',
    lineHeight: '16px',
    color: isNewsletterHovered ? 'var(--color-white, #FFFFFF)' : 'var(--color-neutrals-8, #FCFCFD)',
    backgroundColor: isNewsletterHovered ? 'var(--color-primary-2, #c70a15)' : 'var(--color-primary-1, #E90C17)',
    border: 'none',
    padding: '8px 16px',
    borderRadius: 'var(--border-radius-sm, 4px)',
    cursor: 'pointer',
    transition: 'all var(--transition-fast, 150ms ease-in-out)',
    whiteSpace: 'nowrap',
    display: isMobile ? 'none' : 'block'
  };

  const signInBtnStyle: React.CSSProperties = {
    fontFamily: 'var(--font-body, sans-serif)',
    fontWeight: 'var(--font-weight-regular, 400)',
    fontSize: '14px',
    lineHeight: '1.286em',
    color: isSignInHovered ? 'var(--color-neutrals-8, #FCFCFD)' : 'var(--color-neutrals-5, #B1B5C3)',
    background: 'none',
    border: 'none',
    padding: '8px 12px',
    cursor: 'pointer',
    transition: 'color var(--transition-fast, 150ms ease-in-out)'
  };

  const userMenuStyle: React.CSSProperties = {
    position: 'relative'
  };

  const userBtnStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    background: 'none',
    border: 'none',
    padding: isMobile ? '4px' : '4px',
    width: isMobile ? '36px' : undefined,
    height: isMobile ? '36px' : undefined,
    fontSize: '14px',
    cursor: 'pointer',
    borderRadius: 0,
    transition: 'background-color var(--transition-fast, 150ms ease-in-out)'
  };

  const avatarWrapperStyle: React.CSSProperties = {
    position: 'relative',
    display: 'inline-block'
  };

  const avatarImgStyle: React.CSSProperties = {
    height: isMobile ? '28px' : '32px',
    width: isMobile ? '28px' : 'auto',
    objectFit: 'contain',
    borderRadius: 0,
    imageRendering: 'crisp-edges',
    WebkitBackfaceVisibility: 'hidden',
    backfaceVisibility: 'hidden',
    transform: 'translateZ(0)'
  };

  const notificationBadgeStyle: React.CSSProperties = {
    position: 'absolute',
    top: isMobile ? '-4px' : '-6px',
    right: isMobile ? '-4px' : '-6px',
    zIndex: 10
  };

  const userDropdownStyle: React.CSSProperties = {
    position: 'absolute',
    top: 'calc(100% + 8px)',
    right: isMobile ? '-8px' : 0,
    marginTop: 0,
    width: 'max-content',
    minWidth: '200px',
    maxWidth: '320px',
    backgroundColor: 'var(--color-neutrals-1, #141416)',
    border: 'none',
    borderRadius: 'var(--border-radius-md-lg, 12px)',
    boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.15)',
    zIndex: 1000,
    overflow: 'hidden',
    animation: 'slideDown 0.2s ease-out'
  };

  const userInfoStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '20px',
    backgroundColor: 'var(--color-neutrals-1, #141416)',
    borderBottom: '1px solid var(--color-neutrals-3, #353945)'
  };

  const userDetailsStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
    flex: 1,
    minWidth: 0
  };

  const userNameStyle: React.CSSProperties = {
    fontFamily: 'var(--font-body, sans-serif)',
    fontWeight: 600,
    fontSize: '16px',
    color: 'var(--color-white, #FFFFFF)',
    lineHeight: 1.2,
    textAlign: 'left',
    margin: 0
  };

  const userEmailStyle: React.CSSProperties = {
    fontFamily: 'var(--font-body, sans-serif)',
    fontWeight: 400,
    fontSize: '14px',
    color: 'var(--color-neutrals-4, #6E7481)',
    lineHeight: 1.2,
    textAlign: 'left',
    margin: 0
  };

  const dropdownDividerStyle: React.CSSProperties = {
    height: '1px',
    backgroundColor: 'var(--color-neutrals-3, #353945)',
    margin: 0
  };

  const getDropdownItemStyle = (itemId: string, _isSignOut?: boolean): React.CSSProperties => ({
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    width: '100%',
    padding: '12px 20px',
    background: 'none',
    border: 'none',
    fontFamily: 'var(--font-body, sans-serif)',
    fontWeight: 500,
    fontSize: '14px',
    color: 'var(--color-white, #FFFFFF)',
    textAlign: 'left',
    cursor: 'pointer',
    transition: 'all var(--transition-fast, 150ms ease-in-out)',
    backgroundColor: hoveredUserDropdownItem === itemId ? 'var(--color-neutrals-3, #353945)' : 'transparent'
  });

  return (
    <header style={headerStyle}>
      <div style={contentStyle}>
        {/* Top Row: Logo, Search, Actions */}
        <div style={topRowStyle}>
          <div style={leftSectionStyle}>
            <Link to="/" style={logoLinkStyle}>
              <img 
                src={motorTrendLogo} 
                alt="MotorTrend" 
                style={logoStyle}
              />
            </Link>
          </div>

          {/* Search and Sign In */}
          <div style={rightSectionStyle}>
          <div style={searchContainerStyle} ref={searchRef}>
            <div style={searchBoxStyle}>
              <Icon name="auto_awesome" size={16} style={searchSparkleStyle} />
              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={handleSearchInputChange}
                onKeyDown={handleSearchKeyDown}
                onFocus={() => {
                  setIsSearchFocused(true);
                  searchQuery.length > 0 && setShowSearchDropdown(true);
                }}
                onBlur={() => setIsSearchFocused(false)}
                placeholder="Search or ask a question…"
                style={searchInputStyle}
              />
              <Icon name="search" size={20} style={searchIconStyle} />
            </div>
            {/* Search Dropdown */}
            {showSearchDropdown && filteredCars.length > 0 && (
              <div style={searchDropdownStyle}>
                {filteredCars.map((car, index) => (
                  <div
                    key={car}
                    style={getSearchDropdownItemStyle(index)}
                    onClick={() => handleVehicleSelect(car)}
                    onMouseEnter={() => {
                      setHighlightedSearchIndex(index);
                      setHoveredSearchItem(index);
                    }}
                    onMouseLeave={() => setHoveredSearchItem(-1)}
                  >
                    {car}
                  </div>
                ))}
              </div>
            )}
          </div>
          
          {/* Subscribe Button - Only show if user is not authenticated */}
          {!isAuthenticated && (
            <button 
              style={newsletterBtnStyle}
              onMouseEnter={() => setIsNewsletterHovered(true)}
              onMouseLeave={() => setIsNewsletterHovered(false)}
              onClick={() => {
                // TODO: Implement newsletter signup
                console.log('Subscribe clicked');
              }}
            >
              Subscribe
            </button>
          )}
          
          {isAuthenticated ? (
            <div style={userMenuStyle} ref={userMenuRef}>
              <button 
                style={userBtnStyle}
                onClick={handleUserMenuClick}
                onMouseEnter={() => setIsUserBtnHovered(true)}
                onMouseLeave={() => setIsUserBtnHovered(false)}
                aria-label="User menu"
              >
                <div style={avatarWrapperStyle}>
                  {userData?.avatar ? (
                    <img 
                      key={userData.avatar}
                      src={userData.avatar} 
                      alt={userData.name || 'User'} 
                      style={avatarImgStyle}
                    />
                  ) : (
                    <img 
                      src="https://d2kde5ohu8qb21.cloudfront.net/files/68fabbe380bc4f00028943ef/mt40.svg" 
                      alt="MotorTrend" 
                      style={avatarImgStyle}
                    />
                  )}
                  {notificationCount > 0 && (
                    <div style={notificationBadgeStyle}>
                      <Badge variant="error" size="sm" circle aria-label={`${notificationCount} new notification${notificationCount > 1 ? 's' : ''}`}>
                        {notificationCount}
                      </Badge>
                    </div>
                  )}
                </div>
              </button>
              
              {showUserDropdown && (
                <div style={userDropdownStyle}>
                  <div style={userInfoStyle}>
                    <div style={{ flexShrink: 0, borderRadius: 0, overflow: 'visible', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'transparent', border: 'none' }}>
                      {userData?.avatar ? (
                        <img 
                          key={userData.avatar}
                          src={userData.avatar} 
                          alt={userData.name || 'User'} 
                          style={avatarImgStyle}
                        />
                      ) : (
                        <img 
                          src="https://d2kde5ohu8qb21.cloudfront.net/files/68fabbe380bc4f00028943ef/mt40.svg" 
                          alt="MotorTrend" 
                          style={avatarImgStyle}
                        />
                      )}
                    </div>
                    <div style={userDetailsStyle}>
                      <div style={userNameStyle}>{userData?.name || 'User'}</div>
                      <div style={userEmailStyle}>user@example.com</div>
                    </div>
                  </div>
                  <div style={dropdownDividerStyle}></div>
                  <button 
                    style={getDropdownItemStyle('profile')}
                    onMouseEnter={() => setHoveredUserDropdownItem('profile')}
                    onMouseLeave={() => setHoveredUserDropdownItem(null)}
                    onClick={() => {
                      navigate('/my-account/profile');
                      setShowUserDropdown(false);
                    }}
                  >
                    <Icon name="account_circle" size={16} style={{ color: hoveredUserDropdownItem === 'profile' ? 'var(--color-white, #FFFFFF)' : 'var(--color-neutrals-4, #6E7481)', flexShrink: 0, transition: 'color var(--transition-fast, 150ms ease-in-out)' }} />
                    Profile
                  </button>
                  <button 
                    style={getDropdownItemStyle('saved')}
                    onMouseEnter={() => setHoveredUserDropdownItem('saved')}
                    onMouseLeave={() => setHoveredUserDropdownItem(null)}
                    onClick={() => {
                      navigate('/my-account/saved-items');
                      setShowUserDropdown(false);
                    }}
                  >
                    <Icon name="bookmark_border" size={16} style={{ color: hoveredUserDropdownItem === 'saved' ? 'var(--color-white, #FFFFFF)' : 'var(--color-neutrals-4, #6E7481)', flexShrink: 0, transition: 'color var(--transition-fast, 150ms ease-in-out)' }} />
                    Saved
                  </button>
                  <button 
                    style={getDropdownItemStyle('subscriptions')}
                    onMouseEnter={() => setHoveredUserDropdownItem('subscriptions')}
                    onMouseLeave={() => setHoveredUserDropdownItem(null)}
                    onClick={() => {
                      navigate('/my-account/subscriptions');
                      setShowUserDropdown(false);
                    }}
                  >
                    <Icon name="newspaper" size={16} style={{ color: hoveredUserDropdownItem === 'subscriptions' ? 'var(--color-white, #FFFFFF)' : 'var(--color-neutrals-4, #6E7481)', flexShrink: 0, transition: 'color var(--transition-fast, 150ms ease-in-out)' }} />
                    Subscriptions
                  </button>
                  <div style={dropdownDividerStyle}></div>
                  <button 
                    style={getDropdownItemStyle('signout', true)}
                    onMouseEnter={() => setHoveredUserDropdownItem('signout')}
                    onMouseLeave={() => setHoveredUserDropdownItem(null)}
                    onClick={handleSignOut}
                  >
                    <Icon name="logout" size={16} style={{ color: hoveredUserDropdownItem === 'signout' ? 'var(--color-white, #FFFFFF)' : 'var(--color-neutrals-4, #6E7481)', flexShrink: 0, transition: 'color var(--transition-fast, 150ms ease-in-out)' }} />
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button 
              style={signInBtnStyle}
              onMouseEnter={() => setIsSignInHovered(true)}
              onMouseLeave={() => setIsSignInHovered(false)}
              onClick={() => navigate('/signin')}
            >
              Sign In
            </button>
          )}
          </div>
        </div>

        {/* Bottom Row: Navigation Categories */}
        <nav style={{
          display: isMobile ? 'none' : 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 'var(--spacing-4, 32px)',
          padding: isLargeScreen ? '12px 0' : '12px 0',
          borderTop: '1px solid rgba(255, 255, 255, 0.1)',
          width: '100%',
          flexWrap: 'wrap',
          position: 'relative'
        }} ref={navMenuRef}>
          {navigationItems.map((item) => {
            const isActive = isSectionActive(item);
            const isHovered = hoveredNavItem === item.label || activeDropdown === item.label;
            
            const navItemStyle: React.CSSProperties = {
              position: 'relative',
              flexShrink: 0
            };
            
            const navLinkStyle: React.CSSProperties = {
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              fontFamily: "'Geist', var(--font-body, sans-serif)",
              fontWeight: 400,
              fontSize: '16px',
              lineHeight: '24px',
              letterSpacing: '-0.16px',
              color: isActive || isHovered ? 'var(--color-white, #FFFFFF)' : 'var(--color-neutrals-6, #E6E8EC)',
              textDecoration: 'none',
              padding: 0,
              borderRadius: 0,
              transition: 'all var(--transition-fast, 150ms ease-in-out)',
              backgroundColor: 'transparent'
            };
            
            const navDropdownStyle: React.CSSProperties = {
              position: 'absolute',
              top: 'calc(100% + 4px)',
              left: 0,
              marginTop: 0,
              width: 'max-content',
              minWidth: '200px',
              maxWidth: '280px',
              backgroundColor: 'var(--color-neutrals-1, #141416)',
              border: '1px solid var(--color-neutrals-3, #353945)',
              borderRadius: 'var(--border-radius-md, 8px)',
              boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.15)',
              zIndex: 1000,
              overflow: 'hidden',
              animation: 'slideDown 0.2s ease-out'
            };
            
            return (
              <div 
                key={item.label} 
                ref={item.label === 'News + Stories' ? newsStoriesNavRef : 
                     item.label === 'Research Vehicles' ? researchVehiclesNavRef : 
                     item.label === 'Rankings + Awards' ? rankingsAwardsNavRef : 
                     item.label === 'Buy + Sell' ? buySellNavRef : null}
                style={navItemStyle}
                onMouseEnter={() => {
                  setHoveredNavItem(item.label);
                  handleNavHover(item.label);
                }}
                onMouseLeave={() => {
                  setHoveredNavItem(null);
                  handleNavLeave();
                }}
              >
                <a 
                  href={item.href} 
                  style={navLinkStyle}
                >
                  {item.label}
                  <Icon name="keyboard_arrow_down" size={16} style={{ transition: 'transform var(--transition-fast, 150ms ease-in-out)', transform: isHovered ? 'rotate(180deg)' : 'rotate(0deg)' }} />
                </a>
                {activeDropdown === item.label && item.subItems && !(item as any).hasMegaDropdown && (
                  <div style={navDropdownStyle}>
                    {item.subItems.map((subItem) => {
                      const isSubActive = isSubItemActive(subItem.href);
                      const subItemStyle: React.CSSProperties = {
                        display: 'block',
                        width: '100%',
                        padding: '12px 16px',
                        fontFamily: 'var(--font-body, sans-serif)',
                        fontWeight: isSubActive ? 'var(--font-weight-bold, 600)' : 400,
                        fontSize: '14px',
                        color: 'var(--color-white, #FFFFFF)',
                        textDecoration: 'none',
                        textAlign: 'left',
                        cursor: 'pointer',
                        transition: 'all var(--transition-fast, 150ms ease-in-out)',
                        borderBottom: '1px solid var(--color-neutrals-3, #353945)',
                        backgroundColor: isSubActive || hoveredDropdownItem === subItem.label ? 'var(--color-neutrals-3, #353945)' : 'transparent'
                      };
                      
                      return subItem.href === '#' ? (
                        <a 
                          key={subItem.label}
                          href={subItem.href} 
                          style={subItemStyle}
                          onMouseEnter={() => setHoveredDropdownItem(subItem.label)}
                          onMouseLeave={() => setHoveredDropdownItem(null)}
                        >
                          {subItem.label}
                        </a>
                      ) : (
                        <Link 
                          key={subItem.label}
                          to={subItem.href} 
                          style={subItemStyle}
                          onMouseEnter={() => setHoveredDropdownItem(subItem.label)}
                          onMouseLeave={() => setHoveredDropdownItem(null)}
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
          
          {/* Mega Dropdown - Rendered outside nav items for proper positioning */}
          {navigationItems.map((item, index) => {
            if (activeDropdown === item.label && (item as any).hasMegaDropdown && (item as any).megaDropdown) {
              const isVisible = indicatorLeft !== null && contentLeft !== null && isDropdownVisible;
              
              const megaDropdownStyle: React.CSSProperties = {
                position: 'absolute',
                top: 'calc(100% - 2px)',
                left: '50%',
                transformOrigin: 'top center',
                transform: isVisible 
                  ? 'translateX(-50%) translateY(0) scaleY(1)' 
                  : 'translateX(-50%) translateY(-10px) scaleY(0.95)',
                width: '100vw',
                backgroundColor: 'var(--color-neutrals-1, #141416)',
                boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.25)',
                zIndex: 1000,
                overflow: 'visible',
                borderTop: '1px solid rgba(255, 255, 255, 0.1)',
                opacity: isVisible ? 1 : 0,
                pointerEvents: isVisible ? 'auto' : 'none',
                visibility: isVisible ? 'visible' : 'hidden',
                transition: 'opacity 0.2s ease-out, transform 0.25s cubic-bezier(0.2, 0.8, 0.2, 1), visibility 0.2s',
                paddingTop: '2px'
              };
              
              const megaDropdownContentStyle: React.CSSProperties = {
                maxWidth: '1280px',
                margin: '0 auto',
                display: 'flex',
                alignItems: 'flex-start',
                padding: '32px 0',
                paddingLeft: contentLeft !== null ? `${contentLeft}px` : '80px',
                paddingRight: !isLargeScreen ? '16px' : undefined,
                gap: 0,
                position: 'relative'
              };
              
              return (
                <div 
                  key={`mega-${item.label}`} 
                  ref={megaDropdownRef}
                  style={megaDropdownStyle}
                  data-nav-index={index}
                  onMouseEnter={() => {
                    setActiveDropdown(item.label);
                  }}
                  onMouseLeave={(e) => {
                    const relatedTarget = e.relatedTarget;
                    if (newsStoriesNavRef.current && relatedTarget instanceof Node && newsStoriesNavRef.current.contains(relatedTarget)) {
                      return;
                    }
                    setTimeout(() => {
                      if (megaDropdownRef.current) {
                        const dropdownRect = megaDropdownRef.current.getBoundingClientRect();
                        const mouseX = (e.nativeEvent as MouseEvent).clientX;
                        const mouseY = (e.nativeEvent as MouseEvent).clientY;
                        const isOverDropdown = mouseX >= dropdownRect.left && mouseX <= dropdownRect.right && 
                                               mouseY >= dropdownRect.top && mouseY <= dropdownRect.bottom;
                        if (!isOverDropdown) {
                          let isOverNav = false;
                          if (newsStoriesNavRef.current) {
                            const navRect = newsStoriesNavRef.current.getBoundingClientRect();
                            isOverNav = mouseX >= navRect.left && mouseX <= navRect.right && 
                                       mouseY >= navRect.top && mouseY <= navRect.bottom;
                          }
                          if (!isOverNav) {
                            closeDropdown();
                          }
                        }
                      } else {
                        closeDropdown();
                      }
                    }, 100);
                  }}
                >
                    <div style={megaDropdownContentStyle}>
                      {(item as any).megaDropdown.type === 'news' ? (
                        <>
                          <div style={{ flex: '0 0 auto', padding: '0 48px', paddingLeft: 0 }}>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                              <Link
                                to={(item as any).megaDropdown.newsCategories.allNews.href}
                                style={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: '8px',
                                  fontFamily: "'Geist', var(--font-body, sans-serif)",
                                  fontWeight: (item as any).megaDropdown.newsCategories.allNews.isActive ? 600 : 400,
                                  fontSize: '18px',
                                  lineHeight: '24px',
                                  letterSpacing: '-0.16px',
                                  color: (item as any).megaDropdown.newsCategories.allNews.isActive || hoveredMegaLink === 'allNews' ? 'var(--color-white, #FFFFFF)' : 'var(--color-neutrals-6, #E6E8EC)',
                                  textDecoration: 'none',
                                  transition: 'color var(--transition-fast, 150ms ease-in-out)',
                                  whiteSpace: 'nowrap',
                                  margin: 0,
                                  padding: 0
                                }}
                                onMouseEnter={() => setHoveredMegaLink('allNews')}
                                onMouseLeave={() => setHoveredMegaLink(null)}
                                onClick={() => setActiveDropdown(null)}
                              >
                                {(item as any).megaDropdown.newsCategories.allNews.label}
                                {(item as any).megaDropdown.newsCategories.allNews.isActive && (
                                  <Icon name="chevron_right" size={21} style={{ color: 'var(--color-neutrals-6, #E6E8EC)', flexShrink: 0, marginLeft: '4px' }} />
                                )}
                              </Link>
                              <div style={{ display: 'flex', gap: '48px', marginTop: 0 }}>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                  {(item as any).megaDropdown.newsCategories.leftColumn.map((category: any) => (
                                    <Link
                                      key={category.label}
                                      to={category.href}
                                      style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '8px',
                                        fontFamily: "'Geist', var(--font-body, sans-serif)",
                                        fontWeight: 400,
                                        fontSize: '18px',
                                        lineHeight: '24px',
                                        letterSpacing: '-0.16px',
                                        color: hoveredMegaLink === category.label ? 'var(--color-white, #FFFFFF)' : 'var(--color-neutrals-6, #E6E8EC)',
                                        textDecoration: 'none',
                                        transition: 'color var(--transition-fast, 150ms ease-in-out)',
                                        whiteSpace: 'nowrap'
                                      }}
                                      onMouseEnter={() => setHoveredMegaLink(category.label)}
                                      onMouseLeave={() => setHoveredMegaLink(null)}
                                      onClick={() => setActiveDropdown(null)}
                                    >
                                      {category.label}
                                    </Link>
                                  ))}
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                  {(item as any).megaDropdown.newsCategories.rightColumn.map((category: any) => (
                                    <Link
                                      key={category.label}
                                      to={category.href}
                                      style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '8px',
                                        fontFamily: "'Geist', var(--font-body, sans-serif)",
                                        fontWeight: 400,
                                        fontSize: '18px',
                                        lineHeight: '24px',
                                        letterSpacing: '-0.16px',
                                        color: hoveredMegaLink === category.label ? 'var(--color-white, #FFFFFF)' : 'var(--color-neutrals-6, #E6E8EC)',
                                        textDecoration: 'none',
                                        transition: 'color var(--transition-fast, 150ms ease-in-out)',
                                        whiteSpace: 'nowrap'
                                      }}
                                      onMouseEnter={() => setHoveredMegaLink(category.label)}
                                      onMouseLeave={() => setHoveredMegaLink(null)}
                                      onClick={() => setActiveDropdown(null)}
                                    >
                                      {category.label}
                                    </Link>
                                  ))}
                                </div>
                              </div>
                            </div>
                          </div>
                          <div style={{ width: '1px', height: 'auto', minHeight: '120px', backgroundColor: 'var(--color-neutrals-3, #353945)', flexShrink: 0, alignSelf: 'stretch' }}></div>
                          <div style={{ flex: '0 0 auto', padding: '0 48px' }}>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                              {(item as any).megaDropdown.storiesCategories.map((category: any, catIdx: number) => (
                                <Link
                                  key={category.label}
                                  to={category.href}
                                  style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '8px',
                                    fontFamily: "'Geist', var(--font-body, sans-serif)",
                                    fontWeight: category.isActive ? 600 : 400,
                                    fontSize: '18px',
                                    lineHeight: '24px',
                                    letterSpacing: '-0.16px',
                                    color: category.isActive || hoveredMegaLink === `story-${category.label}` ? 'var(--color-white, #FFFFFF)' : 'var(--color-neutrals-6, #E6E8EC)',
                                    textDecoration: 'none',
                                    transition: 'color var(--transition-fast, 150ms ease-in-out)',
                                    whiteSpace: 'nowrap',
                                    marginTop: (catIdx === 1 || catIdx === 3) ? '8px' : 0
                                  }}
                                  onMouseEnter={() => setHoveredMegaLink(`story-${category.label}`)}
                                  onMouseLeave={() => setHoveredMegaLink(null)}
                                  onClick={() => setActiveDropdown(null)}
                                >
                                  {category.label}
                                  {category.isActive && (
                                    <Icon name="chevron_right" size={21} style={{ color: category.isActive ? 'var(--color-white, #FFFFFF)' : 'var(--color-neutrals-6, #E6E8EC)', flexShrink: 0, marginLeft: '4px' }} />
                                  )}
                                </Link>
                              ))}
                            </div>
                          </div>
                          <div style={{ flex: 1, padding: '0 48px 0 48px', maxWidth: '500px', marginLeft: 'auto' }}>
                            <Link
                              to={(item as any).megaDropdown.featuredContent.href}
                              style={{ display: 'flex', alignItems: 'flex-start', gap: '20px', textDecoration: 'none', color: 'inherit' }}
                              onClick={() => setActiveDropdown(null)}
                            >
                              <div style={{ flexShrink: 0, width: '200px', height: '120px', borderRadius: 'var(--border-radius-md, 8px)', overflow: 'hidden' }}>
                                <img
                                  src={(item as any).megaDropdown.featuredContent.image}
                                  alt={(item as any).megaDropdown.featuredContent.title}
                                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                />
                              </div>
                              <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', flex: 1 }}>
                                <div style={{ fontFamily: "'Geist', var(--font-body, sans-serif)", fontWeight: 400, fontSize: '14px', lineHeight: '18px', color: 'var(--color-white, #FFFFFF)', marginBottom: '8px' }}>
                                  {(item as any).megaDropdown.featuredContent.badge}
                                </div>
                                <div style={{ fontFamily: "'Poppins', var(--font-heading, sans-serif)", fontWeight: 600, fontSize: '18px', lineHeight: '24px', color: 'var(--color-neutrals-7, #F4F5F6)', margin: 0 }}>
                                  {(item as any).megaDropdown.featuredContent.title}
                                </div>
                              </div>
                            </Link>
                          </div>
                        </>
                      ) : (item as any).megaDropdown.type === 'research' ? (
                        <>
                          {/* Left Column: Links List */}
                          <div style={{ flex: '0 0 300px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
                            {(item as any).megaDropdown.leftColumn.sections.map((section: any, idx: number) => (
                              <div key={idx} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                {section.href ? (
                                  <Link
                                    to={section.href}
                                    style={{
                                      display: 'flex',
                                      alignItems: 'center',
                                      gap: '8px',
                                      fontFamily: "'Geist', var(--font-body, sans-serif)",
                                      fontWeight: 600,
                                      fontSize: '18px',
                                      lineHeight: '24px',
                                      letterSpacing: '-0.16px',
                                      color: hoveredMegaLink === `research-${section.title}` ? 'var(--color-white, #FFFFFF)' : 'var(--color-white, #FFFFFF)',
                                      textDecoration: 'none',
                                      transition: 'color var(--transition-fast, 150ms ease-in-out)',
                                      whiteSpace: 'nowrap'
                                    }}
                                    onMouseEnter={() => setHoveredMegaLink(`research-${section.title}`)}
                                    onMouseLeave={() => setHoveredMegaLink(null)}
                                    onClick={() => setActiveDropdown(null)}
                                  >
                                    {section.title}
                                    <Icon name="chevron_right" size={21} style={{ color: 'var(--color-neutrals-6, #E6E8EC)', flexShrink: 0, marginLeft: '4px' }} />
                                  </Link>
                                ) : (
                                  <div style={{ fontFamily: "'Geist', var(--font-body, sans-serif)", fontWeight: 600, fontSize: '16px', lineHeight: '20px', color: 'var(--color-white, #FFFFFF)', marginBottom: '12px' }}>
                                    {section.title}
                                  </div>
                                )}
                                {section.links && (
                                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', paddingLeft: 0 }}>
                                    {section.links.map((link: any) => (
                                      <Link
                                        key={link.label}
                                        to={link.href}
                                        style={{
                                          display: 'flex',
                                          alignItems: 'center',
                                          gap: '8px',
                                          fontFamily: "'Geist', var(--font-body, sans-serif)",
                                          fontWeight: 400,
                                          fontSize: '18px',
                                          lineHeight: '24px',
                                          letterSpacing: '-0.16px',
                                          color: hoveredMegaLink === `research-link-${link.label}` ? 'var(--color-white, #FFFFFF)' : 'var(--color-neutrals-6, #E6E8EC)',
                                          textDecoration: 'none',
                                          transition: 'color var(--transition-fast, 150ms ease-in-out)',
                                          whiteSpace: 'nowrap'
                                        }}
                                        onMouseEnter={() => setHoveredMegaLink(`research-link-${link.label}`)}
                                        onMouseLeave={() => setHoveredMegaLink(null)}
                                        onClick={() => setActiveDropdown(null)}
                                      >
                                        {link.label}
                                      </Link>
                                    ))}
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>

                          <div style={{ width: '1px', height: 'auto', minHeight: '120px', backgroundColor: 'var(--color-neutrals-3, #353945)', flexShrink: 0, alignSelf: 'stretch' }}></div>

                          {/* Middle Column: Body Styles Grid */}
                          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '0 var(--spacing-3, 24px)' }}>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                              <div style={{ fontFamily: "'Geist', var(--font-body, sans-serif)", fontWeight: 600, fontSize: '16px', lineHeight: '20px', color: 'var(--color-white, #FFFFFF)', marginBottom: '12px' }}>
                                {(item as any).megaDropdown.middleColumn.title}
                              </div>
                              <div style={{ fontFamily: "'Geist', var(--font-body, sans-serif)", fontWeight: 400, fontSize: '14px', color: 'var(--color-neutrals-4, #6E7481)', marginBottom: '16px' }}>
                                {(item as any).megaDropdown.middleColumn.subtitle}
                              </div>
                              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
                                {(item as any).megaDropdown.middleColumn.bodyStyles.map((bodyStyle: any) => (
                                  <Link
                                    key={bodyStyle.label}
                                    to={bodyStyle.href}
                                    style={{
                                      display: 'flex',
                                      alignItems: 'center',
                                      justifyContent: 'center',
                                      backgroundColor: hoveredGridItem === bodyStyle.label ? 'var(--color-neutrals-3, #353945)' : 'var(--color-neutrals-2, #23262F)',
                                      borderRadius: 'var(--border-radius-sm, 4px)',
                                      padding: '10px',
                                      fontFamily: "'Geist', var(--font-body, sans-serif)",
                                      fontWeight: 500,
                                      fontSize: '14px',
                                      color: 'var(--color-white, #FFFFFF)',
                                      textDecoration: 'none',
                                      transition: 'background-color 0.2s',
                                      textAlign: 'center'
                                    }}
                                    onMouseEnter={() => setHoveredGridItem(bodyStyle.label)}
                                    onMouseLeave={() => setHoveredGridItem(null)}
                                    onClick={() => setActiveDropdown(null)}
                                  >
                                    {bodyStyle.label}
                                  </Link>
                                ))}
                              </div>
                            </div>
                          </div>

                          <div style={{ width: '1px', height: 'auto', minHeight: '120px', backgroundColor: 'var(--color-neutrals-3, #353945)', flexShrink: 0, alignSelf: 'stretch' }}></div>

                          {/* Right Column: Search Form */}
                          <div style={{ flex: '0 0 300px', paddingLeft: 'var(--spacing-3, 24px)', paddingRight: 0 }}>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                              <div style={{ fontFamily: "'Geist', var(--font-body, sans-serif)", fontWeight: 600, fontSize: '16px', lineHeight: '20px', color: 'var(--color-white, #FFFFFF)', marginBottom: '12px' }}>
                                {(item as any).megaDropdown.rightColumn.title}
                              </div>
                              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', backgroundColor: 'var(--color-neutrals-2, #23262F)', padding: '16px', borderRadius: 'var(--border-radius-md, 8px)' }}>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                  <label style={{ fontFamily: "'Geist', var(--font-body, sans-serif)", fontSize: '12px', color: 'var(--color-neutrals-4, #6E7481)' }}>Make</label>
                                  <select 
                                    style={{
                                      backgroundColor: 'var(--color-neutrals-1, #141416)',
                                      border: '1px solid var(--color-neutrals-3, #353945)',
                                      borderRadius: 'var(--border-radius-sm, 4px)',
                                      padding: '10px 12px',
                                      color: 'var(--color-white, #FFFFFF)',
                                      fontFamily: "'Geist', var(--font-body, sans-serif)",
                                      fontSize: '14px',
                                      width: '100%',
                                      cursor: 'pointer',
                                      appearance: 'none',
                                      backgroundImage: "url(\"data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='white' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e\")",
                                      backgroundRepeat: 'no-repeat',
                                      backgroundPosition: 'right 12px center',
                                      backgroundSize: '16px'
                                    }}
                                    value={researchMake}
                                    onChange={(e) => setResearchMake(e.target.value)}
                                  >
                                    <option value="">Select a make...</option>
                                    {availableMakes.map(make => (
                                      <option key={make} value={make}>{make}</option>
                                    ))}
                                  </select>
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                  <label style={{ fontFamily: "'Geist', var(--font-body, sans-serif)", fontSize: '12px', color: 'var(--color-neutrals-4, #6E7481)' }}>Model</label>
                                  <select 
                                    style={{
                                      backgroundColor: 'var(--color-neutrals-1, #141416)',
                                      border: '1px solid var(--color-neutrals-3, #353945)',
                                      borderRadius: 'var(--border-radius-sm, 4px)',
                                      padding: '10px 12px',
                                      color: 'var(--color-white, #FFFFFF)',
                                      fontFamily: "'Geist', var(--font-body, sans-serif)",
                                      fontSize: '14px',
                                      width: '100%',
                                      cursor: researchMake ? 'pointer' : 'not-allowed',
                                      opacity: researchMake ? 1 : 0.5,
                                      appearance: 'none',
                                      backgroundImage: "url(\"data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='white' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e\")",
                                      backgroundRepeat: 'no-repeat',
                                      backgroundPosition: 'right 12px center',
                                      backgroundSize: '16px'
                                    }}
                                    value={researchModel}
                                    onChange={(e) => setResearchModel(e.target.value)}
                                    disabled={!researchMake}
                                  >
                                    <option value="">Select a model...</option>
                                    {availableModels.map(model => (
                                      <option key={model} value={model}>{model}</option>
                                    ))}
                                  </select>
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                  <label style={{ fontFamily: "'Geist', var(--font-body, sans-serif)", fontSize: '12px', color: 'var(--color-neutrals-4, #6E7481)' }}>Year</label>
                                  <select 
                                    style={{
                                      backgroundColor: 'var(--color-neutrals-1, #141416)',
                                      border: '1px solid var(--color-neutrals-3, #353945)',
                                      borderRadius: 'var(--border-radius-sm, 4px)',
                                      padding: '10px 12px',
                                      color: 'var(--color-white, #FFFFFF)',
                                      fontFamily: "'Geist', var(--font-body, sans-serif)",
                                      fontSize: '14px',
                                      width: '100%',
                                      cursor: researchModel ? 'pointer' : 'not-allowed',
                                      opacity: researchModel ? 1 : 0.5,
                                      appearance: 'none',
                                      backgroundImage: "url(\"data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='white' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e\")",
                                      backgroundRepeat: 'no-repeat',
                                      backgroundPosition: 'right 12px center',
                                      backgroundSize: '16px'
                                    }}
                                    value={researchYear}
                                    onChange={(e) => setResearchYear(e.target.value)}
                                    disabled={!researchModel}
                                  >
                                    <option value="">Select a year...</option>
                                    {availableYears.map(year => (
                                      <option key={year} value={year}>{year}</option>
                                    ))}
                                  </select>
                                </div>
                                <button 
                                  style={{
                                    backgroundColor: (!researchYear || !researchMake || !researchModel) ? 'var(--color-neutrals-4, #6E7481)' : (isSubmitHovered ? 'var(--color-primary-2, #c70a15)' : 'var(--color-primary-1, #E90C17)'),
                                    color: 'var(--color-white, #FFFFFF)',
                                    border: 'none',
                                    borderRadius: 'var(--border-radius-sm, 4px)',
                                    padding: '12px',
                                    fontFamily: "'Geist', var(--font-body, sans-serif)",
                                    fontWeight: 600,
                                    fontSize: '14px',
                                    cursor: (!researchYear || !researchMake || !researchModel) ? 'not-allowed' : 'pointer',
                                    transition: 'background-color 0.2s',
                                    marginTop: '8px'
                                  }}
                                  onMouseEnter={() => setIsSubmitHovered(true)}
                                  onMouseLeave={() => setIsSubmitHovered(false)}
                                  onClick={handleResearchSubmit}
                                  disabled={!researchYear || !researchMake || !researchModel}
                                >
                                  Go
                                </button>
                              </div>
                            </div>
                          </div>
                        </>
                      ) : (item as any).megaDropdown.type === 'rankings' ? (
                        <>
                          {/* Left Column: Rankings Grid */}
                          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', paddingRight: '48px' }}>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                              <Link
                                to="/rankings"
                                style={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: '8px',
                                  fontFamily: "'Geist', var(--font-body, sans-serif)",
                                  fontWeight: 600,
                                  fontSize: '18px',
                                  lineHeight: '24px',
                                  letterSpacing: '-0.16px',
                                  color: 'var(--color-white, #FFFFFF)',
                                  textDecoration: 'none',
                                  transition: 'color var(--transition-fast, 150ms ease-in-out)',
                                  whiteSpace: 'nowrap'
                                }}
                                onClick={() => setActiveDropdown(null)}
                              >
                                {(item as any).megaDropdown.leftColumn.title}
                                <Icon name="chevron_right" size={21} style={{ color: 'var(--color-white, #FFFFFF)', flexShrink: 0, marginLeft: '4px' }} />
                              </Link>
                              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px', marginTop: '12px' }}>
                                {(item as any).megaDropdown.leftColumn.items.map((ranking: any) => (
                                  <Link
                                    key={ranking.label}
                                    to={ranking.href}
                                    style={{
                                      display: 'flex',
                                      flexDirection: 'column',
                                      alignItems: 'center',
                                      justifyContent: 'center',
                                      gap: '8px',
                                      backgroundColor: hoveredRankingItem === ranking.label ? 'var(--color-neutrals-3, #353945)' : 'var(--color-neutrals-2, #23262F)',
                                      borderRadius: 'var(--border-radius-sm, 4px)',
                                      padding: '16px',
                                      textDecoration: 'none',
                                      transition: 'background-color 0.2s',
                                      minHeight: '100px'
                                    }}
                                    onMouseEnter={() => setHoveredRankingItem(ranking.label)}
                                    onMouseLeave={() => setHoveredRankingItem(null)}
                                    onClick={() => setActiveDropdown(null)}
                                  >
                                    <div style={{ width: '48px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                      <img src={ranking.icon} alt={ranking.label} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                                    </div>
                                    <div style={{ fontFamily: "'Geist', var(--font-body, sans-serif)", fontWeight: 500, fontSize: '14px', color: 'var(--color-white, #FFFFFF)', textAlign: 'center' }}>
                                      {ranking.label}
                                    </div>
                                  </Link>
                                ))}
                              </div>
                            </div>
                          </div>

                          <div style={{ width: '1px', height: 'auto', minHeight: '120px', backgroundColor: 'var(--color-neutrals-3, #353945)', flexShrink: 0, alignSelf: 'stretch' }}></div>

                          {/* Right Column: Awards */}
                          <div style={{ flex: '0 0 550px', display: 'flex', flexDirection: 'column', paddingLeft: '48px', paddingRight: 0 }}>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                              <Link
                                to="/awards"
                                style={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: '8px',
                                  fontFamily: "'Geist', var(--font-body, sans-serif)",
                                  fontWeight: 600,
                                  fontSize: '18px',
                                  lineHeight: '24px',
                                  letterSpacing: '-0.16px',
                                  color: 'var(--color-white, #FFFFFF)',
                                  textDecoration: 'none',
                                  transition: 'color var(--transition-fast, 150ms ease-in-out)',
                                  whiteSpace: 'nowrap'
                                }}
                                onClick={() => setActiveDropdown(null)}
                              >
                                {(item as any).megaDropdown.rightColumn.title}
                                <Icon name="chevron_right" size={21} style={{ color: 'var(--color-white, #FFFFFF)', flexShrink: 0, marginLeft: '4px' }} />
                              </Link>
                              <div style={{ fontFamily: "'Geist', var(--font-body, sans-serif)", fontWeight: 400, fontSize: '14px', color: 'var(--color-neutrals-4, #6E7481)', marginBottom: '16px' }}>
                                {(item as any).megaDropdown.rightColumn.subtitle}
                              </div>
                              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px', marginTop: '12px' }}>
                                {(item as any).megaDropdown.rightColumn.items.map((award: any) => (
                                  <Link
                                    key={award.title}
                                    to={award.href}
                                    style={{
                                      display: 'flex',
                                      alignItems: 'center',
                                      justifyContent: 'center',
                                      gap: 0,
                                      backgroundColor: hoveredAwardItem === award.title ? 'var(--color-neutrals-3, #353945)' : 'var(--color-neutrals-2, #23262F)',
                                      borderRadius: 'var(--border-radius-sm, 4px)',
                                      padding: '24px',
                                      textDecoration: 'none',
                                      transition: 'background-color 0.2s',
                                      minHeight: '100px'
                                    }}
                                    onMouseEnter={() => setHoveredAwardItem(award.title)}
                                    onMouseLeave={() => setHoveredAwardItem(null)}
                                    onClick={() => setActiveDropdown(null)}
                                  >
                                    <div style={{ width: '100%', height: '100%', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                      <img src={award.icon} alt={award.title} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                                    </div>
                                  </Link>
                                ))}
                              </div>
                            </div>
                          </div>
                        </>
                      ) : (item as any).megaDropdown.type === 'buy-sell' ? (
                        <>
                          {/* Left Column: Links List */}
                          <div style={{ flex: '0 0 280px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
                            {(item as any).megaDropdown.leftColumn.sections.map((section: any, idx: number) => (
                              <div key={idx} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                <div style={{ fontFamily: "'Geist', var(--font-body, sans-serif)", fontWeight: 600, fontSize: '16px', lineHeight: '20px', color: 'var(--color-white, #FFFFFF)', marginBottom: '12px' }}>
                                  {section.title}
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', paddingLeft: 0 }}>
                                  {section.links.map((link: any) => (
                                    <Link
                                      key={link.label}
                                      to={link.href}
                                      style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '8px',
                                        fontFamily: "'Geist', var(--font-body, sans-serif)",
                                        fontWeight: 400,
                                        fontSize: '18px',
                                        lineHeight: '24px',
                                        letterSpacing: '-0.16px',
                                        color: hoveredMegaLink === `buysell-${link.label}` ? 'var(--color-white, #FFFFFF)' : 'var(--color-neutrals-6, #E6E8EC)',
                                        textDecoration: 'none',
                                        transition: 'color var(--transition-fast, 150ms ease-in-out)',
                                        whiteSpace: 'nowrap'
                                      }}
                                      onMouseEnter={() => setHoveredMegaLink(`buysell-${link.label}`)}
                                      onMouseLeave={() => setHoveredMegaLink(null)}
                                      onClick={() => closeDropdown()}
                                    >
                                      {link.label}
                                    </Link>
                                  ))}
                                </div>
                              </div>
                            ))}
                          </div>

                          <div style={{ width: '1px', height: 'auto', minHeight: '120px', backgroundColor: 'var(--color-neutrals-3, #353945)', flexShrink: 0, alignSelf: 'stretch' }}></div>

                          {/* Middle Column: Marketplace Form */}
                          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '0 48px' }}>
                            <div style={{
                              display: 'flex',
                              flexDirection: 'column',
                              width: '100%',
                              height: '266px',
                              backgroundColor: 'var(--color-neutrals-2, #23262F)',
                              borderRadius: 'var(--border-radius-md, 8px)',
                              padding: '24px',
                              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                              boxSizing: 'border-box'
                            }}>
                              <div style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
                                <img 
                                  src={(item as any).megaDropdown.middleColumn.logo} 
                                  alt="MotorTrend Marketplace" 
                                  style={{ height: '24px', width: 'auto' }}
                                />
                              </div>
                              <div style={{ fontFamily: "'Geist', var(--font-body, sans-serif)", fontWeight: 400, fontSize: '13px', lineHeight: '18px', color: 'var(--color-neutrals-5, #B1B5C3)', marginBottom: '16px' }}>
                                {(item as any).megaDropdown.middleColumn.description}
                              </div>
                              <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', flex: 1, padding: 0, backgroundColor: 'transparent' }}>
                                <div style={{ display: 'flex', gap: '16px', marginBottom: 0 }}>
                                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', flex: 1 }}>
                                    <label style={{ fontFamily: "'Geist', var(--font-body, sans-serif)", fontSize: '12px', lineHeight: '14px', color: 'var(--color-neutrals-6, #E6E8EC)' }}>Make</label>
                                    <select 
                                      style={{
                                        width: '100%',
                                        height: '40px',
                                        padding: '0 12px',
                                        fontFamily: "'Geist', var(--font-body, sans-serif)",
                                        fontSize: '14px',
                                        color: 'var(--color-white, #FFFFFF)',
                                        backgroundColor: 'var(--color-neutrals-1, #141416)',
                                        border: '1px solid var(--color-neutrals-3, #353945)',
                                        borderRadius: 'var(--border-radius-sm, 4px)',
                                        outline: 'none',
                                        cursor: 'pointer',
                                        appearance: 'none',
                                        backgroundImage: "url(\"data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='white' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e\")",
                                        backgroundRepeat: 'no-repeat',
                                        backgroundPosition: 'right 12px center',
                                        backgroundSize: '16px',
                                        transition: 'border-color 0.2s'
                                      }}
                                      value={buySellMake}
                                      onChange={(e) => setBuySellMake(e.target.value)}
                                    >
                                      <option value="">Select a make...</option>
                                      {availableMakes.map(make => (
                                        <option key={make} value={make}>{make}</option>
                                      ))}
                                    </select>
                                  </div>
                                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', flex: 1 }}>
                                    <label style={{ fontFamily: "'Geist', var(--font-body, sans-serif)", fontSize: '12px', lineHeight: '14px', color: 'var(--color-neutrals-6, #E6E8EC)' }}>Model</label>
                                    <select 
                                      style={{
                                        width: '100%',
                                        height: '40px',
                                        padding: '0 12px',
                                        fontFamily: "'Geist', var(--font-body, sans-serif)",
                                        fontSize: '14px',
                                        color: 'var(--color-white, #FFFFFF)',
                                        backgroundColor: 'var(--color-neutrals-1, #141416)',
                                        border: '1px solid var(--color-neutrals-3, #353945)',
                                        borderRadius: 'var(--border-radius-sm, 4px)',
                                        outline: 'none',
                                        cursor: buySellMake ? 'pointer' : 'not-allowed',
                                        opacity: buySellMake ? 1 : 0.5,
                                        appearance: 'none',
                                        backgroundImage: "url(\"data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='white' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e\")",
                                        backgroundRepeat: 'no-repeat',
                                        backgroundPosition: 'right 12px center',
                                        backgroundSize: '16px',
                                        transition: 'border-color 0.2s'
                                      }}
                                      value={buySellModel}
                                      onChange={(e) => setBuySellModel(e.target.value)}
                                      disabled={!buySellMake}
                                    >
                                      <option value="">Select a model...</option>
                                      {availableBuySellModels.map(model => (
                                        <option key={model} value={model}>{model}</option>
                                      ))}
                                    </select>
                                  </div>
                                </div>
                                <div style={{ display: 'flex', gap: '16px', marginBottom: 0 }}>
                                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', flex: 1 }}>
                                    <label style={{ fontFamily: "'Geist', var(--font-body, sans-serif)", fontSize: '12px', lineHeight: '14px', color: 'var(--color-neutrals-6, #E6E8EC)' }}>Zip Code</label>
                                    <input
                                      type="text"
                                      style={{
                                        width: '100%',
                                        height: '40px',
                                        padding: '0 12px',
                                        fontFamily: "'Geist', var(--font-body, sans-serif)",
                                        fontSize: '14px',
                                        color: 'var(--color-white, #FFFFFF)',
                                        backgroundColor: 'var(--color-neutrals-1, #141416)',
                                        border: '1px solid var(--color-neutrals-3, #353945)',
                                        borderRadius: 'var(--border-radius-sm, 4px)',
                                        outline: 'none',
                                        transition: 'border-color 0.2s'
                                      }}
                                      placeholder="Enter your Zip Code"
                                      value={buySellZip}
                                      onChange={(e) => setBuySellZip(e.target.value)}
                                    />
                                  </div>
                                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', flex: 1, justifyContent: 'flex-end' }}>
                                    <button 
                                      style={{
                                        backgroundColor: isSubmitHovered ? 'var(--color-primary-2, #c70a15)' : 'var(--color-primary-1, #E90C17)',
                                        color: 'var(--color-white, #FFFFFF)',
                                        border: 'none',
                                        borderRadius: 'var(--border-radius-sm, 4px)',
                                        height: '40px',
                                        width: '100%',
                                        fontFamily: "'Geist', var(--font-body, sans-serif)",
                                        fontWeight: 600,
                                        fontSize: '14px',
                                        cursor: 'pointer',
                                        transition: 'background-color 0.2s',
                                        marginTop: 0,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center'
                                      }}
                                      onMouseEnter={() => setIsSubmitHovered(true)}
                                      onMouseLeave={() => setIsSubmitHovered(false)}
                                      onClick={handleBuySellSubmit}
                                    >
                                      Go
                                    </button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>

                          <div style={{ width: '1px', height: 'auto', minHeight: '120px', backgroundColor: 'var(--color-neutrals-3, #353945)', flexShrink: 0, alignSelf: 'stretch' }}></div>

                          {/* Right Column: Ad */}
                          <div style={{ flex: '0 0 auto', display: 'flex', alignItems: 'flex-start', justifyContent: 'flex-end', paddingLeft: '48px', paddingRight: 0 }}>
                            <Link
                              to={(item as any).megaDropdown.rightColumn.href}
                              style={{ display: 'block', width: '300px', height: '250px', borderRadius: 0, overflow: 'hidden' }}
                              onClick={() => setActiveDropdown(null)}
                            >
                              <img 
                                src={(item as any).megaDropdown.rightColumn.adImage} 
                                alt="Advertisement" 
                                style={{ width: '300px', height: '250px', display: 'block', objectFit: 'contain' }}
                              />
                            </Link>
                          </div>
                        </>
                      ) : null}
                    </div>
                  </div>
              );
            }
            return null;
          })}
          
          {/* Our Brands Dropdown */}
          <div style={{ position: 'relative', marginLeft: 'auto', display: isMobile ? 'none' : 'block' }} ref={brandsRef}>
            <select 
              style={{
                fontFamily: "'Geist', var(--font-body, sans-serif)",
                fontWeight: 400,
                fontSize: '16px',
                lineHeight: '24px',
                letterSpacing: '-0.16px',
                color: 'var(--color-neutrals-6, #E6E8EC)',
                backgroundColor: 'transparent',
                border: 'none',
                borderRadius: 0,
                padding: 0,
                paddingRight: '20px',
                cursor: 'pointer',
                outline: 'none',
                transition: 'all var(--transition-fast, 150ms ease-in-out)',
                appearance: 'none',
                backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='16' height='16' viewBox='0 0 16 16' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M4 6L8 10L12 6' stroke='%23E8E8E8' stroke-width='1.33' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E\")",
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'right 0 center',
                minWidth: '113px'
              }}
              onChange={(e) => {
                if (e.target.value) {
                  window.open(e.target.value, '_blank');
                }
              }}
              defaultValue=""
            >
              <option value="" disabled style={{ backgroundColor: 'var(--color-neutrals-1, #141416)', color: 'var(--color-neutrals-6, #E6E8EC)' }}>Our Brands</option>
              <option value="https://www.motortrend.com" style={{ backgroundColor: 'var(--color-neutrals-1, #141416)', color: 'var(--color-neutrals-6, #E6E8EC)' }}>MotorTrend</option>
              <option value="https://www.hotrod.com" style={{ backgroundColor: 'var(--color-neutrals-1, #141416)', color: 'var(--color-neutrals-6, #E6E8EC)' }}>Hot Rod</option>
              <option value="https://www.automobilemag.com" style={{ backgroundColor: 'var(--color-neutrals-1, #141416)', color: 'var(--color-neutrals-6, #E6E8EC)' }}>Automobile</option>
              <option value="https://www.trucktrend.com" style={{ backgroundColor: 'var(--color-neutrals-1, #141416)', color: 'var(--color-neutrals-6, #E6E8EC)' }}>Truck Trend</option>
            </select>
          </div>

          {/* Global Active/Hover Indicator */}
          <div 
            style={{ 
              position: 'absolute',
              bottom: 0,
              height: '3px',
              backgroundColor: 'var(--color-primary-1, #E90C17)',
              zIndex: 1002,
              transition: 'left 0.2s ease-out, width 0.2s ease-out, opacity 0.2s ease-out',
              pointerEvents: 'none',
              left: indicatorLeft !== null ? `${indicatorLeft}px` : undefined,
              width: indicatorWidth !== null ? `${indicatorWidth}px` : undefined,
              opacity: indicatorLeft !== null ? 1 : 0
            }}
          ></div>
        </nav>
      </div>
    </header>
  );
};

export default GlobalHeader;

