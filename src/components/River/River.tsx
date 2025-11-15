/**
 * River Component
 * Horizontal card list for news content
 */

import React from 'react';
import { HorizontalCard } from '../HorizontalCard';
import './River.css';

export interface RiverItem {
  imageUrl: string;
  title: string;
  author?: string;
  date?: string;
  category?: string;
  onClick?: () => void;
}

export interface RiverProps {
  items: RiverItem[];
}

export const River: React.FC<RiverProps> = ({
  items,
}) => {
  return (
    <div className="river">
      {items.map((item, index) => (
        <HorizontalCard
          key={index}
          imageUrl={item.imageUrl}
          title={item.title}
          author={item.author}
          date={item.date}
          category={item.category}
          onClick={item.onClick}
        />
      ))}
    </div>
  );
};

export default River;



