import React from 'react';
import './VideoCard.css';

export interface VideoCardProps {
  image: string;
  title: string;
  author: string;
  date: string;
}

export const VideoCard: React.FC<VideoCardProps> = ({ image, title, author, date }) => {
  return (
    <div className="video-card">
      <div className="video-card__image-container">
        <img src={image} alt={title} className="video-card__image" />
        <div className="video-card__play-icon">
          <svg width="64" height="64" viewBox="0 0 64 64" fill="none" opacity="0.7">
            <circle cx="32" cy="32" r="32" fill="white"/>
            <path d="M26 20L44 32L26 44V20Z" fill="#141416"/>
          </svg>
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

