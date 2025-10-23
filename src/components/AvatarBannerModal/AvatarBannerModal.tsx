/**
 * Avatar Banner Modal Component
 * Modal for selecting avatar and banner images
 */

import React, { useState } from 'react';
import './AvatarBannerModal.css';
import Icon from '../Icon';
import { Button } from '../../design-system/components/Button/Button';

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
    url: 'https://d2kde5ohu8qb21.cloudfront.net/files/68f6de8441f73a00024a546f/mtavatar.svg',
    type: 'logo'
  },
  {
    id: 'avatar-1',
    name: 'Classic Car',
    url: 'https://d2kde5ohu8qb21.cloudfront.net/files/68f78e98afbb8d0002a273ac/classic.png',
    type: 'photo'
  },
  {
    id: 'avatar-2',
    name: 'Supercar',
    url: 'https://d2kde5ohu8qb21.cloudfront.net/files/68f78e979a927f00029054d1/supercar.png',
    type: 'photo'
  },
  {
    id: 'avatar-3',
    name: 'Off-Road',
    url: 'https://d2kde5ohu8qb21.cloudfront.net/files/68f78e964fba630002fdc12d/offroad.png',
    type: 'photo'
  },
  {
    id: 'avatar-4',
    name: 'Electric',
    url: 'https://d2kde5ohu8qb21.cloudfront.net/files/68f78e954fba630002fdc12b/electric.png',
    type: 'photo'
  },
  {
    id: 'avatar-5',
    name: 'Utility Vehicle',
    url: 'https://d2kde5ohu8qb21.cloudfront.net/files/68f78e941191030002a3d54c/utility.png',
    type: 'photo'
  },
  {
    id: 'avatar-6',
    name: 'Compact Car',
    url: 'https://d2kde5ohu8qb21.cloudfront.net/files/68f78e924fba630002fdc129/compact.png',
    type: 'photo'
  }
];

// Banner options from Figma
const bannerOptions = [
  {
    id: 'banner-1',
    name: 'Supercar',
    url: 'https://d2kde5ohu8qb21.cloudfront.net/files/68f77be24615b80002358c70/bg-image-mclaren1.jpg',
    type: 'group'
  },
    {
      id: 'banner-2',
      name: 'Retro Muscle Car',
      url: 'https://d2kde5ohu8qb21.cloudfront.net/files/68f8f5df37e1e80002de1a02/muscle2.jpg',
      type: 'retro'
    },
  {
    id: 'banner-3',
    name: 'Modern Electric',
    url: 'https://d2kde5ohu8qb21.cloudfront.net/files/68f782781191030002a3d549/modern-electric.jpg',
    type: 'electric'
  },
  {
    id: 'banner-4',
    name: 'Off-Road Adventure',
    url: 'https://d2kde5ohu8qb21.cloudfront.net/files/68f784b61191030002a3d54b/off-road.jpg',
    type: 'offroad'
  },
  {
    id: 'banner-5',
    name: 'Ford Bronco',
    url: 'https://d2kde5ohu8qb21.cloudfront.net/files/68f78656afbb8d0002a273ab/bronco.jpg',
    type: 'bronco'
  },
  {
    id: 'banner-6',
    name: 'Compact Fun Car',
    url: 'https://d2kde5ohu8qb21.cloudfront.net/files/68f787e24fba630002fdc127/golf.jpg',
    type: 'golf'
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
                    <div className={`avatar-banner-modal__option-image ${avatar.type === 'logo' ? 'avatar-banner-modal__option-image--logo' : ''}`}>
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
          <Button 
            color="neutrals3" 
            variant="solid" 
            size="default"
            onClick={onClose}
          >
            Cancel
          </Button>
          <Button 
            color="blue" 
            variant="solid" 
            size="default"
            onClick={handleSave}
          >
            Save Changes
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AvatarBannerModal;
