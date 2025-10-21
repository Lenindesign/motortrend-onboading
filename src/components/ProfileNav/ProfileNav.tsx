/**
 * Profile Navigation Component
 * Based on Figma Community design system
 */

import React from 'react';
import { Link, useLocation } from 'react-router-dom';
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
  
  const tabs: { id: ProfileNavTab; label: string; path: string }[] = [
    { id: 'my-account', label: 'My Account', path: '/profile/my-account' },
    { id: 'saved-items', label: 'Saved Items', path: '/profile/saved-items' },
    { id: 'subscriptions', label: 'My Subscriptions', path: '/profile/subscriptions' },
    { id: 'settings', label: 'Account Settings', path: '/profile/settings' },
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
            {tab.label}
          </Link>
        );
      })}
    </div>
  );
};

export default ProfileNav;

