# Tailwind Migration Checklist

**Status Legend:** ⬜ Not Started | 🟡 In Progress | ✅ Complete | ⏸️ Blocked

**IDS Documentation:** [https://ids.motortrend.com](https://ids.motortrend.com/?path=/docs/getting-started--documentation)

---

## Phase 0: Setup & Configuration ✅ COMPLETE

| Status | Task | Notes |
|--------|------|-------|
| ⏸️ | Run `npm install @motortrend/ids` | Private package - skipped |
| ✅ | Create `src/styles/tailwind.css` | Custom theme with design tokens |
| ✅ | Create `postcss.config.js` | Configured @tailwindcss/postcss |
| ✅ | Create `src/utils/cn.ts` | Class merge utility (clsx + tailwind-merge) |
| ✅ | Import tailwind.css in main.tsx | Added before global.css |
| ✅ | Verify Tailwind works | App renders correctly with HMR |

---

## Phase 1: Design System Core

| Status | Task | File | Lines |
|--------|------|------|-------|
| ⬜ | Migrate global.css | `src/design-system/global.css` | ~425 |
| ⬜ | Migrate index.css | `src/index.css` | ~43 |
| ⬜ | Migrate App.css | `src/App.css` | ~varies |

---

## Phase 2: Design System Atoms

**Note:** Consolidate duplicates during migration (atoms vs design-system versions)

| Status | Task | File | Notes |
|--------|------|------|-------|
| ✅ | Migrate Badge | `src/components/atoms/Badge/Badge.css` | Consolidated with ds version |
| ⬜ | Migrate Button | `src/design-system/components/Button/Button.css` | CTA system |
| ⬜ | Migrate CardShell | `src/components/atoms/CardShell/CardShell.css` | Consolidate with ds version |
| ⬜ | Migrate TextField | `src/design-system/components/TextField/TextField.css` | |
| ⬜ | Migrate Tooltip | `src/components/atoms/Tooltip/Tooltip.css` | Consolidate with ds version |
| ⬜ | Migrate ModalShell | `src/components/atoms/ModalShell/ModalShell.css` | |
| ⬜ | Migrate Popover | `src/components/atoms/Popover/Popover.css` | |
| ⬜ | Migrate ActionBadge | `src/components/molecules/ActionBadge/ActionBadge.css` | |
| ⬜ | Migrate Icon | `src/components/Icon/Icon.css` | |

---

## Phase 3: Core UI Components

| Status | Task | File | Lines |
|--------|------|------|-------|
| ⬜ | Migrate GlobalHeader | `src/components/GlobalHeader/GlobalHeader.css` | ~1410 |
| ⬜ | Migrate GlobalFooter | `src/components/GlobalFooter/GlobalFooter.css` | |
| ⬜ | Migrate Card | `src/components/Card/Card.css` | ~637 |

---

## Phase 4: Card Components

| Status | Task | File |
|--------|------|------|
| ⬜ | Migrate VideoCard | `src/components/VideoCard/VideoCard.css` |
| ⬜ | Migrate VehicleCard | `src/components/VehicleCard/VehicleCard.css` |
| ⬜ | Migrate HeroCard | `src/components/HeroCard/HeroCard.css` |
| ⬜ | Migrate HorizontalCard | `src/components/HorizontalCard/HorizontalCard.css` |
| ⬜ | Migrate VerticalCard | `src/components/VerticalCard/VerticalCard.css` |
| ⬜ | Migrate ComparisonCard | `src/components/ComparisonCard/ComparisonCard.css` |
| ⬜ | Migrate MembershipCard | `src/components/MembershipCard/MembershipCard.css` |
| ⬜ | Migrate BaTAuctionCard | `src/components/BaTAuctionCard/BaTAuctionCard.css` |
| ⬜ | Migrate EmptyVehiclesCard | `src/components/EmptyVehiclesCard/EmptyVehiclesCard.css` |

---

## Phase 5: Content Components

| Status | Task | File |
|--------|------|------|
| ⬜ | Migrate ArticleHero | `src/components/ArticleHero/ArticleHero.css` |
| ⬜ | Migrate ArticleScoreCard | `src/components/ArticleScoreCard/ArticleScoreCard.css` |
| ⬜ | Migrate ArticleReactions | `src/components/ArticleReactions/ArticleReactions.css` |
| ⬜ | Migrate HeroPlusThree | `src/components/HeroPlusThree/HeroPlusThree.css` |
| ⬜ | Migrate NewsSection | `src/components/NewsSection/NewsSection.css` |
| ⬜ | Migrate River | `src/components/River/River.css` |
| ⬜ | Migrate PhotoGallery | `src/components/PhotoGallery/PhotoGallery.css` |

---

## Phase 6: Interactive Components

| Status | Task | File |
|--------|------|------|
| ⬜ | Migrate VehicleSearch | `src/components/VehicleSearch/VehicleSearch.css` |
| ⬜ | Migrate LocationAutocomplete | `src/components/LocationAutocomplete/LocationAutocomplete.css` |
| ⬜ | Migrate Toast | `src/components/Toast/Toast.css` |
| ⬜ | Migrate ReviewSubmittedToast | `src/components/ReviewSubmittedToast/ReviewSubmittedToast.css` |

---

## Phase 7: Modal Components

| Status | Task | File |
|--------|------|------|
| ⬜ | Migrate RatingModal | `src/components/RatingModal/RatingModal.css` |
| ⬜ | Migrate WriteReviewModal | `src/components/WriteReviewModal/WriteReviewModal.css` |
| ⬜ | Migrate SavedModal | `src/components/SavedModal/SavedModal.css` |
| ⬜ | Migrate AvatarBannerModal | `src/components/AvatarBannerModal/AvatarBannerModal.css` |
| ⬜ | Migrate CreatePostModal | `src/components/Community/CreatePostModal.css` |
| ⬜ | Migrate CreateCommunityModal | `src/components/Community/CreateCommunityModal.css` |

---

## Phase 8: Profile Components

| Status | Task | File |
|--------|------|------|
| ⬜ | Migrate ProfileNav | `src/components/ProfileNav/ProfileNav.css` |
| ⬜ | Migrate ProfileBanner | `src/components/ProfileBanner/ProfileBanner.css` |
| ⬜ | Migrate ProfileCompletionCard | `src/components/ProfileCompletionCard/ProfileCompletionCard.css` |
| ⬜ | Migrate EditableField | `src/components/EditableField/EditableField.css` |
| ⬜ | Migrate CollapsibleSection | `src/components/CollapsibleSection/CollapsibleSection.css` |
| ⬜ | Migrate ConnectedAccount | `src/components/ConnectedAccount/ConnectedAccount.css` |
| ⬜ | Migrate SubscriptionItem | `src/components/SubscriptionItem/SubscriptionItem.css` |

---

## Phase 9: Community Components

| Status | Task | File |
|--------|------|------|
| ⬜ | Migrate CommentSection | `src/components/Community/CommentSection.css` |
| ⬜ | Migrate PostCard | `src/components/Community/PostCard.css` |
| ⬜ | Migrate VoteControl | `src/components/Community/VoteControl.css` |
| ⬜ | Migrate CommunitySidebar | `src/components/Community/CommunitySidebar.css` |
| ⬜ | Migrate CommunityPostsPromo | `src/components/CommunityPostsPromo/CommunityPostsPromo.css` |

---

## Phase 10: Vehicle Components

| Status | Task | File |
|--------|------|------|
| ⬜ | Migrate VehiclesSection | `src/components/VehiclesSection/VehiclesSection.css` |
| ⬜ | Migrate VehicleLeadsStripe | `src/components/VehicleLeadsStripe/VehicleLeadsStripe.css` |
| ⬜ | Migrate RecommendedVehiclesStripe | `src/components/RecommendedVehiclesStripe/RecommendedVehiclesStripe.css` |
| ⬜ | Migrate EmptyVehicleSection | `src/components/EmptyVehicleSection/EmptyVehicleSection.css` |

---

## Phase 11: Specialty Components

| Status | Task | File |
|--------|------|------|
| ⬜ | Migrate TopTenCarousel | `src/components/TopTenCarousel/TopTenCarousel.css` |
| ⬜ | Migrate LocalListingsSidebar | `src/components/LocalListingsSidebar/LocalListingsSidebar.css` |
| ⬜ | Migrate StickyRateBar | `src/components/StickyRateBar/StickyRateBar.css` |
| ⬜ | Migrate UserReviews | `src/components/UserReviews/UserReviews.css` |
| ⬜ | Migrate AIInsights | `src/components/AIInsights/AIInsights.css` |
| ⬜ | Migrate AIPersonalAssistant | `src/components/AIPersonalAssistant/AIPersonalAssistant.css` |
| ⬜ | Migrate KnowYourBudget | `src/components/KnowYourBudget/KnowYourBudget.css` |
| ⬜ | Migrate AdContainer | `src/components/AdContainer/AdContainer.css` |

---

## Phase 12: Tooltip Components

| Status | Task | File |
|--------|------|------|
| ⬜ | Migrate StaffRatingTooltip | `src/components/StaffRatingTooltip/StaffRatingTooltip.css` |
| ⬜ | Migrate RatingDistributionTooltip | `src/components/RatingDistributionTooltip/RatingDistributionTooltip.css` |

---

## Phase 13: Page Styles

| Status | Task | File |
|--------|------|------|
| ⬜ | Migrate Home | `src/pages/Home/Home.css` |
| ⬜ | Migrate Article | `src/pages/Article/Article.css` |
| ⬜ | Migrate Profile | `src/pages/Profile/Profile.css` |
| ⬜ | Migrate VehicleDetails | `src/pages/VehicleDetails/VehicleDetails.css` |
| ⬜ | Migrate VehicleInventory | `src/pages/VehicleInventory/VehicleInventory.css` |
| ⬜ | Migrate Community | `src/pages/Community/Community.css` |
| ⬜ | Migrate NewCars | `src/pages/NewCars/NewCars.css` |
| ⬜ | Migrate UsedCars | `src/pages/UsedCars/UsedCars.css` |
| ⬜ | Migrate CarReviews | `src/pages/CarReviews/CarReviews.css` |
| ⬜ | Migrate NewsAndReviews | `src/pages/NewsAndReviews/NewsAndReviews.css` |
| ⬜ | Migrate LatestNews | `src/pages/LatestNews/LatestNews.css` |
| ⬜ | Migrate EVHub | `src/pages/EVHub/EVHub.css` |
| ⬜ | Migrate Videos | `src/pages/Videos/Videos.css` |
| ⬜ | Migrate CompareVehicles | `src/pages/CompareVehicles/CompareVehicles.css` |
| ⬜ | Migrate RankingsAndAwards | `src/pages/RankingsAndAwards/RankingsAndAwards.css` |
| ⬜ | Migrate Membership | `src/pages/Membership/Membership.css` |
| ⬜ | Migrate TopTenManagement | `src/pages/TopTenManagement/TopTenManagement.css` |
| ⬜ | Migrate SignIn | `src/pages/SignIn/SignIn.css` |
| ⬜ | Migrate Welcome | `src/pages/Welcome/Welcome.css` |
| ⬜ | Migrate Sitemap | `src/pages/Sitemap/Sitemap.css` |
| ⬜ | Migrate Documentation | `src/pages/Documentation/Documentation.css` |
| ⬜ | Migrate DesignSystemReference | `src/pages/DesignSystemReference/DesignSystemReference.css` |
| ⬜ | Migrate AtomicDesignAudit | `src/pages/AtomicDesignAudit/AtomicDesignAudit.css` |
| ⬜ | Migrate BentleyShowcase | `src/pages/BentleyShowcase/BentleyShowcase.css` |

---

## Phase 14: Onboarding Pages

| Status | Task | File |
|--------|------|------|
| ⬜ | Migrate OnboardingStep1 | `src/pages/Onboarding/OnboardingStep1.css` |
| ⬜ | Migrate OnboardingStep2 | `src/pages/Onboarding/OnboardingStep2.css` |
| ⬜ | Migrate OnboardingStep3 | `src/pages/Onboarding/OnboardingStep3.css` |
| ⬜ | Migrate OnboardingStep4 | `src/pages/Onboarding/OnboardingStep4.css` |

---

## Migration Progress Summary

| Phase | Total | Complete | Remaining |
|-------|-------|----------|-----------|
| Phase 0 | 6 | 6 | 0 ✅ |
| Phase 1 | 3 | 0 | 3 |
| Phase 2 | 9 | 1 | 8 |
| Phase 3 | 3 | 0 | 3 |
| Phase 4 | 9 | 0 | 9 |
| Phase 5 | 7 | 0 | 7 |
| Phase 6 | 4 | 0 | 4 |
| Phase 7 | 6 | 0 | 6 |
| Phase 8 | 7 | 0 | 7 |
| Phase 9 | 5 | 0 | 5 |
| Phase 10 | 4 | 0 | 4 |
| Phase 11 | 8 | 0 | 8 |
| Phase 12 | 2 | 0 | 2 |
| Phase 13 | 24 | 0 | 24 |
| Phase 14 | 4 | 0 | 4 |
| **Total** | **101** | **0** | **101** |

**Estimated Total Effort:** ~75 hours (using IDS package)

---

## Quick Reference: IDS Tailwind Class Mappings

**Reference IDS Storybook for full list:** [ids.motortrend.com](https://ids.motortrend.com/?path=/docs/getting-started--documentation)

### Colors (Expected IDS Classes)
```
bg-neutrals-1  →  #141416  (Headers, footers)
bg-neutrals-2  →  #23262F  (Dark backgrounds)
bg-neutrals-3  →  #353945  (Buttons, borders)
text-neutrals-4  →  #6E7481  (Secondary text)
text-neutrals-5  →  #B1B5C3  (Tertiary text)
border-neutrals-6  →  #E6E8EC  (Borders)
bg-neutrals-7  →  #F4F5F6  (Light backgrounds)
bg-neutrals-8  →  #FCFCFD  (White backgrounds)
bg-primary     →  #E90C17  (MotorTrend Red)
```

### Spacing (8px base)
```
p-2   →  8px   (--spacing-1)
p-4   →  16px  (--spacing-2)
p-6   →  24px  (--spacing-3)
p-8   →  32px  (--spacing-4)
p-10  →  40px  (--spacing-5)
p-12  →  48px  (--spacing-6)
```

### Typography
```
font-heading  →  Poppins
font-body     →  Geist
text-xs   →  12px
text-sm   →  14px
text-base →  16px
text-lg   →  18px
text-2xl  →  24px
```

### Border Radius
```
rounded or rounded-sm  →  4px  (--border-radius-sm)
rounded-lg   →  8px  (--border-radius-md)
rounded-2xl  →  16px (--border-radius-lg)
rounded-full →  100px (--border-radius-full)
```

### Breakpoints
```
sm:   →  640px
md:   →  768px  (mobile breakpoint)
lg:   →  1024px (tablet breakpoint)
xl:   →  1280px (desktop container max-width)
```

---

## Setup Command

```bash
# Install IDS package
npm install @motortrend/ids

# Then create src/styles/main.css with:
# @import '@motortrend/ids/tailwind';
```

---

**Last Updated:** December 5, 2025  
**IDS Documentation:** [https://ids.motortrend.com](https://ids.motortrend.com/?path=/docs/getting-started--documentation)


