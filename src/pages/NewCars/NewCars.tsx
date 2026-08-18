/**
 * New Cars Page Component
 * Shows only 2025 model year vehicles
 */

import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { HeroPlusThree } from '../../components/HeroPlusThree';
import { NewsSection } from '../../components/NewsSection';
import { VehiclesSection } from '../../components/VehiclesSection';
import { AdContainer } from '../../components/AdContainer';
import type { RiverItem } from '../../components/River';
import type { ContentCategory } from '../../utils/contentFiltering';
import { vehicleImageFor, parseVehicleName } from '../../utils/vehicleImages';
import './NewCars.css';

// Full vehicle database
const carDatabase = [
  '2015 Subaru WRX', '2021 Subaru WRX', '2018 Subaru WRX', '2017 Subaru WRX', '2024 Subaru WRX', '2022 Subaru WRX', '2025 Subaru WRX',
  '2020 Honda Civic', '2021 Honda Civic', '2022 Honda Civic', '2023 Honda Civic', '2024 Honda Civic', '2025 Honda Civic',
  '2019 Toyota Camry', '2020 Toyota Camry', '2021 Toyota Camry', '2022 Toyota Camry', '2023 Toyota Camry', '2024 Toyota Camry', '2025 Toyota Camry',
  '2020 Ford Mustang', '2021 Ford Mustang', '2022 Ford Mustang', '2023 Ford Mustang', '2024 Ford Mustang', '2025 Ford Mustang',
  '2021 Tesla Model 3', '2022 Tesla Model 3', '2023 Tesla Model 3', '2024 Tesla Model 3', '2025 Tesla Model 3',
  '2020 BMW 3 Series', '2021 BMW 3 Series', '2022 BMW 3 Series', '2023 BMW 3 Series', '2024 BMW 3 Series', '2025 BMW 3 Series',
  '2019 Audi A4', '2020 Audi A4', '2021 Audi A4', '2022 Audi A4', '2023 Audi A4', '2024 Audi A4', '2025 Audi A4',
  '2020 Mercedes C-Class', '2021 Mercedes C-Class', '2022 Mercedes C-Class', '2023 Mercedes C-Class', '2024 Mercedes C-Class', '2025 Mercedes C-Class',
  '2021 Nissan Altima', '2022 Nissan Altima', '2023 Nissan Altima', '2024 Nissan Altima', '2025 Nissan Altima',
  '2020 Chevrolet Camaro', '2021 Chevrolet Camaro', '2022 Chevrolet Camaro', '2023 Chevrolet Camaro', '2024 Chevrolet Camaro', '2025 Chevrolet Camaro',
  '2021 Dodge Challenger', '2022 Dodge Challenger', '2023 Dodge Challenger', '2024 Dodge Challenger',
  '2020 Lexus IS', '2021 Lexus IS', '2022 Lexus IS', '2023 Lexus IS', '2024 Lexus IS', '2025 Lexus IS',
  '2021 Infiniti Q50', '2022 Infiniti Q50', '2023 Infiniti Q50', '2024 Infiniti Q50', '2025 Infiniti Q50',
  '2020 Acura TLX', '2021 Acura TLX', '2022 Acura TLX', '2023 Acura TLX', '2024 Acura TLX', '2025 Acura TLX',
  '2021 Genesis G70', '2022 Genesis G70', '2023 Genesis G70', '2024 Genesis G70', '2025 Genesis G70',
  '2020 Volvo S60', '2021 Volvo S60', '2022 Volvo S60', '2023 Volvo S60', '2024 Volvo S60', '2025 Volvo S60',
  '2021 Cadillac CT4', '2022 Cadillac CT4', '2023 Cadillac CT4', '2024 Cadillac CT4', '2025 Cadillac CT4',
  '2020 Jaguar XE', '2021 Jaguar XE', '2022 Jaguar XE', '2023 Jaguar XE', '2024 Jaguar XE', '2025 Jaguar XE',
  '2021 Alfa Romeo Giulia', '2022 Alfa Romeo Giulia', '2023 Alfa Romeo Giulia', '2024 Alfa Romeo Giulia', '2025 Alfa Romeo Giulia',
  '2020 Kia Stinger', '2021 Kia Stinger', '2022 Kia Stinger', '2023 Kia Stinger', '2024 Kia Stinger', '2025 Kia Stinger',
  '2021 Hyundai Sonata', '2022 Hyundai Sonata', '2023 Hyundai Sonata', '2024 Hyundai Sonata', '2025 Hyundai Sonata',
  '2020 Mazda6', '2021 Mazda6', '2022 Mazda6', '2023 Mazda6', '2024 Mazda6', '2025 Mazda6',
  '2020 Subaru Legacy', '2021 Subaru Legacy', '2022 Subaru Legacy', '2023 Subaru Legacy', '2024 Subaru Legacy', '2025 Subaru Legacy',
  '2020 Subaru Impreza', '2021 Subaru Impreza', '2022 Subaru Impreza', '2023 Subaru Impreza', '2024 Subaru Impreza', '2025 Subaru Impreza',
  '2020 Subaru Outback', '2021 Subaru Outback', '2022 Subaru Outback', '2023 Subaru Outback', '2024 Subaru Outback', '2025 Subaru Outback',
  '2020 Subaru Forester', '2021 Subaru Forester', '2022 Subaru Forester', '2023 Subaru Forester', '2024 Subaru Forester', '2025 Subaru Forester',
  '2020 Subaru Ascent', '2021 Subaru Ascent', '2022 Subaru Ascent', '2023 Subaru Ascent', '2024 Subaru Ascent', '2025 Subaru Ascent',
  '2020 Subaru Crosstrek', '2021 Subaru Crosstrek', '2022 Subaru Crosstrek', '2023 Subaru Crosstrek', '2024 Subaru Crosstrek', '2025 Subaru Crosstrek',
  '2020 Subaru BRZ', '2021 Subaru BRZ', '2022 Subaru BRZ', '2023 Subaru BRZ', '2024 Subaru BRZ', '2025 Subaru BRZ',
  '2020 Subaru WRX STI', '2021 Subaru WRX STI', '2022 Subaru WRX STI', '2023 Subaru WRX STI', '2024 Subaru WRX STI', '2025 Subaru WRX STI',
  '2020 Ford F-150', '2021 Ford F-150', '2022 Ford F-150', '2023 Ford F-150', '2024 Ford F-150', '2025 Ford F-150', '2026 Ford F-150',
  '2020 Ford Explorer', '2021 Ford Explorer', '2022 Ford Explorer', '2023 Ford Explorer', '2024 Ford Explorer', '2025 Ford Explorer',
  '2020 Ford Escape', '2021 Ford Escape', '2022 Ford Escape', '2023 Ford Escape', '2024 Ford Escape', '2025 Ford Escape',
  '2020 Ford Edge', '2021 Ford Edge', '2022 Ford Edge', '2023 Ford Edge', '2024 Ford Edge', '2025 Ford Edge',
  '2020 Ford Bronco', '2021 Ford Bronco', '2022 Ford Bronco', '2023 Ford Bronco', '2024 Ford Bronco', '2025 Ford Bronco',
  '2020 Ford Bronco Sport', '2021 Ford Bronco Sport', '2022 Ford Bronco Sport', '2023 Ford Bronco Sport', '2024 Ford Bronco Sport', '2025 Ford Bronco Sport',
  '2020 Ford Ranger', '2021 Ford Ranger', '2022 Ford Ranger', '2023 Ford Ranger', '2024 Ford Ranger', '2025 Ford Ranger',
  '2020 Ford Maverick', '2021 Ford Maverick', '2022 Ford Maverick', '2023 Ford Maverick', '2024 Ford Maverick', '2025 Ford Maverick',
  '2020 Chevrolet Silverado', '2021 Chevrolet Silverado', '2022 Chevrolet Silverado', '2023 Chevrolet Silverado', '2024 Chevrolet Silverado', '2025 Chevrolet Silverado',
];

const NewCars: React.FC = () => {
  const navigate = useNavigate();

  // Filter for 2025 vehicles only
  const vehicles2025 = useMemo(() => {
    return carDatabase.filter(vehicleName => {
      const yearMatch = vehicleName.match(/^2025\s/);
      return yearMatch !== null;
    });
  }, []);

  // Get unique 2025 vehicles (by make/model)
  const unique2025Vehicles = useMemo(() => {
    const seen = new Map<string, string>();
    const unique: string[] = [];
    
    vehicles2025.forEach(vehicle => {
      // Extract make and model (everything after "2025 ")
      const makeModel = vehicle.replace(/^2025\s/, '').toLowerCase();
      if (!seen.has(makeModel)) {
        seen.set(makeModel, vehicle);
        unique.push(vehicle);
      }
    });
    
    return unique;
  }, [vehicles2025]);

  // Hero data - use first 2025 vehicle or a featured article
  const heroData = useMemo(() => {
    if (unique2025Vehicles.length > 0) {
      const firstVehicle = unique2025Vehicles[0];
      return {
        imageUrl: vehicleImageFor(firstVehicle),
        title: `2025 ${firstVehicle.replace(/^2025\s/, '')} First Look: What's New This Year`,
        onClick: () => {
          const parsed = parseVehicleName(firstVehicle);
          navigate(`/vehicles/${parsed.year}/${parsed.make}/${parsed.model}`);
        },
      };
    }
    return {
      imageUrl: 'https://www.motortrend.com/files/686ecc3b8b30d500028d902a/2026-hyundai-ioniq-6-n-side-motion.jpg',
      title: '2025 New Car Models: Everything You Need to Know',
      onClick: () => navigate('/articles/2025-new-car-models'),
    };
  }, [unique2025Vehicles, navigate]);

  // Vertical cards - use next 3 unique 2025 vehicles
  const verticalCards = useMemo(() => {
    return unique2025Vehicles.slice(1, 4).map(vehicle => ({
      imageUrl: vehicleImageFor(vehicle),
      title: `2025 ${vehicle.replace(/^2025\s/, '')} Review: First Drive Impressions`,
      type: 'Article' as const,
      onClick: () => {
        const parsed = parseVehicleName(vehicle);
        navigate(`/vehicles/${parsed.year}/${parsed.make}/${parsed.model}`);
      },
    }));
  }, [unique2025Vehicles, navigate]);

  // Vehicles for VehiclesSection - use 2025 vehicles (skip first 4 used in hero)
  const vehiclesData = useMemo(() => {
    return unique2025Vehicles.slice(4).map(vehicle => ({
      name: vehicle
    }));
  }, [unique2025Vehicles]);

  // News items - articles about 2025 vehicles
  const newsItems = useMemo(() => [
    {
      imageUrl: 'https://www.motortrend.com/files/67524b260884870008fa1a2e/1-2025-subaru-wrx-ts-front-view.jpg',
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
      imageUrl: 'https://www.motortrend.com/files/690bfd60f33e300002f8eeeb/024-2025-tesla-model-y-awd.jpg',
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
      imageUrl: 'https://www.motortrend.com/files/690a603369a9550002fb94bc/021-2026-honda-passport-rtl.jpg',
      title: 'The Honda Passport RTL Is the One You Need, Not the One You Want',
      author: 'Alex Leanse',
      date: 'Nov 04, 2025',
      category: 'MotorTrend | Reviews',
      categories: ['Family & Practical'] as ContentCategory[],
      onClick: () => {
        navigate('/articles/2026-honda-passport-rtl-first-test-review');
      },
    },
    {
      imageUrl: 'https://www.motortrend.com/files/690b0330f4ad5b00020ded90/2026-bmw-m2-cs-side-motion.jpg',
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
      imageUrl: 'https://www.motortrend.com/files/684317270ba4360008f118a0/2026cadillacoptiq-v9.jpg',
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
      imageUrl: 'https://www.motortrend.com/files/65bbec15236e4600085bb3e8/2019-acura-nsx-07.jpg',
      title: 'Yes! Honda\'s Electric Sports Car Is Real, but Timing Remains Uncertain',
      author: 'Alisa Priddle',
      date: 'Nov 06, 2025',
      category: 'MotorTrend | News',
      categories: ['Performance & Enthusiast'] as ContentCategory[],
      onClick: () => {
        navigate('/articles/honda-electric-sports-car-timing-uncertain');
      },
    },
  ] as (RiverItem & { categories?: ContentCategory[] })[], [navigate]);

  return (
    <div className="new-cars">
      <div className="new-cars__container">
        {/* Hero + 3 Cards Section */}
        <div className="new-cars__section">
          <div className="new-cars__left-column">
            <HeroPlusThree
              hero={heroData}
              cards={verticalCards}
            />
          </div>
          <div className="new-cars__right-column">
            <AdContainer
              width={300}
              height={250}
              label="300 x 250"
              position="right-column"
              imageUrl="https://www.motortrend.com/files/69116380f5e41e00020d3432/822789964589118228.jpeg"
            />
          </div>
        </div>

        {/* Vehicles Section */}
        <div className="new-cars__section">
          <div className="new-cars__left-column">
            <VehiclesSection
              title="Vehicles"
              vehicles={vehiclesData}
              showMoreVisible={vehiclesData.length > 6}
              onShowMore={() => {
                // Handle show more action if needed
                console.log('Show more vehicles');
              }}
            />
          </div>
          <div className="new-cars__right-column">
            <AdContainer
              width={300}
              height={600}
              label="SVOD 200 x 420"
              position="right-column"
              imageUrl="https://www.motortrend.com/files/691163e3e8557700022eb5d9/4347518532106070908.png"
            />
          </div>
        </div>

        {/* News Section (River) */}
        <div className="new-cars__section">
          <div className="new-cars__left-column">
            <NewsSection
              title="Latest 2025 Model Reviews"
              items={newsItems}
            />
          </div>
          <div className="new-cars__right-column">
            <AdContainer
              width={300}
              height={600}
              label="SVOD 200 x 420"
              position="right-column"
              imageUrl="https://www.motortrend.com/files/691163e3e8557700022eb5d9/4347518532106070908.png"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewCars;

