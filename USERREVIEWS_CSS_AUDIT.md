# UserReviews Component CSS Audit

## Design System Variables Available

### Spacing
- `--spacing-0` through `--spacing-6` (0px, 8px, 16px, 24px, 32px, 40px, 48px)
- `--spacing-component-*` (xs: 4px, sm: 8px, md: 12px, lg: 16px, xl: 24px, xxl: 32px)
- `--spacing-gap-*` (xs: 4px, sm: 8px, md: 12px, lg: 16px, xl: 24px, xxl: 32px)

### Border Radius
- `--border-radius-sm`: 4px
- `--border-radius-md`: 8px
- `--border-radius-lg`: 16px
- `--border-radius-full`: 100px
- `--border-radius-circle`: 400px

### Shadows
- `--shadow-sm`: 0px 1px 2px rgba(20, 20, 22, 0.05)
- `--shadow-md`: 0px 2px 4px rgba(20, 20, 22, 0.08)
- `--shadow-lg`: 0px 4px 12px rgba(20, 20, 22, 0.12)
- `--shadow-xl`: 0px 8px 24px rgba(20, 20, 22, 0.15)

### Font Sizes (Need to verify if these exist)
- Should have: xs, sm, base, md, lg, xl, 2xl, 3xl

## Changes Needed

### ✅ Already Updated
1. `.user-reviews` margin-bottom: 48px → `var(--spacing-6)`
2. `.user-reviews__header` margin-bottom: 24px → `var(--spacing-3)`
3. `.user-reviews__title` font-size: 32px → `var(--font-size-2xl)` (if exists)
4. `.user-reviews__title` gap: 8px → `var(--spacing-1)`
5. `.user-reviews__info-tooltip` padding, border-radius, font-size → design system vars
6. `.user-reviews__content` padding, border-radius → design system vars
7. `.user-reviews__tabs` margin-bottom → `var(--spacing-3)`
8. `.user-reviews__tab` padding, font-size → design system vars

### 🔧 Remaining Hard-coded Values to Fix

#### Margins & Padding
- Line 115: margin-bottom: 16px → `var(--spacing-2)`
- Line 117: gap: 16px → `var(--spacing-gap-lg)`
- Line 133: padding: 12px 24px → `var(--spacing-component-md) var(--spacing-3)`
- Line 151: gap: 24px → `var(--spacing-3)`
- Line 152: margin-bottom: 16px → `var(--spacing-2)`
- Line 171: padding: 20px 12px 12px 12px → custom (needs review)
- Line 180: gap: 16px → `var(--spacing-gap-lg)`
- Line 189: gap: 4px → `var(--spacing-gap-xs)`
- Line 203: gap: 4px → `var(--spacing-gap-xs)`
- Line 220: gap: 8px → `var(--spacing-gap-sm)`
- Line 241: gap: 6px → `var(--spacing-gap-xs)` (6px not in system, use 4px or 8px)
- Line 246: padding: 6px 12px → `var(--spacing-component-xs) var(--spacing-component-md)`
- Line 277: gap: 8px → `var(--spacing-gap-sm)`
- Line 280: padding-left: 16px → `var(--spacing-2)`
- Line 297: margin-bottom: 6px → `var(--spacing-gap-xs)` or custom
- Line 304: border-radius: 4px → `var(--border-radius-sm)`
- Line 305: min-height: 4px → keep as is (too small for system)
- Line 315: margin-top: 6px → `var(--spacing-gap-xs)` or custom

#### Font Sizes
- Line 123: font-size: 24px → `var(--font-size-lg)` or `var(--font-size-xl)`
- Line 140: font-size: 16px → `var(--font-size-base)`
- Line 209: font-size: 48px → `var(--font-size-3xl)` or custom
- Line 226: font-size: 12px → `var(--font-size-xs)`
- Line 233: font-size: 12px → `var(--font-size-xs)`
- Line 243: font-size: 12px → `var(--font-size-xs)`
- Line 312: font-size: 18px → `var(--font-size-md)`
- Line 326: font-size: 14px → `var(--font-size-sm)`
- Line 365: font-size: 24px → `var(--font-size-lg)` or `var(--font-size-xl)`
- Line 379: font-size: 16px → `var(--font-size-base)`
- Line 393: font-size: 16px → `var(--font-size-base)`
- Line 421: font-size: 14px → `var(--font-size-sm)`
- Line 471: font-size: 14px → `var(--font-size-sm)`
- Line 574: font-size: 16px → `var(--font-size-base)`
- Line 602: font-size: 24px → `var(--font-size-lg)` or `var(--font-size-xl)`
- Line 624: font-size: 12px → `var(--font-size-xs)`
- Line 631: font-size: 11px → keep as is (smaller than system min)
- Line 650: font-size: 12px → `var(--font-size-xs)`
- Line 664: font-size: 18px → `var(--font-size-md)`
- Line 672: font-size: 16px → `var(--font-size-base)`
- Line 679: font-size: 16px → `var(--font-size-base)`
- Line 711: font-size: 12px → `var(--font-size-xs)`
- Line 735: font-size: 16px → `var(--font-size-base)`
- Line 769: font-size: 14px → `var(--font-size-sm)`
- Line 848: font-size: 14px → `var(--font-size-sm)`
- Line 878: font-size: 14px → `var(--font-size-sm)`
- Line 893: font-size: 14px → `var(--font-size-sm)`
- Line 944: font-size: 14px → `var(--font-size-sm)`
- Line 950: font-size: 12px → `var(--font-size-xs)`
- Line 956: font-size: 14px → `var(--font-size-sm)`
- Line 969: font-size: 16px → `var(--font-size-base)`
- Line 1095: font-size: 14px → `var(--font-size-sm)`
- Line 1147: font-size: 24px → `var(--font-size-lg)` or `var(--font-size-xl)`
- Line 1162: font-size: 14px → `var(--font-size-sm)`
- Line 1175: font-size: 14px → `var(--font-size-sm)`
- Line 1184: font-size: 14px → `var(--font-size-sm)`
- Line 1202: font-size: 14px → `var(--font-size-sm)`
- Line 1223: font-size: 14px → `var(--font-size-sm)`
- Line 1248: font-size: 14px → `var(--font-size-sm)`
- Line 1293: font-size: 16px → `var(--font-size-base)`
- Line 1306: font-size: 14px → `var(--font-size-sm)`
- Line 1313: font-size: 12px → `var(--font-size-xs)`
- Line 1320: font-size: 14px → `var(--font-size-sm)`
- Line 1343: font-size: 14px → `var(--font-size-sm)`

#### Border Radius
- Line 44: border-radius: 6px → `var(--border-radius-md)` (8px) or keep 6px
- Line 77: border-radius: 8px → `var(--border-radius-md)`
- Line 137: border-radius: 8px → `var(--border-radius-md)`
- Line 170: border-radius: 8px → `var(--border-radius-md)`
- Line 247: border-radius: 4px → `var(--border-radius-sm)`
- Line 322: border-radius: 6px → `var(--border-radius-md)` (8px) or keep 6px
- Line 407: border-radius: 6px → `var(--border-radius-md)` (8px) or keep 6px
- Line 445: border-radius: 8px → `var(--border-radius-md)`
- Line 767: border-radius: 6px → `var(--border-radius-md)` (8px) or keep 6px
- Line 831: border-radius: 8px → `var(--border-radius-md)`
- Line 846: border-radius: 8px → `var(--border-radius-md)`
- Line 876: border-radius: 6px → `var(--border-radius-md)` (8px) or keep 6px
- Line 894: border-radius: 6px → `var(--border-radius-md)` (8px) or keep 6px
- Line 966: border-radius: 4px → `var(--border-radius-sm)`
- Line 1116: border-radius: 8px → `var(--border-radius-md)`
- Line 1182: border-radius: 6px → `var(--border-radius-md)` (8px) or keep 6px
- Line 1200: border-radius: 8px → `var(--border-radius-md)`
- Line 1220: border-radius: 8px → `var(--border-radius-md)`
- Line 1255: border-radius: 8px → `var(--border-radius-md)`

#### Shadows
- Line 51: box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2) → `var(--shadow-lg)`
- Line 331: box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.15) → `var(--shadow-lg)`
- Line 446: box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15) → `var(--shadow-lg)`
- Line 859: box-shadow: 0 0 0 2px var(--color-primary-100) → keep as is (focus state)
- Line 973: box-shadow: 0px 4px 20px rgba(20, 20, 22, 0.06) → `var(--shadow-depth-5)`

## Recommendation

1. **First, check if font-size variables exist** in global.css
2. **Apply spacing changes** - highest priority as they're most consistent
3. **Apply border-radius changes** - use `var(--border-radius-md)` for 8px, `var(--border-radius-sm)` for 4px
4. **Apply shadow changes** - use appropriate `--shadow-*` variables
5. **Handle 6px cases** - either round to 4px or 8px, or keep as custom values if design requires
6. **Font sizes** - only apply if variables exist in design system

## Note on 6px Values
The design system doesn't have a 6px spacing value. Options:
- Round down to 4px (`--spacing-gap-xs`)
- Round up to 8px (`--spacing-gap-sm` or `--spacing-1`)
- Keep as custom 6px if design specifically requires it


