/**
 * Home Page Component
 * MotorTrend home page based on Figma design
 */

import React, { useMemo, useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { HeroPlusThree } from '../../components/HeroPlusThree';
import { NewsSection } from '../../components/NewsSection';
import { VehiclesSection, type VehicleItem } from '../../components/VehiclesSection';
import { AdContainer } from '../../components/AdContainer';
import Icon from '../../components/Icon';
import type { RiverItem } from '../../components/River';
import { sortContentByUserType, type ContentCategory } from '../../utils/contentFiltering';
import { getVehicleLifestyles, type LifestyleCategory } from '../../utils/vehicleLifestyles';
import { vehicleImageFor, parseVehicleName } from '../../utils/vehicleImages';
import { generateStaffRating, generateCommunityRating } from '../../utils/vehicleRatings';
import { getVehicleBodyStyle } from '../../utils/vehicleBodyStyles';
import { useRating } from '../../contexts/RatingContext';
import { getVehicleSpecs } from '../../utils/vehicleSpecs';
import { getArticleBySlug } from '../../utils/articles';
import './Home.css';

// Full vehicle database - same as VehicleInventory
const carDatabase = [
  '2015 Subaru WRX', '2021 Subaru WRX', '2018 Subaru WRX', '2017 Subaru WRX', '2024 Subaru WRX', '2022 Subaru WRX', '2025 Subaru WRX',
  '2020 Honda Civic', '2021 Honda Civic', '2022 Honda Civic', '2023 Honda Civic', '2024 Honda Civic',
  '2019 Toyota Camry', '2020 Toyota Camry', '2021 Toyota Camry', '2022 Toyota Camry', '2023 Toyota Camry', '2024 Toyota Camry',
  '2020 Ford Mustang', '2021 Ford Mustang', '2022 Ford Mustang', '2023 Ford Mustang', '2024 Ford Mustang',
  '2021 Tesla Model 3', '2022 Tesla Model 3', '2023 Tesla Model 3', '2024 Tesla Model 3',
  '2020 BMW 3 Series', '2021 BMW 3 Series', '2022 BMW 3 Series', '2023 BMW 3 Series', '2024 BMW 3 Series',
  '2019 Audi A4', '2020 Audi A4', '2021 Audi A4', '2022 Audi A4', '2023 Audi A4', '2024 Audi A4',
  '2020 Mercedes C-Class', '2021 Mercedes C-Class', '2022 Mercedes C-Class', '2023 Mercedes C-Class', '2024 Mercedes C-Class',
  '2021 Nissan Altima', '2022 Nissan Altima', '2023 Nissan Altima', '2024 Nissan Altima',
  '2020 Chevrolet Camaro', '2021 Chevrolet Camaro', '2022 Chevrolet Camaro', '2023 Chevrolet Camaro', '2024 Chevrolet Camaro',
  '2021 Dodge Challenger', '2022 Dodge Challenger', '2023 Dodge Challenger', '2024 Dodge Challenger',
  '2020 Lexus IS', '2021 Lexus IS', '2022 Lexus IS', '2023 Lexus IS', '2024 Lexus IS',
  '2021 Infiniti Q50', '2022 Infiniti Q50', '2023 Infiniti Q50', '2024 Infiniti Q50',
  '2020 Acura TLX', '2021 Acura TLX', '2022 Acura TLX', '2023 Acura TLX', '2024 Acura TLX',
  '2021 Genesis G70', '2022 Genesis G70', '2023 Genesis G70', '2024 Genesis G70',
  '2020 Volvo S60', '2021 Volvo S60', '2022 Volvo S60', '2023 Volvo S60', '2024 Volvo S60',
  '2021 Cadillac CT4', '2022 Cadillac CT4', '2023 Cadillac CT4', '2024 Cadillac CT4',
  '2020 Jaguar XE', '2021 Jaguar XE', '2022 Jaguar XE', '2023 Jaguar XE', '2024 Jaguar XE',
  '2021 Alfa Romeo Giulia', '2022 Alfa Romeo Giulia', '2023 Alfa Romeo Giulia', '2024 Alfa Romeo Giulia',
  '2020 Kia Stinger', '2021 Kia Stinger', '2022 Kia Stinger', '2023 Kia Stinger', '2024 Kia Stinger',
  '2021 Hyundai Sonata', '2022 Hyundai Sonata', '2023 Hyundai Sonata', '2024 Hyundai Sonata',
  '2020 Mazda6', '2021 Mazda6', '2022 Mazda6', '2023 Mazda6', '2024 Mazda6',
  '2020 Subaru Legacy', '2021 Subaru Legacy', '2022 Subaru Legacy', '2023 Subaru Legacy', '2024 Subaru Legacy',
  '2020 Subaru Impreza', '2021 Subaru Impreza', '2022 Subaru Impreza', '2023 Subaru Impreza', '2024 Subaru Impreza',
  '2020 Subaru Outback', '2021 Subaru Outback', '2022 Subaru Outback', '2023 Subaru Outback', '2024 Subaru Outback',
  '2020 Subaru Forester', '2021 Subaru Forester', '2022 Subaru Forester', '2023 Subaru Forester', '2024 Subaru Forester',
  '2020 Subaru Ascent', '2021 Subaru Ascent', '2022 Subaru Ascent', '2023 Subaru Ascent', '2024 Subaru Ascent',
  '2020 Subaru Crosstrek', '2021 Subaru Crosstrek', '2022 Subaru Crosstrek', '2023 Subaru Crosstrek', '2024 Subaru Crosstrek',
  '2020 Subaru BRZ', '2021 Subaru BRZ', '2022 Subaru BRZ', '2023 Subaru BRZ', '2024 Subaru BRZ',
  '2020 Subaru WRX STI', '2021 Subaru WRX STI', '2022 Subaru WRX STI', '2023 Subaru WRX STI', '2024 Subaru WRX STI',
  '2020 Ford F-150', '2021 Ford F-150', '2022 Ford F-150', '2023 Ford F-150', '2024 Ford F-150', '2025 Ford F-150', '2026 Ford F-150',
  '2020 Ford Explorer', '2021 Ford Explorer', '2022 Ford Explorer', '2023 Ford Explorer', '2024 Ford Explorer',
  '2020 Ford Escape', '2021 Ford Escape', '2022 Ford Escape', '2023 Ford Escape', '2024 Ford Escape',
  '2020 Ford Edge', '2021 Ford Edge', '2022 Ford Edge', '2023 Ford Edge', '2024 Ford Edge',
  '2020 Ford Bronco', '2021 Ford Bronco', '2022 Ford Bronco', '2023 Ford Bronco', '2024 Ford Bronco',
  '2020 Ford Bronco Sport', '2021 Ford Bronco Sport', '2022 Ford Bronco Sport', '2023 Ford Bronco Sport', '2024 Ford Bronco Sport',
  '2020 Ford Ranger', '2021 Ford Ranger', '2022 Ford Ranger', '2023 Ford Ranger', '2024 Ford Ranger',
  '2020 Ford Maverick', '2021 Ford Maverick', '2022 Ford Maverick', '2023 Ford Maverick', '2024 Ford Maverick',
  '2020 Chevrolet Silverado', '2021 Chevrolet Silverado', '2022 Chevrolet Silverado', '2023 Chevrolet Silverado', '2024 Chevrolet Silverado',
  '2020 Chevrolet Tahoe', '2021 Chevrolet Tahoe', '2022 Chevrolet Tahoe', '2023 Chevrolet Tahoe', '2024 Chevrolet Tahoe',
  '2020 Chevrolet Suburban', '2021 Chevrolet Suburban', '2022 Chevrolet Suburban', '2023 Chevrolet Suburban', '2024 Chevrolet Suburban',
  '2020 Chevrolet Equinox', '2021 Chevrolet Equinox', '2022 Chevrolet Equinox', '2023 Chevrolet Equinox', '2024 Chevrolet Equinox',
  '2020 Chevrolet Traverse', '2021 Chevrolet Traverse', '2022 Chevrolet Traverse', '2023 Chevrolet Traverse', '2024 Chevrolet Traverse',
  '2020 Chevrolet Blazer', '2021 Chevrolet Blazer', '2022 Chevrolet Blazer', '2023 Chevrolet Blazer', '2024 Chevrolet Blazer',
  '2020 Chevrolet Corvette', '2021 Chevrolet Corvette', '2022 Chevrolet Corvette', '2023 Chevrolet Corvette', '2024 Chevrolet Corvette',
  '2020 Ram 1500', '2021 Ram 1500', '2022 Ram 1500', '2023 Ram 1500', '2024 Ram 1500', '2025 Ram 1500',
  '2020 Ram 2500', '2021 Ram 2500', '2022 Ram 2500', '2023 Ram 2500', '2024 Ram 2500',
  '2020 Ram 3500', '2021 Ram 3500', '2022 Ram 3500', '2023 Ram 3500', '2024 Ram 3500',
  '2020 GMC Sierra', '2021 GMC Sierra', '2022 GMC Sierra', '2023 GMC Sierra', '2024 GMC Sierra',
  '2020 GMC Yukon', '2021 GMC Yukon', '2022 GMC Yukon', '2023 GMC Yukon', '2024 GMC Yukon',
  '2020 GMC Acadia', '2021 GMC Acadia', '2022 GMC Acadia', '2023 GMC Acadia', '2024 GMC Acadia',
  '2020 Toyota RAV4', '2021 Toyota RAV4', '2022 Toyota RAV4', '2023 Toyota RAV4', '2024 Toyota RAV4',
  '2020 Toyota Highlander', '2021 Toyota Highlander', '2022 Toyota Highlander', '2023 Toyota Highlander', '2024 Toyota Highlander',
  '2020 Toyota 4Runner', '2021 Toyota 4Runner', '2022 Toyota 4Runner', '2023 Toyota 4Runner', '2024 Toyota 4Runner',
  '2020 Toyota Tacoma', '2021 Toyota Tacoma', '2022 Toyota Tacoma', '2023 Toyota Tacoma', '2024 Toyota Tacoma',
  '2020 Toyota Tundra', '2021 Toyota Tundra', '2022 Toyota Tundra', '2023 Toyota Tundra', '2024 Toyota Tundra',
  '2020 Toyota Corolla', '2021 Toyota Corolla', '2022 Toyota Corolla', '2023 Toyota Corolla', '2024 Toyota Corolla',
  '2020 Toyota Prius', '2021 Toyota Prius', '2022 Toyota Prius', '2023 Toyota Prius', '2024 Toyota Prius',
  '2020 Honda Accord', '2021 Honda Accord', '2022 Honda Accord', '2023 Honda Accord', '2024 Honda Accord',
  '2020 Honda CR-V', '2021 Honda CR-V', '2022 Honda CR-V', '2023 Honda CR-V', '2024 Honda CR-V',
  '2020 Honda Pilot', '2021 Honda Pilot', '2022 Honda Pilot', '2023 Honda Pilot', '2024 Honda Pilot',
  '2020 Honda Passport', '2021 Honda Passport', '2022 Honda Passport', '2023 Honda Passport', '2024 Honda Passport',
  '2020 Honda Ridgeline', '2021 Honda Ridgeline', '2022 Honda Ridgeline', '2023 Honda Ridgeline', '2024 Honda Ridgeline',
  '2020 Honda HR-V', '2021 Honda HR-V', '2022 Honda HR-V', '2023 Honda HR-V', '2024 Honda HR-V',
  '2020 Nissan Rogue', '2021 Nissan Rogue', '2022 Nissan Rogue', '2023 Nissan Rogue', '2024 Nissan Rogue',
  '2020 Nissan Pathfinder', '2021 Nissan Pathfinder', '2022 Nissan Pathfinder', '2023 Nissan Pathfinder', '2024 Nissan Pathfinder',
  '2020 Nissan Murano', '2021 Nissan Murano', '2022 Nissan Murano', '2023 Nissan Murano', '2024 Nissan Murano',
  '2020 Nissan Frontier', '2021 Nissan Frontier', '2022 Nissan Frontier', '2023 Nissan Frontier', '2024 Nissan Frontier',
  '2020 Nissan Titan', '2021 Nissan Titan', '2022 Nissan Titan', '2023 Nissan Titan', '2024 Nissan Titan',
  '2020 Jeep Wrangler', '2021 Jeep Wrangler', '2022 Jeep Wrangler', '2023 Jeep Wrangler', '2024 Jeep Wrangler',
  '2020 Jeep Grand Cherokee', '2021 Jeep Grand Cherokee', '2022 Jeep Grand Cherokee', '2023 Jeep Grand Cherokee', '2024 Jeep Grand Cherokee',
  '2020 Jeep Cherokee', '2021 Jeep Cherokee', '2022 Jeep Cherokee', '2023 Jeep Cherokee', '2024 Jeep Cherokee',
  '2020 Jeep Compass', '2021 Jeep Compass', '2022 Jeep Compass', '2023 Jeep Compass', '2024 Jeep Compass',
  '2020 Jeep Gladiator', '2021 Jeep Gladiator', '2022 Jeep Gladiator', '2023 Jeep Gladiator', '2024 Jeep Gladiator',
  '2020 Dodge Durango', '2021 Dodge Durango', '2022 Dodge Durango', '2023 Dodge Durango', '2024 Dodge Durango',
  '2020 Dodge Ram 1500', '2021 Dodge Ram 1500', '2022 Dodge Ram 1500', '2023 Dodge Ram 1500', '2024 Dodge Ram 1500',
  '2020 Dodge Charger', '2021 Dodge Charger', '2022 Dodge Charger', '2023 Dodge Charger', '2024 Dodge Charger',
  '2020 BMW X3', '2021 BMW X3', '2022 BMW X3', '2023 BMW X3', '2024 BMW X3',
  '2020 BMW X5', '2021 BMW X5', '2022 BMW X5', '2023 BMW X5', '2024 BMW X5',
  '2020 BMW X7', '2021 BMW X7', '2022 BMW X7', '2023 BMW X7', '2024 BMW X7',
  '2020 BMW 5 Series', '2021 BMW 5 Series', '2022 BMW 5 Series', '2023 BMW 5 Series', '2024 BMW 5 Series',
  '2020 BMW 7 Series', '2021 BMW 7 Series', '2022 BMW 7 Series', '2023 BMW 7 Series', '2024 BMW 7 Series',
  '2020 Mercedes GLC', '2021 Mercedes GLC', '2022 Mercedes GLC', '2023 Mercedes GLC', '2024 Mercedes GLC',
  '2020 Mercedes GLE', '2021 Mercedes GLE', '2022 Mercedes GLE', '2023 Mercedes GLE', '2024 Mercedes GLE',
  '2020 Mercedes GLS', '2021 Mercedes GLS', '2022 Mercedes GLS', '2023 Mercedes GLS', '2024 Mercedes GLS',
  '2020 Mercedes E-Class', '2021 Mercedes E-Class', '2022 Mercedes E-Class', '2023 Mercedes E-Class', '2024 Mercedes E-Class',
  '2020 Mercedes S-Class', '2021 Mercedes S-Class', '2022 Mercedes S-Class', '2023 Mercedes S-Class', '2024 Mercedes S-Class',
  '2020 Audi Q5', '2021 Audi Q5', '2022 Audi Q5', '2023 Audi Q5', '2024 Audi Q5',
  '2020 Audi Q7', '2021 Audi Q7', '2022 Audi Q7', '2023 Audi Q7', '2024 Audi Q7',
  '2020 Audi Q8', '2021 Audi Q8', '2022 Audi Q8', '2023 Audi Q8', '2024 Audi Q8',
  '2020 Audi A6', '2021 Audi A6', '2022 Audi A6', '2023 Audi A6', '2024 Audi A6',
  '2020 Audi A8', '2021 Audi A8', '2022 Audi A8', '2023 Audi A8', '2024 Audi A8',
  '2020 Lexus RX', '2021 Lexus RX', '2022 Lexus RX', '2023 Lexus RX', '2024 Lexus RX',
  '2020 Lexus GX', '2021 Lexus GX', '2022 Lexus GX', '2023 Lexus GX', '2024 Lexus GX',
  '2020 Lexus LX', '2021 Lexus LX', '2022 Lexus LX', '2023 Lexus LX', '2024 Lexus LX',
  '2020 Lexus ES', '2021 Lexus ES', '2022 Lexus ES', '2023 Lexus ES', '2024 Lexus ES',
  '2020 Lexus LS', '2021 Lexus LS', '2022 Lexus LS', '2023 Lexus LS', '2024 Lexus LS',
  '2020 Tesla Model S', '2021 Tesla Model S', '2022 Tesla Model S', '2023 Tesla Model S', '2024 Tesla Model S',
  '2020 Tesla Model X', '2021 Tesla Model X', '2022 Tesla Model X', '2023 Tesla Model X', '2024 Tesla Model X',
  '2020 Tesla Model Y', '2021 Tesla Model Y', '2022 Tesla Model Y', '2023 Tesla Model Y', '2024 Tesla Model Y',
  '2020 Hyundai Tucson', '2021 Hyundai Tucson', '2022 Hyundai Tucson', '2023 Hyundai Tucson', '2024 Hyundai Tucson',
  '2020 Hyundai Santa Fe', '2021 Hyundai Santa Fe', '2022 Hyundai Santa Fe', '2023 Hyundai Santa Fe', '2024 Hyundai Santa Fe',
  '2020 Hyundai Palisade', '2021 Hyundai Palisade', '2022 Hyundai Palisade', '2023 Hyundai Palisade', '2024 Hyundai Palisade',
  '2020 Kia Sportage', '2021 Kia Sportage', '2022 Kia Sportage', '2023 Kia Sportage', '2024 Kia Sportage',
  '2020 Kia Sorento', '2021 Kia Sorento', '2022 Kia Sorento', '2023 Kia Sorento', '2024 Kia Sorento',
  '2020 Kia Telluride', '2021 Kia Telluride', '2022 Kia Telluride', '2023 Kia Telluride', '2024 Kia Telluride',
  '2020 Mazda CX-5', '2021 Mazda CX-5', '2022 Mazda CX-5', '2023 Mazda CX-5', '2024 Mazda CX-5',
  '2020 Mazda CX-9', '2021 Mazda CX-9', '2022 Mazda CX-9', '2023 Mazda CX-9', '2024 Mazda CX-9',
  '2020 Mazda CX-50', '2021 Mazda CX-50', '2022 Mazda CX-50', '2023 Mazda CX-50', '2024 Mazda CX-50',
  '2020 Volkswagen Tiguan', '2021 Volkswagen Tiguan', '2022 Volkswagen Tiguan', '2023 Volkswagen Tiguan', '2024 Volkswagen Tiguan',
  '2020 Volkswagen Atlas', '2021 Volkswagen Atlas', '2022 Volkswagen Atlas', '2023 Volkswagen Atlas', '2024 Volkswagen Atlas',
  '2020 Volkswagen Jetta', '2021 Volkswagen Jetta', '2022 Volkswagen Jetta', '2023 Volkswagen Jetta', '2024 Volkswagen Jetta',
  '2020 Volvo XC60', '2021 Volvo XC60', '2022 Volvo XC60', '2023 Volvo XC60', '2024 Volvo XC60',
  '2020 Volvo XC90', '2021 Volvo XC90', '2022 Volvo XC90', '2023 Volvo XC90', '2024 Volvo XC90',
  '2020 Cadillac Escalade', '2021 Cadillac Escalade', '2022 Cadillac Escalade', '2023 Cadillac Escalade', '2024 Cadillac Escalade',
  '2020 Cadillac XT5', '2021 Cadillac XT5', '2022 Cadillac XT5', '2023 Cadillac XT5', '2024 Cadillac XT5',
  '2020 Cadillac XT6', '2021 Cadillac XT6', '2022 Cadillac XT6', '2023 Cadillac XT6', '2024 Cadillac XT6',
  '2020 Infiniti QX60', '2021 Infiniti QX60', '2022 Infiniti QX60', '2023 Infiniti QX60', '2024 Infiniti QX60',
  '2020 Infiniti QX80', '2021 Infiniti QX80', '2022 Infiniti QX80', '2023 Infiniti QX80', '2024 Infiniti QX80',
  '2020 Acura RDX', '2021 Acura RDX', '2022 Acura RDX', '2023 Acura RDX', '2024 Acura RDX',
  '2020 Acura MDX', '2021 Acura MDX', '2022 Acura MDX', '2023 Acura MDX', '2024 Acura MDX',
  '2020 Genesis GV70', '2021 Genesis GV70', '2022 Genesis GV70', '2023 Genesis GV70', '2024 Genesis GV70',
  '2020 Genesis GV80', '2021 Genesis GV80', '2022 Genesis GV80', '2023 Genesis GV80', '2024 Genesis GV80',
];

// Sample data - in production, this would come from an API
// Note: verticalCards and newsItems will be created inside component to use navigate

// Convert carDatabase to VehicleItem format
const allVehicleItems: VehicleItem[] = carDatabase.map(name => ({ name }));

interface Vehicle {
  id: string;
  name: string;
  year: string;
  make: string;
  model: string;
  image: string;
  createdDate?: Date;
  staffRating: number;
  communityRating: number;
  rank?: number;
}

export const Home: React.FC = () => {
  const navigate = useNavigate();
  const { getUserRating } = useRating();
  // Get user type from onboarding data - make it reactive
  const [userType, setUserType] = useState<string | null>(null);
  
  // Carousel state
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isSliderHovered, setIsSliderHovered] = useState(false);
  const slideIntervalRef = useRef<number | null>(null);
  
  // Sedan carousel state
  const [currentSlideSedan, setCurrentSlideSedan] = useState(0);
  const [isSliderHoveredSedan, setIsSliderHoveredSedan] = useState(false);
  const slideIntervalRefSedan = useRef<number | null>(null);
  
  // Truck carousel state
  const [currentSlideTruck, setCurrentSlideTruck] = useState(0);
  const [isSliderHoveredTruck, setIsSliderHoveredTruck] = useState(false);
  const slideIntervalRefTruck = useRef<number | null>(null);
  
  // Fullscreen state
  const [fullscreenVehicle, setFullscreenVehicle] = useState<Vehicle | null>(null);
  const [fullscreenCarouselType, setFullscreenCarouselType] = useState<'suv' | 'sedan' | 'truck' | null>(null);
  const [fullscreenIndex, setFullscreenIndex] = useState(0);

  useEffect(() => {
    const readUserType = () => {
      try {
        const onboardingData = localStorage.getItem('onboardingData');
        if (onboardingData) {
          const parsed = JSON.parse(onboardingData);
          const type = parsed.userType || null;
          setUserType(type);
        } else {
          setUserType(null);
        }
      } catch (error) {
        console.error('Error reading onboarding data:', error);
        setUserType(null);
      }
    };

    // Read on mount
    readUserType();

    // Listen for storage changes (in case onboarding completes in another tab)
    window.addEventListener('storage', readUserType);
    
    // Also listen for custom event if onboarding data is updated in same tab
    const handleOnboardingUpdate = () => {
      readUserType();
    };
    window.addEventListener('onboardingDataUpdated', handleOnboardingUpdate);

    return () => {
      window.removeEventListener('storage', readUserType);
      window.removeEventListener('onboardingDataUpdated', handleOnboardingUpdate);
    };
  }, []);

  // Vertical cards with navigation
  const verticalCards = useMemo(() => [
    {
      imageUrl: 'https://d2kde5ohu8qb21.cloudfront.net/files/677ef7efb1d4b8000850e710/010-2024-kia-ev9-land.jpg',
      title: "I Lived with a Kia EV9 for a Year. There's Only One Thing I Would Change.",
      type: 'Article' as const,
      categories: ['Family & Practical'] as ContentCategory[],
      onClick: () => {
        navigate('/articles/2024-kia-ev9-yearlong-review-verdict');
      },
    },
    {
      imageUrl: 'https://d2kde5ohu8qb21.cloudfront.net/files/65f806260315ac000873e1d6/2026-rivian-r2-ev-suv-13.jpg',
      title: 'Rivian Reveals New Details on the 2026 R2 Midsize SUV Ahead of Production',
      type: 'Article' as const,
      categories: ['Family & Practical'] as ContentCategory[],
      onClick: () => {
        navigate('/articles/new-details-2026-rivian-r2-ev-suv-battery-charging');
      },
    },
    {
      imageUrl: 'https://d2kde5ohu8qb21.cloudfront.net/files/68389425ec9fbe00084291e8/005-2025-acura-adx-first-test.jpg',
      title: "Luxury on Training Wheels? Our Yearlong Test of the 2025 Acura ADX Begins",
      type: 'Article' as const,
      categories: ['Family & Practical', 'Luxury & Comfort'] as ContentCategory[],
      onClick: () => {
        navigate('/articles/2025-acura-adx-awd-yearlong-review-arrival');
      },
    },
  ], [navigate]);

  // News items with navigation
  const newsItems = useMemo(() => [
    {
      imageUrl: 'https://d2kde5ohu8qb21.cloudfront.net/files/67524b260884870008fa1a2e/1-2025-subaru-wrx-ts-front-view.jpg',
      title: '2025 Subaru WRX tS First Test: Points for STI-le, But…',
      author: 'Alexander Stoklosa',
      date: 'Jan 21, 2025',
      category: 'MotorTrend | Reviews',
      categories: ['Performance & Enthusiast'] as ContentCategory[],
      onClick: () => {
        navigate('/articles/2025-subaru-wrx-ts-first-test-review');
      },
    },
    {
      imageUrl: 'https://d2kde5ohu8qb21.cloudfront.net/files/68b9ebd54273cc000294e6cb/2026fordf-150lightningstxevelectricvehiclepickuptruck-11.jpg',
      title: 'Report: Ford Might Kill the F-150 Lightning Electric Pickup Truck',
      author: 'Justin Banner',
      date: 'Nov 06, 2025',
      category: 'MotorTrend | News',
      categories: ['Utility & Work', 'Eco & Future-Ready'] as ContentCategory[],
      onClick: () => {
        navigate('/articles/report-ford-f150-lightning-electric-truck-maybe-discontinued');
      },
    },
    {
      imageUrl: 'https://d2kde5ohu8qb21.cloudfront.net/files/690ba4a7cfe755000270cb92/5-longbow-speedster-electric-sports-car.jpg',
      title: 'This 1,973-Pound Electric Sports Car Nails What Tesla Still Can\'t',
      author: 'Angus MacKenzie',
      date: 'Nov 06, 2025',
      category: 'MotorTrend | First-Look',
      categories: ['Performance & Enthusiast'] as ContentCategory[],
      onClick: () => {
        navigate('/articles/longbow-speedster-electric-sports-car');
      },
    },
    {
      imageUrl: 'https://d2kde5ohu8qb21.cloudfront.net/files/684317270ba4360008f118a0/2026cadillacoptiq-v9.jpg',
      title: 'We Drove the New 519-HP Cadillac Optiq-V to See If It\'s a *Real* V',
      author: 'Eric Tingwall',
      date: 'Nov 06, 2025',
      category: 'MotorTrend | Reviews',
      categories: ['Performance & Enthusiast'] as ContentCategory[],
      onClick: () => {
        navigate('/articles/2026-cadillac-optiq-v-first-drive');
      },
    },
    {
      imageUrl: 'https://d2kde5ohu8qb21.cloudfront.net/files/65bbec15236e4600085bb3e8/2019-acura-nsx-07.jpg',
      title: 'Yes! Honda\'s Electric Sports Car Is Real, but Timing Remains Uncertain',
      author: 'Alisa Priddle',
      date: 'Nov 06, 2025',
      category: 'MotorTrend | News',
      categories: ['Performance & Enthusiast'] as ContentCategory[],
      onClick: () => {
        navigate('/articles/honda-electric-sports-car-timing-uncertain');
      },
    },
    {
      imageUrl: 'https://d2kde5ohu8qb21.cloudfront.net/files/690b0330f4ad5b00020ded90/2026-bmw-m2-cs-side-motion.jpg',
      title: '2026 BMW M2 CS Track Drive: The Ultimate M2 Gets Even Better',
      author: 'Frank Markus',
      date: 'Nov 05, 2025',
      category: 'MotorTrend | Reviews',
      categories: ['Performance & Enthusiast'] as ContentCategory[],
      onClick: () => {
        navigate('/articles/2026-bmw-m2-cs-track-drive-review');
      },
    },
    {
      imageUrl: 'https://d2kde5ohu8qb21.cloudfront.net/files/690bfd60f33e300002f8eeeb/024-2025-tesla-model-y-awd.jpg',
      title: 'The Tesla Model Y Premium RWD Is a Better Computer Than It Is a Car',
      author: 'Billy Rehbock',
      date: 'Nov 05, 2025',
      category: 'MotorTrend | Reviews',
      categories: ['Family & Practical', 'Eco & Future-Ready'] as ContentCategory[],
      onClick: () => {
        navigate('/articles/2025-tesla-model-y-first-test-review');
      },
    },
    {
      imageUrl: 'https://d2kde5ohu8qb21.cloudfront.net/files/690a603369a9550002fb94bc/021-2026-honda-passport-rtl.jpg',
      title: 'The Honda Passport RTL Is the One You Need, Not the One You Want',
      author: 'Alex Leanse',
      date: 'Nov 04, 2025',
      category: 'MotorTrend | Reviews',
      categories: ['Family & Practical'] as ContentCategory[],
      onClick: () => {
        navigate('/articles/2026-honda-passport-rtl-first-test-review');
      },
    },
  ] as (RiverItem & { categories?: ContentCategory[] })[], [navigate]);

  // Sort content based on user type
  const sortedVerticalCards = useMemo(() => {
    return sortContentByUserType(verticalCards, userType);
  }, [userType, verticalCards]);

  const sortedNewsItems = useMemo(() => {
    return sortContentByUserType(newsItems, userType);
  }, [userType, newsItems]);

  // Rankings & Awards articles for first river
  const rankingsArticles = useMemo(() => {
    const rankingSlugs = [
      'top-10-daily-commute',
      'top-10-family-practical',
      'top-10-adventure-off-road',
      'top-10-urban-style',
      'top-10-performance-enthusiast',
      'top-10-eco-future-ready',
      'top-10-luxury-comfort',
      'top-10-utility-work'
    ];

    return rankingSlugs
      .map(slug => {
        const article = getArticleBySlug(slug);
        if (!article) return null;
        
        return {
          imageUrl: article.heroImage,
          title: article.title,
          author: article.author,
          date: article.date,
          category: 'MotorTrend | Rankings',
          onClick: () => {
            navigate(`/article/${slug}`);
          },
        } as RiverItem;
      })
      .filter((item): item is RiverItem => item !== null);
  }, [navigate]);


  // Filter vehicles based on user type using vehicle lifestyles
  const filteredVehicleItems = useMemo(() => {
    let result: VehicleItem[] = [];

    // If no userType, return all vehicles sorted by latest
    if (!userType) {
      // Get latest year vehicles first
      result = [...allVehicleItems].sort((a, b) => {
        const yearA = parseInt(a.name.match(/\d{4}/)?.[0] || '0');
        const yearB = parseInt(b.name.match(/\d{4}/)?.[0] || '0');
        return yearB - yearA; // Latest first
      });
    } else {
      const filterCategories: LifestyleCategory[] = userType === 'buyer' 
        ? ['Family & Practical', 'Daily Commute', 'Utility & Work', 'Adventure & Off-Road']
        : userType === 'enthusiast'
        ? ['Performance & Enthusiast', 'Adventure & Off-Road']
        : userType === 'both'
        ? ['Family & Practical', 'Performance & Enthusiast', 'Utility & Work', 'Adventure & Off-Road']
        : [];

      if (filterCategories.length === 0) {
        // Get latest year vehicles first
        result = [...allVehicleItems].sort((a, b) => {
          const yearA = parseInt(a.name.match(/\d{4}/)?.[0] || '0');
          const yearB = parseInt(b.name.match(/\d{4}/)?.[0] || '0');
          return yearB - yearA; // Latest first
        });
      } else {
        // Filter vehicles to only show those matching the lifestyle categories
        const filtered = allVehicleItems.filter(vehicle => {
          const vehicleLifestyles = getVehicleLifestyles(vehicle.name);
          return filterCategories.some(cat => vehicleLifestyles.includes(cat));
        });

        // Sort by year (latest first)
        result = filtered.sort((a, b) => {
          const yearA = parseInt(a.name.match(/\d{4}/)?.[0] || '0');
          const yearB = parseInt(b.name.match(/\d{4}/)?.[0] || '0');
          return yearB - yearA; // Latest first
        });
      }
    }

    // Remove duplicates based on vehicle name (case-insensitive)
    const seen = new Set<string>();
    const unique = result.filter(vehicle => {
      const normalizedName = vehicle.name.trim().toLowerCase();
      if (seen.has(normalizedName)) {
        return false;
      }
      seen.add(normalizedName);
      return true;
    });

    return unique;
  }, [userType]);


  // Prepare vehicles for carousel (10 best SUVs)
  const carouselVehicles: Vehicle[] = useMemo(() => {
    // Filter for SUVs only
    const suvVehicles = allVehicleItems.filter(vehicle => {
      const bodyStyles = getVehicleBodyStyle(vehicle.name);
      return bodyStyles.includes('SUV');
    });

    // Map to Vehicle objects with ratings
    const suvsWithRatings = suvVehicles.map((vehicleItem, index) => {
      const parsed = parseVehicleName(vehicleItem.name);
      const year = decodeURIComponent(parsed.year);
      const make = decodeURIComponent(parsed.make);
      const model = decodeURIComponent(parsed.model);
      
      const currentYear = new Date().getFullYear();
      const vehicleYear = parseInt(year) || currentYear;
      const makeModelHash = (make + model).split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
      const publicationYear = Math.max(vehicleYear - 1, 2019);
      const month = (makeModelHash % 12) + 1;
      const day = (makeModelHash % 28) + 1;
      const hour = (makeModelHash % 24);
      const minute = (makeModelHash % 60);
      const createdDate = new Date(publicationYear, month - 1, day, hour, minute);
      
      const staffRating = generateStaffRating(vehicleItem.name);
      const communityRating = generateCommunityRating(vehicleItem.name);
      const combinedRating = (staffRating + communityRating) / 2;
      
      return {
        id: `vehicle-${index}`,
        name: vehicleItem.name,
        year,
        make,
        model,
        image: vehicleImageFor(vehicleItem.name),
        createdDate,
        staffRating,
        communityRating,
        combinedRating,
        vehicleYear
      };
    });

    // Remove duplicates by make/model (keep latest year)
    const uniqueSuvs = new Map<string, typeof suvsWithRatings[0]>();
    suvsWithRatings.forEach(suv => {
      const key = `${suv.make}-${suv.model}`.toLowerCase();
      const existing = uniqueSuvs.get(key);
      if (!existing || suv.vehicleYear > existing.vehicleYear) {
        uniqueSuvs.set(key, suv);
      }
    });

    // Sort by combined rating (best first), then by year (latest first)
    const sortedSuvs = Array.from(uniqueSuvs.values()).sort((a, b) => {
      // First sort by combined rating (descending)
      if (Math.abs(a.combinedRating - b.combinedRating) > 0.1) {
        return b.combinedRating - a.combinedRating;
      }
      // Then by year (descending)
      return b.vehicleYear - a.vehicleYear;
    });

    // Take top 10 best SUVs
    return sortedSuvs.slice(0, 10).map((suv, index) => ({
      id: `suv-${index}`,
      name: suv.name,
      year: suv.year,
      make: suv.make,
      model: suv.model,
      image: suv.image,
      createdDate: suv.createdDate,
      staffRating: suv.staffRating,
      communityRating: suv.communityRating,
      rank: index + 1 // Add ranking number (1-10)
    }));
  }, []);

  // Prepare vehicles for sedan carousel (10 best sedans)
  const sedanCarouselVehicles: Vehicle[] = useMemo(() => {
    // Filter for sedans only
    const sedanVehicles = allVehicleItems.filter(vehicle => {
      const bodyStyles = getVehicleBodyStyle(vehicle.name);
      return bodyStyles.includes('Sedan');
    });

    // Map to Vehicle objects with ratings
    const sedansWithRatings = sedanVehicles.map((vehicleItem, index) => {
      const parsed = parseVehicleName(vehicleItem.name);
      const year = decodeURIComponent(parsed.year);
      const make = decodeURIComponent(parsed.make);
      const model = decodeURIComponent(parsed.model);
      
      const currentYear = new Date().getFullYear();
      const vehicleYear = parseInt(year) || currentYear;
      const makeModelHash = (make + model).split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
      const publicationYear = Math.max(vehicleYear - 1, 2019);
      const month = (makeModelHash % 12) + 1;
      const day = (makeModelHash % 28) + 1;
      const hour = (makeModelHash % 24);
      const minute = (makeModelHash % 60);
      const createdDate = new Date(publicationYear, month - 1, day, hour, minute);
      
      const staffRating = generateStaffRating(vehicleItem.name);
      const communityRating = generateCommunityRating(vehicleItem.name);
      const combinedRating = (staffRating + communityRating) / 2;
      
      return {
        id: `vehicle-${index}`,
        name: vehicleItem.name,
        year,
        make,
        model,
        image: vehicleImageFor(vehicleItem.name),
        createdDate,
        staffRating,
        communityRating,
        combinedRating,
        vehicleYear
      };
    });

    // Remove duplicates by make/model (keep latest year)
    const uniqueSedans = new Map<string, typeof sedansWithRatings[0]>();
    sedansWithRatings.forEach(sedan => {
      const key = `${sedan.make}-${sedan.model}`.toLowerCase();
      const existing = uniqueSedans.get(key);
      if (!existing || sedan.vehicleYear > existing.vehicleYear) {
        uniqueSedans.set(key, sedan);
      }
    });

    // Sort by combined rating (best first), then by year (latest first)
    const sortedSedans = Array.from(uniqueSedans.values()).sort((a, b) => {
      // First sort by combined rating (descending)
      if (Math.abs(a.combinedRating - b.combinedRating) > 0.1) {
        return b.combinedRating - a.combinedRating;
      }
      // Then by year (descending)
      return b.vehicleYear - a.vehicleYear;
    });

    // Take top 10 best sedans
    return sortedSedans.slice(0, 10).map((sedan, index) => ({
      id: `sedan-${index}`,
      name: sedan.name,
      year: sedan.year,
      make: sedan.make,
      model: sedan.model,
      image: sedan.image,
      createdDate: sedan.createdDate,
      staffRating: sedan.staffRating,
      communityRating: sedan.communityRating,
      rank: index + 1 // Add ranking number (1-10)
    }));
  }, []);

  // Auto-advance SUV carousel
  useEffect(() => {
    if (carouselVehicles.length <= 1) return;
    
    if (!isSliderHovered) {
      slideIntervalRef.current = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % carouselVehicles.length);
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
  }, [isSliderHovered, carouselVehicles.length]);

  // Keyboard navigation for SUV carousel
  useEffect(() => {
    if (carouselVehicles.length <= 1) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      // Only handle keyboard navigation when carousel is hovered
      if (!isSliderHovered) return;

      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        setCurrentSlide((prev) => (prev - 1 + carouselVehicles.length) % carouselVehicles.length);
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        setCurrentSlide((prev) => (prev + 1) % carouselVehicles.length);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isSliderHovered, carouselVehicles.length]);

  // Prepare vehicles for truck carousel (10 best trucks)
  const truckCarouselVehicles: Vehicle[] = useMemo(() => {
    // Filter for trucks only
    const truckVehicles = allVehicleItems.filter(vehicle => {
      const bodyStyles = getVehicleBodyStyle(vehicle.name);
      return bodyStyles.includes('Truck');
    });

    // Map to Vehicle objects with ratings
    const trucksWithRatings = truckVehicles.map((vehicleItem, index) => {
      const parsed = parseVehicleName(vehicleItem.name);
      const year = decodeURIComponent(parsed.year);
      const make = decodeURIComponent(parsed.make);
      const model = decodeURIComponent(parsed.model);
      
      const currentYear = new Date().getFullYear();
      const vehicleYear = parseInt(year) || currentYear;
      const makeModelHash = (make + model).split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
      const publicationYear = Math.max(vehicleYear - 1, 2019);
      const month = (makeModelHash % 12) + 1;
      const day = (makeModelHash % 28) + 1;
      const hour = (makeModelHash % 24);
      const minute = (makeModelHash % 60);
      const createdDate = new Date(publicationYear, month - 1, day, hour, minute);
      
      const staffRating = generateStaffRating(vehicleItem.name);
      const communityRating = generateCommunityRating(vehicleItem.name);
      const combinedRating = (staffRating + communityRating) / 2;
      
      return {
        id: `vehicle-${index}`,
        name: vehicleItem.name,
        year,
        make,
        model,
        image: vehicleImageFor(vehicleItem.name),
        createdDate,
        staffRating,
        communityRating,
        combinedRating,
        vehicleYear
      };
    });

    // Remove duplicates by make/model (keep latest year)
    const uniqueTrucks = new Map<string, typeof trucksWithRatings[0]>();
    trucksWithRatings.forEach(truck => {
      const key = `${truck.make}-${truck.model}`.toLowerCase();
      const existing = uniqueTrucks.get(key);
      if (!existing || truck.vehicleYear > existing.vehicleYear) {
        uniqueTrucks.set(key, truck);
      }
    });

    // Sort by combined rating (best first), then by year (latest first)
    const sortedTrucks = Array.from(uniqueTrucks.values()).sort((a, b) => {
      // First sort by combined rating (descending)
      if (Math.abs(a.combinedRating - b.combinedRating) > 0.1) {
        return b.combinedRating - a.combinedRating;
      }
      // Then by year (descending)
      return b.vehicleYear - a.vehicleYear;
    });

    // Take top 10 best trucks
    return sortedTrucks.slice(0, 10).map((truck, index) => ({
      id: `truck-${index}`,
      name: truck.name,
      year: truck.year,
      make: truck.make,
      model: truck.model,
      image: truck.image,
      createdDate: truck.createdDate,
      staffRating: truck.staffRating,
      communityRating: truck.communityRating,
      rank: index + 1 // Add ranking number (1-10)
    }));
  }, []);

  // Auto-advance sedan carousel
  useEffect(() => {
    if (sedanCarouselVehicles.length <= 1) return;
    
    if (!isSliderHoveredSedan) {
      slideIntervalRefSedan.current = setInterval(() => {
        setCurrentSlideSedan((prev) => (prev + 1) % sedanCarouselVehicles.length);
      }, 5000);
    } else {
      if (slideIntervalRefSedan.current) {
        clearInterval(slideIntervalRefSedan.current);
      }
    }
    
    return () => {
      if (slideIntervalRefSedan.current) {
        clearInterval(slideIntervalRefSedan.current);
      }
    };
  }, [isSliderHoveredSedan, sedanCarouselVehicles.length]);

  // Keyboard navigation for sedan carousel
  useEffect(() => {
    if (sedanCarouselVehicles.length <= 1) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      // Only handle keyboard navigation when carousel is hovered
      if (!isSliderHoveredSedan) return;

      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        setCurrentSlideSedan((prev) => (prev - 1 + sedanCarouselVehicles.length) % sedanCarouselVehicles.length);
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        setCurrentSlideSedan((prev) => (prev + 1) % sedanCarouselVehicles.length);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isSliderHoveredSedan, sedanCarouselVehicles.length]);

  // Auto-advance truck carousel
  useEffect(() => {
    if (truckCarouselVehicles.length <= 1) return;
    
    if (!isSliderHoveredTruck) {
      slideIntervalRefTruck.current = setInterval(() => {
        setCurrentSlideTruck((prev) => (prev + 1) % truckCarouselVehicles.length);
      }, 5000);
    } else {
      if (slideIntervalRefTruck.current) {
        clearInterval(slideIntervalRefTruck.current);
      }
    }
    
    return () => {
      if (slideIntervalRefTruck.current) {
        clearInterval(slideIntervalRefTruck.current);
      }
    };
  }, [isSliderHoveredTruck, truckCarouselVehicles.length]);

  // Keyboard navigation for truck carousel
  useEffect(() => {
    if (truckCarouselVehicles.length <= 1) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      // Only handle keyboard navigation when carousel is hovered
      if (!isSliderHoveredTruck) return;

      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        setCurrentSlideTruck((prev) => (prev - 1 + truckCarouselVehicles.length) % truckCarouselVehicles.length);
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        setCurrentSlideTruck((prev) => (prev + 1) % truckCarouselVehicles.length);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isSliderHoveredTruck, truckCarouselVehicles.length]);

  const handleVehicleClick = (vehicle: Vehicle) => {
    const { year, make, model } = parseVehicleName(vehicle.name);
    navigate(`/vehicles/${year}/${make}/${model}`);
  };

  const handleExpandClick = (e: React.MouseEvent, vehicle: Vehicle, carouselType: 'suv' | 'sedan' | 'truck') => {
    e.stopPropagation();
    
    // Find the index of the vehicle in the appropriate carousel
    let index = 0;
    
    if (carouselType === 'suv') {
      index = carouselVehicles.findIndex(v => v.id === vehicle.id);
    } else if (carouselType === 'sedan') {
      index = sedanCarouselVehicles.findIndex(v => v.id === vehicle.id);
    } else if (carouselType === 'truck') {
      index = truckCarouselVehicles.findIndex(v => v.id === vehicle.id);
    }
    
    setFullscreenVehicle(vehicle);
    setFullscreenCarouselType(carouselType);
    setFullscreenIndex(index >= 0 ? index : 0);
    document.body.style.overflow = 'hidden';
  };
  
  // Get current carousel vehicles list
  const getFullscreenVehicleList = (): Vehicle[] => {
    if (fullscreenCarouselType === 'suv') return carouselVehicles;
    if (fullscreenCarouselType === 'sedan') return sedanCarouselVehicles;
    if (fullscreenCarouselType === 'truck') return truckCarouselVehicles;
    return [];
  };
  
  // Navigate to next vehicle in fullscreen
  const handleFullscreenNext = () => {
    const vehicleList = getFullscreenVehicleList();
    if (vehicleList.length === 0) return;
    const nextIndex = (fullscreenIndex + 1) % vehicleList.length;
    setFullscreenIndex(nextIndex);
    setFullscreenVehicle(vehicleList[nextIndex]);
  };
  
  // Navigate to previous vehicle in fullscreen
  const handleFullscreenPrev = () => {
    const vehicleList = getFullscreenVehicleList();
    if (vehicleList.length === 0) return;
    const prevIndex = (fullscreenIndex - 1 + vehicleList.length) % vehicleList.length;
    setFullscreenIndex(prevIndex);
    setFullscreenVehicle(vehicleList[prevIndex]);
  };
  
  // Navigate to specific vehicle in fullscreen
  const handleFullscreenGoTo = (index: number) => {
    const vehicleList = getFullscreenVehicleList();
    if (vehicleList.length === 0 || index < 0 || index >= vehicleList.length) return;
    setFullscreenIndex(index);
    setFullscreenVehicle(vehicleList[index]);
  };

  // Switch to different carousel type in fullscreen
  const handleSwitchToCarousel = (carouselType: 'suv' | 'sedan' | 'truck') => {
    let vehicleList: Vehicle[] = [];
    
    if (carouselType === 'suv') {
      vehicleList = carouselVehicles;
    } else if (carouselType === 'sedan') {
      vehicleList = sedanCarouselVehicles;
    } else if (carouselType === 'truck') {
      vehicleList = truckCarouselVehicles;
    }
    
    if (vehicleList.length > 0) {
      setFullscreenCarouselType(carouselType);
      setFullscreenIndex(0);
      setFullscreenVehicle(vehicleList[0]);
    }
  };

  const handleCollapseClick = () => {
    setFullscreenVehicle(null);
    setFullscreenCarouselType(null);
    setFullscreenIndex(0);
    document.body.style.overflow = '';
  };

  // Handle keyboard navigation in fullscreen
  useEffect(() => {
    if (!fullscreenVehicle) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleCollapseClick();
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        handleFullscreenPrev();
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        handleFullscreenNext();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fullscreenVehicle, fullscreenIndex]);

  // Hero data with navigation
  const heroData = useMemo(() => ({
    imageUrl: 'https://d2kde5ohu8qb21.cloudfront.net/files/686ecc3b8b30d500028d902a/2026-hyundai-ioniq-6-n-side-motion.jpg',
    title: '2026 Hyundai Ioniq 6 N First Drive: Watch Out, BMW M3, C63 AMG!',
    categories: ['Performance & Enthusiast'] as ContentCategory[],
    onClick: () => {
      navigate('/articles/2026-hyundai-ioniq-6-n-first-drive-review');
    },
  }), [navigate]);

  return (
    <div className="home">
      <div className="home__container">
        {/* Top Section: Hero + 3 Cards with Right Column Ad */}
        <div className="home__section">
          <div className="home__left-column">
            <HeroPlusThree
              hero={heroData}
              cards={sortedVerticalCards}
            />
          </div>
          <div className="home__right-column">
            <AdContainer
              width={300}
              height={250}
              label="300 x 250"
              position="right-column"
              imageUrl="https://d2kde5ohu8qb21.cloudfront.net/files/69116380f5e41e00020d3432/822789964589118228.jpeg"
            />
          </div>
        </div>

        {/* Latest From MotorTrend Section - Right after Hero */}
        <div className="home__section">
          <div className="home__left-column">
            <NewsSection
              title="The Latest From MotorTrend"
              items={sortedNewsItems}
            />
          </div>
          <div className="home__right-column">
            <AdContainer
              width={300}
              height={600}
              label="SVOD 200 x 420"
              position="right-column"
              imageUrl="https://d2kde5ohu8qb21.cloudfront.net/files/691163e3e8557700022eb5d9/4347518532106070908.png"
            />
          </div>
        </div>

        {/* Vehicles Section with Right Column Ad */}
        <div className="home__section">
          <div className="home__left-column">
            <VehiclesSection
              title="Vehicles"
              vehicles={filteredVehicleItems}
              key={`vehicles-${userType || 'none'}`}
            />
          </div>
          <div className="home__right-column">
            <AdContainer
              width={300}
              height={600}
              label="SVOD 200 x 420"
              position="right-column"
              imageUrl="https://d2kde5ohu8qb21.cloudfront.net/files/69116444ba9124000252c544/8119904599187119191.png"
            />
          </div>
        </div>

        {/* News Section with Right Column Ad - Rankings & Awards */}
        <div className="home__section">
          <div className="home__left-column">
            <NewsSection
              title="Rankings & Awards"
              items={rankingsArticles}
            />
          </div>
          <div className="home__right-column">
            <AdContainer
              width={300}
              height={600}
              label="SVOD 200 x 420"
              position="right-column"
              imageUrl="https://d2kde5ohu8qb21.cloudfront.net/files/691163e3e8557700022eb5d9/4347518532106070908.png"
            />
          </div>
        </div>

        {/* Vehicle Carousel Section - Full width - Top Ten SUVs */}
        {carouselVehicles.length > 0 && (
          <div className="home__section home__section--full-width">
            <div 
              className="home__carousel"
              onMouseEnter={() => setIsSliderHovered(true)}
              onMouseLeave={() => setIsSliderHovered(false)}
            >
                <div 
                  className="home__carousel-track"
                  style={{ transform: `translateX(-${currentSlide * 100}%)` }}
                >
                  {carouselVehicles.map((vehicle) => (
                    <div 
                      key={vehicle.id} 
                      className="home__carousel-slide"
                      onClick={() => handleVehicleClick(vehicle)}
                    >
                      <div className="home__carousel-image">
                        <img src={vehicle.image} alt={vehicle.name} />
                        
                        {/* Top Ten SUVs Badge with Rank */}
                        <div className="home__carousel-category-badge">
                          <span className="home__carousel-category-text">TOP TEN SUVs / #{vehicle.rank}</span>
                        </div>
                        
                        {/* Expand Button */}
                        <button
                          className="home__carousel-expand-btn"
                          onClick={(e) => handleExpandClick(e, vehicle, 'suv')}
                          aria-label="Expand to fullscreen"
                        >
                          <Icon name="open_in_full" size={24} />
                        </button>
                        
                        {/* Vehicle Name and Ratings Box */}
                        <div className="home__carousel-info-box">
                          <h2 className="home__carousel-name">{vehicle.name}</h2>
                          <div className="home__carousel-ratings-list">
                            <div className="home__carousel-rating-item">
                              <div className="home__carousel-rating-label-wrapper">
                                <span className="home__carousel-rating-label-top">MotorTrend</span>
                                <span className="home__carousel-rating-label-bottom">Rating</span>
                              </div>
                              <div className="home__carousel-rating-value-wrapper">
                                <span className="home__carousel-rating-value">
                                  {vehicle.staffRating % 1 === 0 ? vehicle.staffRating : vehicle.staffRating.toFixed(1)}
                                </span>
                              </div>
                            </div>
                            <div className="home__carousel-rating-item">
                              <div className="home__carousel-rating-label-wrapper">
                                <span className="home__carousel-rating-label-top">Community</span>
                                <span className="home__carousel-rating-label-bottom">
                                  Rating <span className="home__carousel-rating-count">(252)</span>
                                </span>
                              </div>
                              <div className="home__carousel-rating-value-wrapper">
                                <img 
                                  src="https://d2kde5ohu8qb21.cloudfront.net/files/68f66c095d4ae300022a2b0e/starbluesolid.svg" 
                                  alt="Community Rating Star" 
                                  className="home__carousel-rating-icon community" 
                                />
                                <span className="home__carousel-rating-value">
                                  {vehicle.communityRating % 1 === 0 ? vehicle.communityRating : vehicle.communityRating.toFixed(1)}
                                </span>
                              </div>
                            </div>
                            {getUserRating(vehicle.name) > 0 && (
                              <div className="home__carousel-rating-item">
                                <div className="home__carousel-rating-label-wrapper">
                                  <span className="home__carousel-rating-label-top">Your</span>
                                  <span className="home__carousel-rating-label-bottom">Rating</span>
                                </div>
                                <div className="home__carousel-rating-value-wrapper">
                                  <img 
                                    src="https://d2kde5ohu8qb21.cloudfront.net/files/68f66c095d4ae300022a2b0e/starbluesolid.svg" 
                                    alt="Your Rating Star" 
                                    className="home__carousel-rating-icon add-rate" 
                                  />
                                  <span className="home__carousel-rating-value">
                                    {getUserRating(vehicle.name)}
                                  </span>
                                </div>
                              </div>
                            )}
                          </div>
                          <button 
                            className="home__carousel-listing-btn cta cta--primary cta--default"
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
                      className="home__carousel-nav home__carousel-nav--prev"
                      onClick={() => setCurrentSlide((prev) => (prev - 1 + carouselVehicles.length) % carouselVehicles.length)}
                      aria-label="Previous slide"
                    >
                      <Icon name="chevron_left" size={24} />
                    </button>
                    <button
                      className="home__carousel-nav home__carousel-nav--next"
                      onClick={() => setCurrentSlide((prev) => (prev + 1) % carouselVehicles.length)}
                      aria-label="Next slide"
                    >
                      <Icon name="chevron_right" size={24} />
                    </button>
                    
                    {/* Slider Dots */}
                    <div className="home__carousel-dots">
                      {carouselVehicles.map((_, index) => (
                        <button
                          key={index}
                          className={`home__carousel-dot ${index === currentSlide ? 'home__carousel-dot--active' : ''}`}
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

        {/* Additional News Section (River) */}
        <div className="home__section">
          <div className="home__left-column">
            <NewsSection
              title="The Latest From MotorTrend"
              items={sortedNewsItems}
            />
          </div>
          <div className="home__right-column">
            <AdContainer
              width={300}
              height={600}
              label="SVOD 200 x 420"
              position="right-column"
              imageUrl="https://d2kde5ohu8qb21.cloudfront.net/files/6911649d074b1800020014b0/5094655339108271500.jpeg"
            />
          </div>
        </div>

        {/* Sedan Carousel Section - Full width */}
        {sedanCarouselVehicles.length > 0 && (
          <div className="home__section home__section--full-width">
            <div 
              className="home__carousel"
              onMouseEnter={() => setIsSliderHoveredSedan(true)}
              onMouseLeave={() => setIsSliderHoveredSedan(false)}
            >
                <div 
                  className="home__carousel-track"
                  style={{ transform: `translateX(-${currentSlideSedan * 100}%)` }}
                >
                  {sedanCarouselVehicles.map((vehicle) => (
                    <div 
                      key={vehicle.id} 
                      className="home__carousel-slide"
                      onClick={() => handleVehicleClick(vehicle)}
                    >
                      <div className="home__carousel-image">
                        <img src={vehicle.image} alt={vehicle.name} />
                        
                        {/* Top Ten Sedans Badge with Rank */}
                        <div className="home__carousel-category-badge">
                          <span className="home__carousel-category-text">TOP TEN SEDANS / #{vehicle.rank}</span>
                        </div>
                        
                        {/* Expand Button */}
                        <button
                          className="home__carousel-expand-btn"
                          onClick={(e) => handleExpandClick(e, vehicle, 'sedan')}
                          aria-label="Expand to fullscreen"
                        >
                          <Icon name="open_in_full" size={24} />
                        </button>
                        
                        {/* Vehicle Name and Ratings Box */}
                        <div className="home__carousel-info-box">
                          <h2 className="home__carousel-name">{vehicle.name}</h2>
                          <div className="home__carousel-ratings-list">
                            <div className="home__carousel-rating-item">
                              <div className="home__carousel-rating-label-wrapper">
                                <span className="home__carousel-rating-label-top">MotorTrend</span>
                                <span className="home__carousel-rating-label-bottom">Rating</span>
                              </div>
                              <div className="home__carousel-rating-value-wrapper">
                                <span className="home__carousel-rating-value">
                                  {vehicle.staffRating % 1 === 0 ? vehicle.staffRating : vehicle.staffRating.toFixed(1)}
                                </span>
                              </div>
                            </div>
                            <div className="home__carousel-rating-item">
                              <div className="home__carousel-rating-label-wrapper">
                                <span className="home__carousel-rating-label-top">Community</span>
                                <span className="home__carousel-rating-label-bottom">
                                  Rating <span className="home__carousel-rating-count">(252)</span>
                                </span>
                              </div>
                              <div className="home__carousel-rating-value-wrapper">
                                <img 
                                  src="https://d2kde5ohu8qb21.cloudfront.net/files/68f66c095d4ae300022a2b0e/starbluesolid.svg" 
                                  alt="Community Rating Star" 
                                  className="home__carousel-rating-icon community" 
                                />
                                <span className="home__carousel-rating-value">
                                  {vehicle.communityRating % 1 === 0 ? vehicle.communityRating : vehicle.communityRating.toFixed(1)}
                                </span>
                              </div>
                            </div>
                            {getUserRating(vehicle.name) > 0 && (
                              <div className="home__carousel-rating-item">
                                <div className="home__carousel-rating-label-wrapper">
                                  <span className="home__carousel-rating-label-top">Your</span>
                                  <span className="home__carousel-rating-label-bottom">Rating</span>
                                </div>
                                <div className="home__carousel-rating-value-wrapper">
                                  <img 
                                    src="https://d2kde5ohu8qb21.cloudfront.net/files/68f66c095d4ae300022a2b0e/starbluesolid.svg" 
                                    alt="Your Rating Star" 
                                    className="home__carousel-rating-icon add-rate" 
                                  />
                                  <span className="home__carousel-rating-value">
                                    {getUserRating(vehicle.name)}
                                  </span>
                                </div>
                              </div>
                            )}
                          </div>
                          <button 
                            className="home__carousel-listing-btn cta cta--primary cta--default"
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
                {sedanCarouselVehicles.length > 1 && (
                  <>
                    <button
                      className="home__carousel-nav home__carousel-nav--prev"
                      onClick={() => setCurrentSlideSedan((prev) => (prev - 1 + sedanCarouselVehicles.length) % sedanCarouselVehicles.length)}
                      aria-label="Previous slide"
                    >
                      <Icon name="chevron_left" size={24} />
                    </button>
                    <button
                      className="home__carousel-nav home__carousel-nav--next"
                      onClick={() => setCurrentSlideSedan((prev) => (prev + 1) % sedanCarouselVehicles.length)}
                      aria-label="Next slide"
                    >
                      <Icon name="chevron_right" size={24} />
                    </button>
                    
                    {/* Slider Dots */}
                    <div className="home__carousel-dots">
                      {sedanCarouselVehicles.map((_, index) => (
                        <button
                          key={index}
                          className={`home__carousel-dot ${index === currentSlideSedan ? 'home__carousel-dot--active' : ''}`}
                          onClick={() => setCurrentSlideSedan(index)}
                          aria-label={`Go to slide ${index + 1}`}
                        />
                      ))}
                    </div>
                  </>
                )}
            </div>
          </div>
        )}

        {/* Additional News Section (River) */}
        <div className="home__section">
          <div className="home__left-column">
            <NewsSection
              title="The Latest From MotorTrend"
              items={sortedNewsItems}
            />
          </div>
          <div className="home__right-column">
            <AdContainer
              width={300}
              height={600}
              label="SVOD 200 x 420"
              position="right-column"
              imageUrl="https://d2kde5ohu8qb21.cloudfront.net/files/6911649d074b1800020014b0/5094655339108271500.jpeg"
            />
          </div>
        </div>

        {/* Truck Carousel Section - Full width */}
        {truckCarouselVehicles.length > 0 && (
          <div className="home__section home__section--full-width">
            <div 
              className="home__carousel"
              onMouseEnter={() => setIsSliderHoveredTruck(true)}
              onMouseLeave={() => setIsSliderHoveredTruck(false)}
            >
                <div 
                  className="home__carousel-track"
                  style={{ transform: `translateX(-${currentSlideTruck * 100}%)` }}
                >
                  {truckCarouselVehicles.map((vehicle) => (
                    <div 
                      key={vehicle.id} 
                      className="home__carousel-slide"
                      onClick={() => handleVehicleClick(vehicle)}
                    >
                      <div className="home__carousel-image">
                        <img src={vehicle.image} alt={vehicle.name} />
                        
                        {/* Top Ten Pick Up Trucks Badge with Rank */}
                        <div className="home__carousel-category-badge">
                          <span className="home__carousel-category-text">TOP TEN PICK UP TRUCKS / #{vehicle.rank}</span>
                        </div>
                        
                        {/* Expand Button */}
                        <button
                          className="home__carousel-expand-btn"
                          onClick={(e) => handleExpandClick(e, vehicle, 'truck')}
                          aria-label="Expand to fullscreen"
                        >
                          <Icon name="open_in_full" size={24} />
                        </button>
                        
                        {/* Vehicle Name and Ratings Box */}
                        <div className="home__carousel-info-box">
                          <h2 className="home__carousel-name">{vehicle.name}</h2>
                          <div className="home__carousel-ratings-list">
                            <div className="home__carousel-rating-item">
                              <div className="home__carousel-rating-label-wrapper">
                                <span className="home__carousel-rating-label-top">MotorTrend</span>
                                <span className="home__carousel-rating-label-bottom">Rating</span>
                              </div>
                              <div className="home__carousel-rating-value-wrapper">
                                <span className="home__carousel-rating-value">
                                  {vehicle.staffRating % 1 === 0 ? vehicle.staffRating : vehicle.staffRating.toFixed(1)}
                                </span>
                              </div>
                            </div>
                            <div className="home__carousel-rating-item">
                              <div className="home__carousel-rating-label-wrapper">
                                <span className="home__carousel-rating-label-top">Community</span>
                                <span className="home__carousel-rating-label-bottom">
                                  Rating <span className="home__carousel-rating-count">(252)</span>
                                </span>
                              </div>
                              <div className="home__carousel-rating-value-wrapper">
                                <img 
                                  src="https://d2kde5ohu8qb21.cloudfront.net/files/68f66c095d4ae300022a2b0e/starbluesolid.svg" 
                                  alt="Community Rating Star" 
                                  className="home__carousel-rating-icon community" 
                                />
                                <span className="home__carousel-rating-value">
                                  {vehicle.communityRating % 1 === 0 ? vehicle.communityRating : vehicle.communityRating.toFixed(1)}
                                </span>
                              </div>
                            </div>
                            {getUserRating(vehicle.name) > 0 && (
                              <div className="home__carousel-rating-item">
                                <div className="home__carousel-rating-label-wrapper">
                                  <span className="home__carousel-rating-label-top">Your</span>
                                  <span className="home__carousel-rating-label-bottom">Rating</span>
                                </div>
                                <div className="home__carousel-rating-value-wrapper">
                                  <img 
                                    src="https://d2kde5ohu8qb21.cloudfront.net/files/68f66c095d4ae300022a2b0e/starbluesolid.svg" 
                                    alt="Your Rating Star" 
                                    className="home__carousel-rating-icon add-rate" 
                                  />
                                  <span className="home__carousel-rating-value">
                                    {getUserRating(vehicle.name)}
                                  </span>
                                </div>
                              </div>
                            )}
                          </div>
                          <button 
                            className="home__carousel-listing-btn cta cta--primary cta--default"
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
                {truckCarouselVehicles.length > 1 && (
                  <>
                    <button
                      className="home__carousel-nav home__carousel-nav--prev"
                      onClick={() => setCurrentSlideTruck((prev) => (prev - 1 + truckCarouselVehicles.length) % truckCarouselVehicles.length)}
                      aria-label="Previous slide"
                    >
                      <Icon name="chevron_left" size={24} />
                    </button>
                    <button
                      className="home__carousel-nav home__carousel-nav--next"
                      onClick={() => setCurrentSlideTruck((prev) => (prev + 1) % truckCarouselVehicles.length)}
                      aria-label="Next slide"
                    >
                      <Icon name="chevron_right" size={24} />
                    </button>
                    
                    {/* Slider Dots */}
                    <div className="home__carousel-dots">
                      {truckCarouselVehicles.map((_, index) => (
                        <button
                          key={index}
                          className={`home__carousel-dot ${index === currentSlideTruck ? 'home__carousel-dot--active' : ''}`}
                          onClick={() => setCurrentSlideTruck(index)}
                          aria-label={`Go to slide ${index + 1}`}
                        />
                      ))}
                    </div>
                  </>
                )}
            </div>
          </div>
        )}

        {/* Fullscreen Modal */}
        {fullscreenVehicle && (() => {
          const fullscreenVehicleList = getFullscreenVehicleList();
          const hasMultipleVehicles = fullscreenVehicleList.length > 1;
          
          return (
            <div className="home__fullscreen-modal" onClick={handleCollapseClick}>
              <div className="home__fullscreen-content" onClick={(e) => e.stopPropagation()}>
                {/* Collapse Button */}
                <button
                  className="home__fullscreen-collapse-btn"
                  onClick={handleCollapseClick}
                  aria-label="Collapse fullscreen"
                >
                  <Icon name="close_fullscreen" size={24} />
                </button>

                {/* Navigation Buttons */}
                {hasMultipleVehicles && (
                  <>
                    <button
                      className="home__fullscreen-nav home__fullscreen-nav--prev"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleFullscreenPrev();
                      }}
                      aria-label="Previous vehicle"
                    >
                      <Icon name="chevron_left" size={24} />
                    </button>
                    <button
                      className="home__fullscreen-nav home__fullscreen-nav--next"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleFullscreenNext();
                      }}
                      aria-label="Next vehicle"
                    >
                      <Icon name="chevron_right" size={24} />
                    </button>
                  </>
                )}

                {/* Category Badge */}
                <div className="home__fullscreen-category-badge">
                  <span className="home__fullscreen-category-text">
                    {fullscreenCarouselType === 'suv' && `TOP TEN SUVs / #${fullscreenVehicle.rank}`}
                    {fullscreenCarouselType === 'sedan' && `TOP TEN SEDANS / #${fullscreenVehicle.rank}`}
                    {fullscreenCarouselType === 'truck' && `TOP TEN PICK UP TRUCKS / #${fullscreenVehicle.rank}`}
                  </span>
                </div>

                {/* Carousel Type Navigation Links */}
                <div className="home__fullscreen-carousel-links">
                  <button
                    className={`home__fullscreen-carousel-link ${fullscreenCarouselType === 'suv' ? 'home__fullscreen-carousel-link--active' : ''}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      if (fullscreenCarouselType !== 'suv' && carouselVehicles.length > 0) {
                        handleSwitchToCarousel('suv');
                      }
                    }}
                    disabled={carouselVehicles.length === 0}
                  >
                    SUVs
                  </button>
                  <button
                    className={`home__fullscreen-carousel-link ${fullscreenCarouselType === 'sedan' ? 'home__fullscreen-carousel-link--active' : ''}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      if (fullscreenCarouselType !== 'sedan' && sedanCarouselVehicles.length > 0) {
                        handleSwitchToCarousel('sedan');
                      }
                    }}
                    disabled={sedanCarouselVehicles.length === 0}
                  >
                    Sedans
                  </button>
                  <button
                    className={`home__fullscreen-carousel-link ${fullscreenCarouselType === 'truck' ? 'home__fullscreen-carousel-link--active' : ''}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      if (fullscreenCarouselType !== 'truck' && truckCarouselVehicles.length > 0) {
                        handleSwitchToCarousel('truck');
                      }
                    }}
                    disabled={truckCarouselVehicles.length === 0}
                  >
                    Trucks
                  </button>
                </div>

                {/* Fullscreen Image */}
                <div className="home__fullscreen-image-wrapper">
                  <img 
                    src={fullscreenVehicle.image} 
                    alt={fullscreenVehicle.name}
                    className="home__fullscreen-image"
                  />
                </div>
                
                {/* Slider Dots */}
                {hasMultipleVehicles && (
                  <div className="home__fullscreen-dots">
                    {fullscreenVehicleList.map((_, index) => (
                      <button
                        key={index}
                        className={`home__fullscreen-dot ${index === fullscreenIndex ? 'home__fullscreen-dot--active' : ''}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleFullscreenGoTo(index);
                        }}
                        aria-label={`Go to vehicle ${index + 1}`}
                      />
                    ))}
                  </div>
                )}
              </div>

              {/* Sidebar with Specs */}
              <div className="home__fullscreen-sidebar">
                <h2 className="home__fullscreen-vehicle-name">
                  <a 
                    href={`/vehicles/${parseVehicleName(fullscreenVehicle.name).year}/${parseVehicleName(fullscreenVehicle.name).make}/${parseVehicleName(fullscreenVehicle.name).model}`}
                    onClick={(e) => {
                      e.preventDefault();
                      handleVehicleClick(fullscreenVehicle);
                    }}
                    className="home__fullscreen-vehicle-link"
                  >
                    {fullscreenVehicle.name}
                  </a>
                </h2>
                
                {/* Ratings */}
                <div className="home__fullscreen-ratings">
                  <div className="home__fullscreen-rating-item">
                    <div className="home__fullscreen-rating-label-wrapper">
                      <span className="home__fullscreen-rating-label-top">MotorTrend</span>
                      <span className="home__fullscreen-rating-label-bottom">Rating</span>
                    </div>
                    <div className="home__fullscreen-rating-value-wrapper">
                      <span className="home__fullscreen-rating-value">
                        {fullscreenVehicle.staffRating % 1 === 0 ? fullscreenVehicle.staffRating : fullscreenVehicle.staffRating.toFixed(1)}
                      </span>
                    </div>
                  </div>
                  <div className="home__fullscreen-rating-item">
                    <div className="home__fullscreen-rating-label-wrapper">
                      <span className="home__fullscreen-rating-label-top">Community</span>
                      <span className="home__fullscreen-rating-label-bottom">
                        Rating <span className="home__fullscreen-rating-count">(252)</span>
                      </span>
                    </div>
                    <div className="home__fullscreen-rating-value-wrapper">
                      <img 
                        src="https://d2kde5ohu8qb21.cloudfront.net/files/68f66c095d4ae300022a2b0e/starbluesolid.svg" 
                        alt="Community Rating Star" 
                        className="home__fullscreen-rating-icon community" 
                      />
                      <span className="home__fullscreen-rating-value">
                        {fullscreenVehicle.communityRating % 1 === 0 ? fullscreenVehicle.communityRating : fullscreenVehicle.communityRating.toFixed(1)}
                      </span>
                    </div>
                  </div>
                  {getUserRating(fullscreenVehicle.name) > 0 && (
                    <div className="home__fullscreen-rating-item">
                      <div className="home__fullscreen-rating-label-wrapper">
                        <span className="home__fullscreen-rating-label-top">Your</span>
                        <span className="home__fullscreen-rating-label-bottom">Rating</span>
                      </div>
                      <div className="home__fullscreen-rating-value-wrapper">
                        <img 
                          src="https://d2kde5ohu8qb21.cloudfront.net/files/68f66c095d4ae300022a2b0e/starbluesolid.svg" 
                          alt="Your Rating Star" 
                          className="home__fullscreen-rating-icon add-rate" 
                        />
                        <span className="home__fullscreen-rating-value">
                          {getUserRating(fullscreenVehicle.name)}
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                {/* See Local Listings Button */}
                <button 
                  className="home__fullscreen-listing-btn cta cta--primary cta--default"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleVehicleClick(fullscreenVehicle);
                  }}
                >
                  See Local Listings
                </button>

                {/* Specifications */}
                <div className="home__fullscreen-specs">
                  <h3 className="home__fullscreen-specs-title">Specifications</h3>
                  {(() => {
                    const specs = getVehicleSpecs(fullscreenVehicle.name);
                    return (
                      <>
                        <div className="home__fullscreen-spec-item">
                          <span className="home__fullscreen-spec-label">Price</span>
                          <span className="home__fullscreen-spec-value">{specs.price}</span>
                        </div>
                        <div className="home__fullscreen-spec-item">
                          <span className="home__fullscreen-spec-label">MPG</span>
                          <span className="home__fullscreen-spec-value">{specs.mpg}</span>
                        </div>
                        <div className="home__fullscreen-spec-item">
                          <span className="home__fullscreen-spec-label">0-60 MPH</span>
                          <span className="home__fullscreen-spec-value">{specs.zeroToSixty}</span>
                        </div>
                        {specs.horsepower && (
                          <div className="home__fullscreen-spec-item">
                            <span className="home__fullscreen-spec-label">Horsepower</span>
                            <span className="home__fullscreen-spec-value">{specs.horsepower}</span>
                          </div>
                        )}
                        {specs.torque && (
                          <div className="home__fullscreen-spec-item">
                            <span className="home__fullscreen-spec-label">Torque</span>
                            <span className="home__fullscreen-spec-value">{specs.torque}</span>
                          </div>
                        )}
                        {specs.engine && (
                          <div className="home__fullscreen-spec-item">
                            <span className="home__fullscreen-spec-label">Engine</span>
                            <span className="home__fullscreen-spec-value">{specs.engine}</span>
                          </div>
                        )}
                        {specs.transmission && (
                          <div className="home__fullscreen-spec-item">
                            <span className="home__fullscreen-spec-label">Transmission</span>
                            <span className="home__fullscreen-spec-value">{specs.transmission}</span>
                          </div>
                        )}
                        {specs.drivetrain && (
                          <div className="home__fullscreen-spec-item">
                            <span className="home__fullscreen-spec-label">Drivetrain</span>
                            <span className="home__fullscreen-spec-value">{specs.drivetrain}</span>
                          </div>
                        )}
                      </>
                    );
                  })()}
                </div>
              </div>
            </div>
          );
        })()}
      </div>
    </div>
  );
};

export default Home;

