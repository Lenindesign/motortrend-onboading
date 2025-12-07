/**
 * Hero Plus Three Component
 * Migrated to inline styles for Tailwind compatibility
 */

import React, { useState, useEffect } from 'react';
import { HeroCard } from '../HeroCard';
import { VerticalCard } from '../VerticalCard';
import { VehiclesSection } from '../VehiclesSection';

export interface VehicleSlider {
  title: string;
  vehicles: Array<{ name: string }>;
  showMoreVisible?: boolean;
  onShowMore?: () => void;
}

export interface HeroPlusThreeProps {
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
}

export const HeroPlusThree: React.FC<HeroPlusThreeProps> = ({ hero, cards, vehicleSliders = [] }) => {
  const [isMobile, setIsMobile] = useState(false);

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
