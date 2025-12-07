# Car Buyers Layout Customization

## Overview
Implemented personalized layout for the **Car Buyers** persona (Practical Paula) on the Home page.

## Changes Made

### 1. Persona Detection
- Added `isCarBuyers` check based on `personaName === 'Practical Paula'`
- This allows conditional rendering of sections based on user persona

### 2. Layout Modifications for Car Buyers (Practical Paula)

#### **Carousel Moved to Top**
- The Top Ten vehicle carousel now appears **first** on the page for Car Buyers
- Includes all carousel functionality:
  - Vehicle type dropdown (SUVs, Sedans, Trucks, Coupes, Wagons)
  - Subcategory dropdown (All, Subcompact, Compact, Mid-Size, Full-Size, Heavy-Duty)
  - Auto-advancing slides
  - Navigation arrows and dots
  - Expand to fullscreen
  - MotorTrend Rating and User Reviews
  - "See Local Listings" CTA

#### **Hero Plus Three Section Hidden**
- The HeroPlusThree component is **hidden** for Car Buyers
- This section still displays for all other personas and non-logged-in users

### 3. Default Layout (All Other Personas)
For non-Car Buyers personas and guests:
1. Hero + 3 Cards (top)
2. Latest From MotorTrend
3. Vehicles Section
4. Rankings & Awards
5. Top Ten Carousel
6. Additional news sections

### 4. Car Buyers Layout (Practical Paula)
For Car Buyers persona:
1. **Top Ten Carousel (moved to top)** ⭐
2. Latest From MotorTrend
3. Vehicles Section
4. Rankings & Awards
5. Additional news sections

## Technical Implementation

### File Modified
- `/src/pages/Home/Home.tsx`

### Key Code Changes

```typescript
// Check if user is Practical Paula (Car Buyers persona)
const isCarBuyers = personaName === 'Practical Paula';

// Carousel at top for Car Buyers
{isCarBuyers && carouselVehicles.length > 0 && (
  <div className="home__section home__section--full-width">
    {/* Full carousel implementation */}
  </div>
)}

// Hero Plus Three hidden for Car Buyers
{!isCarBuyers && (
  <div className="home__section">
    <HeroPlusThree ... />
  </div>
)}

// Original carousel position hidden for Car Buyers
{!isCarBuyers && carouselVehicles.length > 0 && (
  <div className="home__section home__section--full-width">
    {/* Carousel in original position */}
  </div>
)}
```

## User Experience

### For Car Buyers (Practical Paula)
- **Immediate focus on vehicles**: The carousel showcases top-rated vehicles right at the top
- **Data-driven decisions**: MotorTrend ratings and user reviews are prominently displayed
- **Quick access to listings**: "See Local Listings" CTA is readily available
- **Less editorial content**: Hero articles are de-emphasized in favor of vehicle data

### For Other Personas
- Standard layout with editorial content (Hero + 3 Cards) at the top
- Carousel appears in its original position after several content sections
- Balanced mix of articles, news, and vehicle information

## Testing

To test the Car Buyers layout:
1. Complete onboarding flow and select options that lead to "Practical Paula" persona
2. Or manually set in localStorage:
   ```javascript
   localStorage.setItem('onboardingData', JSON.stringify({
     persona: 'Practical Paula',
     userType: 'buyer'
   }));
   ```
3. Refresh the home page
4. Verify carousel appears at top and Hero Plus Three is hidden

## Future Enhancements

Potential improvements:
- Add more persona-specific customizations
- A/B test different layouts for Car Buyers
- Add analytics to track engagement with top carousel
- Consider adding a "Compare Vehicles" CTA for Car Buyers
- Personalize vehicle recommendations based on user preferences

## Related Files
- `/src/utils/personas.ts` - Persona definitions
- `/src/pages/Home/Home.tsx` - Home page layout
- `/src/pages/Home/Home.css` - Carousel styling

---

**Status**: ✅ Complete
**Build**: ✅ Passing
**Date**: November 23, 2024















