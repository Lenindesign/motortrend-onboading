# TopTenCarousel Component

A reusable carousel component that displays the top 10 vehicles with filtering capabilities by vehicle type and subcategory.

## Features

- **Two-Level Filtering**: Filter by vehicle type (SUV, Sedan, Truck, Coupe) and subcategory (Subcompact, Compact, Midsize, Full-Size, Luxury, Performance, Electric)
- **Auto-Advancing**: Automatically cycles through vehicles every 5 seconds
- **Keyboard Navigation**: Use arrow keys to navigate when hovering over the carousel
- **Responsive Design**: Adapts to different screen sizes with optimized layouts
- **Smart Categorization**: Automatically categorizes vehicles based on their make, model, and characteristics
- **Seamless Category Switching**: When reaching the end of a category, automatically switches to the next subcategory

## Usage

```tsx
import { TopTenCarousel } from '../../components/TopTenCarousel';

function MyPage() {
  return (
    <div>
      <TopTenCarousel className="my-custom-class" />
    </div>
  );
}
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `className` | `string` | `''` | Optional CSS class name for custom styling |

## Vehicle Categorization

The component automatically categorizes vehicles into subcategories based on:

1. **Electric Vehicles**: Prioritized based on model keywords (e.g., "electric", "ev", "e-tron", "taycan")
2. **Size Categories**: Subcompact, Compact, Midsize, Full-Size (based on model names)
3. **Luxury**: Based on brand (Mercedes, BMW, Audi, Lexus, etc.)
4. **Performance**: Based on keywords (sport, GT, turbo, AMG, Type R, etc.)

## Navigation

- **Mouse**: Click the left/right arrow buttons
- **Keyboard**: Use arrow keys when hovering over the carousel
- **Auto-Advance**: Pauses when hovering, resumes when mouse leaves
- **Dots**: Click on dots to jump to a specific vehicle

## Responsive Breakpoints

- **Desktop (>1024px)**: 16:9 aspect ratio, full features
- **Tablet (768px-1024px)**: 4:3 aspect ratio, adjusted layout
- **Mobile (<768px)**: 3:4 aspect ratio, stacked layout

## Integration

This component is used in:
- Home page (for Car Buyers persona)
- Vehicle Inventory page (replacing the old hero slider)

## Data Source

The component fetches vehicle data from `vehiclesApi.ts` and uses the following utilities:
- `getVehicleBodyStyle()` for vehicle type classification
- `parseVehicleName()` for extracting year, make, and model
- `vehicleImageFor()` as fallback for vehicle images



































