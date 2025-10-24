/**
 * Profile Navigation Component
 * Based on Figma Community design system
 */

import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Icon from '../Icon';
import './ProfileNav.css';

export type ProfileNavTab = 'my-account' | 'saved-items' | 'subscriptions' | 'settings';

export interface ProfileNavProps {
  activeTab?: ProfileNavTab;
  onTabChange?: (tab: ProfileNavTab) => void;
}

export const ProfileNav: React.FC<ProfileNavProps> = ({
  activeTab,
  onTabChange,
}) => {
  const location = useLocation();
  const currentPath = location.pathname;
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    checkIsMobile();
    window.addEventListener('resize', checkIsMobile);
    return () => window.removeEventListener('resize', checkIsMobile);
  }, []);
  
  const tabs: { id: ProfileNavTab; label: string; path: string; icon: string }[] = [
    { id: 'my-account', label: 'Profile', path: '/my-account/profile', icon: 'account_circle' },
    { id: 'saved-items', label: 'Saved Items', path: '/my-account/saved-items', icon: 'bookmark_border' },
    { id: 'subscriptions', label: 'Subscriptions', path: '/my-account/subscriptions', icon: 'newspaper' },
    { id: 'settings', label: 'Settings', path: '/my-account/settings', icon: 'settings' },
  ];

  return (
    <div className="profile-nav">
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id || currentPath === tab.path;
        return (
          <Link
            key={tab.id}
            to={tab.path}
            className={`profile-nav__btn ${isActive ? 'profile-nav__btn--active' : ''}`}
            onClick={() => onTabChange?.(tab.id)}
          >
            {!isMobile && <Icon name={tab.icon} size={16} />}
            {tab.label}
          </Link>
        );
      })}
    </div>
  );
};

export default ProfileNav;

