# Tailwind CSS Migration Audit

**Project:** MotorTrend Onboarding  
**Date:** December 5, 2025  
**Figma Design System:** [Ignition Design System](https://www.figma.com/design/Xf0Qjj8Rcg3Z3Z2JgEdG8O/Ignition-design-system?node-id=20786-36592)  
**IDS Storybook:** [MotorTrend IDS](https://ids.motortrend.com/?path=/docs/getting-started--documentation)

---

## 📊 Executive Summary

This document provides a comprehensive audit of the current CSS architecture and outlines the migration strategy from vanilla CSS to Tailwind CSS using the **official MotorTrend IDS (Ignition Design System)** package.

### Key Discovery 🎉
You have access to `@motortrend/ids/tailwind` - the official MotorTrend design system with pre-configured Tailwind. This eliminates the need to manually configure design tokens!

### Current State
- **Total CSS Files:** 98 files
- **Current CSS Pattern:** BEM naming convention with CSS custom properties
- **Tailwind Version Installed:** v4.1.15 (not yet configured)
- **IDS Package:** Not yet installed (needs `@motortrend/ids`)
- **Design Tokens:** Pre-built in IDS package

---

## 🚀 Simplified Setup with IDS

### Installation (Phase 0)

```bash
# Install the MotorTrend IDS package
npm install @motortrend/ids
```

### CSS Configuration

Create `src/styles/main.css`:

```css
/* Import MotorTrend IDS Tailwind configuration */
@import '@motortrend/ids/tailwind';

/* Your existing global styles can be imported here */
/* @import '../design-system/global.css'; */
```

### Benefits of Using IDS
- ✅ Pre-configured design tokens (colors, spacing, typography)
- ✅ Official MotorTrend brand colors and styling
- ✅ Consistent with other MotorTrend properties
- ✅ Maintained by the design system team
- ✅ No manual token mapping required

---

## 🎨 Design System Tokens (Reference)

These tokens should already be included in `@motortrend/ids/tailwind`. Verify against IDS documentation.

### Colors (Expected in IDS)

| Token | CSS Variable | Hex Value | Expected Tailwind Class |
|-------|-------------|-----------|------------------------|
| Neutrals 1 | `--color-neutrals-1` | `#141416` | `bg-neutrals-1` / `text-neutrals-1` |
| Neutrals 2 | `--color-neutrals-2` | `#23262F` | `bg-neutrals-2` / `text-neutrals-2` |
| Neutrals 3 | `--color-neutrals-3` | `#353945` | `bg-neutrals-3` / `text-neutrals-3` |
| Neutrals 4 | `--color-neutrals-4` | `#6E7481` | `bg-neutrals-4` / `text-neutrals-4` |
| Neutrals 5 | `--color-neutrals-5` | `#B1B5C3` | `bg-neutrals-5` / `text-neutrals-5` |
| Neutrals 6 | `--color-neutrals-6` | `#E6E8EC` | `bg-neutrals-6` / `text-neutrals-6` |
| Neutrals 7 | `--color-neutrals-7` | `#F4F5F6` | `bg-neutrals-7` / `text-neutrals-7` |
| Neutrals 8 | `--color-neutrals-8` | `#FCFCFD` | `bg-neutrals-8` / `text-neutrals-8` |
| Primary (MT Red) | `--color-primary-1` | `#E90C17` | `bg-primary` / `text-primary` |
| Blue | `--color-blue` | `#186CEA` | `bg-blue` / `text-blue` |

### Spacing (8px base system)

| Token | Value | Tailwind Class |
|-------|-------|----------------|
| Spacing 1 | `8px` | `p-2` / `m-2` / `gap-2` |
| Spacing 2 | `16px` | `p-4` / `m-4` / `gap-4` |
| Spacing 3 | `24px` | `p-6` / `m-6` / `gap-6` |
| Spacing 4 | `32px` | `p-8` / `m-8` / `gap-8` |
| Spacing 5 | `40px` | `p-10` / `m-10` / `gap-10` |
| Spacing 6 | `48px` | `p-12` / `m-12` / `gap-12` |

### Typography

| Token | Value | Expected Tailwind Class |
|-------|-------|------------------------|
| Font Heading | `Poppins` | `font-heading` |
| Font Body | `Geist` | `font-body` |
| Font Size XS | `12px` | `text-xs` |
| Font Size SM | `14px` | `text-sm` |
| Font Size Base | `16px` | `text-base` |
| Font Size MD | `18px` | `text-lg` |
| Font Size LG | `24px` | `text-2xl` |

### Border Radius

| Token | Value | Tailwind Class |
|-------|-------|----------------|
| SM | `4px` | `rounded` or `rounded-sm` |
| MD | `8px` | `rounded-lg` |
| LG | `16px` | `rounded-2xl` |
| Full | `100px` | `rounded-full` |

---

## 📁 CSS Files Inventory (98 Total)

### Category Breakdown

| Category | Count | Priority |
|----------|-------|----------|
| Design System Core | 6 | Critical - Phase 1 |
| Design System Atoms | 12 | High - Phase 2 |
| Core UI Components | 3 | Critical - Phase 3 |
| Card Components | 9 | High - Phase 4 |
| Content Components | 7 | High - Phase 5 |
| Interactive Components | 4 | Medium - Phase 6 |
| Modal Components | 6 | Medium - Phase 7 |
| Profile Components | 7 | Medium - Phase 8 |
| Community Components | 5 | Medium - Phase 9 |
| Vehicle Components | 4 | Medium - Phase 10 |
| Specialty Components | 8 | Medium - Phase 11 |
| Tooltip Components | 2 | Low - Phase 12 |
| Page Styles | 24 | Low - Phase 13 |
| Onboarding Pages | 4 | Low - Phase 14 |

### High Complexity Files (Migrate Later)

| File | Lines | Notes |
|------|-------|-------|
| `GlobalHeader/GlobalHeader.css` | ~1,410 | Complex mega-dropdown system |
| `Card/Card.css` | ~637 | Universal card system |
| `design-system/global.css` | ~425 | CTA system - may keep as CSS |

---

## 📋 Complete Migration Task List

### Phase 0: Setup & Configuration (UPDATED)

| ID | Task | Priority | Est. Time |
|----|------|----------|-----------|
| 0.1 | Install `@motortrend/ids` package | Critical | 5 min |
| 0.2 | Create main CSS file importing IDS Tailwind | Critical | 15 min |
| 0.3 | Update `vite.config.ts` if needed | Critical | 15 min |
| 0.4 | Verify IDS classes work in a test component | Critical | 30 min |
| 0.5 | Document any custom tokens not in IDS | High | 1 hour |
| 0.6 | Set up migration testing strategy | High | 30 min |

**Phase 0 Total: ~2.5 hours** (reduced from 8.5 hours!)

### Phase 1: Design System Core (Foundation)
| ID | Task | File | Priority | Est. Time |
|----|------|------|----------|-----------|
| 1.1 | Review global.css for IDS overlap | `src/design-system/global.css` | Critical | 1 hour |
| 1.2 | Migrate index.css | `src/index.css` | Critical | 30 min |
| 1.3 | Migrate App.css | `src/App.css` | Critical | 30 min |

### Phase 2: Design System Atoms
| ID | Task | File | Priority | Est. Time |
|----|------|------|----------|-----------|
| 2.1 | Migrate Badge atom | `src/components/atoms/Badge/Badge.css` | High | 45 min |
| 2.2 | Migrate Button | `src/design-system/components/Button/Button.css` | High | 1 hour |
| 2.3 | Migrate CardShell atom | `src/components/atoms/CardShell/CardShell.css` | High | 45 min |
| 2.4 | Migrate TextField | `src/design-system/components/TextField/TextField.css` | High | 45 min |
| 2.5 | Migrate Tooltip atom | `src/components/atoms/Tooltip/Tooltip.css` | High | 30 min |
| 2.6 | Migrate ModalShell | `src/components/atoms/ModalShell/ModalShell.css` | High | 45 min |
| 2.7 | Migrate Popover | `src/components/atoms/Popover/Popover.css` | High | 30 min |
| 2.8 | Migrate ActionBadge | `src/components/molecules/ActionBadge/ActionBadge.css` | High | 30 min |
| 2.9 | Migrate Icon | `src/components/Icon/Icon.css` | Medium | 15 min |

**Note:** Consolidate duplicates (atoms vs design-system) during migration.

### Phase 3: Core UI Components
| ID | Task | File | Priority | Est. Time |
|----|------|------|----------|-----------|
| 3.1 | Migrate GlobalHeader | `src/components/GlobalHeader/GlobalHeader.css` | Critical | 4 hours |
| 3.2 | Migrate GlobalFooter | `src/components/GlobalFooter/GlobalFooter.css` | Critical | 2 hours |
| 3.3 | Migrate Card | `src/components/Card/Card.css` | Critical | 3 hours |

### Phase 4: Card Components
| ID | Task | File | Est. Time |
|----|------|------|-----------|
| 4.1 | Migrate VideoCard | `src/components/VideoCard/VideoCard.css` | 45 min |
| 4.2 | Migrate VehicleCard | `src/components/VehicleCard/VehicleCard.css` | 1 hour |
| 4.3 | Migrate HeroCard | `src/components/HeroCard/HeroCard.css` | 45 min |
| 4.4 | Migrate HorizontalCard | `src/components/HorizontalCard/HorizontalCard.css` | 45 min |
| 4.5 | Migrate VerticalCard | `src/components/VerticalCard/VerticalCard.css` | 45 min |
| 4.6 | Migrate ComparisonCard | `src/components/ComparisonCard/ComparisonCard.css` | 45 min |
| 4.7 | Migrate MembershipCard | `src/components/MembershipCard/MembershipCard.css` | 45 min |
| 4.8 | Migrate BaTAuctionCard | `src/components/BaTAuctionCard/BaTAuctionCard.css` | 30 min |
| 4.9 | Migrate EmptyVehiclesCard | `src/components/EmptyVehiclesCard/EmptyVehiclesCard.css` | 20 min |

### Phase 5: Content Components
| ID | Task | File | Est. Time |
|----|------|------|-----------|
| 5.1 | Migrate ArticleHero | `src/components/ArticleHero/ArticleHero.css` | 1 hour |
| 5.2 | Migrate ArticleScoreCard | `src/components/ArticleScoreCard/ArticleScoreCard.css` | 45 min |
| 5.3 | Migrate ArticleReactions | `src/components/ArticleReactions/ArticleReactions.css` | 30 min |
| 5.4 | Migrate HeroPlusThree | `src/components/HeroPlusThree/HeroPlusThree.css` | 45 min |
| 5.5 | Migrate NewsSection | `src/components/NewsSection/NewsSection.css` | 45 min |
| 5.6 | Migrate River | `src/components/River/River.css` | 45 min |
| 5.7 | Migrate PhotoGallery | `src/components/PhotoGallery/PhotoGallery.css` | 1 hour |

### Phase 6: Interactive Components
| ID | Task | File | Est. Time |
|----|------|------|-----------|
| 6.1 | Migrate VehicleSearch | `src/components/VehicleSearch/VehicleSearch.css` | 45 min |
| 6.2 | Migrate LocationAutocomplete | `src/components/LocationAutocomplete/LocationAutocomplete.css` | 30 min |
| 6.3 | Migrate Toast | `src/components/Toast/Toast.css` | 30 min |
| 6.4 | Migrate ReviewSubmittedToast | `src/components/ReviewSubmittedToast/ReviewSubmittedToast.css` | 20 min |

### Phase 7: Modal Components
| ID | Task | File | Est. Time |
|----|------|------|-----------|
| 7.1 | Migrate RatingModal | `src/components/RatingModal/RatingModal.css` | 1 hour |
| 7.2 | Migrate WriteReviewModal | `src/components/WriteReviewModal/WriteReviewModal.css` | 1 hour |
| 7.3 | Migrate SavedModal | `src/components/SavedModal/SavedModal.css` | 45 min |
| 7.4 | Migrate AvatarBannerModal | `src/components/AvatarBannerModal/AvatarBannerModal.css` | 45 min |
| 7.5 | Migrate CreatePostModal | `src/components/Community/CreatePostModal.css` | 45 min |
| 7.6 | Migrate CreateCommunityModal | `src/components/Community/CreateCommunityModal.css` | 45 min |

### Phase 8: Profile Components
| ID | Task | File | Est. Time |
|----|------|------|-----------|
| 8.1 | Migrate ProfileNav | `src/components/ProfileNav/ProfileNav.css` | 45 min |
| 8.2 | Migrate ProfileBanner | `src/components/ProfileBanner/ProfileBanner.css` | 45 min |
| 8.3 | Migrate ProfileCompletionCard | `src/components/ProfileCompletionCard/ProfileCompletionCard.css` | 30 min |
| 8.4 | Migrate EditableField | `src/components/EditableField/EditableField.css` | 30 min |
| 8.5 | Migrate CollapsibleSection | `src/components/CollapsibleSection/CollapsibleSection.css` | 30 min |
| 8.6 | Migrate ConnectedAccount | `src/components/ConnectedAccount/ConnectedAccount.css` | 20 min |
| 8.7 | Migrate SubscriptionItem | `src/components/SubscriptionItem/SubscriptionItem.css` | 20 min |

### Phase 9: Community Components
| ID | Task | File | Est. Time |
|----|------|------|-----------|
| 9.1 | Migrate CommentSection | `src/components/Community/CommentSection.css` | 1 hour |
| 9.2 | Migrate PostCard | `src/components/Community/PostCard.css` | 45 min |
| 9.3 | Migrate VoteControl | `src/components/Community/VoteControl.css` | 30 min |
| 9.4 | Migrate CommunitySidebar | `src/components/Community/CommunitySidebar.css` | 45 min |
| 9.5 | Migrate CommunityPostsPromo | `src/components/CommunityPostsPromo/CommunityPostsPromo.css` | 30 min |

### Phase 10: Vehicle Components
| ID | Task | File | Est. Time |
|----|------|------|-----------|
| 10.1 | Migrate VehiclesSection | `src/components/VehiclesSection/VehiclesSection.css` | 45 min |
| 10.2 | Migrate VehicleLeadsStripe | `src/components/VehicleLeadsStripe/VehicleLeadsStripe.css` | 30 min |
| 10.3 | Migrate RecommendedVehiclesStripe | `src/components/RecommendedVehiclesStripe/RecommendedVehiclesStripe.css` | 30 min |
| 10.4 | Migrate EmptyVehicleSection | `src/components/EmptyVehicleSection/EmptyVehicleSection.css` | 20 min |

### Phase 11: Specialty Components
| ID | Task | File | Est. Time |
|----|------|------|-----------|
| 11.1 | Migrate TopTenCarousel | `src/components/TopTenCarousel/TopTenCarousel.css` | 1 hour |
| 11.2 | Migrate LocalListingsSidebar | `src/components/LocalListingsSidebar/LocalListingsSidebar.css` | 45 min |
| 11.3 | Migrate StickyRateBar | `src/components/StickyRateBar/StickyRateBar.css` | 45 min |
| 11.4 | Migrate UserReviews | `src/components/UserReviews/UserReviews.css` | 1 hour |
| 11.5 | Migrate AIInsights | `src/components/AIInsights/AIInsights.css` | 45 min |
| 11.6 | Migrate AIPersonalAssistant | `src/components/AIPersonalAssistant/AIPersonalAssistant.css` | 45 min |
| 11.7 | Migrate KnowYourBudget | `src/components/KnowYourBudget/KnowYourBudget.css` | 30 min |
| 11.8 | Migrate AdContainer | `src/components/AdContainer/AdContainer.css` | 20 min |

### Phase 12: Tooltip Components
| ID | Task | File | Est. Time |
|----|------|------|-----------|
| 12.1 | Migrate StaffRatingTooltip | `src/components/StaffRatingTooltip/StaffRatingTooltip.css` | 30 min |
| 12.2 | Migrate RatingDistributionTooltip | `src/components/RatingDistributionTooltip/RatingDistributionTooltip.css` | 30 min |

### Phase 13: Page Styles
| ID | Task | File | Est. Time |
|----|------|------|-----------|
| 13.1 | Migrate Home | `src/pages/Home/Home.css` | 1 hour |
| 13.2 | Migrate Article | `src/pages/Article/Article.css` | 1.5 hours |
| 13.3 | Migrate Profile | `src/pages/Profile/Profile.css` | 1 hour |
| 13.4 | Migrate VehicleDetails | `src/pages/VehicleDetails/VehicleDetails.css` | 1.5 hours |
| 13.5 | Migrate VehicleInventory | `src/pages/VehicleInventory/VehicleInventory.css` | 1 hour |
| 13.6 | Migrate Community | `src/pages/Community/Community.css` | 1 hour |
| 13.7 | Migrate NewCars | `src/pages/NewCars/NewCars.css` | 45 min |
| 13.8 | Migrate UsedCars | `src/pages/UsedCars/UsedCars.css` | 45 min |
| 13.9 | Migrate CarReviews | `src/pages/CarReviews/CarReviews.css` | 45 min |
| 13.10 | Migrate NewsAndReviews | `src/pages/NewsAndReviews/NewsAndReviews.css` | 45 min |
| 13.11 | Migrate LatestNews | `src/pages/LatestNews/LatestNews.css` | 45 min |
| 13.12 | Migrate EVHub | `src/pages/EVHub/EVHub.css` | 45 min |
| 13.13 | Migrate Videos | `src/pages/Videos/Videos.css` | 45 min |
| 13.14 | Migrate CompareVehicles | `src/pages/CompareVehicles/CompareVehicles.css` | 45 min |
| 13.15 | Migrate RankingsAndAwards | `src/pages/RankingsAndAwards/RankingsAndAwards.css` | 45 min |
| 13.16 | Migrate Membership | `src/pages/Membership/Membership.css` | 45 min |
| 13.17 | Migrate TopTenManagement | `src/pages/TopTenManagement/TopTenManagement.css` | 45 min |
| 13.18 | Migrate SignIn | `src/pages/SignIn/SignIn.css` | 45 min |
| 13.19 | Migrate Welcome | `src/pages/Welcome/Welcome.css` | 30 min |
| 13.20 | Migrate Sitemap | `src/pages/Sitemap/Sitemap.css` | 30 min |
| 13.21 | Migrate Documentation | `src/pages/Documentation/Documentation.css` | 30 min |
| 13.22 | Migrate DesignSystemReference | `src/pages/DesignSystemReference/DesignSystemReference.css` | 30 min |
| 13.23 | Migrate AtomicDesignAudit | `src/pages/AtomicDesignAudit/AtomicDesignAudit.css` | 20 min |
| 13.24 | Migrate BentleyShowcase | `src/pages/BentleyShowcase/BentleyShowcase.css` | 30 min |

### Phase 14: Onboarding Pages
| ID | Task | File | Est. Time |
|----|------|------|-----------|
| 14.1 | Migrate OnboardingStep1 | `src/pages/Onboarding/OnboardingStep1.css` | 45 min |
| 14.2 | Migrate OnboardingStep2 | `src/pages/Onboarding/OnboardingStep2.css` | 45 min |
| 14.3 | Migrate OnboardingStep3 | `src/pages/Onboarding/OnboardingStep3.css` | 45 min |
| 14.4 | Migrate OnboardingStep4 | `src/pages/Onboarding/OnboardingStep4.css` | 45 min |

---

## 🔧 Migration Strategy

### Approach: Use IDS Package + Incremental Migration

```
┌─────────────────────────────────────────────────────────────┐
│  1. Install @motortrend/ids                                  │
│  2. Import IDS Tailwind: @import '@motortrend/ids/tailwind' │
│  3. Migrate components one-by-one                           │
│  4. Delete CSS file after validation                        │
└─────────────────────────────────────────────────────────────┘
```

### CSS File Structure After Migration

```
src/
├── styles/
│   └── main.css          # @import '@motortrend/ids/tailwind'
├── components/
│   └── ComponentName/
│       ├── ComponentName.tsx  # Tailwind classes in JSX
│       └── (ComponentName.css deleted after migration)
└── pages/
    └── PageName/
        ├── PageName.tsx       # Tailwind classes in JSX
        └── (PageName.css deleted after migration)
```

### Recommended Order

```
Phase 0 (Setup) → Phase 2 (Atoms) → Phase 3 (Core UI) → Remaining phases
```

---

## 📊 Estimated Total Effort (UPDATED)

| Phase | Tasks | Estimated Hours |
|-------|-------|-----------------|
| Phase 0: Setup | 6 | **2.5 hours** ⬇️ |
| Phase 1: Core | 3 | 2 hours |
| Phase 2: Atoms | 9 | 5.5 hours |
| Phase 3: Core UI | 3 | 9 hours |
| Phase 4: Cards | 9 | 6 hours |
| Phase 5: Content | 7 | 5.5 hours |
| Phase 6: Interactive | 4 | 2 hours |
| Phase 7: Modals | 6 | 5 hours |
| Phase 8: Profile | 7 | 3.5 hours |
| Phase 9: Community | 5 | 3.5 hours |
| Phase 10: Vehicle | 4 | 2 hours |
| Phase 11: Specialty | 8 | 6 hours |
| Phase 12: Tooltips | 2 | 1 hour |
| Phase 13: Pages | 24 | 18 hours |
| Phase 14: Onboarding | 4 | 3 hours |
| **Total** | **101** | **~75 hours** ⬇️ |

**Savings with IDS:** ~37 hours (reduced from ~112 hours)

---

## ✅ Pre-Migration Checklist

Before starting migration:

- [ ] Install `@motortrend/ids` package
- [ ] Create CSS file with `@import '@motortrend/ids/tailwind'`
- [ ] Verify IDS Tailwind classes work in dev server
- [ ] Review IDS Storybook documentation for available classes
- [ ] Document any tokens in your CSS not covered by IDS
- [ ] Create migration branch
- [ ] Set up visual regression testing (optional but recommended)

---

## 🎯 Success Criteria

A component is considered successfully migrated when:

1. ✅ All CSS styles converted to Tailwind/IDS classes
2. ✅ Visual appearance matches original design
3. ✅ All responsive breakpoints work correctly
4. ✅ All hover/focus/active states work correctly
5. ✅ Accessibility features preserved
6. ✅ No TypeScript errors
7. ✅ Original CSS file deleted
8. ✅ Component renders correctly in browser

---

## 📝 Notes

### IDS Package Benefits
- Pre-configured design tokens matching Figma design system
- Consistent with other MotorTrend properties
- Reduces custom configuration to near-zero
- Maintained by design system team

### Files to Review for IDS Overlap
- `src/design-system/global.css` - CTA system may overlap with IDS buttons
- `src/design-system/tokens/*.ts` - Should align with IDS tokens

### Duplicate Components to Consolidate
- `atoms/Badge` ↔ `design-system/components/Badge`
- `atoms/CardShell` ↔ `design-system/components/CardShell`
- `atoms/Tooltip` ↔ `design-system/components/Tooltip`

---

**Next Step:** Begin with **Phase 0** - Install `@motortrend/ids` and set up the Tailwind import.

```bash
npm install @motortrend/ids
```

---

**Last Updated:** December 5, 2025  
**IDS Documentation:** [https://ids.motortrend.com](https://ids.motortrend.com/?path=/docs/getting-started--documentation)


