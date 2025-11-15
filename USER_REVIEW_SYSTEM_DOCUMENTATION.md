# 📝 User Review System Documentation

> **Comprehensive guide for Product Managers and Developers**  
> Last Updated: December 2024  
> Version: 1.0.0

---

## 📋 Table of Contents

- [Overview](#overview)
- [Features & Capabilities](#features--capabilities)
- [Component Architecture](#component-architecture)
- [Data Models](#data-models)
- [User Flows](#user-flows)
- [Design Specifications](#design-specifications)
- [Technical Implementation](#technical-implementation)
- [API Integration Guide](#api-integration-guide)
- [Testing Checklist](#testing-checklist)

---

## 🎯 Overview

The User Review System enables customers to share detailed vehicle reviews with ratings, media, verification, and social interactions. The system supports both creating new reviews and editing existing ones.

### Key Benefits

✅ **Comprehensive Rating System** - Overall ratings (1-10) with 5 category-specific ratings  
✅ **Media Support** - Image and video uploads with preview  
✅ **Verification System** - Multi-tier ownership verification with badges  
✅ **Social Features** - Thumbs up, replies, and sharing capabilities  
✅ **Edit Functionality** - Users can update their reviews with change tracking  
✅ **Auto-Calculation** - Overall rating automatically computed from category ratings  
✅ **Responsive Design** - Mobile-first with desktop optimization

---

## 🚀 Features & Capabilities

### Core Features

#### 1. **Review Creation**
- Overall rating (1-10 scale with decimal support)
- Review title (required)
- Review content with paragraph formatting (required)
- Vehicle model selection
- Media upload (images/videos, multiple files)
- Category ratings (Comfort, Reliability, Interior, Value, Safety)
- Vehicle relationship selection
- Experience duration input
- VIN verification (optional, with confidentiality disclaimer)

#### 2. **Review Editing**
- Edit any field of existing reviews
- Original date preserved
- Updated date timestamp added
- Visual indicator shows when review was modified
- Pre-fills all existing data in edit modal

#### 3. **Rating System**
- **Automatic Calculation**: Category ratings → Overall rating
- **Manual Override**: Users can set overall rating independently
- **Fractional Support**: Ratings support decimals (e.g., 7.5)
- **Smart Sync**: Category changes reset manual mode

#### 4. **Verification System**
Three-tier verification badge system:

| Badge Level | Requirements | Visual |
|------------|--------------|--------|
| **Documents Verified** | VIN number provided | Green badge |
| **Verified Owner** | Reserved for future | Blue badge |
| **Owner** | Vehicle in "Cars I Own" OR relationship = "own" | Gray badge |
| **None** | No verification | No badge |

#### 5. **Vehicle Relationship**
Users can specify their relationship with the vehicle:
- ✅ Currently own
- ✅ Previously owned
- ✅ Leased
- ✅ Rented
- ✅ Test drove
- ✅ Was a passenger

Duration is collected for each relationship type.

#### 6. **Social Interactions**
- **Thumbs Up**: Like reviews (count displayed)
- **Reply**: Comment on reviews
- **Share**: Share review (implementation pending)
- **Edit**: Edit own reviews (visible only to review author)

#### 7. **Smart CTA Button**
The "Write a Vehicle Review" button dynamically changes:
- **First Time**: "Write a Vehicle Review" (opens create modal)
- **After Review**: "Edit Your Review" (opens edit modal)

---

## 🏗️ Component Architecture

### Main Components

```
src/components/
├── UserReviews/
│   ├── UserReviews.tsx          # Main review display component
│   ├── UserReviews.css          # Component styles
│   └── index.ts                 # Exports
├── WriteReviewModal/
│   ├── WriteReviewModal.tsx     # Create/edit review modal
│   ├── WriteReviewModal.css     # Modal styles
│   └── index.ts                 # Exports
└── RatingModal/
    └── RatingModal.tsx          # Overall rating input
```

### Component Hierarchy

```
VehicleDetails Page
└── UserReviews Component
    ├── Rating Modal (overlay)
    ├── Write Review Modal (overlay)
    └── Review List
        └── Review Card
            ├── Reviewer Info
            ├── Title
            ├── Media
            ├── Content (formatted)
            ├── Category Ratings
            ├── Actions
            └── Replies
```

---

## 📊 Data Models

### ReviewData Interface

```typescript
export interface ReviewData {
  // Core Fields
  id: string;                      // Unique review identifier
  reviewerName: string;            // Reviewer's name
  rating: number;                  // Overall rating (1-10, supports decimals)
  title: string;                   // Review title (required)
  content: string;                  // Review body (required, supports paragraphs)
  vehicleType: string;             // Vehicle type
  vehicleModel: string;            // Specific model/variant
  date: string;                    // Original publish date
  updatedDate?: string;             // Last update date (if edited)
  
  // Media
  mediaFiles?: File[];             // Uploaded media files
  mediaPreviews?: string[];        // Preview URLs for display
  
  // Social Features
  thumbsUpCount?: number;          // Number of likes
  isThumbsUp?: boolean;            // Current user's like status
  replies?: ReplyData[];            // Comments/replies
  
  // Category Ratings (1-10 scale)
  categoryRatings?: {
    comfort?: number;              // Comfort rating
    reliability?: number;           // Reliability rating
    interior?: number;              // Interior rating
    value?: number;                 // Value rating
    safety?: number;                // Safety rating
  };
  
  // Verification
  verificationLevel?: VerificationLevel;  // Badge level
  vinNumber?: string;              // VIN (confidential, encrypted in production)
  
  // Relationship
  vehicleRelationship?: VehicleRelationship;  // User's relationship
  experienceDuration?: string;    // How long user experienced vehicle
}
```

### Type Definitions

```typescript
// Verification Levels
type VerificationLevel = 
  | 'none'              // No verification badge
  | 'owner'             // Basic owner badge (gray)
  | 'verified'          // Verified badge (blue)
  | 'verified_documents'; // Highest verification (green)

// Vehicle Relationship
type VehicleRelationship = 
  | 'own'               // Currently own
  | 'previously_owned'  // Previously owned
  | 'leased'            // Leased
  | 'rented'            // Rented
  | 'test_drove'        // Test drove
  | 'passenger';        // Was a passenger

// Reply Data
interface ReplyData {
  id: string;
  replierName: string;
  content: string;
  date: string;
}
```

---

## 🔄 User Flows

### Flow 1: Creating a New Review

```
1. User clicks "Write a Vehicle Review"
   ↓
2. WriteReviewModal opens
   ↓
3. User sets rating (overall or categories)
   ↓
4. User fills required fields:
   - Review Title
   - Review Content
   ↓
5. User optionally adds:
   - Vehicle Relationship
   - Experience Duration
   - VIN Number
   - Category Ratings
   - Media Files
   ↓
6. User clicks "Submit Your Review"
   ↓
7. Review appears at top of list
   ↓
8. CTA button changes to "Edit Your Review"
```

### Flow 2: Editing an Existing Review

```
1. User clicks "Edit Your Review" (CTA or Edit button)
   ↓
2. WriteReviewModal opens in edit mode
   - Title: "Edit Your Review"
   - All fields pre-filled
   ↓
3. User modifies desired fields
   ↓
4. User clicks "Update Review"
   ↓
5. Review updates with:
   - Modified content
   - Original date preserved
   - updatedDate timestamp added
   ↓
6. Review displays "Updated [date]"
```

### Flow 3: Rating Calculation Logic

```
Automatic Mode (Default):
├─ User sets category ratings
└─ Overall rating auto-calculates (average)
    └─ Supports fractional ratings (e.g., 7.5)

Manual Override:
├─ User clicks overall rating stars
├─ Manual mode activated
├─ Category changes reset manual mode
└─ Returns to automatic calculation
```

### Flow 4: Verification Badge Assignment

```
Check Priority:
1. If VIN provided → "Documents Verified" (Green) ✅
2. Else if relationship = "own" → "Owner" (Gray)
3. Else if vehicle in "Cars I Own" → "Owner" (Gray)
4. Else → No badge
```

---

## 🎨 Design Specifications

### Typography

| Element | Font Family | Weight | Size | Line Height | Color |
|---------|------------|--------|------|-------------|-------|
| Review Title | Heading (Poppins) | 600 | 18px | 1.333em | Neutrals-1 |
| Review Content | Body (Geist) | 400 | 16px | 1.6em | Neutrals-2 |
| Paragraph Spacing | - | - | - | 1em | - |
| Reviewer Name | Body (Geist) | 600 | 16px | 1.5em | Neutrals-1 |
| Review Date | Body (Geist) | 400 | 12px | 1.5em | #6E7481 |
| Updated Date | Body (Geist) | 400 | 11px | 1.5em | Neutrals-4 (italic) |
| Overall Rating | Heading (Poppins) | 600 | 24px | 1.375em | Neutrals-1 |
| Category Name | Heading (Poppins) | 600 | 16px | 1.375em | Neutrals-1 |

### Color Palette

#### Neutrals
- **Neutrals-1**: `#1A1A1A` - Headings, high contrast text
- **Neutrals-2**: `#4A4A4A` - Body text
- **Neutrals-3**: `#808080` - Secondary text
- **Neutrals-4**: `#B3B3B3` - Hints, placeholders
- **Neutrals-5**: `#CCCCCC` - Borders
- **Neutrals-6**: `#E5E5E5` - Dividers
- **Neutrals-7**: `#F5F5F5` - Backgrounds

#### Primary
- **Primary-500**: `#33CCFF` - Primary actions
- **Primary-600**: Darker variant for hover states

### Verification Badges

| Badge | Background | Border | Text Color | Icon |
|-------|------------|--------|------------|------|
| **Owner** | Neutrals-7 | 1px Neutrals-5 | Neutrals-2 | Blue star |
| **Verified Owner** | #E3F2FD | 1px #2196F3 | #1976D2 | Blue star |
| **Documents Verified** | #E8F5E9 | 1px #4CAF50 | #2E7D32 | Blue star |

### Spacing System

Based on 8px grid:
- **xs**: 4px
- **sm**: 8px
- **md**: 12px
- **lg**: 16px
- **xl**: 24px
- **2xl**: 32px
- **3xl**: 42px (featured review padding)

### Component Dimensions

#### Review Cards
- **First Card**:
  - Padding: 42px
  - Margin-bottom: 16px
- **Subsequent Cards**:
  - Padding: 16px
  - Margin-bottom: 0px
- **Border Radius**: 8px
- **Background**: White (#FFFFFF)

#### Buttons
- **Edit Button**:
  - Padding: 8px 12px
  - Border-radius: 6px
  - Font: 14px, weight 500
- **CTA Button**:
  - Padding: 12px 16px
  - Border-radius: 8px
  - Font: 14px, weight 500
  - Background: Dark gray (#333333)

#### Media
- **Border-radius**: 8px
- **Max-width**: 100%
- **Margin-bottom**: 16px

### Shadows

- **Card Shadow**: `0px 4px 12px rgba(0, 0, 0, 0.15)`
- **Modal Shadow**: `-4px 0 20px rgba(0, 0, 0, 0.15)`

---

## 💻 Technical Implementation

### Rating Calculation Algorithm

**Location**: `src/utils/ratingUtils.ts`

```typescript
export function computeOverallRating(categoryRatings: {
  comfort?: number;
  reliability?: number;
  interior?: number;
  value?: number;
  safety?: number;
}): number {
  // Filter out undefined/zero ratings
  const ratings = Object.values(categoryRatings).filter(
    (r): r is number => typeof r === 'number' && r > 0
  );
  
  if (ratings.length === 0) return 0;
  
  // Calculate average
  const average = ratings.reduce((sum, r) => sum + r, 0) / ratings.length;
  
  // Round to 1 decimal place for fractional support
  return Math.round(average * 10) / 10;
}
```

### Paragraph Formatting

Review content is automatically formatted into paragraphs:

1. **Primary Split**: Double line breaks (`\n\n`)
2. **Fallback**: Single line breaks (`\n`)
3. **Rendering**: Each paragraph wrapped in `<p>` tag
4. **CSS**: 1em spacing between paragraphs (web standard)

**CSS Implementation**:
```css
.user-reviews__review-content p {
  margin: 0 0 1em 0;  /* 1em = 16px (standard paragraph spacing) */
}

.user-reviews__review-content p:last-child {
  margin-bottom: 0;  /* Remove margin from last paragraph */
}
```

### VIN Storage

VINs stored securely in localStorage:

```typescript
// Storage structure
{
  "vehicleVINs": {
    "2025 BMW 3-Series": {
      "vehicleName": "2025 BMW 3-Series",
      "vin": "WBA123456789ABCDE",
      "timestamp": "2024-12-01T10:30:00.000Z"
    }
  }
}
```

⚠️ **Security Note**: In production, VINs should be encrypted before storage.

### File Handling

**Media Upload**:
- Supported types: `image/*`, `video/*`
- Multiple files supported
- Object URLs created for preview
- URLs revoked on component unmount (memory leak prevention)

**Memory Management**:
```typescript
useEffect(() => {
  return () => {
    // Clean up object URLs
    mediaPreviews.forEach((url) => URL.revokeObjectURL(url));
  };
}, [mediaPreviews]);
```

### Date Formatting

```typescript
const formatDate = (date: Date) => {
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

// Example output: "November 1, 2025"
```

---

## 🔌 API Integration Guide

### Component Usage

```typescript
import { UserReviews } from '../../components/UserReviews';
import WriteReviewModal from '../../components/WriteReviewModal';
import type { ReviewData } from '../../components/UserReviews';

function VehicleDetailsPage() {
  const [reviews, setReviews] = useState<ReviewData[]>([]);
  const [isWriteModalOpen, setIsWriteModalOpen] = useState(false);

  // Handle new review submission
  const handleSubmitReview = (newReview: ReviewData) => {
    // Convert File objects to preview URLs
    const reviewWithPreviews: ReviewData = {
      ...newReview,
      mediaPreviews: newReview.mediaFiles?.map((file: File) => 
        URL.createObjectURL(file)
      ) || []
    };
    
    // In production: Send to API
    // await api.post('/reviews', reviewWithPreviews);
    
    // Update local state
    setReviews(prev => [reviewWithPreviews, ...prev]);
    setIsWriteModalOpen(false);
  };

  // Handle review update
  const handleUpdateReview = (
    reviewId: string, 
    updatedReview: ReviewData
  ) => {
    // In production: Send to API
    // await api.put(`/reviews/${reviewId}`, updatedReview);
    
    // Update local state
    setReviews(prev => prev.map(review => 
      review.id === reviewId ? updatedReview : review
    ));
  };

  return (
    <>
      <UserReviews
        vehicleName="2025 BMW 3-Series"
        communityRating={8.5}
        totalReviews={253}
        ratingDistribution={[5, 3, 8, 10, 20, 30, 45, 63, 50, 18]}
        vehicleImage="/images/bmw-3-series.jpg"
        reviews={reviews}
        onWriteReview={() => setIsWriteModalOpen(true)}
        onUpdateReview={handleUpdateReview}
      />
      
      <WriteReviewModal
        isOpen={isWriteModalOpen}
        onClose={() => setIsWriteModalOpen(false)}
        vehicleName="2025 BMW 3-Series"
        vehicleImage="/images/bmw-3-series.jpg"
        onSubmit={handleSubmitReview}
      />
    </>
  );
}
```

### API Endpoints (Suggested)

```typescript
// Create Review
POST /api/vehicles/:vehicleId/reviews
Body: ReviewData (without mediaPreviews)
Response: ReviewData with server-generated IDs

// Update Review
PUT /api/reviews/:reviewId
Body: Partial<ReviewData>
Response: Updated ReviewData

// Get Reviews
GET /api/vehicles/:vehicleId/reviews
Response: ReviewData[]

// Upload Media
POST /api/reviews/:reviewId/media
Body: FormData with files
Response: { mediaUrls: string[] }

// Delete Review
DELETE /api/reviews/:reviewId
Response: { success: boolean }
```

---

## ✅ Testing Checklist

### Functional Testing

- [ ] **Review Creation**
  - [ ] Can create review with all required fields
  - [ ] Can create review with optional fields
  - [ ] Validation works for required fields
  - [ ] Media upload works (images/videos)
  - [ ] Category ratings calculate overall rating
  - [ ] Manual rating override works
  - [ ] VIN verification assigns correct badge
  - [ ] Relationship selection works correctly

- [ ] **Review Editing**
  - [ ] Edit button appears for user's own reviews
  - [ ] Edit modal pre-fills all data
  - [ ] Can update any field
  - [ ] Updated date is added after edit
  - [ ] Original date is preserved

- [ ] **Rating System**
  - [ ] Category ratings auto-calculate overall rating
  - [ ] Fractional ratings work (e.g., 7.5)
  - [ ] Manual rating takes precedence
  - [ ] Category change resets manual mode

- [ ] **Verification System**
  - [ ] Badge levels assign correctly
  - [ ] VIN provides highest badge
  - [ ] Relationship "own" provides owner badge
  - [ ] Profile-owned vehicles provide owner badge

- [ ] **Social Features**
  - [ ] Thumbs up increments count
  - [ ] Reply functionality works
  - [ ] Share button appears (implementation pending)

- [ ] **UI/UX**
  - [ ] CTA button changes text after review
  - [ ] Paragraph formatting works
  - [ ] Media previews display correctly
  - [ ] Responsive design works on mobile/tablet/desktop

### Edge Cases

- [ ] Empty review content
- [ ] Very long review content
- [ ] Multiple media files
- [ ] Large file sizes
- [ ] Special characters in review
- [ ] Network errors during submission
- [ ] Rapid editing (race conditions)

---

## 📝 Notes for Product Managers

### Feature Priorities

1. **MVP Features** (Must Have)
   - ✅ Review creation with rating
   - ✅ Category ratings
   - ✅ Basic verification
   - ✅ Media upload

2. **High Priority** (Should Have)
   - ✅ Review editing
   - ✅ Vehicle relationship
   - ✅ Paragraph formatting
   - ✅ VIN verification

3. **Future Enhancements** (Could Have)
   - 🔄 Share functionality
   - 🔄 Review moderation
   - 🔄 Advanced filtering
   - 🔄 Review analytics

### Metrics to Track

- Average review rating per vehicle
- Review completion rate (started vs. submitted)
- Category rating usage
- Verification badge distribution
- Edit frequency
- Media upload rate
- Social engagement (thumbs up, replies)

---

## 📞 Support & Questions

For technical questions or issues:
- **Component Files**: `src/components/UserReviews/`, `src/components/WriteReviewModal/`
- **Utility Functions**: `src/utils/ratingUtils.ts`
- **Type Definitions**: Exported from `UserReviews.tsx`

---

**Document Version**: 1.0.0  
**Last Updated**: December 2024  
**Maintained By**: Development Team

