/**
 * Personalized Vehicles Widget
 * Shows vehicles based on user activity: Viewed, Searched, and Recommendations
 */

import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../Icon';
import { Badge } from '../atoms/Badge/Badge';
import { Card } from '../Card/Card';
import { vehicleImageFor, parseVehicleName } from '../../utils/vehicleImages';
import { generateStaffRating, generateCommunityRating } from '../../utils/vehicleRatings';
import { getVehicles, getSimilarVehicles, getVehicleByName } from '../../api/vehiclesApi';
import { useRating } from '../../contexts/RatingContext';

export interface PersonalizedVehiclesProps {
  className?: string;
}

type TabType = 'viewed' | 'searched' | 'youMightLike';

interface ViewedVehicle {
  name: string;
  timestamp: number;
}

interface SearchedVehicle {
  query: string;
  vehicleName: string;
  timestamp: number;
}

interface VehicleDisplay {
  name: string;
  image: string | null;
  staffRating: number;
  communityRating: number;
  bodyStyle?: string;
}

// Storage keys - now user-specific
const BASE_VIEWED_STORAGE_KEY = 'motortrend_viewed_vehicles';
const BASE_SEARCHED_STORAGE_KEY = 'motortrend_searched_vehicles';

// Get current user identifier for user-specific storage
const getCurrentUserId = (): string | null => {
  try {
    const onboardingData = localStorage.getItem('onboardingData');
    if (onboardingData) {
      const data = JSON.parse(onboardingData);
      // Use email or name as unique identifier
      return data.email || data.name || null;
    }
  } catch {
    // Ignore errors
  }
  return null;
};

// Get user-specific storage key
const getViewedStorageKey = (): string => {
  const userId = getCurrentUserId();
  return userId ? `${BASE_VIEWED_STORAGE_KEY}_${userId}` : BASE_VIEWED_STORAGE_KEY;
};

const getSearchedStorageKey = (): string => {
  const userId = getCurrentUserId();
  return userId ? `${BASE_SEARCHED_STORAGE_KEY}_${userId}` : BASE_SEARCHED_STORAGE_KEY;
};

// Get viewed vehicles from localStorage (user-specific)
export const getViewedVehicles = (): ViewedVehicle[] => {
  try {
    const storageKey = getViewedStorageKey();
    const data = localStorage.getItem(storageKey);
    const vehicles = data ? JSON.parse(data) : [];
    return vehicles;
  } catch {
    return [];
  }
};

// Add a viewed vehicle (user-specific)
export const addViewedVehicle = (vehicleName: string) => {
  try {
    const storageKey = getViewedStorageKey();
    const viewed = getViewedVehicles();
    // Remove if already exists (we'll add fresh at the top)
    const filtered = viewed.filter(v => v.name !== vehicleName);
    // Add to beginning with timestamp
    filtered.unshift({ name: vehicleName, timestamp: Date.now() });
    // Keep only last 20
    const trimmed = filtered.slice(0, 20);
    localStorage.setItem(storageKey, JSON.stringify(trimmed));
    // Dispatch custom event for updates
    window.dispatchEvent(new CustomEvent('viewedVehiclesUpdated'));
  } catch (error) {
    console.error('Error saving viewed vehicle:', error);
  }
};

// Get searched vehicles from localStorage (user-specific)
export const getSearchedVehicles = (): SearchedVehicle[] => {
  try {
    const storageKey = getSearchedStorageKey();
    const data = localStorage.getItem(storageKey);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
};

// Add a searched vehicle (user-specific)
export const addSearchedVehicle = (query: string, vehicleName: string) => {
  try {
    const storageKey = getSearchedStorageKey();
    const searched = getSearchedVehicles();
    // Remove duplicates
    const filtered = searched.filter(s => s.vehicleName !== vehicleName);
    // Add to beginning
    filtered.unshift({ query, vehicleName, timestamp: Date.now() });
    // Keep only last 20
    const trimmed = filtered.slice(0, 20);
    localStorage.setItem(storageKey, JSON.stringify(trimmed));
    // Dispatch custom event
    window.dispatchEvent(new CustomEvent('searchedVehiclesUpdated'));
  } catch (error) {
    console.error('Error saving searched vehicle:', error);
  }
};

// Clear all personalized vehicle data (used on sign out)
export const clearPersonalizedVehicleData = () => {
  try {
    // Clear user-specific keys
    const viewedKey = getViewedStorageKey();
    const searchedKey = getSearchedStorageKey();
    localStorage.removeItem(viewedKey);
    localStorage.removeItem(searchedKey);
    // Also clear the base keys (legacy cleanup)
    localStorage.removeItem(BASE_VIEWED_STORAGE_KEY);
    localStorage.removeItem(BASE_SEARCHED_STORAGE_KEY);
    // Dispatch events to update UI
    window.dispatchEvent(new CustomEvent('viewedVehiclesUpdated'));
    window.dispatchEvent(new CustomEvent('searchedVehiclesUpdated'));
  } catch (error) {
    console.error('Error clearing personalized vehicle data:', error);
  }
};

export const PersonalizedVehicles: React.FC<PersonalizedVehiclesProps> = ({ className }) => {
  const navigate = useNavigate();
  const { getUserRating } = useRating();
  const [activeTab, setActiveTab] = useState<TabType>('youMightLike');
  const [isMobile, setIsMobile] = useState(false);
  const [viewedVehicles, setViewedVehicles] = useState<ViewedVehicle[]>([]);
  const [searchedVehicles, setSearchedVehicles] = useState<SearchedVehicle[]>([]);
  const [hoveredTab, setHoveredTab] = useState<TabType | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  // Check for mobile
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Load viewed and searched vehicles
  useEffect(() => {
    const loadData = () => {
      setViewedVehicles(getViewedVehicles());
      setSearchedVehicles(getSearchedVehicles());
    };

    loadData();
    window.addEventListener('viewedVehiclesUpdated', loadData);
    window.addEventListener('searchedVehiclesUpdated', loadData);
    window.addEventListener('storage', loadData);

    return () => {
      window.removeEventListener('viewedVehiclesUpdated', loadData);
      window.removeEventListener('searchedVehiclesUpdated', loadData);
      window.removeEventListener('storage', loadData);
    };
  }, []);

  // Check scroll position
  useEffect(() => {
    const checkScroll = () => {
      if (scrollContainerRef.current) {
        const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
        setCanScrollLeft(scrollLeft > 0);
        setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
      }
    };

    checkScroll();
    const container = scrollContainerRef.current;
    if (container) {
      container.addEventListener('scroll', checkScroll);
      return () => container.removeEventListener('scroll', checkScroll);
    }
  }, [activeTab, viewedVehicles, searchedVehicles]);

  // Get user preferences for recommendations
  const userPreferences = useMemo(() => {
    try {
      const onboardingData = localStorage.getItem('onboardingData');
      if (onboardingData) {
        const data = JSON.parse(onboardingData);
        return data.vehicles || [];
      }
    } catch {
      // Ignore errors
    }
    return [];
  }, []);

  // Generate "You Might Like" recommendations
  const recommendations = useMemo((): VehicleDisplay[] => {
    const recommended: VehicleDisplay[] = [];
    
    // Get vehicles user wants or owns
    const wantedVehicles = userPreferences.filter(
      (v: { ownership: string }) => v.ownership === 'want'
    );
    const ownedVehicles = userPreferences.filter(
      (v: { ownership: string }) => v.ownership === 'own'
    );
    
    // Get similar vehicles based on user's preferences
    [...wantedVehicles, ...ownedVehicles].forEach((userVehicle: { name: string }) => {
      const dbVehicle = getVehicleByName(userVehicle.name);
      if (dbVehicle) {
        const similar = getSimilarVehicles(dbVehicle.id, 2);
        similar.forEach(v => {
          const vehicleName = `${v.year} ${v.make} ${v.model}`;
          // Avoid duplicates
          if (!recommended.find(r => r.name === vehicleName)) {
            recommended.push({
              name: vehicleName,
              image: vehicleImageFor(vehicleName),
              staffRating: v.staffRating || generateStaffRating(vehicleName),
              communityRating: v.communityRating || generateCommunityRating(vehicleName),
              bodyStyle: v.bodyStyle
            });
          }
        });
      }
    });
    
    // If not enough recommendations, add top-rated vehicles
    if (recommended.length < 6) {
      const topVehicles = getVehicles({ 
        sortBy: 'rating', 
        sortOrder: 'desc', 
        limit: 10 
      });
      
      topVehicles.forEach(v => {
        const vehicleName = `${v.year} ${v.make} ${v.model}`;
        // Avoid duplicates and vehicles user already has
        const isOwned = userPreferences.some((up: { name: string }) => up.name === vehicleName);
        if (!recommended.find(r => r.name === vehicleName) && !isOwned && recommended.length < 8) {
          recommended.push({
            name: vehicleName,
            image: vehicleImageFor(vehicleName),
            staffRating: v.staffRating || generateStaffRating(vehicleName),
            communityRating: v.communityRating || generateCommunityRating(vehicleName),
            bodyStyle: v.bodyStyle
          });
        }
      });
    }
    
    return recommended.slice(0, 8);
  }, [userPreferences]);

  // Get vehicles for current tab
  const displayVehicles = useMemo((): VehicleDisplay[] => {
    switch (activeTab) {
      case 'viewed':
        return viewedVehicles.map(v => ({
          name: v.name,
          image: vehicleImageFor(v.name),
          staffRating: generateStaffRating(v.name),
          communityRating: generateCommunityRating(v.name)
        }));
      case 'searched':
        return searchedVehicles.map(s => ({
          name: s.vehicleName,
          image: vehicleImageFor(s.vehicleName),
          staffRating: generateStaffRating(s.vehicleName),
          communityRating: generateCommunityRating(s.vehicleName)
        }));
      case 'youMightLike':
        return recommendations;
      default:
        return [];
    }
  }, [activeTab, viewedVehicles, searchedVehicles, recommendations]);

  const handleViewVehicle = (vehicleName: string) => {
    const parsed = parseVehicleName(vehicleName);
    navigate(`/vehicles/${parsed.year}/${parsed.make}/${parsed.model}`);
  };

  const handleScroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = 320;
      scrollContainerRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  // Check if viewport is below max container width for responsive padding
  const [isNarrowScreen, setIsNarrowScreen] = useState(window.innerWidth < 1280);

  useEffect(() => {
    const checkWidth = () => setIsNarrowScreen(window.innerWidth < 1280);
    window.addEventListener('resize', checkWidth);
    return () => window.removeEventListener('resize', checkWidth);
  }, []);

  // Tab configuration
  const tabs: { id: TabType; label: string; icon: string }[] = [
    { id: 'youMightLike', label: 'You Might Like', icon: 'auto_awesome' },
    { id: 'viewed', label: 'Viewed', icon: 'visibility' },
    { id: 'searched', label: 'Searched', icon: 'search' }
  ];

  // Styles - Dark Mode Version
  // Section wrapper with dark background, rounded corners like TrendingStories
  const containerStyle: React.CSSProperties = {
    width: '100%',
    maxWidth: 'var(--max-width-container, 1280px)',
    margin: '0 auto',
    marginBottom: 'var(--section-spacing-vertical, 32px)',
    background: 'var(--color-neutrals-1, #141416)',
    borderRadius: 'var(--border-radius-lg, 16px)',
    paddingTop: isMobile ? 'var(--spacing-3, 24px)' : 'var(--spacing-4, 32px)',
    paddingBottom: isMobile ? 'var(--spacing-3, 24px)' : 'var(--spacing-4, 32px)',
    paddingLeft: isMobile ? 'var(--spacing-2, 16px)' : 'var(--spacing-4, 32px)',
    paddingRight: isMobile ? 'var(--spacing-2, 16px)' : 'var(--spacing-4, 32px)',
    overflow: 'hidden'
  };

  const headerStyle: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: isMobile ? 'var(--spacing-2, 16px)' : 'var(--spacing-3, 24px)',
    flexWrap: 'wrap',
    gap: 'var(--spacing-2, 16px)'
  };

  const titleContainerStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: 'var(--spacing-2, 16px)'
  };

  const titleStyle: React.CSSProperties = {
    fontFamily: 'var(--font-heading, Poppins, sans-serif)',
    fontSize: isMobile ? '18px' : '24px',
    fontWeight: 700,
    color: 'var(--color-white, #FFFFFF)',
    margin: 0,
    lineHeight: 1.2,
  };

  const titleIconStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: isMobile ? '28px' : '36px',
    height: isMobile ? '28px' : '36px',
    backgroundColor: 'var(--color-primary-1, #E90C17)',
    borderRadius: 'var(--border-radius-sm, 4px)',
    color: 'var(--color-white, #FFFFFF)',
  };

  const tabsContainerStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: 'var(--spacing-1, 8px)',
    backgroundColor: 'var(--color-neutrals-2, #23262F)',
    padding: '4px',
    borderRadius: 'var(--border-radius-md, 8px)'
  };

  const getTabStyle = (tabId: TabType): React.CSSProperties => {
    const isActive = activeTab === tabId;
    const isHovered = hoveredTab === tabId;
    return {
      display: 'flex',
      alignItems: 'center',
      gap: '6px',
      padding: isMobile ? '8px 12px' : '8px 16px',
      backgroundColor: isActive ? 'var(--color-neutrals-3, #353945)' : 'transparent',
      border: 'none',
      borderRadius: 'var(--border-radius-sm, 4px)',
      fontFamily: 'var(--font-heading, Poppins, sans-serif)',
      fontSize: isMobile ? '12px' : '14px',
      fontWeight: isActive ? 600 : 500,
      color: isActive ? 'var(--color-white, #FFFFFF)' : (isHovered ? 'var(--color-neutrals-5, #B1B5C3)' : 'var(--color-neutrals-4, #6E7481)'),
      cursor: 'pointer',
      transition: 'all var(--transition-fast, 150ms ease-in-out)',
      boxShadow: isActive ? '0px 2px 8px rgba(0, 0, 0, 0.3)' : 'none',
      whiteSpace: 'nowrap'
    };
  };

  const scrollWrapperStyle: React.CSSProperties = {
    position: 'relative'
  };

  const scrollContainerStyle: React.CSSProperties = {
    display: 'flex',
    gap: 'var(--spacing-3, 24px)',
    overflowX: 'auto',
    scrollbarWidth: 'none',
    msOverflowStyle: 'none',
    paddingBottom: 'var(--spacing-1, 8px)',
    marginRight: isMobile ? '-16px' : '-32px'
  };

  const scrollBtnStyle = (direction: 'left' | 'right', visible: boolean): React.CSSProperties => ({
    position: 'absolute',
    top: '50%',
    [direction]: '-16px',
    transform: 'translateY(-50%)',
    width: '40px',
    height: '40px',
    borderRadius: 'var(--border-radius-circle, 50%)',
    background: 'var(--color-neutrals-2, #23262F)',
    border: '1px solid var(--color-neutrals-3, #353945)',
    boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.4)',
    display: visible ? 'flex' : 'none',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    zIndex: 10,
    transition: 'all var(--transition-fast, 150ms ease-in-out)',
    color: 'var(--color-white, #FFFFFF)'
  });

  const emptyStateStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: isMobile ? 'var(--spacing-4, 32px) var(--spacing-2, 16px)' : 'var(--spacing-5, 40px)',
    background: 'var(--color-neutrals-2, #23262F)',
    borderRadius: 'var(--border-radius-md, 8px)',
    textAlign: 'center',
    gap: 'var(--spacing-2, 16px)',
    minHeight: '200px'
  };

  const emptyIconStyle: React.CSSProperties = {
    width: '56px',
    height: '56px',
    borderRadius: '50%',
    background: 'var(--color-neutrals-3, #353945)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'var(--accent)'
  };

  const emptyTitleStyle: React.CSSProperties = {
    fontFamily: 'var(--font-heading, Poppins, sans-serif)',
    fontSize: '16px',
    fontWeight: 600,
    color: 'var(--color-white, #FFFFFF)',
    margin: 0
  };

  const emptyDescStyle: React.CSSProperties = {
    fontFamily: 'var(--font-body, Geist, sans-serif)',
    fontSize: '14px',
    color: 'var(--color-neutrals-5, #B1B5C3)',
    margin: 0,
    maxWidth: '280px'
  };

  const exploreBtnStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: 'var(--spacing-1, 8px)',
    padding: 'var(--spacing-component-md, 12px) var(--spacing-3, 24px)',
    background: 'var(--color-primary-1, #E90C17)',
    border: 'none',
    borderRadius: 'var(--border-radius-md, 8px)',
    color: 'var(--color-white, #FFFFFF)',
    fontFamily: 'var(--font-heading, Poppins, sans-serif)',
    fontSize: '14px',
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'all var(--transition-fast, 150ms ease-in-out)'
  };

  // Get empty state content based on active tab
  const getEmptyState = () => {
    switch (activeTab) {
      case 'viewed':
        return {
          icon: 'visibility',
          title: 'No Recently Viewed Vehicles',
          description: 'Start exploring vehicles to see your viewing history here.',
          buttonText: 'Explore Vehicles',
          buttonAction: () => navigate('/vehicles')
        };
      case 'searched':
        return {
          icon: 'search',
          title: 'No Recent Searches',
          description: 'Search for vehicles to see your search history here.',
          buttonText: 'Search Vehicles',
          buttonAction: () => navigate('/vehicles')
        };
      case 'youMightLike':
        return {
          icon: 'auto_awesome',
          title: 'Personalize Your Experience',
          description: 'Tell us about your interests to get personalized recommendations.',
          buttonText: 'Complete Profile',
          buttonAction: () => navigate('/profile')
        };
      default:
        return {
          icon: 'directions_car',
          title: 'No Vehicles',
          description: 'No vehicles to display.',
          buttonText: 'Explore',
          buttonAction: () => navigate('/vehicles')
        };
    }
  };

  const emptyState = getEmptyState();

  return (
    <div className={className} style={containerStyle}>
      <div style={headerStyle}>
        <div style={titleContainerStyle}>
          <div style={titleIconStyle}>
            <Icon name="history" size={isMobile ? 18 : 22} />
          </div>
          <h2 style={titleStyle}>Your Activity</h2>
          <Badge variant="new" size="sm">
            {displayVehicles.length} {displayVehicles.length === 1 ? 'Vehicle' : 'Vehicles'}
          </Badge>
        </div>

        <div style={tabsContainerStyle}>
          {tabs.map(tab => (
            <button
              key={tab.id}
              style={getTabStyle(tab.id)}
              onClick={() => setActiveTab(tab.id)}
              onMouseEnter={() => setHoveredTab(tab.id)}
              onMouseLeave={() => setHoveredTab(null)}
              type="button"
            >
              <Icon name={tab.icon} size={16} />
              {!isMobile && tab.label}
            </button>
          ))}
        </div>
      </div>

      {displayVehicles.length === 0 ? (
        <div style={emptyStateStyle}>
          <div style={emptyIconStyle}>
            <Icon name={emptyState.icon} size={28} />
          </div>
          <h3 style={emptyTitleStyle}>{emptyState.title}</h3>
          <p style={emptyDescStyle}>{emptyState.description}</p>
          <button style={exploreBtnStyle} onClick={emptyState.buttonAction} type="button">
            <Icon name="explore" size={18} />
            {emptyState.buttonText}
          </button>
        </div>
      ) : (
        <div style={scrollWrapperStyle}>
          {!isMobile && (
            <>
              <button
                style={scrollBtnStyle('left', canScrollLeft)}
                onClick={() => handleScroll('left')}
                aria-label="Scroll left"
                type="button"
              >
                <Icon name="chevron_left" size={24} />
              </button>
              <button
                style={scrollBtnStyle('right', canScrollRight)}
                onClick={() => handleScroll('right')}
                aria-label="Scroll right"
                type="button"
              >
                <Icon name="chevron_right" size={24} />
              </button>
            </>
          )}

          <div ref={scrollContainerRef} style={scrollContainerStyle}>
            {displayVehicles.map((vehicle, index) => {
              const parsed = parseVehicleName(vehicle.name);
              const userRating = getUserRating(vehicle.name);
              return (
                <div
                  key={`${vehicle.name}-${index}`}
                  style={{ 
                    flex: '0 0 auto',
                    width: isMobile ? '300px' : '363px',
                    minWidth: isMobile ? '300px' : '363px',
                  }}
                >
                  <Card
                    image={vehicle.image || ''}
                    title={vehicle.name}
                    type={activeTab === 'youMightLike' && vehicle.bodyStyle ? vehicle.bodyStyle : undefined}
                    ratings={[
                      { value: vehicle.staffRating.toFixed(1), color: '#FFB74D' },
                      { value: (vehicle.communityRating / 2).toFixed(1), color: '#4FC3F7' }
                    ]}
                    hasMultipleRatings={true}
                    onBookmark={() => {
                      // Toggle bookmark functionality could be added here
                    }}
                    isBookmarked={false}
                    onAction={() => handleViewVehicle(vehicle.name)}
                    actionText="View Details"
                    onRate={() => {
                      navigate(`/vehicles/${parsed.year}/${parsed.make}/${parsed.model}?openRating=true`);
                    }}
                    userRating={userRating ? userRating * 20 : undefined}
                  />
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default PersonalizedVehicles;

