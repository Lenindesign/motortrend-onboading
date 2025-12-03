/**
 * Utility functions for managing saved leads (listings) in localStorage
 */

import type { LocalListing } from '../components/LocalListingsSidebar/LocalListingsSidebar';

const STORAGE_KEY = 'savedLeads';
const METADATA_KEY = 'savedLeadsMetadata';

export interface SavedLeadMetadata {
  id: string;
  listing: LocalListing;
  savedAt: string;
  vehicleName: string;
}

/**
 * Get all saved lead IDs
 */
export const getSavedLeadIds = (): string[] => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch (error) {
    console.error('Error getting saved leads:', error);
    return [];
  }
};

/**
 * Get all saved lead metadata
 */
export const getSavedLeadsMetadata = (): Record<string, SavedLeadMetadata> => {
  try {
    const saved = localStorage.getItem(METADATA_KEY);
    return saved ? JSON.parse(saved) : {};
  } catch (error) {
    console.error('Error getting saved leads metadata:', error);
    return {};
  }
};

/**
 * Check if a lead is saved
 */
export const isLeadSaved = (leadId: string): boolean => {
  const savedIds = getSavedLeadIds();
  return savedIds.includes(leadId);
};

/**
 * Save a lead
 */
export const saveLead = (listing: LocalListing, vehicleName: string): void => {
  try {
    const savedIds = getSavedLeadIds();
    const metadata = getSavedLeadsMetadata();

    if (!savedIds.includes(listing.id)) {
      savedIds.push(listing.id);
      
      metadata[listing.id] = {
        id: listing.id,
        listing,
        savedAt: new Date().toISOString(),
        vehicleName
      };

      localStorage.setItem(STORAGE_KEY, JSON.stringify(savedIds));
      localStorage.setItem(METADATA_KEY, JSON.stringify(metadata));
      
      // Dispatch event to notify other components
      window.dispatchEvent(new CustomEvent('savedLeadsUpdated'));
    }
  } catch (error) {
    console.error('Error saving lead:', error);
  }
};

/**
 * Unsave a lead
 */
export const unsaveLead = (leadId: string): void => {
  try {
    const savedIds = getSavedLeadIds();
    const metadata = getSavedLeadsMetadata();

    const index = savedIds.indexOf(leadId);
    if (index > -1) {
      savedIds.splice(index, 1);
      delete metadata[leadId];

      localStorage.setItem(STORAGE_KEY, JSON.stringify(savedIds));
      localStorage.setItem(METADATA_KEY, JSON.stringify(metadata));
      
      // Dispatch event to notify other components
      window.dispatchEvent(new CustomEvent('savedLeadsUpdated'));
    }
  } catch (error) {
    console.error('Error unsaving lead:', error);
  }
};

/**
 * Toggle save state of a lead
 */
export const toggleSaveLead = (listing: LocalListing, vehicleName: string): boolean => {
  const isSaved = isLeadSaved(listing.id);
  
  if (isSaved) {
    unsaveLead(listing.id);
    return false;
  } else {
    saveLead(listing, vehicleName);
    return true;
  }
};

/**
 * Get all saved leads as an array
 */
export const getAllSavedLeads = (): SavedLeadMetadata[] => {
  const metadata = getSavedLeadsMetadata();
  return Object.values(metadata);
};

