/**
 * Main Application Component
 * Integrates Figma design system with React Router
 */

import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import GlobalHeader from './components/GlobalHeader';
import GlobalFooter from './components/GlobalFooter';
import SignIn from './pages/SignIn';
import { OnboardingStep1, OnboardingStep2, OnboardingStep3, OnboardingStep4 } from './pages/Onboarding';
import Welcome from './pages/Welcome';
import Profile from './pages/Profile';
import { Membership } from './pages/Membership';
import './App.css';

function App() {
  return (
    <Router>
      <div className="app">
        <GlobalHeader />
        
        <main className="app__main">
          <Routes>
            {/* Default route - redirect to sign in */}
            <Route path="/" element={<Navigate to="/signin" replace />} />
            
            {/* Sign In Page */}
            <Route path="/signin" element={<SignIn />} />
            
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
            <Route path="/my-account/settings" element={<Profile />} />
            
            {/* Membership Page */}
            <Route path="/membership" element={<Membership />} />
            
            {/* Catch all route - redirect to sign in */}
            <Route path="*" element={<Navigate to="/signin" replace />} />
          </Routes>
        </main>

        <GlobalFooter />
      </div>
    </Router>
  );
}

export default App;
