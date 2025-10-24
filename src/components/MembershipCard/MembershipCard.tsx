/**
 * Membership Card Component
 * Based on Figma Community design
 */

import React from 'react';
import './MembershipCard.css';

export interface MembershipCardProps {
  name?: string;
  memberSince?: string;
  car?: string;
  newsletter?: string;
  avatar?: string;
}

export const MembershipCard: React.FC<MembershipCardProps> = ({
  name = 'Lenin Aviles',
  memberSince = '09/27/2025',
  car = '2021 Subaru WRX',
  newsletter = 'MotorTrend',
  avatar
}) => {
  return (
    <div className="membership-card">
      <div className="membership-card__content">
        <div className="membership-card__header">
          <div className="membership-card__avatar">
            {avatar ? (
              <img 
                src={avatar} 
                alt="User Avatar" 
                className="membership-card__avatar-img"
              />
            ) : (
              <div className="membership-card__avatar-placeholder">
                <span className="membership-card__avatar-text">
                  {name.split(' ').map(n => n[0]).join('')}
                </span>
              </div>
            )}
          </div>
          <div className="membership-card__title-section">
            <h2 className="membership-card__title">Membership Card</h2>
            <p className="membership-card__subtitle">MotorTrend Community Member</p>
          </div>
        </div>
        
        <div className="membership-card__details">
          <div className="membership-card__left-details">
            <div className="membership-card__detail-item">
              <span className="membership-card__detail-label">Member Since</span>
              <span className="membership-card__detail-value">{memberSince}</span>
            </div>
            <div className="membership-card__detail-item">
              <span className="membership-card__detail-label">My Car</span>
              <span className="membership-card__detail-value">{car}</span>
            </div>
          </div>
          
          <div className="membership-card__right-details">
            <div className="membership-card__detail-item">
              <span className="membership-card__detail-label">Name</span>
              <span className="membership-card__detail-value">{name}</span>
            </div>
            <div className="membership-card__detail-item">
              <span className="membership-card__detail-label">Newsletter</span>
              <span className="membership-card__detail-value">{newsletter}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MembershipCard;
