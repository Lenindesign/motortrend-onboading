/**
 * Top Ten Carousel Component
 * Migrated to inline React styles
 */

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../Icon';
import { Badge } from '../atoms/Badge/Badge';
import { ActionBadge } from '../molecules/ActionBadge';
import { PhotoGallery } from '../PhotoGallery';
import SavedModal from '../SavedModal';
import { parseVehicleName, vehicleImageFor } from '../../utils/vehicleImages';
import { getVehicleBodyStyle } from '../../utils/vehicleBodyStyles';
import { generateStaffRating, generateCommunityRating } from '../../utils/vehicleRatings';
import { getVehicles } from '../../api/vehiclesApi';
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
}

interface TopTenCarouselProps {
  className?: string;
  onExpandClick?: (vehicle: CarouselVehicle, index: number) => void;
  showExpandButton?: boolean;
  initialVehicleType?: VehicleType;
  initialSubcategory?: Subcategory;
}

export const TopTenCarousel: React.FC<TopTenCarouselProps> = ({ 
  className = '', 
  onExpandClick,
  showExpandButton = false,
  initialVehicleType = 'SUV',
  initialSubcategory = 'All'
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
  const [isInView, setIsInView] = useState(false);
  const ratingBadgeRef = useRef<HTMLDivElement>(null);
  const dotsRef = useRef<HTMLDivElement>(null);
  const [shouldHideRatingBadge, setShouldHideRatingBadge] = useState(false);
  
  // Responsive state
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [isTablet, setIsTablet] = useState(window.innerWidth <= 1024);
  const [isWideDesktop, setIsWideDesktop] = useState(window.innerWidth >= 1280);
  
  // Hover states
  const [hoveredNav, setHoveredNav] = useState<string | null>(null);
  const [hoveredDot, setHoveredDot] = useState<number | null>(null);
  const [isSaveBtnHovered, setIsSaveBtnHovered] = useState(false);
  const [isExpandBtnHovered, setIsExpandBtnHovered] = useState(false);
  
  // Touch/swipe state
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const minSwipeDistance = 50;

  // Photo gallery state
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [galleryImages, setGalleryImages] = useState<string[]>([]);
  const [galleryVehicleName, setGalleryVehicleName] = useState('');
  const [galleryLocalListings, setGalleryLocalListings] = useState<LocalListing[]>([]);
  
  // Saved modal state
  const [isSavedModalOpen, setIsSavedModalOpen] = useState(false);
  const [savedVehicleName, setSavedVehicleName] = useState('');

  // Inject keyframes animations
  useEffect(() => {
    const styleId = 'top-ten-carousel-styles';
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
      setIsWideDesktop(window.innerWidth >= 1280);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Load saved vehicles from localStorage
  useEffect(() => {
    try {
      const onboardingData = localStorage.getItem('onboardingData');
      if (onboardingData) {
        const data = JSON.parse(onboardingData);
        if (data.vehicles && Array.isArray(data.vehicles)) {
          const saved = new Set<string>(data.vehicles.map((v: { name: string }) => v.name));
          setSavedVehicles(saved);
        }
      }
    } catch (error) {
      console.error('Error loading saved vehicles:', error);
    }
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
      const combinedRating = (staffRating + communityRating) / 2;
      const vehicleImage = (vehicleItem.image && typeof vehicleItem.image === 'string' && vehicleItem.image.trim() !== '' && vehicleItem.image.startsWith('http'))
        ? vehicleItem.image : vehicleImageFor(vehicleItem.name);
      
      return { id: `vehicle-${index}`, name: vehicleItem.name, year, make, model, image: vehicleImage, galleryImages: vehicleItem.galleryImages, bodyStyle: vehicleItem.bodyStyle, staffRating, communityRating, combinedRating, vehicleYear };
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

    // Priority rankings for specific vehicle types
    if (selectedVehicleType === 'SUV' && selectedSubcategory === 'All') {
      const escaladeIQIndex = sortedVehicles.findIndex(v => v.make.toLowerCase() === 'cadillac' && v.model.toLowerCase().includes('escalade') && v.model.toLowerCase().includes('iq') && v.year === '2026');
      if (escaladeIQIndex > 0) { const [v] = sortedVehicles.splice(escaladeIQIndex, 1); sortedVehicles.unshift(v); }
    }
    if (selectedVehicleType === 'Sedan' && selectedSubcategory === 'All') {
      const golfRIndex = sortedVehicles.findIndex(v => v.make.toLowerCase() === 'volkswagen' && v.model.toLowerCase().includes('golf') && (v.model.toLowerCase().includes('r') || v.model.toLowerCase().includes('gti')) && v.year === '2026');
      if (golfRIndex > 0) { const [v] = sortedVehicles.splice(golfRIndex, 1); sortedVehicles.unshift(v); }
    }
    if (selectedVehicleType === 'Truck' && selectedSubcategory === 'All') {
      const ram1500Index = sortedVehicles.findIndex(v => v.make.toLowerCase() === 'ram' && v.model.toLowerCase().includes('1500') && v.year === '2025');
      if (ram1500Index > 0) { const [v] = sortedVehicles.splice(ram1500Index, 1); sortedVehicles.unshift(v); }
    }

    return sortedVehicles.slice(0, 10).map((vehicle, index) => ({
      id: `${selectedVehicleType.toLowerCase()}-${index}`,
      name: vehicle.name, year: vehicle.year, make: vehicle.make, model: vehicle.model, image: vehicle.image, galleryImages: vehicle.galleryImages, staffRating: vehicle.staffRating, communityRating: vehicle.communityRating, rank: index + 1
    })).reverse();
  }, [selectedVehicleType, selectedSubcategory, ratingType, allVehicleItems]);

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
    const checkOverlap = () => {
      if (!ratingBadgeRef.current || !dotsRef.current) { setShouldHideRatingBadge(false); return; }
      const originalVisibility = ratingBadgeRef.current.style.visibility;
      const originalOpacity = ratingBadgeRef.current.style.opacity;
      ratingBadgeRef.current.style.visibility = 'visible';
      ratingBadgeRef.current.style.opacity = '1';
      ratingBadgeRef.current.offsetHeight;
      const ratingBadgeRect = ratingBadgeRef.current.getBoundingClientRect();
      const dotsRect = dotsRef.current.getBoundingClientRect();
      ratingBadgeRef.current.style.visibility = originalVisibility;
      ratingBadgeRef.current.style.opacity = originalOpacity;
      setShouldHideRatingBadge(ratingBadgeRect.right + 8 > dotsRect.left);
    };
    const timeoutId = setTimeout(checkOverlap, 100);
    const timeoutId2 = setTimeout(checkOverlap, 300);
    window.addEventListener('resize', checkOverlap);
    return () => { window.removeEventListener('resize', checkOverlap); clearTimeout(timeoutId); clearTimeout(timeoutId2); };
  }, [carouselVehicles.length, selectedVehicleType, selectedSubcategory]);

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

  useEffect(() => {
    if (carouselVehicles.length <= 1) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isSliderHovered) return;
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        setCurrentSlide((prev) => {
          if (prev === 0) { const subcategories = getSubcategoriesForType(selectedVehicleType); const currentIndex = subcategories.indexOf(selectedSubcategory); setSelectedSubcategory(subcategories[(currentIndex - 1 + subcategories.length) % subcategories.length]); return 0; }
          return prev - 1;
        });
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        setCurrentSlide((prev) => {
          const nextSlide = prev + 1;
          if (nextSlide >= carouselVehicles.length) { const subcategories = getSubcategoriesForType(selectedVehicleType); const currentIndex = subcategories.indexOf(selectedSubcategory); setSelectedSubcategory(subcategories[(currentIndex + 1) % subcategories.length]); return 0; }
          return nextSlide;
        });
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isSliderHovered, carouselVehicles.length, selectedVehicleType, selectedSubcategory]);

  useEffect(() => { setCurrentSlide(0); }, [carouselVehicles]);

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

  const handleVehicleClick = async (vehicle: CarouselVehicle) => {
    const images = vehicle.galleryImages && vehicle.galleryImages.length > 0 ? vehicle.galleryImages : [vehicle.image];
    setGalleryImages(images);
    setGalleryVehicleName(vehicle.name);
    const { generateLocalListings } = await import('../../utils/localListings');
    const mockListings = generateLocalListings(vehicle.year, vehicle.image);
    setGalleryLocalListings(mockListings);
    setIsGalleryOpen(true);
    try {
      const parsed = parseVehicleName(vehicle.name);
      const { getLocalListings } = await import('../../utils/localListings');
      const listings = await getLocalListings(parsed.year, parsed.make, parsed.model, vehicle.image);
      if (listings.length > 0) setGalleryLocalListings(listings);
    } catch (error) { console.error('Error fetching local listings:', error); }
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

  // ==================== INLINE STYLES ====================

  const containerStyle: React.CSSProperties = {
    width: '100%',
    marginBottom: 0,
    padding: isWideDesktop ? '0 0 16px 0' : '0 16px 16px 16px',
  };

  const sliderStyle: React.CSSProperties = {
    position: 'relative',
    width: '100%',
    overflow: 'hidden',
    borderRadius: '4px',
    backgroundColor: 'var(--color-neutrals-8, #FCFCFD)',
    boxShadow: 'var(--shadow-lg, 0 10px 25px rgba(0,0,0,0.1))',
    aspectRatio: isMobile ? '1 / 1' : '16 / 9',
    minHeight: isMobile ? '338px' : undefined,
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
    borderRadius: '8px',
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
    borderRadius: '20px',
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
    letterSpacing: 0,
    textTransform: 'none',
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
    borderRadius: '50%',
    backgroundColor: isActive ? (isHovered ? 'rgba(255, 255, 255, 0.3)' : 'rgba(255, 255, 255, 0.2)') : (isHovered ? 'rgba(30, 30, 32, 0.5)' : 'rgba(20, 20, 22, 0.3)'),
    backdropFilter: 'blur(20px) saturate(180%)',
    WebkitBackdropFilter: 'blur(20px) saturate(180%)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    color: '#FFFFFF',
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

  const expandBtnStyle: React.CSSProperties = {
    ...getActionBtnStyle(isExpandBtnHovered),
    top: isMobile ? '16px' : '20px',
    right: isMobile ? '64px' : '76px',
    boxShadow: isExpandBtnHovered ? '0 12px 40px rgba(0, 0, 0, 0.5)' : '0 8px 32px rgba(0, 0, 0, 0.4)',
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
    borderRadius: '12px',
    padding: isMobile ? '20px' : '24px 28px',
    zIndex: 10,
    width: isMobile ? 'calc(100% - 40px)' : 'calc(100% - 32px)',
    pointerEvents: 'none',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
    display: 'flex',
    flexDirection: isMobile ? 'column' : 'row',
    alignItems: isMobile ? 'flex-start' : 'center',
    justifyContent: 'space-between',
    gap: isMobile ? '16px' : '32px',
    minWidth: 0,
    overflow: 'hidden',
    opacity: isActive ? 1 : 0,
    transform: isActive ? 'translateY(0)' : 'translateY(20px)',
    transition: 'opacity 0.6s cubic-bezier(0.2, 0.8, 0.2, 1), transform 0.6s cubic-bezier(0.2, 0.8, 0.2, 1)',
    transitionDelay: isActive ? '0.1s' : '0s',
  });

  const nameContainerStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: isMobile ? '6px' : '8px',
    flexShrink: 0,
  };

  const badgesRowStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    flexWrap: 'wrap',
    marginBottom: '6px',
  };

  const nameLinkStyle: React.CSSProperties = {
    textDecoration: 'none',
    color: '#FFFFFF',
    pointerEvents: 'auto',
    transition: 'opacity 0.2s ease',
    cursor: 'pointer',
  };

  const nameStyle: React.CSSProperties = {
    fontFamily: 'var(--font-heading, Poppins, sans-serif)',
    fontWeight: 600,
    fontSize: isMobile ? '22px' : '24px',
    lineHeight: isMobile ? 1.3 : 1.2,
    color: '#FFFFFF',
    WebkitTextFillColor: '#FFFFFF',
    margin: 0,
    padding: 0,
    flexShrink: 0,
  };

  const ratingsListStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: isMobile ? '16px' : '24px',
    flex: isMobile ? undefined : 1,
    justifyContent: isMobile ? 'flex-start' : 'flex-end',
    minWidth: 0,
    flexWrap: 'nowrap',
    position: 'relative',
    width: isMobile ? '100%' : undefined,
  };

  const getRatingItemStyle = (isFirst: boolean): React.CSSProperties => ({
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: isFirst ? '6px' : '12px',
    color: '#FFFFFF',
    fontSize: '14px',
    fontWeight: 500,
    lineHeight: 1.5,
    minWidth: 0,
    flexShrink: 0,
    height: 'fit-content',
    alignSelf: 'center',
    justifyContent: 'flex-start',
    textDecoration: 'none',
    pointerEvents: 'auto',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    paddingRight: isFirst ? (isMobile ? '16px' : '24px') : 0,
    position: 'relative',
    flex: isMobile ? 1 : undefined,
  });

  const ratingDividerStyle: React.CSSProperties = {
    content: '""',
    position: 'absolute',
    right: 0,
    top: '50%',
    transform: 'translateY(-50%)',
    width: '1px',
    height: isMobile ? '50px' : '40px',
    backgroundColor: '#FFFFFF',
  };

  const scoreRowStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: '6px',
    justifyContent: 'center',
    width: '100%',
  };

  const mtBadgeStyle: React.CSSProperties = {
    width: '14px',
    height: '14px',
    minWidth: '14px',
    minHeight: '14px',
    maxWidth: '14px',
    maxHeight: '14px',
    flexShrink: 0,
    objectFit: 'contain',
    display: 'block',
    margin: 0,
    padding: 0,
    lineHeight: 1,
  };

  const scoreLargeStyle: React.CSSProperties = {
    color: '#FFFFFF',
    fontSize: '26px',
    fontWeight: 600,
    fontFamily: 'var(--font-heading, Poppins, sans-serif)',
    lineHeight: 1,
    display: 'flex',
    alignItems: 'baseline',
    gap: '4px',
    whiteSpace: 'nowrap',
  };

  const scoreMaxStyle: React.CSSProperties = {
    color: '#FFFFFF',
    fontSize: '18px',
    fontWeight: 400,
    lineHeight: 1,
  };

  const labelRowStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: 'var(--spacing-1, 8px)',
    marginTop: 0,
    justifyContent: 'center',
    width: '100%',
    flexWrap: 'nowrap',
    minWidth: 0,
    flexShrink: 0,
  };

  const motortrendTextStyle: React.CSSProperties = {
    color: '#FFFFFF',
    fontSize: '14px',
    fontWeight: 500,
    lineHeight: 1.2,
    whiteSpace: 'nowrap',
  };

  const ratingTextStyle: React.CSSProperties = {
    color: '#FFFFFF',
    fontSize: '14px',
    fontWeight: 400,
    lineHeight: 1.2,
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    whiteSpace: 'nowrap',
    textAlign: 'center',
  };

  const getNavBtnStyle = (direction: 'prev' | 'next'): React.CSSProperties => ({
    position: 'absolute',
    top: '50%',
    transform: hoveredNav === direction ? 'translateY(-50%) scale(1.1)' : 'translateY(-50%)',
    left: direction === 'prev' ? (isMobile ? '12px' : '16px') : undefined,
    right: direction === 'next' ? (isMobile ? '12px' : '16px') : undefined,
    width: isMobile ? '44px' : '48px',
    height: isMobile ? '44px' : '48px',
    borderRadius: '50%',
    backgroundColor: hoveredNav === direction ? 'rgba(30, 30, 32, 0.5)' : 'rgba(20, 20, 22, 0.3)',
    backdropFilter: 'blur(20px) saturate(180%)',
    WebkitBackdropFilter: 'blur(20px) saturate(180%)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    color: '#FFFFFF',
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
    top: isMobile ? '16px' : (isTablet ? '16px' : '22px'),
    right: '92px',
    display: isMobile ? 'none' : 'flex',
    gap: 0,
    zIndex: 20,
    alignItems: 'center',
    overflow: 'visible',
    height: '32px',
  };

  const getDotStyle = (index: number, isActive: boolean): React.CSSProperties => {
    const isHovered = hoveredDot === index && !isActive;
    return {
      width: isMobile ? '8px' : '32px',
      height: isMobile ? '8px' : '32px',
      borderRadius: '50%',
      border: 'none',
      backgroundColor: isMobile ? (isActive ? '#FFFFFF' : 'rgba(255, 255, 255, 0.4)') : 'rgba(255, 255, 255, 0.1)',
      cursor: 'pointer',
      transition: 'transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1), margin 0.3s ease',
      padding: 0,
      position: 'relative',
      overflow: 'visible',
      flexShrink: 0,
      margin: isHovered ? '0 8px' : '0 4px',
      transform: isHovered ? 'scale(2)' : (isActive ? 'scale(1.2)' : 'scale(1)'),
      boxShadow: isMobile && isActive ? 'none' : undefined,
    };
  };

  const dotProgressStyle = (isActive: boolean): React.CSSProperties => ({
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    pointerEvents: 'none',
    zIndex: 3,
    overflow: 'visible',
    transition: 'transform var(--transition-fast, 150ms ease-in-out)',
    transformOrigin: 'center center',
    transform: isActive ? 'scale(1.2)' : 'scale(1)',
    display: isMobile ? 'none' : 'block',
  });

  const dotImageWrapperStyle: React.CSSProperties = {
    width: 'calc(100% - 4px)',
    height: 'calc(100% - 4px)',
    borderRadius: '50%',
    overflow: 'hidden',
    display: isMobile ? 'none' : 'block',
    position: 'relative',
    zIndex: 1,
    margin: '2px',
  };

  const getDotImageStyle = (isActive: boolean): React.CSSProperties => ({
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    display: isMobile ? 'none' : 'block',
    transition: 'opacity var(--transition-fast, 150ms ease-in-out), filter var(--transition-fast, 150ms ease-in-out)',
    opacity: isActive ? 0.5 : 1,
    filter: isActive ? 'brightness(0.5)' : 'none',
  });

  const dotRatingStyle: React.CSSProperties = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    color: '#FFFFFF',
    fontFamily: 'var(--font-heading, Poppins, sans-serif)',
    fontSize: '14px',
    fontWeight: 'var(--font-weight-bold, 600)',
    zIndex: 4,
    pointerEvents: 'none',
    textShadow: '0 1px 3px rgba(0, 0, 0, 0.5)',
  };

  const getDotTooltipStyle = (index: number, isActive: boolean): React.CSSProperties => {
    const isHovered = hoveredDot === index;
    return {
      position: 'absolute',
      top: 'calc(100% + 2px)',
      left: '50%',
      transform: isHovered && !isActive ? 'translateX(-50%) translateY(0) scale(0.5)' : 'translateX(-50%) translateY(0)',
      backgroundColor: 'rgba(20, 20, 22, 0.95)',
      backdropFilter: 'blur(10px)',
      WebkitBackdropFilter: 'blur(10px)',
      color: '#FFFFFF',
      padding: '6px 12px',
      borderRadius: '6px',
      fontFamily: 'var(--font-body, Geist, sans-serif)',
      fontSize: '12px',
      fontWeight: 600,
      whiteSpace: 'nowrap',
      opacity: isHovered && !isActive ? 1 : 0,
      visibility: isHovered && !isActive ? 'visible' : 'hidden',
      transition: 'opacity var(--transition-fast, 150ms ease-in-out), visibility var(--transition-fast, 150ms ease-in-out), transform var(--transition-fast, 150ms ease-in-out)',
      pointerEvents: 'none',
      zIndex: 10000,
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
      display: isMobile ? 'none' : 'block',
    };
  };

  const counterStyle: React.CSSProperties = {
    display: 'none',
    position: 'absolute',
    top: '16px',
    left: '50%',
    transform: 'translateX(-50%)',
    backgroundColor: 'rgba(20, 20, 22, 0.6)',
    backdropFilter: 'blur(10px)',
    WebkitBackdropFilter: 'blur(10px)',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    borderRadius: '20px',
    padding: '6px 14px',
    color: '#FFFFFF',
    fontFamily: 'var(--font-body, Geist, sans-serif)',
    fontSize: '13px',
    fontWeight: 600,
    zIndex: 20,
    pointerEvents: 'none',
  };

  if (carouselVehicles.length === 0) return null;

  return (
    <div ref={carouselRef} style={containerStyle} className={className}>
      <div 
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

          <div ref={ratingBadgeRef} style={{ ...categoryBadgeStyle, visibility: shouldHideRatingBadge ? 'hidden' : 'visible', pointerEvents: shouldHideRatingBadge ? 'none' : 'auto' }}>
            <select style={dropdownStyle} value={ratingType} onChange={(e) => { e.stopPropagation(); setRatingType(e.target.value as RatingType); setCurrentSlide(0); }} onClick={(e) => e.stopPropagation()}>
              <option value="MotorTrend">MotorTrend Rating</option>
              <option value="User Reviews">User Ratings</option>
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
                
                {showExpandButton && (
                  <button
                    style={expandBtnStyle}
                    onClick={(e) => { e.stopPropagation(); setGalleryImages([vehicle.image]); setGalleryVehicleName(vehicle.name); setIsGalleryOpen(true); if (onExpandClick) onExpandClick(vehicle, currentSlide); }}
                    onMouseEnter={() => setIsExpandBtnHovered(true)}
                    onMouseLeave={() => setIsExpandBtnHovered(false)}
                    aria-label="Expand to fullscreen"
                  >
                    <Icon name="open_in_full" size={24} />
                  </button>
                )}
                
                <div style={infoBoxStyle(index === currentSlide)}>
                  <div style={nameContainerStyle}>
                    <div style={badgesRowStyle}>
                      <ActionBadge text="Buyers Guide" variant="secondary" href={`/vehicles/${vehicle.year}/${vehicle.make}/${vehicle.model}`} onClick={(e) => { e.preventDefault(); e.stopPropagation(); navigate(`/vehicles/${vehicle.year}/${vehicle.make}/${vehicle.model}`); }} />
                      <ActionBadge text="See Local Listings" variant="primary" onClick={(e) => { e.stopPropagation(); handleVehicleClick(vehicle); }} />
                    </div>
                    <a href={`/vehicles/${vehicle.year}/${vehicle.make}/${vehicle.model}`} style={nameLinkStyle} onClick={(e) => e.stopPropagation()}>
                      <h2 style={nameStyle}>#{vehicle.rank} {vehicle.name}</h2>
                    </a>
                  </div>
                  <div style={ratingsListStyle}>
                    <a href={`/vehicles/${vehicle.year}/${vehicle.make}/${vehicle.model}#motortrend-review`} style={getRatingItemStyle(true)} onClick={(e) => e.stopPropagation()}>
                      <div style={scoreRowStyle}>
                        <img src="https://d2kde5ohu8qb21.cloudfront.net/files/692374f1d13f5100022ddf61/mticon.svg" alt="MotorTrend" style={mtBadgeStyle} />
                        <div style={scoreLargeStyle}>{vehicle.staffRating.toFixed(1)}<span style={scoreMaxStyle}>/10</span></div>
                      </div>
                      <div style={labelRowStyle}>
                        <span style={motortrendTextStyle}>{isMobile ? 'MT Rating' : 'MotorTrend Rating'}</span>
                      </div>
                      <div style={ratingDividerStyle} />
                    </a>
                    <a href={`/vehicles/${vehicle.year}/${vehicle.make}/${vehicle.model}#user-reviews`} style={getRatingItemStyle(false)} onClick={(e) => e.stopPropagation()}>
                      {renderStarRating(vehicle.communityRating)}
                      <div style={ratingTextStyle}>
                        <span>{isMobile ? 'Users' : 'User Reviews'}</span>
                        {' '}<Badge variant="info" size="sm">{(vehicle.communityRating / 2).toFixed(1)}/5</Badge>
                      </div>
                    </a>
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
            
            <div ref={dotsRef} style={dotsContainerStyle}>
              {carouselVehicles.map((vehicle, index) => (
                <button
                  key={index}
                  style={getDotStyle(index, index === currentSlide)}
                  onClick={() => setCurrentSlide(index)}
                  onMouseEnter={() => setHoveredDot(index)}
                  onMouseLeave={() => setHoveredDot(null)}
                  aria-label={`Go to ${vehicle.name}`}
                >
                  <svg key={`progress-${index}-${index === currentSlide ? animationKey : 0}`} style={dotProgressStyle(index === currentSlide)} viewBox="0 0 36 36">
                    <circle cx="18" cy="18" r="16" fill="none" stroke={hoveredDot === index || index === currentSlide ? 'rgba(255, 255, 255, 0.3)' : 'rgba(255, 255, 255, 0.2)'} strokeWidth="2" />
                    <circle
                      cx="18" cy="18" r="16" fill="none" stroke="#FFFFFF" strokeWidth={index === currentSlide ? '2.5' : '2'} strokeLinecap="round"
                      strokeDasharray={index === currentSlide && !isSliderHovered ? '100 100' : '0 100'}
                      transform="rotate(-90 18 18)"
                      style={{ 
                        transition: isSliderHovered ? 'stroke-dasharray 0.2s ease, opacity 0.2s ease' : 'stroke-dasharray 0.3s ease, opacity 0.3s ease',
                        opacity: index === currentSlide ? 1 : 0,
                        animation: index === currentSlide && !isSliderHovered ? 'progressCircle 5s linear infinite' : 'none',
                        animationPlayState: isSliderHovered ? 'paused' : 'running',
                      }}
                    />
                  </svg>
                  <span style={dotImageWrapperStyle}>
                    <img src={vehicle.image} alt={vehicle.name} style={getDotImageStyle(index === currentSlide)} />
                  </span>
                  {index === currentSlide && <span style={dotRatingStyle}>#{vehicle.rank}</span>}
                  <span style={getDotTooltipStyle(index, index === currentSlide)}>#{vehicle.rank} {vehicle.name}</span>
                </button>
              ))}
            </div>
            
            <div style={counterStyle}>{carouselVehicles.length - currentSlide} of {carouselVehicles.length}</div>
          </>
        )}
      </div>

      <PhotoGallery
        images={galleryImages}
        isOpen={isGalleryOpen}
        initialIndex={0}
        onClose={() => setIsGalleryOpen(false)}
        vehicleName={galleryVehicleName}
        localListings={galleryLocalListings}
        onViewAllListings={() => { const parsed = parseVehicleName(galleryVehicleName); navigate(`/vehicles/${parsed.year}/${parsed.make}/${parsed.model}`); setIsGalleryOpen(false); }}
      />

      <SavedModal isOpen={isSavedModalOpen} onClose={() => setIsSavedModalOpen(false)} itemTitle={savedVehicleName} itemType="vehicle" />
    </div>
  );
};
