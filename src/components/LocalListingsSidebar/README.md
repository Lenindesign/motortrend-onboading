# LocalListingsSidebar Component

A sidebar component that displays local vehicle listings with dealer information, pricing, and vehicle details.

## Features

- **Responsive Design**: Sticky positioning on desktop, static on mobile
- **Rich Listing Cards**: Each listing includes:
  - Vehicle image with CPO badge (if applicable)
  - Year, make, model, and trim
  - Condition (New, Used, Certified Pre-Owned)
  - Price and mileage
  - Dealer name and location
  - Distance from user
  - Exterior and interior colors
  - View Details CTA button
- **Empty State**: Displays helpful message when no listings are available
- **View All Button**: Shows total listing count and provides action to view all

## Usage

```tsx
import { LocalListingsSidebar } from '../../components/LocalListingsSidebar';
import { getLocalListings } from '../../utils/localListings';

// In your component:
const localListings = getLocalListings(year, make, model, vehicleImage);

<LocalListingsSidebar
  vehicleName="Honda Civic"
  listings={localListings}
  onViewAllListings={() => {
    // Handle view all action
  }}
/>
```

## Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `vehicleName` | `string` | Yes | Name of the vehicle (e.g., "Honda Civic") |
| `listings` | `LocalListing[]` | Yes | Array of local listing objects |
| `onViewAllListings` | `() => void` | No | Callback when "View All" button is clicked |

## LocalListing Interface

```typescript
interface LocalListing {
  id: string;
  dealerName: string;
  price: number;
  mileage: number;
  year: string;
  condition: 'New' | 'Used' | 'Certified Pre-Owned';
  location: string;
  distance: number;
  imageUrl: string;
  trim?: string;
  exteriorColor?: string;
  interiorColor?: string;
  vin?: string;
  stockNumber?: string;
}
```

## Styling

The component uses design tokens from the design system:
- Colors: `--color-surface-*`, `--color-text-*`, `--color-accent-primary`
- Spacing: `--spacing-*`
- Typography: `--font-family-heading`, `--font-size-*`
- Borders: `--radius-*`, `--color-border-*`
- Shadows: `--shadow-sm`, `--shadow-md`

## Responsive Behavior

- **Desktop (>1024px)**: Sticky sidebar that follows scroll
- **Tablet (768px-1024px)**: Static positioning
- **Mobile (<768px)**: Reduced padding and font sizes

## Data Generation

The `getLocalListings()` utility function generates realistic sample data:
- Mix of new, used, and CPO vehicles
- Realistic pricing based on condition
- Various dealer names and locations
- Random but plausible mileage
- Color combinations
- VIN and stock numbers

## Integration

Currently integrated in:
- `VehicleDetails` page (right sidebar)

## Future Enhancements

- Real API integration for actual dealer inventory
- Filtering and sorting options
- Map view of dealer locations
- Save/compare listings functionality
- Direct contact dealer buttons
- Financing calculator integration




































