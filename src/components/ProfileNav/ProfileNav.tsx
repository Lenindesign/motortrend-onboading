/**
 * Profile Navigation Component
 * Migrated to inline styles for Tailwind compatibility
 */

import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Icon from '../Icon';

export type ProfileNavTab = 'my-account' | 'saved-items' | 'subscriptions';

export interface ProfileNavProps {
  activeTab?: ProfileNavTab;
  onTabChange?: (tab: ProfileNavTab) => void;
  className?: string;
}

export const ProfileNav: React.FC<ProfileNavProps> = ({
  activeTab,
  onTabChange,
  className = '',
}) => {
  const location = useLocation();
  const currentPath = location.pathname;
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);
  const [hoveredTab, setHoveredTab] = useState<string | null>(null);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth <= 768);
      setIsTablet(window.innerWidth <= 1024);
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);
  
  const tabs: { id: ProfileNavTab; label: string; path: string; icon: string }[] = [
    { id: 'my-account', label: 'Profile', path: '/my-account/profile', icon: 'account_circle' },
    { id: 'saved-items', label: 'Saved', path: '/my-account/saved-items', icon: 'bookmark_border' },
    { id: 'subscriptions', label: 'Subscriptions', path: '/my-account/subscriptions', icon: 'newspaper' },
  ];

  // Container styles - responsive
  const containerStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: isTablet ? 'row' : 'column',
    alignItems: 'center',
    gap: isMobile ? '16px' : isTablet ? '8px' : '16px',
    padding: isMobile ? '16px' : isTablet ? '24px 8px' : '24px',
    backgroundColor: 'var(--color-neutrals-7, #F4F5F6)',
    borderRadius: 'var(--border-radius-lg, 16px)',
    border: '1px solid var(--color-neutrals-6, #E6E8EC)',
    boxShadow: 'var(--shadow-depth-1, 0 1px 2px rgba(20, 20, 22, 0.02))',
    ...(isTablet && {
      flexWrap: 'nowrap',
      justifyContent: 'flex-start',
      overflowX: 'auto',
      scrollBehavior: 'smooth',
      WebkitOverflowScrolling: 'touch',
    }),
    ...(isMobile && {
      scrollbarWidth: 'none',
      msOverflowStyle: 'none',
    }),
  };

  // Button styles
  const getButtonStyle = (isActive: boolean, isHovered: boolean): React.CSSProperties => ({
    display: 'inline-flex',
    alignItems: 'center',
    gap: isMobile ? '4px' : '16px',
    padding: isMobile ? '4px 8px' : isTablet ? '8px 12px' : '8px 24px',
    width: isTablet ? 'auto' : '100%',
    maxWidth: isTablet ? 'none' : '220px',
    flex: isTablet ? '0 0 auto' : undefined,
    minWidth: isTablet ? 'max-content' : undefined,
    backgroundColor: isActive 
      ? (isHovered ? 'var(--color-neutrals-2, #23262F)' : 'var(--color-neutrals-3, #353945)')
      : (isHovered ? 'var(--color-neutrals-6, #E6E8EC)' : 'transparent'),
    border: `1px solid ${isActive ? 'var(--color-neutrals-3, #353945)' : 'var(--color-neutrals-6, #E6E8EC)'}`,
    borderRadius: 'var(--border-radius-md, 8px)',
    fontFamily: 'var(--font-heading, Poppins, sans-serif)',
    fontWeight: 600,
    fontSize: isMobile ? '13px' : '14px',
    lineHeight: '1em',
    textAlign: 'left',
    color: isActive ? 'var(--color-neutrals-8, #FCFCFD)' : 'var(--color-neutrals-1, #141416)',
    cursor: 'pointer',
    transition: 'transform 150ms ease-in-out, border-color 150ms ease-in-out, background 150ms ease-in-out',
    textDecoration: 'none',
    whiteSpace: isTablet ? 'nowrap' : undefined,
    transform: isHovered && !isActive ? 'translateY(-1px)' : 'none',
  });

  // Icon styles
  const getIconStyle = (isActive: boolean, isHovered: boolean): React.CSSProperties => ({
    color: isActive 
      ? 'var(--color-neutrals-8, #FCFCFD)' 
      : (isHovered ? 'var(--color-neutrals-2, #23262F)' : 'var(--color-neutrals-4, #6E7481)'),
    flexShrink: 0,
    transition: 'color 150ms ease-in-out',
  });

  return (
    <div className={className} style={containerStyle}>
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id || currentPath === tab.path;
        const isHovered = hoveredTab === tab.id;
        return (
          <Link
            key={tab.id}
            to={tab.path}
            style={getButtonStyle(isActive, isHovered)}
            onClick={() => onTabChange?.(tab.id)}
            onMouseEnter={() => setHoveredTab(tab.id)}
            onMouseLeave={() => setHoveredTab(null)}
          >
            {!isMobile && <Icon name={tab.icon} size={16} style={getIconStyle(isActive, isHovered)} />}
            {tab.label}
          </Link>
        );
      })}
    </div>
  );
};

export default ProfileNav;

