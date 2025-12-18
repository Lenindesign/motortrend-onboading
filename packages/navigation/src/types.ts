/**
 * Navigation Types
 */

export interface NavigationLink {
  label: string;
  href: string;
  isActive?: boolean;
}

export interface MegaDropdown {
  type: 'news' | 'research' | 'rankings' | 'buy';
  newsCategories?: {
    allNews: NavigationLink;
    leftColumn: NavigationLink[];
    rightColumn: NavigationLink[];
  };
  storiesCategories?: NavigationLink[];
  featuredContent?: {
    title: string;
    image: string;
    badge?: string;
    href: string;
  };
  gridItems?: Array<{
    image: string;
    label: string;
    href: string;
  }>;
  rankings?: Array<{
    title: string;
    items: NavigationLink[];
  }>;
  awards?: Array<{
    image: string;
    title: string;
    href: string;
  }>;
}

export interface NavigationItem {
  label: string;
  href: string;
  hasMegaDropdown?: boolean;
  megaDropdown?: MegaDropdown;
  subItems?: NavigationLink[];
}

export interface SearchResult {
  id: string;
  year: string;
  make: string;
  model: string;
  image?: string;
  slug?: string;
}















