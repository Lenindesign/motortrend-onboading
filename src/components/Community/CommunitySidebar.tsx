import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import type { Community } from '../../api/communityApi';
import Icon from '../Icon';
import './CommunitySidebar.css';

interface CommunitySidebarProps {
  communities: Community[];
  onJoinToggle: (id: string) => void;
  onCreateCommunity?: () => void;
}

export const CommunitySidebar: React.FC<CommunitySidebarProps> = ({ 
  communities,
  onJoinToggle,
  onCreateCommunity
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Default MotorTrend community (always joined)
  const motorTrendCommunity: Community = {
    id: 'comm_motortrend',
    slug: 'motortrend',
    name: 'MotorTrend',
    description: 'The official MotorTrend community',
    icon: 'https://d2kde5ohu8qb21.cloudfront.net/files/68f6de8441f73a00024a546f/mtavatar.svg',
    memberCount: 50000,
    isJoined: true,
    createdAt: new Date().toISOString(),
  };
  
  const joinedCommunities = [
    motorTrendCommunity, // Always include MotorTrend first
    ...communities.filter(c => c.isJoined && c.id !== 'comm_motortrend')
  ];
  const otherCommunities = communities.filter(c => !c.isJoined);

  const handleNavigate = (path: string) => {
    navigate(path);
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <aside className="community-sidebar">
      {/* Feeds Section */}
      <div className="community-sidebar__section">
        <h4 className="community-sidebar__title">Feeds</h4>
        <button 
          className={`community-sidebar__item ${isActive('/community') ? 'community-sidebar__item--active' : ''}`}
          onClick={() => handleNavigate('/community')}
        >
          <Icon name="home" size={20} className="community-sidebar__icon" />
          <span>Home</span>
        </button>
        <button 
          className={`community-sidebar__item ${isActive('/community/popular') ? 'community-sidebar__item--active' : ''}`}
          onClick={() => handleNavigate('/community/popular')}
        >
          <Icon name="trending_up" size={20} className="community-sidebar__icon" />
          <span>Popular</span>
        </button>
        <button 
          className="community-sidebar__item"
          onClick={() => {
            if (onCreateCommunity) {
              onCreateCommunity();
            } else {
              handleNavigate('/community/create');
            }
          }}
        >
          <Icon name="add_circle" size={20} className="community-sidebar__icon" />
          <span>Create Community</span>
        </button>
      </div>

      {/* My Communities Section */}
      {joinedCommunities.length > 0 && (
        <div className="community-sidebar__section">
          <h4 className="community-sidebar__title">My Communities</h4>
          {joinedCommunities.map(community => {
            const isMotorTrend = community.id === 'comm_motortrend';
            return (
              <button
                key={community.id}
                className={`community-sidebar__item ${isActive(`/community/${community.slug}`) ? 'community-sidebar__item--active' : ''}`}
                onClick={() => handleNavigate(`/community/${community.slug}`)}
              >
                {community.icon ? (
                  <img src={community.icon} alt={community.name} className="community-sidebar__community-icon" />
                ) : (
                  <div className="community-sidebar__community-placeholder">
                    {community.name[0]}
                  </div>
                )}
                <span className="community-sidebar__community-name">
                  c/{community.name}
                </span>
                {isMotorTrend && (
                  <Icon name="check_circle" size={16} className="community-sidebar__verified-icon" />
                )}
              </button>
            );
          })}
        </div>
      )}

      {/* Explore Section */}
      {otherCommunities.length > 0 && (
        <div className="community-sidebar__section">
          <h4 className="community-sidebar__title">Explore</h4>
          {otherCommunities.map(community => (
            <div key={community.id} className="community-sidebar__explore-item">
               <button
                className={`community-sidebar__item community-sidebar__item--explore ${isActive(`/community/${community.slug}`) ? 'community-sidebar__item--active' : ''}`}
                onClick={() => handleNavigate(`/community/${community.slug}`)}
              >
                {community.icon ? (
                  <img src={community.icon} alt={community.name} className="community-sidebar__community-icon" />
                ) : (
                  <div className="community-sidebar__community-placeholder">
                    {community.name[0]}
                  </div>
                )}
                <span>c/{community.name}</span>
              </button>
              <button 
                className="community-sidebar__join-btn"
                onClick={(e) => { e.stopPropagation(); onJoinToggle(community.id); }}
              >
                Join
              </button>
            </div>
          ))}
        </div>
      )}

      <div className="community-sidebar__footer">
        <p>© 2025 MotorTrend Group, LLC.</p>
        <div className="community-sidebar__links">
          <a href="#">Privacy Policy</a>
          <a href="#">Terms of Use</a>
        </div>
      </div>
    </aside>
  );
};


