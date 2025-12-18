/**
 * Dynamic Home Renderer
 * 
 * Renders home page sections dynamically based on Journey Builder configuration.
 * This component bridges the Journey Builder (admin tool) with the actual Home page.
 */

import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { HeroPlusThree } from '../HeroPlusThree';
import { NewsSection } from '../NewsSection';
import { VehiclesSection } from '../VehiclesSection';
import { TopTenCarouselLeads } from '../TopTenCarouselLeads';
import { CommunityPostsPromo } from '../CommunityPostsPromo';
import { KnowYourBudget } from '../KnowYourBudget';
import { VehicleLeadsStripe } from '../VehicleLeadsStripe';
import { WhatIsMyCarWorth } from '../WhatIsMyCarWorth';
import { UserRatingsReviews } from '../UserRatingsReviews';
import { PersonalizedVehicles, getViewedVehicles } from '../PersonalizedVehicles';
import { TrendingStories } from '../TrendingStories';
import { AdContainer } from '../AdContainer';
import { articles } from '../../utils/articles';
import type { RiverItem } from '../River';
import {
  getCurrentLayoutAsync,
  resolveDynamicProps,
  // getDebugInfo, // Commented out - not currently used
  type LayoutConfig,
  type SectionConfig,
} from '../../utils/experienceManager';

/**
 * Get articles data for NewsSection and HeroPlusThree
 */
const getArticlesData = (navigate: ReturnType<typeof useNavigate>) => {
  // Get all news articles sorted by date
  const allArticles = Object.entries(articles)
    .filter(([, article]) => 
      article.category === 'News' || article.category === 'Features' || article.category === 'Reviews'
    )
    .map(([slug, article]) => ({ slug, article }))
    .sort((a, b) => {
      const dateA = new Date(a.article.date).getTime();
      const dateB = new Date(b.article.date).getTime();
      return dateB - dateA;
    });

  // Hero data - use first article
  const heroArticle = allArticles[0];
  const heroData = heroArticle ? {
    imageUrl: heroArticle.article.heroImage,
    title: heroArticle.article.title,
    onClick: () => navigate(`/article/${heroArticle.slug}`),
  } : { imageUrl: '', title: '', onClick: () => {} };

  // Vertical cards - next 3 articles
  const verticalCards = allArticles.slice(1, 4).map(({ slug, article }) => ({
    imageUrl: article.heroImage,
    title: article.title,
    type: article.category === 'Reviews' ? 'Article' as const : 'Article' as const,
    onClick: () => navigate(`/article/${slug}`),
  }));

  // News items for river - next 10 articles
  const newsItems: RiverItem[] = allArticles.slice(4, 14).map(({ slug, article }) => ({
    imageUrl: article.heroImage,
    title: article.title,
    author: article.author,
    date: article.date,
    category: `MotorTrend | ${article.category}`,
    onClick: () => navigate(`/article/${slug}`),
  }));

  return { heroData, verticalCards, newsItems };
};

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
  // TopTenCarousel now uses TopTenCarouselLeads with showLeads prop
  TopTenCarousel: {
    component: TopTenCarouselLeads,
    type: 'full-width',
    defaultProps: { initialVehicleType: 'SUV', initialSubcategory: 'All', showLeads: false },
  },
  // Legacy support for TopTenCarouselLeads
  TopTenCarouselLeads: {
    component: TopTenCarouselLeads,
    type: 'full-width',
    defaultProps: { initialVehicleType: 'SUV', initialSubcategory: 'All', showLeads: true },
  },
  VehicleLeadsStripe: {
    component: VehicleLeadsStripe,
    type: 'full-width',
  },
  HeroPlusThree: {
    component: HeroPlusThree,
    type: 'two-column',
    defaultProps: { 
      title: 'Recommended For You',
      hero: { imageUrl: '', title: '', onClick: () => {} },
      cards: [],
    },
  },
  TrendingStories: {
    component: TrendingStories,
    type: 'full-width',
  },
  PersonalizedVehicles: {
    component: PersonalizedVehicles,
    type: 'full-width',
    defaultProps: { moveToTopOnActivity: true, activityThreshold: 4 },
  },
  NewsSection: {
    component: NewsSection,
    type: 'two-column',
    defaultProps: { title: 'Latest Car News From our Experts', items: [] },
  },
  VehiclesSection: {
    component: VehiclesSection,
    type: 'two-column',
    defaultProps: { title: 'Top Ranked Vehicles', vehicles: [], useApi: true },
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
  heroData: { imageUrl: string; title: string; onClick: () => void };
  verticalCards: Array<{ imageUrl: string; title: string; type?: 'Video' | 'Article'; onClick: () => void }>;
  newsItems: RiverItem[];
}

/**
 * Renders a single section based on its configuration
 */
const DynamicSection: React.FC<DynamicSectionProps> = ({ 
  section, 
  index,
  heroData,
  verticalCards,
  newsItems,
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
  if (section.componentId === 'HeroPlusThree') {
    Object.assign(finalProps, { hero: heroData, cards: verticalCards });
  }
  
  // Special handling for NewsSection which needs items data
  if (section.componentId === 'NewsSection') {
    Object.assign(finalProps, { items: newsItems });
  }

  // Determine if this section should show an ad
  const showAd = section.props.showAd === true;

  // Debug logging
  console.log(`[DynamicSection] Rendering ${section.componentId}:`, {
    sectionProps: section.props,
    resolvedProps,
    finalProps,
    type,
  });

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
  /** Enable debug mode to show layout info */
  debug?: boolean;
}

/**
 * Dynamic Home Renderer
 * 
 * Fetches layout configuration from Journey Builder (Supabase/localStorage)
 * and renders the appropriate sections dynamically.
 */
export const DynamicHomeRenderer: React.FC<DynamicHomeRendererProps> = ({
  debug: _debug = false, // Prefixed with _ to indicate intentionally unused
}) => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [layout, setLayout] = useState<LayoutConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isIndicatorCollapsed, setIsIndicatorCollapsed] = useState(true); // Start collapsed by default
  const [viewedVehiclesCount, setViewedVehiclesCount] = useState(() => getViewedVehicles().length);
  
  // Check for preview mode URL parameters
  const isPreviewMode = searchParams.get('preview') === 'true';
  const experienceOverride = searchParams.get('experience');
  const isShopperParam = searchParams.get('isShopper');
  const isShopperOverride = isShopperParam !== null ? isShopperParam === 'true' : undefined;
  const componentPreviewId = searchParams.get('componentPreview');
  
  // Get articles data for NewsSection and HeroPlusThree
  const { heroData, verticalCards, newsItems } = useMemo(() => getArticlesData(navigate), [navigate]);
  
  // Track viewed vehicles count for PersonalizedVehicles move-to-top logic
  useEffect(() => {
    const updateCount = () => {
      setViewedVehiclesCount(getViewedVehicles().length);
    };
    
    window.addEventListener('viewedVehiclesUpdated', updateCount);
    window.addEventListener('storage', updateCount);
    
    return () => {
      window.removeEventListener('viewedVehiclesUpdated', updateCount);
      window.removeEventListener('storage', updateCount);
    };
  }, []);

  // Fetch layout on mount (or when preview params change)
  useEffect(() => {
    const fetchLayout = async () => {
      try {
        setLoading(true);
        console.log('[DynamicHomeRenderer] Fetching layout...', {
          isPreviewMode,
          experienceOverride,
          isShopperOverride,
        });
        
        // Pass preview mode options if available
        const options = isPreviewMode && experienceOverride ? {
          experienceOverride,
          isShopperOverride,
        } : undefined;
        
        const currentLayout = await getCurrentLayoutAsync(options);
        console.log('[DynamicHomeRenderer] Layout fetched:', {
          id: currentLayout?.id,
          name: currentLayout?.name,
          sectionsCount: currentLayout?.sections?.length || 0,
          enabledSections: currentLayout?.sections?.filter(s => s.enabled).length || 0,
        });
        setLayout(currentLayout);
        setError(null);
      } catch (err) {
        console.error('[DynamicHomeRenderer] Error fetching layout:', err);
        setError(err instanceof Error ? err.message : 'Failed to load layout');
      } finally {
        setLoading(false);
      }
    };

    fetchLayout();
  }, [isPreviewMode, experienceOverride, isShopperOverride]);

  // Debug info (keeping for potential future use)
  // const debugInfo = useMemo(() => {
  //   if (!debug) return null;
  //   return getDebugInfo();
  // }, [debug]);

  // Loading state
  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        minHeight: '400px',
        color: 'var(--color-neutrals-5)',
        flexDirection: 'column',
        gap: '16px'
      }}>
        <div style={{ 
          width: '40px', 
          height: '40px', 
          border: '3px solid var(--color-neutrals-6)', 
          borderTopColor: 'var(--color-primary-1)', 
          borderRadius: '50%',
          animation: 'spin 1s linear infinite'
        }} />
        <span>Loading layout...</span>
      </div>
    );
  }

  // Single component preview mode - render just one component
  if (componentPreviewId && COMPONENT_MAP[componentPreviewId]) {
    const componentEntry = COMPONENT_MAP[componentPreviewId];
    const Component = componentEntry.component;
    const defaultProps = componentEntry.defaultProps || {};
    
    // Merge with some sample props for better preview
    const previewProps = {
      ...defaultProps,
      // Add any additional preview-specific props here
    };
    
    // For components that need data, provide it
    const dataProps: Record<string, unknown> = {};
    if (componentPreviewId === 'NewsSection') {
      dataProps.items = newsItems;
    } else if (componentPreviewId === 'HeroPlusThree') {
      dataProps.hero = heroData;
      dataProps.cards = verticalCards;
    }
    
    return (
      <div style={{ 
        padding: '20px',
        minHeight: '100vh',
        background: 'var(--color-neutrals-8, #FCFCFD)'
      }}>
        <Component {...previewProps} {...dataProps} />
      </div>
    );
  }

  // Error state - show error message
  if (error) {
    console.error('DynamicHomeRenderer error:', error);
    return (
      <div style={{ 
        padding: '40px', 
        textAlign: 'center', 
        color: 'var(--color-error, #E53935)',
        background: 'rgba(229, 57, 53, 0.1)',
        borderRadius: '8px',
        margin: '20px'
      }}>
        <p><strong>Error loading layout:</strong> {error}</p>
        <p style={{ fontSize: '14px', color: 'var(--color-neutrals-5)', marginTop: '8px' }}>
          Try disabling dynamic mode or check the console for details.
        </p>
      </div>
    );
  }

  // No layout found
  if (!layout) {
    console.warn('DynamicHomeRenderer: No layout found');
    return (
      <div style={{ 
        padding: '40px', 
        textAlign: 'center', 
        color: 'var(--color-neutrals-5)'
      }}>
        <p>No layout configuration found.</p>
        <p style={{ fontSize: '14px', marginTop: '8px' }}>
          Please configure layouts in the Journey Builder.
        </p>
      </div>
    );
  }

  // Filter enabled sections and handle PersonalizedVehicles move-to-top logic
  const enabledSections = useMemo(() => {
    const sections = layout.sections?.filter(s => s.enabled) || [];
    
    // Find PersonalizedVehicles section and check if it should move to top
    const personalizedIndex = sections.findIndex(s => s.componentId === 'PersonalizedVehicles');
    
    if (personalizedIndex > 0) { // Only if it exists and is not already at top
      const personalizedSection = sections[personalizedIndex];
      const componentEntry = COMPONENT_MAP[personalizedSection.componentId];
      const defaultProps = componentEntry?.defaultProps || {};
      
      // Merge props: section props override defaults
      const moveToTopOnActivity = personalizedSection.props.moveToTopOnActivity ?? defaultProps.moveToTopOnActivity ?? true;
      const activityThreshold = personalizedSection.props.activityThreshold ?? defaultProps.activityThreshold ?? 4;
      
      // Check if we should move to top based on user activity
      if (moveToTopOnActivity && viewedVehiclesCount >= activityThreshold) {
        console.log('[DynamicHomeRenderer] Moving PersonalizedVehicles to top', {
          viewedVehiclesCount,
          activityThreshold,
          moveToTopOnActivity,
        });
        
        // Create new array with PersonalizedVehicles at top
        const reorderedSections = [...sections];
        const [removed] = reorderedSections.splice(personalizedIndex, 1);
        reorderedSections.unshift(removed);
        return reorderedSections;
      }
    }
    
    return sections;
  }, [layout?.sections, viewedVehiclesCount]);
  
  // No sections configured
  if (enabledSections.length === 0) {
    console.warn('DynamicHomeRenderer: Layout has no enabled sections', layout);
    return (
      <div style={{ 
        padding: '40px', 
        textAlign: 'center', 
        color: 'var(--color-neutrals-5)',
        background: 'var(--color-neutrals-7)',
        borderRadius: '8px',
        margin: '20px'
      }}>
        <p><strong>No components configured for this experience.</strong></p>
        <p style={{ fontSize: '14px', marginTop: '8px' }}>
          Layout: {layout.name} ({layout.id})
        </p>
        <p style={{ fontSize: '14px', marginTop: '4px' }}>
          Go to Journey Builder to add components to this experience.
        </p>
      </div>
    );
  }

  return (
    <>
      {/* Sticky Experience Indicator - Only visible in preview mode */}
      {isPreviewMode && (
        <div style={{
          position: 'fixed',
          bottom: 20,
          right: 20,
          background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
          color: '#fff',
          padding: isIndicatorCollapsed ? '8px 12px' : '16px 20px',
          borderRadius: '12px',
          fontSize: '12px',
          zIndex: 9999,
          maxWidth: isIndicatorCollapsed ? 'auto' : '280px',
          boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
          border: '1px solid rgba(255,255,255,0.1)',
          backdropFilter: 'blur(10px)',
          fontFamily: 'var(--font-body)',
          transition: 'all 0.2s ease',
          cursor: isIndicatorCollapsed ? 'pointer' : 'default',
        }}
        onClick={isIndicatorCollapsed ? () => setIsIndicatorCollapsed(false) : undefined}
        >
          {/* Header - Always visible */}
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'space-between',
            gap: '8px', 
            marginBottom: isIndicatorCollapsed ? 0 : '12px',
            borderBottom: isIndicatorCollapsed ? 'none' : '1px solid rgba(255,255,255,0.1)',
            paddingBottom: isIndicatorCollapsed ? 0 : '10px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ 
                width: '8px', 
                height: '8px', 
                borderRadius: '50%', 
                background: '#58BD7D',
                boxShadow: '0 0 8px #58BD7D'
              }} />
              {isIndicatorCollapsed ? (
                <span style={{ fontSize: '11px', fontWeight: '600' }}>{layout.experience}-{layout.isShopper ? 'S' : 'B'}</span>
              ) : (
                <strong style={{ fontSize: '13px', letterSpacing: '0.5px' }}>Journey Builder Preview</strong>
              )}
            </div>
            {!isIndicatorCollapsed && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setIsIndicatorCollapsed(true);
                }}
                style={{
                  background: 'rgba(255,255,255,0.1)',
                  border: 'none',
                  borderRadius: '4px',
                  color: 'rgba(255,255,255,0.6)',
                  cursor: 'pointer',
                  padding: '4px 6px',
                  fontSize: '10px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all 0.15s ease',
                }}
                title="Collapse"
              >
                ✕
              </button>
            )}
          </div>
          
          {/* Expanded content */}
          {!isIndicatorCollapsed && (
            <>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ color: 'rgba(255,255,255,0.6)' }}>Experience:</span>
                  <span style={{ 
                    background: 'var(--color-primary-1, #E90C17)', 
                    padding: '2px 8px', 
                    borderRadius: '4px',
                    fontWeight: '600',
                    fontSize: '11px'
                  }}>{layout.experience}</span>
                </div>
                
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ color: 'rgba(255,255,255,0.6)' }}>Intent:</span>
                  <span style={{ 
                    background: layout.isShopper ? '#58BD7D' : '#3B82F6', 
                    padding: '2px 8px', 
                    borderRadius: '4px',
                    fontWeight: '600',
                    fontSize: '11px'
                  }}>{layout.isShopper ? 'Shopper' : 'Browser'}</span>
                </div>
                
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ color: 'rgba(255,255,255,0.6)' }}>Layout:</span>
                  <span style={{ fontWeight: '500', fontSize: '11px' }}>{layout.id}</span>
                </div>
                
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ color: 'rgba(255,255,255,0.6)' }}>Sections:</span>
                  <span style={{ fontWeight: '500', fontSize: '11px' }}>{enabledSections.length} active</span>
                </div>
              </div>
              
              <div style={{ 
                marginTop: '12px', 
                paddingTop: '10px', 
                borderTop: '1px solid rgba(255,255,255,0.1)',
                fontSize: '10px',
                color: 'rgba(255,255,255,0.4)',
                textAlign: 'center'
              }}>
                <a 
                  href="/journey-builder" 
                  style={{ 
                    color: 'var(--color-primary-1, #E90C17)', 
                    textDecoration: 'none',
                    fontWeight: '600'
                  }}
                >
                  Open Journey Builder →
                </a>
              </div>
            </>
          )}
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
          newsItems={newsItems}
        />
      ))}
    </>
  );
};

export default DynamicHomeRenderer;

