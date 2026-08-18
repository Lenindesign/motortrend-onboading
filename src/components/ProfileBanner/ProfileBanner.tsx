/**
 * Profile Banner Component
 * Migrated to inline styles for Tailwind compatibility
 */

import React, { useEffect, useRef, useState } from 'react';
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

const bannerImages = [
  'https://www.motortrend.com/files/68f77be24615b80002358c70/bg-image-mclaren1.jpg',
  'https://www.motortrend.com/files/68f8f5df37e1e80002de1a02/muscle2.jpg',
  'https://www.motortrend.com/files/68f782781191030002a3d549/modern-electric.jpg',
  'https://www.motortrend.com/files/68f784b61191030002a3d54b/off-road.jpg',
  'https://www.motortrend.com/files/68f78656afbb8d0002a273ab/bronco.jpg',
  'https://www.motortrend.com/files/68f787e24fba630002fdc127/golf.jpg'
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
  const [parallaxY, setParallaxY] = useState(0);
  const [isAvatarHovered, setIsAvatarHovered] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.pageYOffset;
      setParallaxY(-(scrolled * 0.5));
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (!userBanner) {
      const interval = setInterval(() => {
        setCurrentImageIndex((prev) => (prev + 1) % bannerImages.length);
      }, 10000);
      return () => clearInterval(interval);
    }
  }, [userBanner]);

  // Styles
  const containerStyle: React.CSSProperties = {
    width: '100vw',
    position: 'relative',
    left: '50%',
    right: '50%',
    marginLeft: '-50vw',
    marginRight: '-50vw',
    overflow: 'hidden',
    backgroundColor: 'var(--color-neutrals-7, #F4F5F6)',
    boxShadow: 'var(--shadow-depth-2, 0 2px 8px rgba(20, 20, 22, 0.04))',
  };

  const bannerWrapperStyle: React.CSSProperties = {
    position: 'absolute',
    top: '-50%',
    left: 0,
    right: 0,
    height: '200%',
    overflow: 'hidden',
    zIndex: 0,
  };

  const getBannerImgStyle = (isActive: boolean, isStatic: boolean): React.CSSProperties => ({
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    objectPosition: 'center',
    filter: 'blur(0.5px) brightness(1)',
    opacity: isStatic ? 1 : (isActive ? 1 : 0),
    transform: `translateY(${parallaxY}px) translateZ(0)`,
    willChange: 'transform, opacity',
    transition: isStatic ? 'none' : 'opacity 3s ease-in-out',
  });

  const overlayStyle: React.CSSProperties = {
    content: '',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'linear-gradient(to right, rgba(20, 20, 22, 0.85), rgba(20, 20, 22, 0.6), rgba(20, 20, 22, 0.2))',
    zIndex: 1,
  };

  const innerContainerStyle: React.CSSProperties = {
    position: 'relative',
    zIndex: 2,
    maxWidth: '1040px',
    margin: '0 auto',
    padding: 'var(--spacing-6, 48px) var(--spacing-4, 32px) var(--spacing-4, 32px)',
    display: 'flex',
    alignItems: 'center',
    gap: 'var(--spacing-3, 24px)',
  };

  const avatarStyle: React.CSSProperties = {
    position: 'relative',
    width: '96px',
    height: '96px',
    flexShrink: 0,
    borderRadius: 'var(--border-radius-circle, 400px)',
    overflow: 'hidden',
    background: 'linear-gradient(135deg, var(--color-primary-1, #E90C17), var(--color-primary-2, #C70A13))',
    boxShadow: 'var(--shadow-depth-3, 0 4px 12px rgba(20, 20, 22, 0.08))',
    transition: 'transform 150ms ease-in-out',
    transform: isAvatarHovered ? 'scale(1.03)' : 'none',
  };

  const avatarImgStyle: React.CSSProperties = {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  };

  const avatarLogoStyle: React.CSSProperties = {
    width: '100%',
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'var(--color-primary-1, #E90C17)',
    borderRadius: 'var(--border-radius-circle, 50%)',
    padding: '10px',
  };

  const logoImgStyle: React.CSSProperties = {
    width: '100%',
    height: 'auto',
    maxWidth: '72px',
    maxHeight: '72px',
    objectFit: 'contain',
  };

  const infoStyle: React.CSSProperties = {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    minWidth: 0,
  };

  const nameStyle: React.CSSProperties = {
    margin: 0,
    fontFamily: 'var(--font-heading, Poppins, sans-serif)',
    fontWeight: 600,
    fontSize: '32px',
    lineHeight: 1.2,
    letterSpacing: '-0.5px',
    color: 'var(--color-white, #FFFFFF)',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  };

  const metaStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    justifyContent: 'flex-start',
    flexWrap: 'wrap',
  };

  const metaItemStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
  };

  const iconStyle: React.CSSProperties = {
    width: '22px',
    height: '22px',
    flexShrink: 0,
    color: 'var(--color-white, #FFFFFF)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  };

  const metaTextStyle: React.CSSProperties = {
    fontFamily: 'var(--font-body, Geist, sans-serif)',
    fontWeight: 400,
    fontSize: '14px',
    lineHeight: 1,
    color: 'var(--color-white, #FFFFFF)',
    whiteSpace: 'nowrap',
    display: 'flex',
    alignItems: 'center',
  };

  const separatorStyle: React.CSSProperties = {
    fontSize: '14px',
    color: 'var(--color-white, #FFFFFF)',
    userSelect: 'none',
  };

  const editBtnContainerStyle: React.CSSProperties = {
    position: 'absolute',
    top: '24px',
    right: '24px',
    zIndex: 3,
  };

  return (
    <div ref={bannerRef} style={containerStyle}>
      {userBanner ? (
        <div style={bannerWrapperStyle}>
          <img src={userBanner} alt="User selected banner" style={getBannerImgStyle(true, true)} />
        </div>
      ) : (
        <div style={bannerWrapperStyle}>
          {bannerImages.map((imageUrl, index) => (
            <img key={imageUrl} src={imageUrl} alt={`Banner ${index + 1}`} style={getBannerImgStyle(index === currentImageIndex, false)} />
          ))}
        </div>
      )}
      
      <div style={overlayStyle} />
      
      {onEditProfile && (
        <div style={editBtnContainerStyle}>
          <Button color="neutrals3" variant="solid" size="default" onClick={onEditProfile}>Edit Profile</Button>
        </div>
      )}

      <div style={innerContainerStyle}>
        <div style={avatarStyle} onMouseEnter={() => setIsAvatarHovered(true)} onMouseLeave={() => setIsAvatarHovered(false)}>
          {userAvatar ? (
            <img src={userAvatar} alt={userName} style={avatarImgStyle} />
          ) : (
            <div style={avatarLogoStyle}>
              <img src="https://d2kde5ohu8qb21.cloudfront.net/files/68f6de8441f73a00024a546f/mtavatar.svg" alt="MotorTrend" style={logoImgStyle} />
            </div>
          )}
        </div>

        <div style={infoStyle}>
          <h1 style={nameStyle}>{userName}</h1>
          <div style={metaStyle}>
            <div style={metaItemStyle}>
              <Icon name="calendar_today" size={16} style={iconStyle} />
              <span style={metaTextStyle}>Joined {joinDate}</span>
            </div>
            {location && (
              <>
                <span style={separatorStyle}>•</span>
                <div style={metaItemStyle}>
                  <Icon name="location_on" size={16} style={iconStyle} />
                  <span style={metaTextStyle}>{location}</span>
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
