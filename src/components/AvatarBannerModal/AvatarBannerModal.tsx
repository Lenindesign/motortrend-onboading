/**
 * Avatar Banner Modal Component
 * Modal for selecting avatar and banner images
 */

import React, { useState } from 'react';
import './AvatarBannerModal.css';
import Icon from '../Icon';

export interface AvatarBannerModalProps {
  isVisible: boolean;
  onClose: () => void;
  onSave: (avatarUrl: string, bannerUrl: string) => void;
  currentAvatar?: string;
  currentBanner?: string;
}

// Avatar options from Figma
const avatarOptions = [
  {
    id: 'motortrend-logo',
    name: 'MotorTrend Logo',
    url: 'https://d2kde5ohu8qb21.cloudfront.net/files/68f3fc9ccfecd100026f4650/mtlogo.png',
    type: 'logo'
  },
  {
    id: 'avatar-1',
    name: 'Avatar 1',
    url: 'https://d2kde5ohu8qb21.cloudfront.net/files/68f4f3fcfcb7bf00029a0345/ellipse127.png',
    type: 'photo'
  },
  {
    id: 'avatar-2',
    name: 'Avatar 2',
    url: 'https://d2kde5ohu8qb21.cloudfront.net/files/68f4f3fffcb7bf00029a0346/ellipse129.png',
    type: 'photo'
  },
  {
    id: 'avatar-3',
    name: 'Avatar 3',
    url: 'https://d2kde5ohu8qb21.cloudfront.net/files/68f4f400fcb7bf00029a0348/ellipse130.png',
    type: 'photo'
  },
  {
    id: 'avatar-4',
    name: 'Avatar 4',
    url: 'https://d2kde5ohu8qb21.cloudfront.net/files/68f4f401fcb7bf00029a0349/ellipse131.png',
    type: 'photo'
  },
  {
    id: 'avatar-5',
    name: 'Avatar 5',
    url: 'https://d2kde5ohu8qb21.cloudfront.net/files/68f4f4024bb9f6000296b179/ellipse133.png',
    type: 'photo'
  },
  {
    id: 'avatar-6',
    name: 'Avatar 6',
    url: 'https://d2kde5ohu8qb21.cloudfront.net/files/68f4f4034bb9f6000296b17b/ellipse137.png',
    type: 'photo'
  }
];

// Banner options from Figma
const bannerOptions = [
  {
    id: 'banner-1',
    name: 'Group Banner',
    url: 'https://d2kde5ohu8qb21.cloudfront.net/files/68f4f53d6befe300029e7151/group1175889109.jpg',
    type: 'group'
  },
  {
    id: 'banner-2',
    name: 'Nissan Z vs Toyota Supra',
    url: 'https://d2kde5ohu8qb21.cloudfront.net/files/68f4f53f6befe300029e7153/nissan-z-vs-toyota-supra-55.jpg',
    type: 'comparison'
  },
  {
    id: 'banner-3',
    name: 'Lamborghini Aventador 1',
    url: 'https://d2kde5ohu8qb21.cloudfront.net/files/68f4f5409777ec0002d12c1e/2022-lamborghini-aventador-5241487.jpg',
    type: 'supercar'
  },
  {
    id: 'banner-4',
    name: 'Lamborghini Aventador 2',
    url: 'https://d2kde5ohu8qb21.cloudfront.net/files/68f4f542e470c10002ffecfb/2022-lamborghini-aventador-5241488.jpg',
    type: 'supercar'
  },
  {
    id: 'banner-5',
    name: 'Nissan Z vs Toyota Supra 2',
    url: 'https://d2kde5ohu8qb21.cloudfront.net/files/68f4f543fcb7bf00029a034b/nissan-z-vs-toyota-supra-57.jpg',
    type: 'comparison'
  },
  {
    id: 'banner-6',
    name: 'Nissan Z vs Toyota Supra 3',
    url: 'https://d2kde5ohu8qb21.cloudfront.net/files/68f4f544fcb7bf00029a034d/nissan-z-vs-toyota-supra-56.jpg',
    type: 'comparison'
  }
];

export const AvatarBannerModal: React.FC<AvatarBannerModalProps> = ({
  isVisible,
  onClose,
  onSave,
  currentAvatar,
  currentBanner
}) => {
  const [selectedAvatar, setSelectedAvatar] = useState(currentAvatar || avatarOptions[0].url);
  const [selectedBanner, setSelectedBanner] = useState(currentBanner || bannerOptions[0].url);
  const [activeTab, setActiveTab] = useState<'avatar' | 'banner'>('avatar');

  const handleSave = () => {
    onSave(selectedAvatar, selectedBanner);
    onClose();
  };

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isVisible) return null;

  return (
    <div className="avatar-banner-modal-overlay" onClick={handleOverlayClick}>
      <div className="avatar-banner-modal">
        <div className="avatar-banner-modal__header">
          <h2 className="avatar-banner-modal__title">Edit Profile</h2>
          <button className="avatar-banner-modal__close" onClick={onClose}>
            <Icon name="close" size={24} />
          </button>
        </div>

        <div className="avatar-banner-modal__tabs">
          <button
            className={`avatar-banner-modal__tab ${activeTab === 'avatar' ? 'avatar-banner-modal__tab--active' : ''}`}
            onClick={() => setActiveTab('avatar')}
          >
            <Icon name="person" size={20} />
            Avatar
          </button>
          <button
            className={`avatar-banner-modal__tab ${activeTab === 'banner' ? 'avatar-banner-modal__tab--active' : ''}`}
            onClick={() => setActiveTab('banner')}
          >
            <Icon name="image" size={20} />
            Banner
          </button>
        </div>

        <div className="avatar-banner-modal__content">
          {activeTab === 'avatar' && (
            <div className="avatar-banner-modal__section">
              <h3 className="avatar-banner-modal__section-title">Choose Avatar</h3>
              <div className="avatar-banner-modal__grid">
                {avatarOptions.map((avatar) => (
                  <div
                    key={avatar.id}
                    className={`avatar-banner-modal__option ${
                      selectedAvatar === avatar.url ? 'avatar-banner-modal__option--selected' : ''
                    }`}
                    onClick={() => setSelectedAvatar(avatar.url)}
                  >
                    <div className="avatar-banner-modal__option-image">
                      <img src={avatar.url} alt={avatar.name} />
                    </div>
                    <span className="avatar-banner-modal__option-name">{avatar.name}</span>
                    {selectedAvatar === avatar.url && (
                      <div className="avatar-banner-modal__option-check">
                        <Icon name="check" size={16} />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'banner' && (
            <div className="avatar-banner-modal__section">
              <h3 className="avatar-banner-modal__section-title">Choose Banner</h3>
              <div className="avatar-banner-modal__grid avatar-banner-modal__grid--banner">
                {bannerOptions.map((banner) => (
                  <div
                    key={banner.id}
                    className={`avatar-banner-modal__option avatar-banner-modal__option--banner ${
                      selectedBanner === banner.url ? 'avatar-banner-modal__option--selected' : ''
                    }`}
                    onClick={() => setSelectedBanner(banner.url)}
                  >
                    <div className="avatar-banner-modal__option-image avatar-banner-modal__option-image--banner">
                      <img src={banner.url} alt={banner.name} />
                    </div>
                    <span className="avatar-banner-modal__option-name">{banner.name}</span>
                    {selectedBanner === banner.url && (
                      <div className="avatar-banner-modal__option-check">
                        <Icon name="check" size={16} />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="avatar-banner-modal__actions">
          <button className="avatar-banner-modal__btn avatar-banner-modal__btn--cancel" onClick={onClose}>
            Cancel
          </button>
          <button className="avatar-banner-modal__btn avatar-banner-modal__btn--save" onClick={handleSave}>
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default AvatarBannerModal;
