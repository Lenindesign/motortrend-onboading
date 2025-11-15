import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useRating } from '../../contexts/RatingContext';
import { computeOverallRating } from '../../utils/ratingUtils';
import { getVehicleBodyStyle } from '../../utils/vehicleBodyStyles';
import type { ReviewData, VerificationLevel, VehicleRelationship } from '../UserReviews/UserReviews';
import './WriteReviewModal.css';

interface WriteReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  vehicleName?: string;
  vehicleImage?: string;
  onSubmit?: (review: ReviewData) => void;
  existingReview?: ReviewData | null;
  isEditMode?: boolean;
  initialRating?: number; // Optional initial rating to pass directly
}

const WriteReviewModal: React.FC<WriteReviewModalProps> = ({
  isOpen,
  onClose,
  vehicleName = "2025 BMW 3-Series",
  vehicleImage,
  onSubmit,
  existingReview = null,
  isEditMode = false,
  initialRating
}) => {
  const { getUserRating, setUserRating } = useRating();
  // Initialize rating with initialRating if provided, otherwise 0
  const [rating, setRating] = useState(() => {
    // Use initialRating if it's already available when component mounts
    const initial = initialRating !== undefined && initialRating !== null && !isNaN(initialRating) && initialRating > 0 
      ? initialRating 
      : 0;
    console.log('WriteReviewModal: Initializing rating state with:', initial, 'initialRating prop:', initialRating);
    return initial;
  });
  
  // Log props when they change
  useEffect(() => {
    if (isOpen) {
      console.log('WriteReviewModal: Props received - initialRating:', initialRating, 'vehicleName:', vehicleName, 'isOpen:', isOpen, 'current rating state:', rating);
    }
  }, [isOpen, initialRating, vehicleName, rating]);
  const [reviewTitle, setReviewTitle] = useState('');
  const [reviewContent, setReviewContent] = useState('');
  const [vehicleModel, setVehicleModel] = useState('');
  const [mediaFiles, setMediaFiles] = useState<File[]>([]);
  const [mediaPreviews, setMediaPreviews] = useState<string[]>([]);
  const [isTextareaExpanded, setIsTextareaExpanded] = useState(false);
  
  // Verification
  const [vinNumber, setVinNumber] = useState('');
  
  // Vehicle Relationship
  const [vehicleRelationship, setVehicleRelationship] = useState<VehicleRelationship | ''>('');
  const [experienceDuration, setExperienceDuration] = useState('');
  
  // Category ratings
  const [categoryRatings, setCategoryRatings] = useState({
    comfort: 0,
    reliability: 0,
    interior: 0,
    value: 0,
    safety: 0
  });

  // Track if user manually set the overall rating
  const [isManualRating, setIsManualRating] = useState(false);

  // Compute overall rating from category ratings
  const computedRating = useMemo(() => {
    return computeOverallRating(categoryRatings);
  }, [categoryRatings]);

  // Load existing user rating when modal opens
  useEffect(() => {
    if (isOpen && vehicleName) {
      console.log('WriteReviewModal: Modal opened effect - initialRating:', initialRating, 'vehicleName:', vehicleName, 'isEditMode:', isEditMode, 'current rating:', rating);
      if (isEditMode && existingReview) {
        // Load existing review data for editing
        console.log('WriteReviewModal: Loading edit mode data, rating:', existingReview.rating);
        setRating(existingReview.rating);
        setReviewTitle(existingReview.title);
        setReviewContent(existingReview.content);
        setVehicleModel(existingReview.vehicleModel || '');
        setVehicleRelationship(existingReview.vehicleRelationship || '');
        setExperienceDuration(existingReview.experienceDuration || '');
        setVinNumber(existingReview.vinNumber || '');
        if (existingReview.categoryRatings) {
          setCategoryRatings({
            comfort: existingReview.categoryRatings.comfort || 0,
            reliability: existingReview.categoryRatings.reliability || 0,
            interior: existingReview.categoryRatings.interior || 0,
            value: existingReview.categoryRatings.value || 0,
            safety: existingReview.categoryRatings.safety || 0
          });
        }
        // Keep existing media previews if available
        if (existingReview.mediaPreviews && existingReview.mediaPreviews.length > 0) {
          setMediaPreviews(existingReview.mediaPreviews);
        }
        setIsManualRating(true); // Preserve manual rating in edit mode
      } else {
        // New review - prioritize initialRating prop, then load from context
        // Use initialRating if provided and > 0, otherwise get from context
        let ratingToUse = 0;
        console.log('WriteReviewModal: Checking initialRating:', initialRating, 'type:', typeof initialRating, 'value:', initialRating, 'isNaN:', isNaN(Number(initialRating)));
        if (initialRating !== undefined && initialRating !== null && !isNaN(initialRating) && initialRating > 0) {
          ratingToUse = initialRating;
          console.log('WriteReviewModal: Modal opened - Using initialRating:', initialRating);
        } else {
          const contextRating = getUserRating(vehicleName);
          ratingToUse = contextRating;
          console.log('WriteReviewModal: Modal opened - Using context rating:', contextRating, 'for vehicle:', vehicleName);
        }
        console.log('WriteReviewModal: Setting rating to:', ratingToUse, 'current rating state:', rating);
        // Set rating and manual flag synchronously - use functional update to ensure we have latest
        setRating(prevRating => {
          console.log('WriteReviewModal: setRating called, prevRating:', prevRating, 'new rating:', ratingToUse);
          return ratingToUse;
        });
        // If initialRating is provided and > 0, treat as manual to prevent computedRating from overriding
        const shouldBeManual = initialRating !== undefined && initialRating !== null && !isNaN(initialRating) && initialRating > 0;
        setIsManualRating(shouldBeManual);
        console.log('WriteReviewModal: Set rating to', ratingToUse, 'isManualRating:', shouldBeManual);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, vehicleName, getUserRating, isEditMode, existingReview, initialRating]);

  // Reset state when modal closes (only if it stays closed)
  const prevIsOpenRef = useRef(isOpen);
  useEffect(() => {
    // Only reset if modal was open and is now closed
    if (prevIsOpenRef.current && !isOpen) {
      // Use a timeout to ensure the modal stays closed
      const timeoutId = setTimeout(() => {
        // Only reset if modal is still closed
        // This prevents resetting if modal was quickly reopened
        console.log('WriteReviewModal: Modal closed, resetting state after delay');
        setRating(0);
        setReviewTitle('');
        setReviewContent('');
        setVehicleModel('');
        setCategoryRatings({
          comfort: 0,
          reliability: 0,
          interior: 0,
          value: 0,
          safety: 0
        });
        setIsManualRating(false);
      }, 200);
      return () => clearTimeout(timeoutId);
    }
    prevIsOpenRef.current = isOpen;
  }, [isOpen]);

  // Handle initialRating changes when modal is already open (backup effect)
  useEffect(() => {
    if (isOpen && vehicleName && !isEditMode && !existingReview) {
      console.log('WriteReviewModal: initialRating effect triggered, initialRating:', initialRating, 'current rating:', rating);
      if (initialRating !== undefined && initialRating !== null && initialRating > 0) {
        console.log('WriteReviewModal: initialRating prop changed to:', initialRating, 'updating rating');
        setRating(initialRating);
        setIsManualRating(true);
      } else if ((initialRating === undefined || initialRating === null || initialRating === 0) && rating === 0) {
        // If initialRating was cleared but rating is still 0, try to get from context
        const contextRating = getUserRating(vehicleName);
        if (contextRating > 0) {
          console.log('WriteReviewModal: No initialRating, using context rating:', contextRating);
          setRating(contextRating);
        }
      }
    }
  }, [initialRating, isOpen, vehicleName, isEditMode, existingReview, rating, getUserRating]);

  // Handle Escape key to close fullscreen overlay
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isTextareaExpanded) {
        setIsTextareaExpanded(false);
      }
    };

    if (isTextareaExpanded) {
      window.addEventListener('keydown', handleEscape);
      return () => window.removeEventListener('keydown', handleEscape);
    }
  }, [isTextareaExpanded]);

  // Update rating when category ratings change (if user hasn't manually set it)
  // Don't override if initialRating was provided (that means user set it from rating modal)
  useEffect(() => {
    // Only update from computedRating if:
    // 1. Rating is not manually set by user
    // 2. No initialRating was provided (which means user set it from rating modal)
    // 3. computedRating is actually > 0
    if (!isManualRating && computedRating > 0 && initialRating === undefined) {
      setRating(computedRating);
      // Save to global context automatically
      if (vehicleName) {
        setUserRating(vehicleName, computedRating);
      }
    }
  }, [computedRating, isManualRating, vehicleName, setUserRating, initialRating]);

  // Clean up media preview URLs when component unmounts or modal closes
  useEffect(() => {
    return () => {
      mediaPreviews.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [mediaPreviews]);

  const handleRatingClick = (selectedRating: number) => {
    setRating(selectedRating);
    setIsManualRating(true); // Mark as manually set
    // Immediately save to global context when user changes rating
    if (vehicleName) {
      setUserRating(vehicleName, selectedRating);
    }
  };

  const handleCategoryRatingClick = (category: keyof typeof categoryRatings, selectedRating: number) => {
    setCategoryRatings(prev => ({
      ...prev,
      [category]: selectedRating
    }));
    // Reset manual rating flag so computed rating takes precedence
    setIsManualRating(false);
  };

  const handleMediaUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const validFiles: File[] = [];
    const previews: string[] = [];

    Array.from(files).forEach((file) => {
      if (file.type.startsWith('image/') || file.type.startsWith('video/')) {
        validFiles.push(file);
        const previewUrl = URL.createObjectURL(file);
        previews.push(previewUrl);
      }
    });

    setMediaFiles((prev) => [...prev, ...validFiles]);
    setMediaPreviews((prev) => [...prev, ...previews]);
  };

  const handleRemoveMedia = (index: number) => {
    // Revoke object URL to prevent memory leaks
    URL.revokeObjectURL(mediaPreviews[index]);
    
    setMediaFiles((prev) => prev.filter((_, i) => i !== index));
    setMediaPreviews((prev) => prev.filter((_, i) => i !== index));
  };

  // Determine verification level
  const getVerificationLevel = (): VerificationLevel => {
    // If user provided VIN number, return highest level
    if (vinNumber.trim().length > 0) {
      return 'verified_documents';
    }
    
    // Check if user owns this vehicle (from profile or relationship selection)
    if (vehicleRelationship === 'own') {
      return 'owner';
    }
    
    // Check if user owns this vehicle from profile
    try {
      const onboardingData = localStorage.getItem('onboardingData');
      if (onboardingData) {
        const data = JSON.parse(onboardingData);
        const ownedVehicles = (data.vehicles || []).filter(
          (v: { name: string; ownership: string }) => v.ownership === 'own'
        );
        
        // Check if vehicleName matches any owned vehicle
        const ownsVehicle = ownedVehicles.some((v: { name: string }) => 
          v.name === vehicleName
        );
        
        if (ownsVehicle) {
          return 'owner'; // Basic owner badge
        }
      }
    } catch (error) {
      console.error('Error checking vehicle ownership:', error);
    }
    
    return 'none';
  };

  const handleSubmit = () => {
    if (rating === 0 || !reviewTitle.trim() || !reviewContent.trim()) {
      return;
    }

    // Save rating to global context
    if (vehicleName) {
      setUserRating(vehicleName, rating);
    }

    // Determine verification level
    const verificationLevel = getVerificationLevel();

    // Save VIN to localStorage securely (encrypted in production)
    if (vinNumber.trim().length > 0 && vehicleName) {
      try {
        const vinData = {
          vehicleName,
          vin: vinNumber.trim(),
          timestamp: new Date().toISOString()
        };
        
        // Get existing VIN data or create new object
        const existingVinData = localStorage.getItem('vehicleVINs');
        const vinDataObj = existingVinData ? JSON.parse(existingVinData) : {};
        
        // Store VIN securely (in production, this should be encrypted)
        vinDataObj[vehicleName] = vinData;
        localStorage.setItem('vehicleVINs', JSON.stringify(vinDataObj));
      } catch (error) {
        console.error('Error saving VIN:', error);
      }
    }

    const newReview: ReviewData = {
      id: isEditMode && existingReview ? existingReview.id : `review-${Date.now()}`,
      reviewerName: 'You', // In a real app, this would come from user authentication
      rating,
      title: reviewTitle,
      content: reviewContent,
      vehicleModel,
      vehicleType: '',
      date: isEditMode && existingReview ? existingReview.date : new Date().toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      }),
      mediaFiles: mediaFiles.length > 0 ? mediaFiles : undefined,
      categoryRatings: {
        comfort: categoryRatings.comfort > 0 ? categoryRatings.comfort : undefined,
        reliability: categoryRatings.reliability > 0 ? categoryRatings.reliability : undefined,
        interior: categoryRatings.interior > 0 ? categoryRatings.interior : undefined,
        value: categoryRatings.value > 0 ? categoryRatings.value : undefined,
        safety: categoryRatings.safety > 0 ? categoryRatings.safety : undefined
      },
      verificationLevel,
      vinNumber: vinNumber.trim().length > 0 ? vinNumber.trim() : undefined,
      vehicleRelationship: vehicleRelationship || undefined,
      experienceDuration: experienceDuration.trim().length > 0 ? experienceDuration.trim() : undefined,
      updatedDate: isEditMode ? new Date().toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      }) : undefined
    };

    if (onSubmit) {
      // Capture vehicleName before calling onSubmit to ensure it's available
      const capturedVehicleName = vehicleName;
      console.log('WriteReviewModal: handleSubmit called, vehicleName prop:', capturedVehicleName, 'newReview:', newReview);
      
      // Add vehicleName to the review object so parent can access it
      const reviewWithVehicleName = {
        ...newReview,
        _vehicleName: capturedVehicleName // Add vehicle name to review for parent to access
      };
      
      // Call onSubmit first, but don't close immediately
      // The parent component will handle closing after processing the review
      onSubmit(reviewWithVehicleName);
      
      // Use a small delay before resetting and closing to ensure parent has captured the data
      setTimeout(() => {
    // Reset form
    setRating(0);
    setReviewTitle('');
    setReviewContent('');
    setVehicleModel('');
    setIsManualRating(false);
    setCategoryRatings({
      comfort: 0,
      reliability: 0,
      interior: 0,
      value: 0,
      safety: 0
    });
    
    // Clean up media previews
    mediaPreviews.forEach((url) => URL.revokeObjectURL(url));
    setMediaFiles([]);
    setMediaPreviews([]);
    
    // Reset verification and relationship
    setVinNumber('');
    setVehicleRelationship('');
    setExperienceDuration('');
    
        // Close modal after parent has processed the submission
        onClose();
      }, 100);
    } else {
      // If no onSubmit handler, reset and close immediately
      setRating(0);
      setReviewTitle('');
      setReviewContent('');
      setVehicleModel('');
      setIsManualRating(false);
      setCategoryRatings({
        comfort: 0,
        reliability: 0,
        interior: 0,
        value: 0,
        safety: 0
      });
      
      mediaPreviews.forEach((url) => URL.revokeObjectURL(url));
      setMediaFiles([]);
      setMediaPreviews([]);
      setVinNumber('');
      setVehicleRelationship('');
      setExperienceDuration('');
    onClose();
    }
  };

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    // Only close if clicking directly on the overlay, not on the modal content
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  // Handle Escape key to close modal (only if textarea is not expanded)
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen && !isTextareaExpanded) {
        onClose();
      }
    };

    if (isOpen) {
      window.addEventListener('keydown', handleEscape);
      return () => window.removeEventListener('keydown', handleEscape);
    }
  }, [isOpen, isTextareaExpanded, onClose]);

  if (!isOpen) return null;

  return (
    <div className="write-review-modal-overlay" onClick={handleOverlayClick}>
      <div className="write-review-modal" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="write-review-modal__header">
          <div className="write-review-modal__close-btn" onClick={onClose}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        </div>

        {/* Content */}
        <div className="write-review-modal__content">
          <div className="write-review-modal__main">
            <div className="write-review-modal__title-wrapper">
              <div className="write-review-modal__title">
                {isEditMode ? 'Edit Your Review' : 'Add User Review'}
              </div>
              {!isEditMode && (
                <div className="write-review-modal__info-icon-wrapper">
                  <img 
                    src="https://d2kde5ohu8qb21.cloudfront.net/files/6918b2a80074bb0002840bac/demography.svg"
                    alt="Community Guidelines"
                    className="write-review-modal__info-icon"
                    onError={(e) => {
                      console.error('Failed to load community guidelines icon');
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                  <div className="write-review-modal__info-tooltip">
                    1–10 Rating Guide<br />
                    1–2: Poor · 3–4: Below average · 5–6: Average · 7–8: Good · 9–10: Excellent.<br /><br />
                    Overall ratings reflect factors like review recency, verified ownership, and trust signals — not just simple averages.<br /><br />
                    <Link to="/article/how-to-rate-vehicles" className="write-review-modal__tooltip-link" onClick={(e) => e.stopPropagation()}>
                      Read Our Rating Overview
                    </Link>
                  </div>
                </div>
              )}
            </div>
            
            {/* Vehicle Selection Card */}
            <div className="write-review-modal__vehicle-card">
              <div className="write-review-modal__vehicle-image">
                {vehicleImage ? (
                  <img src={vehicleImage} alt={vehicleName} />
                ) : (
                  <div className="write-review-modal__vehicle-placeholder">
                    <svg width="40" height="40" viewBox="0 0 24 24" fill="none">
                      <path d="M3 12L12 3L21 12L12 21L3 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                )}
              </div>
              <div className="write-review-modal__vehicle-info">
                {vehicleName && vehicleName.trim() ? (
                  <>
                    <div className="write-review-modal__vehicle-name">
                      {vehicleName}
                    </div>
                    <div className="write-review-modal__vehicle-body-style">
                      {getVehicleBodyStyle(vehicleName)[0] || 'Sedan'}
                    </div>
                  </>
                ) : (
                  <>
                    <div className="write-review-modal__vehicle-name">
                      Select Vehicle
                    </div>
                    <div className="write-review-modal__vehicle-body-style">
                      Sedan
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Rating Section */}
            <div className="write-review-modal__rating-section">
              <div className="write-review-modal__rating-header">
                <span className="write-review-modal__rating-label">Rate Your Experience (1-10)</span>
                <span className="write-review-modal__rating-value">
                  {rating > 0 ? (rating % 1 === 0 ? rating : rating.toFixed(1)) : '?'}/10
                </span>
              </div>
              <div className="write-review-modal__stars">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((star) => (
                  <button
                    key={star}
                    className={`write-review-modal__star ${star <= rating ? 'active' : ''}`}
                    onClick={() => handleRatingClick(star)}
                  >
                    <img 
                      src={star <= rating 
                        ? "https://d2kde5ohu8qb21.cloudfront.net/files/68f66c095d4ae300022a2b0e/starbluesolid.svg"
                        : "https://d2kde5ohu8qb21.cloudfront.net/files/68f66c095d4ae300022a2b10/starbluenotsolid.svg"
                      }
                      alt="Star" 
                      className="write-review-modal__star-icon"
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Review Form */}
            <div className="write-review-modal__section-group">
              <div className="write-review-modal__section-group-header">
                <h3 className="write-review-modal__section-group-title">Your Review</h3>
                <p className="write-review-modal__section-group-subtitle">Share your thoughts and experiences</p>
              </div>
              
              {/* Review Title */}
              <div className="write-review-modal__field">
                <label className="write-review-modal__field-label">Review Title</label>
                <input
                  type="text"
                  className="write-review-modal__input"
                  placeholder="Give your review a title"
                  value={reviewTitle}
                  onChange={(e) => setReviewTitle(e.target.value)}
                />
              </div>

              {/* Review Content */}
              <div className="write-review-modal__field">
                <div className="write-review-modal__textarea-header">
                  <label className="write-review-modal__field-label">Your Review</label>
                  <button
                    type="button"
                    className="write-review-modal__expand-btn"
                    onClick={() => setIsTextareaExpanded(!isTextareaExpanded)}
                    aria-label={isTextareaExpanded ? 'Collapse' : 'Expand to fullscreen'}
                  >
                    {isTextareaExpanded ? (
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                        <path d="M8 3H5C3.89543 3 3 3.89543 3 5V8M21 8V5C21 3.89543 20.1046 3 19 3H16M16 21H19C20.1046 21 21 20.1046 21 19V16M3 16V19C3 20.1046 3.89543 21 5 21H8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    ) : (
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                        <path d="M8 3H5C3.89543 3 3 3.89543 3 5V8M21 8V5C21 3.89543 20.1046 3 19 3H16M16 21H19C20.1046 21 21 20.1046 21 19V16M3 16V19C3 20.1046 3.89543 21 5 21H8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M12 8V12M12 12V16M12 12H8M12 12H16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    )}
                  </button>
                </div>
                <textarea
                  className="write-review-modal__textarea"
                  placeholder="Let others know what you like and dislike based on your hands-on experience with this vehicle"
                  value={reviewContent}
                  onChange={(e) => setReviewContent(e.target.value)}
                  rows={4}
                />
              </div>

              {/* Vehicle Relationship Section - Moved here to be right under Your Review */}
              <div className="write-review-modal__field">
                <label className="write-review-modal__field-label">
                  Your experience with this vehicle
                </label>
                <select
                  className="write-review-modal__select"
                  value={vehicleRelationship}
                  onChange={(e) => setVehicleRelationship(e.target.value as VehicleRelationship | '')}
                >
                  <option value="">Select experience</option>
                  <option value="own">I currently own this vehicle</option>
                  <option value="previously_owned">I previously owned this vehicle</option>
                  <option value="leased">I leased this vehicle</option>
                  <option value="rented">I rented this vehicle</option>
                  <option value="test_drove">I test drove this vehicle</option>
                  <option value="passenger">I was a passenger</option>
                </select>
              </div>

              {/* Experience Duration Section */}
              {vehicleRelationship && (
                <div className="write-review-modal__field">
                  <label className="write-review-modal__field-label">
                    {vehicleRelationship === 'own' ? 'How long have you owned this vehicle?' :
                     vehicleRelationship === 'previously_owned' ? 'How long did you own this vehicle?' :
                     vehicleRelationship === 'leased' ? 'How long did you lease this vehicle?' :
                     vehicleRelationship === 'rented' ? 'How long did you rent this vehicle?' :
                     vehicleRelationship === 'test_drove' ? 'When did you test drive this vehicle?' :
                     'How long have you experienced this vehicle?'}
                  </label>
                  <input
                    type="text"
                    className="write-review-modal__input"
                    placeholder={vehicleRelationship === 'test_drove' ? 'e.g., Last month, 2 weeks ago, January 2025' : 'e.g., 2 years, 6 months, 1 week, 500 miles'}
                    value={experienceDuration}
                    onChange={(e) => setExperienceDuration(e.target.value)}
                  />
                </div>
              )}
            </div>

            {/* Optional Information Section */}
            <div className="write-review-modal__section-group write-review-modal__section-group--optional">
              <div className="write-review-modal__section-group-header">
                <h3 className="write-review-modal__section-group-title">
                  Additional Information
                  <span className="write-review-modal__optional-badge">(Optional)</span>
                </h3>
                <p className="write-review-modal__section-group-subtitle">Help others by providing more details</p>
              </div>

              {/* Model Selection */}
              <div className="write-review-modal__field">
                <label className="write-review-modal__field-label">Model</label>
                <select
                  className="write-review-modal__select"
                  value={vehicleModel}
                  onChange={(e) => setVehicleModel(e.target.value)}
                >
                  <option value="">Select Model</option>
                  <option value="base">Base</option>
                  <option value="sport">Sport</option>
                  <option value="luxury">Luxury</option>
                  <option value="performance">Performance</option>
                </select>
              </div>

              {/* Media Upload Section */}
              <div className="write-review-modal__field">
                <label className="write-review-modal__field-label">Share a video or photo of your car</label>
                <div className="write-review-modal__media-upload">
                  <input
                    type="file"
                    id="media-upload"
                    className="write-review-modal__media-input"
                    accept="image/*,video/*"
                    multiple
                    onChange={handleMediaUpload}
                  />
                  <label htmlFor="media-upload" className="write-review-modal__media-label">
                    <div className="write-review-modal__media-placeholder">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                        <circle cx="8.5" cy="8.5" r="1.5"/>
                        <polyline points="21 15 16 10 5 21"/>
                      </svg>
                    </div>
                  </label>
                  
                  {/* Media Previews */}
                  {mediaPreviews.length > 0 && (
                    <div className="write-review-modal__media-previews">
                      {mediaPreviews.map((preview, index) => (
                        <div key={index} className="write-review-modal__media-preview">
                          {mediaFiles[index]?.type.startsWith('video/') ? (
                            <video src={preview} controls className="write-review-modal__media-item" />
                          ) : (
                            <img src={preview} alt={`Preview ${index + 1}`} className="write-review-modal__media-item" />
                          )}
                          <button
                            type="button"
                            className="write-review-modal__media-remove"
                            onClick={() => handleRemoveMedia(index)}
                            aria-label="Remove media"
                          >
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M18 6L6 18M6 6L18 18"/>
                            </svg>
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* VIN Verification Section (Optional) */}
              <div className="write-review-modal__field">
                <label className="write-review-modal__field-label">
                  Verify Ownership
                  <span className="write-review-modal__field-hint">
                    Enter your Vehicle Identification Number (VIN) for highest verification level
                  </span>
                </label>
                <input
                  type="text"
                  className="write-review-modal__input write-review-modal__vin-input"
                  placeholder="Enter VIN (17 characters)"
                  value={vinNumber}
                  onChange={(e) => {
                    // Limit to 17 characters and convert to uppercase
                    const value = e.target.value.toUpperCase().slice(0, 17);
                    setVinNumber(value);
                  }}
                  maxLength={17}
                />
                <div className="write-review-modal__vin-disclaimer">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                    <path d="M12 8v4M12 16h.01"/>
                  </svg>
                  <span>Your VIN information is 100% confidential and will be securely stored. It is only used for verification purposes.</span>
                </div>
              </div>
            </div>

            {/* Experience Rating Section */}
            <div className="write-review-modal__experience-section">
              <div className="write-review-modal__section-group-header">
                <h3 className="write-review-modal__experience-title">
                  Rate Your Experience
                  <span className="write-review-modal__optional-badge">(Optional)</span>
                </h3>
                <p className="write-review-modal__experience-subtitle">Rate specific aspects of your experience with this vehicle</p>
              </div>
              
              {/* Comfort */}
              <div className="write-review-modal__category-card">
                <div className="write-review-modal__category-header">
                  <div className="write-review-modal__category-info">
                    <h4 className="write-review-modal__category-title">Comfort</h4>
                    <p className="write-review-modal__category-description">Ride quality, seats, and cabin quietness</p>
                  </div>
                  <span className="write-review-modal__category-rating-value">
                    {categoryRatings.comfort > 0 ? `${categoryRatings.comfort}/10` : '?/10'}
                  </span>
                </div>
                <div className="write-review-modal__category-stars">
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((star) => (
                    <button
                      key={star}
                      type="button"
                      className={`write-review-modal__category-star ${star <= categoryRatings.comfort ? 'active' : ''}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleCategoryRatingClick('comfort', star);
                      }}
                    >
                      <img 
                        src={star <= categoryRatings.comfort 
                          ? "https://d2kde5ohu8qb21.cloudfront.net/files/68f66c095d4ae300022a2b0e/starbluesolid.svg"
                          : "https://d2kde5ohu8qb21.cloudfront.net/files/68f66c095d4ae300022a2b10/starbluenotsolid.svg"
                        }
                        alt="Star" 
                        className="write-review-modal__category-star-icon"
                      />
                    </button>
                  ))}
                </div>
              </div>

              {/* Reliability */}
              <div className="write-review-modal__category-card">
                <div className="write-review-modal__category-header">
                  <div className="write-review-modal__category-info">
                    <h4 className="write-review-modal__category-title">Reliability</h4>
                    <p className="write-review-modal__category-description">Performance over time, dependability</p>
                  </div>
                  <span className="write-review-modal__category-rating-value">
                    {categoryRatings.reliability > 0 ? `${categoryRatings.reliability}/10` : '?/10'}
                  </span>
                </div>
                <div className="write-review-modal__category-stars">
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((star) => (
                    <button
                      key={star}
                      type="button"
                      className={`write-review-modal__category-star ${star <= categoryRatings.reliability ? 'active' : ''}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleCategoryRatingClick('reliability', star);
                      }}
                    >
                      <img 
                        src={star <= categoryRatings.reliability 
                          ? "https://d2kde5ohu8qb21.cloudfront.net/files/68f66c095d4ae300022a2b0e/starbluesolid.svg"
                          : "https://d2kde5ohu8qb21.cloudfront.net/files/68f66c095d4ae300022a2b10/starbluenotsolid.svg"
                        }
                        alt="Star" 
                        className="write-review-modal__category-star-icon"
                      />
                    </button>
                  ))}
                </div>
              </div>

              {/* Interior */}
              <div className="write-review-modal__category-card">
                <div className="write-review-modal__category-header">
                  <div className="write-review-modal__category-info">
                    <h4 className="write-review-modal__category-title">Interior</h4>
                    <p className="write-review-modal__category-description">Design, materials, and tech features</p>
                  </div>
                  <span className="write-review-modal__category-rating-value">
                    {categoryRatings.interior > 0 ? `${categoryRatings.interior}/10` : '?/10'}
                  </span>
                </div>
                <div className="write-review-modal__category-stars">
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((star) => (
                    <button
                      key={star}
                      type="button"
                      className={`write-review-modal__category-star ${star <= categoryRatings.interior ? 'active' : ''}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleCategoryRatingClick('interior', star);
                      }}
                    >
                      <img 
                        src={star <= categoryRatings.interior 
                          ? "https://d2kde5ohu8qb21.cloudfront.net/files/68f66c095d4ae300022a2b0e/starbluesolid.svg"
                          : "https://d2kde5ohu8qb21.cloudfront.net/files/68f66c095d4ae300022a2b10/starbluenotsolid.svg"
                        }
                        alt="Star" 
                        className="write-review-modal__category-star-icon"
                      />
                    </button>
                  ))}
                </div>
              </div>

              {/* Value */}
              <div className="write-review-modal__category-card">
                <div className="write-review-modal__category-header">
                  <div className="write-review-modal__category-info">
                    <h4 className="write-review-modal__category-title">Value</h4>
                    <p className="write-review-modal__category-description">Worth compared to price and competitors</p>
                  </div>
                  <span className="write-review-modal__category-rating-value">
                    {categoryRatings.value > 0 ? `${categoryRatings.value}/10` : '?/10'}
                  </span>
                </div>
                <div className="write-review-modal__category-stars">
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((star) => (
                    <button
                      key={star}
                      type="button"
                      className={`write-review-modal__category-star ${star <= categoryRatings.value ? 'active' : ''}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleCategoryRatingClick('value', star);
                      }}
                    >
                      <img 
                        src={star <= categoryRatings.value 
                          ? "https://d2kde5ohu8qb21.cloudfront.net/files/68f66c095d4ae300022a2b0e/starbluesolid.svg"
                          : "https://d2kde5ohu8qb21.cloudfront.net/files/68f66c095d4ae300022a2b10/starbluenotsolid.svg"
                        }
                        alt="Star" 
                        className="write-review-modal__category-star-icon"
                      />
                    </button>
                  ))}
                </div>
              </div>

              {/* Safety */}
              <div className="write-review-modal__category-card">
                <div className="write-review-modal__category-header">
                  <div className="write-review-modal__category-info">
                    <h4 className="write-review-modal__category-title">Safety</h4>
                    <p className="write-review-modal__category-description">Driver-assistance tech and crash confidence</p>
                  </div>
                  <span className="write-review-modal__category-rating-value">
                    {categoryRatings.safety > 0 ? `${categoryRatings.safety}/10` : '?/10'}
                  </span>
                </div>
                <div className="write-review-modal__category-stars">
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((star) => (
                    <button
                      key={star}
                      type="button"
                      className={`write-review-modal__category-star ${star <= categoryRatings.safety ? 'active' : ''}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleCategoryRatingClick('safety', star);
                      }}
                    >
                      <img 
                        src={star <= categoryRatings.safety 
                          ? "https://d2kde5ohu8qb21.cloudfront.net/files/68f66c095d4ae300022a2b0e/starbluesolid.svg"
                          : "https://d2kde5ohu8qb21.cloudfront.net/files/68f66c095d4ae300022a2b10/starbluenotsolid.svg"
                        }
                        alt="Star" 
                        className="write-review-modal__category-star-icon"
                      />
                    </button>
                  ))}
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Submit Button */}
        <div className="write-review-modal__footer">
          <button
            type="button"
            className="write-review-modal__submit-btn"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              console.log('WriteReviewModal: Submit button clicked');
              console.log('WriteReviewModal: Current state - rating:', rating, 'title:', reviewTitle, 'content:', reviewContent);
              handleSubmit();
            }}
            disabled={rating === 0 || !reviewTitle.trim() || !reviewContent.trim()}
          >
            {isEditMode ? 'Update Review' : 'Submit Your Review'}
          </button>
        </div>
      </div>

      {/* Fullscreen Textarea Overlay */}
      {isTextareaExpanded && (
        <div className="write-review-modal__fullscreen-overlay">
          <div className="write-review-modal__fullscreen-container">
            <div className="write-review-modal__fullscreen-header">
              <label className="write-review-modal__fullscreen-label">Your Review</label>
              <button
                type="button"
                className="write-review-modal__fullscreen-close"
                onClick={() => setIsTextareaExpanded(false)}
                aria-label="Collapse"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </div>
            <textarea
              className="write-review-modal__fullscreen-textarea"
              placeholder="Let others know what you like and dislike based on your hands-on experience with this vehicle"
              value={reviewContent}
              onChange={(e) => setReviewContent(e.target.value)}
              autoFocus
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default WriteReviewModal;
