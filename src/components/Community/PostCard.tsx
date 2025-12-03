import React from 'react';
import { useNavigate } from 'react-router-dom';
import type { Post, Community } from '../../api/communityApi';
import { VoteControl } from './VoteControl';
import Icon from '../Icon';
import './PostCard.css';

interface PostCardProps {
  post: Post;
  community?: Community; // If null, show community name/icon
  onVote: (id: string, direction: 'up' | 'down') => void;
  showCommunity?: boolean;
}

export const PostCard: React.FC<PostCardProps> = ({ 
  post, 
  community, 
  onVote,
  showCommunity = true 
}) => {
  const navigate = useNavigate();

  const handleCardClick = () => {
    if (community) {
      navigate(`/community/${community.slug}/post/${post.id}`);
    } else {
       // Fallback if we don't have the slug readily available (though we should usually pass it)
       // We might need to fetch it or just navigate to a generic route if needed, 
       // but ideally we pass the community object.
    }
  };

  const handleCommunityClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (community) {
      navigate(`/community/${community.slug}`);
    }
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

  return (
    <div className="post-card" onClick={handleCardClick}>
      {/* Vote Column */}
      <div className="post-card__vote-column">
        <VoteControl 
          upvotes={post.upvotes} 
          downvotes={post.downvotes}
          userVote={post.userVote}
          onVote={(dir) => onVote(post.id, dir)}
          orientation="vertical"
          size="md"
        />
      </div>

      {/* Content Column */}
      <div className="post-card__content-column">
        {/* Header: Community + User + Time */}
        <div className="post-card__header">
          {showCommunity && community && (
            <div className="post-card__community-info" onClick={handleCommunityClick}>
              {community.icon && (
                <img src={community.icon} alt={community.name} className="post-card__community-icon" />
              )}
              <span className="post-card__community-name">c/{community.slug}</span>
              <span className="post-card__dot">•</span>
            </div>
          )}
          <span className="post-card__meta">
            Posted by {post.author.name} {timeAgo(post.createdAt)}
          </span>
        </div>

        {/* Title */}
        <h3 className="post-card__title">{post.title}</h3>

        {/* Content / Snippet */}
        {post.image ? (
          <div className="post-card__media">
            <img src={post.image} alt={post.title} className="post-card__image" />
          </div>
        ) : (
           <div className="post-card__text-snippet">
             {post.content.length > 300 ? `${post.content.substring(0, 300)}...` : post.content}
           </div>
        )}

        {/* Footer: Actions */}
        <div className="post-card__footer">
          <div className="post-card__action">
            <Icon name="chat_bubble_outline" size={18} />
            <span>{post.commentCount} Comments</span>
          </div>
          <div className="post-card__action">
            <Icon name="share" size={18} />
            <span>Share</span>
          </div>
          <div className="post-card__action">
            <Icon name="bookmark_border" size={18} />
            <span>Save</span>
          </div>
        </div>
      </div>
    </div>
  );
};


