/**
 * User Ratings & Reviews Widget
 * Shows user ratings/reviews for the car user wants and similar vehicles
 * Pre-populates with user's desired car and finds similar alternatives
 */

import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../Icon';
import { Badge } from '../atoms/Badge/Badge';
import { parseVehicleName, vehicleImageFor } from '../../utils/vehicleImages';
import { generateUserReviews } from '../../utils/vehicleUserReviews';
import { getVehicles, getSimilarVehicles, getVehicleByName } from '../../api/vehiclesApi';
import { VehicleSearch } from '../VehicleSearch';
import type { ReviewData } from '../UserReviews/UserReviews';

export interface UserRatingsReviewsProps {
  className?: string;
}

interface OnboardingVehicle {
  name: string;
  ownership: 'own' | 'want' | 'previously_owned';
}

interface OnboardingData {
  vehicles?: OnboardingVehicle[];
  name?: string;
}

interface VehicleReviewSummary {
  vehicleName: string;
  vehicleImage: string | null;
  averageRating: number;
  totalReviews: number;
  topReview: ReviewData | null;
  categoryAverages: {
    reliability: number;
    driverExperience: number;
    budgetFriendly: number;
    manufacturerWarranty: number;
  };
}

export const UserRatingsReviews: React.FC<UserRatingsReviewsProps> = ({ className }) => {
  const navigate = useNavigate();
  const [isMobile, setIsMobile] = useState(false);
  const [wantedVehicles, setWantedVehicles] = useState<OnboardingVehicle[]>([]);
  const [selectedVehicleIndex] = useState(0);
  const [isViewAllHovered, setIsViewAllHovered] = useState(false);
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

  // Load user's vehicles from localStorage (prioritize 'want', fallback to 'own')
  useEffect(() => {
    const loadUserVehicles = () => {
      try {
        const onboardingDataStr = localStorage.getItem('onboardingData');
        if (onboardingDataStr) {
          const onboardingData: OnboardingData = JSON.parse(onboardingDataStr);
          const vehicles = onboardingData.vehicles || [];
          // Prioritize vehicles user wants, but fallback to owned vehicles
          const wanted = vehicles.filter(v => v.ownership === 'want');
          const owned = vehicles.filter(v => v.ownership === 'own');
          // Use 'want' vehicles if available, otherwise use 'own' vehicles
          setWantedVehicles(wanted.length > 0 ? wanted : owned);
        }
      } catch (error) {
        console.error('Error loading user vehicles:', error);
      }
    };

    loadUserVehicles();
    window.addEventListener('storage', loadUserVehicles);
    window.addEventListener('onboardingDataUpdated', loadUserVehicles);
    
    return () => {
      window.removeEventListener('storage', loadUserVehicles);
      window.removeEventListener('onboardingDataUpdated', loadUserVehicles);
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
  }, [wantedVehicles]);

  // Get similar vehicles for the selected wanted vehicle
  const similarVehicles = useMemo(() => {
    if (wantedVehicles.length === 0) return [];
    
    const selectedVehicle = wantedVehicles[selectedVehicleIndex];
    if (!selectedVehicle) return [];
    
    // Try to find the vehicle in our database
    const dbVehicle = getVehicleByName(selectedVehicle.name);
    
    if (dbVehicle) {
      return getSimilarVehicles(dbVehicle.id, 3);
    }
    
    // Fallback: Get vehicles by body style
    const allVehicles = getVehicles({ sortBy: 'rating', sortOrder: 'desc', limit: 10 });
    
    // Filter to find similar vehicles (same body style or similar price range)
    return allVehicles
      .filter(v => `${v.year} ${v.make} ${v.model}` !== selectedVehicle.name)
      .slice(0, 3);
  }, [wantedVehicles, selectedVehicleIndex]);

  // Generate review summaries for all vehicles to display using real database scores
  const vehicleSummaries = useMemo((): VehicleReviewSummary[] => {
    const summaries: VehicleReviewSummary[] = [];
    
    // Helper to generate category averages from database ratings
    const generateCategoryAverages = (staffRating: number, communityRating: number) => {
      // Use staff and community ratings to derive category scores
      // Convert from 0-10 scale to 0-100 percentage for the progress bars
      const baseScore = ((staffRating + communityRating) / 2) * 10; // Convert to 0-100
      
      // Add some variation to each category while keeping them realistic
      return {
        reliability: Math.min(100, Math.max(50, baseScore + (Math.random() * 10 - 5))),
        driverExperience: Math.min(100, Math.max(50, baseScore + (Math.random() * 10 - 5))),
        budgetFriendly: Math.min(100, Math.max(50, baseScore + (Math.random() * 15 - 7.5))),
        manufacturerWarranty: Math.min(100, Math.max(50, baseScore + (Math.random() * 10 - 5)))
      };
    };
    
    // Add the wanted vehicle first
    if (wantedVehicles.length > 0) {
      const wantedVehicle = wantedVehicles[selectedVehicleIndex];
      if (wantedVehicle) {
        // Fetch actual vehicle data from database
        const dbVehicle = getVehicleByName(wantedVehicle.name);
        const reviews = generateUserReviews(wantedVehicle.name);
        
        // Use actual database ratings
        const staffRating = dbVehicle?.staffRating || 7.5;
        const communityRating = dbVehicle?.communityRating || 7.0;
        const reviewCount = dbVehicle?.reviewCount || 25;
        
        // Average of staff and community ratings for display
        const avgRating = (staffRating + communityRating) / 2;
        
        const categoryAvg = generateCategoryAverages(staffRating, communityRating);
        
        summaries.push({
          vehicleName: wantedVehicle.name,
          vehicleImage: dbVehicle?.image || vehicleImageFor(wantedVehicle.name),
          averageRating: avgRating,
          totalReviews: reviewCount,
          topReview: reviews[0] || null,
          categoryAverages: categoryAvg
        });
      }
    }
    
    // Add similar vehicles using their actual database scores
    similarVehicles.forEach(vehicle => {
      const vehicleName = `${vehicle.year} ${vehicle.make} ${vehicle.model}`;
      const reviews = generateUserReviews(vehicleName);
      
      // Use actual database ratings directly
      const staffRating = vehicle.staffRating || 7.5;
      const communityRating = vehicle.communityRating || 7.0;
      const reviewCount = vehicle.reviewCount || 25;
      
      // Average of staff and community ratings for display
      const avgRating = (staffRating + communityRating) / 2;
      
      const categoryAvg = generateCategoryAverages(staffRating, communityRating);
      
      summaries.push({
        vehicleName,
        vehicleImage: vehicle.image || vehicleImageFor(vehicleName),
        averageRating: avgRating,
        totalReviews: reviewCount,
        topReview: reviews[0] || null,
        categoryAverages: categoryAvg
      });
    });
    
    return summaries;
  }, [wantedVehicles, selectedVehicleIndex, similarVehicles]);

  const handleViewVehicle = (vehicleName: string) => {
    const parsed = parseVehicleName(vehicleName);
    navigate(`/vehicles/${parsed.year}/${parsed.make}/${parsed.model}?tab=reviews`);
  };

  const handleViewAllReviews = () => {
    if (wantedVehicles.length > 0) {
      const parsed = parseVehicleName(wantedVehicles[selectedVehicleIndex].name);
      navigate(`/vehicles/${parsed.year}/${parsed.make}/${parsed.model}?tab=reviews`);
    }
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

  // Format rating for display (convert from 0-100 scale to 0-10)
  const formatRating = (rating: number): string => {
    // Ratings from generateUserReviews are already on 0-10 scale
    return rating.toFixed(1);
  };

  // Convert rating to 5-star scale for display
  const ratingTo5Stars = (rating: number): number => {
    return rating / 2;
  };

  // Check if viewport is at or above max container width
  const [_isFullWidth, setIsFullWidth] = useState(window.innerWidth >= 1280);
  
  useEffect(() => {
    const checkWidth = () => setIsFullWidth(window.innerWidth >= 1280);
    window.addEventListener('resize', checkWidth);
    return () => window.removeEventListener('resize', checkWidth);
  }, []);

  // Styles - Using standardized section padding from design system
  // NO internal vertical padding - parent container's gap handles spacing between sections
  // Full-width sections break out of container, so need their own side padding
  const containerStyle: React.CSSProperties = {
    width: '100%',
    maxWidth: 'var(--max-width-container, 1280px)',
    margin: '0 auto',
    boxSizing: 'border-box',
    paddingLeft: 0,
    paddingRight: 0,
  };

  const headerStyle: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 'var(--spacing-3, 24px)',
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
    fontSize: isMobile ? '20px' : '24px',
    fontWeight: 600,
    color: 'var(--color-neutrals-1, #141416)',
    margin: 0,
    display: 'flex',
    alignItems: 'center',
    gap: 'var(--spacing-1, 8px)'
  };

  const viewAllBtnStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    padding: 'var(--spacing-1, 8px) var(--spacing-2, 16px)',
    background: 'none',
    border: 'none',
    color: isViewAllHovered ? 'var(--color-primary-1, #E90C17)' : 'var(--color-neutrals-3, #353945)',
    fontFamily: 'var(--font-heading, Poppins, sans-serif)',
    fontSize: '14px',
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'color var(--transition-fast, 150ms ease-in-out)'
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
    paddingBottom: 'var(--spacing-1, 8px)'
  };

  const scrollBtnStyle = (direction: 'left' | 'right', visible: boolean): React.CSSProperties => ({
    position: 'absolute',
    top: '50%',
    [direction]: '-16px',
    transform: 'translateY(-50%)',
    width: '40px',
    height: '40px',
    borderRadius: 'var(--border-radius-circle, 50%)',
    background: 'var(--color-white, #FFFFFF)',
    border: '1px solid var(--color-neutrals-6, #E6E8EC)',
    boxShadow: 'var(--shadow-depth-5, 0px 4px 20px 0px rgba(20, 20, 22, 0.06))',
    display: visible ? 'flex' : 'none',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    zIndex: 10,
    transition: 'all var(--transition-fast, 150ms ease-in-out)',
    color: 'var(--color-neutrals-3, #353945)'
  });

  const cardStyle: React.CSSProperties = {
    flex: '0 0 auto',
    width: isMobile ? '280px' : '320px',
    background: 'var(--color-white, #FFFFFF)',
    border: '1px solid var(--color-neutrals-6, #E6E8EC)',
    borderRadius: 'var(--border-radius-lg, 16px)',
    overflow: 'hidden',
    boxShadow: 'var(--shadow-depth-5, 0px 4px 20px 0px rgba(20, 20, 22, 0.06))',
    transition: 'all var(--transition-fast, 150ms ease-in-out)',
    cursor: 'pointer'
  };

  const cardImageStyle: React.CSSProperties = {
    width: '100%',
    height: '160px',
    objectFit: 'cover',
    backgroundColor: 'var(--color-neutrals-7, #F4F5F6)'
  };

  const cardContentStyle: React.CSSProperties = {
    padding: 'var(--spacing-2, 16px)'
  };

  const vehicleNameStyle: React.CSSProperties = {
    fontFamily: 'var(--font-heading, Poppins, sans-serif)',
    fontSize: '16px',
    fontWeight: 600,
    color: 'var(--color-neutrals-1, #141416)',
    margin: 0,
    marginBottom: 'var(--spacing-1, 8px)',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis'
  };

  const ratingRowStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: 'var(--spacing-1, 8px)',
    marginBottom: 'var(--spacing-2, 16px)'
  };

  const starsContainerStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: '2px'
  };

  const starStyle: React.CSSProperties = {
    width: '16px',
    height: '16px',
    objectFit: 'contain'
  };

  const ratingTextStyle: React.CSSProperties = {
    fontFamily: 'var(--font-heading, Poppins, sans-serif)',
    fontSize: '16px',
    fontWeight: 600,
    color: 'var(--color-neutrals-1, #141416)'
  };

  const reviewCountStyle: React.CSSProperties = {
    fontFamily: 'var(--font-body, Geist, sans-serif)',
    fontSize: '13px',
    color: 'var(--color-neutrals-4, #6E7481)'
  };

  const categoryGridStyle: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: 'var(--spacing-1, 8px)',
    marginBottom: 'var(--spacing-2, 16px)'
  };

  const categoryItemStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: '2px'
  };

  const categoryLabelStyle: React.CSSProperties = {
    fontFamily: 'var(--font-body, Geist, sans-serif)',
    fontSize: '11px',
    color: 'var(--color-neutrals-4, #6E7481)',
    textTransform: 'uppercase',
    letterSpacing: '0.5px'
  };

  const categoryBarContainerStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: '6px'
  };

  const categoryBarBgStyle: React.CSSProperties = {
    flex: 1,
    height: '4px',
    backgroundColor: 'var(--color-neutrals-6, #E6E8EC)',
    borderRadius: '2px',
    overflow: 'hidden'
  };

  const categoryBarFillStyle = (percentage: number): React.CSSProperties => ({
    height: '100%',
    width: `${percentage}%`,
    backgroundColor: 'var(--color-rating-community)',
    color: 'var(--color-rating-community)',
    borderRadius: '2px',
    transition: 'width var(--transition-normal, 250ms ease-in-out)'
  });

  const categoryScoreStyle: React.CSSProperties = {
    fontFamily: 'var(--font-heading, Poppins, sans-serif)',
    fontSize: '11px',
    fontWeight: 600,
    color: 'var(--color-neutrals-2, #23262F)',
    minWidth: '24px',
    textAlign: 'right'
  };

  const reviewSnippetStyle: React.CSSProperties = {
    padding: 'var(--spacing-component-md, 12px)',
    backgroundColor: 'var(--color-neutrals-7, #F4F5F6)',
    borderRadius: 'var(--border-radius-md, 8px)'
  };

  const snippetQuoteStyle: React.CSSProperties = {
    fontFamily: 'var(--font-body, Geist, sans-serif)',
    fontSize: '13px',
    fontStyle: 'italic',
    color: 'var(--color-neutrals-2, #23262F)',
    lineHeight: 1.5,
    margin: 0,
    marginBottom: 'var(--spacing-1, 8px)',
    display: '-webkit-box',
    WebkitLineClamp: 2,
    WebkitBoxOrient: 'vertical',
    overflow: 'hidden'
  };

  const snippetAuthorStyle: React.CSSProperties = {
    fontFamily: 'var(--font-body, Geist, sans-serif)',
    fontSize: '12px',
    color: 'var(--color-neutrals-4, #6E7481)',
    margin: 0
  };

  const emptyStateStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: isMobile ? 'var(--spacing-4, 32px) var(--spacing-2, 16px)' : 'var(--spacing-5, 40px)',
    background: 'var(--color-neutrals-7, #F4F5F6)',
    borderRadius: 'var(--border-radius-lg, 16px)',
    textAlign: 'center',
    gap: 'var(--spacing-2, 16px)'
  };

  const emptyIconStyle: React.CSSProperties = {
    width: '64px',
    height: '64px',
    borderRadius: '50%',
    background: 'var(--color-white, #FFFFFF)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'var(--color-neutrals-4, #6E7481)'
  };

  const emptyTitleStyle: React.CSSProperties = {
    fontFamily: 'var(--font-heading, Poppins, sans-serif)',
    fontSize: '18px',
    fontWeight: 600,
    color: 'var(--color-neutrals-1, #141416)',
    margin: 0
  };

  const emptyDescStyle: React.CSSProperties = {
    fontFamily: 'var(--font-body, Geist, sans-serif)',
    fontSize: '14px',
    color: 'var(--color-neutrals-4, #6E7481)',
    margin: 0,
    maxWidth: '320px'
  };

  const badgeContainerStyle: React.CSSProperties = {
    position: 'absolute',
    top: 'var(--spacing-1, 8px)',
    left: 'var(--spacing-1, 8px)',
    zIndex: 5
  };

  // Render star rating
  const renderStars = (rating: number) => {
    const starRating = ratingTo5Stars(rating);
    return (
      <div style={starsContainerStyle}>
        {[1, 2, 3, 4, 5].map((star) => {
          const isFilled = star <= Math.floor(starRating);
          const isHalf = star === Math.ceil(starRating) && starRating % 1 !== 0;
          return (
            <img
              key={star}
              src={
                isFilled
                  ? "https://www.motortrend.com/files/691bde547554840002bab60c/star.svg"
                  : isHalf
                  ? "https://www.motortrend.com/files/691c8ba6a619270002cb5797/half-star.svg"
                  : "https://www.motortrend.com/files/691bde5264217700021d6b71/star-stroke.svg"
              }
              alt={`Star ${star}`}
              style={starStyle}
            />
          );
        })}
      </div>
    );
  };

  // Empty state when user has no wanted vehicle
  if (wantedVehicles.length === 0) {
    return (
      <div className={className} style={containerStyle}>
        <div style={headerStyle}>
          <div style={titleContainerStyle}>
            <h2 style={titleStyle}>
              <Icon name="reviews" size={24} />
              User Ratings & Reviews
            </h2>
          </div>
        </div>
        <div style={emptyStateStyle}>
          <div style={emptyIconStyle}>
            <Icon name="rate_review" size={32} />
          </div>
          <h3 style={emptyTitleStyle}>See What Owners Are Saying</h3>
          <p style={emptyDescStyle}>
            Search for a car you're interested in to see real owner reviews and ratings.
          </p>
          <div style={{ width: '100%', maxWidth: '400px' }}>
            <VehicleSearch
              onVehicleSelect={(vehicle) => {
                // Save vehicle to localStorage with 'want' ownership
                try {
                  const onboardingDataStr = localStorage.getItem('onboardingData');
                  const data = onboardingDataStr ? JSON.parse(onboardingDataStr) : { vehicles: [] };
                  if (!data.vehicles) data.vehicles = [];
                  // Check if vehicle already exists
                  const existingIndex = data.vehicles.findIndex((v: { name: string }) => v.name === vehicle.name);
                  if (existingIndex === -1) {
                    const parsed = parseVehicleName(vehicle.name);
                    data.vehicles.push({
                      name: vehicle.name,
                      year: decodeURIComponent(parsed.year),
                      make: decodeURIComponent(parsed.make),
                      model: decodeURIComponent(parsed.model),
                      ownership: 'want'
                    });
                    localStorage.setItem('onboardingData', JSON.stringify(data));
                    window.dispatchEvent(new CustomEvent('onboardingDataUpdated'));
                  }
                } catch (error) {
                  console.error('Error saving vehicle:', error);
                }
              }}
              placeholder="Search for a vehicle..."
              defaultOwnership="want"
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={className} style={containerStyle}>
      <div style={headerStyle}>
        <div style={titleContainerStyle}>
          <h2 style={titleStyle}>
            <Icon name="reviews" size={24} />
            User Ratings & Reviews
          </h2>
          <Badge variant="info" size="sm">
            {vehicleSummaries.length} Vehicles
          </Badge>
        </div>
        <button
          style={viewAllBtnStyle}
          onClick={handleViewAllReviews}
          onMouseEnter={() => setIsViewAllHovered(true)}
          onMouseLeave={() => setIsViewAllHovered(false)}
        >
          View All Reviews
          <Icon name="arrow_forward" size={16} />
        </button>
      </div>

      <div style={scrollWrapperStyle}>
        {!isMobile && (
          <>
            <button
              style={scrollBtnStyle('left', canScrollLeft)}
              onClick={() => handleScroll('left')}
              aria-label="Scroll left"
            >
              <Icon name="chevron_left" size={24} />
            </button>
            <button
              style={scrollBtnStyle('right', canScrollRight)}
              onClick={() => handleScroll('right')}
              aria-label="Scroll right"
            >
              <Icon name="chevron_right" size={24} />
            </button>
          </>
        )}

        <div ref={scrollContainerRef} style={scrollContainerStyle}>
          {vehicleSummaries.map((summary, index) => (
            <div
              key={summary.vehicleName}
              style={cardStyle}
              onClick={() => handleViewVehicle(summary.vehicleName)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === 'Enter' && handleViewVehicle(summary.vehicleName)}
            >
              <div style={{ position: 'relative' }}>
                {index === 0 && (
                  <div style={badgeContainerStyle}>
                    <Badge variant="success" size="sm">Your Pick</Badge>
                  </div>
                )}
                {index > 0 && (
                  <div style={badgeContainerStyle}>
                    <Badge variant="neutral" size="sm">Similar</Badge>
                  </div>
                )}
                {summary.vehicleImage ? (
                  <img
                    src={summary.vehicleImage}
                    alt={summary.vehicleName}
                    style={cardImageStyle}
                  />
                ) : (
                  <div style={{ ...cardImageStyle, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Icon name="directions_car" size={48} style={{ color: 'var(--color-neutrals-4, #6E7481)' }} />
                  </div>
                )}
              </div>

              <div style={cardContentStyle}>
                <h3 style={vehicleNameStyle}>{summary.vehicleName}</h3>
                
                <div style={ratingRowStyle}>
                  {renderStars(summary.averageRating)}
                  <span style={ratingTextStyle}>{formatRating(summary.averageRating)}</span>
                  <span style={reviewCountStyle}>({summary.totalReviews} reviews)</span>
                </div>

                <div style={categoryGridStyle}>
                  <div style={categoryItemStyle}>
                    <span style={categoryLabelStyle}>Reliability</span>
                    <div style={categoryBarContainerStyle}>
                      <div style={categoryBarBgStyle}>
                        <div style={categoryBarFillStyle(summary.categoryAverages.reliability)} />
                      </div>
                      <span style={categoryScoreStyle}>{(summary.categoryAverages.reliability / 20).toFixed(1)}</span>
                    </div>
                  </div>
                  <div style={categoryItemStyle}>
                    <span style={categoryLabelStyle}>Experience</span>
                    <div style={categoryBarContainerStyle}>
                      <div style={categoryBarBgStyle}>
                        <div style={categoryBarFillStyle(summary.categoryAverages.driverExperience)} />
                      </div>
                      <span style={categoryScoreStyle}>{(summary.categoryAverages.driverExperience / 20).toFixed(1)}</span>
                    </div>
                  </div>
                  <div style={categoryItemStyle}>
                    <span style={categoryLabelStyle}>Value</span>
                    <div style={categoryBarContainerStyle}>
                      <div style={categoryBarBgStyle}>
                        <div style={categoryBarFillStyle(summary.categoryAverages.budgetFriendly)} />
                      </div>
                      <span style={categoryScoreStyle}>{(summary.categoryAverages.budgetFriendly / 20).toFixed(1)}</span>
                    </div>
                  </div>
                  <div style={categoryItemStyle}>
                    <span style={categoryLabelStyle}>Warranty</span>
                    <div style={categoryBarContainerStyle}>
                      <div style={categoryBarBgStyle}>
                        <div style={categoryBarFillStyle(summary.categoryAverages.manufacturerWarranty)} />
                      </div>
                      <span style={categoryScoreStyle}>{(summary.categoryAverages.manufacturerWarranty / 20).toFixed(1)}</span>
                    </div>
                  </div>
                </div>

                {summary.topReview && (
                  <div style={reviewSnippetStyle}>
                    <p style={snippetQuoteStyle}>"{summary.topReview.title}"</p>
                    <p style={snippetAuthorStyle}>— {summary.topReview.reviewerName}</p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default UserRatingsReviews;

