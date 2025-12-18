# @motortrend/navigation

MotorTrend Global Header Navigation Component - a standalone navigation package for use across MotorTrend applications.

## Installation

```bash
# From npm (after publishing)
npm install @motortrend/navigation

# Or link locally during development
cd packages/navigation
npm link
# In your other app:
npm link @motortrend/navigation
```

## Quick Start

```tsx
import { GlobalHeader } from '@motortrend/navigation';
import '@motortrend/navigation/styles';

function App() {
  return (
    <div>
      <GlobalHeader />
      {/* Your app content */}
    </div>
  );
}
```

## Prerequisites

The consuming app must have:

1. **React Router DOM v6+** installed and configured
2. **Material Icons** font loaded (included in styles.css)
3. **CSS Variables** from the design system (included in styles.css)

### Required Peer Dependencies

```json
{
  "react": ">=18.0.0",
  "react-dom": ">=18.0.0",
  "react-router-dom": ">=6.0.0"
}
```

## Usage

### Basic Usage (No Search)

```tsx
import { GlobalHeader } from '@motortrend/navigation';
import '@motortrend/navigation/styles';

function App() {
  return (
    <BrowserRouter>
      <GlobalHeader />
    </BrowserRouter>
  );
}
```

### With Custom Search Handler

```tsx
import { GlobalHeader } from '@motortrend/navigation';

function App() {
  return (
    <BrowserRouter>
      <GlobalHeader
        onSearch={(query) => {
          // Handle search - return results array
          return fetch(`/api/search?q=${query}`).then(res => res.json());
        }}
        onSearchResultClick={(result) => {
          // Navigate to result
          navigate(`/vehicles/${result.slug}`);
        }}
      />
    </BrowserRouter>
  );
}
```

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `onSignInClick` | `() => void` | - | Called when Sign In button is clicked |
| `onProfileClick` | `() => void` | - | Called when profile menu item is clicked |
| `isAuthenticated` | `boolean` | `false` | Controls authentication state display |

## Exported Components

- `GlobalHeader` - Main navigation component
- `Icon` - Material Icons wrapper
- `Badge` - Semantic badge component

## Styling

Import the required styles:

```tsx
// Option 1: Import in your entry file
import '@motortrend/navigation/styles';

// Option 2: Import in CSS/SCSS
@import '@motortrend/navigation/dist/styles.css';
```

### Customizing CSS Variables

Override the design tokens in your app:

```css
:root {
  /* Override primary color */
  --color-primary-1: #your-brand-color;
  
  /* Override fonts */
  --font-heading: 'Your Font', sans-serif;
  --font-body: 'Your Body Font', sans-serif;
}
```

## Development

```bash
cd packages/navigation

# Build the package
npm run build

# Watch mode for development
npm run dev
```

## Project Structure

```
packages/navigation/
├── src/
│   ├── components/
│   │   ├── GlobalHeader.tsx
│   │   ├── Icon.tsx
│   │   └── Badge.tsx
│   ├── types.ts
│   ├── styles.css
│   └── index.ts
├── package.json
├── tsconfig.json
└── README.md
```

## Notes

- The component uses **React Router DOM** for navigation links
- Vehicle search functionality requires implementing your own search handler
- The component is fully responsive (mobile, tablet, desktop)
- All styles use CSS variables from the MotorTrend design system















