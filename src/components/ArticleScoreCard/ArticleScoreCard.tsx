import React, { useState } from 'react';
import type { MotorTrendScore } from '../../utils/articles';
import Icon from '../Icon';
import { Badge } from '../atoms/Badge/Badge';
import './ArticleScoreCard.css';

export interface ArticleScoreCardProps {
  score: MotorTrendScore;
  vehicleName: string;
  onScrollToReviews?: () => void;
}

export const ArticleScoreCard: React.FC<ArticleScoreCardProps> = ({ score, vehicleName }) => {
  const [isAccordionOpen, setIsAccordionOpen] = useState(false);
  
  const ratingItems = [
    { label: 'Performance', value: score.scores.performance },
    { label: 'Efficiency/Range', value: score.scores.efficiency },
    { label: 'Tech/Innovation', value: score.scores.tech },
    { label: 'Value', value: score.scores.value }
  ];

  return (
    <div className="article-score-card">
      <div className="article-score-card__header">
        <h2 className="article-score-card__title">MotorTrend Review</h2>
        <Badge
          variant="premium"
          size="md"
          icon={<Icon name="emoji_events" size={20} />}
          aria-label="Award: Best Compact"
          className="article-score-card__award-badge"
        >
          Best Compact
          <Icon name="keyboard_arrow_down" size={16} style={{ marginLeft: '4px' }} />
        </Badge>
      </div>

      <h3 className="article-score-card__vehicle-name">{vehicleName}</h3>

      <div className="article-score-card__body">
        <div className="article-score-card__circle">
          <span className="article-score-card__number">{score.overallRating?.toFixed(1)}</span>
          <div className="article-score-card__label-row">
            <img 
              src="https://d2kde5ohu8qb21.cloudfront.net/files/692374f1d13f5100022ddf61/mticon.svg" 
              alt="MotorTrend" 
              className="article-score-card__mt-badge"
            />
            <span className="article-score-card__label">MotorTrend Rating</span>
          </div>
        </div>
        <div className="article-score-card__breakdown">
          {ratingItems.map((item) => (
            <div key={item.label} className="article-score-card__breakdown-row">
              <span className="article-score-card__breakdown-label">{item.label}</span>
              <div className="article-score-card__bar">
                <div
                  className="article-score-card__bar-fill"
                  style={{ width: `${(item.value / 10) * 100}%` }}
                />
              </div>
              <span className="article-score-card__breakdown-value">{item.value.toFixed(1)}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="article-score-card__reviewer">
        <img 
          src={score.reviewer.avatar} 
          alt={score.reviewer.name}
          className="article-score-card__reviewer-avatar"
        />
        <div className="article-score-card__reviewer-info">
          <div className="article-score-card__reviewer-name">
            {score.reviewer.name}
            <img 
              src="https://d2kde5ohu8qb21.cloudfront.net/files/692374f1d13f5100022ddf61/mticon.svg" 
              alt="MotorTrend" 
              className="article-score-card__reviewer-badge"
            />
          </div>
          <div className="article-score-card__reviewer-meta">
            Driven, tested | {score.reviewer.date}
          </div>
        </div>
      </div>

      <h4 className="article-score-card__review-title">{score.reviewer.title}</h4>
      <p className="article-score-card__review-excerpt">{score.reviewer.excerpt}</p>

      <button 
        className="article-score-card__accordion-btn"
        onClick={() => setIsAccordionOpen(!isAccordionOpen)}
        aria-expanded={isAccordionOpen}
      >
        <span>Read Full Review</span>
        <Icon name="keyboard_arrow_down" size={24} className={isAccordionOpen ? 'rotated' : ''} />
      </button>

      {isAccordionOpen && (
        <div className="article-score-card__accordion-content">
          {score.reviewer.detailedSections?.map((section, index) => (
            <div key={index} className="article-score-card__review-section">
              <h5>{section.title}</h5>
              {section.content.split('\n\n').map((paragraph, pIndex) => (
                <p key={pIndex}>{paragraph}</p>
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ArticleScoreCard;

