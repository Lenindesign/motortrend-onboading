/**
 * Design System Reference Page
 * Comprehensive reference for all design system elements
 */

import React from 'react';
import { Button, TextField } from '../../design-system/components';
import './DesignSystemReference.css';

const DesignSystemReference: React.FC = () => {
  return (
    <div className="design-system-reference">
      <div className="design-system-reference__container">
        <header className="design-system-reference__header">
          <h1 className="design-system-reference__title">Design System Reference</h1>
          <p className="design-system-reference__subtitle">
            Complete reference guide for MotorTrend Onboarding design system tokens, components, and patterns.
          </p>
        </header>

        {/* Colors Section */}
        <section className="design-system-reference__section">
          <h2 className="design-system-reference__section-title">Colors</h2>
          
          <div className="design-system-reference__subsection">
            <h3 className="design-system-reference__subsection-title">Neutrals Palette</h3>
            <p className="design-system-reference__description">
              Use CSS variables: <code>var(--color-neutrals-1)</code> through <code>var(--color-neutrals-8)</code>
            </p>
            <div className="design-system-reference__color-grid">
              <div className="design-system-reference__color-item">
                <div className="design-system-reference__color-swatch" style={{ backgroundColor: 'var(--color-neutrals-1)' }} />
                <div className="design-system-reference__color-info">
                  <span className="design-system-reference__color-name">Neutrals 1</span>
                  <span className="design-system-reference__color-value">#141416</span>
                  <span className="design-system-reference__color-usage">Headers, footers</span>
                </div>
              </div>
              <div className="design-system-reference__color-item">
                <div className="design-system-reference__color-swatch" style={{ backgroundColor: 'var(--color-neutrals-2)' }} />
                <div className="design-system-reference__color-info">
                  <span className="design-system-reference__color-name">Neutrals 2</span>
                  <span className="design-system-reference__color-value">#23262F</span>
                  <span className="design-system-reference__color-usage">Dark backgrounds</span>
                </div>
              </div>
              <div className="design-system-reference__color-item">
                <div className="design-system-reference__color-swatch" style={{ backgroundColor: 'var(--color-neutrals-3)' }} />
                <div className="design-system-reference__color-info">
                  <span className="design-system-reference__color-name">Neutrals 3</span>
                  <span className="design-system-reference__color-value">#353945</span>
                  <span className="design-system-reference__color-usage">Buttons, borders</span>
                </div>
              </div>
              <div className="design-system-reference__color-item">
                <div className="design-system-reference__color-swatch" style={{ backgroundColor: 'var(--color-neutrals-4)' }} />
                <div className="design-system-reference__color-info">
                  <span className="design-system-reference__color-name">Neutrals 4</span>
                  <span className="design-system-reference__color-value">#6E7481</span>
                  <span className="design-system-reference__color-usage">Secondary text</span>
                </div>
              </div>
              <div className="design-system-reference__color-item">
                <div className="design-system-reference__color-swatch" style={{ backgroundColor: 'var(--color-neutrals-5)' }} />
                <div className="design-system-reference__color-info">
                  <span className="design-system-reference__color-name">Neutrals 5</span>
                  <span className="design-system-reference__color-value">#B1B5C3</span>
                  <span className="design-system-reference__color-usage">Tertiary text, placeholders</span>
                </div>
              </div>
              <div className="design-system-reference__color-item">
                <div className="design-system-reference__color-swatch" style={{ backgroundColor: 'var(--color-neutrals-6)' }} />
                <div className="design-system-reference__color-info">
                  <span className="design-system-reference__color-name">Neutrals 6</span>
                  <span className="design-system-reference__color-value">#E6E8EC</span>
                  <span className="design-system-reference__color-usage">Borders</span>
                </div>
              </div>
              <div className="design-system-reference__color-item">
                <div className="design-system-reference__color-swatch" style={{ backgroundColor: 'var(--color-neutrals-7)' }} />
                <div className="design-system-reference__color-info">
                  <span className="design-system-reference__color-name">Neutrals 7</span>
                  <span className="design-system-reference__color-value">#F4F5F6</span>
                  <span className="design-system-reference__color-usage">Backgrounds</span>
                </div>
              </div>
              <div className="design-system-reference__color-item">
                <div className="design-system-reference__color-swatch" style={{ backgroundColor: 'var(--color-neutrals-8)', border: '1px solid var(--color-neutrals-6)' }} />
                <div className="design-system-reference__color-info">
                  <span className="design-system-reference__color-name">Neutrals 8</span>
                  <span className="design-system-reference__color-value">#FCFCFD</span>
                  <span className="design-system-reference__color-usage">Text on dark, input backgrounds</span>
                </div>
              </div>
            </div>
          </div>

          <div className="design-system-reference__subsection">
            <h3 className="design-system-reference__subsection-title">Primary Colors</h3>
            <div className="design-system-reference__color-grid">
              <div className="design-system-reference__color-item">
                <div className="design-system-reference__color-swatch" style={{ backgroundColor: 'var(--color-primary-1)' }} />
                <div className="design-system-reference__color-info">
                  <span className="design-system-reference__color-name">Primary 1</span>
                  <span className="design-system-reference__color-value">#E90C17</span>
                  <span className="design-system-reference__color-usage">MotorTrend Red</span>
                </div>
              </div>
            </div>
          </div>

          <div className="design-system-reference__subsection">
            <h3 className="design-system-reference__subsection-title">Extended Neutrals</h3>
            <div className="design-system-reference__color-grid">
              <div className="design-system-reference__color-item">
                <div className="design-system-reference__color-swatch" style={{ backgroundColor: 'var(--color-neutrals-2-5)' }} />
                <div className="design-system-reference__color-info">
                  <span className="design-system-reference__color-name">Neutrals 2.5</span>
                  <span className="design-system-reference__color-value">#282a30</span>
                  <span className="design-system-reference__color-usage">Extended neutral</span>
                </div>
              </div>
              <div className="design-system-reference__color-item">
                <div className="design-system-reference__color-swatch" style={{ backgroundColor: 'var(--color-neutrals-3-5)' }} />
                <div className="design-system-reference__color-info">
                  <span className="design-system-reference__color-name">Neutrals 3.5</span>
                  <span className="design-system-reference__color-value">#374151</span>
                  <span className="design-system-reference__color-usage">Extended neutral</span>
                </div>
              </div>
            </div>
          </div>

          <div className="design-system-reference__subsection">
            <h3 className="design-system-reference__subsection-title">Semantic Status Colors</h3>
            <p className="design-system-reference__description">
              Use for status indicators, alerts, and feedback messages.
            </p>
            <div className="design-system-reference__color-grid">
              <div className="design-system-reference__color-item">
                <div className="design-system-reference__color-swatch" style={{ backgroundColor: 'var(--color-semantic-success)' }} />
                <div className="design-system-reference__color-info">
                  <span className="design-system-reference__color-name">Success</span>
                  <span className="design-system-reference__color-value">#34A853</span>
                  <code className="design-system-reference__code">--color-semantic-success</code>
                </div>
              </div>
              <div className="design-system-reference__color-item">
                <div className="design-system-reference__color-swatch" style={{ backgroundColor: 'var(--color-semantic-success-light)' }} />
                <div className="design-system-reference__color-info">
                  <span className="design-system-reference__color-name">Success Light</span>
                  <span className="design-system-reference__color-value">#E8F5E9</span>
                  <code className="design-system-reference__code">--color-semantic-success-light</code>
                </div>
              </div>
              <div className="design-system-reference__color-item">
                <div className="design-system-reference__color-swatch" style={{ backgroundColor: 'var(--color-semantic-success-dark)' }} />
                <div className="design-system-reference__color-info">
                  <span className="design-system-reference__color-name">Success Dark</span>
                  <span className="design-system-reference__color-value">#2E7D32</span>
                  <code className="design-system-reference__code">--color-semantic-success-dark</code>
                </div>
              </div>
              <div className="design-system-reference__color-item">
                <div className="design-system-reference__color-swatch" style={{ backgroundColor: 'var(--color-semantic-warning)' }} />
                <div className="design-system-reference__color-info">
                  <span className="design-system-reference__color-name">Warning</span>
                  <span className="design-system-reference__color-value">#F59E0B</span>
                  <code className="design-system-reference__code">--color-semantic-warning</code>
                </div>
              </div>
              <div className="design-system-reference__color-item">
                <div className="design-system-reference__color-swatch" style={{ backgroundColor: 'var(--color-semantic-warning-light)' }} />
                <div className="design-system-reference__color-info">
                  <span className="design-system-reference__color-name">Warning Light</span>
                  <span className="design-system-reference__color-value">#FFF3E0</span>
                  <code className="design-system-reference__code">--color-semantic-warning-light</code>
                </div>
              </div>
              <div className="design-system-reference__color-item">
                <div className="design-system-reference__color-swatch" style={{ backgroundColor: 'var(--color-semantic-warning-dark)' }} />
                <div className="design-system-reference__color-info">
                  <span className="design-system-reference__color-name">Warning Dark</span>
                  <span className="design-system-reference__color-value">#D97706</span>
                  <code className="design-system-reference__code">--color-semantic-warning-dark</code>
                </div>
              </div>
              <div className="design-system-reference__color-item">
                <div className="design-system-reference__color-swatch" style={{ backgroundColor: 'var(--color-semantic-error)' }} />
                <div className="design-system-reference__color-info">
                  <span className="design-system-reference__color-name">Error</span>
                  <span className="design-system-reference__color-value">#EA4335</span>
                  <code className="design-system-reference__code">--color-semantic-error</code>
                </div>
              </div>
              <div className="design-system-reference__color-item">
                <div className="design-system-reference__color-swatch" style={{ backgroundColor: 'var(--color-semantic-error-light)' }} />
                <div className="design-system-reference__color-info">
                  <span className="design-system-reference__color-name">Error Light</span>
                  <span className="design-system-reference__color-value">#FFEBEE</span>
                  <code className="design-system-reference__code">--color-semantic-error-light</code>
                </div>
              </div>
              <div className="design-system-reference__color-item">
                <div className="design-system-reference__color-swatch" style={{ backgroundColor: 'var(--color-semantic-error-dark)' }} />
                <div className="design-system-reference__color-info">
                  <span className="design-system-reference__color-name">Error Dark</span>
                  <span className="design-system-reference__color-value">#C62828</span>
                  <code className="design-system-reference__code">--color-semantic-error-dark</code>
                </div>
              </div>
              <div className="design-system-reference__color-item">
                <div className="design-system-reference__color-swatch" style={{ backgroundColor: 'var(--color-semantic-info)' }} />
                <div className="design-system-reference__color-info">
                  <span className="design-system-reference__color-name">Info</span>
                  <span className="design-system-reference__color-value">#186CEA</span>
                  <code className="design-system-reference__code">--color-semantic-info</code>
                </div>
              </div>
              <div className="design-system-reference__color-item">
                <div className="design-system-reference__color-swatch" style={{ backgroundColor: 'var(--color-semantic-info-light)' }} />
                <div className="design-system-reference__color-info">
                  <span className="design-system-reference__color-name">Info Light</span>
                  <span className="design-system-reference__color-value">#E3F2FD</span>
                  <code className="design-system-reference__code">--color-semantic-info-light</code>
                </div>
              </div>
              <div className="design-system-reference__color-item">
                <div className="design-system-reference__color-swatch" style={{ backgroundColor: 'var(--color-semantic-info-dark)' }} />
                <div className="design-system-reference__color-info">
                  <span className="design-system-reference__color-name">Info Dark</span>
                  <span className="design-system-reference__color-value">#1976D2</span>
                  <code className="design-system-reference__code">--color-semantic-info-dark</code>
                </div>
              </div>
            </div>
          </div>

          <div className="design-system-reference__subsection">
            <h3 className="design-system-reference__subsection-title">Rating Colors</h3>
            <div className="design-system-reference__color-grid">
              <div className="design-system-reference__color-item">
                <div className="design-system-reference__color-swatch" style={{ backgroundColor: 'var(--color-rating-motortrend)' }} />
                <div className="design-system-reference__color-info">
                  <span className="design-system-reference__color-name">MotorTrend Rating</span>
                  <span className="design-system-reference__color-value">#FFB74D</span>
                  <code className="design-system-reference__code">--color-rating-motortrend</code>
                </div>
              </div>
              <div className="design-system-reference__color-item">
                <div className="design-system-reference__color-swatch" style={{ backgroundColor: 'var(--color-rating-community)' }} />
                <div className="design-system-reference__color-info">
                  <span className="design-system-reference__color-name">Community Rating</span>
                  <span className="design-system-reference__color-value">#33CCFF</span>
                  <code className="design-system-reference__code">--color-rating-community</code>
                </div>
              </div>
              <div className="design-system-reference__color-item">
                <div className="design-system-reference__color-swatch" style={{ backgroundColor: 'var(--color-rating-staff)' }} />
                <div className="design-system-reference__color-info">
                  <span className="design-system-reference__color-name">Staff Rating</span>
                  <span className="design-system-reference__color-value">#FFB74D</span>
                  <code className="design-system-reference__code">--color-rating-staff</code>
                </div>
              </div>
            </div>
          </div>

          <div className="design-system-reference__subsection">
            <h3 className="design-system-reference__subsection-title">State Colors</h3>
            <p className="design-system-reference__description">
              Use for interactive states (hover, active, disabled).
            </p>
            <div className="design-system-reference__color-grid">
              <div className="design-system-reference__color-item">
                <div className="design-system-reference__color-swatch" style={{ backgroundColor: 'var(--color-hover-overlay)', border: '1px solid var(--color-neutrals-6)' }} />
                <div className="design-system-reference__color-info">
                  <span className="design-system-reference__color-name">Hover Overlay</span>
                  <span className="design-system-reference__color-value">rgba(0, 0, 0, 0.1)</span>
                  <code className="design-system-reference__code">--color-hover-overlay</code>
                </div>
              </div>
              <div className="design-system-reference__color-item">
                <div className="design-system-reference__color-swatch" style={{ backgroundColor: 'var(--color-hover-overlay-dark)', border: '1px solid var(--color-neutrals-6)' }} />
                <div className="design-system-reference__color-info">
                  <span className="design-system-reference__color-name">Hover Overlay Dark</span>
                  <span className="design-system-reference__color-value">rgba(0, 0, 0, 0.2)</span>
                  <code className="design-system-reference__code">--color-hover-overlay-dark</code>
                </div>
              </div>
              <div className="design-system-reference__color-item">
                <div className="design-system-reference__color-swatch" style={{ backgroundColor: 'var(--color-active-overlay)', border: '1px solid var(--color-neutrals-6)' }} />
                <div className="design-system-reference__color-info">
                  <span className="design-system-reference__color-name">Active Overlay</span>
                  <span className="design-system-reference__color-value">rgba(0, 0, 0, 0.15)</span>
                  <code className="design-system-reference__code">--color-active-overlay</code>
                </div>
              </div>
              <div className="design-system-reference__color-item">
                <div className="design-system-reference__color-swatch" style={{ backgroundColor: 'var(--color-disabled-bg)' }} />
                <div className="design-system-reference__color-info">
                  <span className="design-system-reference__color-name">Disabled BG</span>
                  <span className="design-system-reference__color-value">var(--color-neutrals-3)</span>
                  <code className="design-system-reference__code">--color-disabled-bg</code>
                </div>
              </div>
              <div className="design-system-reference__color-item">
                <div className="design-system-reference__color-swatch" style={{ backgroundColor: 'var(--color-disabled-text)' }} />
                <div className="design-system-reference__color-info">
                  <span className="design-system-reference__color-name">Disabled Text</span>
                  <span className="design-system-reference__color-value">var(--color-neutrals-5)</span>
                  <code className="design-system-reference__code">--color-disabled-text</code>
                </div>
              </div>
            </div>
          </div>

          <div className="design-system-reference__subsection">
            <h3 className="design-system-reference__subsection-title">Overlay Colors</h3>
            <p className="design-system-reference__description">
              Use for modal overlays and backdrop effects.
            </p>
            <div className="design-system-reference__color-grid">
              <div className="design-system-reference__color-item">
                <div className="design-system-reference__color-swatch" style={{ backgroundColor: 'var(--color-overlay-light)', border: '1px solid var(--color-neutrals-6)' }} />
                <div className="design-system-reference__color-info">
                  <span className="design-system-reference__color-name">Overlay Light</span>
                  <span className="design-system-reference__color-value">rgba(0, 0, 0, 0.5)</span>
                  <code className="design-system-reference__code">--color-overlay-light</code>
                </div>
              </div>
              <div className="design-system-reference__color-item">
                <div className="design-system-reference__color-swatch" style={{ backgroundColor: 'var(--color-overlay-medium)', border: '1px solid var(--color-neutrals-6)' }} />
                <div className="design-system-reference__color-info">
                  <span className="design-system-reference__color-name">Overlay Medium</span>
                  <span className="design-system-reference__color-value">rgba(0, 0, 0, 0.7)</span>
                  <code className="design-system-reference__code">--color-overlay-medium</code>
                </div>
              </div>
              <div className="design-system-reference__color-item">
                <div className="design-system-reference__color-swatch" style={{ backgroundColor: 'var(--color-overlay-dark)', border: '1px solid var(--color-neutrals-6)' }} />
                <div className="design-system-reference__color-info">
                  <span className="design-system-reference__color-name">Overlay Dark</span>
                  <span className="design-system-reference__color-value">rgba(0, 0, 0, 0.9)</span>
                  <code className="design-system-reference__code">--color-overlay-dark</code>
                </div>
              </div>
            </div>
          </div>

          <div className="design-system-reference__subsection">
            <h3 className="design-system-reference__subsection-title">Basic Colors</h3>
            <div className="design-system-reference__color-grid">
              <div className="design-system-reference__color-item">
                <div className="design-system-reference__color-swatch" style={{ backgroundColor: 'var(--color-blue)' }} />
                <div className="design-system-reference__color-info">
                  <span className="design-system-reference__color-name">Blue</span>
                  <span className="design-system-reference__color-value">#186CEA</span>
                  <span className="design-system-reference__color-usage">Links, accents</span>
                </div>
              </div>
              <div className="design-system-reference__color-item">
                <div className="design-system-reference__color-swatch" style={{ backgroundColor: 'var(--color-white)' }} />
                <div className="design-system-reference__color-info">
                  <span className="design-system-reference__color-name">White</span>
                  <span className="design-system-reference__color-value">#FFFFFF</span>
                  <span className="design-system-reference__color-usage">Text on dark backgrounds</span>
                </div>
              </div>
              <div className="design-system-reference__color-item">
                <div className="design-system-reference__color-swatch" style={{ backgroundColor: 'var(--color-black)', border: '1px solid var(--color-neutrals-6)' }} />
                <div className="design-system-reference__color-info">
                  <span className="design-system-reference__color-name">Black</span>
                  <span className="design-system-reference__color-value">#000000</span>
                  <span className="design-system-reference__color-usage">Text on light backgrounds</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Typography Section */}
        <section className="design-system-reference__section">
          <h2 className="design-system-reference__section-title">Typography</h2>
          
          <div className="design-system-reference__subsection">
            <h3 className="design-system-reference__subsection-title">Font Families</h3>
            <div className="design-system-reference__typography-grid">
              <div className="design-system-reference__typography-item">
                <span className="design-system-reference__typography-label">Heading Font:</span>
                <span className="design-system-reference__typography-value" style={{ fontFamily: 'var(--font-heading)' }}>
                  Poppins
                </span>
              </div>
              <div className="design-system-reference__typography-item">
                <span className="design-system-reference__typography-label">Body Font:</span>
                <span className="design-system-reference__typography-value" style={{ fontFamily: 'var(--font-body)' }}>
                  Geist
                </span>
              </div>
            </div>
          </div>

          <div className="design-system-reference__subsection">
            <h3 className="design-system-reference__subsection-title">Text Styles</h3>
            <div className="design-system-reference__text-styles">
              <div className="design-system-reference__text-style-item">
                <span className="design-system-reference__text-style-label">Hero</span>
                <div className="design-system-reference__text-style-preview" style={{ 
                  fontFamily: 'var(--font-heading)', 
                  fontWeight: 600, 
                  fontSize: '96px', 
                  lineHeight: '1em' 
                }}>
                  Hero Text
                </div>
                <code className="design-system-reference__code">96px, Poppins, Bold</code>
              </div>
              <div className="design-system-reference__text-style-item">
                <span className="design-system-reference__text-style-label">H5</span>
                <div className="design-system-reference__text-style-preview" style={{ 
                  fontFamily: 'var(--font-heading)', 
                  fontWeight: 600, 
                  fontSize: '24px', 
                  lineHeight: '1.167em' 
                }}>
                  Heading 5
                </div>
                <code className="design-system-reference__code">24px, Poppins, Bold</code>
              </div>
              <div className="design-system-reference__text-style-item">
                <span className="design-system-reference__text-style-label">Subtitle 1</span>
                <div className="design-system-reference__text-style-preview" style={{ 
                  fontFamily: 'var(--font-heading)', 
                  fontWeight: 600, 
                  fontSize: '18px', 
                  lineHeight: '1.333em' 
                }}>
                  Subtitle Text
                </div>
                <code className="design-system-reference__code">18px, Poppins, Bold</code>
              </div>
              <div className="design-system-reference__text-style-item">
                <span className="design-system-reference__text-style-label">Body 2</span>
                <div className="design-system-reference__text-style-preview" style={{ 
                  fontFamily: 'var(--font-body)', 
                  fontWeight: 400, 
                  fontSize: '18px', 
                  lineHeight: '1.556em' 
                }}>
                  Body text for paragraphs and longer content. This style is used for main content areas.
                </div>
                <code className="design-system-reference__code">18px, Geist, Regular</code>
              </div>
              <div className="design-system-reference__text-style-item">
                <span className="design-system-reference__text-style-label">Body 3</span>
                <div className="design-system-reference__text-style-preview" style={{ 
                  fontFamily: 'var(--font-body)', 
                  fontWeight: 400, 
                  fontSize: '16px', 
                  lineHeight: '1.5em' 
                }}>
                  Body text for smaller paragraphs and secondary content.
                </div>
                <code className="design-system-reference__code">16px, Geist, Regular</code>
              </div>
              <div className="design-system-reference__text-style-item">
                <span className="design-system-reference__text-style-label">Button 1</span>
                <div className="design-system-reference__text-style-preview" style={{ 
                  fontFamily: 'var(--font-heading)', 
                  fontWeight: 600, 
                  fontSize: '16px', 
                  lineHeight: '1em' 
                }}>
                  Button Text
                </div>
                <code className="design-system-reference__code">16px, Poppins, Bold</code>
              </div>
              <div className="design-system-reference__text-style-item">
                <span className="design-system-reference__text-style-label">Caption 1</span>
                <div className="design-system-reference__text-style-preview" style={{ 
                  fontFamily: 'var(--font-body)', 
                  fontWeight: 400, 
                  fontSize: '14px', 
                  lineHeight: '1.286em' 
                }}>
                  Caption text for labels and metadata
                </div>
                <code className="design-system-reference__code">14px, Geist, Regular</code>
              </div>
              <div className="design-system-reference__text-style-item">
                <span className="design-system-reference__text-style-label">Caption 2</span>
                <div className="design-system-reference__text-style-preview" style={{ 
                  fontFamily: 'var(--font-body)', 
                  fontWeight: 400, 
                  fontSize: '12px', 
                  lineHeight: '1.333em' 
                }}>
                  Small caption text
                </div>
                <code className="design-system-reference__code">12px, Geist, Regular</code>
              </div>
            </div>
          </div>
        </section>

        {/* Spacing Section */}
        <section className="design-system-reference__section">
          <h2 className="design-system-reference__section-title">Spacing</h2>
          
          <div className="design-system-reference__subsection">
            <h3 className="design-system-reference__subsection-title">Base Spacing (8px system)</h3>
            <p className="design-system-reference__description">
              Use CSS variables: <code>var(--spacing-1)</code> through <code>var(--spacing-6)</code>
            </p>
            <div className="design-system-reference__spacing-grid">
              {[1, 2, 3, 4, 5, 6].map((num) => (
                <div key={num} className="design-system-reference__spacing-item">
                  <div 
                    className="design-system-reference__spacing-visual" 
                    style={{ width: `var(--spacing-${num})`, height: `var(--spacing-${num})` }}
                  />
                  <div className="design-system-reference__spacing-info">
                    <span className="design-system-reference__spacing-name">Spacing {num}</span>
                    <span className="design-system-reference__spacing-value">
                      {num === 1 ? '8px' : num === 2 ? '16px' : num === 3 ? '24px' : num === 4 ? '32px' : num === 5 ? '40px' : '48px'}
                    </span>
                    <code className="design-system-reference__code">var(--spacing-{num})</code>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="design-system-reference__subsection">
            <h3 className="design-system-reference__subsection-title">Component Padding</h3>
            <p className="design-system-reference__description">
              Use for component internal padding: <code>var(--spacing-component-xs)</code> through <code>var(--spacing-component-xxl)</code>
            </p>
            <div className="design-system-reference__spacing-grid">
              {[
                { name: 'XS', var: '--spacing-component-xs', value: '4px' },
                { name: 'SM', var: '--spacing-component-sm', value: '8px' },
                { name: 'MD', var: '--spacing-component-md', value: '12px' },
                { name: 'LG', var: '--spacing-component-lg', value: '16px' },
                { name: 'XL', var: '--spacing-component-xl', value: '24px' },
                { name: 'XXL', var: '--spacing-component-xxl', value: '32px' },
              ].map((item) => (
                <div key={item.name} className="design-system-reference__spacing-item">
                  <div 
                    className="design-system-reference__spacing-visual" 
                    style={{ width: item.value, height: item.value }}
                  />
                  <div className="design-system-reference__spacing-info">
                    <span className="design-system-reference__spacing-name">Component {item.name}</span>
                    <span className="design-system-reference__spacing-value">{item.value}</span>
                    <code className="design-system-reference__code">{`var(${item.var})`}</code>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="design-system-reference__subsection">
            <h3 className="design-system-reference__subsection-title">Component Gap</h3>
            <p className="design-system-reference__description">
              Use for gaps between elements: <code>var(--spacing-gap-xs)</code> through <code>var(--spacing-gap-xxl)</code>
            </p>
            <div className="design-system-reference__spacing-grid">
              {[
                { name: 'XS', var: '--spacing-gap-xs', value: '4px' },
                { name: 'SM', var: '--spacing-gap-sm', value: '8px' },
                { name: 'MD', var: '--spacing-gap-md', value: '12px' },
                { name: 'LG', var: '--spacing-gap-lg', value: '16px' },
                { name: 'XL', var: '--spacing-gap-xl', value: '24px' },
                { name: 'XXL', var: '--spacing-gap-xxl', value: '32px' },
              ].map((item) => (
                <div key={item.name} className="design-system-reference__spacing-item">
                  <div 
                    className="design-system-reference__spacing-visual" 
                    style={{ width: item.value, height: item.value }}
                  />
                  <div className="design-system-reference__spacing-info">
                    <span className="design-system-reference__spacing-name">Gap {item.name}</span>
                    <span className="design-system-reference__spacing-value">{item.value}</span>
                    <code className="design-system-reference__code">{`var(${item.var})`}</code>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="design-system-reference__subsection">
            <h3 className="design-system-reference__subsection-title">Button Padding</h3>
            <div className="design-system-reference__spacing-grid">
              {[
                { name: 'XS', var: '--spacing-button-xs', value: '6px 12px' },
                { name: 'SM', var: '--spacing-button-sm', value: '8px 16px' },
                { name: 'MD', var: '--spacing-button-md', value: '12px 24px' },
                { name: 'LG', var: '--spacing-button-lg', value: '16px 32px' },
              ].map((item) => (
                <div key={item.name} className="design-system-reference__spacing-item">
                  <div className="design-system-reference__spacing-info">
                    <span className="design-system-reference__spacing-name">Button {item.name}</span>
                    <span className="design-system-reference__spacing-value">{item.value}</span>
                    <code className="design-system-reference__code">{`var(${item.var})`}</code>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="design-system-reference__subsection">
            <h3 className="design-system-reference__subsection-title">Card Padding</h3>
            <div className="design-system-reference__spacing-grid">
              {[
                { name: 'XS', var: '--spacing-card-xs', value: '8px' },
                { name: 'SM', var: '--spacing-card-sm', value: '12px' },
                { name: 'MD', var: '--spacing-card-md', value: '16px' },
                { name: 'LG', var: '--spacing-card-lg', value: '24px' },
                { name: 'XL', var: '--spacing-card-xl', value: '32px' },
              ].map((item) => (
                <div key={item.name} className="design-system-reference__spacing-item">
                  <div 
                    className="design-system-reference__spacing-visual" 
                    style={{ width: item.value, height: item.value }}
                  />
                  <div className="design-system-reference__spacing-info">
                    <span className="design-system-reference__spacing-name">Card {item.name}</span>
                    <span className="design-system-reference__spacing-value">{item.value}</span>
                    <code className="design-system-reference__code">{`var(${item.var})`}</code>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="design-system-reference__subsection">
            <h3 className="design-system-reference__subsection-title">Modal Spacing</h3>
            <div className="design-system-reference__spacing-grid">
              {[
                { name: 'XS', var: '--spacing-modal-xs', value: '16px' },
                { name: 'SM', var: '--spacing-modal-sm', value: '20px' },
                { name: 'MD', var: '--spacing-modal-md', value: '24px' },
                { name: 'LG', var: '--spacing-modal-lg', value: '32px' },
                { name: 'XL', var: '--spacing-modal-xl', value: '40px' },
              ].map((item) => (
                <div key={item.name} className="design-system-reference__spacing-item">
                  <div 
                    className="design-system-reference__spacing-visual" 
                    style={{ width: item.value, height: item.value }}
                  />
                  <div className="design-system-reference__spacing-info">
                    <span className="design-system-reference__spacing-name">Modal {item.name}</span>
                    <span className="design-system-reference__spacing-value">{item.value}</span>
                    <code className="design-system-reference__code">{`var(${item.var})`}</code>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="design-system-reference__subsection">
            <h3 className="design-system-reference__subsection-title">Grid Spacing</h3>
            <div className="design-system-reference__spacing-grid">
              {[
                { name: 'XS', var: '--spacing-grid-xs', value: '8px' },
                { name: 'SM', var: '--spacing-grid-sm', value: '12px' },
                { name: 'MD', var: '--spacing-grid-md', value: '16px' },
                { name: 'LG', var: '--spacing-grid-lg', value: '24px' },
                { name: 'XL', var: '--spacing-grid-xl', value: '32px' },
                { name: 'XXL', var: '--spacing-grid-xxl', value: '48px' },
              ].map((item) => (
                <div key={item.name} className="design-system-reference__spacing-item">
                  <div 
                    className="design-system-reference__spacing-visual" 
                    style={{ width: item.value, height: item.value }}
                  />
                  <div className="design-system-reference__spacing-info">
                    <span className="design-system-reference__spacing-name">Grid {item.name}</span>
                    <span className="design-system-reference__spacing-value">{item.value}</span>
                    <code className="design-system-reference__code">{`var(${item.var})`}</code>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Effects Section */}
        <section className="design-system-reference__section">
          <h2 className="design-system-reference__section-title">Effects</h2>
          
          <div className="design-system-reference__subsection">
            <h3 className="design-system-reference__subsection-title">Border Radius</h3>
            <div className="design-system-reference__effects-grid">
              <div className="design-system-reference__effect-item">
                <div className="design-system-reference__effect-visual" style={{ borderRadius: 'var(--border-radius-sm)' }} />
                <div className="design-system-reference__effect-info">
                  <span className="design-system-reference__effect-name">Small</span>
                  <code className="design-system-reference__code">var(--border-radius-sm)</code>
                  <span className="design-system-reference__effect-value">4px</span>
                </div>
              </div>
              <div className="design-system-reference__effect-item">
                <div className="design-system-reference__effect-visual" style={{ borderRadius: 'var(--border-radius-md)' }} />
                <div className="design-system-reference__effect-info">
                  <span className="design-system-reference__effect-name">Medium</span>
                  <code className="design-system-reference__code">var(--border-radius-md)</code>
                  <span className="design-system-reference__effect-value">8px</span>
                </div>
              </div>
              <div className="design-system-reference__effect-item">
                <div className="design-system-reference__effect-visual" style={{ borderRadius: 'var(--border-radius-lg)' }} />
                <div className="design-system-reference__effect-info">
                  <span className="design-system-reference__effect-name">Large</span>
                  <code className="design-system-reference__code">var(--border-radius-lg)</code>
                  <span className="design-system-reference__effect-value">16px</span>
                </div>
              </div>
              <div className="design-system-reference__effect-item">
                <div className="design-system-reference__effect-visual" style={{ borderRadius: 'var(--border-radius-full)' }} />
                <div className="design-system-reference__effect-info">
                  <span className="design-system-reference__effect-name">Full</span>
                  <code className="design-system-reference__code">var(--border-radius-full)</code>
                  <span className="design-system-reference__effect-value">100px</span>
                </div>
              </div>
            </div>
          </div>

          <div className="design-system-reference__subsection">
            <h3 className="design-system-reference__subsection-title">Shadows - Depth System</h3>
            <p className="design-system-reference__description">
              Elevation-based shadow system: <code>var(--shadow-depth-0)</code> through <code>var(--shadow-depth-7)</code>
            </p>
            <div className="design-system-reference__effects-grid">
              {[
                { name: 'Depth 0', var: '--shadow-depth-0', desc: 'No shadow' },
                { name: 'Depth 1', var: '--shadow-depth-1', desc: 'Subtle elevation' },
                { name: 'Depth 2', var: '--shadow-depth-2', desc: 'Low elevation' },
                { name: 'Depth 3', var: '--shadow-depth-3', desc: 'Medium elevation' },
                { name: 'Depth 4', var: '--shadow-depth-4', desc: 'High elevation' },
                { name: 'Depth 5', var: '--shadow-depth-5', desc: 'Standard elevation' },
                { name: 'Depth 6', var: '--shadow-depth-6', desc: 'Very high elevation' },
                { name: 'Depth 7', var: '--shadow-depth-7', desc: 'Highest elevation' },
              ].map((item) => (
                <div key={item.name} className="design-system-reference__effect-item">
                  <div className="design-system-reference__effect-visual" style={{ boxShadow: item.var === '--shadow-depth-0' ? 'none' : `var(${item.var})` }} />
                  <div className="design-system-reference__effect-info">
                    <span className="design-system-reference__effect-name">{item.name}</span>
                    <code className="design-system-reference__code">{`var(${item.var})`}</code>
                    <span className="design-system-reference__effect-value">{item.desc}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="design-system-reference__subsection">
            <h3 className="design-system-reference__subsection-title">Component Shadows</h3>
            <p className="design-system-reference__description">
              Pre-configured shadows for specific components.
            </p>
            <div className="design-system-reference__effects-grid">
              {[
                { name: 'Card', var: '--shadow-card', desc: 'Card default shadow' },
                { name: 'Card Hover', var: '--shadow-card-hover', desc: 'Card hover shadow' },
                { name: 'Button', var: '--shadow-button', desc: 'Button default shadow' },
                { name: 'Button Hover', var: '--shadow-button-hover', desc: 'Button hover shadow' },
                { name: 'Button Primary', var: '--shadow-button-primary', desc: 'Primary button shadow' },
                { name: 'Modal', var: '--shadow-modal', desc: 'Modal shadow' },
                { name: 'Modal Large', var: '--shadow-modal-lg', desc: 'Large modal shadow' },
                { name: 'Dropdown', var: '--shadow-dropdown', desc: 'Dropdown shadow' },
              ].map((item) => (
                <div key={item.name} className="design-system-reference__effect-item">
                  <div className="design-system-reference__effect-visual" style={{ boxShadow: `var(${item.var})` }} />
                  <div className="design-system-reference__effect-info">
                    <span className="design-system-reference__effect-name">{item.name}</span>
                    <code className="design-system-reference__code">{`var(${item.var})`}</code>
                    <span className="design-system-reference__effect-value">{item.desc}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="design-system-reference__subsection">
            <h3 className="design-system-reference__subsection-title">Text Shadows</h3>
            <div className="design-system-reference__effects-grid">
              {[
                { name: 'Small', var: '--shadow-text-sm', desc: 'Small text shadow' },
                { name: 'Medium', var: '--shadow-text-md', desc: 'Medium text shadow' },
                { name: 'Large', var: '--shadow-text-lg', desc: 'Large text shadow' },
              ].map((item) => (
                <div key={item.name} className="design-system-reference__effect-item">
                  <div className="design-system-reference__effect-visual" style={{ 
                    background: 'var(--color-primary-1)', 
                    color: 'var(--color-white)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    textShadow: `var(${item.var})`,
                    fontSize: '14px',
                    fontWeight: 'bold'
                  }}>
                    Text
                  </div>
                  <div className="design-system-reference__effect-info">
                    <span className="design-system-reference__effect-name">{item.name}</span>
                    <code className="design-system-reference__code">{`var(${item.var})`}</code>
                    <span className="design-system-reference__effect-value">{item.desc}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="design-system-reference__subsection">
            <h3 className="design-system-reference__subsection-title">Transitions</h3>
            <div className="design-system-reference__transition-grid">
              <div className="design-system-reference__transition-item">
                <span className="design-system-reference__transition-label">Fast:</span>
                <code className="design-system-reference__code">var(--transition-fast)</code>
                <span className="design-system-reference__transition-value">150ms ease-in-out</span>
              </div>
              <div className="design-system-reference__transition-item">
                <span className="design-system-reference__transition-label">Normal:</span>
                <code className="design-system-reference__code">var(--transition-normal)</code>
                <span className="design-system-reference__transition-value">250ms ease-in-out</span>
              </div>
              <div className="design-system-reference__transition-item">
                <span className="design-system-reference__transition-label">Slow:</span>
                <code className="design-system-reference__code">var(--transition-slow)</code>
                <span className="design-system-reference__transition-value">350ms ease-in-out</span>
              </div>
            </div>
          </div>
        </section>

        {/* Buttons Section */}
        <section className="design-system-reference__section">
          <h2 className="design-system-reference__section-title">Buttons (CTA)</h2>
          <p className="design-system-reference__description">
            Always use CTA classes: <code>cta cta--[variant] cta--[size]</code>
          </p>
          
          <div className="design-system-reference__subsection">
            <h3 className="design-system-reference__subsection-title">Sizes</h3>
            <div className="design-system-reference__button-group">
              <button className="cta cta--primary cta--small">Small Button</button>
              <button className="cta cta--primary cta--default">Default Button</button>
              <button className="cta cta--primary cta--large">Large Button</button>
            </div>
          </div>

          <div className="design-system-reference__subsection">
            <h3 className="design-system-reference__subsection-title">Variants</h3>
            <div className="design-system-reference__button-group">
              <button className="cta cta--primary cta--default">Primary</button>
              <button className="cta cta--secondary cta--default">Secondary</button>
              <button className="cta cta--neutral cta--default">Neutral</button>
              <button className="cta cta--success cta--default">Success</button>
              <button className="cta cta--warning cta--default">Warning</button>
              <button className="cta cta--ghost cta--default">Ghost</button>
              <button className="cta cta--outline cta--default">Outline</button>
            </div>
          </div>

          <div className="design-system-reference__subsection">
            <h3 className="design-system-reference__subsection-title">States</h3>
            <div className="design-system-reference__button-group">
              <button className="cta cta--primary cta--default">Normal</button>
              <button className="cta cta--primary cta--default" disabled>Disabled</button>
              <button className="cta cta--primary cta--default cta--full-width">Full Width</button>
            </div>
          </div>

          <div className="design-system-reference__subsection">
            <h3 className="design-system-reference__subsection-title">Button Component</h3>
            <div className="design-system-reference__button-group">
              <Button color="primary" size="default" variant="solid">Button Component</Button>
              <Button color="secondary" size="large" variant="solid">Secondary Large</Button>
              <Button color="primary" size="small" variant="ghost">Ghost Small</Button>
            </div>
          </div>
        </section>

        {/* Form Components Section */}
        <section className="design-system-reference__section">
          <h2 className="design-system-reference__section-title">Form Components</h2>
          
          <div className="design-system-reference__subsection">
            <h3 className="design-system-reference__subsection-title">TextField</h3>
            <div className="design-system-reference__form-group">
              <TextField 
                label="Default TextField" 
                placeholder="Enter text here"
                fullWidth
              />
              <TextField 
                label="TextField with Error" 
                placeholder="Enter text here"
                error="This field is required"
                fullWidth
              />
              <TextField 
                label="TextField with Helper Text" 
                placeholder="Enter text here"
                helperText="This is helper text"
                fullWidth
              />
              <TextField 
                label="Disabled TextField" 
                placeholder="Cannot edit"
                disabled
                fullWidth
              />
            </div>
          </div>
        </section>

        {/* Layout Section */}
        <section className="design-system-reference__section">
          <h2 className="design-system-reference__section-title">Layout</h2>
          
          <div className="design-system-reference__subsection">
            <h3 className="design-system-reference__subsection-title">Container Max Width</h3>
            <div className="design-system-reference__layout-item">
              <code className="design-system-reference__code">var(--max-width-container)</code>
              <span className="design-system-reference__layout-value">1280px</span>
            </div>
          </div>

          <div className="design-system-reference__subsection">
            <h3 className="design-system-reference__subsection-title">Section Spacing</h3>
            <div className="design-system-reference__layout-grid">
              <div className="design-system-reference__layout-item">
                <span className="design-system-reference__layout-label">Vertical:</span>
                <code className="design-system-reference__code">var(--section-spacing-vertical)</code>
                <span className="design-system-reference__layout-value">32px</span>
              </div>
              <div className="design-system-reference__layout-item">
                <span className="design-system-reference__layout-label">Horizontal:</span>
                <code className="design-system-reference__code">var(--section-spacing-horizontal)</code>
                <span className="design-system-reference__layout-value">24px</span>
              </div>
            </div>
          </div>
        </section>

        {/* Usage Examples Section */}
        <section className="design-system-reference__section">
          <h2 className="design-system-reference__section-title">Usage Examples</h2>
          
          <div className="design-system-reference__subsection">
            <h3 className="design-system-reference__subsection-title">Card Component</h3>
            <pre className="design-system-reference__code-block">
{`.card {
  background: var(--color-neutrals-8);
  border: 1px solid var(--color-neutrals-6);
  border-radius: var(--border-radius-md);
  padding: var(--spacing-card-md);
  box-shadow: var(--shadow-card);
  transition: all var(--transition-fast);
}

.card:hover {
  box-shadow: var(--shadow-card-hover);
}`}
            </pre>
          </div>

          <div className="design-system-reference__subsection">
            <h3 className="design-system-reference__subsection-title">Button Component</h3>
            <pre className="design-system-reference__code-block">
{`.button {
  padding: var(--spacing-button-sm);
  background: var(--color-primary-1);
  color: var(--color-white);
  border-radius: var(--border-radius-sm);
  box-shadow: var(--shadow-button-primary);
  transition: all var(--transition-fast);
}

.button:hover {
  box-shadow: var(--shadow-button-hover);
}`}
            </pre>
          </div>

          <div className="design-system-reference__subsection">
            <h3 className="design-system-reference__subsection-title">Modal Component</h3>
            <pre className="design-system-reference__code-block">
{`.modal-overlay {
  background-color: var(--color-overlay-medium);
}

.modal-content {
  background: var(--color-neutrals-8);
  border-radius: var(--border-radius-lg);
  padding: var(--spacing-modal-md);
  box-shadow: var(--shadow-modal);
}`}
            </pre>
          </div>

          <div className="design-system-reference__subsection">
            <h3 className="design-system-reference__subsection-title">Success Message</h3>
            <pre className="design-system-reference__code-block">
{`.success-message {
  background: var(--color-semantic-success-light);
  color: var(--color-semantic-success-dark);
  border: 1px solid var(--color-semantic-success);
  padding: var(--spacing-component-md);
  border-radius: var(--border-radius-sm);
}`}
            </pre>
          </div>

          <div className="design-system-reference__subsection">
            <h3 className="design-system-reference__subsection-title">Grid Layout</h3>
            <pre className="design-system-reference__code-block">
{`.grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--spacing-grid-lg);
}`}
            </pre>
          </div>
        </section>

        {/* Best Practices Section */}
        <section className="design-system-reference__section">
          <h2 className="design-system-reference__section-title">Best Practices</h2>
          
          <div className="design-system-reference__subsection">
            <ol className="design-system-reference__best-practices">
              <li>
                <strong>Always use CSS variables</strong> - Never hardcode colors or spacing
              </li>
              <li>
                <strong>Use semantic tokens</strong> - Prefer <code>--color-semantic-success</code> over <code>#34A853</code>
              </li>
              <li>
                <strong>Follow 8px system</strong> - Use spacing tokens aligned with 8px base
              </li>
              <li>
                <strong>Use component-specific tokens</strong> - Prefer <code>--spacing-card-md</code> over <code>--spacing-2</code> for cards
              </li>
              <li>
                <strong>Consistent shadows</strong> - Use shadow depth system for elevation
              </li>
              <li>
                <strong>State colors</strong> - Use state tokens for hover/active/disabled states
              </li>
            </ol>
          </div>
        </section>
      </div>
    </div>
  );
};

export default DesignSystemReference;

