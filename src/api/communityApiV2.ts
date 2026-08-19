/**
 * Community API v2
 * Enhanced API with Supabase backend support and localStorage fallback
 * 
 * This API automatically detects if Supabase is configured and uses it.
 * If not, it falls back to localStorage for demo/development purposes.
 */

import { supabase, canUseSupabase } from '../lib/supabase';

// Note: We use 'any' for Supabase operations to avoid complex generic typing
// The actual types are defined in types/database.ts for reference

// API Response Types
export interface CommunityWithMembership {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  icon_url: string | null;
  icon?: string | null;
  banner_url: string | null;
  banner?: string | null;
  member_count: number;
  memberCount?: number;
  rules: string[] | null;
  created_by?: string;
  created_at: string;
  createdAt?: string;
  updated_at?: string | null;
  is_official?: boolean;
  publisher?: string | null;
  is_joined?: boolean;
  isJoined?: boolean;
}

export interface PostWithAuthor {
  id: string;
  community_id?: string;
  communityId?: string;
  author_id?: string;
  author: {
    id: string;
    display_name?: string;
    name?: string;
    avatar_url?: string | null;
    avatar?: string | null;
  };
  title: string;
  content: string;
  image_url?: string | null;
  image?: string | null;
  upvotes: number;
  downvotes: number;
  comment_count?: number;
  commentCount?: number;
  created_at?: string;
  createdAt?: string;
  updated_at?: string | null;
  is_pinned?: boolean;
  is_locked?: boolean;
  user_vote?: 'up' | 'down' | null;
  userVote?: 'up' | 'down' | null;
  is_saved?: boolean;
  tags?: string[];
}

export interface CommentWithAuthor {
  id: string;
  post_id?: string;
  postId?: string;
  author_id?: string;
  author: {
    id: string;
    display_name?: string;
    name?: string;
    avatar_url?: string | null;
    avatar?: string | null;
  };
  parent_id?: string | null;
  parentId?: string | null;
  content: string;
  upvotes: number;
  downvotes: number;
  created_at?: string;
  createdAt?: string;
  updated_at?: string | null;
  user_vote?: 'up' | 'down' | null;
  userVote?: 'up' | 'down' | null;
  replies?: CommentWithAuthor[];
}

// Type aliases for backwards compatibility
export type Post = PostWithAuthor;
export type Comment = CommentWithAuthor;
export type Community = CommunityWithMembership;

// User type for both modes
export interface User {
  id: string;
  name: string;
  avatar?: string;
}

// ============================================================================
// LOCAL STORAGE FALLBACK (from original communityApi.ts)
// ============================================================================

// Seed Data for demo mode
const SEED_COMMUNITIES = [
  {
    id: 'comm_motortrend',
    slug: 'motortrend',
    name: 'MotorTrend',
    description: 'The official MotorTrend community. Get the latest car reviews, news, and insights from our expert team.',
    icon_url: 'https://www.motortrend.com/files/68f6de8441f73a00024a546f/mtavatar.svg',
    member_count: 50000,
    is_official: true,
    created_at: new Date().toISOString(),
    rules: ['Be respectful', 'No spam', 'Stay on topic', 'Follow MotorTrend community guidelines'],
  },
  {
    id: 'comm_caranddriver',
    slug: 'caranddriver',
    name: 'Car and Driver',
    description: 'Join the Car and Driver community for automotive discussions and insights.',
    icon_url: 'https://www.motortrend.com/files/692e5cd3c2af34000266b93d/group1175889264.svg',
    member_count: 9800,
    is_official: true,
    created_at: new Date().toISOString(),
  },
  {
    id: 'comm_hotrodpowertour',
    slug: 'hotrodpowertour',
    name: 'HOT ROD POWER TOUR',
    description: 'Join the HOT ROD Power Tour community for discussions about the annual road trip event.',
    icon_url: 'https://www.sema.org/sites/default/files/inline-images/HRPT-1410x790.jpg',
    member_count: 7200,
    is_official: true,
    created_at: new Date().toISOString(),
    rules: ['Be respectful', 'Share your Power Tour experiences', 'Show off your builds'],
  },
  {
    id: 'comm_cartalk',
    slug: 'cartalk',
    name: 'Car Talk',
    description: 'General discussion about cars, repairs, and advice.',
    icon_url: 'https://media.licdn.com/dms/image/v2/C4E03AQHtqO_iePac8w/profile-displayphoto-shrink_200_200/profile-displayphoto-shrink_200_200/0/1516156390736?e=2147483647&v=beta&t=Cr4Lvzi3H2OQasXRIKsWR2MLEKG1nv0pU2_N_qcyrbY',
    member_count: 12500,
    is_official: false,
    created_at: new Date().toISOString(),
    rules: ['Be respectful', 'No spam', 'Stay on topic'],
  },
  {
    id: 'comm_whatcar',
    slug: 'whatcarshouldibuy',
    name: 'What Car Should I Buy?',
    description: 'Help choosing your next vehicle.',
    icon_url: 'https://static0.carbuzzimages.com/wordpress/wp-content/uploads/gallery-images/original/1210000/900/1210962.jpg',
    member_count: 15200,
    is_official: false,
    created_at: new Date().toISOString(),
  },
];

const STORAGE_KEYS = {
  COMMUNITIES: 'community_v2_communities',
  POSTS: 'community_v2_posts',
  COMMENTS: 'community_v2_comments',
  VOTES: 'community_v2_votes',
  JOINS: 'community_v2_joins',
  SAVED_POSTS: 'community_v2_saved_posts',
};

// Get current user from localStorage
function getLocalUser(): User {
  try {
    const onboardingData = localStorage.getItem('onboardingData');
    if (onboardingData) {
      const data = JSON.parse(onboardingData);
      return {
        id: 'current_user',
        name: data.name || 'You',
        avatar: data.avatar,
      };
    }
  } catch {
    // Ignore errors
  }
  return { id: 'guest', name: 'Guest' };
}

// ============================================================================
// API FUNCTIONS
// ============================================================================

/**
 * Get all communities
 */
export async function getCommunities(): Promise<CommunityWithMembership[]> {
  if (canUseSupabase() && supabase) {
    // Supabase mode - using any to avoid complex generic typing
    const { data: communities, error } = await (supabase as any)
      .from('communities')
      .select('*')
      .order('member_count', { ascending: false });
    
    if (error) throw error;
    
    // Get user's memberships
    const { data: { user } } = await supabase.auth.getUser();
    let memberships: Record<string, boolean> = {};
    
    if (user) {
      const { data: memberData } = await (supabase as any)
        .from('community_members')
        .select('community_id')
        .eq('user_id', user.id);
      
      memberships = (memberData || []).reduce((acc: Record<string, boolean>, m: any) => {
        acc[m.community_id] = true;
        return acc;
      }, {} as Record<string, boolean>);
    }
    
    return (communities || []).map((c: any) => ({
      ...c,
      is_joined: memberships[c.id] || false,
    }));
  }
  
  // Local storage mode
  let communities = JSON.parse(localStorage.getItem(STORAGE_KEYS.COMMUNITIES) || 'null');
  
  if (!communities) {
    communities = SEED_COMMUNITIES;
    localStorage.setItem(STORAGE_KEYS.COMMUNITIES, JSON.stringify(communities));
  }
  
  const joins = JSON.parse(localStorage.getItem(STORAGE_KEYS.JOINS) || '{}');
  
  return communities.map((c: any) => ({
    ...c,
    icon: c.icon_url || c.icon,
    banner: c.banner_url || c.banner,
    memberCount: c.member_count || c.memberCount,
    createdAt: c.created_at || c.createdAt,
    isJoined: joins[c.id] || false,
    is_joined: joins[c.id] || false,
  }));
}

/**
 * Get a single community by slug
 */
export async function getCommunityBySlug(slug: string): Promise<CommunityWithMembership | null> {
  const communities = await getCommunities();
  return communities.find(c => c.slug === slug) || null;
}

/**
 * Create a new community
 */
export async function createCommunity(
  name: string,
  description: string,
  iconUrl?: string
): Promise<CommunityWithMembership> {
  const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  
  if (canUseSupabase() && supabase) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Must be logged in to create a community');
    
    const { data: community, error } = await (supabase as any)
      .from('communities')
      .insert({
        slug,
        name,
        description,
        icon_url: iconUrl,
        created_by: user.id,
        member_count: 1,
      })
      .select()
      .single();
    
    if (error) throw error;
    
    // Auto-join creator
    await (supabase as any).from('community_members').insert({
      community_id: community.id,
      user_id: user.id,
      role: 'admin',
    });
    
    return { ...community, is_joined: true };
  }
  
  // Local storage mode
  const communities = JSON.parse(localStorage.getItem(STORAGE_KEYS.COMMUNITIES) || '[]');
  const newCommunity = {
    id: `comm_${Date.now()}`,
    slug,
    name,
    description,
    icon_url: iconUrl,
    member_count: 1,
    is_official: false,
    created_at: new Date().toISOString(),
    is_joined: true,
  };
  
  communities.push(newCommunity);
  localStorage.setItem(STORAGE_KEYS.COMMUNITIES, JSON.stringify(communities));
  
  // Auto-join
  const joins = JSON.parse(localStorage.getItem(STORAGE_KEYS.JOINS) || '{}');
  joins[newCommunity.id] = true;
  localStorage.setItem(STORAGE_KEYS.JOINS, JSON.stringify(joins));
  
  return newCommunity as any;
}

/**
 * Toggle community membership
 */
export async function toggleJoinCommunity(communityId: string): Promise<boolean> {
  if (canUseSupabase() && supabase) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Must be logged in to join communities');
    
    // Check current membership
    const { data: existing } = await (supabase as any)
      .from('community_members')
      .select('id')
      .eq('community_id', communityId)
      .eq('user_id', user.id)
      .single();
    
    if (existing) {
      // Leave
      await (supabase as any)
        .from('community_members')
        .delete()
        .eq('community_id', communityId)
        .eq('user_id', user.id);
      
      // Decrement member count
      await (supabase as any).rpc('decrement_member_count', { community_id: communityId });
      return false;
    } else {
      // Join
      await (supabase as any).from('community_members').insert({
        community_id: communityId,
        user_id: user.id,
        role: 'member',
      });
      
      // Increment member count
      await (supabase as any).rpc('increment_member_count', { community_id: communityId });
      return true;
    }
  }
  
  // Local storage mode
  const joins = JSON.parse(localStorage.getItem(STORAGE_KEYS.JOINS) || '{}');
  const isJoined = !joins[communityId];
  joins[communityId] = isJoined;
  localStorage.setItem(STORAGE_KEYS.JOINS, JSON.stringify(joins));
  
  // Update member count
  const communities = JSON.parse(localStorage.getItem(STORAGE_KEYS.COMMUNITIES) || '[]');
  const updated = communities.map((c: any) => {
    if (c.id === communityId) {
      const count = c.member_count || c.memberCount || 0;
      return { ...c, member_count: count + (isJoined ? 1 : -1), memberCount: count + (isJoined ? 1 : -1) };
    }
    return c;
  });
  localStorage.setItem(STORAGE_KEYS.COMMUNITIES, JSON.stringify(updated));
  
  return isJoined;
}

/**
 * Get posts (optionally filtered by community)
 */
export async function getPosts(communityId?: string): Promise<PostWithAuthor[]> {
  if (canUseSupabase() && supabase) {
    let query = (supabase as any)
      .from('posts')
      .select(`
        *,
        author:profiles!author_id(id, display_name, avatar_url)
      `)
      .order('created_at', { ascending: false });
    
    if (communityId) {
      query = query.eq('community_id', communityId);
    }
    
    const { data: posts, error } = await query;
    if (error) throw error;
    
    // Get user's votes
    const { data: { user } } = await supabase.auth.getUser();
    let votes: Record<string, 'up' | 'down'> = {};
    let savedPosts: Record<string, boolean> = {};
    
    if (user) {
      const { data: voteData } = await (supabase as any)
        .from('votes')
        .select('target_id, vote_type')
        .eq('user_id', user.id)
        .eq('target_type', 'post');
      
      votes = (voteData || []).reduce((acc: Record<string, 'up' | 'down'>, v: any) => {
        acc[v.target_id] = v.vote_type;
        return acc;
      }, {} as Record<string, 'up' | 'down'>);
      
      const { data: savedData } = await (supabase as any)
        .from('saved_posts')
        .select('post_id')
        .eq('user_id', user.id);
      
      savedPosts = (savedData || []).reduce((acc: Record<string, boolean>, s: any) => {
        acc[s.post_id] = true;
        return acc;
      }, {} as Record<string, boolean>);
    }
    
    return (posts || []).map((p: any) => ({
      ...p,
      author: {
        id: p.author?.id || '',
        display_name: p.author?.display_name || 'Unknown',
        avatar_url: p.author?.avatar_url,
      },
      user_vote: votes[p.id] || null,
      is_saved: savedPosts[p.id] || false,
    })) as PostWithAuthor[];
  }
  
  // Local storage mode
  let posts = JSON.parse(localStorage.getItem(STORAGE_KEYS.POSTS) || 'null');
  
  if (!posts) {
    // Import seed posts from original API
    const { getPosts: getOriginalPosts } = await import('./communityApi');
    posts = getOriginalPosts();
    localStorage.setItem(STORAGE_KEYS.POSTS, JSON.stringify(posts));
  }
  
  if (communityId) {
    posts = posts.filter((p: any) => p.communityId === communityId || p.community_id === communityId);
  }
  
  const votes = JSON.parse(localStorage.getItem(STORAGE_KEYS.VOTES) || '{}');
  const saved = JSON.parse(localStorage.getItem(STORAGE_KEYS.SAVED_POSTS) || '{}');
  
  return posts.map((p: any) => ({
    ...p,
    author: p.author || { id: 'unknown', name: 'Unknown User' },
    user_vote: votes[p.id] || null,
    userVote: votes[p.id] || null,
    is_saved: saved[p.id] || false,
    commentCount: p.comment_count || p.commentCount || 0,
    createdAt: p.created_at || p.createdAt,
  })).sort((a: any, b: any) => new Date(b.createdAt || b.created_at).getTime() - new Date(a.createdAt || a.created_at).getTime());
}

/**
 * Get a single post by ID
 */
export async function getPostById(postId: string): Promise<PostWithAuthor | null> {
  const posts = await getPosts();
  return posts.find(p => p.id === postId) || null;
}

/**
 * Create a new post
 */
export async function createPost(
  communityId: string,
  title: string,
  content: string,
  imageUrl?: string
): Promise<PostWithAuthor> {
  if (canUseSupabase() && supabase) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Must be logged in to create posts');
    
    const { data: post, error } = await (supabase as any)
      .from('posts')
      .insert({
        community_id: communityId,
        author_id: user.id,
        title,
        content,
        image_url: imageUrl,
        upvotes: 1,
        downvotes: 0,
        comment_count: 0,
      })
      .select(`
        *,
        author:profiles!author_id(id, display_name, avatar_url)
      `)
      .single();
    
    if (error) throw error;
    
    // Auto-upvote own post
    await (supabase as any).from('votes').insert({
      user_id: user.id,
      target_id: post.id,
      target_type: 'post',
      vote_type: 'up',
    });
    
    return { ...post, user_vote: 'up' } as PostWithAuthor;
  }
  
  // Local storage mode
  const posts = JSON.parse(localStorage.getItem(STORAGE_KEYS.POSTS) || '[]');
  const user = getLocalUser();
  
  const newPost = {
    id: `post_${Date.now()}`,
    communityId,
    community_id: communityId,
    author: user,
    author_id: user.id,
    title,
    content,
    image: imageUrl,
    image_url: imageUrl,
    createdAt: new Date().toISOString(),
    created_at: new Date().toISOString(),
    upvotes: 1,
    downvotes: 0,
    commentCount: 0,
    comment_count: 0,
    userVote: 'up' as const,
    user_vote: 'up' as const,
  };
  
  posts.unshift(newPost);
  localStorage.setItem(STORAGE_KEYS.POSTS, JSON.stringify(posts));
  
  // Auto-upvote
  const votes = JSON.parse(localStorage.getItem(STORAGE_KEYS.VOTES) || '{}');
  votes[newPost.id] = 'up';
  localStorage.setItem(STORAGE_KEYS.VOTES, JSON.stringify(votes));
  
  return newPost as any;
}

/**
 * Vote on a post or comment
 */
export async function vote(
  targetType: 'post' | 'comment',
  targetId: string,
  voteType: 'up' | 'down'
): Promise<{ newVote: 'up' | 'down' | null; upvotes: number; downvotes: number }> {
  if (canUseSupabase() && supabase) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Must be logged in to vote');
    
    // Check existing vote
    const { data: existing } = await (supabase as any)
      .from('votes')
      .select('*')
      .eq('user_id', user.id)
      .eq('target_id', targetId)
      .eq('target_type', targetType)
      .single();
    
    const table = targetType === 'post' ? 'posts' : 'comments';
    let newVote: 'up' | 'down' | null = voteType;
    
    if (existing) {
      if (existing.vote_type === voteType) {
        // Remove vote
        await (supabase as any).from('votes').delete().eq('id', existing.id);
        newVote = null;
        
        // Update counts
        if (voteType === 'up') {
          await (supabase as any).rpc('decrement_upvotes', { table_name: table, target_id: targetId });
        } else {
          await (supabase as any).rpc('decrement_downvotes', { table_name: table, target_id: targetId });
        }
      } else {
        // Change vote
        await (supabase as any).from('votes').update({ vote_type: voteType }).eq('id', existing.id);
        
        // Update counts
        if (voteType === 'up') {
          await (supabase as any).rpc('increment_upvotes', { table_name: table, target_id: targetId });
          await (supabase as any).rpc('decrement_downvotes', { table_name: table, target_id: targetId });
        } else {
          await (supabase as any).rpc('decrement_upvotes', { table_name: table, target_id: targetId });
          await (supabase as any).rpc('increment_downvotes', { table_name: table, target_id: targetId });
        }
      }
    } else {
      // New vote
      await (supabase as any).from('votes').insert({
        user_id: user.id,
        target_id: targetId,
        target_type: targetType,
        vote_type: voteType,
      });
      
      if (voteType === 'up') {
        await (supabase as any).rpc('increment_upvotes', { table_name: table, target_id: targetId });
      } else {
        await (supabase as any).rpc('increment_downvotes', { table_name: table, target_id: targetId });
      }
    }
    
    // Get updated counts
    const { data: updated } = await (supabase as any).from(table).select('upvotes, downvotes').eq('id', targetId).single();
    
    return {
      newVote,
      upvotes: updated?.upvotes || 0,
      downvotes: updated?.downvotes || 0,
    };
  }
  
  // Local storage mode
  const votes = JSON.parse(localStorage.getItem(STORAGE_KEYS.VOTES) || '{}');
  const storageKey = targetType === 'post' ? STORAGE_KEYS.POSTS : STORAGE_KEYS.COMMENTS;
  const items = JSON.parse(localStorage.getItem(storageKey) || '[]');
  
  const currentVote = votes[targetId];
  let newVote: 'up' | 'down' | null = voteType;
  
  if (currentVote === voteType) {
    delete votes[targetId];
    newVote = null;
  } else {
    votes[targetId] = voteType;
  }
  
  localStorage.setItem(STORAGE_KEYS.VOTES, JSON.stringify(votes));
  
  // Update counts
  const updatedItems = items.map((item: any) => {
    if (item.id === targetId) {
      let { upvotes, downvotes } = item;
      
      // Remove old vote effect
      if (currentVote === 'up') upvotes--;
      if (currentVote === 'down') downvotes--;
      
      // Add new vote effect
      if (newVote === 'up') upvotes++;
      if (newVote === 'down') downvotes++;
      
      return { ...item, upvotes, downvotes };
    }
    return item;
  });
  
  localStorage.setItem(storageKey, JSON.stringify(updatedItems));
  
  const updated = updatedItems.find((i: any) => i.id === targetId);
  return {
    newVote,
    upvotes: updated?.upvotes || 0,
    downvotes: updated?.downvotes || 0,
  };
}

/**
 * Toggle save post
 */
export async function toggleSavePost(postId: string): Promise<boolean> {
  if (canUseSupabase() && supabase) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Must be logged in to save posts');
    
    const { data: existing } = await (supabase as any)
      .from('saved_posts')
      .select('id')
      .eq('user_id', user.id)
      .eq('post_id', postId)
      .single();
    
    if (existing) {
      await (supabase as any).from('saved_posts').delete().eq('id', existing.id);
      return false;
    } else {
      await (supabase as any).from('saved_posts').insert({
        user_id: user.id,
        post_id: postId,
      });
      return true;
    }
  }
  
  // Local storage mode
  const saved = JSON.parse(localStorage.getItem(STORAGE_KEYS.SAVED_POSTS) || '{}');
  const isSaved = !saved[postId];
  
  if (isSaved) {
    saved[postId] = true;
  } else {
    delete saved[postId];
  }
  
  localStorage.setItem(STORAGE_KEYS.SAVED_POSTS, JSON.stringify(saved));
  return isSaved;
}

/**
 * Get comments for a post
 */
export async function getComments(postId: string): Promise<CommentWithAuthor[]> {
  if (canUseSupabase() && supabase) {
    const { data: comments, error } = await (supabase as any)
      .from('comments')
      .select(`
        *,
        author:profiles!author_id(id, display_name, avatar_url)
      `)
      .eq('post_id', postId)
      .is('parent_id', null)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    
    // Get replies
    const { data: replies } = await (supabase as any)
      .from('comments')
      .select(`
        *,
        author:profiles!author_id(id, display_name, avatar_url)
      `)
      .eq('post_id', postId)
      .not('parent_id', 'is', null)
      .order('created_at', { ascending: true });
    
    // Get user's votes
    const { data: { user } } = await supabase.auth.getUser();
    let votes: Record<string, 'up' | 'down'> = {};
    
    if (user) {
      const { data: voteData } = await (supabase as any)
        .from('votes')
        .select('target_id, vote_type')
        .eq('user_id', user.id)
        .eq('target_type', 'comment');
      
      votes = (voteData || []).reduce((acc: Record<string, 'up' | 'down'>, v: any) => {
        acc[v.target_id] = v.vote_type;
        return acc;
      }, {} as Record<string, 'up' | 'down'>);
    }
    
    // Build comment tree
    const repliesByParent = (replies || []).reduce((acc: Record<string, any[]>, r: any) => {
      if (!acc[r.parent_id!]) acc[r.parent_id!] = [];
      acc[r.parent_id!].push({
        ...r,
        author: {
          id: r.author?.id || '',
          display_name: r.author?.display_name || 'Unknown',
          avatar_url: r.author?.avatar_url,
        },
        user_vote: votes[r.id] || null,
      });
      return acc;
    }, {} as Record<string, any[]>);
    
    return (comments || []).map((c: any) => ({
      ...c,
      author: {
        id: c.author?.id || '',
        display_name: c.author?.display_name || 'Unknown',
        avatar_url: c.author?.avatar_url,
      },
      user_vote: votes[c.id] || null,
      replies: repliesByParent[c.id] || [],
    })) as CommentWithAuthor[];
  }
  
  // Local storage mode
  let comments = JSON.parse(localStorage.getItem(STORAGE_KEYS.COMMENTS) || 'null');
  
  if (!comments) {
    // Import seed comments from original API
    const { getComments: getOriginalComments } = await import('./communityApi');
    comments = getOriginalComments(postId);
    localStorage.setItem(STORAGE_KEYS.COMMENTS, JSON.stringify(comments));
  } else {
    comments = comments.filter((c: any) => c.postId === postId || c.post_id === postId);
  }
  
  const votes = JSON.parse(localStorage.getItem(STORAGE_KEYS.VOTES) || '{}');
  
  return comments.map((c: any) => ({
    ...c,
    user_vote: votes[c.id] || null,
    userVote: votes[c.id] || null,
    createdAt: c.created_at || c.createdAt,
  }));
}

/**
 * Add a comment to a post
 */
export async function addComment(
  postId: string,
  content: string,
  parentId?: string
): Promise<CommentWithAuthor> {
  if (canUseSupabase() && supabase) {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.access_token) throw new Error('Must be logged in to comment');

    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
    const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;
    const fnUrl = `${supabaseUrl.replace(/\/$/, '')}/functions/v1/create-comment`;

    const res = await fetch(fnUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${session.access_token}`,
        apikey: anonKey,
      },
      body: JSON.stringify({
        post_id: postId,
        content,
        parent_id: parentId ?? null,
      }),
    });

    const payload = (await res.json()) as {
      error?: string;
      flagged?: boolean;
      categories?: Record<string, boolean>;
      comment?: CommentWithAuthor & { author?: { id: string; display_name: string; avatar_url?: string | null } };
    };

    if (!res.ok) {
      const msg = payload.error || 'Failed to post comment';
      const err = new Error(msg) as Error & { status?: number; flagged?: boolean; categories?: Record<string, boolean> };
      err.status = res.status;
      if (payload.flagged !== undefined) err.flagged = payload.flagged;
      if (payload.categories) err.categories = payload.categories;
      throw err;
    }

    if (!payload.comment) {
      throw new Error('Invalid response from comment service');
    }

    const c = payload.comment;
    return {
      ...c,
      author: {
        id: c.author?.id || '',
        display_name: c.author?.display_name || 'Unknown',
        avatar_url: c.author?.avatar_url,
      },
      user_vote: null,
    } as CommentWithAuthor;
  }
  
  // Local storage mode
  const comments = JSON.parse(localStorage.getItem(STORAGE_KEYS.COMMENTS) || '[]');
  const user = getLocalUser();
  
  const newComment = {
    id: `comment_${Date.now()}`,
    postId,
    post_id: postId,
    author: user,
    author_id: user.id,
    parentId,
    parent_id: parentId || null,
    content,
    createdAt: new Date().toISOString(),
    created_at: new Date().toISOString(),
    upvotes: 0,
    downvotes: 0,
    userVote: null,
    user_vote: null,
  };
  
  comments.push(newComment);
  localStorage.setItem(STORAGE_KEYS.COMMENTS, JSON.stringify(comments));
  
  // Update post comment count
  const posts = JSON.parse(localStorage.getItem(STORAGE_KEYS.POSTS) || '[]');
  const updatedPosts = posts.map((p: any) => {
    if (p.id === postId) {
      return {
        ...p,
        commentCount: (p.commentCount || p.comment_count || 0) + 1,
        comment_count: (p.comment_count || p.commentCount || 0) + 1,
      };
    }
    return p;
  });
  localStorage.setItem(STORAGE_KEYS.POSTS, JSON.stringify(updatedPosts));
  
  return newComment as any;
}

/**
 * Subscribe to real-time updates for a community
 */
export function subscribeToCommunityPosts(
  communityId: string,
  callback: (post: PostWithAuthor, eventType: 'INSERT' | 'UPDATE' | 'DELETE') => void
): () => void {
  if (!canUseSupabase() || !supabase) {
    return () => {}; // No-op for localStorage mode
  }
  
  const channel = supabase
    .channel(`community:${communityId}`)
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'posts',
        filter: `community_id=eq.${communityId}`,
      },
      async (payload: any) => {
        if (payload.eventType === 'DELETE') {
          callback(payload.old as any, 'DELETE');
        } else {
          // Fetch full post with author
          const { data: post } = await (supabase as any)
            .from('posts')
            .select(`
              *,
              author:profiles!author_id(id, display_name, avatar_url)
            `)
            .eq('id', payload.new.id)
            .single();
          
          if (post) {
            callback({
              ...post,
              author: {
                id: post.author?.id || '',
                display_name: post.author?.display_name || 'Unknown',
                avatar_url: post.author?.avatar_url,
              },
            } as PostWithAuthor, payload.eventType as 'INSERT' | 'UPDATE');
          }
        }
      }
    )
    .subscribe();
  
  return () => {
    supabase?.removeChannel(channel);
  };
}

/**
 * Subscribe to real-time updates for post comments
 */
export function subscribeToPostComments(
  postId: string,
  callback: (comment: CommentWithAuthor, eventType: 'INSERT' | 'UPDATE' | 'DELETE') => void
): () => void {
  if (!canUseSupabase() || !supabase) {
    return () => {}; // No-op for localStorage mode
  }
  
  const channel = supabase
    .channel(`post:${postId}:comments`)
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'comments',
        filter: `post_id=eq.${postId}`,
      },
      async (payload: any) => {
        if (payload.eventType === 'DELETE') {
          callback(payload.old as any, 'DELETE');
        } else {
          const { data: comment } = await (supabase as any)
            .from('comments')
            .select(`
              *,
              author:profiles!author_id(id, display_name, avatar_url)
            `)
            .eq('id', payload.new.id)
            .single();
          
          if (comment) {
            callback({
              ...comment,
              author: {
                id: comment.author?.id || '',
                display_name: comment.author?.display_name || 'Unknown',
                avatar_url: comment.author?.avatar_url,
              },
            } as CommentWithAuthor, payload.eventType as 'INSERT' | 'UPDATE');
          }
        }
      }
    )
    .subscribe();
  
  return () => {
    supabase?.removeChannel(channel);
  };
}
