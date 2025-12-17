/**
 * Database Types for Supabase
 * Generated types for the Community feature database schema
 */

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string;
          display_name: string;
          avatar_url: string | null;
          bio: string | null;
          created_at: string;
          updated_at: string | null;
        };
        Insert: {
          id: string;
          email: string;
          display_name: string;
          avatar_url?: string | null;
          bio?: string | null;
          created_at?: string;
          updated_at?: string | null;
        };
        Update: {
          id?: string;
          email?: string;
          display_name?: string;
          avatar_url?: string | null;
          bio?: string | null;
          updated_at?: string | null;
        };
      };
      communities: {
        Row: {
          id: string;
          slug: string;
          name: string;
          description: string | null;
          icon_url: string | null;
          banner_url: string | null;
          member_count: number;
          rules: string[] | null;
          created_by: string;
          created_at: string;
          updated_at: string | null;
          is_official: boolean;
          publisher: string | null;
        };
        Insert: {
          id?: string;
          slug: string;
          name: string;
          description?: string | null;
          icon_url?: string | null;
          banner_url?: string | null;
          member_count?: number;
          rules?: string[] | null;
          created_by: string;
          created_at?: string;
          updated_at?: string | null;
          is_official?: boolean;
          publisher?: string | null;
        };
        Update: {
          slug?: string;
          name?: string;
          description?: string | null;
          icon_url?: string | null;
          banner_url?: string | null;
          member_count?: number;
          rules?: string[] | null;
          updated_at?: string | null;
          is_official?: boolean;
          publisher?: string | null;
        };
      };
      community_members: {
        Row: {
          id: string;
          community_id: string;
          user_id: string;
          joined_at: string;
          role: 'member' | 'moderator' | 'admin';
        };
        Insert: {
          id?: string;
          community_id: string;
          user_id: string;
          joined_at?: string;
          role?: 'member' | 'moderator' | 'admin';
        };
        Update: {
          role?: 'member' | 'moderator' | 'admin';
        };
      };
      posts: {
        Row: {
          id: string;
          community_id: string;
          author_id: string;
          title: string;
          content: string;
          image_url: string | null;
          upvotes: number;
          downvotes: number;
          comment_count: number;
          created_at: string;
          updated_at: string | null;
          is_pinned: boolean;
          is_locked: boolean;
        };
        Insert: {
          id?: string;
          community_id: string;
          author_id: string;
          title: string;
          content: string;
          image_url?: string | null;
          upvotes?: number;
          downvotes?: number;
          comment_count?: number;
          created_at?: string;
          updated_at?: string | null;
          is_pinned?: boolean;
          is_locked?: boolean;
        };
        Update: {
          title?: string;
          content?: string;
          image_url?: string | null;
          upvotes?: number;
          downvotes?: number;
          comment_count?: number;
          updated_at?: string | null;
          is_pinned?: boolean;
          is_locked?: boolean;
        };
      };
      comments: {
        Row: {
          id: string;
          post_id: string;
          author_id: string;
          parent_id: string | null;
          content: string;
          upvotes: number;
          downvotes: number;
          created_at: string;
          updated_at: string | null;
        };
        Insert: {
          id?: string;
          post_id: string;
          author_id: string;
          parent_id?: string | null;
          content: string;
          upvotes?: number;
          downvotes?: number;
          created_at?: string;
          updated_at?: string | null;
        };
        Update: {
          content?: string;
          upvotes?: number;
          downvotes?: number;
          updated_at?: string | null;
        };
      };
      votes: {
        Row: {
          id: string;
          user_id: string;
          target_id: string;
          target_type: 'post' | 'comment';
          vote_type: 'up' | 'down';
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          target_id: string;
          target_type: 'post' | 'comment';
          vote_type: 'up' | 'down';
          created_at?: string;
        };
        Update: {
          vote_type?: 'up' | 'down';
        };
      };
      saved_posts: {
        Row: {
          id: string;
          user_id: string;
          post_id: string;
          saved_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          post_id: string;
          saved_at?: string;
        };
        Update: never;
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      member_role: 'member' | 'moderator' | 'admin';
      vote_type: 'up' | 'down';
      target_type: 'post' | 'comment';
    };
  };
}

// Convenience types for API responses
export type Profile = Database['public']['Tables']['profiles']['Row'];
export type Community = Database['public']['Tables']['communities']['Row'];
export type CommunityMember = Database['public']['Tables']['community_members']['Row'];
export type Post = Database['public']['Tables']['posts']['Row'];
export type Comment = Database['public']['Tables']['comments']['Row'];
export type Vote = Database['public']['Tables']['votes']['Row'];
export type SavedPost = Database['public']['Tables']['saved_posts']['Row'];

// Extended types with related data
export interface PostWithAuthor extends Post {
  author: Profile;
  community?: Community;
  user_vote?: 'up' | 'down' | null;
  is_saved?: boolean;
}

export interface CommentWithAuthor extends Comment {
  author: Profile;
  user_vote?: 'up' | 'down' | null;
  replies?: CommentWithAuthor[];
}

export interface CommunityWithMembership extends Community {
  is_joined?: boolean;
  user_role?: 'member' | 'moderator' | 'admin' | null;
}

