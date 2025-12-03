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
import { searchVehicles, getFilterOptions, getVehicles } from '../../api/vehiclesApi';

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
        {/* Top Row: Logo, Search, Actions */}
        <div className="global-header__top-row">
          <div className="global-header__left">
            <Link to="/" className="global-header__logo-link">
              <img 
                src={motorTrendLogo} 
                alt="MotorTrend" 
                className="global-header__logo"
              />
            </Link>
          </div>

          {/* Search and Sign In */}
          <div className="global-header__right">
          <div className="global-header__search" ref={searchRef}>
            <div className="global-header__search-container">
              <Icon name="auto_awesome" size={16} className="global-header__search-sparkle" />
              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={handleSearchInputChange}
                onKeyDown={handleSearchKeyDown}
                onFocus={() => searchQuery.length > 0 && setShowSearchDropdown(true)}
                placeholder="Search or ask a question…"
                className="global-header__search-input"
              />
              <Icon name="search" size={20} className="global-header__search-icon" />
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
          
          {/* Join Newsletter Button */}
          <button 
            className="global-header__newsletter-btn"
            onClick={() => {
              // TODO: Implement newsletter signup
              console.log('Join Newsletter clicked');
            }}
          >
            Join Newsletter
          </button>
          
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

        {/* Bottom Row: Navigation Categories */}
        <nav className="global-header__nav" ref={navMenuRef}>
          {navigationItems.map((item) => {
            const isActive = isSectionActive(item);
            return (
              <div 
                key={item.label} 
                ref={item.label === 'News + Stories' ? newsStoriesNavRef : 
                     item.label === 'Research Vehicles' ? researchVehiclesNavRef : 
                     item.label === 'Rankings + Awards' ? rankingsAwardsNavRef : 
                     item.label === 'Buy + Sell' ? buySellNavRef : null}
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
                {activeDropdown === item.label && item.subItems && !(item as any).hasMegaDropdown && (
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
          
          {/* Mega Dropdown - Rendered outside nav items for proper positioning */}
          {navigationItems.map((item, index) => {
            if (activeDropdown === item.label && (item as any).hasMegaDropdown && (item as any).megaDropdown) {
              return (
                <div 
                  key={`mega-${item.label}`} 
                  ref={megaDropdownRef}
                  className="global-header__mega-dropdown" 
                  data-nav-index={index}
                  data-visible={indicatorLeft !== null && contentLeft !== null && isDropdownVisible ? "true" : "false"}
                  onMouseEnter={() => {
                    // Keep dropdown open when hovering over it
                    setActiveDropdown(item.label);
                  }}
                  onMouseLeave={(e) => {
                    // Check if mouse is moving to nav item
                    const relatedTarget = e.relatedTarget as HTMLElement;
                    if (newsStoriesNavRef.current && relatedTarget && newsStoriesNavRef.current.contains(relatedTarget)) {
                      return;
                    }
                    // Use a small delay to check if mouse is actually leaving
                    setTimeout(() => {
                      // Double-check if mouse is still over dropdown or nav
                      if (megaDropdownRef.current) {
                        const dropdownRect = megaDropdownRef.current.getBoundingClientRect();
                        const mouseX = (e.nativeEvent as MouseEvent).clientX;
                        const mouseY = (e.nativeEvent as MouseEvent).clientY;
                        const isOverDropdown = mouseX >= dropdownRect.left && mouseX <= dropdownRect.right && 
                                               mouseY >= dropdownRect.top && mouseY <= dropdownRect.bottom;
                        if (!isOverDropdown) {
                          // Also check nav item
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
                    {/* Indicator removed from here */}
                    <div 
                      className="global-header__mega-dropdown-content"
                      style={contentLeft !== null ? { paddingLeft: `${contentLeft}px` } : {}}
                    >
                      {(item as any).megaDropdown.type === 'news' ? (
                        <>
                          <div className="global-header__mega-dropdown-column">
                            <div className="global-header__mega-dropdown-section">
                              <Link
                                to={(item as any).megaDropdown.newsCategories.allNews.href}
                                className={`global-header__mega-dropdown-link ${(item as any).megaDropdown.newsCategories.allNews.isActive ? 'global-header__mega-dropdown-link--active' : ''}`}
                                onClick={() => setActiveDropdown(null)}
                              >
                                {(item as any).megaDropdown.newsCategories.allNews.label}
                                {(item as any).megaDropdown.newsCategories.allNews.isActive && (
                                  <Icon name="chevron_right" size={21} className="global-header__mega-dropdown-arrow" />
                                )}
                              </Link>
                              <div className="global-header__mega-dropdown-news-columns">
                                <div className="global-header__mega-dropdown-news-column">
                                  {(item as any).megaDropdown.newsCategories.leftColumn.map((category: any) => (
                                    <Link
                                      key={category.label}
                                      to={category.href}
                                      className="global-header__mega-dropdown-link"
                                      onClick={() => setActiveDropdown(null)}
                                    >
                                      {category.label}
                                    </Link>
                                  ))}
                                </div>
                                <div className="global-header__mega-dropdown-news-column">
                                  {(item as any).megaDropdown.newsCategories.rightColumn.map((category: any) => (
                                    <Link
                                      key={category.label}
                                      to={category.href}
                                      className="global-header__mega-dropdown-link"
                                      onClick={() => setActiveDropdown(null)}
                                    >
                                      {category.label}
                                    </Link>
                                  ))}
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="global-header__mega-dropdown-divider"></div>
                          <div className="global-header__mega-dropdown-column">
                            <div className="global-header__mega-dropdown-section">
                              {(item as any).megaDropdown.storiesCategories.map((category: any) => (
                                <Link
                                  key={category.label}
                                  to={category.href}
                                  className={`global-header__mega-dropdown-link ${category.isActive ? 'global-header__mega-dropdown-link--active' : ''}`}
                                  onClick={() => setActiveDropdown(null)}
                                >
                                  {category.label}
                                  {category.isActive && (
                                    <Icon name="chevron_right" size={21} className="global-header__mega-dropdown-arrow" />
                                  )}
                                </Link>
                              ))}
                            </div>
                          </div>
                          <div className="global-header__mega-dropdown-featured">
                            <Link
                              to={(item as any).megaDropdown.featuredContent.href}
                              className="global-header__mega-dropdown-featured-link"
                              onClick={() => setActiveDropdown(null)}
                            >
                              <div className="global-header__mega-dropdown-featured-image">
                                <img
                                  src={(item as any).megaDropdown.featuredContent.image}
                                  alt={(item as any).megaDropdown.featuredContent.title}
                                />
                              </div>
                              <div className="global-header__mega-dropdown-featured-content">
                                <div className="global-header__mega-dropdown-featured-badge">
                                  {(item as any).megaDropdown.featuredContent.badge}
                                </div>
                                <div className="global-header__mega-dropdown-featured-title">
                                  {(item as any).megaDropdown.featuredContent.title}
                                </div>
                              </div>
                            </Link>
                          </div>
                        </>
                      ) : (item as any).megaDropdown.type === 'research' ? (
                        <>
                          {/* Left Column: Links List */}
                          <div className="global-header__mega-dropdown-column global-header__mega-dropdown-column--research-left">
                            {(item as any).megaDropdown.leftColumn.sections.map((section: any, idx: number) => (
                              <div key={idx} className="global-header__mega-dropdown-section">
                                {section.href ? (
                                  <Link
                                    to={section.href}
                                    className="global-header__mega-dropdown-link global-header__mega-dropdown-link--active"
                                    onClick={() => setActiveDropdown(null)}
                                  >
                                    {section.title}
                                    <Icon name="chevron_right" size={21} className="global-header__mega-dropdown-arrow" />
                                  </Link>
                                ) : (
                                  <div className="global-header__mega-dropdown-title">
                                    {section.title}
                                  </div>
                                )}
                                {section.links && (
                                  <div className="global-header__mega-dropdown-list">
                                    {section.links.map((link: any) => (
                                      <Link
                                        key={link.label}
                                        to={link.href}
                                        className="global-header__mega-dropdown-link"
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

                          <div className="global-header__mega-dropdown-divider"></div>

                          {/* Middle Column: Body Styles Grid */}
                          <div className="global-header__mega-dropdown-column global-header__mega-dropdown-column--research-middle">
                            <div className="global-header__mega-dropdown-section">
                              <div className="global-header__mega-dropdown-title">
                                {(item as any).megaDropdown.middleColumn.title}
                              </div>
                              <div className="global-header__mega-dropdown-subtitle">
                                {(item as any).megaDropdown.middleColumn.subtitle}
                              </div>
                              <div className="global-header__mega-dropdown-grid">
                                {(item as any).megaDropdown.middleColumn.bodyStyles.map((style: any) => (
                                  <Link
                                    key={style.label}
                                    to={style.href}
                                    className="global-header__mega-dropdown-grid-item"
                                    onClick={() => setActiveDropdown(null)}
                                  >
                                    {style.label}
                                  </Link>
                                ))}
                              </div>
                            </div>
                          </div>

                          <div className="global-header__mega-dropdown-divider"></div>

                          {/* Right Column: Search Form */}
                          <div className="global-header__mega-dropdown-column global-header__mega-dropdown-column--research-right">
                            <div className="global-header__mega-dropdown-section">
                              <div className="global-header__mega-dropdown-title">
                                {(item as any).megaDropdown.rightColumn.title}
                              </div>
                              <div className="global-header__mega-dropdown-form">
                                <div className="global-header__mega-dropdown-form-group">
                                  <label>Make</label>
                                  <select 
                                    className="global-header__mega-dropdown-select"
                                    value={researchMake}
                                    onChange={(e) => setResearchMake(e.target.value)}
                                  >
                                    <option value="">Select a make...</option>
                                    {availableMakes.map(make => (
                                      <option key={make} value={make}>{make}</option>
                                    ))}
                                  </select>
                                </div>
                                <div className="global-header__mega-dropdown-form-group">
                                  <label>Model</label>
                                  <select 
                                    className="global-header__mega-dropdown-select"
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
                                <div className="global-header__mega-dropdown-form-group">
                                  <label>Year</label>
                                  <select 
                                    className="global-header__mega-dropdown-select"
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
                                  className="global-header__mega-dropdown-submit-btn"
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
                          <div className="global-header__mega-dropdown-column global-header__mega-dropdown-column--rankings-left">
                            <div className="global-header__mega-dropdown-section">
                              <Link
                                to="/rankings"
                                className="global-header__mega-dropdown-link global-header__mega-dropdown-link--active"
                                onClick={() => setActiveDropdown(null)}
                              >
                                {(item as any).megaDropdown.leftColumn.title}
                                <Icon name="chevron_right" size={21} className="global-header__mega-dropdown-arrow" />
                              </Link>
                              <div className="global-header__mega-dropdown-rankings-grid">
                                {(item as any).megaDropdown.leftColumn.items.map((ranking: any) => (
                                  <Link
                                    key={ranking.label}
                                    to={ranking.href}
                                    className="global-header__mega-dropdown-rankings-item"
                                    onClick={() => setActiveDropdown(null)}
                                  >
                                    <div className="global-header__mega-dropdown-rankings-icon">
                                      <img src={ranking.icon} alt={ranking.label} />
                                    </div>
                                    <div className="global-header__mega-dropdown-rankings-label">
                                      {ranking.label}
                                    </div>
                                  </Link>
                                ))}
                              </div>
                            </div>
                          </div>

                          <div className="global-header__mega-dropdown-divider"></div>

                          {/* Right Column: Awards */}
                          <div className="global-header__mega-dropdown-column global-header__mega-dropdown-column--rankings-right">
                            <div className="global-header__mega-dropdown-section">
                              <Link
                                to="/awards"
                                className="global-header__mega-dropdown-link global-header__mega-dropdown-link--active"
                                onClick={() => setActiveDropdown(null)}
                              >
                                {(item as any).megaDropdown.rightColumn.title}
                                <Icon name="chevron_right" size={21} className="global-header__mega-dropdown-arrow" />
                              </Link>
                              <div className="global-header__mega-dropdown-subtitle">
                                {(item as any).megaDropdown.rightColumn.subtitle}
                              </div>
                              <div className="global-header__mega-dropdown-awards-grid">
                                {(item as any).megaDropdown.rightColumn.items.map((award: any) => (
                                  <Link
                                    key={award.title}
                                    to={award.href}
                                    className="global-header__mega-dropdown-awards-item"
                                    onClick={() => setActiveDropdown(null)}
                                  >
                                    <div className="global-header__mega-dropdown-awards-icon">
                                      <img src={award.icon} alt={award.title} />
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
                          <div className="global-header__mega-dropdown-column global-header__mega-dropdown-column--buysell-left">
                            {(item as any).megaDropdown.leftColumn.sections.map((section: any, idx: number) => (
                              <div key={idx} className="global-header__mega-dropdown-section">
                                <div className="global-header__mega-dropdown-title">
                                  {section.title}
                                </div>
                                <div className="global-header__mega-dropdown-list">
                                  {section.links.map((link: any) => (
                                    <Link
                                      key={link.label}
                                      to={link.href}
                                      className="global-header__mega-dropdown-link"
                                      onClick={() => closeDropdown()}
                                    >
                                      {link.label}
                                    </Link>
                                  ))}
                                </div>
                              </div>
                            ))}
                          </div>

                          <div className="global-header__mega-dropdown-divider"></div>

                          {/* Middle Column: Marketplace Form */}
                          <div className="global-header__mega-dropdown-column global-header__mega-dropdown-column--buysell-middle">
                            <div className="global-header__mega-dropdown-marketplace">
                              <div className="global-header__mega-dropdown-marketplace-header">
                                <img 
                                  src={(item as any).megaDropdown.middleColumn.logo} 
                                  alt="MotorTrend Marketplace" 
                                  className="global-header__mega-dropdown-marketplace-logo"
                                />
                              </div>
                              <div className="global-header__mega-dropdown-marketplace-description">
                                {(item as any).megaDropdown.middleColumn.description}
                              </div>
                              <div className="global-header__mega-dropdown-form">
                                <div className="global-header__mega-dropdown-form-row">
                                  <div className="global-header__mega-dropdown-form-group">
                                    <label>Make</label>
                                    <select 
                                      className="global-header__mega-dropdown-select"
                                      value={buySellMake}
                                      onChange={(e) => setBuySellMake(e.target.value)}
                                    >
                                      <option value="">Select a make...</option>
                                      {availableMakes.map(make => (
                                        <option key={make} value={make}>{make}</option>
                                      ))}
                                    </select>
                                  </div>
                                  <div className="global-header__mega-dropdown-form-group">
                                    <label>Model</label>
                                    <select 
                                      className="global-header__mega-dropdown-select"
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
                                <div className="global-header__mega-dropdown-form-row">
                                  <div className="global-header__mega-dropdown-form-group">
                                    <label>Zip Code</label>
                                    <input
                                      type="text"
                                      className="global-header__mega-dropdown-input"
                                      placeholder="Enter your Zip Code"
                                      value={buySellZip}
                                      onChange={(e) => setBuySellZip(e.target.value)}
                                    />
                                  </div>
                                  <div className="global-header__mega-dropdown-form-group global-header__mega-dropdown-form-group--button">
                                    <button 
                                      className="global-header__mega-dropdown-submit-btn"
                                      onClick={handleBuySellSubmit}
                                    >
                                      Go
                                    </button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="global-header__mega-dropdown-divider"></div>

                          {/* Right Column: Ad */}
                          <div className="global-header__mega-dropdown-column global-header__mega-dropdown-column--buysell-right">
                            <Link
                              to={(item as any).megaDropdown.rightColumn.href}
                              className="global-header__mega-dropdown-ad-link"
                              onClick={() => setActiveDropdown(null)}
                            >
                              <img 
                                src={(item as any).megaDropdown.rightColumn.adImage} 
                                alt="Advertisement" 
                                className="global-header__mega-dropdown-ad-image"
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
          <div className="global-header__brands" ref={brandsRef}>
            <select 
              className="global-header__brands-select"
              onChange={(e) => {
                if (e.target.value) {
                  window.open(e.target.value, '_blank');
                }
              }}
              defaultValue=""
            >
              <option value="" disabled>Our Brands</option>
              <option value="https://www.motortrend.com">MotorTrend</option>
              <option value="https://www.hotrod.com">Hot Rod</option>
              <option value="https://www.automobilemag.com">Automobile</option>
              <option value="https://www.trucktrend.com">Truck Trend</option>
            </select>
          </div>

          {/* Global Active/Hover Indicator */}
          <div 
            className="global-header__nav-indicator"
            style={{ 
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

