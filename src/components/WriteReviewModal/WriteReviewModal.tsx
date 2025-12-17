/**
 * WriteReviewModal Component
 * Migrated to inline React styles - no external CSS dependency
 */
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ModalShell } from '../atoms/ModalShell';
import { Badge } from '../atoms/Badge/Badge';
import { Button, TextField } from '../../design-system/components';
import { useRating } from '../../contexts/RatingContext';
import { computeOverallRating } from '../../utils/ratingUtils';
import { getVehicleBodyStyle } from '../../utils/vehicleBodyStyles';
import type { ReviewData, VerificationLevel, VehicleRelationship } from '../UserReviews/UserReviews';

interface WriteReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  vehicleName?: string;
  vehicleImage?: string;
  onSubmit?: (review: ReviewData) => void;
  existingReview?: ReviewData | null;
  isEditMode?: boolean;
  initialRating?: number;
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
  const [rating, setRating] = useState(() => {
    const initial = initialRating !== undefined && initialRating !== null && !isNaN(initialRating) && initialRating > 0 
      ? initialRating 
      : 0;
    return initial;
  });
  
  // Responsive state
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  
  // Hover states
  const [isCloseBtnHovered, setIsCloseBtnHovered] = useState(false);
  const [isInfoIconHovered, setIsInfoIconHovered] = useState(false);
  const [_isChangeVehicleHovered, _setIsChangeVehicleHovered] = useState(false);
  const [_hoveredStarIndex, _setHoveredStarIndex] = useState<number | null>(null);
  const [_hoveredCategoryStarIndex, _setHoveredCategoryStarIndex] = useState<{category: string, index: number} | null>(null);
  const [isExpandBtnHovered, setIsExpandBtnHovered] = useState(false);
  /* HIDDEN: Media-related state - commented out with Additional Information section
  const [hoveredMediaRemove, setHoveredMediaRemove] = useState<number | null>(null);
  const [isMediaPlaceholderHovered, setIsMediaPlaceholderHovered] = useState(false);
  */
  const [_isSubmitHovered, _setIsSubmitHovered] = useState(false);
  const [isFullscreenCloseHovered, setIsFullscreenCloseHovered] = useState(false);
  const [focusedInput, setFocusedInput] = useState<string | null>(null);
  
  // Responsive handler
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  // Inject keyframes for animations
  useEffect(() => {
    const styleId = 'write-review-modal-keyframes';
    if (!document.getElementById(styleId)) {
      const style = document.createElement('style');
      style.id = styleId;
      style.textContent = `
        @keyframes writeReviewFadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes writeReviewSlideUp {
          from { transform: translateY(20px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
      `;
      document.head.appendChild(style);
    }
    return () => {
      const existing = document.getElementById(styleId);
      if (existing) existing.remove();
    };
  }, []);

  useEffect(() => {
    if (isOpen) {
      console.log('WriteReviewModal: Props received - initialRating:', initialRating, 'vehicleName:', vehicleName);
    }
  }, [isOpen, initialRating, vehicleName, rating]);

  const [reviewTitle, setReviewTitle] = useState('');
  const [reviewContent, setReviewContent] = useState('');
  const [vehicleModel, setVehicleModel] = useState('');
  const [mediaFiles, setMediaFiles] = useState<File[]>([]);
  const [mediaPreviews, setMediaPreviews] = useState<string[]>([]);
  const [isTextareaExpanded, setIsTextareaExpanded] = useState(false);
  const [vinNumber, setVinNumber] = useState('');
  const [vehicleRelationship, setVehicleRelationship] = useState<VehicleRelationship | ''>('');
  const [experienceDuration, setExperienceDuration] = useState('');
  
  const [categoryRatings, setCategoryRatings] = useState({
    driverExperience: 0,
    reliability: 0,
    budgetFriendly: 0,
    manufacturerWarranty: 0
  });

  const [isManualRating, setIsManualRating] = useState(false);

  const computedRating = useMemo(() => {
    return computeOverallRating(categoryRatings);
  }, [categoryRatings]);

  useEffect(() => {
    if (isOpen && vehicleName) {
      if (isEditMode && existingReview) {
        setRating(existingReview.rating);
        setReviewTitle(existingReview.title);
        setReviewContent(existingReview.content);
        setVehicleModel(existingReview.vehicleModel || '');
        setVehicleRelationship(existingReview.vehicleRelationship || '');
        setExperienceDuration(existingReview.experienceDuration || '');
        setVinNumber(existingReview.vinNumber || '');
        if (existingReview.categoryRatings) {
          setCategoryRatings({
            driverExperience: existingReview.categoryRatings.driverExperience || existingReview.categoryRatings.comfort || 0,
            reliability: existingReview.categoryRatings.reliability || 0,
            budgetFriendly: existingReview.categoryRatings.budgetFriendly || existingReview.categoryRatings.value || 0,
            manufacturerWarranty: existingReview.categoryRatings.manufacturerWarranty || existingReview.categoryRatings.interior || 0
          });
        }
        if (existingReview.mediaPreviews && existingReview.mediaPreviews.length > 0) {
          setMediaPreviews(existingReview.mediaPreviews);
        }
        setIsManualRating(true);
      } else {
        let ratingToUse = 0;
        if (initialRating !== undefined && initialRating !== null && !isNaN(initialRating) && initialRating > 0) {
          ratingToUse = initialRating;
        } else {
          const contextRating = getUserRating(vehicleName);
          ratingToUse = contextRating;
        }
        setRating(ratingToUse);
        const shouldBeManual = initialRating !== undefined && initialRating !== null && !isNaN(initialRating) && initialRating > 0;
        setIsManualRating(shouldBeManual);
      }
    }
  }, [isOpen, vehicleName, getUserRating, isEditMode, existingReview, initialRating]);

  const prevIsOpenRef = useRef(isOpen);
  useEffect(() => {
    if (prevIsOpenRef.current && !isOpen) {
      const timeoutId = setTimeout(() => {
        setRating(0);
        setReviewTitle('');
        setReviewContent('');
        setVehicleModel('');
        setCategoryRatings({
          driverExperience: 0,
          reliability: 0,
          budgetFriendly: 0,
          manufacturerWarranty: 0
        });
        setIsManualRating(false);
      }, 200);
      return () => clearTimeout(timeoutId);
    }
    prevIsOpenRef.current = isOpen;
  }, [isOpen]);

  useEffect(() => {
    if (isOpen && vehicleName && !isEditMode && !existingReview) {
      if (initialRating !== undefined && initialRating !== null && initialRating > 0) {
        setRating(initialRating);
        setIsManualRating(true);
      } else if ((initialRating === undefined || initialRating === null || initialRating === 0) && rating === 0) {
        const contextRating = getUserRating(vehicleName);
        if (contextRating > 0) {
          setRating(contextRating);
        }
      }
    }
  }, [initialRating, isOpen, vehicleName, isEditMode, existingReview, rating, getUserRating]);

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

  useEffect(() => {
    if (!isManualRating && computedRating > 0 && initialRating === undefined) {
      setRating(computedRating);
      if (vehicleName) {
        setUserRating(vehicleName, computedRating);
      }
    }
  }, [computedRating, isManualRating, vehicleName, setUserRating, initialRating]);

  useEffect(() => {
    return () => {
      mediaPreviews.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [mediaPreviews]);

  const handleRatingClick = (selectedRating: number) => {
    setRating(selectedRating);
    setIsManualRating(true);
    if (vehicleName) {
      setUserRating(vehicleName, selectedRating);
    }
  };

  const handleCategoryRatingClick = (category: keyof typeof categoryRatings, selectedRating: number) => {
    setCategoryRatings(prev => ({
      ...prev,
      [category]: selectedRating
    }));
    setIsManualRating(false);
  };

  /* HIDDEN: Media handlers - commented out with Additional Information section
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
    URL.revokeObjectURL(mediaPreviews[index]);
    setMediaFiles((prev) => prev.filter((_, i) => i !== index));
    setMediaPreviews((prev) => prev.filter((_, i) => i !== index));
  };
  */

  const getVerificationLevel = (): VerificationLevel => {
    if (vinNumber.trim().length > 0) {
      return 'verified_documents';
    }
    if (vehicleRelationship === 'own') {
      return 'owner';
    }
    try {
      const onboardingData = localStorage.getItem('onboardingData');
      if (onboardingData) {
        const data = JSON.parse(onboardingData);
        const ownedVehicles = (data.vehicles || []).filter(
          (v: { name: string; ownership: string }) => v.ownership === 'own'
        );
        const ownsVehicle = ownedVehicles.some((v: { name: string }) => 
          v.name === vehicleName
        );
        if (ownsVehicle) {
          return 'owner';
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

    if (vehicleName) {
      setUserRating(vehicleName, rating);
    }

    const verificationLevel = getVerificationLevel();

    if (vinNumber.trim().length > 0 && vehicleName) {
      try {
        const vinData = {
          vehicleName,
          vin: vinNumber.trim(),
          timestamp: new Date().toISOString()
        };
        const existingVinData = localStorage.getItem('vehicleVINs');
        const vinDataObj = existingVinData ? JSON.parse(existingVinData) : {};
        vinDataObj[vehicleName] = vinData;
        localStorage.setItem('vehicleVINs', JSON.stringify(vinDataObj));
      } catch (error) {
        console.error('Error saving VIN:', error);
      }
    }

    const newReview: ReviewData = {
      id: isEditMode && existingReview ? existingReview.id : `review-${Date.now()}`,
      reviewerName: 'You',
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
        driverExperience: categoryRatings.driverExperience > 0 ? categoryRatings.driverExperience : undefined,
        reliability: categoryRatings.reliability > 0 ? categoryRatings.reliability : undefined,
        budgetFriendly: categoryRatings.budgetFriendly > 0 ? categoryRatings.budgetFriendly : undefined,
        manufacturerWarranty: categoryRatings.manufacturerWarranty > 0 ? categoryRatings.manufacturerWarranty : undefined
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
      const capturedVehicleName = vehicleName;
      const reviewWithVehicleName = {
        ...newReview,
        _vehicleName: capturedVehicleName
      };
      onSubmit(reviewWithVehicleName);
      
      setTimeout(() => {
        setRating(0);
        setReviewTitle('');
        setReviewContent('');
        setVehicleModel('');
        setIsManualRating(false);
        setCategoryRatings({
          driverExperience: 0,
          reliability: 0,
          budgetFriendly: 0,
          manufacturerWarranty: 0
        });
        mediaPreviews.forEach((url) => URL.revokeObjectURL(url));
        setMediaFiles([]);
        setMediaPreviews([]);
        setVinNumber('');
        setVehicleRelationship('');
        setExperienceDuration('');
        onClose();
      }, 100);
    } else {
      setRating(0);
      setReviewTitle('');
      setReviewContent('');
      setVehicleModel('');
      setIsManualRating(false);
      setCategoryRatings({
        driverExperience: 0,
        reliability: 0,
        budgetFriendly: 0,
        manufacturerWarranty: 0
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

  // ==================== INLINE STYLES ====================

  const modalStyle: React.CSSProperties = {
    backgroundColor: 'var(--color-neutrals-7, #F4F5F6)',
    width: isMobile ? '100%' : undefined,
    height: isMobile ? '100vh' : undefined,
    borderRadius: isMobile ? 0 : undefined,
  };

  const innerStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '0 0 var(--spacing-5, 40px) 0',
    height: '100%',
    overflowY: 'auto',
  };

  const headerStyle: React.CSSProperties = {
    width: '100%',
    height: '32px',
    backgroundColor: 'var(--color-neutrals-2, #23262F)',
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: '0 16px',
  };

  const closeBtnStyle: React.CSSProperties = {
    width: '24px',
    height: '24px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    color: 'var(--color-neutrals-8, #FCFCFD)',
    transition: 'opacity var(--transition-fast, all 150ms ease-in-out)',
    opacity: isCloseBtnHovered ? 0.7 : 1,
    background: 'none',
    border: 'none',
  };

  const contentStyle: React.CSSProperties = {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
    width: '100%',
    overflowY: 'auto',
    paddingBottom: '100px',
  };

  const mainStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: '-1px',
    padding: '0 16px',
    width: '100%',
  };

  const titleWrapperStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    marginTop: 'var(--spacing-3, 24px)',
    marginBottom: 'var(--spacing-2, 16px)',
    position: 'relative',
    width: '100%',
  };

  const titleStyle: React.CSSProperties = {
    fontFamily: 'var(--font-heading, Poppins, sans-serif)',
    fontWeight: 'var(--font-weight-bold, 600)',
    fontSize: '24px',
    lineHeight: '1.333em',
    color: 'var(--color-neutrals-1, #141416)',
    textAlign: 'center',
    margin: 0,
  };

  const infoIconWrapperStyle: React.CSSProperties = {
    position: 'relative',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    marginLeft: '4px',
    padding: '4px',
    borderRadius: 'var(--border-radius-sm, 4px)',
    transition: 'background-color var(--transition-fast, all 150ms ease-in-out)',
    backgroundColor: isInfoIconHovered ? 'var(--color-neutrals-7, #F4F5F6)' : 'transparent',
  };

  const infoIconStyle: React.CSSProperties = {
    width: '24px',
    height: '24px',
    display: 'block',
    opacity: isInfoIconHovered ? 0.7 : 1,
    transition: 'opacity var(--transition-fast, all 150ms ease-in-out)',
    flexShrink: 0,
    objectFit: 'contain',
  };

  const infoTooltipStyle: React.CSSProperties = {
    position: 'absolute',
    top: 'calc(100% + 4px)',
    right: 0,
    background: 'var(--color-neutrals-2, #23262F)',
    color: 'var(--color-white, #FFFFFF)',
    padding: '12px 16px',
    borderRadius: 'var(--border-radius-md, 8px)',
    fontFamily: 'var(--font-body, Geist, sans-serif)',
    fontWeight: 400,
    fontSize: '12px',
    lineHeight: 1.5,
    whiteSpace: 'normal',
    width: '320px',
    maxWidth: 'calc(100vw - 32px)',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
    zIndex: 1001,
    opacity: isInfoIconHovered ? 1 : 0,
    visibility: isInfoIconHovered ? 'visible' : 'hidden',
    transition: 'opacity 0.2s ease, visibility 0.2s ease',
    pointerEvents: 'auto',
    textAlign: 'left',
  };

  const tooltipLinkStyle: React.CSSProperties = {
    color: 'var(--color-primary-300, #FF6B6B)',
    textDecoration: 'underline',
    fontWeight: 600,
    display: 'inline-block',
    marginTop: '4px',
  };

  const vehicleCardStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: isMobile ? 'flex-start' : 'center',
    flexDirection: isMobile ? 'column' : 'row',
    gap: '16px',
    width: '100%',
    marginBottom: '16px',
  };

  const vehicleImageStyle: React.CSSProperties = {
    width: isMobile ? '100%' : '153.5px',
    height: isMobile ? '200px' : '104.34px',
    backgroundColor: 'var(--color-neutrals-6, #E6E8EC)',
    borderRadius: 'var(--border-radius-md, 8px)',
    overflow: 'hidden',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  };

  const vehicleImgStyle: React.CSSProperties = {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  };

  const vehiclePlaceholderStyle: React.CSSProperties = {
    width: '100%',
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'var(--color-neutrals-4, #6E7481)',
  };

  const vehicleInfoStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
    flex: 1,
  };

  const vehicleNameStyle: React.CSSProperties = {
    fontFamily: 'var(--font-heading, Poppins, sans-serif)',
    fontWeight: 600,
    fontSize: '16px',
    lineHeight: '1.375em',
    color: 'var(--color-neutrals-2, #23262F)',
    margin: 0,
    display: 'block',
  };

  const vehicleBodyStyleStyle: React.CSSProperties = {
    fontFamily: 'var(--font-body, Geist, sans-serif)',
    fontWeight: 400,
    fontSize: '14px',
    lineHeight: '1.29em',
    color: 'var(--color-neutrals-3, #353945)',
    margin: 0,
  };

  const ratingSectionStyle: React.CSSProperties = {
    backgroundColor: 'var(--color-neutrals-3, #353945)',
    borderRadius: 'var(--border-radius-md, 8px)',
    padding: '16px',
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
    width: '100%',
    height: '104px',
    marginBottom: '16px',
  };

  const ratingHeaderStyle: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
  };

  const ratingLabelStyle: React.CSSProperties = {
    fontFamily: 'var(--font-heading, Poppins, sans-serif)',
    fontWeight: 600,
    fontSize: '16px',
    lineHeight: '1.375em',
    color: 'var(--color-neutrals-8, #FCFCFD)',
  };

  const ratingValueStyle: React.CSSProperties = {
    fontFamily: 'var(--font-heading, Poppins, sans-serif)',
    fontWeight: 400,
    fontSize: '12px',
    lineHeight: '1.333em',
    color: 'var(--color-neutrals-8, #FCFCFD)',
  };

  const starsStyle: React.CSSProperties = {
    display: 'flex',
    gap: '4px',
    width: '100%',
    justifyContent: 'center',
    padding: '0 16px',
  };

  const starWrapperStyle: React.CSSProperties = {
    position: 'relative',
    display: 'flex',
    width: '24px',
    height: '24px',
  };

  const starVisualStyle: React.CSSProperties = {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '24px',
    height: '24px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    pointerEvents: 'none',
    zIndex: 1,
  };

  const starIconStyle: React.CSSProperties = {
    width: '24px',
    height: '24px',
    objectFit: 'contain',
  };

  const sectionGroupStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: 'var(--spacing-2, 16px)',
    width: '100%',
    marginBottom: 'var(--spacing-4, 32px)',
    padding: 'var(--spacing-3, 24px)',
    backgroundColor: 'var(--color-neutrals-8, #FCFCFD)',
    borderRadius: 'var(--border-radius-md, 8px)',
    border: '1px solid var(--color-neutrals-6, #E6E8EC)',
  };

  /* HIDDEN: sectionGroupOptionalStyle - commented out with Additional Information section
  const sectionGroupOptionalStyle: React.CSSProperties = {
    ...sectionGroupStyle,
    backgroundColor: 'transparent',
    border: '1px dashed var(--color-neutrals-5, #B1B5C3)',
  };
  */

  const sectionGroupHeaderStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: 'var(--spacing-1, 8px)',
    marginBottom: 0,
  };

  const sectionGroupTitleStyle: React.CSSProperties = {
    fontFamily: 'var(--font-heading, Poppins, sans-serif)',
    fontWeight: 'var(--font-weight-bold, 600)',
    fontSize: '18px',
    lineHeight: '1.333em',
    color: 'var(--color-neutrals-1, #141416)',
    margin: 0,
  };

  const sectionGroupSubtitleStyle: React.CSSProperties = {
    fontFamily: 'var(--font-body, Geist, sans-serif)',
    fontWeight: 'var(--font-weight-regular, 400)',
    fontSize: '14px',
    lineHeight: '1.429em',
    color: 'var(--color-neutrals-3, #353945)',
    margin: 0,
  };

  const fieldStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: 'var(--spacing-1, 8px)',
    width: '100%',
  };

  const fieldLabelStyle: React.CSSProperties = {
    fontFamily: 'var(--font-body, Geist, sans-serif)',
    fontWeight: 'var(--font-weight-regular, 400)',
    fontSize: '14px',
    lineHeight: '1.429em',
    color: 'var(--color-neutrals-2, #23262F)',
    marginBottom: 'var(--spacing-1, 8px)',
  };

  const textareaHeaderStyle: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '8px',
  };

  const expandBtnStyle: React.CSSProperties = {
    background: isExpandBtnHovered ? 'var(--color-neutrals-7, #F4F5F6)' : 'none',
    border: 'none',
    cursor: 'pointer',
    color: isExpandBtnHovered ? 'var(--color-neutrals-2, #23262F)' : 'var(--color-neutrals-4, #6E7481)',
    padding: '4px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 'var(--border-radius-sm, 4px)',
    transition: 'all var(--transition-fast, all 150ms ease-in-out)',
  };

  const getInputStyle = (inputName: string): React.CSSProperties => ({
    width: '100%',
    padding: '6px 16px',
    backgroundColor: 'var(--color-neutrals-8, #FCFCFD)',
    border: `1px solid ${focusedInput === inputName ? 'var(--color-primary-500, #E90C17)' : 'var(--color-neutrals-5, #B1B5C3)'}`,
    borderRadius: 'var(--border-radius-md, 8px)',
    fontFamily: 'var(--font-body, Geist, sans-serif)',
    fontWeight: 400,
    fontSize: '16px',
    lineHeight: '1.75em',
    color: 'var(--color-neutrals-2, #23262F)',
    transition: 'border-color var(--transition-fast, all 150ms ease-in-out)',
    outline: 'none',
    boxShadow: focusedInput === inputName ? '0 0 0 2px var(--color-primary-100, rgba(233, 12, 23, 0.1))' : 'none',
  });

  const textareaStyle: React.CSSProperties = {
    ...getInputStyle('textarea'),
    resize: 'vertical',
    minHeight: '100px',
    paddingTop: '12px',
    paddingBottom: '12px',
  };

  const selectStyle: React.CSSProperties = {
    ...getInputStyle('select'),
    cursor: 'pointer',
    appearance: 'none',
    WebkitAppearance: 'none',
    backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
    backgroundPosition: 'right 12px center',
    backgroundRepeat: 'no-repeat',
    backgroundSize: '16px',
    paddingRight: '40px',
  };

  const experienceSectionStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: 'var(--spacing-3, 24px)',
    width: '100%',
    marginBottom: 'var(--spacing-4, 32px)',
    padding: 'var(--spacing-3, 24px)',
    backgroundColor: 'var(--color-neutrals-8, #FCFCFD)',
    borderRadius: 'var(--border-radius-md, 8px)',
    border: '1px solid var(--color-neutrals-6, #E6E8EC)',
  };

  const categoryCardStyle: React.CSSProperties = {
    backgroundColor: 'var(--color-neutrals-3, #353945)',
    borderRadius: 'var(--border-radius-md, 8px)',
    padding: '16px',
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    width: '100%',
  };

  const categoryHeaderStyle: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    width: '100%',
  };

  const categoryInfoStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
    flex: 1,
  };

  const categoryTitleStyle: React.CSSProperties = {
    fontFamily: 'var(--font-heading, Poppins, sans-serif)',
    fontWeight: 600,
    fontSize: '16px',
    lineHeight: '1.375em',
    color: 'var(--color-neutrals-8, #FCFCFD)',
    margin: 0,
  };

  const categoryDescriptionStyle: React.CSSProperties = {
    fontFamily: 'var(--font-body, Geist, sans-serif)',
    fontWeight: 'var(--font-weight-regular, 400)',
    fontSize: '12px',
    lineHeight: '1.5em',
    color: 'var(--color-neutrals-5, #B1B5C3)',
    margin: 0,
    width: '100%',
    opacity: 0.9,
  };

  const categoryRatingValueStyle: React.CSSProperties = {
    fontFamily: 'var(--font-heading, Poppins, sans-serif)',
    fontWeight: 400,
    fontSize: '14px',
    lineHeight: '1.333em',
    color: 'var(--color-neutrals-8, #FCFCFD)',
    flexShrink: 0,
    marginLeft: '12px',
  };

  const categoryStarsStyle: React.CSSProperties = {
    display: 'flex',
    gap: '6px',
    width: '100%',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center',
  };

  const categoryStarWrapperStyle: React.CSSProperties = {
    position: 'relative',
    display: 'flex',
    width: '36px',
    height: '36px',
  };

  const categoryStarVisualStyle: React.CSSProperties = {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '36px',
    height: '36px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    pointerEvents: 'none',
    zIndex: 1,
  };

  const categoryStarIconStyle: React.CSSProperties = {
    width: '36px',
    height: '36px',
    objectFit: 'contain',
    pointerEvents: 'none',
  };

  /* HIDDEN: Media and VIN styles - commented out with Additional Information section
  const mediaUploadStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    width: '100%',
  };

  const mediaInputStyle: React.CSSProperties = {
    display: 'none',
  };

  const mediaLabelStyle: React.CSSProperties = {
    width: '100%',
    cursor: 'pointer',
    display: 'block',
  };

  const mediaPlaceholderStyle: React.CSSProperties = {
    width: '100%',
    minHeight: '120px',
    backgroundColor: isMediaPlaceholderHovered ? 'var(--color-neutrals-7, #F4F5F6)' : 'var(--color-neutrals-8, #FCFCFD)',
    border: `1px solid ${isMediaPlaceholderHovered ? 'var(--color-primary-500, #E90C17)' : 'var(--color-neutrals-5, #B1B5C3)'}`,
    borderRadius: 'var(--border-radius-md, 8px)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'var(--color-neutrals-4, #6E7481)',
    transition: 'border-color var(--transition-fast, all 150ms ease-in-out), background-color var(--transition-fast, all 150ms ease-in-out)',
  };

  const mediaPreviewsStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    width: '100%',
  };

  const mediaPreviewStyle: React.CSSProperties = {
    position: 'relative',
    width: '100%',
    aspectRatio: '16 / 9',
    borderRadius: 'var(--border-radius-md, 8px)',
    overflow: 'hidden',
    backgroundColor: 'var(--color-neutrals-6, #E6E8EC)',
  };

  const mediaItemStyle: React.CSSProperties = {
    width: '100%',
    height: '100%',
    display: 'block',
    objectFit: 'contain',
  };

  const getMediaRemoveStyle = (index: number): React.CSSProperties => ({
    position: 'absolute',
    top: '8px',
    right: '8px',
    width: '28px',
    height: '28px',
    backgroundColor: hoveredMediaRemove === index ? 'rgba(0, 0, 0, 0.8)' : 'rgba(0, 0, 0, 0.6)',
    border: 'none',
    borderRadius: 'var(--border-radius-circle, 50%)',
    color: 'var(--color-neutrals-8, #FCFCFD)',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'background-color var(--transition-fast, all 150ms ease-in-out)',
    zIndex: 10,
  });

  const fieldHintStyle: React.CSSProperties = {
    display: 'block',
    fontFamily: 'var(--font-body, Geist, sans-serif)',
    fontWeight: 'var(--font-weight-regular, 400)',
    fontSize: '12px',
    lineHeight: '1.333em',
    color: 'var(--color-neutrals-4, #6E7481)',
    marginTop: 'var(--spacing-1, 8px)',
    fontStyle: 'italic',
  };

  const vinDisclaimerStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '8px',
    padding: '12px',
    backgroundColor: 'var(--color-neutrals-7, #F4F5F6)',
    border: '1px solid var(--color-neutrals-5, #B1B5C3)',
    borderRadius: 'var(--border-radius-md, 8px)',
    marginTop: '8px',
  };
  */

  const footerStyle: React.CSSProperties = {
    position: 'sticky',
    bottom: 0,
    width: '100%',
    padding: '16px',
    display: 'flex',
    justifyContent: 'center',
    backgroundColor: 'var(--color-neutrals-7, #F4F5F6)',
    zIndex: 100,
    boxShadow: '0 -4px 20px rgba(0, 0, 0, 0.15)',
  };

  const fullscreenOverlayStyle: React.CSSProperties = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    zIndex: 10000,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '24px',
    animation: 'writeReviewFadeIn 0.2s ease',
  };

  const fullscreenContainerStyle: React.CSSProperties = {
    width: '100%',
    maxWidth: '1200px',
    height: '100%',
    maxHeight: '90vh',
    backgroundColor: 'var(--color-white, #FFFFFF)',
    borderRadius: 'var(--border-radius-md-lg, 12px)',
    display: 'flex',
    flexDirection: 'column',
    boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
    animation: 'writeReviewSlideUp 0.2s ease',
  };

  const fullscreenHeaderStyle: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '24px',
    borderBottom: '1px solid var(--color-neutrals-6, #E6E8EC)',
  };

  const fullscreenLabelStyle: React.CSSProperties = {
    fontFamily: 'var(--font-heading, Poppins, sans-serif)',
    fontWeight: 600,
    fontSize: '24px',
    lineHeight: '1.333em',
    color: 'var(--color-neutrals-2, #23262F)',
  };

  const fullscreenCloseStyle: React.CSSProperties = {
    background: isFullscreenCloseHovered ? 'var(--color-neutrals-7, #F4F5F6)' : 'none',
    border: 'none',
    cursor: 'pointer',
    color: isFullscreenCloseHovered ? 'var(--color-neutrals-1, #141416)' : 'var(--color-neutrals-3, #353945)',
    padding: '8px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 'var(--border-radius-sm, 4px)',
    transition: 'all var(--transition-fast, all 150ms ease-in-out)',
  };

  const fullscreenTextareaStyle: React.CSSProperties = {
    flex: 1,
    width: '100%',
    padding: '24px',
    backgroundColor: 'var(--color-white, #FFFFFF)',
    border: 'none',
    borderRadius: '0 0 12px 12px',
    fontFamily: 'var(--font-body, Geist, sans-serif)',
    fontWeight: 400,
    fontSize: '18px',
    lineHeight: '1.75em',
    color: 'var(--color-neutrals-2, #23262F)',
    resize: 'none',
    outline: 'none',
    minHeight: '400px',
  };

  // Star rating rendering helper
  const renderStars = (currentRating: number, onClickHandler: (rating: number) => void, size: 'small' | 'large' = 'small') => {
    const wrapperSize = size === 'large' ? categoryStarWrapperStyle : starWrapperStyle;
    const visualSize = size === 'large' ? categoryStarVisualStyle : starVisualStyle;
    const iconSize = size === 'large' ? categoryStarIconStyle : starIconStyle;
    const clickWidth = size === 'large' ? '18px' : '12px';
    const clickHeight = size === 'large' ? '36px' : '24px';
    
    return Array.from({ length: 5 }, (_, index) => {
      const starPosition = index + 1;
      const oddRating = starPosition * 20 - 10;
      const evenRating = starPosition * 20;
      
      const isOddSelected = oddRating <= currentRating;
      const isEvenSelected = evenRating <= currentRating;
      const showHalfStar = isOddSelected && !isEvenSelected;
      const showFullStar = isEvenSelected;
      
      return (
        <div key={starPosition} style={wrapperSize}>
          <div style={visualSize}>
            {showHalfStar ? (
              <img 
                src="https://d2kde5ohu8qb21.cloudfront.net/files/691c8ba6a619270002cb5797/half-star.svg"
                alt={`${oddRating} star rating`}
                style={iconSize}
              />
            ) : showFullStar ? (
              <img 
                src="https://d2kde5ohu8qb21.cloudfront.net/files/691bde547554840002bab60c/star.svg"
                alt={`${evenRating} star rating`}
                style={iconSize}
              />
            ) : (
              <img 
                src="https://d2kde5ohu8qb21.cloudfront.net/files/691bde5264217700021d6b71/star-stroke.svg"
                alt="Empty star"
                style={iconSize}
              />
            )}
          </div>
          <button
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: 0,
              position: 'absolute',
              top: 0,
              left: 0,
              width: clickWidth,
              height: clickHeight,
              zIndex: 2,
            }}
            onClick={() => onClickHandler(oddRating)}
            aria-label={`Rate ${oddRating} out of 100`}
          />
          <button
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: 0,
              position: 'absolute',
              top: 0,
              right: 0,
              width: clickWidth,
              height: clickHeight,
              zIndex: 2,
            }}
            onClick={() => onClickHandler(evenRating)}
            aria-label={`Rate ${evenRating} out of 100`}
          />
        </div>
      );
    });
  };

  // Category rating card component
  const renderCategoryCard = (
    category: keyof typeof categoryRatings,
    title: string,
    description: string
  ) => (
    <div style={categoryCardStyle}>
      <div style={categoryHeaderStyle}>
        <div style={categoryInfoStyle}>
          <h4 style={categoryTitleStyle}>{title}</h4>
          <p style={categoryDescriptionStyle}>{description}</p>
        </div>
        <span style={categoryRatingValueStyle}>
          {categoryRatings[category] > 0 ? `${(categoryRatings[category] / 20).toFixed(1)}/5` : '?/5'}
        </span>
      </div>
      <div style={categoryStarsStyle}>
        {renderStars(categoryRatings[category], (rating) => handleCategoryRatingClick(category, rating), 'large')}
      </div>
    </div>
  );

  return (
    <ModalShell
      isOpen={isOpen}
      onClose={onClose}
      position="side-right"
      animation="slide-right"
      maxWidth="400px"
      closeOnEscape={!isTextareaExpanded}
      closeOnOverlayClick={true}
      style={modalStyle}
    >
      <div style={innerStyle}>
        {/* Header */}
        <div style={headerStyle}>
          <button 
            style={closeBtnStyle} 
            onClick={onClose}
            onMouseEnter={() => setIsCloseBtnHovered(true)}
            onMouseLeave={() => setIsCloseBtnHovered(false)}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>

        {/* Content */}
        <div style={contentStyle}>
          <div style={mainStyle}>
            <div style={titleWrapperStyle}>
              <div style={titleStyle}>
                {isEditMode ? 'Edit Your Review' : 'Add User Review'}
              </div>
              {!isEditMode && (
                <div 
                  style={infoIconWrapperStyle}
                  onMouseEnter={() => setIsInfoIconHovered(true)}
                  onMouseLeave={() => setIsInfoIconHovered(false)}
                >
                  <img 
                    src="https://d2kde5ohu8qb21.cloudfront.net/files/6918b2a80074bb0002840bac/demography.svg"
                    alt="Community Guidelines"
                    style={infoIconStyle}
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                  <div style={infoTooltipStyle}>
                    1–5 Rating Guide<br />
                    1: Poor · 2: Below average · 3: Average · 4: Good · 5: Excellent.<br /><br />
                    Overall ratings reflect factors like review recency, verified ownership, and trust signals — not just simple averages.<br /><br />
                    <Link to="/article/how-to-rate-vehicles" style={tooltipLinkStyle} onClick={(e) => e.stopPropagation()}>
                      Read Our Rating Overview
                    </Link>
                  </div>
                </div>
              )}
            </div>
            
            {/* Vehicle Selection Card */}
            <div style={vehicleCardStyle}>
              <div style={vehicleImageStyle}>
                {vehicleImage ? (
                  <img src={vehicleImage} alt={vehicleName} style={vehicleImgStyle} />
                ) : (
                  <div style={vehiclePlaceholderStyle}>
                    <svg width="40" height="40" viewBox="0 0 24 24" fill="none">
                      <path d="M3 12L12 3L21 12L12 21L3 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                )}
              </div>
              <div style={vehicleInfoStyle}>
                {vehicleName && vehicleName.trim() ? (
                  <>
                    <div style={vehicleNameStyle}>{vehicleName}</div>
                    <div style={vehicleBodyStyleStyle}>{getVehicleBodyStyle(vehicleName)[0] || 'Sedan'}</div>
                  </>
                ) : (
                  <>
                    <div style={vehicleNameStyle}>Select Vehicle</div>
                    <div style={vehicleBodyStyleStyle}>Sedan</div>
                  </>
                )}
              </div>
            </div>

            {/* Rating Section */}
            <div style={ratingSectionStyle}>
              <div style={ratingHeaderStyle}>
                <span style={ratingLabelStyle}>Rate Your Experience (1-5)</span>
                <span style={ratingValueStyle}>
                  {rating > 0 ? (rating / 20).toFixed(1) : '?'}/5
                </span>
              </div>
              <div style={starsStyle}>
                {renderStars(rating, handleRatingClick, 'small')}
              </div>
            </div>

            {/* Review Form */}
            <div style={sectionGroupStyle}>
              <div style={sectionGroupHeaderStyle}>
                <h3 style={sectionGroupTitleStyle}>Your Review</h3>
                <p style={sectionGroupSubtitleStyle}>Share your thoughts and experiences</p>
              </div>
              
              {/* Review Title */}
              <TextField
                label="Review Title"
                placeholder="Give your review a title"
                value={reviewTitle}
                onChange={(e) => setReviewTitle(e.target.value)}
                fullWidth
              />

              {/* Review Content */}
              <div style={fieldStyle}>
                <div style={textareaHeaderStyle}>
                  <label style={fieldLabelStyle}>Your Review</label>
                  <button
                    type="button"
                    style={expandBtnStyle}
                    onClick={() => setIsTextareaExpanded(!isTextareaExpanded)}
                    onMouseEnter={() => setIsExpandBtnHovered(true)}
                    onMouseLeave={() => setIsExpandBtnHovered(false)}
                    aria-label={isTextareaExpanded ? 'Collapse' : 'Expand to fullscreen'}
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                      <path d="M8 3H5C3.89543 3 3 3.89543 3 5V8M21 8V5C21 3.89543 20.1046 3 19 3H16M16 21H19C20.1046 21 21 20.1046 21 19V16M3 16V19C3 20.1046 3.89543 21 5 21H8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </button>
                </div>
                <textarea
                  style={textareaStyle}
                  placeholder="Let others know what you like and dislike based on your hands-on experience with this vehicle"
                  value={reviewContent}
                  onChange={(e) => setReviewContent(e.target.value)}
                  rows={4}
                  onFocus={() => setFocusedInput('textarea')}
                  onBlur={() => setFocusedInput(null)}
                />
              </div>

              {/* Vehicle Relationship Section */}
              <div style={fieldStyle}>
                <label style={fieldLabelStyle}>Your experience with this vehicle</label>
                <select
                  style={selectStyle}
                  value={vehicleRelationship}
                  onChange={(e) => setVehicleRelationship(e.target.value as VehicleRelationship | '')}
                  onFocus={() => setFocusedInput('select')}
                  onBlur={() => setFocusedInput(null)}
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
                <TextField
                  label={vehicleRelationship === 'own' ? 'How long have you owned this vehicle?' :
                     vehicleRelationship === 'previously_owned' ? 'How long did you own this vehicle?' :
                     vehicleRelationship === 'leased' ? 'How long did you lease this vehicle?' :
                     vehicleRelationship === 'rented' ? 'How long did you rent this vehicle?' :
                     vehicleRelationship === 'test_drove' ? 'When did you test drive this vehicle?' :
                     'How long have you experienced this vehicle?'}
                  placeholder={vehicleRelationship === 'test_drove' ? 'e.g., Last month, 2 weeks ago, January 2025' : 'e.g., 2 years, 6 months, 1 week, 500 miles'}
                  value={experienceDuration}
                  onChange={(e) => setExperienceDuration(e.target.value)}
                  fullWidth
                />
              )}
            </div>

            {/* Experience Rating Section */}
            <div style={experienceSectionStyle}>
              <div style={sectionGroupHeaderStyle}>
                <h3 style={sectionGroupTitleStyle}>
                  Rate Your Experience
                  <Badge variant="info" size="sm" outline={true} style={{ marginLeft: 'var(--spacing-1, 8px)' }}>
                    Optional
                  </Badge>
                </h3>
                <p style={sectionGroupSubtitleStyle}>Rate specific aspects of your experience with this vehicle</p>
              </div>
              
              {renderCategoryCard('driverExperience', 'Driver Experience', 'Handling, comfort, and overall driving feel')}
              {renderCategoryCard('reliability', 'Reliability', 'Performance over time, dependability')}
              {renderCategoryCard('manufacturerWarranty', 'Manufacturer Warranty', 'Coverage quality and support experience')}
              {renderCategoryCard('budgetFriendly', 'Budget Friendly', 'Cost of ownership and overall value')}
            </div>

{/* HIDDEN: Additional Information Section
            <div style={sectionGroupOptionalStyle}>
              <div style={sectionGroupHeaderStyle}>
                <h3 style={sectionGroupTitleStyle}>
                  Additional Information
                  <Badge variant="info" size="sm" outline={true} style={{ marginLeft: 'var(--spacing-1, 8px)' }}>
                    Optional
                  </Badge>
                </h3>
                <p style={sectionGroupSubtitleStyle}>Help others by providing more details</p>
              </div>

              <div style={fieldStyle}>
                <label style={fieldLabelStyle}>Model</label>
                <select
                  style={selectStyle}
                  value={vehicleModel}
                  onChange={(e) => setVehicleModel(e.target.value)}
                  onFocus={() => setFocusedInput('model')}
                  onBlur={() => setFocusedInput(null)}
                >
                  <option value="">Select Model</option>
                  <option value="base">Base</option>
                  <option value="sport">Sport</option>
                  <option value="luxury">Luxury</option>
                  <option value="performance">Performance</option>
                </select>
              </div>

              <div style={fieldStyle}>
                <label style={fieldLabelStyle}>Share a video or photo of your car</label>
                <div style={mediaUploadStyle}>
                  <input
                    type="file"
                    id="media-upload"
                    style={mediaInputStyle}
                    accept="image/*,video/*"
                    multiple
                    onChange={handleMediaUpload}
                  />
                  <label 
                    htmlFor="media-upload" 
                    style={mediaLabelStyle}
                    onMouseEnter={() => setIsMediaPlaceholderHovered(true)}
                    onMouseLeave={() => setIsMediaPlaceholderHovered(false)}
                  >
                    <div style={mediaPlaceholderStyle}>
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                        <circle cx="8.5" cy="8.5" r="1.5"/>
                        <polyline points="21 15 16 10 5 21"/>
                      </svg>
                    </div>
                  </label>
                  
                  {mediaPreviews.length > 0 && (
                    <div style={mediaPreviewsStyle}>
                      {mediaPreviews.map((preview, index) => (
                        <div key={index} style={mediaPreviewStyle}>
                          {mediaFiles[index]?.type.startsWith('video/') ? (
                            <video src={preview} controls style={mediaItemStyle} />
                          ) : (
                            <img src={preview} alt={`Preview ${index + 1}`} style={mediaItemStyle} />
                          )}
                          <button
                            type="button"
                            style={getMediaRemoveStyle(index)}
                            onClick={() => handleRemoveMedia(index)}
                            onMouseEnter={() => setHoveredMediaRemove(index)}
                            onMouseLeave={() => setHoveredMediaRemove(null)}
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

              <TextField
                label={
                  <>
                  Verify Ownership
                  <span style={fieldHintStyle}>
                    Enter your Vehicle Identification Number (VIN) for highest verification level
                  </span>
                  </>
                }
                placeholder="Enter VIN (17 characters)"
                value={vinNumber}
                onChange={(e) => {
                  const value = e.target.value.toUpperCase().slice(0, 17);
                  setVinNumber(value);
                }}
                maxLength={17}
                fullWidth
                helperText={
                  <div style={vinDisclaimerStyle}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--color-primary-500, #E90C17)', flexShrink: 0, marginTop: '2px' }}>
                      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                      <path d="M12 8v4M12 16h.01"/>
                    </svg>
                    <span style={{ fontFamily: 'var(--font-body, Geist, sans-serif)', fontWeight: 400, fontSize: '12px', lineHeight: '1.5em', color: 'var(--color-neutrals-3, #353945)' }}>
                      Your VIN information is 100% confidential and will be securely stored. It is only used for verification purposes.
                    </span>
                  </div>
                }
              />
            </div>
            */}
          </div>
        </div>

        {/* Submit Button */}
        <div style={footerStyle}>
          <Button
            type="button"
            color="primary"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              handleSubmit();
            }}
            disabled={rating === 0 || !reviewTitle.trim() || !reviewContent.trim()}
            style={{ width: '100%', maxWidth: '328px', height: '48px' }}
          >
            {isEditMode ? 'Update Review' : 'Submit Your Review'}
          </Button>
        </div>
      </div>

      {/* Fullscreen Textarea Overlay */}
      {isTextareaExpanded && (
        <div style={fullscreenOverlayStyle}>
          <div style={fullscreenContainerStyle}>
            <div style={fullscreenHeaderStyle}>
              <label style={fullscreenLabelStyle}>Your Review</label>
              <button
                type="button"
                style={fullscreenCloseStyle}
                onClick={() => setIsTextareaExpanded(false)}
                onMouseEnter={() => setIsFullscreenCloseHovered(true)}
                onMouseLeave={() => setIsFullscreenCloseHovered(false)}
                aria-label="Collapse"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </div>
            <textarea
              style={fullscreenTextareaStyle}
              placeholder="Let others know what you like and dislike based on your hands-on experience with this vehicle"
              value={reviewContent}
              onChange={(e) => setReviewContent(e.target.value)}
              autoFocus
            />
          </div>
        </div>
      )}
    </ModalShell>
  );
};

export default WriteReviewModal;
