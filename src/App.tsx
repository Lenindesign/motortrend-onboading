/**
 * Main Application Component
 * Integrates Figma design system with React Router
 */

import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import GlobalHeader from './components/GlobalHeader';
import GlobalFooter from './components/GlobalFooter';
import { ScrollToTop } from './components/ScrollToTop';
import SignIn from './pages/SignIn';
import { OnboardingStep1, OnboardingStep2, OnboardingStep3, OnboardingStep4 } from './pages/Onboarding';
import Welcome from './pages/Welcome';
import Profile from './pages/Profile';
import { Membership } from './pages/Membership';
import VehicleDetails from './pages/VehicleDetails';
import { VehicleInventory } from './pages/VehicleInventory';
import { Home } from './pages/Home';
import { Article } from './pages/Article';
import NewCars from './pages/NewCars';
import UsedCars from './pages/UsedCars';
import Deals, { BuyingDealsPage, LeaseDealsPage } from './pages/Deals';
import CarReviews from './pages/CarReviews';
import CompareVehicles from './pages/CompareVehicles';
import EVHub from './pages/EVHub';
import NewsAndReviews from './pages/NewsAndReviews';
import LatestNews from './pages/LatestNews';
import Videos from './pages/Videos';
import Community from './pages/Community';
import RankingsAndAwards from './pages/RankingsAndAwards';
import { EmailPreviewPage, RateYourCarEmailPreview } from './pages/EmailPreviewPage';
import Documentation from './pages/Documentation';
import { BentleyShowcase } from './pages/BentleyShowcase';
import OnboardingDocumentation from './pages/OnboardingDocumentation';
import ProfileDocumentation from './pages/ProfileDocumentation';
import DesignSystemReference from './pages/DesignSystemReference';
import Sitemap from './pages/Sitemap';
import AtomicDesignAudit from './pages/AtomicDesignAudit';
import TopTenManagement from './pages/TopTenManagement/TopTenManagement';
import { JourneyBuilder } from './pages/JourneyBuilder';
import { Events, EventsCommunity } from './pages/Events';
import RateYourCar from './pages/RateYourCar';
import AutoLoanCalculator from './pages/AutoLoanCalculator';
import { RatingProvider } from './contexts/RatingContext';
import { AuthProvider } from './contexts/AuthContext';
import './App.css';

// Layout component that conditionally renders header/footer
const AppLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  
  // Pages that should hide the global header and footer
  const fullScreenPages = ['/journey-builder'];
  const isFullScreenPage = fullScreenPages.includes(location.pathname);

  return (
    <div className="app">
      {!isFullScreenPage && <GlobalHeader />}
      <main className="app__main">
        {children}
      </main>
      {!isFullScreenPage && <GlobalFooter />}
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
    <RatingProvider>
      <Router>
        <ScrollToTop />
        <AppLayout>
          <Routes>
              {/* Default route - show home page */}
              <Route path="/" element={<Home />} />
              
              {/* Sign In Page */}
              <Route path="/signin" element={<SignIn />} />
              
              {/* Vehicle Inventory */}
              <Route path="/vehicles" element={<VehicleInventory />} />
              
              {/* New Cars Page */}
              <Route path="/new-cars" element={<NewCars />} />
              
              {/* Used Cars Page */}
              <Route path="/used-cars" element={<UsedCars />} />

              {/* Deals Page */}
              <Route path="/deals" element={<Deals />} />
              <Route path="/deals/best-buying-deals" element={<BuyingDealsPage />} />
              <Route path="/deals/lease" element={<LeaseDealsPage />} />
              
              {/* Car Reviews Page */}
              <Route path="/car-reviews" element={<CarReviews />} />
              
              {/* Compare Vehicles Page */}
              <Route path="/compare-vehicles" element={<CompareVehicles />} />
              
              {/* EV Hub Page */}
              <Route path="/ev-hub" element={<EVHub />} />
              
              {/* News & Reviews Page */}
              <Route path="/news-reviews" element={<NewsAndReviews />} />
              
              {/* Latest News Page */}
              <Route path="/latest-news" element={<LatestNews />} />
              
              {/* Videos Page */}
              <Route path="/videos" element={<Videos />} />
              
              {/* Community Page */}
              <Route path="/community" element={<Community />} />
              <Route path="/community/popular" element={<Community />} />
              <Route path="/community/:slug" element={<Community />} />
              <Route path="/community/:slug/post/:postId" element={<Community />} />
              
              {/* Rankings & Awards Page */}
              <Route path="/rankings-awards" element={<RankingsAndAwards />} />
              
              {/* Events Pages */}
              <Route path="/events" element={<EventsCommunity />} />
              <Route path="/events/browse" element={<Events />} />
              <Route path="/events/:slug" element={<Events />} />
              
              {/* Email Preview Page (for CDP/personalization demo) */}
              <Route path="/email-preview" element={<EmailPreviewPage />} />
              <Route path="/email-preview/rate-your-car" element={<RateYourCarEmailPreview />} />
              
              {/* Onboarding Steps */}
              <Route path="/onboarding/step1" element={<OnboardingStep1 />} />
              <Route path="/onboarding/step2" element={<OnboardingStep2 />} />
              <Route path="/onboarding/step3" element={<OnboardingStep3 />} />
              <Route path="/onboarding/step4" element={<OnboardingStep4 />} />
              
              {/* Welcome/Complete Page */}
              <Route path="/welcome" element={<Welcome />} />
              
              {/* Profile Pages */}
              <Route path="/profile" element={<Profile />} />
              <Route path="/my-account" element={<Navigate to="/my-account/profile" replace />} />
              <Route path="/my-account/profile" element={<Profile />} />
              <Route path="/my-account/saved-items" element={<Profile />} />
              <Route path="/my-account/subscriptions" element={<Profile />} />
              
              {/* Membership Page */}
              <Route path="/membership" element={<Membership />} />
              
              {/* Vehicle Details Page */}
              <Route path="/vehicles/:year/:make/:model" element={<VehicleDetails />} />
              
              {/* Article Page */}
              <Route path="/article/:slug" element={<Article />} />
              <Route path="/articles/:slug" element={<Article />} />
              
              {/* Documentation Pages */}
              <Route path="/documentation/review-system" element={<Documentation />} />
              <Route path="/docs/review-system" element={<Documentation />} />
              <Route path="/documentation/onboarding" element={<OnboardingDocumentation />} />
              <Route path="/docs/onboarding" element={<OnboardingDocumentation />} />
              <Route path="/documentation/profile" element={<ProfileDocumentation />} />
              <Route path="/docs/profile" element={<ProfileDocumentation />} />
              <Route path="/design-system" element={<DesignSystemReference />} />
              <Route path="/bentley-showcase" element={<BentleyShowcase />} />
              <Route path="/docs/design-system" element={<DesignSystemReference />} />
              <Route path="/documentation/atomic-design-audit" element={<AtomicDesignAudit />} />
              <Route path="/docs/atomic-design-audit" element={<AtomicDesignAudit />} />
              
              {/* Sitemap */}
              <Route path="/sitemap" element={<Sitemap />} />
              
              {/* Top Ten Management */}
              <Route path="/top-ten-management" element={<TopTenManagement />} />
              <Route path="/docs/top-ten-management" element={<TopTenManagement />} />
              
              {/* Page Builder */}
              <Route path="/journey-builder" element={<JourneyBuilder />} />
              
              {/* Rate Your Car Landing Page (email campaign) */}
              <Route path="/rate-your-car" element={<RateYourCar />} />

              {/* Auto Loan Calculator */}
              <Route path="/auto-loan-calculator" element={<AutoLoanCalculator />} />
              <Route path="/auto-loan-calculator/:stepSlug" element={<AutoLoanCalculator />} />
              
              {/* Catch all route - redirect to sign in */}
              <Route path="*" element={<Navigate to="/signin" replace />} />
            </Routes>
        </AppLayout>
      </Router>
    </RatingProvider>
    </AuthProvider>
  );
}

export default App;
