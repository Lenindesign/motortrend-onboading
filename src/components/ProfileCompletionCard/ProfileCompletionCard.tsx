/**
 * ProfileCompletionCard Component
 * Migrated to inline React styles - no external CSS dependency
 */
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../Icon';
import { VehicleSearch } from '../VehicleSearch';
import VehicleCard from '../VehicleCard';
import { vehicleImageFor, parseVehicleName } from '../../utils/vehicleImages';
import Button from '../../design-system/components/Button';
import RatingModal from '../RatingModal';
import { useRating } from '../../contexts/RatingContext';
import { CardShell } from '../atoms/CardShell/CardShell';

// Using new graphics for user types
const buyerImage = 'https://d2kde5ohu8qb21.cloudfront.net/files/69101763c398630002aedb21/buyer.svg';
const enthusiastImage = 'https://d2kde5ohu8qb21.cloudfront.net/files/691017650e4b090002079ec0/enthusiast.svg';
const bothImage = 'https://d2kde5ohu8qb21.cloudfront.net/files/691017670e4b090002079ec2/both.svg';

export interface OnboardingStatus {
  step1: boolean;
  step2: boolean;
  step3: boolean;
  step4: boolean;
}

export interface OnboardingData {
  name?: string;
  location?: string;
  interests?: string[];
  vehicles?: Array<{name: string, ownership: 'own' | 'want', rating?: number}>;
  newsletters?: string[];
  userType?: string;
  joinDate?: string;
}

export interface ProfileCompletionCardProps {
  onboardingData?: OnboardingData;
  onUpdateStep1?: (data: { name: string; location: string }) => void;
  onUpdateStep2?: (data: { interests: string[] }) => void;
  onUpdateStep3?: (data: { vehicleType: 'own' | 'want'; vehicle: string }) => void;
  onUpdateStep4?: (data: { newsletters: string[] }) => void;
  onDismiss?: () => void;
}

export const ProfileCompletionCard: React.FC<ProfileCompletionCardProps> = ({ 
  onUpdateStep1,
  onUpdateStep2,
  onUpdateStep3,
  onUpdateStep4,
  onDismiss 
}) => {
  const navigate = useNavigate();
  const [expandedStep, setExpandedStep] = useState<number | null>(null);
  const [localOnboardingData, setLocalOnboardingData] = useState<OnboardingData>({});
  
  // Responsive state
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  
  // Hover states
  const [hoveredStep, setHoveredStep] = useState<number | null>(null);
  const [isDismissHovered, setIsDismissHovered] = useState(false);
  const [hoveredUserType, setHoveredUserType] = useState<string | null>(null);
  const [hoveredOption, setHoveredOption] = useState<string | null>(null);
  const [hoveredRadio, setHoveredRadio] = useState<string | null>(null);
  const [isSaveHovered, setIsSaveHovered] = useState(false);
  const [isAddBtnHovered, setIsAddBtnHovered] = useState(false);
  const [isCancelBtnHovered, setIsCancelBtnHovered] = useState(false);
  const [hoveredVehicleItem, setHoveredVehicleItem] = useState<string | null>(null);
  const [hoveredRemoveBtn, setHoveredRemoveBtn] = useState<string | null>(null);
  const [focusedInput, setFocusedInput] = useState<string | null>(null);
  const [isLocationBtnHovered, setIsLocationBtnHovered] = useState(false);
  
  // Responsive handler
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
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
  
  // Local state for each step
  const [step1Name, setStep1Name] = useState('');
  const [step1Location, setStep1Location] = useState('');
  const [isDetectingLocation, setIsDetectingLocation] = useState(false);
  const [step2UserType, setStep2UserType] = useState<string>('');
  const [step3Vehicles, setStep3Vehicles] = useState<Array<{name: string, ownership: 'own' | 'want', rating?: number}>>([]);
  const [step4Newsletters, setStep4Newsletters] = useState<string[]>([]);

  // Rating modal state
  const [ratingModal, setRatingModal] = useState<{isOpen: boolean, vehicleName: string, currentRating?: number}>({
    isOpen: false,
    vehicleName: '',
    currentRating: 0
  });
  const { getUserRating, setUserRating } = useRating();

  // Update state when localStorage data is loaded
  useEffect(() => {
    if (localOnboardingData.name !== undefined) {
      setStep1Name(localOnboardingData.name || '');
      setStep1Location(localOnboardingData.location || '');
      setStep2UserType(localOnboardingData.userType || '');
      setStep3Vehicles(localOnboardingData.vehicles || []);
      setStep4Newsletters(localOnboardingData.newsletters || []);
    }
  }, [localOnboardingData]);

  // Calculate completion status based on actual data
  const step1Completed = !!(step1Name && step1Name.trim() !== '');
  const step2Completed = !!step2UserType;
  const step3Completed = step3Vehicles.length > 0;
  const step4Completed = step4Newsletters.length > 0;

  const steps = [
    { number: 1, title: 'Tell us about yourself', completed: step1Completed },
    { number: 2, title: 'Your interests', completed: step2Completed },
    { number: 3, title: 'Your vehicles', completed: step3Completed },
    { number: 4, title: 'Newsletter preferences', completed: step4Completed },
  ];

  const completedCount = steps.filter(step => step.completed).length;
  const totalSteps = steps.length;
  const progressPercentage = (completedCount / totalSteps) * 100;
  const isFullyComplete = completedCount === totalSteps;

  const handleToggleStep = (stepNumber: number) => {
    setExpandedStep(expandedStep === stepNumber ? null : stepNumber);
  };

  const handleSaveStep1 = () => {
    if (step1Name && onUpdateStep1) {
      onUpdateStep1({ name: step1Name, location: step1Location });
      setExpandedStep(null);
    }
  };

  const handleSaveStep2 = () => {
    if (step2UserType && onUpdateStep2) {
      const interests: string[] = [];
      if (step2UserType === 'buyer') {
        interests.push('Car Buyer');
      } else if (step2UserType === 'enthusiast') {
        interests.push('Car Enthusiast');
      } else if (step2UserType === 'both') {
        interests.push('Car Buyer', 'Car Enthusiast');
      }
      onUpdateStep2({ interests });
      const updatedData = { ...localOnboardingData, userType: step2UserType };
      setLocalOnboardingData(updatedData);
      localStorage.setItem('onboardingData', JSON.stringify(updatedData));
      setExpandedStep(null);
    }
  };

  const handleSaveStep3 = () => {
    if (step3Vehicles.length > 0 && onUpdateStep3) {
      const firstVehicle = step3Vehicles[0];
      onUpdateStep3({ vehicleType: firstVehicle.ownership, vehicle: firstVehicle.name });
      setExpandedStep(null);
    }
  };

  const handleSaveStep4 = () => {
    if (onUpdateStep4) {
      onUpdateStep4({ newsletters: step4Newsletters });
      setExpandedStep(null);
    }
  };

  const handleVehicleSelect = (vehicle: { name: string; ownership: 'own' | 'want' }) => {
    setStep3Vehicles([...step3Vehicles, vehicle]);
  };

  const handleRemoveVehicle = (vehicleName: string) => {
    setStep3Vehicles(step3Vehicles.filter(vehicle => vehicle.name !== vehicleName));
  };

  const handleUserTypeSelect = (userType: string) => {
    setStep2UserType(userType);
  };

  const toggleNewsletter = (newsletter: string) => {
    setStep4Newsletters(prev => 
      prev.includes(newsletter) 
        ? prev.filter(n => n !== newsletter)
        : [...prev, newsletter]
    );
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
    setUserRating(ratingModal.vehicleName, rating);
    setRatingModal({ isOpen: false, vehicleName: '', currentRating: 0 });
    
    try {
      const { year, make, model } = parseVehicleName(ratingModal.vehicleName);
      navigate(`/vehicles/${year}/${make}/${model}`);
    } catch (error) {
      console.error('Error parsing vehicle name:', error);
    }
  };

  const handleRatingModalClose = () => {
    setRatingModal({ isOpen: false, vehicleName: '', currentRating: 0 });
  };

  // Location detection handler
  const handleDetectLocation = async () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by this browser.');
      return;
    }

    setIsDetectingLocation(true);

    try {
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 300000
        });
      });

      const { latitude, longitude } = position.coords;
      
      try {
        const response = await fetch(
          `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`
        );
        const data = await response.json();
        
        if (data.city && data.principalSubdivision) {
          setStep1Location(`${data.city}, ${data.principalSubdivision}`);
        } else if (data.locality) {
          setStep1Location(data.locality);
        } else {
          setStep1Location(`${latitude.toFixed(4)}, ${longitude.toFixed(4)}`);
        }
      } catch (error) {
        console.error('Reverse geocoding failed:', error);
        setStep1Location(`${latitude.toFixed(4)}, ${longitude.toFixed(4)}`);
      }
    } catch (error) {
      console.error('Geolocation error:', error);
      alert('Unable to detect your location. Please enter it manually.');
    } finally {
      setIsDetectingLocation(false);
    }
  };

  // ==================== INLINE STYLES ====================

  const cardInnerStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: 'var(--spacing-3, 24px)',
    width: '100%',
    maxWidth: '966px',
  };

  const headerStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: 'var(--spacing-2, 16px)',
  };

  const titleRowStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 'var(--spacing-2, 16px)',
  };

  const iconStyle: React.CSSProperties = {
    width: '40px',
    height: '40px',
    background: 'var(--color-white, #FFFFFF)',
    borderRadius: 'var(--border-radius-md, 8px)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: isFullyComplete ? '#34A853' : 'var(--color-blue, #186CEA)',
    flexShrink: 0,
  };

  const titleContentStyle: React.CSSProperties = {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    gap: 'var(--spacing-1, 8px)',
  };

  const titleStyle: React.CSSProperties = {
    fontFamily: 'var(--font-heading, Poppins, sans-serif)',
    fontWeight: 600,
    fontSize: isMobile ? '18px' : '22px',
    lineHeight: '1.3em',
    color: 'var(--color-neutrals-1, #141416)',
    margin: 0,
  };

  const subtitleStyle: React.CSSProperties = {
    fontFamily: 'var(--font-body, Geist, sans-serif)',
    fontWeight: 400,
    fontSize: '15px',
    lineHeight: '1.5em',
    color: 'var(--color-neutrals-3, #353945)',
    margin: 0,
  };

  const dismissStyle: React.CSSProperties = {
    width: '32px',
    height: '32px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: isDismissHovered ? 'var(--color-neutrals-7, #F4F5F6)' : 'var(--color-white, #FFFFFF)',
    border: '1px solid var(--color-neutrals-6, #E6E8EC)',
    borderRadius: 'var(--border-radius-sm, 4px)',
    cursor: 'pointer',
    color: isDismissHovered ? 'var(--color-neutrals-2, #23262F)' : 'var(--color-neutrals-4, #6E7481)',
    transition: 'var(--transition-fast, all 150ms ease-in-out)',
    flexShrink: 0,
  };

  const progressContainerStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  };

  const progressBarStyle: React.CSSProperties = {
    width: '100%',
    height: '6px',
    background: 'var(--color-neutrals-6, #E6E8EC)',
    borderRadius: '3px',
    overflow: 'hidden',
  };

  const progressFillStyle: React.CSSProperties = {
    height: '100%',
    width: `${progressPercentage}%`,
    background: isFullyComplete ? '#34A853' : 'var(--color-neutrals-1, #141416)',
    borderRadius: '3px',
    transition: 'width 0.4s ease',
  };

  const progressTextStyle: React.CSSProperties = {
    fontFamily: 'var(--font-body, Geist, sans-serif)',
    fontWeight: 600,
    fontSize: '14px',
    color: 'var(--color-neutrals-4, #6E7481)',
  };

  const stepsContainerStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  };

  const getStepStyle = (stepNumber: number, completed: boolean): React.CSSProperties => ({
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    padding: '20px',
    background: 'white',
    border: `1px solid ${hoveredStep === stepNumber ? 'var(--color-neutrals-5, #B1B5C3)' : 'var(--color-neutrals-6, #E6E8EC)'}`,
    borderRadius: 'var(--border-radius-md, 8px)',
    transition: 'all 0.2s',
    boxShadow: hoveredStep === stepNumber ? '0px 2px 8px rgba(20, 20, 22, 0.04)' : 'none',
  });

  const stepHeaderStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: '16px',
  };

  const stepInfoStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: '12px',
    flex: 1,
  };

  const stepIconStyle: React.CSSProperties = {
    width: '20px',
    height: '20px',
    flexShrink: 0,
  };

  const stepContentStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: '2px',
    flex: 1,
  };

  const stepTitleStyle: React.CSSProperties = {
    fontFamily: 'var(--font-body, Geist, sans-serif)',
    fontWeight: 600,
    fontSize: '16px',
    lineHeight: '1.5em',
    color: 'var(--color-neutrals-1, #141416)',
  };

  const formStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: 'var(--spacing-3, 24px)',
    padding: isMobile ? '16px' : 'var(--spacing-3, 24px)',
    background: 'var(--color-neutrals-8, #FCFCFD)',
    borderRadius: 'var(--border-radius-md, 8px)',
    marginTop: 'var(--spacing-2, 16px)',
    border: '1px solid var(--color-neutrals-6, #E6E8EC)',
  };

  const formTitleStyle: React.CSSProperties = {
    fontFamily: 'var(--font-heading, Poppins, sans-serif)',
    fontWeight: 600,
    fontSize: '18px',
    lineHeight: '1.4em',
    color: 'var(--color-neutrals-1, #141416)',
    margin: 0,
  };

  const formSubtitleStyle: React.CSSProperties = {
    fontFamily: 'var(--font-body, Geist, sans-serif)',
    fontWeight: 600,
    fontSize: '14px',
    lineHeight: '1.5em',
    color: 'var(--color-neutrals-3, #353945)',
    margin: 0,
  };

  const fieldsStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  };

  const fieldStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  };

  const labelStyle: React.CSSProperties = {
    fontFamily: 'var(--font-body, Geist, sans-serif)',
    fontWeight: 600,
    fontSize: '14px',
    lineHeight: '1.5em',
    color: 'var(--color-neutrals-1, #141416)',
  };

  const getInputStyle = (inputName: string): React.CSSProperties => ({
    padding: '12px 16px',
    background: 'white',
    border: `1px solid ${focusedInput === inputName ? 'var(--color-blue, #186CEA)' : 'var(--color-neutrals-6, #E6E8EC)'}`,
    borderRadius: 'var(--border-radius-md, 8px)',
    fontFamily: 'var(--font-body, Geist, sans-serif)',
    fontSize: '16px',
    color: 'var(--color-neutrals-1, #141416)',
    transition: 'all 0.2s',
    width: '100%',
    outline: 'none',
    boxShadow: focusedInput === inputName ? '0 0 0 3px rgba(24, 108, 234, 0.1)' : 'none',
  });

  const locationContainerStyle: React.CSSProperties = {
    display: 'flex',
    gap: '8px',
    alignItems: 'center',
  };

  const locationBtnStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '44px',
    height: '44px',
    background: isLocationBtnHovered ? 'var(--color-neutrals-7, #F4F5F6)' : 'white',
    border: '1px solid var(--color-neutrals-6, #E6E8EC)',
    borderRadius: 'var(--border-radius-md, 8px)',
    cursor: isDetectingLocation ? 'not-allowed' : 'pointer',
    color: 'var(--color-neutrals-4, #6E7481)',
    transition: 'all 0.2s',
    flexShrink: 0,
    opacity: isDetectingLocation ? 0.7 : 1,
  };

  const getSaveBtnStyle = (disabled: boolean): React.CSSProperties => ({
    padding: '12px 28px',
    background: disabled ? 'var(--color-neutrals-5, #B1B5C3)' : (isSaveHovered ? 'var(--color-neutrals-2, #23262F)' : 'var(--color-neutrals-1, #141416)'),
    color: 'white',
    border: 'none',
    borderRadius: 'var(--border-radius-sm, 4px)',
    fontFamily: 'var(--font-body, Geist, sans-serif)',
    fontWeight: 600,
    fontSize: '15px',
    cursor: disabled ? 'not-allowed' : 'pointer',
    transition: 'all 0.2s',
    alignSelf: 'flex-start',
    opacity: disabled ? 0.5 : 1,
    transform: isSaveHovered && !disabled ? 'translateY(-1px)' : 'translateY(0)',
    boxShadow: isSaveHovered && !disabled ? '0 2px 8px rgba(20, 20, 22, 0.15)' : 'none',
    width: isMobile ? '100%' : 'auto',
  });

  const userTypeSelectionStyle: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)',
    gap: isMobile ? '16px' : 'var(--spacing-2, 16px)',
    width: '100%',
    maxWidth: isMobile ? '343px' : '800px',
    margin: '0 auto',
    justifyItems: 'center',
    justifyContent: 'center',
  };

  const getUserTypeOptionStyle = (userType: string): React.CSSProperties => {
    const isSelected = step2UserType === userType;
    const isHovered = hoveredUserType === userType;
    
    return {
      display: 'flex',
      flexDirection: isMobile ? 'row' : 'column',
      alignItems: 'center',
      justifyContent: isMobile ? 'center' : 'flex-start',
      gap: isMobile ? '16px' : '0',
      padding: 'var(--spacing-4, 32px)',
      background: isSelected ? 'var(--color-neutrals-2, #23262F)' : 'var(--color-white, #FFFFFF)',
      border: `2px solid ${isSelected ? 'var(--color-neutrals-2, #23262F)' : 'var(--color-neutrals-6, #E6E8EC)'}`,
      borderRadius: 'var(--border-radius-lg, 16px)',
      cursor: 'pointer',
      transition: 'all 0.2s ease',
      textAlign: isMobile ? 'left' : 'center',
      width: '100%',
      maxWidth: isMobile ? '100%' : '280px',
      transform: (isSelected || isHovered) ? 'translateY(-2px)' : 'translateY(0)',
      boxShadow: (isSelected || isHovered) ? '0px 6px 24px 0px rgba(20, 20, 22, 0.1)' : 'none',
    };
  };

  const userTypeImageStyle: React.CSSProperties = {
    marginBottom: isMobile ? 0 : 'var(--spacing-3, 24px)',
    flexShrink: 0,
  };

  const getUserTypeImgStyle = (userType: string): React.CSSProperties => {
    const isSelected = step2UserType === userType;
    return {
      width: isMobile ? '133px' : '120px',
      height: isMobile ? '93px' : 'auto',
      objectFit: isMobile ? 'cover' : 'contain',
      borderRadius: 'var(--border-radius-md, 8px)',
      border: isSelected ? '2px solid var(--color-primary-1, #E90C17)' : '1px solid var(--color-neutrals-1, #141416)',
      transition: 'border-color var(--transition-fast, all 150ms ease-in-out)',
    };
  };

  const userTypeContentStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
    flex: 1,
  };

  const getUserTypeTitleStyle = (userType: string): React.CSSProperties => {
    const isSelected = step2UserType === userType;
    return {
      fontFamily: isMobile ? 'Gilroy, sans-serif' : 'var(--font-heading, Poppins, sans-serif)',
      fontWeight: 600,
      fontSize: isMobile ? '18px' : '20px',
      lineHeight: isMobile ? '1.33em' : '1.3',
      color: isSelected ? (isMobile ? 'var(--color-neutrals-7, #F4F5F6)' : 'var(--color-white, #FFFFFF)') : 'var(--color-neutrals-2, #23262F)',
      margin: 0,
      marginBottom: isMobile ? 0 : 'var(--spacing-1, 8px)',
    };
  };

  const getUserTypeDescStyle = (userType: string): React.CSSProperties => {
    const isSelected = step2UserType === userType;
    return {
      fontFamily: isMobile ? 'Geist, sans-serif' : 'var(--font-body, Geist, sans-serif)',
      fontWeight: 400,
      fontSize: isMobile ? '12px' : '16px',
      lineHeight: isMobile ? '1.3em' : '1.5',
      color: isSelected ? (isMobile ? 'var(--color-neutrals-7, #F4F5F6)' : 'var(--color-white, #FFFFFF)') : (isMobile ? 'var(--color-neutrals-2, #23262F)' : 'var(--color-neutrals-3, #353945)'),
      margin: 0,
    };
  };

  const optionsStyle: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: isMobile ? '1fr' : 'repeat(2, 1fr)',
    gap: 'var(--spacing-2, 16px)',
  };

  const optionsSingleColumnStyle: React.CSSProperties = {
    ...optionsStyle,
    gridTemplateColumns: '1fr',
  };

  const getOptionStyle = (optionId: string): React.CSSProperties => {
    const isHovered = hoveredOption === optionId;
    return {
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
      padding: '12px 16px',
      background: isHovered ? 'var(--color-neutrals-8, #FCFCFD)' : 'white',
      border: `1px solid ${isHovered ? 'var(--color-neutrals-5, #B1B5C3)' : 'var(--color-neutrals-6, #E6E8EC)'}`,
      borderRadius: 'var(--border-radius-sm, 4px)',
      cursor: 'pointer',
      transition: 'all 0.2s',
    };
  };

  const checkboxStyle: React.CSSProperties = {
    width: '18px',
    height: '18px',
    cursor: 'pointer',
    accentColor: 'var(--color-neutrals-1, #141416)',
  };

  const optionLabelStyle: React.CSSProperties = {
    fontFamily: 'var(--font-body, Geist, sans-serif)',
    fontWeight: 600,
    fontSize: '14px',
    color: 'var(--color-neutrals-1, #141416)',
  };

  const vehicleSearchStyle: React.CSSProperties = {
    marginBottom: 'var(--spacing-4, 32px)',
    padding: isMobile ? 'var(--spacing-2, 16px)' : 'var(--spacing-3, 24px)',
    backgroundColor: 'var(--color-neutrals-8, #FCFCFD)',
    border: '1px solid var(--color-neutrals-6, #E6E8EC)',
    borderRadius: 'var(--border-radius-md, 8px)',
  };

  const searchHeaderStyle: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: isMobile ? 'flex-start' : 'center',
    marginBottom: 'var(--spacing-2, 16px)',
    flexDirection: isMobile ? 'column' : 'row',
    gap: isMobile ? 'var(--spacing-1, 8px)' : '0',
  };

  const searchHeaderTitleStyle: React.CSSProperties = {
    fontFamily: 'var(--font-heading, Poppins, sans-serif)',
    fontWeight: 'var(--font-weight-bold, 600)',
    fontSize: '16px',
    lineHeight: '1.5em',
    color: 'var(--color-neutrals-2, #23262F)',
    margin: 0,
  };

  const vehiclesDisplayStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: 'var(--spacing-2, 16px)',
    width: '100%',
  };

  const vehiclesDisplayTitleStyle: React.CSSProperties = {
    fontFamily: 'var(--font-heading, Poppins, sans-serif)',
    fontWeight: 600,
    fontSize: '14px',
    lineHeight: '1.4em',
    color: 'var(--color-neutrals-1, #141416)',
    margin: 0,
  };

  const noVehiclesStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 'var(--spacing-4, 32px)',
    textAlign: 'center',
    color: 'var(--color-neutrals-3, #353945)',
    fontFamily: 'var(--font-body, Geist, sans-serif)',
    fontSize: '14px',
    lineHeight: '1.5em',
    backgroundColor: 'var(--color-neutrals-7, #F4F5F6)',
    border: '1px dashed var(--color-neutrals-5, #B1B5C3)',
    borderRadius: 'var(--border-radius-sm, 4px)',
  };

  return (
    <CardShell
      padding="md"
      hasHover={false}
      hasShadow={true}
      borderRadius="md"
      background="white"
      style={{
        borderColor: isFullyComplete ? '#e6e8ec' : undefined,
        backgroundColor: isFullyComplete ? '#fcfcfd' : undefined,
      }}
    >
      <div style={cardInnerStyle}>
        <div style={headerStyle}>
          <div style={titleRowStyle}>
            <div style={iconStyle}>
              <Icon name="check_circle" size={24} />
            </div>
            <div style={titleContentStyle}>
              <h3 style={titleStyle}>
                {isFullyComplete 
                  ? 'Profile Complete!' 
                  : `Complete Your Profile (${completedCount} of ${totalSteps})`
                }
              </h3>
              <p style={subtitleStyle}>
                {isFullyComplete
                  ? 'Your profile is all set up! You can edit any information below.'
                  : 'Get personalized recommendations and tailored content by completing your profile.'
                }
              </p>
            </div>
            {onDismiss && (
              <button 
                style={dismissStyle} 
                onClick={onDismiss} 
                aria-label="Dismiss"
                onMouseEnter={() => setIsDismissHovered(true)}
                onMouseLeave={() => setIsDismissHovered(false)}
              >
                <Icon name="close" size={20} />
              </button>
            )}
          </div>

          <div style={progressContainerStyle}>
            <div style={progressBarStyle}>
              <div style={progressFillStyle} />
            </div>
            <span style={progressTextStyle}>
              {Math.round(progressPercentage)}% Complete
            </span>
          </div>
        </div>

        <div style={stepsContainerStyle}>
          {steps.map((step) => (
            <div 
              key={step.number} 
              style={getStepStyle(step.number, step.completed)}
              onMouseEnter={() => setHoveredStep(step.number)}
              onMouseLeave={() => setHoveredStep(null)}
            >
              <div style={stepHeaderStyle}>
                <div style={stepInfoStyle}>
                  <div style={stepIconStyle}>
                    {step.completed ? (
                      <Icon name="check_circle" variant="filled" size={20} style={{ color: 'var(--color-semantic-success, #34A853)' }} />
                    ) : (
                      <Icon name="radio_button_unchecked" size={20} style={{ color: 'var(--color-neutrals-6, #E6E8EC)' }} />
                    )}
                  </div>
                  <div style={stepContentStyle}>
                    <span style={stepTitleStyle}>Step {step.number}: {step.title}</span>
                  </div>
                </div>
                <Button 
                  color="neutrals3" 
                  variant="solid" 
                  size="default"
                  onClick={() => handleToggleStep(step.number)}
                >
                  {expandedStep === step.number ? 'Cancel' : (step.completed ? 'Edit' : 'Complete →')}
                </Button>
              </div>

              {expandedStep === step.number && step.number === 1 && (
                <div style={formStyle}>
                  <h4 style={formTitleStyle}>Tell Us About Yourself</h4>
                  <div style={fieldsStyle}>
                    <div style={fieldStyle}>
                      <label style={labelStyle}>What is Your Name?</label>
                      <input 
                        type="text"
                        style={getInputStyle('name')}
                        placeholder="Name"
                        value={step1Name}
                        onChange={(e) => setStep1Name(e.target.value)}
                        onFocus={() => setFocusedInput('name')}
                        onBlur={() => setFocusedInput(null)}
                      />
                    </div>
                    <div style={fieldStyle}>
                      <label style={labelStyle}>Where are you located? (Optional)</label>
                      <div style={locationContainerStyle}>
                        <input 
                          type="text"
                          style={{ ...getInputStyle('location'), flex: 1 }}
                          placeholder="Location"
                          value={step1Location}
                          onChange={(e) => setStep1Location(e.target.value)}
                          onFocus={() => setFocusedInput('location')}
                          onBlur={() => setFocusedInput(null)}
                        />
                        <button
                          type="button"
                          style={locationBtnStyle}
                          onClick={handleDetectLocation}
                          disabled={isDetectingLocation}
                          title={isDetectingLocation ? 'Detecting location...' : 'Auto-detect location'}
                          onMouseEnter={() => setIsLocationBtnHovered(true)}
                          onMouseLeave={() => setIsLocationBtnHovered(false)}
                        >
                          <Icon 
                            name={isDetectingLocation ? "refresh" : "my_location"} 
                            size={20} 
                            style={isDetectingLocation ? { animation: 'spin 1s linear infinite' } : undefined}
                          />
                        </button>
                      </div>
                    </div>
                  </div>
                  <button 
                    style={getSaveBtnStyle(!step1Name)}
                    onClick={handleSaveStep1}
                    disabled={!step1Name}
                    onMouseEnter={() => setIsSaveHovered(true)}
                    onMouseLeave={() => setIsSaveHovered(false)}
                  >
                    Save Changes
                  </button>
                </div>
              )}

              {expandedStep === step.number && step.number === 2 && (
                <div style={formStyle}>
                  <h4 style={formTitleStyle}>What describes you best?</h4>
                  <p style={formSubtitleStyle}>Choose the option that best fits your automotive interests</p>
                  <div style={userTypeSelectionStyle}>
                    <button
                      style={getUserTypeOptionStyle('buyer')}
                      onClick={() => handleUserTypeSelect('buyer')}
                      type="button"
                      onMouseEnter={() => setHoveredUserType('buyer')}
                      onMouseLeave={() => setHoveredUserType(null)}
                    >
                      <div style={userTypeImageStyle}>
                        <img 
                          src={buyerImage} 
                          alt="Car Buyer" 
                          style={getUserTypeImgStyle('buyer')}
                        />
                      </div>
                      <div style={userTypeContentStyle}>
                        <h3 style={getUserTypeTitleStyle('buyer')}>Buyer</h3>
                        <p style={getUserTypeDescStyle('buyer')}>
                          Shopping for a new or used car
                        </p>
                      </div>
                    </button>
                    
                    <button
                      style={getUserTypeOptionStyle('enthusiast')}
                      onClick={() => handleUserTypeSelect('enthusiast')}
                      type="button"
                      onMouseEnter={() => setHoveredUserType('enthusiast')}
                      onMouseLeave={() => setHoveredUserType(null)}
                    >
                      <div style={userTypeImageStyle}>
                        <img 
                          src={enthusiastImage} 
                          alt="Car Enthusiast" 
                          style={getUserTypeImgStyle('enthusiast')}
                        />
                      </div>
                      <div style={userTypeContentStyle}>
                        <h3 style={getUserTypeTitleStyle('enthusiast')}>Enthusiast</h3>
                        <p style={getUserTypeDescStyle('enthusiast')}>
                          Love cars, reviews, and auto culture
                        </p>
                      </div>
                    </button>
                    
                    <button
                      style={getUserTypeOptionStyle('both')}
                      onClick={() => handleUserTypeSelect('both')}
                      type="button"
                      onMouseEnter={() => setHoveredUserType('both')}
                      onMouseLeave={() => setHoveredUserType(null)}
                    >
                      <div style={userTypeImageStyle}>
                        <img 
                          src={bothImage} 
                          alt="Both" 
                          style={getUserTypeImgStyle('both')}
                        />
                      </div>
                      <div style={userTypeContentStyle}>
                        <h3 style={getUserTypeTitleStyle('both')}>Both</h3>
                        <p style={getUserTypeDescStyle('both')}>
                          Car lover always eyeing the next ride
                        </p>
                      </div>
                    </button>
                  </div>
                  <button 
                    style={getSaveBtnStyle(!step2UserType)}
                    onClick={handleSaveStep2}
                    disabled={!step2UserType}
                    onMouseEnter={() => setIsSaveHovered(true)}
                    onMouseLeave={() => setIsSaveHovered(false)}
                  >
                    Save Changes
                  </button>
                </div>
              )}

              {expandedStep === step.number && step.number === 3 && (
                <div style={formStyle}>
                  <h4 style={formTitleStyle}>Your Vehicles</h4>
                  <div style={fieldsStyle}>
                    {/* Vehicle Search - always visible */}
                    <div style={vehicleSearchStyle}>
                      <div style={searchHeaderStyle}>
                        <h5 style={searchHeaderTitleStyle}>Search for a vehicle</h5>
                      </div>
                      <VehicleSearch
                        onVehicleSelect={handleVehicleSelect}
                        placeholder="Start typing to search..."
                      />
                    </div>

                    {/* Selected Vehicles */}
                    {step3Vehicles.length > 0 ? (
                      <div style={vehiclesDisplayStyle}>
                        <h5 style={vehiclesDisplayTitleStyle}>Selected Vehicles:</h5>
                        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px' }}>
                          {step3Vehicles.map((vehicle, index) => (
                            <VehicleCard
                              key={index}
                              image={vehicleImageFor(vehicle.name)}
                              name={vehicle.name}
                              type="Vehicle"
                              rating1={9.1}
                              rating2={8.5}
                              hasMultipleRatings={true}
                              isBookmarked={true}
                              onBookmark={() => handleRemoveVehicle(vehicle.name)}
                              ownership={vehicle.ownership}
                              onOwnershipChange={(value) => {
                                const updatedVehicles = step3Vehicles.map(v => 
                                  v.name === vehicle.name ? { ...v, ownership: value } : v
                                );
                                setStep3Vehicles(updatedVehicles);
                              }}
                              onViewDetails={() => {
                                const { year, make, model } = parseVehicleName(vehicle.name);
                                navigate(`/vehicles/${year}/${make}/${model}`);
                              }}
                              onRate={() => handleRateVehicle(vehicle.name)}
                              userRating={getUserRating(vehicle.name)}
                            />
                          ))}
                        </div>
                      </div>
                    ) : (
                      <div style={noVehiclesStyle}>
                        <p style={{ margin: 0 }}>No vehicles selected yet.</p>
                      </div>
                    )}
                  </div>
                  <button 
                    style={getSaveBtnStyle(false)}
                    onClick={handleSaveStep3}
                    onMouseEnter={() => setIsSaveHovered(true)}
                    onMouseLeave={() => setIsSaveHovered(false)}
                  >
                    Save Changes
                  </button>
                </div>
              )}

              {expandedStep === step.number && step.number === 4 && (
                <div style={formStyle}>
                  <h4 style={formTitleStyle}>Let's Keep In Touch</h4>
                  <p style={formSubtitleStyle}>With Personalized Car Information and Inspiration</p>
                  <div style={optionsSingleColumnStyle}>
                    {[
                      { id: 'motortrend', label: 'Subscribe to MotorTrend Newsletter' },
                      { id: 'hotrod', label: 'Subscribe to HOT ROD Newsletter' },
                      { id: 'events', label: 'Subscribe to Our Events Newsletter' }
                    ].map((newsletter) => (
                      <label 
                        key={newsletter.id} 
                        style={getOptionStyle(newsletter.id)}
                        onMouseEnter={() => setHoveredOption(newsletter.id)}
                        onMouseLeave={() => setHoveredOption(null)}
                      >
                        <input
                          type="checkbox"
                          style={checkboxStyle}
                          checked={step4Newsletters.includes(newsletter.id)}
                          onChange={() => toggleNewsletter(newsletter.id)}
                        />
                        <span style={optionLabelStyle}>{newsletter.label}</span>
                      </label>
                    ))}
                  </div>
                  <button 
                    style={getSaveBtnStyle(false)}
                    onClick={handleSaveStep4}
                    onMouseEnter={() => setIsSaveHovered(true)}
                    onMouseLeave={() => setIsSaveHovered(false)}
                  >
                    Save Changes
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Rating Modal */}
        <RatingModal
          isOpen={ratingModal.isOpen}
          onClose={handleRatingModalClose}
          onRate={handleRatingSubmit}
          vehicleName={ratingModal.vehicleName}
          currentRating={ratingModal.currentRating}
          onRateAndReview={handleRateAndReview}
        />
      </div>
    </CardShell>
  );
};
