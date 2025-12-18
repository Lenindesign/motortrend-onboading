/**
 * Dynamic Home Renderer
 * 
 * Renders home page sections dynamically based on Journey Builder configuration.
 * This component bridges the Journey Builder (admin tool) with the actual Home page.
 */

import React, { useState, useEffect, useMemo } from 'react';
import { HeroPlusThree } from '../HeroPlusThree';
import { NewsSection } from '../NewsSection';
import { VehiclesSection } from '../VehiclesSection';
import { TopTenCarousel } from '../TopTenCarousel/TopTenCarousel';
import { TopTenCarouselLeads } from '../TopTenCarouselLeads';
import { CommunityPostsPromo } from '../CommunityPostsPromo';
import { KnowYourBudget } from '../KnowYourBudget';
import { VehicleLeadsStripe } from '../VehicleLeadsStripe';
import { WhatIsMyCarWorth } from '../WhatIsMyCarWorth';
import { UserRatingsReviews } from '../UserRatingsReviews';
import { PersonalizedVehicles } from '../PersonalizedVehicles';
import { TrendingStories } from '../TrendingStories';
import { AdContainer } from '../AdContainer';
import {
  getCurrentLayoutAsync,
  resolveDynamicProps,
  getDebugInfo,
  type LayoutConfig,
  type SectionConfig,
} from '../../utils/experienceManager';

// Component type definitions
type LayoutType = 'full-width' | 'two-column';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyComponent = React.ComponentType<any>;

interface ComponentMapEntry {
  component: AnyComponent;
  type: LayoutType;
  defaultProps?: Record<string, unknown>;
}

// Map component IDs to actual React components
const COMPONENT_MAP: Record<string, ComponentMapEntry> = {
  TopTenCarouselLeads: {
    component: TopTenCarouselLeads,
    type: 'full-width',
    defaultProps: { initialVehicleType: 'SUV', initialSubcategory: 'All' },
  },
  TopTenCarousel: {
    component: TopTenCarousel,
    type: 'full-width',
    defaultProps: { initialVehicleType: 'SUV', initialSubcategory: 'All' },
  },
  VehicleLeadsStripe: {
    component: VehicleLeadsStripe,
    type: 'full-width',
  },
  HeroPlusThree: {
    component: HeroPlusThree,
    type: 'two-column',
    defaultProps: { title: 'Recommended For You' },
  },
  TrendingStories: {
    component: TrendingStories,
    type: 'full-width',
  },
  PersonalizedVehicles: {
    component: PersonalizedVehicles,
    type: 'full-width',
  },
  NewsSection: {
    component: NewsSection,
    type: 'two-column',
    defaultProps: { title: 'Latest Car News From our Experts', maxItems: 10 },
  },
  VehiclesSection: {
    component: VehiclesSection,
    type: 'two-column',
    defaultProps: { title: 'Top Ranked Vehicles' },
  },
  CommunityPostsPromo: {
    component: CommunityPostsPromo,
    type: 'two-column',
    defaultProps: { title: 'Trending in Community', maxPosts: 6 },
  },
  WhatIsMyCarWorth: {
    component: WhatIsMyCarWorth,
    type: 'full-width',
  },
  UserRatingsReviews: {
    component: UserRatingsReviews,
    type: 'full-width',
  },
  KnowYourBudget: {
    component: KnowYourBudget,
    type: 'full-width',
  },
};

interface DynamicSectionProps {
  section: SectionConfig;
  index: number;
  heroData?: unknown;
  verticalCards?: unknown[];
}

/**
 * Renders a single section based on its configuration
 */
const DynamicSection: React.FC<DynamicSectionProps> = ({ 
  section, 
  index,
  heroData,
  verticalCards,
}) => {
  const componentEntry = COMPONENT_MAP[section.componentId];
  
  if (!componentEntry) {
    console.warn(`Unknown component: ${section.componentId}`);
    return null;
  }

  if (!section.enabled) {
    return null;
  }

  const { component: Component, type, defaultProps } = componentEntry;
  
  // Resolve dynamic props (e.g., "dynamic:preferredBodyStyle" -> actual value)
  const resolvedProps = resolveDynamicProps(section.props);
  
  // Merge default props with section props
  const finalProps = {
    ...defaultProps,
    ...resolvedProps,
  };

  // Special handling for HeroPlusThree which needs hero and cards data
  if (section.componentId === 'HeroPlusThree' && heroData && verticalCards) {
    Object.assign(finalProps, { hero: heroData, cards: verticalCards });
  }

  // Determine if this section should show an ad
  const showAd = section.props.showAd === true;

  if (type === 'full-width') {
    return (
      <div key={`section-${index}`} className="home__section home__section--full-width">
        <Component {...finalProps} />
      </div>
    );
  }

  // Two-column layout with optional ad
  return (
    <div key={`section-${index}`} className="home__section">
      <div className="home__left-column">
        <Component {...finalProps} />
      </div>
      {showAd && (
        <div className="home__right-column">
          <AdContainer
            width={300}
            height={250}
            label="300 x 250"
            position="right-column"
            imageUrl="https://d2kde5ohu8qb21.cloudfront.net/files/69116380f5e41e00020d3432/822789964589118228.jpeg"
          />
        </div>
      )}
    </div>
  );
};

interface DynamicHomeRendererProps {
  /** Hero data for HeroPlusThree component */
  heroData?: unknown;
  /** Vertical cards data for HeroPlusThree component */
  verticalCards?: unknown[];
  /** Enable debug mode to show layout info */
  debug?: boolean;
  /** Force a specific layout key (for preview) */
  forceLayoutKey?: string;
}

/**
 * Dynamic Home Renderer
 * 
 * Fetches layout configuration from Journey Builder (Supabase/localStorage)
 * and renders the appropriate sections dynamically.
 */
export const DynamicHomeRenderer: React.FC<DynamicHomeRendererProps> = ({
  heroData,
  verticalCards,
  debug = false,
}) => {
  const [layout, setLayout] = useState<LayoutConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch layout on mount
  useEffect(() => {
    const fetchLayout = async () => {
      try {
        setLoading(true);
        const currentLayout = await getCurrentLayoutAsync();
        setLayout(currentLayout);
        setError(null);
      } catch (err) {
        console.error('Error fetching layout:', err);
        setError(err instanceof Error ? err.message : 'Failed to load layout');
      } finally {
        setLoading(false);
      }
    };

    fetchLayout();
  }, []);

  // Debug info
  const debugInfo = useMemo(() => {
    if (!debug) return null;
    return getDebugInfo();
  }, [debug]);

  // Loading state
  if (loading) {
    return (
      <div className="home__loading">
        <div className="home__loading-spinner" />
      </div>
    );
  }

  // Error state - fall back to default rendering
  if (error || !layout) {
    console.warn('DynamicHomeRenderer: Using fallback rendering due to error:', error);
    return null; // Let parent handle fallback
  }

  // Filter enabled sections
  const enabledSections = layout.sections.filter(s => s.enabled);

  return (
    <>
      {/* Debug panel */}
      {debug && debugInfo && (
        <div style={{
          position: 'fixed',
          bottom: 20,
          right: 20,
          background: 'rgba(0,0,0,0.9)',
          color: '#fff',
          padding: '16px',
          borderRadius: '8px',
          fontSize: '12px',
          zIndex: 9999,
          maxWidth: '300px',
        }}>
          <strong>Journey Builder Debug</strong>
          <div>Experience: {debugInfo.experience}</div>
          <div>Shopper: {debugInfo.isShopper ? 'Yes' : 'No'}</div>
          <div>Layout: {debugInfo.layoutName}</div>
          <div>Sections: {debugInfo.enabledSections}/{debugInfo.sectionsCount}</div>
        </div>
      )}

      {/* Render sections dynamically */}
      {enabledSections.map((section, index) => (
        <DynamicSection
          key={`${section.componentId}-${index}`}
          section={section}
          index={index}
          heroData={heroData}
          verticalCards={verticalCards}
        />
      ))}
    </>
  );
};

export default DynamicHomeRenderer;

