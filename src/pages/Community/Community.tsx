/**
 * Community Page Component
 * Index page displaying community content, forums, and popular vehicles
 */

import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { HeroPlusThree } from '../../components/HeroPlusThree';
import { NewsSection } from '../../components/NewsSection';
import { VehiclesSection } from '../../components/VehiclesSection';
import { AdContainer } from '../../components/AdContainer';
import type { RiverItem } from '../../components/River';
import { articles } from '../../utils/articles';
import './Community.css';

// Full vehicle database
const carDatabase = [
  '2015 Subaru WRX', '2021 Subaru WRX', '2018 Subaru WRX', '2017 Subaru WRX', '2024 Subaru WRX', '2022 Subaru WRX', '2025 Subaru WRX', '2026 Subaru WRX',
  '2020 Honda Civic', '2021 Honda Civic', '2022 Honda Civic', '2023 Honda Civic', '2024 Honda Civic', '2025 Honda Civic', '2026 Honda Civic',
  '2019 Toyota Camry', '2020 Toyota Camry', '2021 Toyota Camry', '2022 Toyota Camry', '2023 Toyota Camry', '2024 Toyota Camry', '2025 Toyota Camry', '2026 Toyota Camry',
  '2020 Ford Mustang', '2021 Ford Mustang', '2022 Ford Mustang', '2023 Ford Mustang', '2024 Ford Mustang', '2025 Ford Mustang', '2026 Ford Mustang',
  '2021 Tesla Model 3', '2022 Tesla Model 3', '2023 Tesla Model 3', '2024 Tesla Model 3', '2025 Tesla Model 3', '2026 Tesla Model 3',
  '2020 BMW 3 Series', '2021 BMW 3 Series', '2022 BMW 3 Series', '2023 BMW 3 Series', '2024 BMW 3 Series', '2025 BMW 3 Series', '2026 BMW 3 Series',
  '2019 Audi A4', '2020 Audi A4', '2021 Audi A4', '2022 Audi A4', '2023 Audi A4', '2024 Audi A4', '2025 Audi A4', '2026 Audi A4',
  '2020 Mercedes C-Class', '2021 Mercedes C-Class', '2022 Mercedes C-Class', '2023 Mercedes C-Class', '2024 Mercedes C-Class', '2025 Mercedes C-Class', '2026 Mercedes C-Class',
  '2021 Nissan Altima', '2022 Nissan Altima', '2023 Nissan Altima', '2024 Nissan Altima', '2025 Nissan Altima', '2026 Nissan Altima',
  '2020 Chevrolet Camaro', '2021 Chevrolet Camaro', '2022 Chevrolet Camaro', '2023 Chevrolet Camaro', '2024 Chevrolet Camaro', '2025 Chevrolet Camaro', '2026 Chevrolet Camaro',
  '2021 Dodge Challenger', '2022 Dodge Challenger', '2023 Dodge Challenger', '2024 Dodge Challenger',
  '2020 Lexus IS', '2021 Lexus IS', '2022 Lexus IS', '2023 Lexus IS', '2024 Lexus IS', '2025 Lexus IS', '2026 Lexus IS',
  '2021 Infiniti Q50', '2022 Infiniti Q50', '2023 Infiniti Q50', '2024 Infiniti Q50', '2025 Infiniti Q50', '2026 Infiniti Q50',
  '2020 Acura TLX', '2021 Acura TLX', '2022 Acura TLX', '2023 Acura TLX', '2024 Acura TLX', '2025 Acura TLX', '2026 Acura TLX',
  '2021 Genesis G70', '2022 Genesis G70', '2023 Genesis G70', '2024 Genesis G70', '2025 Genesis G70', '2026 Genesis G70',
  '2020 Volvo S60', '2021 Volvo S60', '2022 Volvo S60', '2023 Volvo S60', '2024 Volvo S60', '2025 Volvo S60', '2026 Volvo S60',
  '2021 Cadillac CT4', '2022 Cadillac CT4', '2023 Cadillac CT4', '2024 Cadillac CT4', '2025 Cadillac CT4', '2026 Cadillac CT4',
  '2020 Jaguar XE', '2021 Jaguar XE', '2022 Jaguar XE', '2023 Jaguar XE', '2024 Jaguar XE', '2025 Jaguar XE', '2026 Jaguar XE',
  '2021 Alfa Romeo Giulia', '2022 Alfa Romeo Giulia', '2023 Alfa Romeo Giulia', '2024 Alfa Romeo Giulia', '2025 Alfa Romeo Giulia', '2026 Alfa Romeo Giulia',
  '2020 Kia Stinger', '2021 Kia Stinger', '2022 Kia Stinger', '2023 Kia Stinger', '2024 Kia Stinger', '2025 Kia Stinger', '2026 Kia Stinger',
  '2021 Hyundai Sonata', '2022 Hyundai Sonata', '2023 Hyundai Sonata', '2024 Hyundai Sonata', '2025 Hyundai Sonata', '2026 Hyundai Sonata',
  '2020 Mazda6', '2021 Mazda6', '2022 Mazda6', '2023 Mazda6', '2024 Mazda6', '2025 Mazda6', '2026 Mazda6',
  '2020 Subaru Legacy', '2021 Subaru Legacy', '2022 Subaru Legacy', '2023 Subaru Legacy', '2024 Subaru Legacy', '2025 Subaru Legacy', '2026 Subaru Legacy',
  '2020 Subaru Impreza', '2021 Subaru Impreza', '2022 Subaru Impreza', '2023 Subaru Impreza', '2024 Subaru Impreza', '2025 Subaru Impreza', '2026 Subaru Impreza',
  '2020 Subaru Outback', '2021 Subaru Outback', '2022 Subaru Outback', '2023 Subaru Outback', '2024 Subaru Outback', '2025 Subaru Outback', '2026 Subaru Outback',
  '2020 Subaru Forester', '2021 Subaru Forester', '2022 Subaru Forester', '2023 Subaru Forester', '2024 Subaru Forester', '2025 Subaru Forester', '2026 Subaru Forester',
  '2020 Subaru Ascent', '2021 Subaru Ascent', '2022 Subaru Ascent', '2023 Subaru Ascent', '2024 Subaru Ascent', '2025 Subaru Ascent', '2026 Subaru Ascent',
  '2020 Subaru Crosstrek', '2021 Subaru Crosstrek', '2022 Subaru Crosstrek', '2023 Subaru Crosstrek', '2024 Subaru Crosstrek', '2025 Subaru Crosstrek', '2026 Subaru Crosstrek',
  '2020 Subaru BRZ', '2021 Subaru BRZ', '2022 Subaru BRZ', '2023 Subaru BRZ', '2024 Subaru BRZ', '2025 Subaru BRZ', '2026 Subaru BRZ',
  '2020 Subaru WRX STI', '2021 Subaru WRX STI', '2022 Subaru WRX STI', '2023 Subaru WRX STI', '2024 Subaru WRX STI', '2025 Subaru WRX STI', '2026 Subaru WRX STI',
  '2020 Ford F-150', '2021 Ford F-150', '2022 Ford F-150', '2023 Ford F-150', '2024 Ford F-150', '2025 Ford F-150', '2026 Ford F-150',
  '2020 Ford Explorer', '2021 Ford Explorer', '2022 Ford Explorer', '2023 Ford Explorer', '2024 Ford Explorer', '2025 Ford Explorer', '2026 Ford Explorer',
  '2020 Ford Escape', '2021 Ford Escape', '2022 Ford Escape', '2023 Ford Escape', '2024 Ford Escape', '2025 Ford Escape', '2026 Ford Escape',
  '2020 Ford Edge', '2021 Ford Edge', '2022 Ford Edge', '2023 Ford Edge', '2024 Ford Edge', '2025 Ford Edge', '2026 Ford Edge',
  '2020 Ford Bronco', '2021 Ford Bronco', '2022 Ford Bronco', '2023 Ford Bronco', '2024 Ford Bronco', '2025 Ford Bronco', '2026 Ford Bronco',
  '2020 Ford Bronco Sport', '2021 Ford Bronco Sport', '2022 Ford Bronco Sport', '2023 Ford Bronco Sport', '2024 Ford Bronco Sport', '2025 Ford Bronco Sport', '2026 Ford Bronco Sport',
  '2020 Ford Ranger', '2021 Ford Ranger', '2022 Ford Ranger', '2023 Ford Ranger', '2024 Ford Ranger', '2025 Ford Ranger', '2026 Ford Ranger',
  '2020 Ford Maverick', '2021 Ford Maverick', '2022 Ford Maverick', '2023 Ford Maverick', '2024 Ford Maverick', '2025 Ford Maverick', '2026 Ford Maverick',
  '2020 Chevrolet Silverado', '2021 Chevrolet Silverado', '2022 Chevrolet Silverado', '2023 Chevrolet Silverado', '2024 Chevrolet Silverado', '2025 Chevrolet Silverado', '2026 Chevrolet Silverado',
  '2025 Tesla Model X', '2026 Tesla Model X',
  '2026 Hyundai Ioniq 5', '2026 Hyundai Ioniq 6',
  '2026 Cadillac Optiq',
  '2025 Kia EV6', '2025 Kia EV9',
  '2025 Rivian R1T', '2025 Rivian R1S',
  '2025 BMW i4', '2025 BMW iX',
  '2025 Audi e-tron', '2025 Audi e-tron GT',
  '2025 Mercedes EQS', '2025 Mercedes EQE',
  '2025 Chevrolet Bolt EV',
  '2025 Cadillac Lyriq',
  '2025 Nissan Leaf', '2025 Nissan Ariya',
  '2025 Polestar 2',
  '2025 Lucid Air',
];

const Community: React.FC = () => {
  const navigate = useNavigate();

  // Get all articles sorted by date (newest first) - community might discuss these
  const communityArticles = useMemo(() => {
    return Object.entries(articles)
      .map(([slug, article]) => ({ slug, article }))
      .sort((a, b) => {
        const dateA = new Date(a.article.date).getTime();
        const dateB = new Date(b.article.date).getTime();
        return dateB - dateA; // Newest first
      })
      .slice(0, 20); // Limit to 20 most recent
  }, []);

  // Get popular vehicles (2024, 2025, 2026 models) - community favorites
  const popularVehicles = useMemo(() => {
    return carDatabase
      .filter(vehicleName => {
        const yearMatch = vehicleName.match(/^(2024|2025|2026)\s/);
        return yearMatch !== null;
      })
      .sort((a, b) => {
        const yearA = parseInt(a.match(/^(\d{4})\s/)?.[1] || '0', 10);
        const yearB = parseInt(b.match(/^(\d{4})\s/)?.[1] || '0', 10);
        if (yearB !== yearA) {
          return yearB - yearA; // Newer years first
        }
        return a.localeCompare(b); // Alphabetical within same year
      });
  }, []);

  // Get unique popular vehicles (by make/model)
  const uniquePopularVehicles = useMemo(() => {
    const seen = new Map<string, string>();
    const unique: string[] = [];
    
    popularVehicles.forEach(vehicle => {
      // Extract make and model (everything after year)
      const makeModel = vehicle.replace(/^\d{4}\s/, '').toLowerCase();
      if (!seen.has(makeModel)) {
        seen.set(makeModel, vehicle);
        unique.push(vehicle);
      }
    });
    
    return unique;
  }, [popularVehicles]);

  // Hero data - use first community article
  const heroData = useMemo(() => {
    if (communityArticles.length > 0) {
      const firstArticle = communityArticles[0];
      return {
        imageUrl: firstArticle.article.heroImage,
        title: firstArticle.article.title,
        onClick: () => {
          navigate(`/article/${firstArticle.slug}`);
        },
      };
    }
    return {
      imageUrl: 'https://d2kde5ohu8qb21.cloudfront.net/files/686ecc3b8b30d500028d902a/2026-hyundai-ioniq-6-n-side-motion.jpg',
      title: 'Community: Join the MotorTrend Community',
      onClick: () => navigate('/community'),
    };
  }, [communityArticles, navigate]);

  // Vertical cards - next 3 community articles
  const verticalCards = useMemo(() => {
    return communityArticles.slice(1, 4).map(({ slug, article }) => ({
      imageUrl: article.heroImage,
      title: article.title,
      type: 'Article' as const,
      onClick: () => {
        navigate(`/article/${slug}`);
      },
    }));
  }, [communityArticles, navigate]);

  // Vehicles for VehiclesSection - popular vehicles
  const vehiclesData = useMemo(() => {
    return uniquePopularVehicles.slice(0, 12).map(vehicle => ({
      name: vehicle
    }));
  }, [uniquePopularVehicles]);

  // Community items for river section - remaining community articles
  const communityItems = useMemo(() => {
    return communityArticles.slice(4).map(({ slug, article }) => ({
      imageUrl: article.heroImage,
      title: article.title,
      author: article.author,
      date: article.date,
      category: `MotorTrend | ${article.category}`,
      onClick: () => {
        navigate(`/article/${slug}`);
      },
    })) as RiverItem[];
  }, [communityArticles, navigate]);

  return (
    <div className="community">
      <div className="community__container">
        {/* Hero + 3 Cards Section */}
        <div className="community__section">
          <div className="community__left-column">
            <HeroPlusThree
              hero={heroData}
              cards={verticalCards}
            />
          </div>
          <div className="community__right-column">
            <AdContainer
              width={300}
              height={250}
              label="300 x 250"
              position="right-column"
              imageUrl="https://d2kde5ohu8qb21.cloudfront.net/files/69116380f5e41e00020d3432/822789964589118228.jpeg"
            />
          </div>
        </div>

        {/* Vehicles Section - Popular Vehicles */}
        {vehiclesData.length > 0 && (
          <div className="community__section">
            <div className="community__left-column">
              <VehiclesSection
                title="Popular Vehicles"
                vehicles={vehiclesData}
                showMoreVisible={uniquePopularVehicles.length > 12}
                onShowMore={() => {
                  navigate('/vehicles');
                }}
              />
            </div>
            <div className="community__right-column">
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

        {/* Community Content Section (River) */}
        {communityItems.length > 0 && (
          <div className="community__section">
            <div className="community__left-column">
              <NewsSection
                title="Community Discussions"
                items={communityItems}
              />
            </div>
            <div className="community__right-column">
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

export default Community;

