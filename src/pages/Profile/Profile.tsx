/**
 * Profile Page
 * Based on Figma Community design system
 */

import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams, useLocation, useNavigate } from 'react-router-dom';
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
// HIDDEN: CollapsibleSection - commented out with Privacy/Personal/Delete sections
// import CollapsibleSection from '../../components/CollapsibleSection';
import ProfileCompletionCard from '../../components/ProfileCompletionCard';
import { EmptyVehicleSection } from '../../components/EmptyVehicleSection';
import Toast from '../../components/Toast';
import Icon from '../../components/Icon';
import { AvatarBannerModal } from '../../components/AvatarBannerModal';
import { VehicleSearch } from '../../components/VehicleSearch';
import { vehicleImageFor, parseVehicleName } from '../../utils/vehicleImages';
import { generateStaffRating, generateCommunityRating } from '../../utils/vehicleRatings';
import { getVehicleByName } from '../../api/vehiclesApi';
import { getCurrentJoinDate } from '../../utils/dateUtils';
import RatingModal from '../../components/RatingModal';
import WriteReviewModal from '../../components/WriteReviewModal';
import ReviewSubmittedToast from '../../components/ReviewSubmittedToast';
import { PriceAlertsModal } from '../../components/PriceAlertsModal';
import { useRating } from '../../contexts/RatingContext';
import { type ReviewData } from '../../components/UserReviews';
import { getAllSavedLeads, unsaveLead } from '../../utils/savedLeads';
import { getAllSavedEvents, unsaveEvent, setEventReminder, getReminderLabel, type SavedEventMetadata, type EventReminder } from '../../utils/savedEvents';
import { getPriceAlertVehicles, removePriceAlert, hasPriceAlert } from '../../utils/priceAlerts';
import type { LocalListing } from '../../components/LocalListingsSidebar/LocalListingsSidebar';
import './Profile.css';

export interface ProfileProps {
  userData?: {
    name: string;
    avatar?: string;
    joinDate: string;
    location?: string;
  };
}

export const Profile: React.FC<ProfileProps> = ({ 
  userData
}) => {
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<ProfileNavTab>('my-account');
  
  // Set initial tab based on URL path or parameter
  useEffect(() => {
    const pathname = location.pathname;
    let tabFromPath: ProfileNavTab | null = null;
    
    // Handle new route structure: /my-account/profile, /my-account/saved-items, etc.
    if (pathname.startsWith('/my-account/')) {
      const pathParts = pathname.split('/');
      const lastPart = pathParts[pathParts.length - 1];
      if (['profile', 'saved-items', 'subscriptions'].includes(lastPart)) {
        // Map 'profile' to 'my-account' for the tab ID
        tabFromPath = (lastPart === 'profile' ? 'my-account' : lastPart) as ProfileNavTab;
      }
    } else {
      // Handle old route structure: /profile/my-account, etc.
      tabFromPath = pathname.split('/').pop() as ProfileNavTab;
    }
    
    const tabFromParam = searchParams.get('tab') as ProfileNavTab;
    const tab = tabFromPath || tabFromParam;
    
    if (tab && ['my-account', 'saved-items', 'subscriptions'].includes(tab)) {
      setActiveTab(tab);
    }
  }, [location.pathname, searchParams]);

  // Clear profile notification when user visits profile page
  useEffect(() => {
    // Check if user has completed onboarding and hasn't seen the notification yet
    const onboardingComplete = localStorage.getItem('onboardingComplete') === 'true';
    const notificationSeen = localStorage.getItem('profileNotificationSeen') === 'true';
    
    if (onboardingComplete && !notificationSeen) {
      // Mark notification as seen
      localStorage.setItem('profileNotificationSeen', 'true');
      // Dispatch event to notify GlobalHeader to hide the dot
      window.dispatchEvent(new CustomEvent('profileNotificationUpdated'));
    }
  }, []);
  
  // Bookmark state management
  const [savedArticles, setSavedArticles] = useState<string[]>([]);
  const [savedArticlesMetadata, setSavedArticlesMetadata] = useState<Record<string, { title: string; author: string; date: string; imageUrl: string; slug: string }>>({});
  const [savedComparisons, setSavedComparisons] = useState<string[]>(['comparison-1']);
  const [savedVideos, setSavedVideos] = useState<string[]>(['video-1', 'video-2']);
  const [savedEventsList, setSavedEventsList] = useState<SavedEventMetadata[]>([]);
  
  // Load saved articles from localStorage
  const loadSavedArticles = () => {
    try {
      const savedArticlesJson = localStorage.getItem('savedArticles');
      if (savedArticlesJson) {
        const articles: string[] = JSON.parse(savedArticlesJson);
        setSavedArticles(articles);
      }
      
      const savedArticlesMetadataJson = localStorage.getItem('savedArticlesMetadata');
      if (savedArticlesMetadataJson) {
        const metadata: Record<string, { title: string; author: string; date: string; imageUrl: string; slug: string }> = 
          JSON.parse(savedArticlesMetadataJson);
        setSavedArticlesMetadata(metadata);
      }
    } catch (error) {
      console.error('Error loading saved articles:', error);
    }
  };
  
  useEffect(() => {
    loadSavedArticles();
  }, []);
  
  // Reload saved articles when switching to saved-items tab
  useEffect(() => {
    if (activeTab === 'saved-items') {
      loadSavedArticles();
    }
  }, [activeTab]);

  // Load and listen for saved events
  const loadSavedEvents = () => setSavedEventsList(getAllSavedEvents());
  useEffect(() => {
    loadSavedEvents();
    const handleSavedEventsUpdated = () => loadSavedEvents();
    window.addEventListener('savedEventsUpdated', handleSavedEventsUpdated);
    return () => window.removeEventListener('savedEventsUpdated', handleSavedEventsUpdated);
  }, []);
  useEffect(() => {
    if (activeTab === 'saved-items') loadSavedEvents();
  }, [activeTab]);

  // Q&A activity state
  interface QAActivity {
    type: 'asked' | 'liked';
    questionId: string;
    questionText: string;
    articleSlug: string;
    articleTitle: string;
    date: string;
  }
  const [qaActivity, setQaActivity] = useState<QAActivity[]>([]);

  // Load Q&A activity
  const loadQAActivity = () => {
    try {
      const json = localStorage.getItem('userQAActivity');
      if (json) {
        setQaActivity(JSON.parse(json));
      }
    } catch (e) {
      console.error('Error loading Q&A activity:', e);
    }
  };

  useEffect(() => {
    loadQAActivity();
  }, []);

  // Reload Q&A when switching to saved-items tab
  useEffect(() => {
    if (activeTab === 'saved-items') {
      loadQAActivity();
    }
  }, [activeTab]);

  // Saved listings state
  const [savedListings, setSavedListings] = useState<Array<{ id: string; listing: LocalListing; vehicleName: string; savedAt: string }>>([]);

  // Load saved listings
  useEffect(() => {
    const loadSavedListings = () => {
      const savedLeads = getAllSavedLeads();
      setSavedListings(savedLeads);
    };
    loadSavedListings();
    
    // Listen for changes to saved leads
    const handleStorageChange = () => {
      loadSavedListings();
    };
    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('savedLeadsUpdated', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('savedLeadsUpdated', handleStorageChange);
    };
  }, []);

  // Price alerts (saved-items: vehicles user signed up for price alerts)
  const [priceAlertVehicles, setPriceAlertVehicles] = useState<string[]>([]);
  const loadPriceAlertVehicles = () => setPriceAlertVehicles(getPriceAlertVehicles());
  useEffect(() => {
    loadPriceAlertVehicles();
    const onUpdate = () => loadPriceAlertVehicles();
    window.addEventListener('priceAlertsUpdated', onUpdate);
    return () => window.removeEventListener('priceAlertsUpdated', onUpdate);
  }, []);
  useEffect(() => {
    if (activeTab === 'saved-items') loadPriceAlertVehicles();
  }, [activeTab]);

  const [priceAlertsModalVehicle, setPriceAlertsModalVehicle] = useState<string | null>(null);

  // Onboarding data state
  const [localOnboardingData, setLocalOnboardingData] = useState<{
    name?: string;
    location?: string;
    interests?: string[];
    vehicles?: Array<{name: string, ownership: 'own' | 'want', rating?: number}>;
    newsletters?: string[];
    joinDate?: string;
  }>({});
  
  // Subscription state management
  const [newsletterSubscriptions, setNewsletterSubscriptions] = useState({
    'MotorTrend': true,
    'HOT ROD': true,
    'Events': true
  });
  
  const [magazineSubscriptions, setMagazineSubscriptions] = useState({
    'MotorTrend': true
    // 'Car and Driver': true // Hidden
  });
  
  // Load onboarding data from localStorage
  useEffect(() => {
    const data = localStorage.getItem('onboardingData');
    if (data) {
      try {
        const parsed = JSON.parse(data);
        
        // Auto-detect join date if not already set
        if (!parsed.joinDate) {
          const joinDate = getCurrentJoinDate();
          const updatedData = { ...parsed, joinDate };
          setLocalOnboardingData(updatedData);
          localStorage.setItem('onboardingData', JSON.stringify(updatedData));
        } else {
          setLocalOnboardingData(parsed);
        }
        
        // Update user settings with the latest data
        setUserSettings(prev => ({
          ...prev,
          fullName: parsed.name || userData?.name || 'Greg Smith'
        }));
        
        // Load saved banner if it exists
        if (parsed.banner) {
          setUserBanner(parsed.banner);
        }
      } catch (error) {
        console.error('Error parsing onboarding data:', error);
      }
    }
  }, [userData?.name]);

  // Listen for onboarding data updates (e.g., when vehicles are saved from VehicleDetails page)
  useEffect(() => {
    const handleOnboardingDataUpdate = () => {
      // Reload data from localStorage when event is triggered
      const data = localStorage.getItem('onboardingData');
      if (data) {
        try {
          const parsed = JSON.parse(data);
          // Always update to ensure latest data is reflected
          setLocalOnboardingData(prev => {
            // Only update if vehicles actually changed to avoid unnecessary re-renders
            const currentVehicles = JSON.stringify(prev.vehicles || []);
            const newVehicles = JSON.stringify(parsed.vehicles || []);
            if (currentVehicles !== newVehicles) {
              return parsed;
            }
            return prev;
          });
        } catch (error) {
          console.error('Error parsing onboarding data on update:', error);
        }
      }
    };

    // Listen for onboarding data updates
    window.addEventListener('onboardingDataUpdated', handleOnboardingDataUpdate);
    
    return () => {
      window.removeEventListener('onboardingDataUpdated', handleOnboardingDataUpdate);
    };
  }, []); // Only set up listener once on mount

  // Callback functions for ProfileCompletionCard
  const handleUpdateStep1 = (data: { name: string; location: string }) => {
    const updatedData = { ...localOnboardingData, ...data };
    setLocalOnboardingData(updatedData);
    localStorage.setItem('onboardingData', JSON.stringify(updatedData));
    // Update user settings with the new name
    setUserSettings(prev => ({
      ...prev,
      fullName: data.name
    }));
    // Dispatch custom event to notify other components
    window.dispatchEvent(new CustomEvent('onboardingDataUpdated'));
  };

  const handleUpdateStep2 = (data: { interests: string[] }) => {
    const updatedData = { ...localOnboardingData, interests: data.interests };
    setLocalOnboardingData(updatedData);
    localStorage.setItem('onboardingData', JSON.stringify(updatedData));
    // Dispatch custom event to notify other components
    window.dispatchEvent(new CustomEvent('onboardingDataUpdated'));
  };

  const handleUpdateStep3 = (data: { vehicleType: 'own' | 'want'; vehicle: string }) => {
    // Add the vehicle to the vehicles array (same format as handleVehicleSelect)
    const newVehicle = { name: data.vehicle, ownership: data.vehicleType };
    const existingVehicles = localOnboardingData.vehicles || [];
    
    // Check if vehicle already exists to avoid duplicates
    const vehicleExists = existingVehicles.some(v => v.name === data.vehicle);
    
    const updatedData = { 
      ...localOnboardingData, 
      vehicleType: data.vehicleType,
      vehicle: data.vehicle,
      vehicles: vehicleExists 
        ? existingVehicles.map(v => v.name === data.vehicle ? newVehicle : v)
        : [...existingVehicles, newVehicle]
    };
    setLocalOnboardingData(updatedData);
    localStorage.setItem('onboardingData', JSON.stringify(updatedData));
    // Dispatch event to notify other components
    window.dispatchEvent(new CustomEvent('onboardingDataUpdated'));
  };

  const handleUpdateStep4 = (data: { newsletters: string[] }) => {
    const updatedData = { ...localOnboardingData, newsletters: data.newsletters };
    setLocalOnboardingData(updatedData);
    localStorage.setItem('onboardingData', JSON.stringify(updatedData));
  };
  
  // Toast state
  const [showToast, setShowToast] = useState(false);
  const [pendingDelete, setPendingDelete] = useState<{ type: string; id: string } | null>(null);
  
  // Subscription toast state
  const [subscriptionToast, setSubscriptionToast] = useState<{ show: boolean; name: string; subscribed: boolean }>({
    show: false,
    name: '',
    subscribed: false
  });
  
  // Avatar/Banner Modal state
  const [showAvatarBannerModal, setShowAvatarBannerModal] = useState(false);
  const [userAvatar, setUserAvatar] = useState(userData?.avatar);
  const [userBanner, setUserBanner] = useState<string | undefined>(undefined);
  
  // Vehicle search state - tracks which section is showing search ('own' | 'want' | null)
  const [activeVehicleSearch, setActiveVehicleSearch] = useState<'own' | 'want' | null>(null);
  
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
  const [writeReviewModal, setWriteReviewModal] = useState<{isOpen: boolean, vehicleName: string, vehicleImage?: string}>({
    isOpen: false,
    vehicleName: '',
    vehicleImage: undefined
  });
  const [isReviewToastVisible, setIsReviewToastVisible] = useState(false);
  const [reviewedVehicleName, setReviewedVehicleName] = useState<string>('');
  const { getUserRating, setUserRating, clearRating, userRatings } = useRating();
  
  // Vehicle search handlers
  const handleAddVehicleClick = (ownership?: 'own' | 'want') => {
    // Default to 'own' if no ownership specified (from header button)
    setActiveVehicleSearch(ownership || 'own');
  };

  const handleCancelVehicleSearch = () => {
    setActiveVehicleSearch(null);
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
    const globalRating = getUserRating(vehicleName);
    setRatingModal({
      isOpen: true,
      vehicleName,
      currentRating: globalRating
    });
  };

  const handleRatingSubmit = (rating: number) => {
    setUserRating(ratingModal.vehicleName, rating);
    setRatingModal({ isOpen: false, vehicleName: '', currentRating: 0 });
  };

  const handleRateAndReview = (rating: number) => {
    // Submit the rating first
    setUserRating(ratingModal.vehicleName, rating);
    setRatingModal({ isOpen: false, vehicleName: '', currentRating: 0 });
    
    // Open write review modal
    setWriteReviewModal({
      isOpen: true,
      vehicleName: ratingModal.vehicleName,
      vehicleImage: vehicleImageFor(ratingModal.vehicleName)
    });
  };

  const handleSubmitReview = (review: ReviewData) => {
    // Get vehicle name from review object or modal state
    const reviewWithVehicleName = review as ReviewData & { _vehicleName?: string };
    const vehicleNameFromReview = reviewWithVehicleName._vehicleName;
    const vehicleName = vehicleNameFromReview || writeReviewModal.vehicleName;
    
    if (!vehicleName || vehicleName.trim() === '') {
      console.error('Profile: No vehicle name available when submitting review');
      return;
    }
    
    // Remove the _vehicleName property from review before processing
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { _vehicleName, ...cleanReview } = reviewWithVehicleName;
    
    // Convert File objects to preview URLs for display
    const reviewWithPreviews: ReviewData = {
      ...cleanReview,
      mediaPreviews: cleanReview.mediaFiles?.map((file: File) => URL.createObjectURL(file)) || []
    };
    
    // Save review to localStorage so it appears on the vehicle details page
    try {
      const savedReviewsKey = `vehicleReviews_${vehicleName}`;
      const existingReviewsJson = localStorage.getItem(savedReviewsKey);
      const existingReviews: ReviewData[] = existingReviewsJson ? JSON.parse(existingReviewsJson) : [];
      
      // Add the new review at the beginning
      const updatedReviews = [reviewWithPreviews, ...existingReviews];
      
      // Save to localStorage (convert File objects to strings for storage)
      // Note: File objects can't be serialized, so we only save the preview URLs
      const reviewsToSave = updatedReviews.map(review => ({
        ...review,
        mediaFiles: undefined, // Remove File objects as they can't be serialized
        mediaPreviews: review.mediaPreviews || [] // Keep preview URLs
      }));
      
      localStorage.setItem(savedReviewsKey, JSON.stringify(reviewsToSave));
      console.log('Profile: Saved review to localStorage for:', vehicleName);
    } catch (error) {
      console.error('Profile: Error saving review to localStorage:', error);
    }
    
    setWriteReviewModal({ isOpen: false, vehicleName: '', vehicleImage: undefined });
    
    // Show toast notification after a brief delay to ensure modal is closed
    setReviewedVehicleName(vehicleName);
    setTimeout(() => {
      setIsReviewToastVisible(true);
    }, 300);
  };

  const handleRatingModalClose = () => {
    setRatingModal({ isOpen: false, vehicleName: '', currentRating: 0 });
  };

  const handleClearRating = () => {
    clearRating(ratingModal.vehicleName);
    setRatingModal({ isOpen: false, vehicleName: '', currentRating: 0 });
  };

  // Subscription toggle handlers
  const handleNewsletterToggle = (name: string, isActive: boolean) => {
    const newSubscribedState = !isActive;
    setNewsletterSubscriptions(prev => ({
      ...prev,
      [name]: newSubscribedState
    }));
    // Show subscription toast
    setSubscriptionToast({ show: true, name, subscribed: newSubscribedState });
    // Auto-hide after 3 seconds
    setTimeout(() => {
      setSubscriptionToast(prev => ({ ...prev, show: false }));
    }, 3000);
  };

  const handleMagazineToggle = (name: string, isActive: boolean) => {
    const newSubscribedState = !isActive;
    setMagazineSubscriptions(prev => ({
      ...prev,
      [name]: newSubscribedState
    }));
    // Show subscription toast
    setSubscriptionToast({ show: true, name, subscribed: newSubscribedState });
    // Auto-hide after 3 seconds
    setTimeout(() => {
      setSubscriptionToast(prev => ({ ...prev, show: false }));
    }, 3000);
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
        setSavedArticles(prev => {
          const updated = prev.filter(a => a !== id);
          // Update localStorage
          try {
            localStorage.setItem('savedArticles', JSON.stringify(updated));
            const metadata = { ...savedArticlesMetadata };
            delete metadata[id];
            localStorage.setItem('savedArticlesMetadata', JSON.stringify(metadata));
            setSavedArticlesMetadata(metadata);
          } catch (error) {
            console.error('Error removing article from localStorage:', error);
          }
          return updated;
        });
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
    // Get fresh data from localStorage to avoid stale state issues
    const freshData = JSON.parse(localStorage.getItem('onboardingData') || '{}');
    const existingVehicles = freshData.vehicles || [];
    
    // Check if vehicle already exists to avoid duplicates
    const vehicleExists = existingVehicles.some((v: { name: string }) => v.name === vehicle.name);
    
    let updatedVehicles;
    if (vehicleExists) {
      // Update ownership if vehicle exists
      updatedVehicles = existingVehicles.map((v: { name: string }) => 
        v.name === vehicle.name ? vehicle : v
      );
    } else {
      // Add new vehicle
      updatedVehicles = [...existingVehicles, vehicle];
    }
    
    const updatedData = {
      ...freshData,
      vehicles: updatedVehicles
    };
    
    // Update both localStorage and state
    localStorage.setItem('onboardingData', JSON.stringify(updatedData));
    setLocalOnboardingData(updatedData);
    
    setActiveVehicleSearch(null); // Hide search after selection
    // Dispatch event to notify other components
    window.dispatchEvent(new CustomEvent('onboardingDataUpdated'));
  };

  // Categorize onboarding vehicles - memoized to ensure updates are reflected
  const vehiclesIOwn = useMemo(() => {
    return (localOnboardingData.vehicles || []).filter(vehicle => vehicle && vehicle.ownership === 'own');
  }, [localOnboardingData.vehicles]);
  
  const vehiclesIWant = useMemo(() => {
    return (localOnboardingData.vehicles || []).filter(vehicle => vehicle && vehicle.ownership === 'want');
  }, [localOnboardingData.vehicles]);
  
  // Get vehicles the user has reviewed (where rating > 0)
  const vehiclesIReviewed = useMemo(() => {
    return Object.entries(userRatings)
      .filter(([, rating]) => rating > 0)
      .map(([vehicleName, rating]) => ({
        name: vehicleName,
        rating: rating,
        image: vehicleImageFor(vehicleName),
        // Use API data as single source of truth for ratings
        staffRating: getVehicleByName(vehicleName)?.staffRating ?? generateStaffRating(vehicleName),
        communityRating: getVehicleByName(vehicleName)?.communityRating ?? generateCommunityRating(vehicleName)
      }));
  }, [userRatings]);

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

  return (
    <div className="profile-page">
      <ProfileBanner
        userName={userSettings.fullName}
        userAvatar={userAvatar}
        userBanner={userBanner}
        joinDate={localOnboardingData.joinDate || userData?.joinDate || '1/14/2024'}
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

                     {/* Profile Completion Card */}
                     <ProfileCompletionCard
                       onboardingData={localOnboardingData}
                       onUpdateStep1={handleUpdateStep1}
                       onUpdateStep2={handleUpdateStep2}
                       onUpdateStep3={handleUpdateStep3}
                       onUpdateStep4={handleUpdateStep4}
                     />

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

                   </>
                 )}

          {activeTab === 'saved-items' && (
            <>
              {/* Vehicles Section */}
              <div className="profile-section profile-section--vehicles">
                <div className="profile-section__content">
                  <div className="profile-section__header-row">
                    <h3 className="profile-section__heading">Vehicles</h3>
                  </div>
                  
                  {/* Cars I Want */}
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
                          onViewDetails={() => {
                            const { year, make, model } = parseVehicleName(vehicle.name);
                            navigate(`/vehicles/${year}/${make}/${model}`);
                          }}
                          onRate={() => handleRateVehicle(vehicle.name)}
                          userRating={getUserRating(vehicle.name)}
                          priceAlertOn={hasPriceAlert(vehicle.name)}
                          onPriceAlertClick={() => {
                            setPriceAlertsModalVehicle(vehicle.name);
                          }}
                        />
                      ))}
                      <EmptyVehicleSection 
                        type="want" 
                        onClick={() => handleAddVehicleClick('want')}
                      />
                    </div>
                    {/* Vehicle Search - appears inline under Cars I Want when active */}
                    {activeVehicleSearch === 'want' && (
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
                          placeholder="Start typing to search"
                          className="profile-vehicle-search__input"
                          defaultOwnership="want"
                          autoFocus={true}
                        />
                      </div>
                    )}
                  </div>

                  {/* Divider - always show between sections */}
                  <div className="profile-section-divider"></div>

                  {/* Cars I Own */}
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
                          onViewDetails={() => {
                            const { year, make, model } = parseVehicleName(vehicle.name);
                            navigate(`/vehicles/${year}/${make}/${model}`);
                          }}
                          onRate={() => handleRateVehicle(vehicle.name)}
                          userRating={getUserRating(vehicle.name)}
                          priceAlertOn={hasPriceAlert(vehicle.name)}
                          onPriceAlertClick={() => {
                            setPriceAlertsModalVehicle(vehicle.name);
                          }}
                        />
                      ))}
                      <EmptyVehicleSection 
                        type="own" 
                        onClick={() => handleAddVehicleClick('own')}
                      />
                    </div>
                    {/* Vehicle Search - appears inline under Cars I Own when active */}
                    {activeVehicleSearch === 'own' && (
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
                          placeholder="Start typing to search"
                          className="profile-vehicle-search__input"
                          defaultOwnership="own"
                          autoFocus={true}
                        />
                      </div>
                    )}
                  </div>

                  {/* Divider - show between sections */}
                  <div className="profile-section-divider"></div>
                  
                  {/* Your Listings */}
                  <div className="profile-vehicles-subsection">
                    <h4 className="profile-subsection__title">Your Listings</h4>
                    <div className="profile-listings-grid">
                      {savedListings.length === 0 ? (
                        <div className="profile-empty-state">
                          <Icon name="bookmark_border" size={48} />
                          <p>No saved listings yet</p>
                          <p className="profile-empty-state__subtitle">Save listings from vehicle detail pages to see them here</p>
                        </div>
                      ) : (
                        savedListings.map((savedLead) => {
                          const { listing, vehicleName } = savedLead;
                          const listingImage = listing.photoUrls && listing.photoUrls.length > 0 
                            ? listing.photoUrls[0] 
                            : listing.imageUrl;
                          
                          const formatPrice = (price: number): string => {
                            return `$${price.toLocaleString()}`;
                          };

                          const formatMileage = (mileage: number): string => {
                            if (mileage === 0) return 'New';
                            return `${mileage.toLocaleString()} mi`;
                          };

                          return (
                            <div 
                              key={listing.id} 
                              className="profile-listing-card"
                              onClick={() => {
                                const { year, make, model } = parseVehicleName(vehicleName);
                                navigate(`/vehicles/${year}/${make}/${model}`);
                              }}
                            >
                              <div className="profile-listing-card__image">
                                <img src={listingImage} alt={`${listing.year} ${vehicleName}`} />
                                <button
                                  className="profile-listing-card__unsave"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    unsaveLead(listing.id);
                                    setSavedListings(prev => prev.filter(l => l.id !== listing.id));
                                  }}
                                  aria-label="Remove listing"
                                >
                                  <Icon name="close" size={20} />
                                </button>
                              </div>
                              <div className="profile-listing-card__content">
                                <div className="profile-listing-card__header">
                                  <h4 className="profile-listing-card__title">
                                    {listing.year} {vehicleName}{listing.trim ? ` ${listing.trim}` : ''}
                                  </h4>
                                  <span className="profile-listing-card__condition">{listing.condition}</span>
                                </div>
                                <div className="profile-listing-card__price">{formatPrice(listing.price)}</div>
                                <div className="profile-listing-card__details">
                                  <div className="profile-listing-card__detail">
                                    <Icon name="speed" size={16} />
                                    <span>{formatMileage(listing.mileage)}</span>
                                  </div>
                                  <div className="profile-listing-card__detail">
                                    <Icon name="store" size={16} />
                                    <span>{listing.dealerName}</span>
                                  </div>
                                  <div className="profile-listing-card__detail">
                                    <Icon name="location_on" size={16} />
                                    <span>{listing.location} • {listing.distance} mi away</span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          );
                        })
                      )}
                    </div>
                  </div>

                  <div className="profile-section-divider"></div>
                  <div className="profile-vehicles-subsection">
                    <h4 className="profile-subsection__title">Price Alerts</h4>
                    {priceAlertVehicles.length === 0 ? (
                      <div className="profile-empty-state">
                        <Icon name="notifications" size={48} style={{ color: 'var(--color-neutrals-5)' }} />
                        <p>No price alerts yet</p>
                        <p className="profile-empty-state__subtitle">On a vehicle page, click Price Alerts to get notified when prices or incentives change.</p>
                      </div>
                    ) : (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        {priceAlertVehicles.map((name) => (
                          <div
                            key={name}
                            onClick={() => {
                              const { year, make, model } = parseVehicleName(name);
                              navigate(`/vehicles/${year}/${make}/${model}`);
                            }}
                            style={{
                              display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px',
                              background: 'var(--color-neutrals-8, #FCFCFD)', border: '1px solid var(--color-neutrals-6, #E6E8EC)',
                              borderRadius: 'var(--border-radius-md, 8px)', cursor: 'pointer', transition: 'all 150ms ease',
                            }}
                          >
                            <div style={{ width: '56px', height: '42px', borderRadius: 'var(--border-radius-sm)', overflow: 'hidden', flexShrink: 0 }}>
                              <img src={vehicleImageFor(name)} alt={name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            </div>
                            <span style={{ flex: 1, fontFamily: 'var(--font-body, Geist, sans-serif)', fontWeight: 600, fontSize: '14px', color: 'var(--color-neutrals-1)' }}>{name}</span>
                            <span style={{ fontFamily: 'var(--font-body, Geist, sans-serif)', fontSize: '12px', color: 'var(--color-neutrals-4)' }}>Alerts on</span>
                            <button
                              type="button"
                              onClick={(e) => { e.stopPropagation(); removePriceAlert(name); loadPriceAlertVehicles(); }}
                              aria-label={`Remove price alert for ${name}`}
                              style={{ padding: '8px', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-neutrals-4)' }}
                            >
                              <Icon name="close" size={20} />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* My Events Section */}
              <div className="profile-section profile-section--events">
                <div className="profile-section__content">
                  <div className="profile-section__header-row">
                    <h3 className="profile-section__heading">
                      <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Icon name="event" size={20} />
                        My Events
                      </span>
                    </h3>
                    <a
                      href="/events"
                      onClick={(e) => { e.preventDefault(); navigate('/events'); }}
                      style={{
                        display: 'inline-flex', alignItems: 'center', gap: '4px',
                        fontFamily: 'var(--font-body, Geist, sans-serif)', fontSize: '13px', fontWeight: 600,
                        color: 'var(--color-primary-1, #E90C17)', textDecoration: 'none', cursor: 'pointer',
                      }}
                    >
                      Browse events
                      <Icon name="arrow_forward" size={14} />
                    </a>
                  </div>
                  {savedEventsList.length === 0 ? (
                    <p className="profile-section__empty">No saved events. Save events from the <button type="button" onClick={() => navigate('/events')} style={{ background: 'none', border: 'none', color: 'var(--color-primary-1)', fontWeight: 600, cursor: 'pointer', padding: 0, textDecoration: 'underline' }}>Events</button> page to get reminders.</p>
                  ) : (
                    <div className="profile-events-list" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                      {savedEventsList.map((ev) => (
                        <div
                          key={ev.eventId}
                          onClick={() => navigate(`/events/${ev.slug}`)}
                          style={{
                            display: 'flex', alignItems: 'center', gap: '16px', padding: '12px',
                            background: 'var(--color-neutrals-8, #FCFCFD)', border: '1px solid var(--color-neutrals-6, #E6E8EC)',
                            borderRadius: 'var(--border-radius-md, 8px)', cursor: 'pointer', transition: 'all 150ms ease',
                          }}
                        >
                          <div style={{ width: '80px', height: '56px', borderRadius: 'var(--border-radius-sm, 4px)', overflow: 'hidden', flexShrink: 0 }}>
                            <img src={ev.heroImage} alt={ev.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                          </div>
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ fontFamily: 'var(--font-heading, Poppins, sans-serif)', fontWeight: 600, fontSize: '14px', color: 'var(--color-neutrals-1)', marginBottom: '2px' }}>{ev.title}</div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontFamily: 'var(--font-body, Geist, sans-serif)', fontSize: '12px', color: 'var(--color-neutrals-4)' }}>
                              <span><Icon name="calendar_today" size={12} /> {ev.dates.displayText}</span>
                              <span><Icon name="location_on" size={12} /> {ev.locationPrimary}</span>
                            </div>
                          </div>
                          <select
                            value={ev.reminder}
                            onChange={(e) => { e.stopPropagation(); setEventReminder(ev.eventId, e.target.value as EventReminder); loadSavedEvents(); }}
                            onClick={(e) => e.stopPropagation()}
                            style={{
                              padding: '6px 10px', fontFamily: 'var(--font-body, Geist, sans-serif)', fontSize: '12px',
                              color: 'var(--color-neutrals-1, #141416)', backgroundColor: 'var(--color-white, #FFFFFF)',
                              border: '1px solid var(--color-neutrals-6)', borderRadius: 'var(--border-radius-sm)',
                            }}
                          >
                            <option value="none">{getReminderLabel('none')}</option>
                            <option value="1day">{getReminderLabel('1day')}</option>
                            <option value="1week">{getReminderLabel('1week')}</option>
                          </select>
                          <button
                            type="button"
                            onClick={(e) => { e.stopPropagation(); unsaveEvent(ev.eventId); loadSavedEvents(); }}
                            aria-label="Remove from saved events"
                            style={{
                              padding: '8px', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-neutrals-4)',
                            }}
                          >
                            <Icon name="bookmark" size={20} style={{ color: 'var(--color-primary-1)' }} />
                          </button>
                        </div>
                      ))}
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
                    {savedArticles.length === 0 ? (
                      <p className="profile-section__empty">No saved articles yet.</p>
                    ) : (
                      savedArticles.map((slug) => {
                        const articleData = savedArticlesMetadata[slug];
                        if (!articleData) return null;
                        
                        return (
                          <ArticleCard
                            key={slug}
                            title={articleData.title}
                            author={articleData.author}
                            date={articleData.date}
                            imageUrl={articleData.imageUrl}
                            onReadArticle={() => navigate(`/articles/${slug}`)}
                            isBookmarked={true}
                            onBookmark={() => handleBookmarkClick('article', slug)}
                          />
                        );
                      })
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

              {/* Q&A Activity Section */}
              {qaActivity.length > 0 && (
                <div className="profile-section profile-section--qa">
                  <div className="profile-section__content">
                    <div className="profile-section__header-row">
                      <h3 className="profile-section__heading">
                        <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <Icon name="auto_awesome" size={20} />
                          My Q&A Activity
                        </span>
                      </h3>
                    </div>
                    
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                      {qaActivity.map((activity, index) => (
                        <div
                          key={`${activity.questionId}-${activity.type}-${index}`}
                          onClick={() => navigate(`/articles/${activity.articleSlug}`)}
                          style={{
                            display: 'flex',
                            gap: '16px',
                            padding: '16px',
                            backgroundColor: 'var(--color-white, #FFFFFF)',
                            border: '1px solid var(--color-neutrals-6, #E6E8EC)',
                            borderRadius: 'var(--border-radius-md, 8px)',
                            cursor: 'pointer',
                            transition: 'all 150ms ease',
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.borderColor = 'var(--color-neutrals-4, #6E7481)';
                            e.currentTarget.style.transform = 'translateY(-1px)';
                            e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.08)';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.borderColor = 'var(--color-neutrals-6, #E6E8EC)';
                            e.currentTarget.style.transform = 'translateY(0)';
                            e.currentTarget.style.boxShadow = 'none';
                          }}
                        >
                          {/* Type Icon */}
                          <div style={{
                            width: '36px',
                            height: '36px',
                            borderRadius: '50%',
                            background: activity.type === 'asked' 
                              ? '#33C4FF' 
                              : 'var(--color-primary-1, #E90C17)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexShrink: 0,
                            color: 'white',
                          }}>
                            <Icon name={activity.type === 'asked' ? 'help' : 'thumb_up'} size={18} />
                          </div>

                          {/* Content */}
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '8px',
                              marginBottom: '4px',
                            }}>
                              <span style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '4px',
                                padding: '2px 8px',
                                background: activity.type === 'asked' 
                                  ? 'rgba(51, 196, 255, 0.1)' 
                                  : 'rgba(233, 12, 23, 0.08)',
                                color: activity.type === 'asked' ? '#33C4FF' : '#E90C17',
                                borderRadius: '4px',
                                fontSize: '11px',
                                fontWeight: 600,
                                textTransform: 'uppercase',
                                letterSpacing: '0.5px',
                              }}>
                                {activity.type === 'asked' ? 'Asked' : 'Liked'}
                              </span>
                              <span style={{
                                fontSize: '12px',
                                color: 'var(--color-neutrals-4, #6E7481)',
                                fontFamily: 'var(--font-body, Geist, sans-serif)',
                              }}>
                                {activity.date}
                              </span>
                            </div>
                            <p style={{
                              fontFamily: 'var(--font-heading, Poppins, sans-serif)',
                              fontWeight: 600,
                              fontSize: '15px',
                              lineHeight: 1.4,
                              color: 'var(--color-neutrals-1, #141416)',
                              margin: '0 0 4px 0',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap',
                            }}>
                              {activity.questionText}
                            </p>
                            <p style={{
                              fontFamily: 'var(--font-body, Geist, sans-serif)',
                              fontSize: '13px',
                              color: 'var(--color-neutrals-4, #6E7481)',
                              margin: 0,
                              display: 'flex',
                              alignItems: 'center',
                              gap: '4px',
                            }}>
                              <Icon name="article" size={14} />
                              {activity.articleTitle}
                            </p>
                          </div>

                          {/* Arrow */}
                          <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            color: 'var(--color-neutrals-5, #B1B5C3)',
                          }}>
                            <Icon name="chevron_right" size={20} />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Cars I Rated or Reviewed Section */}
              {vehiclesIReviewed.length > 0 && (
                <div className="profile-section profile-section--vehicles">
                  <div className="profile-section__content">
                    <div className="profile-section__header-row">
                      <h3 className="profile-section__heading">Cars I Rated or Reviewed</h3>
                    </div>
                    
                    <div className="profile-vehicles-grid">
                      {vehiclesIReviewed.map((vehicle, index) => (
                        <VehicleCard
                          key={`reviewed-${index}`}
                          image={vehicle.image}
                          name={vehicle.name}
                          type="Vehicle"
                          rating1={vehicle.staffRating}
                          rating2={vehicle.communityRating}
                          hasMultipleRatings={true}
                          isBookmarked={false}
                          onViewDetails={() => {
                            const { year, make, model } = parseVehicleName(vehicle.name);
                            navigate(`/vehicles/${year}/${make}/${model}`);
                          }}
                          onRate={() => handleRateVehicle(vehicle.name)}
                          userRating={vehicle.rating}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              )}
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
                      name="Events"
                      logo="https://d2kde5ohu8qb21.cloudfront.net/files/69040ce5e09a72000286cf1d/event.png"
                      isActive={newsletterSubscriptions['Events']}
                      onToggleSubscription={handleNewsletterToggle}
                    />
                    {/* Find More option hidden */}
                   {/* <SubscriptionItem
                      name="Find More"
                      isFindMore={true}
                      onClick={() => console.log('Find more newsletters')}
                    /> */}
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
                      href="https://secure.motortrend.com/"
                    />
                    {/* Car and Driver magazine hidden */}
                    {/* <SubscriptionItem
                      name="Car and Driver"
                      logo="https://d2kde5ohu8qb21.cloudfront.net/files/68f64d793a12db0002cab19d/caranddrivermagazine.png"
                      isActive={magazineSubscriptions['Car and Driver']}
                      onToggleSubscription={handleMagazineToggle}
                    /> */}
                    {/* Find More option hidden */}
                    {/* <SubscriptionItem
                      name="Find More"
                      isFindMore={true}
                      onClick={() => console.log('Find more magazines')}
                    /> */}
                  </div>
                </div>
              </div>
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

      {/* Subscription Toast Notification */}
      {subscriptionToast.show && (
        <div
          style={{
            position: 'fixed',
            bottom: 'var(--spacing-4, 32px)',
            left: '50%',
            transform: 'translateX(-50%)',
            backgroundColor: subscriptionToast.subscribed ? 'var(--color-primary-1, #E90C17)' : 'var(--color-neutrals-2, #23262F)',
            color: 'var(--color-white, #FFFFFF)',
            padding: 'var(--spacing-2, 16px) var(--spacing-4, 32px)',
            borderRadius: 'var(--border-radius-md, 8px)',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.2)',
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--spacing-2, 16px)',
            zIndex: 9999,
            animation: 'fadeInUp 300ms ease-out',
            fontFamily: 'var(--font-heading, Poppins, sans-serif)',
            fontWeight: 600,
            fontSize: '14px',
          }}
        >
          <Icon 
            name={subscriptionToast.subscribed ? 'check_circle' : 'remove_circle'} 
            size={20} 
          />
          {subscriptionToast.subscribed 
            ? `Subscribed to ${subscriptionToast.name}!` 
            : `Unsubscribed from ${subscriptionToast.name}`
          }
        </div>
      )}

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
        onRateAndReview={handleRateAndReview}
        onClear={handleClearRating}
      />

      {/* Write Review Modal */}
      <WriteReviewModal
        isOpen={writeReviewModal.isOpen}
        onClose={() => setWriteReviewModal({ isOpen: false, vehicleName: '', vehicleImage: undefined })}
        vehicleName={writeReviewModal.vehicleName}
        vehicleImage={writeReviewModal.vehicleImage}
        onSubmit={handleSubmitReview}
      />

      {/* Price Alerts Modal (from garage cards) */}
      <PriceAlertsModal
        isOpen={priceAlertsModalVehicle !== null}
        onClose={() => setPriceAlertsModalVehicle(null)}
        vehicleName={priceAlertsModalVehicle ?? undefined}
        onSignedUp={() => loadPriceAlertVehicles()}
      />

      {/* Review Submitted Modal */}
      <ReviewSubmittedToast
        isVisible={isReviewToastVisible}
        onClose={() => {
          setIsReviewToastVisible(false);
          setReviewedVehicleName('');
        }}
        onViewReview={() => {
          if (reviewedVehicleName) {
            const { year, make, model } = parseVehicleName(reviewedVehicleName);
            setIsReviewToastVisible(false);
            setReviewedVehicleName('');
            navigate(`/vehicles/${encodeURIComponent(year)}/${encodeURIComponent(make)}/${encodeURIComponent(model)}`);
          }
        }}
        vehicleName={reviewedVehicleName}
      />
    </div>
  );
};

export default Profile;

