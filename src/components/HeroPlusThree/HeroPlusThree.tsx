/**
 * Hero Plus Three Component
 * Migrated to inline styles for Tailwind compatibility
 */

import React, { useState, useEffect } from 'react';
import { HeroCard } from '../HeroCard';
import { VerticalCard } from '../VerticalCard';
import { VehiclesSection } from '../VehiclesSection';
import Icon from '../Icon';

export interface VehicleSlider {
  title: string;
  vehicles: Array<{ name: string }>;
  showMoreVisible?: boolean;
  onShowMore?: () => void;
}

export interface HeroPlusThreeProps {
  title?: string;
  hero: {
    imageUrl: string;
    title: string;
    onClick?: () => void;
  };
  cards: Array<{
    imageUrl: string;
    title: string;
    type?: 'Video' | 'Article';
    onClick?: () => void;
  }>;
  vehicleSliders?: VehicleSlider[];
  onViewAll?: () => void;
}

export const HeroPlusThree: React.FC<HeroPlusThreeProps> = ({ title, hero, cards, vehicleSliders = [], onViewAll }) => {
  const [isMobile, setIsMobile] = useState(false);
  const [isViewAllHovered, setIsViewAllHovered] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const containerStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: 'var(--spacing-3, 24px)',
    width: '100%',
  };

  const headerStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 'var(--spacing-1, 8px)',
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
    width: isMobile ? '32px' : '36px',
    height: isMobile ? '32px' : '36px',
    backgroundColor: 'var(--color-neutrals-1, #141416)',
    borderRadius: 'var(--border-radius-md, 8px)',
    color: 'var(--color-white, #FFFFFF)',
  };

  const titleStyle: React.CSSProperties = {
    fontFamily: 'var(--font-heading, Poppins, sans-serif)',
    fontWeight: 700,
    fontSize: isMobile ? '18px' : '24px',
    lineHeight: 1.2,
    color: 'var(--color-neutrals-1, #141416)',
    margin: 0,
  };

  const viewAllStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    fontFamily: 'var(--font-heading, Poppins, sans-serif)',
    fontWeight: 600,
    fontSize: '14px',
    color: isViewAllHovered ? 'var(--color-primary-1, #E90C17)' : 'var(--color-neutrals-4, #6E7481)',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    padding: 0,
    transition: 'color var(--transition-fast, 150ms ease-in-out)',
  };

  const heroStyle: React.CSSProperties = { width: '100%' };

  const cardsStyle: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)',
    gap: isMobile ? 'var(--spacing-2, 16px)' : 'var(--spacing-3, 24px)',
    width: '100%',
  };

  const vehicleSlidersStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: isMobile ? 'var(--spacing-4, 32px)' : 'var(--spacing-6, 48px)',
    width: '100%',
    marginTop: isMobile ? 'var(--spacing-3, 24px)' : 'var(--spacing-4, 32px)',
  };

  const vehicleSliderStyle: React.CSSProperties = { width: '100%' };

  return (
    <div style={containerStyle}>
      {title && (
        <div style={headerStyle}>
          <div style={titleContainerStyle}>
            <div style={iconStyle}>
              <Icon name="thumb_up" size={isMobile ? 18 : 22} />
            </div>
            <h2 style={titleStyle}>{title}</h2>
          </div>
          {onViewAll && (
            <button
              style={viewAllStyle}
              onClick={onViewAll}
              onMouseEnter={() => setIsViewAllHovered(true)}
              onMouseLeave={() => setIsViewAllHovered(false)}
            >
              View All
              <Icon name="chevron_right" size={18} />
            </button>
          )}
        </div>
      )}
      <div style={heroStyle}>
        <HeroCard imageUrl={hero.imageUrl} title={hero.title} onClick={hero.onClick} />
      </div>
      <div style={cardsStyle}>
        {cards.slice(0, 3).map((card, index) => (
          <VerticalCard key={index} imageUrl={card.imageUrl} title={card.title} type={card.type} onClick={card.onClick} />
        ))}
      </div>
      {vehicleSliders.length > 0 && (
        <div style={vehicleSlidersStyle}>
          {vehicleSliders.map((slider, index) => (
            <div key={index} style={vehicleSliderStyle}>
              <VehiclesSection title={slider.title} vehicles={slider.vehicles} showMoreVisible={slider.showMoreVisible} onShowMore={slider.onShowMore} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default HeroPlusThree;
