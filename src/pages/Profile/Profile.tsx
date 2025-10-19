/**
 * Profile Page
 * Based on Figma Community design system
 */

import React, { useState, useEffect } from 'react';
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
  const [activeTab, setActiveTab] = useState<ProfileNavTab>('my-account');
  
  // Bookmark state management
  const [savedArticles, setSavedArticles] = useState<string[]>(['article-1', 'article-2']);
  const [savedComparisons, setSavedComparisons] = useState<string[]>(['comparison-1']);
  const [savedVideos, setSavedVideos] = useState<string[]>(['video-1', 'video-2']);
  
  // Onboarding data state
  const [localOnboardingData, setLocalOnboardingData] = useState<{
    name?: string;
    location?: string;
    interests?: string[];
    vehicles?: Array<{name: string, ownership: 'own' | 'want'}>;
    newsletters?: string[];
  }>({});
  
  // Load onboarding data from localStorage
  useEffect(() => {
    const data = localStorage.getItem('onboardingData');
    if (data) {
      try {
        const parsed = JSON.parse(data);
        setLocalOnboardingData(parsed);
      } catch (error) {
        console.error('Error parsing onboarding data:', error);
      }
    }
  }, []);
  
  // Toast state
  const [showToast, setShowToast] = useState(false);
  const [pendingDelete, setPendingDelete] = useState<{ type: string; id: string } | null>(null);

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
    }

    setShowToast(false);
    setPendingDelete(null);
  };

  const handleCancelDelete = () => {
    setShowToast(false);
    setPendingDelete(null);
  };

  // Categorize onboarding vehicles
  const vehiclesIOwn = (localOnboardingData.vehicles || []).filter(vehicle => vehicle.ownership === 'own');
  const vehiclesIWant = (localOnboardingData.vehicles || []).filter(vehicle => vehicle.ownership === 'want');

  // Handle removing onboarding vehicles
  const handleRemoveOnboardingVehicle = (vehicleName: string) => {
    const updatedVehicles = (localOnboardingData.vehicles || []).filter(v => v.name !== vehicleName);
    const updatedData = {
      ...localOnboardingData,
      vehicles: updatedVehicles
    };
    
    setLocalOnboardingData(updatedData);
    
    // Update localStorage
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
        userName={localOnboardingData.name || userData?.name || 'Guest User'}
        userAvatar={userData?.avatar}
        joinDate={userData?.joinDate || '1/14/2024'}
        location={localOnboardingData.location || userData?.location || 'Location not specified'}
        onEditProfile={() => console.log('Edit profile')}
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
                     {/* My Account Header */}
                     <div className="profile-section profile-section--header">
                       <h2 className="profile-section__title">My Account</h2>
                     </div>

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
              {/* Saved Items Header */}
              <div className="profile-section profile-section--header">
                <h2 className="profile-section__title">Saved Items</h2>
              </div>

              {/* Vehicles Section */}
              <div className="profile-section profile-section--vehicles">
                <div className="profile-section__content">
                  <div className="profile-section__header-row">
                    <h3 className="profile-section__heading">Vehicles</h3>
                    <button 
                      className="profile-section__add-btn"
                      onClick={() => console.log('Add vehicle')}
                    >
                      Add A Vehicle
                    </button>
                  </div>
                  
                  {/* Cars I Own */}
                  {vehiclesIOwn.length > 0 && (
                    <div className="profile-vehicles-subsection">
                      <h4 className="profile-subsection__title">Cars I Own</h4>
                      <div className="profile-vehicles-grid">
                        {vehiclesIOwn.map((vehicle, index) => (
                          <VehicleCard
                            key={`own-${index}`}
                            image="https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=400&h=300&fit=crop&q=80"
                            name={vehicle.name}
                            type="Vehicle"
                            rating1={9.1}
                            rating2={8.5}
                            hasMultipleRatings={true}
                            isBookmarked={true}
                            onBookmark={() => handleRemoveOnboardingVehicle(vehicle.name)}
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
                            image="https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=400&h=300&fit=crop&q=80"
                            name={vehicle.name}
                            type="Vehicle"
                            rating1={9.1}
                            rating2={8.5}
                            hasMultipleRatings={true}
                            isBookmarked={true}
                            onBookmark={() => handleRemoveOnboardingVehicle(vehicle.name)}
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
                          image: "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=400&h=300&fit=crop&q=80",
                          name: "2025 Ford Bronco"
                        }}
                        vehicle2={{
                          image: "https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?w=400&h=300&fit=crop&q=80",
                          name: "2025 Ford Bronco S"
                        }}
                        isBookmarked={true}
                        onBookmark={() => handleBookmarkClick('comparison', 'comparison-1')}
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
                      />
                    )}
                  </div>
                </div>
              </div>
            </>
          )}

          {activeTab === 'subscriptions' && (
            <>
              {/* My Subscriptions Header */}
              <div className="profile-section profile-section--header">
                <h2 className="profile-section__title">My Subscriptions</h2>
              </div>

              {/* My Newsletters Section */}
              <div className="profile-section profile-section--subscriptions">
                <div className="profile-section__content">
                  <div className="profile-section__header-row">
                    <h3 className="profile-section__heading">My Newsletters</h3>
                  </div>
                  
                  <div className="profile-subscriptions-grid">
                    <SubscriptionItem
                      name="MotorTrend"
                      logo="https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=200&h=200&fit=crop&q=80"
                      isActive={true}
                    />
                    <SubscriptionItem
                      name="HOT ROD"
                      logo="https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=200&h=200&fit=crop&q=80"
                      isActive={false}
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
                      logo="https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=200&h=200&fit=crop&q=80"
                      isActive={true}
                    />
                    <SubscriptionItem
                      name="Car and Driver"
                      logo="https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=200&h=200&fit=crop&q=80"
                      isActive={false}
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
              {/* Account Settings Header */}
              <div className="profile-section profile-section--header">
                <h2 className="profile-section__title">Account Settings</h2>
              </div>

              {/* Basic Info Section */}
              <div className="profile-section profile-section--settings">
                <div className="profile-settings-fields">
                  <EditableField
                    label="Full Name"
                    value="Greg Smith"
                    onEdit={() => console.log('Edit full name')}
                  />
                  <div className="profile-settings-divider"></div>
                  <EditableField
                    label="Username"
                    value="Need-for-speed"
                    onEdit={() => console.log('Edit username')}
                  />
                  <div className="profile-settings-divider"></div>
                  <EditableField
                    label="Email Address"
                    value="greg.smith@gmail.com"
                    onEdit={() => console.log('Edit email')}
                  />
                  <div className="profile-settings-divider"></div>
                  <EditableField
                    label="Password"
                    value="****************"
                    isPassword={true}
                    onEdit={() => console.log('Edit password')}
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
                <p>Privacy settings content will go here.</p>
              </CollapsibleSection>

              <CollapsibleSection
                title="Personal Settings"
                description="Edit your age and country of recidence"
              >
                <p>Personal settings content will go here.</p>
              </CollapsibleSection>

              <CollapsibleSection
                title="Delete Account"
              >
                <p>Account deletion options will go here.</p>
              </CollapsibleSection>
            </>
          )}
        </div>
      </div>
      
      {/* Toast Confirmation Dialog */}
      <Toast
        message="Are you sure you want to remove this item from your saved items?"
        isVisible={showToast}
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
        confirmText="Remove"
        cancelText="Cancel"
        type="warning"
      />
    </div>
  );
};

export default Profile;

