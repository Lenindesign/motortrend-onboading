/**
 * SubscriptionItem Component
 * Migrated to inline styles for Tailwind compatibility
 */

import React, { useState } from 'react';
import { CardShell } from '../atoms/CardShell/CardShell';

export interface SubscriptionItemProps {
  name: string;
  logo?: string;
  isActive?: boolean;
  isFindMore?: boolean;
  onClick?: () => void;
  onToggleSubscription?: (name: string, isActive: boolean) => void;
  href?: string;
  className?: string;
}

export const SubscriptionItem: React.FC<SubscriptionItemProps> = ({ 
  name, 
  logo, 
  isActive = false,
  isFindMore = false,
  onClick,
  onToggleSubscription,
  href,
  className = '',
}) => {
  const [isBadgeHovered, setIsBadgeHovered] = useState(false);

  const handleBadgeClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onToggleSubscription && !isFindMore) {
      onToggleSubscription(name, isActive);
    }
  };

  const handleClick = () => {
    if (href) return;
    if (onClick) onClick();
  };

  // Container styles
  const containerStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 'var(--spacing-2, 16px)',
    width: '156px',
    padding: 'var(--spacing-2, 16px)',
    cursor: 'pointer',
  };

  // Link styles
  const linkStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 'var(--spacing-2, 16px)',
    width: '100%',
    textDecoration: 'none',
    color: 'inherit',
    padding: 'var(--spacing-2, 16px)',
  };

  // Logo container styles
  const logoContainerStyle: React.CSSProperties = {
    position: 'relative',
    width: '116px',
    height: '116px',
    flexShrink: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  };

  // Logo styles
  const logoStyle: React.CSSProperties = {
    width: '100%',
    height: '100%',
    borderRadius: '50%',
    objectFit: 'cover',
    backgroundColor: 'var(--color-neutrals-2, #23262F)',
    boxShadow: 'var(--shadow-depth-2, 0 2px 8px rgba(20, 20, 22, 0.04))',
  };

  // Logo placeholder styles
  const logoPlaceholderStyle: React.CSSProperties = {
    width: '100%',
    height: '100%',
    borderRadius: '50%',
    backgroundColor: 'var(--color-neutrals-2, #23262F)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'var(--color-neutrals-5, #B1B5C3)',
  };

  // Badge styles
  const badgeStyle: React.CSSProperties = {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: '24px',
    height: '24px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: isActive ? 'var(--color-white, #FFFFFF)' : 'transparent',
    borderRadius: '100px',
    boxShadow: isActive ? 'var(--shadow-depth-2, 0 2px 8px rgba(20, 20, 22, 0.04))' : 'none',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    transform: isBadgeHovered ? 'scale(1.1)' : 'none',
  };

  // Name styles
  const nameStyle: React.CSSProperties = {
    fontFamily: 'var(--font-heading, Poppins, sans-serif)',
    fontWeight: 600,
    fontSize: '14px',
    lineHeight: 1.25,
    textAlign: 'center',
    color: 'var(--color-neutrals-2, #23262F)',
    margin: 0,
    marginTop: 'var(--spacing-1, 8px)',
    width: '100%',
    letterSpacing: '-0.1px',
    wordWrap: 'break-word',
  };

  const content = (
    <>
      <div style={logoContainerStyle}>
        {logo ? (
          <img src={logo} alt={name} style={logoStyle} />
        ) : (
          <div style={logoPlaceholderStyle}>
            {isFindMore && (
              <img 
                src="https://d2kde5ohu8qb21.cloudfront.net/files/68f64af5e852a20002f9bc06/more.svg" 
                alt="Find More" 
                width="116" 
                height="116"
                style={{ borderRadius: '8px' }}
              />
            )}
          </div>
        )}
        {isActive && (
          <div 
            style={badgeStyle}
            onClick={handleBadgeClick}
            onMouseEnter={() => setIsBadgeHovered(true)}
            onMouseLeave={() => setIsBadgeHovered(false)}
            title="Click to unsubscribe"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="12" fill="#E90C17"/>
              <path d="M7 12L10 15L17 8" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        )}
        {!isActive && !isFindMore && (
          <div 
            style={badgeStyle}
            onClick={handleBadgeClick}
            onMouseEnter={() => setIsBadgeHovered(true)}
            onMouseLeave={() => setIsBadgeHovered(false)}
            title="Click to subscribe"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="11" stroke="#E6E8EC" strokeWidth="2"/>
            </svg>
          </div>
        )}
      </div>
      <p style={nameStyle}>{name}</p>
    </>
  );

  if (href) {
    return (
      <CardShell
        padding="none"
        hasHover={true}
        background="transparent"
        className={className}
        style={containerStyle}
      >
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          style={linkStyle}
          onClick={handleClick}
        >
          {content}
        </a>
      </CardShell>
    );
  }

  return (
    <CardShell
      padding="none"
      hasHover={true}
      background="transparent"
      className={className}
      style={containerStyle}
    >
      <div onClick={handleClick} style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        {content}
      </div>
    </CardShell>
  );
};

