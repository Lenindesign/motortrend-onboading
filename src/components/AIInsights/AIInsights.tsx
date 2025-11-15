/**
 * AI Insights Component
 * Displays AI-generated insights about the vehicle
 */

import React, { useMemo } from 'react';
import { generateAIInsights } from '../../utils/vehicleInsights';
import './AIInsights.css';

interface AIInsightsProps {
  vehicleName?: string;
}

export const AIInsights: React.FC<AIInsightsProps> = ({ vehicleName = '' }) => {
  const insights = useMemo(() => {
    if (!vehicleName) {
      // Default insights for WRX if no vehicle name provided
      return generateAIInsights('2021 Subaru WRX');
    }
    return generateAIInsights(vehicleName);
  }, [vehicleName]);

  return (
    <div className="ai-insights">
      <div className="ai-insights__header">
        <h2 className="ai-insights__title">AI Insights</h2>
      </div>

      <div className="ai-insights__content">
        <div className="ai-insights__inner-container">
          <div className="ai-insights__section">
            <h3 className="ai-insights__section-title">What stands out</h3>
            <ul className="ai-insights__list">
              {insights.whatStandsOut.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </div>

          <div className="ai-insights__section">
            <h3 className="ai-insights__section-title">What to know</h3>
            <ul className="ai-insights__list">
              {insights.whatToKnow.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </div>

          <div className="ai-insights__section">
            <h3 className="ai-insights__section-title">Best fit for</h3>
            <ul className="ai-insights__list">
              {insights.bestFitFor.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </div>

          <div className="ai-insights__section">
            <h3 className="ai-insights__section-title">Trims to consider</h3>
            <ul className="ai-insights__list">
              {insights.trimsToConsider.map((trim, index) => (
                <li key={index}>
                  <strong>{trim.name}:</strong> {trim.description}
                </li>
              ))}
            </ul>
          </div>

          <div className="ai-insights__section">
            <h3 className="ai-insights__section-title">Owner tip</h3>
            <p className="ai-insights__paragraph">
              {insights.ownerTip}
            </p>
          </div>

          <div className="ai-insights__section">
            <h3 className="ai-insights__section-title">Similar to cross-shop</h3>
            <p className="ai-insights__paragraph">
              {insights.similarToCrossShop}
            </p>
          </div>

          <div className="ai-insights__footer">
            <p className="ai-insights__footer-text">
              These AI Insights summarize common strengths, trade-offs, and buyer patterns to help you decide faster.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIInsights;

