/**
 * Articles API
 * Provides article data and utility functions
 * 
 * DATA SOURCE: JSON files in src/data/articles/
 * TYPES: Centralized in src/types/article.ts
 */

// Import article data from JSON files
import { articles as articlesData } from '../data/articles';

// Import and re-export types for backward compatibility
import type {
  Article as ArticleType,
  ArticleContent as ArticleContentType,
  ArticleSpecifications as ArticleSpecificationsType,
  MotorTrendScore as MotorTrendScoreType,
} from '../types/article';

// Re-export types for backward compatibility
export type Article = ArticleType;
export type ArticleContent = ArticleContentType;
export type ArticleSpecifications = ArticleSpecificationsType;
export type MotorTrendScore = MotorTrendScoreType;

/**
 * Articles database - imported from JSON files
 */
export const articles: Record<string, Article> = articlesData;

/**
 * Get article by slug
 */
export const getArticleBySlug = (slug: string | undefined): Article | null => {
  if (!slug) return null;
  return articles[slug] || null;
};

/**
 * Get default article (for fallback)
 */
export const getDefaultArticle = (): Article => {
  return articles["2026-hyundai-ioniq-6-n-first-drive-review"];
};

/**
 * Get all articles
 */
export const getAllArticles = (): Article[] => {
  return Object.values(articles);
};

/**
 * Get articles by category
 */
export const getArticlesByCategory = (category: string): Article[] => {
  return Object.values(articles).filter(
    article => article.category.toLowerCase() === category.toLowerCase()
  );
};

/**
 * Search articles by title or excerpt
 */
export const searchArticles = (query: string, limit: number = 10): Article[] => {
  if (!query || query.length < 2) return [];
  
  const searchLower = query.toLowerCase();
  const results = Object.values(articles).filter(article =>
    article.title.toLowerCase().includes(searchLower) ||
    article.excerpt.toLowerCase().includes(searchLower) ||
    article.author.toLowerCase().includes(searchLower)
  );
  
  return results.slice(0, limit);
};

/**
 * Get related articles (same category, excluding current)
 */
export const getRelatedArticles = (slug: string, limit: number = 4): Article[] => {
  const currentArticle = articles[slug];
  if (!currentArticle) return [];
  
  return Object.values(articles)
    .filter(article => 
      article.category === currentArticle.category && 
      article.title !== currentArticle.title
    )
    .slice(0, limit);
};

/**
 * Get latest articles
 */
export const getLatestArticles = (limit: number = 5): Article[] => {
  return Object.values(articles)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, limit);
};

export default {
  articles,
  getArticleBySlug,
  getDefaultArticle,
  getAllArticles,
  getArticlesByCategory,
  searchArticles,
  getRelatedArticles,
  getLatestArticles,
};
