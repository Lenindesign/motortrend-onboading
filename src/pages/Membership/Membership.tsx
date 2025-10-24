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
    avatar?: string;
    memberSince?: string;
    car?: string;
    newsletter?: string;
  }>({
    name: 'Lenin Aviles',
    memberSince: '09/27/2025',
    car: '2021 Subaru WRX',
    newsletter: 'MotorTrend'
  });

  // Load user data from localStorage
  useEffect(() => {
    try {
      const onboardingData = localStorage.getItem('onboardingData');
      if (onboardingData) {
        const data = JSON.parse(onboardingData);
        setUserData(prev => ({
          ...prev,
          name: data.name || prev.name,
          avatar: data.avatar,
          car: data.vehicle || prev.car,
          memberSince: data.memberSince || prev.memberSince,
          newsletter: data.newsletter || prev.newsletter
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
            avatar={userData.avatar}
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
