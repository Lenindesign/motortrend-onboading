/**
 * News Section Component
 * Section with heading and River component
 */

import React from 'react';
import { River, type RiverItem } from '../River';
import './NewsSection.css';

export interface NewsSectionProps {
  title: string;
  items: RiverItem[];
}

export const NewsSection: React.FC<NewsSectionProps> = ({
  title,
  items,
}) => {
  return (
    <section className="news-section">
      <h2 className="news-section__title">{title}</h2>
      <River items={items} />
    </section>
  );
};

export default NewsSection;



