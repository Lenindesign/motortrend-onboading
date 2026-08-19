import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import type {
  Community as ICommunity,
  Post
} from '../../api/communityApi';
import {
  getCommunities,
  getCommunityBySlug,
  getPosts,
  getPostById,
  toggleJoin,
  toggleVote
} from '../../api/communityApi';
import { CommunitySidebar } from '../../components/Community/CommunitySidebar';
import { PostCard } from '../../components/Community/PostCard';
import { CreatePostModal } from '../../components/Community/CreatePostModal';
import { CreateCommunityModal } from '../../components/Community/CreateCommunityModal';
import { CommentSection } from '../../components/Community/CommentSection';
import { CommunityToast } from '../../components/Community/CommunityToast';
import { AuthModal } from '../../components/Community/AuthModal';
import { UserProfileMenu } from '../../components/Community/UserProfileMenu';
import type { ToastType } from '../../components/Community/CommunityToast';
import { useAuth } from '../../contexts/AuthContext';
import Icon from '../../components/Icon';
import { AdContainer } from '../../components/AdContainer';
import './Community.css';

const CommunityPage: React.FC = () => {
  const { slug, postId } = useParams<{ slug?: string; postId?: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAuthenticated } = useAuth();

  // Data State
  const [communities, setCommunities] = useState<ICommunity[]>([]);
  const [posts, setPosts] = useState<Post[]>([]);
  const [currentCommunity, setCurrentCommunity] = useState<ICommunity | undefined>(undefined);
  const [currentPost, setCurrentPost] = useState<Post | undefined>(undefined);

  // UI State
  const [isCreatePostOpen, setIsCreatePostOpen] = useState(false);
  const [isCreateCommunityOpen, setIsCreateCommunityOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [sortBy, setSortBy] = useState<'hot' | 'new' | 'top'>('hot');
  const [userAvatar, setUserAvatar] = useState<string | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(true);

  // Toast State
  const [toast, setToast] = useState<{ message: string; type: ToastType; isVisible: boolean }>({
    message: '',
    type: 'info',
    isVisible: false,
  });

  const showToast = (message: string, type: ToastType = 'info') => {
    setToast({ message, type, isVisible: true });
  };

  const hideToast = () => {
    setToast(prev => ({ ...prev, isVisible: false }));
  };

  // Initial Load & Refresh
  const loadData = async (showLoading = true) => {
    if (showLoading) setIsLoading(true);

    // Simulate async loading for better UX feedback
    await new Promise(resolve => setTimeout(resolve, 300));

    setCommunities(getCommunities());

    if (postId) {
       setCurrentPost(getPostById(postId));
    } else {
       setCurrentPost(undefined);
    }

    if (slug && slug !== 'popular') {
      const comm = getCommunityBySlug(slug);
      setCurrentCommunity(comm);
      if (comm) {
        setPosts(getPosts(comm.id));
      } else {
        // Community not found, redirect or show error? For now just show all posts
        setPosts(getPosts());
      }
    } else {
      setCurrentCommunity(undefined);
      setPosts(getPosts());
    }

    setIsLoading(false);
  };

  useEffect(() => {
    loadData();
  }, [slug, postId, location.pathname]); // Re-run when route changes

  // Load user avatar from auth context or localStorage
  useEffect(() => {
    const loadUserAvatar = () => {
      // First check auth context
      if (user?.avatarUrl) {
        setUserAvatar(user.avatarUrl);
        return;
      }

      // Fall back to localStorage
      try {
        const onboardingData = localStorage.getItem('onboardingData');
        if (onboardingData) {
          const data = JSON.parse(onboardingData);
          setUserAvatar(data.avatar);
        }
      } catch (error) {
        console.error('Error loading user avatar:', error);
      }
    };

    loadUserAvatar();

    // Listen for avatar updates
    const handleUpdate = () => {
      loadUserAvatar();
    };

    window.addEventListener('onboardingDataUpdated', handleUpdate);
    window.addEventListener('storage', (e) => {
      if (e.key === 'onboardingData') {
        loadUserAvatar();
      }
    });

    return () => {
      window.removeEventListener('onboardingDataUpdated', handleUpdate);
    };
  }, [user]);

  // Helper to require authentication before an action
  const requireAuth = (action: () => void) => {
    if (!isAuthenticated) {
      setIsAuthModalOpen(true);
      return;
    }
    action();
  };

  // Handlers
  const handleJoinToggle = (id: string) => {
    requireAuth(() => {
    // Get community state before toggle
    const community = communities.find(c => c.id === id);
    const wasJoined = community?.isJoined;

    toggleJoin(id);
    loadData(false); // Refresh without loading indicator

    // Show toast
    if (community) {
      showToast(
        wasJoined ? `Left ${community.name}` : `Joined ${community.name}!`,
        wasJoined ? 'info' : 'success'
      );
    }
    });
  };

  const handleVote = (id: string, direction: 'up' | 'down') => {
    toggleVote('post', id, direction);
    loadData(false); // Refresh without loading indicator
    if (currentPost && currentPost.id === id) {
        setCurrentPost(getPostById(id));
    }
    // Note: No toast for votes - too noisy
  };

  const handlePostCreated = () => {
    loadData(false);
    showToast('Post created successfully!', 'success');
  };

  const handleOpenCreatePost = () => {
    requireAuth(() => setIsCreatePostOpen(true));
  };

  const handleOpenCreateCommunity = () => {
    requireAuth(() => setIsCreateCommunityOpen(true));
  };

  const handleCommunityCreated = (newSlug: string) => {
    loadData(false);
    showToast('Community created successfully!', 'success');
    navigate(`/community/${newSlug}`);
  };

  const handleSavePost = (_postId: string, isSaved: boolean) => {
    showToast(isSaved ? 'Post saved!' : 'Post removed from saved', isSaved ? 'success' : 'info');
  };

  const handleSharePost = (postId: string) => {
    // Get the post to find its community
    const post = posts.find(p => p.id === postId);
    const postCommunity = post ? communities.find(c => c.id === post.communityId) : null;

    if (postCommunity) {
      const url = `${window.location.origin}/community/${postCommunity.slug}/post/${postId}`;
      navigator.clipboard.writeText(url).then(() => {
        showToast('Link copied to clipboard!', 'success');
      }).catch(() => {
        showToast('Failed to copy link', 'error');
      });
    }
  };

  // Derived Data
  const sortedPosts = useMemo(() => {
    let sorted = [...posts];
    if (sortBy === 'new') {
      sorted.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    } else if (sortBy === 'top') {
      sorted.sort((a, b) => (b.upvotes - b.downvotes) - (a.upvotes - a.downvotes));
    } else {
      // Hot = combination of score and recency (mock logic)
      sorted.sort((a, b) => {
        const scoreA = a.upvotes - a.downvotes;
        const scoreB = b.upvotes - b.downvotes;
        return scoreB - scoreA; // Simplified to just score for now
      });
    }
    return sorted;
  }, [posts, sortBy]);

  return (
    <div className="community-page">
      <div className="community-page__container">

        {/* Left Sidebar */}
        <CommunitySidebar
          communities={communities}
          onJoinToggle={handleJoinToggle}
          onCreateCommunity={handleOpenCreateCommunity}
        />

        {/* Main Content */}
        <main className="community-page__main">

          {/* Loading State */}
          {isLoading ? (
            <div className="community-page__loading">
              <div className="community-page__loading-spinner"></div>
              <p>Loading community...</p>
            </div>
          ) : (
          <>
          {/* Header / Banner Area */}
          {currentCommunity ? (
            <div className="community-page__banner">
               <div className="community-page__banner-header">
                 {currentCommunity.icon ? (
                   <img src={currentCommunity.icon} alt={currentCommunity.name} className="community-page__banner-icon" />
                 ) : (
                   <div className="community-page__banner-placeholder">{currentCommunity.name[0]}</div>
                 )}
                 <div className="community-page__banner-info">
                   <h1 className="community-page__banner-title">
                     {currentCommunity.name}
                     {(currentCommunity.id === 'comm_motortrend' || currentCommunity.id === 'comm_caranddriver' || currentCommunity.id === 'comm_hotrodpowertour') && (
                       <Icon name="check_circle" size={20} className="community-page__banner-verified-icon" />
                     )}
                   </h1>
                   <span className="community-page__banner-slug">c/{currentCommunity.slug}</span>
                 </div>
                 <button
                   className={`community-page__join-btn ${currentCommunity.isJoined ? 'community-page__join-btn--joined' : ''}`}
                   onClick={() => handleJoinToggle(currentCommunity.id)}
                 >
                   {currentCommunity.isJoined ? 'Joined' : 'Join'}
                 </button>
               </div>

               {/* Mobile Community Info - Only visible on mobile */}
               <div className="community-page__mobile-info">
                 <p className="community-page__mobile-description">{currentCommunity.description}</p>
                 <div className="community-page__mobile-stats">
                   <div className="community-page__mobile-stat">
                     <Icon name="group" size={16} />
                     <span>{currentCommunity.memberCount.toLocaleString()} members</span>
                   </div>
                   <div className="community-page__mobile-stat">
                     <Icon name="calendar_today" size={16} />
                     <span>Created {new Date(currentCommunity.createdAt).toLocaleDateString()}</span>
                   </div>
                 </div>
               </div>
            </div>
          ) : !postId && (
            <div className="community-page__feed-header">
               <h2>{slug === 'popular' ? 'Popular Posts' : 'Home Feed'}</h2>
               <p>Your daily dose of car culture.</p>
            </div>
          )}

          {/* Mobile Communities Strip - Only visible on mobile when not in a community */}
          {!postId && !currentCommunity && (
            <div className="community-page__mobile-communities">
              <div className="community-page__mobile-communities-scroll">
                {communities.filter(c => c.isJoined).slice(0, 10).map(comm => (
                  <button
                    key={comm.id}
                    className="community-page__mobile-community-chip"
                    onClick={() => navigate(`/community/${comm.slug}`)}
                  >
                    {comm.icon ? (
                      <img src={comm.icon} alt={comm.name} className="community-page__mobile-community-icon" />
                    ) : (
                      <span className="community-page__mobile-community-placeholder">{comm.name[0]}</span>
                    )}
                    <span className="community-page__mobile-community-name">{comm.name}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Create Post Input (Feed only) */}
          {!postId && (
            <div className="community-page__create-post-bar">
              <div className="community-page__user-avatar">
                {userAvatar ? (
                  <img
                    src={userAvatar}
                    alt="User avatar"
                    className="community-page__avatar-img"
                  />
                ) : (
                  <div className="community-page__avatar-logo">
                    <img
                      src="https://www.motortrend.com/files/68f6de8441f73a00024a546f/mtavatar.svg"
                      alt="MotorTrend"
                      className="community-page__avatar-logo-img"
                    />
                  </div>
                )}
              </div>
              <input
                type="text"
                placeholder={isAuthenticated ? "Create Post" : "Sign in to create a post"}
                className="community-page__create-input"
                onClick={handleOpenCreatePost}
                readOnly
              />
              <button className="community-page__media-btn" onClick={handleOpenCreatePost}>
                <Icon name="image" size={24} />
              </button>
              {/* User Profile Menu */}
              <UserProfileMenu onSignInClick={() => setIsAuthModalOpen(true)} />
            </div>
          )}

          {/* Filter/Sort Bar (Feed only) */}
          {!postId && (
            <div className="community-page__sort-bar">
               <button
                 className={`community-page__sort-btn ${sortBy === 'hot' ? 'community-page__sort-btn--active' : ''}`}
                 onClick={() => setSortBy('hot')}
               >
                 <Icon name="local_fire_department" size={20} />
                 Hot
               </button>
               <button
                 className={`community-page__sort-btn ${sortBy === 'new' ? 'community-page__sort-btn--active' : ''}`}
                 onClick={() => setSortBy('new')}
               >
                 <Icon name="new_releases" size={20} />
                 New
               </button>
               <button
                 className={`community-page__sort-btn ${sortBy === 'top' ? 'community-page__sort-btn--active' : ''}`}
                 onClick={() => setSortBy('top')}
               >
                 <Icon name="leaderboard" size={20} />
                 Top
               </button>
            </div>
          )}

          {/* Content: Post Detail or Feed */}
          {postId && currentPost ? (
            <div className="community-page__post-detail">
              {/* Back Navigation */}
              <button
                className="community-page__back-btn"
                onClick={() => navigate(currentCommunity ? `/community/${currentCommunity.slug}` : '/community')}
              >
                <Icon name="arrow_back" size={20} />
                <span>Back to {currentCommunity ? currentCommunity.name : 'Feed'}</span>
              </button>
              <PostCard
                post={currentPost}
                community={currentCommunity || undefined}
                onVote={handleVote}
                onSave={handleSavePost}
                onShare={handleSharePost}
                showCommunity={false}
                isDetailView={true}
              >
                <CommentSection postId={currentPost.id} />
              </PostCard>
            </div>
          ) : (
            <div className="community-page__feed">
              {sortedPosts.length === 0 ? (
                <div className="community-page__empty">
                  <div className="community-page__empty-icon">
                    <Icon name="forum" size={48} />
                  </div>
                  <h3 className="community-page__empty-title">No posts yet</h3>
                  <p className="community-page__empty-text">
                    {currentCommunity
                      ? `Be the first to share something in ${currentCommunity.name}!`
                      : 'Join communities and start sharing your thoughts!'}
                  </p>
                  <button
                    className="community-page__empty-cta"
                    onClick={handleOpenCreatePost}
                  >
                    <Icon name="add" size={20} />
                    {isAuthenticated ? 'Create Post' : 'Sign In to Post'}
                  </button>
                </div>
              ) : (
                sortedPosts.map(post => {
                  // Find community for this post
                  const postCommunity = communities.find(c => c.id === post.communityId);
                  return (
                    <PostCard
                      key={post.id}
                      post={post}
                      community={postCommunity}
                      onVote={handleVote}
                      onSave={handleSavePost}
                      onShare={handleSharePost}
                      showCommunity={!currentCommunity} // Don't show community name if we are IN that community page
                    />
                  );
                })
              )}
            </div>
          )}
          </>
          )}

        </main>

        {/* Right Sidebar */}
        <aside className="community-page__right-sidebar">
          {currentCommunity ? (
            <div className="community-info-card">
              <div className="community-info-card__header">
                <h3>About Community</h3>
              </div>
              <div className="community-info-card__content">
                {currentCommunity.description && (
                  <p className="community-info-card__desc">{currentCommunity.description}</p>
                )}
                <div className="community-info-card__stats">
                   <div className="community-info-card__stat">
                     <div className="stat-value">{currentCommunity.memberCount.toLocaleString()}</div>
                     <div className="stat-label">Members</div>
                   </div>
                   <div className="community-info-card__stat">
                     <div className="stat-value">120</div>
                     <div className="stat-label">Online</div>
                   </div>
                </div>
                <div className="community-info-card__created">
                  <Icon name="cake" size={16} />
                  Created {new Date(currentCommunity.createdAt).toLocaleDateString()}
                </div>
                <button
                  className="community-info-card__create-btn"
                  onClick={handleOpenCreatePost}
                >
                  {isAuthenticated ? 'Create Post' : 'Sign In to Post'}
                </button>
              </div>
            </div>
          ) : (
            <div className="community-info-card">
               <div className="community-info-card__header">
                 <h3>Recommended for You</h3>
               </div>
               <div className="community-info-card__content">
                 <div className="community-recommended-posts">
                   {posts
                     .filter(post => {
                       // Get posts from communities user has joined or popular posts
                       const postCommunity = communities.find(c => c.id === post.communityId);
                       return postCommunity?.isJoined || (post.upvotes - post.downvotes) > 5;
                     })
                     .sort((a, b) => (b.upvotes - b.downvotes) - (a.upvotes - a.downvotes))
                     .slice(0, 5)
                     .map(post => {
                       const postCommunity = communities.find(c => c.id === post.communityId);
                       return (
                         <div
                           key={post.id}
                           className="community-recommended-post"
                           onClick={() => {
                             if (postCommunity) {
                               navigate(`/community/${postCommunity.slug}/post/${post.id}`);
                             }
                           }}
                         >
                           <div className="community-recommended-post__community">
                             {postCommunity?.icon ? (
                               <img
                                 src={postCommunity.icon}
                                 alt={postCommunity.name}
                                 className="community-recommended-post__icon"
                               />
                             ) : (
                               <div className="community-recommended-post__icon-placeholder">
                                 {postCommunity?.name[0] || 'C'}
                               </div>
                             )}
                             <span className="community-recommended-post__community-name">
                               c/{postCommunity?.name || 'Unknown'}
                             </span>
                             {(postCommunity?.id === 'comm_motortrend' || postCommunity?.id === 'comm_caranddriver' || postCommunity?.id === 'comm_hotrodpowertour') && (
                               <Icon name="check_circle" size={14} className="community-recommended-post__verified-icon" />
                             )}
                           </div>
                           <h4 className="community-recommended-post__title">{post.title}</h4>
                           <div className="community-recommended-post__meta">
                             <span>{post.upvotes - post.downvotes} upvotes</span>
                             <span>•</span>
                             <span>{post.commentCount} comments</span>
                           </div>
                         </div>
                       );
                     })}
                 </div>
               </div>
            </div>
          )}

          {/* Rules Section (if community) */}
          {currentCommunity && currentCommunity.rules && (
            <div className="community-info-card">
               <div className="community-info-card__header">
                 <h3>Rules</h3>
               </div>
               <div className="community-info-card__content">
                 <ol className="community-rules-list">
                   {currentCommunity.rules.map((rule, idx) => (
                     <li key={idx}>{rule}</li>
                   ))}
                 </ol>
               </div>
            </div>
          )}

          {/* Ads */}
          <div className="community-page__ad-wrapper">
             <AdContainer
                width={300}
                height={250}
                label="300 x 250"
                position="right-column"
                imageUrl="https://www.motortrend.com/files/69116380f5e41e00020d3432/822789964589118228.jpeg"
              />
          </div>
        </aside>
      </div>

      {/* Modals */}
      <CreatePostModal
        isOpen={isCreatePostOpen}
        onClose={() => setIsCreatePostOpen(false)}
        communities={communities}
        initialCommunityId={currentCommunity?.id}
        onPostCreated={handlePostCreated}
      />

      <CreateCommunityModal
        isOpen={isCreateCommunityOpen}
        onClose={() => setIsCreateCommunityOpen(false)}
        onCommunityCreated={handleCommunityCreated}
      />

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        initialMode="signin"
      />

      {/* Toast Notifications */}
      <CommunityToast
        message={toast.message}
        type={toast.type}
        isVisible={toast.isVisible}
        onClose={hideToast}
      />
    </div>
  );
};

export default CommunityPage;
