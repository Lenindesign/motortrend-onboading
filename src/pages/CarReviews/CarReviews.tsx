/**
 * Car Reviews Page Component
 * Index page displaying all car review articles
 */

import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { HeroPlusThree } from '../../components/HeroPlusThree';
import { NewsSection } from '../../components/NewsSection';
import { VehiclesSection } from '../../components/VehiclesSection';
import { AdContainer } from '../../components/AdContainer';
import type { RiverItem } from '../../components/River';
import { articles } from '../../utils/articles';
import './CarReviews.css';

const CarReviews: React.FC = () => {
  const navigate = useNavigate();

  // Get all review articles
  const reviewArticles = useMemo(() => {
    return Object.entries(articles)
      .filter(([, article]) => article.category === 'Reviews')
      .map(([slug, article]) => ({ slug, article }))
      .sort((a, b) => {
        // Sort by date descending (newest first)
        const dateA = new Date(a.article.date).getTime();
        const dateB = new Date(b.article.date).getTime();
        return dateB - dateA;
      });
  }, []);

  // Hero data - use first review article
  const heroData = useMemo(() => {
    if (reviewArticles.length > 0) {
      const firstReview = reviewArticles[0];
      return {
        imageUrl: firstReview.article.heroImage,
        title: firstReview.article.title,
        onClick: () => {
          navigate(`/article/${firstReview.slug}`);
        },
      };
    }
    return {
      imageUrl: 'https://www.motortrend.com/files/686ecc3b8b30d500028d902a/2026-hyundai-ioniq-6-n-side-motion.jpg',
      title: 'Car Reviews: Expert Analysis and First Drive Impressions',
      onClick: () => navigate('/car-reviews'),
    };
  }, [reviewArticles, navigate]);

  // Vertical cards - use next 3 review articles
  const verticalCards = useMemo(() => {
    return reviewArticles.slice(1, 4).map(({ slug, article }) => ({
      imageUrl: article.heroImage,
      title: article.title,
      type: 'Article' as const,
      onClick: () => {
        navigate(`/article/${slug}`);
      },
    }));
  }, [reviewArticles, navigate]);

  // Extract vehicles from review articles for VehiclesSection
  const vehiclesData = useMemo(() => {
    const vehicleSet = new Set<string>();
    
    reviewArticles.forEach(({ article }) => {
      // Try to extract vehicle name from title (e.g., "2026 Hyundai Ioniq 6 N First Drive")
      const titleMatch = article.title.match(/(\d{4})\s+([A-Za-z\s]+?)(?:\s+(?:First|Review|Test|Drive|Yearlong|Track))/i);
      if (titleMatch) {
        const year = titleMatch[1];
        const makeModel = titleMatch[2].trim();
        vehicleSet.add(`${year} ${makeModel}`);
      }
    });
    
    return Array.from(vehicleSet).slice(0, 12).map(vehicle => ({
      name: vehicle
    }));
  }, [reviewArticles]);

  // News items - convert review articles to RiverItem format
  const newsItems = useMemo(() => {
    return reviewArticles.slice(4).map(({ slug, article }) => ({
      imageUrl: article.heroImage,
      title: article.title,
      author: article.author,
      date: article.date,
      category: `MotorTrend | ${article.category}`,
      onClick: () => {
        navigate(`/article/${slug}`);
      },
    })) as RiverItem[];
  }, [reviewArticles, navigate]);

  return (
    <div className="car-reviews">
      <div className="car-reviews__container">
        {/* Hero + 3 Cards Section */}
        <div className="car-reviews__section">
          <div className="car-reviews__left-column">
            <HeroPlusThree
              hero={heroData}
              cards={verticalCards}
            />
          </div>
          <div className="car-reviews__right-column">
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
        {vehiclesData.length > 0 && (
          <div className="car-reviews__section">
            <div className="car-reviews__left-column">
              <VehiclesSection
                title="Reviewed Vehicles"
                vehicles={vehiclesData}
                showMoreVisible={vehiclesData.length > 6}
                onShowMore={() => {
                  // Handle show more action if needed
                  console.log('Show more vehicles');
                }}
              />
            </div>
            <div className="car-reviews__right-column">
              <AdContainer
                width={300}
                height={600}
                label="SVOD 200 x 420"
                position="right-column"
                imageUrl="https://www.motortrend.com/files/691163e3e8557700022eb5d9/4347518532106070908.png"
              />
            </div>
          </div>
        )}

        {/* News Section (River) */}
        {newsItems.length > 0 && (
          <div className="car-reviews__section">
            <div className="car-reviews__left-column">
              <NewsSection
                title="Latest Car Reviews"
                items={newsItems}
              />
            </div>
            <div className="car-reviews__right-column">
              <AdContainer
                width={300}
                height={600}
                label="SVOD 200 x 420"
                position="right-column"
                imageUrl="https://www.motortrend.com/files/691163e3e8557700022eb5d9/4347518532106070908.png"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CarReviews;

