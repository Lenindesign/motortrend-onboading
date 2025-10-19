import React from 'react';
import './VideoCard.css';
import Icon from '../Icon';

export interface VideoCardProps {
  image: string;
  title: string;
  author: string;
  date: string;
  onBookmark?: () => void;
  isBookmarked?: boolean;
}

export const VideoCard: React.FC<VideoCardProps> = ({ 
  image, 
  title, 
  author, 
  date,
  onBookmark,
  isBookmarked = false
}) => {
  return (
    <div className="video-card">
      <div className="video-card__image-container">
        <img src={image} alt={title} className="video-card__image" />
        <button 
          className={`video-card__bookmark-btn ${isBookmarked ? 'video-card__bookmark-btn--active' : ''}`}
          onClick={onBookmark}
          aria-label={isBookmarked ? 'Remove bookmark' : 'Bookmark'}
        >
          <Icon name={isBookmarked ? 'bookmark' : 'bookmark_border'} variant={isBookmarked ? 'filled' : 'outlined'} size={16} />
        </button>
        <div className="video-card__play-icon">
          <Icon name="play_circle" variant="filled" size={64} />
        </div>
      </div>
      
      <div className="video-card__content">
        <div className="video-card__info">
          <h4 className="video-card__title">{title}</h4>
          <p className="video-card__meta">{author} | {date}</p>
        </div>
        
        <div className="video-card__actions">
          <button className="video-card__button">Play Video</button>
        </div>
      </div>
    </div>
  );
};

