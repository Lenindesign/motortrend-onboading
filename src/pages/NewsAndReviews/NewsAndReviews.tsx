/**
 * News & Reviews Page Component
 * Index page displaying all news articles
 */

import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { HeroPlusThree } from '../../components/HeroPlusThree';
import { NewsSection } from '../../components/NewsSection';
import { AdContainer } from '../../components/AdContainer';
import type { RiverItem } from '../../components/River';
import { articles } from '../../utils/articles';
import './NewsAndReviews.css';

const NewsAndReviews: React.FC = () => {
  const navigate = useNavigate();

  // Get all news articles (News and Features categories)
  const newsArticles = useMemo(() => {
    return Object.entries(articles)
      .filter(([, article]) => 
        article.category === 'News' || article.category === 'Features'
      )
      .map(([slug, article]) => ({ slug, article }))
      .sort((a, b) => {
        // Sort by date descending (newest first)
        const dateA = new Date(a.article.date).getTime();
        const dateB = new Date(b.article.date).getTime();
        return dateB - dateA;
      });
  }, []);

  // Hero data - use first news article
  const heroData = useMemo(() => {
    if (newsArticles.length > 0) {
      const firstNews = newsArticles[0];
      return {
        imageUrl: firstNews.article.heroImage,
        title: firstNews.article.title,
        onClick: () => {
          navigate(`/article/${firstNews.slug}`);
        },
      };
    }
    return {
      imageUrl: 'https://d2kde5ohu8qb21.cloudfront.net/files/686ecc3b8b30d500028d902a/2026-hyundai-ioniq-6-n-side-motion.jpg',
      title: 'News & Reviews: Latest Automotive News and Industry Insights',
      onClick: () => navigate('/news-reviews'),
    };
  }, [newsArticles, navigate]);

  // Vertical cards - next 3 news articles
  const verticalCards = useMemo(() => {
    return newsArticles.slice(1, 4).map(({ slug, article }) => ({
      imageUrl: article.heroImage,
      title: article.title,
      type: 'Article' as const,
      onClick: () => {
        navigate(`/article/${slug}`);
      },
    }));
  }, [newsArticles, navigate]);

  // Get all review articles
  const reviewArticles = useMemo(() => {
    return Object.entries(articles)
      .filter(([, article]) => 
        article.category === 'Reviews'
      )
      .map(([slug, article]) => ({ slug, article }))
      .sort((a, b) => {
        // Sort by date descending (newest first)
        const dateA = new Date(a.article.date).getTime();
        const dateB = new Date(b.article.date).getTime();
        return dateB - dateA;
      });
  }, []);

  // News items for river section
  const newsItems = useMemo(() => {
    return newsArticles.slice(4).map(({ slug, article }) => ({
      imageUrl: article.heroImage,
      title: article.title,
      author: article.author,
      date: article.date,
      category: `MotorTrend | ${article.category}`,
      onClick: () => {
        navigate(`/article/${slug}`);
      },
    })) as RiverItem[];
  }, [newsArticles, navigate]);

  // Review items for river section
  const reviewItems = useMemo(() => {
    return reviewArticles.slice(0, 10).map(({ slug, article }) => ({
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
    <div className="news-reviews">
      <div className="news-reviews__container">
        {/* Hero + 3 Cards Section */}
        <div className="news-reviews__section">
          <div className="news-reviews__left-column">
            <HeroPlusThree
              hero={heroData}
              cards={verticalCards}
            />
          </div>
          <div className="news-reviews__right-column">
            <AdContainer
              width={300}
              height={250}
              label="300 x 250"
              position="right-column"
              imageUrl="https://d2kde5ohu8qb21.cloudfront.net/files/69116380f5e41e00020d3432/822789964589118228.jpeg"
            />
          </div>
        </div>

        {/* News Section (River) */}
        {newsItems.length > 0 && (
          <div className="news-reviews__section">
            <div className="news-reviews__left-column">
              <NewsSection
                title="Latest News & Features"
                items={newsItems}
              />
            </div>
            <div className="news-reviews__right-column">
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

        {/* Reviews Section (River) */}
        {reviewItems.length > 0 && (
          <div className="news-reviews__section">
            <div className="news-reviews__left-column">
              <NewsSection
                title="Latest Reviews"
                items={reviewItems}
              />
            </div>
            <div className="news-reviews__right-column">
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

export default NewsAndReviews;

