/**
 * Vehicle Card Component
 * Now using universal Card component following atomic design principles
 */

import React from 'react';
import Card from '../Card';
import { getVehicleBodyStyle } from '../../utils/vehicleBodyStyles';

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
  onRate?: () => void;
  userRating?: number;
}

export const VehicleCard: React.FC<VehicleCardProps> = ({
  image,
  name,
  rating1,
  rating2,
  hasMultipleRatings = false,
  onBookmark,
  isBookmarked = false,
  ownership = 'own',
  onOwnershipChange,
  onViewDetails,
  onRate,
  userRating
}) => {
  const ratings = [];
  if (rating1) ratings.push({ value: typeof rating1 === 'number' ? rating1.toFixed(1) : rating1, color: '#FFB74D' });
  if (rating2) ratings.push({ value: typeof rating2 === 'number' ? (rating2 / 2).toFixed(1) : rating2, color: '#33C4FF' });

  // Get body style from vehicle name
  const bodyStyles = getVehicleBodyStyle(name);
  const bodyStyle = bodyStyles[0] || 'Sedan'; // Use first body style or default to Sedan

  return (
    <Card
      image={image}
      title={name}
      type={bodyStyle}
      ratings={ratings}
      hasMultipleRatings={hasMultipleRatings}
      onBookmark={onBookmark}
      isBookmarked={isBookmarked}
      ownership={ownership}
      onOwnershipChange={onOwnershipChange}
      onAction={onViewDetails}
      actionText="View Details"
      onRate={onRate}
      userRating={userRating}
    />
  );
};

export default VehicleCard;