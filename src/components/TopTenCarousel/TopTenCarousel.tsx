/**
 * Top Ten Carousel Component
 * Reusable carousel with vehicle type and subcategory filters
 */

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../Icon';
import { Badge } from '../atoms/Badge/Badge';
import { PhotoGallery } from '../PhotoGallery';
import { parseVehicleName, vehicleImageFor } from '../../utils/vehicleImages';
import { getVehicleBodyStyle } from '../../utils/vehicleBodyStyles';
import { generateStaffRating, generateCommunityRating } from '../../utils/vehicleRatings';
import { getVehicles } from '../../api/vehiclesApi';
import './TopTenCarousel.css';

export type VehicleType = 'SUV' | 'Sedan' | 'Truck' | 'Coupe';
export type Subcategory = 'All' | 'Subcompact' | 'Compact' | 'Midsize' | 'Full-Size' | 'Luxury' | 'Electric';

interface CarouselVehicle {
  id: string;
  name: string;
  year: string;
  make: string;
  model: string;
  image: string;
  staffRating: number;
  communityRating: number;
  rank: number;
}

interface TopTenCarouselProps {
  className?: string;
  onExpandClick?: (vehicle: CarouselVehicle, index: number) => void;
  showExpandButton?: boolean;
}

export const TopTenCarousel: React.FC<TopTenCarouselProps> = ({ 
  className = '', 
  onExpandClick,
  showExpandButton = false 
}) => {
  const navigate = useNavigate();
  
  const [selectedVehicleType, setSelectedVehicleType] = useState<VehicleType>('SUV');
  const [selectedSubcategory, setSelectedSubcategory] = useState<Subcategory>('All');
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isSliderHovered, setIsSliderHovered] = useState(false);
  const slideIntervalRef = useRef<number | null>(null);
  
  // Touch/swipe state
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const minSwipeDistance = 50;

  // Photo gallery state
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [galleryImages, setGalleryImages] = useState<string[]>([]);
  const [galleryVehicleName, setGalleryVehicleName] = useState('');

  // Get all vehicles from API (memoized to prevent unnecessary re-renders)
  const allVehicleItems = useMemo(() => {
    const apiVehicles = getVehicles();
    console.log('TopTenCarousel: Total vehicles from API:', apiVehicles.length);
    return apiVehicles.map(v => ({
      name: `${v.year} ${v.make} ${v.model}`,
      image: v.image
    }));
  }, []); // Empty dependency array since getVehicles() returns static data

  // Helper function to get subcategories for a vehicle type
  const getSubcategoriesForType = (type: VehicleType): Subcategory[] => {
    const commonSubcategories: Subcategory[] = ['All', 'Subcompact', 'Compact', 'Midsize', 'Full-Size', 'Luxury', 'Electric'];
    
    switch (type) {
      case 'SUV':
        return commonSubcategories;
      case 'Sedan':
        return ['All', 'Compact', 'Midsize', 'Full-Size', 'Luxury', 'Electric'];
      case 'Truck':
        return ['All', 'Midsize', 'Full-Size', 'Electric'];
      case 'Coupe':
        return ['All', 'Compact', 'Midsize', 'Luxury', 'Electric'];
      default:
        return ['All'];
    }
  };

  // Helper function to categorize vehicles
  const getVehicleSubcategory = (vehicleName: string, vehicleType: VehicleType): Subcategory => {
    const name = vehicleName.toLowerCase();
    
    // Electric vehicles (highest priority)
    const electricModels = ['electric', 'ev', 'e-tron', 'taycan', 'model 3', 'model s', 'model x', 'model y', 'i4', 'i8', 'eq', 'ioniq', 'leaf', 'bolt', 'id.4', 'mach-e', 'lightning', 'rivian', 'lucid', 'polestar', 'ariya', 'bz4x'];
    if (electricModels.some(model => name.includes(model))) return 'Electric';

    // SUV subcategories
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

    // Truck subcategories
    if (vehicleType === 'Truck') {
      const compactTrucks = ['maverick', 'santa cruz'];
      const midsizeTrucks = ['ranger', 'colorado', 'tacoma', 'frontier', 'gladiator', 'canyon', 'ridgeline'];
      const fullSizeTrucks = ['f-150', 'silverado', 'sierra', 'ram 1500', 'tundra', 'titan'];
      
      if (compactTrucks.some(model => name.includes(model))) return 'Compact';
      if (midsizeTrucks.some(model => name.includes(model))) return 'Midsize';
      if (fullSizeTrucks.some(model => name.includes(model))) return 'Full-Size';
    }

    // Sedan subcategories
    if (vehicleType === 'Sedan') {
      const subcompactSedans = ['rio', 'versa', 'mirage'];
      const compactSedans = ['civic', 'corolla', 'sentra', 'elantra', 'forte', 'mazda3', 'impreza', 'jetta', 'a3'];
      const midsizeSedans = ['accord', 'camry', 'altima', 'sonata', 'optima', 'mazda6', 'legacy', 'passat', 'a4', '3 series', 'c-class'];
      const fullSizeSedans = ['avalon', 'maxima', 'charger', '300', 'impala', 'a6', '5 series', 'e-class'];
      
      if (subcompactSedans.some(model => name.includes(model))) return 'Subcompact';
      if (compactSedans.some(model => name.includes(model))) return 'Compact';
      if (midsizeSedans.some(model => name.includes(model))) return 'Midsize';
      if (fullSizeSedans.some(model => name.includes(model))) return 'Full-Size';
    }

    // Luxury classification
    const luxuryBrands = ['mercedes', 'bmw', 'audi', 'lexus', 'infiniti', 'acura', 'cadillac', 'lincoln', 'genesis', 'porsche', 'jaguar', 'land rover', 'volvo'];
    if (luxuryBrands.some(brand => name.includes(brand))) return 'Luxury';

    return 'All';
  };

  // Reset subcategory when vehicle type changes
  useEffect(() => {
    setSelectedSubcategory('All');
  }, [selectedVehicleType]);

  // Prepare vehicles for carousel (10 best vehicles of selected type)
  const carouselVehicles: CarouselVehicle[] = useMemo(() => {
    // Filter by selected vehicle type
    let filteredVehicles = allVehicleItems.filter(vehicle => {
      const bodyStyles = getVehicleBodyStyle(vehicle.name);
      return bodyStyles.includes(selectedVehicleType);
    });
    
    console.log(`TopTenCarousel: Filtered ${filteredVehicles.length} ${selectedVehicleType}s from ${allVehicleItems.length} total vehicles`);
    
    // Filter by subcategory if not 'All'
    if (selectedSubcategory !== 'All') {
      filteredVehicles = filteredVehicles.filter(vehicle => {
        return getVehicleSubcategory(vehicle.name, selectedVehicleType) === selectedSubcategory;
      });
    }

    // Map to Vehicle objects with ratings
    const vehiclesWithRatings = filteredVehicles.map((vehicleItem, index) => {
      const parsed = parseVehicleName(vehicleItem.name);
      const year = decodeURIComponent(parsed.year);
      const make = decodeURIComponent(parsed.make);
      const model = decodeURIComponent(parsed.model);
      
      const currentYear = new Date().getFullYear();
      const vehicleYear = parseInt(year) || currentYear;
      
      const staffRating = generateStaffRating(vehicleItem.name);
      const communityRating = generateCommunityRating(vehicleItem.name);
      const combinedRating = (staffRating + communityRating) / 2;
      
      return {
        id: `vehicle-${index}`,
        name: vehicleItem.name,
        year,
        make,
        model,
        image: vehicleItem.image || vehicleImageFor(vehicleItem.name),
        staffRating,
        communityRating,
        combinedRating,
        vehicleYear
      };
    });

    // Remove duplicates by make/model (keep latest year)
    const uniqueVehicles = new Map<string, typeof vehiclesWithRatings[0]>();
    vehiclesWithRatings.forEach(vehicle => {
      const key = `${vehicle.make}-${vehicle.model}`.toLowerCase();
      const existing = uniqueVehicles.get(key);
      if (!existing || vehicle.vehicleYear > existing.vehicleYear) {
        uniqueVehicles.set(key, vehicle);
      }
    });

    // Sort by combined rating (best first), then by year (latest first)
    const sortedVehicles = Array.from(uniqueVehicles.values()).sort((a, b) => {
      if (Math.abs(a.combinedRating - b.combinedRating) > 0.1) {
        return b.combinedRating - a.combinedRating;
      }
      return b.vehicleYear - a.vehicleYear;
    });

    // Take top 10 best vehicles and reverse order (10 to 1)
    const finalVehicles = sortedVehicles.slice(0, 10).map((vehicle, index) => ({
      id: `${selectedVehicleType.toLowerCase()}-${index}`,
      name: vehicle.name,
      year: vehicle.year,
      make: vehicle.make,
      model: vehicle.model,
      image: vehicle.image,
      staffRating: vehicle.staffRating,
      communityRating: vehicle.communityRating,
      rank: index + 1
    })).reverse();
    
    console.log(`TopTenCarousel: Final carousel has ${finalVehicles.length} vehicles for ${selectedVehicleType} - ${selectedSubcategory}`);
    
    return finalVehicles;
  }, [selectedVehicleType, selectedSubcategory, allVehicleItems]);

  // Auto-advance carousel
  useEffect(() => {
    if (carouselVehicles.length <= 1) return;
    
    if (!isSliderHovered) {
      slideIntervalRef.current = window.setInterval(() => {
        setCurrentSlide((prev) => {
          const nextSlide = prev + 1;
          
          // If we've reached the end, switch to next subcategory
          if (nextSlide >= carouselVehicles.length) {
            const subcategories = getSubcategoriesForType(selectedVehicleType);
            const currentIndex = subcategories.indexOf(selectedSubcategory);
            const nextIndex = (currentIndex + 1) % subcategories.length;
            setSelectedSubcategory(subcategories[nextIndex]);
            return 0;
          }
          
          return nextSlide;
        });
      }, 5000);
    } else {
      if (slideIntervalRef.current) {
        clearInterval(slideIntervalRef.current);
      }
    }
    
    return () => {
      if (slideIntervalRef.current) {
        clearInterval(slideIntervalRef.current);
      }
    };
  }, [isSliderHovered, carouselVehicles.length, selectedVehicleType, selectedSubcategory]);

  // Keyboard navigation
  useEffect(() => {
    if (carouselVehicles.length <= 1) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isSliderHovered) return;

      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        setCurrentSlide((prev) => {
          if (prev === 0) {
            const subcategories = getSubcategoriesForType(selectedVehicleType);
            const currentIndex = subcategories.indexOf(selectedSubcategory);
            const prevIndex = (currentIndex - 1 + subcategories.length) % subcategories.length;
            setSelectedSubcategory(subcategories[prevIndex]);
            return 0;
          }
          return prev - 1;
        });
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        setCurrentSlide((prev) => {
          const nextSlide = prev + 1;
          
          if (nextSlide >= carouselVehicles.length) {
            const subcategories = getSubcategoriesForType(selectedVehicleType);
            const currentIndex = subcategories.indexOf(selectedSubcategory);
            const nextIndex = (currentIndex + 1) % subcategories.length;
            setSelectedSubcategory(subcategories[nextIndex]);
            return 0;
          }
          
          return nextSlide;
        });
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isSliderHovered, carouselVehicles.length, selectedVehicleType, selectedSubcategory]);

  // Reset slide when vehicles change
  useEffect(() => {
    setCurrentSlide(0);
  }, [carouselVehicles]);

  // Touch handlers for swipe gestures
  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;
    
    if (isLeftSwipe) {
      // Swipe left - go to next slide
      setCurrentSlide((prev) => {
        const nextSlide = prev + 1;
        
        if (nextSlide >= carouselVehicles.length) {
          const subcategories = getSubcategoriesForType(selectedVehicleType);
          const currentIndex = subcategories.indexOf(selectedSubcategory);
          const nextIndex = (currentIndex + 1) % subcategories.length;
          setSelectedSubcategory(subcategories[nextIndex]);
          return 0;
        }
        
        return nextSlide;
      });
    } else if (isRightSwipe) {
      // Swipe right - go to previous slide
      setCurrentSlide((prev) => {
        if (prev === 0) {
          const subcategories = getSubcategoriesForType(selectedVehicleType);
          const currentIndex = subcategories.indexOf(selectedSubcategory);
          const prevIndex = (currentIndex - 1 + subcategories.length) % subcategories.length;
          setSelectedSubcategory(subcategories[prevIndex]);
          return 0;
        }
        return prev - 1;
      });
    }
  };

  // Handle vehicle click
  const handleVehicleClick = (vehicle: CarouselVehicle) => {
    const parsed = parseVehicleName(vehicle.name);
    navigate(`/vehicles/${parsed.year}/${parsed.make}/${parsed.model}`);
  };

  // Helper function to render star rating
  const renderStarRating = (ratingValue: number) => {
    const normalizedRating = ratingValue / 2;
    
    return (
      <div className="top-ten-carousel__rating-stars">
        {[1, 2, 3, 4, 5].map((star) => {
          const isFilled = star < Math.ceil(normalizedRating);
          const isHalf = star === Math.ceil(normalizedRating) && normalizedRating % 1 !== 0;
          
          return (
            <div key={star} className={`top-ten-carousel__star-wrapper ${isHalf ? 'top-ten-carousel__star-wrapper--half' : ''}`}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="top-ten-carousel__star top-ten-carousel__star--outline">
                <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"
                  fill="none"
                  stroke="#33C4FF"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              {isFilled && (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="top-ten-carousel__star top-ten-carousel__star--filled">
                  <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"
                    fill="#33C4FF"
                  />
                </svg>
              )}
              {isHalf && (
                <div className="top-ten-carousel__star-half-fill">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="top-ten-carousel__star">
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

  if (carouselVehicles.length === 0) {
    return null;
  }

  return (
    <div className={`top-ten-carousel ${className}`}>
      <div 
        className="top-ten-carousel__slider"
        onMouseEnter={() => setIsSliderHovered(true)}
        onMouseLeave={() => setIsSliderHovered(false)}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        {/* Top Ten Badge with Two Dropdowns - Fixed position */}
        <div className="top-ten-carousel__badges-container">
          {/* Vehicle Type Dropdown */}
          <div className="top-ten-carousel__category-badge">
            <select 
              className="top-ten-carousel__category-dropdown"
              value={selectedVehicleType}
              onChange={(e) => {
                e.stopPropagation();
                setSelectedVehicleType(e.target.value as VehicleType);
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <option value="SUV">Top Ten SUVs</option>
              <option value="Sedan">Top Ten Sedans</option>
              <option value="Truck">Top Ten Trucks</option>
              <option value="Coupe">Top Ten Coupes</option>
            </select>
            <Icon name="keyboard_arrow_down" size={20} className="top-ten-carousel__category-arrow" />
          </div>

          {/* Subcategory Dropdown */}
          <div className="top-ten-carousel__category-badge top-ten-carousel__subcategory-badge">
            <select 
              className="top-ten-carousel__category-dropdown"
              value={selectedSubcategory}
              onChange={(e) => {
                e.stopPropagation();
                setSelectedSubcategory(e.target.value as Subcategory);
              }}
              onClick={(e) => e.stopPropagation()}
            >
              {getSubcategoriesForType(selectedVehicleType).map(subcat => (
                <option key={subcat} value={subcat}>
                  {subcat === 'All' ? 'All Categories' : subcat}
                </option>
              ))}
            </select>
            <Icon name="keyboard_arrow_down" size={20} className="top-ten-carousel__category-arrow" />
          </div>
        </div>
        
        <div 
          className="top-ten-carousel__track"
          style={{ transform: `translateX(-${currentSlide * 100}%)` }}
        >
          {carouselVehicles.map((vehicle) => (
            <div 
              key={vehicle.id} 
              className="top-ten-carousel__slide"
              onClick={() => handleVehicleClick(vehicle)}
            >
              <div className="top-ten-carousel__image">
                <img src={vehicle.image} alt={vehicle.name} />
                
                {/* Expand Button */}
                {showExpandButton && (
                  <button
                    className="top-ten-carousel__expand-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      // Open photo gallery with vehicle image
                      setGalleryImages([vehicle.image]);
                      setGalleryVehicleName(vehicle.name);
                      setIsGalleryOpen(true);
                      // Also call the prop callback if provided
                      if (onExpandClick) {
                        onExpandClick(vehicle, currentSlide);
                      }
                    }}
                    aria-label="Expand to fullscreen"
                  >
                    <Icon name="open_in_full" size={24} />
                  </button>
                )}
                
                {/* Vehicle Name and Ratings Box */}
                <div className="top-ten-carousel__info-box">
                  <div className="top-ten-carousel__name-container">
                    <h2 className="top-ten-carousel__name">#{vehicle.rank} {vehicle.name}</h2>
                    <a 
                      href={`/vehicles/${vehicle.year}/${vehicle.make}/${vehicle.model}`}
                      className="top-ten-carousel__buyers-guide-badge"
                      onClick={(e) => {
                        e.stopPropagation();
                      }}
                    >
                      <Badge variant="info" size="sm">Buyers Guide</Badge>
                    </a>
                  </div>
                  <div className="top-ten-carousel__ratings-list">
                    <div className="top-ten-carousel__rating-item">
                      <div className="top-ten-carousel__rating-score-row">
                        <img 
                          src="https://d2kde5ohu8qb21.cloudfront.net/files/692374f1d13f5100022ddf61/mticon.svg" 
                          alt="MotorTrend" 
                          className="top-ten-carousel__rating-mt-badge" 
                        />
                        <div className="top-ten-carousel__rating-score-large">
                          {vehicle.staffRating.toFixed(1)}
                          <span className="top-ten-carousel__rating-score-max">/10</span>
                        </div>
                      </div>
                      <div className="top-ten-carousel__rating-label-row">
                        <span className="top-ten-carousel__rating-motortrend-text">MotorTrend Rating</span>
                      </div>
                    </div>
                    <div className="top-ten-carousel__rating-item top-ten-carousel__rating-item--community">
                      {renderStarRating(vehicle.communityRating)}
                      <div className="top-ten-carousel__rating-text">
                        User Reviews <Badge variant="info" size="sm">{(vehicle.communityRating / 2).toFixed(1)}/5</Badge>
                      </div>
                    </div>
                  </div>
                  <button 
                    className="top-ten-carousel__listing-btn cta cta--primary cta--default"
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
        {carouselVehicles.length > 1 && (
          <>
            <button
              className="top-ten-carousel__nav top-ten-carousel__nav--prev"
              onClick={() => {
                setCurrentSlide((prev) => {
                  if (prev === 0) {
                    const subcategories = getSubcategoriesForType(selectedVehicleType);
                    const currentIndex = subcategories.indexOf(selectedSubcategory);
                    const prevIndex = (currentIndex - 1 + subcategories.length) % subcategories.length;
                    setSelectedSubcategory(subcategories[prevIndex]);
                    return 0;
                  }
                  return prev - 1;
                });
              }}
              aria-label="Previous slide"
            >
              <Icon name="chevron_left" size={32} />
            </button>
            <button
              className="top-ten-carousel__nav top-ten-carousel__nav--next"
              onClick={() => {
                setCurrentSlide((prev) => {
                  const nextSlide = prev + 1;
                  
                  if (nextSlide >= carouselVehicles.length) {
                    const subcategories = getSubcategoriesForType(selectedVehicleType);
                    const currentIndex = subcategories.indexOf(selectedSubcategory);
                    const nextIndex = (currentIndex + 1) % subcategories.length;
                    setSelectedSubcategory(subcategories[nextIndex]);
                    return 0;
                  }
                  
                  return nextSlide;
                });
              }}
              aria-label="Next slide"
            >
              <Icon name="chevron_right" size={32} />
            </button>
            
            {/* Slider Dots */}
            <div className="top-ten-carousel__dots">
              {carouselVehicles.map((_, index) => (
                <button
                  key={index}
                  className={`top-ten-carousel__dot ${index === currentSlide ? 'top-ten-carousel__dot--active' : ''}`}
                  onClick={() => setCurrentSlide(index)}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          </>
        )}
      </div>

      {/* Photo Gallery Modal */}
      <PhotoGallery
        images={galleryImages}
        isOpen={isGalleryOpen}
        initialIndex={0}
        onClose={() => setIsGalleryOpen(false)}
        vehicleName={galleryVehicleName}
      />
    </div>
  );
};

