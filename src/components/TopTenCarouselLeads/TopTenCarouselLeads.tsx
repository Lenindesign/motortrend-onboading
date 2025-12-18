/**
 * Top Ten Carousel with Leads Sidebar
 * A variant of TopTenCarousel with contextual listings sidebar
 */

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../Icon';
import { Badge } from '../atoms/Badge/Badge';
import { ActionBadge } from '../molecules/ActionBadge';
import SavedModal from '../SavedModal';
import { ListingCard } from '../ListingCard';
import { parseVehicleName, vehicleImageFor } from '../../utils/vehicleImages';
import { getVehicleBodyStyle } from '../../utils/vehicleBodyStyles';
import { generateStaffRating, generateCommunityRating } from '../../utils/vehicleRatings';
import { getVehicles } from '../../api/vehiclesApi';
import { generateLocalListings, getLocalListings } from '../../utils/localListings';
import type { LocalListing } from '../LocalListingsSidebar/LocalListingsSidebar';

export type VehicleType = 'SUV' | 'Sedan' | 'Truck' | 'Coupe' | 'Performance' | 'Recommended For You';
export type Subcategory = 'All' | 'Subcompact' | 'Compact' | 'Midsize' | 'Full-Size' | 'Luxury' | 'Electric';
export type RatingType = 'MotorTrend' | 'User Reviews';

interface CarouselVehicle {
  id: string;
  name: string;
  year: string;
  make: string;
  model: string;
  image: string;
  galleryImages?: string[];
  staffRating: number;
  communityRating: number;
  rank: number;
  priceMin?: number;
}

interface TopTenCarouselLeadsProps {
  className?: string;
  initialVehicleType?: VehicleType;
  initialSubcategory?: Subcategory;
  showLeads?: boolean;
}

export const TopTenCarouselLeads: React.FC<TopTenCarouselLeadsProps> = ({ 
  className = '', 
  initialVehicleType = 'SUV',
  initialSubcategory = 'All',
  showLeads = true
}) => {
  const navigate = useNavigate();
  
  const [selectedVehicleType, setSelectedVehicleType] = useState<VehicleType>(initialVehicleType);
  const [selectedSubcategory, setSelectedSubcategory] = useState<Subcategory>(initialSubcategory);
  const [ratingType, setRatingType] = useState<RatingType>('MotorTrend');
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isSliderHovered, setIsSliderHovered] = useState(false);
  const [savedVehicles, setSavedVehicles] = useState<Set<string>>(new Set());
  const [animationKey, setAnimationKey] = useState(0);
  const slideIntervalRef = useRef<number | null>(null);
  const carouselRef = useRef<HTMLDivElement>(null);
  const sliderRef = useRef<HTMLDivElement>(null);
  const [sliderHeight, setSliderHeight] = useState<number | null>(null);
  const [isInView, setIsInView] = useState(false);
  
  // Responsive state
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [isTablet, setIsTablet] = useState(window.innerWidth <= 1024);
  const [isNarrowScreen, setIsNarrowScreen] = useState(window.innerWidth < 1280);
  
  // Hover states
  const [hoveredNav, setHoveredNav] = useState<string | null>(null);
  const [hoveredDot, setHoveredDot] = useState<number | null>(null);
  const [isSaveBtnHovered, setIsSaveBtnHovered] = useState(false);
  
  // Touch/swipe state
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const minSwipeDistance = 50;

  // Saved modal state (for vehicles)
  const [isSavedModalOpen, setIsSavedModalOpen] = useState(false);
  const [savedVehicleName, setSavedVehicleName] = useState('');
  
  // Listings state
  const [currentListings, setCurrentListings] = useState<LocalListing[]>([]);
  const [isLoadingListings, setIsLoadingListings] = useState(false);
  
  // Saved modal state (for leads)
  const [isSavedLeadModalOpen, setIsSavedLeadModalOpen] = useState(false);
  const [savedLeadTitle, setSavedLeadTitle] = useState('');

  // Inject keyframes animations
  useEffect(() => {
    const styleId = 'top-ten-carousel-leads-styles';
    if (!document.getElementById(styleId)) {
      const style = document.createElement('style');
      style.id = styleId;
      style.textContent = `
        @keyframes kenBurnsZoom {
          0% { transform: scale(1); }
          100% { transform: scale(1.05); }
        }
        @keyframes progressCircle {
          0% { stroke-dasharray: 0 100; }
          100% { stroke-dasharray: 100 100; }
        }
        @keyframes shimmer {
          0% { background-position: -200px 0; }
          100% { background-position: calc(200px + 100%) 0; }
        }
      `;
      document.head.appendChild(style);
    }
    return () => {
      const existing = document.getElementById(styleId);
      if (existing) existing.remove();
    };
  }, []);

  // Responsive handler
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
      setIsTablet(window.innerWidth <= 1024);
      setIsNarrowScreen(window.innerWidth < 1280);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Track slider height to sync with sidebar (calculate from width × 9/16 aspect ratio)
  useEffect(() => {
    if (!sliderRef.current || isMobile || isTablet) return;
    
    const updateHeight = () => {
      if (sliderRef.current) {
        // Calculate height from width using 16:9 aspect ratio
        const width = sliderRef.current.getBoundingClientRect().width;
        const calculatedHeight = Math.round(width * (9 / 16));
        setSliderHeight(calculatedHeight);
      }
    };
    
    // Initial measurement after a small delay to ensure layout is complete
    requestAnimationFrame(updateHeight);
    
    // Use ResizeObserver to track width changes
    const resizeObserver = new ResizeObserver(updateHeight);
    resizeObserver.observe(sliderRef.current);
    
    // Also update on window resize
    window.addEventListener('resize', updateHeight);
    
    return () => {
      resizeObserver.disconnect();
      window.removeEventListener('resize', updateHeight);
    };
  }, [isMobile, isTablet]);

  // Load saved vehicles from localStorage
  useEffect(() => {
    const loadSavedVehicles = () => {
    try {
      const onboardingData = localStorage.getItem('onboardingData');
      if (onboardingData) {
        const data = JSON.parse(onboardingData);
        if (data.vehicles && Array.isArray(data.vehicles)) {
          const saved = new Set<string>(data.vehicles.map((v: { name: string }) => v.name));
          setSavedVehicles(saved);
          } else {
            setSavedVehicles(new Set());
        }
        } else {
          setSavedVehicles(new Set());
      }
    } catch (error) {
      console.error('Error loading saved vehicles:', error);
    }
    };
    
    loadSavedVehicles();
    
    // Listen for profile/onboarding data updates
    window.addEventListener('onboardingDataUpdated', loadSavedVehicles);
    window.addEventListener('storage', loadSavedVehicles);
    
    return () => {
      window.removeEventListener('onboardingDataUpdated', loadSavedVehicles);
      window.removeEventListener('storage', loadSavedVehicles);
    };
  }, []);

  const handleSaveVehicle = (vehicle: CarouselVehicle) => {
    try {
      const onboardingData = localStorage.getItem('onboardingData');
      let data = onboardingData ? JSON.parse(onboardingData) : { vehicles: [] };
      
      if (!data.vehicles) data.vehicles = [];

      const vehicleIndex = data.vehicles.findIndex((v: { name: string }) => v.name === vehicle.name);

      if (vehicleIndex > -1) {
        data.vehicles.splice(vehicleIndex, 1);
        setSavedVehicles(prev => {
          const newSet = new Set(prev);
          newSet.delete(vehicle.name);
          return newSet;
        });
      } else {
        data.vehicles.push({ name: vehicle.name, year: vehicle.year, make: vehicle.make, model: vehicle.model, ownership: 'want' });
        setSavedVehicles(prev => new Set(prev).add(vehicle.name));
        setSavedVehicleName(vehicle.name);
        setIsSavedModalOpen(true);
      }

      localStorage.setItem('onboardingData', JSON.stringify(data));
    } catch (error) {
      console.error('Error saving vehicle:', error);
    }
  };

  const allVehicleItems = useMemo(() => {
    const apiVehicles = getVehicles();
    return apiVehicles.map(v => ({
      name: `${v.year} ${v.make} ${v.model}`,
      image: v.image,
      galleryImages: v.galleryImages,
      bodyStyle: v.bodyStyle,
      staffRating: v.staffRating,
      communityRating: v.communityRating,
      priceMin: v.priceMin
    }));
  }, []);

  const getSubcategoriesForType = (type: VehicleType): Subcategory[] => {
    if (type === 'Performance' || type === 'Recommended For You') return ['All'];
    const commonSubcategories: Subcategory[] = ['All', 'Subcompact', 'Compact', 'Midsize', 'Full-Size', 'Luxury', 'Electric'];
    switch (type) {
      case 'SUV': return commonSubcategories;
      case 'Sedan': return ['All', 'Compact', 'Midsize', 'Full-Size', 'Electric'];
      case 'Truck': return ['All', 'Midsize', 'Full-Size', 'Electric'];
      case 'Coupe': return ['All', 'Compact', 'Midsize', 'Electric'];
      default: return ['All'];
    }
  };

  const getVehicleSubcategory = (vehicleName: string, vehicleType: VehicleType): Subcategory => {
    const name = vehicleName.toLowerCase();
    const electricModels = ['electric', 'ev', 'e-tron', 'taycan', 'model 3', 'model s', 'model x', 'model y', 'i4', 'i8', 'eq', 'ioniq', 'leaf', 'bolt', 'id.4', 'mach-e', 'lightning', 'rivian', 'lucid', 'polestar', 'ariya', 'bz4x'];
    if (electricModels.some(model => name.includes(model))) return 'Electric';

    if (vehicleType === 'SUV') {
      const subcompactSUVs = ['venue', 'trailblazer', 'kicks', 'soul', 'encore', 'encore gx', 'trax', 'seltos', 'crosstrek', 'kona', 'hr-v'];
      const compactSUVs = ['cr-v', 'rav4', 'rogue', 'equinox', 'escape', 'tucson', 'sportage', 'cx-5', 'forester', 'cherokee', 'compass', 'q3', 'x1', 'x3', 'glb', 'qx50'];
      const midsizeSUVs = ['pilot', 'highlander', 'pathfinder', 'traverse', 'explorer', 'santa fe', 'sorento', 'cx-9', 'ascent', 'grand cherokee', 'passport', 'q5', 'x5', 'gle', 'qx60', 'cx-90'];
      const fullSizeSUVs = ['expedition', 'tahoe', 'suburban', 'yukon', 'armada', 'sequoia', 'durango', 'telluride', 'palisade', 'atlas', 'qx80', 'escalade', 'navigator'];
      if (subcompactSUVs.some(model => name.includes(model))) return 'Subcompact';
      if (compactSUVs.some(model => name.includes(model))) return 'Compact';
      if (midsizeSUVs.some(model => name.includes(model))) return 'Midsize';
      if (fullSizeSUVs.some(model => name.includes(model))) return 'Full-Size';
    }

    if (vehicleType === 'Truck') {
      const compactTrucks = ['maverick', 'santa cruz'];
      const midsizeTrucks = ['ranger', 'colorado', 'tacoma', 'frontier', 'gladiator', 'canyon', 'ridgeline'];
      const fullSizeTrucks = ['f-150', 'silverado', 'sierra', 'ram 1500', 'tundra', 'titan'];
      if (compactTrucks.some(model => name.includes(model))) return 'Compact';
      if (midsizeTrucks.some(model => name.includes(model))) return 'Midsize';
      if (fullSizeTrucks.some(model => name.includes(model))) return 'Full-Size';
    }

    if (vehicleType === 'Sedan') {
      const subcompactSedans = ['rio', 'versa', 'mirage'];
      const compactSedans = ['civic', 'corolla', 'sentra', 'elantra', 'forte', 'mazda3', 'impreza', 'jetta', 'a3'];
      const midsizeSedans = ['accord', 'camry', 'altima', 'sonata', 'optima', 'mazda6', 'legacy', 'passat', 'a4', '3 series', 'c-class'];
      const fullSizeSedans = ['avalon', 'maxima', 'charger', '300', 'impala', 'a6', '5 series', 'e-class', 'ct5', 'ct6', 'continental', 's90', 'gs', 'ls', 'q70', 'panamera', 'taycan', 'model s', 'a8', '7 series', 's-class'];
      if (subcompactSedans.some(model => name.includes(model))) return 'Subcompact';
      if (compactSedans.some(model => name.includes(model))) return 'Compact';
      if (midsizeSedans.some(model => name.includes(model))) return 'Midsize';
      if (fullSizeSedans.some(model => name.includes(model))) return 'Full-Size';
    }

    if (vehicleType !== 'Sedan' && vehicleType !== 'Coupe') {
      const luxuryBrands = ['mercedes', 'bmw', 'audi', 'lexus', 'infiniti', 'acura', 'cadillac', 'lincoln', 'genesis', 'porsche', 'jaguar', 'land rover', 'volvo'];
      if (luxuryBrands.some(brand => name.includes(brand))) return 'Luxury';
    }

    return 'All';
  };

  useEffect(() => {
    setSelectedSubcategory('All');
  }, [selectedVehicleType]);

  const carouselVehicles: CarouselVehicle[] = useMemo(() => {
    let filteredVehicles = allVehicleItems;
    
    if (selectedVehicleType === 'Recommended For You') {
      try {
        const onboardingData = localStorage.getItem('onboardingData');
        const savedVehicleNames = new Set<string>();
        
        if (onboardingData) {
          const data = JSON.parse(onboardingData);
          if (data.vehicles && Array.isArray(data.vehicles) && data.vehicles.length > 0) {
            data.vehicles.forEach((v: { name: string }) => {
              if (v.name) savedVehicleNames.add(v.name.toLowerCase().trim());
            });
          }
        }
        
        const savedVehiclesList = allVehicleItems.filter(vehicle => savedVehicleNames.has(vehicle.name.toLowerCase().trim()));
        
        if (savedVehiclesList.length < 10) {
          const remainingCount = 10 - savedVehiclesList.length;
          const savedVehicleNamesSet = new Set(savedVehiclesList.map(v => v.name.toLowerCase().trim()));
          const additionalVehicles = allVehicleItems
            .filter(vehicle => !savedVehicleNamesSet.has(vehicle.name.toLowerCase().trim()))
            .sort((a, b) => ((b.staffRating || 0) + (b.communityRating || 0)) - ((a.staffRating || 0) + (a.communityRating || 0)))
            .slice(0, remainingCount);
          filteredVehicles = [...savedVehiclesList, ...additionalVehicles];
        } else {
          filteredVehicles = savedVehiclesList.slice(0, 10);
        }
      } catch (error) {
        filteredVehicles = allVehicleItems
          .sort((a, b) => ((b.staffRating || 0) + (b.communityRating || 0)) - ((a.staffRating || 0) + (a.communityRating || 0)))
          .slice(0, 10);
      }
    } else if (selectedVehicleType === 'Performance') {
      filteredVehicles = allVehicleItems.filter(vehicle => (vehicle.priceMin ?? 0) > 150000);
    } else {
      filteredVehicles = allVehicleItems.filter(vehicle => {
        if (vehicle.bodyStyle) return vehicle.bodyStyle === selectedVehicleType;
        const bodyStyles = getVehicleBodyStyle(vehicle.name);
        return bodyStyles.includes(selectedVehicleType);
      });
      filteredVehicles = filteredVehicles.filter(vehicle => (vehicle.priceMin ?? 0) <= 150000);
      if (selectedSubcategory !== 'All') {
        filteredVehicles = filteredVehicles.filter(vehicle => getVehicleSubcategory(vehicle.name, selectedVehicleType as 'SUV' | 'Sedan' | 'Truck' | 'Coupe') === selectedSubcategory);
      }
    }

    const vehiclesWithRatings = filteredVehicles.map((vehicleItem, index) => {
      const parsed = parseVehicleName(vehicleItem.name);
      const year = decodeURIComponent(parsed.year);
      const make = decodeURIComponent(parsed.make);
      const model = decodeURIComponent(parsed.model);
      const currentYear = new Date().getFullYear();
      const vehicleYear = parseInt(year) || currentYear;
      const staffRating = vehicleItem.staffRating ?? generateStaffRating(vehicleItem.name);
      const communityRating = vehicleItem.communityRating ?? generateCommunityRating(vehicleItem.name);
      const vehicleImage = (vehicleItem.image && typeof vehicleItem.image === 'string' && vehicleItem.image.trim() !== '' && vehicleItem.image.startsWith('http'))
        ? vehicleItem.image : vehicleImageFor(vehicleItem.name);
      
      return { id: `vehicle-${index}`, name: vehicleItem.name, year, make, model, image: vehicleImage, galleryImages: vehicleItem.galleryImages, bodyStyle: vehicleItem.bodyStyle, staffRating, communityRating, vehicleYear, priceMin: vehicleItem.priceMin };
    });

    const uniqueVehicles = new Map<string, typeof vehiclesWithRatings[0]>();
    vehiclesWithRatings.forEach(vehicle => {
      const key = `${vehicle.make}-${vehicle.model}`.toLowerCase();
      const existing = uniqueVehicles.get(key);
      if (!existing) {
        uniqueVehicles.set(key, vehicle);
      } else {
        const existingMatchesBodyStyle = existing.bodyStyle === selectedVehicleType;
        const vehicleMatchesBodyStyle = vehicle.bodyStyle === selectedVehicleType;
        if (vehicleMatchesBodyStyle && !existingMatchesBodyStyle) uniqueVehicles.set(key, vehicle);
        else if (!vehicleMatchesBodyStyle && existingMatchesBodyStyle) { /* keep existing */ }
        else if (vehicle.vehicleYear > existing.vehicleYear) uniqueVehicles.set(key, vehicle);
      }
    });

    const sortedVehicles = Array.from(uniqueVehicles.values()).sort((a, b) => {
      const aRating = ratingType === 'MotorTrend' ? a.staffRating : a.communityRating;
      const bRating = ratingType === 'MotorTrend' ? b.staffRating : b.communityRating;
      if (Math.abs(aRating - bRating) > 0.01) return bRating - aRating;
      return b.vehicleYear - a.vehicleYear;
    });

    return sortedVehicles.slice(0, 10).map((vehicle, index) => ({
      id: `${selectedVehicleType.toLowerCase()}-${index}`,
      name: vehicle.name, year: vehicle.year, make: vehicle.make, model: vehicle.model, image: vehicle.image, galleryImages: vehicle.galleryImages, staffRating: vehicle.staffRating, communityRating: vehicle.communityRating, rank: index + 1, priceMin: vehicle.priceMin
    })).reverse();
  }, [selectedVehicleType, selectedSubcategory, ratingType, allVehicleItems]);

  // Load listings for current vehicle
  useEffect(() => {
    const loadListings = async () => {
      if (carouselVehicles.length === 0) return;
      
      const currentVehicle = carouselVehicles[currentSlide];
      if (!currentVehicle) return;
      
      setIsLoadingListings(true);
      
      // Use gallery images as fallbacks if available
      const fallbackImages = currentVehicle.galleryImages && currentVehicle.galleryImages.length > 0 
        ? currentVehicle.galleryImages 
        : [currentVehicle.image];
      
      // Generate mock listings first for instant display with fallback images
      const mockListings = generateLocalListings(currentVehicle.year, currentVehicle.image, 5, fallbackImages);
      setCurrentListings(mockListings);
      
      try {
        const parsed = parseVehicleName(currentVehicle.name);
        console.log('🔍 Fetching listings for:', parsed, 'with', fallbackImages.length, 'fallback images');
        const listings = await getLocalListings(parsed.year, parsed.make, parsed.model, currentVehicle.image, undefined, fallbackImages);
        console.log('📋 Received listings:', listings.map(l => ({
          id: l.id,
          dealer: l.dealerName,
          imageUrl: l.imageUrl,
          photoUrls: l.photoUrls?.slice(0, 2)
        })));
        if (listings.length > 0) {
          setCurrentListings(listings);
        }
      } catch (error) {
        console.error('Error fetching local listings:', error);
      } finally {
        setIsLoadingListings(false);
      }
    };

    loadListings();
  }, [currentSlide, carouselVehicles]);

  const handleMouseEnter = () => {
    setIsSliderHovered(true);
    if (slideIntervalRef.current) { clearInterval(slideIntervalRef.current); slideIntervalRef.current = null; }
  };

  const handleMouseLeave = () => {
    setIsSliderHovered(false);
    setAnimationKey(prev => prev + 1);
  };

  useEffect(() => {
    const carouselElement = carouselRef.current;
    if (!carouselElement) return;
    const observer = new IntersectionObserver((entries) => { entries.forEach((entry) => setIsInView(entry.isIntersecting)); }, { threshold: 0.1, rootMargin: '0px' });
    observer.observe(carouselElement);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (carouselVehicles.length <= 1) return;
    if (isInView && !isSliderHovered) {
      if (slideIntervalRef.current) clearInterval(slideIntervalRef.current);
      slideIntervalRef.current = window.setInterval(() => {
        setCurrentSlide((prev) => {
          const nextSlide = prev + 1;
          if (nextSlide >= carouselVehicles.length) {
            const subcategories = getSubcategoriesForType(selectedVehicleType);
            const currentIndex = subcategories.indexOf(selectedSubcategory);
            setSelectedSubcategory(subcategories[(currentIndex + 1) % subcategories.length]);
            return 0;
          }
          return nextSlide;
        });
      }, 5000);
    } else {
      if (slideIntervalRef.current) { clearInterval(slideIntervalRef.current); slideIntervalRef.current = null; }
    }
    return () => { if (slideIntervalRef.current) { clearInterval(slideIntervalRef.current); slideIntervalRef.current = null; } };
  }, [isInView, isSliderHovered, carouselVehicles.length, selectedVehicleType, selectedSubcategory, animationKey]);

  useEffect(() => { setCurrentSlide(0); }, [carouselVehicles]);

  // Auto-skip empty subcategories
  useEffect(() => {
    if (carouselVehicles.length === 0 && selectedVehicleType !== 'Performance' && selectedVehicleType !== 'Recommended For You') {
      const subcategories = getSubcategoriesForType(selectedVehicleType);
      const currentIndex = subcategories.indexOf(selectedSubcategory);
      const nextSubcategory = subcategories[(currentIndex + 1) % subcategories.length];
      // If we've cycled back to 'All', stay there
      if (nextSubcategory === 'All' || currentIndex === -1) {
        setSelectedSubcategory('All');
      } else {
        setSelectedSubcategory(nextSubcategory);
      }
    }
  }, [carouselVehicles.length, selectedSubcategory, selectedVehicleType]);

  const onTouchStart = (e: React.TouchEvent) => { setTouchEnd(null); setTouchStart(e.targetTouches[0].clientX); };
  const onTouchMove = (e: React.TouchEvent) => { setTouchEnd(e.targetTouches[0].clientX); };
  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    if (distance > minSwipeDistance) {
      setCurrentSlide((prev) => { const nextSlide = prev + 1; if (nextSlide >= carouselVehicles.length) { const subcategories = getSubcategoriesForType(selectedVehicleType); const currentIndex = subcategories.indexOf(selectedSubcategory); setSelectedSubcategory(subcategories[(currentIndex + 1) % subcategories.length]); return 0; } return nextSlide; });
    } else if (distance < -minSwipeDistance) {
      setCurrentSlide((prev) => { if (prev === 0) { const subcategories = getSubcategoriesForType(selectedVehicleType); const currentIndex = subcategories.indexOf(selectedSubcategory); setSelectedSubcategory(subcategories[(currentIndex - 1 + subcategories.length) % subcategories.length]); return 0; } return prev - 1; });
    }
  };

  const handleVehicleClick = (vehicle: CarouselVehicle) => {
    // Navigate to the vehicle's make/model page
    navigate(`/vehicles/${vehicle.year}/${vehicle.make}/${vehicle.model}`);
  };

  const renderStarRating = (ratingValue: number) => {
    const normalizedRating = ratingValue / 2;
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: '2px', flexShrink: 0, justifyContent: 'center' }}>
        {[1, 2, 3, 4, 5].map((star) => {
          const isFilled = star < Math.ceil(normalizedRating);
          const isHalf = star === Math.ceil(normalizedRating) && normalizedRating % 1 !== 0;
          return (
            <div key={star} style={{ position: 'relative', width: '18px', height: '18px', flexShrink: 0 }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ position: 'absolute', top: 0, left: 0 }}>
                <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" fill="none" stroke="#33C4FF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              {isFilled && (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ position: 'absolute', top: 0, left: 0 }}>
                  <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" fill="#33C4FF" />
                </svg>
              )}
              {isHalf && (
                <div style={{ position: 'absolute', top: 0, left: 0, width: '50%', height: '100%', overflow: 'hidden' }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" fill="#33C4FF" />
                  </svg>
                </div>
              )}
            </div>
          );
        })}
      </div>
    );
  };

  // Don't render if no vehicles are available
  console.log('[TopTenCarouselLeads] Vehicle count:', {
    allVehicleItems: allVehicleItems.length,
    carouselVehicles: carouselVehicles.length,
    selectedVehicleType,
    selectedSubcategory,
    initialVehicleType,
  });
  
  if (carouselVehicles.length === 0) {
    console.log('[TopTenCarouselLeads] No vehicles found, returning null');
    return null;
  }

  // Main container styles - NO internal vertical padding, parent container's gap handles spacing
  const containerStyle: React.CSSProperties = {
    width: '100%',
    marginBottom: 0,
    paddingLeft: isNarrowScreen ? '16px' : '0',
    paddingRight: isNarrowScreen ? '16px' : '0',
  };

  const layoutStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: (isTablet || !showLeads) ? 'column' : 'row',
    gap: (isTablet || !showLeads) ? '16px' : '24px',
    width: '100%',
    alignItems: (isTablet || !showLeads) ? 'stretch' : 'flex-start',
  };

  const carouselContainerStyle: React.CSSProperties = {
    flex: (isTablet || !showLeads) ? 'none' : '1 1 65%',
    minWidth: 0,
    width: showLeads ? undefined : '100%',
  };

  const sidebarContainerStyle: React.CSSProperties = {
    flex: isTablet ? 'none' : '0 0 28%',
    maxWidth: isTablet ? '100%' : '320px',
    minWidth: isTablet ? '100%' : '260px',
    display: showLeads ? 'block' : 'none',
  };

  const sliderStyle: React.CSSProperties = {
    position: 'relative',
    width: '100%',
    overflow: 'hidden',
    borderRadius: 'var(--border-radius-md, 8px)',
    backgroundColor: 'var(--color-neutrals-8, #FCFCFD)',
    boxShadow: 'var(--shadow-lg, 0 10px 25px rgba(0,0,0,0.1))',
    aspectRatio: isMobile ? '1 / 1' : '16 / 9',
    minHeight: isMobile ? '338px' : (isTablet ? '400px' : undefined),
    maxHeight: isMobile ? undefined : (isTablet ? '400px' : '600px'), // Prevent content from expanding
    touchAction: isMobile ? 'pan-y pinch-zoom' : undefined,
  };

  const trackStyle: React.CSSProperties = {
    display: 'flex',
    transition: isMobile ? 'transform 0.3s ease-out' : 'transform 0.5s ease-in-out',
    willChange: 'transform',
    height: '100%',
    transform: `translateX(-${currentSlide * 100}%)`,
  };

  const slideStyle: React.CSSProperties = {
    minWidth: '100%',
    width: '100%',
    height: '100%',
    flexShrink: 0,
    cursor: 'pointer',
  };

  const imageContainerStyle: React.CSSProperties = {
    position: 'relative',
    width: '100%',
    height: '100%',
    overflow: 'hidden',
    borderRadius: 'var(--border-radius-md, 8px)',
    backgroundColor: 'var(--color-neutrals-7, #F4F5F6)',
  };

  const getImageStyle = (isActive: boolean): React.CSSProperties => ({
    width: '100%',
    height: '100%',
    objectFit: isMobile ? 'cover' : 'contain',
    objectPosition: 'center',
    transition: 'transform 0.3s ease',
    animation: isActive && !isSliderHovered ? 'kenBurnsZoom 6s ease-in-out infinite' : 'none',
    animationPlayState: isSliderHovered ? 'paused' : 'running',
  });

  const badgesContainerStyle: React.CSSProperties = {
    position: 'absolute',
    top: isMobile ? '16px' : (isTablet ? '14px' : '20px'),
    left: isMobile ? '16px' : (isTablet ? '14px' : '20px'),
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: isTablet ? '6px' : '8px',
    zIndex: 15,
  };

  const categoryBadgeStyle: React.CSSProperties = {
    padding: isMobile ? '8px 14px' : (isTablet ? '6px 14px' : '8px 16px'),
    backgroundColor: 'var(--color-neutrals-7, #F4F5F6)',
    borderRadius: 'var(--border-radius-xl, 20px)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    border: 'none',
    cursor: 'pointer',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
    position: 'relative',
    minHeight: '32px',
    boxSizing: 'border-box',
  };

  const dropdownStyle: React.CSSProperties = {
    appearance: 'none',
    WebkitAppearance: 'none',
    MozAppearance: 'none',
    background: 'transparent',
    border: 'none',
    color: 'var(--color-neutrals-2, #23262F)',
    fontSize: isMobile ? '13px' : (isTablet ? '12px' : '14px'),
    fontWeight: 400,
    fontFamily: 'var(--font-body, Geist, sans-serif)',
    cursor: 'pointer',
    paddingRight: isTablet ? '20px' : '22px',
    outline: 'none',
    width: '100%',
    lineHeight: 1.3,
    height: '100%',
    display: 'block',
  };

  const arrowStyle: React.CSSProperties = {
    position: 'absolute',
    right: isTablet ? '6px' : '8px',
    top: '50%',
    transform: 'translateY(-50%)',
    pointerEvents: 'none',
    color: 'var(--color-neutrals-2, #23262F)',
    opacity: 1,
    fontSize: isTablet ? '16px' : '18px',
  };

  const getActionBtnStyle = (isHovered: boolean, isActive: boolean = false): React.CSSProperties => ({
    position: 'absolute',
    width: isMobile ? '40px' : '48px',
    height: isMobile ? '40px' : '48px',
    borderRadius: 'var(--border-radius-circle, 50%)',
    backgroundColor: isActive ? (isHovered ? 'rgba(255, 255, 255, 0.3)' : 'rgba(255, 255, 255, 0.2)') : (isHovered ? 'rgba(30, 30, 32, 0.5)' : 'rgba(20, 20, 22, 0.3)'),
    backdropFilter: 'blur(20px) saturate(180%)',
    WebkitBackdropFilter: 'blur(20px) saturate(180%)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    color: 'var(--color-white, #FFFFFF)',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 15,
    transition: 'all 0.3s ease',
    transform: isHovered ? 'scale(1.1)' : 'scale(1)',
  });

  const saveBtnStyle: React.CSSProperties = {
    ...getActionBtnStyle(isSaveBtnHovered, savedVehicles.has(carouselVehicles[currentSlide]?.name)),
    top: isMobile ? '16px' : '20px',
    right: isMobile ? '16px' : '20px',
  };

  const infoBoxStyle = (isActive: boolean): React.CSSProperties => ({
    position: 'absolute',
    bottom: isMobile ? '20px' : '16px',
    left: isMobile ? '20px' : '16px',
    right: isMobile ? '20px' : '16px',
    backgroundColor: 'rgba(20, 20, 22, 0.3)',
    backdropFilter: 'blur(20px) saturate(180%)',
    WebkitBackdropFilter: 'blur(20px) saturate(180%)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: 'var(--border-radius-md-lg, 12px)',
    padding: isMobile ? '16px' : '20px 24px',
    zIndex: 10,
    width: isMobile ? 'calc(100% - 40px)' : 'calc(100% - 32px)',
    pointerEvents: 'none',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    minWidth: 0,
    overflow: 'hidden',
    opacity: isActive ? 1 : 0,
    transform: isActive ? 'translateY(0)' : 'translateY(20px)',
    transition: 'opacity 0.6s cubic-bezier(0.2, 0.8, 0.2, 1), transform 0.6s cubic-bezier(0.2, 0.8, 0.2, 1)',
    transitionDelay: isActive ? '0.1s' : '0s',
  });

  const nameStyle: React.CSSProperties = {
    fontFamily: 'var(--font-heading, Poppins, sans-serif)',
    fontWeight: 600,
    fontSize: isMobile ? '20px' : '22px',
    lineHeight: 1.2,
    color: 'var(--color-white, #FFFFFF)',
    margin: 0,
  };

  const getNavBtnStyle = (direction: 'prev' | 'next'): React.CSSProperties => ({
    position: 'absolute',
    top: '50%',
    transform: hoveredNav === direction ? 'translateY(-50%) scale(1.1)' : 'translateY(-50%)',
    left: direction === 'prev' ? (isMobile ? '12px' : '16px') : undefined,
    right: direction === 'next' ? (isMobile ? '12px' : '16px') : undefined,
    width: isMobile ? '44px' : '48px',
    height: isMobile ? '44px' : '48px',
    borderRadius: 'var(--border-radius-circle, 50%)',
    backgroundColor: hoveredNav === direction ? 'rgba(30, 30, 32, 0.5)' : 'rgba(20, 20, 22, 0.3)',
    backdropFilter: 'blur(20px) saturate(180%)',
    WebkitBackdropFilter: 'blur(20px) saturate(180%)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    color: 'var(--color-white, #FFFFFF)',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 20,
    transition: 'all 0.3s ease',
    boxShadow: hoveredNav === direction ? '0 12px 40px rgba(0, 0, 0, 0.5)' : '0 8px 32px rgba(0, 0, 0, 0.4)',
    opacity: isSliderHovered ? 1 : 0,
    pointerEvents: isSliderHovered ? 'auto' : 'none',
  });

  const dotsContainerStyle: React.CSSProperties = {
    position: 'absolute',
    bottom: isMobile ? '16px' : (isTablet ? '130px' : '134px'), // 16px above the ranking bar (info box)
    left: '50%',
    transform: 'translateX(-50%)',
    display: isMobile ? 'none' : 'flex',
    gap: '6px',
    zIndex: 20,
    alignItems: 'center',
    height: '32px',
  };

  const getDotStyle = (index: number, isActive: boolean): React.CSSProperties => {
    const isHovered = hoveredDot === index && !isActive;
    return {
      width: '32px',
      height: '32px',
      borderRadius: 'var(--border-radius-circle, 50%)',
      border: 'none',
      backgroundColor: 'rgba(255, 255, 255, 0.1)',
      cursor: 'pointer',
      transition: 'transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
      padding: 0,
      position: 'relative',
      overflow: 'visible',
      flexShrink: 0,
      transform: isHovered ? 'scale(1.3)' : (isActive ? 'scale(1.2)' : 'scale(1)'),
    };
  };

  // Sidebar styles - height dynamically matches slider height
  const sidebarStyle: React.CSSProperties = {
    background: 'var(--color-white, #FFFFFF)',
    borderRadius: 'var(--border-radius-md, 8px)',
    padding: 'var(--spacing-component-md, 12px)',
    position: 'relative',
    width: '100%',
    border: '1px solid var(--color-neutrals-6, #E6E8EC)',
    height: isMobile || isTablet ? 'auto' : (sliderHeight ? `${sliderHeight}px` : 'auto'),
    maxHeight: isMobile || isTablet ? 'none' : (sliderHeight ? `${sliderHeight}px` : 'none'),
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
  };

  const sidebarHeaderStyle: React.CSSProperties = {
    marginBottom: '16px',
    paddingBottom: '12px',
    borderBottom: '1px solid var(--color-neutrals-6, #E6E8EC)',
  };

  const sidebarTitleStyle: React.CSSProperties = {
    fontFamily: 'var(--font-heading, Poppins, sans-serif)',
    fontSize: '16px',
    fontWeight: 600,
    color: 'var(--color-neutrals-1, #141416)',
    margin: '0 0 4px 0',
  };

  const sidebarSubtitleStyle: React.CSSProperties = {
    fontFamily: 'var(--font-body, Geist, sans-serif)',
    fontSize: '12px',
    color: 'var(--color-neutrals-4, #6E7481)',
    margin: 0,
  };

  const listingsListStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: isTablet ? 'row' : 'column',
    gap: '12px',
    overflowX: isTablet ? 'auto' : 'visible',
    overflowY: isTablet ? 'visible' : 'auto',
    paddingBottom: isTablet ? '8px' : '0',
    flex: 1,
    minHeight: 0, // Important for flex overflow to work
  };

  const loadingStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  };

  const skeletonStyle: React.CSSProperties = {
    background: 'linear-gradient(90deg, var(--color-neutrals-7, #F4F5F6) 25%, var(--color-neutrals-6, #E6E8EC) 50%, var(--color-neutrals-7, #F4F5F6) 75%)',
    backgroundSize: '200px 100%',
    animation: 'shimmer 1.5s infinite',
    borderRadius: 'var(--border-radius-sm, 4px)',
  };

  const currentVehicle = carouselVehicles[currentSlide];

  return (
    <div ref={carouselRef} style={containerStyle} className={className}>
      <div style={layoutStyle}>
        {/* Carousel Section */}
        <div style={carouselContainerStyle}>
          <div 
            ref={sliderRef}
            style={sliderStyle}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
          >
            <div style={badgesContainerStyle}>
              <div style={categoryBadgeStyle}>
                <select style={dropdownStyle} value={selectedVehicleType} onChange={(e) => { e.stopPropagation(); setSelectedVehicleType(e.target.value as VehicleType); }} onClick={(e) => e.stopPropagation()}>
                  <option value="SUV">Top Ten SUVs</option>
                  <option value="Sedan">Top Ten Sedans</option>
                  <option value="Truck">Top Ten Trucks</option>
                  <option value="Coupe">Top Ten Coupes</option>
                  <option value="Performance">Top Ten Performance</option>
                  <option value="Recommended For You">Recommended For You</option>
                </select>
                <Icon name="keyboard_arrow_down" size={20} style={arrowStyle} />
              </div>

              {selectedVehicleType !== 'Recommended For You' && (
                <div style={categoryBadgeStyle}>
                  <select style={dropdownStyle} value={selectedSubcategory} onChange={(e) => { e.stopPropagation(); setSelectedSubcategory(e.target.value as Subcategory); }} onClick={(e) => e.stopPropagation()}>
                    {getSubcategoriesForType(selectedVehicleType).map(subcat => (
                      <option key={subcat} value={subcat}>{subcat === 'All' ? 'All Categories' : subcat}</option>
                    ))}
                  </select>
                  <Icon name="keyboard_arrow_down" size={20} style={arrowStyle} />
                </div>
              )}

              <div style={categoryBadgeStyle}>
                <select style={dropdownStyle} value={ratingType} onChange={(e) => { e.stopPropagation(); setRatingType(e.target.value as RatingType); setCurrentSlide(0); }} onClick={(e) => e.stopPropagation()}>
                  <option value="MotorTrend">MT Rating</option>
                  <option value="User Reviews">User Rating</option>
                </select>
                <Icon name="keyboard_arrow_down" size={20} style={arrowStyle} />
              </div>
            </div>
            
            <div style={trackStyle}>
              {carouselVehicles.map((vehicle, index) => (
                <div key={vehicle.id} style={slideStyle} onClick={() => handleVehicleClick(vehicle)}>
                  <div style={imageContainerStyle}>
                    <img src={vehicle.image} alt={vehicle.name} style={getImageStyle(index === currentSlide)} />
                    
                    <button
                      style={saveBtnStyle}
                      onClick={(e) => { e.stopPropagation(); handleSaveVehicle(vehicle); }}
                      onMouseEnter={() => setIsSaveBtnHovered(true)}
                      onMouseLeave={() => setIsSaveBtnHovered(false)}
                      aria-label={savedVehicles.has(vehicle.name) ? 'Remove from saved' : 'Save vehicle'}
                    >
                      <Icon name={savedVehicles.has(vehicle.name) ? 'bookmark' : 'bookmark_border'} variant={savedVehicles.has(vehicle.name) ? 'filled' : 'outlined'} size={24} />
                    </button>
                    
                    <div style={infoBoxStyle(index === currentSlide)}>
                      {/* Main content layout - Left side (badges + name) and Right side (ratings) */}
                      <div style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'space-between',
                        gap: '16px',
                      }}>
                        {/* Left side - Badges and Vehicle Name */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', flex: '1', minWidth: 0 }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                                            <ActionBadge text="Buyers Guide" variant="secondary" href={`/vehicles/${vehicle.year}/${vehicle.make}/${vehicle.model}`} onClick={(e) => { e.preventDefault(); e.stopPropagation(); navigate(`/vehicles/${vehicle.year}/${vehicle.make}/${vehicle.model}`); }} />
                                            <ActionBadge text="See Local Listings" variant="primary" onClick={(e) => { e.stopPropagation(); handleVehicleClick(vehicle); }} />
                                          </div>
                                          <h2 style={nameStyle}>
                                            #{vehicle.rank}{' '}
                                            <span 
                                              style={{ 
                                                cursor: 'pointer', 
                                                pointerEvents: 'auto',
                                                transition: 'opacity 0.2s ease',
                                              }}
                                              onClick={(e) => { 
                                                e.preventDefault(); 
                                                e.stopPropagation(); 
                                                navigate(`/vehicles/${vehicle.year}/${vehicle.make}/${vehicle.model}`); 
                                              }}
                                              onMouseEnter={(e) => { (e.target as HTMLSpanElement).style.opacity = '0.8'; }}
                                              onMouseLeave={(e) => { (e.target as HTMLSpanElement).style.opacity = '1'; }}
                                              role="link"
                                              tabIndex={0}
                                              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); navigate(`/vehicles/${vehicle.year}/${vehicle.make}/${vehicle.model}`); } }}
                                            >
                                              {vehicle.name}
                                            </span>
                                          </h2>
                        </div>
                        
                        {/* Right side - Rating Bar (centered vertically) */}
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0',
                          flexShrink: 0,
                        }}>
                          {/* MotorTrend Rating Section */}
                          <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '10px',
                            paddingRight: '16px',
                            height: '36px',
                          }}>
                            <img 
                              src="https://d2kde5ohu8qb21.cloudfront.net/files/692374f1d13f5100022ddf61/mticon.svg" 
                              alt="MotorTrend" 
                              style={{ width: '24px', height: '24px' }} 
                            />
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'center' }}>
                              <div style={{ display: 'flex', alignItems: 'baseline', gap: '2px' }}>
                                <span style={{
                                  fontFamily: 'var(--font-heading, Poppins, sans-serif)',
                                  fontWeight: 700,
                                  fontSize: '20px',
                                  color: 'var(--color-white, #FFFFFF)',
                                  lineHeight: 1,
                                }}>{vehicle.staffRating.toFixed(1)}</span>
                                <span style={{
                                  fontFamily: 'var(--font-body, Geist, sans-serif)',
                                  fontWeight: 400,
                                  fontSize: '14px',
                                  color: 'rgba(255, 255, 255, 0.7)',
                                  lineHeight: 1,
                                }}>/10</span>
                              </div>
                              <span style={{
                                fontFamily: 'var(--font-body, Geist, sans-serif)',
                                fontWeight: 400,
                                fontSize: '11px',
                                color: 'var(--color-white, #FFFFFF)',
                                marginTop: '2px',
                              }}>MT Rating</span>
                            </div>
                          </div>
                          
                          {/* Vertical Divider */}
                          <div style={{
                            width: '1px',
                            height: '36px',
                            backgroundColor: 'var(--color-neutrals-6, #E6E8EC)',
                            alignSelf: 'center',
                          }} />
                          
                          {/* User Reviews Section */}
                          <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '10px',
                            paddingLeft: '16px',
                            height: '36px',
                          }}>
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'center', gap: '2px' }}>
                              {renderStarRating(vehicle.communityRating)}
                              <span style={{
                                fontFamily: 'var(--font-body, Geist, sans-serif)',
                                fontWeight: 400,
                                fontSize: '11px',
                                color: 'var(--color-white, #FFFFFF)',
                              }}>User Rating</span>
                            </div>
                            <Badge variant="info" size="sm" style={{ marginLeft: '4px' }}>{(vehicle.communityRating / 2).toFixed(1)}/5</Badge>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {carouselVehicles.length > 1 && (
              <>
                <button
                  style={getNavBtnStyle('prev')}
                  onClick={() => { setCurrentSlide((prev) => { if (prev === 0) { const subcategories = getSubcategoriesForType(selectedVehicleType); const currentIndex = subcategories.indexOf(selectedSubcategory); setSelectedSubcategory(subcategories[(currentIndex - 1 + subcategories.length) % subcategories.length]); return 0; } return prev - 1; }); }}
                  onMouseEnter={() => setHoveredNav('prev')}
                  onMouseLeave={() => setHoveredNav(null)}
                  aria-label="Previous slide"
                >
                  <Icon name="chevron_left" size={32} />
                </button>
                <button
                  style={getNavBtnStyle('next')}
                  onClick={() => { setCurrentSlide((prev) => { const nextSlide = prev + 1; if (nextSlide >= carouselVehicles.length) { const subcategories = getSubcategoriesForType(selectedVehicleType); const currentIndex = subcategories.indexOf(selectedSubcategory); setSelectedSubcategory(subcategories[(currentIndex + 1) % subcategories.length]); return 0; } return nextSlide; }); }}
                  onMouseEnter={() => setHoveredNav('next')}
                  onMouseLeave={() => setHoveredNav(null)}
                  aria-label="Next slide"
                >
                  <Icon name="chevron_right" size={32} />
                </button>
                
                <div style={dotsContainerStyle}>
                  {carouselVehicles.map((vehicle, index) => (
                    <button
                      key={index}
                      style={getDotStyle(index, index === currentSlide)}
                      onClick={() => setCurrentSlide(index)}
                      onMouseEnter={() => setHoveredDot(index)}
                      onMouseLeave={() => setHoveredDot(null)}
                      aria-label={`Go to ${vehicle.name}`}
                    >
                      {/* Tooltip */}
                      {hoveredDot === index && index !== currentSlide && (
                        <div style={{
                          position: 'absolute',
                          bottom: '100%',
                          left: '50%',
                          transform: 'translateX(-50%)',
                          marginBottom: '4px',
                          padding: '4px 8px',
                          backgroundColor: 'var(--color-neutrals-1, #141416)',
                          backdropFilter: 'blur(8px)',
                          WebkitBackdropFilter: 'blur(8px)',
                          borderRadius: 'var(--border-radius-sm, 4px)',
                          whiteSpace: 'nowrap',
                          zIndex: 30,
                          pointerEvents: 'none',
                          boxShadow: 'var(--shadow-depth-5, 0 4px 20px rgba(20, 20, 22, 0.06))',
                        }}>
                          <span style={{
                            fontFamily: 'var(--font-body, Geist, sans-serif)',
                            fontSize: '10px',
                            fontWeight: 500,
                            color: 'var(--color-white, #FFFFFF)',
                          }}>
                            #{vehicle.rank} {vehicle.name}
                          </span>
                          {/* Tooltip arrow */}
                          <div style={{
                            position: 'absolute',
                            top: '100%',
                            left: '50%',
                            transform: 'translateX(-50%)',
                            width: 0,
                            height: 0,
                            borderLeft: '4px solid transparent',
                            borderRight: '4px solid transparent',
                            borderTop: '4px solid var(--color-neutrals-1, #141416)',
                          }} />
                        </div>
                      )}
                      <svg key={`progress-${index}-${index === currentSlide ? animationKey : 0}`} style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', transition: 'transform 150ms ease-in-out', transform: index === currentSlide ? 'scale(1.2)' : 'scale(1)' }} viewBox="0 0 36 36">
                        <circle cx="18" cy="18" r="16" fill="none" stroke={hoveredDot === index || index === currentSlide ? 'rgba(255, 255, 255, 0.3)' : 'rgba(255, 255, 255, 0.2)'} strokeWidth="2" />
                        <circle
                          cx="18" cy="18" r="16" fill="none" stroke="#FFFFFF" strokeWidth={index === currentSlide ? '2.5' : '2'} strokeLinecap="round"
                          strokeDasharray={index === currentSlide && !isSliderHovered ? '100 100' : '0 100'}
                          transform="rotate(-90 18 18)"
                          style={{ 
                            transition: isSliderHovered ? 'stroke-dasharray 0.2s ease' : 'stroke-dasharray 0.3s ease',
                            opacity: index === currentSlide ? 1 : 0,
                            animation: index === currentSlide && !isSliderHovered ? 'progressCircle 5s linear infinite' : 'none',
                            animationPlayState: isSliderHovered ? 'paused' : 'running',
                          }}
                        />
                      </svg>
                      <span style={{ width: 'calc(100% - 4px)', height: 'calc(100% - 4px)', borderRadius: '50%', overflow: 'hidden', display: 'block', position: 'relative', zIndex: 1, margin: '2px' }}>
                        <img src={vehicle.image} alt={vehicle.name} style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: index === currentSlide ? 0.5 : 1, filter: index === currentSlide ? 'brightness(0.5)' : 'none', transition: 'opacity 150ms ease-in-out, filter 150ms ease-in-out' }} />
                      </span>
                      {index === currentSlide && <span style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', color: '#FFFFFF', fontFamily: 'var(--font-heading)', fontSize: '14px', fontWeight: 600, zIndex: 4, textShadow: '0 1px 3px rgba(0, 0, 0, 0.5)' }}>#{vehicle.rank}</span>}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>

        {/* Sidebar Section */}
        <div 
          style={sidebarContainerStyle}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <div style={sidebarStyle}>
            <div style={sidebarHeaderStyle}>
              <h3 style={sidebarTitleStyle}>
                <Icon name="location_on" size={16} style={{ marginRight: '6px', verticalAlign: 'middle', color: 'var(--color-primary-1, #E90C17)' }} />
                Local Listings
              </h3>
              <p style={sidebarSubtitleStyle}>
                {currentVehicle ? `${currentListings.length} ${currentVehicle.make} ${currentVehicle.model} listings near you` : 'Loading...'}
              </p>
            </div>

            {isLoadingListings ? (
              <div style={loadingStyle}>
                {[1, 2, 3].map(i => (
                  <div key={i} style={{
                    background: 'var(--color-neutrals-7, #F4F5F6)',
                    borderRadius: 'var(--border-radius-md, 8px)',
                    overflow: 'hidden',
                    border: '1px solid var(--color-neutrals-6, #E6E8EC)',
                  }}>
                    <div style={{ ...skeletonStyle, height: '120px' }} />
                    <div style={{ padding: '10px' }}>
                      <div style={{ ...skeletonStyle, height: '16px', width: '80%', marginBottom: '8px' }} />
                      <div style={{ ...skeletonStyle, height: '20px', width: '50%', marginBottom: '8px' }} />
                      <div style={{ ...skeletonStyle, height: '12px', width: '60%' }} />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div style={listingsListStyle}>
                {currentListings.slice(0, 3).map((listing) => (
                  <div 
                    key={listing.id}
                    style={{
                      flex: isTablet ? '0 0 auto' : undefined,
                      width: isTablet ? '320px' : undefined,
                      minWidth: isTablet ? '280px' : undefined,
                    }}
                  >
                    <ListingCard
                      listing={listing}
                      vehicleName={`${currentVehicle?.make} ${currentVehicle?.model}`}
                      vehicleYear={listing.year}
                      variant="compact"
                      onImageClick={() => {
                        // Navigate to the vehicle's make/model page
                        if (currentVehicle) {
                          navigate(`/vehicles/${currentVehicle.year}/${currentVehicle.make}/${currentVehicle.model}`);
                        }
                      }}
                      onSaveChange={(isSaved) => {
                        if (isSaved) {
                          setSavedLeadTitle(`${listing.year} ${currentVehicle?.make} ${currentVehicle?.model}`);
                          setIsSavedLeadModalOpen(true);
                        }
                      }}
                      onViewDetails={() => {
                        // Could navigate to listing details
                      }}
                    />
                  </div>
                ))}
                
                {currentListings.length > 3 && (
                  <button 
                    style={{
                      fontFamily: 'var(--font-body, Geist, sans-serif)',
                      width: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '6px',
                      background: 'transparent',
                      color: 'var(--color-primary-1, #E90C17)',
                      border: '1px solid var(--color-primary-1, #E90C17)',
                      borderRadius: 'var(--border-radius-sm, 4px)',
                      padding: '10px 16px',
                      fontSize: '13px',
                      fontWeight: 600,
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                    }}
                    onClick={() => currentVehicle && navigate(`/vehicles/${currentVehicle.year}/${currentVehicle.make}/${currentVehicle.model}`)}
                  >
                    View All {currentListings.length} Listings
                    <Icon name="arrow_forward" size={16} />
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      <SavedModal isOpen={isSavedModalOpen} onClose={() => setIsSavedModalOpen(false)} itemTitle={savedVehicleName} itemType="vehicle" />
      <SavedModal isOpen={isSavedLeadModalOpen} onClose={() => setIsSavedLeadModalOpen(false)} itemTitle={savedLeadTitle} itemType="lead" />
    </div>
  );
};

export default TopTenCarouselLeads;

