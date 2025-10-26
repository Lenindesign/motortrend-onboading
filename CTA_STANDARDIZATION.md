# CTA Standardization Guide

## Overview
This document outlines the standardized Call-to-Action (CTA) system implemented across the entire application to ensure consistency, accessibility, and maintainability.

## CTA System Architecture

### 1. Global CTA Classes (`.cta`)
Located in `src/design-system/global.css`, these utility classes provide a foundation for all CTAs:

```css
.cta {
  /* Base CTA styling */
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  border: none;
  border-radius: var(--border-radius-sm);
  font-family: var(--font-body);
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}
```

### 2. Button Component (`src/design-system/components/Button/`)
React component with TypeScript support for consistent CTA implementation.

## CTA Sizes

| Size | Class | Padding | Font Size | Height | Use Case |
|------|-------|---------|-----------|--------|----------|
| Small | `.cta--small` | 6px 12px | 12px | 28px | Compact spaces, secondary actions |
| Default | `.cta--default` | 8px 16px | 14px | 36px | Standard CTAs, most common |
| Large | `.cta--large` | 12px 24px | 16px | 44px | Primary actions, hero sections |

## CTA Colors & Meanings

### Primary Actions (`.cta--primary`)
- **Color**: `var(--color-primary-1)` (Red)
- **Use**: Main call-to-action, primary user flows
- **Examples**: "Sign Up", "Get Started", "Complete Profile"

### Secondary Actions (`.cta--secondary`)
- **Color**: `#353945` (Dark Gray)
- **Use**: Secondary actions, alternative options
- **Examples**: "Learn More", "View Details", "Browse"

### Neutral Actions (`.cta--neutral`)
- **Color**: `var(--color-neutrals-5)` (Medium Gray)
- **Use**: Subtle actions, less important CTAs
- **Examples**: "Cancel", "Skip", "Maybe Later"

### Success Actions (`.cta--success`)
- **Color**: `#34A853` (Green)
- **Use**: Positive actions, confirmations
- **Examples**: "Save", "Confirm", "Approve"

### Warning Actions (`.cta--warning`)
- **Color**: `#F59E0B` (Orange)
- **Use**: Caution actions, important notices
- **Examples**: "Delete", "Remove", "Warning"

## CTA Variants

### Solid (Default)
```css
.cta--primary { /* Solid background */ }
```

### Ghost
```css
.cta--ghost { /* Transparent background, colored text */ }
```

### Outline
```css
.cta--outline { /* Transparent background, colored border */ }
```

## Implementation Examples

### Using Global CTA Classes
```html
<!-- Primary CTA -->
<button class="cta cta--primary cta--large">Get Started</button>

<!-- Secondary CTA -->
<button class="cta cta--secondary cta--default">Learn More</button>

<!-- Ghost CTA -->
<button class="cta cta--ghost cta--small">Cancel</button>
```

### Using Button Component
```tsx
import { Button } from '@/design-system/components';

// Primary CTA
<Button color="primary" size="large" variant="solid">
  Get Started
</Button>

// Secondary CTA
<Button color="secondary" size="default" variant="solid">
  Learn More
</Button>

// Ghost CTA
<Button color="primary" size="small" variant="ghost">
  Cancel
</Button>
```

## Migration Guide

### Before (Inconsistent)
```css
.custom-button {
  padding: 6px 16px;
  background: #353945;
  font-family: Arial;
  font-weight: 600;
  font-size: 14px;
  height: 34px;
}
```

### After (Standardized)
```css
.cta--secondary {
  padding: 8px 16px;
  background: #353945;
  font-family: var(--font-body);
  font-weight: 600;
  font-size: 14px;
  height: 36px;
}
```

## Accessibility Features

- **Keyboard Navigation**: All CTAs support keyboard interaction
- **Focus States**: Clear focus indicators for keyboard users
- **Screen Reader Support**: Proper ARIA labels and semantic HTML
- **Color Contrast**: WCAG AA compliant color combinations
- **Disabled States**: Clear visual feedback for disabled CTAs

## Responsive Behavior

- **Mobile**: CTAs maintain consistent sizing across devices
- **Touch Targets**: Minimum 44px height for touch accessibility
- **Full Width**: `.cta--full-width` class for mobile-first designs

## Best Practices

1. **Consistency**: Always use the standardized CTA system
2. **Hierarchy**: Use primary CTAs sparingly, secondary for most actions
3. **Clarity**: Use clear, action-oriented text
4. **Placement**: Position CTAs where users expect them
5. **Grouping**: Group related CTAs together with proper spacing

## Component-Specific CTAs

### Profile Section Add Button
```css
.profile-section__add-btn {
  /* Now uses standardized CTA styling */
  @extend .cta, .cta--primary, .cta--large;
}
```

### Comparison Card Button
```css
.comparison-card__button {
  /* Now uses standardized CTA styling */
  @extend .cta, .cta--secondary, .cta--default;
}
```

### Onboarding Navigation
```css
.onboarding-nav-btn {
  /* Now uses standardized CTA styling */
  @extend .cta, .cta--default;
}
```

## Testing Checklist

- [ ] All CTAs use standardized classes or Button component
- [ ] Consistent sizing across all CTAs
- [ ] Proper color hierarchy (primary > secondary > neutral)
- [ ] Accessible keyboard navigation
- [ ] Responsive behavior on mobile devices
- [ ] Hover and focus states work correctly
- [ ] Disabled states are clearly indicated

## Future Enhancements

- [ ] CTA animation system
- [ ] Loading states for async actions
- [ ] Icon integration standards
- [ ] A/B testing framework for CTA optimization
