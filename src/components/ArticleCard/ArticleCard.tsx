/**
 * Article Card Component
 * Based on Figma Community design system
 */

import React from 'react';
import './ArticleCard.css';
import Icon from '../Icon';

export interface ArticleCardProps {
  title: string;
  author: string;
  date: string;
  imageUrl: string;
  onReadArticle?: () => void;
  onBookmark?: () => void;
  isBookmarked?: boolean;
}

export const ArticleCard: React.FC<ArticleCardProps> = ({
  title,
  author,
  date,
  imageUrl,
  onReadArticle,
  onBookmark,
  isBookmarked = false,
}) => {
  return (
    <div className="article-card">
      <div className="article-card__content">
        <div className="article-card__image-container">
          <img 
            src={imageUrl} 
            alt={title}
            className="article-card__image"
          />
          <button 
            className={`article-card__bookmark-btn ${isBookmarked ? 'article-card__bookmark-btn--active' : ''}`}
            onClick={onBookmark}
            aria-label={isBookmarked ? 'Remove bookmark' : 'Bookmark'}
          >
            <Icon name={isBookmarked ? 'bookmark' : 'bookmark_border'} variant={isBookmarked ? 'filled' : 'outlined'} size={16} />
          </button>
        </div>

        <div className="article-card__info">
          <div className="article-card__text">
            <div className="article-card__title-section">
              <h3 className="article-card__title">{title}</h3>
              <p className="article-card__meta">{author} | {date}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="article-card__actions">
        <button 
          className="article-card__read-btn"
          onClick={onReadArticle}
        >
          Read Article
        </button>
      </div>
    </div>
  );
};

export default ArticleCard;

