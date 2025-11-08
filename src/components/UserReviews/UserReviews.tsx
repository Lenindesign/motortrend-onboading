import React, { useState, useEffect } from 'react';
import Icon from '../Icon';
import RatingModal from '../RatingModal';
import WriteReviewModal from '../WriteReviewModal';
import { useRating } from '../../contexts/RatingContext';
import './UserReviews.css';

export interface ReplyData {
  id: string;
  replierName: string;
  content: string;
  date: string;
}

export type VerificationLevel = 'none' | 'owner' | 'verified' | 'verified_documents';
export type VehicleRelationship = 'own' | 'previously_owned' | 'leased' | 'rented' | 'test_drove' | 'passenger';

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
  categoryRatings?: {
    comfort?: number;
    reliability?: number;
    interior?: number;
    value?: number;
    safety?: number;
  };
  verificationLevel?: VerificationLevel;
  vinNumber?: string;
  vehicleRelationship?: VehicleRelationship;
  experienceDuration?: string;
  updatedDate?: string;
}

interface UserReviewsProps {
  vehicleName: string;
  communityRating: number;
  totalReviews: number;
  ratingDistribution: number[];
  vehicleImage?: string;
  reviews: ReviewData[];
  onWriteReview?: () => void;
  onUpdateReview?: (reviewId: string, updatedReview: ReviewData) => void;
}

export const UserReviews: React.FC<UserReviewsProps> = ({ 
  vehicleName,
  communityRating,
  totalReviews,
  ratingDistribution,
  vehicleImage,
  reviews,
  onWriteReview,
  onUpdateReview
}) => {
  const [expandedReview, setExpandedReview] = useState<string | null>(null);
  const [isRatingModalOpen, setIsRatingModalOpen] = useState(false);
  const [isEditReviewModalOpen, setIsEditReviewModalOpen] = useState(false);
  const [editingReview, setEditingReview] = useState<ReviewData | null>(null);
  const [currentUserReview, setCurrentUserReview] = useState<ReviewData | null>(null);
  const [thumbsUpStates, setThumbsUpStates] = useState<Record<string, boolean>>({});
  const [replyingToReview, setReplyingToReview] = useState<string | null>(null);
  const [replyText, setReplyText] = useState<string>('');
  const [replies, setReplies] = useState<Record<string, ReplyData[]>>({});
  const [userAvatar, setUserAvatar] = useState<string | null>(null);
  const [hoveredBarIndex, setHoveredBarIndex] = useState<number | null>(null);
  const [tooltipPosition, setTooltipPosition] = useState<{ top: number; left: number } | null>(null);
  const [sortBy, setSortBy] = useState<'best' | 'latest_owners' | 'verified_owners' | 'all'>('best');
  const [isSortDropdownOpen, setIsSortDropdownOpen] = useState(false);
  const [showAllReviews, setShowAllReviews] = useState(false);
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

  // Find current user's review
  useEffect(() => {
    const foundReview = reviews.find(review => review.reviewerName === 'You');
    setCurrentUserReview(foundReview || null);
  }, [reviews]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('.user-reviews__sort-dropdown-wrapper')) {
        setIsSortDropdownOpen(false);
      }
    };

    if (isSortDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }
  }, [isSortDropdownOpen]);

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
    // If the user has an existing review, open the edit modal
    if (currentUserReview && onUpdateReview) {
      handleEditReview(currentUserReview);
    } else if (onWriteReview) {
      // Otherwise, open the new review modal
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

  const handleEditReview = (review: ReviewData) => {
    setEditingReview(review);
    setIsEditReviewModalOpen(true);
  };

  const handleCloseEditReviewModal = () => {
    setIsEditReviewModalOpen(false);
    setEditingReview(null);
  };

  const handleUpdateReview = (updatedReview: ReviewData) => {
    if (onUpdateReview && editingReview) {
      // Add updated date while preserving original date
      const reviewWithUpdate: ReviewData = {
        ...updatedReview,
        id: editingReview.id, // Keep original ID
        date: editingReview.date, // Keep original date
        updatedDate: new Date().toLocaleDateString('en-US', { 
          year: 'numeric', 
          month: 'long', 
          day: 'numeric' 
        })
      };
      onUpdateReview(editingReview.id, reviewWithUpdate);
    }
    handleCloseEditReviewModal();
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

  const renderCategoryRatings = (review: ReviewData) => {
    if (!review.categoryRatings) {
      return null;
    }

    const categories = [
      { key: 'comfort', label: 'Comfort' },
      { key: 'reliability', label: 'Reliability' },
      { key: 'interior', label: 'Interior' },
      { key: 'value', label: 'Value' },
      { key: 'safety', label: 'Safety' }
    ] as const;

    const categoryRatings = review.categoryRatings;
    const hasAnyRating = categories.some(cat => categoryRatings[cat.key] && categoryRatings[cat.key]! > 0);

    if (!hasAnyRating) {
      return null;
    }

    return (
      <div className="user-reviews__category-ratings">
        {categories.map((category) => {
          const rating = categoryRatings[category.key];
          if (!rating || rating === 0) return null;

          return (
            <div key={category.key} className="user-reviews__category-rating">
              <span className="user-reviews__category-name">{category.label}</span>
              <div className="user-reviews__category-stars">
                {Array.from({ length: 10 }, (_, index) => {
                  const starNumber = index + 1;
                  const isFilled = starNumber <= rating;
                  return (
                    <img
                      key={starNumber}
                      src={
                        isFilled
                          ? "https://d2kde5ohu8qb21.cloudfront.net/files/68f66c095d4ae300022a2b0e/starbluesolid.svg"
                          : "https://d2kde5ohu8qb21.cloudfront.net/files/68f66c095d4ae300022a2b10/starbluenotsolid.svg"
                      }
                      alt={`Star ${starNumber}`}
                      className="user-reviews__category-star"
                    />
                  );
                })}
              </div>
              <span className="user-reviews__category-score">{rating}</span>
            </div>
          );
        })}
      </div>
    );
  };

  const maxRatingCount = Math.max(...ratingDistribution);

  const handleBarMouseEnter = (index: number, event: React.MouseEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    setHoveredBarIndex(index);
    setTooltipPosition({
      top: rect.top - 40,
      left: rect.left + rect.width / 2
    });
  };

  const handleBarMouseLeave = () => {
    setHoveredBarIndex(null);
    setTooltipPosition(null);
  };

  const calculatePercentage = (count: number) => {
    return totalReviews > 0 ? Math.round((count / totalReviews) * 100) : 0;
  };

  // Sort and filter reviews based on selected option
  const getSortedReviews = (): ReviewData[] => {
    let filteredReviews = [...reviews];

    switch (sortBy) {
      case 'latest_owners':
        // Filter to owners only, then sort by date (most recent first)
        filteredReviews = reviews.filter(
          review => review.vehicleRelationship === 'own'
        );
        filteredReviews.sort((a, b) => {
          const dateA = new Date(a.updatedDate || a.date).getTime();
          const dateB = new Date(b.updatedDate || b.date).getTime();
          return dateB - dateA; // Most recent first
        });
        break;

      case 'verified_owners':
        // Filter to verified owners only, then sort by rating (highest first)
        filteredReviews = reviews.filter(
          review => review.verificationLevel === 'verified' || 
                   review.verificationLevel === 'verified_documents'
        );
        filteredReviews.sort((a, b) => {
          // First sort by rating (highest first)
          if (b.rating !== a.rating) {
            return b.rating - a.rating;
          }
          // Then by helpfulness (thumbs up count)
          const thumbsUpA = (a.thumbsUpCount || 0) + (thumbsUpStates[a.id] ? 1 : 0);
          const thumbsUpB = (b.thumbsUpCount || 0) + (thumbsUpStates[b.id] ? 1 : 0);
          return thumbsUpB - thumbsUpA;
        });
        break;

      case 'all':
        // Show all reviews, sort by date (most recent first)
        filteredReviews.sort((a, b) => {
          const dateA = new Date(a.updatedDate || a.date).getTime();
          const dateB = new Date(b.updatedDate || b.date).getTime();
          return dateB - dateA; // Most recent first
        });
        break;

      case 'best':
      default:
        // Sort by rating (highest first), then by helpfulness (thumbs up count)
        filteredReviews.sort((a, b) => {
          // First sort by rating (highest first)
          if (b.rating !== a.rating) {
            return b.rating - a.rating;
          }
          // Then by helpfulness (thumbs up count)
          const thumbsUpA = (a.thumbsUpCount || 0) + (thumbsUpStates[a.id] ? 1 : 0);
          const thumbsUpB = (b.thumbsUpCount || 0) + (thumbsUpStates[b.id] ? 1 : 0);
          return thumbsUpB - thumbsUpA;
        });
        break;
    }

    return filteredReviews;
  };

  const sortedReviews = getSortedReviews();
  
  // Show only first 3 reviews by default, or all if showAllReviews is true
  const displayedReviews = showAllReviews ? sortedReviews : sortedReviews.slice(0, 3);
  const hasMoreReviews = sortedReviews.length > 3;

  const handleSortChange = (option: 'best' | 'latest_owners' | 'verified_owners' | 'all', event?: React.MouseEvent) => {
    if (event) {
      event.stopPropagation();
    }
    setSortBy(option);
    setIsSortDropdownOpen(false);
    setShowAllReviews(false); // Reset to showing only 3 reviews when sort changes
  };

  const getSortLabel = () => {
    switch (sortBy) {
      case 'latest_owners':
        return 'Latest Owners';
      case 'verified_owners':
        return 'Verified Owners';
      case 'all':
        return 'All';
      case 'best':
      default:
        return 'Best';
    }
  };

  return (
    <div className="user-reviews">
      {/* Main Header */}
      <div className="user-reviews__header">
        <h2 className="user-reviews__title">
          User Reviews
          <div className="user-reviews__info-icon-wrapper">
            <Icon name="info" size={16} className="user-reviews__info-icon" />
            <div className="user-reviews__info-tooltip">
              User reviews are independent opinions and do not reflect MotorTrend's official views.
            </div>
          </div>
        </h2>
      </div>

      <div className="user-reviews__content">
        {/* Vehicle Name and Write Review Button */}
        <div className="user-reviews__vehicle-header">
          <h3 className="user-reviews__vehicle-name">
            {vehicleName}
          </h3>
          {onWriteReview && (
            <button 
              className="user-reviews__write-review-btn"
              onClick={() => {
                if (currentUserReview && onUpdateReview) {
                  handleEditReview(currentUserReview);
                } else if (onWriteReview) {
                  onWriteReview();
                }
              }}
            >
              <Icon name={currentUserReview ? "edit_note" : "add"} size={20} />
              {currentUserReview ? 'Edit Your Review' : 'Write a Vehicle Review'}
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
                  <div className="user-reviews__rating-score">
                    {communityRating % 1 === 0 ? communityRating : communityRating.toFixed(1)}
                  </div>
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
                {userRating > 0 ? `Your Rating: ${userRating}` : 'Add Your Rating'}
              </button>
            </div>
          </div>

          {/* Rating Distribution Chart */}
          <div className="user-reviews__distribution">
            <div className="user-reviews__distribution-chart">
              {ratingDistribution.map((count, index) => (
                <div 
                  key={index} 
                  className="user-reviews__distribution-bar"
                  onMouseEnter={(e) => handleBarMouseEnter(index, e)}
                  onMouseLeave={handleBarMouseLeave}
                >
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
                  {hoveredBarIndex === index && tooltipPosition && (
                    <div 
                      className="user-reviews__bar-tooltip"
                      style={{
                        top: tooltipPosition.top,
                        left: tooltipPosition.left
                      }}
                    >
                      {calculatePercentage(count)}%
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Reviews Section */}
        <div className="user-reviews__recent-section">
          <div className="user-reviews__recent-header">
            <h4 className="user-reviews__recent-title">Recent User Reviews</h4>
            <div className="user-reviews__recent-header-right">
              <span className="user-reviews__recent-count">{sortedReviews.length} Review{sortedReviews.length !== 1 ? 's' : ''}</span>
              <div className="user-reviews__sort-dropdown-wrapper">
                <label className="user-reviews__sort-label">Sort By</label>
                <div 
                  className="user-reviews__sort-dropdown"
                  onClick={() => setIsSortDropdownOpen(!isSortDropdownOpen)}
                >
                  <span className="user-reviews__sort-selected">{getSortLabel()}</span>
                  <Icon 
                    name="keyboard_arrow_down" 
                    size={20} 
                    className={`user-reviews__sort-chevron ${isSortDropdownOpen ? 'user-reviews__sort-chevron--open' : ''}`}
                  />
                  {isSortDropdownOpen && (
                    <div className="user-reviews__sort-dropdown-menu">
                      <button
                        className={`user-reviews__sort-option ${sortBy === 'best' ? 'user-reviews__sort-option--active' : ''}`}
                        onClick={(e) => handleSortChange('best', e)}
                      >
                        Best
                      </button>
                      <button
                        className={`user-reviews__sort-option ${sortBy === 'latest_owners' ? 'user-reviews__sort-option--active' : ''}`}
                        onClick={(e) => handleSortChange('latest_owners', e)}
                      >
                        Latest Owners
                      </button>
                      <button
                        className={`user-reviews__sort-option ${sortBy === 'verified_owners' ? 'user-reviews__sort-option--active' : ''}`}
                        onClick={(e) => handleSortChange('verified_owners', e)}
                      >
                        Verified Owners
                      </button>
                      <button
                        className={`user-reviews__sort-option ${sortBy === 'all' ? 'user-reviews__sort-option--active' : ''}`}
                        onClick={(e) => handleSortChange('all', e)}
                      >
                        All
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="user-reviews__reviews-list">
            {displayedReviews.map((review) => (
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
                      <div className="user-reviews__reviewer-name-group">
                        <span className="user-reviews__reviewer-name">{review.reviewerName}</span>
                        {review.verificationLevel === 'owner' && (
                          <span className="user-reviews__verified-badge user-reviews__verified-badge--owner">
                            <img 
                              src="https://d2kde5ohu8qb21.cloudfront.net/files/6906c53042d6f10002aac71a/garage.svg" 
                              alt="Owner" 
                              className="user-reviews__verified-icon"
                            />
                            Owner
                          </span>
                        )}
                        {review.verificationLevel === 'verified' && (
                          <span className="user-reviews__verified-badge user-reviews__verified-badge--verified">
                            <img 
                              src="https://d2kde5ohu8qb21.cloudfront.net/files/6906c53142d6f10002aac71b/garage-check.svg" 
                              alt="Verified Owner" 
                              className="user-reviews__verified-icon"
                            />
                            Verified Owner
                          </span>
                        )}
                        {review.verificationLevel === 'verified_documents' && (
                          <span className="user-reviews__verified-badge user-reviews__verified-badge--documents">
                            <img 
                              src="https://d2kde5ohu8qb21.cloudfront.net/files/6906c53142d6f10002aac71b/garage-check.svg" 
                              alt="Documents Verified" 
                              className="user-reviews__verified-icon"
                            />
                            Verified Owner — Documents Verified
                          </span>
                        )}
                      </div>
                      <div className="user-reviews__review-rating-row">
                        <div className="user-reviews__review-rating-group">
                          <img 
                            src="https://d2kde5ohu8qb21.cloudfront.net/files/68f66c095d4ae300022a2b0e/starbluesolid.svg" 
                            alt="Rating" 
                            className="user-reviews__review-star"
                          />
                          <span className="user-reviews__review-rating">
                            {review.rating % 1 === 0 ? review.rating : review.rating.toFixed(1)}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="user-reviews__reviewer-meta">
                      <div className="user-reviews__review-dates">
                        <span className="user-reviews__review-date">{review.date}</span>
                        {review.updatedDate && (
                          <span className="user-reviews__review-updated">Updated {review.updatedDate}</span>
                        )}
                      </div>
                      {(review.vehicleRelationship || review.experienceDuration) && (
                        <span className="user-reviews__reviewer-experience">
                          {review.vehicleRelationship && (
                            <span className="user-reviews__relationship-badge">
                              {review.vehicleRelationship === 'own' && (
                                <>
                                  <img 
                                    src="https://d2kde5ohu8qb21.cloudfront.net/files/6906c53042d6f10002aac71a/garage.svg" 
                                    alt="Current Owner" 
                                    className="user-reviews__relationship-icon"
                                  />
                                  Current Owner
                                </>
                              )}
                              {review.vehicleRelationship === 'previously_owned' && 'Previous Owner'}
                              {review.vehicleRelationship === 'leased' && 'Leased'}
                              {review.vehicleRelationship === 'rented' && 'Rented'}
                              {review.vehicleRelationship === 'test_drove' && 'Test Drove'}
                              {review.vehicleRelationship === 'passenger' && 'Passenger'}
                            </span>
                          )}
                          {review.experienceDuration && (
                            <span className="user-reviews__duration-info">
                              {review.vehicleRelationship === 'own' ? 'Owned for' : 
                               review.vehicleRelationship === 'previously_owned' ? 'Owned for' :
                               review.vehicleRelationship === 'leased' ? 'Leased for' :
                               review.vehicleRelationship === 'rented' ? 'Rented for' : 
                               review.vehicleRelationship === 'test_drove' ? 'Test drove' :
                               'Experienced for'} {review.experienceDuration}
                            </span>
                          )}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {review.title && (
                  <h5 className="user-reviews__review-title">{review.title}</h5>
                )}

                {renderMedia(review)}

                <div className="user-reviews__review-content">
                  {(() => {
                    const content = review.content.trim();
                    
                    // First, split by double line breaks (paragraph breaks)
                    let paragraphs = content
                      .split(/\n\s*\n|\r\n\s*\r\n/)
                      .map(p => p.trim())
                      .filter(p => p.length > 0);
                    
                    // If no double breaks, try single line breaks
                    if (paragraphs.length <= 1) {
                      paragraphs = content
                        .split(/\n|\r\n/)
                        .map(p => p.trim())
                        .filter(p => p.length > 0);
                    }
                    
                    // If still only one paragraph, use it as-is
                    return paragraphs.map((paragraph, index) => (
                      <p key={index}>{paragraph}</p>
                    ));
                  })()}
                </div>

                {/* Category Ratings */}
                {renderCategoryRatings(review)}

                {/* Review Actions */}
                <div className="user-reviews__review-actions">
                  {review.reviewerName === 'You' && onUpdateReview && (
                    <button 
                      className="user-reviews__action-btn user-reviews__edit-btn"
                      onClick={() => handleEditReview(review)}
                    >
                      Edit
                    </button>
                  )}
                  
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

          {hasMoreReviews && !showAllReviews && (
            <button 
              className="user-reviews__read-more-btn"
              onClick={() => setShowAllReviews(true)}
            >
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
        onRateAndReview={handleRateAndReview}
      />

      {/* Edit Review Modal */}
      {isEditReviewModalOpen && editingReview && (
        <WriteReviewModal
          isOpen={isEditReviewModalOpen}
          onClose={handleCloseEditReviewModal}
          vehicleName={vehicleName}
          vehicleImage={vehicleImage}
          onSubmit={handleUpdateReview}
          existingReview={editingReview}
          isEditMode={true}
        />
      )}
    </div>
  );
};

export default UserReviews;