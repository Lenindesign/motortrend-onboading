import React, { useState, useEffect } from 'react';
import Icon from '../Icon';
import RatingModal from '../RatingModal';
import { useRating } from '../../contexts/RatingContext';
import './UserReviews.css';

export interface ReplyData {
  id: string;
  replierName: string;
  content: string;
  date: string;
}

export interface ReviewData {
  id: string;
  reviewerName: string;
  rating: number;
  title: string;
  content: string;
  vehicleType: string;
  vehicleModel: string;
  date: string;
  mediaFiles?: File[];
  mediaPreviews?: string[];
  thumbsUpCount?: number;
  isThumbsUp?: boolean;
  replies?: ReplyData[];
}

interface UserReviewsProps {
  vehicleName: string;
  communityRating: number;
  totalReviews: number;
  ratingDistribution: number[];
  vehicleImage?: string;
  reviews: ReviewData[];
  onWriteReview?: () => void;
}

export const UserReviews: React.FC<UserReviewsProps> = ({ 
  vehicleName,
  communityRating,
  totalReviews,
  ratingDistribution,
  reviews,
  onWriteReview 
}) => {
  const [expandedReview, setExpandedReview] = useState<string | null>(null);
  const [isRatingModalOpen, setIsRatingModalOpen] = useState(false);
  const [thumbsUpStates, setThumbsUpStates] = useState<Record<string, boolean>>({});
  const [replyingToReview, setReplyingToReview] = useState<string | null>(null);
  const [replyText, setReplyText] = useState<string>('');
  const [replies, setReplies] = useState<Record<string, ReplyData[]>>({});
  const [userAvatar, setUserAvatar] = useState<string | null>(null);
  const { getUserRating, setUserRating } = useRating();
  const userRating = getUserRating(vehicleName);

  // Load user avatar from localStorage
  useEffect(() => {
    try {
      const onboardingData = localStorage.getItem('onboardingData');
      if (onboardingData) {
        const data = JSON.parse(onboardingData);
        if (data.avatar) {
          setUserAvatar(data.avatar);
        }
      }
    } catch (error) {
      console.error('Error loading user avatar:', error);
    }
  }, []);

  const toggleExpanded = (reviewId: string) => {
    setExpandedReview(expandedReview === reviewId ? null : reviewId);
  };

  const handleOpenRatingModal = () => {
    setIsRatingModalOpen(true);
  };

  const handleCloseRatingModal = () => {
    setIsRatingModalOpen(false);
  };

  const handleRatingSubmit = (rating: number) => {
    setUserRating(vehicleName, rating);
    setIsRatingModalOpen(false);
  };

  const handleRateAndReview = (rating: number) => {
    setUserRating(vehicleName, rating);
    setIsRatingModalOpen(false);
    // Open the write review modal if callback is provided
    if (onWriteReview) {
      onWriteReview();
    }
  };

  const handleThumbsUp = (reviewId: string) => {
    setThumbsUpStates(prev => ({
      ...prev,
      [reviewId]: !prev[reviewId]
    }));
  };

  const handleReply = (reviewId: string) => {
    setReplyingToReview(replyingToReview === reviewId ? null : reviewId);
    setReplyText('');
  };

  const handleReplySubmit = (reviewId: string) => {
    if (!replyText.trim()) return;

    const newReply: ReplyData = {
      id: `reply-${Date.now()}`,
      replierName: 'You', // In a real app, this would come from user context
      content: replyText.trim(),
      date: new Date().toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      })
    };

    setReplies(prev => ({
      ...prev,
      [reviewId]: [...(prev[reviewId] || []), newReply]
    }));

    setReplyText('');
    setReplyingToReview(null);
  };

  const handleReplyCancel = () => {
    setReplyText('');
    setReplyingToReview(null);
  };

  const handleShare = (reviewId: string) => {
    // TODO: Implement share functionality
    console.log('Share review:', reviewId);
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 1);
  };

  const renderMedia = (review: ReviewData) => {
    if (!review.mediaPreviews || review.mediaPreviews.length === 0) {
      return null;
    }

    return (
      <div className="user-reviews__media">
        {review.mediaPreviews.map((preview, index) => (
          <div key={index} className="user-reviews__media-item">
            {review.mediaFiles?.[index]?.type.startsWith('video/') ? (
              <video 
                src={preview} 
                controls 
                className="user-reviews__media-content"
              />
            ) : (
              <img 
                src={preview} 
                alt={`Review media ${index + 1}`}
                className="user-reviews__media-content"
              />
            )}
          </div>
        ))}
      </div>
    );
  };

  const maxRatingCount = Math.max(...ratingDistribution);

  return (
    <div className="user-reviews">
      {/* Main Header */}
      <div className="user-reviews__header">
        <h2 className="user-reviews__title">
          User Reviews
          <Icon name="info" size={16} className="user-reviews__info-icon" />
        </h2>
      </div>

      <div className="user-reviews__content">
        {/* Vehicle Name and Write Review Button */}
        <div className="user-reviews__vehicle-header">
          <h3 className="user-reviews__vehicle-name">{vehicleName}</h3>
          {onWriteReview && (
            <button 
              className="user-reviews__write-review-btn"
              onClick={onWriteReview}
            >
              <Icon name="add" size={20} />
              Write a Vehicle Review
            </button>
          )}
        </div>

        {/* Rating Section */}
        <div className="user-reviews__rating-section">
          {/* Community Rating Card */}
          <div className="user-reviews__community-rating">
            <div className="user-reviews__rating-card">
              <div className="user-reviews__rating-content">
                <img 
                  src="https://d2kde5ohu8qb21.cloudfront.net/files/68f66c095d4ae300022a2b0e/starbluesolid.svg" 
                  alt="Star" 
                  className="user-reviews__star-icon"
                />
                <div className="user-reviews__rating-info">
                  <div className="user-reviews__rating-score">{communityRating}</div>
                  <div className="user-reviews__rating-label">
                    <span className="user-reviews__rating-label-text">Community Rating</span>
                    <span className="user-reviews__rating-label-count"> ({totalReviews})</span>
                  </div>
                </div>
              </div>
              <button 
                className="user-reviews__add-rate"
                onClick={handleOpenRatingModal}
              >
                <img 
                  src={userRating > 0 
                    ? "https://d2kde5ohu8qb21.cloudfront.net/files/68f66c095d4ae300022a2b0e/starbluesolid.svg"
                    : "https://d2kde5ohu8qb21.cloudfront.net/files/68f66c095d4ae300022a2b10/starbluenotsolid.svg"
                  }
                  alt="Add Rating" 
                  className="user-reviews__add-rate-star"
                />
                {userRating > 0 ? `Your Rating: ${userRating}` : 'Add Your Rate'}
              </button>
            </div>
          </div>

          {/* Rating Distribution Chart */}
          <div className="user-reviews__distribution">
            <div className="user-reviews__distribution-chart">
              {ratingDistribution.map((count, index) => (
                <div key={index} className="user-reviews__distribution-bar">
                  <img 
                    src="https://d2kde5ohu8qb21.cloudfront.net/files/68f66c095d4ae300022a2b0e/starbluesolid.svg" 
                    alt="Star" 
                    className="user-reviews__bar-star"
                  />
                  <div 
                    className="user-reviews__bar-fill"
                    style={{ height: `${(count / maxRatingCount) * 100}%` }}
                  />
                  <span className="user-reviews__bar-label">{index + 1}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Reviews Section */}
        <div className="user-reviews__recent-section">
          <div className="user-reviews__recent-header">
            <h4 className="user-reviews__recent-title">Recent User Reviews</h4>
            <span className="user-reviews__recent-count">{totalReviews} review{totalReviews !== 1 ? 's' : ''}</span>
          </div>

          <div className="user-reviews__reviews-list">
            {reviews.map((review) => (
              <div key={review.id} className="user-reviews__review-card">
                <div className="user-reviews__review-header">
                  <div className="user-reviews__reviewer-avatar">
                    {review.reviewerName === 'You' && userAvatar ? (
                      <img 
                        src={userAvatar} 
                        alt="Your avatar" 
                        className="user-reviews__reviewer-avatar-img"
                      />
                    ) : (
                      getInitials(review.reviewerName)
                    )}
                  </div>
                  <div className="user-reviews__reviewer-info">
                    <div className="user-reviews__reviewer-name-row">
                      <span className="user-reviews__reviewer-name">{review.reviewerName}</span>
                      <div className="user-reviews__review-rating-row">
                        <div className="user-reviews__review-rating-group">
                          <img 
                            src="https://d2kde5ohu8qb21.cloudfront.net/files/68f66c095d4ae300022a2b0e/starbluesolid.svg" 
                            alt="Rating" 
                            className="user-reviews__review-star"
                          />
                          <span className="user-reviews__review-rating">{Math.floor(Number(review.rating))}</span>
                        </div>
                      </div>
                    </div>
                    <span className="user-reviews__review-date">{review.date}</span>
                  </div>
                </div>

                {review.title && (
                  <h5 className="user-reviews__review-title">{review.title}</h5>
                )}

                {renderMedia(review)}

                <div className="user-reviews__review-content">
                  {expandedReview === review.id ? (
                    <p>{review.content}</p>
                  ) : (
                    <p>{review.content}</p>
                  )}
                </div>

                {/* Review Actions */}
                <div className="user-reviews__review-actions">
                  <button 
                    className={`user-reviews__action-btn user-reviews__reply-btn ${replyingToReview === review.id ? 'user-reviews__reply-btn--active' : ''}`}
                    onClick={() => handleReply(review.id)}
                  >
                    Reply
                  </button>
                  
                  <button 
                    className={`user-reviews__action-btn user-reviews__thumbs-up-btn ${thumbsUpStates[review.id] ? 'user-reviews__thumbs-up-btn--active' : ''}`}
                    onClick={() => handleThumbsUp(review.id)}
                  >
                    <img 
                      src="https://d2kde5ohu8qb21.cloudfront.net/files/69024b627e39a30002ddc45d/thumbsup.svg"
                      alt="Thumbs up"
                      className="user-reviews__thumbs-up-icon"
                      style={{
                        filter: thumbsUpStates[review.id] 
                          ? 'brightness(0) saturate(100%) invert(27%) sepia(51%) saturate(2878%) hue-rotate(346deg) brightness(104%) contrast(97%)' 
                          : 'brightness(0) saturate(100%) invert(60%) sepia(0%) saturate(0%) hue-rotate(93deg) brightness(90%) contrast(86%)'
                      }}
                    />
                    {(review.thumbsUpCount || 0) + (thumbsUpStates[review.id] ? 1 : 0)}
                  </button>
                  
                  <button 
                    className="user-reviews__action-btn user-reviews__share-btn"
                    onClick={() => handleShare(review.id)}
                  >
                    Share
                  </button>
                </div>

                {/* Reply Interface */}
                {replyingToReview === review.id && (
                  <div className="user-reviews__reply-interface">
                    <div className="user-reviews__reply-input-container">
                      <textarea
                        className="user-reviews__reply-input"
                        placeholder="Write a reply..."
                        value={replyText}
                        onChange={(e) => setReplyText(e.target.value)}
                        rows={3}
                      />
                      <div className="user-reviews__reply-actions">
                        <button 
                          className="user-reviews__reply-cancel-btn"
                          onClick={handleReplyCancel}
                        >
                          Cancel
                        </button>
                        <button 
                          className="user-reviews__reply-submit-btn"
                          onClick={() => handleReplySubmit(review.id)}
                          disabled={!replyText.trim()}
                        >
                          Reply
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Replies List */}
                {(replies[review.id] && replies[review.id].length > 0) && (
                  <div className="user-reviews__replies">
                    {replies[review.id].map((reply) => (
                      <div key={reply.id} className="user-reviews__reply">
                        <div className="user-reviews__reply-header">
                          <span className="user-reviews__reply-author">{reply.replierName}</span>
                          <span className="user-reviews__reply-date">{reply.date}</span>
                        </div>
                        <div className="user-reviews__reply-content">
                          {reply.content}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {review.content.length > 200 && (
                  <button
                    className="user-reviews__expand-btn"
                    onClick={() => toggleExpanded(review.id)}
                  >
                    {expandedReview === review.id ? 'Show Less' : 'Read More'}
                  </button>
                )}
              </div>
            ))}
          </div>

          {totalReviews > reviews.length && (
            <button className="user-reviews__read-more-btn">
              Read More Reviews
              <Icon name="keyboard_arrow_down" size={20} />
            </button>
          )}
        </div>
      </div>

      {/* Rating Modal */}
      <RatingModal
        isOpen={isRatingModalOpen}
        onClose={handleCloseRatingModal}
        onRate={handleRatingSubmit}
        vehicleName={vehicleName}
        currentRating={userRating}
        onRateAndReview={onWriteReview ? handleRateAndReview : undefined}
      />
    </div>
  );
};

export default UserReviews;