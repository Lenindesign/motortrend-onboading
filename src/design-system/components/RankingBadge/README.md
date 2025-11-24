# RankingBadge Component

A reusable ranking badge component with Apple-inspired glassmorphism design. Used to display ranking numbers (1-10) consistently across the application.

## Usage

```tsx
import { RankingBadge } from '../../design-system/components/RankingBadge';

// Inline usage (e.g., in carousel)
<RankingBadge rank={1} size="small" position="inline" />

// Overlay usage (e.g., on article images)
<RankingBadge rank={5} size="medium" position="overlay" />

// Large size
<RankingBadge rank={10} size="large" position="overlay" />
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `rank` | `number` | Required | The ranking number to display (1-10) |
| `size` | `'small' \| 'medium' \| 'large'` | `'medium'` | Size variant of the badge |
| `position` | `'inline' \| 'overlay'` | `'inline'` | Position variant - inline for text flow, overlay for absolute positioning |
| `className` | `string` | `''` | Additional CSS class names |

## Size Variants

### Small
- Best for: Compact displays, inline text
- Font size: 24px
- Padding: 4px 12px

### Medium (Default)
- Best for: Article images, standard displays
- Font size: 64px (# symbol: 36px)
- Padding: 12px 24px
- Responsive: Scales down to 48px on mobile

### Large
- Best for: Hero sections, prominent displays
- Font size: 80px (# symbol: 48px)
- Padding: 16px 32px

## Position Variants

### Inline
- `display: inline-flex`
- Flows with surrounding content
- Use in: Text content, lists, inline elements

### Overlay
- `position: absolute`
- Positioned at top-center of parent
- Use in: Image overlays, hero sections
- Requires parent with `position: relative`

## Design System Compliance

This component uses:
- ✅ Design system color tokens (`--color-white`)
- ✅ Design system spacing tokens (`--spacing-*`)
- ✅ Design system border radius tokens (`--border-radius-*`)
- ✅ Design system font tokens (`--font-heading`)
- ✅ Design system transition tokens (`--transition-fast`)

## Styling

The component features:
- **Glassmorphism**: Semi-transparent background with backdrop blur
- **Apple-inspired design**: Clean, modern aesthetic
- **Responsive**: Automatically scales on mobile devices
- **Hover effects**: Subtle interaction feedback
- **Accessibility**: High contrast white text on dark background

## Examples

### Top 10 Article Images
```tsx
<div className="article__image-wrapper">
  <RankingBadge rank={3} size="medium" position="overlay" />
  <img src="vehicle.jpg" alt="Vehicle" />
</div>
```

### Carousel Integration
```tsx
<h2 className="carousel__title">
  <RankingBadge rank={1} size="small" position="inline" />
  2025 Tesla Model 3
</h2>
```

## Browser Support

- ✅ Modern browsers (Chrome, Firefox, Safari, Edge)
- ✅ Backdrop filter with fallback
- ✅ Responsive design
- ✅ Touch-friendly sizing

## Related Components

- `Badge` - For status and category indicators
- `TopTenCarousel` - Uses RankingBadge for vehicle rankings
- `Article` - Uses RankingBadge for Top 10 article images

