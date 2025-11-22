# Atom Migration Plan

This document outlines the strategy for migrating remaining components to use atoms (CardShell, Badge, Tooltip) instead of custom implementations.

---

## Migration Priority

### Priority 1: High-Impact Components (Custom Card Wrappers)

These components have custom card implementations that should use `CardShell`:

1. **Card** (`src/components/Card/`) - Universal vehicle card
   - Custom card wrapper with rgba backgrounds
   - Should use CardShell for consistent styling
   - Impact: Used across entire app

2. **ComparisonCard** (`src/components/ComparisonCard/`) - Vehicle comparison cards
   - Custom card styling
   - Should use CardShell
   - Impact: Comparison feature

3. **ProfileCompletionCard** (`src/components/ProfileCompletionCard/`) - Profile progress card
   - Custom card wrapper
   - Should use CardShell
   - Impact: User profile

4. **EmptyVehiclesCard** (`src/components/EmptyVehiclesCard/`) - Empty state card
   - Custom card styling
   - Should use CardShell
   - Impact: Empty states

5. **SubscriptionItem** (`src/components/SubscriptionItem/`) - Subscription list item
   - Card-like styling
   - Should use CardShell
   - Impact: Membership page

6. **MembershipCard** (`src/components/MembershipCard/`) - Membership tier card
   - Already tokenized but not using CardShell
   - Should migrate to CardShell for consistency
   - Impact: Membership page

---

### Priority 2: Components with Custom Badges/Labels

These components have custom badge implementations that should use `Badge` atom:

1. **StickyRateBar** (`src/components/StickyRateBar/`) - Rating bar with badges
   - Custom badge styling for ratings
   - Should use Badge atom
   - Impact: All article/vehicle pages

2. **UserReviews** (`src/components/UserReviews/`) - User review cards
   - Custom verification badges
   - Should use Badge atom
   - Impact: Review sections

3. **WriteReviewModal** (`src/components/WriteReviewModal/`) - Review submission
   - Custom badge/label styling
   - Should use Badge atom
   - Impact: Review submission flow

4. **GlobalHeader** (`src/components/GlobalHeader/`) - Site header
   - Custom badge/notification indicators
   - Should use Badge atom
   - Impact: Every page

5. **ArticleScoreCard** (`src/components/ArticleScoreCard/`) - Score display
   - Custom award badge
   - Should use Badge atom
   - Impact: Article pages

---

### Priority 3: Components with Custom Tooltips

These components have custom tooltip implementations that should use `Tooltip` atom:

1. **RatingDistributionTooltip** (`src/components/RatingDistributionTooltip/`) - Rating breakdown
   - Custom tooltip implementation
   - Should use Tooltip atom
   - Impact: Rating displays

2. **StaffRatingTooltip** (`src/components/StaffRatingTooltip/`) - Staff rating info
   - Custom tooltip implementation
   - Should use Tooltip atom
   - Impact: Rating displays

3. **EditableField** (`src/components/EditableField/`) - Inline editing
   - May have tooltip for help text
   - Should use Tooltip atom if applicable
   - Impact: Profile editing

---

## Required Atoms to Create

Before migration, we need to create these atoms:

### 1. CardShell Atom

**Purpose:** Standardized card wrapper with consistent styling

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

**Features:**
- Consistent padding using spacing tokens
- Standardized shadow using shadow tokens
- Optional hover state
- Flexible padding options
- Composable with other atoms

---

### 2. Badge Atom

**Purpose:** Standardized badge/label component

**Props:**
```typescript
interface BadgeProps {
  children: React.ReactNode;
  variant?: 'new' | 'premium' | 'verified' | 'info' | 'success' | 'warning' | 'error';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}
```

**Features:**
- Semantic color variants
- Consistent sizing
- Uses design tokens for all styling
- Accessible

---

### 3. Tooltip Atom

**Purpose:** Standardized tooltip component

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

**Features:**
- Consistent positioning
- Automatic show/hide
- Accessible (ARIA attributes)
- Mobile-friendly

---

## Migration Strategy

### Phase 1: Create Atoms (Week 1)

1. Create `CardShell` atom
   - Design and implement
   - Write tests
   - Document usage

2. Create `Badge` atom
   - Design and implement
   - Write tests
   - Document usage

3. Create `Tooltip` atom
   - Design and implement
   - Write tests
   - Document usage

---

### Phase 2: Migrate High-Impact Components (Week 2)

1. Migrate `Card` component to use `CardShell`
   - Replace custom card wrapper
   - Update tests
   - Verify across app

2. Migrate `ComparisonCard` to use `CardShell`
   - Replace custom styling
   - Update tests

3. Migrate `ProfileCompletionCard` to use `CardShell`
   - Replace custom wrapper
   - Update tests

4. Migrate `EmptyVehiclesCard` to use `CardShell`
   - Replace custom styling
   - Update tests

5. Migrate `SubscriptionItem` to use `CardShell`
   - Replace card-like styling
   - Update tests

6. Migrate `MembershipCard` to use `CardShell`
   - Replace custom wrapper
   - Update tests

---

### Phase 3: Migrate Badge Components (Week 3)

1. Migrate `StickyRateBar` to use `Badge`
   - Replace custom badge styling
   - Update tests

2. Migrate `UserReviews` to use `Badge`
   - Replace verification badges
   - Update tests

3. Migrate `WriteReviewModal` to use `Badge`
   - Replace custom labels
   - Update tests

4. Migrate `GlobalHeader` to use `Badge`
   - Replace notification indicators
   - Update tests

5. Migrate `ArticleScoreCard` to use `Badge`
   - Replace award badge
   - Update tests

---

### Phase 4: Migrate Tooltip Components (Week 4)

1. Migrate `RatingDistributionTooltip` to use `Tooltip`
   - Replace custom implementation
   - Update tests

2. Migrate `StaffRatingTooltip` to use `Tooltip`
   - Replace custom implementation
   - Update tests

3. Migrate `EditableField` to use `Tooltip` (if applicable)
   - Add tooltip for help text
   - Update tests

---

## Migration Checklist

For each component migration:

- [ ] Read existing component code
- [ ] Identify custom implementations (card wrapper, badge, tooltip)
- [ ] Replace with appropriate atom
- [ ] Update CSS to remove duplicate styles
- [ ] Test component functionality
- [ ] Test visual appearance
- [ ] Test responsive behavior
- [ ] Update component documentation
- [ ] Run linters (`npm run lint:all`)
- [ ] Verify no regressions

---

## Success Metrics

### Code Reduction
- **Target:** Reduce duplicate CSS by 30-40%
- **Measure:** Lines of CSS before/after migration

### Consistency
- **Target:** 100% of cards use CardShell
- **Target:** 100% of badges use Badge atom
- **Target:** 100% of tooltips use Tooltip atom

### Maintainability
- **Target:** Single source of truth for each pattern
- **Target:** Easy to update globally

### Performance
- **Target:** No performance regressions
- **Measure:** Bundle size, render time

---

## Risks and Mitigation

### Risk 1: Visual Regressions
**Mitigation:** 
- Take screenshots before migration
- Visual regression testing
- Thorough manual testing

### Risk 2: Breaking Changes
**Mitigation:**
- Migrate one component at a time
- Test thoroughly before moving to next
- Keep old code until verified

### Risk 3: Time Overrun
**Mitigation:**
- Prioritize high-impact components
- Can pause between phases
- Document progress continuously

---

## Current Status

### Completed
- ✅ ModalShell atom created and adopted (6 modals migrated)
- ✅ Design token system established
- ✅ Pre-commit hooks enforcing token usage
- ✅ PR template enforcing atom composition

### In Progress
- 🔄 Creating CardShell, Badge, and Tooltip atoms
- 🔄 Documenting migration patterns

### Pending
- ⏳ Migrating 15+ components to use new atoms
- ⏳ Updating documentation
- ⏳ Final audit and verification

---

## Next Steps

1. **Immediate:** Create CardShell, Badge, and Tooltip atoms
2. **This Week:** Migrate Card, ComparisonCard, ProfileCompletionCard
3. **Next Week:** Migrate badge components
4. **Following Week:** Migrate tooltip components
5. **Final:** Update audit page and documentation

---

## Resources

- [Atom Composition Guide](/docs/ATOM_COMPOSITION_GUIDE.md)
- [Token Governance](/docs/TOKEN_GOVERNANCE.md)
- [ModalShell README](/src/components/atoms/ModalShell/README.md)
- [PR Template](/.github/PULL_REQUEST_TEMPLATE.md)
- [Contributing Guide](/CONTRIBUTING.md)

---

## Questions?

- Review existing ModalShell implementation for patterns
- Check Atom Composition Guide for examples
- Refer to design system global tokens

---

**This migration will significantly improve code maintainability, consistency, and developer experience!**

