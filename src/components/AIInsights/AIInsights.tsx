/**
 * AI Insights Component
 * Migrated to inline styles for Tailwind compatibility
 */

import React, { useMemo } from 'react';
import { generateAIInsights } from '../../utils/vehicleInsights';

interface AIInsightsProps {
  vehicleName?: string;
  className?: string;
}

export const AIInsights: React.FC<AIInsightsProps> = ({ vehicleName = '', className = '' }) => {
  const insights = useMemo(() => {
    if (!vehicleName) {
      return generateAIInsights('2021 Subaru WRX');
    }
    return generateAIInsights(vehicleName);
  }, [vehicleName]);

  // Styles
  const containerStyle: React.CSSProperties = {
    marginBottom: '48px',
  };

  const headerStyle: React.CSSProperties = {
    marginBottom: '32px',
  };

  const titleStyle: React.CSSProperties = {
    fontFamily: 'var(--font-heading, Poppins, sans-serif)',
    fontWeight: 600,
    fontSize: '32px',
    lineHeight: '1.125em',
    color: 'var(--color-neutrals-2, #23262F)',
    margin: 0,
  };

  const contentStyle: React.CSSProperties = {
    backgroundColor: 'var(--color-neutrals-7, #F4F5F6)',
    borderRadius: 'var(--border-radius-md, 8px)',
    padding: '32px',
  };

  const innerContainerStyle: React.CSSProperties = {
    backgroundColor: 'var(--color-white, #FFFFFF)',
    borderRadius: 'var(--border-radius-md, 8px)',
    padding: '40px',
  };

  const sectionStyle: React.CSSProperties = {
    marginBottom: '32px',
  };

  const lastSectionStyle: React.CSSProperties = {
    marginBottom: 0,
  };

  const sectionTitleStyle: React.CSSProperties = {
    fontFamily: 'var(--font-heading, Poppins, sans-serif)',
    fontWeight: 600,
    fontSize: '18px',
    lineHeight: '1.333em',
    color: 'var(--color-neutrals-1, #141416)',
    margin: '0 0 12px 0',
  };

  const listStyle: React.CSSProperties = {
    listStyle: 'none',
    padding: 0,
    margin: 0,
  };

  const listItemStyle: React.CSSProperties = {
    fontFamily: 'var(--font-body, Geist, sans-serif)',
    fontSize: '16px',
    lineHeight: '1.5em',
    color: 'var(--color-neutrals-2, #23262F)',
    marginBottom: '8px',
    paddingLeft: '24px',
    position: 'relative',
  };

  const bulletStyle: React.CSSProperties = {
    position: 'absolute',
    left: 0,
    color: 'var(--color-neutrals-4, #6E7481)',
    fontWeight: 600,
  };

  const paragraphStyle: React.CSSProperties = {
    fontFamily: 'var(--font-body, Geist, sans-serif)',
    fontSize: '16px',
    lineHeight: '1.5em',
    color: 'var(--color-neutrals-2, #23262F)',
    margin: 0,
  };

  const footerStyle: React.CSSProperties = {
    marginTop: '32px',
    paddingTop: '24px',
    borderTop: '1px solid var(--color-neutrals-6, #E6E8EC)',
  };

  const footerTextStyle: React.CSSProperties = {
    fontFamily: 'var(--font-body, Geist, sans-serif)',
    fontSize: '14px',
    lineHeight: '1.5em',
    color: 'var(--color-neutrals-3, #353945)',
    margin: 0,
    fontStyle: 'italic',
  };

  const renderListItem = (item: string, index: number, isLast: boolean) => (
    <li key={index} style={{ ...listItemStyle, marginBottom: isLast ? 0 : '8px' }}>
      <span style={bulletStyle}>•</span>
      {item}
    </li>
  );

  return (
    <div className={className} style={containerStyle}>
      <div style={headerStyle}>
        <h2 style={titleStyle}>AI Insights</h2>
      </div>

      <div style={contentStyle}>
        <div style={innerContainerStyle}>
          <div style={sectionStyle}>
            <h3 style={sectionTitleStyle}>What stands out</h3>
            <ul style={listStyle}>
              {insights.whatStandsOut.map((item, index) => 
                renderListItem(item, index, index === insights.whatStandsOut.length - 1)
              )}
            </ul>
          </div>

          <div style={sectionStyle}>
            <h3 style={sectionTitleStyle}>What to know</h3>
            <ul style={listStyle}>
              {insights.whatToKnow.map((item, index) => 
                renderListItem(item, index, index === insights.whatToKnow.length - 1)
              )}
            </ul>
          </div>

          <div style={sectionStyle}>
            <h3 style={sectionTitleStyle}>Best fit for</h3>
            <ul style={listStyle}>
              {insights.bestFitFor.map((item, index) => 
                renderListItem(item, index, index === insights.bestFitFor.length - 1)
              )}
            </ul>
          </div>

          <div style={sectionStyle}>
            <h3 style={sectionTitleStyle}>Trims to consider</h3>
            <ul style={listStyle}>
              {insights.trimsToConsider.map((trim, index) => (
                <li key={index} style={{ ...listItemStyle, marginBottom: index === insights.trimsToConsider.length - 1 ? 0 : '8px' }}>
                  <span style={bulletStyle}>•</span>
                  <strong style={{ fontWeight: 600, color: 'var(--color-neutrals-1, #141416)' }}>{trim.name}:</strong> {trim.description}
                </li>
              ))}
            </ul>
          </div>

          <div style={sectionStyle}>
            <h3 style={sectionTitleStyle}>Owner tip</h3>
            <p style={paragraphStyle}>{insights.ownerTip}</p>
          </div>

          <div style={lastSectionStyle}>
            <h3 style={sectionTitleStyle}>Similar to cross-shop</h3>
            <p style={paragraphStyle}>{insights.similarToCrossShop}</p>
          </div>

          <div style={footerStyle}>
            <p style={footerTextStyle}>
              These AI Insights summarize common strengths, trade-offs, and buyer patterns to help you decide faster.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIInsights;

