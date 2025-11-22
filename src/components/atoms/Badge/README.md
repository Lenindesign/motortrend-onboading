# Badge Atom

The `Badge` atom provides standardized badge/label components with semantic color variants for consistent status indicators, labels, and tags across the application.

---

## Purpose

- **Semantic Meaning:** Color variants convey specific meanings (new, premium, verified, etc.)
- **Consistency:** All badges use the same design tokens and styling
- **Accessibility:** Built-in ARIA support and keyboard navigation for interactive badges
- **Flexibility:** Multiple sizes, outline variants, and icon support
- **Maintainability:** Single source of truth for all badge styling

---

## When to Use Badge

✅ **Use Badge when:**
- Displaying status indicators (new, verified, premium)
- Showing notification counts or alerts
- Labeling content categories or types
- Highlighting important information
- Creating interactive tags or filters

❌ **Don't use Badge for:**
- Large blocks of text (use appropriate text elements)
- Primary call-to-action buttons (use Button component)
- Navigation items (use appropriate nav components)

---

## Basic Usage

```tsx
import { Badge } from '../../components/atoms/Badge';

// Simple badge
<Badge variant="new">New</Badge>

// Badge with icon
<Badge variant="verified" icon={<Icon name="check" size={14} />}>
  Verified
</Badge>

// Clickable badge
<Badge variant="info" onClick={() => console.log('Clicked')}>
  Click me
</Badge>

// Outline badge
<Badge variant="success" outline={true}>
  Outline Style
</Badge>
```

---

## Props

### `children` (required)
- **Type:** `React.ReactNode`
- **Description:** Badge content (usually text)

```tsx
<Badge variant="new">New Feature</Badge>
<Badge variant="premium">Premium</Badge>
```

---

### `variant`
- **Type:** `'new' | 'premium' | 'verified' | 'info' | 'success' | 'warning' | 'error' | 'neutral'`
- **Default:** `'neutral'`
- **Description:** Semantic color variant

```tsx
// New content indicator
<Badge variant="new">New</Badge>

// Premium/paid content
<Badge variant="premium">Premium</Badge>

// Verified/trusted indicator
<Badge variant="verified">Verified</Badge>

// Informational
<Badge variant="info">Info</Badge>

// Success state
<Badge variant="success">Success</Badge>

// Warning state
<Badge variant="warning">Warning</Badge>

// Error state
<Badge variant="error">Error</Badge>

// Neutral/default
<Badge variant="neutral">Neutral</Badge>
```

**Semantic Meanings:**
- `new` - Fresh content, new features, recently added
- `premium` - Paid content, exclusive features, premium tier
- `verified` - Verified users, trusted content, authenticated
- `info` - General information, tips, notes
- `success` - Successful actions, completed states, positive feedback
- `warning` - Cautions, important notices, pending actions
- `error` - Errors, failures, critical issues
- `neutral` - Default state, general labels, categories

---

### `size`
- **Type:** `'sm' | 'md' | 'lg'`
- **Default:** `'md'`
- **Description:** Badge size

```tsx
// Small (11px font, 4px 8px padding)
<Badge size="sm" variant="new">Small</Badge>

// Medium (12px font, 6px 12px padding) - Default
<Badge size="md" variant="new">Medium</Badge>

// Large (14px font, 8px 16px padding)
<Badge size="lg" variant="new">Large</Badge>
```

---

### `icon`
- **Type:** `React.ReactNode`
- **Optional**
- **Description:** Icon to display before text

```tsx
import Icon from '../Icon';

<Badge variant="verified" icon={<Icon name="check" size={14} />}>
  Verified
</Badge>

<Badge variant="premium" icon={<Icon name="star" size={14} />}>
  Premium
</Badge>

<Badge variant="info" icon={<Icon name="info" size={14} />}>
  Info
</Badge>
```

---

### `outline`
- **Type:** `boolean`
- **Default:** `false`
- **Description:** Use outline/ghost style instead of filled

```tsx
// Filled (default)
<Badge variant="success">Filled</Badge>

// Outline
<Badge variant="success" outline={true}>Outline</Badge>
```

**Outline Style:**
- Transparent background
- Colored border and text
- Lighter appearance
- Good for secondary badges

---

### `onClick`
- **Type:** `() => void`
- **Optional**
- **Description:** Makes badge interactive (clickable)

```tsx
<Badge 
  variant="info" 
  onClick={() => console.log('Badge clicked')}
>
  Click me
</Badge>
```

**Interactive Behavior:**
- Renders as `<button>` element
- Adds hover and active states
- Supports keyboard navigation (Enter/Space)
- Prevents event bubbling
- Shows focus indicator

---

### `className`
- **Type:** `string`
- **Optional**
- **Description:** Additional CSS classes

```tsx
<Badge variant="new" className="my-custom-class">
  Custom Badge
</Badge>
```

---

### `aria-label`
- **Type:** `string`
- **Optional**
- **Description:** Accessible label for screen readers

```tsx
<Badge 
  variant="verified" 
  icon={<Icon name="check" />}
  aria-label="Verified by MotorTrend"
>
  Verified
</Badge>
```

---

## Variant Examples

### New Badge
```tsx
<Badge variant="new">New</Badge>
<Badge variant="new" size="sm">New</Badge>
<Badge variant="new" outline={true}>New</Badge>
```
**Color:** Orange/Amber (#FFB74D)  
**Use:** New content, features, or vehicles

---

### Premium Badge
```tsx
<Badge variant="premium">Premium</Badge>
<Badge variant="premium" icon={<Icon name="star" />}>Premium</Badge>
```
**Color:** Gold gradient  
**Use:** Premium content, paid features, exclusive access

---

### Verified Badge
```tsx
<Badge variant="verified">Verified</Badge>
<Badge variant="verified" icon={<Icon name="check" />}>Verified</Badge>
```
**Color:** Green  
**Use:** Verified users, authenticated content, trusted sources

---

### Info Badge
```tsx
<Badge variant="info">Info</Badge>
<Badge variant="info" icon={<Icon name="info" />}>Info</Badge>
```
**Color:** Blue  
**Use:** General information, tips, helpful notes

---

### Success Badge
```tsx
<Badge variant="success">Success</Badge>
<Badge variant="success" icon={<Icon name="check_circle" />}>Success</Badge>
```
**Color:** Green  
**Use:** Successful actions, completed tasks, positive feedback

---

### Warning Badge
```tsx
<Badge variant="warning">Warning</Badge>
<Badge variant="warning" icon={<Icon name="warning" />}>Warning</Badge>
```
**Color:** Orange/Yellow  
**Use:** Warnings, important notices, pending actions

---

### Error Badge
```tsx
<Badge variant="error">Error</Badge>
<Badge variant="error" icon={<Icon name="error" />}>Error</Badge>
```
**Color:** Red  
**Use:** Errors, failures, critical issues

---

### Neutral Badge
```tsx
<Badge variant="neutral">Category</Badge>
<Badge variant="neutral" outline={true}>Tag</Badge>
```
**Color:** Gray  
**Use:** General labels, categories, tags

---

## Common Patterns

### Pattern 1: Status Indicator

```tsx
<div style={{ display: 'flex', gap: 'var(--spacing-1)', alignItems: 'center' }}>
  <h3>2025 BMW 3-Series</h3>
  <Badge variant="new">New</Badge>
  <Badge variant="verified" icon={<Icon name="check" size={12} />}>
    Verified
  </Badge>
</div>
```

---

### Pattern 2: Multiple Badges

```tsx
<div style={{ display: 'flex', gap: 'var(--spacing-1)', flexWrap: 'wrap' }}>
  <Badge variant="premium">Premium</Badge>
  <Badge variant="new">New</Badge>
  <Badge variant="info" outline={true}>Electric</Badge>
  <Badge variant="neutral" outline={true}>Sedan</Badge>
</div>
```

---

### Pattern 3: Interactive Filter Tags

```tsx
const [selectedTags, setSelectedTags] = useState<string[]>([]);

<div style={{ display: 'flex', gap: 'var(--spacing-1)', flexWrap: 'wrap' }}>
  {tags.map(tag => (
    <Badge
      key={tag}
      variant={selectedTags.includes(tag) ? 'info' : 'neutral'}
      outline={!selectedTags.includes(tag)}
      onClick={() => toggleTag(tag)}
    >
      {tag}
    </Badge>
  ))}
</div>
```

---

### Pattern 4: Notification Count

```tsx
<button style={{ position: 'relative' }}>
  <Icon name="notifications" size={24} />
  <Badge 
    variant="error" 
    size="sm"
    style={{ 
      position: 'absolute', 
      top: -4, 
      right: -4 
    }}
  >
    3
  </Badge>
</button>
```

---

### Pattern 5: User Verification

```tsx
<div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-1)' }}>
  <img src={user.avatar} alt={user.name} />
  <span>{user.name}</span>
  {user.isVerified && (
    <Badge 
      variant="verified" 
      size="sm"
      icon={<Icon name="check" size={12} />}
      aria-label="Verified user"
    />
  )}
</div>
```

---

### Pattern 6: Article Category

```tsx
<article>
  <Badge variant="info" outline={true}>Reviews</Badge>
  <h2>2025 BMW 3-Series Review</h2>
  <p>Article content...</p>
</article>
```

---

## Accessibility Features

### Screen Reader Support
- **role="status"** for non-interactive badges
- **button** element for clickable badges
- **aria-label** for additional context

### Keyboard Navigation
- **Tab:** Focus on clickable badges
- **Enter/Space:** Activate badge (if onClick provided)
- **Focus indicator:** Visible outline on focus

### High Contrast Mode
- Adds border for better visibility
- Outline badges get thicker border

### Reduced Motion
- Respects `prefers-reduced-motion`
- Disables hover animations

---

## Design Tokens Used

### Colors
- `--color-neutrals-1` through `--color-neutrals-7` - Neutral variants
- `--color-semantic-success` - Success badge
- `--color-semantic-success-light` - Success outline background
- `--color-semantic-success-dark` - Success outline text
- `--color-semantic-warning` - Warning badge
- `--color-semantic-warning-light` - Warning outline background
- `--color-semantic-warning-dark` - Warning outline text
- `--color-semantic-error` - Error badge
- `--color-semantic-error-light` - Error outline background
- `--color-semantic-error-dark` - Error outline text
- `--color-semantic-info` - Info badge
- `--color-white` - Text color for dark badges
- `--color-primary-1` - Focus outline

### Spacing
- `--spacing-gap-xs` (4px) - Icon gap
- Custom padding per size (4px-8px, 6px-12px, 8px-16px)

### Typography
- `--font-body` - Font family
- `--font-weight-medium` - Default weight
- `--font-weight-bold` - Premium variant

### Border Radius
- `--border-radius-sm` (4px) - Badge corners

### Transitions
- `--transition-fast` (0.2s) - Hover and focus

---

## Migration Guide

### Before (Custom Badge Implementation)

```tsx
// Old custom badge
<span className="custom-badge custom-badge--new">New</span>
```

```css
/* Old custom CSS */
.custom-badge {
  display: inline-block;
  padding: 6px 12px;
  font-size: 12px;
  font-weight: 600;
  border-radius: 4px;
}

.custom-badge--new {
  background-color: #FFB74D;
  color: #141416;
}

.custom-badge--verified {
  background-color: #34A853;
  color: white;
}
```

### After (Using Badge Atom)

```tsx
// New with Badge atom
<Badge variant="new">New</Badge>
<Badge variant="verified">Verified</Badge>
```

**Benefits:**
- ✅ No custom CSS needed
- ✅ Consistent with design system
- ✅ Accessibility built-in
- ✅ Multiple variants available
- ✅ Easy to maintain

---

## Component-Specific Migration

### StickyRateBar
```tsx
// Before
<span className="rating-badge">4.5</span>

// After
<Badge variant="info" size="sm">4.5</Badge>
```

### UserReviews
```tsx
// Before
<span className="verified-badge">VIN Verified</span>

// After
<Badge variant="verified" icon={<Icon name="check" size={12} />}>
  VIN Verified
</Badge>
```

### GlobalHeader
```tsx
// Before
<span className="notification-count">3</span>

// After
<Badge variant="error" size="sm">3</Badge>
```

### ArticleScoreCard
```tsx
// Before
<span className="award-badge">Award Winner</span>

// After
<Badge variant="premium" icon={<Icon name="trophy" size={14} />}>
  Award Winner
</Badge>
```

### WriteReviewModal
```tsx
// Before
<span className="tip-label">Tip</span>

// After
<Badge variant="info" outline={true}>Tip</Badge>
```

---

## Anti-Patterns

### ❌ DON'T: Use for large text blocks

```tsx
// Bad
<Badge variant="info">
  This is a very long message that should not be in a badge
  because badges are meant for short labels and status indicators.
</Badge>
```

**Why:** Badges are for short labels, not paragraphs.

**Instead:** Use appropriate text elements or alert components.

---

### ❌ DON'T: Override semantic colors

```tsx
// Bad
<Badge variant="success" style={{ backgroundColor: 'red' }}>
  Error
</Badge>
```

**Why:** Breaks semantic meaning and consistency.

**Instead:** Use the correct variant.

```tsx
// Good
<Badge variant="error">Error</Badge>
```

---

### ❌ DON'T: Nest badges

```tsx
// Bad
<Badge variant="new">
  <Badge variant="premium">Premium</Badge>
</Badge>
```

**Why:** Creates visual confusion and accessibility issues.

**Instead:** Place badges side by side.

```tsx
// Good
<div style={{ display: 'flex', gap: 'var(--spacing-1)' }}>
  <Badge variant="new">New</Badge>
  <Badge variant="premium">Premium</Badge>
</div>
```

---

## Browser Support

- ✅ Chrome/Edge (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest)
- ✅ Mobile browsers (iOS Safari, Chrome Mobile)

---

## Performance

- **Lightweight:** ~1.5KB gzipped
- **Efficient:** Minimal re-renders
- **Optimized:** CSS transitions only

---

## Related Components

- **CardShell** - Often contains badges
- **ModalShell** - May use badges for status
- **Tooltip** - Can wrap badges for additional info
- **Icon** - Often used with badges

---

## Testing

### Visual Testing
```tsx
// Test all variants
<Badge variant="new">New</Badge>
<Badge variant="premium">Premium</Badge>
<Badge variant="verified">Verified</Badge>
<Badge variant="info">Info</Badge>
<Badge variant="success">Success</Badge>
<Badge variant="warning">Warning</Badge>
<Badge variant="error">Error</Badge>
<Badge variant="neutral">Neutral</Badge>

// Test all sizes
<Badge size="sm">Small</Badge>
<Badge size="md">Medium</Badge>
<Badge size="lg">Large</Badge>

// Test outline variants
<Badge variant="success" outline={true}>Outline</Badge>

// Test with icons
<Badge variant="verified" icon={<Icon name="check" />}>
  With Icon
</Badge>
```

### Accessibility Testing
- Test keyboard navigation (Tab, Enter, Space)
- Test screen reader announcements
- Test focus indicators
- Test in high contrast mode

---

## Questions?

- Review the [Atom Composition Guide](/docs/ATOM_COMPOSITION_GUIDE.md)
- Check the [Token Governance](/docs/TOKEN_GOVERNANCE.md) documentation
- See the [Atomic Design Audit](/documentation/atomic-design-audit) page

---

**Badge is the foundation for consistent status indicators across the entire application!** 🏷️✨

