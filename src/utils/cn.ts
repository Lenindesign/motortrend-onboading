/**
 * Utility function for conditionally joining class names
 * Works with clsx and tailwind-merge for optimal class merging
 */

import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Combines class names using clsx and tailwind-merge
 * This ensures proper handling of Tailwind CSS class conflicts
 * 
 * @example
 * cn('px-4 py-2', isActive && 'bg-blue-500', 'text-white')
 * // Returns: 'px-4 py-2 bg-blue-500 text-white' (when isActive is true)
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

export default cn;
