/**
 * Atomic Design Audit Page
 * Interactive component library with live previews
 */

import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import Icon from '../../components/Icon';
import { Badge, TextField, CardShell, Tooltip } from '../../design-system/components';
import Card from '../../components/Card';
import { ArticleCard } from '../../components/ArticleCard';
import { HorizontalCard } from '../../components/HorizontalCard';
import { VerticalCard } from '../../components/VerticalCard';
import { VideoCard } from '../../components/VideoCard';
import { HeroCard } from '../../components/HeroCard';
import { CollapsibleSection } from '../../components/CollapsibleSection';
import { EditableField } from '../../components/EditableField';
import { EmptyVehiclesCard } from '../../components/EmptyVehiclesCard';
import { ConnectedAccount } from '../../components/ConnectedAccount';
import { ProfileCompletionCard } from '../../components/ProfileCompletionCard';
import { SubscriptionItem } from '../../components/SubscriptionItem';
import { AdContainer } from '../../components/AdContainer';
import { ArticleReactions } from '../../components/ArticleReactions';
import { LocationAutocomplete } from '../../components/LocationAutocomplete';
import { VehicleSearch } from '../../components/VehicleSearch';
import { ProfileBanner } from '../../components/ProfileBanner';
import GlobalHeader from '../../components/GlobalHeader';
import GlobalFooter from '../../components/GlobalFooter';
import StickyRateBar from '../../components/StickyRateBar';
import { AIInsights } from '../../components/AIInsights';
import { TopTenCarousel } from '../../components/TopTenCarousel';
import { MembershipCard } from '../../components/MembershipCard';
import { BaTAuctionCard } from '../../components/BaTAuctionCard/BaTAuctionCard';
import { KnowYourBudget } from '../../components/KnowYourBudget';
import './AtomicDesignAudit.css';

interface Section {
  id: string;
  title: string;
  icon: string;
}

const sections: Section[] = [
  { id: 'overview', title: 'Overview', icon: 'dashboard' },
  { id: 'atoms', title: 'Atoms', icon: 'circle' },
  { id: 'molecules', title: 'Molecules', icon: 'workspaces' },
  { id: 'organisms', title: 'Organisms', icon: 'grid_view' },
  { id: 'integrations', title: 'Integrations', icon: 'extension' },
];

const AtomicDesignAudit: React.FC = () => {
  const [activeSection, setActiveSection] = useState('overview');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const sectionRefs = useRef<Record<string, HTMLElement | null>>({});
  const titleRefs = useRef<Record<string, HTMLElement | null>>({});

  // Demo states
  const [textFieldValue, setTextFieldValue] = useState('');
  const [editableValue, setEditableValue] = useState('Click to edit');

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

  // Force white color on all section titles - using direct style manipulation
  useEffect(() => {
    // Use setTimeout to ensure DOM is fully rendered
    const timer = setTimeout(() => {
      Object.values(titleRefs.current).forEach((titleEl) => {
        if (titleEl) {
          titleEl.style.color = '#FFFFFF';
          titleEl.style.setProperty('color', '#FFFFFF', 'important');
          // Also try webkit text fill color
          (titleEl.style as any).webkitTextFillColor = '#FFFFFF';
        }
      });
      
      // Also target all h2.audit-section__title elements directly
      const allTitles = document.querySelectorAll('h2.audit-section__title');
      allTitles.forEach((title) => {
        (title as HTMLElement).style.color = '#FFFFFF';
        (title as HTMLElement).style.setProperty('color', '#FFFFFF', 'important');
      });
    }, 100);
    
    return () => clearTimeout(timer);
  }, []);

  const scrollToSection = (id: string) => {
    const element = sectionRefs.current[id];
    if (element) {
      const offset = 80;
      const top = element.offsetTop - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  };

  // Sample data for components - using reliable placeholder image
  const sampleImage = 'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=800&q=80';

  return (
    <div className="audit-page">
      {/* Sidebar */}
      <nav className={`audit-sidebar ${isSidebarCollapsed ? 'audit-sidebar--collapsed' : ''}`}>
        <div className="audit-sidebar__header">
          <div className="audit-sidebar__header-top">
            <div className="audit-sidebar__logo">
              <Icon name="architecture" size={32} />
            </div>
            <button 
              className="audit-sidebar__toggle"
              onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
              aria-label={isSidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            >
              <Icon name={isSidebarCollapsed ? "chevron_right" : "chevron_left"} size={20} />
            </button>
          </div>
          {!isSidebarCollapsed && (
            <div className="audit-sidebar__header-info">
              <span className="audit-sidebar__title">Component Library</span>
              <span className="audit-sidebar__version">Storybook</span>
            </div>
          )}
        </div>
        
        <div className="audit-sidebar__search">
          <Icon name="search" size={18} />
          {!isSidebarCollapsed && (
            <input 
              type="text" 
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          )}
        </div>

        <ul className="audit-sidebar__nav">
          {sections.map((section) => (
            <li key={section.id}>
              <button
                className={`audit-sidebar__nav-item ${activeSection === section.id ? 'audit-sidebar__nav-item--active' : ''}`}
                onClick={() => scrollToSection(section.id)}
                title={isSidebarCollapsed ? section.title : undefined}
              >
                <Icon name={section.icon} size={20} />
                {!isSidebarCollapsed && <span>{section.title}</span>}
              </button>
            </li>
          ))}
        </ul>

        <div className="audit-sidebar__footer">
          <Link to="/design-system" className="audit-sidebar__link" title={isSidebarCollapsed ? "Design System" : undefined}>
            <Icon name="palette" size={18} />
            {!isSidebarCollapsed && "Design System"}
          </Link>
        </div>
      </nav>

      {/* Main Content */}
      <main className={`audit-main ${isSidebarCollapsed ? 'audit-main--collapsed' : ''}`}>
        {/* Header */}
        <header className="audit-header">
          <div className="audit-header__content">
            <span className="audit-header__eyebrow">Interactive Preview</span>
            <h1 className="audit-header__title">Component Library</h1>
            <p className="audit-header__subtitle">
              Live, interactive previews of all UI components. Test and explore each component in isolation.
            </p>
          </div>
        </header>

        {/* Overview Section */}
        <section 
          id="overview" 
          className="audit-section"
          ref={(el) => { sectionRefs.current['overview'] = el; }}
        >
          <div className="audit-section__header">
            <div className="audit-section__icon">
              <Icon name="dashboard" size={24} />
            </div>
            <div style={{ color: '#FFFFFF' }}>
              <h2 
                ref={(el) => { titleRefs.current['overview'] = el; }}
                className="audit-section__title" 
                style={{ color: '#FFFFFF', WebkitTextFillColor: '#FFFFFF' }}
              >
                Overview
              </h2>
              <p className="audit-section__description">
                Component architecture following atomic design methodology.
              </p>
            </div>
          </div>

          <div className="audit-levels">
            <div className="audit-level-card audit-level-card--atom">
              <div className="audit-level-card__header">
                <Icon name="circle" size={24} />
                <span className="audit-level-card__badge">10 components</span>
              </div>
              <h3 className="audit-level-card__title">Atoms</h3>
              <p className="audit-level-card__description">
                Basic building blocks: Icon, Badge, Button, TextField, CardShell, Tooltip, ModalShell, Popover, Toast, ScrollToTop
              </p>
            </div>

            <div className="audit-level-card audit-level-card--molecule">
              <div className="audit-level-card__header">
                <Icon name="workspaces" size={24} />
                <span className="audit-level-card__badge">27 components</span>
              </div>
              <h3 className="audit-level-card__title">Molecules</h3>
              <p className="audit-level-card__description">
                Composable groups: Cards, Form Controls, Tooltips, Badges, Reactions
              </p>
            </div>

            <div className="audit-level-card audit-level-card--organism">
              <div className="audit-level-card__header">
                <Icon name="grid_view" size={24} />
                <span className="audit-level-card__badge">29 components</span>
              </div>
              <h3 className="audit-level-card__title">Organisms</h3>
              <p className="audit-level-card__description">
                Page sections: Header, Footer, Carousels, Reviews, Modals, Sidebars, AI Features
              </p>
            </div>
          </div>
        </section>

        {/* ============ ATOMS SECTION ============ */}
        <section 
          id="atoms" 
          className="audit-section"
          ref={(el) => { sectionRefs.current['atoms'] = el; }}
        >
          <div className="audit-section__header">
            <div className="audit-section__icon audit-section__icon--atom">
              <Icon name="circle" size={24} />
            </div>
            <div style={{ color: '#FFFFFF' }}>
              <h2 
                ref={(el) => { titleRefs.current['atoms'] = el; }}
                className="audit-section__title" 
                style={{ color: '#FFFFFF', WebkitTextFillColor: '#FFFFFF' }}
              >
                Atoms
              </h2>
              <p className="audit-section__description">
                Foundational building blocks with no business logic.
              </p>
            </div>
          </div>

          {/* Icon */}
          <div className="audit-preview">
            <div className="audit-preview__header">
              <h3 className="audit-preview__title">Icon</h3>
              <code className="audit-preview__path">components/Icon</code>
            </div>
            <div className="audit-preview__canvas">
              <div className="audit-preview__row">
                <Icon name="home" size={24} />
                <Icon name="search" size={24} />
                <Icon name="settings" size={24} />
                <Icon name="favorite" size={24} />
                <Icon name="star" size={24} />
                <Icon name="check_circle" size={24} />
                <Icon name="warning" size={24} />
                <Icon name="info" size={24} />
              </div>
              <div className="audit-preview__row">
                <Icon name="home" size={16} />
                <Icon name="home" size={20} />
                <Icon name="home" size={24} />
                <Icon name="home" size={32} />
                <Icon name="home" size={40} />
              </div>
            </div>
            <div className="audit-preview__code">
              <code>{`<Icon name="home" size={24} />`}</code>
            </div>
          </div>

          {/* Badge */}
          <div className="audit-preview">
            <div className="audit-preview__header">
              <h3 className="audit-preview__title">Badge</h3>
              <code className="audit-preview__path">design-system/Badge</code>
            </div>
            <div className="audit-preview__canvas">
              <div className="audit-preview__row">
                <Badge variant="neutral">Neutral</Badge>
                <Badge variant="success">Success</Badge>
                <Badge variant="warning">Warning</Badge>
                <Badge variant="error">Error</Badge>
                <Badge variant="info">Info</Badge>
                <Badge variant="premium">Premium</Badge>
              </div>
              <div className="audit-preview__row">
                <Badge variant="success" size="sm">Small</Badge>
                <Badge variant="success" size="md">Medium</Badge>
                <Badge variant="success" size="lg">Large</Badge>
              </div>
            </div>
            <div className="audit-preview__code">
              <code>{`<Badge variant="success" size="md">Success</Badge>`}</code>
            </div>
          </div>

          {/* Button */}
          <div className="audit-preview">
            <div className="audit-preview__header">
              <h3 className="audit-preview__title">Button (CTA)</h3>
              <code className="audit-preview__path">design-system/Button</code>
            </div>
            <div className="audit-preview__canvas audit-preview__canvas--dark">
              <div className="audit-preview__row">
                <button className="cta cta--primary cta--small">Small</button>
                <button className="cta cta--primary cta--default">Default</button>
                <button className="cta cta--primary cta--large">Large</button>
              </div>
              <div className="audit-preview__row">
                <button className="cta cta--primary cta--default">Primary</button>
                <button className="cta cta--secondary cta--default">Secondary</button>
                <button className="cta cta--ghost cta--default">Ghost</button>
                <button className="cta cta--outline cta--default">Outline</button>
              </div>
              <div className="audit-preview__row">
                <button className="cta cta--success cta--default">Success</button>
                <button className="cta cta--warning cta--default">Warning</button>
                <button className="cta cta--primary cta--default" disabled>Disabled</button>
              </div>
            </div>
            <div className="audit-preview__code">
              <code>{`<button className="cta cta--primary cta--default">Button</button>`}</code>
            </div>
          </div>

          {/* TextField */}
          <div className="audit-preview">
            <div className="audit-preview__header">
              <h3 className="audit-preview__title">TextField</h3>
              <code className="audit-preview__path">design-system/TextField</code>
            </div>
            <div className="audit-preview__canvas audit-preview__canvas--light">
              <div className="audit-preview__grid-2">
                <TextField 
                  label="Default" 
                  placeholder="Enter text..."
                  value={textFieldValue}
                  onChange={(e) => setTextFieldValue(e.target.value)}
                />
                <TextField 
                  label="With Helper Text" 
                  placeholder="Enter email..."
                  helperText="We'll never share your email"
                />
                <TextField 
                  label="Error State" 
                  placeholder="Required field"
                  error="This field is required"
                />
                <TextField 
                  label="Disabled" 
                  placeholder="Cannot edit"
                  disabled
                />
              </div>
            </div>
            <div className="audit-preview__code">
              <code>{`<TextField label="Email" placeholder="Enter email..." />`}</code>
            </div>
          </div>

          {/* CardShell */}
          <div className="audit-preview">
            <div className="audit-preview__header">
              <h3 className="audit-preview__title">CardShell</h3>
              <code className="audit-preview__path">design-system/CardShell</code>
            </div>
            <div className="audit-preview__canvas audit-preview__canvas--light">
              <div className="audit-preview__grid-3">
                <CardShell padding="sm">
                  <p style={{ margin: 0 }}>Small padding</p>
                </CardShell>
                <CardShell padding="md">
                  <p style={{ margin: 0 }}>Medium padding</p>
                </CardShell>
                <CardShell padding="lg" hasHover>
                  <p style={{ margin: 0 }}>Large + Hoverable</p>
                </CardShell>
              </div>
            </div>
            <div className="audit-preview__code">
              <code>{`<CardShell padding="md" hoverable>Content</CardShell>`}</code>
            </div>
          </div>

          {/* Tooltip */}
          <div className="audit-preview">
            <div className="audit-preview__header">
              <h3 className="audit-preview__title">Tooltip</h3>
              <code className="audit-preview__path">design-system/Tooltip</code>
            </div>
            <div className="audit-preview__canvas">
              <div className="audit-preview__row" style={{ gap: '48px' }}>
                <Tooltip content="Tooltip on top" placement="top">
                  <button className="cta cta--secondary cta--small">Top</button>
                </Tooltip>
                <Tooltip content="Tooltip on bottom" placement="bottom">
                  <button className="cta cta--secondary cta--small">Bottom</button>
                </Tooltip>
                <Tooltip content="Tooltip on left" placement="left">
                  <button className="cta cta--secondary cta--small">Left</button>
                </Tooltip>
                <Tooltip content="Tooltip on right" placement="right">
                  <button className="cta cta--secondary cta--small">Right</button>
                </Tooltip>
              </div>
            </div>
            <div className="audit-preview__code">
              <code>{`<Tooltip content="Help text" placement="top">Hover me</Tooltip>`}</code>
            </div>
          </div>

          {/* ModalShell */}
          <div className="audit-preview">
            <div className="audit-preview__header">
              <h3 className="audit-preview__title">ModalShell</h3>
              <code className="audit-preview__path">components/atoms/ModalShell</code>
            </div>
            <div className="audit-preview__canvas audit-preview__canvas--dark">
              <div className="audit-preview__info">
                <Icon name="info" size={20} />
                <span>ModalShell is a wrapper component for modals with overlay, animations, and escape key handling. See RatingModal, SavedModal, WriteReviewModal for usage examples.</span>
              </div>
            </div>
            <div className="audit-preview__code">
              <code>{`<ModalShell isOpen={true} onClose={handleClose} maxWidth="500px">Content</ModalShell>`}</code>
            </div>
          </div>

          {/* Popover */}
          <div className="audit-preview">
            <div className="audit-preview__header">
              <h3 className="audit-preview__title">Popover</h3>
              <code className="audit-preview__path">components/atoms/Popover</code>
            </div>
            <div className="audit-preview__canvas audit-preview__canvas--dark">
              <div className="audit-preview__info">
                <Icon name="info" size={20} />
                <span>Popover provides floating content anchored to a trigger element. Supports multiple placements and click-outside dismissal.</span>
              </div>
            </div>
            <div className="audit-preview__code">
              <code>{`<Popover trigger={<button>Click</button>} placement="bottom">Content</Popover>`}</code>
            </div>
          </div>

          {/* Toast */}
          <div className="audit-preview">
            <div className="audit-preview__header">
              <h3 className="audit-preview__title">Toast</h3>
              <code className="audit-preview__path">components/Toast</code>
            </div>
            <div className="audit-preview__canvas audit-preview__canvas--light">
              <div className="audit-preview__row" style={{ flexDirection: 'column', gap: '12px', alignItems: 'stretch' }}>
                <div style={{ padding: '12px 16px', borderRadius: 'var(--border-radius-md, 8px)', background: 'var(--color-semantic-success-light, #E8F5E9)', border: '1px solid var(--color-semantic-success, #34A853)', display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <Icon name="check_circle" size={20} style={{ color: 'var(--color-semantic-success, #34A853)' }} />
                  <span style={{ color: 'var(--color-neutrals-1, #141416)' }}>Success toast message</span>
                </div>
                <div style={{ padding: '12px 16px', borderRadius: 'var(--border-radius-md, 8px)', background: 'var(--color-semantic-error-light, #FEF2F2)', border: '1px solid var(--color-semantic-error, #DC2626)', display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <Icon name="error" size={20} style={{ color: 'var(--color-semantic-error, #DC2626)' }} />
                  <span style={{ color: 'var(--color-neutrals-1, #141416)' }}>Error toast message</span>
                </div>
              </div>
            </div>
            <div className="audit-preview__code">
              <code>{`<Toast type="success" message="Saved!" onClose={handleClose} />`}</code>
            </div>
          </div>

          {/* ScrollToTop */}
          <div className="audit-preview">
            <div className="audit-preview__header">
              <h3 className="audit-preview__title">ScrollToTop</h3>
              <code className="audit-preview__path">components/ScrollToTop</code>
            </div>
            <div className="audit-preview__canvas audit-preview__canvas--dark">
              <div className="audit-preview__info">
                <Icon name="info" size={20} />
                <span>Utility component that scrolls to top on route changes. Used in App.tsx to ensure pages start at the top.</span>
              </div>
            </div>
            <div className="audit-preview__code">
              <code>{`<ScrollToTop /> {/* Place in router */}`}</code>
            </div>
          </div>
        </section>

        {/* ============ MOLECULES SECTION ============ */}
        <section 
          id="molecules" 
          className="audit-section"
          ref={(el) => { sectionRefs.current['molecules'] = el; }}
        >
          <div className="audit-section__header">
            <div className="audit-section__icon audit-section__icon--molecule">
              <Icon name="workspaces" size={24} />
            </div>
            <div style={{ color: '#FFFFFF' }}>
              <h2 
                ref={(el) => { titleRefs.current['molecules'] = el; }}
                className="audit-section__title" 
                style={{ color: '#FFFFFF', WebkitTextFillColor: '#FFFFFF' }}
              >
                Molecules
              </h2>
              <p className="audit-section__description">
                Composable groups combining atoms into reusable components.
              </p>
            </div>
          </div>

          {/* Card (Vehicle) */}
          <div className="audit-preview">
            <div className="audit-preview__header">
              <h3 className="audit-preview__title">Card</h3>
              <code className="audit-preview__path">components/Card</code>
            </div>
            <div className="audit-preview__canvas audit-preview__canvas--light">
              <div className="audit-preview__grid-3">
                <Card
                  title="2024 Toyota Camry"
                  subtitle="Sedan"
                  image={sampleImage}
                  metadata="$28,400 - $35,600"
                  ratings={[
                    { value: 8.5, color: '#E90C17' },
                    { value: 8.2, color: '#FFB800' }
                  ]}
                />
              </div>
            </div>
            <div className="audit-preview__code">
              <code>{`<Card title="2024 Toyota Camry" image="..." ratings={[...]} />`}</code>
            </div>
          </div>

          {/* ArticleCard */}
          <div className="audit-preview">
            <div className="audit-preview__header">
              <h3 className="audit-preview__title">ArticleCard</h3>
              <code className="audit-preview__path">components/ArticleCard</code>
            </div>
            <div className="audit-preview__canvas audit-preview__canvas--light">
              <div className="audit-preview__grid-3">
                <ArticleCard
                  title="2024 Toyota Camry First Drive Review"
                  author="MotorTrend Staff"
                  date="Nov 29, 2024"
                  imageUrl={sampleImage}
                />
              </div>
            </div>
            <div className="audit-preview__code">
              <code>{`<ArticleCard title="..." author="..." imageUrl="..." />`}</code>
            </div>
          </div>

          {/* HorizontalCard */}
          <div className="audit-preview">
            <div className="audit-preview__header">
              <h3 className="audit-preview__title">HorizontalCard</h3>
              <code className="audit-preview__path">components/HorizontalCard</code>
            </div>
            <div className="audit-preview__canvas audit-preview__canvas--light">
              <div style={{ maxWidth: '500px' }}>
                <HorizontalCard
                  title="2024 Toyota Camry First Drive Review"
                  author="MotorTrend Staff"
                  date="Nov 29, 2024"
                  imageUrl={sampleImage}
                  category="First Drive"
                />
              </div>
            </div>
            <div className="audit-preview__code">
              <code>{`<HorizontalCard title="..." imageUrl="..." category="..." />`}</code>
            </div>
          </div>

          {/* VerticalCard */}
          <div className="audit-preview">
            <div className="audit-preview__header">
              <h3 className="audit-preview__title">VerticalCard</h3>
              <code className="audit-preview__path">components/VerticalCard</code>
            </div>
            <div className="audit-preview__canvas audit-preview__canvas--light">
              <div className="audit-preview__grid-3">
                <VerticalCard
                  title="2024 Toyota Camry First Drive"
                  imageUrl={sampleImage}
                  type="Video"
                />
                <VerticalCard
                  title="Best Sedans of 2024"
                  imageUrl={sampleImage}
                  type="Article"
                />
              </div>
            </div>
            <div className="audit-preview__code">
              <code>{`<VerticalCard title="..." imageUrl="..." type="Video" />`}</code>
            </div>
          </div>

          {/* VideoCard */}
          <div className="audit-preview">
            <div className="audit-preview__header">
              <h3 className="audit-preview__title">VideoCard</h3>
              <code className="audit-preview__path">components/VideoCard</code>
            </div>
            <div className="audit-preview__canvas audit-preview__canvas--light">
              <div className="audit-preview__grid-3">
                <VideoCard
                  title="2024 Camry Road Test"
                  image={sampleImage}
                  author="MotorTrend Staff"
                  date="Nov 29, 2024"
                />
              </div>
            </div>
            <div className="audit-preview__code">
              <code>{`<VideoCard title="..." image="..." author="..." date="..." />`}</code>
            </div>
          </div>

          {/* HeroCard */}
          <div className="audit-preview">
            <div className="audit-preview__header">
              <h3 className="audit-preview__title">HeroCard</h3>
              <code className="audit-preview__path">components/HeroCard</code>
            </div>
            <div className="audit-preview__canvas audit-preview__canvas--light">
              <HeroCard
                title="2024 Toyota Camry First Drive Review"
                imageUrl={sampleImage}
              />
            </div>
            <div className="audit-preview__code">
              <code>{`<HeroCard title="..." imageUrl="..." />`}</code>
            </div>
          </div>

          {/* CollapsibleSection */}
          <div className="audit-preview">
            <div className="audit-preview__header">
              <h3 className="audit-preview__title">CollapsibleSection</h3>
              <code className="audit-preview__path">components/CollapsibleSection</code>
            </div>
            <div className="audit-preview__canvas audit-preview__canvas--light">
              <div style={{ maxWidth: '500px' }}>
                <CollapsibleSection title="Expandable Section" defaultOpen>
                  <p>This content can be collapsed or expanded by clicking the header. Great for FAQs and detailed information sections.</p>
                </CollapsibleSection>
                <CollapsibleSection title="Another Section">
                  <p>More collapsible content here.</p>
                </CollapsibleSection>
              </div>
            </div>
            <div className="audit-preview__code">
              <code>{`<CollapsibleSection title="FAQ">Content</CollapsibleSection>`}</code>
            </div>
          </div>

          {/* EditableField */}
          <div className="audit-preview">
            <div className="audit-preview__header">
              <h3 className="audit-preview__title">EditableField</h3>
              <code className="audit-preview__path">components/EditableField</code>
            </div>
            <div className="audit-preview__canvas audit-preview__canvas--light">
              <div style={{ maxWidth: '400px' }}>
                <EditableField
                  label="Display Name"
                  value={editableValue}
                  onSave={(val) => setEditableValue(val)}
                />
              </div>
            </div>
            <div className="audit-preview__code">
              <code>{`<EditableField label="Name" value="..." onSave={...} />`}</code>
            </div>
          </div>

          {/* EmptyVehiclesCard */}
          <div className="audit-preview">
            <div className="audit-preview__header">
              <h3 className="audit-preview__title">EmptyVehiclesCard</h3>
              <code className="audit-preview__path">components/EmptyVehiclesCard</code>
            </div>
            <div className="audit-preview__canvas audit-preview__canvas--light">
              <EmptyVehiclesCard />
            </div>
            <div className="audit-preview__code">
              <code>{`<EmptyVehiclesCard onVehicleSelect={...} />`}</code>
            </div>
          </div>

          {/* ConnectedAccount */}
          <div className="audit-preview">
            <div className="audit-preview__header">
              <h3 className="audit-preview__title">ConnectedAccount</h3>
              <code className="audit-preview__path">components/ConnectedAccount</code>
            </div>
            <div className="audit-preview__canvas audit-preview__canvas--light">
              <div style={{ maxWidth: '400px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <ConnectedAccount provider="google" accountName="user@gmail.com" isConnected={true} />
                <ConnectedAccount provider="facebook" isConnected={false} />
                <ConnectedAccount provider="apple" accountName="user@icloud.com" isConnected={true} />
              </div>
            </div>
            <div className="audit-preview__code">
              <code>{`<ConnectedAccount provider="google" isConnected />`}</code>
            </div>
          </div>

          {/* ProfileCompletionCard */}
          <div className="audit-preview">
            <div className="audit-preview__header">
              <h3 className="audit-preview__title">ProfileCompletionCard</h3>
              <code className="audit-preview__path">components/ProfileCompletionCard</code>
            </div>
            <div className="audit-preview__canvas audit-preview__canvas--light">
              <div style={{ maxWidth: '400px' }}>
                <ProfileCompletionCard />
              </div>
            </div>
            <div className="audit-preview__code">
              <code>{`<ProfileCompletionCard onUpdateStep1={...} />`}</code>
            </div>
          </div>

          {/* SubscriptionItem */}
          <div className="audit-preview">
            <div className="audit-preview__header">
              <h3 className="audit-preview__title">SubscriptionItem</h3>
              <code className="audit-preview__path">components/SubscriptionItem</code>
            </div>
            <div className="audit-preview__canvas audit-preview__canvas--light">
              <div style={{ maxWidth: '400px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <SubscriptionItem name="MotorTrend Newsletter" isActive={true} />
                <SubscriptionItem name="Deal Alerts" isActive={false} />
              </div>
            </div>
            <div className="audit-preview__code">
              <code>{`<SubscriptionItem name="..." isActive={true} />`}</code>
            </div>
          </div>

          {/* MembershipCard */}
          <div className="audit-preview">
            <div className="audit-preview__header">
              <h3 className="audit-preview__title">MembershipCard</h3>
              <code className="audit-preview__path">components/MembershipCard</code>
            </div>
            <div className="audit-preview__canvas">
              <div style={{ maxWidth: '400px' }}>
                <MembershipCard
                  name="John Doe"
                  memberSince="Jan 2024"
                  car="2024 Toyota Camry"
                  newsletter="MotorTrend"
                />
              </div>
            </div>
            <div className="audit-preview__code">
              <code>{`<MembershipCard name="John Doe" memberSince="Jan 2024" />`}</code>
            </div>
          </div>

          {/* ArticleReactions */}
          <div className="audit-preview">
            <div className="audit-preview__header">
              <h3 className="audit-preview__title">ArticleReactions</h3>
              <code className="audit-preview__path">components/ArticleReactions</code>
            </div>
            <div className="audit-preview__canvas audit-preview__canvas--light">
              <ArticleReactions articleSlug="sample-article" />
            </div>
            <div className="audit-preview__code">
              <code>{`<ArticleReactions articleSlug="article-123" />`}</code>
            </div>
          </div>

          {/* LocationAutocomplete */}
          <div className="audit-preview">
            <div className="audit-preview__header">
              <h3 className="audit-preview__title">LocationAutocomplete</h3>
              <code className="audit-preview__path">components/LocationAutocomplete</code>
            </div>
            <div className="audit-preview__canvas audit-preview__canvas--light">
              <div style={{ maxWidth: '400px' }}>
                <LocationAutocomplete
                  value=""
                  onChange={() => {}}
                  placeholder="Enter your city..."
                />
              </div>
            </div>
            <div className="audit-preview__code">
              <code>{`<LocationAutocomplete value="..." onChange={...} />`}</code>
            </div>
          </div>

          {/* AdContainer */}
          <div className="audit-preview">
            <div className="audit-preview__header">
              <h3 className="audit-preview__title">AdContainer</h3>
              <code className="audit-preview__path">components/AdContainer</code>
            </div>
            <div className="audit-preview__canvas audit-preview__canvas--light">
              <AdContainer />
            </div>
            <div className="audit-preview__code">
              <code>{`<AdContainer />`}</code>
            </div>
          </div>
        </section>

        {/* ============ ORGANISMS SECTION ============ */}
        <section 
          id="organisms" 
          className="audit-section"
          ref={(el) => { sectionRefs.current['organisms'] = el; }}
        >
          <div className="audit-section__header">
            <div className="audit-section__icon audit-section__icon--organism">
              <Icon name="grid_view" size={24} />
            </div>
            <div style={{ color: '#FFFFFF' }}>
              <h2 
                ref={(el) => { titleRefs.current['organisms'] = el; }}
                className="audit-section__title" 
                style={{ color: '#FFFFFF', WebkitTextFillColor: '#FFFFFF' }}
              >
                Organisms
              </h2>
              <p className="audit-section__description">
                Page-level components with business logic and data flows.
              </p>
            </div>
          </div>

          {/* ProfileBanner */}
          <div className="audit-preview">
            <div className="audit-preview__header">
              <h3 className="audit-preview__title">ProfileBanner</h3>
              <code className="audit-preview__path">components/ProfileBanner</code>
            </div>
            <div className="audit-preview__canvas audit-preview__canvas--light">
              <ProfileBanner
                userName="John Doe"
                joinDate="January 2024"
                location="Los Angeles, CA"
              />
            </div>
            <div className="audit-preview__code">
              <code>{`<ProfileBanner userName="John Doe" joinDate="January 2024" />`}</code>
            </div>
          </div>

          {/* VehicleSearch */}
          <div className="audit-preview">
            <div className="audit-preview__header">
              <h3 className="audit-preview__title">VehicleSearch</h3>
              <code className="audit-preview__path">components/VehicleSearch</code>
            </div>
            <div className="audit-preview__canvas audit-preview__canvas--light">
              <div style={{ maxWidth: '500px' }}>
                <VehicleSearch
                  onVehicleSelect={(v) => alert(`Selected: ${v.name}`)}
                />
              </div>
            </div>
            <div className="audit-preview__code">
              <code>{`<VehicleSearch onVehicleSelect={...} />`}</code>
            </div>
          </div>

          {/* StickyRateBar */}
          <div className="audit-preview">
            <div className="audit-preview__header">
              <h3 className="audit-preview__title">StickyRateBar</h3>
              <code className="audit-preview__path">components/StickyRateBar</code>
            </div>
            <div className="audit-preview__canvas" style={{ position: 'relative', height: '80px' }}>
              <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0 }}>
                <StickyRateBar
                  vehicleName="2024 Toyota Camry"
                  isVisible={true}
                  ratings={[
                    { type: 'motortrend', value: 8.5, label: 'MotorTrend' },
                    { type: 'user-reviews', value: 8.2, label: 'User Reviews' }
                  ]}
                  ctaText="See Local Listings"
                  ctaOnClick={() => alert('CTA clicked!')}
                />
              </div>
            </div>
            <div className="audit-preview__code">
              <code>{`<StickyRateBar vehicleName="..." ratings={[...]} />`}</code>
            </div>
          </div>

          {/* TopTenCarousel */}
          <div className="audit-preview">
            <div className="audit-preview__header">
              <h3 className="audit-preview__title">TopTenCarousel</h3>
              <code className="audit-preview__path">components/TopTenCarousel</code>
            </div>
            <div className="audit-preview__canvas audit-preview__canvas--light">
              <TopTenCarousel />
            </div>
            <div className="audit-preview__code">
              <code>{`<TopTenCarousel />`}</code>
            </div>
          </div>

          {/* AIInsights */}
          <div className="audit-preview">
            <div className="audit-preview__header">
              <h3 className="audit-preview__title">AIInsights</h3>
              <code className="audit-preview__path">components/AIInsights</code>
            </div>
            <div className="audit-preview__canvas audit-preview__canvas--light">
              <AIInsights vehicleName="2024 Toyota Camry" />
            </div>
            <div className="audit-preview__code">
              <code>{`<AIInsights vehicleName="2024 Toyota Camry" />`}</code>
            </div>
          </div>

          {/* GlobalHeader */}
          <div className="audit-preview">
            <div className="audit-preview__header">
              <h3 className="audit-preview__title">GlobalHeader</h3>
              <code className="audit-preview__path">components/GlobalHeader</code>
            </div>
            <div className="audit-preview__canvas" style={{ overflow: 'hidden' }}>
              <div style={{ transform: 'scale(0.9)', transformOrigin: 'top left', width: '111%' }}>
                <GlobalHeader />
              </div>
            </div>
            <div className="audit-preview__code">
              <code>{`<GlobalHeader />`}</code>
            </div>
          </div>

          {/* GlobalFooter */}
          <div className="audit-preview">
            <div className="audit-preview__header">
              <h3 className="audit-preview__title">GlobalFooter</h3>
              <code className="audit-preview__path">components/GlobalFooter</code>
            </div>
            <div className="audit-preview__canvas" style={{ overflow: 'hidden' }}>
              <div style={{ transform: 'scale(0.85)', transformOrigin: 'top left', width: '118%' }}>
                <GlobalFooter />
              </div>
            </div>
            <div className="audit-preview__code">
              <code>{`<GlobalFooter />`}</code>
            </div>
          </div>

          {/* UserReviews */}
          <div className="audit-preview">
            <div className="audit-preview__header">
              <h3 className="audit-preview__title">UserReviews</h3>
              <code className="audit-preview__path">components/UserReviews</code>
            </div>
            <div className="audit-preview__canvas audit-preview__canvas--dark">
              <div className="audit-preview__info">
                <Icon name="info" size={20} />
                <span>Full-featured user reviews section with ratings, sorting, filtering, and review cards. Used on vehicle detail pages.</span>
              </div>
            </div>
            <div className="audit-preview__code">
              <code>{`<UserReviews vehicleName="2024 Toyota Camry" vehicleId="camry-2024" />`}</code>
            </div>
          </div>

          {/* PhotoGallery */}
          <div className="audit-preview">
            <div className="audit-preview__header">
              <h3 className="audit-preview__title">PhotoGallery</h3>
              <code className="audit-preview__path">components/PhotoGallery</code>
            </div>
            <div className="audit-preview__canvas audit-preview__canvas--dark">
              <div className="audit-preview__info">
                <Icon name="info" size={20} />
                <span>Interactive photo gallery with lightbox, thumbnails, and navigation. Supports multiple image sources.</span>
              </div>
            </div>
            <div className="audit-preview__code">
              <code>{`<PhotoGallery images={[...]} vehicleName="2024 BMW M3" />`}</code>
            </div>
          </div>

          {/* LocalListingsSidebar */}
          <div className="audit-preview">
            <div className="audit-preview__header">
              <h3 className="audit-preview__title">LocalListingsSidebar</h3>
              <code className="audit-preview__path">components/LocalListingsSidebar</code>
            </div>
            <div className="audit-preview__canvas audit-preview__canvas--dark">
              <div className="audit-preview__info">
                <Icon name="info" size={20} />
                <span>Displays local vehicle listings with dealer info, pricing, and contact options. Integrates with Marketcheck API.</span>
              </div>
            </div>
            <div className="audit-preview__code">
              <code>{`<LocalListingsSidebar vehicleData={{ make: 'Toyota', model: 'Camry' }} />`}</code>
            </div>
          </div>

          {/* AIPersonalAssistant */}
          <div className="audit-preview">
            <div className="audit-preview__header">
              <h3 className="audit-preview__title">AIPersonalAssistant</h3>
              <code className="audit-preview__path">components/AIPersonalAssistant</code>
            </div>
            <div className="audit-preview__canvas audit-preview__canvas--dark">
              <div className="audit-preview__info">
                <Icon name="info" size={20} />
                <span>AI-powered chat interface for vehicle recommendations, comparisons, and automotive questions.</span>
              </div>
            </div>
            <div className="audit-preview__code">
              <code>{`<AIPersonalAssistant />`}</code>
            </div>
          </div>

          {/* KnowYourBudget */}
          <div className="audit-preview">
            <div className="audit-preview__header">
              <h3 className="audit-preview__title">KnowYourBudget</h3>
              <code className="audit-preview__path">components/KnowYourBudget</code>
            </div>
            <div className="audit-preview__canvas audit-preview__canvas--light">
              <KnowYourBudget />
            </div>
            <div className="audit-preview__code">
              <code>{`<KnowYourBudget />`}</code>
            </div>
          </div>

          {/* VehicleLeadsStripe */}
          <div className="audit-preview">
            <div className="audit-preview__header">
              <h3 className="audit-preview__title">VehicleLeadsStripe</h3>
              <code className="audit-preview__path">components/VehicleLeadsStripe</code>
            </div>
            <div className="audit-preview__canvas audit-preview__canvas--dark">
              <div className="audit-preview__info">
                <Icon name="info" size={20} />
                <span>Horizontal scrolling stripe of vehicle listings with save/bookmark functionality. Features dealer info and pricing.</span>
              </div>
            </div>
            <div className="audit-preview__code">
              <code>{`<VehicleLeadsStripe make="Honda" model="Accord" />`}</code>
            </div>
          </div>

          {/* Modals Summary */}
          <div className="audit-preview">
            <div className="audit-preview__header">
              <h3 className="audit-preview__title">Modals</h3>
              <code className="audit-preview__path">RatingModal, SavedModal, WriteReviewModal, AvatarBannerModal</code>
            </div>
            <div className="audit-preview__canvas audit-preview__canvas--dark">
              <div className="audit-preview__info" style={{ flexDirection: 'column', alignItems: 'flex-start', gap: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Icon name="star" size={18} />
                  <span><strong>RatingModal</strong> - Star rating interface with review option</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Icon name="bookmark" size={18} />
                  <span><strong>SavedModal</strong> - View and manage saved vehicles</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Icon name="edit" size={18} />
                  <span><strong>WriteReviewModal</strong> - Full review composition interface</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Icon name="person" size={18} />
                  <span><strong>AvatarBannerModal</strong> - Profile customization</span>
                </div>
              </div>
            </div>
            <div className="audit-preview__code">
              <code>{`<RatingModal isOpen={true} vehicleName="..." onRate={...} />`}</code>
            </div>
          </div>

          {/* Community Components */}
          <div className="audit-preview">
            <div className="audit-preview__header">
              <h3 className="audit-preview__title">Community Components</h3>
              <code className="audit-preview__path">components/Community/*</code>
            </div>
            <div className="audit-preview__canvas audit-preview__canvas--dark">
              <div className="audit-preview__info" style={{ flexDirection: 'column', alignItems: 'flex-start', gap: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Icon name="forum" size={18} />
                  <span><strong>PostCard</strong> - Community post with votes and comments</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Icon name="comment" size={18} />
                  <span><strong>CommentSection</strong> - Threaded comment display</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Icon name="thumb_up" size={18} />
                  <span><strong>VoteControl</strong> - Upvote/downvote interaction</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Icon name="group" size={18} />
                  <span><strong>CommunitySidebar</strong> - Community navigation</span>
                </div>
              </div>
            </div>
            <div className="audit-preview__code">
              <code>{`<PostCard post={...} /> <CommentSection comments={[...]} />`}</code>
            </div>
          </div>
        </section>

        {/* ============ INTEGRATIONS SECTION ============ */}
        <section 
          id="integrations" 
          className="audit-section"
          ref={(el) => { sectionRefs.current['integrations'] = el; }}
        >
          <div className="audit-section__header">
            <div className="audit-section__icon audit-section__icon--organism">
              <Icon name="extension" size={24} />
            </div>
            <div>
              <h2 className="audit-section__title" style={{ color: '#FFFFFF' }}>Integrations</h2>
              <p className="audit-section__description">
                Third-party integration components (e.g. Bring a Trailer).
              </p>
            </div>
          </div>

          {/* BaTAuctionCard */}
          <div className="audit-preview">
            <div className="audit-preview__header">
              <h3 className="audit-preview__title">BaTAuctionCard</h3>
              <code className="audit-preview__path">components/BaTAuctionCard</code>
            </div>
            <div className="audit-preview__canvas audit-preview__canvas--light">
              <div className="audit-preview__grid-3">
                <BaTAuctionCard
                  image="https://images.unsplash.com/photo-1566576912902-199dfa3d1691?w=800&q=80"
                  title="1972 BMW 3.0CS 4-Speed"
                  currentBid={45000}
                  timeLeft="2 days"
                  location="Los Angeles, CA"
                  isNoReserve={true}
                  bidsCount={12}
                />
                <BaTAuctionCard
                  image="https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?w=800&q=80"
                  title="1994 Porsche 911 Turbo 3.6"
                  currentBid={250000}
                  timeLeft="4 hours"
                  location="Miami, FL"
                  isPremium={true}
                  bidsCount={45}
                />
                <BaTAuctionCard
                  image="https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800&q=80"
                  title="2020 Chevrolet Corvette Stingray Coupe 3LT Z51"
                  currentBid={72500}
                  timeLeft="Ended"
                  location="Austin, TX"
                  bidsCount={8}
                />
              </div>
            </div>
            <div className="audit-preview__code">
              <code>{`<BaTAuctionCard title="..." currentBid={45000} isNoReserve />`}</code>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default AtomicDesignAudit;
