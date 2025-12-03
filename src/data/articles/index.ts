/**
 * Articles Data Loader
 * Imports article data from JSON files and combines them into a single database
 * 
 * @module data/articles
 */

import type { Article } from '../../types/article';

// Import JSON data by category
import reviewsData from './reviews.json';
import newsData from './news.json';
import buyingGuideData from './buying-guide.json';
import awardsData from './awards.json';
import featuresData from './features.json';

// Type for the raw JSON data (Record of slug -> article)
type ArticleRecord = Record<string, Article>;

// Process and combine all article data
export const reviews: ArticleRecord = reviewsData as ArticleRecord;
export const news: ArticleRecord = newsData as ArticleRecord;
export const buyingGuides: ArticleRecord = buyingGuideData as ArticleRecord;
export const awards: ArticleRecord = awardsData as ArticleRecord;
export const features: ArticleRecord = featuresData as ArticleRecord;

/**
 * Complete articles database combining all categories
 */
export const articles: ArticleRecord = {
  ...reviews,
  ...news,
  ...buyingGuides,
  ...awards,
  ...features,
};

/**
 * Get all articles as an array
 */
export const getAllArticles = (): Article[] => Object.values(articles);

/**
 * Get article by slug
 */
export const getArticleBySlug = (slug: string): Article | undefined => articles[slug];

/**
 * Get articles by category
 */
export const getArticlesByCategory = (category: string): Article[] => {
  return Object.values(articles).filter(
    article => article.category.toLowerCase() === category.toLowerCase()
  );
};

/**
 * Statistics about the articles database
 */
export const articleStats = {
  total: Object.keys(articles).length,
  byCategory: {
    Reviews: Object.keys(reviews).length,
    News: Object.keys(news).length,
    'Buying Guide': Object.keys(buyingGuides).length,
    Awards: Object.keys(awards).length,
    Features: Object.keys(features).length,
  },
};

// Default export
export default articles;


