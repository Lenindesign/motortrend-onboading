/**
 * Video Card Component
 * Now using universal Card component following atomic design principles
 */

import React from 'react';
import Card from '../Card';

export interface VideoCardProps {
  image: string;
  title: string;
  author: string;
  date: string;
  onBookmark?: () => void;
  isBookmarked?: boolean;
  onPlayVideo?: () => void;
}

export const VideoCard: React.FC<VideoCardProps> = ({ 
  image, 
  title, 
  author, 
  date,
  onBookmark,
  isBookmarked = false,
  onPlayVideo
}) => {
  return (
    <Card
      image={image}
      title={title}
      metadata={`${author} | ${date}`}
      type="Video"
      onBookmark={onBookmark}
      isBookmarked={isBookmarked}
      onAction={onPlayVideo}
      actionText="Play Video"
      showPlayIcon={true}
    />
  );
};

