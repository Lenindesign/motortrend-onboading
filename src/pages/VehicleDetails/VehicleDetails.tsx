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
import { getVehicles } from '../../api/vehiclesApi';
import RatingModal from '../../components/RatingModal';
import { useRating } from '../../contexts/RatingContext';
import { type ReviewData } from '../../components/UserReviews';
import { RatingDistributionTooltip, type RatingDistributionData } from '../../components/RatingDistributionTooltip';
import { StaffRatingTooltip } from '../../components/StaffRatingTooltip';
import { fetchVehicleListings, type VehicleListing } from '../../utils/vehicleListings';
import { articles } from '../../utils/articles';
import { ArticleReactions } from '../../components/ArticleReactions';
import { PhotoGallery } from '../../components/PhotoGallery';
import StickyRateBar, { type RatingItem } from '../../components/StickyRateBar';
import { Popover } from '../../components/atoms/Popover';
import { LocalListingsSidebar } from '../../components/LocalListingsSidebar';
import { getLocalListings } from '../../utils/localListings';
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
  const [isReviewAccordionOpen, setIsReviewAccordionOpen] = useState(false);
  const [isTooltipVisible, setIsTooltipVisible] = useState(false);
  const [isStaffTooltipVisible, setIsStaffTooltipVisible] = useState(false);
  const hideTooltipTimeout = useRef<number | null>(null);
  const hideStaffTooltipTimeout = useRef<number | null>(null);
  const ratingsBarRef = useRef<HTMLDivElement>(null);
  const primeHeroRef = useRef<HTMLDivElement>(null);
  const [isStickyBarVisible, setIsStickyBarVisible] = useState(false);
  const [isStickyBarSticky, setIsStickyBarSticky] = useState(false);
  const [stickyBarHeight, setStickyBarHeight] = useState(0);
  const stickyRateBarRef = useRef<HTMLDivElement>(null);
  const [communityRatingCount, setCommunityRatingCount] = useState(25);
  const [listings, setListings] = useState<VehicleListing[]>([]);
  const [isLoadingListings, setIsLoadingListings] = useState(true);
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [currentGalleryImages, setCurrentGalleryImages] = useState<string[]>([]);
  
  // Load API vehicle data synchronously on initial render to prevent rating flash
  // This ensures we have the correct rating (from API) immediately, not a generated one
  // Using useMemo instead of useState + useEffect prevents the flash of incorrect rating
  const apiVehicleData = useMemo(() => {
    try {
      console.log('🔍 Loading vehicle data synchronously - BUILD VERSION: 2024-11-23-v3-MAZDA-FIX');
      console.log('🔍 URL params:', { decodedYear, decodedMake, decodedModel });
      
      const vehicles = getVehicles();
      console.log('✅ Total vehicles fetched:', vehicles.length);
      
      // Build slug from URL params for exact matching
      const urlSlug = `${decodedYear}/${decodedMake}/${decodedModel}`;
      console.log('🔎 Looking for slug:', urlSlug);
      
      // First try to match by slug (most reliable)
      let matchingVehicle = vehicles.find(v => v.slug === urlSlug);
      
      if (matchingVehicle) {
        console.log('✅✅✅ FOUND matching vehicle by slug:', matchingVehicle);
        console.log('✅ Rating:', matchingVehicle.staffRating);
        console.log('✅ Image URL:', matchingVehicle.image);
        console.log('✅ Gallery Images:', matchingVehicle.galleryImages?.length || 0);
        return matchingVehicle;
      }
      
      // Fallback to year/make/model matching
      const normalizedUrlModel = decodedModel.replace(/-/g, ' ').toLowerCase();
      console.log('🔎 Trying year/make/model match:', { year: decodedYear, make: decodedMake, model: normalizedUrlModel });
      
      matchingVehicle = vehicles.find(v => {
        const yearMatch = v.year === decodedYear;
        const makeMatch = v.make === decodedMake;
        const normalizedDbModel = v.model.replace(/-/g, ' ').toLowerCase();
        const modelMatch = normalizedDbModel === normalizedUrlModel;
        
        return yearMatch && makeMatch && modelMatch;
      });
      
      if (matchingVehicle) {
        console.log('✅✅✅ FOUND matching vehicle from API:', matchingVehicle);
        console.log('✅ Rating:', matchingVehicle.staffRating);
        console.log('✅ Image URL:', matchingVehicle.image);
        console.log('✅ Gallery Images:', matchingVehicle.galleryImages?.length || 0);
        return matchingVehicle;
      } else {
        console.log('❌❌❌ NO matching vehicle found in API');
        console.log('Searched for slug:', urlSlug);
        console.log('Searched for:', { year: decodedYear, make: decodedMake, model: normalizedUrlModel });
        return null;
      }
    } catch (error) {
      console.error('❌ Error loading vehicle data:', error);
      return null;
    }
  }, [decodedYear, decodedMake, decodedModel]);

  // Parse vehicle name from URL params
  // Normalize: replace dashes with spaces in model to ensure consistent format
  // This ensures "Ioniq-6-N" becomes "Ioniq 6 N" to match Article page format
  const vehicleName = `${decodedYear} ${decodedMake} ${decodedModel.replace(/-/g, ' ')}`;

  // Generate local listings
  const [localListings, setLocalListings] = useState<any[]>([]);
  
  useEffect(() => {
    const fetchListings = async () => {
    const vehicleImage = apiVehicleData?.image || vehicleImageFor(vehicleName);
      try {
        const listings = await getLocalListings(
          decodedYear, 
          decodedMake, 
          decodedModel.replace(/-/g, ' '), 
          vehicleImage
        );
        setLocalListings(listings);
      } catch (error) {
        console.error('❌ Error fetching listings:', error);
        setLocalListings([]); // Set empty array on error
      }
    };
    
    fetchListings();
  }, [decodedYear, decodedMake, decodedModel, apiVehicleData, vehicleName]);

  // Check if this is a Prime template vehicle
  // Includes: hardcoded vehicles, award winners, and all performance cars (priceMin > $150k)
  const isPrimeTemplate = (decodedYear === '2026' && decodedMake === 'Bentley' && decodedModel === 'Continental-GT-Supersports') ||
    (decodedYear === '2026' && decodedMake === 'Ferrari' && decodedModel === '296-Speciale') ||
    (decodedYear === '2025' && decodedMake === 'Porsche' && decodedModel === '718-Cayman') ||
    (decodedYear === '2025' && decodedMake === 'Chevrolet' && decodedModel === 'Corvette-ZR1') ||
    (decodedYear === '2026' && decodedMake === 'Cadillac' && decodedModel === 'Escalade-IQ') ||
    (decodedYear === '2026' && decodedMake === 'Volkswagen' && (decodedModel === 'Golf-GTI-R' || decodedModel === 'Golf-GTI-/-R' || decodedModel === 'Golf-GTI-%2F-R')) ||
    (decodedYear === '2025' && decodedMake === 'Ram' && decodedModel === '1500') ||
    // All performance cars (vehicles with starting price > $150,000)
    (apiVehicleData?.priceMin && apiVehicleData.priceMin > 150000);

  // Display name for prime template
  const displayName = (() => {
    if (decodedYear === '2026' && decodedMake === 'Bentley' && decodedModel === 'Continental-GT-Supersports') {
      return '2026 Bentley Continental GT';
    }
    if (decodedYear === '2026' && decodedMake === 'Ferrari' && decodedModel === '296-Speciale') {
      return '2026 Ferrari 296 Speciale';
    }
    if (decodedYear === '2025' && decodedMake === 'Porsche' && decodedModel === '718-Cayman') {
      return '2025 Porsche 718 Cayman';
    }
    if (decodedYear === '2025' && decodedMake === 'Chevrolet' && decodedModel === 'Corvette-ZR1') {
      return '2025 Chevrolet Corvette ZR1';
    }
    if (decodedYear === '2026' && decodedMake === 'Cadillac' && decodedModel === 'Escalade-IQ') {
      return '2026 Cadillac Escalade IQ';
    }
    if (decodedYear === '2026' && decodedMake === 'Volkswagen' && (decodedModel === 'Golf-GTI-R' || decodedModel === 'Golf-GTI-/-R' || decodedModel === 'Golf-GTI-%2F-R')) {
      return '2026 Volkswagen Golf GTI / R';
    }
    if (decodedYear === '2025' && decodedMake === 'Ram' && decodedModel === '1500') {
      return '2025 Ram 1500';
    }
    return vehicleName;
  })();

  // Get images from article for gallery
  const galleryImages = useMemo(() => {
    console.log('🖼️🖼️🖼️ Gallery Images useMemo triggered');
    console.log('🖼️ apiVehicleData:', apiVehicleData);
    console.log('🖼️ apiVehicleData?.image:', apiVehicleData?.image);
    console.log('🖼️ apiVehicleData?.galleryImages:', apiVehicleData?.galleryImages);
    console.log('🖼️ isPrimeTemplate:', isPrimeTemplate);
    
    // PRIORITY 1: Use API gallery images if available
    if (apiVehicleData?.galleryImages && apiVehicleData.galleryImages.length > 0) {
      console.log('✅✅✅ Using API gallery images:', apiVehicleData.galleryImages.length);
      return apiVehicleData.galleryImages;
    }
    
    // PRIORITY 2: For prime template vehicles, check articles first (they have multiple images)
    // For non-prime vehicles, use single API image if available
    if (!isPrimeTemplate && apiVehicleData?.image) {
      console.log('✅ Using single API image:', apiVehicleData.image);
      return [apiVehicleData.image];
    }
    
    console.log('⚠️⚠️⚠️ Checking articles for images...');
    
    // PRIORITY 3: Find matching article
    for (const article of Object.values(articles)) {
      if (article.motortrendScore?.vehicleName) {
        // Normalize both names: replace hyphens with spaces and normalize whitespace
        const articleVehicleName = article.motortrendScore.vehicleName.toLowerCase()
          .replace(/\s*\/\s*/g, '/')
          .replace(/-/g, ' ')
          .replace(/\s+/g, ' ')
          .trim();
        const currentVehicleName = vehicleName.toLowerCase()
          .replace(/\s*\/\s*/g, '/')
          .replace(/-/g, ' ')
          .replace(/\s+/g, ' ')
          .trim();

        if (articleVehicleName === currentVehicleName ||
          articleVehicleName.includes(currentVehicleName) ||
          currentVehicleName.includes(articleVehicleName)) {
          console.log('📰 Using article images:', article.images?.length || 0);
          if (article.images && article.images.length > 0) {
            return article.images;
          }
        }
      }
    }
    
    // PRIORITY 4: For prime template, use displayName to find article if vehicleName didn't match
    if (isPrimeTemplate && displayName !== vehicleName) {
      console.log('🔄 Trying displayName for article match:', displayName);
      for (const article of Object.values(articles)) {
        if (article.motortrendScore?.vehicleName) {
          const articleVehicleName = article.motortrendScore.vehicleName.toLowerCase()
            .replace(/\s*\/\s*/g, '/')
            .replace(/-/g, ' ')
            .replace(/\s+/g, ' ')
            .trim();
          const currentDisplayName = displayName.toLowerCase()
            .replace(/\s*\/\s*/g, '/')
            .replace(/-/g, ' ')
            .replace(/\s+/g, ' ')
            .trim();

          if (articleVehicleName === currentDisplayName ||
            articleVehicleName.includes(currentDisplayName) ||
            currentDisplayName.includes(articleVehicleName)) {
            console.log('📰 Using article images with displayName:', article.images?.length || 0);
            if (article.images && article.images.length > 0) {
              return article.images;
            }
          }
        }
      }
    }
    
    // PRIORITY 5: Use single API vehicle image if available (fallback for prime template)
    if (apiVehicleData?.image) {
      console.log('✅ Using single API image as fallback:', apiVehicleData.image);
      return [apiVehicleData.image];
    }
    
    // PRIORITY 6: Fallback to hero image if no article found
    console.log('🔄 Using fallback vehicleImageFor');
    return [vehicleImageFor(vehicleName)];
  }, [vehicleName, apiVehicleData, isPrimeTemplate, displayName]);

  // Preload all gallery images for smooth transitions
  useEffect(() => {
    if (!galleryImages || galleryImages.length <= 1) {
      return;
    }
    
    galleryImages.forEach((imageUrl) => {
      const img = new Image();
      img.src = imageUrl;
    });
  }, [galleryImages]);

  // Auto-cycle images for all vehicles with multiple gallery images every 5 seconds
  useEffect(() => {
    if (!galleryImages || galleryImages.length <= 1) {
      return;
    }
    
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => {
        return (prevIndex + 1) % galleryImages.length;
      });
    }, 5000); // 5 seconds
    
    return () => clearInterval(interval);
  }, [galleryImages]);
  
  // Reset image index when gallery images change
  useEffect(() => {
    setCurrentImageIndex(0);
  }, [galleryImages]);

  // Initialize current gallery images when galleryImages changes
  useEffect(() => {
    if (galleryImages && galleryImages.length > 0) {
      setCurrentGalleryImages(galleryImages);
    }
  }, [galleryImages]);

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


  // Generate comprehensive review data for all vehicles
  const reviewData = generateVehicleReview(decodedYear, decodedMake, decodedModel, vehicleName);

  // Check if there's an article with a motortrendScore for this vehicle
  const articleStaffRating = useMemo(() => {
    // Check all articles for a motortrendScore matching this vehicle
    for (const article of Object.values(articles)) {
      if (article.motortrendScore?.vehicleName) {
        // Normalize vehicle names for comparison (handle variations like "GTI / R" vs "GTI/R")
        const articleVehicleName = article.motortrendScore.vehicleName.toLowerCase().replace(/\s*\/\s*/g, '/');
        const currentVehicleName = vehicleName.toLowerCase().replace(/\s*\/\s*/g, '/');

        // Check if vehicle names match (exact match or contains match)
        if (articleVehicleName === currentVehicleName ||
          articleVehicleName.includes(currentVehicleName) ||
          currentVehicleName.includes(articleVehicleName)) {
          return article.motortrendScore.overallRating;
        }
      }
    }
    return null;
  }, [vehicleName]);

  // Helper to format scores (ensures 0-10 scale)
  const formatScore = (score: number | undefined) => {
    if (score === undefined) return '0.0';
    // If score is > 10, assume it's on 0-100 scale and normalize to 0-10
    const normalized = score > 10 ? score / 10 : score;
    return normalized.toFixed(1);
  };

  // Tooltip handlers for community rating
  const handleTooltipMouseEnter = () => {
    console.log('Community tooltip mouse enter');
    if (hideTooltipTimeout.current) {
      clearTimeout(hideTooltipTimeout.current);
      hideTooltipTimeout.current = null;
    }
    setIsTooltipVisible(true);
  };

  const handleTooltipMouseLeave = () => {
    console.log('Community tooltip mouse leave');
    hideTooltipTimeout.current = window.setTimeout(() => {
      setIsTooltipVisible(false);
    }, 100);
  };

  // Tooltip handlers for staff rating
  const handleStaffTooltipMouseEnter = () => {
    console.log('Staff tooltip mouse enter');
    if (hideStaffTooltipTimeout.current) {
      clearTimeout(hideStaffTooltipTimeout.current);
      hideStaffTooltipTimeout.current = null;
    }
    setIsStaffTooltipVisible(true);
  };

  const handleStaffTooltipMouseLeave = () => {
    console.log('Staff tooltip mouse leave');
    hideStaffTooltipTimeout.current = window.setTimeout(() => {
      setIsStaffTooltipVisible(false);
    }, 100);
  };

  // Generate rating counts based on bell curve distribution (25 total reviews)
  const calculateRatingCounts = (): RatingDistributionData => {
    // Realistic distribution for 25 reviews centered around high ratings
    const counts = {
      1: 1,  // 1 star: 1 review = 4%
      2: 2,  // 2 stars: 2 reviews = 8%
      3: 5,  // 3 stars: 5 reviews = 20%
      4: 10, // 4 stars: 10 reviews = 40%
      5: 7   // 5 stars: 7 reviews = 28%
    };
    // Total: 25 reviews = 100%
    
    console.log('[VehicleDetails] NEW Rating counts:', counts, 'Total:', Object.values(counts).reduce((a, b) => a + b, 0));
    return counts;
  };

  const calculateRatingPercentages = (counts: RatingDistributionData): RatingDistributionData => {
    const percentages: RatingDistributionData = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    let totalCount = 0;
    for (let i = 1; i <= 5; i++) totalCount += (counts[i] || 0);
    
    console.log('Rating Counts:', counts);
    console.log('Total Count:', totalCount);
    
    if (totalCount === 0) return percentages;

    let currentSum = 0;
    let maxKey = 1;
    let maxVal = 0;
    
    for (let i = 1; i <= 5; i++) {
      const p = Math.round(((counts[i] || 0) / totalCount) * 100);
      percentages[i] = p;
      currentSum += p;
      
      if (p > maxVal) {
        maxVal = p;
        maxKey = i;
      }
    }
    
    // Ensure sum is 100%
    const diff = 100 - currentSum;
    if (diff !== 0) {
      percentages[maxKey] += diff;
    }
    
    console.log('Rating Percentages:', percentages);
    console.log('Percentage Sum:', Object.values(percentages).reduce((a, b) => a + b, 0));
    
    return percentages;
  };

  const ratingCounts = calculateRatingCounts();

  // Use useMemo to ensure vehicleData updates when apiVehicleData loads
  // This prevents the flash of incorrect rating (e.g., 9.4 -> 8.5)
  const vehicleData = useMemo(() => ({
    name: vehicleName,
    year: decodedYear,
    make: decodedMake,
    model: decodedModel,
    // Use API data as single source of truth - only fall back if truly missing
    // This ensures consistency and prevents rating flashes
    staffRating: apiVehicleData?.staffRating ?? articleStaffRating ?? generateStaffRating(vehicleName),
    communityRating: apiVehicleData?.communityRating ?? generateCommunityRating(vehicleName),
    communityRatingCount: apiVehicleData?.reviewCount ?? 25,
    priceRange: apiVehicleData?.priceRange ?? reviewData.priceRange,
    award: reviewData.award,
    image: (() => {
      // PRIORITY 1: Use API image if available
      if (apiVehicleData?.image) {
        console.log('🖼️ Using API image for vehicleData:', apiVehicleData.image);
        return apiVehicleData.image;
      }

      // PRIORITY 2: Use custom image for Kia EV9-Land
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

      // PRIORITY 3: Use specific image for 2025 Ford F-150 Lightning
      const isF150Lightning = (normalizedMake === 'ford' &&
        (normalizedModel.includes('f 150 lightning') ||
          normalizedModel.includes('f-150 lightning') ||
          normalizedModel.includes('f-150-lightning'))) ||
        normalizedVehicleName.includes('ford f 150 lightning') ||
        normalizedVehicleName.includes('ford f-150 lightning');

      if (isF150Lightning && decodedYear === '2025') {
        return 'https://d2kde5ohu8qb21.cloudfront.net/files/68b9ebde156e4300022c4b79/2026fordf-150lightningstxevelectricvehiclepickuptruck-16.jpg';
      }

      // PRIORITY 4: Fallback to vehicleImageFor
      console.log('⚠️ Using fallback vehicleImageFor for vehicleData');
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
    ratingDistribution: calculateRatingPercentages(ratingCounts),
    ratingCounts
  }), [vehicleName, decodedYear, decodedMake, decodedModel, apiVehicleData, articleStaffRating, reviewData, ratingCounts]);

  console.log('[VehicleDetails] vehicleData.communityRatingCount:', vehicleData.communityRatingCount);
  console.log('[VehicleDetails] vehicleData.ratingDistribution:', vehicleData.ratingDistribution);

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

  // Note: Vehicle data is now loaded synchronously via useMemo above
  // This prevents the flash of incorrect rating (e.g., 9.4 -> 8.5)
  // The useEffect has been removed in favor of synchronous loading

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
        // Set images for listings using vehicleImageFor only as fallback
        const listingsWithImages = fetchedListings.map((listing) => {
          const listingVehicleName = `${listing.year} ${listing.make} ${listing.model}`;
          return {
            ...listing,
            image: listing.image || vehicleImageFor(listingVehicleName)
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

  // Measure sticky bar height on mount and when it changes
  useEffect(() => {
    if (!stickyRateBarRef.current) return;

    const measureBarHeight = () => {
      if (stickyRateBarRef.current) {
        // Get the computed height including margins
        const rect = stickyRateBarRef.current.getBoundingClientRect();
        const computedStyle = window.getComputedStyle(stickyRateBarRef.current);
        const marginBottom = parseFloat(computedStyle.marginBottom) || 0;
        const totalHeight = rect.height + marginBottom;

        if (totalHeight > 0) {
          setStickyBarHeight(totalHeight);
        }
      }
    };

    // Measure on mount with a small delay to ensure DOM is ready
    const timeoutId = setTimeout(measureBarHeight, 0);

    // Also measure on resize
    window.addEventListener('resize', measureBarHeight);

    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener('resize', measureBarHeight);
    };
  }, []);

  // Scroll detection for sticky rate bar
  useEffect(() => {
    const handleScroll = () => {
      if (!stickyRateBarRef.current) return;

      const scrollY = window.scrollY || window.pageYOffset;

      // Get header element to calculate its actual height
      const header = document.querySelector('.global-header');
      const headerHeight = header ? header.getBoundingClientRect().height : 56;

      // When user scrolls past where the static bar would be (header height), switch to sticky mode
      if (scrollY >= headerHeight) {
        setIsStickyBarSticky(true);
        setIsStickyBarVisible(true);
      } else {
        // When scrolled back to top, switch back to static mode
        setIsStickyBarSticky(false);
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

  // Prepare ratings for StickyRateBar component
  const stickyRatings: RatingItem[] = [
    {
      type: 'motortrend',
      value: parseFloat(formatScore(vehicleData.staffRating)), // Pass as number 0-10
      onClick: handleScrollToStaffRating,
      iconSrc: 'https://d2kde5ohu8qb21.cloudfront.net/files/692374f1d13f5100022ddf61/mticon.svg',
      iconAlt: 'MT',
      format: 'vehicle-details'
    },
    {
      type: 'user-reviews',
      value: vehicleData.communityRating, // 0-10 scale
      onClick: handleScrollToCommunityRatings,
      label: 'User Reviews',
      showStars: true,
      showHalfStars: true
    },
    {
      type: 'your-rating',
      value: userRating, // 0-100 scale
      onClick: handleOpenRatingModal,
      showStars: true,
      showHalfStars: true
    }
  ];

  return (
    <div className="vehicle-details">
      {/* Sticky Rate Bar - appears below header on load, becomes sticky when scrolling */}
      <StickyRateBar
        vehicleName={displayName}
        vehiclePath={`/vehicles/${decodedYear}/${decodedMake}/${decodedModel}`}
        ratings={stickyRatings}
        isVisible={isStickyBarVisible || !isStickyBarSticky}
        isSticky={isStickyBarSticky}
        barRef={stickyRateBarRef}
        staffRatingScores={vehicleData.scores}
        ratingDistribution={vehicleData.ratingDistribution}
        totalReviews={vehicleData.communityRatingCount}
      />
      {/* Spacer to prevent content jump when bar becomes sticky */}
      <div
        style={{
          height: isStickyBarSticky && stickyBarHeight > 0 ? `${stickyBarHeight}px` : '0px',
          transition: 'height 0s'
        }}
        aria-hidden="true"
      />

      {/* Prime Template: Full-width hero with score overlay */}
      {isPrimeTemplate && (
        <>
          <div ref={primeHeroRef} className="vehicle-details__prime-hero">
            <div
              className="vehicle-details__prime-hero-image"
              onClick={() => setIsGalleryOpen(true)}
              style={{ cursor: 'pointer' }}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  setIsGalleryOpen(true);
                }
              }}
              aria-label="Open photo gallery"
            >
              {galleryImages && galleryImages.length > 1 ? (
                galleryImages.map((image, index) => (
                  <img
                    key={index}
                    src={image}
                    alt={`${vehicleName} - Photo ${index + 1}`}
                    className={`vehicle-details__prime-hero-slide ${index === currentImageIndex ? 'vehicle-details__prime-hero-slide--active' : ''}`}
                  />
                ))
              ) : (
                <img 
                  src={galleryImages && galleryImages.length > 0 ? galleryImages[0] : vehicleData.image} 
                  alt={vehicleName}
                  className="vehicle-details__prime-hero-slide vehicle-details__prime-hero-slide--active"
                />
              )}
            </div>

            {/* Top Section Overlay (Breadcrumbs + Actions) */}
            <div className="vehicle-details__prime-top-overlay">
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
                <button
                  className="vehicle-details__rate-star-btn"
                  onClick={handleOpenRatingModal}
                  aria-label="Rate This Car"
                >
                  <img
                    src="https://d2kde5ohu8qb21.cloudfront.net/files/691bde5264217700021d6b71/star-stroke.svg"
                    alt="Rate"
                    className="vehicle-details__rate-star-icon"
                  />
                  <span className="vehicle-details__rate-star-tooltip">Rate This Car</span>
                </button>
                <ArticleReactions
                  articleSlug={`${decodedYear}-${decodedMake}-${decodedModel}`.toLowerCase()}
                  vehicleName={vehicleName}
                  showTooltipsBelow={true}
                />
                <button className={`vehicle-details__save-btn ${isSaved ? 'saved' : ''}`} onClick={handleSave}>
                  <Icon name="bookmark" variant={isSaved ? 'filled' : 'outlined'} size={20} />
                  <span>{isSaved ? 'Saved!' : 'Save'}</span>
                </button>
              </div>
            </div>

            {/* Score Overlay (Listicle Style) */}
            <div className="vehicle-details__prime-score-overlay">
              <span className="vehicle-details__prime-vehicle-name">{displayName}</span>
              <div className="vehicle-details__prime-ratings-list">
                <div className="vehicle-details__prime-rating-item">
                  <div className="vehicle-details__prime-rating-label-wrapper">
                    <span className="vehicle-details__prime-rating-label-top">MotorTrend</span>
                    <span className="vehicle-details__prime-rating-label-bottom">Rating</span>
                  </div>
                  <img
                    src="https://d2kde5ohu8qb21.cloudfront.net/files/692374f1d13f5100022ddf61/mticon.svg"
                    alt="MotorTrend"
                    className="vehicle-details__prime-rating-icon"
                  />
                  <span className="vehicle-details__prime-rating-value">{formatScore(vehicleData.staffRating)}</span>
                </div>
                <div className="vehicle-details__prime-rating-item vehicle-details__prime-rating-item--community">
                  <div className="vehicle-details__prime-rating-label-wrapper">
                    <span className="vehicle-details__prime-rating-label-top">Rating</span>
                    <span className="vehicle-details__prime-rating-label-bottom">Reviews</span>
                  </div>
                  <img
                    src="https://d2kde5ohu8qb21.cloudfront.net/files/691bde547554840002bab60c/star.svg"
                    alt="Community Rating Star"
                    className="vehicle-details__prime-rating-icon"
                  />
                  <span className="vehicle-details__prime-rating-value">
                    {(vehicleData.communityRating).toFixed(1)}
                  </span>
                </div>
              </div>
              <button
                className="vehicle-details__prime-cta"
                onClick={() => {
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

        </>
      )}

      {/* Content Layout */}
      <div className={`vehicle-details__content-layout ${isPrimeTemplate ? 'vehicle-details__content-layout--prime' : ''}`}>
        {/* Left Content */}
        <div className="vehicle-details__left-content">
          {/* Breadcrumbs, Social Icons, and Save Button (hidden for prime template) */}
          {!isPrimeTemplate && (
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
                <ArticleReactions
                  articleSlug={`${decodedYear}-${decodedMake}-${decodedModel}`.toLowerCase()}
                  vehicleName={vehicleName}
                />
              </div>
            </div>
          )}

          {/* Vehicle Title and Year Selection (hidden for prime template) */}
          {!isPrimeTemplate && (
            <div className="vehicle-details__title-section">
              <div className="vehicle-details__title-row">
                <h1 className="vehicle-details__title">
                  {displayName}
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
          )}

          {/* Ratings Section (hidden for prime template since ratings show on hero) */}
          {!isPrimeTemplate && (
            <div ref={ratingsBarRef} className="vehicle-details__rating-bar">
              {/* 1. MotorTrend Rating */}
              <Popover
                content={
                  <StaffRatingTooltip
                    overallRating={vehicleData.staffRating}
                    scores={vehicleData.scores}
                    onMouseEnter={handleStaffTooltipMouseEnter}
                    onMouseLeave={handleStaffTooltipMouseLeave}
                    onRequestClose={() => setIsStaffTooltipVisible(false)}
                  />
                }
                isOpen={isStaffTooltipVisible}
                onOpenChange={setIsStaffTooltipVisible}
                trigger="click"
                placement="bottom"
                className="staff-rating-tooltip-popover"
              >
                <div 
                  className="vehicle-details__rating-section vehicle-details__rating-section--motortrend" 
                  onClick={handleScrollToStaffRating}
                  onMouseEnter={handleStaffTooltipMouseEnter}
                  onMouseLeave={handleStaffTooltipMouseLeave}
                >
                  <div className="vehicle-details__rating-score-large">
                    {formatScore(vehicleData.staffRating)}
                    <span className="vehicle-details__rating-score-max">/10</span>
                  </div>
                  <div className="vehicle-details__rating-label-row">
                    <img
                      src="https://d2kde5ohu8qb21.cloudfront.net/files/692374f1d13f5100022ddf61/mticon.svg"
                      alt="MT"
                      className="vehicle-details__rating-mt-logo"
                    />
                    <span>MotorTrend Rating</span>
                  </div>
                </div>
              </Popover>

              {/* 2. User Reviews */}
              <Popover
                content={
                  <RatingDistributionTooltip
                    distribution={vehicleData.ratingDistribution}
                    totalReviews={vehicleData.communityRatingCount}
                    onMouseEnter={handleTooltipMouseEnter}
                    onMouseLeave={handleTooltipMouseLeave}
                    onRequestClose={() => setIsTooltipVisible(false)}
                  />
                }
                isOpen={isTooltipVisible}
                onOpenChange={setIsTooltipVisible}
                trigger="click"
                placement="bottom"
                className="rating-tooltip-popover"
              >
                <div 
                  className="vehicle-details__rating-section vehicle-details__rating-section--community" 
                  onClick={handleScrollToCommunityRatings}
                  onMouseEnter={handleTooltipMouseEnter}
                  onMouseLeave={handleTooltipMouseLeave}
                >
                  <div className="vehicle-details__rating-stars">
                    {[1, 2, 3, 4, 5].map((star) => {
                      const userRatingValue = vehicleData.communityRating / 2;
                      const isFilled = star < Math.ceil(userRatingValue);
                      const isHalf = star === Math.ceil(userRatingValue) && userRatingValue % 1 !== 0;
                      return (
                        <div key={star} className={`vehicle-details__rating-star-wrapper ${isHalf ? 'vehicle-details__rating-star-wrapper--half' : ''}`}>
                          {/* Outline star */}
                          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="vehicle-details__rating-star--outline">
                            <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"
                              fill="none"
                              stroke="#33C4FF"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                          {/* Filled star (full or half) */}
                          {isFilled && (
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="vehicle-details__rating-star--filled">
                              <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"
                                fill="#33C4FF"
                              />
                            </svg>
                          )}
                          {isHalf && (
                            <div className="vehicle-details__rating-star-half-fill">
                              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"
                                  fill="#33C4FF"
                                />
                              </svg>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                  <div className="vehicle-details__rating-text">
                    User Reviews <span className="vehicle-details__rating-highlight">({(vehicleData.communityRating / 2) % 1 === 0 ? vehicleData.communityRating / 2 : (vehicleData.communityRating / 2).toFixed(1)}/5)</span>
                  </div>
                </div>
              </Popover>

              {/* 3. Your Rating */}
              <div className="vehicle-details__rating-section vehicle-details__rating-section--user">
                <div className="vehicle-details__rating-stars vehicle-details__rating-stars--interactive">
                  {[1, 2, 3, 4, 5].map((star) => {
                    const userRatingValue = userRating / 20;
                    const isFilled = star < Math.ceil(userRatingValue);
                    const isHalf = star === Math.ceil(userRatingValue) && userRatingValue % 1 !== 0;
                    return (
                      <button
                        key={star}
                        className="vehicle-details__star-btn"
                        onClick={() => handleOpenRatingModal()}
                        aria-label={`Rate ${star} stars`}
                      >
                        <div className={`vehicle-details__rating-star-wrapper ${isHalf ? 'vehicle-details__rating-star-wrapper--half' : ''}`}>
                          {/* Outline star */}
                          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="vehicle-details__rating-star--outline">
                            <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"
                              fill="none"
                              stroke="#33C4FF"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                          {/* Filled star (full or half) */}
                          {isFilled && (
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="vehicle-details__rating-star--filled">
                              <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"
                                fill="#33C4FF"
                              />
                            </svg>
                          )}
                          {isHalf && (
                            <div className="vehicle-details__rating-star-half-fill">
                              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"
                                  fill="#33C4FF"
                                />
                              </svg>
                            </div>
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
                <div className="vehicle-details__rating-text">
                  Rate This Vehicle{userRating > 0 && <span className="vehicle-details__rating-highlight"> ({(userRating / 20) % 1 === 0 ? (userRating / 20) : (userRating / 20).toFixed(1)}/5)</span>}
                </div>
              </div>
            </div>
          )}
          {/* Hero Image (hidden for prime template) */}
          {!isPrimeTemplate && (
            <div className="vehicle-details__hero">
              <div 
                className="vehicle-details__hero-image"
                onClick={() => setIsGalleryOpen(true)}
                style={{ cursor: 'pointer' }}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    setIsGalleryOpen(true);
                  }
                }}
                aria-label="Open photo gallery"
              >
                {galleryImages && galleryImages.length > 1 ? (
                  galleryImages.map((image, index) => (
                    <img
                      key={index}
                      src={image}
                      alt={`${vehicleName} - Photo ${index + 1}`}
                      className={`vehicle-details__hero-slide ${index === currentImageIndex ? 'vehicle-details__hero-slide--active' : ''}`}
                    />
                  ))
                ) : (
                  <img 
                    src={galleryImages && galleryImages.length > 0 ? galleryImages[0] : vehicleData.image} 
                    alt={vehicleName}
                    className="vehicle-details__hero-slide vehicle-details__hero-slide--active"
                  />
                )}
              </div>
            </div>
          )}

          {/* Price and Actions */}
          <div className="vehicle-details__price-section">
            <div className="vehicle-details__price">
              <span className="vehicle-details__price-range">{vehicleData.priceRange}</span>
              <Icon name="keyboard_arrow_down" size={20} />
            </div>
            <div className="vehicle-details__actions">
              <button
                className="vehicle-details__action-btn"
                onClick={() => setIsGalleryOpen(true)}
              >
                <Icon name="photo_library" size={20} />
                <span>{galleryImages.length} Photos</span>
              </button>
              <button className="vehicle-details__action-btn">
                <Icon name="list" size={20} />
                <span>Specs</span>
              </button>
              <button className={`vehicle-details__action-btn ${isSaved ? 'saved' : ''}`} onClick={handleSave}>
                <Icon name="bookmark" variant={isSaved ? 'filled' : 'outlined'} size={20} />
                <span>{isSaved ? 'Saved!' : 'Save'}</span>
              </button>
              {!isPrimeTemplate && (
                <button className="vehicle-details__cta-primary">
                  <Icon name="search" size={20} />
                  <span>See Local Listings</span>
                </button>
              )}
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
                    <span className="vehicle-details__score-number">{formatScore(vehicleData.staffRating)}</span>
                    <div className="vehicle-details__score-label-row">
                      <img 
                        src="https://d2kde5ohu8qb21.cloudfront.net/files/692374f1d13f5100022ddf61/mticon.svg" 
                        alt="MotorTrend" 
                        className="vehicle-details__score-mt-badge" 
                      />
                      <span className="vehicle-details__score-label">MotorTrend Rating</span>
                    </div>
                  </div>
                </div>
                <div className="vehicle-details__score-breakdown">
                  <div className="vehicle-details__score-item">
                    <span>Performance</span>
                    <div className="vehicle-details__score-bar">
                      <div className="vehicle-details__score-bar-fill" style={{ width: `${(parseFloat(formatScore(vehicleData.scores.performance)) / 10) * 100}%` }}></div>
                    </div>
                    <span>{formatScore(vehicleData.scores.performance)}</span>
                  </div>
                  <div className="vehicle-details__score-item">
                    <span>Efficiency/Range</span>
                    <div className="vehicle-details__score-bar">
                      <div className="vehicle-details__score-bar-fill" style={{ width: `${(parseFloat(formatScore(vehicleData.scores.efficiency)) / 10) * 100}%` }}></div>
                    </div>
                    <span>{formatScore(vehicleData.scores.efficiency)}</span>
                  </div>
                  <div className="vehicle-details__score-item">
                    <span>Tech/Innovation</span>
                    <div className="vehicle-details__score-bar">
                      <div className="vehicle-details__score-bar-fill" style={{ width: `${(parseFloat(formatScore(vehicleData.scores.tech)) / 10) * 100}%` }}></div>
                    </div>
                    <span>{formatScore(vehicleData.scores.tech)}</span>
                  </div>
                  <div className="vehicle-details__score-item">
                    <span>Value</span>
                    <div className="vehicle-details__score-bar">
                      <div className="vehicle-details__score-bar-fill" style={{ width: `${(parseFloat(formatScore(vehicleData.scores.value)) / 10) * 100}%` }}></div>
                    </div>
                    <span>{formatScore(vehicleData.scores.value)}</span>
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
                            src="https://d2kde5ohu8qb21.cloudfront.net/files/692374f1d13f5100022ddf61/mticon.svg"
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

          {/* Photo Gallery Bento (Show when 3+ photos available) */}
          {galleryImages.length >= 3 && (
            <div className="vehicle-details__photo-gallery-bento">
              <div className="vehicle-details__photo-gallery-header">
                <h3 className="vehicle-details__photo-gallery-title">Photo Gallery</h3>
                <button
                  className="vehicle-details__photo-gallery-view-all cta cta--ghost cta--default"
                  onClick={() => setIsGalleryOpen(true)}
                >
                  View All Photos
                </button>
              </div>
              <div className="vehicle-details__photo-gallery-grid">
                {galleryImages.slice(0, 6).map((image: string, index: number) => (
                  <div
                    key={index}
                    className={`vehicle-details__photo-gallery-item vehicle-details__photo-gallery-item--${index === 0 ? 'large' : index < 3 ? 'medium' : 'small'}`}
                    onClick={() => setIsGalleryOpen(true)}
                  >
                    <img
                      src={image}
                      alt={`${displayName} - Photo ${index + 1}`}
                      className="vehicle-details__photo-gallery-thumb"
                    />
                    <div className="vehicle-details__photo-gallery-overlay">
                      <Icon name="open_in_full" size={24} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

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

          {/* Photo Gallery Bento (for 2025 Subaru Forester) */}
          {decodedYear === '2025' && decodedMake === 'Subaru' && decodedModel === 'Forester' && galleryImages.length > 1 && (
            <div className="vehicle-details__photo-gallery-bento">
              <div className="vehicle-details__photo-gallery-header">
                <h3 className="vehicle-details__photo-gallery-title">Photo Gallery</h3>
                <button
                  className="vehicle-details__photo-gallery-view-all cta cta--ghost cta--default"
                  onClick={() => setIsGalleryOpen(true)}
                >
                  View All Photos
                </button>
              </div>
              <div className="vehicle-details__photo-gallery-grid">
                {galleryImages.slice(0, 6).map((image: string, index: number) => (
                  <div
                    key={index}
                    className={`vehicle-details__photo-gallery-item vehicle-details__photo-gallery-item--${index === 0 ? 'large' : index < 3 ? 'medium' : 'small'}`}
                    onClick={() => setIsGalleryOpen(true)}
                  >
                    <img
                      src={image}
                      alt={`${displayName} - Photo ${index + 1}`}
                      className="vehicle-details__photo-gallery-thumb"
                    />
                    <div className="vehicle-details__photo-gallery-overlay">
                      <Icon name="open_in_full" size={24} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* User Reviews */}
          <div id="community-ratings">
            <UserReviews
              vehicleName={vehicleName}
              communityRating={vehicleData.communityRating}
              totalReviews={communityRatingCount}
              ratingDistribution={[
                vehicleData.ratingCounts[1],
                vehicleData.ratingCounts[2],
                vehicleData.ratingCounts[3],
                vehicleData.ratingCounts[4],
                vehicleData.ratingCounts[5]
              ]}
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
          {/* Local Listings Sidebar */}
          <LocalListingsSidebar
            vehicleName={`${decodedMake} ${decodedModel.replace(/-/g, ' ')}`}
            listings={localListings}
            onViewAllListings={() => {
              console.log('View all listings clicked');
              // TODO: Navigate to listings page or open modal
            }}
          />

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

      {/* Photo Gallery */}
      <PhotoGallery
        key={currentGalleryImages.length > 0 ? currentGalleryImages[0] : galleryImages[0] || 'gallery'}
        images={currentGalleryImages.length > 0 ? currentGalleryImages : galleryImages}
        isOpen={isGalleryOpen}
        onClose={() => {
          setIsGalleryOpen(false);
          // Reset to original gallery images when closing
          setCurrentGalleryImages(galleryImages);
        }}
        initialIndex={0}
        vehicleName={displayName}
        localListings={localListings}
        onViewAllListings={() => {
          console.log('View all listings clicked from gallery');
          // TODO: Navigate to listings page or open modal
        }}
        onListingClick={(listing) => {
          // When a listing is clicked in the gallery, update the gallery images
          const listingPhotos = listing.photoUrls || [listing.imageUrl];
          if (listingPhotos.length > 0) {
            setCurrentGalleryImages(listingPhotos);
          }
        }}
      />

    </div>
  );
};

export default VehicleDetails;

