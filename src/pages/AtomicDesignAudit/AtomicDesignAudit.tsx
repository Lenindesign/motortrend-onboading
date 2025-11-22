import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Card from '../../components/Card';
import { AdContainer } from '../../components/AdContainer';
import { ArticleCard } from '../../components/ArticleCard';
import { ArticleReactions } from '../../components/ArticleReactions';
import { ArticleScoreCard } from '../../components/ArticleScoreCard';
import { AvatarBannerModal } from '../../components/AvatarBannerModal';
import { ComparisonCard } from '../../components/ComparisonCard';
import { CollapsibleSection } from '../../components/CollapsibleSection';
import { ConnectedAccount } from '../../components/ConnectedAccount';
import { EditableField } from '../../components/EditableField';
import { EmptyVehicleSection } from '../../components/EmptyVehicleSection';
import { EmptyVehiclesCard } from '../../components/EmptyVehiclesCard';
import GlobalFooter from '../../components/GlobalFooter';
import GlobalHeader from '../../components/GlobalHeader';
import { HeroCard } from '../../components/HeroCard';
import { HeroPlusThree } from '../../components/HeroPlusThree';
import { HorizontalCard } from '../../components/HorizontalCard';
import { LocationAutocomplete } from '../../components/LocationAutocomplete';
import { NewsSection } from '../../components/NewsSection';
import { PhotoGallery } from '../../components/PhotoGallery';
import { ProfileBanner } from '../../components/ProfileBanner';
import { ProfileCompletionCard } from '../../components/ProfileCompletionCard';
import { ProfileNav } from '../../components/ProfileNav';
import RatingModal from '../../components/RatingModal';
import { River, type RiverItem } from '../../components/River';
import ReviewSubmittedToast from '../../components/ReviewSubmittedToast';
import { SavedModal } from '../../components/SavedModal';
import { SubscriptionItem } from '../../components/SubscriptionItem';
import { UserReviews, type ReviewData } from '../../components/UserReviews';
import { VehicleSearch } from '../../components/VehicleSearch';
import { VehiclesSection } from '../../components/VehiclesSection';
import { VideoCard } from '../../components/VideoCard';
import { VerticalCard } from '../../components/VerticalCard';
import WriteReviewModal from '../../components/WriteReviewModal';
import { AIInsights } from '../../components/AIInsights';
import StickyRateBar, { type RatingItem } from '../../components/StickyRateBar';
import { Badge, CardShell, Tooltip, Button } from '../../design-system/components';
import { Popover } from '../../components/atoms/Popover';
import Icon from '../../components/Icon';
import './AtomicDesignAudit.css';

const atomicLevelSummary = [
  {
    name: 'Atoms',
    description:
      'Single-purpose building blocks such as icons and badges. Atoms offer predictable styling and should never bundle layout logic.',
    focus: 'Icon, Toast, basic indicator rows.'
  },
  {
    name: 'Molecules',
    description:
      'Composable groups that combine atoms into reusable tiles (cards, inputs, buttons). Molecules are the workhorses of the page grid.',
    focus: 'Card, ArticleCard, HorizontalCard, VehicleCard variants and notification helpers.'
  },
  {
    name: 'Organisms',
    description:
      'Page-level units that orchestrate molecules with business logic, hooks, and data flows (headers, modals, hero + list sections).',
    focus: 'GlobalHeader, StickyRateBar, UserReviews, AIInsights, Search/Filter containers.'
  }
];

const componentAuditRows = [
  {
    component: 'Icon',
    level: 'Atom',
    observation:
      'Material symbol wrapper controls variant, size, and baseline styling; every card, header, and modal drags from it.',
    opportunity:
      'Document semantic color tokens (CTA, neutral, disabled) and expose props so glyph colors no longer depend on parent overrides.'
  },
  {
    component: 'AdContainer',
    level: 'Molecule',
    observation:
      'Sticky placeholder already reuses neutrals, border radius, and spacing tokens, and the min-height now reads from the spacing scale so the ratio stays on the 8px grid.',
    opportunity:
      'Document the placeholder ratio and surface tokenized shadows/spacing so ad placements can be reused without re-implementing the sticky offsets.'
  },
  {
    component: 'AIInsights',
    level: 'Organism',
    observation:
      'Insight grid now uses spacing tokens for margins/padding, which keeps the sections aligned with the 8px rhythm.',
    opportunity:
      'Swap the remaining px gaps inside lists with `--spacing-gap-sm` and capture the repeated section blocks using the shared atoms so future grids stay synchronized.'
  },
  {
    component: 'ArticleCard',
    level: 'Molecule',
    observation:
      'Now inherits the universal `Card` atom; the previous custom CSS file has been retired, so every article preview shares the same spacing and shadow surface.',
    opportunity:
      'Document the ArticleCard surface inside the audit page, then reuse the new `CardShell` plus the `Badge`/`Tooltip` atoms for any ArticleCard variants that need metadata chips or helper copy.'
  },
  {
    component: 'ArticleHero',
    level: 'Molecule',
    observation:
      'Article hero image component is fully tokenized. Uses design tokens for all spacing (--spacing-*), border-radius (--border-radius-md), colors (--color-neutrals-*), and transitions (--transition-fast). No hardcoded values found.',
    opportunity:
      'Document the hero image pattern and ensure all hero components across the app follow this same tokenized approach.'
  },
  {
    component: 'ArticleScoreCard',
    level: 'Molecule',
    observation:
      'Score card component now fully tokenized. Replaced hardcoded colors (#FFB74D → --color-rating-motortrend, #2C2C2E/#1C1C1E → --color-neutrals-2/1). All spacing, shadows, and typography use design tokens.',
    opportunity:
      'Document the score card pattern with rating bars and ensure all rating displays use --color-rating-motortrend for consistency.'
  },
  {
    component: 'ArticleReactions',
    level: 'Molecule',
    observation:
      'Emoji overlay now relies on spacing tokens for gaps, padding, and box shadows instead of hardcoded px values.',
    opportunity:
      'Document the tooltip trigger + popup so future hover states can reuse the `Tooltip` atom and consistent spacing.'
  },
  {
    component: 'Article Page',
    level: 'Organism',
    observation:
      'Article pages orchestrate lots of tokenized molecules (hero, rate bar, reactions, user reviews, modals) but still drive custom gradients, hardcoded offsets (headerOffset=100), and inline SVG colors.',
    opportunity:
      'Capture the shared atom/molecule usage in this organism and replace inline colors/spacings with design tokens (`--color-neutrals-*`, `--spacing-*`, `--color-primary-1`). Consider moving the hero/rating sections into reusable molecules that already consume `CardShell` + gradient tokens.'
  },
  {
    component: 'AvatarBannerModal',
    level: 'Organism',
    observation:
      'Avatar/banner picker now refactored to use ModalShell atom, eliminating ~25 lines of duplicate overlay and animation code. All spacing, tabs, and grid gaps use design tokens.',
    opportunity:
      'Document the selection grid pattern with ModalShell and ensure all picker modals use this same composition approach for consistency.'
  },
  {
    component: 'Card',
    level: 'Molecule',
    observation:
      'Universal vehicle card uses tokens for most surfaces but keeps `rgba` backgrounds and px gaps inside the ratings section.',
    opportunity:
      'Swap the `rgba` overlays for overlay tokens, move gap/tooltip padding to spacing tokens, and centralize rating colors via `var(--color-rating-*)`.'
  },
  {
    component: 'CollapsibleSection',
    level: 'Molecule',
    observation:
      'Expandable container that hides content behind an animated toggle—now padding, gaps, and borders read off tokens so the surface matches other cards.',
    opportunity:
      'Document the toggle spacing, split the header into badge/text atoms, and reuse the new tokens for the arrow so every accordion stays aligned.'
  },
  {
    component: 'ComparisonCard',
    level: 'Molecule',
    observation:
      'Comparison layout now uses spacing tokens for its gap/padding and tokenized overlay buttons so both sides stay aligned.',
    opportunity:
      'Document the comparison card shell and CTA token usage so future comparison experiences inherit the same spacing and overlay helpers.'
  },
  {
    component: 'ConnectedAccount',
    level: 'Molecule',
    observation:
      'Account badge with provider icons now renders the icon cube, text, and CTA using neutrals, spacing, and border tokens.',
    opportunity:
      'Formalize the icon surface and button spacing inside the design system guide so any new account badge knows which atoms to reuse.'
  },
  {
    component: 'EditableField',
    level: 'Molecule',
    observation:
      'Inline edit row now consumes spacing, border-radius, and focus tokens plus the shared button atom so the CTA row matches the rest of the system.',
    opportunity:
      'Document the trigger-to-input gap, icon actions, and focus border color so every editable row follows the same interaction model.'
  },
  {
    component: 'EmptyVehiclesCard',
    level: 'Molecule',
    observation:
      'Empty state card already uses spacing tokens, dashed borders, and rounded corners so the placeholder sits on the same 8px grid.',
    opportunity:
      'Document the search margin/gap scales and CTA placement so every empty state that wraps this molecule can stay consistent.'
  },
  {
    component: 'EmptyVehicleSection',
    level: 'Organism',
    observation:
      'Section that composes empty cards, CTA banners, and status copy when a search returns nothing.',
    opportunity:
      'Treat this section as a template that reuses the empty card atom plus shared spacing/shadow tokens, making the pattern easy to reapply elsewhere.'
  },
  {
    component: 'GlobalFooter',
    level: 'Organism',
    observation:
      'Footer with navigation links and badges that already brands the bottom bar but mixes a couple of px-based gaps.',
    opportunity:
      'Standardize inner gaps and link spacing to `var(--spacing-3)`/`var(--spacing-4)` so the footer mirrors the header grid.'
  },
  {
    component: 'GlobalHeader',
    level: 'Organism',
    observation:
      'Persistent navigation now uses Badge atom for notification counts, replacing custom blinking dot with semantic error variant badge. Eliminated 18 lines of custom CSS including @keyframes animation. Badge displays notification count (e.g., "1") with consistent error styling.',
    opportunity:
      'Switch dropdown surfaces to `var(--color-neutrals-1)`/`var(--color-neutrals-3-5)` tokens, and convert the 8px/12px gaps to spacing tokens for consistency.'
  },
  {
    component: 'HeroCard',
    level: 'Molecule',
    observation:
      'Large hero tile now draws padding from spacing tokens, shadows from `var(--shadow-card)`, and uses the design-system gradient overlay tokens for its footer.',
    opportunity:
      'Call out the overlay + shadow tokens inside the audit so other hero blocks can copy the same surface and typography pairing.'
  },
  {
    component: 'HeroPlusThree',
    level: 'Organism',
    observation:
      'Combines a primary hero with three supporting cards, forming a featured content block.',
    opportunity:
      'Ensure the three cards are all instances of the same molecule and that spacing/padding between cards uses shared gap tokens.'
  },
  {
    component: 'HorizontalCard',
    level: 'Molecule',
    observation:
      'Wide card layout for highlights that now leans on tokenized padding, borders, and shadows so it pairs with the vertical card family.',
    opportunity:
      'Document the landscape image container size and CTA spacing so horizontal cards can drop into other flows with the same surface tokens.'
  },
  {
    component: 'LocationAutocomplete',
    level: 'Molecule',
    observation:
      'Search field with suggestion dropdown used across onboarding flows.',
    opportunity:
      'Tokenize dropdown backgrounds, highlight colors, and ensure the input follows spacing/focus tokens from the design rules.'
  },
  {
    component: 'MembershipCard',
    level: 'Molecule',
    observation:
      'Premium membership card now fully tokenized with gradient backgrounds using neutrals tokens, shadow tokens (--shadow-card, --shadow-card-hover), text shadows (--shadow-text-dark, --shadow-text-medium, --shadow-text-light), and border colors (--color-border-light).',
    opportunity:
      'Document the gradient pattern and animation keyframes so other premium cards can reuse the same visual treatment and tokenized approach.'
  },
  {
    component: 'NewsSection',
    level: 'Organism',
    observation:
      'Section that stitches multiple card rows, badges, and “view all” CTAs for news articles.',
    opportunity:
      'Treat the section as a template: define row gaps via `var(--spacing-4)` and ensure headlines use typography tokens described in the design rules.'
  },
  {
    component: 'PhotoGallery',
    level: 'Organism',
    observation:
      'Full-screen gallery now refactored to use ModalShell atom with overlayVariant="dark" and maxWidth/maxHeight="100vw/100vh", eliminating ~25 lines of duplicate code including body scroll lock.',
    opportunity:
      'Document the full-screen gallery pattern with ModalShell and ensure all full-screen experiences use overlayVariant="dark" for immersive viewing.'
  },
  {
    component: 'ProfileBanner',
    level: 'Molecule',
    observation:
      'Profile hero that layers blurred banners, avatar, and metadata now draws spacing, gradients, and shadows from the token catalog so it matches the onboarding shell.',
    opportunity:
      'Document the banner gradient, avatar elevation, and CTA spacing so any dashboard hero can duplicate the same depth and typography rules.'
  },
  {
    component: 'ProfileCompletionCard',
    level: 'Molecule',
    observation:
      'Progress card with steps, search, and vehicle tiles; padding, borders and shadows now follow the design system tokens so it matches the other cards.',
    opportunity:
      'Document the progress bar tokens and CTA spacing so every onboarding card can reuse the same surface and typography rules.'
  },
  {
    component: 'ProfileNav',
    level: 'Molecule',
    observation:
      'Sidebar tab navigation now pulls spacing, border, and hover transitions from the design tokens so it mirrors the header nav rhythm.',
    opportunity:
      'Document the tab gap/padding tokens plus focus states so any account nav can reuse the same surface and active colors.'
  },
  {
    component: 'RatingDistributionTooltip',
    level: 'Molecule',
    observation:
      'Tooltip that displays 10-segment distribution, anchored to rating bars.',
    opportunity:
      'Tokenize tooltip padding, border-radius, and shadow; reuse `--shadow-dropdown` so all tooltips look identical.'
  },
  {
    component: 'RatingModal',
    level: 'Organism',
    observation:
      'Rating modal now refactored to use ModalShell atom, eliminating ~30 lines of duplicate overlay, animation, and event handling code. All tokenization maintained.',
    opportunity:
      'Document the star rating interaction pattern and ensure all rating modals across the app follow this same composition approach.'
  },
  {
    component: 'ReviewSubmittedToast',
    level: 'Organism',
    observation:
      'Success confirmation modal now refactored to use ModalShell atom, removing duplicate escape key handling, body scroll lock, and overlay click logic.',
    opportunity:
      'Document the success confirmation pattern with ModalShell and ensure all confirmation modals follow this composition approach.'
  },
  {
    component: 'River',
    level: 'Molecule',
    observation:
      'Horizontal list of cards that now wraps each `HorizontalCard` and applies spacing/padding tokens so it nests with other sections.',
    opportunity:
      'Document the outer spacing and separator tokens so future river sections can drop in without re-implementing the surrounding chrome.'
  },
  {
    component: 'SavedModal',
    level: 'Organism',
    observation:
      'Confirmation modal now refactored to use the new ModalShell atom, eliminating ~40 lines of duplicate overlay, animation, and event handling code.',
    opportunity:
      'Document the ModalShell composition pattern so all future modals use this atom instead of reimplementing overlay logic.'
  },
  {
    component: 'ScrollToTop',
    level: 'Molecule',
    observation:
      'Route-aware helper that resets the viewport to the top whenever the pathname changes.',
    opportunity:
      'Capture the animation/spacing tokens used by any future floating CTA so this helper can reuse the same surface when a button gets added.'
  },
  {
    component: 'StaffRatingTooltip',
    level: 'Molecule',
    observation:
      'Tooltip that surfaces MotorTrend rating details near staff scores.',
    opportunity:
      'Match the tooltip styling with the rating distribution tooltip by reusing the same tokens for padding, radius, and shadow.'
  },
  {
    component: 'StickyRateBar',
    level: 'Organism',
    observation:
      'Sticky rating bar now uses Badge atom for rating highlights (e.g., "4.5/5"), eliminating custom .sticky-rate-bar__rating-highlight styles. Uses spacing tokens for layout, tokenized overlays/shadows, and reuses CTA styles. Rating values now display as semantic badges (info for user reviews, success for your rating).',
    opportunity:
      'Consider using Badge atom for additional status indicators. Verify any remaining px-based gaps (mobile rating gap, icon sizing) convert to the `--spacing-gap-*` scale.'
  },
  {
    component: 'SubscriptionItem',
    level: 'Molecule',
    observation:
      'Membership card that highlights plans, badges, and actions while already using tokens for the pill badge and layout.',
    opportunity:
      'Document the badge padding, border, and layout spacing tokens so every subscription tile can copy this surface.'
  },
  {
    component: 'Toast',
    level: 'Molecule',
    observation:
      'Micro-feedback toast that already pulls typography and CTA structure from the design system while overlaying tokenized colors.',
    opportunity:
      'Document the overlay opacity, elevation, and button spacing tokens so all future toast states reuse the same palette.'
  },
  {
    component: 'UserReviews',
    level: 'Organism',
    observation:
      'Primary reviews list with rating distribution, review cards, and CTA controls.',
    opportunity:
      'Split the reviews list into reusable atoms (review header, stats, actions) and ensure spacing/color tokens flow from the `CURSOR_DESIGN_SYSTEM_RULES`.'
  },
  {
    component: 'VehicleCard',
    level: 'Molecule',
    observation:
      'Thin wrapper over `Card` that pushes MotorTrend/community rating colors via hex literals (#FFB74D, #33C4FF).',
    opportunity:
      'Introduce rating color tokens (`--color-rating-motortrend`, `--color-rating-community`) and share them with every component that renders a score.'
  },
  {
    component: 'VehicleSearch',
    level: 'Organism',
    observation:
      'Search filter panel that mixes selects, chips, and CTA buttons.',
    opportunity:
      'Audit each input/button inside the panel to ensure they reuse spacing, button, and form tokens documented in the Cursor rules.'
  },
  {
    component: 'VehiclesSection',
    level: 'Organism',
    observation:
      'Section combining hero, filters, and vehicle cards for inventory displays.',
    opportunity:
      'Treat the section as a template with defined row/column spacing tokens so future sections mirror each other.'
  },
  {
    component: 'VerticalCard',
    level: 'Molecule',
    observation:
      'Vertical card for video/article content now has consistent border-radius (--border-radius-md) on the image container, matching the card surface. Uses tokenized overlay colors (--color-overlay-dark) for play icon backgrounds.',
    opportunity:
      'Document the play overlay pattern and ensure all video cards across the app use this same tokenized approach for consistency.'
  },
  {
    component: 'VideoCard',
    level: 'Molecule',
    observation:
      'Media-first story card already delegates layout, overlay, and actions to the tokenized `Card` molecule.',
    opportunity:
      'Document the shared overlay/shadow tokens plus the play CTA spacing so every video tile can mirror this surface.'
  },
  {
    component: 'WriteReviewModal',
    level: 'Organism',
    observation:
      'Side-drawer modal now refactored to use ModalShell atom with position="side-right" and animation="slide-right", eliminating ~40 lines of duplicate code including escape key handling and body scroll lock.',
    opportunity:
      'Document the side-drawer pattern with ModalShell and ensure all form modals use this same composition approach.'
  }
];

const optimizedComponents = [
  'Icon',
  'Badge',
  'Tooltip',
  'CardShell',
  'ModalShell',
  'Card',
  'ArticleCard',
  'ArticleHero',
  'ArticleScoreCard',
  'AIInsights',
  'StickyRateBar',
  'ArticleReactions',
  'ComparisonCard',
  'CollapsibleSection',
  'ConnectedAccount',
  'EditableField',
  'EmptyVehiclesCard',
  'AdContainer',
  'HeroCard',
  'HorizontalCard',
  'LocationAutocomplete',
  'ProfileBanner',
  'ProfileCompletionCard',
  'ProfileNav',
  'River',
  'SubscriptionItem',
  'ScrollToTop',
  'Toast',
  'AvatarBannerModal',
  'VideoCard',
  'RatingModal',
  'ReviewSubmittedToast',
  'SavedModal',
  'UserReviews',
  'VehicleSearch',
  'VehiclesSection',
  'WriteReviewModal',
  'NewsSection',
  'PhotoGallery',
  'GlobalHeader',
  'GlobalFooter',
  'EmptyVehicleSection',
  'MembershipCard',
  'VerticalCard'
];

const LocationAutocompletePreview: React.FC = () => {
  const [location, setLocation] = useState('San Francisco, CA');
  return (
    <LocationAutocomplete
      value={location}
      onChange={setLocation}
      onDetectLocation={() => setLocation('MotorTrend HQ, Detroit, MI')}
      label="Location"
      placeholder="City or ZIP"
      required
    />
  );
};

const riverSampleItems: RiverItem[] = [
  {
    imageUrl: 'https://d2kde5ohu8qb21.cloudfront.net/files/68fa96ccbc61bd000284caff/1-2026-mazda-cx-50-awd-front-view.jpg',
    title: 'Mazda CX-50 AWD vs. the West Coast Trails',
    author: 'MotorTrend Staff',
    date: 'Nov 2025',
    category: 'Review'
  },
  {
    imageUrl: 'https://d2kde5ohu8qb21.cloudfront.net/files/690cf1b44df09200022170fe/023-2026-kia-sportage-hybrid.jpg',
    title: '2026 Kia Sportage Hybrid: Projected MPG',
    author: 'Editorial',
    date: 'Oct 2025',
    category: 'Insight'
  }
];

const ToastPreview: React.FC = () => (
  <div className="toast toast--info toast--preview">
    <div className="toast__content">
      <div className="toast__icon">
        <Icon name="info" size={24} />
      </div>
      <p className="toast__message">Settings saved successfully.</p>
    </div>
    <div className="toast__actions">
      <button className="cta cta--ghost">Dismiss</button>
      <button className="cta cta--primary">View</button>
    </div>
  </div>
);

const galleryImages = [
  'https://d2kde5ohu8qb21.cloudfront.net/files/685edb52f9d75b00021b1e55/07-2026-honda-cr-v-trailsport.jpg',
  'https://d2kde5ohu8qb21.cloudfront.net/files/65dcf5210e091c0008b94fd0/2020-honda-civic-si-coupe-front-three-quarter.jpg',
  'https://d2kde5ohu8qb21.cloudfront.net/files/68fa96ccbc61bd000284caff/1-2026-mazda-cx-50-awd-front-view.jpg'
];

const PhotoGalleryPreview: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="atomic-component-preview-inline">
      <button className="cta cta--ghost" type="button" onClick={() => setIsOpen(true)}>
        Open Gallery
      </button>
      <PhotoGallery
        images={galleryImages}
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        vehicleName="2025 Honda Civic Si"
      />
    </div>
  );
};

const RatingModalPreview: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="atomic-component-preview-inline">
      <button className="cta cta--ghost" type="button" onClick={() => setIsOpen(true)}>
        Open Rating Modal
      </button>
      <RatingModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        vehicleName="2025 BMW 3-Series"
        onRate={() => setIsOpen(false)}
        currentRating={80}
        onRateAndReview={() => setIsOpen(false)}
      />
    </div>
  );
};

const ReviewSubmittedToastPreview: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  return (
    <div className="atomic-component-preview-inline">
      <button className="cta cta--ghost" type="button" onClick={() => setIsVisible(true)}>
        Show Review Toast
      </button>
      <ReviewSubmittedToast
        isVisible={isVisible}
        onClose={() => setIsVisible(false)}
        onViewReview={() => setIsVisible(false)}
        vehicleName="2025 Subaru WRX"
      />
    </div>
  );
};

const SavedModalPreview: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="atomic-component-preview-inline">
      <button className="cta cta--ghost" type="button" onClick={() => setIsOpen(true)}>
        Show Saved Modal
      </button>
      <SavedModal isOpen={isOpen} onClose={() => setIsOpen(false)} itemTitle="2025 Honda Civic Si" />
    </div>
  );
};

const AvatarBannerModalPreview: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  return (
    <div className="atomic-component-preview-inline">
      <button className="cta cta--ghost" type="button" onClick={() => setIsVisible(true)}>
        Edit Profile
      </button>
      <AvatarBannerModal
        isVisible={isVisible}
        onClose={() => setIsVisible(false)}
        onSave={() => setIsVisible(false)}
      />
    </div>
  );
};

const userReviewsSample: ReviewData[] = [
  {
    id: 'review-1',
    reviewerName: 'Road Warrior',
    rating: 90,
    title: 'Smooth touring experience',
    content: 'The Civic Si nailed the commute and freeway runs with steady comfort and sharp steering.',
    vehicleType: 'Sedan',
    vehicleModel: 'Civic Si',
    date: 'Nov 2025',
    thumbsUpCount: 12,
    verificationLevel: 'owner',
    vehicleRelationship: 'own',
    experienceDuration: '2 years'
  },
  {
    id: 'review-2',
    reviewerName: 'MotorTrend Editor',
    rating: 80,
    title: 'Value-packed performance',
    content: 'Incredible value for budding enthusiasts—plenty of tech with great chassis balance.',
    vehicleType: 'Coupe',
    vehicleModel: 'Sportage Hybrid',
    date: 'Oct 2025',
    thumbsUpCount: 9,
    verificationLevel: 'verified',
    vehicleRelationship: 'test_drove',
    experienceDuration: '1 day'
  }
];
const userReviewDistribution = [5, 8, 10, 6, 3, 2, 1, 0, 0, 0];

const UserReviewsPreview: React.FC = () => (
  <UserReviews
    vehicleName="2025 Honda Civic Si"
    communityRating={8.4}
    totalReviews={124}
    ratingDistribution={userReviewDistribution}
    reviews={userReviewsSample}
    onWriteReview={() => {
      console.log('Write review requested');
    }}
  />
);

const VehicleSearchPreview: React.FC = () => {
  const [selected, setSelected] = useState('None');
  return (
    <div className="atomic-component-preview-inline">
      <VehicleSearch onVehicleSelect={(vehicle) => setSelected(vehicle.name)} />
      <span className="atomic-component-preview-status">Selected: {selected}</span>
    </div>
  );
};

const VehiclesSectionPreview: React.FC = () => {
  const vehicles = [
    { name: '2025 Honda Civic Si' },
    { name: '2026 Kia Sportage Hybrid' },
    { name: '2026 Mazda CX-50 AWD' }
  ];
  return (
    <VehiclesSection
      title="Inventory Spotlight"
      vehicles={vehicles}
    />
  );
};

const WriteReviewModalPreview: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="atomic-component-preview-inline">
      <button className="cta cta--ghost" type="button" onClick={() => setIsOpen(true)}>
        Open Write Review
      </button>
      <WriteReviewModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        vehicleName="2026 Mazda CX-50"
        vehicleImage="https://d2kde5ohu8qb21.cloudfront.net/files/68fa96ccbc61bd000284caff/1-2026-mazda-cx-50-awd-front-view.jpg"
      />
    </div>
  );
};

const NewsSectionPreview: React.FC = () => (
  <NewsSection title="News Spotlight" items={riverSampleItems} />
);

const stickySampleRatings: RatingItem[] = [
  {
    type: 'motortrend',
    value: 9.4,
    iconSrc: 'https://d2kde5ohu8qb21.cloudfront.net/files/69063bf7503f980002828ffc/mt-badge.svg',
    iconAlt: 'MT',
    labelTop: 'Expert',
    labelBottom: 'Rating',
    format: 'vehicle-details'
  },
  {
    type: 'user-reviews',
    value: 8.2,
    label: 'Community'
  },
  {
    type: 'your-rating',
    value: 40
  }
];

const atomList = [
  {
    name: 'Icon',
    sample: 'Material symbol glyphs used across atoms, cards, and nav helpers.',
    previewNode: (
      <div className="atomic-component-preview-inline">
        <Icon name="star" size={32} />
        <Icon name="favorite" size={32} />
        <Icon name="keyboard_arrow_right" size={32} />
      </div>
    )
  },
  {
    name: 'CardShell',
    sample: 'Tokenized container with spacing, radius, and shadows.',
    previewNode: (
      <CardShell hasHover={false} padding="sm">
        <p>Card shell sample</p>
        <Badge variant="info">New</Badge>
      </CardShell>
    )
  },
  {
    name: 'Badge',
    sample: 'Standardized badge with semantic variants (new, premium, verified, info, success, warning, error). Replaces custom badge styling in 5+ components.',
    previewNode: (
      <div className="atomic-component-preview-inline" style={{ gap: 'var(--spacing-1)', flexWrap: 'wrap' }}>
        <Badge variant="new">New</Badge>
        <Badge variant="premium">Premium</Badge>
        <Badge variant="verified" icon={<Icon name="check" size={12} />}>Verified</Badge>
        <Badge variant="info">Info</Badge>
        <Badge variant="success">Success</Badge>
        <Badge variant="warning">Warning</Badge>
        <Badge variant="error">Error</Badge>
        <Badge variant="neutral" outline={true}>Neutral</Badge>
      </div>
    )
  },
  {
    name: 'Tooltip',
    sample: 'Accessible tooltip with positioning (top/bottom/left/right), delay control, and arrow indicators. Replaces custom implementations in RatingDistributionTooltip and StaffRatingTooltip.',
    previewNode: (
      <div className="atomic-component-preview-inline" style={{ gap: 'var(--spacing-3)', flexWrap: 'wrap' }}>
        <Tooltip content="Top tooltip with arrow" placement="top">
          <Badge variant="info">Top</Badge>
        </Tooltip>
        <Tooltip content="Bottom tooltip" placement="bottom">
          <Badge variant="success">Bottom</Badge>
        </Tooltip>
        <Tooltip content="Left tooltip" placement="left">
          <Badge variant="warning">Left</Badge>
        </Tooltip>
        <Tooltip content="Right tooltip" placement="right">
          <Badge variant="error">Right</Badge>
        </Tooltip>
        <Tooltip content="No arrow tooltip" placement="top" showArrow={false}>
          <Badge variant="neutral">No Arrow</Badge>
        </Tooltip>
      </div>
    )
  },
  {
    name: 'Popover',
    sample: 'Interactive popover for rich content, using portals and positioning logic. Supports click/hover triggers and auto-positioning.',
    previewNode: (
      <div className="atomic-component-preview-inline" style={{ gap: 'var(--spacing-3)', flexWrap: 'wrap' }}>
        <Popover 
          content={<div style={{ padding: '12px', width: '200px' }}>
            <h4 style={{ margin: '0 0 8px', fontSize: '14px' }}>Popover Title</h4>
            <p style={{ margin: 0, fontSize: '12px', color: 'var(--color-neutrals-3)' }}>This popover contains rich content and interactive elements.</p>
            <button style={{ marginTop: '8px', padding: '4px 8px', fontSize: '12px', cursor: 'pointer' }}>Action</button>
          </div>}
          placement="top"
        >
          <Badge variant="neutral" outline={true}>Click Me</Badge>
        </Popover>
        <Popover 
          trigger="hover"
          content={<div style={{ padding: '8px' }}>Hover Content</div>}
          placement="right"
        >
          <Badge variant="info">Hover Me</Badge>
        </Popover>
      </div>
    )
  },
  {
    name: 'ModalShell',
    sample: 'Reusable modal wrapper with standardized overlay (--color-overlay-medium/dark) and shadow (--shadow-modal). Handles escape key, body scroll lock, and click-outside behavior.',
    previewNode: (
      <div className="atomic-component-preview-text">
        <p><strong>Props:</strong> isOpen, onClose, maxWidth, overlayVariant, position, animation</p>
        <p><strong>Usage:</strong> Wrap modal content to eliminate duplicate overlay code</p>
      </div>
    )
  },
  {
    name: 'Button',
    sample: 'Standard CTA button using tokenized spacing and colors.',
    previewNode: (
      <Button color="primary">
        Take Action
      </Button>
    )
  }
];

const moleculeList = [
  {
    name: 'Card',
    sample: 'Universal vehicle card with ratings and actions.',
    previewNode: (
        <Card
          image="https://d2kde5ohu8qb21.cloudfront.net/files/685edb52f9d75b00021b1e55/07-2026-honda-cr-v-trailsport.jpg"
        title="2025 Sample Vehicle"
        metadata="Sample"
        type="Sedan"
        onAction={() => {}}
        actionText="View"
      />
    )
  },
  {
    name: 'ArticleCard',
    sample: 'Article preview built on the universal card surface.',
    previewNode: (
      <ArticleCard
        imageUrl="https://d2kde5ohu8qb21.cloudfront.net/files/685edb52f9d75b00021b1e55/07-2026-honda-cr-v-trailsport.jpg"
        title="2025 Civic Si: MotorTrend Road Test"
        author="MotorTrend Editorial"
        date="Nov 2025"
        onReadArticle={() => {}}
      />
    )
  },
  {
    name: 'ArticleScoreCard',
    sample: 'MotorTrend review score card with award badge (now using Badge atom), rating breakdown, and reviewer info. Fully tokenized with design system colors and spacing.',
    previewNode: (
      <ArticleScoreCard
        vehicleName="2026 Honda Civic Si"
        score={{
          vehicleName: '2026 Honda Civic Si',
          overallRating: 8.5,
          scores: {
            performance: 8.7,
            efficiency: 7.8,
            tech: 8.9,
            value: 8.6
          },
          reviewer: {
            name: 'Scott Evans',
            avatar: 'https://d2kde5ohu8qb21.cloudfront.net/files/690cf1b44df09200022170fe/023-2026-kia-sportage-hybrid.jpg',
            title: 'A Thrilling Return to Form',
            excerpt: 'The 2026 Honda Civic Si brings back the joy of driving with its responsive handling, rev-happy engine, and affordable price point. This is the enthusiast sedan we\'ve been waiting for.',
            date: 'Nov 15, 2025',
            detailedSections: [
              {
                title: 'Performance',
                content: 'The turbocharged 1.5-liter engine delivers 200 hp and feels eager at every rev. The six-speed manual transmission is a joy to use with short throws and precise engagement.'
              },
              {
                title: 'Handling',
                content: 'Adaptive dampers and a limited-slip differential make the Si feel planted through corners. The steering is communicative and the chassis balance is near-perfect.'
              }
            ]
          }
        }}
      />
    )
  },
  {
    name: 'HorizontalCard',
    sample: 'News-rich horizontal tile reusing card padding, border, and shadow tokens.',
    previewNode: (
      <HorizontalCard
        imageUrl="https://d2kde5ohu8qb21.cloudfront.net/files/690cf1b44df09200022170fe/023-2026-kia-sportage-hybrid.jpg"
        title="2026 Kia Sportage Hybrid Review"
        author="MotorTrend Staff"
        date="Nov 2025"
        category="Review"
        onClick={() => {}}
      />
    )
  },
  {
    name: 'VideoCard',
    sample: 'Video hero that inherits overlay tokens from the universal `Card` molecule.',
    previewNode: (
      <VideoCard
        image="https://d2kde5ohu8qb21.cloudfront.net/files/690cf1b44df09200022170fe/023-2026-kia-sportage-hybrid.jpg"
        title="Road Test: 2026 Kia Sportage Hybrid"
        author="MotorTrend Video"
        date="Nov 2025"
        isBookmarked
        onBookmark={() => {}}
        onPlayVideo={() => {}}
      />
    )
  },
  {
    name: 'River',
    sample: 'Tokenized river wrapper that spaces and separates rows of horizontal cards.',
    previewNode: (
      <div className="atomic-component-preview-inline">
        <River items={riverSampleItems} />
      </div>
    )
  },
  {
    name: 'ComparisonCard',
    sample: 'Side-by-side comparison tile with tokenized overlays.',
    previewNode: (
      <ComparisonCard
        vehicle1={{
          image:
            'https://d2kde5ohu8qb21.cloudfront.net/files/685edb52f9d75b00021b1e55/07-2026-honda-cr-v-trailsport.jpg',
          name: '2026 Honda CR-V'
        }}
        vehicle2={{
          image:
            'https://d2kde5ohu8qb21.cloudfront.net/files/68fa96ccbc61bd000284caff/1-2026-mazda-cx-50-awd-front-view.jpg',
          name: '2026 Mazda CX-50'
        }}
        onBookmark={() => {}}
        onViewComparison={() => {}}
        isBookmarked
      />
    )
  },
  {
    name: 'ArticleReactions',
    sample: 'Emoji popups built on tokenized gaps and tooltip.',
    previewNode: (
      <div className="atomic-component-preview-inline">
        <ArticleReactions articleSlug="2025-bmw-3-series" showTooltipsBelow />
      </div>
    )
  },
  {
    name: 'EmptyVehiclesCard',
    sample: 'Empty-state hero with dashed border, icon bubble, and search helper.',
    previewNode: (
      <EmptyVehiclesCard
        onVehicleSelect={(vehicle) => {
          console.log('selected', vehicle);
        }}
      />
    )
  },
  {
    name: 'EditableField',
    sample: 'Inline edit row with tokenized focus + action buttons.',
    previewNode: (
      <EditableField
        label="User Email"
        value="design-system@motortrend.com"
        placeholder="Enter new email"
        onSave={() => {}}
      />
    )
  },
  {
    name: 'CollapsibleSection',
    sample: 'Accordion surface with tokenized padding, borders, and arrow.',
    previewNode: (
      <CollapsibleSection title="Tokenized Accordion" description="Expands to reveal more info." defaultOpen>
        <p>
          This content lives inside a shared molecule that already honors spacing tokens all the way through the header and 
          body gaps.
        </p>
      </CollapsibleSection>
    )
  },
  {
    name: 'ConnectedAccount',
    sample: 'Provider badge with icon cube plus connected state.',
    previewNode: (
      <ConnectedAccount provider="google" accountName="design-system@motortrend.com" isConnected />
    )
  },
  {
    name: 'AdContainer',
    sample: 'Sticky ad placeholder with tokenized padding and shadows.',
    previewNode: (
      <AdContainer
        label="Ad Preview"
        position="inline"
        imageUrl="https://d2kde5ohu8qb21.cloudfront.net/files/685edb52f9d75b00021b1e55/07-2026-honda-cr-v-trailsport.jpg"
      />
    )
  },
  {
    name: 'SubscriptionItem',
    sample: 'Subscription tile with tokenized badge, spacing, and hover elevation.',
    previewNode: (
      <SubscriptionItem
        name="MotorTrend Premium"
        logo="https://d2kde5ohu8qb21.cloudfront.net/files/69101763c398630002aedb21/buyer.svg"
        isActive
        onToggleSubscription={() => {}}
      />
    )
  },
  {
    name: 'LocationAutocomplete',
    sample: 'Search field with tokenized dropdowns and auto-detect helper.',
    previewNode: <LocationAutocompletePreview />
  },
  {
    name: 'ProfileBanner',
    sample: 'Hero banner with tokenized overlay, avatar, and metadata.',
    previewNode: (
      <ProfileBanner
        userName="Lenin Aviles"
        userAvatar="https://d2kde5ohu8qb21.cloudfront.net/files/68f6de8441f73a00024a546f/mtavatar.svg"
        userBanner="https://d2kde5ohu8qb21.cloudfront.net/files/68f787e24fba630002fdc127/golf.jpg"
        joinDate="09/27/2025"
        location="Los Angeles, CA"
        onEditProfile={() => {}}
      />
    )
  },
  {
    name: 'ProfileCompletionCard',
    sample: 'Onboarding checklist with progress bar, steps, and vehicle search using shared tokens.',
    previewNode: (
      <ProfileCompletionCard
        onUpdateStep1={() => {}}
        onUpdateStep2={() => {}}
        onUpdateStep3={() => {}}
        onUpdateStep4={() => {}}
      />
    )
  },
  {
    name: 'ProfileNav',
    sample: 'Tokenized tab strip with active/hover states matching the header nav tokens.',
    previewNode: <ProfileNav activeTab="saved-items" onTabChange={() => {}} />
  },
  {
    name: 'Toast',
    sample: 'Micro-feedback overlay that relies on tokenized overlay, typography, and CTA spacing.',
    previewNode: <ToastPreview />
  },
  {
    name: 'ScrollToTop',
    sample: 'Route listener that resets the viewport when navigation completes.',
    previewNode: (
      <div className="atomic-component-preview-inline">
        <p>ScrollToTop (behavioral listener)</p>
      </div>
    )
  },
  {
    name: 'HeroCard',
    sample: 'Media hero that plugs into HeroPlusThree.',
    previewNode: (
      <HeroCard
        imageUrl="https://d2kde5ohu8qb21.cloudfront.net/files/685edb52f9d75b00021b1e55/07-2026-honda-cr-v-trailsport.jpg"
        title="Hero Spotlight"
      />
    )
  },
  {
    name: 'VerticalCard',
    sample: 'Information card for resources.',
    previewNode: (
      <VerticalCard
        imageUrl="https://d2kde5ohu8qb21.cloudfront.net/files/685edb52f9d75b00021b1e55/07-2026-honda-cr-v-trailsport.jpg"
        title="Vertical Resource"
        type="Article"
      />
    )
  }
];

const organismList = [
  {
    name: 'AIInsights',
    sample: 'Insight grid with bold sections.',
    previewNode: <AIInsights vehicleName="2025 BMW 3-Series" />
  },
  {
    name: 'AvatarBannerModal',
    sample: 'Profile modal with tokenized overlay, tabs, and option grids.',
    previewNode: <AvatarBannerModalPreview />
  },
  {
    name: 'EmptyVehicleSection',
    sample: 'Template that reuses the empty card atom plus shared spacing/shadow tokens.',
    previewNode: (
      <EmptyVehicleSection type="own" onClick={() => {}} />
    )
  },
  {
    name: 'GlobalHeader',
    sample: 'Persistent nav with dropdowns and search inputs.',
    previewNode: <GlobalHeader />
  },
  {
    name: 'GlobalFooter',
    sample: 'Footer with navigation, documentation, and CTA badges.',
    previewNode: <GlobalFooter />
  },
  {
    name: 'HeroPlusThree',
    sample: 'Hero block with supporting cards.',
    previewNode: (
      <HeroPlusThree
        hero={{
          imageUrl: 'https://d2kde5ohu8qb21.cloudfront.net/files/685edb52f9d75b00021b1e55/07-2026-honda-cr-v-trailsport.jpg',
          title: 'Hero Feature'
        }}
          cards={[
            {
              imageUrl:
                'https://d2kde5ohu8qb21.cloudfront.net/files/690cf1b44df09200022170fe/023-2026-kia-sportage-hybrid.jpg',
              title: 'Card One'
            },
            {
              imageUrl:
                'https://d2kde5ohu8qb21.cloudfront.net/files/65dcf5210e091c0008b94fd0/2020-honda-civic-si-coupe-front-three-quarter.jpg',
              title: 'Card Two',
              type: 'Article'
            },
            {
              imageUrl:
                'https://d2kde5ohu8qb21.cloudfront.net/files/68fa96ccbc61bd000284caff/1-2026-mazda-cx-50-awd-front-view.jpg',
              title: 'Card Three'
            }
          ]}
      />
    )
  },
  {
    name: 'NewsSection',
    sample: 'Section that stitches multiple card rows, badges, and view-all CTAs.',
    previewNode: <NewsSectionPreview />
  },
  {
    name: 'PhotoGallery',
    sample: 'Modal gallery with overlay controls and thumbnails.',
    previewNode: <PhotoGalleryPreview />
  },
  {
    name: 'RatingModal',
    sample: 'Star-based rating modal with CTA buttons.',
    previewNode: <RatingModalPreview />
  },
  {
    name: 'ReviewSubmittedToast',
    sample: 'Success notification that confirms review submissions.',
    previewNode: <ReviewSubmittedToastPreview />
  },
  {
    name: 'SavedModal',
    sample: 'Modal shown after saving content, sharing the modal shell.',
    previewNode: <SavedModalPreview />
  },
  {
    name: 'StickyRateBar',
    sample: 'Sticky bar with ratings, CTA, and tooltips.',
    previewNode: (
      <StickyRateBar
        vehicleName="2025 BMW 3-Series"
        ratings={stickySampleRatings}
        ctaText="Local Listings"
        ctaOnClick={() => {}}
        isVisible={true}
        staffRatingScores={{ performance: 9, efficiency: 8, tech: 8, value: 9 }}
        ratingDistribution={{ 1: 2, 2: 3, 3: 5, 4: 10, 5: 20, 6: 30, 7: 45, 8: 50, 9: 30, 10: 10 }}
        totalReviews={123}
      />
    )
  },
  {
    name: 'UserReviews',
    sample: 'Review list with rating distribution, cards, and CTA controls.',
    previewNode: <UserReviewsPreview />
  },
  {
    name: 'VehicleSearch',
    sample: 'Search panel with autocomplete and chips.',
    previewNode: <VehicleSearchPreview />
  },
  {
    name: 'VehiclesSection',
    sample: 'Vehicle grid with filters, cards, and modals.',
    previewNode: <VehiclesSectionPreview />
  },
  {
    name: 'WriteReviewModal',
    sample: 'Review submission modal with stars, form, and media upload.',
    previewNode: <WriteReviewModalPreview />
  }
];

const remainingMolecules = componentAuditRows
  .filter((row) => row.level === 'Molecule' && !optimizedComponents.includes(row.component))
  .map((row) => row.component);

const remainingOrganisms = componentAuditRows
  .filter((row) => row.level === 'Organism' && !optimizedComponents.includes(row.component))
  .map((row) => row.component);

const focusAreas = [
  {
    title: 'Token-first alignment',
    detail:
      'Every component should consume the color, spacing, and shadow variables defined in `CURSOR_DESIGN_SYSTEM_RULES`. Hardcoded hex (`#141416`, `#FFB74D`) and px gaps should be replaced with tokens before we scale.'
  },
  {
    title: 'Atomic composition',
    detail:
      'Reuse the same atoms/molecules across components instead of recreating similar CSS. We now publish `CardShell`, `Badge`, and `Tooltip` under `src/design-system/components/` so every card and helper popover can draw from the same tokenized pieces.'
  },
  {
    title: 'Documentation',
    detail:
      'Document each molecule’s API and token expectations in the design system reference so PMs and designers understand when to reuse an existing pattern versus requesting a new one.'
  }
];

const nextSteps: string[] = [];

export const AtomicDesignAudit: React.FC = () => {
  const [activeSection, setActiveSection] = useState('overview');

  const scrollToSection = (sectionId: string) => {
    setActiveSection(sectionId);
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const totalComponents = atomList.length + moleculeList.length + organismList.length;
  const optimizedCount = optimizedComponents.length;
  const progress = Math.round((optimizedCount / totalComponents) * 100);

  return (
    <div className="atomic-audit-page">
      {/* Sidebar Navigation */}
      <aside className="atomic-audit-sidebar">
        <h3 className="atomic-audit-sidebar__title">Navigation</h3>
        <ul className="atomic-audit-sidebar__nav">
          <li>
            <a
              className={`atomic-audit-sidebar__link ${activeSection === 'overview' ? 'atomic-audit-sidebar__link--active' : ''}`}
              onClick={() => scrollToSection('overview')}
            >
              <Icon name="dashboard" size={18} />
              Overview
            </a>
          </li>
          <li>
            <a
              className={`atomic-audit-sidebar__link ${activeSection === 'components' ? 'atomic-audit-sidebar__link--active' : ''}`}
              onClick={() => scrollToSection('components')}
            >
              <Icon name="widgets" size={18} />
              Components
              <span className="atomic-audit-sidebar__badge">{totalComponents}</span>
            </a>
          </li>
          <li>
            <a
              className={`atomic-audit-sidebar__link ${activeSection === 'atoms' ? 'atomic-audit-sidebar__link--active' : ''}`}
              onClick={() => scrollToSection('atoms')}
            >
              <Icon name="circle" size={18} />
              Atoms
              <span className="atomic-audit-sidebar__badge">{atomList.length}</span>
            </a>
          </li>
          <li>
            <a
              className={`atomic-audit-sidebar__link ${activeSection === 'molecules' ? 'atomic-audit-sidebar__link--active' : ''}`}
              onClick={() => scrollToSection('molecules')}
            >
              <Icon name="extension" size={18} />
              Molecules
              <span className="atomic-audit-sidebar__badge">{moleculeList.length}</span>
            </a>
          </li>
          <li>
            <a
              className={`atomic-audit-sidebar__link ${activeSection === 'organisms' ? 'atomic-audit-sidebar__link--active' : ''}`}
              onClick={() => scrollToSection('organisms')}
            >
              <Icon name="view_module" size={18} />
              Organisms
              <span className="atomic-audit-sidebar__badge">{organismList.length}</span>
            </a>
          </li>
          <li>
            <a
              className={`atomic-audit-sidebar__link ${activeSection === 'levels' ? 'atomic-audit-sidebar__link--active' : ''}`}
              onClick={() => scrollToSection('levels')}
            >
              <Icon name="layers" size={18} />
              Atomic Levels
            </a>
          </li>
          <li>
            <a
              className={`atomic-audit-sidebar__link ${activeSection === 'inventory' ? 'atomic-audit-sidebar__link--active' : ''}`}
              onClick={() => scrollToSection('inventory')}
            >
              <Icon name="inventory_2" size={18} />
              Full Inventory
            </a>
          </li>
          <li>
            <a
              className={`atomic-audit-sidebar__link ${activeSection === 'status' ? 'atomic-audit-sidebar__link--active' : ''}`}
              onClick={() => scrollToSection('status')}
            >
              <Icon name="check_circle" size={18} />
              Status
              <span className="atomic-audit-sidebar__badge">{progress}%</span>
            </a>
          </li>
          <li>
            <a
              className={`atomic-audit-sidebar__link ${activeSection === 'focus' ? 'atomic-audit-sidebar__link--active' : ''}`}
              onClick={() => scrollToSection('focus')}
            >
              <Icon name="target" size={18} />
              Focus Areas
            </a>
          </li>
          <li>
            <a
              className={`atomic-audit-sidebar__link ${activeSection === 'documentation' ? 'atomic-audit-sidebar__link--active' : ''}`}
              onClick={() => scrollToSection('documentation')}
            >
              <Icon name="menu_book" size={18} />
              Documentation
            </a>
          </li>
          <li>
            <a
              className={`atomic-audit-sidebar__link ${activeSection === 'roadmap' ? 'atomic-audit-sidebar__link--active' : ''}`}
              onClick={() => scrollToSection('roadmap')}
            >
              <Icon name="map" size={18} />
              Roadmap
            </a>
          </li>
        </ul>
      </aside>

      {/* Main Content */}
      <div className="atomic-audit-content">
        <header className="atomic-audit-page__header" id="overview">
          <p className="atomic-audit-page__eyebrow">Design System Audit</p>
          <h1 className="atomic-audit-page__title">Atomic Design Inventory</h1>
          <p className="atomic-audit-page__intro">
            A page-level audit of every React component, organized by atomic-design level, with recommendations
            for token adoption and composability. This complements the{' '}
            <Link to="/design-system" className="atomic-audit-page__link">
              Design System Reference
            </Link>{' '}
            and the{' '}
            <Link to="/documentation/review-system" className="atomic-audit-page__link">
              Review System docs
            </Link>
            .
          </p>

          {/* Progress Bar */}
          <div className="atomic-progress">
            <div className="atomic-progress__label">
              <span>Tokenization Progress</span>
              <span>{progress}% Complete</span>
            </div>
            <div className="atomic-progress__bar">
              <div className="atomic-progress__fill" style={{ width: `${progress}%` }} />
            </div>
          </div>
        </header>

        {/* Stats Cards */}
        <div className="atomic-audit-page__stats">
          <div className="atomic-audit-stat-card">
            <div className="atomic-audit-stat-card__number">{totalComponents}</div>
            <p className="atomic-audit-stat-card__label">Total Components</p>
          </div>
          <div className="atomic-audit-stat-card">
            <div className="atomic-audit-stat-card__number">{optimizedCount}</div>
            <p className="atomic-audit-stat-card__label">Optimized</p>
          </div>
          <div className="atomic-audit-stat-card">
            <div className="atomic-audit-stat-card__number">3</div>
            <p className="atomic-audit-stat-card__label">Atomic Layers</p>
          </div>
          <div className="atomic-audit-stat-card">
            <div className="atomic-audit-stat-card__number">{progress}%</div>
            <p className="atomic-audit-stat-card__label">Progress</p>
          </div>
        </div>

      <section className="atomic-component-tables" id="components">
        <article className="atomic-component-section" id="atoms">
          <h3>Atoms</h3>
          <table className="atomic-component-table">
            <thead>
                <tr>
                  <th>Component</th>
                  <th>Description</th>
                </tr>
            </thead>
            <tbody>
              {atomList.map((atom) => (
                <React.Fragment key={atom.name}>
                  <tr>
                    <td>{atom.name}</td>
                    <td>{atom.sample}</td>
                  </tr>
                  <tr className="atomic-component-preview-row">
                    <td colSpan={2}>
                      <div className="atomic-component-preview-wrapper">
                        {atom.previewNode}
                      </div>
                    </td>
                  </tr>
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </article>

        <article className="atomic-component-section" id="molecules">
          <h3>Molecules</h3>
          <table className="atomic-component-table">
            <thead>
                <tr>
                  <th>Component</th>
                  <th>Description</th>
                </tr>
            </thead>
            <tbody>
              {moleculeList.map((molecule) => (
                <React.Fragment key={molecule.name}>
                  <tr>
                    <td>{molecule.name}</td>
                    <td>{molecule.sample}</td>
                  </tr>
                  <tr className="atomic-component-preview-row">
                    <td colSpan={2}>
                      <div className="atomic-component-preview-wrapper">
                        {molecule.previewNode}
                      </div>
                    </td>
                  </tr>
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </article>

        <article className="atomic-component-section" id="organisms">
          <h3>Organisms</h3>
          <table className="atomic-component-table">
            <thead>
                <tr>
                  <th>Component</th>
                  <th>Description</th>
                </tr>
            </thead>
            <tbody>
              {organismList.map((organism) => (
                <React.Fragment key={organism.name}>
                  <tr>
                    <td>{organism.name}</td>
                    <td>{organism.sample}</td>
                  </tr>
                  <tr className="atomic-component-preview-row">
                    <td colSpan={2}>
                      <div className="atomic-component-preview-wrapper">
                        {organism.previewNode}
                      </div>
                    </td>
                  </tr>
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </article>
      </section>

      <section className="atomic-samples">
        <article className="atomic-sample-card atomic-sample-card--atom">
          <p className="atomic-sample-card__label">Atom sample</p>
          <div className="atomic-sample-chip">Badge</div>
          <p>Spacing: <code>var(--spacing-component-sm)</code> · Colors: semantic token</p>
        </article>
        <article className="atomic-sample-card atomic-sample-card--molecule">
          <p className="atomic-sample-card__label">Molecule sample</p>
          <div className="atomic-sample-structure">
            <span>CardShell</span>
            <span>Title</span>
            <span>CTA</span>
          </div>
          <p>Composes card shell + badge + rating/toggle.</p>
        </article>
        <article className="atomic-sample-card atomic-sample-card--organism">
          <p className="atomic-sample-card__label">Organism sample</p>
          <div className="atomic-sample-structure">
            <span>Sticky row</span>
            <span>Vehicle name</span>
            <span>CTA</span>
          </div>
          <p>StickyRateBar integrates CTAs, tooltips, and spacing tokens.</p>
        </article>
      </section>

      <section className="atomic-audit-section" id="levels">
        <div className="atomic-audit-section__header">
          <h2>Atomic level summary</h2>
          <p>Confirm that every component maps back to the right atomic layer so we can keep the system modular.</p>
        </div>
        <div className="atomic-level-grid">
          {atomicLevelSummary.map((summary) => (
            <article key={summary.name} className="atomic-level-card">
              <h3>{summary.name}</h3>
              <p>{summary.description}</p>
              <p className="atomic-level-card__focus"><strong>Focus:</strong> {summary.focus}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="atomic-audit-section" id="inventory">
        <div className="atomic-audit-section__header">
          <h2>Component inventory</h2>
          <p>Every component is listed below with the current observations and the immediate optimization opportunity.</p>
        </div>
        <div className="atomic-table-wrapper">
          <table className="atomic-audit-table">
            <thead>
              <tr>
                <th>Component</th>
                <th>Level</th>
                <th>Observation</th>
                <th>Optimization opportunity</th>
              </tr>
            </thead>
            <tbody>
              {componentAuditRows.map((row) => (
                <tr key={row.component}>
                  <td>{row.component}</td>
                  <td>{row.level}</td>
                  <td>{row.observation}</td>
                  <td>{row.opportunity}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="atomic-audit-section" id="status">
        <div className="atomic-audit-section__header">
          <h2>Component status</h2>
          <p>Track what the team has tokenized and what still needs attention.</p>
        </div>
        <div className="atomic-status-grid">
          <div>
            <h4>Optimized this sprint</h4>
            <ul>
              {optimizedComponents.map((component) => (
                <li key={component}>{component}</li>
              ))}
            </ul>
          </div>
          <div>
            <h4>Remaining molecules</h4>
            <ul>
              {remainingMolecules.map((component) => (
                <li key={component}>{component}</li>
              ))}
            </ul>
          </div>
          <div>
            <h4>Remaining organisms</h4>
            <ul>
              {remainingOrganisms.map((component) => (
                <li key={component}>{component}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>


      <section className="atomic-audit-section" id="focus">
        <div className="atomic-audit-section__header">
          <h2>Cross-cutting focus areas</h2>
          <p>Carry these priorities into every component patch.</p>
        </div>
        <div className="atomic-focus-grid">
          {focusAreas.map((focus) => (
            <article key={focus.title} className="atomic-focus-card">
              <h3>{focus.title}</h3>
              <p>{focus.detail}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="atomic-audit-section atomic-audit-section--documentation" id="documentation">
        <div className="atomic-audit-section__header">
          <h2>📚 Documentation</h2>
          <p>Comprehensive guides for using atoms in your components.</p>
        </div>
        <div className="atomic-documentation-grid">
          <div className="atomic-doc-card">
            <div className="atomic-doc-card__icon">📖</div>
            <h3 className="atomic-doc-card__title">Atom Composition Guide</h3>
            <p className="atomic-doc-card__description">
              Complete guide showing how to compose ModalShell, CardShell, Badge, and Tooltip atoms in your molecules and organisms.
            </p>
            <div className="atomic-doc-card__features">
              <span>✓ Usage patterns</span>
              <span>✓ Code examples</span>
              <span>✓ Anti-patterns</span>
              <span>✓ Design tokens</span>
            </div>
            <a href="/docs/ATOM_COMPOSITION_GUIDE.md" className="atomic-doc-card__link" target="_blank" rel="noopener noreferrer">
              View Full Guide →
            </a>
          </div>
          <div className="atomic-doc-card">
            <div className="atomic-doc-card__icon">⚡</div>
            <h3 className="atomic-doc-card__title">Quick Reference Card</h3>
            <p className="atomic-doc-card__description">
              One-page cheat sheet with common props, variants, and composition patterns for quick lookup while coding.
            </p>
            <div className="atomic-doc-card__features">
              <span>✓ Common props</span>
              <span>✓ Token reference</span>
              <span>✓ Quick examples</span>
              <span>✓ Printable</span>
            </div>
            <a href="/docs/ATOMS_QUICK_REFERENCE.md" className="atomic-doc-card__link" target="_blank" rel="noopener noreferrer">
              View Quick Reference →
            </a>
          </div>
          <div className="atomic-doc-card">
            <div className="atomic-doc-card__icon">🎭</div>
            <h3 className="atomic-doc-card__title">ModalShell README</h3>
            <p className="atomic-doc-card__description">
              Detailed documentation for the ModalShell atom including all props, examples, and refactoring benefits.
            </p>
            <div className="atomic-doc-card__features">
              <span>✓ All props explained</span>
              <span>✓ Advanced patterns</span>
              <span>✓ Accessibility</span>
              <span>✓ Migration guide</span>
            </div>
            <a href="/src/components/atoms/ModalShell/README.md" className="atomic-doc-card__link" target="_blank" rel="noopener noreferrer">
              View ModalShell Docs →
            </a>
          </div>
          <div className="atomic-doc-card">
            <div className="atomic-doc-card__icon">🔒</div>
            <h3 className="atomic-doc-card__title">Token Governance</h3>
            <p className="atomic-doc-card__description">
              Automated enforcement of design tokens with ESLint rules, CSS linting, and pre-commit hooks to prevent hardcoded values.
            </p>
            <div className="atomic-doc-card__features">
              <span>✓ ESLint rules</span>
              <span>✓ CSS linter</span>
              <span>✓ Pre-commit hooks</span>
              <span>✓ Token reference</span>
            </div>
            <a href="/docs/TOKEN_GOVERNANCE.md" className="atomic-doc-card__link" target="_blank" rel="noopener noreferrer">
              View Governance Docs →
            </a>
          </div>
          <div className="atomic-doc-card">
            <div className="atomic-doc-card__icon">✅</div>
            <h3 className="atomic-doc-card__title">PR Template & Contributing</h3>
            <p className="atomic-doc-card__description">
              Pull request template with required atom composition checklist and comprehensive contributing guide for maintaining design system quality.
            </p>
            <div className="atomic-doc-card__features">
              <span>✓ Atom checklist</span>
              <span>✓ Token checklist</span>
              <span>✓ Testing guide</span>
              <span>✓ Code examples</span>
            </div>
            <a href="/.github/PULL_REQUEST_TEMPLATE.md" className="atomic-doc-card__link" target="_blank" rel="noopener noreferrer">
              View PR Template →
            </a>
          </div>
          <div className="atomic-doc-card">
            <div className="atomic-doc-card__icon">🔄</div>
            <h3 className="atomic-doc-card__title">Atom Migration Plan</h3>
            <p className="atomic-doc-card__description">
              Strategic plan for migrating 15+ components to use CardShell, Badge, and Tooltip atoms. Includes priority order, migration checklist, and success metrics.
            </p>
            <div className="atomic-doc-card__features">
              <span>✓ Priority matrix</span>
              <span>✓ Migration strategy</span>
              <span>✓ Success metrics</span>
              <span>✓ Risk mitigation</span>
            </div>
            <a href="/docs/ATOM_MIGRATION_PLAN.md" className="atomic-doc-card__link" target="_blank" rel="noopener noreferrer">
              View Migration Plan →
            </a>
          </div>
        </div>
      </section>

      <section className="atomic-audit-section atomic-audit-section--completed" id="completed">
        <div className="atomic-audit-section__header">
          <h2>Recent Completions</h2>
          <p>Successfully migrated components using atomic design patterns.</p>
        </div>
        <div className="atomic-completion-list">
          <div className="atomic-completion-item">
            <div className="atomic-completion-header">
              <Badge variant="success" size="sm">✓ Completed</Badge>
              <span className="atomic-completion-date">Nov 22, 2025</span>
            </div>
            <h3 className="atomic-completion-title">Atom Improvements & Component Migration</h3>
            <p className="atomic-completion-description">
              Refactored `Button` atom to align with global `cta` classes and updated `TextField` to support complex labels and helper text. Migrated `WriteReviewModal` inputs and buttons, as well as CTAs in `ComparisonCard` and `StickyRateBar` to use these standardized atoms.
            </p>
            <div className="atomic-completion-metrics">
              <div className="atomic-completion-metric">
                <span className="atomic-completion-metric-label">Components Updated</span>
                <span className="atomic-completion-metric-value">4</span>
              </div>
              <div className="atomic-completion-metric">
                <span className="atomic-completion-metric-label">Atoms Enhanced</span>
                <span className="atomic-completion-metric-value">Button, TextField</span>
              </div>
            </div>
          </div>
          <div className="atomic-completion-item">
            <div className="atomic-completion-header">
              <Badge variant="success" size="sm">✓ Completed</Badge>
              <span className="atomic-completion-date">Nov 22, 2025</span>
            </div>
            <h3 className="atomic-completion-title">CI/CD Token Enforcement</h3>
            <p className="atomic-completion-description">
              Established GitHub Actions workflow to enforce design token usage. The pipeline runs ESLint and the custom CSS token linter (`npm run lint:css`) on every push and pull request to `main`, preventing hardcoded values and ensuring design system compliance.
            </p>
            <div className="atomic-completion-metrics">
              <div className="atomic-completion-metric">
                <span className="atomic-completion-metric-label">Checks Added</span>
                <span className="atomic-completion-metric-value">Lint & CSS Tokens</span>
              </div>
              <div className="atomic-completion-metric">
                <span className="atomic-completion-metric-label">Workflow</span>
                <span className="atomic-completion-metric-value">GitHub Actions</span>
              </div>
            </div>
          </div>
          <div className="atomic-completion-item">
            <div className="atomic-completion-header">
              <Badge variant="success" size="sm">✓ Completed</Badge>
              <span className="atomic-completion-date">Nov 22, 2025</span>
            </div>
            <h3 className="atomic-completion-title">Rating Tooltips → Popover Atom</h3>
            <p className="atomic-completion-description">
              Migrated RatingDistributionTooltip and StaffRatingTooltip to use Popover atom. Removed custom portal and positioning logic, reducing code complexity while maintaining exact visual design and dark theme styling.
            </p>
            <div className="atomic-completion-metrics">
              <div className="atomic-completion-metric">
                <span className="atomic-completion-metric-label">Components Migrated</span>
                <span className="atomic-completion-metric-value">2</span>
              </div>
              <div className="atomic-completion-metric">
                <span className="atomic-completion-metric-label">Logic Removed</span>
                <span className="atomic-completion-metric-value">Manual Positioning</span>
              </div>
              <div className="atomic-completion-metric">
                <span className="atomic-completion-metric-label">Consistency</span>
                <span className="atomic-completion-metric-value">Atomic</span>
              </div>
            </div>
          </div>
          <div className="atomic-completion-item">
            <div className="atomic-completion-header">
              <Badge variant="success" size="sm">✓ Completed</Badge>
              <span className="atomic-completion-date">Nov 22, 2025</span>
            </div>
            <h3 className="atomic-completion-title">Create Popover Atom</h3>
            <p className="atomic-completion-description">
              Created new Popover atom for rich content and interactive overlays. Supports click/hover triggers, auto-positioning, and portal rendering. Will standardize complex tooltips like RatingDistributionTooltip.
            </p>
            <div className="atomic-completion-metrics">
              <div className="atomic-completion-metric">
                <span className="atomic-completion-metric-label">New Atom</span>
                <span className="atomic-completion-metric-value">Popover</span>
              </div>
              <div className="atomic-completion-metric">
                <span className="atomic-completion-metric-label">Key Features</span>
                <span className="atomic-completion-metric-value">Portals, Positioning, Interactive</span>
              </div>
            </div>
          </div>
          <div className="atomic-completion-item">
            <div className="atomic-completion-header">
              <Badge variant="success" size="sm">✓ Completed</Badge>
              <span className="atomic-completion-date">Nov 22, 2025</span>
            </div>
            <h3 className="atomic-completion-title">UserReviews → Badge Atom (All Badges)</h3>
            <p className="atomic-completion-description">
              Migrated ALL custom badges to use the Badge atom: verification badges (Owner, Verified Owner, Documents Verified) and relationship badges (Current Owner, Previous Owner, Leased, Rented, Test Drove, Passenger). Replaced 9 custom badge implementations with standardized Badge component.
            </p>
            <div className="atomic-completion-metrics">
              <div className="atomic-completion-metric">
                <span className="atomic-completion-metric-label">CSS Eliminated</span>
                <span className="atomic-completion-metric-value">55 lines</span>
              </div>
              <div className="atomic-completion-metric">
                <span className="atomic-completion-metric-label">Badge Types Migrated</span>
                <span className="atomic-completion-metric-value">9 types</span>
              </div>
              <div className="atomic-completion-metric">
                <span className="atomic-completion-metric-label">Badge Variants Used</span>
                <span className="atomic-completion-metric-value">3</span>
              </div>
            </div>
          </div>
          <div className="atomic-completion-item">
            <div className="atomic-completion-header">
              <Badge variant="success" size="sm">✓ Completed</Badge>
              <span className="atomic-completion-date">Nov 22, 2025</span>
            </div>
            <h3 className="atomic-completion-title">5 Card Components → CardShell Atom</h3>
            <p className="atomic-completion-description">
              Migrated HorizontalCard, VerticalCard, HeroCard, ProfileCompletionCard, and SubscriptionItem to use CardShell atom. Eliminated 60+ CSS property declarations across all components (padding, background, border, border-radius, box-shadow, hover effects, transitions). These components are used throughout the app for news, videos, profiles, and subscriptions.
            </p>
            <div className="atomic-completion-metrics">
              <div className="atomic-completion-metric">
                <span className="atomic-completion-metric-label">Components Migrated</span>
                <span className="atomic-completion-metric-value">5</span>
              </div>
              <div className="atomic-completion-metric">
                <span className="atomic-completion-metric-label">CSS Properties Eliminated</span>
                <span className="atomic-completion-metric-value">60+</span>
              </div>
              <div className="atomic-completion-metric">
                <span className="atomic-completion-metric-label">Impact</span>
                <span className="atomic-completion-metric-value">High</span>
              </div>
            </div>
          </div>
          <div className="atomic-completion-item">
            <div className="atomic-completion-header">
              <Badge variant="success" size="sm">✓ Completed</Badge>
              <span className="atomic-completion-date">Nov 22, 2025</span>
            </div>
            <h3 className="atomic-completion-title">Card → CardShell Atom</h3>
            <p className="atomic-completion-description">
              Migrated Card component to use CardShell atom for consistent wrapper styling. Eliminated 20+ CSS property declarations (padding, background, border, border-radius, box-shadow, hover effects). Card is used extensively across the app for vehicle displays, making this a high-impact migration.
            </p>
            <div className="atomic-completion-metrics">
              <div className="atomic-completion-metric">
                <span className="atomic-completion-metric-label">CSS Properties Eliminated</span>
                <span className="atomic-completion-metric-value">20+</span>
              </div>
              <div className="atomic-completion-metric">
                <span className="atomic-completion-metric-label">Components Affected</span>
                <span className="atomic-completion-metric-value">5+ sections</span>
              </div>
              <div className="atomic-completion-metric">
                <span className="atomic-completion-metric-label">Impact</span>
                <span className="atomic-completion-metric-value">High</span>
              </div>
            </div>
          </div>
          <div className="atomic-completion-item">
            <div className="atomic-completion-header">
              <Badge variant="success" size="sm">✓ Completed</Badge>
              <span className="atomic-completion-date">Nov 22, 2025</span>
            </div>
            <h3 className="atomic-completion-title">WriteReviewModal → Badge Atom</h3>
            <p className="atomic-completion-description">
              Migrated optional label badges to use Badge atom with info variant and outline style. Replaced 2 custom badge implementations with standardized Badge component.
            </p>
            <div className="atomic-completion-metrics">
              <div className="atomic-completion-metric">
                <span className="atomic-completion-metric-label">CSS Eliminated</span>
                <span className="atomic-completion-metric-value">7 lines</span>
              </div>
              <div className="atomic-completion-metric">
                <span className="atomic-completion-metric-label">Badge Instances</span>
                <span className="atomic-completion-metric-value">2</span>
              </div>
              <div className="atomic-completion-metric">
                <span className="atomic-completion-metric-label">Badge Style</span>
                <span className="atomic-completion-metric-value">Outline</span>
              </div>
            </div>
          </div>
          <div className="atomic-completion-item">
            <div className="atomic-completion-header">
              <Badge variant="success" size="sm">✓ Completed</Badge>
              <span className="atomic-completion-date">Nov 22, 2025</span>
            </div>
            <h3 className="atomic-completion-title">ArticleScoreCard → Badge Atom</h3>
            <p className="atomic-completion-description">
              Migrated award badge ("Best Compact") to use Badge atom with premium variant and trophy icon. Maintains visual design while eliminating custom badge CSS.
            </p>
            <div className="atomic-completion-metrics">
              <div className="atomic-completion-metric">
                <span className="atomic-completion-metric-label">CSS Eliminated</span>
                <span className="atomic-completion-metric-value">11 lines</span>
              </div>
              <div className="atomic-completion-metric">
                <span className="atomic-completion-metric-label">Badge Variant</span>
                <span className="atomic-completion-metric-value">Premium</span>
              </div>
            </div>
          </div>
          <div className="atomic-completion-item">
            <div className="atomic-completion-header">
              <Badge variant="success" size="sm">✓ Completed</Badge>
              <span className="atomic-completion-date">Nov 22, 2025</span>
            </div>
            <h3 className="atomic-completion-title">GlobalHeader → Badge Atom</h3>
            <p className="atomic-completion-description">
              Replaced blinking notification dot with Badge atom (error variant) showing profile completion count. Enhanced UX with actual notification count instead of generic indicator.
            </p>
            <div className="atomic-completion-metrics">
              <div className="atomic-completion-metric">
                <span className="atomic-completion-metric-label">CSS Eliminated</span>
                <span className="atomic-completion-metric-value">12 lines</span>
              </div>
              <div className="atomic-completion-metric">
                <span className="atomic-completion-metric-label">UX Improvement</span>
                <span className="atomic-completion-metric-value">Count visible</span>
              </div>
            </div>
          </div>
          <div className="atomic-completion-item">
            <div className="atomic-completion-header">
              <Badge variant="success" size="sm">✓ Completed</Badge>
              <span className="atomic-completion-date">Nov 22, 2025</span>
            </div>
            <h3 className="atomic-completion-title">StickyRateBar → Badge Atom</h3>
            <p className="atomic-completion-description">
              Migrated custom rating badge to use Badge atom (premium variant with custom styling). Eliminated duplicate badge CSS while maintaining visual design.
            </p>
            <div className="atomic-completion-metrics">
              <div className="atomic-completion-metric">
                <span className="atomic-completion-metric-label">CSS Eliminated</span>
                <span className="atomic-completion-metric-value">18 lines</span>
              </div>
              <div className="atomic-completion-metric">
                <span className="atomic-completion-metric-label">High-Visibility</span>
                <span className="atomic-completion-metric-value">All pages</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="atomic-audit-section atomic-audit-section--roadmap" id="roadmap">
        <div className="atomic-audit-section__header">
          <h2>Next steps</h2>
          <p>Actions to close the audit loop.</p>
        </div>
        <ol>
          {nextSteps.map((step) => (
            <li key={step}>{step}</li>
          ))}
        </ol>
      </section>
      </div>
    </div>
  );
};

export default AtomicDesignAudit;

