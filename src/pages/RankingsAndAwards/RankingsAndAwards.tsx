/**
 * Rankings & Awards Page Component
 * Premium index page displaying all Top 10 ranking articles
 */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArticleCard } from '../../components/ArticleCard';
import { SavedModal } from '../../components/SavedModal';
import { getArticleBySlug } from '../../utils/articles';
import { GoogleOneTap } from '../../components/GoogleOneTap';
import { useGoogleOneTap } from '../../hooks/useGoogleOneTap';
import { HIGH_INTENT_PAGES } from '../../utils/cdpTracking';
import './RankingsAndAwards.css';

const RankingsAndAwards: React.FC = () => {
  const navigate = useNavigate();

  // Google One Tap for high-intent Car Rankings page
  const { showOneTap, dismissOneTap } = useGoogleOneTap({
    pageType: HIGH_INTENT_PAGES.CAR_RANKINGS,
    autoTrigger: true,
    triggerDelay: 2500, // Show after 2.5 seconds on page
  });

  // List of all Top 10 article slugs
  const rankingArticles = [
    'top-10-daily-commute',
    'top-10-family-practical',
    '2026-motortrend-car-of-the-year',
    'top-10-adventure-off-road',
    'top-10-urban-style',
    'top-10-performance-enthusiast',
    'top-10-eco-future-ready',
    'top-10-luxury-comfort',
    'top-10-utility-work'
  ];

  // Get article data for each slug
  const articles = rankingArticles
    .map(slug => {
      const article = getArticleBySlug(slug);
      return article ? { article, slug } : null;
    })
    .filter((item): item is { article: NonNullable<ReturnType<typeof getArticleBySlug>>; slug: string } => item !== null);

  // Bookmark state management
  const [bookmarkedArticles, setBookmarkedArticles] = useState<Set<string>>(new Set());
  const [isSavedModalOpen, setIsSavedModalOpen] = useState(false);
  const [savedArticleTitle, setSavedArticleTitle] = useState('');

  // Load bookmarked articles from localStorage on mount
  useEffect(() => {
    try {
      const savedArticlesJson = localStorage.getItem('savedArticles');
      if (savedArticlesJson) {
        const savedArticles: string[] = JSON.parse(savedArticlesJson);
        setBookmarkedArticles(new Set(savedArticles));
      }
    } catch (error) {
      console.error('Error loading bookmarked articles:', error);
    }
  }, []);

  const handleArticleClick = (slug: string) => {
    navigate(`/article/${slug}`);
  };

  const handleBookmark = (slug: string, e?: React.MouseEvent) => {
    // Prevent card click when clicking bookmark
    if (e) {
      e.stopPropagation();
    }

    const article = getArticleBySlug(slug);
    if (!article) return;

    const isCurrentlyBookmarked = bookmarkedArticles.has(slug);
    const newBookmarkState = !isCurrentlyBookmarked;

    try {
      // Get current saved articles
      const savedArticlesJson = localStorage.getItem('savedArticles');
      const savedArticles: string[] = savedArticlesJson ? JSON.parse(savedArticlesJson) : [];
      
      // Get current saved articles metadata
      const savedArticlesMetadataJson = localStorage.getItem('savedArticlesMetadata');
      const savedArticlesMetadata: Record<string, { title: string; author: string; date: string; imageUrl: string; slug: string }> = 
        savedArticlesMetadataJson ? JSON.parse(savedArticlesMetadataJson) : {};
      
      if (newBookmarkState) {
        // Add article to saved list
        if (!savedArticles.includes(slug)) {
          savedArticles.push(slug);
        }
        
        // Save article metadata
        savedArticlesMetadata[slug] = {
          title: article.title,
          author: article.author,
          date: article.date,
          imageUrl: article.heroImage,
          slug: slug
        };
        
        // Show saved modal
        setSavedArticleTitle(article.title);
        setIsSavedModalOpen(true);
      } else {
        // Remove article from saved list
        const index = savedArticles.indexOf(slug);
        if (index > -1) {
          savedArticles.splice(index, 1);
        }
        
        // Remove article metadata
        delete savedArticlesMetadata[slug];
      }
      
      // Save to localStorage
      localStorage.setItem('savedArticles', JSON.stringify(savedArticles));
      localStorage.setItem('savedArticlesMetadata', JSON.stringify(savedArticlesMetadata));
      
      // Update state
      setBookmarkedArticles(new Set(savedArticles));
    } catch (error) {
      console.error('Error saving bookmark:', error);
    }
  };

  // Separate first article for hero display
  const [firstArticle, ...remainingArticles] = articles;

  return (
    <div className="rankings-awards">
      {/* Google One Tap - High-intent Car Rankings page trigger */}
      {showOneTap && (
        <GoogleOneTap
          mode="prompt"
          pageType={HIGH_INTENT_PAGES.CAR_RANKINGS}
          context="signin"
          autoSelect={false}
          promptDelay={2500}
          onSuccess={(user) => {
            console.log('G1T Success on Rankings:', user);
          }}
          onDismiss={dismissOneTap}
        />
      )}

      <div className="rankings-awards__container">
        {/* Hero Section */}
        <div className="rankings-awards__hero">
          <h1 className="rankings-awards__title">Rankings & Awards</h1>
          <p className="rankings-awards__subtitle">
            Discover the best vehicles across every lifestyle category. Our comprehensive rankings 
            help you find the perfect car, truck, or SUV for your needs.
          </p>
        </div>

        {/* Hero Card - First Article */}
        {firstArticle && (
          <div
            className="rankings-awards__hero-card"
            onClick={() => handleArticleClick(firstArticle.slug)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                handleArticleClick(firstArticle.slug);
              }
            }}
          >
            <ArticleCard
              key={firstArticle.slug}
              title={firstArticle.article.title}
              author={firstArticle.article.author}
              date={firstArticle.article.date}
              imageUrl={firstArticle.article.heroImage}
              onReadArticle={() => handleArticleClick(firstArticle.slug)}
              onBookmark={() => handleBookmark(firstArticle.slug)}
              isBookmarked={bookmarkedArticles.has(firstArticle.slug)}
            />
          </div>
        )}

        {/* Articles Grid */}
        <div className="rankings-awards__grid">
          {remainingArticles.map(({ article, slug }) => (
            <div
              key={slug}
              onClick={() => handleArticleClick(slug)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  handleArticleClick(slug);
                }
              }}
            >
              <ArticleCard
                title={article.title}
                author={article.author}
                date={article.date}
                imageUrl={article.heroImage}
                onReadArticle={() => handleArticleClick(slug)}
                onBookmark={() => handleBookmark(slug)}
                isBookmarked={bookmarkedArticles.has(slug)}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Saved Modal */}
      <SavedModal
        isOpen={isSavedModalOpen}
        onClose={() => setIsSavedModalOpen(false)}
        itemTitle={savedArticleTitle}
        itemType="article"
      />
    </div>
  );
};

export default RankingsAndAwards;

