/**
 * Avatar Banner Modal Component
 * Migrated to inline styles for Tailwind compatibility
 */

import React, { useState, useEffect, useRef } from 'react';
import { ModalShell } from '../atoms/ModalShell';
import Icon from '../Icon';
import { Button } from '../../design-system/components/Button/Button';

export interface AvatarBannerModalProps {
  isVisible: boolean;
  onClose: () => void;
  onSave: (avatarUrl: string, bannerUrl: string, location: string) => void;
  currentAvatar?: string;
  currentBanner?: string;
  currentLocation?: string;
  autoFocusLocation?: boolean;
}

const avatarOptions = [
  { id: 'motortrend-logo', name: 'MotorTrend', url: '/images/mt-brand-icon.svg', type: 'logo' },
  { id: 'avatar-1', name: 'Classic Car', url: 'https://www.motortrend.com/files/68f78e98afbb8d0002a273ac/classic.png', type: 'photo' },
  { id: 'avatar-2', name: 'Supercar', url: 'https://www.motortrend.com/files/68f78e979a927f00029054d1/supercar.png', type: 'photo' },
  { id: 'avatar-3', name: 'Off-Road', url: 'https://www.motortrend.com/files/68f78e964fba630002fdc12d/offroad.png', type: 'photo' },
  { id: 'avatar-4', name: 'Electric', url: 'https://www.motortrend.com/files/68f78e954fba630002fdc12b/electric.png', type: 'photo' },
  { id: 'avatar-5', name: 'Utility Vehicle', url: 'https://www.motortrend.com/files/68f78e941191030002a3d54c/utility.png', type: 'photo' },
  { id: 'avatar-6', name: 'Compact Car', url: 'https://www.motortrend.com/files/68f78e924fba630002fdc129/compact.png', type: 'photo' }
];

const bannerOptions = [
  { id: 'banner-1', name: 'Supercar', url: 'https://www.motortrend.com/files/68f77be24615b80002358c70/bg-image-mclaren1.jpg', type: 'group' },
  { id: 'banner-2', name: 'Retro Muscle Car', url: 'https://www.motortrend.com/files/68f8f5df37e1e80002de1a02/muscle2.jpg', type: 'retro' },
  { id: 'banner-3', name: 'Modern Electric', url: 'https://www.motortrend.com/files/68f782781191030002a3d549/modern-electric.jpg', type: 'electric' },
  { id: 'banner-4', name: 'Off-Road Adventure', url: 'https://www.motortrend.com/files/68f784b61191030002a3d54b/off-road.jpg', type: 'offroad' },
  { id: 'banner-5', name: 'Ford Bronco', url: 'https://www.motortrend.com/files/68f78656afbb8d0002a273ab/bronco.jpg', type: 'bronco' },
  { id: 'banner-6', name: 'Compact Fun Car', url: 'https://www.motortrend.com/files/68f787e24fba630002fdc127/golf.jpg', type: 'golf' }
];

export const AvatarBannerModal: React.FC<AvatarBannerModalProps> = ({
  isVisible,
  onClose,
  onSave,
  currentAvatar,
  currentBanner,
  currentLocation,
  autoFocusLocation = false
}) => {
  const [selectedAvatar, setSelectedAvatar] = useState(currentAvatar || avatarOptions[0].url);
  const [selectedBanner, setSelectedBanner] = useState(currentBanner || bannerOptions[0].url);
  const [profileLocation, setProfileLocation] = useState(currentLocation || '');
  const [activeTab, setActiveTab] = useState<'avatar' | 'banner'>('avatar');
  const [isCloseHovered, setIsCloseHovered] = useState(false);
  const [hoveredOption, setHoveredOption] = useState<string | null>(null);
  const [hoveredTab, setHoveredTab] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [isResolvingLocation, setIsResolvingLocation] = useState(false);
  const locationInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    setProfileLocation(currentLocation || '');
  }, [currentLocation, isVisible]);

  useEffect(() => {
    if (!isVisible || !autoFocusLocation) return;
    const focusTimer = window.setTimeout(() => {
      locationInputRef.current?.focus();
      locationInputRef.current?.select();
    }, 0);
    return () => window.clearTimeout(focusTimer);
  }, [autoFocusLocation, isVisible]);

  const resolveZipToLocation = async (value: string): Promise<string> => {
    const trimmed = value.trim();
    const zipMatch = trimmed.match(/^(\d{5})(?:-\d{4})?$/);
    if (!zipMatch) return trimmed;

    try {
      setIsResolvingLocation(true);
      const response = await fetch(`https://api.zippopotam.us/us/${zipMatch[1]}`);
      if (!response.ok) return trimmed;

      const data: {
        places?: Array<{
          'place name'?: string;
          'state abbreviation'?: string;
        }>;
      } = await response.json();
      const place = data.places?.[0];
      if (place?.['place name'] && place?.['state abbreviation']) {
        return `${place['place name']}, ${place['state abbreviation']}`;
      }
    } catch (error) {
      console.error('ZIP location lookup failed:', error);
    } finally {
      setIsResolvingLocation(false);
    }

    return trimmed;
  };

  const handleLocationBlur = async () => {
    const resolvedLocation = await resolveZipToLocation(profileLocation);
    setProfileLocation(resolvedLocation);
  };

  const handleSave = async () => {
    const resolvedLocation = await resolveZipToLocation(profileLocation);
    onSave(selectedAvatar, selectedBanner, resolvedLocation);
    onClose();
  };

  // Styles
  const modalStyle: React.CSSProperties = { backgroundColor: 'var(--color-white, #FFFFFF)' };
  const innerStyle: React.CSSProperties = { maxHeight: '80vh', overflow: 'hidden', display: 'flex', flexDirection: 'column' };
  const headerStyle: React.CSSProperties = { display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: isMobile ? '20px 20px 0' : 'var(--spacing-3, 24px) var(--spacing-4, 32px) 0', borderBottom: '1px solid var(--color-neutrals-7, #F4F5F6)', marginBottom: 'var(--spacing-3, 24px)' };
  const titleStyle: React.CSSProperties = { fontFamily: 'var(--font-heading)', fontWeight: 600, fontSize: '24px', lineHeight: 1.2, color: 'var(--color-neutrals-2, #23262F)', margin: 0 };
  const closeBtnStyle: React.CSSProperties = { display: 'flex', alignItems: 'center', justifyContent: 'center', width: '32px', height: '32px', background: isCloseHovered ? 'var(--color-neutrals-7, #F4F5F6)' : 'none', border: 'none', borderRadius: 'var(--border-radius-circle, 50%)', color: isCloseHovered ? 'var(--color-neutrals-2, #23262F)' : 'var(--color-neutrals-4, #6E7481)', cursor: 'pointer', transition: 'all 150ms ease-in-out' };
  const controlsStyle: React.CSSProperties = { display: 'flex', alignItems: isMobile ? 'stretch' : 'center', padding: isMobile ? '0 20px' : '0 var(--spacing-4, 32px)', gap: 'var(--spacing-2, 16px)', marginBottom: 'var(--spacing-3, 24px)', flexDirection: isMobile ? 'column' : 'row' };
  const tabsStyle: React.CSSProperties = { display: 'flex', gap: 'var(--spacing-2, 16px)', flexDirection: isMobile ? 'column' : 'row', flexShrink: 0 };
  const locationFieldStyle: React.CSSProperties = { position: 'relative', flex: 1, minWidth: isMobile ? '100%' : '220px' };
  const locationIconStyle: React.CSSProperties = { position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-neutrals-4, #6E7481)', pointerEvents: 'none' };
  const locationInputStyle: React.CSSProperties = { width: '100%', height: '40px', padding: '0 14px 0 42px', border: '1px solid var(--color-neutrals-6, #E6E8EC)', borderRadius: 'var(--border-radius-md, 8px)', backgroundColor: 'var(--color-white, #FFFFFF)', color: 'var(--color-neutrals-2, #23262F)', fontFamily: 'var(--font-body)', fontWeight: 400, fontSize: '14px', lineHeight: 1.4, outline: 'none' };
  const visuallyHiddenStyle: React.CSSProperties = { position: 'absolute', width: '1px', height: '1px', padding: 0, margin: '-1px', overflow: 'hidden', clip: 'rect(0, 0, 0, 0)', whiteSpace: 'nowrap', border: 0 };
  
  const getTabStyle = (tabId: string, isActive: boolean): React.CSSProperties => {
    const isHovered = hoveredTab === tabId;
    return { display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 24px', background: isActive ? 'var(--color-neutrals-3, #353945)' : (isHovered ? 'var(--color-neutrals-7, #F4F5F6)' : 'none'), border: `1px solid ${isActive ? 'var(--color-neutrals-2, #23262F)' : (isHovered ? 'var(--color-neutrals-5, #B1B5C3)' : 'var(--color-neutrals-6, #E6E8EC)')}`, borderRadius: 'var(--border-radius-md, 8px)', fontFamily: 'var(--font-heading)', fontWeight: 600, fontSize: '14px', color: isActive ? 'var(--color-neutrals-8, #FCFCFD)' : (isHovered ? 'var(--color-neutrals-2, #23262F)' : 'var(--color-neutrals-4, #6E7481)'), cursor: 'pointer', transition: 'all 150ms ease-in-out', justifyContent: isMobile ? 'center' : 'flex-start' };
  };

  const contentStyle: React.CSSProperties = { padding: isMobile ? '0 20px' : '0 var(--spacing-4, 32px)', maxHeight: '400px', overflowY: 'auto' };
  const sectionStyle: React.CSSProperties = { marginBottom: 'var(--spacing-3, 24px)' };
  const sectionTitleStyle: React.CSSProperties = { fontFamily: 'var(--font-heading)', fontWeight: 600, fontSize: '18px', lineHeight: 1.3, color: 'var(--color-neutrals-2, #23262F)', margin: '0 0 var(--spacing-2, 16px)' };
  const gridStyle = (isBanner: boolean): React.CSSProperties => ({ display: 'grid', gridTemplateColumns: `repeat(auto-fill, minmax(${isBanner ? (isMobile ? '150px' : '180px') : (isMobile ? '100px' : '120px')}, 1fr))`, gap: isMobile ? '12px' : 'var(--spacing-2, 16px)' });
  
  const getOptionStyle = (optionId: string, isSelected: boolean, isBanner: boolean): React.CSSProperties => {
    const isHovered = hoveredOption === optionId;
    return { position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', padding: isBanner ? '8px' : '8px', border: `2px solid ${isSelected ? 'var(--color-neutrals-2, #23262F)' : (isHovered ? 'var(--color-neutrals-5, #B1B5C3)' : 'var(--color-neutrals-6, #E6E8EC)')}`, borderRadius: 'var(--border-radius-md, 8px)', cursor: 'pointer', backgroundColor: isSelected ? 'var(--color-neutrals-7, #F4F5F6)' : 'var(--color-white, #FFFFFF)', boxShadow: isSelected || isHovered ? '0 4px 20px rgba(20, 20, 22, 0.06)' : '0 1px 2px rgba(20, 20, 22, 0.04)', transform: isSelected || isHovered ? 'translateY(-2px)' : 'none', transition: 'all 150ms ease-in-out' };
  };

  const getImageContainerStyle = (_isLogo: boolean, isBanner: boolean): React.CSSProperties => ({ width: isBanner ? '100%' : '80px', height: isBanner ? '100px' : '80px', borderRadius: isBanner ? '4px' : '50%', overflow: 'hidden', backgroundColor: 'var(--color-neutrals-7, #F4F5F6)', display: 'flex', alignItems: 'center', justifyContent: 'center' });
  const getImageStyle = (isLogo: boolean): React.CSSProperties => ({ width: '100%', height: '100%', objectFit: isLogo ? 'contain' : 'cover', backgroundColor: isLogo ? 'white' : 'transparent', padding: isLogo ? '8px' : 0 });
  const getOptionNameStyle = (isSelected: boolean): React.CSSProperties => ({ fontFamily: 'var(--font-body)', fontWeight: isSelected ? 600 : 400, fontSize: '12px', lineHeight: 1.3, color: isSelected ? 'var(--color-neutrals-2, #23262F)' : 'var(--color-neutrals-3, #353945)', textAlign: 'center' });
  const checkStyle: React.CSSProperties = { position: 'absolute', top: '4px', right: '4px', width: '24px', height: '24px', backgroundColor: 'var(--color-neutrals-2, #23262F)', borderRadius: 'var(--border-radius-circle, 50%)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-neutrals-8, #FCFCFD)', boxShadow: '0 2px 8px rgba(20, 20, 22, 0.04)' };
  const actionsStyle: React.CSSProperties = { display: 'flex', gap: '12px', justifyContent: 'flex-end', padding: isMobile ? '20px' : '24px', borderTop: '1px solid var(--color-neutrals-7, #F4F5F6)', marginTop: '24px', flexDirection: isMobile ? 'column' : 'row' };

  return (
    <ModalShell isOpen={isVisible} onClose={onClose} maxWidth="600px" style={modalStyle}>
      <div style={innerStyle}>
        <div style={headerStyle}>
          <h2 style={titleStyle}>Edit Profile</h2>
          <button style={closeBtnStyle} onClick={onClose} onMouseEnter={() => setIsCloseHovered(true)} onMouseLeave={() => setIsCloseHovered(false)}>
            <Icon name="close" size={24} />
          </button>
        </div>

        <div style={controlsStyle}>
          <div style={tabsStyle}>
            <button style={getTabStyle('avatar', activeTab === 'avatar')} onClick={() => setActiveTab('avatar')} onMouseEnter={() => setHoveredTab('avatar')} onMouseLeave={() => setHoveredTab(null)}>
              <Icon name="person" size={20} /> Avatar
            </button>
            <button style={getTabStyle('banner', activeTab === 'banner')} onClick={() => setActiveTab('banner')} onMouseEnter={() => setHoveredTab('banner')} onMouseLeave={() => setHoveredTab(null)}>
              <Icon name="image" size={20} /> Banner
            </button>
          </div>
          <div style={locationFieldStyle}>
            <label htmlFor="profile-location" style={visuallyHiddenStyle}>Profile location</label>
            <Icon name="location_on" size={18} style={locationIconStyle} />
            <input
              ref={locationInputRef}
              id="profile-location"
              type="text"
              value={profileLocation}
              onChange={(event) => setProfileLocation(event.target.value)}
              onBlur={handleLocationBlur}
              placeholder="City, State or ZIP"
              autoComplete="address-level2"
              inputMode="text"
              aria-busy={isResolvingLocation}
              style={locationInputStyle}
            />
          </div>
        </div>

        <div style={contentStyle}>
          {activeTab === 'avatar' && (
            <div style={sectionStyle}>
              <h3 style={sectionTitleStyle}>Choose Avatar</h3>
              <div style={gridStyle(false)}>
                {avatarOptions.map((avatar) => (
                  <div key={avatar.id} style={getOptionStyle(avatar.id, selectedAvatar === avatar.url, false)} onClick={() => setSelectedAvatar(avatar.url)} onMouseEnter={() => setHoveredOption(avatar.id)} onMouseLeave={() => setHoveredOption(null)}>
                    <div style={getImageContainerStyle(avatar.type === 'logo', false)}>
                      <img src={avatar.url} alt={avatar.name} style={getImageStyle(avatar.type === 'logo')} />
                    </div>
                    <span style={getOptionNameStyle(selectedAvatar === avatar.url)}>{avatar.name}</span>
                    {selectedAvatar === avatar.url && <div style={checkStyle}><Icon name="check" size={16} /></div>}
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'banner' && (
            <div style={sectionStyle}>
              <h3 style={sectionTitleStyle}>Choose Banner</h3>
              <div style={gridStyle(true)}>
                {bannerOptions.map((banner) => (
                  <div key={banner.id} style={getOptionStyle(banner.id, selectedBanner === banner.url, true)} onClick={() => setSelectedBanner(banner.url)} onMouseEnter={() => setHoveredOption(banner.id)} onMouseLeave={() => setHoveredOption(null)}>
                    <div style={getImageContainerStyle(false, true)}>
                      <img src={banner.url} alt={banner.name} style={getImageStyle(false)} />
                    </div>
                    <span style={getOptionNameStyle(selectedBanner === banner.url)}>{banner.name}</span>
                    {selectedBanner === banner.url && <div style={checkStyle}><Icon name="check" size={16} /></div>}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div style={actionsStyle}>
          <Button color="neutrals3" variant="solid" size="default" onClick={onClose}>Cancel</Button>
          <Button color="blue" variant="solid" size="default" onClick={handleSave}>
            {isResolvingLocation ? 'Checking Location...' : 'Save Changes'}
          </Button>
        </div>
      </div>
    </ModalShell>
  );
};

export default AvatarBannerModal;
