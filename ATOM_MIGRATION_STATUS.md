# Atom Migration Status

This document tracks the progress of migrating components to use atoms instead of custom implementations.

---

## Overview

**Goal:** Replace custom card wrappers, badges, and tooltips with standardized atoms (CardShell, Badge, Tooltip) to improve consistency and maintainability.

**Scope:** 15+ components across molecules and organisms

**Timeline:** 4-week phased approach

---

## Current Status: Planning Complete ✅

### Completed

1. ✅ **Migration Plan Created** (`/docs/ATOM_MIGRATION_PLAN.md`)
   - Identified 15+ components requiring migration
   - Prioritized by impact (High → Medium → Low)
   - Defined migration strategy and timeline
   - Created success metrics

2. ✅ **Atoms to Create Identified**
   - CardShell - Standardized card wrapper
   - Badge - Semantic badge component
   - Tooltip - Accessible tooltip component

3. ✅ **Audit Page Updated**
   - Added 5 detailed next steps
   - Added Migration Plan documentation card
   - Linked to comprehensive migration guide

4. ✅ **ModalShell Precedent Established**
   - 6 modals already migrated successfully
   - Eliminated ~150+ lines of duplicate code
   - Serves as template for other atom migrations

---

## Components Requiring Migration

### Priority 1: High-Impact (Custom Card Wrappers)

**Status:** 📋 Planned

| Component | Current State | Migration Target | Impact |
|-----------|--------------|------------------|--------|
| Card | Custom card wrapper with rgba backgrounds | CardShell | Used across entire app |
| ComparisonCard | Custom card styling | CardShell | Comparison feature |
| ProfileCompletionCard | Custom card wrapper | CardShell | User profile |
| EmptyVehiclesCard | Custom card styling | CardShell | Empty states |
| SubscriptionItem | Card-like styling | CardShell | Membership page |
| MembershipCard | Tokenized but not using CardShell | CardShell | Membership page |

**Estimated Impact:**
- 6 components migrated
- ~200-300 lines of CSS eliminated
- Single source of truth for card styling

---

### Priority 2: Components with Custom Badges

**Status:** 📋 Planned

| Component | Current State | Migration Target | Impact |
|-----------|--------------|------------------|--------|
| StickyRateBar | Custom badge styling for ratings | Badge atom | All article/vehicle pages |
| UserReviews | Custom verification badges | Badge atom | Review sections |
| WriteReviewModal | Custom badge/label styling | Badge atom | Review submission |
| GlobalHeader | Custom badge/notification indicators | Badge atom | Every page |
| ArticleScoreCard | Custom award badge | Badge atom | Article pages |

**Estimated Impact:**
- 5 components migrated
- ~100-150 lines of CSS eliminated
- Consistent badge styling across app

---

### Priority 3: Components with Custom Tooltips

**Status:** 📋 Planned

| Component | Current State | Migration Target | Impact |
|-----------|--------------|------------------|--------|
| RatingDistributionTooltip | Custom tooltip implementation | Tooltip atom | Rating displays |
| StaffRatingTooltip | Custom tooltip implementation | Tooltip atom | Rating displays |
| EditableField | May have tooltip for help text | Tooltip atom | Profile editing |

**Estimated Impact:**
- 3 components migrated
- ~80-100 lines of CSS eliminated
- Consistent tooltip behavior

---

## Atoms to Create

### 1. CardShell Atom

**Status:** 🔄 Next Up

**Purpose:** Standardized card wrapper with consistent styling

**Features:**
- Consistent padding using spacing tokens
- Standardized shadow using shadow tokens
- Optional hover state
- Flexible padding options (none, sm, md, lg)
- Composable with other atoms

**Props:**
```typescript
interface CardShellProps {
  children: React.ReactNode;
  padding?: 'none' | 'sm' | 'md' | 'lg';
  hasHover?: boolean;
  hasShadow?: boolean;
  className?: string;
  onClick?: () => void;
}
```

**Example Usage:**
```tsx
<CardShell hasHover={true} padding="md">
  <h3>Card Title</h3>
  <p>Card content</p>
</CardShell>
```

---

### 2. Badge Atom

**Status:** 🔄 Next Up

**Purpose:** Standardized badge/label component

**Features:**
- Semantic color variants
- Consistent sizing
- Uses design tokens for all styling
- Accessible

**Props:**
```typescript
interface BadgeProps {
  children: React.ReactNode;
  variant?: 'new' | 'premium' | 'verified' | 'info' | 'success' | 'warning' | 'error';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}
```

**Example Usage:**
```tsx
<Badge variant="new">New</Badge>
<Badge variant="premium">Premium</Badge>
<Badge variant="verified">Verified</Badge>
```

---

### 3. Tooltip Atom

**Status:** 🔄 Next Up

**Purpose:** Standardized tooltip component

**Features:**
- Consistent positioning
- Automatic show/hide
- Accessible (ARIA attributes)
- Mobile-friendly

**Props:**
```typescript
interface TooltipProps {
  children: React.ReactNode;
  content: string | React.ReactNode;
  position?: 'top' | 'bottom' | 'left' | 'right';
  delay?: number;
  className?: string;
}
```

**Example Usage:**
```tsx
<Tooltip content="Help text" position="top">
  <Icon name="help" />
</Tooltip>
```

---

## Migration Timeline

### Week 1: Create Atoms
- [ ] Create CardShell atom
- [ ] Create Badge atom
- [ ] Create Tooltip atom
- [ ] Write tests for all atoms
- [ ] Document usage patterns

### Week 2: Migrate High-Impact Components
- [ ] Migrate Card component
- [ ] Migrate ComparisonCard
- [ ] Migrate ProfileCompletionCard
- [ ] Migrate EmptyVehiclesCard
- [ ] Migrate SubscriptionItem
- [ ] Migrate MembershipCard

### Week 3: Migrate Badge Components
- [ ] Migrate StickyRateBar
- [ ] Migrate UserReviews
- [ ] Migrate WriteReviewModal
- [ ] Migrate GlobalHeader
- [ ] Migrate ArticleScoreCard

### Week 4: Migrate Tooltip Components
- [ ] Migrate RatingDistributionTooltip
- [ ] Migrate StaffRatingTooltip
- [ ] Migrate EditableField (if applicable)
- [ ] Final audit and verification
- [ ] Update documentation

---

## Success Metrics

### Code Reduction
- **Target:** Reduce duplicate CSS by 30-40%
- **Current:** Baseline established
- **Progress:** 0% (planning phase)

### Atom Adoption
- **ModalShell:** 6/6 modals (100%) ✅
- **CardShell:** 0/6 components (0%) 🔄
- **Badge:** 0/5 components (0%) 🔄
- **Tooltip:** 0/3 components (0%) 🔄

### Consistency
- **Target:** 100% of cards use CardShell
- **Target:** 100% of badges use Badge atom
- **Target:** 100% of tooltips use Tooltip atom
- **Progress:** Planning complete, implementation pending

---

## Risks and Mitigation

### Risk 1: Visual Regressions
**Status:** Mitigated
**Strategy:** 
- Take screenshots before migration
- Visual regression testing
- Thorough manual testing

### Risk 2: Breaking Changes
**Status:** Mitigated
**Strategy:**
- Migrate one component at a time
- Test thoroughly before moving to next
- Keep old code until verified

### Risk 3: Time Overrun
**Status:** Mitigated
**Strategy:**
- Prioritize high-impact components
- Can pause between phases
- Document progress continuously

---

## ModalShell Success Story

**Completed:** 6 modals migrated to use ModalShell atom

**Results:**
- ✅ Eliminated ~150+ lines of duplicate code
- ✅ Consistent overlay and positioning across all modals
- ✅ Automatic escape key handling
- ✅ Body scroll locking
- ✅ Click-outside-to-close
- ✅ Accessibility built-in

**Migrated Components:**
1. RatingModal
2. SavedModal
3. WriteReviewModal
4. PhotoGallery
5. ReviewSubmittedToast
6. AvatarBannerModal

**This success demonstrates the value of atom-based composition!**

---

## Next Steps

### Immediate (This Week)
1. Create CardShell atom
2. Create Badge atom
3. Create Tooltip atom
4. Write comprehensive tests
5. Document usage patterns

### Short-term (Next 2 Weeks)
1. Migrate 6 high-impact card components
2. Migrate 5 badge components
3. Update documentation
4. Run visual regression tests

### Medium-term (Following 2 Weeks)
1. Migrate 3 tooltip components
2. Final audit and verification
3. Update Atomic Design Audit page
4. Celebrate success! 🎉

---

## Resources

- 📖 [Atom Migration Plan](/docs/ATOM_MIGRATION_PLAN.md) - Comprehensive strategy
- 📖 [Atom Composition Guide](/docs/ATOM_COMPOSITION_GUIDE.md) - Usage patterns
- 🎭 [ModalShell README](/src/components/atoms/ModalShell/README.md) - Example atom
- ✅ [PR Template](/.github/PULL_REQUEST_TEMPLATE.md) - Checklist
- 🔒 [Token Governance](/docs/TOKEN_GOVERNANCE.md) - Enforcement

---

## Progress Tracking

### Overall Progress: 25% (Planning Complete)

- ✅ **25%** - Migration plan created
- 🔄 **0%** - Atoms created (CardShell, Badge, Tooltip)
- ⏳ **0%** - Components migrated (0/14)
- ⏳ **0%** - Documentation updated
- ⏳ **0%** - Final verification

---

## Questions?

- Review the [Atom Migration Plan](/docs/ATOM_MIGRATION_PLAN.md)
- Check existing ModalShell implementation for patterns
- Refer to [Atom Composition Guide](/docs/ATOM_COMPOSITION_GUIDE.md)

---

**Status: Planning Complete, Ready to Begin Implementation** 🚀


