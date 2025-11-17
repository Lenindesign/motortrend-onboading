/**
 * Hero Plus Three Component
 * Hero card with 3 vertical cards below, with optional vehicle sliders
 */

import React from 'react';
import { HeroCard } from '../HeroCard';
import { VerticalCard } from '../VerticalCard';
import { VehiclesSection } from '../VehiclesSection';
import './HeroPlusThree.css';

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

export const HeroPlusThree: React.FC<HeroPlusThreeProps> = ({
  hero,
  cards,
  vehicleSliders = [],
}) => {
  return (
    <div className="hero-plus-three">
      <div className="hero-plus-three__hero">
        <HeroCard
          imageUrl={hero.imageUrl}
          title={hero.title}
          onClick={hero.onClick}
        />
      </div>
      <div className="hero-plus-three__cards">
        {cards.slice(0, 3).map((card, index) => (
          <VerticalCard
            key={index}
            imageUrl={card.imageUrl}
            title={card.title}
            type={card.type}
            onClick={card.onClick}
          />
        ))}
      </div>
      
      {/* Vehicle Sliders */}
      {vehicleSliders.length > 0 && (
        <div className="hero-plus-three__vehicle-sliders">
          {vehicleSliders.map((slider, index) => (
            <div key={index} className="hero-plus-three__vehicle-slider">
              <VehiclesSection
                title={slider.title}
                vehicles={slider.vehicles}
                showMoreVisible={slider.showMoreVisible}
                onShowMore={slider.onShowMore}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default HeroPlusThree;



