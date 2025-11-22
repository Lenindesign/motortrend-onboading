import React from 'react';
import Icon from '../Icon';
import './ArticleHero.css';

export interface ArticleHeroProps {
  imageUrl: string;
  title: string;
  onShare: () => void;
  onImageClick?: () => void;
}

export const ArticleHero: React.FC<ArticleHeroProps> = ({ imageUrl, title, onShare, onImageClick }) => {
  return (
    <div className="article-hero">
      <div className="article-hero__image-wrapper">
        <img
          src={imageUrl}
          alt={title}
          className="article-hero__image article-hero__image--clickable"
          onClick={onImageClick}
        />
        <div className="article-hero__overlay">
          <button className="article-hero__share-btn" onClick={onShare} aria-label="Share article">
            <Icon name="share" size={24} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ArticleHero;

