import React, { useState, useMemo } from 'react';
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
  const [searchQuery, setSearchQuery] = useState('');
  
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
  
  // Default Car and Driver community (always joined)
  const carAndDriverCommunity: Community = {
    id: 'comm_caranddriver',
    slug: 'caranddriver',
    name: 'Car and Driver',
    description: 'Join the Car and Driver community for automotive discussions and insights.',
    icon: 'https://d2kde5ohu8qb21.cloudfront.net/files/692e5cd3c2af34000266b93d/group1175889264.svg',
    memberCount: 9800,
    isJoined: true,
    createdAt: new Date().toISOString(),
  };
  
  // Default Hot Rod Power Tour community (always joined)
  const hotRodPowerTourCommunity: Community = {
    id: 'comm_hotrodpowertour',
    slug: 'hotrodpowertour',
    name: 'HOT ROD POWER TOUR',
    description: 'Join the HOT ROD Power Tour community for discussions about the annual road trip event, car builds, and hot rod culture.',
    icon: 'https://www.sema.org/sites/default/files/inline-images/HRPT-1410x790.jpg',
    memberCount: 7200,
    isJoined: true,
    createdAt: new Date().toISOString(),
    rules: ['Be respectful', 'Share your Power Tour experiences', 'Show off your builds'],
  };
  
  const joinedCommunities = [
    motorTrendCommunity, // Always include MotorTrend first
    carAndDriverCommunity, // Always include Car and Driver second
    hotRodPowerTourCommunity, // Always include Hot Rod Power Tour third
    ...communities.filter(c => c.isJoined && c.id !== 'comm_motortrend' && c.id !== 'comm_caranddriver' && c.id !== 'comm_hotrodpowertour')
  ];
  
  // Filter communities based on search query
  const filteredOtherCommunities = useMemo(() => {
    const otherCommunities = communities.filter(c => !c.isJoined && c.id !== 'comm_hotrodpowertour');
    if (!searchQuery.trim()) {
      return otherCommunities;
    }
    const query = searchQuery.toLowerCase();
    return otherCommunities.filter(community => 
      community.name.toLowerCase().includes(query) ||
      community.slug.toLowerCase().includes(query) ||
      (community.description && community.description.toLowerCase().includes(query))
    );
  }, [communities, searchQuery]);

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
            const isCarAndDriver = community.id === 'comm_caranddriver';
            const isHotRodPowerTour = community.id === 'comm_hotrodpowertour';
            const isVerified = isMotorTrend || isCarAndDriver || isHotRodPowerTour;
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
                {isVerified && (
                  <Icon name="check_circle" size={16} className="community-sidebar__verified-icon" />
                )}
            </button>
            );
          })}
        </div>
      )}

      {/* Explore Section */}
        <div className="community-sidebar__section">
          <h4 className="community-sidebar__title">Explore</h4>
        <div className="community-sidebar__search">
          <Icon name="search" size={18} className="community-sidebar__search-icon" />
          <input
            type="text"
            className="community-sidebar__search-input"
            placeholder="Search communities..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        {filteredOtherCommunities.length > 0 ? (
          filteredOtherCommunities.map(community => (
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
          ))
        ) : (
          searchQuery.trim() && (
            <div className="community-sidebar__no-results">
              <p>No communities found</p>
        </div>
          )
      )}
      </div>

      <div className="community-sidebar__footer">
        <div className="community-sidebar__links">
          <a href="#">Privacy Policy</a>
          <a href="#">Terms of Use</a>
        </div>
      </div>
    </aside>
  );
};


