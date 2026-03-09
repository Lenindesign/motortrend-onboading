/**
 * Events Page
 * Global template for brand events (MotorTrend, HOT ROD, Road & Track).
 * Handles both listing view (/events) and detail view (/events/:slug).
 */

import React, { useState, useMemo, useRef, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Icon from '../../components/Icon';
import { EventCard } from '../../components/EventCard';
import {
  getEvents,
  getEventBySlug,
  brandConfig,
  formatEventPrice,
  type EventData,
  type EventBrand,
} from '../../utils/events';

// ─── Listing Page ────────────────────────────────────────────────────────────

const EventsListing: React.FC = () => {
  const [activeBrand, setActiveBrand] = useState<'all' | EventBrand>('all');
  const [hoveredFilter, setHoveredFilter] = useState<string | null>(null);
  const events = getEvents();

  const filteredEvents = useMemo(() => {
    if (activeBrand === 'all') return events;
    return events.filter(e => e.brand === activeBrand);
  }, [events, activeBrand]);

  const brands: { key: 'all' | EventBrand; label: string }[] = [
    { key: 'all', label: 'All Events' },
    { key: 'motortrend', label: 'MotorTrend' },
    { key: 'hotrod', label: 'HOT ROD' },
    { key: 'roadandtrack', label: 'Road & Track' },
  ];

  const heroStyle: React.CSSProperties = {
    position: 'relative',
    width: '100%',
    minHeight: '400px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
    background: 'linear-gradient(135deg, #141416 0%, #23262F 50%, #141416 100%)',
    overflow: 'hidden',
  };

  const heroOverlayPattern: React.CSSProperties = {
    position: 'absolute',
    inset: 0,
    opacity: 0.04,
    backgroundImage: 'radial-gradient(circle at 25% 25%, white 1px, transparent 1px), radial-gradient(circle at 75% 75%, white 1px, transparent 1px)',
    backgroundSize: '48px 48px',
  };

  const heroContentStyle: React.CSSProperties = {
    position: 'relative',
    zIndex: 1,
    padding: '60px 24px',
    maxWidth: '800px',
  };

  const heroTitleStyle: React.CSSProperties = {
    fontFamily: 'var(--font-heading, Poppins, sans-serif)',
    fontWeight: 800,
    fontSize: 'clamp(32px, 5vw, 56px)',
    lineHeight: 1.1,
    color: 'white',
    margin: '0 0 16px',
    letterSpacing: '-0.02em',
  };

  const heroSubStyle: React.CSSProperties = {
    fontFamily: 'var(--font-body, Geist, sans-serif)',
    fontSize: '18px',
    lineHeight: 1.5,
    color: 'var(--color-neutrals-5, #B1B5C3)',
    margin: 0,
    maxWidth: '600px',
    marginLeft: 'auto',
    marginRight: 'auto',
  };

  const containerStyle: React.CSSProperties = {
    maxWidth: '1280px',
    margin: '0 auto',
    padding: '0 24px',
  };

  const filtersStyle: React.CSSProperties = {
    display: 'flex',
    gap: '8px',
    padding: '32px 0 24px',
    flexWrap: 'wrap',
  };

  const getFilterBtnStyle = (key: string): React.CSSProperties => ({
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    padding: '10px 20px',
    background: activeBrand === key ? 'var(--color-neutrals-1, #141416)' : (hoveredFilter === key ? 'var(--color-neutrals-7, #F4F5F6)' : 'white'),
    color: activeBrand === key ? 'white' : 'var(--color-neutrals-1, #141416)',
    border: activeBrand === key ? 'none' : '1px solid var(--color-neutrals-6, #E6E8EC)',
    borderRadius: 'var(--border-radius-full, 100px)',
    fontFamily: 'var(--font-body, Geist, sans-serif)',
    fontWeight: 600,
    fontSize: '13px',
    cursor: 'pointer',
    transition: 'all 150ms ease',
  });

  const gridStyle: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(380px, 1fr))',
    gap: '32px',
    paddingBottom: '64px',
  };

  const sectionTitleStyle: React.CSSProperties = {
    fontFamily: 'var(--font-heading, Poppins, sans-serif)',
    fontWeight: 700,
    fontSize: '14px',
    color: 'var(--color-neutrals-4, #6E7481)',
    textTransform: 'uppercase',
    letterSpacing: '1px',
    margin: '0 0 24px',
  };

  return (
    <div>
      {/* Hero */}
      <div style={heroStyle}>
        <div style={heroOverlayPattern} />
        <div style={heroContentStyle}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', marginBottom: '24px' }}>
            <Icon name="local_activity" size={28} style={{ color: 'var(--color-primary-1, #E90C17)' }} />
            <span style={{ fontFamily: 'var(--font-body, Geist, sans-serif)', fontSize: '13px', fontWeight: 700, color: 'var(--color-primary-1, #E90C17)', textTransform: 'uppercase', letterSpacing: '2px' }}>
              Hearst Autos Events
            </span>
          </div>
          <h1 style={heroTitleStyle}>Experiences & Events</h1>
          <p style={heroSubStyle}>
            From cross-country power tours to luxury driving rallies and world-class auto shows — find your next automotive adventure.
          </p>
        </div>
      </div>

      {/* Filters + Grid */}
      <div style={containerStyle}>
        <div style={filtersStyle}>
          {brands.map(b => (
            <button
              key={b.key}
              style={getFilterBtnStyle(b.key)}
              onClick={() => setActiveBrand(b.key)}
              onMouseEnter={() => setHoveredFilter(b.key)}
              onMouseLeave={() => setHoveredFilter(null)}
            >
              {b.key !== 'all' && (
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: brandConfig[b.key as EventBrand].color, flexShrink: 0 }} />
              )}
              {b.label}
            </button>
          ))}
        </div>

        <h2 style={sectionTitleStyle}>
          {activeBrand === 'all' ? `${filteredEvents.length} Events` : `${brandConfig[activeBrand].name} — ${filteredEvents.length} Events`}
        </h2>

        <div style={gridStyle}>
          {filteredEvents.map(event => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      </div>
    </div>
  );
};

// ─── Detail Page ─────────────────────────────────────────────────────────────

const EventDetail: React.FC<{ event: EventData }> = ({ event }) => {
  const navigate = useNavigate();
  const brand = brandConfig[event.brand];
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [activeScheduleDay, setActiveScheduleDay] = useState(0);
  const [hoveredHighlight, setHoveredHighlight] = useState<number | null>(null);
  const [hoveredPricing, setHoveredPricing] = useState<number | null>(null);
  const [testimonialIdx, setTestimonialIdx] = useState(0);
  const scheduleRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Auto-rotate testimonials
  useEffect(() => {
    if (event.testimonials.length <= 1) return;
    const interval = setInterval(() => {
      setTestimonialIdx(i => (i + 1) % event.testimonials.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [event.testimonials.length]);

  const container: React.CSSProperties = { maxWidth: '1280px', margin: '0 auto', padding: '0 24px' };

  // ── Hero ──
  const heroStyle: React.CSSProperties = {
    position: 'relative',
    width: '100%',
    minHeight: '520px',
    display: 'flex',
    alignItems: 'flex-end',
    overflow: 'hidden',
  };

  const heroImgStyle: React.CSSProperties = {
    position: 'absolute',
    inset: 0,
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  };

  const heroGradient: React.CSSProperties = {
    position: 'absolute',
    inset: 0,
    background: 'linear-gradient(to top, rgba(20,20,22,0.95) 0%, rgba(20,20,22,0.5) 40%, transparent 70%)',
  };

  const heroContent: React.CSSProperties = {
    position: 'relative',
    zIndex: 1,
    width: '100%',
    maxWidth: '1280px',
    margin: '0 auto',
    padding: '40px 24px 48px',
  };

  // ── Section styles ──
  const sectionStyle: React.CSSProperties = {
    padding: '48px 0',
  };

  const sectionBorderedStyle: React.CSSProperties = {
    ...sectionStyle,
    borderTop: '1px solid var(--color-neutrals-6, #E6E8EC)',
  };

  const sectionHeadingStyle: React.CSSProperties = {
    fontFamily: 'var(--font-heading, Poppins, sans-serif)',
    fontWeight: 700,
    fontSize: '28px',
    lineHeight: 1.2,
    color: 'var(--color-neutrals-1, #141416)',
    margin: '0 0 8px',
  };

  const sectionLabelStyle: React.CSSProperties = {
    fontFamily: 'var(--font-body, Geist, sans-serif)',
    fontSize: '12px',
    fontWeight: 700,
    color: 'var(--color-primary-1, #E90C17)',
    textTransform: 'uppercase',
    letterSpacing: '1.5px',
    margin: '0 0 12px',
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
  };

  // ── Highlight card ──
  const getHighlightStyle = (idx: number): React.CSSProperties => ({
    padding: '28px 24px',
    background: hoveredHighlight === idx ? 'var(--color-neutrals-7, #F4F5F6)' : 'white',
    border: '1px solid var(--color-neutrals-6, #E6E8EC)',
    borderRadius: 'var(--border-radius-lg, 16px)',
    transition: 'all 200ms ease',
    transform: hoveredHighlight === idx ? 'translateY(-2px)' : 'none',
    boxShadow: hoveredHighlight === idx ? 'var(--shadow-card-hover, 0 8px 16px rgba(20, 20, 22, 0.08))' : 'none',
  });

  // ── Pricing card ──
  const getPricingCardStyle = (idx: number): React.CSSProperties => ({
    flex: '1 1 280px',
    maxWidth: '400px',
    padding: '32px 28px',
    background: hoveredPricing === idx ? 'var(--color-neutrals-1, #141416)' : 'white',
    border: hoveredPricing === idx ? 'none' : '1px solid var(--color-neutrals-6, #E6E8EC)',
    borderRadius: 'var(--border-radius-lg, 16px)',
    transition: 'all 250ms ease',
    transform: hoveredPricing === idx ? 'translateY(-4px)' : 'none',
    boxShadow: hoveredPricing === idx ? '0 16px 32px rgba(20, 20, 22, 0.16)' : 'var(--shadow-card, 0 4px 8px rgba(20, 20, 22, 0.06))',
    cursor: 'pointer',
    color: hoveredPricing === idx ? 'white' : 'var(--color-neutrals-1, #141416)',
  });

  return (
    <div>
      {/* ── Hero ── */}
      <div style={heroStyle}>
        <img
          src={event.heroImage}
          alt={event.title}
          style={heroImgStyle}
          onError={(e) => {
            (e.target as HTMLImageElement).src = `https://placehold.co/1600x600/141416/FCFCFD?text=${encodeURIComponent(event.title)}`;
          }}
        />
        <div style={heroGradient} />
        <div style={heroContent}>
          {/* Back nav */}
          <button
            onClick={() => navigate('/events')}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: '6px',
              background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(8px)',
              border: '1px solid rgba(255,255,255,0.15)', borderRadius: 'var(--border-radius-full, 100px)',
              padding: '8px 16px', color: 'white', fontFamily: 'var(--font-body, Geist, sans-serif)',
              fontSize: '13px', fontWeight: 500, cursor: 'pointer', marginBottom: '24px',
              transition: 'background 150ms ease',
            }}
          >
            <Icon name="arrow_back" size={16} />
            All Events
          </button>

          {/* Brand badge */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
            <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: brand.color }} />
            <span style={{
              fontFamily: 'var(--font-body, Geist, sans-serif)', fontSize: '12px', fontWeight: 700,
              color: 'rgba(255,255,255,0.7)', textTransform: 'uppercase', letterSpacing: '1.5px',
            }}>
              {brand.name} {event.type === 'experience' ? 'Experience' : 'Event'}
            </span>
          </div>

          <h1 style={{
            fontFamily: 'var(--font-heading, Poppins, sans-serif)', fontWeight: 800,
            fontSize: 'clamp(32px, 5vw, 52px)', lineHeight: 1.1, color: 'white',
            margin: '0 0 8px', letterSpacing: '-0.02em',
          }}>
            {event.title}
          </h1>

          {event.subtitle && (
            <p style={{
              fontFamily: 'var(--font-body, Geist, sans-serif)', fontSize: '18px',
              color: 'rgba(255,255,255,0.6)', margin: '0 0 24px',
            }}>
              {event.subtitle}
            </p>
          )}

          {/* Date + Location pills */}
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            <span style={{
              display: 'inline-flex', alignItems: 'center', gap: '6px',
              padding: '8px 16px', background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(4px)',
              borderRadius: 'var(--border-radius-full, 100px)',
              fontFamily: 'var(--font-body, Geist, sans-serif)', fontSize: '14px', fontWeight: 600, color: 'white',
            }}>
              <Icon name="calendar_today" size={16} />
              {event.dates.displayText}
            </span>
            <span style={{
              display: 'inline-flex', alignItems: 'center', gap: '6px',
              padding: '8px 16px', background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(4px)',
              borderRadius: 'var(--border-radius-full, 100px)',
              fontFamily: 'var(--font-body, Geist, sans-serif)', fontSize: '14px', fontWeight: 600, color: 'white',
            }}>
              <Icon name="location_on" size={16} />
              {event.location.primary}{event.location.region ? ` · ${event.location.region}` : ''}
            </span>
          </div>
        </div>
      </div>

      {/* ── Description ── */}
      <div style={container}>
        <div style={sectionStyle}>
          <div style={{ maxWidth: '720px' }}>
            <p style={{
              fontFamily: 'var(--font-body, Geist, sans-serif)', fontSize: '17px', lineHeight: 1.7,
              color: 'var(--color-neutrals-2, #23262F)', margin: 0,
            }}>
              {event.description}
            </p>
          </div>
        </div>

        {/* ── Highlights ── */}
        <div style={sectionBorderedStyle}>
          <span style={sectionLabelStyle}>
            <Icon name="star" size={14} />
            What's Included
          </span>
          <h2 style={sectionHeadingStyle}>Experience Highlights</h2>
          <p style={{ fontFamily: 'var(--font-body, Geist, sans-serif)', fontSize: '15px', color: 'var(--color-neutrals-4, #6E7481)', margin: '0 0 32px', maxWidth: '600px' }}>
            Everything that makes this event extraordinary.
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '16px' }}>
            {event.highlights.map((h, i) => (
              <div
                key={i}
                style={getHighlightStyle(i)}
                onMouseEnter={() => setHoveredHighlight(i)}
                onMouseLeave={() => setHoveredHighlight(null)}
              >
                <div style={{
                  width: '44px', height: '44px', borderRadius: 'var(--border-radius-md, 8px)',
                  background: 'var(--color-neutrals-7, #F4F5F6)', display: 'flex',
                  alignItems: 'center', justifyContent: 'center', marginBottom: '16px',
                  color: 'var(--color-neutrals-1, #141416)',
                }}>
                  <Icon name={h.icon} size={22} />
                </div>
                <h3 style={{
                  fontFamily: 'var(--font-heading, Poppins, sans-serif)', fontWeight: 600,
                  fontSize: '16px', color: 'var(--color-neutrals-1, #141416)', margin: '0 0 8px',
                }}>
                  {h.title}
                </h3>
                <p style={{
                  fontFamily: 'var(--font-body, Geist, sans-serif)', fontSize: '14px', lineHeight: 1.5,
                  color: 'var(--color-neutrals-4, #6E7481)', margin: 0,
                }}>
                  {h.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* ── Schedule / Itinerary ── */}
        {event.schedule.length > 0 && (
          <div style={sectionBorderedStyle} ref={scheduleRef}>
            <span style={sectionLabelStyle}>
              <Icon name="event_note" size={14} />
              Itinerary
            </span>
            <h2 style={sectionHeadingStyle}>Schedule</h2>
            <p style={{ fontFamily: 'var(--font-body, Geist, sans-serif)', fontSize: '15px', color: 'var(--color-neutrals-4, #6E7481)', margin: '0 0 32px', maxWidth: '600px' }}>
              {event.schedule.length} days of unforgettable experiences.
            </p>

            {/* Day tabs */}
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '24px' }}>
              {event.schedule.map((day, i) => (
                <button
                  key={i}
                  onClick={() => setActiveScheduleDay(i)}
                  style={{
                    padding: '8px 16px',
                    background: activeScheduleDay === i ? 'var(--color-neutrals-1, #141416)' : 'var(--color-neutrals-7, #F4F5F6)',
                    color: activeScheduleDay === i ? 'white' : 'var(--color-neutrals-3, #353945)',
                    border: 'none',
                    borderRadius: 'var(--border-radius-full, 100px)',
                    fontFamily: 'var(--font-body, Geist, sans-serif)',
                    fontSize: '13px',
                    fontWeight: activeScheduleDay === i ? 700 : 500,
                    cursor: 'pointer',
                    transition: 'all 150ms ease',
                  }}
                >
                  {day.date}
                </button>
              ))}
            </div>

            {/* Active day content */}
            {event.schedule[activeScheduleDay] && (
              <div style={{
                padding: '32px',
                background: 'var(--color-neutrals-8, #FCFCFD)',
                borderRadius: 'var(--border-radius-lg, 16px)',
                border: '1px solid var(--color-neutrals-6, #E6E8EC)',
              }}>
                <h3 style={{
                  fontFamily: 'var(--font-heading, Poppins, sans-serif)', fontWeight: 700,
                  fontSize: '22px', color: 'var(--color-neutrals-1, #141416)', margin: '0 0 4px',
                }}>
                  {event.schedule[activeScheduleDay].title}
                </h3>
                <div style={{
                  display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '16px',
                  fontFamily: 'var(--font-body, Geist, sans-serif)', fontSize: '14px', color: 'var(--color-neutrals-4, #6E7481)',
                }}>
                  <Icon name="location_on" size={16} />
                  {event.schedule[activeScheduleDay].location}
                </div>
                <p style={{
                  fontFamily: 'var(--font-body, Geist, sans-serif)', fontSize: '15px', lineHeight: 1.6,
                  color: 'var(--color-neutrals-2, #23262F)', margin: '0 0 20px',
                }}>
                  {event.schedule[activeScheduleDay].description}
                </p>
                {event.schedule[activeScheduleDay].highlights && (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                    {event.schedule[activeScheduleDay].highlights!.map((hl, j) => (
                      <span key={j} style={{
                        display: 'inline-flex', alignItems: 'center', gap: '4px',
                        padding: '6px 14px',
                        background: 'white',
                        border: '1px solid var(--color-neutrals-6, #E6E8EC)',
                        borderRadius: 'var(--border-radius-full, 100px)',
                        fontFamily: 'var(--font-body, Geist, sans-serif)',
                        fontSize: '13px', fontWeight: 500, color: 'var(--color-neutrals-2, #23262F)',
                      }}>
                        <Icon name="check_circle" size={14} style={{ color: 'var(--color-primary-1, #E90C17)' }} />
                        {hl}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* ── Pricing ── */}
        {event.pricing.length > 0 && (
          <div style={sectionBorderedStyle}>
            <span style={sectionLabelStyle}>
              <Icon name="confirmation_number" size={14} />
              Registration
            </span>
            <h2 style={sectionHeadingStyle}>Pricing & Tickets</h2>
            <p style={{ fontFamily: 'var(--font-body, Geist, sans-serif)', fontSize: '15px', color: 'var(--color-neutrals-4, #6E7481)', margin: '0 0 32px', maxWidth: '600px' }}>
              Choose the option that's right for you.
            </p>
            <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
              {event.pricing.map((tier, i) => (
                <div
                  key={i}
                  style={getPricingCardStyle(i)}
                  onMouseEnter={() => setHoveredPricing(i)}
                  onMouseLeave={() => setHoveredPricing(null)}
                  onClick={() => navigate(tier.ctaUrl)}
                >
                  <h3 style={{
                    fontFamily: 'var(--font-heading, Poppins, sans-serif)', fontWeight: 600,
                    fontSize: '14px', textTransform: 'uppercase', letterSpacing: '0.5px',
                    margin: '0 0 16px', opacity: 0.7,
                  }}>
                    {tier.label}
                  </h3>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginBottom: '8px' }}>
                    {tier.originalPrice && (
                      <span style={{
                        fontFamily: 'var(--font-heading, Poppins, sans-serif)', fontSize: '20px',
                        fontWeight: 500, textDecoration: 'line-through', opacity: 0.4,
                      }}>
                        {formatEventPrice(tier.originalPrice)}
                      </span>
                    )}
                    <span style={{
                      fontFamily: 'var(--font-heading, Poppins, sans-serif)', fontWeight: 800,
                      fontSize: '40px', lineHeight: 1,
                    }}>
                      {formatEventPrice(tier.price)}
                    </span>
                  </div>
                  <p style={{
                    fontFamily: 'var(--font-body, Geist, sans-serif)', fontSize: '13px',
                    opacity: 0.6, margin: '0 0 24px',
                  }}>
                    {tier.unit}
                  </p>
                  <button style={{
                    width: '100%', padding: '14px',
                    background: hoveredPricing === i ? 'white' : 'var(--color-neutrals-1, #141416)',
                    color: hoveredPricing === i ? 'var(--color-neutrals-1, #141416)' : 'white',
                    border: 'none', borderRadius: 'var(--border-radius-md, 8px)',
                    fontFamily: 'var(--font-body, Geist, sans-serif)', fontWeight: 700,
                    fontSize: '14px', cursor: 'pointer', transition: 'all 150ms ease',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
                  }}>
                    {tier.ctaText}
                    <Icon name="arrow_forward" size={16} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── Testimonials ── */}
        {event.testimonials.length > 0 && (
          <div style={sectionBorderedStyle}>
            <span style={sectionLabelStyle}>
              <Icon name="format_quote" size={14} />
              What Attendees Say
            </span>
            <div style={{
              padding: '40px',
              background: 'var(--color-neutrals-1, #141416)',
              borderRadius: 'var(--border-radius-lg, 16px)',
              textAlign: 'center',
              position: 'relative',
              overflow: 'hidden',
              minHeight: '200px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <Icon name="format_quote" size={40} style={{ color: 'rgba(255,255,255,0.08)', marginBottom: '16px' }} />
              <p style={{
                fontFamily: 'var(--font-body, Geist, sans-serif)', fontSize: '18px', lineHeight: 1.6,
                color: 'white', maxWidth: '640px', margin: '0 0 16px', fontStyle: 'italic',
              }}>
                "{event.testimonials[testimonialIdx].quote}"
              </p>
              <span style={{
                fontFamily: 'var(--font-body, Geist, sans-serif)', fontSize: '14px', fontWeight: 600,
                color: 'rgba(255,255,255,0.5)',
              }}>
                — {event.testimonials[testimonialIdx].author}
              </span>
              {event.testimonials.length > 1 && (
                <div style={{ display: 'flex', gap: '8px', marginTop: '24px' }}>
                  {event.testimonials.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setTestimonialIdx(i)}
                      style={{
                        width: i === testimonialIdx ? '24px' : '8px',
                        height: '8px',
                        borderRadius: '4px',
                        background: i === testimonialIdx ? 'var(--color-primary-1, #E90C17)' : 'rgba(255,255,255,0.2)',
                        border: 'none',
                        cursor: 'pointer',
                        transition: 'all 200ms ease',
                        padding: 0,
                      }}
                      aria-label={`Testimonial ${i + 1}`}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── Featured Articles ── */}
        {event.featuredArticles && event.featuredArticles.length > 0 && (
          <div style={sectionBorderedStyle}>
            <span style={sectionLabelStyle}>
              <Icon name="article" size={14} />
              Related Stories
            </span>
            <h2 style={sectionHeadingStyle}>From the Editors</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px', marginTop: '24px' }}>
              {event.featuredArticles.map((article, i) => (
                <div
                  key={i}
                  style={{
                    borderRadius: 'var(--border-radius-md, 8px)',
                    overflow: 'hidden',
                    border: '1px solid var(--color-neutrals-6, #E6E8EC)',
                    cursor: 'pointer',
                    transition: 'all 200ms ease',
                  }}
                  onClick={() => navigate(`/articles/${article.slug}`)}
                >
                  <div style={{ position: 'relative', paddingTop: '56.25%', background: 'var(--color-neutrals-7, #F4F5F6)' }}>
                    <img
                      src={article.image}
                      alt={article.title}
                      style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = `https://placehold.co/400x225/141416/FCFCFD?text=${encodeURIComponent(article.title.slice(0, 30))}`;
                      }}
                    />
                  </div>
                  <div style={{ padding: '16px' }}>
                    <h4 style={{
                      fontFamily: 'var(--font-heading, Poppins, sans-serif)', fontWeight: 600,
                      fontSize: '15px', lineHeight: 1.3, color: 'var(--color-neutrals-1, #141416)', margin: 0,
                    }}>
                      {article.title}
                    </h4>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── FAQ ── */}
        {event.faq.length > 0 && (
          <div style={sectionBorderedStyle}>
            <span style={sectionLabelStyle}>
              <Icon name="help" size={14} />
              FAQ
            </span>
            <h2 style={sectionHeadingStyle}>Frequently Asked Questions</h2>
            <div style={{ maxWidth: '720px', marginTop: '24px' }}>
              {event.faq.map((item, i) => (
                <div
                  key={i}
                  style={{
                    borderBottom: '1px solid var(--color-neutrals-6, #E6E8EC)',
                  }}
                >
                  <button
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    style={{
                      width: '100%',
                      padding: '20px 0',
                      background: 'none',
                      border: 'none',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      cursor: 'pointer',
                      gap: '16px',
                      textAlign: 'left',
                    }}
                  >
                    <span style={{
                      fontFamily: 'var(--font-heading, Poppins, sans-serif)', fontWeight: 600,
                      fontSize: '16px', color: 'var(--color-neutrals-1, #141416)', flex: 1,
                    }}>
                      {item.question}
                    </span>
                    <Icon
                      name={openFaq === i ? 'expand_less' : 'expand_more'}
                      size={20}
                      style={{ color: 'var(--color-neutrals-4, #6E7481)', flexShrink: 0 }}
                    />
                  </button>
                  {openFaq === i && (
                    <div style={{
                      padding: '0 0 20px',
                      fontFamily: 'var(--font-body, Geist, sans-serif)',
                      fontSize: '15px',
                      lineHeight: 1.6,
                      color: 'var(--color-neutrals-3, #353945)',
                    }}>
                      {item.answer}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── Sponsors ── */}
        {event.sponsors.length > 0 && (
          <div style={sectionBorderedStyle}>
            <span style={sectionLabelStyle}>Partners</span>
            <div style={{ display: 'flex', gap: '32px', alignItems: 'center', flexWrap: 'wrap' }}>
              {event.sponsors.map((s, i) => (
                <div key={i} style={{ textAlign: 'center' }}>
                  <span style={{
                    fontFamily: 'var(--font-body, Geist, sans-serif)', fontSize: '10px', fontWeight: 600,
                    textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--color-neutrals-4, #6E7481)',
                    display: 'block', marginBottom: '8px',
                  }}>
                    {s.tier === 'title' ? 'Title Sponsor' : s.tier === 'presenting' ? 'Official Partner' : 'Partner'}
                  </span>
                  <span style={{
                    fontFamily: 'var(--font-heading, Poppins, sans-serif)', fontWeight: 600,
                    fontSize: '18px', color: 'var(--color-neutrals-1, #141416)',
                  }}>
                    {s.name}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── CTA Banner ── */}
        <div style={{ padding: '48px 0 64px' }}>
          <div style={{
            padding: '48px 40px',
            background: 'var(--color-neutrals-1, #141416)',
            borderRadius: 'var(--border-radius-lg, 16px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '24px',
          }}>
            <div>
              <h3 style={{
                fontFamily: 'var(--font-heading, Poppins, sans-serif)', fontWeight: 700,
                fontSize: '24px', color: 'white', margin: '0 0 8px',
              }}>
                Ready to join?
              </h3>
              <p style={{
                fontFamily: 'var(--font-body, Geist, sans-serif)', fontSize: '15px',
                color: 'rgba(255,255,255,0.5)', margin: 0,
              }}>
                {event.dates.displayText} · {event.location.primary}
              </p>
            </div>
            <button
              onClick={() => navigate(event.registrationUrl)}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: '8px',
                padding: '16px 32px',
                background: 'var(--color-primary-1, #E90C17)',
                color: 'white', border: 'none',
                borderRadius: 'var(--border-radius-md, 8px)',
                fontFamily: 'var(--font-body, Geist, sans-serif)',
                fontWeight: 700, fontSize: '15px', cursor: 'pointer',
                transition: 'transform 150ms ease',
              }}
            >
              {event.pricing[0]?.ctaText || 'Register Now'}
              <Icon name="arrow_forward" size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// ─── Main Router Component ───────────────────────────────────────────────────

export const Events: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();

  if (slug) {
    const event = getEventBySlug(slug);
    if (!event) {
      return (
        <div style={{
          maxWidth: '1280px', margin: '0 auto', padding: '120px 24px',
          textAlign: 'center',
        }}>
          <Icon name="event_busy" size={64} style={{ color: 'var(--color-neutrals-5, #B1B5C3)', marginBottom: '16px' }} />
          <h2 style={{
            fontFamily: 'var(--font-heading, Poppins, sans-serif)', fontWeight: 700,
            fontSize: '24px', color: 'var(--color-neutrals-1, #141416)', margin: '0 0 8px',
          }}>
            Event Not Found
          </h2>
          <p style={{
            fontFamily: 'var(--font-body, Geist, sans-serif)', fontSize: '15px',
            color: 'var(--color-neutrals-4, #6E7481)', margin: '0 0 24px',
          }}>
            This event may have ended or the URL may be incorrect.
          </p>
          <button
            onClick={() => navigate('/events')}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: '6px',
              padding: '12px 24px', background: 'var(--color-neutrals-1, #141416)',
              color: 'white', border: 'none', borderRadius: 'var(--border-radius-md, 8px)',
              fontFamily: 'var(--font-body, Geist, sans-serif)', fontWeight: 600,
              fontSize: '14px', cursor: 'pointer',
            }}
          >
            <Icon name="arrow_back" size={16} />
            Back to Events
          </button>
        </div>
      );
    }
    return <EventDetail event={event} />;
  }

  return <EventsListing />;
};

export default Events;
