/**
 * Community Posts Promo Component
 * Displays featured community posts on the home page
 */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import type { Post, Community } from '../../api/communityApi';
import { getPosts, getCommunities } from '../../api/communityApi';
import Icon from '../Icon';
import './CommunityPostsPromo.css';

export interface CommunityPostsPromoProps {
  title?: string;
  maxPosts?: number;
}

export const CommunityPostsPromo: React.FC<CommunityPostsPromoProps> = ({
  title = 'Trending in Community',
  maxPosts = 3,
}) => {
  const navigate = useNavigate();
  const [posts, setPosts] = useState<Post[]>([]);
  const [communities, setCommunities] = useState<Community[]>([]);

  useEffect(() => {
    // Get all posts and sort by hot score (upvotes - downvotes)
    const allPosts = getPosts();
    const sortedPosts = [...allPosts]
      .sort((a, b) => (b.upvotes - b.downvotes) - (a.upvotes - a.downvotes))
      .slice(0, maxPosts);
    
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

  if (posts.length === 0) {
    return null;
  }

  return (
    <section className="community-posts-promo">
      <div className="community-posts-promo__header">
        <h2 className="community-posts-promo__title">{title}</h2>
        <a 
          href="/community" 
          className="community-posts-promo__view-all"
          onClick={(e) => {
            e.preventDefault();
            navigate('/community');
          }}
        >
          View All
          <Icon name="chevron_right" size={16} />
        </a>
      </div>
      
      <div className="community-posts-promo__grid">
        {posts.map((post) => {
          const community = getCommunityForPost(post);
          return (
            <article 
              key={post.id} 
              className="community-posts-promo__card"
              onClick={() => handlePostClick(post)}
            >
              {post.image && (
                <div className="community-posts-promo__image-wrapper">
                  <img 
                    src={post.image} 
                    alt={post.title}
                    className="community-posts-promo__image"
                  />
                </div>
              )}
              
              <div className="community-posts-promo__content">
                {community && (
                  <div 
                    className="community-posts-promo__community"
                    onClick={(e) => handleCommunityClick(e, community)}
                  >
                    {community.icon ? (
                      <img 
                        src={community.icon} 
                        alt={community.name}
                        className="community-posts-promo__community-icon"
                      />
                    ) : (
                      <div className="community-posts-promo__community-placeholder">
                        {community.name[0]}
                      </div>
                    )}
                    <span className="community-posts-promo__community-name">
                      c/{community.slug}
                    </span>
                  </div>
                )}
                
                <h3 className="community-posts-promo__post-title">{post.title}</h3>
                
                {post.content && (
                  <p className="community-posts-promo__post-excerpt">
                    {post.content.length > 150 
                      ? `${post.content.substring(0, 150)}...` 
                      : post.content}
                  </p>
                )}
                
                <div className="community-posts-promo__meta">
                  <span className="community-posts-promo__author">
                    {post.author.name}
                  </span>
                  <span className="community-posts-promo__separator">•</span>
                  <span className="community-posts-promo__time">
                    {timeAgo(post.createdAt)}
                  </span>
                </div>
                
                <div className="community-posts-promo__actions">
                  <div className="community-posts-promo__action">
                    <Icon name="chat_bubble_outline" size={16} />
                    <span>{post.commentCount}</span>
                  </div>
                  <div className="community-posts-promo__action">
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

