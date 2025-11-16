/**
 * EV Hub Page Component
 * Index page for electric vehicles
 */

import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { HeroPlusThree } from '../../components/HeroPlusThree';
import { NewsSection } from '../../components/NewsSection';
import { VehiclesSection } from '../../components/VehiclesSection';
import { AdContainer } from '../../components/AdContainer';
import type { RiverItem } from '../../components/River';
import { vehicleImageFor, parseVehicleName } from '../../utils/vehicleImages';
import { articles } from '../../utils/articles';
import './EVHub.css';

// Electric vehicle database
const evDatabase = [
  '2021 Tesla Model 3', '2022 Tesla Model 3', '2023 Tesla Model 3', '2024 Tesla Model 3', '2025 Tesla Model 3',
  '2021 Tesla Model S', '2022 Tesla Model S', '2023 Tesla Model S', '2024 Tesla Model S', '2025 Tesla Model S',
  '2021 Tesla Model Y', '2022 Tesla Model Y', '2023 Tesla Model Y', '2024 Tesla Model Y', '2025 Tesla Model Y',
  '2021 Tesla Model X', '2022 Tesla Model X', '2023 Tesla Model X', '2024 Tesla Model X', '2025 Tesla Model X',
  '2022 Hyundai Ioniq 5', '2023 Hyundai Ioniq 5', '2024 Hyundai Ioniq 5', '2025 Hyundai Ioniq 5', '2026 Hyundai Ioniq 5',
  '2022 Hyundai Ioniq 6', '2023 Hyundai Ioniq 6', '2024 Hyundai Ioniq 6', '2025 Hyundai Ioniq 6', '2026 Hyundai Ioniq 6',
  '2022 Kia EV6', '2023 Kia EV6', '2024 Kia EV6', '2025 Kia EV6',
  '2022 Kia EV9', '2023 Kia EV9', '2024 Kia EV9', '2025 Kia EV9',
  '2022 Ford Mustang Mach-E', '2023 Ford Mustang Mach-E', '2024 Ford Mustang Mach-E', '2025 Ford Mustang Mach-E',
  '2022 Ford F-150 Lightning', '2023 Ford F-150 Lightning', '2024 Ford F-150 Lightning', '2025 Ford F-150 Lightning',
  '2022 Rivian R1T', '2023 Rivian R1T', '2024 Rivian R1T', '2025 Rivian R1T',
  '2022 Rivian R1S', '2023 Rivian R1S', '2024 Rivian R1S', '2025 Rivian R1S',
  '2026 Rivian R2',
  '2022 BMW i4', '2023 BMW i4', '2024 BMW i4', '2025 BMW i4',
  '2022 BMW iX', '2023 BMW iX', '2024 BMW iX', '2025 BMW iX',
  '2022 Audi e-tron', '2023 Audi e-tron', '2024 Audi e-tron', '2025 Audi e-tron',
  '2022 Audi e-tron GT', '2023 Audi e-tron GT', '2024 Audi e-tron GT', '2025 Audi e-tron GT',
  '2022 Mercedes EQS', '2023 Mercedes EQS', '2024 Mercedes EQS', '2025 Mercedes EQS',
  '2022 Mercedes EQE', '2023 Mercedes EQE', '2024 Mercedes EQE', '2025 Mercedes EQE',
  '2022 Chevrolet Bolt EV', '2023 Chevrolet Bolt EV', '2024 Chevrolet Bolt EV', '2025 Chevrolet Bolt EV',
  '2022 Chevrolet Bolt EUV', '2023 Chevrolet Bolt EUV', '2024 Chevrolet Bolt EUV', '2025 Chevrolet Bolt EUV',
  '2022 Cadillac Lyriq', '2023 Cadillac Lyriq', '2024 Cadillac Lyriq', '2025 Cadillac Lyriq',
  '2026 Cadillac Optiq',
  '2022 Nissan Leaf', '2023 Nissan Leaf', '2024 Nissan Leaf', '2025 Nissan Leaf',
  '2022 Nissan Ariya', '2023 Nissan Ariya', '2024 Nissan Ariya', '2025 Nissan Ariya',
  '2022 Polestar 2', '2023 Polestar 2', '2024 Polestar 2', '2025 Polestar 2',
  '2022 Lucid Air', '2023 Lucid Air', '2024 Lucid Air', '2025 Lucid Air',
];

const EVHub: React.FC = () => {
  const navigate = useNavigate();

  // Get unique EVs (by make/model/year)
  const uniqueEVs = useMemo(() => {
    const seen = new Set<string>();
    const unique: string[] = [];
    
    evDatabase.forEach(vehicle => {
      if (!seen.has(vehicle)) {
        seen.add(vehicle);
        unique.push(vehicle);
      }
    });
    
    // Sort by year descending (newest first)
    return unique.sort((a, b) => {
      const yearA = parseInt(a.match(/^(\d{4})\s/)?.[1] || '0', 10);
      const yearB = parseInt(b.match(/^(\d{4})\s/)?.[1] || '0', 10);
      return yearB - yearA;
    });
  }, []);

  // Hero data - use first EV
  const heroData = useMemo(() => {
    if (uniqueEVs.length > 0) {
      const firstEV = uniqueEVs[0];
      const parsed = parseVehicleName(firstEV);
      return {
        imageUrl: vehicleImageFor(firstEV),
        title: `${firstEV} Review: The Future of Electric Driving`,
        onClick: () => {
          navigate(`/vehicles/${parsed.year}/${parsed.make}/${parsed.model}`);
        },
      };
    }
    return {
      imageUrl: 'https://d2kde5ohu8qb21.cloudfront.net/files/686ecc3b8b30d500028d902a/2026-hyundai-ioniq-6-n-side-motion.jpg',
      title: 'EV Hub: Your Guide to Electric Vehicles',
      onClick: () => navigate('/ev-hub'),
    };
  }, [uniqueEVs, navigate]);

  // Vertical cards - use next 3 EVs
  const verticalCards = useMemo(() => {
    return uniqueEVs.slice(1, 4).map(vehicle => {
      const parsed = parseVehicleName(vehicle);
      return {
        imageUrl: vehicleImageFor(vehicle),
        title: `${vehicle} First Drive: Is It Worth Going Electric?`,
        type: 'Article' as const,
        onClick: () => {
          navigate(`/vehicles/${parsed.year}/${parsed.make}/${parsed.model}`);
        },
      };
    });
  }, [uniqueEVs, navigate]);

  // Vehicles for VehiclesSection - use EVs (skip first 4 used in hero)
  const vehiclesData = useMemo(() => {
    return uniqueEVs.slice(4).map(vehicle => ({
      name: vehicle
    }));
  }, [uniqueEVs]);

  // Get EV-related articles
  const evArticles = useMemo(() => {
    return Object.entries(articles)
      .filter(([, article]) => {
        const titleLower = article.title.toLowerCase();
        const contentLower = article.content.map(c => c.text).join(' ').toLowerCase();
        return titleLower.includes('electric') || 
               titleLower.includes('ev') || 
               titleLower.includes('ioniq') || 
               titleLower.includes('tesla') ||
               titleLower.includes('rivian') ||
               contentLower.includes('electric') ||
               contentLower.includes('ev');
      })
      .map(([slug, article]) => ({ slug, article }))
      .sort((a, b) => {
        const dateA = new Date(a.article.date).getTime();
        const dateB = new Date(b.article.date).getTime();
        return dateB - dateA;
      })
      .slice(0, 6);
  }, []);

  // News items - EV articles
  const newsItems = useMemo(() => {
    if (evArticles.length > 0) {
      return evArticles.map(({ slug, article }) => ({
        imageUrl: article.heroImage,
        title: article.title,
        author: article.author,
        date: article.date,
        category: `MotorTrend | ${article.category}`,
        onClick: () => {
          navigate(`/article/${slug}`);
        },
      })) as RiverItem[];
    }
    
    // Fallback news items if no EV articles found
    return [
      {
        imageUrl: 'https://d2kde5ohu8qb21.cloudfront.net/files/686ecc3b8b30d500028d902a/2026-hyundai-ioniq-6-n-side-motion.jpg',
        title: '2026 Hyundai Ioniq 6 N First Drive: Watch Out, BMW M3, C63 AMG!',
        author: 'Alex Leanse',
        date: 'Nov 07, 2025',
        category: 'MotorTrend | Reviews',
        onClick: () => {
          navigate('/article/2026-hyundai-ioniq-6-n-first-drive-review');
        },
      },
      {
        imageUrl: 'https://d2kde5ohu8qb21.cloudfront.net/files/690bfd60f33e300002f8eeeb/024-2025-tesla-model-y-awd.jpg',
        title: 'The Tesla Model Y Premium RWD Is a Better Computer Than It Is a Car',
        author: 'Billy Rehbock',
        date: 'Nov 05, 2025',
        category: 'MotorTrend | Reviews',
        onClick: () => {
          navigate('/article/2025-tesla-model-y-first-test-review');
        },
      },
      {
        imageUrl: 'https://d2kde5ohu8qb21.cloudfront.net/files/65f806260315ac000873e1d6/2026-rivian-r2-ev-suv-13.jpg',
        title: 'Rivian Reveals New Details on the 2026 R2 Midsize SUV Ahead of Production',
        author: 'Justin Banner',
        date: 'Nov 06, 2025',
        category: 'MotorTrend | News',
        onClick: () => {
          navigate('/article/new-details-2026-rivian-r2-ev-suv-battery-charging');
        },
      },
      {
        imageUrl: 'https://d2kde5ohu8qb21.cloudfront.net/files/65bbec15236e4600085bb3e8/2019-acura-nsx-07.jpg',
        title: 'Yes! Honda\'s Electric Sports Car Is Real, but Timing Remains Uncertain',
        author: 'Alisa Priddle',
        date: 'Nov 06, 2025',
        category: 'MotorTrend | News',
        onClick: () => {
          navigate('/article/honda-electric-sports-car-timing-uncertain');
        },
      },
      {
        imageUrl: 'https://d2kde5ohu8qb21.cloudfront.net/files/677ef7efb1d4b8000850e710/010-2024-kia-ev9-land.jpg',
        title: 'I Lived with a Kia EV9 for a Year. There\'s Only One Thing I Would Change.',
        author: 'Eric Tingwall',
        date: 'Nov 07, 2025',
        category: 'MotorTrend | Reviews',
        onClick: () => {
          navigate('/article/2024-kia-ev9-yearlong-review-verdict');
        },
      },
      {
        imageUrl: 'https://d2kde5ohu8qb21.cloudfront.net/files/690ba4a7cfe755000270cb92/5-longbow-speedster-electric-sports-car.jpg',
        title: 'This 1,973-Pound Electric Sports Car Nails What Tesla Still Can\'t',
        author: 'Angus MacKenzie',
        date: 'Nov 06, 2025',
        category: 'MotorTrend | Reviews',
        onClick: () => {
          navigate('/article/longbow-speedster-electric-sports-car');
        },
      },
    ] as RiverItem[];
  }, [evArticles, navigate]);

  return (
    <div className="ev-hub">
      <div className="ev-hub__container">
        {/* Hero + 3 Cards Section */}
        <div className="ev-hub__section">
          <div className="ev-hub__left-column">
            <HeroPlusThree
              hero={heroData}
              cards={verticalCards}
            />
          </div>
          <div className="ev-hub__right-column">
            <AdContainer
              width={300}
              height={250}
              label="300 x 250"
              position="right-column"
              imageUrl="https://d2kde5ohu8qb21.cloudfront.net/files/69116380f5e41e00020d3432/822789964589118228.jpeg"
            />
          </div>
        </div>

        {/* Vehicles Section */}
        {vehiclesData.length > 0 && (
          <div className="ev-hub__section">
            <div className="ev-hub__left-column">
              <VehiclesSection
                title="Electric Vehicles"
                vehicles={vehiclesData}
                showMoreVisible={vehiclesData.length > 6}
                onShowMore={() => {
                  // Handle show more action if needed
                  console.log('Show more vehicles');
                }}
              />
            </div>
            <div className="ev-hub__right-column">
              <AdContainer
                width={300}
                height={600}
                label="SVOD 200 x 420"
                position="right-column"
                imageUrl="https://d2kde5ohu8qb21.cloudfront.net/files/691163e3e8557700022eb5d9/4347518532106070908.png"
              />
            </div>
          </div>
        )}

        {/* News Section (River) */}
        {newsItems.length > 0 && (
          <div className="ev-hub__section">
            <div className="ev-hub__left-column">
              <NewsSection
                title="Latest EV News & Reviews"
                items={newsItems}
              />
            </div>
            <div className="ev-hub__right-column">
              <AdContainer
                width={300}
                height={600}
                label="SVOD 200 x 420"
                position="right-column"
                imageUrl="https://d2kde5ohu8qb21.cloudfront.net/files/691163e3e8557700022eb5d9/4347518532106070908.png"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EVHub;

