/**
 * Comment Section Component
 * Migrated to inline styles for Tailwind compatibility
 */

import React, { useState, useEffect } from 'react';
import type { Comment } from '../../api/communityApi';
import { getComments, addComment, toggleVote } from '../../api/communityApi';
import { VoteControl } from './VoteControl';

interface CommentSectionProps {
  postId: string;
}

export const CommentSection: React.FC<CommentSectionProps> = ({ postId }) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [isSubmitHovered, setIsSubmitHovered] = useState(false);
  const [hoveredReply, setHoveredReply] = useState<string | null>(null);

  useEffect(() => {
    setComments(getComments(postId));
  }, [postId]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    const comment = addComment(postId, newComment);
    setComments(prev => [comment, ...prev]);
    setNewComment('');
  };

  const handleVote = (id: string, direction: 'up' | 'down') => {
    toggleVote('comment', id, direction);
    // Refresh comments to get updated counts
    setComments(getComments(postId));
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

  const isSubmitDisabled = !newComment.trim();

  // Styles
  const sectionStyle: React.CSSProperties = {
    marginTop: '24px',
    paddingTop: '24px',
    borderTop: '1px solid var(--color-neutrals-6, #E6E8EC)'
  };

  const formStyle: React.CSSProperties = {
    marginBottom: '32px',
    border: '1px solid var(--color-neutrals-6, #E6E8EC)',
    borderRadius: '8px',
    overflow: 'hidden'
  };

  const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '12px',
    border: 'none',
    backgroundColor: 'var(--color-white, #FFFFFF)',
    resize: 'vertical',
    fontFamily: 'inherit',
    fontSize: '14px',
    outline: 'none',
    minHeight: '100px',
    color: 'var(--color-black, #000000)',
    boxSizing: 'border-box'
  };

  const actionsStyle: React.CSSProperties = {
    backgroundColor: 'var(--color-neutrals-7, #F4F5F6)',
    padding: '8px 12px',
    display: 'flex',
    justifyContent: 'flex-end'
  };

  const submitStyle: React.CSSProperties = {
    backgroundColor: isSubmitDisabled 
      ? 'var(--color-neutrals-5, #B1B5C3)' 
      : isSubmitHovered 
        ? 'var(--color-neutrals-1, #141416)' 
        : 'var(--color-primary-1, #E90C17)',
    color: 'white',
    border: 'none',
    padding: '6px 16px',
    borderRadius: '999px',
    fontWeight: 600,
    fontSize: '12px',
    cursor: isSubmitDisabled ? 'not-allowed' : 'pointer',
    opacity: isSubmitDisabled ? 0.5 : 1,
    transition: 'background-color 0.2s'
  };

  const commentItemStyle: React.CSSProperties = {
    display: 'flex',
    gap: '12px',
    marginBottom: '24px'
  };

  const avatarWrapperStyle: React.CSSProperties = {
    flexShrink: 0
  };

  const avatarImgStyle: React.CSSProperties = {
    width: '28px',
    height: '28px',
    borderRadius: '50%',
    objectFit: 'cover'
  };

  const avatarPlaceholderStyle: React.CSSProperties = {
    width: '28px',
    height: '28px',
    borderRadius: '50%',
    backgroundColor: 'var(--color-neutrals-3, #353945)',
    color: 'var(--color-neutrals-5, #B1B5C3)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '12px',
    fontWeight: 700
  };

  const contentStyle: React.CSSProperties = {
    flex: 1
  };

  const headerStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    marginBottom: '4px',
    fontSize: '12px'
  };

  const authorStyle: React.CSSProperties = {
    fontWeight: 600,
    color: 'var(--color-black, #000000)'
  };

  const timeStyle: React.CSSProperties = {
    color: 'var(--color-neutrals-4, #6E7481)'
  };

  const bodyStyle: React.CSSProperties = {
    fontSize: '14px',
    color: 'var(--color-neutrals-4, #6E7481)',
    lineHeight: 1.5,
    marginBottom: '8px'
  };

  const footerStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: '16px'
  };

  const getReplyBtnStyle = (commentId: string): React.CSSProperties => ({
    background: hoveredReply === commentId ? 'var(--color-neutrals-7, #F4F5F6)' : 'none',
    border: 'none',
    fontSize: '12px',
    fontWeight: 600,
    color: 'var(--color-neutrals-4, #6E7481)',
    cursor: 'pointer',
    padding: '4px 8px',
    borderRadius: '4px',
    transition: 'background-color 0.2s'
  });

  return (
    <div style={sectionStyle}>
      <form onSubmit={handleSubmit} style={formStyle}>
        <textarea
          style={inputStyle}
          placeholder="What are your thoughts?"
          value={newComment}
          onChange={e => setNewComment(e.target.value)}
          rows={4}
        />
        <div style={actionsStyle}>
          <button 
            type="submit" 
            style={submitStyle}
            disabled={isSubmitDisabled}
            onMouseEnter={() => setIsSubmitHovered(true)}
            onMouseLeave={() => setIsSubmitHovered(false)}
          >
            Comment
          </button>
        </div>
      </form>

      <div>
        {comments.map(comment => (
          <div key={comment.id} style={commentItemStyle}>
            <div style={avatarWrapperStyle}>
               {comment.author.avatar ? (
                 <img src={comment.author.avatar} alt={comment.author.name} style={avatarImgStyle} />
               ) : (
                 <div style={avatarPlaceholderStyle}>
                   {comment.author.name[0]}
                 </div>
               )}
            </div>
            <div style={contentStyle}>
              <div style={headerStyle}>
                <span style={authorStyle}>{comment.author.name}</span>
                <span style={timeStyle}>{timeAgo(comment.createdAt)}</span>
              </div>
              <div style={bodyStyle}>
                {comment.content}
              </div>
              <div style={footerStyle}>
                <VoteControl 
                  upvotes={comment.upvotes} 
                  downvotes={comment.downvotes}
                  userVote={comment.userVote}
                  onVote={(dir) => handleVote(comment.id, dir)}
                  orientation="horizontal"
                  size="sm"
                />
                <button 
                  style={getReplyBtnStyle(comment.id)}
                  onMouseEnter={() => setHoveredReply(comment.id)}
                  onMouseLeave={() => setHoveredReply(null)}
                >
                  Reply
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
