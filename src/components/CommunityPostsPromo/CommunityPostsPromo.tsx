/**
 * Community Posts Promo Component
 * Migrated to inline styles for Tailwind compatibility
 */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import type { Post, Community } from '../../api/communityApi';
import { getPosts, getCommunities } from '../../api/communityApi';
import Icon from '../Icon';

// Primary shopping community ID - highest priority for shoppers
const WHAT_CAR_COMMUNITY_ID = 'comm_whatcar';

// Secondary shopping-related community IDs
const SECONDARY_SHOPPING_COMMUNITY_IDS = ['comm_autos'];

// Shopping-related keywords to identify relevant posts
const SHOPPING_KEYWORDS = [
  'buy', 'buying', 'purchase', 'under $', 'budget', 'price', 'value',
  'deal', 'recommend', 'should i', 'best', 'vs', 'compare', 'looking for',
  'family', 'reliable', 'affordable', 'new vs used', 'lease', 'finance'
];

/**
 * Check if a post is from the "What Car Should I Buy?" community
 */
const isWhatCarPost = (post: Post): boolean => {
  return post.communityId === WHAT_CAR_COMMUNITY_ID;
};

/**
 * Check if a post is shopping-related (but not from What Car community)
 */
const isSecondaryShoppingRelated = (post: Post): boolean => {
  // Check if post is from secondary shopping-related community
  if (SECONDARY_SHOPPING_COMMUNITY_IDS.includes(post.communityId)) {
    return true;
  }
  
  // Check if post title or content contains shopping keywords
  const titleLower = post.title.toLowerCase();
  const contentLower = post.content?.toLowerCase() || '';
  
  return SHOPPING_KEYWORDS.some(keyword => 
    titleLower.includes(keyword) || contentLower.includes(keyword)
  );
};

/**
 * Check if a post is shopping-related (any tier)
 */
const isShoppingRelated = (post: Post): boolean => {
  return isWhatCarPost(post) || isSecondaryShoppingRelated(post);
};

/**
 * Get user type from localStorage
 */
const getUserType = (): 'buyer' | 'enthusiast' | 'both' | null => {
  try {
    const onboardingData = localStorage.getItem('onboardingData');
    if (onboardingData) {
      const parsed = JSON.parse(onboardingData);
      return parsed.userType || null;
    }
  } catch (error) {
    console.error('Error reading user type:', error);
  }
  return null;
};

/**
 * Check if user is in shopping experience (buyer or both)
 */
const isShoppingExperience = (): boolean => {
  const userType = getUserType();
  return userType === 'buyer' || userType === 'both';
};

export interface CommunityPostsPromoProps {
  title?: string;
  maxPosts?: number;
  className?: string;
}

export const CommunityPostsPromo: React.FC<CommunityPostsPromoProps> = ({
  title = 'Trending in Community',
  maxPosts = 6,
  className = '',
}) => {
  const navigate = useNavigate();
  const [posts, setPosts] = useState<Post[]>([]);
  const [communities, setCommunities] = useState<Community[]>([]);
  const [hoveredCardId, setHoveredCardId] = useState<string | null>(null);
  const [hoveredCommunityId, setHoveredCommunityId] = useState<string | null>(null);
  const [isViewAllHovered, setIsViewAllHovered] = useState(false);

  useEffect(() => {
    const allPosts = getPosts();
    const isShopping = isShoppingExperience();
    
    let sortedPosts: Post[];
    
    if (isShopping) {
      // For shopping experience: prioritize "What Car Should I Buy?" posts first
      // Then secondary shopping posts, then other posts
      
      // Tier 1: Posts from "What Car Should I Buy?" community (highest priority)
      const whatCarPosts = allPosts.filter(isWhatCarPost);
      
      // Tier 2: Other shopping-related posts (secondary priority)
      const secondaryShoppingPosts = allPosts.filter(post => 
        !isWhatCarPost(post) && isSecondaryShoppingRelated(post)
      );
      
      // Tier 3: All other posts
      const otherPosts = allPosts.filter(post => !isShoppingRelated(post));
      
      // Sort each group by score
      const sortByScore = (a: Post, b: Post) => 
        (b.upvotes - b.downvotes) - (a.upvotes - a.downvotes);
      
      whatCarPosts.sort(sortByScore);
      secondaryShoppingPosts.sort(sortByScore);
      otherPosts.sort(sortByScore);
      
      // Combine: What Car posts first, then secondary shopping posts, then other posts
      sortedPosts = [...whatCarPosts, ...secondaryShoppingPosts, ...otherPosts].slice(0, maxPosts);
    } else {
      // For enthusiast experience: just sort by score
      sortedPosts = [...allPosts]
        .sort((a, b) => (b.upvotes - b.downvotes) - (a.upvotes - a.downvotes))
        .slice(0, maxPosts);
    }
    
    setPosts(sortedPosts);
    setCommunities(getCommunities());
  }, [maxPosts]);

  const getCommunityForPost = (post: Post): Community | undefined => {
    return communities.find(c => c.id === post.communityId);
  };

  const handlePostClick = (post: Post) => {
    const community = getCommunityForPost(post);
    if (community) {
      navigate(`/community/${community.slug}/post/${post.id}`);
    }
  };

  const handleCommunityClick = (e: React.MouseEvent, community: Community) => {
    e.stopPropagation();
    navigate(`/community/${community.slug}`);
  };

  const timeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (seconds < 60) return 'just now';
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  };

  if (posts.length === 0) return null;

  // Styles
  const containerStyle: React.CSSProperties = {
    marginBottom: '48px',
    padding: 0,
  };

  const headerStyle: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '24px',
  };

  const titleStyle: React.CSSProperties = {
    fontFamily: 'var(--font-heading, Poppins, sans-serif)',
    fontSize: '28px',
    fontWeight: 600,
    lineHeight: 1.2,
    color: 'var(--color-black, #000000)',
    margin: 0,
  };

  const viewAllStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    fontSize: '14px',
    fontWeight: 600,
    color: isViewAllHovered ? 'var(--color-primary-2, #C70A13)' : 'var(--color-primary-1, #E90C17)',
    textDecoration: 'none',
    transition: 'color 0.2s',
    cursor: 'pointer',
  };

  const gridStyle: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '24px',
  };

  const getCardStyle = (postId: string): React.CSSProperties => {
    const isHovered = hoveredCardId === postId;
    return {
      backgroundColor: 'var(--color-white, #FFFFFF)',
      border: `1px solid ${isHovered ? 'var(--color-primary-1, #E90C17)' : 'var(--color-neutrals-6, #E6E8EC)'}`,
      borderRadius: 'var(--border-radius-md, 8px)',
      overflow: 'hidden',
      cursor: 'pointer',
      transition: 'all 0.2s',
      display: 'flex',
      flexDirection: 'column',
      boxShadow: isHovered ? '0 4px 12px rgba(0, 0, 0, 0.1)' : 'none',
      transform: isHovered ? 'translateY(-2px)' : 'none',
    };
  };

  const imageWrapperStyle: React.CSSProperties = {
    width: '100%',
    height: '200px',
    overflow: 'hidden',
    backgroundColor: 'var(--color-neutrals-7, #F4F5F6)',
  };

  const getImageStyle = (postId: string): React.CSSProperties => ({
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    transition: 'transform 0.3s',
    transform: hoveredCardId === postId ? 'scale(1.05)' : 'none',
  });

  const contentStyle: React.CSSProperties = {
    padding: '16px',
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    flex: 1,
  };

  const communityStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    cursor: 'pointer',
    width: 'fit-content',
  };

  const communityIconStyle: React.CSSProperties = {
    width: '24px',
    height: '24px',
    borderRadius: 'var(--border-radius-circle, 50%)',
    objectFit: 'cover',
  };

  const communityPlaceholderStyle: React.CSSProperties = {
    width: '24px',
    height: '24px',
    borderRadius: 'var(--border-radius-circle, 50%)',
    backgroundColor: 'var(--color-neutrals-6, #E6E8EC)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '12px',
    fontWeight: 600,
    color: 'var(--color-neutrals-4, #6E7481)',
  };

  const getCommunityNameStyle = (communityId: string): React.CSSProperties => ({
    fontSize: '12px',
    fontWeight: 600,
    color: hoveredCommunityId === communityId ? 'var(--color-primary-1, #E90C17)' : 'var(--color-neutrals-3, #353945)',
    transition: 'color 0.2s',
  });

  const postTitleStyle: React.CSSProperties = {
    fontFamily: 'var(--font-heading, Poppins, sans-serif)',
    fontSize: '18px',
    fontWeight: 600,
    lineHeight: 1.3,
    color: 'var(--color-black, #000000)',
    margin: 0,
    display: '-webkit-box',
    WebkitLineClamp: 2,
    WebkitBoxOrient: 'vertical',
    overflow: 'hidden',
  };

  const excerptStyle: React.CSSProperties = {
    fontSize: '14px',
    lineHeight: 1.5,
    color: 'var(--color-neutrals-3, #353945)',
    margin: 0,
    display: '-webkit-box',
    WebkitLineClamp: 3,
    WebkitBoxOrient: 'vertical',
    overflow: 'hidden',
  };

  const metaStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '12px',
    color: 'var(--color-neutrals-4, #6E7481)',
  };

  const actionsStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    marginTop: 'auto',
    paddingTop: '12px',
    borderTop: '1px solid var(--color-neutrals-7, #F4F5F6)',
  };

  const actionStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    fontSize: '12px',
    fontWeight: 600,
    color: 'var(--color-neutrals-4, #6E7481)',
  };

  return (
    <section className={className} style={containerStyle}>
      <div style={headerStyle}>
        <h2 style={titleStyle}>{title}</h2>
        <a 
          href="/community" 
          style={viewAllStyle}
          onMouseEnter={() => setIsViewAllHovered(true)}
          onMouseLeave={() => setIsViewAllHovered(false)}
          onClick={(e) => {
            e.preventDefault();
            navigate('/community');
          }}
        >
          View All
          <Icon name="chevron_right" size={16} />
        </a>
      </div>
      
      <div style={gridStyle}>
        {posts.map((post) => {
          const community = getCommunityForPost(post);
          return (
            <article 
              key={post.id} 
              style={getCardStyle(post.id)}
              onClick={() => handlePostClick(post)}
              onMouseEnter={() => setHoveredCardId(post.id)}
              onMouseLeave={() => setHoveredCardId(null)}
            >
              {post.image && (
                <div style={imageWrapperStyle}>
                  <img 
                    src={post.image} 
                    alt={post.title}
                    style={getImageStyle(post.id)}
                  />
                </div>
              )}
              
              <div style={contentStyle}>
                {community && (
                  <div 
                    style={communityStyle}
                    onClick={(e) => handleCommunityClick(e, community)}
                    onMouseEnter={() => setHoveredCommunityId(community.id)}
                    onMouseLeave={() => setHoveredCommunityId(null)}
                  >
                    {community.icon ? (
                      <img src={community.icon} alt={community.name} style={communityIconStyle} />
                    ) : (
                      <div style={communityPlaceholderStyle}>{community.name[0]}</div>
                    )}
                    <span style={getCommunityNameStyle(community.id)}>c/{community.slug}</span>
                  </div>
                )}
                
                <h3 style={postTitleStyle}>{post.title}</h3>
                
                {post.content && (
                  <p style={excerptStyle}>
                    {post.content.length > 150 ? `${post.content.substring(0, 150)}...` : post.content}
                  </p>
                )}
                
                <div style={metaStyle}>
                  <span style={{ fontWeight: 600 }}>{post.author.name}</span>
                  <span style={{ color: 'var(--color-neutrals-5, #B1B5C3)' }}>•</span>
                  <span>{timeAgo(post.createdAt)}</span>
                </div>
                
                <div style={actionsStyle}>
                  <div style={actionStyle}>
                    <Icon name="chat_bubble_outline" size={16} />
                    <span>{post.commentCount}</span>
                  </div>
                  <div style={actionStyle}>
                    <Icon name="arrow_upward" size={16} />
                    <span>{post.upvotes - post.downvotes}</span>
                  </div>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
};

export default CommunityPostsPromo;

