/**
 * Vehicle Details Page
 * Year-Make-Model detail page based on Figma design
 */

import React, { useState, useRef, useEffect, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import Icon from '../../components/Icon';
import { UserReviews } from '../../components/UserReviews';
import { AIInsights } from '../../components/AIInsights';
import WriteReviewModal from '../../components/WriteReviewModal';
import ReviewSubmittedToast from '../../components/ReviewSubmittedToast';
import SavedModal from '../../components/SavedModal';
import { vehicleImageFor } from '../../utils/vehicleImages';
import { generateStaffRating, generateCommunityRating } from '../../utils/vehicleRatings';
import { generateVehicleReview } from '../../utils/vehicleReviews';
import { generateUserReviews } from '../../utils/vehicleUserReviews';
import RatingModal from '../../components/RatingModal';
import { useRating } from '../../contexts/RatingContext';
import { type ReviewData } from '../../components/UserReviews';
import { RatingDistributionTooltip, type RatingDistributionData } from '../../components/RatingDistributionTooltip';
import { StaffRatingTooltip } from '../../components/StaffRatingTooltip';
import { fetchVehicleListings, type VehicleListing } from '../../utils/vehicleListings';
import { articles } from '../../utils/articles';
import './VehicleDetails.css';

export const VehicleDetails: React.FC = () => {
  const { year, make, model } = useParams<{ year: string; make: string; model: string }>();
  const decodedYear = decodeURIComponent(year || '2025');
  const decodedMake = decodeURIComponent(make || 'BMW');
  const decodedModel = decodeURIComponent(model || '3-Series');
  const [selectedYear, setSelectedYear] = useState<string>(decodedYear);
  const [isSaved, setIsSaved] = useState(false);
  const [isRatingModalOpen, setIsRatingModalOpen] = useState(false);
  const [isWriteReviewModalOpen, setIsWriteReviewModalOpen] = useState(false);
  const [isToastVisible, setIsToastVisible] = useState(false);
  const [isSavedModalOpen, setIsSavedModalOpen] = useState(false);
  const [reviewModalRating, setReviewModalRating] = useState<number | undefined>(undefined);
  const [isTooltipVisible, setIsTooltipVisible] = useState(false);
  const [isStaffTooltipVisible, setIsStaffTooltipVisible] = useState(false);
  const [isReviewAccordionOpen, setIsReviewAccordionOpen] = useState(false);
  const communityRatingRef = useRef<HTMLDivElement>(null);
  const staffRatingRef = useRef<HTMLDivElement>(null);
  const hideTooltipTimeout = useRef<number | null>(null);
  const hideStaffTooltipTimeout = useRef<number | null>(null);
  const ratingsBarRef = useRef<HTMLDivElement>(null);
  const [isStickyBarVisible, setIsStickyBarVisible] = useState(false);
  const [communityRatingCount, setCommunityRatingCount] = useState(252);
  const [listings, setListings] = useState<VehicleListing[]>([]);
  const [isLoadingListings, setIsLoadingListings] = useState(true);
  
  // Parse vehicle name from URL params
  // Normalize: replace dashes with spaces in model to ensure consistent format
  // This ensures "Ioniq-6-N" becomes "Ioniq 6 N" to match Article page format
  const vehicleName = `${decodedYear} ${decodedMake} ${decodedModel.replace(/-/g, ' ')}`;
  
  const getInitialReviews = (): ReviewData[] => {
    // First, load any user-submitted reviews from localStorage
    try {
      const savedReviewsKey = `vehicleReviews_${vehicleName}`;
      const savedReviewsJson = localStorage.getItem(savedReviewsKey);
      if (savedReviewsJson) {
        const savedReviews: ReviewData[] = JSON.parse(savedReviewsJson);
        if (savedReviews && savedReviews.length > 0) {
          console.log('VehicleDetails: Loaded', savedReviews.length, 'saved reviews for', vehicleName);
          // Combine saved reviews with generated reviews, but ensure no duplicates by ID
          const generatedReviews = generateUserReviews(vehicleName);
          const generatedIds = new Set(generatedReviews.map(r => r.id));
          const uniqueGeneratedReviews = generatedReviews;
          const uniqueSavedReviews = savedReviews.filter(r => !generatedIds.has(r.id));
          return [...uniqueSavedReviews, ...uniqueGeneratedReviews];
        }
      }
    } catch (error) {
      console.error('VehicleDetails: Error loading saved reviews from localStorage:', error);
    }
    
    // Generate reviews for all vehicles using the utility function
    return generateUserReviews(vehicleName);
    
    // Keep the original hardcoded reviews for reference (commented out)
    /*
    if (is2021SubaruWRX) {
      return [
        {
          id: 'wrx-1',
          reviewerName: 'Mike Chen',
          rating: 8.5,
          title: 'Excellent daily driver with rally heritage',
          content: 'The 2021 WRX is the perfect balance between practicality and performance. I\'ve owned mine for 3 years now and it\'s been incredibly reliable. The AWD system is fantastic in winter conditions, and the turbo engine provides plenty of power when you need it. The manual transmission is engaging and makes every drive enjoyable.',
          vehicleType: 'sedan',
          vehicleModel: 'Premium',
          date: 'April 15, 2024',
          mediaPreviews: [],
          thumbsUpCount: 24,
          categoryRatings: {
            comfort: 7.5,
            reliability: 9,
            interior: 7,
            value: 8.5,
            safety: 9
          },
          verificationLevel: 'verified_documents' as const,
          vehicleRelationship: 'own' as const,
          experienceDuration: '3 years'
        },
        {
          id: 'wrx-2',
          reviewerName: 'Jessica Martinez',
          rating: 7.8,
          title: 'Fun car but requires premium fuel',
          content: 'I love my WRX for its sporty character and all-wheel drive capability. The handling is sharp and it corners with confidence. My main complaint is the fuel economy - it requires premium gas and I average about 22 mpg in mixed driving. The interior materials could be better for the price, but overall it\'s a great enthusiast car.',
          vehicleType: 'sedan',
          vehicleModel: 'Base',
          date: 'March 22, 2024',
          mediaPreviews: [],
          thumbsUpCount: 18,
          categoryRatings: {
            comfort: 6.5,
            reliability: 8,
            interior: 6.5,
            value: 7.5,
            safety: 8.5
          },
          verificationLevel: 'verified' as const,
          vehicleRelationship: 'own' as const,
          experienceDuration: '2 years'
        },
        {
          id: 'wrx-3',
          reviewerName: 'David Thompson',
          rating: 9.2,
          title: 'Best bang for your buck in the segment',
          content: 'After test driving several competitors, I chose the WRX and haven\'t looked back. The standard AWD, turbo power, and manual transmission at this price point is unbeatable. The EyeSight safety system is comprehensive and the infotainment works well with Apple CarPlay. For a performance sedan, it offers incredible value.',
          vehicleType: 'sedan',
          vehicleModel: 'Limited',
          date: 'May 10, 2024',
          mediaPreviews: [],
          thumbsUpCount: 31,
          categoryRatings: {
            comfort: 8,
            reliability: 9,
            interior: 8,
            value: 9.5,
            safety: 9.5
          },
          verificationLevel: 'verified_documents' as const,
          vehicleRelationship: 'own' as const,
          experienceDuration: '1 year'
        },
        {
          id: 'wrx-4',
          reviewerName: 'Alex Rodriguez',
          rating: 7.5,
          title: 'Solid performer with some compromises',
          content: 'The WRX is fun to drive and handles great, but there are some trade-offs. The ride is firm and can be harsh on rough roads. Road noise is noticeable at highway speeds. However, the driving experience makes up for these shortcomings. The turbo lag is minimal and power delivery is smooth once you\'re in boost.',
          vehicleType: 'sedan',
          vehicleModel: 'Premium',
          date: 'February 8, 2024',
          mediaPreviews: [],
          thumbsUpCount: 12,
          categoryRatings: {
            comfort: 6,
            reliability: 8.5,
            interior: 7,
            value: 8,
            safety: 8
          },
          verificationLevel: 'verified' as const,
          vehicleRelationship: 'own' as const,
          experienceDuration: '2.5 years'
        },
        {
          id: 'wrx-5',
          reviewerName: 'Emily Watson',
          rating: 8.8,
          title: 'Perfect for Canadian winters',
          content: 'Living in Toronto, the WRX\'s AWD system is a game-changer. It handles snow and ice conditions brilliantly, giving me confidence in harsh weather. The car is also surprisingly practical with good trunk space and comfortable seating for four. The tech features like adaptive cruise control work well on long highway drives.',
          vehicleType: 'sedan',
          vehicleModel: 'Limited',
          date: 'January 28, 2024',
          mediaPreviews: [],
          thumbsUpCount: 19,
          categoryRatings: {
            comfort: 8,
            reliability: 9,
            interior: 8,
            value: 8.5,
            safety: 9
          },
          verificationLevel: 'verified_documents' as const,
          vehicleRelationship: 'own' as const,
          experienceDuration: '1.5 years'
        },
        {
          id: 'wrx-6',
          reviewerName: 'Ryan Kim',
          rating: 7.2,
          title: 'Great car, but interior feels dated',
          content: 'Performance-wise, the WRX delivers. The engine is responsive, handling is precise, and it feels planted in corners. My main gripe is the interior - it feels a generation behind competitors. The infotainment screen is small and the materials throughout feel cheap for a $30k+ car. Still, it\'s the driving dynamics that matter most.',
          vehicleType: 'sedan',
          vehicleModel: 'Base',
          date: 'December 14, 2023',
          mediaPreviews: [],
          thumbsUpCount: 15,
          categoryRatings: {
            comfort: 6.5,
            reliability: 8,
            interior: 5.5,
            value: 7.5,
            safety: 8
          },
          verificationLevel: 'verified' as const,
          vehicleRelationship: 'previously_owned' as const,
          experienceDuration: '3 years'
        },
        {
          id: 'wrx-7',
          reviewerName: 'Sarah Johnson',
          rating: 8.5,
          title: 'Modding community is amazing',
          content: 'I bought my WRX to modify it and I haven\'t been disappointed. The aftermarket support is extensive and the platform responds well to basic bolt-ons. I\'ve added an intake, exhaust, and tune, and the car feels significantly more responsive. Stock form is great, but there\'s huge potential for enthusiasts.',
          vehicleType: 'sedan',
          vehicleModel: 'Premium',
          date: 'November 20, 2023',
          mediaPreviews: [],
          thumbsUpCount: 28,
          categoryRatings: {
            comfort: 7,
            reliability: 8,
            interior: 7,
            value: 8.5,
            safety: 8
          },
          verificationLevel: 'verified' as const,
          vehicleRelationship: 'own' as const,
          experienceDuration: '4 years'
        },
        {
          id: 'wrx-8',
          reviewerName: 'Chris Anderson',
          rating: 9.0,
          title: 'Exceeds expectations in every way',
          content: 'This is my second WRX and it continues to impress. The 2021 model improves on the previous generation with better tech integration and refined driving dynamics. The CVT option is surprisingly good for those who don\'t want manual - it\'s not as engaging but still fun. Resale value is excellent too.',
          vehicleType: 'sedan',
          vehicleModel: 'Limited',
          date: 'October 5, 2023',
          mediaPreviews: [],
          thumbsUpCount: 22,
          categoryRatings: {
            comfort: 8,
            reliability: 9.5,
            interior: 8,
            value: 9,
            safety: 9
          },
          verificationLevel: 'verified_documents' as const,
          vehicleRelationship: 'own' as const,
          experienceDuration: '2 years'
        },
        {
          id: 'wrx-9',
          reviewerName: 'Lisa Park',
          rating: 7.8,
          title: 'Good car, but consider your needs',
          content: 'The WRX is a blast to drive, especially on winding roads. The manual shifter has a nice mechanical feel and the clutch engagement is easy to master. However, if you spend a lot of time in traffic, the firm ride and engine drone can get tiresome. This is definitely a driver\'s car, not a luxury cruiser.',
          vehicleType: 'sedan',
          vehicleModel: 'Base',
          date: 'September 18, 2023',
          mediaPreviews: [],
          thumbsUpCount: 14,
          categoryRatings: {
            comfort: 6,
            reliability: 8,
            interior: 7,
            value: 8,
            safety: 8.5
          },
          verificationLevel: 'verified' as const,
          vehicleRelationship: 'own' as const,
          experienceDuration: '1 year'
        },
        {
          id: 'wrx-10',
          reviewerName: 'James Wilson',
          rating: 8.2,
          title: 'Reliable and fun, no major issues',
          content: 'I\'ve put 45,000 miles on my WRX with zero problems. Regular maintenance is key - I change the oil every 5,000 miles with synthetic. The AWD has saved me multiple times in unexpected snow storms. The turbo still feels strong and the car handles like it did when new. Subaru quality is real.',
          vehicleType: 'sedan',
          vehicleModel: 'Premium',
          date: 'August 12, 2023',
          mediaPreviews: [],
          thumbsUpCount: 26,
          categoryRatings: {
            comfort: 7.5,
            reliability: 9.5,
            interior: 7.5,
            value: 8.5,
            safety: 9
          },
          verificationLevel: 'verified_documents' as const,
          vehicleRelationship: 'own' as const,
          experienceDuration: '3 years'
        },
        {
          id: 'wrx-11',
          reviewerName: 'Maria Garcia',
          rating: 8.0,
          title: 'Practical sports car for families',
          content: 'As a parent who loves driving, the WRX is perfect. It has four doors, decent back seat space for kids, and a usable trunk. Yet it still delivers that sporty driving experience when I\'m alone. The safety ratings and AWD give me peace of mind in all weather conditions. Best of both worlds.',
          vehicleType: 'sedan',
          vehicleModel: 'Limited',
          date: 'July 25, 2023',
          mediaPreviews: [],
          thumbsUpCount: 20,
          categoryRatings: {
            comfort: 7.5,
            reliability: 8.5,
            interior: 7.5,
            value: 8,
            safety: 9.5
          },
          verificationLevel: 'verified' as const,
          vehicleRelationship: 'own' as const,
          experienceDuration: '2 years'
        },
        {
          id: 'wrx-12',
          reviewerName: 'Tom Brown',
          rating: 7.5,
          title: 'Great value but fuel costs add up',
          content: 'The WRX offers incredible performance for the money. Standard AWD and turbo power at this price is hard to find elsewhere. My only real complaint is fuel economy - I drive mostly city and average 19 mpg. With premium gas prices, it adds up. Still, the driving experience is worth the trade-off.',
          vehicleType: 'sedan',
          vehicleModel: 'Base',
          date: 'June 30, 2023',
          mediaPreviews: [],
          thumbsUpCount: 16,
          categoryRatings: {
            comfort: 6.5,
            reliability: 8,
            interior: 6.5,
            value: 8,
            safety: 8
          },
          verificationLevel: 'verified' as const,
          vehicleRelationship: 'own' as const,
          experienceDuration: '1.5 years'
        }
      ];
    }
    
    // Default reviews for other vehicles
    return [
      {
        id: '1',
        reviewerName: 'John Smith',
        rating: 9,
        title: 'Edgy design makes this the most head-turning Elantra yet',
        content: 'Edgy design makes this the most head-turning Elantra yet. But it\'s more than just stylish—the Elantra is comfortable and offers many features. Value is high, and the hardcore Elantra N is a riot.',
        vehicleType: 'sedan',
        vehicleModel: 'base',
        date: 'May 20, 2025',
        mediaPreviews: [],
        thumbsUpCount: 9,
        categoryRatings: {
          comfort: 9,
          reliability: 9,
          interior: 9,
          value: 9,
          safety: 9
        },
        verificationLevel: 'verified_documents' as const,
        vehicleRelationship: 'own' as const,
        experienceDuration: '2 years'
      },
      {
        id: '2',
        reviewerName: 'Sarah Johnson',
        rating: 8,
        title: 'Great value and features',
        content: 'Edgy design makes this the most head-turning Elantra yet. But it\'s more than just stylish—the Elantra is comfortable and offers many features. Value is high, and the hardcore Elantra N is a riot.',
        vehicleType: 'sedan',
        vehicleModel: 'sport',
        date: 'May 18, 2025',
        mediaPreviews: [],
        thumbsUpCount: 3
      }
    ];
    */
  };
  
  const [reviews, setReviews] = useState<ReviewData[]>(getInitialReviews());
  const { getUserRating, setUserRating, clearRating } = useRating();
  const userRating = getUserRating(vehicleName);

  // Check if user owns the car (from "Cars I Own" list)
  const ownsCar = useMemo(() => {
    // Only show icon if user has a rating
    if (userRating === 0) {
      return false;
    }
    
    try {
      // Check if vehicle is in "Cars I Own" list
      const onboardingData = localStorage.getItem('onboardingData');
      if (!onboardingData || onboardingData === '{}' || onboardingData.trim() === '') {
        return false;
      }
      
      const data = JSON.parse(onboardingData);
      
      // Verify data structure is valid
      if (!data || typeof data !== 'object' || !data.vehicles || !Array.isArray(data.vehicles)) {
        return false;
      }
      
      const ownedVehicles = data.vehicles.filter(
        (v: { name: string; ownership: string }) => 
          v && v.ownership === 'own' && v.name && typeof v.name === 'string'
      );
      
      // Check if exact vehicle name matches
      const ownsVehicle = ownedVehicles.some((v: { name: string }) => 
        v.name && v.name.trim() === vehicleName.trim()
      );
      
      // Only return true if we have a definitive match
      return ownsVehicle === true;
    } catch (error) {
      console.error('Error checking vehicle ownership:', error);
      return false;
    }
  }, [vehicleName, userRating]);


  // Generate comprehensive review data for all vehicles
  const reviewData = generateVehicleReview(decodedYear, decodedMake, decodedModel, vehicleName);
  
  // Mock data - in production this would come from an API
  const vehicleData = {
    name: vehicleName,
    year: decodedYear,
    make: decodedMake,
    model: decodedModel,
    staffRating: generateStaffRating(vehicleName),
    communityRating: generateCommunityRating(vehicleName),
    communityRatingCount: 252,
    priceRange: reviewData.priceRange,
    award: reviewData.award,
    image: (() => {
      // Use custom image for Kia EV9-Land
      const normalizedVehicleName = vehicleName.toLowerCase().replace(/-/g, ' ');
      const normalizedMake = decodedMake.toLowerCase();
      const normalizedModel = decodedModel.toLowerCase().replace(/-/g, ' ');
      const isKiaEV9 = (normalizedMake === 'kia' && normalizedModel.includes('ev9')) ||
                      normalizedVehicleName.includes('kia ev9') ||
                      normalizedModel === 'ev9' ||
                      normalizedModel === 'ev9 land' ||
                      decodedModel.toLowerCase() === 'ev9-land';
      
      if (isKiaEV9) {
        return 'https://d2kde5ohu8qb21.cloudfront.net/files/677ef7efb1d4b8000850e710/010-2024-kia-ev9-land.jpg';
      }
      
      // Use specific image for 2025 Ford F-150 Lightning
      const isF150Lightning = (normalizedMake === 'ford' && 
                              (normalizedModel.includes('f 150 lightning') || 
                               normalizedModel.includes('f-150 lightning') ||
                               normalizedModel.includes('f-150-lightning'))) ||
                              normalizedVehicleName.includes('ford f 150 lightning') ||
                              normalizedVehicleName.includes('ford f-150 lightning');
      
      if (isF150Lightning && decodedYear === '2025') {
        return 'https://d2kde5ohu8qb21.cloudfront.net/files/68b9ebde156e4300022c4b79/2026fordf-150lightningstxevelectricvehiclepickuptruck-16.jpg';
      }
      
      return vehicleImageFor(vehicleName);
    })(),
    pros: reviewData.pros,
    cons: reviewData.cons,
    trims: reviewData.trims,
    scores: reviewData.scores,
    staffReview: {
      title: reviewData.title,
      content: reviewData.content,
      detailedSections: reviewData.detailedSections
    },
    ratingDistribution: {
      1: 2,
      2: 1,
      3: 3,
      4: 4,
      5: 8,
      6: 12,
      7: 18,
      8: 25,
      9: 20,
      10: 7
    } as RatingDistributionData
  };

  // Check if vehicle is saved on mount
  useEffect(() => {
    try {
      const onboardingData = localStorage.getItem('onboardingData');
      if (onboardingData) {
        const data = JSON.parse(onboardingData);
        if (data.vehicles && Array.isArray(data.vehicles)) {
          const isVehicleSaved = data.vehicles.some(
            (v: { name: string }) => v && v.name && v.name.trim() === vehicleName.trim()
          );
          setIsSaved(isVehicleSaved);
        }
      }
    } catch (error) {
      console.error('Error checking saved vehicle status:', error);
    }
  }, [vehicleName]);

  // Reload reviews when vehicleName changes to ensure saved reviews are displayed
  // Use a ref to track the previous vehicleName to avoid reloading unnecessarily
  const prevVehicleNameRef = useRef<string>(vehicleName);
  useEffect(() => {
    // Only reload if vehicleName actually changed (not just on mount)
    if (prevVehicleNameRef.current !== vehicleName) {
      const loadedReviews = getInitialReviews();
      setReviews(loadedReviews);
      prevVehicleNameRef.current = vehicleName;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [vehicleName]);

  // Fetch local listings when vehicle changes
  useEffect(() => {
    const loadListings = async () => {
      setIsLoadingListings(true);
      try {
        const yearNum = parseInt(decodedYear) || new Date().getFullYear();
        const fetchedListings = await fetchVehicleListings(yearNum, decodedMake, decodedModel, 4);
        // Set images for listings using vehicleImageFor
        const listingsWithImages = fetchedListings.map((listing) => {
          const listingVehicleName = `${listing.year} ${listing.make} ${listing.model}`;
          return {
            ...listing,
            image: vehicleImageFor(listingVehicleName)
          };
        });
        setListings(listingsWithImages);
      } catch (error) {
        console.error('Error fetching listings:', error);
        setListings([]);
      } finally {
        setIsLoadingListings(false);
      }
    };
    
    loadListings();
  }, [decodedYear, decodedMake, decodedModel]);

  const handleSave = () => {
    try {
      const onboardingData = localStorage.getItem('onboardingData');
      const data = onboardingData ? JSON.parse(onboardingData) : {};
      
      if (!data.vehicles || !Array.isArray(data.vehicles)) {
        data.vehicles = [];
      }

      // Normalize vehicle name (trim and ensure consistent format)
      const normalizedVehicleName = vehicleName.trim();
      
      const existingVehicleIndex = data.vehicles.findIndex(
        (v: { name: string }) => v && v.name && v.name.trim().toLowerCase() === normalizedVehicleName.toLowerCase()
      );

      if (existingVehicleIndex >= 0) {
        // Remove vehicle if already saved
        data.vehicles.splice(existingVehicleIndex, 1);
        setIsSaved(false);
      } else {
        // Add vehicle if not saved (default to 'want' ownership when saving from detail page)
        // Check for duplicates (case-insensitive) before adding
        const isDuplicate = data.vehicles.some(
          (v: { name: string }) => v && v.name && v.name.trim().toLowerCase() === normalizedVehicleName.toLowerCase()
        );
        
        if (!isDuplicate) {
          data.vehicles.push({
            name: normalizedVehicleName,
            ownership: 'want'
          });
          setIsSaved(true);
          // Show saved modal
          setIsSavedModalOpen(true);
        }
      }

      localStorage.setItem('onboardingData', JSON.stringify(data));
      
      // Dispatch event to notify other components (like Profile page)
      // Use CustomEvent to ensure proper event handling
      window.dispatchEvent(new CustomEvent('onboardingDataUpdated', { 
        detail: { vehicles: data.vehicles }
      }));
    } catch (error) {
      console.error('Error saving/removing vehicle:', error);
    }
  };

  const handleOpenRatingModal = () => {
    setIsRatingModalOpen(true);
  };

  const handleCloseRatingModal = () => {
    setIsRatingModalOpen(false);
  };

  const handleSubmitRating = (rating: number) => {
    setUserRating(vehicleName, rating);
    // In a real app, this would send the rating to the server
    console.log(`User rated ${vehicleName}: ${rating}/10`);
  };

  const handleRateAndReview = (rating: number) => {
    // Save the rating first
    setUserRating(vehicleName, rating);
    // Store the rating to pass directly to write review modal
    setReviewModalRating(rating);
    // Close rating modal and open write review modal
    setIsRatingModalOpen(false);
    // Use a small delay to ensure state is updated
    setTimeout(() => {
      setIsWriteReviewModalOpen(true);
    }, 50);
  };

  const handleClearRating = () => {
    clearRating(vehicleName);
    setIsRatingModalOpen(false);
  };

  const handleSubmitReview = (newReview: ReviewData) => {
    // Convert File objects to preview URLs for display
    const reviewWithPreviews: ReviewData = {
      ...newReview,
      mediaPreviews: newReview.mediaFiles?.map((file: File) => URL.createObjectURL(file)) || []
    };
    
    // Update local state
    setReviews(prev => [reviewWithPreviews, ...prev]);
    setCommunityRatingCount(prev => prev + 1);
    
    // Save review to localStorage so it persists across page reloads
    try {
      const savedReviewsKey = `vehicleReviews_${vehicleName}`;
      const existingReviewsJson = localStorage.getItem(savedReviewsKey);
      const existingReviews: ReviewData[] = existingReviewsJson ? JSON.parse(existingReviewsJson) : [];
      
      // Add the new review at the beginning
      const updatedReviews = [reviewWithPreviews, ...existingReviews];
      
      // Save to localStorage (convert File objects to strings for storage)
      const reviewsToSave = updatedReviews.map(review => ({
        ...review,
        mediaFiles: undefined, // Remove File objects as they can't be serialized
        mediaPreviews: review.mediaPreviews || [] // Keep preview URLs
      }));
      
      localStorage.setItem(savedReviewsKey, JSON.stringify(reviewsToSave));
      console.log('VehicleDetails: Saved review to localStorage for:', vehicleName);
    } catch (error) {
      console.error('VehicleDetails: Error saving review to localStorage:', error);
    }
    
    setIsWriteReviewModalOpen(false);
    // Show toast notification
    setIsToastVisible(true);
  };

  const handleViewReview = () => {
    // Scroll to reviews section
    const reviewsSection = document.getElementById('community-ratings');
    if (reviewsSection) {
      reviewsSection.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }
    setIsToastVisible(false);
  };

  const handleCloseToast = () => {
    setIsToastVisible(false);
  };

  const handleUpdateReview = (reviewId: string, updatedReview: ReviewData) => {
    // Convert File objects to preview URLs for display if new files were added
    const reviewWithPreviews: ReviewData = {
      ...updatedReview,
      mediaPreviews: updatedReview.mediaFiles?.map((file: File) => URL.createObjectURL(file)) || updatedReview.mediaPreviews || []
    };
    
    setReviews(prev => prev.map(review => 
      review.id === reviewId ? reviewWithPreviews : review
    ));
    setIsWriteReviewModalOpen(false);
  };

  const handleScrollToCommunityRatings = () => {
    const communityRatingsSection = document.getElementById('community-ratings');
    if (communityRatingsSection) {
      communityRatingsSection.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }
  };

  const handleScrollToStaffRating = () => {
    const staffRatingSection = document.getElementById('staff-rating');
    if (staffRatingSection) {
      staffRatingSection.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }
  };

  const handleTooltipMouseEnter = () => {
    if (hideTooltipTimeout.current !== null) {
      window.clearTimeout(hideTooltipTimeout.current);
      hideTooltipTimeout.current = null;
    }
    setIsTooltipVisible(true);
  };

  const handleTooltipMouseLeave = () => {
    if (hideTooltipTimeout.current !== null) {
      window.clearTimeout(hideTooltipTimeout.current);
    }
    hideTooltipTimeout.current = window.setTimeout(() => {
      setIsTooltipVisible(false);
      hideTooltipTimeout.current = null;
    }, 150);
  };

  const handleStaffTooltipMouseEnter = () => {
    if (hideStaffTooltipTimeout.current !== null) {
      window.clearTimeout(hideStaffTooltipTimeout.current);
      hideStaffTooltipTimeout.current = null;
    }
    setIsStaffTooltipVisible(true);
  };

  const handleStaffTooltipMouseLeave = () => {
    if (hideStaffTooltipTimeout.current !== null) {
      window.clearTimeout(hideStaffTooltipTimeout.current);
    }
    hideStaffTooltipTimeout.current = window.setTimeout(() => {
      setIsStaffTooltipVisible(false);
      hideStaffTooltipTimeout.current = null;
    }, 150);
  };

  useEffect(() => {
    return () => {
      if (hideTooltipTimeout.current !== null) {
        window.clearTimeout(hideTooltipTimeout.current);
      }
      if (hideStaffTooltipTimeout.current !== null) {
        window.clearTimeout(hideStaffTooltipTimeout.current);
      }
    };
  }, []);

  // Scroll detection for sticky rate bar
  useEffect(() => {
    const handleScroll = () => {
      if (!ratingsBarRef.current) return;

      const ratingsBarRect = ratingsBarRef.current.getBoundingClientRect();
      
      // When the ratings bar reaches or passes the top of the viewport
      if (ratingsBarRect.top <= 0) {
        setIsStickyBarVisible(true);
      } else {
        setIsStickyBarVisible(false);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Check initial state

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Both tooltips now follow their elements on scroll (no hide on scroll)

  const availableYears = ['2025', '2024', '2023', '2022', '2021'];

  return (
    <div className="vehicle-details">
      {/* Sticky Rate Bar - appears when scrolled */}
      <div className={`vehicle-details__sticky-rate-bar ${isStickyBarVisible ? 'vehicle-details__sticky-rate-bar--visible' : ''}`}>
        <div className="vehicle-details__sticky-rate-bar-content">
          <div className="vehicle-details__sticky-vehicle-name">
            {vehicleName}
          </div>
          <div className="vehicle-details__sticky-ratings">
            <div 
              className="vehicle-details__sticky-rating-item" 
              onClick={handleScrollToStaffRating}
            >
              <span className="vehicle-details__sticky-rating-label">MotorTrend</span>
              <span className="vehicle-details__sticky-rating-value">{typeof vehicleData.staffRating === 'number' ? vehicleData.staffRating.toFixed(1) : vehicleData.staffRating}</span>
            </div>
            <div 
              className="vehicle-details__sticky-rating-item" 
              onClick={handleScrollToCommunityRatings}
            >
              <span className="vehicle-details__sticky-rating-label">Community ({communityRatingCount})</span>
              <img 
                src="https://d2kde5ohu8qb21.cloudfront.net/files/68f66c095d4ae300022a2b0e/starbluesolid.svg" 
                alt="Community Rating Star" 
                className="vehicle-details__sticky-rating-icon" 
              />
              <span className="vehicle-details__sticky-rating-value">
                {vehicleData.communityRating % 1 === 0 
                  ? vehicleData.communityRating 
                  : vehicleData.communityRating.toFixed(1)}
              </span>
            </div>
            <button 
              className="vehicle-details__sticky-rating-item vehicle-details__sticky-rate-btn" 
              onClick={handleOpenRatingModal}
            >
              <span className="vehicle-details__sticky-rating-label">
                {userRating > 0 ? 'Yours' : 'Add Your Rating'}
              </span>
              <img 
                src={userRating > 0 
                  ? "https://d2kde5ohu8qb21.cloudfront.net/files/68f66c095d4ae300022a2b0e/starbluesolid.svg"
                  : "https://d2kde5ohu8qb21.cloudfront.net/files/68f66c095d4ae300022a2b10/starbluenotsolid.svg"
                } 
                alt="Add Rating Star" 
                className="vehicle-details__sticky-rating-icon" 
              />
              {userRating > 0 && (
                <span className="vehicle-details__sticky-rating-value">{userRating}</span>
              )}
            </button>
          </div>
          <button 
            className="vehicle-details__sticky-cta"
            onClick={() => {
              // Scroll to local listings section
              const listingsSection = document.querySelector('.vehicle-details__listings');
              if (listingsSection) {
                listingsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
              }
            }}
          >
            See Local Listings
          </button>
        </div>
      </div>

      {/* Content Layout */}
      <div className="vehicle-details__content-layout">
        {/* Left Content */}
        <div className="vehicle-details__left-content">
          {/* Breadcrumbs, Social Icons, and Save Button */}
          <div className="vehicle-details__top-section">
            <div className="vehicle-details__breadcrumbs">
              <Link to="/">Home</Link>
              <span> / </span>
              <Link to="/cars">Cars</Link>
              <span> / </span>
              <span>{vehicleData.make}</span>
              <span> / </span>
              <span>{vehicleData.model}</span>
              <span> / </span>
              <span>{vehicleData.year}</span>
            </div>
            <div className="vehicle-details__top-actions">
              <button className="vehicle-details__social-btn">
                <img 
                  src="https://d2kde5ohu8qb21.cloudfront.net/files/6902024b646d130002b7881d/facebook.svg" 
                  alt="Facebook" 
                  width={30} 
                  height={30}
                />
              </button>
              <button className="vehicle-details__social-btn">
                <img 
                  src="https://d2kde5ohu8qb21.cloudfront.net/files/6902024891bc910002b23381/x.svg" 
                  alt="X" 
                  width={30} 
                  height={30}
                />
              </button>
              <button className={`vehicle-details__save-btn ${isSaved ? 'saved' : ''}`} onClick={handleSave}>
                <Icon name="bookmark" variant={isSaved ? 'filled' : 'outlined'} size={20} />
                <span>{isSaved ? 'Saved!' : 'Save'}</span>
              </button>
            </div>
          </div>

          {/* Vehicle Title and Year Selection */}
          <div className="vehicle-details__title-section">
            <div className="vehicle-details__title-row">
              <h1 className="vehicle-details__title">
                {vehicleName}
                <Icon name="keyboard_arrow_down" size={20} />
              </h1>
            </div>
            <div className="vehicle-details__year-award-row">
              <div className="vehicle-details__year-selector">
                {availableYears.map((y) => (
                  <button
                    key={y}
                    className={`vehicle-details__year-badge ${selectedYear === y ? 'active' : ''}`}
                    onClick={() => setSelectedYear(y)}
                  >
                    {y}
                  </button>
                ))}
                <button className="vehicle-details__more-years">
                  More
                  <Icon name="keyboard_arrow_down" size={16} />
                </button>
              </div>
              <div className="vehicle-details__award">
                <img 
                  src="https://d2kde5ohu8qb21.cloudfront.net/files/690203caffe978000201e639/trophie-11.svg" 
                  alt="Trophy" 
                  width={20} 
                  height={20}
                />
                <span>{vehicleData.award}</span>
              </div>
            </div>
          </div>

          {/* Ratings Section */}
          <div ref={ratingsBarRef} className="vehicle-details__ratings">
            <div 
              ref={staffRatingRef}
              className="vehicle-details__rating-item vehicle-details__rating-item--clickable vehicle-details__rating-item--with-tooltip" 
              onClick={handleScrollToStaffRating}
              onMouseEnter={handleStaffTooltipMouseEnter}
              onMouseLeave={handleStaffTooltipMouseLeave}
            >
              <span className="vehicle-details__rating-label">MotorTrend</span>
              <span className="vehicle-details__rating-value">{typeof vehicleData.staffRating === 'number' ? vehicleData.staffRating.toFixed(1) : vehicleData.staffRating}</span>
              <StaffRatingTooltip
                overallRating={vehicleData.staffRating}
                scores={vehicleData.scores}
                isVisible={isStaffTooltipVisible}
                triggerRef={staffRatingRef}
                onMouseEnter={handleStaffTooltipMouseEnter}
                onMouseLeave={handleStaffTooltipMouseLeave}
                onRequestClose={() => setIsStaffTooltipVisible(false)}
              />
            </div>
            <div 
              ref={communityRatingRef}
              className="vehicle-details__rating-item vehicle-details__rating-item--clickable vehicle-details__rating-item--with-tooltip" 
              onClick={handleScrollToCommunityRatings}
              onMouseEnter={handleTooltipMouseEnter}
              onMouseLeave={handleTooltipMouseLeave}
            >
              <span className="vehicle-details__rating-label">Community Rating ({communityRatingCount})</span>
              <img 
                src="https://d2kde5ohu8qb21.cloudfront.net/files/68f66c095d4ae300022a2b0e/starbluesolid.svg" 
                alt="Community Rating Star" 
                className="vehicle-details__rating-icon community" 
              />
              <span className="vehicle-details__rating-value">
                {vehicleData.communityRating % 1 === 0 
                  ? vehicleData.communityRating 
                  : vehicleData.communityRating.toFixed(1)}
              </span>
              <RatingDistributionTooltip
                distribution={vehicleData.ratingDistribution}
                totalReviews={communityRatingCount}
                isVisible={isTooltipVisible}
                triggerRef={communityRatingRef}
                onMouseEnter={handleTooltipMouseEnter}
                onMouseLeave={handleTooltipMouseLeave}
                onRequestClose={() => setIsTooltipVisible(false)}
              />
            </div>
            <button className="vehicle-details__rate-btn" onClick={handleOpenRatingModal}>
              <span className="vehicle-details__rating-label">
                {userRating > 0 ? 'Your Rating' : 'Add Your Rating'}
              </span>
              <img 
                src={userRating > 0 
                  ? "https://d2kde5ohu8qb21.cloudfront.net/files/68f66c095d4ae300022a2b0e/starbluesolid.svg"
                  : "https://d2kde5ohu8qb21.cloudfront.net/files/68f66c095d4ae300022a2b10/starbluenotsolid.svg"
                } 
                alt="Add Rating Star" 
                className="vehicle-details__rating-icon add-rate" 
              />
              {userRating > 0 && (
                <>
                  <span className="vehicle-details__rating-value">{userRating}</span>
                  {ownsCar && (
                    <img 
                      src="https://d2kde5ohu8qb21.cloudfront.net/files/6906c93e2c176500024c4f41/garage-check-icon.svg" 
                      alt="Verified Owner" 
                      className="vehicle-details__verified-icon"
                    />
                  )}
                </>
              )}
            </button>
          </div>
          {/* Hero Image */}
          <div className="vehicle-details__hero">
            <div className="vehicle-details__hero-image">
              <img src={vehicleData.image} alt={vehicleName} />
            </div>
          </div>

          {/* Price and Actions */}
          <div className="vehicle-details__price-section">
            <div className="vehicle-details__price">
              <span className="vehicle-details__price-range">{vehicleData.priceRange}</span>
              <Icon name="keyboard_arrow_down" size={20} />
            </div>
            <div className="vehicle-details__actions">
              <button className="vehicle-details__action-btn">
                <Icon name="photo_library" size={20} />
                <span>28 Photos</span>
              </button>
              <button className="vehicle-details__action-btn">
                <Icon name="list" size={20} />
                <span>Specs</span>
              </button>
              <button className="vehicle-details__cta-primary">
                <Icon name="search" size={20} />
                <span>See Local Listings</span>
              </button>
            </div>
          </div>

          {/* Pros and Cons */}
          <div className="vehicle-details__pros-cons">
            <div className="vehicle-details__pros-cons-inner">
              <div className="vehicle-details__pros">
                <div className="vehicle-details__pros-header">
                  <img 
                    src="https://d2kde5ohu8qb21.cloudfront.net/files/690689ed9108fa000230136f/recommend.svg" 
                    alt="Pros" 
                    className="vehicle-details__pros-icon"
                  />
                  <h3>Pros</h3>
                </div>
                <ul>
                  {vehicleData.pros.map((pro, index) => (
                    <li key={index}>{pro}</li>
                  ))}
                </ul>
              </div>
              <div className="vehicle-details__divider"></div>
              <div className="vehicle-details__cons">
                <div className="vehicle-details__cons-header">
                  <img 
                    src="https://d2kde5ohu8qb21.cloudfront.net/files/690689eb9108fa000230136e/recommend-1.svg" 
                    alt="Cons" 
                    className="vehicle-details__cons-icon"
                  />
                  <h3>Cons</h3>
                </div>
                <ul>
                  {vehicleData.cons.map((con, index) => (
                    <li key={index}>{con}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Local Listings */}
          <div className="vehicle-details__listings">
            <h2>Local Listings</h2>
            <div className="vehicle-details__listings-grid">
              {isLoadingListings ? (
                <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: 'var(--spacing-4)', color: 'var(--color-neutrals-4)' }}>
                  Loading listings...
                </div>
              ) : listings.length > 0 ? (
                listings.map((listing) => (
                  <div key={listing.id} className="vehicle-details__listing-card">
                    <div className="vehicle-details__listing-image">
                      <img src={listing.image || vehicleData.image} alt={listing.name} />
                    </div>
                    <div className="vehicle-details__listing-info">
                      <div className="vehicle-details__listing-price">{listing.price}</div>
                      <div className="vehicle-details__listing-name">{listing.name}</div>
                      <div className="vehicle-details__listing-details">
                        <span>
                          <Icon name="speed" size={16} />
                          {listing.mileage}
                        </span>
                        <span>
                          <Icon name="location_on" size={16} />
                          {listing.dealer}
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: 'var(--spacing-4)', color: 'var(--color-neutrals-4)' }}>
                  No listings available at this time.
                </div>
              )}
            </div>
          </div>

          {/* Expert Review */}
          <div className="vehicle-details__review">
            <h2>Year Make Model Expert Review</h2>
            <p className="vehicle-details__review-author">Reviewed by Billy Rehbock</p>
            <div className="vehicle-details__review-content">
              <p>
                Defying the gasoline versus electric binary, the 2024 Toyota Prius takes the middle path with its hybrid
                drivetrain that returns segment-leading fuel economy. Now in its fifth generation, the well-rounded and
                surprisingly fun Prius won our 2024 Car of the Year award. Rivals include other compact hybrids such as
                the Kia Niro and Hyundai Elantra Hybrid.
              </p>
              <p>
                Toyota just introduced a new Prius for 2023, so the model is a complete carryover for the 2024 model year.
                Not only does the new hybrid hatchback look fantastic, its upgraded powertrains produce higher output than
                ever while still returning the excellent fuel economy consumers expect from a Prius. Toyota outfits the
                current Prius with large displays, modern phone connectivity technology, and its latest suite of active
                driver assistance features. In short, the Prius is more appealing than ever.
              </p>
            </div>

            <h3>What We Think</h3>
            <div className="vehicle-details__review-content">
              <p>
                Toyota put forward its best effort when it developed the current Prius hybrid. The compact hatchback boasts
                incredible efficiency wrapped up in one of the automaker's best designs in the last two decades. The cabin
                is decidedly forward-looking with large displays and the latest infotainment technology. What's more, the
                Prius is actually fun to drive; direct steering and excellent chassis tuning lend themselves to a compact
                car that's engaging on a winding road.
              </p>
            </div>
          </div>

          {/* MotorTrend Score */}
          <div id="staff-rating" className="vehicle-details__motortrend-score">
            <div className="vehicle-details__motortrend-header">
              <h2>MotorTrend Review</h2>
              <img 
                src="https://d2kde5ohu8qb21.cloudfront.net/files/68f6570b3ed26800022d87b6/mt-logo2.svg" 
                alt="MotorTrend Logo" 
                className="vehicle-details__motortrend-logo"
              />
            </div>
            <div className="vehicle-details__score-card">
              <div className="vehicle-details__score-header">
                <h3>{vehicleName}</h3>
                <div className="vehicle-details__score-award">
                  <img 
                    src="https://d2kde5ohu8qb21.cloudfront.net/files/690203caffe978000201e639/trophie-11.svg" 
                    alt="Trophy" 
                    width={24} 
                    height={24}
                  />
                  <span>{vehicleData.award}</span>
                  <Icon name="keyboard_arrow_down" size={16} />
                </div>
              </div>
              <div className="vehicle-details__score-content">
                <div className="vehicle-details__overall-score">
                  <div className="vehicle-details__score-circle">
                    <span className="vehicle-details__score-number">{typeof vehicleData.staffRating === 'number' ? vehicleData.staffRating.toFixed(1) : vehicleData.staffRating}</span>
                    <span className="vehicle-details__score-label">MotorTrend</span>
                  </div>
                </div>
                <div className="vehicle-details__score-breakdown">
                <div className="vehicle-details__score-item">
                  <span>Performance</span>
                  <div className="vehicle-details__score-bar">
                    <div className="vehicle-details__score-bar-fill" style={{ width: `${(vehicleData.scores.performance / 10) * 100}%` }}></div>
                  </div>
                  <span>{vehicleData.scores.performance.toFixed(1)}</span>
                </div>
                <div className="vehicle-details__score-item">
                  <span>Efficiency/Range</span>
                  <div className="vehicle-details__score-bar">
                    <div className="vehicle-details__score-bar-fill" style={{ width: `${(vehicleData.scores.efficiency / 10) * 100}%` }}></div>
                  </div>
                  <span>{vehicleData.scores.efficiency.toFixed(1)}</span>
                </div>
                <div className="vehicle-details__score-item">
                  <span>Tech/Innovation</span>
                  <div className="vehicle-details__score-bar">
                    <div className="vehicle-details__score-bar-fill" style={{ width: `${(vehicleData.scores.tech / 10) * 100}%` }}></div>
                  </div>
                  <span>{vehicleData.scores.tech.toFixed(1)}</span>
                </div>
                <div className="vehicle-details__score-item">
                  <span>Value</span>
                  <div className="vehicle-details__score-bar">
                    <div className="vehicle-details__score-bar-fill" style={{ width: `${(vehicleData.scores.value / 10) * 100}%` }}></div>
                  </div>
                  <span>{vehicleData.scores.value.toFixed(1)}</span>
                </div>
                </div>
              </div>

              {/* Staff Review - appears for all vehicles */}
              <div className="vehicle-details__score-review">
                {/* Reviewer Avatar Section */}
                <div className="vehicle-details__reviewer-section">
                  <div className="vehicle-details__reviewer-avatar-group">
                    <img 
                      src="https://d2kde5ohu8qb21.cloudfront.net/files/690637eaf09ade000224c6b1/group1318348122.png" 
                      alt="Reviewer avatar" 
                      className="vehicle-details__reviewer-avatar"
                      width={43}
                      height={43}
                    />
                  </div>
                  <div className="vehicle-details__reviewer-info">
                    <div className="vehicle-details__reviewer-header">
                      <div className="vehicle-details__reviewer-name-group">
                        <span className="vehicle-details__reviewer-name">Zach Gale</span>
                        <div className="vehicle-details__reviewer-badge--with-tooltip">
                          <img 
                            src="https://d2kde5ohu8qb21.cloudfront.net/files/69063bf7503f980002828ffc/mt-badge.svg" 
                            alt="MT badge" 
                            className="vehicle-details__reviewer-badge"
                            width={16}
                            height={16}
                          />
                          <div className="vehicle-details__reviewer-badge-tooltip">
                            MotorTrend Director, Buyers Guide
                          </div>
                        </div>
                      </div>
                      <div className="vehicle-details__reviewer-meta">
                        <span className="vehicle-details__reviewer-date">Driven, tested | May 20, 2025</span>
                      </div>
                    </div>
                  </div>
                </div>
                <h3>{vehicleData.staffReview.title}</h3>
                <p>{vehicleData.staffReview.content}</p>
                
                {/* Read Full Review Accordion CTA */}
                <div className="vehicle-details__review-accordion">
                  <button
                    className="vehicle-details__review-accordion-button"
                    onClick={() => setIsReviewAccordionOpen(!isReviewAccordionOpen)}
                    aria-expanded={isReviewAccordionOpen}
                  >
                    <span>Read Full Review</span>
                    <svg
                      className={`vehicle-details__review-accordion-chevron ${isReviewAccordionOpen ? 'vehicle-details__review-accordion-chevron--open' : ''}`}
                      width="20"
                      height="20"
                      viewBox="0 0 20 20"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M5 7.5L10 12.5L15 7.5"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </button>
                  {isReviewAccordionOpen && (
                    <div className="vehicle-details__review-accordion-content">
                      <div className="vehicle-details__review-accordion-text">
                        {vehicleData.staffReview.detailedSections ? (
                          vehicleData.staffReview.detailedSections.map((section, index) => (
                            <div key={index} className="vehicle-details__review-section">
                              <h4 className="vehicle-details__review-section-title">{section.title}</h4>
                              {section.content.split('\n\n').map((paragraph, pIndex) => (
                                <p key={pIndex}>{paragraph}</p>
                              ))}
                            </div>
                          ))
                        ) : (
                          <>
                            <h4>Detailed Review</h4>
                            <p>
                              {vehicleData.staffReview.content} The vehicle has been thoroughly tested across various conditions, 
                              from daily commuting to extended highway journeys. Performance metrics have been evaluated 
                              including acceleration, braking, handling, and overall driving dynamics. The interior quality, 
                              technology integration, and overall value proposition have been carefully assessed to provide 
                              a comprehensive evaluation.
                            </p>
                            <p>
                              In-depth testing reveals how this vehicle performs in real-world scenarios, with particular 
                              attention to fuel efficiency, comfort over long distances, and reliability. Our testing 
                              protocol includes extended drives, various weather conditions, and comparisons with key 
                              competitors in the segment.
                            </p>
                          </>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* User Reviews */}
          <div id="community-ratings">
            <UserReviews
              vehicleName={vehicleName}
              communityRating={vehicleData.communityRating}
              totalReviews={communityRatingCount}
              ratingDistribution={[5, 3, 8, 10, 20, 30, 45, 63, 50, 18]}
              vehicleImage={vehicleData.image}
              reviews={reviews}
              onWriteReview={() => setIsWriteReviewModalOpen(true)}
              onUpdateReview={handleUpdateReview}
              defaultTab="reviews"
            />
          </div>

          {/* AI Insights */}
          <AIInsights vehicleName={vehicleName} />

          {/* Trims and Pricing */}
          <div className="vehicle-details__trims">
            <h2>{vehicleName} Trims and Pricing</h2>
            <div className="vehicle-details__trims-table">
              <div className="vehicle-details__trims-inner">
                <div className="vehicle-details__trims-header">
                  <span>Trims</span>
                  <span>Price</span>
                </div>
                {vehicleData.trims.map((trim, index) => (
                  <div key={index} className="vehicle-details__trim-row">
                    <span>{trim.name}</span>
                    <span>{trim.price}</span>
                  </div>
                ))}
                <button className="vehicle-details__show-more">Show More</button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="vehicle-details__sidebar">
          {/* Ad Space 1 */}
          <div className="vehicle-details__ad">
            <img 
              src="https://d2kde5ohu8qb21.cloudfront.net/files/6908c04df6c54e0002bc1a7c/subaruad.jpg" 
              alt="Advertisement" 
              className="vehicle-details__ad-image"
            />
          </div>

          {/* Related Articles */}
          <div className="vehicle-details__sidebar-section">
            <h3>Related Articles</h3>
            <div className="vehicle-details__sidebar-articles">
              {(() => {
                const relatedArticles: React.ReactElement[] = [];
                const addedSlugs = new Set<string>();
                
                // Normalize current vehicle info for matching
                const normalizedModel = decodedModel.toLowerCase().replace(/-/g, ' ');
                const normalizedMake = decodedMake.toLowerCase();
                const normalizedYear = decodedYear.toLowerCase();
                
                // Helper function to normalize vehicle name for comparison
                const normalizeForComparison = (name: string): string => {
                  return name.toLowerCase().replace(/-/g, ' ').trim();
                };
                
                // Helper function to check if two vehicle names match
                const vehiclesMatch = (articleVehicleName: string, currentYear: string, currentMake: string, currentModel: string): boolean => {
                  const normalizedArticleName = normalizeForComparison(articleVehicleName);
                  
                  // Extract year, make, model from article vehicle name
                  const parts = normalizedArticleName.split(/\s+/);
                  const yearIndex = parts.findIndex(part => /^\d{4}$/.test(part));
                  
                  if (yearIndex === -1) {
                    // No year found, try to match by make and model only
                    const articleMake = parts[0] || '';
                    const articleModel = parts.slice(1).join(' ');
                    return normalizeForComparison(currentMake) === articleMake && 
                           normalizeForComparison(currentModel).includes(articleModel) ||
                           articleModel.includes(normalizeForComparison(currentModel));
                  }
                  
                  const articleYear = parts[yearIndex];
                  const articleMake = parts[yearIndex + 1] || '';
                  const articleModel = parts.slice(yearIndex + 2).join(' ');
                  
                  // Match by year, make, and model (flexible matching)
                  const yearMatch = articleYear === normalizeForComparison(currentYear);
                  const makeMatch = normalizeForComparison(currentMake) === articleMake;
                  const modelMatch = normalizeForComparison(currentModel).includes(articleModel) ||
                                    articleModel.includes(normalizeForComparison(currentModel)) ||
                                    normalizedArticleName.includes(normalizeForComparison(currentModel));
                  
                  // Also check if the full vehicle name contains key parts
                  const fullNameMatch = normalizedArticleName.includes(normalizeForComparison(currentMake)) &&
                                       normalizedArticleName.includes(normalizeForComparison(currentModel));
                  
                  return (yearMatch && makeMatch && modelMatch) || fullNameMatch;
                };
                
                // Find articles that match the current vehicle
                Object.entries(articles).forEach(([slug, article]) => {
                  if (relatedArticles.length >= 3) return;
                  
                  const articleVehicleName = article.motortrendScore?.vehicleName;
                  if (!articleVehicleName) return;
                  
                  // Check if this article's vehicle matches the current vehicle
                  if (vehiclesMatch(articleVehicleName, normalizedYear, normalizedMake, normalizedModel)) {
                    addedSlugs.add(slug);
                    relatedArticles.push(
                      <Link 
                        key={slug}
                        to={`/articles/${slug}`}
                        className="vehicle-details__sidebar-article"
                      >
                        <div className="vehicle-details__sidebar-article-image">
                          <img src={article.heroImage} alt={article.title} />
                        </div>
                        <div className="vehicle-details__sidebar-article-content">
                          <h4>{article.title}</h4>
                          <p className="vehicle-details__sidebar-article-meta">
                            {article.author} | {article.date}
                          </p>
                        </div>
                      </Link>
                    );
                  }
                });
                
                // Add default articles if we don't have enough
                // Try to load from articles data first, then fall back to hardcoded defaults
                if (relatedArticles.length < 3) {
                  const defaultArticleSlugs = [
                    '2024-kia-ev9-yearlong-review-verdict',
                    'new-details-2026-rivian-r2-ev-suv-battery-charging',
                    '2025-acura-adx-awd-yearlong-review-arrival'
                  ];
                  
                  defaultArticleSlugs.forEach((slug) => {
                    if (relatedArticles.length >= 3) return;
                    
                    // Skip if already added as a matching article
                    if (addedSlugs.has(slug)) return;
                    
                    const article = articles[slug];
                    if (article) {
                      addedSlugs.add(slug);
                      relatedArticles.push(
                        <Link 
                          key={slug}
                          to={`/articles/${slug}`}
                          className="vehicle-details__sidebar-article"
                        >
                          <div className="vehicle-details__sidebar-article-image">
                            <img src={article.heroImage} alt={article.title} />
                          </div>
                          <div className="vehicle-details__sidebar-article-content">
                            <h4>{article.title}</h4>
                            <p className="vehicle-details__sidebar-article-meta">
                              {article.author} | {article.date}
                            </p>
                          </div>
                        </Link>
                      );
                    }
                  });
                }
                
                return relatedArticles.slice(0, 3);
              })()}
            </div>
          </div>

          {/* Ad Space 2 */}
          <div className="vehicle-details__ad">
            <img 
              src="https://d2kde5ohu8qb21.cloudfront.net/files/6908c04df6c54e0002bc1a7c/subaruad.jpg" 
              alt="Advertisement" 
              className="vehicle-details__ad-image"
            />
          </div>

          {/* Newsletter Signup */}
          <div className="vehicle-details__sidebar-section">
            <h3>Stay Updated</h3>
            <div className="vehicle-details__newsletter">
              <p>Get the latest automotive news and reviews delivered to your inbox.</p>
              <div className="vehicle-details__newsletter-form">
                <input type="email" placeholder="Enter your email" />
                <button>Subscribe</button>
              </div>
            </div>
          </div>

          {/* Ad Space 3 */}
          <div className="vehicle-details__ad">
            <img 
              src="https://d2kde5ohu8qb21.cloudfront.net/files/6908c04df6c54e0002bc1a7c/subaruad.jpg" 
              alt="Advertisement" 
              className="vehicle-details__ad-image"
            />
          </div>
        </div>
      </div>

      {/* Rating Modal */}
      <RatingModal
        isOpen={isRatingModalOpen}
        onClose={handleCloseRatingModal}
        onRate={handleSubmitRating}
        vehicleName={vehicleName}
        currentRating={userRating}
        onRateAndReview={handleRateAndReview}
        onClear={handleClearRating}
      />

      {/* Write Review Modal */}
      <WriteReviewModal
        key={`${vehicleName}-${reviewModalRating || 'new'}`}
        isOpen={isWriteReviewModalOpen}
        onClose={() => {
          setIsWriteReviewModalOpen(false);
          setReviewModalRating(undefined); // Clear the rating when modal closes
        }}
        vehicleName={vehicleName}
        vehicleImage={vehicleData.image}
        onSubmit={handleSubmitReview}
        initialRating={reviewModalRating}
      />

      {/* Review Submitted Modal */}
      <ReviewSubmittedToast
        isVisible={isToastVisible}
        onClose={handleCloseToast}
        onViewReview={handleViewReview}
        vehicleName={vehicleName}
      />

      {/* Saved Modal */}
      <SavedModal
        isOpen={isSavedModalOpen}
        onClose={() => setIsSavedModalOpen(false)}
        itemTitle={vehicleName}
        itemType="vehicle"
      />
    </div>
  );
};

export default VehicleDetails;
