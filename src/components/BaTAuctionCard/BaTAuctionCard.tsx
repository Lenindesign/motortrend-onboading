import React from 'react';
import { CardShell } from '../atoms/CardShell/CardShell';
import Icon from '../Icon';
import './BaTAuctionCard.css';
import { useImageFallback } from '../../hooks/useImageFallback';

export interface BaTAuctionCardProps {
  /** URL of the vehicle image */
  image: string;
  /** Title of the listing (Year Make Model) */
  title: string;
  /** Current bid amount */
  currentBid: number;
  /** Time remaining string (e.g. "2 days", "4 hours") */
  timeLeft: string;
  /** Location of the vehicle */
  location?: string;
  /** Whether the auction has no reserve */
  isNoReserve?: boolean;
  /** Whether this is a premium listing */
  isPremium?: boolean;
  /** URL to the auction */
  url?: string;
  /** Number of bids placed */
  bidsCount?: number;
  /** Optional click handler */
  onClick?: () => void;
}

export const BaTAuctionCard: React.FC<BaTAuctionCardProps> = ({
  image,
  title,
  currentBid,
  timeLeft,
  location,
  isNoReserve = false,
  isPremium = false,
  url = '#',
  bidsCount,
  onClick
}) => {
  const { imgSrc, handleImageError } = useImageFallback(image);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(value);
  };

  const isEndingSoon = timeLeft.includes('hour') || timeLeft.includes('min') || timeLeft.includes('sec');

  return (
    <CardShell
      padding="none"
      hasHover={true}
      hasShadow={true}
      borderRadius="lg"
      background="neutral-lighter"
      onClick={onClick}
      className="bat-auction-card"
    >
      <a href={url} className="bat-auction-card__link" onClick={(e) => onClick && e.preventDefault()}>
        <div className="bat-auction-card__image-container">
          <img 
            src={imgSrc} 
            alt={title} 
            className="bat-auction-card__image"
            onError={handleImageError}
          />
          
          <div className="bat-auction-card__badges">
            {isNoReserve && (
              <span className="bat-auction-card__badge bat-auction-card__badge--no-reserve">
                No Reserve
              </span>
            )}
            {isPremium && (
              <span className="bat-auction-card__badge bat-auction-card__badge--premium">
                Premium
              </span>
            )}
          </div>

          <div className="bat-auction-card__logo-badge">
            BaT
          </div>
        </div>

        <div className="bat-auction-card__content">
          <h3 className="bat-auction-card__title">{title}</h3>
          
          <div className="bat-auction-card__details">
            {location && (
              <div className="bat-auction-card__meta">
                <Icon name="location_on" size={14} />
                {location}
              </div>
            )}
            
            <div className="bat-auction-card__bid-box">
              <div className="bat-auction-card__current-bid">
                {formatCurrency(currentBid)}
              </div>
              <div className={`bat-auction-card__time-left ${isEndingSoon ? 'bat-auction-card__time-left--ending' : ''}`}>
                <Icon name="schedule" size={14} />
                {timeLeft}
              </div>
            </div>
            
            {bidsCount !== undefined && (
              <div className="bat-auction-card__meta" style={{ marginTop: '4px', justifyContent: 'flex-end' }}>
                {bidsCount} bids
              </div>
            )}
          </div>
        </div>
      </a>
    </CardShell>
  );
};

export default BaTAuctionCard;

