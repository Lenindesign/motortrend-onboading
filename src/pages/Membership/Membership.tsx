/**
 * Membership Page
 * Displays the membership card component
 */

import React, { useState, useEffect } from 'react';
import { MembershipCard } from '../../components/MembershipCard';
import './Membership.css';

export const Membership: React.FC = () => {
  const [userData, setUserData] = useState<{
    name: string;
    memberSince?: string;
    car?: string;
    newsletter?: string;
  }>({
    name: 'Lenin Aviles',
    memberSince: '09/27/2025',
    car: '2021 Subaru WRX',
    newsletter: undefined
  });

  // Load user data from localStorage
  useEffect(() => {
    try {
      const onboardingData = localStorage.getItem('onboardingData');
      
      // Debug: Log what's in localStorage
      console.log('🔍 [Membership] localStorage onboardingData:', onboardingData);
      
      if (onboardingData) {
        const data = JSON.parse(onboardingData);
        
        // Debug: Log parsed data and newsletter info
        console.log('🔍 [Membership] Parsed onboarding data:', data);
        console.log('🔍 [Membership] newsletters array:', data.newsletters);
        console.log('🔍 [Membership] newsletters type:', typeof data.newsletters);
        console.log('🔍 [Membership] newsletters is array?', Array.isArray(data.newsletters));
        console.log('🔍 [Membership] newsletters length:', data.newsletters?.length);
        console.log('🔍 [Membership] legacy newsletter property:', data.newsletter);
        
        // Map newsletter IDs to display names
        const newsletterMap: Record<string, string> = {
          'motortrend': 'MotorTrend',
          'hotrod': 'HOT ROD',
          'events': 'Events'
        };
        
        // Get first newsletter from array, or undefined if empty/not exists
        // Also check for legacy singular 'newsletter' property
        let newsletter: string | undefined;
        
        if (data.newsletters && Array.isArray(data.newsletters) && data.newsletters.length > 0) {
          const newsletterId = data.newsletters[0];
          newsletter = newsletterMap[newsletterId] || newsletterId;
          console.log('🔍 [Membership] Using newsletters array, ID:', newsletterId, 'Display name:', newsletter);
        } else if (data.newsletter) {
          // Handle legacy singular newsletter property
          const newsletterId = data.newsletter;
          newsletter = newsletterMap[newsletterId] || newsletterId;
          console.log('🔍 [Membership] Using legacy newsletter property, ID:', newsletterId, 'Display name:', newsletter);
        } else {
          // Explicitly set to undefined if no newsletter is selected
          newsletter = undefined;
          console.log('🔍 [Membership] No newsletter found, setting to undefined');
        }
        
        console.log('🔍 [Membership] Final newsletter value:', newsletter);
        
        setUserData(prev => ({
          ...prev,
          name: data.name || prev.name,
          car: data.vehicle || prev.car,
          memberSince: data.memberSince || prev.memberSince,
          newsletter: newsletter
        }));
      } else {
        // If no onboarding data exists, explicitly set newsletter to undefined
        console.log('🔍 [Membership] No onboardingData in localStorage, setting newsletter to undefined');
        setUserData(prev => ({
          ...prev,
          newsletter: undefined
        }));
      }
    } catch (error) {
      console.error('Error loading user data:', error);
    }
  }, []);

  return (
    <div className="membership-page">
      <div className="membership-page__container">
        <div className="membership-page__header">
          <h1 className="membership-page__title">Your Membership</h1>
          <p className="membership-page__subtitle">
            Welcome to the MotorTrend Community! Your membership card is ready.
          </p>
        </div>
        
        <div className="membership-page__card-container">
          <MembershipCard
            name={userData.name}
            memberSince={userData.memberSince}
            car={userData.car}
            newsletter={userData.newsletter}
          />
        </div>
        
        <div className="membership-page__actions">
          <button className="membership-page__action-btn membership-page__action-btn--primary">
            Download Card
          </button>
          <button className="membership-page__action-btn membership-page__action-btn--secondary">
            Share Card
          </button>
        </div>
      </div>
    </div>
  );
};

export default Membership;
