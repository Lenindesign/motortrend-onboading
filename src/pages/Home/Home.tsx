/**
 * Home Page Component
 * MotorTrend home page based on Figma design
 */

import React, { useMemo, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { HeroPlusThree } from '../../components/HeroPlusThree';
import { NewsSection } from '../../components/NewsSection';
import { VehiclesSection, type VehicleItem } from '../../components/VehiclesSection';
import { AdContainer } from '../../components/AdContainer';
import type { RiverItem } from '../../components/River';
import { sortContentByUserType, type ContentCategory } from '../../utils/contentFiltering';
import { getVehicleLifestyles, type LifestyleCategory } from '../../utils/vehicleLifestyles';
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
];

// Sample data - in production, this would come from an API
// Note: verticalCards and newsItems will be created inside component to use navigate

// Convert carDatabase to VehicleItem format
const allVehicleItems: VehicleItem[] = carDatabase.map(name => ({ name }));

export const Home: React.FC = () => {
  const navigate = useNavigate();
  // Get user type from onboarding data - make it reactive
  const [userType, setUserType] = useState<string | null>(null);

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

  // State to track how many vehicles to display
  const [displayCount, setDisplayCount] = useState<number>(6);

  // Reset display count when userType changes
  useEffect(() => {
    setDisplayCount(6);
  }, [userType]);

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
        ? ['Family & Practical', 'Daily Commute']
        : userType === 'enthusiast'
        ? ['Performance & Enthusiast']
        : userType === 'both'
        ? ['Family & Practical', 'Performance & Enthusiast']
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

  // Get vehicles to display based on displayCount
  const displayedVehicles = useMemo(() => {
    return filteredVehicleItems.slice(0, displayCount);
  }, [filteredVehicleItems, displayCount]);

  // Handle "Show More" button click
  const handleShowMore = () => {
    setDisplayCount(prev => prev + 12);
  };

  // Check if there are more vehicles to show
  const hasMoreVehicles = displayCount < filteredVehicleItems.length;

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

        {/* News Section with Right Column Ad */}
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
              vehicles={displayedVehicles}
              onShowMore={handleShowMore}
              showMoreVisible={hasMoreVehicles}
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

        {/* Additional News Section */}
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
      </div>
    </div>
  );
};

export default Home;

