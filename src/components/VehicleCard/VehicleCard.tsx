/**
 * Vehicle Card Component
 * Now using universal Card component following atomic design principles
 */

import React, { useCallback, useEffect, useState } from 'react';
import Card from '../Card';
import {
  SignInToSaveModal,
  clearSignInToSaveIntent,
  getSignInToSaveIntent,
} from '../SignInToSaveModal';
import { useAuth } from '../../contexts/AuthContext';
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
  priceAlertOn?: boolean;
  onPriceAlertClick?: () => void;
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
  userRating,
  priceAlertOn,
  onPriceAlertClick,
}) => {
  const { isAuthenticated, isLoading } = useAuth();
  const [isSignInToSaveOpen, setIsSignInToSaveOpen] = useState(false);
  const ratings = [];
  if (rating1) ratings.push({ value: typeof rating1 === 'number' ? rating1.toFixed(1) : rating1, color: 'var(--color-rating-motortrend, #FFB74D)' });
  if (rating2) ratings.push({ value: typeof rating2 === 'number' ? (rating2 / 2).toFixed(1) : rating2, color: 'var(--color-rating-community, #33CCFF)' });

  // Get body style from vehicle name
  const bodyStyles = getVehicleBodyStyle(name);
  const bodyStyle = bodyStyles[0] || 'Sedan'; // Use first body style or default to Sedan

  const handleBookmark = useCallback(() => {
    if (!onBookmark) return;

    if (isBookmarked || isAuthenticated) {
      onBookmark();
      return;
    }

    setIsSignInToSaveOpen(true);
  }, [isAuthenticated, isBookmarked, onBookmark]);

  useEffect(() => {
    if (isLoading || !isAuthenticated || !onBookmark || isBookmarked) return;

    const pendingSave = getSignInToSaveIntent();
    if (pendingSave?.itemType !== 'vehicle' || pendingSave.itemName !== name) return;

    clearSignInToSaveIntent();
    onBookmark();
  }, [isAuthenticated, isBookmarked, isLoading, name, onBookmark]);

  return (
    <>
      <Card
        image={image}
        title={name}
        type={bodyStyle}
        ratings={ratings}
        hasMultipleRatings={hasMultipleRatings}
        onBookmark={onBookmark ? handleBookmark : undefined}
        isBookmarked={isBookmarked}
        ownership={ownership}
        onOwnershipChange={onOwnershipChange}
        onAction={onViewDetails}
        actionText="View Details"
        onRate={onRate}
        userRating={userRating}
        priceAlertOn={priceAlertOn}
        onPriceAlertClick={onPriceAlertClick}
      />
      <SignInToSaveModal
        isOpen={isSignInToSaveOpen}
        onClose={() => setIsSignInToSaveOpen(false)}
        itemType="vehicle"
        itemName={name}
        itemImage={image}
      />
    </>
  );
};

export default VehicleCard;
