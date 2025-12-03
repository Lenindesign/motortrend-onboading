/**
 * Membership Card Component
 * Based on Figma Community design - node-id=274-30037
 */

import React from 'react';
import './MembershipCard.css';

export interface MembershipCardProps {
  name?: string;
  memberSince?: string;
  car?: string;
  newsletter?: string;
}

export const MembershipCard: React.FC<MembershipCardProps> = ({
  name = 'Greg Smith',
  memberSince = '09/27/2025',
  car = '2021 Subaru WRX',
  newsletter = 'MotorTrend'
}) => {
  
  return (
    <div className="membership-card">
      <div className="membership-card__content">
        {/* Header with Logo and Title */}
        <div className="membership-card__header">
          <div className="membership-card__logo">
            <img 
              src="https://d2kde5ohu8qb21.cloudfront.net/files/68fabbe380bc4f00028943ef/mt40.svg" 
              alt="MotorTrend Logo" 
              className="membership-card__logo-img"
            />
          </div>
          <div className="membership-card__title-section">
            <h2 className="membership-card__title">Membership Card</h2>
            <p className="membership-card__subtitle">MotorTrend Member</p>
          </div>
        </div>
        
        {/* Details Grid - 2x2 layout */}
        <div className="membership-card__details">
          {/* Row 1 */}
          <div className="membership-card__detail-item">
            <span className="membership-card__detail-label">Member Since</span>
            <span className="membership-card__detail-value">{memberSince}</span>
          </div>
          <div className="membership-card__detail-item">
            <span className="membership-card__detail-label">Name</span>
            <span className="membership-card__detail-value">{name}</span>
          </div>
          
          {/* Row 2 */}
          <div className="membership-card__detail-item">
            <span className="membership-card__detail-label">My Car</span>
            <span className="membership-card__detail-value">{car || 'No vehicle selected'}</span>
          </div>
          <div className="membership-card__detail-item">
            <span className="membership-card__detail-label">Newsletter</span>
            <span className="membership-card__detail-value">{newsletter || 'None'}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MembershipCard;
