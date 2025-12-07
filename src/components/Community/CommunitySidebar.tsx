/**
 * Community Sidebar Component
 * Migrated to inline styles for Tailwind compatibility
 */

import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import type { Community } from '../../api/communityApi';
import Icon from '../Icon';

interface CommunitySidebarProps {
  communities: Community[];
  onJoinToggle: (id: string) => void;
  onCreateCommunity?: () => void;
}

export const CommunitySidebar: React.FC<CommunitySidebarProps> = ({ communities, onJoinToggle, onCreateCommunity }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState('');
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const [hoveredJoin, setHoveredJoin] = useState<string | null>(null);
  const [isToggleHovered, setIsToggleHovered] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  useEffect(() => {
    const checkWidth = () => setIsCollapsed(window.innerWidth < 1200);
    checkWidth();
    window.addEventListener('resize', checkWidth);
    return () => window.removeEventListener('resize', checkWidth);
  }, []);

  const motorTrendCommunity: Community = { id: 'comm_motortrend', slug: 'motortrend', name: 'MotorTrend', description: 'The official MotorTrend community', icon: 'https://d2kde5ohu8qb21.cloudfront.net/files/68f6de8441f73a00024a546f/mtavatar.svg', memberCount: 50000, isJoined: true, createdAt: new Date().toISOString() };
  const carAndDriverCommunity: Community = { id: 'comm_caranddriver', slug: 'caranddriver', name: 'Car and Driver', description: 'Join the Car and Driver community for automotive discussions and insights.', icon: 'https://d2kde5ohu8qb21.cloudfront.net/files/692e5cd3c2af34000266b93d/group1175889264.svg', memberCount: 9800, isJoined: true, createdAt: new Date().toISOString() };
  const hotRodPowerTourCommunity: Community = { id: 'comm_hotrodpowertour', slug: 'hotrodpowertour', name: 'HOT ROD POWER TOUR', description: 'Join the HOT ROD Power Tour community for discussions about the annual road trip event, car builds, and hot rod culture.', icon: 'https://www.sema.org/sites/default/files/inline-images/HRPT-1410x790.jpg', memberCount: 7200, isJoined: true, createdAt: new Date().toISOString(), rules: ['Be respectful', 'Share your Power Tour experiences', 'Show off your builds'] };

  const joinedCommunities = [motorTrendCommunity, carAndDriverCommunity, hotRodPowerTourCommunity, ...communities.filter(c => c.isJoined && c.id !== 'comm_motortrend' && c.id !== 'comm_caranddriver' && c.id !== 'comm_hotrodpowertour')];
  const filteredOtherCommunities = useMemo(() => {
    const otherCommunities = communities.filter(c => !c.isJoined && c.id !== 'comm_hotrodpowertour' && c.publisher !== 'Hearst');
    if (!searchQuery.trim()) return otherCommunities;
    const query = searchQuery.toLowerCase();
    return otherCommunities.filter(community => community.name.toLowerCase().includes(query) || community.slug.toLowerCase().includes(query) || (community.description && community.description.toLowerCase().includes(query)));
  }, [communities, searchQuery]);
  const hearstCommunities = useMemo(() => communities.filter(c => c.publisher === 'Hearst' && !c.isJoined), [communities]);

  const handleNavigate = (path: string) => navigate(path);
  const isActive = (path: string) => location.pathname === path;

  // Styles
  const wrapperStyle: React.CSSProperties = { position: 'relative', flexShrink: 0, overflow: 'visible' };
  const sidebarStyle: React.CSSProperties = { width: isCollapsed ? '72px' : '280px', backgroundColor: 'var(--color-white, #FFFFFF)', borderRight: '1px solid var(--color-neutrals-6, #E6E8EC)', borderRadius: '8px', height: 'calc(100vh - 64px)', position: 'sticky', top: '80px', padding: isCollapsed ? '16px 8px' : '16px 12px', overflowY: 'auto', overflowX: 'visible', display: 'flex', flexDirection: 'column', gap: '24px', transition: 'width 0.3s ease, padding 0.3s ease' };
  const toggleStyle: React.CSSProperties = { position: 'absolute', top: '16px', right: '0px', width: '24px', height: '24px', borderRadius: '50%', backgroundColor: isToggleHovered ? 'var(--color-neutrals-7, #F4F5F6)' : 'var(--color-white, #FFFFFF)', border: '1px solid var(--color-neutrals-6, #E6E8EC)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', zIndex: 5000, boxShadow: isToggleHovered ? '0 2px 8px rgba(0, 0, 0, 0.15)' : '0 2px 4px rgba(0, 0, 0, 0.1)', transition: 'all 0.2s', flexShrink: 0, color: 'var(--color-black, #000000)' };
  const sectionStyle: React.CSSProperties = { display: 'flex', flexDirection: 'column', gap: '4px' };
  const titleStyle: React.CSSProperties = { fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.5px', color: 'var(--color-neutrals-4, #6E7481)', margin: '0 0 8px 12px', fontWeight: 700, transition: 'opacity 0.2s', whiteSpace: 'nowrap', overflow: 'hidden', opacity: isCollapsed ? 0 : 1, height: isCollapsed ? 0 : 'auto' };
  const searchContainerStyle: React.CSSProperties = { position: 'relative', margin: isCollapsed ? 0 : '0 12px 8px 12px', display: 'flex', alignItems: 'center', transition: 'opacity 0.2s', opacity: isCollapsed ? 0 : 1, height: isCollapsed ? 0 : 'auto', overflow: isCollapsed ? 'hidden' : 'visible' };
  const searchIconStyle: React.CSSProperties = { position: 'absolute', left: '12px', color: 'var(--color-neutrals-4, #6E7481)', pointerEvents: 'none' };
  const searchInputStyle: React.CSSProperties = { width: '100%', padding: '8px 12px 8px 36px', border: `1px solid ${isSearchFocused ? 'var(--color-black, #000000)' : 'var(--color-neutrals-6, #E6E8EC)'}`, borderRadius: '8px', fontSize: '14px', fontWeight: 400, color: 'var(--color-black, #000000)', backgroundColor: 'var(--color-white, #FFFFFF)', transition: 'border-color 0.2s', outline: 'none' };

  const getItemStyle = (itemId: string, isItemActive: boolean): React.CSSProperties => ({ display: 'flex', alignItems: 'center', padding: isCollapsed ? '8px' : '8px 12px', background: isItemActive ? 'var(--color-neutrals-6, #E6E8EC)' : (hoveredItem === itemId ? 'var(--color-neutrals-7, #F4F5F6)' : 'none'), border: 'none', width: '100%', textAlign: 'left', cursor: 'pointer', borderRadius: '8px', fontSize: '14px', fontWeight: isItemActive ? 700 : 500, color: isItemActive ? 'var(--color-black, #000000)' : 'var(--color-neutrals-4, #6E7481)', transition: 'background-color 0.2s, padding 0.2s', justifyContent: isCollapsed ? 'center' : 'flex-start', position: 'relative' });

  const iconStyle: React.CSSProperties = { marginRight: isCollapsed ? 0 : '12px', color: 'var(--color-neutrals-4, #6E7481)', flexShrink: 0, transition: 'margin 0.2s', display: 'flex', alignItems: 'center', justifyContent: 'center', minWidth: isCollapsed ? '24px' : '20px', minHeight: isCollapsed ? '24px' : '20px' };
  const communityIconStyle: React.CSSProperties = { width: isCollapsed ? '32px' : '24px', height: isCollapsed ? '32px' : '24px', borderRadius: '50%', marginRight: isCollapsed ? 0 : '12px', objectFit: 'contain', objectPosition: 'center', backgroundColor: 'var(--color-white, #FFFFFF)', padding: isCollapsed ? '3px' : '2px', flexShrink: 0, transition: 'margin 0.2s', display: 'block' };
  const placeholderStyle: React.CSSProperties = { width: isCollapsed ? '32px' : '24px', height: isCollapsed ? '32px' : '24px', borderRadius: '50%', backgroundColor: 'var(--color-neutrals-3, #353945)', color: 'var(--color-neutrals-5, #B1B5C3)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: isCollapsed ? 0 : '12px', fontSize: isCollapsed ? '14px' : '12px', fontWeight: 700, flexShrink: 0, transition: 'margin 0.2s, width 0.2s, height 0.2s' };
  const verifiedIconStyle: React.CSSProperties = { marginLeft: '6px', color: 'var(--color-blue, #186CEA)', flexShrink: 0, display: isCollapsed ? 'none' : 'flex', alignItems: 'center', justifyContent: 'center' };
  const exploreItemStyle: React.CSSProperties = { display: 'flex', alignItems: 'center', position: 'relative', justifyContent: isCollapsed ? 'center' : 'flex-start' };
  const getJoinBtnStyle = (communityId: string): React.CSSProperties => ({ position: 'absolute', right: '8px', backgroundColor: hoveredJoin === communityId ? 'var(--color-neutrals-1, #141416)' : 'var(--color-black, #000000)', color: 'white', border: 'none', padding: '4px 12px', borderRadius: '999px', fontSize: '12px', fontWeight: 700, cursor: 'pointer', transition: 'background-color 0.2s' });
  const footerStyle: React.CSSProperties = { marginTop: 'auto', padding: '12px', borderTop: '1px solid var(--color-neutrals-6, #E6E8EC)' };
  const linksStyle: React.CSSProperties = { display: 'flex', gap: '12px' };
  const linkStyle: React.CSSProperties = { fontSize: '12px', color: 'var(--color-neutrals-4, #6E7481)', textDecoration: 'none' };
  const noResultsStyle: React.CSSProperties = { padding: '12px', textAlign: 'center', color: 'var(--color-neutrals-4, #6E7481)', fontSize: '14px' };

  return (
    <div style={wrapperStyle}>
      <aside style={sidebarStyle}>
        <button style={toggleStyle} onClick={() => setIsCollapsed(!isCollapsed)} onMouseEnter={() => setIsToggleHovered(true)} onMouseLeave={() => setIsToggleHovered(false)} aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}>
          <Icon name={isCollapsed ? 'chevron_right' : 'chevron_left'} size={20} />
        </button>

        <div style={sectionStyle}>
          <h4 style={titleStyle}>Feeds</h4>
          <button style={getItemStyle('home', isActive('/community'))} onClick={() => handleNavigate('/community')} onMouseEnter={() => setHoveredItem('home')} onMouseLeave={() => setHoveredItem(null)}>
            <Icon name="home" size={20} style={iconStyle} />{!isCollapsed && <span>Home</span>}
          </button>
          <button style={getItemStyle('popular', isActive('/community/popular'))} onClick={() => handleNavigate('/community/popular')} onMouseEnter={() => setHoveredItem('popular')} onMouseLeave={() => setHoveredItem(null)}>
            <Icon name="trending_up" size={20} style={iconStyle} />{!isCollapsed && <span>Popular</span>}
          </button>
          <button style={getItemStyle('create', false)} onClick={() => onCreateCommunity ? onCreateCommunity() : handleNavigate('/community/create')} onMouseEnter={() => setHoveredItem('create')} onMouseLeave={() => setHoveredItem(null)}>
            <Icon name="add_circle" size={20} style={iconStyle} />{!isCollapsed && <span>Create Community</span>}
          </button>
        </div>

        {joinedCommunities.length > 0 && (
          <div style={sectionStyle}>
            <h4 style={titleStyle}>My Communities</h4>
            {joinedCommunities.map(community => {
              const isVerified = community.id === 'comm_motortrend' || community.id === 'comm_caranddriver' || community.id === 'comm_hotrodpowertour';
              return (
                <button key={community.id} style={getItemStyle(community.id, isActive(`/community/${community.slug}`))} onClick={() => handleNavigate(`/community/${community.slug}`)} onMouseEnter={() => setHoveredItem(community.id)} onMouseLeave={() => setHoveredItem(null)}>
                  {community.icon ? <img src={community.icon} alt={community.name} style={communityIconStyle} /> : <div style={placeholderStyle}>{community.name[0]}</div>}
                  {!isCollapsed && <><span style={{ flex: 1, textAlign: 'left', whiteSpace: 'nowrap', overflow: 'hidden' }}>c/{community.name}</span>{isVerified && <Icon name="check_circle" size={16} style={verifiedIconStyle} />}</>}
                </button>
              );
            })}
          </div>
        )}

        {!isCollapsed && (
          <div style={sectionStyle}>
            <h4 style={titleStyle}>Explore</h4>
            <div style={searchContainerStyle}>
              <Icon name="search" size={18} style={searchIconStyle} />
              <input type="text" style={searchInputStyle} placeholder="Search communities..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} onFocus={() => setIsSearchFocused(true)} onBlur={() => setIsSearchFocused(false)} />
            </div>
            {filteredOtherCommunities.length > 0 ? (
              filteredOtherCommunities.map(community => (
                <div key={community.id} style={exploreItemStyle}>
                  <button style={{ ...getItemStyle(`explore-${community.id}`, isActive(`/community/${community.slug}`)), flex: 1, paddingRight: '60px' }} onClick={() => handleNavigate(`/community/${community.slug}`)} onMouseEnter={() => setHoveredItem(`explore-${community.id}`)} onMouseLeave={() => setHoveredItem(null)}>
                    {community.icon ? <img src={community.icon} alt={community.name} style={communityIconStyle} /> : <div style={placeholderStyle}>{community.name[0]}</div>}
                    {!isCollapsed && <span>c/{community.name}</span>}
                  </button>
                  {!isCollapsed && <button style={getJoinBtnStyle(community.id)} onClick={(e) => { e.stopPropagation(); onJoinToggle(community.id); }} onMouseEnter={() => setHoveredJoin(community.id)} onMouseLeave={() => setHoveredJoin(null)}>Join</button>}
                </div>
              ))
            ) : searchQuery.trim() && <div style={noResultsStyle}><p>No communities found</p></div>}
          </div>
        )}

        {!isCollapsed && hearstCommunities.length > 0 && (
          <div style={sectionStyle}>
            <h4 style={titleStyle}>Hearst</h4>
            {hearstCommunities.map(community => (
              <div key={community.id} style={exploreItemStyle}>
                <button style={{ ...getItemStyle(`hearst-${community.id}`, isActive(`/community/${community.slug}`)), flex: 1, paddingRight: '60px' }} onClick={() => handleNavigate(`/community/${community.slug}`)} onMouseEnter={() => setHoveredItem(`hearst-${community.id}`)} onMouseLeave={() => setHoveredItem(null)}>
                  {community.icon ? <img src={community.icon} alt={community.name} style={communityIconStyle} /> : <div style={placeholderStyle}>{community.name[0]}</div>}
                  {!isCollapsed && <span>c/{community.name}</span>}
                </button>
                {!isCollapsed && <button style={getJoinBtnStyle(community.id)} onClick={(e) => { e.stopPropagation(); onJoinToggle(community.id); }} onMouseEnter={() => setHoveredJoin(community.id)} onMouseLeave={() => setHoveredJoin(null)}>Join</button>}
              </div>
            ))}
          </div>
        )}

        {!isCollapsed && (
          <div style={footerStyle}>
            <div style={linksStyle}>
              <a href="#" style={linkStyle}>Privacy Policy</a>
              <a href="#" style={linkStyle}>Terms of Use</a>
            </div>
          </div>
        )}
      </aside>
    </div>
  );
};

export default CommunitySidebar;
