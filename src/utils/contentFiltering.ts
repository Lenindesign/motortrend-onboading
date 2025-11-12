/**
 * Content Filtering Utilities
 * Filter and sort content based on user preferences from onboarding
 */

export type ContentCategory = 
  | 'Family & Practical'
  | 'Performance & Enthusiast'
  | 'Daily Commute'
  | 'Adventure & Off-Road'
  | 'Urban & Style'
  | 'Eco & Future-Ready'
  | 'Luxury & Comfort'
  | 'Utility & Work';

export interface CategorizableContent {
  categories?: ContentCategory[];
  tags?: ContentCategory[];
}

/**
 * Get priority categories based on user type from onboarding
 * @param userType - User type from onboarding ('buyer', 'enthusiast', 'both')
 * @returns Array of priority categories
 */
export const getPriorityCategories = (userType: string | null): ContentCategory[] => {
  if (userType === 'buyer') {
    return ['Family & Practical', 'Daily Commute'];
  } else if (userType === 'enthusiast') {
    return ['Performance & Enthusiast'];
  } else if (userType === 'both') {
    return ['Family & Practical', 'Performance & Enthusiast'];
  }
  return [];
};

/**
 * Check if content matches any of the priority categories
 * @param content - Content item with categories or tags
 * @param priorityCategories - Array of priority categories
 * @returns True if content matches any priority category
 */
export const matchesPriorityCategories = (
  content: CategorizableContent,
  priorityCategories: ContentCategory[]
): boolean => {
  if (priorityCategories.length === 0) return true; // No filtering if no priorities
  
  const contentCategories = content.categories || content.tags || [];
  return priorityCategories.some(priority => 
    contentCategories.includes(priority)
  );
};

/**
 * Sort content to prioritize items matching user preferences
 * @param content - Array of content items
 * @param userType - User type from onboarding
 * @returns Sorted array with priority items first
 */
export const sortContentByUserType = <T extends CategorizableContent>(
  content: T[],
  userType: string | null
): T[] => {
  const priorityCategories = getPriorityCategories(userType);
  
  if (priorityCategories.length === 0) {
    return content; // No sorting if no user type
  }
  
  return [...content].sort((a, b) => {
    const aMatches = matchesPriorityCategories(a, priorityCategories);
    const bMatches = matchesPriorityCategories(b, priorityCategories);
    
    // Priority items come first
    if (aMatches && !bMatches) return -1;
    if (!aMatches && bMatches) return 1;
    
    // Maintain original order for items with same priority
    return 0;
  });
};



