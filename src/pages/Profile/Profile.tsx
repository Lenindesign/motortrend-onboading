/**
 * Profile Page
 * Based on Figma Community design system
 */

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import ProfileBanner from '../../components/ProfileBanner';
import ProfileNav from '../../components/ProfileNav';
import type { ProfileNavTab } from '../../components/ProfileNav';
import ArticleCard from '../../components/ArticleCard';
import VehicleCard from '../../components/VehicleCard';
import ComparisonCard from '../../components/ComparisonCard';
import VideoCard from '../../components/VideoCard';
import SubscriptionItem from '../../components/SubscriptionItem';
import EditableField from '../../components/EditableField';
import ConnectedAccount from '../../components/ConnectedAccount';
import CollapsibleSection from '../../components/CollapsibleSection';
import ProfileCompletionCard from '../../components/ProfileCompletionCard';
import Toast from '../../components/Toast';
import Icon from '../../components/Icon';
import { AvatarBannerModal } from '../../components/AvatarBannerModal';
import { VehicleSearch } from '../../components/VehicleSearch';
import { vehicleImageFor } from '../../utils/vehicleImages';
import Button from '../../design-system/components/Button';
import RatingModal from '../../components/RatingModal';
import './Profile.css';

export interface ProfileProps {
  userData?: {
    name: string;
    avatar?: string;
    joinDate: string;
    location?: string;
  };
  onboardingData?: {
    name?: string;
    location?: string;
    interests?: string[];
    vehicleType?: 'own' | 'want';
    vehicle?: string;
    newsletters?: string[];
  };
  onUpdateStep1?: (data: { name: string; location: string }) => void;
  onUpdateStep2?: (data: { interests: string[] }) => void;
  onUpdateStep3?: (data: { vehicleType: 'own' | 'want'; vehicle: string }) => void;
  onUpdateStep4?: (data: { newsletters: string[] }) => void;
}

export const Profile: React.FC<ProfileProps> = ({ 
  userData, 
  onboardingData,
  onUpdateStep1,
  onUpdateStep2,
  onUpdateStep3,
  onUpdateStep4
}) => {
  const [searchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState<ProfileNavTab>('my-account');
  
  // Set initial tab based on URL parameter
  useEffect(() => {
    const tab = searchParams.get('tab') as ProfileNavTab;
    if (tab && ['my-account', 'saved-items', 'subscriptions', 'settings'].includes(tab)) {
      setActiveTab(tab);
    }
  }, [searchParams]);
  
  // Bookmark state management
  const [savedArticles, setSavedArticles] = useState<string[]>(['article-1', 'article-2']);
  const [savedComparisons, setSavedComparisons] = useState<string[]>(['comparison-1']);
  const [savedVideos, setSavedVideos] = useState<string[]>(['video-1', 'video-2']);
  
  // Onboarding data state
  const [localOnboardingData, setLocalOnboardingData] = useState<{
    name?: string;
    location?: string;
    interests?: string[];
    vehicles?: Array<{name: string, ownership: 'own' | 'want', rating?: number}>;
    newsletters?: string[];
  }>({});
  
  // Subscription state management
  const [newsletterSubscriptions, setNewsletterSubscriptions] = useState({
    'MotorTrend': true,
    'HOT ROD': true
  });
  
  const [magazineSubscriptions, setMagazineSubscriptions] = useState({
    'MotorTrend': true,
    'Car and Driver': true
  });
  
  // Load onboarding data from localStorage
  useEffect(() => {
    const data = localStorage.getItem('onboardingData');
    if (data) {
      try {
        const parsed = JSON.parse(data);
        setLocalOnboardingData(parsed);
        // Update user settings with the latest data
        setUserSettings(prev => ({
          ...prev,
          fullName: parsed.name || userData?.name || 'Greg Smith'
        }));
      } catch (error) {
        console.error('Error parsing onboarding data:', error);
      }
    }
  }, [userData?.name]);
  
  // Toast state
  const [showToast, setShowToast] = useState(false);
  const [pendingDelete, setPendingDelete] = useState<{ type: string; id: string } | null>(null);
  
  // Avatar/Banner Modal state
  const [showAvatarBannerModal, setShowAvatarBannerModal] = useState(false);
  const [userAvatar, setUserAvatar] = useState(userData?.avatar);
  const [userBanner, setUserBanner] = useState<string | undefined>('https://d2kde5ohu8qb21.cloudfront.net/files/68f4f53d6befe300029e7151/group1175889109.jpg');
  
  // Vehicle search state
  const [showVehicleSearch, setShowVehicleSearch] = useState(false);
  
  // User settings state
  const [userSettings, setUserSettings] = useState({
    fullName: localOnboardingData.name || userData?.name || 'Greg Smith',
    username: 'Need-for-speed',
    email: 'greg.smith@gmail.com',
    password: '****************'
  });

  // Rating modal state
  const [ratingModal, setRatingModal] = useState<{isOpen: boolean, vehicleName: string, currentRating?: number}>({
    isOpen: false,
    vehicleName: '',
    currentRating: 0
  });
  
  // Vehicle search handlers
  const handleAddVehicleClick = () => {
    setShowVehicleSearch(true);
  };

  const handleCancelVehicleSearch = () => {
    setShowVehicleSearch(false);
  };

  // User settings handlers
  const handleSaveFullName = (newName: string) => {
    const updatedSettings = { ...userSettings, fullName: newName };
    setUserSettings(updatedSettings);
    
    // Update onboarding data
    const updatedOnboardingData = { ...localOnboardingData, name: newName };
    setLocalOnboardingData(updatedOnboardingData);
    localStorage.setItem('onboardingData', JSON.stringify(updatedOnboardingData));
    
    // Broadcast change for header sync
    window.dispatchEvent(new Event('onboardingDataUpdated'));
  };

  const handleSaveUsername = (newUsername: string) => {
    setUserSettings(prev => ({ ...prev, username: newUsername }));
    // In a real app, you'd save this to the backend
  };

  const handleSaveEmail = (newEmail: string) => {
    setUserSettings(prev => ({ ...prev, email: newEmail }));
    // In a real app, you'd save this to the backend
  };

  const handleSavePassword = (newPassword: string) => {
    setUserSettings(prev => ({ ...prev, password: '****************' }));
    // In a real app, you'd hash and save newPassword to the backend
    console.log('Password updated:', newPassword.length > 0 ? 'New password set' : 'No password provided');
  };

  // Rating handlers
  const handleRateVehicle = (vehicleName: string) => {
    const vehicle = (localOnboardingData.vehicles || []).find(v => v.name === vehicleName);
    setRatingModal({
      isOpen: true,
      vehicleName,
      currentRating: vehicle?.rating || 0
    });
  };

  const handleRatingSubmit = (rating: number) => {
    const vehicles = localOnboardingData.vehicles || [];
    const updatedVehicles = vehicles.map(v => 
      v.name === ratingModal.vehicleName ? { ...v, rating } : v
    );
    const updatedData = { ...localOnboardingData, vehicles: updatedVehicles };
    setLocalOnboardingData(updatedData);
    localStorage.setItem('onboardingData', JSON.stringify(updatedData));
    setRatingModal({ isOpen: false, vehicleName: '', currentRating: 0 });
  };

  const handleRatingModalClose = () => {
    setRatingModal({ isOpen: false, vehicleName: '', currentRating: 0 });
  };

  // Subscription toggle handlers
  const handleNewsletterToggle = (name: string, isActive: boolean) => {
    setNewsletterSubscriptions(prev => ({
      ...prev,
      [name]: !isActive
    }));
  };

  const handleMagazineToggle = (name: string, isActive: boolean) => {
    setMagazineSubscriptions(prev => ({
      ...prev,
      [name]: !isActive
    }));
  };

  // Bookmark handlers
  const handleBookmarkClick = (type: 'article' | 'comparison' | 'video', id: string) => {
    setPendingDelete({ type, id });
    setShowToast(true);
  };

  const handleConfirmDelete = () => {
    if (!pendingDelete) return;

    const { type, id } = pendingDelete;
    
    switch (type) {
      case 'article':
        setSavedArticles(prev => prev.filter(a => a !== id));
        break;
      case 'comparison':
        setSavedComparisons(prev => prev.filter(c => c !== id));
        break;
      case 'video':
        setSavedVideos(prev => prev.filter(v => v !== id));
        break;
      case 'vehicle':
        handleConfirmVehicleDelete(id);
        break;
    }

    setShowToast(false);
    setPendingDelete(null);
  };

  const handleCancelDelete = () => {
    setShowToast(false);
    setPendingDelete(null);
  };

  // Avatar/Banner Modal handlers
  const handleEditProfile = () => {
    setShowAvatarBannerModal(true);
  };

  const handleSaveAvatarBanner = (avatarUrl: string, bannerUrl: string) => {
    setUserAvatar(avatarUrl);
    setUserBanner(bannerUrl);
    setShowAvatarBannerModal(false);
  
  // Persist to localStorage so header and other areas stay in sync
  try {
    const existing = localStorage.getItem('onboardingData');
    const parsed = existing ? JSON.parse(existing) : {};
    const updated = { ...parsed, avatar: avatarUrl, banner: bannerUrl };
    localStorage.setItem('onboardingData', JSON.stringify(updated));
    setLocalOnboardingData(updated);
    // Broadcast change so GlobalHeader can refresh avatar without reload
    window.dispatchEvent(new Event('onboardingDataUpdated'));
  } catch (e) {
    console.error('Failed to persist avatar/banner selection', e);
  }
  };

  // Vehicle search handlers
  const handleVehicleSelect = (vehicle: { name: string; ownership: 'own' | 'want' }) => {
    const updatedData = {
      ...localOnboardingData,
      vehicles: [...(localOnboardingData.vehicles || []), vehicle]
    };
    setLocalOnboardingData(updatedData);
    localStorage.setItem('onboardingData', JSON.stringify(updatedData));
    setShowVehicleSearch(false); // Hide search after selection
  };

  // Categorize onboarding vehicles
  const vehiclesIOwn = (localOnboardingData.vehicles || []).filter(vehicle => vehicle.ownership === 'own');
  const vehiclesIWant = (localOnboardingData.vehicles || []).filter(vehicle => vehicle.ownership === 'want');

  // Vehicle images now shared via utils/vehicleImages

  // Handle removing onboarding vehicles with confirmation
  const handleRemoveOnboardingVehicle = (vehicleName: string) => {
    setPendingDelete({ type: 'vehicle', id: vehicleName });
    setShowToast(true);
  };

  const handleConfirmVehicleDelete = (vehicleName: string) => {
    const updatedVehicles = (localOnboardingData.vehicles || []).filter(v => v.name !== vehicleName);
    const updatedData = {
      ...localOnboardingData,
      vehicles: updatedVehicles
    };
    
    setLocalOnboardingData(updatedData);
    
    // Update localStorage
    localStorage.setItem('onboardingData', JSON.stringify(updatedData));
  };

  // Change vehicle ownership (moves card between Own/Want lists)
  const handleChangeVehicleOwnership = (vehicleName: string, newOwnership: 'own' | 'want') => {
    const vehicles = localOnboardingData.vehicles || [];
    const updatedVehicles = vehicles.map(v => (
      v.name === vehicleName ? { ...v, ownership: newOwnership } : v
    ));
    const updatedData = { ...localOnboardingData, vehicles: updatedVehicles };
    setLocalOnboardingData(updatedData);
    localStorage.setItem('onboardingData', JSON.stringify(updatedData));
  };

  const mockArticles = [
    {
      title: 'Tested: Audi Plays It Safe With the Audi A6 Sportback E-Tron',
      author: 'Justin Banner',
      date: 'Oct 10, 2025',
      imageUrl: 'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=300&h=200&fit=crop&q=80',
    },
    {
      title: "We Didn't Ask the Toyota GR Corolla to Get Less Fun, But Here We Are",
      author: 'Justin Banner',
      date: 'Oct 10, 2025',
      imageUrl: 'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=300&h=200&fit=crop&q=80',
    },
  ];

  return (
    <div className="profile-page">
      <ProfileBanner
        userName={userSettings.fullName}
        userAvatar={userAvatar}
        userBanner={userBanner}
        joinDate={userData?.joinDate || '1/14/2024'}
        location={localOnboardingData.location || userData?.location || 'Location not specified'}
        onEditProfile={handleEditProfile}
      />

      <div className="profile-content">
        <div className="profile-sidebar">
          <ProfileNav
            activeTab={activeTab}
            onTabChange={setActiveTab}
          />
        </div>

        <div className="profile-main">
                 {activeTab === 'my-account' && (
                   <>
                     {/* Continue Reading Section */}
                     <div className="profile-section profile-section--articles">
                       <div className="profile-section__content">
                         <div className="profile-section__header-row">
                           <h3 className="profile-section__heading">Continue Reading</h3>
                         </div>
                         
                         <div className="profile-articles">
                           {mockArticles.map((article, index) => (
                             <ArticleCard
                               key={index}
                               title={article.title}
                               author={article.author}
                               date={article.date}
                               imageUrl={article.imageUrl}
                               onReadArticle={() => console.log('Read article:', article.title)}
                               isBookmarked={savedArticles.includes(`article-${index + 1}`)}
                               onBookmark={() => handleBookmarkClick('article', `article-${index + 1}`)}
                             />
                           ))}
                         </div>
                       </div>
                     </div>

                     {/* Profile Completion Card */}
                     <ProfileCompletionCard
                       onboardingData={onboardingData}
                       onUpdateStep1={onUpdateStep1}
                       onUpdateStep2={onUpdateStep2}
                       onUpdateStep3={onUpdateStep3}
                       onUpdateStep4={onUpdateStep4}
                     />

                   </>
                 )}

          {activeTab === 'saved-items' && (
            <>
              {/* Vehicles Section */}
              <div className="profile-section profile-section--vehicles">
                <div className="profile-section__content">
                  <div className="profile-section__header-row">
                    <h3 className="profile-section__heading">Vehicles</h3>
                    <Button 
                      color="neutrals3" 
                      variant="solid" 
                      size="default"
                      onClick={handleAddVehicleClick}
                    >
                      Add Vehicle
                    </Button>
                  </div>
                  
                  {/* Vehicle Search - conditionally visible */}
                  {showVehicleSearch && (
                    <div className="profile-vehicle-search">
                        <div className="profile-vehicle-search__header">
                          <h4>Add a Vehicle</h4>
                          <button 
                            className="profile-vehicle-search__cancel"
                            onClick={handleCancelVehicleSearch}
                          >
                            Cancel
                          </button>
                        </div>
                        <VehicleSearch
                          onVehicleSelect={handleVehicleSelect}
                          placeholder="Search for a vehicle..."
                          className="profile-vehicle-search__input"
                        />
                    </div>
                  )}
                  
                  {/* Cars I Own */}
                  {vehiclesIOwn.length > 0 && (
                    <div className="profile-vehicles-subsection">
                      <h4 className="profile-subsection__title">Cars I Own</h4>
                      <div className="profile-vehicles-grid">
                        {vehiclesIOwn.map((vehicle, index) => (
                            <VehicleCard
                              key={`own-${index}`}
                              image={vehicleImageFor(vehicle.name)}
                              name={vehicle.name}
                              type="Vehicle"
                            rating1={9.1}
                            rating2={8.5}
                            hasMultipleRatings={true}
                            isBookmarked={true}
                            onBookmark={() => handleRemoveOnboardingVehicle(vehicle.name)}
                            ownership={vehicle.ownership}
                            onOwnershipChange={(value) => handleChangeVehicleOwnership(vehicle.name, value)}
                            onViewDetails={() => console.log('View vehicle details:', vehicle.name)}
                            onRate={() => handleRateVehicle(vehicle.name)}
                            userRating={vehicle.rating}
                          />
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Divider - only show if we have both sections */}
                  {vehiclesIOwn.length > 0 && vehiclesIWant.length > 0 && (
                    <div className="profile-section-divider"></div>
                  )}

                  {/* Cars I Want */}
                  {vehiclesIWant.length > 0 && (
                    <div className="profile-vehicles-subsection">
                      <h4 className="profile-subsection__title">Cars I Want</h4>
                      <div className="profile-vehicles-grid">
                        {vehiclesIWant.map((vehicle, index) => (
                            <VehicleCard
                              key={`want-${index}`}
                              image={vehicleImageFor(vehicle.name)}
                              name={vehicle.name}
                              type="Vehicle"
                            rating1={9.1}
                            rating2={8.5}
                            hasMultipleRatings={true}
                            isBookmarked={true}
                            onBookmark={() => handleRemoveOnboardingVehicle(vehicle.name)}
                            ownership={vehicle.ownership}
                            onOwnershipChange={(value) => handleChangeVehicleOwnership(vehicle.name, value)}
                            onViewDetails={() => console.log('View vehicle details:', vehicle.name)}
                            onRate={() => handleRateVehicle(vehicle.name)}
                            userRating={vehicle.rating}
                          />
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Show message if no vehicles */}
                  {(localOnboardingData.vehicles || []).length === 0 && (
                    <div className="profile-vehicles-subsection">
                      <div className="profile-vehicles-grid">
                        <div className="profile-empty-state">
                          <p>No vehicles added yet. Complete the onboarding process to add your vehicles.</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Articles Section */}
              <div className="profile-section profile-section--articles">
                <div className="profile-section__content">
                  <div className="profile-section__header-row">
                    <h3 className="profile-section__heading">Articles</h3>
                  </div>
                  
                  <div className="profile-articles">
                    {savedArticles.includes('article-1') && (
                      <ArticleCard
                        title="Tested: Audi Plays It Safe With the Audi A6 Sportback E-Tron"
                        author="Justin Banner"
                        date="Oct 10, 2025"
                        imageUrl="https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=300&h=200&fit=crop&q=80"
                        onReadArticle={() => console.log('Read article')}
                        isBookmarked={true}
                        onBookmark={() => handleBookmarkClick('article', 'article-1')}
                      />
                    )}
                    {savedArticles.includes('article-2') && (
                      <ArticleCard
                        title="We Didn't Ask the Toyota GR Corolla to Get Less Fun, But Here We Are"
                        author="Justin Banner"
                        date="Oct 10, 2025"
                        imageUrl="https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=300&h=200&fit=crop&q=80"
                        onReadArticle={() => console.log('Read article')}
                        isBookmarked={true}
                        onBookmark={() => handleBookmarkClick('article', 'article-2')}
                      />
                    )}
                  </div>
                </div>
              </div>

              {/* Car Comparisons Section */}
              <div className="profile-section profile-section--comparisons">
                <div className="profile-section__content">
                  <div className="profile-section__header-row">
                    <h3 className="profile-section__heading">Car Comparisons</h3>
                  </div>
                  
                  <div className="profile-comparisons-grid">
                    {savedComparisons.includes('comparison-1') && (
                      <ComparisonCard
                        vehicle1={{
                          image: vehicleImageFor('2025 Ford Bronco'),
                          name: '2025 Ford Bronco'
                        }}
                        vehicle2={{
                          image: vehicleImageFor('2025 Ford Bronco Sport'),
                          name: '2025 Ford Bronco S'
                        }}
                        isBookmarked={true}
                        onBookmark={() => handleBookmarkClick('comparison', 'comparison-1')}
                        onViewComparison={() => console.log('View comparison')}
                      />
                    )}
                  </div>
                </div>
              </div>

              {/* Videos Section */}
              <div className="profile-section profile-section--videos">
                <div className="profile-section__content">
                  <div className="profile-section__header-row">
                    <h3 className="profile-section__heading">Videos</h3>
                  </div>
                  
                  <div className="profile-videos-grid">
                    {savedVideos.includes('video-1') && (
                      <VideoCard
                        image="https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=400&h=300&fit=crop&q=80"
                        title="Tested: The 2023 Honda Civic Type R Shares Our Faith"
                        author="Justin Banner"
                        date="Oct 10, 2025"
                        isBookmarked={true}
                        onBookmark={() => handleBookmarkClick('video', 'video-1')}
                        onPlayVideo={() => console.log('Play video 1')}
                      />
                    )}
                    {savedVideos.includes('video-2') && (
                      <VideoCard
                        image="https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=400&h=300&fit=crop&q=80"
                        title="The Shelby GT500 Is The Coolest Mustang Ever Produced"
                        author="Justin Banner"
                        date="Oct 10, 2025"
                        isBookmarked={true}
                        onBookmark={() => handleBookmarkClick('video', 'video-2')}
                        onPlayVideo={() => console.log('Play video 2')}
                      />
                    )}
                  </div>
                </div>
              </div>
            </>
          )}

          {activeTab === 'subscriptions' && (
            <>
              {/* My Newsletters Section */}
              <div className="profile-section profile-section--subscriptions">
                <div className="profile-section__content">
                  <div className="profile-section__header-row">
                    <h3 className="profile-section__heading">My Newsletters</h3>
                  </div>
                  
                  <div className="profile-subscriptions-grid">
                    <SubscriptionItem
                      name="MotorTrend"
                      logo="https://d2kde5ohu8qb21.cloudfront.net/files/68f64a2ae852a20002f9bc03/mt-nl.svg"
                      isActive={newsletterSubscriptions['MotorTrend']}
                      onToggleSubscription={handleNewsletterToggle}
                    />
                    <SubscriptionItem
                      name="HOT ROD"
                      logo="https://d2kde5ohu8qb21.cloudfront.net/files/68f64aa7e852a20002f9bc04/hr-nl.svg"
                      isActive={newsletterSubscriptions['HOT ROD']}
                      onToggleSubscription={handleNewsletterToggle}
                    />
                    <SubscriptionItem
                      name="Find More"
                      isFindMore={true}
                      onClick={() => console.log('Find more newsletters')}
                    />
                  </div>
                </div>
              </div>

              {/* My Print Magazines Section */}
              <div className="profile-section profile-section--subscriptions">
                <div className="profile-section__content">
                  <div className="profile-section__header-row">
                    <h3 className="profile-section__heading">My Print Magazines</h3>
                  </div>
                  
                  <div className="profile-subscriptions-grid">
                    <SubscriptionItem
                      name="MotorTrend"
                      logo="https://d2kde5ohu8qb21.cloudfront.net/files/68f64d7a3a12db0002cab19f/mtmag.png"
                      isActive={magazineSubscriptions['MotorTrend']}
                      onToggleSubscription={handleMagazineToggle}
                    />
                    <SubscriptionItem
                      name="Car and Driver"
                      logo="https://d2kde5ohu8qb21.cloudfront.net/files/68f64d793a12db0002cab19d/caranddrivermagazine.png"
                      isActive={magazineSubscriptions['Car and Driver']}
                      onToggleSubscription={handleMagazineToggle}
                    />
                    <SubscriptionItem
                      name="Find More"
                      isFindMore={true}
                      onClick={() => console.log('Find more magazines')}
                    />
                  </div>
                </div>
              </div>
            </>
          )}

          {activeTab === 'settings' && (
            <>
              {/* Basic Info Section */}
              <div className="profile-section profile-section--settings">
                <div className="profile-settings-fields">
                  <EditableField
                    label="Full Name"
                    value={userSettings.fullName}
                    onSave={handleSaveFullName}
                    placeholder="Enter your full name"
                  />
                  <div className="profile-settings-divider"></div>
                  <EditableField
                    label="Username"
                    value={userSettings.username}
                    onSave={handleSaveUsername}
                    placeholder="Enter your username"
                  />
                  <div className="profile-settings-divider"></div>
                  <EditableField
                    label="Email Address"
                    value={userSettings.email}
                    onSave={handleSaveEmail}
                    placeholder="Enter your email address"
                  />
                  <div className="profile-settings-divider"></div>
                  <EditableField
                    label="Password"
                    value={userSettings.password}
                    isPassword={true}
                    onSave={handleSavePassword}
                    placeholder="Enter your new password"
                  />
                </div>
              </div>

              {/* Connected Accounts Section */}
              <div className="profile-section profile-section--connected-accounts">
                <h3 className="profile-connected-accounts-title">Connected Accounts</h3>
                <div className="profile-connected-accounts-list">
                  <ConnectedAccount
                    provider="google"
                    accountName="Lenin Aviles"
                    isConnected={true}
                  />
                  <div className="profile-settings-divider"></div>
                  <ConnectedAccount
                    provider="facebook"
                    isConnected={false}
                    onConnect={() => console.log('Connect Facebook')}
                  />
                  <div className="profile-settings-divider"></div>
                  <ConnectedAccount
                    provider="apple"
                    isConnected={false}
                    onConnect={() => console.log('Connect Apple')}
                  />
                </div>
              </div>

              {/* Collapsible Sections */}
              <CollapsibleSection
                title="Privacy Settings"
                description="Edit the visibility"
              >
                <div className="privacy-settings-content">
                  <div className="privacy-setting-item">
                    <div className="privacy-setting-info">
                      <h4 className="privacy-setting-title">Profile Visibility</h4>
                      <p className="privacy-setting-description">Control who can see your profile information</p>
                    </div>
                    <div className="privacy-setting-control">
                      <select className="privacy-select">
                        <option value="public">Public</option>
                        <option value="friends">Friends Only</option>
                        <option value="private">Private</option>
                      </select>
                    </div>
                  </div>
                  
                  <div className="privacy-setting-item">
                    <div className="privacy-setting-info">
                      <h4 className="privacy-setting-title">Activity Status</h4>
                      <p className="privacy-setting-description">Show when you're online or recently active</p>
                    </div>
                    <div className="privacy-setting-control">
                      <label className="privacy-toggle">
                        <input type="checkbox" defaultChecked />
                        <span className="privacy-toggle-slider"></span>
                      </label>
                    </div>
                  </div>
                  
                  <div className="privacy-setting-item">
                    <div className="privacy-setting-info">
                      <h4 className="privacy-setting-title">Data Sharing</h4>
                      <p className="privacy-setting-description">Allow MotorTrend to use your data for personalization</p>
                    </div>
                    <div className="privacy-setting-control">
                      <label className="privacy-toggle">
                        <input type="checkbox" defaultChecked />
                        <span className="privacy-toggle-slider"></span>
                      </label>
                    </div>
                  </div>
                </div>
              </CollapsibleSection>

              <CollapsibleSection
                title="Personal Settings"
                description="Edit your age and country of residence"
              >
                <div className="personal-settings-content">
                  <div className="personal-setting-item">
                    <div className="personal-setting-info">
                      <h4 className="personal-setting-title">Date of Birth</h4>
                      <p className="personal-setting-description">Used for age-appropriate content and features</p>
                    </div>
                    <div className="personal-setting-control">
                      <input type="date" className="personal-input" defaultValue="1990-01-01" />
                    </div>
                  </div>
                  
                  <div className="personal-setting-item">
                    <div className="personal-setting-info">
                      <h4 className="personal-setting-title">Country of Residence</h4>
                      <p className="personal-setting-description">Helps us provide relevant content and services</p>
                    </div>
                    <div className="personal-setting-control">
                      <select className="personal-select">
                        <option value="US">United States</option>
                        <option value="CA">Canada</option>
                        <option value="UK">United Kingdom</option>
                        <option value="AU">Australia</option>
                        <option value="DE">Germany</option>
                        <option value="FR">France</option>
                        <option value="JP">Japan</option>
                        <option value="MX">Mexico</option>
                      </select>
                    </div>
                  </div>
                  
                  <div className="personal-setting-item">
                    <div className="personal-setting-info">
                      <h4 className="personal-setting-title">Language Preference</h4>
                      <p className="personal-setting-description">Choose your preferred language for the interface</p>
                    </div>
                    <div className="personal-setting-control">
                      <select className="personal-select">
                        <option value="en">English</option>
                        <option value="es">Español</option>
                        <option value="fr">Français</option>
                        <option value="de">Deutsch</option>
                        <option value="ja">日本語</option>
                      </select>
                    </div>
                  </div>
                  
                  <div className="personal-setting-item">
                    <div className="personal-setting-info">
                      <h4 className="personal-setting-title">Time Zone</h4>
                      <p className="personal-setting-description">Used for scheduling and notifications</p>
                    </div>
                    <div className="personal-setting-control">
                      <select className="personal-select">
                        <option value="PST">Pacific Standard Time (PST)</option>
                        <option value="MST">Mountain Standard Time (MST)</option>
                        <option value="CST">Central Standard Time (CST)</option>
                        <option value="EST">Eastern Standard Time (EST)</option>
                        <option value="GMT">Greenwich Mean Time (GMT)</option>
                      </select>
                    </div>
                  </div>
                </div>
              </CollapsibleSection>

              <CollapsibleSection
                title="Delete Account"
              >
                <div className="delete-account-content">
                  <div className="delete-account-warning">
                    <div className="delete-account-icon">
                      <Icon name="warning" size={24} style={{ color: "#DC3545" }} />
                    </div>
                    <div className="delete-account-text">
                      <h4 className="delete-account-title">Permanently Delete Account</h4>
                      <p className="delete-account-description">
                        This action cannot be undone. All your data, including saved articles, 
                        vehicles, and preferences will be permanently deleted.
                      </p>
                    </div>
                  </div>
                  
                  <div className="delete-account-options">
                    <div className="delete-account-option">
                      <label className="delete-account-checkbox">
                        <input type="checkbox" />
                        <span className="delete-account-checkmark"></span>
                        <span className="delete-account-label">
                          I understand that this action is irreversible
                        </span>
                      </label>
                    </div>
                    
                    <div className="delete-account-option">
                      <label className="delete-account-checkbox">
                        <input type="checkbox" />
                        <span className="delete-account-checkmark"></span>
                        <span className="delete-account-label">
                          I want to delete all my personal data
                        </span>
                      </label>
                    </div>
                  </div>
                  
                  <div className="delete-account-actions">
                    <button className="delete-account-btn delete-account-btn--secondary">
                      Download My Data
                    </button>
                    <button className="delete-account-btn delete-account-btn--danger">
                      Delete Account
                    </button>
                  </div>
                </div>
              </CollapsibleSection>
            </>
          )}
        </div>
      </div>
      
      {/* Toast Confirmation Dialog */}
      <Toast
        message={
          pendingDelete?.type === 'vehicle' 
            ? "Are you sure you want to remove this vehicle from your saved items?"
            : "Are you sure you want to remove this item from your saved items?"
        }
        isVisible={showToast}
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
        confirmText="Remove"
        cancelText="Cancel"
        type="warning"
      />

      {/* Avatar Banner Modal */}
      <AvatarBannerModal
        isVisible={showAvatarBannerModal}
        onClose={() => setShowAvatarBannerModal(false)}
        onSave={handleSaveAvatarBanner}
        currentAvatar={userAvatar}
        currentBanner={userBanner}
      />

      {/* Rating Modal */}
      <RatingModal
        isOpen={ratingModal.isOpen}
        onClose={handleRatingModalClose}
        onRate={handleRatingSubmit}
        vehicleName={ratingModal.vehicleName}
        currentRating={ratingModal.currentRating}
      />
    </div>
  );
};

export default Profile;

