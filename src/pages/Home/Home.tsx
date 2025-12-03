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
import { Badge } from '../../design-system/components/Badge/Badge';
import { TopTenCarousel } from '../../components/TopTenCarousel/TopTenCarousel';
import type { RiverItem } from '../../components/River';
import { sortContentForPersonalization, type ContentCategory } from '../../utils/contentFiltering';
import { getVehicleLifestyles, type LifestyleCategory } from '../../utils/vehicleLifestyles';
import { getPersonaFromOnboarding, getPersona } from '../../utils/personas';
import { vehicleImageFor, parseVehicleName } from '../../utils/vehicleImages';
import { generateStaffRating, generateCommunityRating } from '../../utils/vehicleRatings';
import { getVehicleBodyStyle } from '../../utils/vehicleBodyStyles';
import { useRating } from '../../contexts/RatingContext';
import { getVehicleSpecs } from '../../utils/vehicleSpecs';
import { getArticleBySlug } from '../../utils/articles';
import { getVehicles } from '../../api/vehiclesApi';
import { CommunityPostsPromo } from '../../components/CommunityPostsPromo';
import { AIPersonalAssistant } from '../../components/AIPersonalAssistant';
import { KnowYourBudget } from '../../components/KnowYourBudget';
import { VehicleLeadsStripe } from '../../components/VehicleLeadsStripe';
import './Home.css';

// Get vehicle database from API - NO HARDCODED DATA
const apiVehicles = getVehicles();

// Create a map for quick image lookup by vehicle name
const vehicleImageMap = new Map<string, string>();
apiVehicles.forEach(v => {
  const vehicleName = `${v.year} ${v.make} ${v.model}`;
  if (v.image) {
    vehicleImageMap.set(vehicleName, v.image);
  }
});

const carDatabase = apiVehicles.map(v => `${v.year} ${v.make} ${v.model}`);

// Convert API vehicles to VehicleItem format with images - NO HARDCODED DATA
const allVehicleItems: VehicleItem[] = carDatabase.map(name => ({ 
  name,
  image: vehicleImageMap.get(name) // Include API image
}));

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
  
  // Top Ten carousel filter state
  type VehicleType = 'SUV' | 'Sedan' | 'Truck' | 'Coupe';
  type Subcategory = 'All' | 'Subcompact' | 'Compact' | 'Midsize' | 'Full-Size' | 'Luxury' | 'Performance' | 'Electric' | 'Heavy-Duty';
  
  const [selectedVehicleType, setSelectedVehicleType] = useState<VehicleType>('SUV');
  const [selectedSubcategory, setSelectedSubcategory] = useState<Subcategory>('All');

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

  // Get persona for personalization
  const personaName = useMemo(() => getPersonaFromOnboarding(), []);
  const persona = useMemo(() => personaName ? getPersona(personaName) : null, [personaName]);

  // Compute hero and vertical cards together to avoid duplicates
  const { heroData, verticalCards } = useMemo(() => {
    // Default hero (when no persona)
    const defaultHero = {
      imageUrl: 'https://d2kde5ohu8qb21.cloudfront.net/files/686ecc3b8b30d500028d902a/2026-hyundai-ioniq-6-n-side-motion.jpg',
      title: '2026 Hyundai Ioniq 6 N First Drive: Watch Out, BMW M3, C63 AMG!',
      categories: ['Performance & Enthusiast'] as ContentCategory[],
      onClick: () => {
        navigate('/articles/2026-hyundai-ioniq-6-n-first-drive-review');
      },
    };

    const defaultCards = [
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
        imageUrl: 'https://d2kde5ohu8qb21.cloudfront.net/files/68ed9028b76c7c0002cf2104/003-2026volkswagen-golf-gti-r-coty.jpg',
        title: "2026 MotorTrend Car of the Year: The Volkswagen Golf GTI / R Wins the Golden Calipers",
        type: 'Article' as const,
        categories: ['Performance & Enthusiast'] as ContentCategory[],
        onClick: () => {
          navigate('/article/2026-motortrend-car-of-the-year');
        },
      },
    ];

    // If no persona, return default
    if (!persona) {
      return { heroData: defaultHero, verticalCards: defaultCards };
    }

    // All available content items
    const allContent = [
      // Performance & Enthusiast content (for Greg, Carl)
      {
        imageUrl: 'https://d2kde5ohu8qb21.cloudfront.net/files/6892b5a90c3c77000200a0ac/2026chevroletcorvettezr1xquailsilverlimitededitionsportscarsupercarvetteconvertible-3.jpg',
        title: 'Driven! The 1,064-HP Chevrolet Corvette ZR1 Is Patently Absurd',
        categories: ['Performance & Enthusiast'] as ContentCategory[],
        category: 'MotorTrend | Reviews',
        onClick: () => {
          navigate('/article/2025-chevrolet-corvette-zr1-first-drive-review');
        },
      },
      {
        imageUrl: 'https://d2kde5ohu8qb21.cloudfront.net/files/69137fab92a5a10002ee9e5e/20-2027bentleycontinentalgtsupersports.jpg',
        title: 'Bentley\'s 2026 Supersports Is Lighter, Louder, and Built for Drivers',
        categories: ['Performance & Enthusiast', 'Luxury & Comfort'] as ContentCategory[],
        category: 'MotorTrend | Reviews',
        onClick: () => {
          navigate('/article/2026-bentley-supersports-first-look');
        },
      },
      {
        imageUrl: 'https://d2kde5ohu8qb21.cloudfront.net/files/691682812f033b000278eee8/012-2026-dodge-charger-scat-pack-sixpack-burnout.jpg',
        title: 'First Drive: The New Dodge Charger Has Been Fixed! Mostly!',
        categories: ['Performance & Enthusiast'] as ContentCategory[],
        category: 'MotorTrend | Reviews',
        onClick: () => {
          navigate('/article/2026-dodge-charger-scat-pack-sixpack-first-drive');
        },
      },
      {
        imageUrl: 'https://d2kde5ohu8qb21.cloudfront.net/files/686ecc3b8b30d500028d902a/2026-hyundai-ioniq-6-n-side-motion.jpg',
        title: '2026 Hyundai Ioniq 6 N First Drive: Watch Out, BMW M3, C63 AMG!',
        categories: ['Performance & Enthusiast'] as ContentCategory[],
        category: 'MotorTrend | Reviews',
        onClick: () => {
          navigate('/articles/2026-hyundai-ioniq-6-n-first-drive-review');
        },
      },
      {
        imageUrl: 'https://d2kde5ohu8qb21.cloudfront.net/files/68ed9028b76c7c0002cf2104/003-2026volkswagen-golf-gti-r-coty.jpg',
        title: "2026 MotorTrend Car of the Year: The Volkswagen Golf GTI / R Wins the Golden Calipers",
        categories: ['Performance & Enthusiast'] as ContentCategory[],
        category: 'MotorTrend | Awards',
        onClick: () => {
          navigate('/article/2026-motortrend-car-of-the-year');
        },
      },
      {
        imageUrl: 'https://d2kde5ohu8qb21.cloudfront.net/files/67524b260884870008fa1a2e/1-2025-subaru-wrx-ts-front-view.jpg',
        title: '2025 Subaru WRX tS First Test: Points for STI-le, But…',
        categories: ['Performance & Enthusiast'] as ContentCategory[],
        category: 'MotorTrend | Reviews',
        onClick: () => {
          navigate('/articles/2025-subaru-wrx-ts-first-test-review');
        },
      },
      {
        imageUrl: 'https://d2kde5ohu8qb21.cloudfront.net/files/68ffacb2156e890002f8842a/23-2026-911-porsche-turbo-s-coupe.jpg',
        title: 'We Drove the 2026 Porsche 911 Turbo S, and It\'s Electrified, Unhinged, and Brilliant',
        categories: ['Performance & Enthusiast', 'Luxury & Comfort'] as ContentCategory[],
        category: 'MotorTrend | Reviews',
        onClick: () => {
          navigate('/article/2026-porsche-911-turbo-s-hybrid-first-drive-review');
        },
      },
      {
        imageUrl: 'https://d2kde5ohu8qb21.cloudfront.net/files/68ed9028b76c7c0002cf2104/003-2026volkswagen-golf-gti-r-coty.jpg',
        title: "2026 MotorTrend Car of the Year: The Volkswagen Golf GTI / R Wins the Golden Calipers",
        categories: ['Performance & Enthusiast'] as ContentCategory[],
        category: 'MotorTrend | Awards',
        onClick: () => {
          navigate('/article/2026-motortrend-car-of-the-year');
        },
      },
      {
        imageUrl: 'https://d2kde5ohu8qb21.cloudfront.net/files/690ba4a7cfe755000270cb92/5-longbow-speedster-electric-sports-car.jpg',
        title: 'This 1,973-Pound Electric Sports Car Nails What Tesla Still Can\'t',
        categories: ['Performance & Enthusiast'] as ContentCategory[],
        category: 'MotorTrend | First-Look',
        onClick: () => {
          navigate('/articles/longbow-speedster-electric-sports-car');
        },
      },
      // Family & Practical content (for Paula, Dan)
      {
        imageUrl: 'https://d2kde5ohu8qb21.cloudfront.net/files/685edb52f9d75b00021b1e55/07-2026-honda-cr-v-trailsport.jpg',
        title: '2026 Honda CR-V TrailSport First Drive: Dirty Deeds Done Dirt Chic',
        categories: ['Family & Practical', 'Adventure & Off-Road', 'Daily Commute'] as ContentCategory[],
        category: 'MotorTrend | Reviews',
        onClick: () => {
          navigate('/article/2026-honda-cr-v-trailsport-first-drive-review');
        },
      },
      {
        imageUrl: 'https://d2kde5ohu8qb21.cloudfront.net/files/690cf1b44df09200022170fe/023-2026-kia-sportage-hybrid.jpg',
        title: 'The Refreshed Kia Sportage Is Built for Buyers but Not the Podium',
        categories: ['Family & Practical', 'Daily Commute'] as ContentCategory[],
        category: 'MotorTrend | Reviews',
        onClick: () => {
          navigate('/article/2026-kia-sportage-suvoty-review');
        },
      },
      {
        imageUrl: 'https://d2kde5ohu8qb21.cloudfront.net/files/68ffacb2156e890002f8842a/23-2026-911-porsche-turbo-s-coupe.jpg',
        title: 'We Drove the 2026 Porsche 911 Turbo S, and It\'s Electrified, Unhinged, and Brilliant',
        categories: ['Performance & Enthusiast', 'Luxury & Comfort'] as ContentCategory[],
        category: 'MotorTrend | Reviews',
        onClick: () => {
          navigate('/article/2026-porsche-911-turbo-s-hybrid-first-drive-review');
        },
      },
      {
        imageUrl: 'https://d2kde5ohu8qb21.cloudfront.net/files/67524b260884870008fa1a2e/1-2025-subaru-wrx-ts-front-view.jpg',
        title: '2025 Subaru WRX tS First Test: Points for STI-le, But…',
        categories: ['Performance & Enthusiast'] as ContentCategory[],
        category: 'MotorTrend | Reviews',
        onClick: () => {
          navigate('/articles/2025-subaru-wrx-ts-first-test-review');
        },
      },
      {
        imageUrl: 'https://d2kde5ohu8qb21.cloudfront.net/files/677ef7efb1d4b8000850e710/010-2024-kia-ev9-land.jpg',
        title: "I Lived with a Kia EV9 for a Year. There's Only One Thing I Would Change.",
        categories: ['Family & Practical'] as ContentCategory[],
        category: 'MotorTrend | Reviews',
        onClick: () => {
          navigate('/articles/2024-kia-ev9-yearlong-review-verdict');
        },
      },
      {
        imageUrl: 'https://d2kde5ohu8qb21.cloudfront.net/files/690a603369a9550002fb94bc/021-2026-honda-passport-rtl.jpg',
        title: 'The Honda Passport RTL Is the One You Need, Not the One You Want',
        categories: ['Family & Practical'] as ContentCategory[],
        category: 'MotorTrend | Reviews',
        onClick: () => {
          navigate('/articles/2026-honda-passport-rtl-first-test-review');
        },
      },
      {
        imageUrl: 'https://d2kde5ohu8qb21.cloudfront.net/files/690bfd60f33e300002f8eeeb/024-2025-tesla-model-y-awd.jpg',
        title: 'The Tesla Model Y Premium RWD Is a Better Computer Than It Is a Car',
        categories: ['Family & Practical', 'Eco & Future-Ready'] as ContentCategory[],
        category: 'MotorTrend | Reviews',
        onClick: () => {
          navigate('/articles/2025-tesla-model-y-first-test-review');
        },
      },
      // Eco & Future-Ready content (for Theo, Casey)
      {
        imageUrl: 'https://d2kde5ohu8qb21.cloudfront.net/files/65f806260315ac000873e1d6/2026-rivian-r2-ev-suv-13.jpg',
        title: 'Rivian Reveals New Details on the 2026 R2 Midsize SUV Ahead of Production',
        categories: ['Eco & Future-Ready', 'Family & Practical'] as ContentCategory[],
        category: 'MotorTrend | News',
        onClick: () => {
          navigate('/articles/new-details-2026-rivian-r2-ev-suv-battery-charging');
        },
      },
      {
        imageUrl: 'https://d2kde5ohu8qb21.cloudfront.net/files/684317270ba4360008f118a0/2026cadillacoptiq-v9.jpg',
        title: 'We Drove the New 519-HP Cadillac Optiq-V to See If It\'s a *Real* V',
        categories: ['Performance & Enthusiast', 'Eco & Future-Ready'] as ContentCategory[],
        category: 'MotorTrend | Reviews',
        onClick: () => {
          navigate('/articles/2026-cadillac-optiq-v-first-drive');
        },
      },
      // Adventure & Off-Road content (for Jayden)
      {
        imageUrl: 'https://d2kde5ohu8qb21.cloudfront.net/files/68b9ebd54273cc000294e6cb/2026fordf-150lightningstxevelectricvehiclepickuptruck-11.jpg',
        title: 'Report: Ford Might Kill the F-150 Lightning Electric Pickup Truck',
        categories: ['Utility & Work', 'Eco & Future-Ready'] as ContentCategory[],
        category: 'MotorTrend | News',
        onClick: () => {
          navigate('/articles/report-ford-f150-lightning-electric-truck-maybe-discontinued');
        },
      },
      {
        imageUrl: 'https://d2kde5ohu8qb21.cloudfront.net/files/674775b8d6db2800084b1121/005-2024-toyota-tacoma-trd-sport-front-three-quarter-motion.jpg',
        title: '2024 Toyota Tacoma TRD Pro First Test: The Off-Road King Returns',
        categories: ['Adventure & Off-Road', 'Utility & Work'] as ContentCategory[],
        category: 'MotorTrend | Reviews',
        onClick: () => {
          navigate('/article/2024-toyota-tacoma-trd-pro-first-test');
        },
      },
      {
        imageUrl: 'https://d2kde5ohu8qb21.cloudfront.net/files/67f436b507a3b9000861848d/2-2025-ford-bronco-raptor-side-view.jpg',
        title: '2025 Ford Bronco Raptor Review: Desert Runner Meets Daily Driver',
        categories: ['Adventure & Off-Road', 'Performance & Enthusiast'] as ContentCategory[],
        category: 'MotorTrend | Reviews',
        onClick: () => {
          navigate('/article/2025-ford-bronco-raptor-review');
        },
      },
      // Technology & EV content (for Theo, Casey)
      {
        imageUrl: 'https://d2kde5ohu8qb21.cloudfront.net/files/67aa9aa3f8731e000842e100/2025-bmw-ix.jpg',
        title: '2025 BMW iX Review: Luxury Meets Cutting-Edge Tech',
        categories: ['Eco & Future-Ready', 'Luxury & Comfort'] as ContentCategory[],
        category: 'MotorTrend | Reviews',
        onClick: () => {
          navigate('/article/2025-bmw-ix-review');
        },
      },
      {
        imageUrl: 'https://d2kde5ohu8qb21.cloudfront.net/files/67eebefe5107540008d18c50/020-2025-lucid-air-pure.jpg',
        title: '2025 Lucid Air Review: The Fastest Production EV Gets Even Faster',
        categories: ['Eco & Future-Ready', 'Performance & Enthusiast', 'Luxury & Comfort'] as ContentCategory[],
        category: 'MotorTrend | Reviews',
        onClick: () => {
          navigate('/article/2025-lucid-air-review');
        },
      },
      // Luxury content (for Leo, Carl)
      {
        imageUrl: 'https://d2kde5ohu8qb21.cloudfront.net/files/6737b61a6511850008886d2d/004-2024-genesis-g70-2-5t-awd-front-three-quarter-action.jpg',
        title: '2024 Genesis G70 Review: Korean Luxury Challenges German Royalty',
        categories: ['Luxury & Comfort', 'Performance & Enthusiast'] as ContentCategory[],
        category: 'MotorTrend | Reviews',
        onClick: () => {
          navigate('/article/2024-genesis-g70-review');
        },
      },
      {
        imageUrl: 'https://d2kde5ohu8qb21.cloudfront.net/files/66e47d24e820cb000892fdc0/002-2024-lexus-rx-450-front-quarter-motion.jpg',
        title: '2024 Lexus RX Review: Hybrid Luxury Done Right',
        categories: ['Luxury & Comfort', 'Eco & Future-Ready', 'Family & Practical'] as ContentCategory[],
        category: 'MotorTrend | Reviews',
        onClick: () => {
          navigate('/article/2024-lexus-rx-review');
        },
      },
      // Value content (for Dan, Paula)
      {
        imageUrl: 'https://d2kde5ohu8qb21.cloudfront.net/files/65dcf5210e091c0008b94fd0/2020-honda-civic-si-coupe-front-three-quarter.jpg',
        title: '2025 Honda Civic vs. Toyota Corolla: Which Compact Sedan Offers More?',
        categories: ['Family & Practical', 'Daily Commute'] as ContentCategory[],
        category: 'MotorTrend | Reviews',
        onClick: () => {
          navigate('/article/2025-honda-civic-vs-toyota-corolla-comparison');
        },
      },
      {
        imageUrl: 'https://d2kde5ohu8qb21.cloudfront.net/files/68fa96ccbc61bd000284caff/1-2026-mazda-cx-50-awd-front-view.jpg',
        title: '2026 Mazda CX-5 Review: Premium Feel Without the Premium Price',
        categories: ['Family & Practical', 'Daily Commute'] as ContentCategory[],
        category: 'MotorTrend | Reviews',
        onClick: () => {
          navigate('/article/2026-mazda-cx-5-review');
        },
      },
    ];

    // Filter out stories based on persona
    const filteredContent = (() => {
      if (persona?.name === 'Practical Paula') {
        return allContent.filter(item => 
          !(item.title.includes('Bentley') && item.title.includes('Supersports')) &&
          !item.title.includes('Subaru WRX tS') &&
          !(item.title.includes('Dodge Charger') && item.title.includes('Has Been Fixed')) &&
          !(item.title.includes('Audi S3') && item.title.includes('RS3')) &&
          !(item.title.includes('Porsche 911 Turbo S') || item.title.includes('911 Turbo S'))
        );
      }
      if (persona?.name === 'Gearhead Greg') {
        const filtered = allContent.filter(item => 
          !(item.title.includes('Honda CR-V TrailSport') || item.title.includes('CR-V TrailSport')) &&
          !(item.title.includes('Kia Sportage') && item.title.includes('Built for Buyers')) &&
          !(item.title.includes('Cadillac Optiq-V') || item.title.includes('Optiq-V')) &&
          !(item.title.includes('Ford Bronco Raptor') && item.title.includes('Desert Runner Meets Daily Driver'))
        );
        
        // Add Honda Electric Sports Car story for Greg
        filtered.push({
          imageUrl: 'https://d2kde5ohu8qb21.cloudfront.net/files/65bbec15236e4600085bb3e8/2019-acura-nsx-07.jpg',
          title: 'Yes! Honda\'s Electric Sports Car Is Real, but Timing Remains Uncertain',
          categories: ['Performance & Enthusiast', 'Eco & Future-Ready'] as ContentCategory[],
          category: 'MotorTrend | News',
          onClick: () => {
            navigate('/article/honda-electric-sports-car-timing-uncertain');
          },
        });
        
        return filtered;
      }
      return allContent;
    })();

    // Sort all content by persona preferences
    let sortedContent = sortContentForPersonalization(filteredContent, userType);
    
    // For Greg, prioritize Bentley Supersports story in hero position
    if (persona?.name === 'Gearhead Greg') {
      const bentleyArticle = sortedContent.find(item => 
        item.title.includes('Bentley') && item.title.includes('Supersports')
      );
      if (bentleyArticle) {
        // Remove Bentley from current position and place it first
        sortedContent = sortedContent.filter(item => 
          !(item.title.includes('Bentley') && item.title.includes('Supersports'))
        );
        sortedContent.unshift(bentleyArticle);
      }
    }
    
    // Select hero (first item)
    const selectedHero = sortedContent[0] || defaultHero;
    
    // Filter out hero from cards (compare by title to avoid duplicates)
    const cardsWithoutHero = sortedContent
      .filter(item => item.title !== selectedHero.title)
      .slice(0, 3)
      .map(item => ({
        ...item,
        type: 'Article' as const,
      }));

    return {
      heroData: selectedHero,
      verticalCards: cardsWithoutHero.length > 0 ? cardsWithoutHero : defaultCards,
    };
  }, [navigate, persona, userType]);

  // News items with navigation
  const newsItems = useMemo(() => [
    {
      imageUrl: 'https://d2kde5ohu8qb21.cloudfront.net/files/68f94cee0c4a17000281845d/14-2026-ferrari-296-speciale-first-drive.jpg',
      title: 'Driven! The 2026 Ferrari 296 Speciale Is Molto Intensa',
      author: 'Angus MacKenzie',
      date: 'Nov 15, 2025',
      category: 'MotorTrend | Reviews',
      categories: ['Performance & Enthusiast'] as ContentCategory[],
      onClick: () => {
        navigate('/article/2026-ferrari-296-speciale-first-drive-review');
      },
    },
    {
      imageUrl: 'https://d2kde5ohu8qb21.cloudfront.net/files/69124d99efef440002fc4a65/001-2026cadillacescaladeiq-2026-suvoty.jpg',
      title: 'The Cadillac Escalade IQ Is the 2026 MotorTrend SUV of the Year',
      author: 'Christian Seabaugh',
      date: 'Nov 18, 2025',
      category: 'MotorTrend | News',
      categories: ['Luxury & Comfort', 'Eco & Future-Ready'] as ContentCategory[],
      onClick: () => {
        navigate('/article/2026-cadillac-escalade-iq-suv-of-the-year');
      },
    },
    {
      imageUrl: 'https://d2kde5ohu8qb21.cloudfront.net/files/68dd5d42477f080002fdb61a/003-2025-audi-s3.jpg',
      title: 'Audi S3 vs. RS3: One Is Shockingly Quick, the Other Might Be the Better Deal',
      author: 'Alisa Priddle',
      date: 'Oct 08, 2025',
      category: 'MotorTrend | Reviews',
      categories: ['Performance & Enthusiast'] as ContentCategory[],
      onClick: () => {
        navigate('/article/2025-audi-s3-vs-rs3-comparison');
      },
    },
    {
      imageUrl: 'https://d2kde5ohu8qb21.cloudfront.net/files/685edb52f9d75b00021b1e55/07-2026-honda-cr-v-trailsport.jpg',
      title: '2026 Honda CR-V TrailSport First Drive: Dirty Deeds Done Dirt Chic',
      author: 'Bob Hernandez',
      date: 'Jun 30, 2025',
      category: 'MotorTrend | Reviews',
      categories: ['Family & Practical', 'Adventure & Off-Road', 'Daily Commute'] as ContentCategory[],
      onClick: () => {
        navigate('/article/2026-honda-cr-v-trailsport-first-drive-review');
      },
    },
    {
      imageUrl: 'https://d2kde5ohu8qb21.cloudfront.net/files/690cf1b44df09200022170fe/023-2026-kia-sportage-hybrid.jpg',
      title: 'The Refreshed Kia Sportage Is Built for Buyers but Not the Podium',
      author: 'Alex Leanse',
      date: 'Nov 14, 2025',
      category: 'MotorTrend | Reviews',
      categories: ['Family & Practical', 'Daily Commute'] as ContentCategory[],
      onClick: () => {
        navigate('/article/2026-kia-sportage-suvoty-review');
      },
    },
    {
      imageUrl: 'https://d2kde5ohu8qb21.cloudfront.net/files/68ffacb2156e890002f8842a/23-2026-911-porsche-turbo-s-coupe.jpg',
      title: 'We Drove the 2026 Porsche 911 Turbo S, and It\'s Electrified, Unhinged, and Brilliant',
      author: 'Frank Markus',
      date: 'Nov 22, 2025',
      category: 'MotorTrend | Reviews',
      categories: ['Performance & Enthusiast', 'Luxury & Comfort'] as ContentCategory[],
      onClick: () => {
        navigate('/article/2026-porsche-911-turbo-s-hybrid-first-drive-review');
      },
    },
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
      imageUrl: 'https://d2kde5ohu8qb21.cloudfront.net/files/65f806260315ac000873e1d6/2026-rivian-r2-ev-suv-13.jpg',
      title: 'Rivian Reveals New Details on the 2026 R2 Midsize SUV Ahead of Production',
      author: 'Justin Banner',
      date: 'Nov 06, 2025',
      category: 'MotorTrend | News',
      categories: ['Eco & Future-Ready', 'Family & Practical'] as ContentCategory[],
      onClick: () => {
        navigate('/article/new-details-2026-rivian-r2-ev-suv-battery-charging');
      },
    },
    {
      imageUrl: 'https://d2kde5ohu8qb21.cloudfront.net/files/690cf4b165553e00029f4802/024-2025-mini-countryman-se-all4-ev.jpg',
      title: 'It\'s Time for the Mini Countryman EV to Get Serious',
      author: 'Billy Rehbock',
      date: 'Nov 10, 2025',
      category: 'MotorTrend | Reviews',
      categories: ['Eco & Future-Ready', 'Performance & Enthusiast'] as ContentCategory[],
      onClick: () => {
        navigate('/article/2025-mini-countryman-se-all4-ev-review');
      },
    },
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
    // Adventure & Off-Road content (for Jayden)
    {
      imageUrl: 'https://d2kde5ohu8qb21.cloudfront.net/files/674775b8d6db2800084b1121/005-2024-toyota-tacoma-trd-sport-front-three-quarter-motion.jpg',
      title: '2024 Toyota Tacoma TRD Pro First Test: The Off-Road King Returns',
      author: 'Alexander Stoklosa',
      date: 'Nov 12, 2025',
      category: 'MotorTrend | Reviews',
      categories: ['Adventure & Off-Road', 'Utility & Work'] as ContentCategory[],
      onClick: () => {
        navigate('/article/2024-toyota-tacoma-trd-pro-first-test');
      },
    },
    {
      imageUrl: 'https://d2kde5ohu8qb21.cloudfront.net/files/67f436b279a6060008bc3b95/1-2025-ford-bronco-raptor-front-view.jpg',
      title: '2025 Ford Bronco Raptor Review: Desert Runner Meets Daily Driver',
      author: 'Eric Tingwall',
      date: 'Oct 15, 2025',
      category: 'MotorTrend | Reviews',
      categories: ['Adventure & Off-Road', 'Performance & Enthusiast'] as ContentCategory[],
      onClick: () => {
        navigate('/article/2025-ford-bronco-raptor-review');
      },
    },
    // Technology & EV content (for Theo, Casey)
    {
      imageUrl: 'https://d2kde5ohu8qb21.cloudfront.net/files/67aa9aa3f8731e000842e100/2025-bmw-ix.jpg',
      title: '2025 BMW iX Review: Luxury Meets Cutting-Edge Tech',
      author: 'Alex Leanse',
      date: 'Nov 08, 2025',
      category: 'MotorTrend | Reviews',
      categories: ['Eco & Future-Ready', 'Luxury & Comfort'] as ContentCategory[],
      onClick: () => {
        navigate('/article/2025-bmw-ix-review');
      },
    },
    {
      imageUrl: 'https://d2kde5ohu8qb21.cloudfront.net/files/67eebefe5107540008d18c50/020-2025-lucid-air-pure.jpg',
      title: '2025 Lucid Air Review: The Fastest Production EV Gets Even Faster',
      author: 'Angus MacKenzie',
      date: 'Oct 20, 2025',
      category: 'MotorTrend | Reviews',
      categories: ['Eco & Future-Ready', 'Performance & Enthusiast', 'Luxury & Comfort'] as ContentCategory[],
      onClick: () => {
        navigate('/article/2025-lucid-air-review');
      },
    },
    // Luxury content (for Leo, Carl)
    {
      imageUrl: 'https://d2kde5ohu8qb21.cloudfront.net/files/6737b61a6511850008886d2d/004-2024-genesis-g70-2-5t-awd-front-three-quarter-action.jpg',
      title: '2024 Genesis G70 Review: Korean Luxury Challenges German Royalty',
      author: 'Alisa Priddle',
      date: 'Nov 05, 2025',
      category: 'MotorTrend | Reviews',
      categories: ['Luxury & Comfort', 'Performance & Enthusiast'] as ContentCategory[],
      onClick: () => {
        navigate('/article/2024-genesis-g70-review');
      },
    },
    {
      imageUrl: 'https://d2kde5ohu8qb21.cloudfront.net/files/66e47d24e820cb000892fdc0/002-2024-lexus-rx-450-front-quarter-motion.jpg',
      title: '2024 Lexus RX Review: Hybrid Luxury Done Right',
      author: 'Bob Hernandez',
      date: 'Oct 28, 2025',
      category: 'MotorTrend | Reviews',
      categories: ['Luxury & Comfort', 'Eco & Future-Ready', 'Family & Practical'] as ContentCategory[],
      onClick: () => {
        navigate('/article/2024-lexus-rx-review');
      },
    },
    // Value content (for Dan, Paula)
    {
      imageUrl: 'https://d2kde5ohu8qb21.cloudfront.net/files/65dcf5210e091c0008b94fd0/2020-honda-civic-si-coupe-front-three-quarter.jpg',
      title: '2025 Honda Civic vs. Toyota Corolla: Which Compact Sedan Offers More?',
      author: 'Billy Rehbock',
      date: 'Nov 10, 2025',
      category: 'MotorTrend | Reviews',
      categories: ['Family & Practical', 'Daily Commute'] as ContentCategory[],
      onClick: () => {
        navigate('/article/2025-honda-civic-vs-toyota-corolla-comparison');
      },
    },
    {
      imageUrl: 'https://d2kde5ohu8qb21.cloudfront.net/files/686c4f52a5f0070002f31f87/2026mazdacx-517.jpg',
      title: '2026 Mazda CX-5 Review: Premium Feel Without the Premium Price',
      author: 'Alex Leanse',
      date: 'Nov 14, 2025',
      category: 'MotorTrend | Reviews',
      categories: ['Family & Practical', 'Daily Commute'] as ContentCategory[],
      onClick: () => {
        navigate('/article/2026-mazda-cx-5-review');
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
      imageUrl: 'https://d2kde5ohu8qb21.cloudfront.net/files/68ffacb2156e890002f8842a/23-2026-911-porsche-turbo-s-coupe.jpg',
      title: 'We Drove the 2026 Porsche 911 Turbo S, and It\'s Electrified, Unhinged, and Brilliant',
      author: 'Mac Morrison',
      date: 'Oct 27, 2025',
      category: 'MotorTrend | Reviews',
      categories: ['Performance & Enthusiast', 'Luxury & Comfort'] as ContentCategory[],
      onClick: () => {
        navigate('/article/2026-porsche-911-turbo-s-hybrid-first-drive-review');
      },
    },
    {
      imageUrl: 'https://d2kde5ohu8qb21.cloudfront.net/files/68ed9028b76c7c0002cf2104/003-2026volkswagen-golf-gti-r-coty.jpg',
      title: "2026 MotorTrend Car of the Year: The Volkswagen Golf GTI / R Wins the Golden Calipers",
      author: 'MotorTrend Staff',
      date: 'Oct 15, 2025',
      category: 'MotorTrend | Awards',
      categories: ['Performance & Enthusiast'] as ContentCategory[],
      onClick: () => {
        navigate('/article/2026-motortrend-car-of-the-year');
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

  // verticalCards are already sorted by persona in their useMemo
  const sortedVerticalCards = verticalCards;

  const sortedNewsItems = useMemo(() => {
    // Filter out stories based on persona
    const filteredNewsItems = (() => {
      if (persona?.name === 'Practical Paula') {
        return newsItems.filter(item => 
          !(item.title.includes('Bentley') && item.title.includes('Supersports')) &&
          !item.title.includes('Subaru WRX tS') &&
          !(item.title.includes('Dodge Charger') && item.title.includes('Has Been Fixed')) &&
          !(item.title.includes('Audi S3') && item.title.includes('RS3')) &&
          !(item.title.includes('Porsche 911 Turbo S') || item.title.includes('911 Turbo S')) &&
          !item.title.includes('Ferrari 296 Speciale')
        );
      }
      if (persona?.name === 'Gearhead Greg') {
        return newsItems.filter(item => 
          !(item.title.includes('Honda CR-V TrailSport') || item.title.includes('CR-V TrailSport')) &&
          !(item.title.includes('Kia Sportage') && item.title.includes('Built for Buyers')) &&
          !(item.title.includes('Cadillac Optiq-V') || item.title.includes('Optiq-V'))
        );
      }
      return newsItems;
    })();
    
    // Filter out stories that appear in hero or vertical cards to avoid duplicates
    const heroAndCardsTitles = new Set([
      heroData.title,
      ...verticalCards.map(card => card.title)
    ]);
    
    const withoutHeroAndCards = filteredNewsItems.filter(item => 
      !heroAndCardsTitles.has(item.title)
    );
    
    // For Gearhead Greg, prioritize Ferrari 296 Speciale as the first story
    let finalSortedItems;
    if (persona?.name === 'Gearhead Greg') {
      const ferrariStory = withoutHeroAndCards.find(item => 
        item.title.includes('Ferrari 296 Speciale')
      );
      if (ferrariStory) {
        const otherStories = withoutHeroAndCards.filter(item => 
          !item.title.includes('Ferrari 296 Speciale')
        );
        finalSortedItems = [ferrariStory, ...otherStories];
      } else {
        finalSortedItems = sortContentForPersonalization(withoutHeroAndCards, userType);
      }
    } else {
      finalSortedItems = sortContentForPersonalization(withoutHeroAndCards, userType);
    }
    
    // Place Escalade IQ article in second position (index 1) of the first river
    const escaladeIndex = finalSortedItems.findIndex(item => 
      item.title.includes('Cadillac Escalade IQ') || 
      item.title.includes('2026 MotorTrend SUV of the Year')
    );
    
    if (escaladeIndex !== -1 && escaladeIndex !== 1) {
      const escaladeArticle = finalSortedItems[escaladeIndex];
      // Remove from current position
      finalSortedItems.splice(escaladeIndex, 1);
      // Insert at position 1 (second position of river)
      finalSortedItems.splice(1, 0, escaladeArticle);
    }
    
    return finalSortedItems;
  }, [userType, newsItems, persona, heroData, verticalCards]);

  // Split news items into sets of 6 for each river
  const sortedNewsItemsRiver1 = useMemo(() => sortedNewsItems.slice(0, 6), [sortedNewsItems]);
  const sortedNewsItemsRiver2 = useMemo(() => sortedNewsItems.slice(6, 12), [sortedNewsItems]);
  const sortedNewsItemsRiver3 = useMemo(() => sortedNewsItems.slice(12, 18), [sortedNewsItems]);

  // Rankings & Awards articles for first river - personalized based on persona
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

    const articles = rankingSlugs
      .map(slug => {
        const article = getArticleBySlug(slug);
        if (!article) return null;
        
        return {
          imageUrl: article.heroImage,
          title: article.title,
          author: article.author,
          date: article.date,
          category: 'MotorTrend | Rankings',
          // Map article slugs to content categories for personalization
          categories: slug.includes('daily-commute') ? ['Daily Commute'] as ContentCategory[] :
                      slug.includes('family-practical') ? ['Family & Practical'] as ContentCategory[] :
                      slug.includes('adventure-off-road') ? ['Adventure & Off-Road'] as ContentCategory[] :
                      slug.includes('urban-style') ? ['Urban & Style'] as ContentCategory[] :
                      slug.includes('performance-enthusiast') ? ['Performance & Enthusiast'] as ContentCategory[] :
                      slug.includes('eco-future-ready') ? ['Eco & Future-Ready'] as ContentCategory[] :
                      slug.includes('luxury-comfort') ? ['Luxury & Comfort'] as ContentCategory[] :
                      slug.includes('utility-work') ? ['Utility & Work'] as ContentCategory[] :
                      [] as ContentCategory[],
          onClick: () => {
            navigate(`/article/${slug}`);
          },
        } as RiverItem & { categories?: ContentCategory[] };
      })
      .filter((item): item is RiverItem & { categories?: ContentCategory[] } => item !== null);
    
    // Sort by persona preferences if user is signed in
    return sortContentForPersonalization(articles, userType);
  }, [navigate, userType]);


  // Filter and prioritize vehicles based on persona (if signed in) or user type using vehicle lifestyles
  const filteredVehicleItems = useMemo(() => {
    let result: VehicleItem[] = [];

    // Helper function to score vehicles by persona match
    const scoreVehicleForPersona = (vehicle: VehicleItem): number => {
      if (!persona) return 0;
      
      const vehicleLifestyles = getVehicleLifestyles(vehicle.name);
      const matchingCategories = persona.priorityCategories.filter(cat => 
        vehicleLifestyles.includes(cat as LifestyleCategory)
      );
      
      // Score based on how many persona categories match
      return matchingCategories.length / persona.priorityCategories.length;
    };

    // If no userType and no persona, return all vehicles sorted by latest
    if (!userType && !persona) {
      // Get latest year vehicles first
      result = [...allVehicleItems].sort((a, b) => {
        const yearA = parseInt(a.name.match(/\d{4}/)?.[0] || '0');
        const yearB = parseInt(b.name.match(/\d{4}/)?.[0] || '0');
        return yearB - yearA; // Latest first
      });
    } else {
      // Use persona categories if available, otherwise use userType categories
      let filterCategories: LifestyleCategory[] = [];
      
      if (persona) {
        // Map persona priority categories to lifestyle categories
        filterCategories = persona.priorityCategories as LifestyleCategory[];
      } else {
        // Fall back to userType-based categories
        filterCategories = userType === 'buyer' 
          ? ['Family & Practical', 'Daily Commute', 'Utility & Work', 'Adventure & Off-Road']
          : userType === 'enthusiast'
          ? ['Performance & Enthusiast', 'Adventure & Off-Road']
          : userType === 'both'
          ? ['Family & Practical', 'Performance & Enthusiast', 'Utility & Work', 'Adventure & Off-Road']
          : [];
      }

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

        // Sort by persona match score (if persona exists), then by year (latest first)
        result = filtered.sort((a, b) => {
          if (persona) {
            const scoreA = scoreVehicleForPersona(a);
            const scoreB = scoreVehicleForPersona(b);
            
            // Higher scores come first
            if (Math.abs(scoreA - scoreB) > 0.01) {
              return scoreB - scoreA;
            }
          }
          
          // Then sort by year (latest first)
          const yearA = parseInt(a.name.match(/\d{4}/)?.[0] || '0');
          const yearB = parseInt(b.name.match(/\d{4}/)?.[0] || '0');
          return yearB - yearA;
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
  }, [userType, persona]);


  // Helper function to get subcategories based on vehicle type
  const getSubcategoriesForType = (type: VehicleType): Subcategory[] => {
    switch (type) {
      case 'SUV':
        return ['All', 'Subcompact', 'Compact', 'Midsize', 'Full-Size', 'Electric'];
      case 'Sedan':
        return ['All', 'Compact', 'Midsize', 'Full-Size', 'Luxury', 'Performance', 'Electric'];
      case 'Truck':
        return ['All', 'Midsize', 'Full-Size', 'Electric'];
      case 'Coupe':
        return ['All', 'Luxury', 'Performance', 'Electric'];
      default:
        return ['All'];
    }
  };

  // Helper function to determine vehicle subcategory
  const getVehicleSubcategory = (vehicleName: string, type: VehicleType): Subcategory => {
    const name = vehicleName.toLowerCase();
    
    // Check for electric vehicles first (applies to all types)
    const electricKeywords = ['electric', 'ev', 'e-tron', 'taycan', 'model 3', 'model s', 'model x', 'model y', 'i4', 'i8', 'eq', 'ioniq', 'leaf', 'bolt', 'id.4', 'mach-e', 'lightning', 'rivian', 'lucid', 'polestar', 'ariya', 'bz4x'];
    if (electricKeywords.some(keyword => name.includes(keyword))) return 'Electric';
    
    if (type === 'SUV') {
      // Subcompact SUVs (smallest)
      const subcompactModels = ['hr-v', 'venue', 'trailblazer', 'ecosport', 'kicks', 'soul', 'encore', 'trax', 'seltos', 'kona', 'crosstrek'];
      if (subcompactModels.some(model => name.includes(model))) return 'Subcompact';
      
      // Full-size SUVs (largest)
      const fullsizeModels = ['expedition', 'tahoe', 'suburban', 'yukon', 'armada', 'sequoia', 'navigator', 'escalade', 'qx80', 'gls', 'gx', 'lx', 'land cruiser', 'wagoneer', 'grand wagoneer', 'qx56'];
      if (fullsizeModels.some(model => name.includes(model))) return 'Full-Size';
      
      // Midsize SUVs
      const midsizeModels = ['pilot', 'highlander', 'explorer', 'grand cherokee', 'pathfinder', 'cx-9', 'palisade', 'telluride', 'atlas', 'ascent', 'traverse', 'enclave', 'durango', 'q7', 'x5', 'gle', 'rx', 'mdx', 'passport', 'murano', 'edge', 'blazer', 'santa fe', 'sorento'];
      if (midsizeModels.some(model => name.includes(model))) return 'Midsize';
      
      // Default to Compact for everything else (CR-V, RAV4, Rogue, Tucson, Sportage, CX-5, Forester, Outback, etc.)
      return 'Compact';
    }
    
    if (type === 'Sedan') {
      // Luxury Sedans
      const luxuryModels = ['s-class', 'a8', 'ls', '7 series', 'panamera', 'flying spur', 'continental', 'ghost', 'phantom', 'a7', 'cls', 'e-class', 'gs', 'es', 'q70', 'genesis g90'];
      if (luxuryModels.some(model => name.includes(model))) return 'Luxury';
      
      // Performance Sedans
      const performanceModels = ['m3', 'm5', 'amg', 'rs3', 'rs4', 'rs5', 'rs6', 'rs7', 'sti', 'wrx', 'type r', 'gt', 's3', 's4', 's5', 's6', 's7', 's8', 'giulia', 'stinger'];
      if (performanceModels.some(model => name.includes(model))) return 'Performance';
      
      // Full-size Sedans
      const fullsizeModels = ['charger', 'avalon', 'impala', '300', 'taurus', 'maxima', 'azera', 'k900'];
      if (fullsizeModels.some(model => name.includes(model))) return 'Full-Size';
      
      // Compact Sedans
      const compactModels = ['civic', 'corolla', 'sentra', 'elantra', 'forte', 'impreza', 'mazda3', 'jetta', 'golf'];
      if (compactModels.some(model => name.includes(model))) return 'Compact';
      
      // Default to Midsize (Accord, Camry, Altima, Sonata, Optima, Malibu, Fusion, Passat, Legacy, etc.)
      return 'Midsize';
    }
    
    if (type === 'Truck') {
      // Heavy-Duty Trucks
      const heavyDutyModels = ['2500', '3500', 'f-250', 'f-350', 'f-450', 'silverado 2500', 'silverado 3500', 'sierra 2500', 'sierra 3500', 'ram 2500', 'ram 3500', 'titan xd'];
      if (heavyDutyModels.some(model => name.includes(model))) return 'Heavy-Duty';
      
      // Midsize Trucks (Ranger, Colorado, Tacoma, Frontier, Gladiator, Canyon, Ridgeline)
      const midsizeModels = ['ranger', 'colorado', 'tacoma', 'frontier', 'gladiator', 'canyon', 'ridgeline'];
      if (midsizeModels.some(model => name.includes(model))) return 'Midsize';
      
      // Compact Trucks (smaller trucks if any)
      const compactModels = ['maverick', 'santa cruz'];
      if (compactModels.some(model => name.includes(model))) return 'Compact';
      
      // Default to Full-Size (F-150, Silverado 1500, Sierra 1500, Ram 1500, Tundra, Titan, etc.)
      return 'Full-Size';
    }
    
    if (type === 'Coupe') {
      // Luxury Coupes
      const luxuryModels = ['s-class', 'a7', 'a8', 'cls', '8 series', 'lc', 'rc', 'continental'];
      if (luxuryModels.some(model => name.includes(model))) return 'Luxury';
      
      // Performance Coupes
      const performanceModels = ['m2', 'm4', 'm8', 'amg', 'rs5', 'rs7', 'gt', 'corvette', 'camaro', 'challenger', 'mustang', 'supra', 'z', '370z', '400z', 'gt-r', 'nsx', 'r8'];
      if (performanceModels.some(model => name.includes(model))) return 'Performance';
      
      return 'Luxury';
    }
    
    if (type === 'Wagon') {
      // Luxury Wagons
      const luxuryModels = ['e-class', 'a6', 'a4', 'v60', 'v90', '5 series', 'panamera'];
      if (luxuryModels.some(model => name.includes(model))) return 'Luxury';
      
      // Compact Wagons
      const compactModels = ['golf', 'impreza', 'corolla'];
      if (compactModels.some(model => name.includes(model))) return 'Compact';
      
      // Default to Midsize
      return 'Midsize';
    }
    
    return 'All';
  };

  // Reset subcategory when vehicle type changes
  useEffect(() => {
    setSelectedSubcategory('All');
  }, [selectedVehicleType]);

  // Prepare vehicles for carousel (10 best vehicles of selected type)
  const carouselVehicles: Vehicle[] = useMemo(() => {
    // Filter by selected vehicle type
    let filteredVehicles = allVehicleItems.filter(vehicle => {
      const bodyStyles = getVehicleBodyStyle(vehicle.name);
      return bodyStyles.includes(selectedVehicleType);
    });
    
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
      const makeModelHash = (make + model).split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
      const publicationYear = Math.max(vehicleYear - 1, 2019);
      const month = (makeModelHash % 12) + 1;
      const day = (makeModelHash % 28) + 1;
      const hour = (makeModelHash % 24);
      const minute = (makeModelHash % 60);
      const createdDate = new Date(publicationYear, month - 1, day, hour, minute);
      
      // Use API ratings as primary source (single source of truth)
      // Only fallback to generated ratings if API data is missing
      const staffRating = vehicleItem.staffRating ?? generateStaffRating(vehicleItem.name);
      const communityRating = vehicleItem.communityRating ?? generateCommunityRating(vehicleItem.name);
      const combinedRating = (staffRating + communityRating) / 2;
      
      return {
        id: `vehicle-${index}`,
        name: vehicleItem.name,
        year,
        make,
        model,
        image: vehicleItem.image || vehicleImageFor(vehicleItem.name), // Use API image, fallback to generated
        createdDate,
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
      // First sort by combined rating (descending)
      if (Math.abs(a.combinedRating - b.combinedRating) > 0.1) {
        return b.combinedRating - a.combinedRating;
      }
      // Then by year (descending)
      return b.vehicleYear - a.vehicleYear;
    });

    // Take top 10 best vehicles and reverse order (10 to 1)
    return sortedVehicles.slice(0, 10).map((vehicle, index) => ({
      id: `${selectedVehicleType.toLowerCase()}-${index}`,
      name: vehicle.name,
      year: vehicle.year,
      make: vehicle.make,
      model: vehicle.model,
      image: vehicle.image,
      createdDate: vehicle.createdDate,
      staffRating: vehicle.staffRating,
      communityRating: vehicle.communityRating,
      rank: index + 1 // Add ranking number (1-10)
    })).reverse();
  }, [selectedVehicleType, selectedSubcategory]);

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
      
      // Use API ratings as primary source (single source of truth)
      // Only fallback to generated ratings if API data is missing
      const staffRating = vehicleItem.staffRating ?? generateStaffRating(vehicleItem.name);
      const communityRating = vehicleItem.communityRating ?? generateCommunityRating(vehicleItem.name);
      const combinedRating = (staffRating + communityRating) / 2;
      
      return {
        id: `vehicle-${index}`,
        name: vehicleItem.name,
        year,
        make,
        model,
        image: vehicleItem.image || vehicleImageFor(vehicleItem.name), // Use API image, fallback to generated
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

    // Take top 10 best sedans and reverse order (10 to 1)
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
    })).reverse();
  }, []);

  // Auto-advance carousel with subcategory switching
  useEffect(() => {
    if (carouselVehicles.length <= 1) return;
    
    if (!isSliderHovered) {
      slideIntervalRef.current = setInterval(() => {
        setCurrentSlide((prev) => {
          const nextSlide = prev + 1;
          
          // If we've reached the end of the current subcategory, switch to next subcategory
          if (nextSlide >= carouselVehicles.length) {
            const subcategories = getSubcategoriesForType(selectedVehicleType);
            const currentIndex = subcategories.indexOf(selectedSubcategory);
            const nextIndex = (currentIndex + 1) % subcategories.length;
            setSelectedSubcategory(subcategories[nextIndex]);
            return 0; // Start from first slide of new subcategory
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

  // Keyboard navigation for SUV carousel
  useEffect(() => {
    if (carouselVehicles.length <= 1) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      // Only handle keyboard navigation when carousel is hovered
      if (!isSliderHovered) return;

      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        setCurrentSlide((prev) => {
          // If at first slide, go to previous subcategory
          if (prev === 0) {
            const subcategories = getSubcategoriesForType(selectedVehicleType);
            const currentIndex = subcategories.indexOf(selectedSubcategory);
            const prevIndex = (currentIndex - 1 + subcategories.length) % subcategories.length;
            setSelectedSubcategory(subcategories[prevIndex]);
            return 0; // Will be set to last slide of new subcategory after vehicles load
          }
          return prev - 1;
        });
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        setCurrentSlide((prev) => {
          const nextSlide = prev + 1;
          
          // If we've reached the end, switch to next subcategory
          if (nextSlide >= carouselVehicles.length) {
            const subcategories = getSubcategoriesForType(selectedVehicleType);
            const currentIndex = subcategories.indexOf(selectedSubcategory);
            const nextIndex = (currentIndex + 1) % subcategories.length;
            setSelectedSubcategory(subcategories[nextIndex]);
            return 0; // Start from first slide of new subcategory
          }
          
          return nextSlide;
        });
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isSliderHovered, carouselVehicles.length, selectedVehicleType, selectedSubcategory]);

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
      
      // Use API ratings as primary source (single source of truth)
      // Only fallback to generated ratings if API data is missing
      const staffRating = vehicleItem.staffRating ?? generateStaffRating(vehicleItem.name);
      const communityRating = vehicleItem.communityRating ?? generateCommunityRating(vehicleItem.name);
      const combinedRating = (staffRating + communityRating) / 2;
      
      return {
        id: `vehicle-${index}`,
        name: vehicleItem.name,
        year,
        make,
        model,
        image: vehicleItem.image || vehicleImageFor(vehicleItem.name), // Use API image, fallback to generated
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

    // Take top 10 best trucks and reverse order (10 to 1)
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
    })).reverse();
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
        setCurrentSlideSedan((prev) => {
          // If at first slide, go to previous subcategory
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
        setCurrentSlideSedan((prev) => {
          const nextSlide = prev + 1;
          
          // If we've reached the end, switch to next subcategory
          if (nextSlide >= sedanCarouselVehicles.length) {
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
  }, [isSliderHoveredSedan, sedanCarouselVehicles.length, selectedVehicleType, selectedSubcategory]);

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
        setCurrentSlideTruck((prev) => {
          // If at first slide, go to previous subcategory
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
        setCurrentSlideTruck((prev) => {
          const nextSlide = prev + 1;
          
          // If we've reached the end, switch to next subcategory
          if (nextSlide >= truckCarouselVehicles.length) {
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
  }, [isSliderHoveredTruck, truckCarouselVehicles.length, selectedVehicleType, selectedSubcategory]);

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
    
    // If we've reached the end of the current category, switch to next subcategory
    if (fullscreenIndex >= vehicleList.length - 1) {
      const subcategories = getSubcategoriesForType(selectedVehicleType);
      const currentIndex = subcategories.indexOf(selectedSubcategory);
      const nextIndex = (currentIndex + 1) % subcategories.length;
      setSelectedSubcategory(subcategories[nextIndex]);
      setFullscreenIndex(0);
      // Vehicle will be updated when carouselVehicles updates
      return;
    }
    
    const nextIndex = fullscreenIndex + 1;
    setFullscreenIndex(nextIndex);
    setFullscreenVehicle(vehicleList[nextIndex]);
  };
  
  // Navigate to previous vehicle in fullscreen
  const handleFullscreenPrev = () => {
    const vehicleList = getFullscreenVehicleList();
    if (vehicleList.length === 0) return;
    
    // If we're at the first vehicle, switch to previous subcategory
    if (fullscreenIndex === 0) {
      const subcategories = getSubcategoriesForType(selectedVehicleType);
      const currentIndex = subcategories.indexOf(selectedSubcategory);
      const prevIndex = (currentIndex - 1 + subcategories.length) % subcategories.length;
      setSelectedSubcategory(subcategories[prevIndex]);
      setFullscreenIndex(0);
      // Vehicle will be updated when carouselVehicles updates
      return;
    }
    
    const prevIndex = fullscreenIndex - 1;
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

  // Update fullscreen vehicle when subcategory changes
  useEffect(() => {
    if (!fullscreenVehicle || !fullscreenCarouselType) return;
    
    const vehicleList = getFullscreenVehicleList();
    if (vehicleList.length > 0 && fullscreenIndex < vehicleList.length) {
      setFullscreenVehicle(vehicleList[fullscreenIndex]);
    } else if (vehicleList.length > 0) {
      setFullscreenIndex(0);
      setFullscreenVehicle(vehicleList[0]);
    }
  }, [selectedSubcategory, carouselVehicles, sedanCarouselVehicles, truckCarouselVehicles]);

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

  // Helper function to render star rating (0-10 scale, displays as 0-5 stars)
  const renderStarRating = (ratingValue: number) => {
    // ratingValue is already on 0-10 scale, convert to 0-5 scale for display
    const normalizedRating = ratingValue / 2;
    
    return (
      <div className="home__carousel-rating-stars">
        {[1, 2, 3, 4, 5].map((star) => {
          const isFilled = star < Math.ceil(normalizedRating);
          const isHalf = star === Math.ceil(normalizedRating) && normalizedRating % 1 !== 0;
          
          return (
            <div key={star} className={`home__carousel-star-wrapper ${isHalf ? 'home__carousel-star-wrapper--half' : ''}`}>
              {/* Outline star */}
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="home__carousel-star home__carousel-star--outline">
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
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="home__carousel-star home__carousel-star--filled">
                  <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"
                    fill="#33C4FF"
                  />
                </svg>
              )}
              {isHalf && (
                <div className="home__carousel-star-half-fill">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="home__carousel-star">
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

  // Check if user is Practical Paula (Car Buyers persona)
  const isCarBuyers = personaName === 'Practical Paula';

  return (
    <div className="home">
      <div className="home__container">
        {/* For Car Buyers (Practical Paula): Show Available Listings first */}
        {isCarBuyers && (
          <>
            {/* Vehicle Leads Stripe - Above Top Ten Carousel */}
            <div className="home__section home__section--full-width">
              <VehicleLeadsStripe />
            </div>
            <div className="home__section home__section--full-width">
              <TopTenCarousel showExpandButton={false} />
            </div>
          </>
        )}

        {/* Top Section: Hero + 3 Cards with Right Column Ad - Hidden for Car Buyers */}
        {!isCarBuyers && (
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
        )}

        {/* Latest From MotorTrend Section - Right after Hero (River 1: First 6 stories) */}
        <div className="home__section">
          <div className="home__left-column">
            <NewsSection
              title="Latest Car News From our Experts"
              items={sortedNewsItemsRiver1}
            />
          </div>
          <div className="home__right-column">
            {isCarBuyers ? (
              <AIPersonalAssistant />
            ) : (
              <AdContainer
                width={300}
                height={600}
                label="SVOD 200 x 420"
                position="right-column"
                imageUrl="https://d2kde5ohu8qb21.cloudfront.net/files/691163e3e8557700022eb5d9/4347518532106070908.png"
              />
            )}
          </div>
        </div>

        {/* For Car Buyers (Practical Paula): Show Know Your Budget widget after Latest Car News */}
        {isCarBuyers && (
          <div className="home__section home__section--full-width">
            <KnowYourBudget />
          </div>
        )}

        {/* Vehicles Section with Right Column Ad */}
        <div className="home__section">
          <div className="home__left-column">
            <VehiclesSection
              title="Top Ranked Vehicles"
              vehicles={filteredVehicleItems}
              useApi={true}
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

        {/* Community Posts Promo Section */}
        <div className="home__section">
          <div className="home__left-column">
            <CommunityPostsPromo 
              title="Trending in Community"
              maxPosts={4}
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

        {/* Top Ten Sedans Carousel - Above Rankings & Awards */}
        <div className="home__section home__section--full-width">
          <TopTenCarousel 
            initialVehicleType="Sedan"
            initialSubcategory="All"
          />
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

        {/* Top Ten Trucks Carousel - Below Rankings & Awards */}
        <div className="home__section home__section--full-width">
          <TopTenCarousel 
            initialVehicleType="Truck"
            initialSubcategory="All"
          />
        </div>

        {/* Vehicle Carousel Section - Full width - Top Ten SUVs (Hidden for Car Buyers) */}
        {false && !isCarBuyers && carouselVehicles.length > 0 && (
          <div className="home__section home__section--full-width">
            <div 
              className="home__carousel"
              onMouseEnter={() => setIsSliderHovered(true)}
              onMouseLeave={() => setIsSliderHovered(false)}
            >
                {/* Top Ten Badge with Two Dropdowns - Fixed position */}
                <div className="home__carousel-badges-container">
                  {/* Vehicle Type Dropdown */}
                  <div className="home__carousel-category-badge">
                    <select 
                      className="home__carousel-category-dropdown"
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
                    <Icon name="keyboard_arrow_down" size={20} className="home__carousel-category-arrow" />
                  </div>

                  {/* Subcategory Dropdown */}
                  <div className="home__carousel-category-badge home__carousel-subcategory-badge">
                    <select 
                      className="home__carousel-category-dropdown"
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
                    <Icon name="keyboard_arrow_down" size={20} className="home__carousel-category-arrow" />
                  </div>
                </div>
                
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
                          <h2 className="home__carousel-name">#{vehicle.rank} {vehicle.name}</h2>
                          <div className="home__carousel-ratings-list">
                            <div className="home__carousel-rating-item">
                              <div className="home__carousel-rating-score-large">
                                {vehicle.staffRating.toFixed(1)}
                                <span className="home__carousel-rating-score-max">/10</span>
                              </div>
                              <div className="home__carousel-rating-label-row">
                                <img 
                                  src="https://d2kde5ohu8qb21.cloudfront.net/files/692374f1d13f5100022ddf61/mticon.svg" 
                                  alt="MotorTrend" 
                                  className="home__carousel-rating-mt-badge" 
                                  loading="eager"
                                  onError={(e) => {
                                    console.error('Failed to load MT rating icon:', e);
                                  }}
                                />
                                <span className="home__carousel-rating-motortrend-text">MotorTrend Rating</span>
                              </div>
                            </div>
                            <div className="home__carousel-rating-item home__carousel-rating-item--community">
                              {renderStarRating(vehicle.communityRating)}
                              <div className="home__carousel-rating-text">
                                User Reviews <Badge variant="info" size="sm">{(vehicle.communityRating / 2).toFixed(1)}/5</Badge>
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
                                    src="https://d2kde5ohu8qb21.cloudfront.net/files/691bde547554840002bab60c/star.svg" 
                                    alt="Your Rating Star" 
                                    className="home__carousel-rating-icon add-rate" 
                                    loading="eager"
                                    onError={(e) => {
                                      console.error('Failed to load star icon:', e);
                                    }}
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
                      onClick={() => {
                        setCurrentSlide((prev) => {
                          // If at first slide, go to previous subcategory
                          if (prev === 0) {
                            const subcategories = getSubcategoriesForType(selectedVehicleType);
                            const currentIndex = subcategories.indexOf(selectedSubcategory);
                            const prevIndex = (currentIndex - 1 + subcategories.length) % subcategories.length;
                            setSelectedSubcategory(subcategories[prevIndex]);
                            return 0; // Will be set to last slide of new subcategory after vehicles load
                          }
                          return prev - 1;
                        });
                      }}
                      aria-label="Previous slide"
                    >
                      <Icon name="chevron_left" size={24} />
                    </button>
                    <button
                      className="home__carousel-nav home__carousel-nav--next"
                      onClick={() => {
                        setCurrentSlide((prev) => {
                          const nextSlide = prev + 1;
                          
                          // If we've reached the end, switch to next subcategory
                          if (nextSlide >= carouselVehicles.length) {
                            const subcategories = getSubcategoriesForType(selectedVehicleType);
                            const currentIndex = subcategories.indexOf(selectedSubcategory);
                            const nextIndex = (currentIndex + 1) % subcategories.length;
                            setSelectedSubcategory(subcategories[nextIndex]);
                            return 0; // Start from first slide of new subcategory
                          }
                          
                          return nextSlide;
                        });
                      }}
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

        {/* Additional News Section (River 2: Stories 7-12) */}
        {sortedNewsItemsRiver2.length > 0 && (
          <div className="home__section">
            <div className="home__left-column">
              <NewsSection
                title="Latest Car News From our Experts"
                items={sortedNewsItemsRiver2}
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
        )}

        {/* Sedan Carousel Section - Full width */}
        {false && sedanCarouselVehicles.length > 0 && (
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
                          <h2 className="home__carousel-name">#{vehicle.rank} {vehicle.name}</h2>
                          <div className="home__carousel-ratings-list">
                            <div className="home__carousel-rating-item">
                              <div className="home__carousel-rating-score-large">
                                {vehicle.staffRating.toFixed(1)}
                                <span className="home__carousel-rating-score-max">/10</span>
                              </div>
                              <div className="home__carousel-rating-label-row">
                                <img 
                                  src="https://d2kde5ohu8qb21.cloudfront.net/files/692374f1d13f5100022ddf61/mticon.svg" 
                                  alt="MotorTrend" 
                                  className="home__carousel-rating-mt-badge" 
                                  loading="eager"
                                  onError={(e) => {
                                    console.error('Failed to load MT rating icon:', e);
                                  }}
                                />
                                <span className="home__carousel-rating-motortrend-text">MotorTrend Rating</span>
                              </div>
                            </div>
                            <div className="home__carousel-rating-item home__carousel-rating-item--community">
                              {renderStarRating(vehicle.communityRating)}
                              <div className="home__carousel-rating-text">
                                User Reviews <Badge variant="info" size="sm">{(vehicle.communityRating / 2).toFixed(1)}/5</Badge>
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
                                    src="https://d2kde5ohu8qb21.cloudfront.net/files/691bde547554840002bab60c/star.svg" 
                                    alt="Your Rating Star" 
                                    className="home__carousel-rating-icon add-rate" 
                                    loading="eager"
                                    onError={(e) => {
                                      console.error('Failed to load star icon:', e);
                                    }}
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

        {/* Additional News Section (River 3: Stories 13-18) */}
        {sortedNewsItemsRiver3.length > 0 && (
          <div className="home__section">
            <div className="home__left-column">
              <NewsSection
                title="Latest Car News From our Experts"
                items={sortedNewsItemsRiver3}
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
        )}

        {/* Truck Carousel Section - Full width */}
        {false && truckCarouselVehicles.length > 0 && (
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
                          <h2 className="home__carousel-name">#{vehicle.rank} {vehicle.name}</h2>
                          <div className="home__carousel-ratings-list">
                            <div className="home__carousel-rating-item">
                              <div className="home__carousel-rating-score-large">
                                {vehicle.staffRating.toFixed(1)}
                                <span className="home__carousel-rating-score-max">/10</span>
                              </div>
                              <div className="home__carousel-rating-label-row">
                                <img 
                                  src="https://d2kde5ohu8qb21.cloudfront.net/files/692374f1d13f5100022ddf61/mticon.svg" 
                                  alt="MotorTrend" 
                                  className="home__carousel-rating-mt-badge" 
                                  loading="eager"
                                  onError={(e) => {
                                    console.error('Failed to load MT rating icon:', e);
                                  }}
                                />
                                <span className="home__carousel-rating-motortrend-text">MotorTrend Rating</span>
                              </div>
                            </div>
                            <div className="home__carousel-rating-item home__carousel-rating-item--community">
                              {renderStarRating(vehicle.communityRating)}
                              <div className="home__carousel-rating-text">
                                User Reviews <Badge variant="info" size="sm">{(vehicle.communityRating / 2).toFixed(1)}/5</Badge>
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
                                    src="https://d2kde5ohu8qb21.cloudfront.net/files/691bde547554840002bab60c/star.svg" 
                                    alt="Your Rating Star" 
                                    className="home__carousel-rating-icon add-rate" 
                                    loading="eager"
                                    onError={(e) => {
                                      console.error('Failed to load star icon:', e);
                                    }}
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

                {/* Navigation Buttons - Hidden in fullscreen view */}
                {false && hasMultipleVehicles && (
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

                {/* Carousel Type Navigation Dropdowns */}
                <div className="home__fullscreen-carousel-links">
                  {/* Vehicle Type Dropdown */}
                  <div className="home__fullscreen-category-badge-wrapper">
                    <select
                      className="home__fullscreen-category-dropdown"
                      value={selectedVehicleType}
                      onChange={(e) => {
                        e.stopPropagation();
                        const newType = e.target.value as VehicleType;
                        setSelectedVehicleType(newType);
                        setSelectedSubcategory('All');
                        // Switch to the appropriate carousel
                        if (newType === 'SUV') {
                          handleSwitchToCarousel('suv');
                        } else if (newType === 'Sedan') {
                          handleSwitchToCarousel('sedan');
                        } else if (newType === 'Truck') {
                          handleSwitchToCarousel('truck');
                        }
                      }}
                      onClick={(e) => e.stopPropagation()}
                    >
                      <option value="SUV">Top Ten SUVs</option>
                      <option value="Sedan">Top Ten Sedans</option>
                      <option value="Truck">Top Ten Trucks</option>
                      <option value="Coupe">Top Ten Coupes</option>
                    </select>
                    <Icon name="keyboard_arrow_down" size={20} className="home__fullscreen-category-arrow" />
                  </div>

                  {/* Subcategory Dropdown */}
                  <div className="home__fullscreen-subcategory-badge-wrapper">
                    <select
                      className="home__fullscreen-subcategory-dropdown"
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
                    <Icon name="keyboard_arrow_down" size={20} className="home__fullscreen-subcategory-arrow" />
                  </div>
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
                    #{fullscreenVehicle.rank} {fullscreenVehicle.name}
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
                        {fullscreenVehicle.staffRating.toFixed(1)}
                      </span>
                    </div>
                  </div>
                  <div className="home__fullscreen-rating-item">
                    <div className="home__fullscreen-rating-label-wrapper">
                      <span className="home__fullscreen-rating-label-top">Community</span>
                      <span className="home__fullscreen-rating-label-bottom">
                        Rating <span className="home__fullscreen-rating-count">(25)</span>
                      </span>
                    </div>
                    <div className="home__fullscreen-rating-value-wrapper">
                      <img 
                        src="https://d2kde5ohu8qb21.cloudfront.net/files/691bde547554840002bab60c/star.svg" 
                        alt="Community Rating Star" 
                        className="home__fullscreen-rating-icon community" 
                      />
                      <span className="home__fullscreen-rating-value">
                        {(fullscreenVehicle.communityRating / 2) % 1 === 0 ? fullscreenVehicle.communityRating / 2 : (fullscreenVehicle.communityRating / 2).toFixed(1)}
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
                          src="https://d2kde5ohu8qb21.cloudfront.net/files/691bde5264217700021d6b71/star-stroke.svg" 
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




