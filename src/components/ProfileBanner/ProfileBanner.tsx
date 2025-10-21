/**
 * Profile Banner Component
 * Apple Design Guidelines inspired
 */

import React, { useEffect, useRef } from 'react';
import './ProfileBanner.css';
import Icon from '../Icon';
import Button from '../../design-system/components/Button';

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
  const bannerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (bannerRef.current) {
        const scrolled = window.pageYOffset;
        const parallaxSpeed = 0.5; // Adjust this value to control parallax speed
        const yPos = -(scrolled * parallaxSpeed);
        
        // Apply parallax to the background image
        const bannerElement = bannerRef.current;
        
        if (bannerElement) {
          bannerElement.style.setProperty('--parallax-y', `${yPos}px`);
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div 
      ref={bannerRef}
      className={`profile-banner ${userBanner ? 'profile-banner--has-custom-banner' : ''}`}
    >
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
                src="https://d2kde5ohu8qb21.cloudfront.net/files/68f6de8441f73a00024a546f/mtavatar.svg" 
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
          <Button 
            color="neutrals3" 
            variant="solid" 
            size="default"
            onClick={onEditProfile}
          >
            Edit Profile
          </Button>
        )}
      </div>
    </div>
  );
};

export default ProfileBanner;

