/**
 * BaTAuctionCard Component
 * Migrated to inline styles for Tailwind compatibility
 */

import React, { useState } from 'react';
import { CardShell } from '../atoms/CardShell/CardShell';
import Icon from '../Icon';
import { useImageFallback } from '../../hooks/useImageFallback';

export interface BaTAuctionCardProps {
  image: string;
  title: string;
  currentBid: number;
  timeLeft: string;
  location?: string;
  isNoReserve?: boolean;
  isPremium?: boolean;
  url?: string;
  bidsCount?: number;
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
  const [isHovered, setIsHovered] = useState(false);

  const formatCurrency = (value: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(value);
  const isEndingSoon = timeLeft.includes('hour') || timeLeft.includes('min') || timeLeft.includes('sec');

  // Styles
  const cardInnerStyle: React.CSSProperties = { display: 'flex', flexDirection: 'column', height: '100%', position: 'relative', textDecoration: 'none', color: 'inherit' };
  const linkStyle: React.CSSProperties = { textDecoration: 'none', color: 'inherit', display: 'flex', flexDirection: 'column', height: '100%' };
  const imageContainerStyle: React.CSSProperties = { position: 'relative', width: '100%', aspectRatio: '4/3', overflow: 'hidden', borderRadius: 'var(--border-radius-md, 8px) var(--border-radius-md, 8px) 0 0', backgroundColor: 'var(--color-neutrals-7, #F4F5F6)' };
  const imageStyle: React.CSSProperties = { width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)', transform: isHovered ? 'scale(1.05)' : 'none' };
  const badgesStyle: React.CSSProperties = { position: 'absolute', top: '12px', left: '12px', display: 'flex', gap: '8px', zIndex: 2 };
  const badgeBaseStyle: React.CSSProperties = { padding: '4px 8px', borderRadius: '4px', fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.5px', color: 'white', boxShadow: '0 2px 4px rgba(0,0,0,0.2)' };
  const noReserveBadgeStyle: React.CSSProperties = { ...badgeBaseStyle, backgroundColor: 'var(--color-semantic-error, #DC2626)' };
  const premiumBadgeStyle: React.CSSProperties = { ...badgeBaseStyle, backgroundColor: 'var(--color-neutrals-1, #141416)' };
  const logoBadgeStyle: React.CSSProperties = { position: 'absolute', top: '12px', right: '12px', background: 'rgba(255, 255, 255, 0.9)', padding: '4px 8px', borderRadius: '4px', fontFamily: "'Courier New', monospace", fontWeight: 700, fontSize: '12px', color: 'var(--color-neutrals-1, #141416)', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', zIndex: 2 };
  const contentStyle: React.CSSProperties = { padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px', flex: 1, background: 'white', borderRadius: '0 0 var(--border-radius-md, 8px) var(--border-radius-md, 8px)' };
  const titleStyle: React.CSSProperties = { fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: '16px', lineHeight: 1.4, color: isHovered ? 'var(--color-primary-1, #E90C17)' : 'var(--color-neutrals-1, #141416)', margin: 0, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', transition: 'color 150ms ease-in-out' };
  const detailsStyle: React.CSSProperties = { display: 'flex', flexDirection: 'column', gap: '8px', marginTop: 'auto' };
  const metaStyle: React.CSSProperties = { color: 'var(--color-neutrals-4, #6E7481)', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '4px' };
  const bidBoxStyle: React.CSSProperties = { background: 'var(--color-neutrals-7, #F4F5F6)', padding: '8px 12px', borderRadius: '6px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '4px' };
  const currentBidStyle: React.CSSProperties = { fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: '16px', color: 'var(--color-neutrals-1, #141416)' };
  const timeLeftStyle: React.CSSProperties = { fontSize: '12px', fontWeight: 600, color: isEndingSoon ? '#d93025' : 'var(--color-neutrals-4, #6E7481)', display: 'flex', alignItems: 'center', gap: '4px' };

  return (
    <CardShell padding="none" hasHover={true} hasShadow={true} borderRadius="lg" background="neutral-lighter" onClick={onClick} style={cardInnerStyle} onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}>
      <a href={url} style={linkStyle} onClick={(e) => onClick && e.preventDefault()}>
        <div style={imageContainerStyle}>
          <img src={imgSrc} alt={title} style={imageStyle} onError={handleImageError} />
          <div style={badgesStyle}>
            {isNoReserve && <span style={noReserveBadgeStyle}>No Reserve</span>}
            {isPremium && <span style={premiumBadgeStyle}>Premium</span>}
          </div>
          <div style={logoBadgeStyle}>BaT</div>
        </div>

        <div style={contentStyle}>
          <h3 style={titleStyle}>{title}</h3>
          <div style={detailsStyle}>
            {location && <div style={metaStyle}><Icon name="location_on" size={14} />{location}</div>}
            <div style={bidBoxStyle}>
              <div style={currentBidStyle}>{formatCurrency(currentBid)}</div>
              <div style={timeLeftStyle}><Icon name="schedule" size={14} />{timeLeft}</div>
            </div>
            {bidsCount !== undefined && <div style={{ ...metaStyle, marginTop: '4px', justifyContent: 'flex-end' }}>{bidsCount} bids</div>}
          </div>
        </div>
      </a>
    </CardShell>
  );
};

export default BaTAuctionCard;
