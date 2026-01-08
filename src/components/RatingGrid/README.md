# RatingGrid Component

A 3-column, 2-row grid layout component for displaying vehicle ratings in a clean, organized format.

## Layout Structure

```
┌─────────────────────┬─────────────────────┬─────────────────────┐
│  MT Logo + Score    │  User Review Stars  │  Rate Vehicle Stars │
│  [MT] 9.2/10        │  ★★★★★              │  ☆☆☆☆☆              │
├─────────────────────┼─────────────────────┼─────────────────────┤
│  MotorTrend Rating  │  User Reviews 4.5/5 │  Rate This Vehicle  │
└─────────────────────┴─────────────────────┴─────────────────────┘
```

## Features

- **Column 1 (MotorTrend Rating)**: MT logo with score on 0-10 scale
- **Column 2 (User Reviews)**: 5-star display with average rating badge
- **Column 3 (Rate This Vehicle)**: Interactive 5-star rating input
- Dark background with light text for contrast
- Fully responsive (mobile, tablet, desktop)
- Follows MotorTrend design system tokens

## Usage

```tsx
import { RatingGrid } from '../../components/RatingGrid';

<RatingGrid
  motorTrendRating={9.2}
  userReviewsRating={4.5}
  userReviewsCount={25}
  onRateClick={() => {
    // Handle user rating submission
    console.log('User clicked to rate');
  }}
/>
```

## Props

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `motorTrendRating` | `number` | Yes | - | MotorTrend staff rating (0-10 scale) |
| `userReviewsRating` | `number` | Yes | - | Average user rating (0-5 scale) |
| `userReviewsCount` | `number` | No | `0` | Number of user reviews |
| `onRateClick` | `() => void` | No | - | Callback when user clicks to rate |
| `className` | `string` | No | `''` | Additional CSS classes |

## Design System Compliance

### Colors
- Background: `var(--color-neutrals-1)` (#141416)
- Primary text: `var(--color-neutrals-8)` (#FCFCFD)
- Secondary text: `var(--color-neutrals-5)` (#B1B5C3)
- Stars: `var(--color-primary-1)` (#E90C17)

### Typography
- Score: `var(--font-heading)` (Poppins), Bold, 32px
- Labels: `var(--font-body)` (Geist), Regular, 14px
- Badge: `var(--font-body)` (Geist), Semibold, 12px

### Spacing
- Padding: `var(--spacing-3)` (24px)
- Gap between columns: `var(--spacing-3)` (24px)
- Gap between rows: `var(--spacing-2)` (16px)
- Internal gaps: `var(--spacing-1)` (8px)

### Effects
- Border radius: `var(--border-radius-md)` (8px)
- Transitions: `var(--transition-fast)` (150ms)

## Responsive Behavior

### Mobile (≤768px)
- Reduced padding: 16px
- Smaller logo: 24x24px
- Smaller score: 24px
- Smaller stars: 20x20px
- Smaller labels: 12px

### Tablet (769px-1024px)
- Medium logo: 28x28px
- Medium score: 28px
- Medium stars: 22x22px

### Desktop (≥1025px)
- Full size (default)

## Interactive Features

### Rate This Vehicle (Column 3)
- Hover over stars to preview rating
- Click star to set rating
- Triggers `onRateClick` callback
- Visual feedback with scale transform

## Integration Example

```tsx
// In Welcome page
import { RatingGrid } from '../../components/RatingGrid';

<RatingGrid
  motorTrendRating={9.2}
  userReviewsRating={4.5}
  userReviewsCount={25}
  onRateClick={() => {
    setRatingModal({
      isOpen: true,
      vehicleName: vehicles[0].name,
      currentRating: 0
    });
  }}
/>
```

## Accessibility

- Semantic HTML structure
- Clear visual hierarchy
- Sufficient color contrast (WCAG AA compliant)
- Interactive elements have hover states
- Click targets meet minimum size requirements (44x44px on mobile)

## Browser Support

- Modern browsers (Chrome, Firefox, Safari, Edge)
- CSS Grid support required
- SVG support required

## Related Components

- `RatingModal` - For detailed rating submission
- `StickyRateBar` - Alternative rating display format
- `ArticleScoreCard` - Article-specific rating display






