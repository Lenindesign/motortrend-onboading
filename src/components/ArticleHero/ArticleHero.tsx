import React from 'react';
import './ArticleHero.css';

export interface ArticleHeroProps {
  imageUrl: string;
  title: string;
  onShare?: () => void;
  onImageClick?: () => void;
}

export const ArticleHero: React.FC<ArticleHeroProps> = ({ imageUrl, title, onImageClick }) => {
  return (
    <div className="article-hero">
      <div className="article-hero__image-wrapper">
        <img
          src={imageUrl}
          alt={title}
          className="article-hero__image article-hero__image--clickable"
          onClick={onImageClick}
        />
      </div>
    </div>
  );
};

export default ArticleHero;


