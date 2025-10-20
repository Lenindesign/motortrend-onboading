/**
 * Vehicle Card Component
 * Now using universal Card component following atomic design principles
 */

import React from 'react';
import Card from '../Card';

export interface VehicleCardProps {
  image: string;
  name: string;
  type: string;
  rating1?: number;
  rating2?: number;
  hasMultipleRatings?: boolean;
  onBookmark?: () => void;
  isBookmarked?: boolean;
  ownership?: 'own' | 'want';
  onOwnershipChange?: (value: 'own' | 'want') => void;
  onViewDetails?: () => void;
}

export const VehicleCard: React.FC<VehicleCardProps> = ({ 
  image, 
  name, 
  type, 
  rating1,
  rating2,
  hasMultipleRatings = false,
  onBookmark,
  isBookmarked = false,
  ownership = 'own',
  onOwnershipChange,
  onViewDetails
}) => {
  const ratings = [];
  if (rating1) ratings.push({ value: rating1, color: '#FFB74D' });
  if (rating2) ratings.push({ value: rating2, color: '#33CCFF' });

  return (
    <Card
      image={image}
      title={name}
      type={type}
      ratings={ratings}
      hasMultipleRatings={hasMultipleRatings}
      onBookmark={onBookmark}
      isBookmarked={isBookmarked}
      ownership={ownership}
      onOwnershipChange={onOwnershipChange}
      onAction={onViewDetails}
      actionText="View Details"
    />
  );
};

export default VehicleCard;