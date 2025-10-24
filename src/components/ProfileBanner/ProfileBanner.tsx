/**
 * Profile Banner Component
 * Apple Design Guidelines inspired
 */

import React, { useEffect, useRef, useState } from 'react';
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

// Banner images for animation
const bannerImages = [
  'https://d2kde5ohu8qb21.cloudfront.net/files/68f77be24615b80002358c70/bg-image-mclaren1.jpg',
  'https://d2kde5ohu8qb21.cloudfront.net/files/68f8f5df37e1e80002de1a02/muscle2.jpg',
  'https://d2kde5ohu8qb21.cloudfront.net/files/68f782781191030002a3d549/modern-electric.jpg',
  'https://d2kde5ohu8qb21.cloudfront.net/files/68f784b61191030002a3d54b/off-road.jpg',
  'https://d2kde5ohu8qb21.cloudfront.net/files/68f78656afbb8d0002a273ab/bronco.jpg',
  'https://d2kde5ohu8qb21.cloudfront.net/files/68f787e24fba630002fdc127/golf.jpg'
];

export const ProfileBanner: React.FC<ProfileBannerProps> = ({
  userName,
  userAvatar,
  userBanner,
  joinDate,
  location,
  onEditProfile,
}) => {
  const bannerRef = useRef<HTMLDivElement>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

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

  // Banner animation effect
  useEffect(() => {
    // Only animate if no user banner is selected
    if (!userBanner) {
      const interval = setInterval(() => {
        setCurrentImageIndex((prevIndex) => 
          (prevIndex + 1) % bannerImages.length
        );
      }, 10000); // Change image every 10 seconds

      return () => clearInterval(interval);
    }
  }, [userBanner]);

  return (
    <div 
      ref={bannerRef}
      className={`profile-banner ${userBanner ? 'profile-banner--has-custom-banner' : ''}`}
    >
      {/* Banner Image - Static if user selected, animated if not */}
      {userBanner ? (
        <div className="profile-banner__banner">
          <img
            src={userBanner}
            alt="User selected banner"
            className="profile-banner__banner-img profile-banner__banner-img--static"
          />
        </div>
      ) : (
        <div className="profile-banner__banner profile-banner__banner--animated">
          {bannerImages.map((imageUrl, index) => (
            <img
              key={imageUrl}
              src={imageUrl}
              alt={`Banner ${index + 1}`}
              className={`profile-banner__banner-img ${
                index === currentImageIndex ? 'profile-banner__banner-img--active' : ''
              }`}
            />
          ))}
        </div>
      )}
      
      {/* Edit Button - Top Right Corner */}
      {onEditProfile && (
        <div className="profile-banner__edit-button">
          <Button 
            color="neutrals3" 
            variant="solid" 
            size="default"
            onClick={onEditProfile}
          >
            Edit Profile
          </Button>
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
      </div>
    </div>
  );
};

export default ProfileBanner;

