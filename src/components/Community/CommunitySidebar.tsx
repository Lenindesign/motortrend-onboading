import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import type { Community } from '../../api/communityApi';
import Icon from '../Icon';
import './CommunitySidebar.css';

interface CommunitySidebarProps {
  communities: Community[];
  onJoinToggle: (id: string) => void;
}

export const CommunitySidebar: React.FC<CommunitySidebarProps> = ({ 
  communities,
  onJoinToggle
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const joinedCommunities = communities.filter(c => c.isJoined);
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
      </div>

      {/* My Communities Section */}
      {joinedCommunities.length > 0 && (
        <div className="community-sidebar__section">
          <h4 className="community-sidebar__title">My Communities</h4>
          {joinedCommunities.map(community => (
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
              <span>c/{community.name}</span>
            </button>
          ))}
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


