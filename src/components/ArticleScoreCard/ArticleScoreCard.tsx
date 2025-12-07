/**
 * ArticleScoreCard Component
 * Migrated to inline styles for Tailwind compatibility
 */

import React, { useState, useEffect } from 'react';
import type { MotorTrendScore } from '../../utils/articles';
import Icon from '../Icon';
import { Badge } from '../atoms/Badge/Badge';

export interface ArticleScoreCardProps {
  score: MotorTrendScore;
  vehicleName: string;
  onScrollToReviews?: () => void;
}

export const ArticleScoreCard: React.FC<ArticleScoreCardProps> = ({ score, vehicleName }) => {
  const [isAccordionOpen, setIsAccordionOpen] = useState(false);
  const [isAccordionHovered, setIsAccordionHovered] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);
  
  const ratingItems = [
    { label: 'Performance', value: score.scores.performance },
    { label: 'Efficiency/Range', value: score.scores.efficiency },
    { label: 'Tech/Innovation', value: score.scores.tech },
    { label: 'Value', value: score.scores.value }
  ];

  // Styles
  const cardStyle: React.CSSProperties = { width: '100%', padding: isMobile ? 'var(--spacing-3, 24px)' : 'var(--spacing-4, 32px)', borderRadius: 'var(--border-radius-lg, 16px)', background: 'var(--color-neutrals-8, #FCFCFD)', border: '1px solid var(--color-neutrals-6, #E6E8EC)', boxShadow: 'var(--shadow-card, 0 4px 12px rgba(20, 20, 22, 0.08))', display: 'flex', flexDirection: 'column', gap: 'var(--spacing-3, 24px)' };
  const headerStyle: React.CSSProperties = { display: 'flex', alignItems: 'center', gap: 'var(--spacing-2, 16px)', flexWrap: 'wrap' };
  const titleStyle: React.CSSProperties = { margin: 0, fontFamily: 'var(--font-heading)', fontWeight: 600, fontSize: isMobile ? '24px' : '28px', color: 'var(--color-neutrals-1, #141416)' };
  const vehicleNameStyle: React.CSSProperties = { margin: 0, fontFamily: 'var(--font-heading)', fontWeight: 600, fontSize: isMobile ? '20px' : '24px', color: 'var(--color-neutrals-1, #141416)' };
  const bodyStyle: React.CSSProperties = { display: 'flex', gap: 'var(--spacing-4, 32px)', flexWrap: 'wrap', alignItems: 'flex-start', marginTop: 'var(--spacing-2, 16px)', flexDirection: isMobile ? 'column' : 'row' };
  const circleStyle: React.CSSProperties = { minWidth: isMobile ? '100%' : '200px', minHeight: isMobile ? '180px' : '200px', borderRadius: 'var(--border-radius-lg, 16px)', background: 'linear-gradient(135deg, var(--color-neutrals-2, #23262F) 0%, var(--color-neutrals-1, #141416) 100%)', border: '1px solid var(--color-neutrals-5, #B1B5C3)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '6px', padding: 'var(--spacing-3, 24px)' };
  const numberStyle: React.CSSProperties = { fontFamily: 'var(--font-heading)', fontWeight: 600, fontSize: isMobile ? '56px' : '26px', color: 'var(--color-white, #FFFFFF)', lineHeight: 1 };
  const labelRowStyle: React.CSSProperties = { display: 'flex', alignItems: 'center', gap: 'var(--spacing-1, 8px)' };
  const mtBadgeStyle: React.CSSProperties = { width: '16px', height: '16px', objectFit: 'contain' };
  const labelStyle: React.CSSProperties = { fontSize: '14px', fontWeight: 500, color: 'var(--color-white, #FFFFFF)', textTransform: 'none', letterSpacing: 0, lineHeight: 1.2, whiteSpace: 'nowrap' };
  const breakdownStyle: React.CSSProperties = { flex: 1, minWidth: isMobile ? '100%' : '300px', display: 'flex', flexDirection: 'column', gap: 'var(--spacing-3, 24px)', width: isMobile ? '100%' : 'auto' };
  const breakdownRowStyle: React.CSSProperties = { display: 'grid', gridTemplateColumns: isMobile ? '120px 1fr 35px' : '140px 1fr 40px', alignItems: 'center', gap: isMobile ? 'var(--spacing-1, 8px)' : 'var(--spacing-2, 16px)', fontFamily: 'var(--font-body)' };
  const breakdownLabelStyle: React.CSSProperties = { fontSize: isMobile ? '14px' : '16px', fontWeight: 600, color: 'var(--color-neutrals-1, #141416)' };
  const barStyle: React.CSSProperties = { height: '12px', borderRadius: '100px', background: 'var(--color-neutrals-5, #B1B5C3)', overflow: 'hidden' };
  const getBarFillStyle = (value: number): React.CSSProperties => ({ height: '100%', borderRadius: '100px', background: 'linear-gradient(90deg, var(--color-rating-motortrend, #FFB74D) 0%, var(--color-semantic-warning-dark, #F57C00) 100%)', width: `${(value / 10) * 100}%`, transition: 'width 150ms ease-in-out' });
  const breakdownValueStyle: React.CSSProperties = { fontSize: isMobile ? '14px' : '16px', fontWeight: 600, color: 'var(--color-neutrals-2, #23262F)', textAlign: 'right' };
  const reviewerStyle: React.CSSProperties = { display: 'flex', alignItems: 'center', gap: 'var(--spacing-2, 16px)', marginTop: 'var(--spacing-4, 32px)', paddingTop: 'var(--spacing-4, 32px)', borderTop: '1px solid var(--color-neutrals-6, #E6E8EC)' };
  const avatarStyle: React.CSSProperties = { width: '56px', height: '56px', borderRadius: '50%', objectFit: 'cover' };
  const reviewerInfoStyle: React.CSSProperties = { display: 'flex', flexDirection: 'column', gap: '2px' };
  const reviewerNameStyle: React.CSSProperties = { display: 'flex', alignItems: 'center', gap: '4px', fontFamily: 'var(--font-heading)', fontWeight: 600, fontSize: '16px', color: 'var(--color-neutrals-1, #141416)' };
  const reviewerBadgeStyle: React.CSSProperties = { width: '20px', height: '20px', objectFit: 'contain' };
  const reviewerMetaStyle: React.CSSProperties = { fontSize: '14px', color: 'var(--color-neutrals-3, #353945)' };
  const reviewTitleStyle: React.CSSProperties = { margin: 'var(--spacing-3, 24px) 0 0 0', fontFamily: 'var(--font-heading)', fontWeight: 600, fontSize: '20px', color: 'var(--color-neutrals-1, #141416)', lineHeight: 1.4 };
  const excerptStyle: React.CSSProperties = { margin: 'var(--spacing-2, 16px) 0 0 0', fontFamily: 'var(--font-body)', fontSize: '16px', lineHeight: 1.6, color: 'var(--color-neutrals-2, #23262F)' };
  const accordionBtnStyle: React.CSSProperties = { width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: isMobile ? 'var(--spacing-2, 16px)' : 'var(--spacing-3, 24px)', marginTop: 'var(--spacing-3, 24px)', border: `1px solid ${isAccordionHovered ? 'var(--color-neutrals-5, #B1B5C3)' : 'var(--color-neutrals-6, #E6E8EC)'}`, borderRadius: 'var(--border-radius-md, 8px)', background: isAccordionHovered ? 'var(--color-neutrals-7, #F4F5F6)' : 'var(--color-white, #FFFFFF)', fontFamily: 'var(--font-heading)', fontWeight: 600, fontSize: isMobile ? '14px' : '16px', color: 'var(--color-neutrals-1, #141416)', cursor: 'pointer', transition: 'all 150ms ease-in-out' };
  const accordionIconStyle: React.CSSProperties = { transform: isAccordionOpen ? 'rotate(180deg)' : 'none', transition: 'transform 150ms ease-in-out' };
  const accordionContentStyle: React.CSSProperties = { marginTop: 'var(--spacing-3, 24px)', padding: 'var(--spacing-3, 24px)', borderRadius: 'var(--border-radius-md, 8px)', background: 'var(--color-neutrals-7, #F4F5F6)', display: 'flex', flexDirection: 'column', gap: 'var(--spacing-3, 24px)' };
  const sectionTitleStyle: React.CSSProperties = { margin: '0 0 var(--spacing-2, 16px) 0', fontFamily: 'var(--font-heading)', fontWeight: 600, fontSize: '18px', color: 'var(--color-neutrals-1, #141416)' };
  const sectionParagraphStyle: React.CSSProperties = { margin: '0 0 var(--spacing-2, 16px) 0', fontFamily: 'var(--font-body)', fontSize: '16px', lineHeight: 1.6, color: 'var(--color-neutrals-2, #23262F)' };

  return (
    <div style={cardStyle}>
      <div style={headerStyle}>
        <h2 style={titleStyle}>MotorTrend Review</h2>
        <Badge variant="premium" size="md" icon={<Icon name="emoji_events" size={20} />} aria-label="Award: Best Compact">
          Best Compact
          <Icon name="keyboard_arrow_down" size={16} style={{ marginLeft: '4px' }} />
        </Badge>
      </div>

      <h3 style={vehicleNameStyle}>{vehicleName}</h3>

      <div style={bodyStyle}>
        <div style={circleStyle}>
          <span style={numberStyle}>{score.overallRating?.toFixed(1)}</span>
          <div style={labelRowStyle}>
            <img src="https://d2kde5ohu8qb21.cloudfront.net/files/692374f1d13f5100022ddf61/mticon.svg" alt="MotorTrend" style={mtBadgeStyle} />
            <span style={labelStyle}>MotorTrend Rating</span>
          </div>
        </div>
        <div style={breakdownStyle}>
          {ratingItems.map((item) => (
            <div key={item.label} style={breakdownRowStyle}>
              <span style={breakdownLabelStyle}>{item.label}</span>
              <div style={barStyle}>
                <div style={getBarFillStyle(item.value)} />
              </div>
              <span style={breakdownValueStyle}>{item.value.toFixed(1)}</span>
            </div>
          ))}
        </div>
      </div>

      <div style={reviewerStyle}>
        <img src={score.reviewer.avatar} alt={score.reviewer.name} style={avatarStyle} />
        <div style={reviewerInfoStyle}>
          <div style={reviewerNameStyle}>
            {score.reviewer.name}
            <img src="https://d2kde5ohu8qb21.cloudfront.net/files/692374f1d13f5100022ddf61/mticon.svg" alt="MotorTrend" style={reviewerBadgeStyle} />
          </div>
          <div style={reviewerMetaStyle}>Driven, tested | {score.reviewer.date}</div>
        </div>
      </div>

      <h4 style={reviewTitleStyle}>{score.reviewer.title}</h4>
      <p style={excerptStyle}>{score.reviewer.excerpt}</p>

      <button style={accordionBtnStyle} onClick={() => setIsAccordionOpen(!isAccordionOpen)} onMouseEnter={() => setIsAccordionHovered(true)} onMouseLeave={() => setIsAccordionHovered(false)} aria-expanded={isAccordionOpen}>
        <span>Read Full Review</span>
        <Icon name="keyboard_arrow_down" size={24} style={accordionIconStyle} />
      </button>

      {isAccordionOpen && (
        <div style={accordionContentStyle}>
          {score.reviewer.detailedSections?.map((section, index) => (
            <div key={index}>
              <h5 style={sectionTitleStyle}>{section.title}</h5>
              {section.content.split('\n\n').map((paragraph, pIndex) => (
                <p key={pIndex} style={{ ...sectionParagraphStyle, marginBottom: pIndex === section.content.split('\n\n').length - 1 ? 0 : 'var(--spacing-2, 16px)' }}>{paragraph}</p>
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ArticleScoreCard;
