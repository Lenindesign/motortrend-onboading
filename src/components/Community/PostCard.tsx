/**
 * Post Card Component
 * Migrated to inline styles for Tailwind compatibility
 * Supports both list view and detail view modes
 */

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { Post, Community } from '../../api/communityApi';
import { VoteControl } from './VoteControl';
import Icon from '../Icon';

interface PostCardProps {
  post: Post;
  community?: Community;
  onVote: (id: string, direction: 'up' | 'down') => void;
  showCommunity?: boolean;
  /** Detail view shows full content, larger title, and comment input */
  isDetailView?: boolean;
  onComment?: (comment: string) => void;
}

export const PostCard: React.FC<PostCardProps> = ({ 
  post, 
  community, 
  onVote, 
  showCommunity = true,
  isDetailView = false,
  onComment
}) => {
  const navigate = useNavigate();
  const [isHovered, setIsHovered] = useState(false);
  const [isCommunityHovered, setIsCommunityHovered] = useState(false);
  const [hoveredAction, setHoveredAction] = useState<string | null>(null);
  const [commentText, setCommentText] = useState('');
  const [isCommentBtnHovered, setIsCommentBtnHovered] = useState(false);

  const handleCardClick = () => {
    if (!isDetailView && community) navigate(`/community/${community.slug}/post/${post.id}`);
  };

  const handleCommunityClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (community) navigate(`/community/${community.slug}`);
  };

  const handleCommentSubmit = () => {
    if (commentText.trim() && onComment) {
      onComment(commentText.trim());
      setCommentText('');
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'numeric', day: 'numeric', year: 'numeric' });
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

  // Styles
  const cardStyle: React.CSSProperties = { 
    display: 'flex', 
    flexDirection: 'row',
    backgroundColor: 'var(--color-white, #FFFFFF)', 
    border: `1px solid ${isHovered && !isDetailView ? 'var(--color-neutrals-5, #B1B5C3)' : 'var(--color-neutrals-6, #E6E8EC)'}`, 
    borderRadius: '8px', 
    overflow: 'hidden', 
    cursor: isDetailView ? 'default' : 'pointer', 
    transition: 'border-color 0.2s ease', 
    marginBottom: '16px' 
  };
  const voteColumnStyle: React.CSSProperties = { 
    width: '48px',
    minWidth: '48px',
    flexShrink: 0,
    backgroundColor: 'var(--color-neutrals-7, #F4F5F6)', 
    borderRight: '1px solid var(--color-neutrals-6, #E6E8EC)', 
    display: 'flex', 
    flexDirection: 'column', 
    alignItems: 'center', 
    paddingTop: '12px' 
  };
  const contentColumnStyle: React.CSSProperties = { 
    flex: 1,
    minWidth: 0,
    padding: isDetailView ? '16px 20px' : '12px 16px', 
    display: 'flex', 
    flexDirection: 'column' 
  };
  const headerStyle: React.CSSProperties = { 
    display: 'flex', 
    alignItems: 'center', 
    fontSize: '12px', 
    marginBottom: isDetailView ? '12px' : '8px', 
    color: 'var(--color-neutrals-4, #6E7481)' 
  };
  const communityInfoStyle: React.CSSProperties = { 
    display: 'flex', 
    alignItems: 'center', 
    fontWeight: 700, 
    color: 'var(--color-black, #000000)', 
    marginRight: '4px', 
    textDecoration: isCommunityHovered ? 'underline' : 'none',
    cursor: 'pointer'
  };
  const communityIconStyle: React.CSSProperties = { 
    width: '20px', 
    height: '20px', 
    borderRadius: '50%', 
    marginRight: '6px', 
    objectFit: 'contain', 
    objectPosition: 'center', 
    backgroundColor: 'var(--color-white, #FFFFFF)', 
    padding: '2px' 
  };
  const verifiedIconStyle: React.CSSProperties = { marginLeft: '4px', color: 'var(--color-blue, #186CEA)', flexShrink: 0 };
  const dotStyle: React.CSSProperties = { margin: '0 4px', color: 'var(--color-neutrals-5, #B1B5C3)' };
  
  // Title style - larger and bolder for detail view
  const titleStyle: React.CSSProperties = { 
    fontFamily: 'var(--font-heading, Poppins, sans-serif)',
    fontSize: isDetailView ? '24px' : '18px', 
    fontWeight: isDetailView ? 700 : 600, 
    color: 'var(--color-black, #000000)', 
    margin: isDetailView ? '0 0 16px 0' : '0 0 8px 0', 
    lineHeight: 1.3 
  };
  
  const textContentStyle: React.CSSProperties = { 
    fontSize: '14px', 
    color: 'var(--color-neutrals-3, #353945)', 
    lineHeight: 1.6, 
    marginBottom: '16px' 
  };
  const mediaStyle: React.CSSProperties = { 
    width: '100%', 
    marginBottom: '16px', 
    borderRadius: '8px', 
    overflow: 'hidden', 
    maxHeight: isDetailView ? '600px' : '500px', 
    backgroundColor: 'var(--color-neutrals-7, #F4F5F6)', 
    display: 'flex', 
    justifyContent: 'center' 
  };
  const imageStyle: React.CSSProperties = { 
    maxWidth: '100%', 
    maxHeight: isDetailView ? '600px' : '500px', 
    objectFit: 'contain' 
  };
  const footerStyle: React.CSSProperties = { 
    display: 'flex', 
    flexDirection: 'row',
    flexWrap: 'nowrap',
    alignItems: 'center', 
    gap: '16px', 
    marginTop: 'auto',
    paddingTop: '12px',
    borderTop: isDetailView ? '1px solid var(--color-neutrals-6, #E6E8EC)' : 'none'
  };
  const getActionStyle = (actionId: string): React.CSSProperties => ({ 
    display: 'inline-flex', 
    flexDirection: 'row',
    alignItems: 'center', 
    gap: '6px', 
    fontSize: '13px', 
    fontWeight: 600, 
    color: 'var(--color-neutrals-4, #6E7481)', 
    padding: '8px 12px', 
    borderRadius: '4px', 
    transition: 'background-color 0.2s', 
    backgroundColor: hoveredAction === actionId ? 'var(--color-neutrals-7, #F4F5F6)' : 'transparent', 
    cursor: 'pointer', 
    border: 'none',
    whiteSpace: 'nowrap'
  });
  const metaStyle: React.CSSProperties = { color: 'var(--color-neutrals-4, #6E7481)' };

  // Comment input styles
  const commentSectionStyle: React.CSSProperties = {
    marginTop: '20px',
    paddingTop: '16px',
    borderTop: '1px solid var(--color-neutrals-6, #E6E8EC)'
  };
  const commentInputWrapperStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    padding: '16px',
    backgroundColor: 'var(--color-neutrals-7, #F4F5F6)',
    borderRadius: '8px',
    border: '1px solid var(--color-neutrals-6, #E6E8EC)'
  };
  const commentTextareaStyle: React.CSSProperties = {
    width: '100%',
    minHeight: '80px',
    padding: '12px',
    border: '1px solid var(--color-neutrals-6, #E6E8EC)',
    borderRadius: '6px',
    backgroundColor: 'var(--color-white, #FFFFFF)',
    fontFamily: 'var(--font-body, Geist, sans-serif)',
    fontSize: '14px',
    color: 'var(--color-neutrals-2, #23262F)',
    resize: 'vertical',
    outline: 'none'
  };
  const commentBtnStyle: React.CSSProperties = {
    alignSelf: 'flex-end',
    padding: '10px 24px',
    backgroundColor: isCommentBtnHovered ? 'var(--color-primary-1, #E90C17)' : 'var(--color-primary-3, #ff858a)',
    color: isCommentBtnHovered ? 'var(--color-white, #FFFFFF)' : 'var(--color-neutrals-2, #23262F)',
    border: 'none',
    borderRadius: '6px',
    fontFamily: 'var(--font-heading, Poppins, sans-serif)',
    fontSize: '14px',
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'all 0.2s ease'
  };

  const isVerified = community && (community.id === 'comm_motortrend' || community.id === 'comm_caranddriver' || community.id === 'comm_hotrodpowertour');

  return (
    <div 
      style={cardStyle} 
      onClick={handleCardClick} 
      onMouseEnter={() => setIsHovered(true)} 
      onMouseLeave={() => setIsHovered(false)}
    >
      <div style={voteColumnStyle}>
        <VoteControl 
          upvotes={post.upvotes} 
          downvotes={post.downvotes} 
          userVote={post.userVote} 
          onVote={(dir) => onVote(post.id, dir)} 
          orientation="vertical" 
          size="md" 
        />
      </div>
      <div style={contentColumnStyle}>
        <div style={headerStyle}>
          {showCommunity && community && (
            <div 
              style={communityInfoStyle} 
              onClick={handleCommunityClick} 
              onMouseEnter={() => setIsCommunityHovered(true)} 
              onMouseLeave={() => setIsCommunityHovered(false)}
            >
              {community.icon && <img src={community.icon} alt={community.name} style={communityIconStyle} />}
              <span>c/{community.slug}</span>
              {isVerified && <Icon name="check_circle" size={14} style={verifiedIconStyle} />}
              <span style={dotStyle}>•</span>
            </div>
          )}
          <span style={metaStyle}>
            Posted by {post.author.name} {isDetailView ? `• ${formatDate(post.createdAt)}` : timeAgo(post.createdAt)}
          </span>
        </div>
        
        {/* Title with detail variant support */}
        <h1 style={titleStyle}>{post.title}</h1>
        
        {/* Image or text content */}
        {post.image && (
          <div style={mediaStyle}>
            <img src={post.image} alt={post.title} style={imageStyle} />
          </div>
        )}
        
        {/* Show full content in detail view, snippet in list view */}
        {isDetailView ? (
          <div style={textContentStyle}>{post.content}</div>
        ) : (
          !post.image && (
            <div style={{ ...textContentStyle, color: 'var(--color-neutrals-4, #6E7481)' }}>
              {post.content.length > 300 ? `${post.content.substring(0, 300)}...` : post.content}
            </div>
          )
        )}
        
        {/* Actions footer */}
        <div style={footerStyle}>
          <button 
            style={getActionStyle('comments')} 
            onMouseEnter={() => setHoveredAction('comments')} 
            onMouseLeave={() => setHoveredAction(null)}
          >
            <Icon name="chat_bubble_outline" size={18} />
            <span>{post.commentCount} Comments</span>
          </button>
          <button 
            style={getActionStyle('share')} 
            onMouseEnter={() => setHoveredAction('share')} 
            onMouseLeave={() => setHoveredAction(null)}
          >
            <Icon name="share" size={18} />
            <span>Share</span>
          </button>
          <button 
            style={getActionStyle('save')} 
            onMouseEnter={() => setHoveredAction('save')} 
            onMouseLeave={() => setHoveredAction(null)}
          >
            <Icon name="bookmark_border" size={18} />
            <span>Save</span>
          </button>
        </div>
        
        {/* Comment input section - only in detail view */}
        {isDetailView && (
          <div style={commentSectionStyle}>
            <div style={commentInputWrapperStyle}>
              <textarea
                style={commentTextareaStyle}
                placeholder="What are your thoughts?"
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
              />
              <button 
                style={commentBtnStyle}
                onClick={handleCommentSubmit}
                onMouseEnter={() => setIsCommentBtnHovered(true)}
                onMouseLeave={() => setIsCommentBtnHovered(false)}
                disabled={!commentText.trim()}
              >
                Comment
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PostCard;
