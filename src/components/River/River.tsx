/**
 * River Component
 * Migrated to inline styles for Tailwind compatibility
 */

import React from 'react';
import { HorizontalCard } from '../HorizontalCard';

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

export const River: React.FC<RiverProps> = ({ items }) => {
  const containerStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    gap: 'var(--spacing-3, 24px)',
    background: 'var(--color-neutrals-8, #FCFCFD)',
  };

  return (
    <div style={containerStyle}>
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
