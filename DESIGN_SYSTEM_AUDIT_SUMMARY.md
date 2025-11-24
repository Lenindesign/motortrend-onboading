# Design System Audit Summary - UserReviews Component

## Current Status

I've audited the `UserReviews.css` file (1,385 lines) for compliance with the design system.

## Key Findings

### ✅ What's Already Good
- Color variables are properly used throughout (`var(--color-neutrals-*)`, `var(--color-primary-*)`)
- Font families use design system variables (`var(--font-heading)`, `var(--font-body)`)
- Transitions use design system variables (`var(--transition-fast)`)

### ⚠️ Issues Found

#### 1. **Font Sizes - NOT IN DESIGN SYSTEM**
- **Problem**: The design system doesn't define `--font-size-*` variables
- **Current State**: 50+ instances of hard-coded font sizes (12px, 14px, 16px, 18px, 24px, 32px, 48px)
- **Recommendation**: Either:
  - Add font-size variables to `global.css` (e.g., `--font-size-xs: 12px`, `--font-size-sm: 14px`, etc.)
  - OR use the existing typography classes (`.text-h5`, `.text-body3`, `.text-caption1`, etc.)

#### 2. **Spacing Values**
- **Problem**: 80+ instances of hard-coded spacing values
- **Available Variables**: 
  - `--spacing-1` through `--spacing-6` (8px, 16px, 24px, 32px, 40px, 48px)
  - `--spacing-component-*` (4px, 8px, 12px, 16px, 24px, 32px)
  - `--spacing-gap-*` (4px, 8px, 12px, 16px, 24px, 32px)
- **Special Case**: Many 6px values exist, but design system only has 4px and 8px

#### 3. **Border Radius**
- **Problem**: 20+ instances of hard-coded border-radius values
- **Available Variables**:
  - `--border-radius-sm`: 4px
  - `--border-radius-md`: 8px
  - `--border-radius-lg`: 16px
- **Special Case**: Many 6px values (not in system)

#### 4. **Shadows**
- **Problem**: 5 instances of hard-coded box-shadow values
- **Available Variables**: `--shadow-sm`, `--shadow-md`, `--shadow-lg`, `--shadow-xl`, `--shadow-tooltip`, `--shadow-dropdown`

## Recommended Actions

### Priority 1: Add Font Size Variables to Design System
Add to `src/design-system/global.css`:

```css
/* Typography - Font Sizes */
--font-size-xs: 12px;
--font-size-sm: 14px;
--font-size-base: 16px;
--font-size-md: 18px;
--font-size-lg: 24px;
--font-size-xl: 32px;
--font-size-2xl: 48px;
--font-size-3xl: 64px;
```

### Priority 2: Update UserReviews.css
Once font-size variables are added, systematically replace:
- All `font-size: 12px` → `var(--font-size-xs)`
- All `font-size: 14px` → `var(--font-size-sm)`
- All `font-size: 16px` → `var(--font-size-base)`
- All `font-size: 18px` → `var(--font-size-md)`
- All `font-size: 24px` → `var(--font-size-lg)`
- All `font-size: 32px` → `var(--font-size-xl)`
- All `font-size: 48px` → `var(--font-size-2xl)`

### Priority 3: Update Spacing
- Replace `8px` → `var(--spacing-1)` or `var(--spacing-gap-sm)`
- Replace `12px` → `var(--spacing-component-md)` or `var(--spacing-gap-md)`
- Replace `16px` → `var(--spacing-2)` or `var(--spacing-gap-lg)`
- Replace `24px` → `var(--spacing-3)`
- Replace `32px` → `var(--spacing-4)`
- Replace `48px` → `var(--spacing-6)`
- **Decision needed**: What to do with `6px` values? (Round to 4px or 8px, or keep as custom)

### Priority 4: Update Border Radius
- Replace `border-radius: 4px` → `var(--border-radius-sm)`
- Replace `border-radius: 8px` → `var(--border-radius-md)`
- Replace `border-radius: 16px` → `var(--border-radius-lg)`
- **Decision needed**: What to do with `6px` values? (Round to 4px or 8px, or keep as custom)

### Priority 5: Update Shadows
- Replace appropriate box-shadow values with `var(--shadow-*)` variables

## Files to Update

1. **`src/design-system/global.css`** - Add font-size variables
2. **`src/components/UserReviews/UserReviews.css`** - Replace all hard-coded values
3. **Other component CSS files** - Apply same audit process

## Estimated Impact

- **Lines to change in UserReviews.css**: ~150-200 lines
- **Time estimate**: 1-2 hours for UserReviews component
- **Risk**: Low (CSS changes are easily testable and reversible)
- **Benefit**: Full design system compliance, easier maintenance, consistent spacing/sizing

## Next Steps

1. **Decide on font-size variable names and values**
2. **Add font-size variables to global.css**
3. **Create a script or manual process to replace values**
4. **Test thoroughly in browser**
5. **Apply same process to other components**

## Partial Changes Already Applied

I've already updated these in UserReviews.css:
- ✅ `.user-reviews` margin-bottom
- ✅ `.user-reviews__header` margin-bottom
- ✅ `.user-reviews__title` gap
- ✅ `.user-reviews__info-tooltip` padding, border-radius
- ✅ `.user-reviews__content` padding, border-radius
- ✅ `.user-reviews__tabs` margin-bottom
- ✅ `.user-reviews__tab` padding

**Note**: I used `var(--font-size-*)` variables that don't exist yet. These need to be added to global.css first.


