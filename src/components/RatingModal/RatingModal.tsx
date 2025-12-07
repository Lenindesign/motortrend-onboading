/**
 * Rating Modal Component
 * Migrated to inline styles for Tailwind compatibility
 */

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ModalShell } from '../atoms/ModalShell';
import Icon from '../Icon';

export interface RatingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRate: (rating: number) => void;
  vehicleName: string;
  currentRating?: number;
  onRateAndReview?: (rating: number) => void;
  onClear?: () => void;
  hasExistingReview?: boolean;
}

export const RatingModal: React.FC<RatingModalProps> = ({
  isOpen,
  onClose,
  onRate,
  vehicleName,
  currentRating = 0,
  onRateAndReview,
  onClear,
  hasExistingReview = false
}) => {
  const [selectedRating, setSelectedRating] = useState(currentRating);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [isCloseHovered, setIsCloseHovered] = useState(false);
  const [isSubmitHovered, setIsSubmitHovered] = useState(false);
  const [isReviewHovered, setIsReviewHovered] = useState(false);
  const [hoveredStarWrapper, setHoveredStarWrapper] = useState<number | null>(null);

  // Inject keyframes
  useEffect(() => {
    const styleId = 'rating-modal-keyframes';
    if (!document.getElementById(styleId)) {
      const style = document.createElement('style');
      style.id = styleId;
      style.textContent = `
        @keyframes ratingTooltipFadeIn {
          from { opacity: 0; transform: translate(-50%, 5px); }
          to { opacity: 1; transform: translate(-50%, 0); }
        }
      `;
      document.head.appendChild(style);
    }
  }, []);

  useEffect(() => {
    if (isOpen) setSelectedRating(currentRating);
  }, [isOpen, currentRating]);

  const ratingLabels: { [key: number]: string } = {
    10: "Awful – Never again", 20: "Poor – Major regrets", 30: "Below Average – Disappointed",
    40: "Fair – Just okay", 50: "Average – Meets basic needs", 60: "Decent – Would consider again",
    70: "Good – Happy overall", 80: "Very Good – Impressive value", 90: "Excellent – Love this car", 100: "Perfect – Dream car!"
  };

  const handleStarClick = (rating: number) => setSelectedRating(rating);
  const handleStarHover = (rating: number) => setHoveredRating(rating);
  const handleStarLeave = () => setHoveredRating(0);

  const handleSubmit = () => {
    if (currentRating > 0 && onClear) { onClear(); setSelectedRating(0); onClose(); }
    else if (selectedRating > 0) { onRate(selectedRating); onClose(); }
  };

  const handleRateAndReview = () => {
    if (onRateAndReview) onRateAndReview(selectedRating);
    else onRate(selectedRating);
    onClose();
  };

  const handleCancel = () => { setSelectedRating(currentRating); onClose(); };

  // Styles
  const modalStyle: React.CSSProperties = { background: 'var(--color-neutrals-1, #141416)', border: '1px solid rgba(255,255,255,0.1)' };
  const innerStyle: React.CSSProperties = { display: 'flex', flexDirection: 'column', maxHeight: '90vh', overflowY: 'auto' };
  const headerStyle: React.CSSProperties = { display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '48px 40px 0', position: 'relative', flex: 1 };
  const titleSectionStyle: React.CSSProperties = { display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', width: '100%' };
  const mainRatingStyle: React.CSSProperties = { marginBottom: '24px', display: 'flex', justifyContent: 'center' };
  const scoreStarStyle: React.CSSProperties = { position: 'relative', display: 'inline-block', width: '140px', height: '140px', filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.2))' };
  const scoreStarIconStyle: React.CSSProperties = { width: '100%', height: '100%', objectFit: 'contain' };
  const ratingNumberStyle: React.CSSProperties = { position: 'absolute', top: '83px', left: '50%', transform: 'translate(-50%, -55%)', fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: '48px', lineHeight: 1, color: '#fff', textShadow: '0 2px 8px rgba(0,0,0,0.3)', zIndex: 2, letterSpacing: '-1px' };
  const titleWrapperStyle: React.CSSProperties = { display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginBottom: '16px' };
  const titleStyle: React.CSSProperties = { fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: '14px', lineHeight: 1.4, color: 'var(--color-rating-motortrend, #FFB74D)', margin: 0, textTransform: 'uppercase', letterSpacing: '2px' };
  const vehicleNameStyle: React.CSSProperties = { fontFamily: 'var(--font-heading)', fontWeight: 600, fontSize: '28px', lineHeight: 1.2, color: '#fff', margin: '0 0 8px', maxWidth: '90%' };
  const closeBtnStyle: React.CSSProperties = { background: isCloseHovered ? 'rgba(255,255,255,0.15)' : 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', padding: '8px', cursor: 'pointer', borderRadius: '50%', color: '#fff', transition: 'all 0.2s', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'absolute', top: '24px', right: '24px', transform: isCloseHovered ? 'rotate(90deg)' : 'none' };
  const contentStyle: React.CSSProperties = { padding: '32px 40px 0', textAlign: 'center', width: '100%', boxSizing: 'border-box' };
  const starsStyle: React.CSSProperties = { display: 'flex', justifyContent: 'center', gap: '12px', marginBottom: '40px', flexWrap: 'nowrap', position: 'relative', width: '100%' };
  const starContainerStyle: React.CSSProperties = { position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center' };
  const getStarWrapperStyle = (idx: number): React.CSSProperties => ({ position: 'relative', display: 'flex', width: '48px', height: '48px', transition: 'transform 0.2s cubic-bezier(0.34,1.56,0.64,1)', transform: hoveredStarWrapper === idx ? 'scale(1.1)' : 'none' });
  const starVisualStyle: React.CSSProperties = { position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none', zIndex: 1 };
  const starClickStyle = (isLeft: boolean): React.CSSProperties => ({ background: 'none', border: 'none', padding: 0, cursor: 'pointer', transition: 'all 0.2s', position: 'absolute', top: 0, width: '50%', height: '100%', zIndex: 2, left: isLeft ? 0 : undefined, right: isLeft ? undefined : 0 });
  const starIconStyle: React.CSSProperties = { width: '100%', height: '100%', objectFit: 'contain', filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))' };
  const tooltipStyle: React.CSSProperties = { position: 'absolute', bottom: '100%', left: '50%', transform: 'translateX(-50%)', background: '#fff', color: 'var(--color-neutrals-2)', padding: '8px 12px', borderRadius: '8px', fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: '13px', lineHeight: 1.3, whiteSpace: 'nowrap', boxShadow: '0 8px 20px rgba(0,0,0,0.25)', marginBottom: '16px', zIndex: 1001, animation: 'ratingTooltipFadeIn 0.2s ease-out forwards' };
  const footerStyle: React.CSSProperties = { display: 'flex', justifyContent: 'center', gap: '16px', padding: '0 40px 48px', width: '100%', boxSizing: 'border-box' };
  const btnBaseStyle: React.CSSProperties = { display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px 32px', borderRadius: '12px', fontFamily: 'var(--font-heading)', fontWeight: 600, fontSize: '14px', lineHeight: 1, cursor: 'pointer', transition: 'all 0.2s cubic-bezier(0.4,0,0.2,1)', border: 'none', textTransform: 'uppercase', letterSpacing: '1px', flex: 1, maxWidth: '200px' };
  const submitBtnStyle: React.CSSProperties = { ...btnBaseStyle, background: isSubmitHovered && selectedRating !== 0 ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.1)', color: '#fff', border: '1px solid rgba(255,255,255,0.1)', transform: isSubmitHovered && selectedRating !== 0 ? 'translateY(-2px)' : 'none', opacity: selectedRating === 0 && currentRating === 0 ? 0.5 : 1 };
  const reviewBtnStyle: React.CSSProperties = { ...btnBaseStyle, background: selectedRating === 0 ? 'var(--color-neutrals-5)' : (isReviewHovered ? 'var(--color-primary-600)' : 'var(--color-primary-500)'), color: selectedRating === 0 ? 'var(--color-neutrals-4)' : '#fff', boxShadow: selectedRating === 0 ? 'none' : '0 4px 12px rgba(22,101,192,0.3)', transform: isReviewHovered && selectedRating !== 0 ? 'translateY(-2px)' : 'none' };

  return (
    <ModalShell isOpen={isOpen} onClose={handleCancel} maxWidth="560px" style={modalStyle}>
      <div style={innerStyle}>
        <div style={headerStyle}>
          <div style={titleSectionStyle}>
            <div style={mainRatingStyle}>
              <div style={scoreStarStyle}>
                <img src="https://d2kde5ohu8qb21.cloudfront.net/files/691bde547554840002bab60c/star.svg" alt="Rating star" style={scoreStarIconStyle} />
                <span style={ratingNumberStyle}>{hoveredRating > 0 ? hoveredRating / 20 : (selectedRating > 0 ? selectedRating / 20 : '0')}</span>
              </div>
            </div>
            <div style={titleWrapperStyle}>
              <h2 style={titleStyle}>RATE THIS</h2>
            </div>
            <p style={vehicleNameStyle}>{vehicleName}</p>
          </div>
          <button style={closeBtnStyle} onClick={handleCancel} onMouseEnter={() => setIsCloseHovered(true)} onMouseLeave={() => setIsCloseHovered(false)} aria-label="Close">
            <Icon name="close" size={24} />
          </button>
        </div>

        <div style={contentStyle}>
          <div style={starsStyle}>
            {Array.from({ length: 5 }, (_, index) => {
              const starPosition = index + 1;
              const oddRating = starPosition * 20 - 10;
              const evenRating = starPosition * 20;
              const isOddSelected = oddRating <= selectedRating;
              const isEvenSelected = evenRating <= selectedRating;
              const isOddHovered = oddRating <= hoveredRating;
              const isEvenHovered = evenRating <= hoveredRating;
              const showHalfStar = (isOddSelected && !isEvenSelected) || (hoveredRating > 0 && isOddHovered && !isEvenHovered && !isEvenSelected);
              const showFullStar = isEvenSelected || (hoveredRating > 0 && isEvenHovered);
              const showTooltipOdd = hoveredRating > 0 && hoveredRating === oddRating;
              const showTooltipEven = hoveredRating > 0 && hoveredRating === evenRating;

              return (
                <div key={starPosition} style={starContainerStyle}>
                  {showTooltipOdd && <div style={tooltipStyle}>{ratingLabels[oddRating]}</div>}
                  {showTooltipEven && <div style={tooltipStyle}>{ratingLabels[evenRating]}</div>}
                  <div style={getStarWrapperStyle(starPosition)} onMouseEnter={() => setHoveredStarWrapper(starPosition)} onMouseLeave={() => setHoveredStarWrapper(null)}>
                    <div style={starVisualStyle}>
                      <img src={showHalfStar ? "https://d2kde5ohu8qb21.cloudfront.net/files/691c8ba6a619270002cb5797/half-star.svg" : showFullStar ? "https://d2kde5ohu8qb21.cloudfront.net/files/691bde547554840002bab60c/star.svg" : "https://d2kde5ohu8qb21.cloudfront.net/files/691bde5264217700021d6b71/star-stroke.svg"} alt="Star" style={starIconStyle} />
                    </div>
                    <button style={starClickStyle(true)} onClick={() => handleStarClick(oddRating)} onMouseEnter={() => handleStarHover(oddRating)} onMouseLeave={handleStarLeave} aria-label={`Rate ${oddRating}`} />
                    <button style={starClickStyle(false)} onClick={() => handleStarClick(evenRating)} onMouseEnter={() => handleStarHover(evenRating)} onMouseLeave={handleStarLeave} aria-label={`Rate ${evenRating}`} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div style={footerStyle}>
          <button style={submitBtnStyle} onClick={handleSubmit} onMouseEnter={() => setIsSubmitHovered(true)} onMouseLeave={() => setIsSubmitHovered(false)} disabled={selectedRating === 0 && currentRating === 0}>
            {currentRating > 0 ? 'CLEAR RATING' : 'RATE'}
          </button>
          <button style={reviewBtnStyle} onClick={handleRateAndReview} onMouseEnter={() => setIsReviewHovered(true)} onMouseLeave={() => setIsReviewHovered(false)} disabled={selectedRating === 0}>
            {hasExistingReview ? 'EDIT YOUR REVIEW' : 'WRITE A REVIEW'}
          </button>
        </div>
      </div>
    </ModalShell>
  );
};

export default RatingModal;
