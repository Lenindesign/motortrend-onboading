/**
 * Article Card Component
 * Now using universal Card component following atomic design principles
 */

import React from 'react';
import Card from '../Card';

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
    <Card
      image={imageUrl}
      title={title}
      metadata={`${author} | ${date}`}
      type="Article"
      onBookmark={onBookmark}
      isBookmarked={isBookmarked}
      onAction={onReadArticle}
      actionText="Read Article"
    />
  );
};

export default ArticleCard;

