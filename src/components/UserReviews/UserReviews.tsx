/**
 * User Reviews Component - Migrated to inline React styles
 */

import React, { useState, useEffect } from 'react';
import Icon from '../Icon';
import RatingModal from '../RatingModal';
import WriteReviewModal from '../WriteReviewModal';
import { Badge } from '../atoms/Badge/Badge';
import { useRating } from '../../contexts/RatingContext';

export interface ReplyData {
  id: string;
  replierName: string;
  content: string;
  date: string;
}

export interface CommentData {
  id: string;
  commenterName: string;
  content: string;
  date: string;
  likes?: number;
  isLiked?: boolean;
  replies?: ReplyData[];
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
    driverExperience?: number;
    reliability?: number;
    budgetFriendly?: number;
    manufacturerWarranty?: number;
    comfort?: number;
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
  defaultTab?: 'reviews' | 'comments';
  activeTab?: 'reviews' | 'comments';
}

export const UserReviews: React.FC<UserReviewsProps> = ({ 
  vehicleName,
  communityRating,
  totalReviews,
  ratingDistribution,
  vehicleImage,
  reviews,
  onWriteReview,
  onUpdateReview,
  defaultTab = 'reviews',
  activeTab: controlledActiveTab
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
  const [internalActiveTab, setInternalActiveTab] = useState<'reviews' | 'comments'>(defaultTab);
  const [comments, setComments] = useState<CommentData[]>([]);
  const [commentText, setCommentText] = useState<string>('');
  const [commentSortBy, setCommentSortBy] = useState<'newest' | 'oldest' | 'most_liked'>('newest');
  const [commentLikes, setCommentLikes] = useState<Record<string, boolean>>({});
  const { getUserRating, setUserRating } = useRating();
  const userRating = getUserRating(vehicleName);
  
  // Responsive and hover states
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [isWriteReviewHovered, setIsWriteReviewHovered] = useState(false);
  const [hoveredTab, setHoveredTab] = useState<string | null>(null);
  const [isAddRateHovered, setIsAddRateHovered] = useState(false);
  const [hoveredSortOption, setHoveredSortOption] = useState<string | null>(null);
  const [isSortDropdownHovered, setIsSortDropdownHovered] = useState(false);
  const [isReadMoreHovered, setIsReadMoreHovered] = useState(false);
  const [hoveredActionBtn, setHoveredActionBtn] = useState<string | null>(null);
  const [isReplyCancelHovered, setIsReplyCancelHovered] = useState(false);
  const [isReplySubmitHovered, setIsReplySubmitHovered] = useState(false);
  const [isCommentSubmitHovered, setIsCommentSubmitHovered] = useState(false);
  const [isInfoHovered, setIsInfoHovered] = useState(false);

  // Inject fadeIn animation
  useEffect(() => {
    const styleId = 'user-reviews-styles';
    if (!document.getElementById(styleId)) {
      const style = document.createElement('style');
      style.id = styleId;
      style.textContent = `
        @keyframes userReviewsFadeIn {
          from { opacity: 0; transform: translateY(-8px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `;
      document.head.appendChild(style);
    }
    return () => {
      const existing = document.getElementById(styleId);
      if (existing) existing.remove();
    };
  }, []);

  // Responsive handler
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (controlledActiveTab !== undefined) setInternalActiveTab(controlledActiveTab);
  }, [controlledActiveTab]);
  
  const activeTab = internalActiveTab;
  const setActiveTab = setInternalActiveTab;

  useEffect(() => {
    try {
      const onboardingData = localStorage.getItem('onboardingData');
      if (onboardingData) {
        const data = JSON.parse(onboardingData);
        if (data.avatar) setUserAvatar(data.avatar);
      }
    } catch (error) { console.error('Error loading user avatar:', error); }
  }, []);

  useEffect(() => {
    const foundReview = reviews.find(review => review.reviewerName === 'You');
    setCurrentUserReview(foundReview || null);
  }, [reviews]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('[data-sort-dropdown]')) setIsSortDropdownOpen(false);
    };
    if (isSortDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isSortDropdownOpen]);

  const toggleExpanded = (reviewId: string) => setExpandedReview(expandedReview === reviewId ? null : reviewId);
  const handleOpenRatingModal = () => setIsRatingModalOpen(true);
  const handleCloseRatingModal = () => setIsRatingModalOpen(false);
  const handleRatingSubmit = (rating: number) => { setUserRating(vehicleName, rating); setIsRatingModalOpen(false); };
  const handleRateAndReview = (rating: number) => {
    setUserRating(vehicleName, rating);
    setIsRatingModalOpen(false);
    if (currentUserReview && onUpdateReview) handleEditReview(currentUserReview);
    else if (onWriteReview) onWriteReview();
  };
  const handleThumbsUp = (reviewId: string) => setThumbsUpStates(prev => ({ ...prev, [reviewId]: !prev[reviewId] }));
  const handleReply = (reviewId: string) => { setReplyingToReview(replyingToReview === reviewId ? null : reviewId); setReplyText(''); };
  const handleReplySubmit = (reviewId: string) => {
    if (!replyText.trim()) return;
    const newReply: ReplyData = { id: `reply-${Date.now()}`, replierName: 'You', content: replyText.trim(), date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) };
    setReplies(prev => ({ ...prev, [reviewId]: [...(prev[reviewId] || []), newReply] }));
    setReplyText(''); setReplyingToReview(null);
  };
  const handleReplyCancel = () => { setReplyText(''); setReplyingToReview(null); };
  const handleShare = (reviewId: string) => console.log('Share review:', reviewId);
  const handleEditReview = (review: ReviewData) => { setEditingReview(review); setIsEditReviewModalOpen(true); };
  const handleCloseEditReviewModal = () => { setIsEditReviewModalOpen(false); setEditingReview(null); };
  const handleUpdateReview = (updatedReview: ReviewData) => {
    if (onUpdateReview && editingReview) {
      const reviewWithUpdate: ReviewData = { ...updatedReview, id: editingReview.id, date: editingReview.date, updatedDate: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) };
      onUpdateReview(editingReview.id, reviewWithUpdate);
    }
    handleCloseEditReviewModal();
  };
  const getInitials = (name: string) => name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 1);

  const maxRatingCount = Math.max(...ratingDistribution);
  const handleBarMouseEnter = (index: number, event: React.MouseEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    setHoveredBarIndex(index);
    setTooltipPosition({ top: rect.top - 40, left: rect.left + rect.width / 2 });
  };
  const handleBarMouseLeave = () => { setHoveredBarIndex(null); setTooltipPosition(null); };
  const calculatePercentage = (count: number) => totalReviews > 0 ? Math.round((count / totalReviews) * 100) : 0;

  const getSortedReviews = (): ReviewData[] => {
    let filteredReviews = [...reviews];
    switch (sortBy) {
      case 'latest_owners':
        filteredReviews = reviews.filter(r => r.vehicleRelationship === 'own');
        filteredReviews.sort((a, b) => new Date(b.updatedDate || b.date).getTime() - new Date(a.updatedDate || a.date).getTime());
        break;
      case 'verified_owners':
        filteredReviews = reviews.filter(r => r.verificationLevel === 'verified' || r.verificationLevel === 'verified_documents');
        filteredReviews.sort((a, b) => { if (b.rating !== a.rating) return b.rating - a.rating; return ((b.thumbsUpCount || 0) + (thumbsUpStates[b.id] ? 1 : 0)) - ((a.thumbsUpCount || 0) + (thumbsUpStates[a.id] ? 1 : 0)); });
        break;
      case 'all':
        filteredReviews.sort((a, b) => new Date(b.updatedDate || b.date).getTime() - new Date(a.updatedDate || a.date).getTime());
        break;
      case 'best':
      default:
        filteredReviews.sort((a, b) => { if (b.rating !== a.rating) return b.rating - a.rating; return ((b.thumbsUpCount || 0) + (thumbsUpStates[b.id] ? 1 : 0)) - ((a.thumbsUpCount || 0) + (thumbsUpStates[a.id] ? 1 : 0)); });
        break;
    }
    return filteredReviews;
  };

  const sortedReviews = getSortedReviews();
  const displayedReviews = showAllReviews ? sortedReviews : sortedReviews.slice(0, 3);
  const hasMoreReviews = sortedReviews.length > 3;

  const handleSortChange = (option: 'best' | 'latest_owners' | 'verified_owners' | 'all', event?: React.MouseEvent) => {
    if (event) event.stopPropagation();
    setSortBy(option); setIsSortDropdownOpen(false); setShowAllReviews(false);
  };

  const getSortLabel = () => {
    switch (sortBy) { case 'latest_owners': return 'Latest Owners'; case 'verified_owners': return 'Verified Owners'; case 'all': return 'All'; default: return 'Best'; }
  };

  const getDefaultComments = (name: string): CommentData[] => [
    { id: 'comment_default_1', commenterName: 'one2three', content: `Edgy design makes this the most head-turning ${name} yet. But it's more than just stylish—the ${name} is comfortable and offers many features.`, date: '4 days ago', likes: 30, isLiked: false, replies: [] },
    { id: 'comment_default_2', commenterName: 'Ajm4042', content: `I've been driving the ${name} for a few months now and I'm really impressed with the build quality and feature set for the price point.`, date: '4 days ago', likes: 30, isLiked: false, replies: [] }
  ];

  useEffect(() => {
    try {
      const commentsKey = `comments_contextual_${vehicleName}`;
      const savedCommentsJson = localStorage.getItem(commentsKey);
      if (savedCommentsJson) {
        setComments(JSON.parse(savedCommentsJson));
        const likesKey = `commentLikes_contextual_${vehicleName}`;
        const savedLikesJson = localStorage.getItem(likesKey);
        if (savedLikesJson) setCommentLikes(JSON.parse(savedLikesJson));
      } else {
        const defaultComments = getDefaultComments(vehicleName);
        setComments(defaultComments);
        localStorage.setItem(commentsKey, JSON.stringify(defaultComments));
      }
    } catch (error) {
      setComments(getDefaultComments(vehicleName));
    }
  }, [vehicleName]);

  const handlePostComment = () => {
    if (!commentText.trim()) return;
    try {
      const onboardingData = localStorage.getItem('onboardingData');
      const userName = onboardingData ? JSON.parse(onboardingData).fullName || 'You' : 'You';
      const newComment: CommentData = { id: `comment_${Date.now()}`, commenterName: userName, content: commentText.trim(), date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }), likes: 0, isLiked: false, replies: [] };
      const updatedComments = [newComment, ...comments];
      setComments(updatedComments); setCommentText('');
      localStorage.setItem(`comments_contextual_${vehicleName}`, JSON.stringify(updatedComments));
    } catch (error) { console.error('Error posting comment:', error); }
  };

  const handleCommentLike = (commentId: string) => {
    const isLiked = commentLikes[commentId] || false;
    const newLikes = { ...commentLikes, [commentId]: !isLiked };
    setCommentLikes(newLikes);
    const updatedComments = comments.map(c => c.id === commentId ? { ...c, likes: (c.likes || 0) + (isLiked ? -1 : 1) } : c);
    setComments(updatedComments);
    localStorage.setItem(`comments_contextual_${vehicleName}`, JSON.stringify(updatedComments));
    localStorage.setItem(`commentLikes_contextual_${vehicleName}`, JSON.stringify(newLikes));
  };

  const getSortedComments = (): CommentData[] => {
    const sorted = [...comments];
    switch (commentSortBy) {
      case 'oldest': return sorted;
      case 'most_liked': return sorted.sort((a, b) => (b.likes || 0) - (a.likes || 0));
      default: return sorted;
    }
  };

  // ==================== INLINE STYLES ====================

  const containerStyle: React.CSSProperties = {};
  const headerStyle: React.CSSProperties = { marginBottom: 'var(--spacing-3, 24px)' };
  const titleStyle: React.CSSProperties = { fontFamily: 'var(--font-heading, Poppins, sans-serif)', fontWeight: 600, fontSize: 'var(--font-size-xl, 20px)', lineHeight: '1.125em', color: 'var(--color-neutrals-2, #23262F)', margin: 0, display: 'flex', alignItems: 'center', gap: 'var(--spacing-1, 8px)' };
  const infoIconWrapperStyle: React.CSSProperties = { position: 'relative', display: 'inline-flex', alignItems: 'center' };
  const infoTooltipStyle: React.CSSProperties = { position: 'absolute', bottom: '100%', left: '50%', transform: 'translateX(-50%)', background: 'var(--color-neutrals-2, #23262F)', color: 'var(--color-white, #FFFFFF)', padding: 'var(--spacing-1, 8px) var(--spacing-component-md, 12px)', borderRadius: 'var(--border-radius-md, 8px)', fontFamily: 'var(--font-body, Geist, sans-serif)', fontWeight: 400, fontSize: 'var(--font-size-xs, 12px)', lineHeight: 1.4, whiteSpace: 'normal', width: '240px', boxShadow: 'var(--shadow-tooltip, 0 4px 16px rgba(0,0,0,0.15))', marginBottom: 'var(--spacing-1, 8px)', zIndex: 1001, opacity: isInfoHovered ? 1 : 0, visibility: isInfoHovered ? 'visible' : 'hidden', transition: 'opacity 0.2s ease, visibility 0.2s ease', pointerEvents: 'none' };
  const contentStyle: React.CSSProperties = { backgroundColor: 'var(--color-neutrals-7, #F4F5F6)', borderRadius: 'var(--border-radius-md, 8px)', padding: 'var(--spacing-3, 24px)' };
  const tabsStyle: React.CSSProperties = { display: 'flex', gap: 0, marginBottom: 'var(--spacing-3, 24px)', borderBottom: '1px solid var(--color-neutrals-6, #E6E8EC)' };
  const getTabStyle = (isActive: boolean, tabName: string): React.CSSProperties => ({ padding: 'var(--spacing-component-md, 12px) var(--spacing-3, 24px)', background: 'none', border: 'none', borderBottom: `2px solid ${isActive ? 'var(--color-primary-1, #E90C17)' : 'transparent'}`, fontFamily: 'var(--font-heading, Poppins, sans-serif)', fontWeight: 600, fontSize: 'var(--font-size-base, 16px)', color: isActive ? 'var(--color-neutrals-2, #23262F)' : (hoveredTab === tabName ? 'var(--color-neutrals-2, #23262F)' : 'var(--color-neutrals-3, #353945)'), cursor: 'pointer', transition: 'all var(--transition-fast, 150ms ease-in-out)' });
  const vehicleHeaderStyle: React.CSSProperties = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--spacing-2, 16px)', flexWrap: 'wrap', gap: 'var(--spacing-2, 16px)', flexDirection: isMobile ? 'column' : 'row' };
  const vehicleNameStyle: React.CSSProperties = { fontFamily: 'var(--font-heading, Poppins, sans-serif)', fontWeight: 600, fontSize: 'var(--font-size-lg, 18px)', lineHeight: '1.167em', color: 'var(--color-neutrals-1, #141416)', margin: 0, alignSelf: isMobile ? 'flex-start' : undefined };
  const writeReviewBtnStyle: React.CSSProperties = { display: 'flex', alignItems: 'center', gap: 'var(--spacing-1, 8px)', padding: 'var(--spacing-component-md, 12px) var(--spacing-3, 24px)', backgroundColor: isWriteReviewHovered ? 'var(--color-neutrals-2, #23262F)' : 'var(--color-neutrals-2-5, #282a30)', color: 'var(--color-white, #FFFFFF)', border: 'none', borderRadius: 'var(--border-radius-md, 8px)', fontFamily: 'var(--font-heading, Poppins, sans-serif)', fontWeight: 600, fontSize: 'var(--font-size-base, 16px)', cursor: 'pointer', transition: 'background-color var(--transition-fast, 150ms ease-in-out)' };
  const ratingSectionStyle: React.CSSProperties = { display: 'flex', gap: 'var(--spacing-3, 24px)', marginBottom: 'var(--spacing-2, 16px)', alignItems: isMobile ? 'center' : 'flex-end', flexDirection: isMobile ? 'column' : 'row' };
  const ratingCardStyle: React.CSSProperties = { display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'space-between', width: isMobile ? '160px' : '189px', height: isMobile ? '160px' : '173px', backgroundColor: 'var(--color-neutrals-2-5, #2c2f38)', borderRadius: 'var(--border-radius-md, 8px)', padding: '20px 12px 12px 12px', gap: 0, position: 'relative' };
  const ratingContentStyle: React.CSSProperties = { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'var(--spacing-2, 16px)', flex: 1, justifyContent: 'center', padding: 0 };
  const starsDisplayStyle: React.CSSProperties = { display: 'flex', alignItems: 'center', gap: 'var(--spacing-gap-xs, 4px)' };
  const starIconStyle: React.CSSProperties = { width: '24px', height: '24px', objectFit: 'contain', flexShrink: 0 };
  const ratingLabelStyle: React.CSSProperties = { display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 'var(--spacing-1, 8px)' };
  const ratingLabelTextStyle: React.CSSProperties = { fontFamily: 'var(--font-heading, Poppins, sans-serif)', fontWeight: 600, fontSize: 'var(--font-size-xs, 12px)', lineHeight: '1.143em', color: 'var(--color-white, #FFFFFF)' };
  const addRateStyle: React.CSSProperties = { display: isMobile ? 'none' : 'flex', alignItems: 'center', gap: '6px', fontFamily: 'var(--font-body, Geist, sans-serif)', fontSize: 'var(--font-size-xs, 12px)', lineHeight: '1.333em', color: 'var(--color-white, #FFFFFF)', padding: 'var(--spacing-gap-xs, 4px) var(--spacing-component-md, 12px)', borderRadius: 'var(--border-radius-sm, 4px)', background: 'none', border: 'none', cursor: 'pointer', transition: 'opacity var(--transition-fast, 150ms ease-in-out)', whiteSpace: 'nowrap', flexShrink: 0, opacity: isAddRateHovered ? 0.8 : 1 };
  const distributionStyle: React.CSSProperties = { flex: 1, display: 'flex', alignItems: 'flex-end', position: 'relative', zIndex: 0 };
  const distributionChartStyle: React.CSSProperties = { display: 'flex', alignItems: 'flex-end', gap: 'var(--spacing-1, 8px)', width: '100%', height: isMobile ? '120px' : '173.31px', paddingLeft: '16px' };
  const distributionBarStyle: React.CSSProperties = { display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1, height: '100%', position: 'relative', justifyContent: 'flex-end', cursor: 'pointer' };
  const barStarStyle: React.CSSProperties = { width: '16px', height: '16px', marginBottom: '6px', objectFit: 'contain' };
  const barFillStyle = (height: number): React.CSSProperties => ({ width: '100%', backgroundColor: 'var(--color-rating-community, #33C4FF)', borderRadius: 'var(--border-radius-sm, 4px)', minHeight: '4px', transition: 'height var(--transition-fast, 150ms ease-in-out)', height: `${height}%` });
  const barLabelStyle: React.CSSProperties = { fontFamily: 'var(--font-heading, Poppins, sans-serif)', fontWeight: 600, fontSize: 'var(--font-size-md, 18px)', lineHeight: '1.556em', color: 'var(--color-neutrals-2, #23262F)', marginTop: '6px' };
  const barTooltipStyle = (pos: { top: number; left: number }): React.CSSProperties => ({ position: 'fixed', backgroundColor: 'var(--color-neutrals-1, #141416)', color: 'var(--color-white, #FFFFFF)', padding: 'var(--spacing-1, 8px) var(--spacing-component-md, 12px)', borderRadius: 'var(--border-radius-md, 8px)', fontFamily: 'var(--font-heading, Poppins, sans-serif)', fontWeight: 600, fontSize: 'var(--font-size-sm, 14px)', whiteSpace: 'nowrap', zIndex: 1000, transform: 'translateX(-50%) translateY(-100%)', marginTop: '-8px', boxShadow: 'var(--shadow-lg, 0 10px 25px rgba(0,0,0,0.1))', pointerEvents: 'none', top: pos.top, left: pos.left });
  const recentSectionStyle: React.CSSProperties = { marginTop: 'var(--spacing-2, 16px)' };
  const recentHeaderStyle: React.CSSProperties = { display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 'var(--spacing-2, 16px)', marginTop: 'var(--spacing-2, 16px)', paddingTop: 'var(--spacing-2, 16px)', marginBottom: 'var(--spacing-2, 16px)', flexDirection: isMobile ? 'column' : 'row' };
  const recentTitleStyle: React.CSSProperties = { fontFamily: 'var(--font-heading, Poppins, sans-serif)', fontWeight: 600, fontSize: 'var(--font-size-lg, 18px)', lineHeight: '1.167em', color: 'var(--color-neutrals-1, #141416)', margin: 0, alignSelf: isMobile ? 'flex-start' : undefined };
  const recentHeaderRightStyle: React.CSSProperties = { display: 'flex', gap: 'var(--spacing-2, 16px)', width: isMobile ? '100%' : undefined, flexDirection: isMobile ? 'column' : 'row', alignItems: isMobile ? 'flex-start' : 'center' };
  const recentCountStyle: React.CSSProperties = { fontFamily: 'var(--font-body, Geist, sans-serif)', fontSize: 'var(--font-size-base, 16px)', lineHeight: '1.333em', color: 'var(--color-neutrals-2, #23262F)' };
  const sortDropdownWrapperStyle: React.CSSProperties = { position: 'relative', display: 'flex', alignItems: 'center', gap: 'var(--spacing-1, 8px)', width: isMobile ? '100%' : undefined };
  const sortLabelStyle: React.CSSProperties = { fontFamily: 'var(--font-body, Geist, sans-serif)', fontSize: 'var(--font-size-base, 16px)', lineHeight: '1.333em', color: 'var(--color-neutrals-2, #23262F)', margin: 0 };
  const sortDropdownStyle: React.CSSProperties = { position: 'relative', display: 'flex', alignItems: 'center', gap: 'var(--spacing-1, 8px)', padding: 'var(--spacing-1, 8px) var(--spacing-component-md, 12px)', backgroundColor: isSortDropdownHovered ? 'var(--color-neutrals-8, #FCFCFD)' : 'var(--color-white, #FFFFFF)', border: `1px solid ${isSortDropdownHovered ? 'var(--color-neutrals-4, #6E7481)' : 'var(--color-neutrals-5, #B1B5C3)'}`, borderRadius: 'var(--border-radius-md, 8px)', cursor: 'pointer', transition: 'all var(--transition-fast, 150ms ease-in-out)', minWidth: '120px', justifyContent: 'space-between', width: isMobile ? '100%' : undefined };
  const sortSelectedStyle: React.CSSProperties = { fontFamily: 'var(--font-body, Geist, sans-serif)', fontSize: 'var(--font-size-sm, 14px)', fontWeight: 500, color: 'var(--color-neutrals-2, #23262F)', flex: 1, textAlign: 'left' };
  const sortChevronStyle: React.CSSProperties = { flexShrink: 0, color: 'var(--color-neutrals-4, #6E7481)', transition: 'transform var(--transition-fast, 150ms ease-in-out)', transform: isSortDropdownOpen ? 'rotate(180deg)' : 'rotate(0deg)' };
  const sortDropdownMenuStyle: React.CSSProperties = { position: 'absolute', top: '100%', right: 0, marginTop: 'var(--spacing-1, 8px)', backgroundColor: 'var(--color-white, #FFFFFF)', border: '1px solid var(--color-neutrals-5, #B1B5C3)', borderRadius: 'var(--border-radius-md, 8px)', boxShadow: 'var(--shadow-lg, 0 10px 25px rgba(0,0,0,0.1))', zIndex: 1000, minWidth: '160px', overflow: 'hidden', animation: 'userReviewsFadeIn 0.2s ease-in-out', width: isMobile ? '100%' : undefined };
  const getSortOptionStyle = (option: string, isActive: boolean): React.CSSProperties => ({ width: '100%', padding: '10px var(--spacing-2, 16px)', background: isActive ? 'var(--color-primary-50, #FFF0F0)' : (hoveredSortOption === option ? 'var(--color-neutrals-8, #FCFCFD)' : 'none'), border: 'none', textAlign: 'left', fontFamily: 'var(--font-body, Geist, sans-serif)', fontSize: 'var(--font-size-sm, 14px)', fontWeight: isActive ? 600 : 400, color: isActive ? 'var(--color-primary-500, #E90C17)' : 'var(--color-neutrals-2, #23262F)', cursor: 'pointer', transition: 'background-color var(--transition-fast, 150ms ease-in-out)', display: 'block' });
  const reviewsListStyle: React.CSSProperties = { display: 'flex', flexDirection: 'column', gap: 0 };
  const getReviewCardStyle = (index: number): React.CSSProperties => ({ backgroundColor: 'var(--color-white, #FFFFFF)', borderRadius: 'var(--border-radius-md, 8px)', padding: index < 3 ? '42px' : 'var(--spacing-2, 16px)', marginBottom: index === 0 ? 'var(--spacing-2, 16px)' : 0 });
  const reviewHeaderStyle: React.CSSProperties = { display: 'flex', alignItems: 'center', gap: 'var(--spacing-1, 8px)', marginBottom: 'var(--spacing-2, 16px)' };
  const reviewerAvatarStyle: React.CSSProperties = { width: '43px', height: '43px', borderRadius: 'var(--border-radius-circle, 400px)', backgroundColor: 'var(--color-primary-2, #c70a15)', color: 'var(--color-white, #FFFFFF)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-body, Geist, sans-serif)', fontWeight: 400, fontSize: '31.29px', lineHeight: '1.167em', flexShrink: 0, overflow: 'hidden' };
  const reviewerInfoStyle: React.CSSProperties = { display: 'flex', flexDirection: 'column', gap: '-1px', flex: 1 };
  const reviewerNameRowStyle: React.CSSProperties = { display: 'flex', alignItems: 'center', gap: 'var(--spacing-2, 16px)', justifyContent: 'space-between' };
  const reviewerNameGroupStyle: React.CSSProperties = { display: 'flex', alignItems: 'center', gap: 'var(--spacing-1, 8px)', flexWrap: 'wrap' };
  const reviewerNameStyle: React.CSSProperties = { fontFamily: 'var(--font-heading, Poppins, sans-serif)', fontWeight: 600, fontSize: 'var(--font-size-base, 16px)', lineHeight: '1.375em', color: 'var(--color-neutrals-1, #141416)' };
  const reviewRatingRowStyle: React.CSSProperties = { display: 'flex', alignItems: 'center', gap: 'var(--spacing-1, 8px)' };
  const reviewRatingGroupStyle: React.CSSProperties = { display: 'flex', alignItems: 'center', gap: 'var(--spacing-gap-xs, 4px)' };
  const reviewStarStyle: React.CSSProperties = { width: '24px', height: '24px', objectFit: 'contain' };
  const reviewRatingStyle: React.CSSProperties = { fontFamily: 'var(--font-heading, Poppins, sans-serif)', fontWeight: 600, fontSize: 'var(--font-size-lg, 18px)', lineHeight: '1.375em', color: 'var(--color-neutrals-1, #141416)' };
  const reviewerMetaStyle: React.CSSProperties = { display: 'flex', alignItems: 'center', gap: 'var(--spacing-component-md, 12px)', flexWrap: 'wrap', marginTop: '4px' };
  const reviewDatesStyle: React.CSSProperties = { display: 'flex', alignItems: 'center', gap: 'var(--spacing-1, 8px)', flexWrap: 'wrap' };
  const reviewDateStyle: React.CSSProperties = { fontFamily: 'var(--font-body, Geist, sans-serif)', fontSize: 'var(--font-size-xs, 12px)', lineHeight: '1.5em', color: 'var(--color-neutrals-4, #6E7481)' };
  const reviewUpdatedStyle: React.CSSProperties = { fontFamily: 'var(--font-body, Geist, sans-serif)', fontSize: '11px', lineHeight: '1.5em', color: 'var(--color-neutrals-4, #6E7481)', fontStyle: 'italic' };
  // HIDDEN: reviewerExperienceStyle and durationInfoStyle - commented out with vehicle relationship badges
  // const reviewerExperienceStyle: React.CSSProperties = { display: 'flex', alignItems: 'center', gap: 'var(--spacing-1, 8px)', flexWrap: 'wrap' };
  // const durationInfoStyle: React.CSSProperties = { fontFamily: 'var(--font-body, Geist, sans-serif)', fontWeight: 400, fontSize: 'var(--font-size-xs, 12px)', lineHeight: '1.5em', color: 'var(--color-neutrals-3, #353945)' };
  const reviewTitleStyle: React.CSSProperties = { fontFamily: 'var(--font-heading, Poppins, sans-serif)', fontWeight: 600, fontSize: 'var(--font-size-md, 18px)', lineHeight: '1.333em', color: 'var(--color-neutrals-1, #141416)', marginBottom: 'var(--spacing-component-md, 12px)' };
  const reviewContentStyle: React.CSSProperties = { fontFamily: 'var(--font-body, Geist, sans-serif)', fontSize: 'var(--font-size-base, 16px)', lineHeight: '1.6em', color: 'var(--color-neutrals-2, #23262F)', marginBottom: 'var(--spacing-2, 16px)' };
  const categoryRatingsStyle: React.CSSProperties = { display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', columnGap: '48px', rowGap: '12px', marginTop: 'var(--spacing-2, 16px)', marginBottom: 'var(--spacing-2, 16px)', paddingTop: 'var(--spacing-2, 16px)', borderTop: '1px solid var(--color-neutrals-6, #E6E8EC)', minWidth: 0 };
  const categoryRatingStyle: React.CSSProperties = { display: 'flex', alignItems: 'center', gap: 'var(--spacing-component-md, 12px)', minWidth: 0, overflow: 'hidden' };
  const categoryNameStyle: React.CSSProperties = { fontFamily: 'var(--font-body, Geist, sans-serif)', fontWeight: 400, fontSize: 'var(--font-size-xs, 12px)', lineHeight: '1.375em', color: 'var(--color-neutrals-1, #141416)', minWidth: 0, flexShrink: 1 };
  const categoryStarsStyle: React.CSSProperties = { display: 'flex', alignItems: 'center', gap: '2px', flex: 1, justifyContent: 'end' };
  const categoryStarStyle: React.CSSProperties = { width: '16px', height: '16px', objectFit: 'contain' };
  const categoryScoreStyle: React.CSSProperties = { fontFamily: 'var(--font-heading, Poppins, sans-serif)', fontWeight: 600, fontSize: 'var(--font-size-base, 16px)', lineHeight: '1.375em', color: 'var(--color-neutrals-1, #141416)', minWidth: '24px', textAlign: 'right' };
  const reviewActionsStyle: React.CSSProperties = { display: 'flex', alignItems: 'center', gap: isMobile ? 'var(--spacing-component-md, 12px)' : 'var(--spacing-2, 16px)', marginBottom: 0, paddingTop: 'var(--spacing-component-md, 12px)', borderTop: '1px solid var(--color-neutrals-6, #E6E8EC)', flexWrap: isMobile ? 'wrap' : 'nowrap' };
  const getActionBtnStyle = (btnId: string, isActive: boolean = false, isEdit: boolean = false): React.CSSProperties => ({ display: 'flex', alignItems: 'center', gap: '6px', background: isActive ? 'var(--color-primary-50, #FFF0F0)' : (hoveredActionBtn === btnId ? 'var(--color-neutrals-7, #F4F5F6)' : 'none'), border: 'none', padding: isMobile ? '6px 10px' : 'var(--spacing-1, 8px) var(--spacing-component-md, 12px)', borderRadius: 'var(--border-radius-md, 8px)', fontFamily: 'var(--font-body, Geist, sans-serif)', fontSize: isMobile ? '13px' : 'var(--font-size-sm, 14px)', fontWeight: 500, color: isActive ? 'var(--color-primary-500, #E90C17)' : (isEdit ? 'var(--color-primary-500, #E90C17)' : (hoveredActionBtn === btnId ? 'var(--color-neutrals-2, #23262F)' : 'var(--color-neutrals-3, #353945)')), cursor: 'pointer', transition: 'all var(--transition-fast, 150ms ease-in-out)', textDecoration: 'none' });
  const thumbsUpIconStyle = (isActive: boolean): React.CSSProperties => ({ width: '24px', height: '24px', flexShrink: 0, objectFit: 'contain', transition: 'filter var(--transition-fast, 150ms ease-in-out)', filter: isActive ? 'brightness(0) saturate(100%) invert(27%) sepia(51%) saturate(2878%) hue-rotate(346deg) brightness(104%) contrast(97%)' : 'brightness(0) saturate(100%) invert(60%) sepia(0%) saturate(0%) hue-rotate(93deg) brightness(90%) contrast(86%)' });
  const replyInterfaceStyle: React.CSSProperties = { marginTop: isMobile ? '12px' : 'var(--spacing-2, 16px)', padding: isMobile ? 'var(--spacing-component-md, 12px)' : 'var(--spacing-2, 16px)', backgroundColor: 'var(--color-neutrals-8, #FCFCFD)', borderRadius: 'var(--border-radius-md, 8px)', border: '1px solid var(--color-neutrals-6, #E6E8EC)' };
  const replyInputContainerStyle: React.CSSProperties = { display: 'flex', flexDirection: 'column', gap: 'var(--spacing-component-md, 12px)' };
  const replyInputStyle: React.CSSProperties = { width: '100%', padding: 'var(--spacing-component-md, 12px) var(--spacing-2, 16px)', backgroundColor: 'var(--color-white, #FFFFFF)', border: '1px solid var(--color-neutrals-5, #B1B5C3)', borderRadius: 'var(--border-radius-md, 8px)', fontFamily: 'var(--font-body, Geist, sans-serif)', fontSize: isMobile ? '13px' : 'var(--font-size-sm, 14px)', lineHeight: '1.5em', color: 'var(--color-neutrals-2, #23262F)', resize: 'vertical', minHeight: isMobile ? '70px' : '80px', outline: 'none', transition: 'border-color var(--transition-fast, 150ms ease-in-out)' };
  const replyActionsStyle: React.CSSProperties = { display: 'flex', justifyContent: 'flex-end', gap: isMobile ? 'var(--spacing-1, 8px)' : 'var(--spacing-component-md, 12px)' };
  const replyCancelBtnStyle: React.CSSProperties = { padding: isMobile ? 'var(--spacing-gap-xs, 4px) var(--spacing-component-md, 12px)' : 'var(--spacing-1, 8px) var(--spacing-2, 16px)', backgroundColor: isReplyCancelHovered ? 'var(--color-neutrals-7, #F4F5F6)' : 'transparent', border: '1px solid var(--color-neutrals-5, #B1B5C3)', borderRadius: 'var(--border-radius-md, 8px)', fontFamily: 'var(--font-body, Geist, sans-serif)', fontSize: isMobile ? '13px' : 'var(--font-size-sm, 14px)', fontWeight: 500, color: isReplyCancelHovered ? 'var(--color-neutrals-2, #23262F)' : 'var(--color-neutrals-3, #353945)', cursor: 'pointer', transition: 'all var(--transition-fast, 150ms ease-in-out)' };
  const replySubmitBtnStyle = (disabled: boolean): React.CSSProperties => ({ padding: isMobile ? 'var(--spacing-gap-xs, 4px) var(--spacing-component-md, 12px)' : 'var(--spacing-1, 8px) var(--spacing-2, 16px)', backgroundColor: disabled ? 'var(--color-neutrals-5, #B1B5C3)' : (isReplySubmitHovered ? 'var(--color-primary-600, #c70a15)' : 'var(--color-neutrals-1, #141416)'), border: 'none', borderRadius: 'var(--border-radius-md, 8px)', fontFamily: 'var(--font-body, Geist, sans-serif)', fontSize: isMobile ? '13px' : 'var(--font-size-sm, 14px)', fontWeight: 500, color: disabled ? 'var(--color-neutrals-3, #353945)' : 'var(--color-white, #FFFFFF)', cursor: disabled ? 'not-allowed' : 'pointer', transition: 'background-color var(--transition-fast, 150ms ease-in-out)' });
  const repliesStyle: React.CSSProperties = { marginTop: 'var(--spacing-2, 16px)', paddingLeft: isMobile ? '12px' : '16px', borderLeft: '2px solid var(--color-neutrals-6, #E6E8EC)' };
  const replyStyle: React.CSSProperties = { marginBottom: 'var(--spacing-2, 16px)', padding: '12px 0' };
  const replyHeaderStyle: React.CSSProperties = { display: 'flex', alignItems: 'center', gap: 'var(--spacing-component-md, 12px)', marginBottom: 'var(--spacing-1, 8px)' };
  const replyAuthorStyle: React.CSSProperties = { fontFamily: 'var(--font-heading, Poppins, sans-serif)', fontWeight: 600, fontSize: isMobile ? '13px' : 'var(--font-size-sm, 14px)', color: 'var(--color-neutrals-2, #23262F)' };
  const replyDateStyle: React.CSSProperties = { fontFamily: 'var(--font-body, Geist, sans-serif)', fontSize: isMobile ? '11px' : 'var(--font-size-xs, 12px)', color: 'var(--color-neutrals-4, #6E7481)' };
  const replyContentStyle: React.CSSProperties = { fontFamily: 'var(--font-body, Geist, sans-serif)', fontSize: isMobile ? '13px' : 'var(--font-size-sm, 14px)', lineHeight: '1.5em', color: 'var(--color-neutrals-3, #353945)' };
  const readMoreBtnStyle: React.CSSProperties = { width: '100%', padding: '8px 24px', backgroundColor: isReadMoreHovered ? 'var(--color-neutrals-7, #F4F5F6)' : 'var(--color-neutrals-8, #FCFCFD)', border: 'none', borderRadius: 'var(--border-radius-sm, 4px)', fontFamily: 'var(--font-heading, Poppins, sans-serif)', fontWeight: 600, fontSize: 'var(--font-size-base, 16px)', color: 'var(--color-neutrals-3, #353945)', cursor: 'pointer', transition: 'all var(--transition-fast, 150ms ease-in-out)', boxShadow: 'var(--shadow-depth-5, 0px 4px 20px 0px rgba(20, 20, 22, 0.06))', marginTop: 'var(--spacing-2, 16px)' };
  const expandBtnStyle: React.CSSProperties = { background: 'none', border: 'none', color: 'var(--color-primary-500, #E90C17)', fontFamily: 'var(--font-body, Geist, sans-serif)', fontSize: 'var(--font-size-sm, 14px)', fontWeight: 500, cursor: 'pointer', padding: 0, marginTop: 'var(--spacing-1, 8px)', transition: 'color var(--transition-fast, 150ms ease-in-out)' };
  const mediaStyle: React.CSSProperties = { display: 'flex', flexDirection: 'column', gap: 'var(--spacing-component-md, 12px)', marginBottom: 'var(--spacing-2, 16px)' };
  const mediaItemStyle: React.CSSProperties = { borderRadius: 'var(--border-radius-md, 8px)', overflow: 'hidden', backgroundColor: 'var(--color-neutrals-6, #E6E8EC)' };
  const mediaContentStyle: React.CSSProperties = { width: '100%', height: '100%', display: 'block', objectFit: 'cover', maxHeight: '100%' };
  const commentsSectionStyle: React.CSSProperties = { display: 'flex', flexDirection: 'column', gap: 'var(--spacing-3, 24px)' };
  const commentsHeaderStyle: React.CSSProperties = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 'var(--spacing-2, 16px)' };
  const commentsTitleStyle: React.CSSProperties = { fontFamily: 'var(--font-heading, Poppins, sans-serif)', fontWeight: 600, fontSize: 'var(--font-size-lg, 18px)', lineHeight: '1.167em', color: 'var(--color-neutrals-1, #141416)', margin: 0 };
  const commentsHeaderRightStyle: React.CSSProperties = { display: 'flex', alignItems: 'center', gap: 'var(--spacing-2, 16px)' };
  const commentsCountStyle: React.CSSProperties = { fontFamily: 'var(--font-body, Geist, sans-serif)', fontWeight: 400, fontSize: 'var(--font-size-sm, 14px)', color: 'var(--color-neutrals-3, #353945)' };
  const commentSortDropdownStyle: React.CSSProperties = { display: 'flex', alignItems: 'center', gap: 'var(--spacing-1, 8px)' };
  const commentSortLabelStyle: React.CSSProperties = { fontFamily: 'var(--font-body, Geist, sans-serif)', fontWeight: 400, fontSize: 'var(--font-size-sm, 14px)', color: 'var(--color-neutrals-3, #353945)' };
  const commentSortSelectStyle: React.CSSProperties = { padding: 'var(--spacing-gap-xs, 4px) var(--spacing-component-md, 12px)', border: '1px solid var(--color-neutrals-6, #E6E8EC)', borderRadius: 'var(--border-radius-md, 8px)', fontFamily: 'var(--font-body, Geist, sans-serif)', fontSize: 'var(--font-size-sm, 14px)', color: 'var(--color-neutrals-2, #23262F)', backgroundColor: 'var(--color-neutrals-8, #FCFCFD)', cursor: 'pointer' };
  const commentInputSectionStyle: React.CSSProperties = { display: 'flex', flexDirection: 'column', gap: 'var(--spacing-component-md, 12px)' };
  const commentInputStyle: React.CSSProperties = { width: '100%', padding: 'var(--spacing-component-md, 12px)', border: '1px solid var(--color-neutrals-6, #E6E8EC)', borderRadius: 'var(--border-radius-md, 8px)', fontFamily: 'var(--font-body, Geist, sans-serif)', fontSize: 'var(--font-size-sm, 14px)', color: 'var(--color-neutrals-2, #23262F)', backgroundColor: 'var(--color-neutrals-8, #FCFCFD)', resize: 'vertical', minHeight: '80px', outline: 'none' };
  const commentSubmitBtnStyle = (disabled: boolean): React.CSSProperties => ({ alignSelf: 'flex-start', padding: '10px var(--spacing-3, 24px)', backgroundColor: 'var(--color-neutrals-2, #23262F)', color: 'var(--color-white, #FFFFFF)', border: 'none', borderRadius: 'var(--border-radius-md, 8px)', fontFamily: 'var(--font-heading, Poppins, sans-serif)', fontWeight: 600, fontSize: 'var(--font-size-sm, 14px)', cursor: disabled ? 'not-allowed' : 'pointer', transition: 'all var(--transition-fast, 150ms ease-in-out)', opacity: disabled ? 0.5 : (isCommentSubmitHovered ? 0.9 : 1) });
  const commentsListStyle: React.CSSProperties = { display: 'flex', flexDirection: 'column', gap: 'var(--spacing-2, 16px)' };
  const noCommentsStyle: React.CSSProperties = { padding: 'var(--spacing-3, 24px)', textAlign: 'center', color: 'var(--color-neutrals-3, #353945)', fontFamily: 'var(--font-body, Geist, sans-serif)', fontSize: 'var(--font-size-sm, 14px)' };
  const commentCardStyle: React.CSSProperties = { padding: 'var(--spacing-2, 16px)', backgroundColor: 'var(--color-neutrals-8, #FCFCFD)', border: '1px solid var(--color-neutrals-6, #E6E8EC)', borderRadius: 'var(--border-radius-md, 8px)', display: 'flex', flexDirection: 'column', gap: 'var(--spacing-component-md, 12px)' };
  const commentHeaderStyle: React.CSSProperties = { display: 'flex', alignItems: 'center', gap: 'var(--spacing-component-md, 12px)' };
  const commenterAvatarStyle: React.CSSProperties = { width: '40px', height: '40px', borderRadius: 'var(--border-radius-circle, 400px)', overflow: 'hidden', flexShrink: 0, backgroundColor: 'var(--color-neutrals-6, #E6E8EC)', display: 'flex', alignItems: 'center', justifyContent: 'center' };
  const commenterAvatarPlaceholderStyle: React.CSSProperties = { width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-heading, Poppins, sans-serif)', fontWeight: 600, fontSize: 'var(--font-size-base, 16px)', color: 'var(--color-neutrals-3, #353945)' };
  const commenterInfoStyle: React.CSSProperties = { display: 'flex', flexDirection: 'column', gap: 'var(--spacing-gap-xs, 4px)' };
  const commenterNameStyle: React.CSSProperties = { fontFamily: 'var(--font-heading, Poppins, sans-serif)', fontWeight: 600, fontSize: 'var(--font-size-sm, 14px)', color: 'var(--color-neutrals-2, #23262F)' };
  const commentDateStyle: React.CSSProperties = { fontFamily: 'var(--font-body, Geist, sans-serif)', fontWeight: 400, fontSize: 'var(--font-size-xs, 12px)', color: 'var(--color-neutrals-3, #353945)' };
  const commentContentStyle: React.CSSProperties = { fontFamily: 'var(--font-body, Geist, sans-serif)', fontWeight: 400, fontSize: 'var(--font-size-sm, 14px)', lineHeight: '1.5em', color: 'var(--color-neutrals-2, #23262F)', whiteSpace: 'pre-wrap' };
  const commentActionsStyle: React.CSSProperties = { display: 'flex', alignItems: 'center', gap: 'var(--spacing-2, 16px)' };
  const commentActionBtnStyle = (isActive: boolean = false): React.CSSProperties => ({ display: 'flex', alignItems: 'center', gap: '6px', padding: 'var(--spacing-gap-xs, 4px) var(--spacing-component-md, 12px)', background: 'none', border: 'none', fontFamily: 'var(--font-body, Geist, sans-serif)', fontWeight: 400, fontSize: 'var(--font-size-sm, 14px)', color: isActive ? 'var(--color-primary-1, #E90C17)' : 'var(--color-neutrals-3, #353945)', cursor: 'pointer', transition: 'all var(--transition-fast, 150ms ease-in-out)' });
  const commentLikeIconStyle = (isActive: boolean): React.CSSProperties => ({ width: '16px', height: '16px', filter: isActive ? 'brightness(0) saturate(100%) invert(27%) sepia(51%) saturate(2878%) hue-rotate(346deg) brightness(104%) contrast(97%)' : 'brightness(0) saturate(100%) invert(60%) sepia(0%) saturate(0%) hue-rotate(93deg) brightness(90%) contrast(86%)' });

  const renderMedia = (review: ReviewData) => {
    if (!review.mediaPreviews || review.mediaPreviews.length === 0) return null;
    return (
      <div style={mediaStyle}>
        {review.mediaPreviews.map((preview, index) => (
          <div key={index} style={mediaItemStyle}>
            {review.mediaFiles?.[index]?.type.startsWith('video/') ? (
              <video src={preview} controls style={mediaContentStyle} />
            ) : (
              <img src={preview} alt={`Review media ${index + 1}`} style={mediaContentStyle} />
            )}
          </div>
        ))}
      </div>
    );
  };

  const renderCategoryRatings = (review: ReviewData) => {
    if (!review.categoryRatings) return null;
    const categories = [
      { key: 'driverExperience', label: 'Driver Experience' },
      { key: 'reliability', label: 'Reliability' },
      { key: 'budgetFriendly', label: 'Budget Friendly' },
      { key: 'manufacturerWarranty', label: 'Manufacturer Warranty' }
    ] as const;
    const categoryRatings = review.categoryRatings;
    const hasAnyRating = categories.some(cat => categoryRatings[cat.key] && categoryRatings[cat.key]! > 0);
    if (!hasAnyRating) return null;
    return (
      <div style={categoryRatingsStyle}>
        {categories.map((category) => {
          const rating = categoryRatings[category.key];
          if (!rating || rating === 0) return null;
          const normalizedRating = rating / 20;
          return (
            <div key={category.key} style={categoryRatingStyle}>
              <span style={categoryNameStyle}>{category.label}</span>
              <div style={categoryStarsStyle}>
                {Array.from({ length: 5 }, (_, index) => {
                  const starPosition = index + 1;
                  const isFilled = starPosition <= Math.floor(normalizedRating);
                  const isHalf = starPosition === Math.ceil(normalizedRating) && normalizedRating % 1 !== 0;
                  return (
                    <img key={starPosition} src={isFilled ? "https://d2kde5ohu8qb21.cloudfront.net/files/691bde547554840002bab60c/star.svg" : isHalf ? "https://d2kde5ohu8qb21.cloudfront.net/files/691c8ba6a619270002cb5797/half-star.svg" : "https://d2kde5ohu8qb21.cloudfront.net/files/691bde5264217700021d6b71/star-stroke.svg"} alt={`Star ${starPosition}`} style={categoryStarStyle} />
                  );
                })}
              </div>
              <span style={categoryScoreStyle}>{normalizedRating % 1 === 0 ? normalizedRating : normalizedRating.toFixed(1)}</span>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div style={containerStyle}>
      <div style={headerStyle}>
        <h2 style={titleStyle}>
          Community Feedback
          <div style={infoIconWrapperStyle} onMouseEnter={() => setIsInfoHovered(true)} onMouseLeave={() => setIsInfoHovered(false)}>
            <Icon name="info" size={16} style={{ color: 'var(--color-neutrals-4, #6E7481)' }} />
            <div style={infoTooltipStyle}>User reviews are independent opinions and do not reflect MotorTrend's official views.</div>
          </div>
        </h2>
      </div>

      <div style={contentStyle}>
        <div style={tabsStyle}>
          <button style={getTabStyle(activeTab === 'reviews', 'reviews')} onClick={() => setActiveTab('reviews')} onMouseEnter={() => setHoveredTab('reviews')} onMouseLeave={() => setHoveredTab(null)}>Reviews</button>
          <button style={getTabStyle(activeTab === 'comments', 'comments')} onClick={() => setActiveTab('comments')} onMouseEnter={() => setHoveredTab('comments')} onMouseLeave={() => setHoveredTab(null)}>Comments</button>
        </div>

        {activeTab === 'reviews' ? (
          <>
            <div style={vehicleHeaderStyle}>
              <h3 style={vehicleNameStyle}>{vehicleName}</h3>
              {onWriteReview && (
                <button style={writeReviewBtnStyle} onClick={() => currentUserReview && onUpdateReview ? handleEditReview(currentUserReview) : onWriteReview?.()} onMouseEnter={() => setIsWriteReviewHovered(true)} onMouseLeave={() => setIsWriteReviewHovered(false)}>
                  <Icon name={currentUserReview ? "edit_note" : "add"} size={20} />
                  {currentUserReview ? 'Edit Your Review' : 'Write a Vehicle Review'}
                </button>
              )}
            </div>

            <div style={ratingSectionStyle}>
              <div style={{ flexShrink: 0, position: 'relative', zIndex: 1, alignSelf: isMobile ? 'center' : undefined }}>
                <div style={ratingCardStyle}>
                  <div style={ratingContentStyle}>
                    <div style={starsDisplayStyle}>
                      {[1, 2, 3, 4, 5].map((star) => {
                        const ratingValue = communityRating / 2;
                        const isFilled = star <= Math.floor(ratingValue);
                        const isHalf = star === Math.ceil(ratingValue) && ratingValue % 1 !== 0;
                        return <img key={star} src={isFilled ? "https://d2kde5ohu8qb21.cloudfront.net/files/691bde547554840002bab60c/star.svg" : isHalf ? "https://d2kde5ohu8qb21.cloudfront.net/files/691c8ba6a619270002cb5797/half-star.svg" : "https://d2kde5ohu8qb21.cloudfront.net/files/691bde5264217700021d6b71/star-stroke.svg"} alt={`Star ${star}`} style={starIconStyle} />;
                      })}
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'var(--spacing-gap-xs, 4px)' }}>
                      <div style={ratingLabelStyle}>
                        <span style={ratingLabelTextStyle}>User Reviews</span>
                        <Badge variant="info" size="sm">{(communityRating / 2).toFixed(1)}/5</Badge>
                      </div>
                    </div>
                  </div>
                  <button style={addRateStyle} onClick={handleOpenRatingModal} onMouseEnter={() => setIsAddRateHovered(true)} onMouseLeave={() => setIsAddRateHovered(false)}>
                    <img src={userRating > 0 ? "https://d2kde5ohu8qb21.cloudfront.net/files/691bde547554840002bab60c/star.svg" : "https://d2kde5ohu8qb21.cloudfront.net/files/691bde5264217700021d6b71/star-stroke.svg"} alt="Add Rating" style={{ width: '20px', height: '20px', objectFit: 'contain' }} />
                    {userRating > 0 ? `Your Rating: ${(userRating / 20) % 1 === 0 ? userRating / 20 : (userRating / 20).toFixed(1)}` : 'Add Your Rating'}
                  </button>
                </div>
              </div>

              <div style={distributionStyle}>
                <div style={distributionChartStyle}>
                  {ratingDistribution.slice(0, 5).map((count, index) => (
                    <div key={index} style={distributionBarStyle} onMouseEnter={(e) => handleBarMouseEnter(index, e)} onMouseLeave={handleBarMouseLeave}>
                      <img src="https://d2kde5ohu8qb21.cloudfront.net/files/691bde547554840002bab60c/star.svg" alt="Star" style={barStarStyle} />
                      <div style={barFillStyle((count / maxRatingCount) * 100)} />
                      <span style={barLabelStyle}>{index + 1}</span>
                      {hoveredBarIndex === index && tooltipPosition && <div style={barTooltipStyle(tooltipPosition)}>{calculatePercentage(count)}%</div>}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div style={recentSectionStyle}>
              <div style={recentHeaderStyle}>
                <h4 style={recentTitleStyle}>Recent User Reviews</h4>
                <div style={recentHeaderRightStyle}>
                  <span style={recentCountStyle}>{sortedReviews.length} Review{sortedReviews.length !== 1 ? 's' : ''}</span>
                  <div style={sortDropdownWrapperStyle} data-sort-dropdown>
                    <label style={sortLabelStyle}>Sort By</label>
                    <div style={sortDropdownStyle} onClick={() => setIsSortDropdownOpen(!isSortDropdownOpen)} onMouseEnter={() => setIsSortDropdownHovered(true)} onMouseLeave={() => setIsSortDropdownHovered(false)}>
                      <span style={sortSelectedStyle}>{getSortLabel()}</span>
                      <Icon name="keyboard_arrow_down" size={20} style={sortChevronStyle} />
                      {isSortDropdownOpen && (
                        <div style={sortDropdownMenuStyle}>
                          {(['best', 'latest_owners', 'verified_owners', 'all'] as const).map(option => (
                            <button key={option} style={getSortOptionStyle(option, sortBy === option)} onClick={(e) => handleSortChange(option, e)} onMouseEnter={() => setHoveredSortOption(option)} onMouseLeave={() => setHoveredSortOption(null)}>
                              {option === 'best' ? 'Best' : option === 'latest_owners' ? 'Latest Owners' : option === 'verified_owners' ? 'Verified Owners' : 'All'}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div style={reviewsListStyle}>
                {displayedReviews.map((review, index) => (
                  <div key={review.id} style={getReviewCardStyle(index)}>
                    <div style={reviewHeaderStyle}>
                      <div style={reviewerAvatarStyle}>
                        {review.reviewerName === 'You' && userAvatar ? <img src={userAvatar} alt="Your avatar" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 'var(--border-radius-circle, 400px)' }} /> : getInitials(review.reviewerName)}
                      </div>
                      <div style={reviewerInfoStyle}>
                        <div style={reviewerNameRowStyle}>
                          <div style={reviewerNameGroupStyle}>
                            <span style={reviewerNameStyle}>{review.reviewerName}</span>
                            {/* HIDDEN: Verification badges
                            {review.verificationLevel === 'owner' && <Badge variant="neutral" size="sm" icon={<img src="https://d2kde5ohu8qb21.cloudfront.net/files/6906c53042d6f10002aac71a/garage.svg" alt="" style={{ width: '12px', height: '12px' }} />}>Owner</Badge>}
                            {review.verificationLevel === 'verified' && <Badge variant="verified" size="sm" icon={<img src="https://d2kde5ohu8qb21.cloudfront.net/files/6906c53142d6f10002aac71b/garage-check.svg" alt="" style={{ width: '12px', height: '12px' }} />}>Verified Owner</Badge>}
                            {review.verificationLevel === 'verified_documents' && <Badge variant="success" size="sm" icon={<img src="https://d2kde5ohu8qb21.cloudfront.net/files/6906c53142d6f10002aac71b/garage-check.svg" alt="" style={{ width: '12px', height: '12px' }} />}>Verified Owner — Documents Verified</Badge>}
                            */}
                          </div>
                          <div style={reviewRatingRowStyle}>
                            <div style={reviewRatingGroupStyle}>
                              <img src="https://d2kde5ohu8qb21.cloudfront.net/files/691bde547554840002bab60c/star.svg" alt="Rating" style={reviewStarStyle} />
                              <span style={reviewRatingStyle}>{(review.rating / 20) % 1 === 0 ? review.rating / 20 : (review.rating / 20).toFixed(1)}</span>
                            </div>
                          </div>
                        </div>
                        <div style={reviewerMetaStyle}>
                          <div style={reviewDatesStyle}>
                            <span style={reviewDateStyle}>{review.date}</span>
                            {review.updatedDate && <span style={reviewUpdatedStyle}>Updated {review.updatedDate}</span>}
                          </div>
{/* HIDDEN: Vehicle relationship and duration badges
                          {(review.vehicleRelationship || review.experienceDuration) && (
                            <span style={reviewerExperienceStyle}>
                              {review.vehicleRelationship === 'own' && <Badge variant="neutral" size="sm" icon={<img src="https://d2kde5ohu8qb21.cloudfront.net/files/6906c53042d6f10002aac71a/garage.svg" alt="" style={{ width: '12px', height: '12px' }} />}>Current Owner</Badge>}
                              {review.vehicleRelationship === 'previously_owned' && <Badge variant="neutral" size="sm">Previous Owner</Badge>}
                              {review.vehicleRelationship === 'leased' && <Badge variant="neutral" size="sm">Leased</Badge>}
                              {review.vehicleRelationship === 'rented' && <Badge variant="neutral" size="sm">Rented</Badge>}
                              {review.vehicleRelationship === 'test_drove' && <Badge variant="neutral" size="sm">Test Drove</Badge>}
                              {review.vehicleRelationship === 'passenger' && <Badge variant="neutral" size="sm">Passenger</Badge>}
                              {review.experienceDuration && <span style={durationInfoStyle}>{review.vehicleRelationship === 'own' ? 'Owned for' : review.vehicleRelationship === 'previously_owned' ? 'Owned for' : review.vehicleRelationship === 'leased' ? 'Leased for' : review.vehicleRelationship === 'rented' ? 'Rented for' : review.vehicleRelationship === 'test_drove' ? 'Test drove' : 'Experienced for'} {review.experienceDuration}</span>}
                            </span>
                          )}
                          */}
                        </div>
                      </div>
                    </div>
                    {review.title && <h5 style={reviewTitleStyle}>{review.title}</h5>}
                    {renderMedia(review)}
                    <div style={reviewContentStyle}>{review.content.trim().split(/\n\s*\n|\r\n\s*\r\n/).map(p => p.trim()).filter(p => p.length > 0).map((paragraph, i) => <p key={i} style={{ fontSize: 'var(--font-size-base, 16px)', margin: i === 0 ? 0 : '0 0 1em 0' }}>{paragraph}</p>)}</div>
                    {renderCategoryRatings(review)}
                    <div style={reviewActionsStyle}>
                      {review.reviewerName === 'You' && onUpdateReview && <button style={getActionBtnStyle(`edit-${review.id}`, false, true)} onClick={() => handleEditReview(review)} onMouseEnter={() => setHoveredActionBtn(`edit-${review.id}`)} onMouseLeave={() => setHoveredActionBtn(null)}>Edit</button>}
                      <button style={getActionBtnStyle(`reply-${review.id}`, replyingToReview === review.id)} onClick={() => handleReply(review.id)} onMouseEnter={() => setHoveredActionBtn(`reply-${review.id}`)} onMouseLeave={() => setHoveredActionBtn(null)}>Reply</button>
                      <button style={getActionBtnStyle(`thumbs-${review.id}`, thumbsUpStates[review.id])} onClick={() => handleThumbsUp(review.id)} onMouseEnter={() => setHoveredActionBtn(`thumbs-${review.id}`)} onMouseLeave={() => setHoveredActionBtn(null)}>
                        <img src="https://d2kde5ohu8qb21.cloudfront.net/files/69024b627e39a30002ddc45d/thumbsup.svg" alt="Thumbs up" style={thumbsUpIconStyle(thumbsUpStates[review.id])} />
                        {(review.thumbsUpCount || 0) + (thumbsUpStates[review.id] ? 1 : 0)}
                      </button>
                      <button style={getActionBtnStyle(`share-${review.id}`)} onClick={() => handleShare(review.id)} onMouseEnter={() => setHoveredActionBtn(`share-${review.id}`)} onMouseLeave={() => setHoveredActionBtn(null)}>Share</button>
                    </div>
                    {replyingToReview === review.id && (
                      <div style={replyInterfaceStyle}>
                        <div style={replyInputContainerStyle}>
                          <textarea style={replyInputStyle} placeholder="Write a reply..." value={replyText} onChange={(e) => setReplyText(e.target.value)} rows={3} />
                          <div style={replyActionsStyle}>
                            <button style={replyCancelBtnStyle} onClick={handleReplyCancel} onMouseEnter={() => setIsReplyCancelHovered(true)} onMouseLeave={() => setIsReplyCancelHovered(false)}>Cancel</button>
                            <button style={replySubmitBtnStyle(!replyText.trim())} onClick={() => handleReplySubmit(review.id)} disabled={!replyText.trim()} onMouseEnter={() => setIsReplySubmitHovered(true)} onMouseLeave={() => setIsReplySubmitHovered(false)}>Reply</button>
                          </div>
                        </div>
                      </div>
                    )}
                    {replies[review.id] && replies[review.id].length > 0 && (
                      <div style={repliesStyle}>
                        {replies[review.id].map((reply, i) => (
                          <div key={reply.id} style={{ ...replyStyle, marginBottom: i === replies[review.id].length - 1 ? 0 : 'var(--spacing-2, 16px)' }}>
                            <div style={replyHeaderStyle}><span style={replyAuthorStyle}>{reply.replierName}</span><span style={replyDateStyle}>{reply.date}</span></div>
                            <div style={replyContentStyle}>{reply.content}</div>
                          </div>
                        ))}
                      </div>
                    )}
                    {review.content.length > 200 && <button style={expandBtnStyle} onClick={() => toggleExpanded(review.id)}>{expandedReview === review.id ? 'Show Less' : 'Read More'}</button>}
                  </div>
                ))}
              </div>

              {hasMoreReviews && !showAllReviews && (
                <button style={readMoreBtnStyle} onClick={() => setShowAllReviews(true)} onMouseEnter={() => setIsReadMoreHovered(true)} onMouseLeave={() => setIsReadMoreHovered(false)}>
                  Read More Reviews <Icon name="keyboard_arrow_down" size={20} />
                </button>
              )}
            </div>
          </>
        ) : (
          <div style={commentsSectionStyle}>
            <div style={commentsHeaderStyle}>
              <h3 style={commentsTitleStyle}>Conversation</h3>
              <div style={commentsHeaderRightStyle}>
                <span style={commentsCountStyle}>{comments.length} Comment{comments.length !== 1 ? 's' : ''}</span>
                <div style={commentSortDropdownStyle}>
                  <label style={commentSortLabelStyle}>Sort by</label>
                  <select style={commentSortSelectStyle} value={commentSortBy} onChange={(e) => setCommentSortBy(e.target.value as 'newest' | 'oldest' | 'most_liked')}>
                    <option value="newest">Newest</option>
                    <option value="oldest">Oldest</option>
                    <option value="most_liked">Most Liked</option>
                  </select>
                </div>
              </div>
            </div>
            <div style={commentInputSectionStyle}>
              <textarea style={commentInputStyle} placeholder="What do you think?" value={commentText} onChange={(e) => setCommentText(e.target.value)} rows={3} />
              <button style={commentSubmitBtnStyle(!commentText.trim())} onClick={handlePostComment} disabled={!commentText.trim()} onMouseEnter={() => setIsCommentSubmitHovered(true)} onMouseLeave={() => setIsCommentSubmitHovered(false)}>Post Comment</button>
            </div>
            <div style={commentsListStyle}>
              {getSortedComments().length === 0 ? (
                <div style={noCommentsStyle}>No comments yet. Be the first to comment!</div>
              ) : (
                getSortedComments().map((comment) => (
                  <div key={comment.id} style={commentCardStyle}>
                    <div style={commentHeaderStyle}>
                      <div style={commenterAvatarStyle}>
                        {comment.commenterName === 'You' && userAvatar ? <img src={userAvatar} alt="Your avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <div style={commenterAvatarPlaceholderStyle}>{getInitials(comment.commenterName)}</div>}
                      </div>
                      <div style={commenterInfoStyle}><span style={commenterNameStyle}>{comment.commenterName}</span><span style={commentDateStyle}>{comment.date}</span></div>
                    </div>
                    <div style={commentContentStyle}>{comment.content}</div>
                    <div style={commentActionsStyle}>
                      <button style={commentActionBtnStyle(commentLikes[comment.id])} onClick={() => handleCommentLike(comment.id)}>
                        <img src="https://d2kde5ohu8qb21.cloudfront.net/files/69024b627e39a30002ddc45d/thumbsup.svg" alt="Like" style={commentLikeIconStyle(commentLikes[comment.id])} />
                        {comment.likes || 0}
                      </button>
                      <button style={commentActionBtnStyle()}>Reply</button>
                      <button style={commentActionBtnStyle()}>Share</button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>

      <RatingModal isOpen={isRatingModalOpen} onClose={handleCloseRatingModal} onRate={handleRatingSubmit} vehicleName={vehicleName} currentRating={userRating} onRateAndReview={handleRateAndReview} />
      {isEditReviewModalOpen && editingReview && <WriteReviewModal isOpen={isEditReviewModalOpen} onClose={handleCloseEditReviewModal} vehicleName={vehicleName} vehicleImage={vehicleImage} onSubmit={handleUpdateReview} existingReview={editingReview} isEditMode={true} />}
    </div>
  );
};

export default UserReviews;
