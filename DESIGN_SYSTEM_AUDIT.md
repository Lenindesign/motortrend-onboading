# Design System Audit Report

**MotorTrend Onboarding Project**  
**Audit Date:** December 2024  
**Auditor:** Automated Scan + Manual Review

---

## Executive Summary

| Category | Violations | Severity |
|----------|------------|----------|
| **Hardcoded Colors (TSX)** | 915 instances | 🔴 High |
| **Hardcoded Colors (CSS)** | 249 instances | 🔴 High |
| **Hardcoded Spacing (CSS)** | 2,674 instances | 🟡 Medium |
| **Hardcoded Border Radius** | 180 instances | 🟡 Medium |
| **Hardcoded Transitions** | 188 instances | 🟡 Medium |
| **Hardcoded Font Family** | 25 instances | 🟢 Low |
| **Non-standard RGBA** | 157 instances | 🟡 Medium |

**Overall Compliance Score: ~35%**

---

## 1. Color Violations

### 1.1 Component Files (.tsx) - 850+ violations

| File | Count | Priority |
|------|-------|----------|
| `GlobalHeader.tsx` | 104 | 🔴 Critical |
| `UserReviews.tsx` | 61 | 🔴 High |
| `PhotoGallery.tsx` | 51 | 🔴 High |
| `WriteReviewModal.tsx` | 50 | 🔴 High |
| `ProfileCompletionCard.tsx` | 43 | 🔴 High |
| `LocalListingsSidebar.tsx` | 37 | 🟡 Medium |
| `AIPersonalAssistant.tsx` | 34 | 🟡 Medium |
| `Community/PostCard.tsx` | 25 | 🟡 Medium |
| `TopTenCarousel.tsx` | 24 | 🟡 Medium |
| `KnowYourBudget.tsx` | 21 | 🟡 Medium |
| Other components (48 files) | 350+ | 🟡 Medium |

### 1.2 Page CSS Files - 249 violations

| File | Count | Priority |
|------|-------|----------|
| `VehicleDetails.css` | 48 | 🔴 Critical |
| `Documentation.css` | 47 | 🔴 High |
| `Article.css` | 35 | 🔴 High |
| `Home.css` | 20 | 🟡 Medium |
| `VehicleInventory.css` | 17 | 🟡 Medium |
| `AtomicDesignAudit.css` | 16 | 🟡 Medium |
| `OnboardingStep3.css` | 15 | 🟡 Medium |
| Other CSS files (12 files) | 51 | 🟢 Low |

### 1.3 Common Color Violations

**Colors that should use design tokens:**

| Hardcoded Value | Should Be | Occurrences |
|-----------------|-----------|-------------|
| `#FFFFFF` | `var(--color-white)` | ~200 |
| `#141416` | `var(--color-neutrals-1)` | ~50 |
| `#23262F` | `var(--color-neutrals-2)` | ~100 |
| `#353945` | `var(--color-neutrals-3)` | ~80 |
| `#E90C17` | `var(--color-primary-1)` | ~40 |
| `#E6E8EC` | `var(--color-neutrals-6)` | ~60 |
| `#FCFCFD` | `var(--color-neutrals-8)` | ~70 |

**Non-standard colors (not in design system):**

| Color | Usage | Action |
|-------|-------|--------|
| `#2d3748` | Dark backgrounds | Add to tokens or replace |
| `#3d4d68` | Hover states | Add to tokens or replace |
| `#0865b4` | Verified badge | Add `--color-verified` |
| `#c1eaff` | Info badge bg | Add `--color-info-light` |
| `#e7f4e7` | Success badge bg | Already have `--color-semantic-success-light` |
| `#fae5e5` | Error badge bg | Already have `--color-semantic-error-light` |

---

## 2. Spacing Violations

### 2.1 Page CSS Files - 2,674 hardcoded values

| File | Count | Priority |
|------|-------|----------|
| `Article.css` | 493 | 🔴 Critical |
| `VehicleDetails.css` | 396 | 🔴 Critical |
| `Home.css` | 308 | 🔴 High |
| `TopTenManagement.css` | 253 | 🔴 High |
| `DesignSystemReference.css` | 170 | 🟡 Medium |
| `AtomicDesignAudit.css` | 168 | 🟡 Medium |
| `VehicleInventory.css` | 136 | 🟡 Medium |
| `Profile.css` | 123 | 🟡 Medium |
| `Documentation.css` | 116 | 🟡 Medium |
| `Community.css` | 92 | 🟡 Medium |
| Other files (18) | 419 | 🟢 Low |

### 2.2 Common Spacing Violations

**Non-8px-grid values found:**

| Value | Count | Should Be |
|-------|-------|-----------|
| `10px` | ~100 | `8px` or `12px` (use component tokens) |
| `15px` | ~50 | `16px` (`--spacing-2`) |
| `20px` | ~80 | `24px` (`--spacing-3`) or `16px` |
| `5px` | ~60 | `4px` (`--spacing-component-xs`) |
| `12px` | ~150 | `--spacing-component-md` |

---

## 3. Border Radius Violations

### 3.1 Page CSS Files - 180 hardcoded values

**Common violations:**

| Value | Count | Should Be |
|-------|-------|-----------|
| `4px` | ~40 | `var(--border-radius-sm)` |
| `8px` | ~60 | `var(--border-radius-md)` |
| `16px` | ~30 | `var(--border-radius-lg)` |
| `50%` | ~20 | `var(--border-radius-circle)` |
| `100px` | ~10 | `var(--border-radius-full)` |
| `12px` | ~20 | Non-standard (use 8px or 16px) |

---

## 4. Transition Violations

### 4.1 Page CSS Files - 188 hardcoded values

**Common violations:**

| Pattern | Count | Should Be |
|---------|-------|-----------|
| `transition: all 0.2s ease` | ~50 | `var(--transition-fast)` |
| `transition: all 0.3s ease` | ~70 | `var(--transition-normal)` |
| `transition: 150ms` | ~30 | `var(--transition-fast)` |
| `transition: 200ms` | ~20 | `var(--transition-fast)` |
| `transition: 300ms` | ~18 | `var(--transition-normal)` |

---

## 5. Typography Violations

### 5.1 Hardcoded Font Families - 25 instances

| File | Count |
|------|-------|
| `DesignSystemReference.css` | 6 |
| `Profile.css` | 4 |
| `Documentation.css` | 3 |
| `OnboardingStep2.css` | 2 |
| `OnboardingStep3.css` | 2 |
| Other files | 8 |

**Common violations:**

```css
/* ❌ Wrong */
font-family: 'Poppins', sans-serif;
font-family: 'Geist', sans-serif;

/* ✅ Correct */
font-family: var(--font-heading);
font-family: var(--font-body);
```

---

## 6. Component-Specific Issues

### 6.1 Badge Component

**File:** `src/components/atoms/Badge/Badge.tsx`

```tsx
// ❌ Current - Hardcoded colors
const variantStyles = {
  neutral: { bg: '#E6E8EC', color: '#353945' },
  new: { bg: '#E90C17', color: '#FFFFFF' },
  // ...
};

// ✅ Should be
const variantStyles = {
  neutral: { 
    bg: 'var(--color-neutrals-6)', 
    color: 'var(--color-neutrals-3)' 
  },
  new: { 
    bg: 'var(--color-primary-1)', 
    color: 'var(--color-white)' 
  },
  // ...
};
```

### 6.2 GlobalHeader Component

**File:** `src/components/GlobalHeader/GlobalHeader.tsx`

- 104 hardcoded color values
- Multiple rgba() values that should use overlay tokens
- Inline styles with hardcoded hex values

### 6.3 Community Components

**Files:** Multiple in `src/components/Community/`

- Inconsistent color usage across PostCard, CommentSection, VoteControl
- Hardcoded font families
- Non-standard spacing values

---

## 7. Files Needing Immediate Attention

### 🔴 Critical Priority (Fix First)

1. **`src/pages/Article/Article.css`** - 493 spacing + 35 color violations
2. **`src/pages/VehicleDetails/VehicleDetails.css`** - 396 spacing + 48 color
3. **`src/components/GlobalHeader/GlobalHeader.tsx`** - 104 color violations
4. **`src/pages/Home/Home.css`** - 308 spacing + 20 color

### 🟡 High Priority

5. `src/components/UserReviews/UserReviews.tsx` - 61 colors
6. `src/components/PhotoGallery/PhotoGallery.tsx` - 51 colors
7. `src/components/WriteReviewModal/WriteReviewModal.tsx` - 50 colors
8. `src/pages/Documentation/Documentation.css` - 116 spacing + 47 colors

### 🟢 Medium Priority

9. All remaining component .tsx files with inline styles
10. All remaining page .css files

---

## 8. Recommendations

### 8.1 Immediate Actions

1. **Add missing tokens** to `global.css`:
   ```css
   :root {
     /* Badge-specific colors */
     --color-badge-verified: #0865b4;
     --color-badge-info-bg: #c1eaff;
     --color-badge-info-text: #1d3b54;
     
     /* Additional dark colors */
     --color-neutrals-2-dark: #2d3748;
     --color-neutrals-3-dark: #3d4d68;
   }
   ```

2. **Fix Badge component** to use CSS variables

3. **Create find-and-replace script** for common color mappings

### 8.2 Short-term (1-2 weeks)

1. Migrate all page CSS files to use tokens
2. Update component inline styles to use CSS variables with fallbacks
3. Add ESLint rule to prevent hardcoded values

### 8.3 Long-term (1 month)

1. Complete Tailwind CSS migration when configuration issues resolved
2. Create component library documentation
3. Implement automated design system compliance checks

---

## 9. Token Reference Quick Sheet

### Colors
```
--color-neutrals-1: #141416  (darkest)
--color-neutrals-2: #23262F  (dark bg)
--color-neutrals-3: #353945  (borders, buttons)
--color-neutrals-4: #6E7481  (secondary text)
--color-neutrals-5: #B1B5C3  (tertiary text)
--color-neutrals-6: #E6E8EC  (borders)
--color-neutrals-7: #F4F5F6  (light bg)
--color-neutrals-8: #FCFCFD  (white bg)
--color-primary-1: #E90C17   (MotorTrend red)
--color-white: #FFFFFF
--color-black: #000000
```

### Spacing (8px base)
```
--spacing-1: 8px
--spacing-2: 16px
--spacing-3: 24px
--spacing-4: 32px
--spacing-5: 40px
--spacing-6: 48px
```

### Border Radius
```
--border-radius-sm: 4px
--border-radius-md: 8px
--border-radius-lg: 16px
--border-radius-full: 100px
```

### Transitions
```
--transition-fast: 150ms ease-in-out
--transition-normal: 250ms ease-in-out
--transition-slow: 350ms ease-in-out
```

---

## 10. Compliance Checklist

Use this checklist when reviewing or creating components:

- [ ] All colors use `var(--color-*)` tokens
- [ ] All spacing uses `var(--spacing-*)` or component spacing tokens
- [ ] All border-radius uses `var(--border-radius-*)` tokens
- [ ] All transitions use `var(--transition-*)` tokens
- [ ] Font families use `var(--font-heading)` or `var(--font-body)`
- [ ] Font sizes use `var(--font-size-*)` tokens
- [ ] Shadows use `var(--shadow-*)` tokens
- [ ] No hardcoded hex values
- [ ] No hardcoded px values for spacing
- [ ] Responsive styles follow mobile-first approach

---

**Report Generated:** December 2024  
**Next Audit:** Recommended after fixing critical issues
