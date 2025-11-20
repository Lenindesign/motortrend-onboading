/**
 * Vehicle Inventory Page
 * Index page showing makes and models with sorting and filtering
 */

import React, { useState, useMemo, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { VehicleCard } from '../../components/VehicleCard';
import { vehicleImageFor, parseVehicleName } from '../../utils/vehicleImages';
import { generateStaffRating, generateCommunityRating } from '../../utils/vehicleRatings';
import { LIFESTYLE_CATEGORIES, type LifestyleCategory, filterVehiclesByLifestyle } from '../../utils/vehicleLifestyles';
import { PRICE_RANGE_CATEGORIES, type PriceRangeCategory, filterVehiclesByPriceRange } from '../../utils/vehiclePriceRanges';
import { BODY_STYLE_CATEGORIES, type BodyStyleCategory, filterVehiclesByBodyStyle } from '../../utils/vehicleBodyStyles';
import Icon from '../../components/Icon';
import RatingModal from '../../components/RatingModal';
import WriteReviewModal from '../../components/WriteReviewModal';
import ReviewSubmittedToast from '../../components/ReviewSubmittedToast';
import SavedModal from '../../components/SavedModal';
import { useRating } from '../../contexts/RatingContext';
import { type ReviewData } from '../../components/UserReviews';
import { carDatabase } from '../../utils/vehicleDatabase';
import './VehicleInventory.css';

interface Vehicle {
  id: string;
  name: string;
  year: string;
  make: string;
  model: string;
  image: string;
  createdDate?: Date; // For sorting by latest
  staffRating: number;
  communityRating: number;
}


export const VehicleInventory: React.FC = () => {
  const navigate = useNavigate();
  // Always default to 'latest' with 'desc' order (newest first)
  const [sortBy, setSortBy] = useState<'latest' | 'year' | 'make' | 'model' | 'rating'>('latest');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [selectedLifestyle, setSelectedLifestyle] = useState<LifestyleCategory | null>(null);
  const [isLifestyleDropdownOpen, setIsLifestyleDropdownOpen] = useState(false);
  const [selectedPriceRange, setSelectedPriceRange] = useState<PriceRangeCategory | null>(null);
  const [isPriceRangeDropdownOpen, setIsPriceRangeDropdownOpen] = useState(false);
  const [selectedBodyStyle, setSelectedBodyStyle] = useState<BodyStyleCategory | null>(null);
  const [isBodyStyleDropdownOpen, setIsBodyStyleDropdownOpen] = useState(false);
  const [selectedMake, setSelectedMake] = useState<string | null>(null);
  const [isMakeDropdownOpen, setIsMakeDropdownOpen] = useState(false);
  const [selectedYear, setSelectedYear] = useState<string | null>(null);
  const [isYearDropdownOpen, setIsYearDropdownOpen] = useState(false);
  const [selectedModel, setSelectedModel] = useState<string | null>(null);
  const [isModelDropdownOpen, setIsModelDropdownOpen] = useState(false);
  
  // Check onboarding userType and set default lifestyle filter
  useEffect(() => {
    try {
      const onboardingData = localStorage.getItem('onboardingData');
      if (onboardingData) {
        const data = JSON.parse(onboardingData);
        if (data.userType) {
          // Set default lifestyle filter based on userType
          if (data.userType === 'buyer') {
            setSelectedLifestyle('Family & Practical');
          } else if (data.userType === 'enthusiast') {
            setSelectedLifestyle('Performance & Enthusiast');
          } else if (data.userType === 'both') {
            // Both selected - no filter, show everything
            setSelectedLifestyle(null);
          }
        }
      }
    } catch (error) {
      console.error('Error loading onboarding userType:', error);
    }
    
    // Ensure default sort is always 'latest' descending
    setSortBy('latest');
    setSortOrder('desc');
  }, []);
  
  const [isRatingModalOpen, setIsRatingModalOpen] = useState(false);
  const [isWriteReviewModalOpen, setIsWriteReviewModalOpen] = useState(false);
  const [isToastVisible, setIsToastVisible] = useState(false);
  const [ratingVehicle, setRatingVehicle] = useState<string>('');
  const [reviewVehicleImage, setReviewVehicleImage] = useState<string>('');
  const [reviewedVehicleName, setReviewedVehicleName] = useState<string>('');
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);
  const [reviewModalRating, setReviewModalRating] = useState<number | undefined>(undefined);
  const [savedVehicles, setSavedVehicles] = useState<Set<string>>(new Set());
  const [isSavedModalOpen, setIsSavedModalOpen] = useState(false);
  const [savedVehicleName, setSavedVehicleName] = useState<string>('');
  const { getUserRating, setUserRating } = useRating();
  
  // Use a ref to persist the vehicle name even if state is cleared
  const ratingVehicleRef = useRef<string>('');
  const reviewVehicleImageRef = useRef<string>('');
  
  // Keep ref in sync with state whenever ratingVehicle changes
  useEffect(() => {
    if (ratingVehicle && ratingVehicle.trim() !== '') {
      ratingVehicleRef.current = ratingVehicle;
      console.log('VehicleInventory: Updated ratingVehicleRef to:', ratingVehicle);
    }
  }, [ratingVehicle]);
  
  // Keep image ref in sync with state
  useEffect(() => {
    if (reviewVehicleImage && reviewVehicleImage.trim() !== '') {
      reviewVehicleImageRef.current = reviewVehicleImage;
    }
  }, [reviewVehicleImage]);

  // Load saved vehicles from localStorage (read-only - don't overwrite existing vehicles)
  useEffect(() => {
    try {
      const onboardingData = localStorage.getItem('onboardingData');
      if (onboardingData) {
        const data = JSON.parse(onboardingData);
        if (data.vehicles && Array.isArray(data.vehicles)) {
          const saved = new Set<string>(data.vehicles.map((v: { name: string }) => v.name as string));
          setSavedVehicles(saved);
        }
      }
    } catch (error) {
      console.error('Error loading saved vehicles:', error);
    }
  }, []);

  // Listen for onboarding data updates (when vehicles are saved from other pages)
  useEffect(() => {
    const handleOnboardingDataUpdate = () => {
      try {
        const onboardingData = localStorage.getItem('onboardingData');
        if (onboardingData) {
          const data = JSON.parse(onboardingData);
          if (data.vehicles && Array.isArray(data.vehicles)) {
            const saved = new Set<string>(data.vehicles.map((v: { name: string }) => v.name as string));
            setSavedVehicles(saved);
          }
        }
      } catch (error) {
        console.error('Error loading saved vehicles on update:', error);
      }
    };

    window.addEventListener('onboardingDataUpdated', handleOnboardingDataUpdate);
    
    return () => {
      window.removeEventListener('onboardingDataUpdated', handleOnboardingDataUpdate);
    };
  }, []);

  // Handle bookmark changes and merge with existing saved vehicles in localStorage (don't overwrite)
  const handleBookmarkChange = (vehicleName: string, isBookmarked: boolean) => {
    // Merge with existing vehicles in localStorage (don't overwrite)
    try {
      const onboardingData = localStorage.getItem('onboardingData');
      const data = onboardingData ? JSON.parse(onboardingData) : {};
      
      if (!data.vehicles || !Array.isArray(data.vehicles)) {
        data.vehicles = [];
      }

      if (isBookmarked) {
        // Add vehicle if not already present
        const exists = data.vehicles.some((v: { name: string }) => 
          v && v.name && v.name.trim().toLowerCase() === vehicleName.trim().toLowerCase()
        );
        if (!exists) {
          data.vehicles.push({
            name: vehicleName.trim(),
            ownership: 'want'
          });
        }
      } else {
        // Remove vehicle
        data.vehicles = data.vehicles.filter((v: { name: string }) => 
          v && v.name && v.name.trim().toLowerCase() !== vehicleName.trim().toLowerCase()
        );
      }

      localStorage.setItem('onboardingData', JSON.stringify(data));
      window.dispatchEvent(new CustomEvent('onboardingDataUpdated', { 
        detail: { vehicles: data.vehicles }
      }));
    } catch (error) {
      console.error('Error saving vehicle bookmark:', error);
    }
  };

  // Parse vehicle database into structured format with proper publication dates
  const vehicles: Vehicle[] = useMemo(() => {
    return carDatabase.map((vehicleName, index) => {
      const parsed = parseVehicleName(vehicleName);
      // Decode URL-encoded values
      const year = decodeURIComponent(parsed.year);
      const make = decodeURIComponent(parsed.make);
      const model = decodeURIComponent(parsed.model);
      
      // Generate publication date based on year, make, and model
      // Newer years get more recent dates, and we add variation based on make/model hash
      const currentYear = new Date().getFullYear();
      const vehicleYear = parseInt(year) || currentYear;
      
      // Create a deterministic hash from make and model for consistent date variation
      const makeModelHash = (make + model).split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
      
      // Publication date: vehicles are typically published in the year before the model year
      // For example, 2024 models are published in late 2023
      // We'll use: (year - 1) as the base year, with month/day variation based on make/model
      const publicationYear = Math.max(vehicleYear - 1, 2019);
      const month = (makeModelHash % 12) + 1; // 1-12
      const day = (makeModelHash % 28) + 1; // 1-28 to ensure valid dates
      const hour = (makeModelHash % 24); // 0-23
      const minute = (makeModelHash % 60); // 0-59
      
      const createdDate = new Date(publicationYear, month - 1, day, hour, minute);
      
      // Generate consistent ratings for this vehicle
      const staffRating = generateStaffRating(vehicleName);
      const communityRating = generateCommunityRating(vehicleName);
      
      return {
        id: `vehicle-${index}`,
        name: vehicleName,
        year: year,
        make: make,
        model: model,
        image: vehicleImageFor(vehicleName),
        createdDate,
        staffRating,
        communityRating
      };
    });
  }, []);

  // Get unique makes from vehicles
  const uniqueMakes = useMemo(() => {
    const makes = new Set<string>();
    vehicles.forEach(vehicle => {
      if (vehicle.make) {
        makes.add(vehicle.make);
      }
    });
    return Array.from(makes).sort();
  }, [vehicles]);
  
  // Get last 10 years (latest first)
  const availableYears = useMemo(() => {
    const currentYear = new Date().getFullYear();
    return Array.from({ length: 10 }, (_, i) => String(currentYear - i));
  }, []);
  
  // Get unique models for selected make
  const availableModels = useMemo(() => {
    if (!selectedMake) return [];
    const models = new Set<string>();
    vehicles.forEach(vehicle => {
      if (vehicle.make === selectedMake && vehicle.model) {
        models.add(vehicle.model);
      }
    });
    return Array.from(models).sort();
  }, [vehicles, selectedMake]);
  
  // Clear model selection when make changes
  useEffect(() => {
    if (!selectedMake) {
      setSelectedModel(null);
    }
  }, [selectedMake]);

  // Filter by lifestyle, price range, body style, make, year, and model first, then sort vehicles based on selected option
  const sortedVehicles = useMemo(() => {
    // First filter by lifestyle if one is selected
    let filtered = selectedLifestyle 
      ? filterVehiclesByLifestyle(vehicles, selectedLifestyle)
      : vehicles;
    
    // Then filter by price range if one is selected
    filtered = selectedPriceRange
      ? filterVehiclesByPriceRange(filtered, selectedPriceRange)
      : filtered;
    
    // Then filter by body style if one is selected
    filtered = selectedBodyStyle
      ? filterVehiclesByBodyStyle(filtered, selectedBodyStyle)
      : filtered;
    
    // Then filter by make if one is selected
    filtered = selectedMake
      ? filtered.filter(vehicle => vehicle.make === selectedMake)
      : filtered;
    
    // Then filter by year if one is selected
    filtered = selectedYear
      ? filtered.filter(vehicle => vehicle.year === selectedYear)
      : filtered;
    
    // Then filter by model if one is selected
    filtered = selectedModel
      ? filtered.filter(vehicle => vehicle.model === selectedModel)
      : filtered;
    
    const sorted = [...filtered];

    switch (sortBy) {
      case 'latest':
        sorted.sort((a, b) => {
          // Sort by publication date (createdDate) - newest first
          // If dates are the same, use year as tiebreaker, then make/model
          const dateA = a.createdDate?.getTime() || 0;
          const dateB = b.createdDate?.getTime() || 0;
          
          if (dateA !== dateB) {
            return sortOrder === 'desc' ? dateB - dateA : dateA - dateB;
          }
          
          // If dates are equal, sort by year
          const yearA = parseInt(a.year) || 0;
          const yearB = parseInt(b.year) || 0;
          if (yearA !== yearB) {
            return sortOrder === 'desc' ? yearB - yearA : yearA - yearB;
          }
          
          // Secondary sort by make, then model
          const makeA = a.make.toLowerCase();
          const makeB = b.make.toLowerCase();
          if (makeA !== makeB) {
            return makeA.localeCompare(makeB);
          }
          return a.model.toLowerCase().localeCompare(b.model.toLowerCase());
        });
        break;

      case 'year':
        sorted.sort((a, b) => {
          const yearA = parseInt(a.year) || 0;
          const yearB = parseInt(b.year) || 0;
          if (yearA === yearB) {
            // Secondary sort by make, then model
            const makeA = a.make.toLowerCase();
            const makeB = b.make.toLowerCase();
            if (makeA !== makeB) {
              return makeA.localeCompare(makeB);
            }
            return a.model.toLowerCase().localeCompare(b.model.toLowerCase());
          }
          return sortOrder === 'desc' ? yearB - yearA : yearA - yearB;
        });
        break;

      case 'make':
        sorted.sort((a, b) => {
          const makeA = a.make.toLowerCase();
          const makeB = b.make.toLowerCase();
          return sortOrder === 'desc' 
            ? makeB.localeCompare(makeA) 
            : makeA.localeCompare(makeB);
        });
        break;

      case 'model':
        sorted.sort((a, b) => {
          const modelA = a.model.toLowerCase();
          const modelB = b.model.toLowerCase();
          return sortOrder === 'desc' 
            ? modelB.localeCompare(modelA) 
            : modelA.localeCompare(modelB);
        });
        break;

      case 'rating':
        sorted.sort((a, b) => {
          // Sort by MotorTrend rating first, then community rating as tiebreaker
          if (a.staffRating !== b.staffRating) {
            return sortOrder === 'desc' 
              ? b.staffRating - a.staffRating 
              : a.staffRating - b.staffRating;
          }
          // If MotorTrend ratings are equal, sort by community rating
          return sortOrder === 'desc' 
            ? b.communityRating - a.communityRating 
            : a.communityRating - b.communityRating;
        });
        break;
    }

    return sorted;
  }, [vehicles, sortBy, sortOrder, selectedLifestyle, selectedPriceRange, selectedBodyStyle, selectedMake, selectedYear, selectedModel]);

  // Get latest 5 vehicles for hero slider based on filtered/sorted vehicles
  // Priority: Show vehicles marked as "want" from onboarding step 3 first, then fill remaining slots
  const latestVehicles = useMemo(() => {
    // Get "want" vehicles from onboarding step 3 (vehicles Paola might want to buy)
    let onboardingWantVehicles: Vehicle[] = [];
    try {
      const onboardingData = localStorage.getItem('onboardingData');
      if (onboardingData) {
        const data = JSON.parse(onboardingData);
        if (data.vehicles && Array.isArray(data.vehicles) && data.vehicles.length > 0) {
          // Filter for only "want" vehicles (vehicles user wants to buy)
          const wantVehicles = data.vehicles.filter((v: { name: string; ownership?: string }) => 
            v.ownership === 'want'
          );
          
          // Find matching vehicles from the vehicles array
          const wantVehicleNames = wantVehicles.map((v: { name: string }) => v.name.trim().toLowerCase());
          onboardingWantVehicles = vehicles.filter(v => 
            wantVehicleNames.includes(v.name.trim().toLowerCase())
          );
          
          // Sort "want" vehicles by latest (newest first)
          onboardingWantVehicles.sort((a, b) => {
            const dateA = a.createdDate?.getTime() || 0;
            const dateB = b.createdDate?.getTime() || 0;
            return dateB - dateA; // Newest first
          });
        }
      }
    } catch (error) {
      console.error('Error loading onboarding want vehicles:', error);
    }
    
    // Get base vehicles to fill remaining slots
    let baseVehicles: Vehicle[];
    if (selectedLifestyle) {
      // Use filtered vehicles (already sorted by latest)
      baseVehicles = sortedVehicles;
    } else {
      // No filter - sort all vehicles by latest
      baseVehicles = [...vehicles];
      baseVehicles.sort((a, b) => {
        const dateA = a.createdDate?.getTime() || 0;
        const dateB = b.createdDate?.getTime() || 0;
        return dateB - dateA; // Newest first
      });
    }
    
    // Remove "want" vehicles from base vehicles to avoid duplicates
    const wantVehicleNames = onboardingWantVehicles.map(v => v.name.trim().toLowerCase());
    const remainingVehicles = baseVehicles.filter(v => 
      !wantVehicleNames.includes(v.name.trim().toLowerCase())
    );
    
    // Combine: "want" vehicles from onboarding first (vehicles Paola wants to buy), 
    // then remaining vehicles to fill up to 5 slots
    const combined = [...onboardingWantVehicles, ...remainingVehicles];
    
    // Return first 5 vehicles
    return combined.slice(0, 5);
  }, [sortedVehicles, vehicles, selectedLifestyle]);

  // Hero slider state
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isSliderHovered, setIsSliderHovered] = useState(false);

  // Auto-advance slider (pauses on hover)
  useEffect(() => {
    if (latestVehicles.length > 1 && !isSliderHovered) {
      const interval = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % latestVehicles.length);
      }, 5000); // Change slide every 5 seconds

      return () => clearInterval(interval);
    }
  }, [latestVehicles.length, isSliderHovered]);

  const handleSortChange = (newSortBy: 'latest' | 'year' | 'make' | 'model' | 'rating') => {
    if (sortBy === newSortBy) {
      // Toggle sort order if clicking same option
      setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(newSortBy);
      // Default to descending for 'rating' (best rated first), descending for 'latest', ascending for others
      setSortOrder(newSortBy === 'rating' || newSortBy === 'latest' ? 'desc' : 'asc');
    }
  };

  const handleClearFilters = () => {
    setSelectedLifestyle(null);
    setSelectedPriceRange(null);
    setSelectedBodyStyle(null);
    setSelectedMake(null);
    setSelectedYear(null);
    setSelectedModel(null);
    // Close all dropdowns
    setIsLifestyleDropdownOpen(false);
    setIsPriceRangeDropdownOpen(false);
    setIsBodyStyleDropdownOpen(false);
    setIsMakeDropdownOpen(false);
    setIsYearDropdownOpen(false);
    setIsModelDropdownOpen(false);
  };

  // Check if any filters are active
  const hasActiveFilters = selectedLifestyle || selectedPriceRange || selectedBodyStyle || selectedMake || selectedYear || selectedModel;

  const handleVehicleClick = (vehicle: Vehicle) => {
    const { year, make, model } = parseVehicleName(vehicle.name);
    navigate(`/vehicles/${year}/${make}/${model}`);
  };

  const handleRateVehicle = (vehicleName: string) => {
    setRatingVehicle(vehicleName);
    ratingVehicleRef.current = vehicleName; // Store in ref
    // Find the vehicle to get its image for the review modal
    const vehicle = vehicles.find(v => v.name === vehicleName);
    if (vehicle) {
      setReviewVehicleImage(vehicle.image);
      reviewVehicleImageRef.current = vehicle.image; // Store in ref
    }
    setIsRatingModalOpen(true);
  };

  const handleRatingSubmit = (rating: number) => {
    if (ratingVehicle) {
      setUserRating(ratingVehicle, rating);
    }
    setIsRatingModalOpen(false);
    setRatingVehicle('');
  };

  const handleRateAndReview = (rating: number) => {
    const currentVehicleName = ratingVehicle;
    console.log('VehicleInventory: handleRateAndReview called with rating:', rating, 'for vehicle:', currentVehicleName);
    // Save the rating first
    if (currentVehicleName) {
      setUserRating(currentVehicleName, rating);
      console.log('VehicleInventory: Saved rating to context');
      // Ensure ref is up to date
      ratingVehicleRef.current = currentVehicleName;
    }
    // Store the rating to pass directly to write review modal
    // Set state immediately - React will batch this update
    setReviewModalRating(rating);
    console.log('VehicleInventory: Set reviewModalRating to:', rating);
    // Close rating modal first
    setIsRatingModalOpen(false);
    // Use requestAnimationFrame + setTimeout to ensure state is updated before opening modal
    requestAnimationFrame(() => {
      setTimeout(() => {
        // Capture rating in closure to ensure we pass the correct value
        console.log('VehicleInventory: Opening write review modal with rating:', rating, 'vehicle:', currentVehicleName);
        // Force update reviewModalRating one more time to ensure it's set
        setReviewModalRating(rating);
    setIsWriteReviewModalOpen(true);
      }, 0);
    });
  };

  const handleCloseRatingModal = () => {
    setIsRatingModalOpen(false);
    setRatingVehicle('');
  };

  const handleSubmitReview = (newReview: ReviewData) => {
    // Try multiple sources for vehicle name (in order of reliability):
    // 1. reviewedVehicleName (set by onSubmit handler)
    // 2. ratingVehicle (state)
    // 3. ratingVehicleRef.current (ref - most reliable, persists even if state is cleared)
    const vehicleNameToShow = reviewedVehicleName || ratingVehicle || ratingVehicleRef.current;
    
    console.log('VehicleInventory: handleSubmitReview called');
    console.log('  - reviewedVehicleName:', reviewedVehicleName);
    console.log('  - ratingVehicle (state):', ratingVehicle);
    console.log('  - ratingVehicleRef.current (ref):', ratingVehicleRef.current);
    console.log('  - FINAL vehicleNameToShow:', vehicleNameToShow);
    console.log('  - review:', newReview);
    
    if (vehicleNameToShow && vehicleNameToShow.trim() !== '') {
      // Convert File objects to preview URLs for display
      const reviewWithPreviews: ReviewData = {
        ...newReview,
        mediaPreviews: newReview.mediaFiles?.map((file: File) => URL.createObjectURL(file)) || []
      };
      
      // Save review to localStorage so it appears on the vehicle details page
      try {
        const savedReviewsKey = `vehicleReviews_${vehicleNameToShow}`;
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
        console.log('VehicleInventory: Saved review to localStorage for:', vehicleNameToShow);
      } catch (error) {
        console.error('VehicleInventory: Error saving review to localStorage:', error);
      }
      
      console.log('VehicleInventory: Setting modal visible for:', vehicleNameToShow);
      // Ensure vehicle name is saved (it should already be set by onSubmit handler, but double-check)
      if (!reviewedVehicleName || reviewedVehicleName !== vehicleNameToShow) {
      setReviewedVehicleName(vehicleNameToShow);
      }
      
      // Close the write review modal first
      setIsWriteReviewModalOpen(false);
      
      // Show success modal after a delay to ensure write review modal is fully closed
      // Use requestAnimationFrame for better timing
      requestAnimationFrame(() => {
      setTimeout(() => {
          console.log('VehicleInventory: Setting isToastVisible to true for vehicle:', vehicleNameToShow);
        setIsToastVisible(true);
        setIsSubmittingReview(false);
          console.log('VehicleInventory: Success modal should be visible now, vehicleName:', vehicleNameToShow);
      }, 300);
      });
    } else {
      console.warn('VehicleInventory: No vehicle name found when submitting review');
      // If no vehicle name, just close the modal
      setIsWriteReviewModalOpen(false);
      setIsSubmittingReview(false);
    }
  };

  const handleCloseWriteReviewModal = () => {
    // Don't clear state if a review was just submitted or is about to be submitted
    // handleSubmitReview will handle showing the success modal
    // Only clear if we're not in the process of submitting a review
    if (!isSubmittingReview && !isToastVisible && !reviewedVehicleName) {
      // Only clear if modal was closed without submitting a review
      setRatingVehicle('');
      setReviewVehicleImage('');
    }
    // Clear the rating when modal closes
    setReviewModalRating(undefined);
  };

  const handleViewReview = () => {
    const vehicleName = reviewedVehicleName || ratingVehicle;
    if (vehicleName) {
      const vehicle = vehicles.find(v => v.name === vehicleName);
      if (vehicle) {
        const { year, make, model } = parseVehicleName(vehicleName);
        setIsToastVisible(false);
        setReviewedVehicleName('');
        // Clear rating vehicle after navigation
        setRatingVehicle('');
        setReviewVehicleImage('');
        // Navigate to vehicle details page where the review will be visible
        navigate(`/vehicles/${encodeURIComponent(year)}/${encodeURIComponent(make)}/${encodeURIComponent(model)}`);
      }
    }
  };

  const handleCloseToast = () => {
    setIsToastVisible(false);
    setReviewedVehicleName('');
    // Clear rating vehicle and image after modal is closed
    setRatingVehicle('');
    setReviewVehicleImage('');
    setIsSubmittingReview(false);
  };

  const handleBookmark = (vehicleName: string) => {
    const isCurrentlyBookmarked = savedVehicles.has(vehicleName);
    const newBookmarkState = !isCurrentlyBookmarked;
    
    // Update local state immediately
    setSavedVehicles(prev => {
      const updated = new Set(prev);
      if (newBookmarkState) {
        updated.add(vehicleName);
      } else {
        updated.delete(vehicleName);
      }
      return updated;
    });

    // Merge with existing vehicles in localStorage (don't overwrite)
    handleBookmarkChange(vehicleName, newBookmarkState);
    
    // Show saved modal only when saving (not when unsaving)
    if (newBookmarkState) {
      setSavedVehicleName(vehicleName);
      setIsSavedModalOpen(true);
    }
  };

  // Helper function to render star rating (0-10 scale, displays as 0-5 stars)
  const renderStarRating = (ratingValue: number) => {
    // ratingValue is already on 0-10 scale, convert to 0-5 scale for display
    const normalizedRating = ratingValue / 2;
    
    return (
      <div className="vehicle-inventory__hero-rating-stars">
        {[1, 2, 3, 4, 5].map((star) => {
          const isFilled = star < Math.ceil(normalizedRating);
          const isHalf = star === Math.ceil(normalizedRating) && normalizedRating % 1 !== 0;
          
          return (
            <div key={star} className={`vehicle-inventory__hero-star-wrapper ${isHalf ? 'vehicle-inventory__hero-star-wrapper--half' : ''}`}>
              {/* Outline star */}
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="vehicle-inventory__hero-star vehicle-inventory__hero-star--outline">
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
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="vehicle-inventory__hero-star vehicle-inventory__hero-star--filled">
                  <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"
                    fill="#33C4FF"
                  />
                </svg>
              )}
              {isHalf && (
                <div className="vehicle-inventory__hero-star-half-fill">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="vehicle-inventory__hero-star">
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
    );
  };

  return (
    <div className="vehicle-inventory">
      <div className="container">
        {/* Hero Slider Section */}
        {latestVehicles.length > 0 && (
          <div className="vehicle-inventory__hero">
            <div 
              className="vehicle-inventory__hero-slider"
              onMouseEnter={() => setIsSliderHovered(true)}
              onMouseLeave={() => setIsSliderHovered(false)}
            >
              <div 
                className="vehicle-inventory__hero-slider-track"
                style={{ transform: `translateX(-${currentSlide * 100}%)` }}
              >
                {latestVehicles.map((vehicle) => (
                  <div 
                    key={vehicle.id} 
                    className="vehicle-inventory__hero-slide"
                    onClick={() => handleVehicleClick(vehicle)}
                  >
                    <div className="vehicle-inventory__hero-image">
                      <img src={vehicle.image} alt={vehicle.name} />
                      
                      {/* Saved Badge - Top Left */}
                      <button
                        className={`vehicle-inventory__hero-save-btn ${savedVehicles.has(vehicle.name) ? 'saved' : ''}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleBookmark(vehicle.name);
                        }}
                        aria-label={savedVehicles.has(vehicle.name) ? 'Remove bookmark' : 'Bookmark'}
                      >
                        <Icon 
                          name="bookmark" 
                          variant={savedVehicles.has(vehicle.name) ? 'filled' : 'outlined'} 
                          size={20} 
                        />
                        <span>{savedVehicles.has(vehicle.name) ? 'Saved!' : 'Save'}</span>
                      </button>
                      
                      {/* Vehicle Name and Ratings Box */}
                      <div className="vehicle-inventory__hero-info-box">
                        <h2 className="vehicle-inventory__hero-name">{vehicle.name}</h2>
                        <div className="vehicle-inventory__hero-ratings-list">
                          <div className="vehicle-inventory__hero-rating-item">
                            <div className="vehicle-inventory__hero-rating-score-large">
                              {vehicle.staffRating.toFixed(1)}
                              <span className="vehicle-inventory__hero-rating-score-max">/10</span>
                            </div>
                            <div className="vehicle-inventory__hero-rating-label-row">
                              <img 
                                src="https://d2kde5ohu8qb21.cloudfront.net/files/69063bf7503f980002828ffc/mt-badge.svg" 
                                alt="MotorTrend" 
                                className="vehicle-inventory__hero-rating-mt-badge" 
                              />
                              <span className="vehicle-inventory__hero-rating-motortrend-text">MotorTrend Rating</span>
                            </div>
                          </div>
                          <div className="vehicle-inventory__hero-rating-item vehicle-inventory__hero-rating-item--community">
                            {renderStarRating(vehicle.communityRating)}
                            <div className="vehicle-inventory__hero-rating-text">
                              User Reviews <span className="vehicle-inventory__hero-rating-highlight">({(vehicle.communityRating / 2) % 1 === 0 ? vehicle.communityRating / 2 : (vehicle.communityRating / 2).toFixed(1)}/5)</span>
                            </div>
                          </div>
                        </div>
                        {getUserRating(vehicle.name) > 0 && (
                          <div className="vehicle-inventory__hero-rating-item">
                            <div className="vehicle-inventory__hero-rating-label-wrapper">
                              <span className="vehicle-inventory__hero-rating-label-top">Your</span>
                              <span className="vehicle-inventory__hero-rating-label-bottom">Rating</span>
                            </div>
                            <div className="vehicle-inventory__hero-rating-value-wrapper">
                              <img 
                                src="https://d2kde5ohu8qb21.cloudfront.net/files/691bde547554840002bab60c/star.svg" 
                                alt="Your Rating Star" 
                                className="vehicle-inventory__hero-rating-icon add-rate" 
                              />
                              <span className="vehicle-inventory__hero-rating-value">
                                {getUserRating(vehicle.name)}
                              </span>
                            </div>
                          </div>
                        )}
                        <button 
                          className="vehicle-inventory__hero-listing-btn cta cta--primary cta--default"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleVehicleClick(vehicle);
                          }}
                        >
                          See Local Listings
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Slider Navigation */}
              {latestVehicles.length > 1 && (
                <>
                  <button
                    className="vehicle-inventory__hero-nav vehicle-inventory__hero-nav--prev"
                    onClick={() => setCurrentSlide((prev) => (prev - 1 + latestVehicles.length) % latestVehicles.length)}
                    aria-label="Previous slide"
                  >
                    <Icon name="chevron_left" size={24} />
                  </button>
                  <button
                    className="vehicle-inventory__hero-nav vehicle-inventory__hero-nav--next"
                    onClick={() => setCurrentSlide((prev) => (prev + 1) % latestVehicles.length)}
                    aria-label="Next slide"
                  >
                    <Icon name="chevron_right" size={24} />
                  </button>
                  
                  {/* Slider Dots */}
                  <div className="vehicle-inventory__hero-dots">
                    {latestVehicles.map((_, index) => (
                      <button
                        key={index}
                        className={`vehicle-inventory__hero-dot ${index === currentSlide ? 'vehicle-inventory__hero-dot--active' : ''}`}
                        onClick={() => setCurrentSlide(index)}
                        aria-label={`Go to slide ${index + 1}`}
                      />
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        )}

        <div className="vehicle-inventory__header">
          <h1 className="vehicle-inventory__title">Vehicle Inventory</h1>
          <p className="vehicle-inventory__subtitle">
            Browse our collection of {sortedVehicles.length} makes and models
            {(selectedLifestyle || selectedPriceRange || selectedBodyStyle || selectedMake || selectedYear || selectedModel) && (
              <span>
                {' '}
                {selectedLifestyle && `in ${selectedLifestyle}`}
                {selectedPriceRange && `${selectedLifestyle ? ', ' : ''}${selectedPriceRange}`}
                {selectedBodyStyle && `${selectedLifestyle || selectedPriceRange ? ', ' : ''}${selectedBodyStyle}`}
                {selectedMake && `${selectedLifestyle || selectedPriceRange || selectedBodyStyle ? ', ' : ''}${selectedMake}`}
                {selectedYear && `${selectedLifestyle || selectedPriceRange || selectedBodyStyle || selectedMake ? ', ' : ''}${selectedYear}`}
                {selectedModel && `${selectedLifestyle || selectedPriceRange || selectedBodyStyle || selectedMake || selectedYear ? ', ' : ''}${selectedModel}`}
              </span>
            )}
          </p>
        </div>

        {/* Sort Controls */}
        <div className="vehicle-inventory__controls">
          <div className="vehicle-inventory__sort">
            <span className="vehicle-inventory__sort-label">Sort by:</span>
            <div className="vehicle-inventory__sort-buttons">
              {/* Lifestyle Dropdown */}
              <div
                className="vehicle-inventory__lifestyle-dropdown-wrapper"
                onMouseEnter={() => setIsLifestyleDropdownOpen(true)}
                onMouseLeave={() => setIsLifestyleDropdownOpen(false)}
              >
                <button
                  className={`vehicle-inventory__sort-btn ${selectedLifestyle ? 'vehicle-inventory__sort-btn--active' : ''}`}
                >
                  {selectedLifestyle || 'Lifestyle'}
                  <Icon 
                    name={isLifestyleDropdownOpen ? 'keyboard_arrow_up' : 'keyboard_arrow_down'} 
                    size={16} 
                  />
                </button>
                {isLifestyleDropdownOpen && (
                  <div className="vehicle-inventory__lifestyle-dropdown">
                    {LIFESTYLE_CATEGORIES.map((lifestyle) => (
                      <button
                        key={lifestyle}
                        className={`vehicle-inventory__lifestyle-dropdown-item ${selectedLifestyle === lifestyle ? 'vehicle-inventory__lifestyle-dropdown-item--active' : ''}`}
                        onClick={() => {
                          setSelectedLifestyle(selectedLifestyle === lifestyle ? null : lifestyle);
                          setIsLifestyleDropdownOpen(false);
                        }}
                      >
                        {lifestyle}
                      </button>
                    ))}
                  </div>
                )}
              </div>
              {/* Price Range Dropdown */}
              <div
                className="vehicle-inventory__lifestyle-dropdown-wrapper"
                onMouseEnter={() => setIsPriceRangeDropdownOpen(true)}
                onMouseLeave={() => setIsPriceRangeDropdownOpen(false)}
              >
                <button
                  className={`vehicle-inventory__sort-btn ${selectedPriceRange ? 'vehicle-inventory__sort-btn--active' : ''}`}
                >
                  {selectedPriceRange || 'Price Range'}
                  <Icon 
                    name={isPriceRangeDropdownOpen ? 'keyboard_arrow_up' : 'keyboard_arrow_down'} 
                    size={16} 
                  />
                </button>
                {isPriceRangeDropdownOpen && (
                  <div className="vehicle-inventory__lifestyle-dropdown">
                    {PRICE_RANGE_CATEGORIES.map((priceRange) => (
                      <button
                        key={priceRange}
                        className={`vehicle-inventory__lifestyle-dropdown-item ${selectedPriceRange === priceRange ? 'vehicle-inventory__lifestyle-dropdown-item--active' : ''}`}
                        onClick={() => {
                          setSelectedPriceRange(selectedPriceRange === priceRange ? null : priceRange);
                          setIsPriceRangeDropdownOpen(false);
                        }}
                      >
                        {priceRange}
                      </button>
                    ))}
                  </div>
                )}
              </div>
              {/* Body Style Dropdown */}
              <div
                className="vehicle-inventory__lifestyle-dropdown-wrapper"
                onMouseEnter={() => setIsBodyStyleDropdownOpen(true)}
                onMouseLeave={() => setIsBodyStyleDropdownOpen(false)}
              >
                <button
                  className={`vehicle-inventory__sort-btn ${selectedBodyStyle ? 'vehicle-inventory__sort-btn--active' : ''}`}
                >
                  {selectedBodyStyle || 'Body Style'}
                  <Icon 
                    name={isBodyStyleDropdownOpen ? 'keyboard_arrow_up' : 'keyboard_arrow_down'} 
                    size={16} 
                  />
                </button>
                {isBodyStyleDropdownOpen && (
                  <div className="vehicle-inventory__lifestyle-dropdown">
                    {BODY_STYLE_CATEGORIES.map((bodyStyle) => (
                      <button
                        key={bodyStyle}
                        className={`vehicle-inventory__lifestyle-dropdown-item ${selectedBodyStyle === bodyStyle ? 'vehicle-inventory__lifestyle-dropdown-item--active' : ''}`}
                        onClick={() => {
                          setSelectedBodyStyle(selectedBodyStyle === bodyStyle ? null : bodyStyle);
                          setIsBodyStyleDropdownOpen(false);
                        }}
                      >
                        {bodyStyle}
                      </button>
                    ))}
                  </div>
                )}
              </div>
              <button
                className={`vehicle-inventory__sort-btn ${sortBy === 'latest' ? 'vehicle-inventory__sort-btn--active' : ''}`}
                onClick={() => handleSortChange('latest')}
              >
                Latest
                {sortBy === 'latest' && (
                  <Icon 
                    name={sortOrder === 'desc' ? 'keyboard_arrow_down' : 'keyboard_arrow_up'} 
                    size={16} 
                  />
                )}
              </button>
              {/* Year Dropdown */}
              <div
                className="vehicle-inventory__lifestyle-dropdown-wrapper"
                onMouseEnter={() => setIsYearDropdownOpen(true)}
                onMouseLeave={() => setIsYearDropdownOpen(false)}
              >
                <button
                  className={`vehicle-inventory__sort-btn ${selectedYear ? 'vehicle-inventory__sort-btn--active' : ''}`}
                >
                  {selectedYear || 'Year'}
                  <Icon 
                    name={isYearDropdownOpen ? 'keyboard_arrow_up' : 'keyboard_arrow_down'} 
                    size={16} 
                  />
                </button>
                {isYearDropdownOpen && (
                  <div className="vehicle-inventory__lifestyle-dropdown">
                    {availableYears.map((year) => (
                      <button
                        key={year}
                        className={`vehicle-inventory__lifestyle-dropdown-item ${selectedYear === year ? 'vehicle-inventory__lifestyle-dropdown-item--active' : ''}`}
                        onClick={() => {
                          setSelectedYear(selectedYear === year ? null : year);
                          setIsYearDropdownOpen(false);
                        }}
                      >
                        {year}
                      </button>
                    ))}
                  </div>
                )}
              </div>
              {/* Make Dropdown */}
              <div
                className="vehicle-inventory__lifestyle-dropdown-wrapper"
                onMouseEnter={() => setIsMakeDropdownOpen(true)}
                onMouseLeave={() => setIsMakeDropdownOpen(false)}
              >
                <button
                  className={`vehicle-inventory__sort-btn ${selectedMake ? 'vehicle-inventory__sort-btn--active' : ''}`}
                >
                  {selectedMake || 'Make'}
                  <Icon 
                    name={isMakeDropdownOpen ? 'keyboard_arrow_up' : 'keyboard_arrow_down'} 
                    size={16} 
                  />
                </button>
                {isMakeDropdownOpen && (
                  <div className="vehicle-inventory__lifestyle-dropdown">
                    {uniqueMakes.map((make) => (
                      <button
                        key={make}
                        className={`vehicle-inventory__lifestyle-dropdown-item ${selectedMake === make ? 'vehicle-inventory__lifestyle-dropdown-item--active' : ''}`}
                        onClick={() => {
                          setSelectedMake(selectedMake === make ? null : make);
                          setIsMakeDropdownOpen(false);
                        }}
                      >
                        {make}
                      </button>
                    ))}
                  </div>
                )}
              </div>
              {/* Model Dropdown - Only show if a make is selected */}
              {selectedMake && (
                <div
                  className="vehicle-inventory__lifestyle-dropdown-wrapper"
                  onMouseEnter={() => setIsModelDropdownOpen(true)}
                  onMouseLeave={() => setIsModelDropdownOpen(false)}
                >
                  <button
                    className={`vehicle-inventory__sort-btn ${selectedModel ? 'vehicle-inventory__sort-btn--active' : ''}`}
                  >
                    {selectedModel || 'Model'}
                    <Icon 
                      name={isModelDropdownOpen ? 'keyboard_arrow_up' : 'keyboard_arrow_down'} 
                      size={16} 
                    />
                  </button>
                  {isModelDropdownOpen && (
                    <div className="vehicle-inventory__lifestyle-dropdown">
                      {availableModels.map((model) => (
                        <button
                          key={model}
                          className={`vehicle-inventory__lifestyle-dropdown-item ${selectedModel === model ? 'vehicle-inventory__lifestyle-dropdown-item--active' : ''}`}
                          onClick={() => {
                            setSelectedModel(selectedModel === model ? null : model);
                            setIsModelDropdownOpen(false);
                          }}
                        >
                          {model}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}
              <button
                className={`vehicle-inventory__sort-btn ${sortBy === 'rating' ? 'vehicle-inventory__sort-btn--active' : ''}`}
                onClick={() => handleSortChange('rating')}
              >
                Best Rated
                {sortBy === 'rating' && (
                  <Icon 
                    name={sortOrder === 'desc' ? 'keyboard_arrow_down' : 'keyboard_arrow_up'} 
                    size={16} 
                  />
                )}
              </button>
              {/* Clear Filters Button - Only show when filters are active */}
              {hasActiveFilters && (
                <button
                  className="vehicle-inventory__clear-filters-btn"
                  onClick={handleClearFilters}
                  aria-label="Clear all filters"
                >
                  <Icon name="close" size={16} />
                  Clear Filters
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Vehicle Grid */}
        <div className="vehicle-inventory__grid">
          {sortedVehicles.map((vehicle) => (
            <div
              key={vehicle.id}
              className="vehicle-inventory__card-wrapper"
              onClick={() => handleVehicleClick(vehicle)}
            >
              <VehicleCard
                image={vehicle.image}
                name={vehicle.name}
                type="Vehicle"
                rating1={vehicle.staffRating}
                rating2={vehicle.communityRating}
                hasMultipleRatings={true}
                onViewDetails={() => handleVehicleClick(vehicle)}
                onRate={() => handleRateVehicle(vehicle.name)}
                userRating={getUserRating(vehicle.name)}
                onBookmark={() => handleBookmark(vehicle.name)}
                isBookmarked={savedVehicles.has(vehicle.name)}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Rating Modal */}
      <RatingModal
        isOpen={isRatingModalOpen}
        onClose={handleCloseRatingModal}
        onRate={handleRatingSubmit}
        onRateAndReview={handleRateAndReview}
        vehicleName={ratingVehicle}
        currentRating={ratingVehicle ? getUserRating(ratingVehicle) : 0}
      />

      {/* Write Review Modal */}
      <WriteReviewModal
        key={`${ratingVehicle || ratingVehicleRef.current}-${reviewModalRating || 'new'}`}
        isOpen={isWriteReviewModalOpen}
        onClose={handleCloseWriteReviewModal}
        vehicleName={ratingVehicle || ratingVehicleRef.current}
        vehicleImage={reviewVehicleImage || reviewVehicleImageRef.current}
        onSubmit={(review) => {
          // Try to get vehicle name from multiple sources:
          // 1. From the review object itself (if WriteReviewModal added it)
          // 2. From the ref (most reliable, persists even if state is cleared)
          // 3. From state
          // 4. From reviewedVehicleName
          const reviewWithVehicleName = review as ReviewData & { _vehicleName?: string };
          const vehicleNameFromReview = reviewWithVehicleName._vehicleName;
          const vehicleNameFromRef = ratingVehicleRef.current;
          const vehicleNameFromState = ratingVehicle;
          const vehicleNameFromProp = ratingVehicle; // This is the prop passed to WriteReviewModal
          const vehicleNameToShow = vehicleNameFromReview || vehicleNameFromRef || vehicleNameFromState || vehicleNameFromProp || reviewedVehicleName;
          
          console.log('VehicleInventory: onSubmit called');
          console.log('  - vehicleNameFromReview (_vehicleName):', vehicleNameFromReview);
          console.log('  - vehicleNameFromRef:', vehicleNameFromRef);
          console.log('  - vehicleNameFromState (ratingVehicle):', vehicleNameFromState);
          console.log('  - vehicleNameFromProp:', vehicleNameFromProp);
          console.log('  - reviewedVehicleName:', reviewedVehicleName);
          console.log('  - FINAL vehicleNameToShow:', vehicleNameToShow);
          
          if (vehicleNameToShow && vehicleNameToShow.trim() !== '') {
            console.log('VehicleInventory: Using vehicle name:', vehicleNameToShow);
            // Set reviewed vehicle name BEFORE calling handleSubmitReview to ensure it's available
            setReviewedVehicleName(vehicleNameToShow);
            // Ensure ref is also set
            ratingVehicleRef.current = vehicleNameToShow;
            // Mark that we're submitting to prevent handleCloseWriteReviewModal from clearing state
            setIsSubmittingReview(true);
            // Remove the _vehicleName from review before passing to handleSubmitReview
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const { _vehicleName, ...cleanReview } = reviewWithVehicleName;
            // Call handleSubmitReview with the captured vehicle name
            handleSubmitReview(cleanReview);
          } else {
            console.error('VehicleInventory: No vehicle name available when submitting review.');
            console.error('  - vehicleNameFromReview:', vehicleNameFromReview);
            console.error('  - vehicleNameFromRef:', vehicleNameFromRef);
            console.error('  - vehicleNameFromState:', vehicleNameFromState);
            console.error('  - reviewedVehicleName:', reviewedVehicleName);
            // Still try to submit - handleSubmitReview will handle it
            handleSubmitReview(review);
          }
        }}
        initialRating={reviewModalRating}
      />

      {/* Review Submitted Modal */}
      <ReviewSubmittedToast
        isVisible={isToastVisible}
        onClose={handleCloseToast}
        onViewReview={handleViewReview}
        vehicleName={reviewedVehicleName || ratingVehicle || ''}
      />

      {/* Saved Modal */}
      <SavedModal
        isOpen={isSavedModalOpen}
        onClose={() => setIsSavedModalOpen(false)}
        itemTitle={savedVehicleName}
        itemType="vehicle"
      />
    </div>
  );
};

export default VehicleInventory;

