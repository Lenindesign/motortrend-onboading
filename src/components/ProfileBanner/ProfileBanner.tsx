/**
 * Profile Banner Component
 * Apple Design Guidelines inspired
 */

import React from 'react';
import './ProfileBanner.css';
import Icon from '../Icon';

export interface ProfileBannerProps {
  userName: string;
  userAvatar?: string;
  userBanner?: string;
  joinDate: string;
  location?: string;
  onEditProfile?: () => void;
}

export const ProfileBanner: React.FC<ProfileBannerProps> = ({
  userName,
  userAvatar,
  userBanner,
  joinDate,
  location,
  onEditProfile,
}) => {

  return (
    <div className="profile-banner">
      {/* Banner Image */}
      {userBanner && (
        <div className="profile-banner__banner">
          <img src={userBanner} alt="Profile Banner" className="profile-banner__banner-img" />
        </div>
      )}
      
      <div className="profile-banner__container">
        {/* Avatar Section */}
        <div className="profile-banner__avatar">
          {userAvatar ? (
            <img src={userAvatar} alt={userName} className="profile-banner__avatar-img" />
          ) : (
            <div className="profile-banner__avatar-logo">
              <img 
                src="https://d2kde5ohu8qb21.cloudfront.net/files/68f3fc9ccfecd100026f4650/mtlogo.png" 
                alt="MotorTrend" 
                className="profile-banner__logo-img" 
              />
            </div>
          )}
        </div>

        {/* User Info Section */}
        <div className="profile-banner__info">
          <h1 className="profile-banner__name">{userName}</h1>
          
          <div className="profile-banner__meta">
            <div className="profile-banner__meta-item">
              <Icon name="calendar_today" size={16} className="profile-banner__icon" />
              <span className="profile-banner__meta-text">Joined {joinDate}</span>
            </div>
            
            {location && (
              <>
                <span className="profile-banner__meta-separator">•</span>
                <div className="profile-banner__meta-item">
                  <Icon name="location_on" size={16} className="profile-banner__icon" />
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

