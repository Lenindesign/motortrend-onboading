/**
 * Compare Vehicles Page Component
 * Index page for comparing vehicles side by side
 */

import React, { useMemo, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { HeroPlusThree } from '../../components/HeroPlusThree';
import { NewsSection } from '../../components/NewsSection';
import { ComparisonCard } from '../../components/ComparisonCard';
import { AdContainer } from '../../components/AdContainer';
import type { RiverItem } from '../../components/River';
import { vehicleImageFor, parseVehicleName } from '../../utils/vehicleImages';
import './CompareVehicles.css';

// Popular vehicle comparisons
const popularComparisons = [
  {
    vehicle1: '2025 Ford Bronco',
    vehicle2: '2025 Ford Bronco Sport',
  },
  {
    vehicle1: '2025 Ford Mustang',
    vehicle2: '2025 Chevrolet Camaro',
  },
  {
    vehicle1: '2025 Tesla Model 3',
    vehicle2: '2025 BMW 3 Series',
  },
  {
    vehicle1: '2025 Honda Civic',
    vehicle2: '2025 Toyota Camry',
  },
  {
    vehicle1: '2025 Subaru WRX',
    vehicle2: '2025 Subaru BRZ',
  },
  {
    vehicle1: '2025 Ford F-150',
    vehicle2: '2025 Chevrolet Silverado',
  },
  {
    vehicle1: '2025 Audi A4',
    vehicle2: '2025 Mercedes C-Class',
  },
  {
    vehicle1: '2025 Lexus IS',
    vehicle2: '2025 Acura TLX',
  },
];

const CompareVehicles: React.FC = () => {
  const navigate = useNavigate();
  const [savedComparisons, setSavedComparisons] = useState<Set<string>>(new Set());

  // Load saved comparisons from localStorage
  useEffect(() => {
    try {
      const savedComparisonsJson = localStorage.getItem('savedComparisons');
      if (savedComparisonsJson) {
        const saved: string[] = JSON.parse(savedComparisonsJson);
        setSavedComparisons(new Set(saved));
      }
    } catch (error) {
      console.error('Error loading saved comparisons:', error);
    }
  }, []);

  const handleBookmarkComparison = (comparisonId: string) => {
    const newSavedComparisons = new Set(savedComparisons);
    if (newSavedComparisons.has(comparisonId)) {
      newSavedComparisons.delete(comparisonId);
    } else {
      newSavedComparisons.add(comparisonId);
    }
    setSavedComparisons(newSavedComparisons);
    
    // Save to localStorage
    localStorage.setItem('savedComparisons', JSON.stringify(Array.from(newSavedComparisons)));
  };

  const handleViewComparison = (vehicle1: string, vehicle2: string) => {
    const parsed1 = parseVehicleName(vehicle1);
    const parsed2 = parseVehicleName(vehicle2);
    // Navigate to a comparison detail page or show comparison modal
    navigate(`/compare/${parsed1.year}/${parsed1.make}/${parsed1.model}/vs/${parsed2.year}/${parsed2.make}/${parsed2.model}`);
  };

  // Hero data - first comparison
  const heroData = useMemo(() => {
    if (popularComparisons.length > 0) {
      const firstComparison = popularComparisons[0];
      return {
        imageUrl: vehicleImageFor(firstComparison.vehicle1),
        title: `${firstComparison.vehicle1} vs ${firstComparison.vehicle2}: Which One Should You Choose?`,
        onClick: () => handleViewComparison(firstComparison.vehicle1, firstComparison.vehicle2),
      };
    }
    return {
      imageUrl: 'https://www.motortrend.com/files/686ecc3b8b30d500028d902a/2026-hyundai-ioniq-6-n-side-motion.jpg',
      title: 'Compare Vehicles: Side-by-Side Vehicle Comparisons',
      onClick: () => navigate('/compare-vehicles'),
    };
  }, [navigate]);

  // Vertical cards - next 3 comparisons
  const verticalCards = useMemo(() => {
    return popularComparisons.slice(1, 4).map(comparison => ({
      imageUrl: vehicleImageFor(comparison.vehicle1),
      title: `${comparison.vehicle1} vs ${comparison.vehicle2}`,
      type: 'Article' as const,
      onClick: () => handleViewComparison(comparison.vehicle1, comparison.vehicle2),
    }));
  }, []);

  // News items - comparison articles
  const newsItems = useMemo(() => [
    {
      imageUrl: 'https://www.motortrend.com/files/67524b260884870008fa1a2e/1-2025-subaru-wrx-ts-front-view.jpg',
      title: '2025 Ford Bronco vs 2025 Jeep Wrangler: Off-Road Showdown',
      author: 'MotorTrend Editorial',
      date: 'Jan 20, 2025',
      category: 'MotorTrend | Comparison',
      onClick: () => {
        navigate('/articles/ford-bronco-vs-jeep-wrangler-comparison');
      },
    },
    {
      imageUrl: 'https://www.motortrend.com/files/690bfd60f33e300002f8eeeb/024-2025-tesla-model-y-awd.jpg',
      title: '2025 Tesla Model 3 vs 2025 BMW 3 Series: Electric vs Gas',
      author: 'Alex Leanse',
      date: 'Jan 18, 2025',
      category: 'MotorTrend | Comparison',
      onClick: () => {
        navigate('/articles/tesla-model-3-vs-bmw-3-series-comparison');
      },
    },
    {
      imageUrl: 'https://www.motortrend.com/files/690a603369a9550002fb94bc/021-2026-honda-passport-rtl.jpg',
      title: '2025 Honda Civic vs 2025 Toyota Corolla: Compact Car Battle',
      author: 'Eric Tingwall',
      date: 'Jan 15, 2025',
      category: 'MotorTrend | Comparison',
      onClick: () => {
        navigate('/articles/honda-civic-vs-toyota-corolla-comparison');
      },
    },
    {
      imageUrl: 'https://www.motortrend.com/files/690b0330f4ad5b00020ded90/2026-bmw-m2-cs-side-motion.jpg',
      title: '2025 Ford Mustang vs 2025 Chevrolet Camaro: Muscle Car Rivalry',
      author: 'Frank Markus',
      date: 'Jan 12, 2025',
      category: 'MotorTrend | Comparison',
      onClick: () => {
        navigate('/articles/ford-mustang-vs-chevrolet-camaro-comparison');
      },
    },
    {
      imageUrl: 'https://www.motortrend.com/files/684317270ba4360008f118a0/2026cadillacoptiq-v9.jpg',
      title: '2025 Audi A4 vs 2025 Mercedes C-Class: Luxury Sedan Face-Off',
      author: 'MotorTrend Editorial',
      date: 'Jan 10, 2025',
      category: 'MotorTrend | Comparison',
      onClick: () => {
        navigate('/articles/audi-a4-vs-mercedes-c-class-comparison');
      },
    },
    {
      imageUrl: 'https://www.motortrend.com/files/65bbec15236e4600085bb3e8/2019-acura-nsx-07.jpg',
      title: '2025 Ford F-150 vs 2025 Chevrolet Silverado: Pickup Truck Comparison',
      author: 'Alisa Priddle',
      date: 'Jan 08, 2025',
      category: 'MotorTrend | Comparison',
      onClick: () => {
        navigate('/articles/ford-f150-vs-chevrolet-silverado-comparison');
      },
    },
  ] as RiverItem[], [navigate]);

  return (
    <div className="compare-vehicles">
      <div className="compare-vehicles__container">
        {/* Hero + 3 Cards Section */}
        <div className="compare-vehicles__section">
          <div className="compare-vehicles__left-column">
            <HeroPlusThree
              hero={heroData}
              cards={verticalCards}
            />
          </div>
          <div className="compare-vehicles__right-column">
            <AdContainer
              width={300}
              height={250}
              label="300 x 250"
              position="right-column"
              imageUrl="https://www.motortrend.com/files/69116380f5e41e00020d3432/822789964589118228.jpeg"
            />
          </div>
        </div>

        {/* Comparisons Grid Section */}
        <div className="compare-vehicles__section">
          <div className="compare-vehicles__left-column">
            <div className="compare-vehicles__comparisons">
              <h2 className="compare-vehicles__section-title">Popular Comparisons</h2>
              <div className="compare-vehicles__grid">
                {popularComparisons.map((comparison, index) => {
                  const comparisonId = `comparison-${index}`;
                  return (
                    <ComparisonCard
                      key={comparisonId}
                      vehicle1={{
                        image: vehicleImageFor(comparison.vehicle1),
                        name: comparison.vehicle1,
                      }}
                      vehicle2={{
                        image: vehicleImageFor(comparison.vehicle2),
                        name: comparison.vehicle2,
                      }}
                      isBookmarked={savedComparisons.has(comparisonId)}
                      onBookmark={() => handleBookmarkComparison(comparisonId)}
                      onViewComparison={() => handleViewComparison(comparison.vehicle1, comparison.vehicle2)}
                    />
                  );
                })}
              </div>
            </div>
          </div>
          <div className="compare-vehicles__right-column">
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
        <div className="compare-vehicles__section">
          <div className="compare-vehicles__left-column">
            <NewsSection
              title="Latest Comparison Articles"
              items={newsItems}
            />
          </div>
          <div className="compare-vehicles__right-column">
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

export default CompareVehicles;

