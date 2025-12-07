/**
 * News Section Component
 * Migrated to inline styles for Tailwind compatibility
 */

import React, { useState, useEffect } from 'react';
import { River, type RiverItem } from '../River';

export interface NewsSectionProps {
  title: string;
  items: RiverItem[];
}

export const NewsSection: React.FC<NewsSectionProps> = ({ title, items }) => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const sectionStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: 'var(--spacing-3, 24px)',
    width: '100%',
    padding: 0,
  };

  const titleStyle: React.CSSProperties = {
    fontFamily: 'var(--font-heading)',
    fontWeight: 600,
    fontSize: isMobile ? '20px' : '24px',
    lineHeight: 1.2,
    color: 'var(--color-neutrals-1, #141416)',
    margin: 0,
    textAlign: 'left',
  };

  return (
    <section style={sectionStyle}>
      <h2 style={titleStyle}>{title}</h2>
      <River items={items} />
    </section>
  );
};

export default NewsSection;
