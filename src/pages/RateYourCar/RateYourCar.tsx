import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { VehicleSearch } from '../../components/VehicleSearch';
import WriteReviewModal from '../../components/WriteReviewModal';
import { ReviewSubmittedToast } from '../../components/ReviewSubmittedToast';
import Icon from '../../components/Icon';
import { useRating } from '../../contexts/RatingContext';
import { vehicleImageFor, parseVehicleName } from '../../utils/vehicleImages';
import type { ReviewData } from '../../components/UserReviews/UserReviews';

const PRIMARY = 'var(--color-primary-1, #E90C17)';
const STAR_FILLED = 'https://d2kde5ohu8qb21.cloudfront.net/files/691bde547554840002bab60c/star.svg';
const STAR_HALF = 'https://d2kde5ohu8qb21.cloudfront.net/files/691c8ba6a619270002cb5797/half-star.svg';
const STAR_EMPTY = 'https://d2kde5ohu8qb21.cloudfront.net/files/691bde5264217700021d6b71/star-stroke.svg';

const RATING_LABELS: Record<number, string> = {
  10: 'Awful', 20: 'Poor', 30: 'Below Average', 40: 'Fair',
  50: 'Average', 60: 'Decent', 70: 'Good', 80: 'Very Good',
  90: 'Excellent', 100: 'Perfect',
};

const BENEFITS = [
  { icon: 'people' as const, title: 'Help Real Buyers', desc: 'Your honest opinion helps thousands of shoppers make confident decisions.' },
  { icon: 'star' as const, title: 'Build Your Reputation', desc: 'Earn a verified owner badge and become a trusted voice in the community.' },
  { icon: 'trending_up' as const, title: 'Shape the Market', desc: 'Your ratings directly influence community scores seen by millions.' },
];

const STATS = [
  { value: '2.4M+', label: 'Monthly Shoppers' },
  { value: '180K+', label: 'Owner Ratings' },
  { value: '4.8', label: 'Avg. App Rating' },
];

export const RateYourCar: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { getUserRating, setUserRating } = useRating();

  const [selectedVehicle, setSelectedVehicle] = useState<string | null>(null);
  const [vehicleImage, setVehicleImage] = useState<string>('');
  const [selectedRating, setSelectedRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [hoveredStarIdx, setHoveredStarIdx] = useState<number | null>(null);
  const [step, setStep] = useState<'select' | 'rate' | 'done'>('select');
  const [showWriteReview, setShowWriteReview] = useState(false);
  const [toastVisible, setToastVisible] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  useEffect(() => {
    const styleId = 'rate-your-car-keyframes';
    if (!document.getElementById(styleId)) {
      const style = document.createElement('style');
      style.id = styleId;
      style.textContent = `
        @keyframes rycFadeUp { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes rycPulse { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.06); } }
        @keyframes rycTooltipIn { from { opacity: 0; transform: translate(-50%, 6px); } to { opacity: 1; transform: translate(-50%, 0); } }
        @keyframes rycConfetti { 0% { transform: translateY(0) rotate(0deg); opacity: 1; } 100% { transform: translateY(-60px) rotate(360deg); opacity: 0; } }
      `;
      document.head.appendChild(style);
    }
  }, []);

  // Pre-select vehicle from URL params (e.g. ?vehicle=2025+Toyota+Camry)
  useEffect(() => {
    const vehicleParam = searchParams.get('vehicle');
    if (vehicleParam && !selectedVehicle) {
      handleVehicleSelect(vehicleParam);
    }
  }, [searchParams]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleVehicleSelect = useCallback((name: string) => {
    setSelectedVehicle(name);
    setVehicleImage(vehicleImageFor(name));
    const existing = getUserRating(name);
    setSelectedRating(existing);
    setStep('rate');
  }, [getUserRating]);

  const handleStarClick = (rating: number) => {
    setSelectedRating(rating);
  };

  const handleSubmitRating = () => {
    if (!selectedVehicle || selectedRating === 0) return;
    setUserRating(selectedVehicle, selectedRating);
    setStep('done');
  };

  const handleWriteReview = () => {
    if (!selectedVehicle) return;
    if (selectedRating > 0) setUserRating(selectedVehicle, selectedRating);
    setShowWriteReview(true);
  };

  const handleReviewSubmit = (review: ReviewData) => {
    if (!selectedVehicle) return;
    const key = `vehicleReviews_${selectedVehicle}`;
    const existing = JSON.parse(localStorage.getItem(key) || '[]');
    existing.unshift(review);
    localStorage.setItem(key, JSON.stringify(existing));
    setShowWriteReview(false);
    setStep('done');
    setToastVisible(true);
  };

  const handleViewVehicle = () => {
    if (!selectedVehicle) return;
    const { year, make, model } = parseVehicleName(selectedVehicle);
    navigate(`/vehicles/${year}/${make}/${model}`);
  };

  const handleRateAnother = () => {
    setSelectedVehicle(null);
    setVehicleImage('');
    setSelectedRating(0);
    setHoveredRating(0);
    setStep('select');
  };

  const displayRating = hoveredRating > 0 ? hoveredRating : selectedRating;

  // ─── Star renderer ───
  const renderInlineStars = () => (
    <div style={{ display: 'flex', justifyContent: 'center', gap: isMobile ? '8px' : '16px', position: 'relative' }}>
      {Array.from({ length: 5 }, (_, i) => {
        const pos = i + 1;
        const oddVal = pos * 20 - 10;
        const evenVal = pos * 20;
        const isOddSel = oddVal <= (hoveredRating || selectedRating);
        const isEvenSel = evenVal <= (hoveredRating || selectedRating);
        const half = isOddSel && !isEvenSel;
        const full = isEvenSel;
        const showTooltipOdd = hoveredRating > 0 && hoveredRating === oddVal;
        const showTooltipEven = hoveredRating > 0 && hoveredRating === evenVal;

        return (
          <div key={pos} style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            {(showTooltipOdd || showTooltipEven) && (
              <div style={{
                position: 'absolute', bottom: '100%', left: '50%', transform: 'translateX(-50%)',
                background: 'var(--color-neutrals-2, #23262F)', color: '#fff', padding: '6px 12px',
                borderRadius: '8px', fontSize: '13px', fontWeight: 600, fontFamily: 'var(--font-body)',
                whiteSpace: 'nowrap', marginBottom: '10px', zIndex: 10,
                animation: 'rycTooltipIn 0.15s ease-out forwards',
                boxShadow: '0 4px 12px rgba(0,0,0,0.25)',
              }}>
                {RATING_LABELS[hoveredRating]}
              </div>
            )}
            <div
              style={{
                position: 'relative', width: isMobile ? '48px' : '56px', height: isMobile ? '48px' : '56px',
                transition: 'transform 0.2s cubic-bezier(0.34,1.56,0.64,1)',
                transform: hoveredStarIdx === pos ? 'scale(1.15)' : 'none',
                cursor: 'pointer',
              }}
              onMouseEnter={() => setHoveredStarIdx(pos)}
              onMouseLeave={() => setHoveredStarIdx(null)}
            >
              <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none', zIndex: 1 }}>
                <img
                  src={half ? STAR_HALF : full ? STAR_FILLED : STAR_EMPTY}
                  alt=""
                  style={{ width: '100%', height: '100%', objectFit: 'contain', filter: 'drop-shadow(0 2px 6px rgba(0,0,0,0.15))' }}
                />
              </div>
              <button
                style={{ position: 'absolute', top: 0, left: 0, width: '50%', height: '100%', background: 'none', border: 'none', cursor: 'pointer', zIndex: 2 }}
                onClick={() => handleStarClick(oddVal)}
                onMouseEnter={() => setHoveredRating(oddVal)}
                onMouseLeave={() => setHoveredRating(0)}
                aria-label={`Rate ${oddVal / 20}`}
              />
              <button
                style={{ position: 'absolute', top: 0, right: 0, width: '50%', height: '100%', background: 'none', border: 'none', cursor: 'pointer', zIndex: 2 }}
                onClick={() => handleStarClick(evenVal)}
                onMouseEnter={() => setHoveredRating(evenVal)}
                onMouseLeave={() => setHoveredRating(0)}
                aria-label={`Rate ${evenVal / 20}`}
              />
            </div>
          </div>
        );
      })}
    </div>
  );

  // ─── Shared layout styles ───
  const pageStyle: React.CSSProperties = {
    minHeight: '100vh',
    background: 'linear-gradient(180deg, var(--color-neutrals-1, #141416) 0%, var(--color-neutrals-2, #23262F) 50%, var(--color-neutrals-1, #141416) 100%)',
    color: '#fff',
    fontFamily: 'var(--font-body, Geist, sans-serif)',
  };

  const containerStyle: React.CSSProperties = {
    maxWidth: '720px',
    margin: '0 auto',
    padding: isMobile ? '32px 20px 64px' : '56px 32px 80px',
  };

  return (
    <div style={pageStyle}>
      <div style={containerStyle}>
        {/* ─── Hero ─── */}
        <div style={{ textAlign: 'center', marginBottom: '48px', animation: 'rycFadeUp 0.5s ease-out' }}>
          <img
            src="https://www.motortrend.com/uploads/2022/02/MotorTrend-logo-white.png"
            alt="MotorTrend"
            style={{ height: '28px', marginBottom: '32px', opacity: 0.9 }}
          />
          <h1 style={{
            fontFamily: 'var(--font-heading, Poppins, sans-serif)',
            fontSize: isMobile ? '32px' : '44px',
            fontWeight: 700,
            lineHeight: 1.15,
            margin: '0 0 16px',
            letterSpacing: '-0.5px',
          }}>
            Rate Your Car!
          </h1>
          <p style={{
            fontSize: isMobile ? '16px' : '18px',
            color: 'var(--color-neutrals-5, #B1B5C3)',
            maxWidth: '520px',
            margin: '0 auto',
            lineHeight: 1.6,
          }}>
            Choose what you drive now and what you'd like next
          </p>
        </div>

        {/* ─── Main Card ─── */}
        <div style={{
          background: 'var(--color-white, #FFFFFF)',
          borderRadius: '16px',
          overflow: 'hidden',
          boxShadow: '0 20px 60px rgba(0,0,0,0.4)',
          animation: 'rycFadeUp 0.6s ease-out 0.1s both',
        }}>
          {/* ─── STEP: SELECT ─── */}
          {step === 'select' && (
            <div style={{ padding: isMobile ? '32px 20px' : '40px 40px 48px' }}>
              <div style={{ textAlign: 'center', marginBottom: '28px' }}>
                <div style={{
                  width: '64px', height: '64px', borderRadius: '50%', background: PRIMARY,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  margin: '0 auto 20px',
                }}>
                  <Icon name="directions_car" size={32} style={{ color: '#fff' }} />
                </div>
                <h2 style={{
                  fontFamily: 'var(--font-heading, Poppins, sans-serif)',
                  fontSize: '22px', fontWeight: 700, color: 'var(--color-neutrals-1, #141416)',
                  margin: '0 0 8px',
                }}>
                  What do you drive?
                </h2>
                <p style={{ fontSize: '15px', color: 'var(--color-neutrals-4, #6E7481)', margin: 0, lineHeight: 1.5 }}>
                  Search for your vehicle to get started
                </p>
              </div>

              <VehicleSearch
                onVehicleSelect={(v) => handleVehicleSelect(v.name)}
                placeholder="Search by year, make, or model..."
                autoFocus
              />
            </div>
          )}

          {/* ─── STEP: RATE ─── */}
          {step === 'rate' && selectedVehicle && (
            <div style={{ animation: 'rycFadeUp 0.4s ease-out' }}>
              {/* Vehicle hero image */}
              <div style={{
                width: '100%', height: isMobile ? '200px' : '260px',
                background: 'var(--color-neutrals-7, #F4F5F6)',
                position: 'relative', overflow: 'hidden',
              }}>
                <img
                  src={vehicleImage}
                  alt={selectedVehicle}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
                <div style={{
                  position: 'absolute', inset: 0,
                  background: 'linear-gradient(180deg, transparent 40%, rgba(0,0,0,0.6) 100%)',
                }} />
                <button
                  onClick={handleRateAnother}
                  style={{
                    position: 'absolute', top: '16px', left: '16px',
                    background: 'rgba(0,0,0,0.5)', border: 'none', borderRadius: '50%',
                    width: '36px', height: '36px', cursor: 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: '#fff', backdropFilter: 'blur(8px)',
                  }}
                  aria-label="Go back"
                >
                  <Icon name="arrow_back" size={20} />
                </button>
                <div style={{
                  position: 'absolute', bottom: '20px', left: '24px', right: '24px',
                }}>
                  <h2 style={{
                    fontFamily: 'var(--font-heading, Poppins, sans-serif)',
                    fontSize: isMobile ? '22px' : '28px', fontWeight: 700, color: '#fff',
                    margin: 0, textShadow: '0 2px 8px rgba(0,0,0,0.4)',
                  }}>
                    {selectedVehicle}
                  </h2>
                </div>
              </div>

              {/* Rating area */}
              <div style={{
                background: 'var(--color-neutrals-1, #141416)',
                padding: isMobile ? '32px 20px' : '40px 40px',
                textAlign: 'center',
              }}>
                {/* Score display */}
                <div style={{ marginBottom: '8px' }}>
                  <div style={{
                    position: 'relative', display: 'inline-block',
                    width: '100px', height: '100px',
                    animation: displayRating > 0 ? 'rycPulse 0.4s ease-out' : 'none',
                  }}>
                    <img src={STAR_FILLED} alt="" style={{ width: '100%', height: '100%', objectFit: 'contain', filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.3))' }} />
                    <span style={{
                      position: 'absolute', top: '58%', left: '50%',
                      transform: 'translate(-50%, -50%)',
                      fontFamily: 'var(--font-heading)', fontWeight: 700,
                      fontSize: '36px', color: '#fff',
                      textShadow: '0 2px 8px rgba(0,0,0,0.3)',
                    }}>
                      {displayRating > 0 ? (displayRating / 20).toFixed(1) : '—'}
                    </span>
                  </div>
                </div>

                <p style={{
                  fontFamily: 'var(--font-heading)', fontWeight: 600,
                  fontSize: '13px', color: 'var(--color-rating-motortrend, #FFB74D)',
                  textTransform: 'uppercase', letterSpacing: '2px',
                  margin: '0 0 24px',
                }}>
                  {displayRating > 0 ? RATING_LABELS[displayRating] || 'Rate This' : 'Rate This'}
                </p>

                {renderInlineStars()}

                {/* Action buttons */}
                <div style={{
                  display: 'flex', gap: '12px', marginTop: '32px',
                  flexDirection: isMobile ? 'column' : 'row',
                  justifyContent: 'center',
                }}>
                  <button
                    onClick={handleSubmitRating}
                    disabled={selectedRating === 0}
                    style={{
                      padding: '14px 32px', borderRadius: '10px',
                      background: selectedRating > 0 ? PRIMARY : 'rgba(255,255,255,0.1)',
                      color: '#fff', border: 'none',
                      fontFamily: 'var(--font-heading)', fontWeight: 600,
                      fontSize: '15px', cursor: selectedRating > 0 ? 'pointer' : 'default',
                      textTransform: 'uppercase', letterSpacing: '1px',
                      opacity: selectedRating === 0 ? 0.5 : 1,
                      transition: 'all 0.2s',
                      flex: isMobile ? undefined : 1,
                      maxWidth: isMobile ? undefined : '200px',
                    }}
                  >
                    Submit Rating
                  </button>
                  <button
                    onClick={handleWriteReview}
                    disabled={selectedRating === 0}
                    style={{
                      padding: '14px 32px', borderRadius: '10px',
                      background: 'rgba(255,255,255,0.08)',
                      color: '#fff', border: '1px solid rgba(255,255,255,0.15)',
                      fontFamily: 'var(--font-heading)', fontWeight: 600,
                      fontSize: '15px', cursor: selectedRating > 0 ? 'pointer' : 'default',
                      textTransform: 'uppercase', letterSpacing: '1px',
                      opacity: selectedRating === 0 ? 0.5 : 1,
                      transition: 'all 0.2s',
                      flex: isMobile ? undefined : 1,
                      maxWidth: isMobile ? undefined : '200px',
                    }}
                  >
                    Write a Review
                  </button>
                </div>
              </div>

              {/* Rate another vehicle */}
              <div style={{
                padding: isMobile ? '24px 20px' : '28px 40px',
                borderTop: '1px solid var(--color-neutrals-6, #E6E8EC)',
                background: 'var(--color-white, #FFFFFF)',
              }}>
                <p style={{
                  fontFamily: 'var(--font-heading)', fontWeight: 600,
                  fontSize: '15px', color: 'var(--color-neutrals-2, #23262F)',
                  margin: '0 0 12px',
                }}>
                  Rate Another Vehicle
                </p>
                <VehicleSearch
                  onVehicleSelect={(v) => handleVehicleSelect(v.name)}
                  placeholder="Select another Vehicle"
                />
              </div>
            </div>
          )}

          {/* ─── STEP: DONE ─── */}
          {step === 'done' && selectedVehicle && (
            <div style={{
              padding: isMobile ? '48px 24px' : '56px 48px',
              textAlign: 'center',
              animation: 'rycFadeUp 0.4s ease-out',
            }}>
              <div style={{
                width: '80px', height: '80px', borderRadius: '50%',
                background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                margin: '0 auto 24px',
                boxShadow: '0 8px 24px rgba(16, 185, 129, 0.3)',
              }}>
                <Icon name="check" size={40} style={{ color: '#fff' }} />
              </div>

              <h2 style={{
                fontFamily: 'var(--font-heading)', fontSize: '26px', fontWeight: 700,
                color: 'var(--color-neutrals-1, #141416)', margin: '0 0 8px',
              }}>
                Thank You!
              </h2>
              <p style={{
                fontSize: '16px', color: 'var(--color-neutrals-4, #6E7481)',
                margin: '0 0 8px', lineHeight: 1.5,
              }}>
                You rated the <strong style={{ color: 'var(--color-neutrals-2)' }}>{selectedVehicle}</strong>
              </p>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px', marginBottom: '32px' }}>
                {Array.from({ length: 5 }, (_, i) => {
                  const val = (i + 1) * 20;
                  const halfVal = val - 10;
                  const isFull = val <= selectedRating;
                  const isHalf = !isFull && halfVal <= selectedRating;
                  return (
                    <img
                      key={i}
                      src={isFull ? STAR_FILLED : isHalf ? STAR_HALF : STAR_EMPTY}
                      alt=""
                      style={{ width: '28px', height: '28px' }}
                    />
                  );
                })}
                <span style={{
                  fontFamily: 'var(--font-heading)', fontWeight: 700,
                  fontSize: '20px', color: 'var(--color-neutrals-1)',
                  marginLeft: '8px',
                }}>
                  {(selectedRating / 20).toFixed(1)}
                </span>
              </div>

              <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexDirection: isMobile ? 'column' : 'row' }}>
                <button
                  onClick={handleViewVehicle}
                  style={{
                    padding: '14px 28px', borderRadius: '10px',
                    background: PRIMARY, color: '#fff', border: 'none',
                    fontFamily: 'var(--font-heading)', fontWeight: 600,
                    fontSize: '15px', cursor: 'pointer',
                    textTransform: 'uppercase', letterSpacing: '1px',
                  }}
                >
                  View {selectedVehicle.split(' ').slice(1).join(' ')}
                </button>
                <button
                  onClick={handleRateAnother}
                  style={{
                    padding: '14px 28px', borderRadius: '10px',
                    background: 'transparent', color: 'var(--color-neutrals-2, #23262F)',
                    border: '2px solid var(--color-neutrals-6, #E6E8EC)',
                    fontFamily: 'var(--font-heading)', fontWeight: 600,
                    fontSize: '15px', cursor: 'pointer',
                    textTransform: 'uppercase', letterSpacing: '1px',
                  }}
                >
                  Rate Another Car
                </button>
              </div>
            </div>
          )}
        </div>

        {/* ─── Why Rate Section ─── */}
        <div style={{
          marginTop: '56px',
          animation: 'rycFadeUp 0.6s ease-out 0.3s both',
        }}>
          <h3 style={{
            fontFamily: 'var(--font-heading)', fontSize: '22px', fontWeight: 700,
            textAlign: 'center', margin: '0 0 32px',
            color: 'var(--color-white, #FFFFFF)',
          }}>
            Why Your Rating Matters
          </h3>

          <div style={{
            display: 'grid',
            gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)',
            gap: '20px',
          }}>
            {BENEFITS.map((b, i) => (
              <div key={i} style={{
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: '14px',
                padding: '28px 24px',
                textAlign: 'center',
                backdropFilter: 'blur(8px)',
                transition: 'transform 0.2s, background 0.2s',
              }}>
                <div style={{
                  width: '48px', height: '48px', borderRadius: '12px',
                  background: 'rgba(233, 12, 23, 0.12)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  margin: '0 auto 16px',
                }}>
                  <Icon name={b.icon} size={24} style={{ color: PRIMARY }} />
                </div>
                <h4 style={{
                  fontFamily: 'var(--font-heading)', fontSize: '16px', fontWeight: 600,
                  margin: '0 0 8px', color: '#fff',
                }}>
                  {b.title}
                </h4>
                <p style={{
                  fontSize: '14px', color: 'var(--color-neutrals-5, #B1B5C3)',
                  margin: 0, lineHeight: 1.5,
                }}>
                  {b.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* ─── Social Proof Stats ─── */}
        <div style={{
          marginTop: '48px',
          display: 'flex',
          justifyContent: 'center',
          gap: isMobile ? '24px' : '56px',
          animation: 'rycFadeUp 0.6s ease-out 0.4s both',
        }}>
          {STATS.map((s, i) => (
            <div key={i} style={{ textAlign: 'center' }}>
              <div style={{
                fontFamily: 'var(--font-heading)', fontSize: isMobile ? '28px' : '36px',
                fontWeight: 700, color: PRIMARY, lineHeight: 1,
              }}>
                {s.value}
              </div>
              <div style={{
                fontSize: '13px', color: 'var(--color-neutrals-5, #B1B5C3)',
                marginTop: '6px', textTransform: 'uppercase', letterSpacing: '1px',
              }}>
                {s.label}
              </div>
            </div>
          ))}
        </div>

        {/* ─── Testimonial ─── */}
        <div style={{
          marginTop: '48px',
          background: 'rgba(255,255,255,0.04)',
          border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: '14px',
          padding: isMobile ? '28px 24px' : '36px 40px',
          textAlign: 'center',
          animation: 'rycFadeUp 0.6s ease-out 0.5s both',
        }}>
          <p style={{
            fontSize: isMobile ? '16px' : '18px',
            fontStyle: 'italic',
            color: 'var(--color-neutrals-5, #B1B5C3)',
            lineHeight: 1.7,
            margin: '0 0 16px',
            maxWidth: '540px',
            marginLeft: 'auto',
            marginRight: 'auto',
          }}>
            "I was on the fence about the Civic vs. Corolla. Reading real owner ratings on MotorTrend made the decision easy. Now I'm paying it forward with my own review."
          </p>
          <p style={{
            fontSize: '14px', fontWeight: 600, color: '#fff', margin: 0,
          }}>
            — Sarah M., verified owner
          </p>
        </div>
      </div>

      {/* ─── Write Review Modal ─── */}
      {selectedVehicle && (
        <WriteReviewModal
          isOpen={showWriteReview}
          onClose={() => setShowWriteReview(false)}
          vehicleName={selectedVehicle}
          vehicleImage={vehicleImage}
          onSubmit={handleReviewSubmit}
          initialRating={selectedRating}
        />
      )}

      {/* ─── Success Toast ─── */}
      <ReviewSubmittedToast
        isVisible={toastVisible}
        onClose={() => setToastVisible(false)}
        onViewReview={handleViewVehicle}
        vehicleName={selectedVehicle || ''}
      />
    </div>
  );
};

export default RateYourCar;
