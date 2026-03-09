/**
 * Events Community Page
 * Community-style feed layout for browsing and engaging with events.
 * Mirrors the Community page layout: left sidebar, main feed, right sidebar.
 */

import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../components/Icon';
import {
  getEvents,
  brandConfig,
  formatEventPrice,
  type EventData,
  type EventBrand,
} from '../../utils/events';
import './EventsCommunity.css';

// ─── Event Post Card (feed item) ────────────────────────────────────────────

interface EventPostCardProps {
  event: EventData;
  onRSVP?: (eventId: string) => void;
  isRSVPd?: boolean;
}

const EventPostCard: React.FC<EventPostCardProps> = ({ event, onRSVP, isRSVPd }) => {
  const navigate = useNavigate();
  const brand = brandConfig[event.brand];
  const [isHovered, setIsHovered] = useState(false);
  const [isShareHovered, setIsShareHovered] = useState(false);

  const daysUntil = () => {
    const start = new Date(event.dates.start);
    const now = new Date();
    const diff = Math.ceil((start.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    if (diff < 0) return 'Past';
    if (diff === 0) return 'Today';
    if (diff === 1) return 'Tomorrow';
    return `${diff} days away`;
  };

  const handleShare = (e: React.MouseEvent) => {
    e.stopPropagation();
    const url = `${window.location.origin}/events/${event.slug}`;
    navigator.clipboard.writeText(url);
  };

  return (
    <article
      className="events-feed__card"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Card Header - Brand + Timestamp */}
      <div className="events-feed__card-header">
        <div className="events-feed__card-brand">
          <span
            className="events-feed__brand-dot"
            style={{ background: brand.color }}
          />
          <span className="events-feed__brand-name">{brand.name}</span>
          <Icon name="check_circle" size={14} className="events-feed__verified" />
          <span className="events-feed__separator">·</span>
          <span className="events-feed__countdown">{daysUntil()}</span>
        </div>
        <div className="events-feed__card-type">
          <Icon name={brand.icon} size={14} />
          {event.type.replace('-', ' ')}
        </div>
      </div>

      {/* Card Image */}
      <div
        className="events-feed__card-image"
        onClick={() => navigate(`/events/${event.slug}`)}
        style={{ cursor: 'pointer' }}
      >
        <img
          src={event.heroImage}
          alt={event.title}
          style={{
            transform: isHovered ? 'scale(1.03)' : 'scale(1)',
            transition: 'transform 500ms cubic-bezier(0.4, 0, 0.2, 1)',
          }}
          onError={(e) => {
            (e.target as HTMLImageElement).src = `https://placehold.co/800x450/141416/FCFCFD?text=${encodeURIComponent(event.title)}`;
          }}
        />
        <div className="events-feed__image-overlay">
          <span className="events-feed__status-badge" data-status={event.status}>
            {event.status === 'upcoming' ? 'Upcoming' : event.status === 'ongoing' ? 'Happening Now' : event.status}
          </span>
        </div>
      </div>

      {/* Card Body */}
      <div className="events-feed__card-body">
        <h3
          className="events-feed__card-title"
          onClick={() => navigate(`/events/${event.slug}`)}
          style={{ cursor: 'pointer' }}
        >
          {event.title}
        </h3>
        <p className="events-feed__card-desc">{event.description}</p>

        {/* Meta chips */}
        <div className="events-feed__meta-row">
          <span className="events-feed__meta-chip">
            <Icon name="calendar_today" size={14} />
            {event.dates.displayText}
          </span>
          <span className="events-feed__meta-chip">
            <Icon name="location_on" size={14} />
            {event.location.primary}
          </span>
          {event.pricing[0] && event.pricing[0].price > 0 && (
            <span className="events-feed__meta-chip events-feed__meta-chip--price">
              <Icon name="confirmation_number" size={14} />
              From {formatEventPrice(event.pricing[0].price)}
            </span>
          )}
        </div>

        {/* Highlights preview */}
        {event.highlights.length > 0 && (
          <div className="events-feed__highlights-preview">
            {event.highlights.slice(0, 3).map((h, i) => (
              <span key={i} className="events-feed__highlight-chip">
                <Icon name={h.icon} size={13} />
                {h.title}
              </span>
            ))}
            {event.highlights.length > 3 && (
              <span className="events-feed__highlight-more">+{event.highlights.length - 3} more</span>
            )}
          </div>
        )}
      </div>

      {/* Card Actions */}
      <div className="events-feed__card-actions">
        <button
          className={`events-feed__action-btn events-feed__action-btn--rsvp ${isRSVPd ? 'events-feed__action-btn--active' : ''}`}
          onClick={(e) => { e.stopPropagation(); onRSVP?.(event.id); }}
        >
          <Icon name={isRSVPd ? 'event_available' : 'event'} size={18} />
          {isRSVPd ? 'Going' : 'Interested'}
        </button>
        <button
          className="events-feed__action-btn"
          onClick={() => navigate(`/events/${event.slug}`)}
        >
          <Icon name="visibility" size={18} />
          View Details
        </button>
        <button
          className={`events-feed__action-btn ${isShareHovered ? 'events-feed__action-btn--hover' : ''}`}
          onClick={handleShare}
          onMouseEnter={() => setIsShareHovered(true)}
          onMouseLeave={() => setIsShareHovered(false)}
        >
          <Icon name="share" size={18} />
          Share
        </button>
        {event.ticketsUrl && (
          <a
            href={event.ticketsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="events-feed__action-btn events-feed__action-btn--ticket"
            onClick={(e) => e.stopPropagation()}
          >
            <Icon name="confirmation_number" size={18} />
            Tickets
          </a>
        )}
      </div>
    </article>
  );
};

// ─── Brand Sidebar Item ──────────────────────────────────────────────────────

interface BrandSidebarItemProps {
  brand: EventBrand;
  count: number;
  isActive: boolean;
  onClick: () => void;
}

const BrandSidebarItem: React.FC<BrandSidebarItemProps> = ({ brand, count, isActive, onClick }) => {
  const config = brandConfig[brand];
  return (
    <button
      className={`events-sidebar__brand-item ${isActive ? 'events-sidebar__brand-item--active' : ''}`}
      onClick={onClick}
    >
      <span
        className="events-sidebar__brand-icon"
        style={{ background: config.iconImage ? 'transparent' : config.color }}
      >
        {config.iconImage ? (
          <img src={config.iconImage} alt={config.name} className="events-sidebar__brand-icon-img" />
        ) : (
          <Icon name={config.icon} size={16} style={{ color: 'white' }} />
        )}
      </span>
      <div className="events-sidebar__brand-info">
        <span className="events-sidebar__brand-name">{config.name}</span>
        <span className="events-sidebar__brand-count">{count} events</span>
      </div>
    </button>
  );
};

// ─── Main Events Community Page ──────────────────────────────────────────────

export const EventsCommunity: React.FC = () => {
  const navigate = useNavigate();
  const events = getEvents();
  const [activeBrand, setActiveBrand] = useState<'all' | EventBrand>('all');
  const [sortBy, setSortBy] = useState<'upcoming' | 'popular' | 'newest'>('upcoming');
  const [rsvpEvents, setRsvpEvents] = useState<Set<string>>(new Set());

  const brandCounts = useMemo(() => {
    const counts: Partial<Record<EventBrand, number>> = {};
    events.forEach(e => { counts[e.brand] = (counts[e.brand] || 0) + 1; });
    return counts;
  }, [events]);

  const filteredEvents = useMemo(() => {
    let filtered = activeBrand === 'all' ? events : events.filter(e => e.brand === activeBrand);

    if (sortBy === 'upcoming') {
      filtered.sort((a, b) => new Date(a.dates.start).getTime() - new Date(b.dates.start).getTime());
    } else if (sortBy === 'newest') {
      filtered.sort((a, b) => new Date(b.dates.start).getTime() - new Date(a.dates.start).getTime());
    }
    return filtered;
  }, [events, activeBrand, sortBy]);

  const handleRSVP = (eventId: string) => {
    setRsvpEvents(prev => {
      const next = new Set(prev);
      if (next.has(eventId)) next.delete(eventId);
      else next.add(eventId);
      return next;
    });
  };

  const upcomingCount = events.filter(e => e.status === 'upcoming').length;
  const nextEvent = events
    .filter(e => new Date(e.dates.start) > new Date())
    .sort((a, b) => new Date(a.dates.start).getTime() - new Date(b.dates.start).getTime())[0];

  return (
    <div className="events-community">
      <div className="events-community__container">

        {/* ── Left Sidebar ── */}
        <aside className="events-community__sidebar">
          <div className="events-sidebar__section">
            <h3 className="events-sidebar__heading">
              <Icon name="local_activity" size={18} />
              Events Hub
            </h3>
            <nav className="events-sidebar__nav">
              <button
                className={`events-sidebar__nav-item ${activeBrand === 'all' ? 'events-sidebar__nav-item--active' : ''}`}
                onClick={() => setActiveBrand('all')}
              >
                <Icon name="dashboard" size={18} />
                All Events
                <span className="events-sidebar__nav-count">{events.length}</span>
              </button>
            </nav>
          </div>

          <div className="events-sidebar__section">
            <h4 className="events-sidebar__subheading">Brands</h4>
            {(Object.keys(brandConfig) as EventBrand[]).map(brand => (
              <BrandSidebarItem
                key={brand}
                brand={brand}
                count={brandCounts[brand] || 0}
                isActive={activeBrand === brand}
                onClick={() => setActiveBrand(activeBrand === brand ? 'all' : brand)}
              />
            ))}
          </div>

          <div className="events-sidebar__section">
            <button
              className="events-sidebar__browse-btn"
              onClick={() => navigate('/events/browse')}
            >
              <Icon name="grid_view" size={18} />
              Browse All Events
            </button>
          </div>
        </aside>

        {/* ── Main Feed ── */}
        <main className="events-community__main">
          {/* Feed Header */}
          <div className="events-feed__header">
            <h2 className="events-feed__header-title">
              {activeBrand === 'all' ? 'Events Feed' : brandConfig[activeBrand].name}
            </h2>
            <p className="events-feed__header-sub">
              {activeBrand === 'all'
                ? 'All upcoming automotive events across our brands.'
                : brandConfig[activeBrand].tagline}
            </p>
          </div>

          {/* Mobile brand chips */}
          <div className="events-feed__mobile-brands">
            <div className="events-feed__mobile-brands-scroll">
              <button
                className={`events-feed__mobile-chip ${activeBrand === 'all' ? 'events-feed__mobile-chip--active' : ''}`}
                onClick={() => setActiveBrand('all')}
              >
                All
              </button>
              {(Object.keys(brandConfig) as EventBrand[]).map(brand => (
                <button
                  key={brand}
                  className={`events-feed__mobile-chip ${activeBrand === brand ? 'events-feed__mobile-chip--active' : ''}`}
                  onClick={() => setActiveBrand(brand)}
                >
                  <span className="events-feed__mobile-chip-dot" style={{ background: brandConfig[brand].color }} />
                  {brandConfig[brand].name}
                </button>
              ))}
            </div>
          </div>

          {/* Sort Bar */}
          <div className="events-feed__sort-bar">
            <button
              className={`events-feed__sort-btn ${sortBy === 'upcoming' ? 'events-feed__sort-btn--active' : ''}`}
              onClick={() => setSortBy('upcoming')}
            >
              <Icon name="event" size={18} />
              Upcoming
            </button>
            <button
              className={`events-feed__sort-btn ${sortBy === 'popular' ? 'events-feed__sort-btn--active' : ''}`}
              onClick={() => setSortBy('popular')}
            >
              <Icon name="local_fire_department" size={18} />
              Popular
            </button>
            <button
              className={`events-feed__sort-btn ${sortBy === 'newest' ? 'events-feed__sort-btn--active' : ''}`}
              onClick={() => setSortBy('newest')}
            >
              <Icon name="new_releases" size={18} />
              Newest
            </button>
          </div>

          {/* Feed */}
          <div className="events-feed__list">
            {filteredEvents.map(event => (
              <EventPostCard
                key={event.id}
                event={event}
                onRSVP={handleRSVP}
                isRSVPd={rsvpEvents.has(event.id)}
              />
            ))}
            {filteredEvents.length === 0 && (
              <div className="events-feed__empty">
                <Icon name="event_busy" size={48} />
                <h3>No events found</h3>
                <p>Try selecting a different brand or check back later.</p>
              </div>
            )}
          </div>
        </main>

        {/* ── Right Sidebar ── */}
        <aside className="events-community__right-sidebar">
          {/* Next Up Card */}
          {nextEvent && (
            <div className="events-right__card">
              <div className="events-right__card-header">
                <h3>
                  <Icon name="upcoming" size={16} />
                  Next Up
                </h3>
              </div>
              <div className="events-right__card-content">
                <div
                  className="events-right__next-event"
                  onClick={() => navigate(`/events/${nextEvent.slug}`)}
                >
                  <div className="events-right__next-image">
                    <img
                      src={nextEvent.heroImage}
                      alt={nextEvent.title}
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = `https://placehold.co/300x170/141416/FCFCFD?text=${encodeURIComponent(nextEvent.title)}`;
                      }}
                    />
                  </div>
                  <h4 className="events-right__next-title">{nextEvent.title}</h4>
                  <div className="events-right__next-meta">
                    <span><Icon name="calendar_today" size={13} /> {nextEvent.dates.displayText}</span>
                    <span><Icon name="location_on" size={13} /> {nextEvent.location.primary}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Stats Card */}
          <div className="events-right__card">
            <div className="events-right__card-header">
              <h3>
                <Icon name="insights" size={16} />
                Events Overview
              </h3>
            </div>
            <div className="events-right__card-content">
              <div className="events-right__stats">
                <div className="events-right__stat">
                  <div className="events-right__stat-value">{upcomingCount}</div>
                  <div className="events-right__stat-label">Upcoming</div>
                </div>
                <div className="events-right__stat">
                  <div className="events-right__stat-value">{Object.keys(brandCounts).length}</div>
                  <div className="events-right__stat-label">Brands</div>
                </div>
                <div className="events-right__stat">
                  <div className="events-right__stat-value">{rsvpEvents.size}</div>
                  <div className="events-right__stat-label">My RSVPs</div>
                </div>
              </div>
            </div>
          </div>

          {/* Calendar Quick View */}
          <div className="events-right__card">
            <div className="events-right__card-header">
              <h3>
                <Icon name="date_range" size={16} />
                Calendar
              </h3>
            </div>
            <div className="events-right__card-content">
              <div className="events-right__calendar-list">
                {events
                  .filter(e => new Date(e.dates.start) > new Date())
                  .sort((a, b) => new Date(a.dates.start).getTime() - new Date(b.dates.start).getTime())
                  .slice(0, 6)
                  .map(e => (
                    <div
                      key={e.id}
                      className="events-right__calendar-item"
                      onClick={() => navigate(`/events/${e.slug}`)}
                    >
                      <div className="events-right__calendar-date">
                        <span className="events-right__calendar-month">
                          {new Date(e.dates.start).toLocaleDateString('en-US', { month: 'short' })}
                        </span>
                        <span className="events-right__calendar-day">
                          {new Date(e.dates.start).getDate()}
                        </span>
                      </div>
                      <div className="events-right__calendar-info">
                        <span className="events-right__calendar-title">{e.title}</span>
                        <span className="events-right__calendar-location">
                          <span className="events-right__calendar-dot" style={{ background: brandConfig[e.brand].color }} />
                          {e.location.primary}
                        </span>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default EventsCommunity;
