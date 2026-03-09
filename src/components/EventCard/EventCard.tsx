/**
 * EventCard Component
 * Reusable card for displaying event previews in the events listing page.
 * Supports all brands (MotorTrend, HOT ROD, Road & Track).
 */

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../Icon';
import type { EventData } from '../../utils/events';
import { brandConfig, formatEventPrice } from '../../utils/events';

interface EventCardProps {
  event: EventData;
}

export const EventCard: React.FC<EventCardProps> = ({ event }) => {
  const navigate = useNavigate();
  const [isHovered, setIsHovered] = useState(false);
  const brand = brandConfig[event.brand];
  const lowestPrice = Math.min(...event.pricing.map(p => p.price));

  const cardStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    borderRadius: 'var(--border-radius-lg, 16px)',
    overflow: 'hidden',
    background: 'var(--color-white, #FFFFFF)',
    boxShadow: isHovered
      ? 'var(--shadow-card-hover, 0 8px 16px rgba(20, 20, 22, 0.12))'
      : 'var(--shadow-card, 0 4px 8px rgba(20, 20, 22, 0.06))',
    transform: isHovered ? 'translateY(-4px)' : 'translateY(0)',
    transition: 'all 250ms cubic-bezier(0.4, 0, 0.2, 1)',
    cursor: 'pointer',
  };

  const imageWrapperStyle: React.CSSProperties = {
    position: 'relative',
    width: '100%',
    paddingTop: '56.25%',
    overflow: 'hidden',
    background: 'var(--color-neutrals-7, #F4F5F6)',
  };

  const imageStyle: React.CSSProperties = {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    transition: 'transform 500ms cubic-bezier(0.4, 0, 0.2, 1)',
    transform: isHovered ? 'scale(1.05)' : 'scale(1)',
  };

  const brandBadgeStyle: React.CSSProperties = {
    position: 'absolute',
    top: '16px',
    left: '16px',
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    padding: '6px 12px',
    background: 'rgba(0, 0, 0, 0.7)',
    backdropFilter: 'blur(8px)',
    borderRadius: 'var(--border-radius-sm, 4px)',
    color: 'white',
    fontSize: '11px',
    fontWeight: 700,
    fontFamily: 'var(--font-body, Geist, sans-serif)',
    textTransform: 'uppercase',
    letterSpacing: '0.8px',
  };

  const statusBadgeStyle: React.CSSProperties = {
    position: 'absolute',
    top: '16px',
    right: '16px',
    display: 'inline-flex',
    alignItems: 'center',
    gap: '4px',
    padding: '5px 10px',
    background: event.status === 'upcoming' ? 'var(--color-primary-1, #E90C17)' : 'var(--color-neutrals-1, #141416)',
    borderRadius: 'var(--border-radius-sm, 4px)',
    color: 'white',
    fontSize: '10px',
    fontWeight: 700,
    fontFamily: 'var(--font-body, Geist, sans-serif)',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  };

  const bodyStyle: React.CSSProperties = {
    padding: '20px 24px 24px',
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    flex: 1,
  };

  const titleStyle: React.CSSProperties = {
    fontFamily: 'var(--font-heading, Poppins, sans-serif)',
    fontWeight: 700,
    fontSize: '20px',
    lineHeight: 1.25,
    color: 'var(--color-neutrals-1, #141416)',
    margin: 0,
  };

  const metaRowStyle: React.CSSProperties = {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '16px',
    fontSize: '13px',
    fontFamily: 'var(--font-body, Geist, sans-serif)',
    color: 'var(--color-neutrals-4, #6E7481)',
  };

  const metaItemStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
  };

  const descStyle: React.CSSProperties = {
    fontFamily: 'var(--font-body, Geist, sans-serif)',
    fontSize: '14px',
    lineHeight: 1.5,
    color: 'var(--color-neutrals-3, #353945)',
    margin: 0,
    display: '-webkit-box',
    WebkitLineClamp: 3,
    WebkitBoxOrient: 'vertical',
    overflow: 'hidden',
  };

  const footerStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '16px 24px',
    borderTop: '1px solid var(--color-neutrals-6, #E6E8EC)',
    marginTop: 'auto',
  };

  const priceStyle: React.CSSProperties = {
    fontFamily: 'var(--font-heading, Poppins, sans-serif)',
    fontWeight: 700,
    fontSize: '18px',
    color: 'var(--color-neutrals-1, #141416)',
  };

  const priceUnitStyle: React.CSSProperties = {
    fontFamily: 'var(--font-body, Geist, sans-serif)',
    fontSize: '12px',
    color: 'var(--color-neutrals-4, #6E7481)',
    fontWeight: 400,
  };

  const ctaBtnStyle: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    padding: '10px 20px',
    background: 'var(--color-neutrals-1, #141416)',
    color: 'white',
    border: 'none',
    borderRadius: 'var(--border-radius-md, 8px)',
    fontFamily: 'var(--font-body, Geist, sans-serif)',
    fontWeight: 600,
    fontSize: '13px',
    cursor: 'pointer',
    transition: 'background 150ms ease',
  };

  const statusLabels: Record<string, string> = {
    upcoming: 'Upcoming',
    ongoing: 'Happening Now',
    past: 'Past Event',
    'sold-out': 'Sold Out',
  };

  return (
    <div
      style={cardStyle}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => navigate(`/events/${event.slug}`)}
      role="article"
      aria-label={event.title}
    >
      <div style={imageWrapperStyle}>
        <img
          src={event.heroImage}
          alt={event.title}
          style={imageStyle}
          onError={(e) => {
            (e.target as HTMLImageElement).src = `https://placehold.co/800x450/141416/FCFCFD?text=${encodeURIComponent(event.title)}`;
          }}
        />
        <span style={brandBadgeStyle}>
          <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: brand.color, flexShrink: 0 }} />
          {brand.name}
        </span>
        <span style={statusBadgeStyle}>
          {statusLabels[event.status] || event.status}
        </span>
      </div>

      <div style={bodyStyle}>
        <h3 style={titleStyle}>{event.title}</h3>
        <div style={metaRowStyle}>
          <span style={metaItemStyle}>
            <Icon name="calendar_today" size={14} />
            {event.dates.displayText}
          </span>
          <span style={metaItemStyle}>
            <Icon name="location_on" size={14} />
            {event.location.primary}
          </span>
        </div>
        <p style={descStyle}>{event.description}</p>
      </div>

      <div style={footerStyle}>
        <div>
          <span style={priceStyle}>From {formatEventPrice(lowestPrice)}</span>
          <span style={priceUnitStyle}> / {event.pricing[0]?.unit}</span>
        </div>
        <button
          style={ctaBtnStyle}
          onClick={(e) => {
            e.stopPropagation();
            navigate(`/events/${event.slug}`);
          }}
        >
          View Details
          <Icon name="arrow_forward" size={14} />
        </button>
      </div>
    </div>
  );
};

export default EventCard;
