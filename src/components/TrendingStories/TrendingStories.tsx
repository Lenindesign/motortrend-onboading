/**
 * TrendingStories Component
 * Full-width horizontal carousel stripe for trending automotive stories
 * Inspired by Yahoo Trending design
 */

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../Icon';
import { getVehicles } from '../../api/vehiclesApi';
import { vehicleImageFor, parseVehicleName } from '../../utils/vehicleImages';
import { generateStaffRating } from '../../utils/vehicleRatings';

export interface TrendingStory {
  id: string;
  rank: number;
  title: string;
  subtitle: string;
  imageUrl: string;
  slug?: string;
  trending?: 'up' | 'down';
  staffRating?: number;
  vehicleName?: string;
}

export interface TrendingStoriesProps {
  stories?: TrendingStory[];
  title?: string;
  maxStories?: number;
}

export const TrendingStories: React.FC<TrendingStoriesProps> = ({
  stories: customStories,
  title = 'Trending Now',
  maxStories = 10,
}) => {
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isContainerHovered, setIsContainerHovered] = useState(false);
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);
  const [hoveredNav, setHoveredNav] = useState<'prev' | 'next' | null>(null);
  const [hoveredDot, setHoveredDot] = useState<number | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);
  const carouselRef = useRef<HTMLDivElement>(null);
  const autoPlayRef = useRef<number | null>(null);

  // Responsive breakpoints
  useEffect(() => {
    const checkBreakpoints = () => {
      setIsMobile(window.innerWidth <= 768);
      setIsTablet(window.innerWidth <= 1024);
    };
    checkBreakpoints();
    window.addEventListener('resize', checkBreakpoints);
    return () => window.removeEventListener('resize', checkBreakpoints);
  }, []);

  // Generate trending stories from vehicle database
  const trendingStories = useMemo(() => {
    if (customStories) return customStories.slice(0, maxStories);

    const vehicles = getVehicles();
    
    // Get latest/newest vehicles and generate trending stories
    const sortedVehicles = [...vehicles]
      .filter(v => parseInt(v.year, 10) >= 2024) // Focus on newer vehicles
      .sort((a, b) => parseInt(b.year, 10) - parseInt(a.year, 10) || a.make.localeCompare(b.make))
      .slice(0, maxStories);

    const trendingPhrases = [
      'First Drive Review: Is It Worth the Hype?',
      'Breaking: Major Updates Revealed',
      'Exclusive: What We Know So Far',
      'Full Review: Better Than Expected?',
      'Deep Dive: Performance & Features',
      'Comparison: How It Stacks Up',
      'Long-Term Test: Real-World Results',
      'Expert Take: The Good and Bad',
      'Track Test: Pushing the Limits',
      'Owner Review: One Year Later',
    ];

    return sortedVehicles.map((vehicle, index) => {
      const vehicleName = `${vehicle.year} ${vehicle.make} ${vehicle.model}`;
      const staffRating = generateStaffRating(vehicleName);
      const imageUrl = vehicle.image || vehicleImageFor(vehicleName);
      
      // Assign trending status based on position (only up or down)
      const trending: 'up' | 'down' = index <= 5 ? 'up' : 'down';

      return {
        id: `trending-${index}`,
        rank: index + 1,
        title: vehicleName,
        subtitle: trendingPhrases[index % trendingPhrases.length],
        imageUrl,
        slug: `${vehicle.year}-${vehicle.make}-${vehicle.model}`.toLowerCase().replace(/\s+/g, '-'),
        trending,
        staffRating,
        vehicleName,
      };
    });
  }, [customStories, maxStories]);

  // Items per slide based on screen size
  const itemsPerSlide = isMobile ? 1 : isTablet ? 3 : 5;
  const totalSlides = Math.ceil(trendingStories.length / itemsPerSlide);

  // Auto-play carousel
  useEffect(() => {
    if (!isContainerHovered && totalSlides > 1) {
      autoPlayRef.current = window.setInterval(() => {
        setCurrentSlide(prev => (prev + 1) % totalSlides);
      }, 5000);
    }
    return () => {
      if (autoPlayRef.current) clearInterval(autoPlayRef.current);
    };
  }, [isContainerHovered, totalSlides]);

  const handleStoryClick = (story: TrendingStory) => {
    if (story.vehicleName) {
      const { year, make, model } = parseVehicleName(story.vehicleName);
      navigate(`/vehicles/${year}/${make}/${model}`);
    } else if (story.slug) {
      navigate(`/article/${story.slug}`);
    }
  };

  const handlePrev = () => {
    setCurrentSlide(prev => (prev - 1 + totalSlides) % totalSlides);
  };

  const handleNext = () => {
    setCurrentSlide(prev => (prev + 1) % totalSlides);
  };

  // Touch/swipe handling for mobile
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const minSwipeDistance = 50;

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    if (Math.abs(distance) >= minSwipeDistance) {
      if (distance > 0) handleNext();
      else handlePrev();
    }
  };

  // Styles
  const stripeStyle: React.CSSProperties = {
    width: '100%',
    backgroundColor: 'var(--color-neutrals-1, #141416)',
    borderRadius: 'var(--border-radius-lg, 16px)',
    padding: isMobile ? 'var(--spacing-3, 24px) 0' : 'var(--spacing-4, 32px) 0',
    overflow: 'hidden',
  };

  const headerStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: isMobile ? '0 var(--spacing-2, 16px)' : '0 var(--spacing-4, 32px)',
    marginBottom: isMobile ? 'var(--spacing-2, 16px)' : 'var(--spacing-3, 24px)',
  };

  const titleContainerStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: 'var(--spacing-2, 16px)',
  };

  const iconStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: isMobile ? '28px' : '36px',
    height: isMobile ? '28px' : '36px',
    backgroundColor: 'var(--color-primary-1, #E90C17)',
    borderRadius: 'var(--border-radius-sm, 4px)',
    color: 'var(--color-white, #FFFFFF)',
  };

  const titleStyle: React.CSSProperties = {
    fontFamily: 'var(--font-heading, Poppins, sans-serif)',
    fontWeight: 700,
    fontSize: isMobile ? '18px' : '24px',
    lineHeight: 1.2,
    color: 'var(--color-white, #FFFFFF)',
    margin: 0,
  };

  const dotsContainerStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  };

  const getDotStyle = (index: number): React.CSSProperties => {
    const isActive = index === currentSlide;
    const isHovered = hoveredDot === index;
    return {
      width: isActive ? '24px' : '8px',
      height: '8px',
      borderRadius: isActive ? '4px' : '50%',
      backgroundColor: isActive 
        ? 'var(--color-primary-1, #E90C17)' 
        : isHovered 
          ? 'var(--color-neutrals-4, #6E7481)' 
          : 'var(--color-neutrals-5, #B1B5C3)',
      border: 'none',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      padding: 0,
    };
  };

  const carouselContainerStyle: React.CSSProperties = {
    position: 'relative',
    width: '100%',
    overflow: 'hidden',
  };

  const carouselTrackStyle: React.CSSProperties = {
    display: 'flex',
    gap: isMobile ? '12px' : 'var(--spacing-3, 24px)',
    padding: isMobile ? '0 var(--spacing-2, 16px)' : '0 var(--spacing-4, 32px)',
    transition: 'transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
    transform: `translateX(-${currentSlide * 100}%)`,
  };

  const getCardStyle = (index: number): React.CSSProperties => {
    const isHovered = hoveredCard === index;
    const cardWidth = isMobile ? '280px' : isTablet ? 'calc(33.333% - 16px)' : 'calc(20% - 19.2px)';
    return {
      flex: `0 0 ${cardWidth}`,
      minWidth: cardWidth,
      backgroundColor: isHovered ? 'var(--color-neutrals-2, #23262F)' : 'transparent',
      borderRadius: 'var(--border-radius-md, 8px)',
      overflow: 'hidden',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      transform: isHovered ? 'translateY(-4px)' : 'none',
    };
  };

  const imageContainerStyle: React.CSSProperties = {
    position: 'relative',
    width: '100%',
    aspectRatio: '16 / 9',
    borderRadius: 'var(--border-radius-md, 8px)',
    overflow: 'hidden',
  };

  const getImageStyle = (index: number): React.CSSProperties => {
    const isHovered = hoveredCard === index;
    return {
      width: '100%',
      height: '100%',
      objectFit: 'cover',
      transition: 'transform 0.5s ease',
      transform: isHovered ? 'scale(1.08)' : 'scale(1)',
    };
  };

  const rankBadgeStyle: React.CSSProperties = {
    position: 'absolute',
    top: '8px',
    left: '8px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '28px',
    height: '28px',
    backgroundColor: 'rgba(20, 20, 22, 0.85)',
    backdropFilter: 'blur(8px)',
    borderRadius: 'var(--border-radius-sm, 4px)',
    fontFamily: 'var(--font-heading, Poppins, sans-serif)',
    fontWeight: 700,
    fontSize: '14px',
    color: 'var(--color-white, #FFFFFF)',
  };

  const getTrendingIconStyle = (trending?: 'up' | 'down'): React.CSSProperties => ({
    position: 'absolute',
    top: '8px',
    right: '8px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '24px',
    height: '24px',
    backgroundColor: trending === 'up'
      ? 'var(--color-semantic-success, #34A853)'
      : 'var(--color-semantic-error, #EA4335)',
    borderRadius: '50%',
    color: 'var(--color-white, #FFFFFF)',
  });

  const contentStyle: React.CSSProperties = {
    padding: 'var(--spacing-2, 16px)',
  };

  const cardTitleStyle: React.CSSProperties = {
    fontFamily: 'var(--font-heading, Poppins, sans-serif)',
    fontWeight: 600,
    fontSize: isMobile ? '14px' : '15px',
    lineHeight: 1.3,
    color: 'var(--color-white, #FFFFFF)',
    margin: '0 0 6px 0',
    display: '-webkit-box',
    WebkitLineClamp: 1,
    WebkitBoxOrient: 'vertical',
    overflow: 'hidden',
  };

  const cardSubtitleStyle: React.CSSProperties = {
    fontFamily: 'var(--font-body, Geist, sans-serif)',
    fontWeight: 400,
    fontSize: '13px',
    lineHeight: 1.4,
    color: 'var(--color-neutrals-5, #B1B5C3)',
    margin: 0,
    display: '-webkit-box',
    WebkitLineClamp: 2,
    WebkitBoxOrient: 'vertical',
    overflow: 'hidden',
  };

  const ratingStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    marginTop: '8px',
  };

  const getNavStyle = (isPrev: boolean): React.CSSProperties => {
    const isHovered = hoveredNav === (isPrev ? 'prev' : 'next');
    return {
      position: 'absolute',
      top: '50%',
      transform: isHovered ? 'translateY(-50%) scale(1.1)' : 'translateY(-50%)',
      [isPrev ? 'left' : 'right']: isMobile ? '8px' : '16px',
      width: isMobile ? '40px' : '48px',
      height: isMobile ? '40px' : '48px',
      borderRadius: '50%',
      backgroundColor: isHovered ? 'rgba(233, 12, 23, 0.9)' : 'rgba(20, 20, 22, 0.7)',
      backdropFilter: 'blur(8px)',
      border: '1px solid rgba(255, 255, 255, 0.1)',
      color: 'var(--color-white, #FFFFFF)',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 20,
      transition: 'all 0.3s ease',
      opacity: isContainerHovered || isMobile ? 1 : 0,
      pointerEvents: isContainerHovered || isMobile ? 'auto' : 'none',
    };
  };

  if (trendingStories.length === 0) return null;

  return (
    <div 
      style={stripeStyle}
      onMouseEnter={() => setIsContainerHovered(true)}
      onMouseLeave={() => setIsContainerHovered(false)}
    >
      {/* Header */}
      <div style={headerStyle}>
        <div style={titleContainerStyle}>
          <div style={iconStyle}>
            <Icon name="bolt" size={isMobile ? 18 : 22} />
          </div>
          <h2 style={titleStyle}>{title}</h2>
        </div>
        <div style={dotsContainerStyle}>
          {Array.from({ length: totalSlides }).map((_, index) => (
            <button
              key={index}
              style={getDotStyle(index)}
              onClick={() => setCurrentSlide(index)}
              onMouseEnter={() => setHoveredDot(index)}
              onMouseLeave={() => setHoveredDot(null)}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>

      {/* Carousel */}
      <div 
        style={carouselContainerStyle}
        ref={carouselRef}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        <div style={carouselTrackStyle}>
          {trendingStories.map((story, index) => (
            <div
              key={story.id}
              style={getCardStyle(index)}
              onClick={() => handleStoryClick(story)}
              onMouseEnter={() => setHoveredCard(index)}
              onMouseLeave={() => setHoveredCard(null)}
            >
              {/* Image */}
              <div style={imageContainerStyle}>
                <img
                  src={story.imageUrl}
                  alt={story.title}
                  style={getImageStyle(index)}
                />
                {/* Rank Badge */}
                <div style={rankBadgeStyle}>{story.rank}</div>
                {/* Trending Icon */}
                {story.trending && (
                  <div style={getTrendingIconStyle(story.trending)}>
                    <Icon 
                      name={story.trending === 'up' ? 'trending_up' : 'trending_down'} 
                      size={14} 
                    />
                  </div>
                )}
              </div>
              {/* Content */}
              <div style={contentStyle}>
                <h3 style={cardTitleStyle}>{story.title}</h3>
                <p style={cardSubtitleStyle}>{story.subtitle}</p>
                {story.staffRating && (
                  <div style={ratingStyle}>
                    <img 
                      src="https://d2kde5ohu8qb21.cloudfront.net/files/692374f1d13f5100022ddf61/mticon.svg" 
                      alt="MotorTrend" 
                      style={{ width: '14px', height: '14px' }}
                    />
                    <span style={{ 
                      fontFamily: 'var(--font-heading, Poppins, sans-serif)',
                      fontWeight: 600,
                      fontSize: '13px',
                      color: 'var(--color-white, #FFFFFF)',
                    }}>
                      {story.staffRating.toFixed(1)}
                    </span>
                    <span style={{ 
                      fontSize: '12px',
                      color: 'var(--color-neutrals-5, #B1B5C3)',
                    }}>
                      /10
                    </span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Navigation Arrows */}
        {totalSlides > 1 && (
          <>
            <button
              style={getNavStyle(true)}
              onClick={handlePrev}
              onMouseEnter={() => setHoveredNav('prev')}
              onMouseLeave={() => setHoveredNav(null)}
              aria-label="Previous slide"
            >
              <Icon name="chevron_left" size={24} />
            </button>
            <button
              style={getNavStyle(false)}
              onClick={handleNext}
              onMouseEnter={() => setHoveredNav('next')}
              onMouseLeave={() => setHoveredNav(null)}
              aria-label="Next slide"
            >
              <Icon name="chevron_right" size={24} />
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default TrendingStories;
