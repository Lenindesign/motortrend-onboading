import React, { useState, useEffect } from 'react';
import type { Comment } from '../../api/communityApi';
import { getComments, addComment, toggleVote } from '../../api/communityApi';
import { VoteControl } from './VoteControl';
import './CommentSection.css';

interface CommentSectionProps {
  postId: string;
}

export const CommentSection: React.FC<CommentSectionProps> = ({ postId }) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');

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

  return (
    <div className="comment-section">
      <form onSubmit={handleSubmit} className="comment-section__form">
        <textarea
          className="comment-section__input"
          placeholder="What are your thoughts?"
          value={newComment}
          onChange={e => setNewComment(e.target.value)}
          rows={4}
        />
        <div className="comment-section__actions">
          <button 
            type="submit" 
            className="comment-section__submit"
            disabled={!newComment.trim()}
          >
            Comment
          </button>
        </div>
      </form>

      <div className="comment-section__list">
        {comments.map(comment => (
          <div key={comment.id} className="comment-item">
            <div className="comment-item__avatar">
               {comment.author.avatar ? (
                 <img src={comment.author.avatar} alt={comment.author.name} />
               ) : (
                 <div className="comment-item__avatar-placeholder">
                   {comment.author.name[0]}
                 </div>
               )}
            </div>
            <div className="comment-item__content">
              <div className="comment-item__header">
                <span className="comment-item__author">{comment.author.name}</span>
                <span className="comment-item__time">{timeAgo(comment.createdAt)}</span>
              </div>
              <div className="comment-item__body">
                {comment.content}
              </div>
              <div className="comment-item__footer">
                <VoteControl 
                  upvotes={comment.upvotes} 
                  downvotes={comment.downvotes}
                  userVote={comment.userVote}
                  onVote={(dir) => handleVote(comment.id, dir)}
                  orientation="horizontal"
                  size="sm"
                />
                <button className="comment-item__reply-btn">Reply</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};


