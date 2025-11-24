# Marketcheck API - Photo Support

## 📸 Photos Included!

The Marketcheck API integration **already includes photos** for each listing.

## What You Get

### Photo Data Structure

Each listing includes:

```typescript
{
  imageUrl: string;        // Primary photo (first in array)
  photoUrls?: string[];    // ALL available photos (10-30+ per listing)
}
```

### Typical Photo Count
- **New vehicles**: 15-30 photos
- **Used vehicles**: 10-20 photos
- **Certified Pre-Owned**: 20-30 photos

### Photo Types Included
- ✅ Exterior (front, rear, sides)
- ✅ Interior (dashboard, seats, cargo)
- ✅ Engine bay
- ✅ Wheels/tires
- ✅ Detail shots
- ✅ Dashboard/infotainment

### Photo Quality
- **Resolution**: Typically 640x480 or higher
- **Format**: JPEG
- **Hosted**: On Marketcheck's CDN (fast loading)

## Current Implementation

### LocalListingsSidebar
Currently shows **one photo** per listing (the primary image).

### Data Available
All photos are fetched and stored in `photoUrls` array, ready to use.

## Enhancement Ideas

### Option 1: Photo Gallery on Click
Add a lightbox/modal to view all photos when clicking a listing image.

### Option 2: Photo Carousel
Show a mini carousel of 3-4 photos for each listing.

### Option 3: Hover Preview
Show next photo on hover (like many car sites do).

### Option 4: Thumbnail Strip
Show small thumbnails below the main image.

## Example API Response

```json
{
  "media": {
    "photo_links": [
      "https://cdn.marketcheck.com/img1.jpg",  // Front exterior
      "https://cdn.marketcheck.com/img2.jpg",  // Rear exterior
      "https://cdn.marketcheck.com/img3.jpg",  // Driver side
      "https://cdn.marketcheck.com/img4.jpg",  // Passenger side
      "https://cdn.marketcheck.com/img5.jpg",  // Interior dashboard
      "https://cdn.marketcheck.com/img6.jpg",  // Front seats
      "https://cdn.marketcheck.com/img7.jpg",  // Rear seats
      "https://cdn.marketcheck.com/img8.jpg",  // Cargo area
      "https://cdn.marketcheck.com/img9.jpg",  // Engine
      "https://cdn.marketcheck.com/img10.jpg"  // Wheels
      // ... typically 10-30 total photos
    ]
  }
}
```

## Mock Data Photos

For mock data (when API is not configured), we use:
- Vehicle images from your existing image database
- Same image for all listings of that vehicle model
- Still provides a good user experience

## Want to Add a Photo Gallery?

I can implement any of these options:

1. **Simple Lightbox** - Click to view all photos in fullscreen
2. **Inline Carousel** - Swipe through photos in the sidebar
3. **Hover Preview** - Show next photo on hover
4. **Thumbnail Grid** - Show all photos as small thumbnails

Just let me know which you prefer! 📸

## Testing Photos

To see real photos:
1. Add your Marketcheck API key to `.env`
2. Visit any vehicle details page
3. Check the LocalListingsSidebar
4. Open browser console and look for the `photoUrls` array in the listing data

```javascript
// In console, you'll see:
{
  imageUrl: "https://cdn.marketcheck.com/...",
  photoUrls: [
    "https://cdn.marketcheck.com/photo1.jpg",
    "https://cdn.marketcheck.com/photo2.jpg",
    // ... 10-30 photos
  ]
}
```

## Photo Loading

Photos are:
- ✅ Lazy loaded (only loads when visible)
- ✅ Cached by browser
- ✅ Optimized for fast loading
- ✅ Hosted on CDN (Marketcheck's servers)


