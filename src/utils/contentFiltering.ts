/**
 * Content Filtering Utilities
 * Filter and sort content based on user preferences from onboarding
 * Supports both userType and persona-based personalization
 */

import type { PersonaName, Persona } from './personas';
import { getPersonaFromOnboarding, personas } from './personas';

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
  category?: string; // Article category like 'MotorTrend | Reviews'
  type?: string; // Content type like 'Article'
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
 * Get priority categories based on persona
 * @param persona - Persona object or null
 * @returns Array of priority categories
 */
export const getPriorityCategoriesFromPersona = (persona: Persona | null): ContentCategory[] => {
  if (!persona) return [];
  return persona.priorityCategories;
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
 * Check if content matches persona preferences
 * @param content - Content item
 * @param persona - Persona object
 * @returns Score indicating how well content matches persona (0-1)
 */
export const getPersonaMatchScore = (
  content: CategorizableContent,
  persona: Persona
): number => {
  let score = 0;
  
  // Check category match (highest weight)
  const contentCategories = content.categories || content.tags || [];
  const categoryMatches = persona.priorityCategories.filter(cat => 
    contentCategories.includes(cat)
  ).length;
  if (persona.priorityCategories.length > 0) {
    score += (categoryMatches / persona.priorityCategories.length) * 0.6;
  }
  
  // Check article type match (medium weight)
  if (content.category && persona.preferredArticleTypes.length > 0) {
    const categoryLower = content.category.toLowerCase();
    const matchesArticleType = persona.preferredArticleTypes.some(type => 
      categoryLower.includes(type.toLowerCase())
    );
    if (matchesArticleType) {
      score += 0.3;
    }
  }
  
  // Base score for any content (lowest weight)
  score += 0.1;
  
  return Math.min(score, 1.0);
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

/**
 * Sort content based on persona preferences
 * Uses persona match scoring to prioritize content
 * @param content - Array of content items
 * @param personaName - Persona name or null
 * @returns Sorted array with best matching items first
 */
export const sortContentByPersona = <T extends CategorizableContent>(
  content: T[],
  personaName: PersonaName | null
): T[] => {
  if (!personaName) {
    return content;
  }
  
  const persona = personas[personaName];
  
  if (!persona) {
    return content;
  }
  
  // Score and sort content
  return [...content].sort((a, b) => {
    const aScore = getPersonaMatchScore(a, persona);
    const bScore = getPersonaMatchScore(b, persona);
    
    // Higher scores come first
    return bScore - aScore;
  });
};

/**
 * Smart content sorting that uses persona if available, otherwise falls back to userType
 * @param content - Array of content items
 * @param userType - User type from onboarding
 * @returns Sorted array with personalized content first
 */
export const sortContentForPersonalization = <T extends CategorizableContent>(
  content: T[],
  userType: string | null
): T[] => {
  // Try to get persona from onboarding
  const personaName = getPersonaFromOnboarding();
  
  if (personaName) {
    // Use persona-based sorting
    return sortContentByPersona(content, personaName);
  }
  
  // Fall back to userType-based sorting
  return sortContentByUserType(content, userType);
};



