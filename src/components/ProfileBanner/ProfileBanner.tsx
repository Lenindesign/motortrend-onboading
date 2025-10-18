/**
 * Profile Banner Component
 * Apple Design Guidelines inspired
 */

import React from 'react';
import './ProfileBanner.css';

export interface ProfileBannerProps {
  userName: string;
  userAvatar?: string;
  joinDate: string;
  location?: string;
  onEditProfile?: () => void;
}

export const ProfileBanner: React.FC<ProfileBannerProps> = ({
  userName,
  userAvatar,
  joinDate,
  location,
  onEditProfile,
}) => {
  // Get user initials for avatar placeholder
  const getInitials = (name: string) => {
    const parts = name.trim().split(' ');
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
    }
    return parts[0][0]?.toUpperCase() || 'U';
  };

  return (
    <div className="profile-banner">
      <div className="profile-banner__container">
        {/* Avatar Section */}
        <div className="profile-banner__avatar">
          {userAvatar ? (
            <img src={userAvatar} alt={userName} className="profile-banner__avatar-img" />
          ) : (
            <div className="profile-banner__avatar-placeholder">
              {getInitials(userName)}
            </div>
          )}
        </div>

        {/* User Info Section */}
        <div className="profile-banner__info">
          <h1 className="profile-banner__name">{userName}</h1>
          
          <div className="profile-banner__meta">
            <div className="profile-banner__meta-item">
              <svg className="profile-banner__icon" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12.667 2.667H3.333C2.597 2.667 2 3.264 2 4v9.333c0 .737.597 1.334 1.333 1.334h9.334c.736 0 1.333-.597 1.333-1.334V4c0-.736-.597-1.333-1.333-1.333zM10.667 1.333v2.667M5.333 1.333v2.667M2 6.667h12" 
                  stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span className="profile-banner__meta-text">Joined {joinDate}</span>
            </div>
            
            {location && (
              <>
                <span className="profile-banner__meta-separator">•</span>
                <div className="profile-banner__meta-item">
                  <svg className="profile-banner__icon" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M14 6.667c0 4.666-6 9.333-6 9.333s-6-4.667-6-9.333a6 6 0 1 1 12 0z" 
                      stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M8 8.667a2 2 0 1 0 0-4 2 2 0 0 0 0 4z" 
                      stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <span className="profile-banner__meta-text">{location}</span>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Edit Button */}
        {onEditProfile && (
          <button className="profile-banner__edit-btn" onClick={onEditProfile}>
            Edit Profile
          </button>
        )}
      </div>
    </div>
  );
};

export default ProfileBanner;

