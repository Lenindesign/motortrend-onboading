/**
 * Design System Reference Page
 * Professional, modern design system documentation
 */

import React, { useState, useEffect, useRef } from 'react';
import { TextField } from '../../design-system/components';
import Icon from '../../components/Icon';
import './DesignSystemReference.css';

interface Section {
  id: string;
  title: string;
  icon: string;
}

const sections: Section[] = [
  { id: 'colors', title: 'Colors', icon: 'palette' },
  { id: 'typography', title: 'Typography', icon: 'text_fields' },
  { id: 'spacing', title: 'Spacing', icon: 'space_bar' },
  { id: 'effects', title: 'Effects', icon: 'auto_awesome' },
  { id: 'buttons', title: 'Buttons', icon: 'smart_button' },
  { id: 'forms', title: 'Forms', icon: 'input' },
];

const ColorSwatch: React.FC<{ 
  name: string; 
  variable: string; 
  value: string; 
  usage?: string;
  isDark?: boolean;
}> = ({ name, variable, value, usage, isDark }) => {
  const [copied, setCopied] = useState(false);
  
  const handleCopy = () => {
    navigator.clipboard.writeText(`var(${variable})`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="ds-color-swatch" onClick={handleCopy}>
      <div 
        className="ds-color-swatch__preview" 
        style={{ backgroundColor: `var(${variable})` }}
      >
        {isDark && <span className="ds-color-swatch__light-text">Aa</span>}
      </div>
      <div className="ds-color-swatch__info">
        <span className="ds-color-swatch__name">{name}</span>
        <code className="ds-color-swatch__var">{variable}</code>
        <span className="ds-color-swatch__value">{value}</span>
        {usage && <span className="ds-color-swatch__usage">{usage}</span>}
      </div>
      <div className={`ds-color-swatch__copied ${copied ? 'ds-color-swatch__copied--visible' : ''}`}>
        <Icon name="check" size={16} /> Copied!
      </div>
    </div>
  );
};

const TokenCard: React.FC<{
  name: string;
  variable: string;
  value: string;
  preview?: React.ReactNode;
}> = ({ name, variable, value, preview }) => {
  const [copied, setCopied] = useState(false);
  
  const handleCopy = () => {
    navigator.clipboard.writeText(`var(${variable})`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="ds-token-card" onClick={handleCopy}>
      {preview && <div className="ds-token-card__preview">{preview}</div>}
      <div className="ds-token-card__content">
        <span className="ds-token-card__name">{name}</span>
        <code className="ds-token-card__var">{variable}</code>
        <span className="ds-token-card__value">{value}</span>
      </div>
      <button className="ds-token-card__copy" title="Copy variable">
        <Icon name={copied ? 'check' : 'content_copy'} size={16} />
      </button>
    </div>
  );
};

const DesignSystemReference: React.FC = () => {
  const [activeSection, setActiveSection] = useState('colors');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const sectionRefs = useRef<Record<string, HTMLElement | null>>({});

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 100;
      
      for (const section of sections) {
        const element = sectionRefs.current[section.id];
        if (element) {
          const { offsetTop, offsetHeight } = element;
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveSection(section.id);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    const element = sectionRefs.current[id];
    if (element) {
      const offset = 80;
      const top = element.offsetTop - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  };

  const neutralColors = [
    { name: 'Neutrals 1', var: '--color-neutrals-1', value: '#141416', usage: 'Primary backgrounds' },
    { name: 'Neutrals 2', var: '--color-neutrals-2', value: '#23262F', usage: 'Secondary backgrounds' },
    { name: 'Neutrals 3', var: '--color-neutrals-3', value: '#353945', usage: 'Borders, buttons' },
    { name: 'Neutrals 4', var: '--color-neutrals-4', value: '#6E7481', usage: 'Secondary text' },
    { name: 'Neutrals 5', var: '--color-neutrals-5', value: '#B1B5C3', usage: 'Tertiary text' },
    { name: 'Neutrals 6', var: '--color-neutrals-6', value: '#E6E8EC', usage: 'Light borders' },
    { name: 'Neutrals 7', var: '--color-neutrals-7', value: '#F4F5F6', usage: 'Light backgrounds' },
    { name: 'Neutrals 8', var: '--color-neutrals-8', value: '#FCFCFD', usage: 'White backgrounds' },
  ];

  const semanticColors = [
    { name: 'Success', var: '--color-semantic-success', value: '#34A853' },
    { name: 'Success Light', var: '--color-semantic-success-light', value: '#E8F5E9' },
    { name: 'Warning', var: '--color-semantic-warning', value: '#F59E0B' },
    { name: 'Warning Light', var: '--color-semantic-warning-light', value: '#FFF3E0' },
    { name: 'Error', var: '--color-semantic-error', value: '#EA4335' },
    { name: 'Error Light', var: '--color-semantic-error-light', value: '#FFEBEE' },
    { name: 'Info', var: '--color-semantic-info', value: '#186CEA' },
    { name: 'Info Light', var: '--color-semantic-info-light', value: '#E3F2FD' },
  ];

  const spacingTokens = [
    { name: 'Spacing 1', var: '--spacing-1', value: '8px' },
    { name: 'Spacing 2', var: '--spacing-2', value: '16px' },
    { name: 'Spacing 3', var: '--spacing-3', value: '24px' },
    { name: 'Spacing 4', var: '--spacing-4', value: '32px' },
    { name: 'Spacing 5', var: '--spacing-5', value: '40px' },
    { name: 'Spacing 6', var: '--spacing-6', value: '48px' },
  ];

  const radiusTokens = [
    { name: 'Small', var: '--border-radius-sm', value: '4px' },
    { name: 'Medium', var: '--border-radius-md', value: '8px' },
    { name: 'Large', var: '--border-radius-lg', value: '16px' },
    { name: 'Full', var: '--border-radius-full', value: '100px' },
  ];

  const shadowTokens = [
    { name: 'Card', var: '--shadow-card', value: 'Default card elevation' },
    { name: 'Card Hover', var: '--shadow-card-hover', value: 'Elevated card state' },
    { name: 'Modal', var: '--shadow-modal', value: 'Modal overlay' },
    { name: 'Dropdown', var: '--shadow-dropdown', value: 'Dropdown menus' },
  ];

  return (
    <div className="ds-page">
      {/* Sidebar Navigation */}
      <nav className={`ds-sidebar ${isSidebarCollapsed ? 'ds-sidebar--collapsed' : ''}`}>
        <div className="ds-sidebar__header">
          <div className="ds-sidebar__header-top">
            <div className="ds-sidebar__logo">
              DS
            </div>
            <button 
              className="ds-sidebar__toggle"
              onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
              aria-label={isSidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            >
              <Icon name={isSidebarCollapsed ? "chevron_right" : "chevron_left"} size={20} />
            </button>
          </div>
          {!isSidebarCollapsed && (
            <div className="ds-sidebar__header-info">
              <span className="ds-sidebar__title">Design System</span>
              <span className="ds-sidebar__version">v2.0</span>
            </div>
          )}
        </div>
        
        <div className="ds-sidebar__search">
          <Icon name="search" size={18} />
          {!isSidebarCollapsed && (
            <input 
              type="text" 
              placeholder="Search tokens..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          )}
        </div>

        <ul className="ds-sidebar__nav">
          {sections.map((section) => (
            <li key={section.id}>
              <button
                className={`ds-sidebar__nav-item ${activeSection === section.id ? 'ds-sidebar__nav-item--active' : ''}`}
                onClick={() => scrollToSection(section.id)}
                title={isSidebarCollapsed ? section.title : undefined}
              >
                <Icon name={section.icon} size={20} />
                {!isSidebarCollapsed && <span>{section.title}</span>}
              </button>
            </li>
          ))}
        </ul>

        <div className="ds-sidebar__footer">
          <a href="/documentation" className="ds-sidebar__link" title={isSidebarCollapsed ? "Full Documentation" : undefined}>
            <Icon name="description" size={18} />
            {!isSidebarCollapsed && "Full Documentation"}
          </a>
        </div>
      </nav>

      {/* Main Content */}
      <main className={`ds-main ${isSidebarCollapsed ? 'ds-main--collapsed' : ''}`}>
        <header className="ds-header">
          <div className="ds-header__content">
            <h1 className="ds-header__title">Design System</h1>
            <p className="ds-header__subtitle">
              Comprehensive design tokens and components for building consistent MotorTrend experiences.
            </p>
          </div>
          <div className="ds-header__stats">
            <div className="ds-header__stat">
              <span className="ds-header__stat-value">50+</span>
              <span className="ds-header__stat-label">Color Tokens</span>
            </div>
            <div className="ds-header__stat">
              <span className="ds-header__stat-value">24</span>
              <span className="ds-header__stat-label">Spacing Tokens</span>
            </div>
            <div className="ds-header__stat">
              <span className="ds-header__stat-value">12</span>
              <span className="ds-header__stat-label">Components</span>
            </div>
          </div>
        </header>

        {/* Colors Section */}
        <section 
          id="colors" 
          className="ds-section"
          ref={(el) => { sectionRefs.current['colors'] = el; }}
        >
          <div className="ds-section__header">
            <div className="ds-section__icon">
              <Icon name="palette" size={24} />
            </div>
            <div>
              <h2 className="ds-section__title">Colors</h2>
              <p className="ds-section__description">
                Core color palette with semantic meaning and accessibility built-in.
              </p>
            </div>
          </div>

          <div className="ds-subsection">
            <h3 className="ds-subsection__title">
              <span className="ds-subsection__badge">Primary</span>
              Brand Color
            </h3>
            <div className="ds-color-hero">
              <div className="ds-color-hero__swatch" style={{ backgroundColor: 'var(--color-primary-1)' }}>
                <span className="ds-color-hero__name">MotorTrend Red</span>
                <span className="ds-color-hero__value">#E90C17</span>
              </div>
              <div className="ds-color-hero__info">
                <code>var(--color-primary-1)</code>
                <p>Primary brand color used for CTAs, links, and key interactive elements.</p>
              </div>
            </div>
          </div>

          <div className="ds-subsection">
            <h3 className="ds-subsection__title">
              <span className="ds-subsection__badge">Neutrals</span>
              Grayscale Palette
            </h3>
            <div className="ds-color-grid">
              {neutralColors.map((color) => (
                <ColorSwatch 
                  key={color.var}
                  name={color.name}
                  variable={color.var}
                  value={color.value}
                  usage={color.usage}
                  isDark={['--color-neutrals-1', '--color-neutrals-2', '--color-neutrals-3'].includes(color.var)}
                />
              ))}
            </div>
          </div>

          <div className="ds-subsection">
            <h3 className="ds-subsection__title">
              <span className="ds-subsection__badge">Semantic</span>
              Status Colors
            </h3>
            <div className="ds-color-grid ds-color-grid--compact">
              {semanticColors.map((color) => (
                <ColorSwatch 
                  key={color.var}
                  name={color.name}
                  variable={color.var}
                  value={color.value}
                />
              ))}
            </div>
          </div>
        </section>

        {/* Typography Section */}
        <section 
          id="typography" 
          className="ds-section"
          ref={(el) => { sectionRefs.current['typography'] = el; }}
        >
          <div className="ds-section__header">
            <div className="ds-section__icon">
              <Icon name="text_fields" size={24} />
            </div>
            <div>
              <h2 className="ds-section__title">Typography</h2>
              <p className="ds-section__description">
                Font families and text styles for consistent visual hierarchy.
              </p>
            </div>
          </div>

          <div className="ds-subsection">
            <h3 className="ds-subsection__title">Font Families</h3>
            <div className="ds-font-showcase">
              <div className="ds-font-card">
                <span className="ds-font-card__label">Headings</span>
                <span className="ds-font-card__name" style={{ fontFamily: 'var(--font-heading)' }}>Poppins</span>
                <span className="ds-font-card__sample" style={{ fontFamily: 'var(--font-heading)', fontWeight: 600 }}>
                  The quick brown fox jumps
                </span>
                <code>var(--font-heading)</code>
              </div>
              <div className="ds-font-card">
                <span className="ds-font-card__label">Body</span>
                <span className="ds-font-card__name" style={{ fontFamily: 'var(--font-body)' }}>Geist</span>
                <span className="ds-font-card__sample" style={{ fontFamily: 'var(--font-body)' }}>
                  The quick brown fox jumps
                </span>
                <code>var(--font-body)</code>
              </div>
            </div>
          </div>

          <div className="ds-subsection">
            <h3 className="ds-subsection__title">Type Scale</h3>
            <div className="ds-type-scale">
              <div className="ds-type-item">
                <span className="ds-type-item__label">Hero</span>
                <span className="ds-type-item__preview" style={{ fontFamily: 'var(--font-heading)', fontSize: '48px', fontWeight: 600, lineHeight: 1.1 }}>
                  Hero Text
                </span>
                <span className="ds-type-item__specs">48px / Bold / Poppins</span>
              </div>
              <div className="ds-type-item">
                <span className="ds-type-item__label">H1</span>
                <span className="ds-type-item__preview" style={{ fontFamily: 'var(--font-heading)', fontSize: '36px', fontWeight: 600, lineHeight: 1.2 }}>
                  Heading One
                </span>
                <span className="ds-type-item__specs">36px / Bold / Poppins</span>
              </div>
              <div className="ds-type-item">
                <span className="ds-type-item__label">H2</span>
                <span className="ds-type-item__preview" style={{ fontFamily: 'var(--font-heading)', fontSize: '28px', fontWeight: 600, lineHeight: 1.2 }}>
                  Heading Two
                </span>
                <span className="ds-type-item__specs">28px / Bold / Poppins</span>
              </div>
              <div className="ds-type-item">
                <span className="ds-type-item__label">H3</span>
                <span className="ds-type-item__preview" style={{ fontFamily: 'var(--font-heading)', fontSize: '24px', fontWeight: 600, lineHeight: 1.3 }}>
                  Heading Three
                </span>
                <span className="ds-type-item__specs">24px / Bold / Poppins</span>
              </div>
              <div className="ds-type-item">
                <span className="ds-type-item__label">Body</span>
                <span className="ds-type-item__preview" style={{ fontFamily: 'var(--font-body)', fontSize: '16px', fontWeight: 400, lineHeight: 1.5 }}>
                  Body text for paragraphs and content areas.
                </span>
                <span className="ds-type-item__specs">16px / Regular / Geist</span>
              </div>
              <div className="ds-type-item">
                <span className="ds-type-item__label">Caption</span>
                <span className="ds-type-item__preview" style={{ fontFamily: 'var(--font-body)', fontSize: '14px', fontWeight: 400, lineHeight: 1.4, color: 'var(--color-neutrals-4)' }}>
                  Caption text for metadata and labels
                </span>
                <span className="ds-type-item__specs">14px / Regular / Geist</span>
              </div>
            </div>
          </div>
        </section>

        {/* Spacing Section */}
        <section 
          id="spacing" 
          className="ds-section"
          ref={(el) => { sectionRefs.current['spacing'] = el; }}
        >
          <div className="ds-section__header">
            <div className="ds-section__icon">
              <Icon name="space_bar" size={24} />
            </div>
            <div>
              <h2 className="ds-section__title">Spacing</h2>
              <p className="ds-section__description">
                Consistent spacing scale based on 8px grid system.
              </p>
            </div>
          </div>

          <div className="ds-subsection">
            <h3 className="ds-subsection__title">Base Scale</h3>
            <div className="ds-spacing-grid">
              {spacingTokens.map((token) => (
                <TokenCard
                  key={token.var}
                  name={token.name}
                  variable={token.var}
                  value={token.value}
                  preview={
                    <div 
                      className="ds-spacing-preview"
                      style={{ 
                        width: token.value, 
                        height: token.value,
                        backgroundColor: 'var(--color-primary-1)',
                        borderRadius: '4px'
                      }}
                    />
                  }
                />
              ))}
            </div>
          </div>
        </section>

        {/* Effects Section */}
        <section 
          id="effects" 
          className="ds-section"
          ref={(el) => { sectionRefs.current['effects'] = el; }}
        >
          <div className="ds-section__header">
            <div className="ds-section__icon">
              <Icon name="auto_awesome" size={24} />
            </div>
            <div>
              <h2 className="ds-section__title">Effects</h2>
              <p className="ds-section__description">
                Border radius, shadows, and transitions for depth and motion.
              </p>
            </div>
          </div>

          <div className="ds-subsection">
            <h3 className="ds-subsection__title">Border Radius</h3>
            <div className="ds-effects-grid">
              {radiusTokens.map((token) => (
                <TokenCard
                  key={token.var}
                  name={token.name}
                  variable={token.var}
                  value={token.value}
                  preview={
                    <div 
                      className="ds-radius-preview"
                      style={{ borderRadius: `var(${token.var})` }}
                    />
                  }
                />
              ))}
            </div>
          </div>

          <div className="ds-subsection">
            <h3 className="ds-subsection__title">Shadows</h3>
            <div className="ds-effects-grid">
              {shadowTokens.map((token) => (
                <TokenCard
                  key={token.var}
                  name={token.name}
                  variable={token.var}
                  value={token.value}
                  preview={
                    <div 
                      className="ds-shadow-preview"
                      style={{ boxShadow: `var(${token.var})` }}
                    />
                  }
                />
              ))}
            </div>
          </div>

          <div className="ds-subsection">
            <h3 className="ds-subsection__title">Transitions</h3>
            <div className="ds-transitions">
              <div className="ds-transition-demo">
                <div className="ds-transition-demo__box ds-transition-demo__box--fast">Fast</div>
                <code>var(--transition-fast)</code>
                <span>150ms</span>
              </div>
              <div className="ds-transition-demo">
                <div className="ds-transition-demo__box ds-transition-demo__box--normal">Normal</div>
                <code>var(--transition-normal)</code>
                <span>250ms</span>
              </div>
              <div className="ds-transition-demo">
                <div className="ds-transition-demo__box ds-transition-demo__box--slow">Slow</div>
                <code>var(--transition-slow)</code>
                <span>350ms</span>
              </div>
            </div>
          </div>
        </section>

        {/* Buttons Section */}
        <section 
          id="buttons" 
          className="ds-section"
          ref={(el) => { sectionRefs.current['buttons'] = el; }}
        >
          <div className="ds-section__header">
            <div className="ds-section__icon">
              <Icon name="smart_button" size={24} />
            </div>
            <div>
              <h2 className="ds-section__title">Buttons</h2>
              <p className="ds-section__description">
                Call-to-action buttons with multiple variants and sizes.
              </p>
            </div>
          </div>

          <div className="ds-subsection">
            <h3 className="ds-subsection__title">Sizes</h3>
            <div className="ds-button-showcase">
              <div className="ds-button-row">
                <button className="cta cta--primary cta--small">Small</button>
                <button className="cta cta--primary cta--default">Default</button>
                <button className="cta cta--primary cta--large">Large</button>
              </div>
              <div className="ds-button-code">
                <code>cta cta--primary cta--[size]</code>
              </div>
            </div>
          </div>

          <div className="ds-subsection">
            <h3 className="ds-subsection__title">Variants</h3>
            <div className="ds-button-variants">
              <div className="ds-button-variant">
                <button className="cta cta--primary cta--default">Primary</button>
                <span>Main actions</span>
              </div>
              <div className="ds-button-variant">
                <button className="cta cta--secondary cta--default">Secondary</button>
                <span>Secondary actions</span>
              </div>
              <div className="ds-button-variant">
                <button className="cta cta--ghost cta--default">Ghost</button>
                <span>Tertiary actions</span>
              </div>
              <div className="ds-button-variant">
                <button className="cta cta--outline cta--default">Outline</button>
                <span>Bordered style</span>
              </div>
              <div className="ds-button-variant">
                <button className="cta cta--success cta--default">Success</button>
                <span>Positive actions</span>
              </div>
              <div className="ds-button-variant">
                <button className="cta cta--warning cta--default">Warning</button>
                <span>Caution actions</span>
              </div>
            </div>
          </div>

          <div className="ds-subsection">
            <h3 className="ds-subsection__title">States</h3>
            <div className="ds-button-states">
              <div className="ds-button-state">
                <button className="cta cta--primary cta--default">Default</button>
              </div>
              <div className="ds-button-state">
                <button className="cta cta--primary cta--default" style={{ opacity: 0.8 }}>Hover</button>
              </div>
              <div className="ds-button-state">
                <button className="cta cta--primary cta--default" disabled>Disabled</button>
              </div>
            </div>
          </div>
        </section>

        {/* Forms Section */}
        <section 
          id="forms" 
          className="ds-section"
          ref={(el) => { sectionRefs.current['forms'] = el; }}
        >
          <div className="ds-section__header">
            <div className="ds-section__icon">
              <Icon name="input" size={24} />
            </div>
            <div>
              <h2 className="ds-section__title">Form Components</h2>
              <p className="ds-section__description">
                Input fields and form elements for user interaction.
              </p>
            </div>
          </div>

          <div className="ds-subsection">
            <h3 className="ds-subsection__title">Text Fields</h3>
            <div className="ds-form-grid">
              <div className="ds-form-example">
                <TextField 
                  label="Default" 
                  placeholder="Enter text..."
                />
                <span className="ds-form-example__label">Default state</span>
              </div>
              <div className="ds-form-example">
                <TextField 
                  label="With Value" 
                  placeholder="Enter text..."
                  value="Sample input"
                  onChange={() => {}}
                />
                <span className="ds-form-example__label">Filled state</span>
              </div>
              <div className="ds-form-example">
                <TextField 
                  label="Error State" 
                  placeholder="Enter text..."
                  error="This field is required"
                />
                <span className="ds-form-example__label">Error state</span>
              </div>
              <div className="ds-form-example">
                <TextField 
                  label="Disabled" 
                  placeholder="Cannot edit"
                  disabled
                />
                <span className="ds-form-example__label">Disabled state</span>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default DesignSystemReference;
