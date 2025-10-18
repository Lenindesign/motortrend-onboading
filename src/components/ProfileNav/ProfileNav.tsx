/**
 * Profile Navigation Component
 * Based on Figma Community design system
 */

import React from 'react';
import './ProfileNav.css';

export type ProfileNavTab = 'my-account' | 'saved-items' | 'subscriptions' | 'settings';

export interface ProfileNavProps {
  activeTab: ProfileNavTab;
  onTabChange: (tab: ProfileNavTab) => void;
}

export const ProfileNav: React.FC<ProfileNavProps> = ({
  activeTab,
  onTabChange,
}) => {
  const tabs: { id: ProfileNavTab; label: string }[] = [
    { id: 'my-account', label: 'My Account' },
    { id: 'saved-items', label: 'Saved Items' },
    { id: 'subscriptions', label: 'My Subscriptions' },
    { id: 'settings', label: 'Account Settings' },
  ];

  return (
    <div className="profile-nav">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          className={`profile-nav__btn ${activeTab === tab.id ? 'profile-nav__btn--active' : ''}`}
          onClick={() => onTabChange(tab.id)}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
};

export default ProfileNav;

