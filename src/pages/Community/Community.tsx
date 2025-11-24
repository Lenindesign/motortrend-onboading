/**
 * Community Page Component
 * Index page displaying community content, forums, and popular vehicles
 */

import React, { useMemo, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { NewsSection } from '../../components/NewsSection';
import { VehiclesSection } from '../../components/VehiclesSection';
import { AdContainer } from '../../components/AdContainer';
import type { RiverItem } from '../../components/River';
import { articles } from '../../utils/articles';
import { getVehicles } from '../../api/vehiclesApi';
import { getPersonaFromOnboarding, getPersona, type PersonaName } from '../../utils/personas';
import { filterVehiclesByLifestyle } from '../../utils/vehicleLifestyles';
import './Community.css';

const Community: React.FC = () => {
  const navigate = useNavigate();
  const [personaName, setPersonaName] = useState<PersonaName | null>(null);
  
  // Load persona on mount
  useEffect(() => {
    const persona = getPersonaFromOnboarding();
    setPersonaName(persona);
  }, []);
  
  const persona = useMemo(() => {
    return getPersona(personaName);
  }, [personaName]);

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

  // Get latest vehicles (2024, 2025, 2026 models)
  const latestVehicles = useMemo(() => {
    const allVehicles = getVehicles();
    return allVehicles
      .filter(vehicle => {
        const year = parseInt(vehicle.year, 10);
        return year >= 2024 && year <= 2026;
      })
      .sort((a, b) => {
        const yearA = parseInt(a.year, 10);
        const yearB = parseInt(b.year, 10);
        if (yearB !== yearA) {
          return yearB - yearA; // Newer years first
        }
        const nameA = `${a.make} ${a.model}`;
        const nameB = `${b.make} ${b.model}`;
        return nameA.localeCompare(nameB); // Alphabetical within same year
      })
      .map(v => `${v.year} ${v.make} ${v.model}`);
  }, []);
  
  // Personalized vehicles based on user's persona
  const dreamCars = useMemo(() => {
    if (!persona || !persona.priorityCategories.length) {
      return [];
    }
    
    // Get vehicles from primary lifestyle category
    const primaryCategory = persona.priorityCategories[0];
    const filteredVehicles = filterVehiclesByLifestyle(
      latestVehicles.map(name => ({ name })),
      primaryCategory
    );
    
    // Get unique vehicles (by make/model)
    const seen = new Map<string, string>();
    const unique: string[] = [];
    
    filteredVehicles.forEach(({ name: vehicle }) => {
      const makeModel = vehicle.replace(/^\d{4}\s/, '').toLowerCase();
      if (!seen.has(makeModel)) {
        seen.set(makeModel, vehicle);
        unique.push(vehicle);
      }
    });
    
    return unique.slice(0, 12);
  }, [persona, latestVehicles]);
  
  // Family/Friends vehicles - practical and shareable
  const familyFriendlyVehicles = useMemo(() => {
    const familyVehicles = filterVehiclesByLifestyle(
      latestVehicles.map(name => ({ name })),
      'Family & Practical'
    );
    
    // Get unique vehicles
    const seen = new Map<string, string>();
    const unique: string[] = [];
    
    familyVehicles.forEach(({ name: vehicle }) => {
      const makeModel = vehicle.replace(/^\d{4}\s/, '').toLowerCase();
      if (!seen.has(makeModel)) {
        seen.set(makeModel, vehicle);
        unique.push(vehicle);
      }
    });
    
    return unique.slice(0, 12);
  }, [latestVehicles]);

  // Get unique popular vehicles (by make/model)
  const uniquePopularVehicles = useMemo(() => {
    const seen = new Map<string, string>();
    const unique: string[] = [];
    
    latestVehicles.forEach(vehicle => {
      // Extract make and model (everything after year)
      const makeModel = vehicle.replace(/^\d{4}\s/, '').toLowerCase();
      if (!seen.has(makeModel)) {
        seen.set(makeModel, vehicle);
        unique.push(vehicle);
      }
    });
    
    return unique;
  }, [latestVehicles]);

  // Community items for river section - community articles
  const communityItems = useMemo(() => {
    return communityArticles.map(({ slug, article }) => ({
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
        {/* Personalized Dream Cars Section */}
        {dreamCars.length > 0 && persona && (
          <div className="community__section">
            <div className="community__left-column">
              <VehiclesSection
                title={`Dream Cars for ${persona.displayName}`}
                vehicles={dreamCars.map(name => ({ name }))}
                showMoreVisible={dreamCars.length >= 12}
                onShowMore={() => {
                  navigate('/vehicles');
                }}
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
        )}

        {/* Family & Friends Vehicles Section */}
        {familyFriendlyVehicles.length > 0 && (
          <div className="community__section">
            <div className="community__left-column">
              <VehiclesSection
                title="Perfect for Family & Friends"
                vehicles={familyFriendlyVehicles.map(name => ({ name }))}
                showMoreVisible={familyFriendlyVehicles.length >= 12}
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

        {/* Popular Vehicles Section */}
        {uniquePopularVehicles.length > 0 && (
          <div className="community__section">
            <div className="community__left-column">
              <VehiclesSection
                title="Popular in the Community"
                vehicles={uniquePopularVehicles.slice(0, 12).map(name => ({ name }))}
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

