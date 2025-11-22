# Atom Composition Guide

A comprehensive guide for composing molecules and organisms using our atomic design system atoms. This guide ensures consistency and prevents duplicate implementations across the codebase.

---

## Table of Contents

1. [ModalShell Atom](#modalshell-atom)
2. [CardShell Atom](#cardshell-atom)
3. [Badge Atom](#badge-atom)
4. [Tooltip Atom](#tooltip-atom)
5. [Composition Patterns](#composition-patterns)
6. [Anti-Patterns](#anti-patterns)

---

## ModalShell Atom

### Purpose
Provides standardized modal wrapper with overlay, shadow, animations, and behavior (escape key, body scroll lock, click-outside).

### When to Use
✅ **Use ModalShell when:**
- Creating any modal, dialog, or overlay
- Building confirmation dialogs
- Creating side drawers or panels
- Building full-screen overlays (galleries, lightboxes)

❌ **Don't use ModalShell for:**
- Inline dropdowns (use Tooltip or custom dropdown)
- Toast notifications that don't block interaction
- Popovers that don't need full overlay

### Basic Usage

```tsx
import { ModalShell } from '../atoms/ModalShell';

export const ConfirmationModal: React.FC<Props> = ({ isOpen, onClose, onConfirm }) => {
  return (
    <ModalShell isOpen={isOpen} onClose={onClose} maxWidth="480px">
      <div className="confirmation-modal__content">
        <h2>Confirm Action</h2>
        <p>Are you sure you want to proceed?</p>
        <div className="confirmation-modal__actions">
          <button onClick={onConfirm}>Confirm</button>
          <button onClick={onClose}>Cancel</button>
        </div>
      </div>
    </ModalShell>
  );
};
```

### Advanced Patterns

#### Side Drawer Modal
```tsx
<ModalShell
  isOpen={isOpen}
  onClose={onClose}
  position="side-right"
  animation="slide-right"
  maxWidth="400px"
>
  <div className="drawer__header">
    <h2>Settings</h2>
    <button onClick={onClose}>×</button>
  </div>
  <div className="drawer__content">
    {/* Drawer content */}
  </div>
</ModalShell>
```

#### Full-Screen Gallery
```tsx
<ModalShell
  isOpen={isOpen}
  onClose={onClose}
  overlayVariant="dark"
  maxWidth="100vw"
  maxHeight="100vh"
  closeOnEscape={true}
>
  <div className="gallery__controls">
    <button onClick={handlePrevious}>←</button>
    <button onClick={handleNext}>→</button>
  </div>
  <img src={currentImage} alt="Gallery" />
</ModalShell>
```

#### Custom z-index for Nested Modals
```tsx
<ModalShell
  isOpen={isOpen}
  onClose={onClose}
  zIndex={2000}  // Higher than default 1000
>
  {/* Modal content */}
</ModalShell>
```

### Styling Your Modal Content

The ModalShell handles the wrapper, you style the content:

```css
/* ✅ Good: Style your content, not the wrapper */
.my-modal__content {
  padding: var(--spacing-5);
  display: flex;
  flex-direction: column;
  gap: var(--spacing-3);
}

.my-modal__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: var(--spacing-3);
  border-bottom: 1px solid var(--color-neutrals-6);
}

/* ❌ Bad: Don't try to override ModalShell styles */
.modal-shell__overlay {
  background: red !important; /* Don't do this */
}
```

### Props Reference

| Prop | Type | Default | Use Case |
|------|------|---------|----------|
| `overlayVariant` | `'medium' \| 'dark'` | `'medium'` | Use `'dark'` for galleries/immersive experiences |
| `position` | `'center' \| 'side-right'` | `'center'` | Use `'side-right'` for settings/form drawers |
| `animation` | `'fade-slide' \| 'slide-right'` | `'fade-slide'` | Match animation to position |
| `closeOnOverlayClick` | `boolean` | `true` | Set to `false` for critical confirmations |
| `closeOnEscape` | `boolean` | `true` | Set to `false` if you need custom escape handling |

---

## CardShell Atom

### Purpose
Provides standardized card container with consistent padding, border-radius, shadows, and hover states using design tokens.

### When to Use
✅ **Use CardShell when:**
- Creating any card-based component
- Building list items that need elevation
- Creating content containers
- Building interactive tiles

❌ **Don't use CardShell for:**
- Full-page sections (use semantic HTML)
- Inline text containers
- Navigation bars

### Basic Usage

```tsx
import { CardShell } from '../atoms/CardShell';

export const ArticleCard: React.FC<Props> = ({ article }) => {
  return (
    <CardShell hasHover={true} padding="md">
      <img src={article.image} alt={article.title} />
      <h3>{article.title}</h3>
      <p>{article.excerpt}</p>
    </CardShell>
  );
};
```

### Padding Variants

```tsx
// Small padding (12px) - for compact cards
<CardShell padding="sm">
  <Badge variant="new">New</Badge>
  <p>Compact content</p>
</CardShell>

// Medium padding (16px) - default, most common
<CardShell padding="md">
  <h3>Standard Card</h3>
  <p>Regular content</p>
</CardShell>

// Large padding (24px) - for featured cards
<CardShell padding="lg">
  <h2>Featured Content</h2>
  <p>More spacious layout</p>
</CardShell>
```

### Hover States

```tsx
// Interactive card with hover effect
<CardShell hasHover={true} padding="md">
  <a href="/article/123">
    <h3>Clickable Article</h3>
  </a>
</CardShell>

// Static card without hover
<CardShell hasHover={false} padding="md">
  <h3>Information Card</h3>
  <p>Non-interactive content</p>
</CardShell>
```

### Composition with Other Atoms

```tsx
// Card with Badge and Tooltip
<CardShell hasHover={true} padding="md">
  <div className="card__header">
    <Badge variant="premium">Premium</Badge>
    <Tooltip content="More info">
      <Icon name="info" size={16} />
    </Tooltip>
  </div>
  <h3>Premium Article</h3>
  <p>Exclusive content</p>
</CardShell>
```

### Styling Within CardShell

```css
/* ✅ Good: CardShell handles container, you handle layout */
.article-card__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--spacing-2);
}

.article-card__image {
  width: 100%;
  aspect-ratio: 16 / 9;
  border-radius: var(--border-radius-sm);
  margin-bottom: var(--spacing-2);
}

/* ❌ Bad: Don't duplicate CardShell's job */
.article-card {
  padding: 16px; /* CardShell already handles this */
  border-radius: 8px; /* CardShell already handles this */
  box-shadow: 0 2px 4px rgba(0,0,0,0.1); /* CardShell already handles this */
}
```

### Design Tokens Used

- `--spacing-card-sm` (12px)
- `--spacing-card-md` (16px)
- `--spacing-card-lg` (24px)
- `--border-radius-md`
- `--shadow-card`
- `--shadow-card-hover`

---

## Badge Atom

### Purpose
Provides standardized status indicators, labels, and tags with consistent styling and semantic meaning.

### When to Use
✅ **Use Badge when:**
- Indicating status (new, premium, verified)
- Showing categories or tags
- Displaying counts or notifications
- Highlighting important information

❌ **Don't use Badge for:**
- Primary CTAs (use buttons)
- Long text labels (use proper text elements)
- Interactive elements (unless wrapped in button)

### Variants

```tsx
import { Badge } from '../atoms/Badge';

// Status indicators
<Badge variant="new">New</Badge>
<Badge variant="premium">Premium</Badge>
<Badge variant="verified">Verified</Badge>

// Informational
<Badge variant="info">Info</Badge>
<Badge variant="warning">Warning</Badge>
<Badge variant="error">Error</Badge>
<Badge variant="success">Success</Badge>

// Categories
<Badge variant="category">Electric</Badge>
<Badge variant="category">SUV</Badge>
```

### Size Variants

```tsx
// Small badge (for compact spaces)
<Badge variant="new" size="sm">New</Badge>

// Default size
<Badge variant="premium">Premium</Badge>

// Large badge (for emphasis)
<Badge variant="verified" size="lg">Verified</Badge>
```

### Composition Patterns

#### In Card Headers
```tsx
<CardShell hasHover={true} padding="md">
  <div className="card__badges">
    <Badge variant="premium">Premium</Badge>
    <Badge variant="new">New</Badge>
  </div>
  <h3>Article Title</h3>
</CardShell>
```

#### With Icons
```tsx
<Badge variant="verified">
  <Icon name="check_circle" size={14} />
  <span>Verified</span>
</Badge>
```

#### In Lists
```tsx
<ul className="feature-list">
  <li>
    <Badge variant="success">✓</Badge>
    <span>Feature included</span>
  </li>
  <li>
    <Badge variant="error">✗</Badge>
    <span>Not available</span>
  </li>
</ul>
```

#### Notification Counts
```tsx
<button className="nav-item">
  <Icon name="notifications" size={24} />
  <Badge variant="error" size="sm">3</Badge>
</button>
```

### Styling Guidelines

```css
/* ✅ Good: Position badges, don't restyle them */
.card__badges {
  display: flex;
  gap: var(--spacing-1);
  margin-bottom: var(--spacing-2);
}

.notification-badge {
  position: absolute;
  top: -4px;
  right: -4px;
}

/* ❌ Bad: Don't override badge colors or padding */
.badge {
  background: red !important; /* Don't do this */
  padding: 20px !important; /* Don't do this */
}
```

### Semantic Usage

```tsx
// ✅ Good: Use semantic variants
<Badge variant="premium">Premium Content</Badge>
<Badge variant="new">Just Published</Badge>
<Badge variant="verified">Expert Reviewed</Badge>

// ❌ Bad: Don't misuse variants
<Badge variant="error">Premium</Badge> // Error is for errors, not premium
<Badge variant="success">New</Badge> // Success is for confirmations, not new items
```

---

## Tooltip Atom

### Purpose
Provides contextual help text on hover with consistent styling and positioning.

### When to Use
✅ **Use Tooltip when:**
- Providing additional context on hover
- Explaining icons or abbreviations
- Showing full text for truncated content
- Displaying keyboard shortcuts

❌ **Don't use Tooltip for:**
- Critical information (should be visible)
- Long explanations (use modal or expandable section)
- Mobile-primary interactions (tooltips don't work well on touch)

### Basic Usage

```tsx
import { Tooltip } from '../atoms/Tooltip';

// Wrapping an icon
<Tooltip content="This is a helpful tip">
  <Icon name="info" size={16} />
</Tooltip>

// Wrapping text
<Tooltip content="Full name: MotorTrend Magazine">
  <span>MT Mag</span>
</Tooltip>

// Wrapping a button
<Tooltip content="Save for later">
  <button>
    <Icon name="bookmark" size={20} />
  </button>
</Tooltip>
```

### Positioning

```tsx
// Top (default)
<Tooltip content="Appears above" position="top">
  <Icon name="help" />
</Tooltip>

// Bottom
<Tooltip content="Appears below" position="bottom">
  <Icon name="help" />
</Tooltip>

// Left
<Tooltip content="Appears to the left" position="left">
  <Icon name="help" />
</Tooltip>

// Right
<Tooltip content="Appears to the right" position="right">
  <Icon name="help" />
</Tooltip>
```

### Composition Patterns

#### In Card Headers
```tsx
<CardShell padding="md">
  <div className="card__header">
    <h3>Vehicle Rating</h3>
    <Tooltip content="Based on expert reviews and testing">
      <Icon name="info" size={16} />
    </Tooltip>
  </div>
  <div className="rating">9.2</div>
</CardShell>
```

#### With Badges
```tsx
<div className="badge-with-tooltip">
  <Badge variant="verified">Verified</Badge>
  <Tooltip content="Verified by MotorTrend experts">
    <Icon name="help_outline" size={14} />
  </Tooltip>
</div>
```

#### In Forms
```tsx
<div className="form-field">
  <label>
    Email Address
    <Tooltip content="We'll never share your email">
      <Icon name="privacy_tip" size={16} />
    </Tooltip>
  </label>
  <input type="email" />
</div>
```

#### Explaining Truncated Text
```tsx
<Tooltip content={fullArticleTitle}>
  <h3 className="truncated-title">
    {truncatedTitle}
  </h3>
</Tooltip>
```

### Accessibility Considerations

```tsx
// ✅ Good: Tooltip enhances, doesn't replace
<button aria-label="Save article">
  <Tooltip content="Save for later">
    <Icon name="bookmark" />
  </Tooltip>
</button>

// ❌ Bad: Critical info hidden in tooltip
<button>
  <Tooltip content="This will delete everything!">
    <Icon name="delete" />
  </Tooltip>
</button>
```

### Styling Guidelines

```css
/* ✅ Good: Position tooltip triggers */
.info-icon-with-tooltip {
  display: inline-flex;
  align-items: center;
  margin-left: var(--spacing-1);
  color: var(--color-neutrals-4);
  cursor: help;
}

/* ❌ Bad: Don't override tooltip styles */
.tooltip {
  background: red !important; /* Don't do this */
  font-size: 20px !important; /* Don't do this */
}
```

---

## Composition Patterns

### Pattern 1: Modal with Card Content

```tsx
<ModalShell isOpen={isOpen} onClose={onClose} maxWidth="600px">
  <div className="modal__header">
    <h2>Select Vehicle</h2>
    <button onClick={onClose}>×</button>
  </div>
  <div className="modal__content">
    {vehicles.map(vehicle => (
      <CardShell key={vehicle.id} hasHover={true} padding="sm">
        <div className="vehicle-option">
          <img src={vehicle.image} alt={vehicle.name} />
          <div className="vehicle-info">
            <h4>{vehicle.name}</h4>
            <Badge variant="premium">Premium</Badge>
          </div>
        </div>
      </CardShell>
    ))}
  </div>
</ModalShell>
```

### Pattern 2: Card with Multiple Atoms

```tsx
<CardShell hasHover={true} padding="md">
  <div className="card__header">
    <div className="card__badges">
      <Badge variant="new">New</Badge>
      <Badge variant="premium">Premium</Badge>
    </div>
    <Tooltip content="Expert reviewed">
      <Badge variant="verified">
        <Icon name="verified" size={14} />
      </Badge>
    </Tooltip>
  </div>
  <img src={image} alt={title} />
  <h3>{title}</h3>
  <p>{description}</p>
</CardShell>
```

### Pattern 3: Form in Modal with Tooltips

```tsx
<ModalShell isOpen={isOpen} onClose={onClose} maxWidth="480px">
  <form className="settings-form">
    <h2>Account Settings</h2>
    
    <div className="form-field">
      <label>
        Display Name
        <Tooltip content="This name appears on your reviews">
          <Icon name="help_outline" size={16} />
        </Tooltip>
      </label>
      <input type="text" />
    </div>

    <CardShell padding="sm" hasHover={false}>
      <Badge variant="info">Tip</Badge>
      <p>Your display name is visible to all users</p>
    </CardShell>

    <button type="submit">Save Changes</button>
  </form>
</ModalShell>
```

### Pattern 4: Status Card with Conditional Badges

```tsx
<CardShell hasHover={false} padding="md">
  <div className="status-header">
    <h3>Vehicle Status</h3>
    {isNew && <Badge variant="new">New</Badge>}
    {isPremium && <Badge variant="premium">Premium</Badge>}
    {isVerified && (
      <Tooltip content="Verified by experts">
        <Badge variant="verified">
          <Icon name="check_circle" size={14} />
        </Badge>
      </Tooltip>
    )}
  </div>
  <p className="status-description">{description}</p>
</CardShell>
```

### Pattern 5: VehiclesSection Organism - Composing VehicleCard Molecules

**Real-world example from the codebase showing how organisms compose molecules using shared tokens.**

```tsx
import React from 'react';
import { VehicleCard } from '../VehicleCard';
import './VehiclesSection.css';

export const VehiclesSection: React.FC<VehiclesSectionProps> = ({
  title,
  vehicles,
}) => {
  return (
    <section className="vehicles-section">
      {/* Header with tokenized typography */}
      <div className="vehicles-section__header">
        <h2 className="vehicles-section__title">{title}</h2>
        
        {/* Filter buttons using shared tokens */}
        <div className="vehicles-section__filters">
          {categories.map(category => (
            <button
              key={category}
              className={`vehicles-section__filter-btn ${
                activeFilter === category ? 'vehicles-section__filter-btn--active' : ''
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of VehicleCard molecules */}
      <div className="vehicles-section__grid">
        {vehicles.map((vehicle) => (
          <VehicleCard
            key={vehicle.name}
            image={vehicle.image}
            name={vehicle.name}
            rating1={vehicle.staffRating}
            rating2={vehicle.communityRating}
            onBookmark={() => handleBookmark(vehicle.name)}
            onViewDetails={() => handleViewDetails(vehicle.name)}
            onRate={() => handleRate(vehicle.name)}
          />
        ))}
      </div>

      {/* Display More button with tokens */}
      <div className="vehicles-section__display-more">
        <button className="vehicles-section__display-more-btn">
          <span>Display More</span>
          <Icon name="keyboard_arrow_down" size={20} />
        </button>
      </div>
    </section>
  );
};
```

**Shared tokens used across VehiclesSection:**

```css
/* VehiclesSection.css - All tokens, no hardcoded values */
.vehicles-section {
  width: 100%;
  margin-bottom: var(--section-spacing-vertical);
  padding: 0;
}

.vehicles-section__title {
  font-family: var(--font-heading);
  font-weight: var(--font-weight-bold);
  font-size: 24px;
  line-height: 1.2em;
  color: var(--color-neutrals-1);
  margin: 0 0 var(--spacing-2) 0;
}

.vehicles-section__filter-btn {
  padding: 6px 16px;
  background-color: var(--color-neutrals-8);
  border: 1px solid var(--color-neutrals-6);
  border-radius: var(--border-radius-sm);
  font-family: var(--font-body);
  font-size: 14px;
  font-weight: var(--font-weight-medium);
  color: var(--color-neutrals-2);
  transition: all var(--transition-fast);
}

.vehicles-section__filter-btn--active {
  background-color: var(--color-neutrals-3);
  border-color: var(--color-neutrals-3);
  color: var(--color-neutrals-8);
}

.vehicles-section__grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: var(--spacing-3);
  width: 100%;
}

.vehicles-section__display-more-btn {
  padding: 12px 16px;
  border: 1px solid var(--color-neutrals-6);
  border-radius: var(--border-radius-md);
  font-family: var(--font-body);
  font-size: 16px;
  font-weight: var(--font-weight-medium);
  color: var(--color-neutrals-2);
  transition: all var(--transition-fast);
  gap: var(--spacing-2);
}
```

**Key composition principles:**
- ✅ VehiclesSection (organism) composes multiple VehicleCard (molecules)
- ✅ All spacing uses tokens: `--spacing-2`, `--spacing-3`, `--section-spacing-vertical`
- ✅ All colors use tokens: `--color-neutrals-*` palette
- ✅ All typography uses tokens: `--font-heading`, `--font-body`, `--font-weight-*`
- ✅ All transitions use tokens: `--transition-fast`
- ✅ All border-radius uses tokens: `--border-radius-sm`, `--border-radius-md`
- ✅ Grid layout with tokenized gaps ensures consistent spacing between cards

---

### Pattern 6: NewsSection Organism - Composing River with HorizontalCard Molecules

**Real-world example showing how organisms compose complex molecules using shared tokens.**

```tsx
import React from 'react';
import { River, type RiverItem } from '../River';
import './NewsSection.css';

export const NewsSection: React.FC<NewsSectionProps> = ({
  title,
  items,
}) => {
  return (
    <section className="news-section">
      {/* Header with tokenized typography */}
      <h2 className="news-section__title">{title}</h2>
      
      {/* River component (molecule) that composes HorizontalCard molecules */}
      <River items={items} />
    </section>
  );
};
```

**River molecule composing HorizontalCard molecules:**

```tsx
// River.tsx - Molecule that composes other molecules
export const River: React.FC<RiverProps> = ({ items }) => {
  return (
    <div className="river">
      {items.map((item, index) => (
        <HorizontalCard
          key={index}
          imageUrl={item.imageUrl}
          title={item.title}
          author={item.author}
          date={item.date}
          category={item.category}
          onClick={item.onClick}
        />
      ))}
    </div>
  );
};
```

**Shared tokens used across NewsSection and River:**

```css
/* NewsSection.css - Organism styles */
.news-section {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-3);
  width: 100%;
  padding: 0;
}

.news-section__title {
  font-family: var(--font-heading);
  font-weight: var(--font-weight-bold);
  font-size: 24px;
  line-height: 1.2em;
  color: var(--color-neutrals-1);
  margin: 0;
}

/* River.css - Molecule styles */
.river {
  display: flex;
  flex-direction: column;
  width: 100%;
  gap: var(--spacing-3);
  padding: 0;
  background: var(--color-neutrals-8);
}

/* HorizontalCard.css - Molecule styles */
.horizontal-card {
  display: flex;
  gap: var(--spacing-3);
  padding: var(--spacing-3);
  background: var(--color-white);
  border-radius: var(--border-radius-md);
  transition: transform var(--transition-fast);
  cursor: pointer;
}

.horizontal-card:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-card-hover);
}

.horizontal-card__image-container {
  flex-shrink: 0;
  width: 352px;
  aspect-ratio: 16 / 9;
  overflow: hidden;
  border-radius: var(--border-radius-md);
  background-color: var(--color-neutrals-7);
  margin-left: 16px;
}

.horizontal-card__content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: var(--spacing-1);
  padding-right: 16px;
}

.horizontal-card__title {
  font-family: var(--font-heading);
  font-weight: var(--font-weight-bold);
  font-size: 20px;
  line-height: 1.3em;
  color: var(--color-neutrals-1);
  margin: 0;
}

.horizontal-card__meta {
  display: flex;
  align-items: center;
  gap: var(--spacing-1);
  font-size: 14px;
  color: var(--color-neutrals-4);
}
```

**Key composition principles:**
- ✅ NewsSection (organism) → River (molecule) → HorizontalCard (molecule)
- ✅ Three-level composition hierarchy using shared tokens
- ✅ All spacing uses tokens: `--spacing-1`, `--spacing-3`
- ✅ All colors use tokens: `--color-neutrals-*`, `--color-white`
- ✅ All typography uses tokens: `--font-heading`, `--font-body`, `--font-weight-*`
- ✅ All transitions use tokens: `--transition-fast`
- ✅ All shadows use tokens: `--shadow-card-hover`
- ✅ All border-radius uses tokens: `--border-radius-md`
- ✅ Consistent gap spacing between cards creates visual rhythm

---

### Pattern 7: Page-Level Composition - Organisms Working Together

**Real-world example from LatestNews page showing how multiple organisms compose together:**

```tsx
import React from 'react';
import { HeroPlusThree } from '../../components/HeroPlusThree';
import { VehiclesSection } from '../../components/VehiclesSection';
import { NewsSection } from '../../components/NewsSection';
import { AdContainer } from '../../components/AdContainer';

const LatestNews: React.FC = () => {
  return (
    <div className="latest-news">
      <div className="latest-news__container">
        {/* Organism 1: HeroPlusThree (HeroCard + VerticalCards) */}
        <div className="latest-news__section">
          <div className="latest-news__left-column">
            <HeroPlusThree
              hero={heroData}
              cards={verticalCards}
            />
          </div>
          <div className="latest-news__right-column">
            <AdContainer />
          </div>
        </div>

        {/* Organism 2: VehiclesSection (VehicleCard grid) */}
        <div className="latest-news__section">
          <div className="latest-news__left-column">
            <VehiclesSection
              title="Newest Vehicles"
              vehicles={vehiclesData}
            />
          </div>
          <div className="latest-news__right-column">
            <AdContainer />
          </div>
        </div>

        {/* Organism 3: NewsSection (River with HorizontalCards) */}
        <div className="latest-news__section">
          <div className="latest-news__left-column">
            <NewsSection
              title="Latest Articles"
              items={newsItems}
            />
          </div>
          <div className="latest-news__right-column">
            <AdContainer />
          </div>
        </div>
      </div>
    </div>
  );
};
```

**Page-level tokens for consistent layout:**

```css
/* Page container uses tokens for consistent spacing */
.latest-news__container {
  max-width: var(--container-max-width);
  margin: 0 auto;
  padding: var(--spacing-4) var(--spacing-3);
}

.latest-news__section {
  display: grid;
  grid-template-columns: 1fr 300px;
  gap: var(--spacing-4);
  margin-bottom: var(--section-spacing-vertical);
}

.latest-news__left-column {
  min-width: 0; /* Prevents grid blowout */
}
```

**Key composition principles:**
- ✅ Page composes multiple organisms (HeroPlusThree, VehiclesSection, NewsSection)
- ✅ Each organism composes molecules (HeroCard, VerticalCard, VehicleCard, River, HorizontalCard)
- ✅ All organisms share the same token system for consistency
- ✅ Grid layout uses tokenized gaps: `--spacing-4`
- ✅ Vertical spacing uses: `--section-spacing-vertical`
- ✅ Container uses: `--container-max-width`, `--spacing-3`, `--spacing-4`
- ✅ Every level of composition uses tokens - no hardcoded values anywhere

---

## Anti-Patterns

### ❌ Don't Recreate Atom Functionality

```tsx
// ❌ BAD: Recreating ModalShell
const MyModal = () => (
  <div className="my-custom-overlay" onClick={handleClose}>
    <div className="my-custom-modal">
      {/* content */}
    </div>
  </div>
);

// ✅ GOOD: Use ModalShell
const MyModal = () => (
  <ModalShell isOpen={isOpen} onClose={handleClose}>
    {/* content */}
  </ModalShell>
);
```

### ❌ Don't Override Atom Styles with !important

```css
/* ❌ BAD */
.badge {
  background: red !important;
  padding: 30px !important;
}

/* ✅ GOOD: Use variants or create new atom */
<Badge variant="error">Error</Badge>
```

### ❌ Don't Nest Atoms Incorrectly

```tsx
// ❌ BAD: Badge inside Tooltip content
<Tooltip content={<Badge variant="new">New</Badge>}>
  <span>Hover me</span>
</Tooltip>

// ✅ GOOD: Tooltip wraps Badge
<Tooltip content="This is new">
  <Badge variant="new">New</Badge>
</Tooltip>
```

### ❌ Don't Use Wrong Atom for the Job

```tsx
// ❌ BAD: Using Badge as button
<Badge variant="primary" onClick={handleClick}>
  Click me
</Badge>

// ✅ GOOD: Use proper button
<button className="cta-button" onClick={handleClick}>
  Click me
</button>
```

### ❌ Don't Duplicate Padding/Spacing

```tsx
// ❌ BAD: Adding padding when CardShell already has it
<CardShell padding="md">
  <div style={{ padding: '16px' }}>
    Content
  </div>
</CardShell>

// ✅ GOOD: Let CardShell handle padding
<CardShell padding="md">
  <div>Content</div>
</CardShell>
```

---

## Design Token Reference

### Spacing Tokens
- `--spacing-1` (4px) - Minimal gap
- `--spacing-2` (8px) - Small gap
- `--spacing-3` (16px) - Standard gap
- `--spacing-4` (24px) - Large gap
- `--spacing-5` (32px) - Extra large gap

### Card-Specific Spacing
- `--spacing-card-sm` (12px)
- `--spacing-card-md` (16px)
- `--spacing-card-lg` (24px)

### Shadow Tokens
- `--shadow-card` - Standard card elevation
- `--shadow-card-hover` - Hover state elevation
- `--shadow-modal` - Modal elevation
- `--shadow-depth-1` through `--shadow-depth-5` - Various depths

### Border Radius
- `--border-radius-sm` (4px) - Small elements
- `--border-radius-md` (8px) - Standard (cards, buttons)
- `--border-radius-lg` (12px) - Large containers
- `--border-radius-xl` (24px) - Extra large (modals)

### Overlay Colors
- `--color-overlay-light` - rgba(0, 0, 0, 0.3)
- `--color-overlay-medium` - rgba(0, 0, 0, 0.5)
- `--color-overlay-dark` - rgba(0, 0, 0, 0.95)

---

## Quick Reference Checklist

Before creating a new component, ask:

- [ ] Am I creating a modal? → Use **ModalShell**
- [ ] Am I creating a card? → Use **CardShell**
- [ ] Am I showing a status/label? → Use **Badge**
- [ ] Am I adding help text? → Use **Tooltip**
- [ ] Am I using design tokens for spacing? → Check token reference
- [ ] Am I duplicating existing atom functionality? → Reuse atoms
- [ ] Am I overriding atom styles? → Use variants or create new atom
- [ ] Is my component composing atoms properly? → Review patterns

---

## Getting Help

- **See examples**: Check `/src/pages/AtomicDesignAudit` for live examples
- **Read atom docs**: Each atom has a README in its directory
- **Check refactored components**: SavedModal and ReviewSubmittedToast show ModalShell usage
- **Review design tokens**: See `/src/styles/tokens.css` for all available tokens

---

**Last Updated**: November 2025  
**Maintained By**: MotorTrend Design System Team

