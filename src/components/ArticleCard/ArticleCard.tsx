/**
 * Article Card Component
 * Based on Figma Community design system
 */

import React from 'react';
import './ArticleCard.css';

export interface ArticleCardProps {
  title: string;
  author: string;
  date: string;
  imageUrl: string;
  onReadArticle?: () => void;
}

export const ArticleCard: React.FC<ArticleCardProps> = ({
  title,
  author,
  date,
  imageUrl,
  onReadArticle,
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
          <div className="article-card__gallery-badge">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M19 3H5C3.89543 3 3 3.89543 3 5V19C3 20.1046 3.89543 21 5 21H19C20.1046 21 21 20.1046 21 19V5C21 3.89543 20.1046 3 19 3Z" fill="#23262F" stroke="#23262F" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M8.5 10C9.32843 10 10 9.32843 10 8.5C10 7.67157 9.32843 7 8.5 7C7.67157 7 7 7.67157 7 8.5C7 9.32843 7.67157 10 8.5 10Z" fill="#FFB74D" stroke="#FFB74D" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M21 15L16 10L5 21" stroke="#33CCFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
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

