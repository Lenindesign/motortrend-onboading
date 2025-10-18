/**
 * Main Application Component
 * Integrates Figma design system with Sign In and Onboarding pages
 */

import { useState } from 'react';
import GlobalHeader from './components/GlobalHeader';
import GlobalFooter from './components/GlobalFooter';
import SignIn from './pages/SignIn';
import { OnboardingStep1, OnboardingStep2, OnboardingStep3, OnboardingStep4 } from './pages/Onboarding';
import Welcome from './pages/Welcome';
import Profile from './pages/Profile';
import type { OnboardingStatus } from './components/ProfileCompletionCard';
import './App.css';

type AppPage = 'signin' | 'onboarding' | 'complete' | 'profile';
type OnboardingStep = 1 | 2 | 3 | 4;

interface OnboardingData {
  name?: string;
  location?: string;
  interests?: string[];
  vehicleType?: 'own' | 'want';
  vehicle?: string;
  newsletters?: string[];
}

function App() {
  const [currentPage, setCurrentPage] = useState<AppPage>('signin');
  const [onboardingStep, setOnboardingStep] = useState<OnboardingStep>(1);
  const [onboardingData, setOnboardingData] = useState<OnboardingData>({});
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [onboardingCompletion, setOnboardingCompletion] = useState<OnboardingStatus>({
    step1: false,
    step2: false,
    step3: false,
    step4: false,
  });

  const handleSignIn = (email: string, password: string) => {
    console.log('Sign in with:', email, password);
    // Mark user as authenticated and navigate to onboarding
    setIsAuthenticated(true);
    setCurrentPage('onboarding');
    setOnboardingStep(1);
  };

  const handleSocialSignIn = (provider: 'google' | 'facebook' | 'apple') => {
    console.log('Sign in with:', provider);
    // Mark user as authenticated and navigate to onboarding
    setIsAuthenticated(true);
    setCurrentPage('onboarding');
    setOnboardingStep(1);
  };

  const handleSignUpClick = () => {
    console.log('Navigate to Sign Up');
    // TODO: Implement navigation to Sign Up page
  };

  const handleForgotPasswordClick = () => {
    console.log('Navigate to Forgot Password');
    // TODO: Implement forgot password flow
  };

  const handleStep1Next = (data: { name: string; location: string }) => {
    console.log('Step 1 data:', data);
    setOnboardingData({ ...onboardingData, ...data });
    setOnboardingCompletion({ ...onboardingCompletion, step1: true });
    setOnboardingStep(2);
  };

  const handleStep2Next = (data: { interests: string[] }) => {
    console.log('Step 2 data:', data);
    setOnboardingData({ ...onboardingData, ...data });
    setOnboardingCompletion({ ...onboardingCompletion, step2: true });
    setOnboardingStep(3);
  };

  const handleStep2Previous = () => {
    setOnboardingStep(1);
  };

  const handleStep3Next = (data: { vehicleType: 'own' | 'want'; vehicle: string }) => {
    console.log('Step 3 data:', data);
    setOnboardingData({ ...onboardingData, ...data });
    setOnboardingCompletion({ ...onboardingCompletion, step3: true });
    setOnboardingStep(4);
  };

  const handleStep3Previous = () => {
    setOnboardingStep(2);
  };

  const handleStep4Next = (data: { newsletters: string[] }) => {
    console.log('Step 4 data:', data);
    const finalData = { ...onboardingData, ...data };
    setOnboardingData(finalData);
    setOnboardingCompletion({ ...onboardingCompletion, step4: true });
    
    console.log('Onboarding completed! Final data:', finalData);
    alert('🎉 Onboarding Complete! Welcome to MotorTrend!\n\nYour preferences have been saved.');
    
    // Navigate to complete state (or main app)
    setCurrentPage('complete');
  };

  const handleStep4Previous = () => {
    setOnboardingStep(3);
  };

  const handleUpdateStep1 = (data: { name: string; location: string }) => {
    console.log('Update Step 1:', data);
    setOnboardingData({ ...onboardingData, ...data });
    setOnboardingCompletion({ ...onboardingCompletion, step1: true });
  };

  const handleUpdateStep2 = (data: { interests: string[] }) => {
    console.log('Update Step 2:', data);
    setOnboardingData({ ...onboardingData, ...data });
    setOnboardingCompletion({ ...onboardingCompletion, step2: true });
  };

  const handleUpdateStep3 = (data: { vehicleType: 'own' | 'want'; vehicle: string }) => {
    console.log('Update Step 3:', data);
    setOnboardingData({ ...onboardingData, ...data });
    setOnboardingCompletion({ ...onboardingCompletion, step3: true });
  };

  const handleUpdateStep4 = (data: { newsletters: string[] }) => {
    console.log('Update Step 4:', data);
    setOnboardingData({ ...onboardingData, ...data });
    setOnboardingCompletion({ ...onboardingCompletion, step4: true });
  };

  const handleOnboardingSkip = () => {
    console.log('Skip onboarding');
    setCurrentPage('profile'); // Navigate to profile page after skipping
    alert('Skipping onboarding - You can complete it later from My Account!');
  };

  const handleNewsletterClick = () => {
    console.log('Newsletter clicked');
    // TODO: Implement newsletter signup
  };

  const handleReportIssueClick = () => {
    console.log('Report Issue clicked');
    // TODO: Implement report issue dialog
  };

  return (
    <div className="app">
      <GlobalHeader 
        onSignInClick={() => setCurrentPage('signin')}
        onProfileClick={() => setCurrentPage('profile')}
        isAuthenticated={isAuthenticated}
      />
      
      <main className="app__main">
        {currentPage === 'signin' && (
          <SignIn
            onSignIn={handleSignIn}
            onSocialSignIn={handleSocialSignIn}
            onSignUpClick={handleSignUpClick}
            onForgotPasswordClick={handleForgotPasswordClick}
          />
        )}

        {currentPage === 'onboarding' && onboardingStep === 1 && (
          <OnboardingStep1
            onNext={handleStep1Next}
            onSkip={handleOnboardingSkip}
            initialData={onboardingData}
          />
        )}

        {currentPage === 'onboarding' && onboardingStep === 2 && (
          <OnboardingStep2
            onNext={handleStep2Next}
            onPrevious={handleStep2Previous}
            onSkip={handleOnboardingSkip}
            initialData={onboardingData}
          />
        )}

        {currentPage === 'onboarding' && onboardingStep === 3 && (
          <OnboardingStep3
            onNext={handleStep3Next}
            onPrevious={handleStep3Previous}
            onSkip={handleOnboardingSkip}
            initialData={onboardingData}
          />
        )}

        {currentPage === 'onboarding' && onboardingStep === 4 && (
          <OnboardingStep4
            onNext={handleStep4Next}
            onPrevious={handleStep4Previous}
            onSkip={handleOnboardingSkip}
            initialData={onboardingData}
          />
        )}

        {currentPage === 'complete' && (
          <Welcome
            userData={onboardingData}
            onGoHome={() => {
              setCurrentPage('profile');
              console.log('Navigate to profile page');
            }}
            onCustomizeAgain={() => {
              setCurrentPage('onboarding');
              setOnboardingStep(1);
              console.log('Restart onboarding');
            }}
          />
        )}

              {currentPage === 'profile' && (
                <Profile
                  userData={{
                    name: onboardingData.name || 'Greg Smith',
                    joinDate: '1/14/224',
                    location: onboardingData.location || 'Orange County, CA',
                  }}
                  onboardingCompletion={onboardingCompletion}
                  onboardingData={onboardingData}
                  onUpdateStep1={handleUpdateStep1}
                  onUpdateStep2={handleUpdateStep2}
                  onUpdateStep3={handleUpdateStep3}
                  onUpdateStep4={handleUpdateStep4}
                />
              )}
      </main>

      <GlobalFooter
        onNewsletterClick={handleNewsletterClick}
        onReportIssueClick={handleReportIssueClick}
      />
    </div>
  );
}

export default App;
