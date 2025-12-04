import React, { useState, useEffect, useMemo, useRef } from 'react';
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
import { VoteControl } from '../../components/Community/VoteControl';
import { CreatePostModal } from '../../components/Community/CreatePostModal';
import { CreateCommunityModal } from '../../components/Community/CreateCommunityModal';
import { CommentSection } from '../../components/Community/CommentSection';
import Icon from '../../components/Icon';
import { AdContainer } from '../../components/AdContainer';
import './Community.css';

const CommunityPage: React.FC = () => {
  const { slug, postId } = useParams<{ slug?: string; postId?: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const adWrapperRef = useRef<HTMLDivElement>(null);
  
  // Data State
  const [communities, setCommunities] = useState<ICommunity[]>([]);
  const [posts, setPosts] = useState<Post[]>([]);
  const [currentCommunity, setCurrentCommunity] = useState<ICommunity | undefined>(undefined);
  const [currentPost, setCurrentPost] = useState<Post | undefined>(undefined);
  
  // UI State
  const [isCreatePostOpen, setIsCreatePostOpen] = useState(false);
  const [isCreateCommunityOpen, setIsCreateCommunityOpen] = useState(false);
  const [sortBy, setSortBy] = useState<'hot' | 'new' | 'top'>('hot');
  const [userAvatar, setUserAvatar] = useState<string | undefined>(undefined);

  // Initial Load & Refresh
  const loadData = () => {
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
  };

  useEffect(() => {
    loadData();
  }, [slug, postId, location.pathname]); // Re-run when route changes

  // Load user avatar from localStorage
  useEffect(() => {
    const loadUserAvatar = () => {
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
  }, []);

  // Handle sticky ad positioning with JavaScript
  useEffect(() => {
    const handleScroll = () => {
      if (!adWrapperRef.current) return;
      
      const wrapper = adWrapperRef.current;
      const sidebar = wrapper.closest('.community-page__right-sidebar');
      if (!sidebar) return;
      
      const container = sidebar.closest('.community-page__container');
      if (!container) return;
      
      const containerRect = container.getBoundingClientRect();
      const sidebarRect = sidebar.getBoundingClientRect();
      const wrapperRect = wrapper.getBoundingClientRect();
      
      // Calculate if we should stick
      const shouldStick = containerRect.top <= 20 && 
                         containerRect.bottom > (wrapperRect.height + 20);
      
      if (shouldStick) {
        const topOffset = Math.max(20, 20 - (containerRect.top));
        wrapper.style.position = 'fixed';
        wrapper.style.top = `${topOffset}px`;
        wrapper.style.width = `${sidebarRect.width}px`;
        wrapper.style.zIndex = '10';
      } else {
        wrapper.style.position = '';
        wrapper.style.top = '';
        wrapper.style.width = '';
        wrapper.style.zIndex = '';
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll, { passive: true });
    handleScroll(); // Initial call

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, [currentCommunity]);

  // Handlers
  const handleJoinToggle = (id: string) => {
    toggleJoin(id);
    loadData(); // Refresh to update UI state
  };

  const handleVote = (id: string, direction: 'up' | 'down') => {
    toggleVote('post', id, direction);
    loadData(); // Refresh
    if (currentPost && currentPost.id === id) {
        setCurrentPost(getPostById(id));
    }
  };

  const handlePostCreated = () => {
    loadData();
  };

  const handleCommunityCreated = (newSlug: string) => {
    loadData();
    navigate(`/community/${newSlug}`);
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
          onCreateCommunity={() => setIsCreateCommunityOpen(true)}
        />

        {/* Main Content */}
        <main className="community-page__main">
          
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
            </div>
          ) : !postId && (
            <div className="community-page__feed-header">
               <h2>{slug === 'popular' ? 'Popular Posts' : 'Home Feed'}</h2>
               <p>Your daily dose of car culture.</p>
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
                      src="https://d2kde5ohu8qb21.cloudfront.net/files/68f6de8441f73a00024a546f/mtavatar.svg" 
                      alt="MotorTrend" 
                      className="community-page__avatar-logo-img"
                    />
                  </div>
                )}
              </div>
              <input 
                type="text" 
                placeholder="Create Post" 
                className="community-page__create-input"
                onClick={() => setIsCreatePostOpen(true)}
                readOnly
              />
              <button className="community-page__media-btn" onClick={() => setIsCreatePostOpen(true)}>
                <Icon name="image" size={24} />
              </button>
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
              <div className="post-card post-card--detail">
                <div className="post-card__vote-column">
                   <VoteControl 
                      upvotes={currentPost.upvotes} 
                      downvotes={currentPost.downvotes}
                      userVote={currentPost.userVote}
                      onVote={(dir) => handleVote(currentPost.id, dir)}
                      orientation="vertical"
                      size="md"
                    />
                </div>
                <div className="post-card__content-column">
                   <div className="post-card__header">
                      <span className="post-card__meta">
                        Posted by {currentPost.author.name} • {new Date(currentPost.createdAt).toLocaleDateString()}
                      </span>
                   </div>
                   <h1 className="post-card__title post-card__title--detail">{currentPost.title}</h1>
                   {currentPost.image && (
                     <div className="post-card__media">
                        <img src={currentPost.image} alt={currentPost.title} className="post-card__image" />
                     </div>
                   )}
                   <div className="post-card__text-content">
                      {currentPost.content}
                   </div>
                   
                   {/* Footer: Actions */}
                   <div className="post-card__footer">
                     <div className="post-card__action">
                       <Icon name="chat_bubble_outline" size={18} />
                       <span>{currentPost.commentCount} Comments</span>
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
                   
                   <CommentSection postId={currentPost.id} />
                </div>
              </div>
            </div>
          ) : (
            <div className="community-page__feed">
              {sortedPosts.length === 0 ? (
                <div className="community-page__empty">
                   <p>No posts yet. Be the first to post!</p>
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
                      showCommunity={!currentCommunity} // Don't show community name if we are IN that community page
                    />
                  );
                })
              )}
            </div>
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
                  onClick={() => setIsCreatePostOpen(true)}
                >
                  Create Post
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
          <div ref={adWrapperRef} className="community-page__ad-wrapper">
             <AdContainer
                width={300}
                height={250}
                label="300 x 250"
                position="right-column"
                imageUrl="https://d2kde5ohu8qb21.cloudfront.net/files/69116380f5e41e00020d3432/822789964589118228.jpeg"
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
    </div>
  );
};

export default CommunityPage;
