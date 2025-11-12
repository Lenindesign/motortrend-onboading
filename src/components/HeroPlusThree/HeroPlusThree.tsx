/**
 * Hero Plus Three Component
 * Hero card with 3 vertical cards below
 */

import React from 'react';
import { HeroCard } from '../HeroCard';
import { VerticalCard } from '../VerticalCard';
import './HeroPlusThree.css';

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
}

export const HeroPlusThree: React.FC<HeroPlusThreeProps> = ({
  hero,
  cards,
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
    </div>
  );
};

export default HeroPlusThree;



