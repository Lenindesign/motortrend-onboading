/**
 * Comment Section Component
 * Migrated to inline styles for Tailwind compatibility
 */

import React, { useState, useEffect } from 'react';
import type { Comment } from '../../api/communityApi';
import { getComments as getCommentsV1, addReply, toggleVote } from '../../api/communityApi';
import { getComments as getCommentsV2, addComment as addCommentV2 } from '../../api/communityApiV2';
import type { CommentWithAuthor } from '../../api/communityApiV2';
import { canUseSupabase } from '../../lib/supabase';
import { VoteControl } from './VoteControl';
import Icon from '../Icon';

interface CommentSectionProps {
  postId: string;
}

const normalizeComment = (comment: CommentWithAuthor, fallbackPostId: string): Comment => ({
  id: comment.id,
  postId: comment.postId || comment.post_id || fallbackPostId,
  author: {
    id: comment.author.id,
    name: comment.author.name || comment.author.display_name || 'Guest',
    avatar: comment.author.avatar || comment.author.avatar_url || undefined,
  },
  content: comment.content,
  createdAt: comment.createdAt || comment.created_at || new Date().toISOString(),
  upvotes: comment.upvotes,
  downvotes: comment.downvotes,
  userVote: comment.userVote || comment.user_vote || null,
  replies: comment.replies?.map(reply => normalizeComment(reply, fallbackPostId)),
});

export const CommentSection: React.FC<CommentSectionProps> = ({ postId }) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [moderationError, setModerationError] = useState<string | null>(null);
  const [isSubmitHovered, setIsSubmitHovered] = useState(false);
  const [hoveredReply, setHoveredReply] = useState<string | null>(null);
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');
  const [isReplySubmitHovered, setIsReplySubmitHovered] = useState(false);

  const useSupabase = canUseSupabase();

  useEffect(() => {
    if (useSupabase) {
      getCommentsV2(postId)
        .then(data => setComments(data.map(comment => normalizeComment(comment, postId))))
        .catch(() => {});
    } else {
      setComments(getCommentsV1(postId));
    }
  }, [postId, useSupabase]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || isSubmitting) return;
    setModerationError(null);
    setIsSubmitting(true);

    try {
      if (useSupabase) {
        const comment = await addCommentV2(postId, newComment);
        setComments(prev => [normalizeComment(comment, postId), ...prev]);
      } else {
        const { addComment: addCommentV1 } = await import('../../api/communityApi');
        const comment = addCommentV1(postId, newComment);
        setComments(prev => [comment, ...prev]);
      }
      setNewComment('');
    } catch (err: unknown) {
      const error = err as Error & { flagged?: boolean; categories?: Record<string, boolean> };
      if (error.flagged) {
        setModerationError('Your comment was flagged for inappropriate content. Please revise and try again.');
      } else {
        setModerationError(error.message || 'Failed to post comment.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleVote = (id: string, direction: 'up' | 'down') => {
    toggleVote('comment', id, direction);
    // Refresh comments to get updated counts
    setComments(getCommentsV1(postId));
  };
  
  const handleReplyClick = (commentId: string) => {
    if (replyingTo === commentId) {
      setReplyingTo(null);
      setReplyText('');
    } else {
      setReplyingTo(commentId);
      setReplyText('');
    }
  };
  
  const handleReplySubmit = (parentCommentId: string) => {
    if (!replyText.trim()) return;
    
    addReply(postId, parentCommentId, replyText);
    setComments(getCommentsV1(postId));
    setReplyingTo(null);
    setReplyText('');
  };
  
  const handleCancelReply = () => {
    setReplyingTo(null);
    setReplyText('');
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

  const isSubmitDisabled = !newComment.trim() || isSubmitting;

  // Styles
  const sectionStyle: React.CSSProperties = {
    marginTop: '24px',
    paddingTop: '24px',
    borderTop: '1px solid var(--color-neutrals-6, #E6E8EC)'
  };

  const formStyle: React.CSSProperties = {
    marginBottom: '32px',
    border: '1px solid var(--color-neutrals-6, #E6E8EC)',
    borderRadius: 'var(--border-radius-md, 8px)',
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
    borderRadius: 'var(--border-radius-pill, 999px)',
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
    borderRadius: 'var(--border-radius-circle, 50%)',
    objectFit: 'cover'
  };

  const avatarPlaceholderStyle: React.CSSProperties = {
    width: '28px',
    height: '28px',
    borderRadius: 'var(--border-radius-circle, 50%)',
    backgroundColor: 'var(--color-neutrals-3, #353945)',
    color: 'var(--color-neutrals-5, #B1B5C3)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '12px',
    fontWeight: 600
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
    background: hoveredReply === commentId || replyingTo === commentId ? 'var(--color-neutrals-7, #F4F5F6)' : 'none',
    border: 'none',
    fontSize: '12px',
    fontWeight: 600,
    color: replyingTo === commentId ? 'var(--color-primary-1, #E90C17)' : 'var(--color-neutrals-4, #6E7481)',
    cursor: 'pointer',
    padding: '4px 8px',
    borderRadius: 'var(--border-radius-sm, 4px)',
    transition: 'background-color 0.2s'
  });
  
  const replyFormStyle: React.CSSProperties = {
    marginTop: '12px',
    marginLeft: '40px',
    border: '1px solid var(--color-neutrals-6, #E6E8EC)',
    borderRadius: 'var(--border-radius-md, 8px)',
    overflow: 'hidden'
  };
  
  const replyInputStyle: React.CSSProperties = {
    width: '100%',
    padding: '10px 12px',
    border: 'none',
    backgroundColor: 'var(--color-white, #FFFFFF)',
    resize: 'none',
    fontFamily: 'inherit',
    fontSize: '13px',
    outline: 'none',
    minHeight: '60px',
    color: 'var(--color-black, #000000)',
    boxSizing: 'border-box'
  };
  
  const replyActionsStyle: React.CSSProperties = {
    backgroundColor: 'var(--color-neutrals-7, #F4F5F6)',
    padding: '6px 10px',
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '8px'
  };
  
  const replyCancelBtnStyle: React.CSSProperties = {
    background: 'transparent',
    border: 'none',
    padding: '4px 12px',
    borderRadius: 'var(--border-radius-sm, 4px)',
    fontWeight: 600,
    fontSize: '11px',
    cursor: 'pointer',
    color: 'var(--color-neutrals-4, #6E7481)'
  };
  
  const isReplyDisabled = !replyText.trim();
  
  const replySubmitBtnStyle: React.CSSProperties = {
    backgroundColor: isReplyDisabled 
      ? 'var(--color-neutrals-5, #B1B5C3)' 
      : isReplySubmitHovered 
        ? 'var(--color-neutrals-1, #141416)' 
        : 'var(--color-primary-1, #E90C17)',
    color: 'white',
    border: 'none',
    padding: '4px 12px',
    borderRadius: 'var(--border-radius-pill, 999px)',
    fontWeight: 600,
    fontSize: '11px',
    cursor: isReplyDisabled ? 'not-allowed' : 'pointer',
    opacity: isReplyDisabled ? 0.5 : 1,
    transition: 'background-color 0.2s'
  };
  
  const nestedRepliesStyle: React.CSSProperties = {
    marginLeft: '40px',
    paddingLeft: '16px',
    borderLeft: '2px solid var(--color-neutrals-6, #E6E8EC)',
    marginTop: '12px'
  };

  return (
    <div style={sectionStyle}>
      <form onSubmit={handleSubmit} style={formStyle}>
        <textarea
          style={inputStyle}
          placeholder="What are your thoughts?"
          value={newComment}
          onChange={e => { setNewComment(e.target.value); setModerationError(null); }}
          rows={4}
        />
        {moderationError && (
          <div style={{ padding: '8px 12px', backgroundColor: '#FEE2E2', color: '#991B1B', fontSize: '13px', borderTop: '1px solid #FECACA' }}>
            {moderationError}
          </div>
        )}
        <div style={actionsStyle}>
          <button 
            type="submit" 
            style={submitStyle}
            disabled={isSubmitDisabled}
            onMouseEnter={() => setIsSubmitHovered(true)}
            onMouseLeave={() => setIsSubmitHovered(false)}
          >
            {isSubmitting ? 'Checking...' : 'Comment'}
          </button>
        </div>
      </form>

      <div>
        {comments.map(comment => (
          <div key={comment.id}>
            <div style={commentItemStyle}>
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
                    onClick={() => handleReplyClick(comment.id)}
                  >
                    <Icon name={replyingTo === comment.id ? 'close' : 'reply'} size={14} style={{ marginRight: '4px' }} />
                    {replyingTo === comment.id ? 'Cancel' : 'Reply'}
                  </button>
                </div>
              </div>
            </div>
            
            {/* Reply Form */}
            {replyingTo === comment.id && (
              <div style={replyFormStyle}>
                <textarea
                  style={replyInputStyle}
                  placeholder={`Reply to ${comment.author.name}...`}
                  value={replyText}
                  onChange={e => setReplyText(e.target.value)}
                  autoFocus
                />
                <div style={replyActionsStyle}>
                  <button 
                    style={replyCancelBtnStyle}
                    onClick={handleCancelReply}
                  >
                    Cancel
                  </button>
                  <button 
                    style={replySubmitBtnStyle}
                    disabled={isReplyDisabled}
                    onClick={() => handleReplySubmit(comment.id)}
                    onMouseEnter={() => setIsReplySubmitHovered(true)}
                    onMouseLeave={() => setIsReplySubmitHovered(false)}
                  >
                    Reply
                  </button>
                </div>
              </div>
            )}
            
            {/* Nested Replies */}
            {comment.replies && comment.replies.length > 0 && (
              <div style={nestedRepliesStyle}>
                {comment.replies.map(reply => (
                  <div key={reply.id} style={{ ...commentItemStyle, marginBottom: '16px' }}>
                    <div style={avatarWrapperStyle}>
                       {reply.author.avatar ? (
                         <img src={reply.author.avatar} alt={reply.author.name} style={avatarImgStyle} />
                       ) : (
                         <div style={avatarPlaceholderStyle}>
                           {reply.author.name[0]}
                         </div>
                       )}
                    </div>
                    <div style={contentStyle}>
                      <div style={headerStyle}>
                        <span style={authorStyle}>{reply.author.name}</span>
                        <span style={timeStyle}>{timeAgo(reply.createdAt)}</span>
                      </div>
                      <div style={bodyStyle}>
                        {reply.content}
                      </div>
                      <div style={footerStyle}>
                        <VoteControl 
                          upvotes={reply.upvotes} 
                          downvotes={reply.downvotes}
                          userVote={reply.userVote}
                          onVote={(dir) => handleVote(reply.id, dir)}
                          orientation="horizontal"
                          size="sm"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
