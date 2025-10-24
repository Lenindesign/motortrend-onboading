/**
 * Custom hook for responsive navigation
 * Hides navigation items from right to left as screen space gets smaller
 */

import { useState, useEffect, useRef } from 'react';

export interface NavigationItem {
  label: string;
  href: string;
}

export const useResponsiveNavigation = (items: NavigationItem[]) => {
  const [visibleItems, setVisibleItems] = useState<NavigationItem[]>(items);
  const [hiddenItems, setHiddenItems] = useState<NavigationItem[]>([]);
  const navRef = useRef<HTMLElement>(null);
  const [showMoreMenu, setShowMoreMenu] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      if (!navRef.current) return;

      const navContainer = navRef.current;
      const containerWidth = navContainer.offsetWidth;
      const availableWidth = containerWidth - 200; // Reserve space for logo and right section
      
      // Get all nav items
      const navItems = navContainer.querySelectorAll('.global-header__nav-link');
      if (navItems.length === 0) return;

      let totalWidth = 0;
      let visibleCount = 0;
      const newVisibleItems: NavigationItem[] = [];
      const newHiddenItems: NavigationItem[] = [];

      // Calculate which items can fit
      for (let i = 0; i < items.length; i++) {
        const item = navItems[i] as HTMLElement;
        if (!item) continue;

        const itemWidth = item.offsetWidth + 24; // Include gap
        totalWidth += itemWidth;

        if (totalWidth <= availableWidth) {
          newVisibleItems.push(items[i]);
          visibleCount++;
        } else {
          newHiddenItems.push(items[i]);
        }
      }

      // If we have hidden items, we need to show a "More" menu
      if (newHiddenItems.length > 0) {
        // Reserve space for "More" button
        const moreButtonWidth = 60; // Approximate width of "More" button
        if (totalWidth + moreButtonWidth > availableWidth && newVisibleItems.length > 0) {
          // Move the last visible item to hidden items
          const lastVisible = newVisibleItems.pop();
          if (lastVisible) {
            newHiddenItems.unshift(lastVisible);
          }
        }
      }

      setVisibleItems(newVisibleItems);
      setHiddenItems(newHiddenItems);
    };

    // Initial calculation
    handleResize();

    // Add resize listener
    window.addEventListener('resize', handleResize);
    
    // Also listen for orientation changes
    window.addEventListener('orientationchange', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleResize);
    };
  }, [items]);

  return {
    visibleItems,
    hiddenItems,
    navRef,
    showMoreMenu,
    setShowMoreMenu
  };
};
