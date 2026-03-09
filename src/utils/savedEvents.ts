/**
 * Utility for saved events in the user profile.
 * Persists to localStorage and supports reminder preference (1 day, 1 week before).
 */

export type EventReminder = 'none' | '1day' | '1week';

export interface SavedEventMetadata {
  eventId: string;
  slug: string;
  title: string;
  brand: string;
  brandName: string;
  dates: { start: string; end: string; displayText: string };
  locationPrimary: string;
  heroImage: string;
  savedAt: string;
  reminder: EventReminder;
}

const STORAGE_KEY = 'savedEvents';
const METADATA_KEY = 'savedEventsMetadata';

export const getSavedEventIds = (): string[] => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch (e) {
    console.error('Error getting saved events:', e);
    return [];
  }
};

export const getSavedEventsMetadata = (): Record<string, SavedEventMetadata> => {
  try {
    const saved = localStorage.getItem(METADATA_KEY);
    return saved ? JSON.parse(saved) : {};
  } catch (e) {
    console.error('Error getting saved events metadata:', e);
    return {};
  }
};

export const isEventSaved = (eventId: string): boolean =>
  getSavedEventIds().includes(eventId);

export const saveEvent = (meta: Omit<SavedEventMetadata, 'savedAt' | 'reminder'>): void => {
  try {
    const ids = getSavedEventIds();
    const metadata = getSavedEventsMetadata();
    if (ids.includes(meta.eventId)) return;
    ids.push(meta.eventId);
    metadata[meta.eventId] = {
      ...meta,
      savedAt: new Date().toISOString(),
      reminder: '1week',
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
    localStorage.setItem(METADATA_KEY, JSON.stringify(metadata));
    window.dispatchEvent(new CustomEvent('savedEventsUpdated'));
  } catch (e) {
    console.error('Error saving event:', e);
  }
};

export const unsaveEvent = (eventId: string): void => {
  try {
    const ids = getSavedEventIds();
    const metadata = getSavedEventsMetadata();
    const i = ids.indexOf(eventId);
    if (i === -1) return;
    ids.splice(i, 1);
    delete metadata[eventId];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
    localStorage.setItem(METADATA_KEY, JSON.stringify(metadata));
    window.dispatchEvent(new CustomEvent('savedEventsUpdated'));
  } catch (e) {
    console.error('Error unsaving event:', e);
  }
};

export const setEventReminder = (eventId: string, reminder: EventReminder): void => {
  try {
    const metadata = getSavedEventsMetadata();
    if (!metadata[eventId]) return;
    metadata[eventId].reminder = reminder;
    localStorage.setItem(METADATA_KEY, JSON.stringify(metadata));
    window.dispatchEvent(new CustomEvent('savedEventsUpdated'));
  } catch (e) {
    console.error('Error setting event reminder:', e);
  }
};

export const getAllSavedEvents = (): SavedEventMetadata[] => {
  const meta = getSavedEventsMetadata();
  return Object.values(meta).sort(
    (a, b) => new Date(b.savedAt).getTime() - new Date(a.savedAt).getTime()
  );
};

/** Human-readable reminder label for UI */
export const getReminderLabel = (r: EventReminder): string => {
  switch (r) {
    case '1day': return '1 day before';
    case '1week': return '1 week before';
    default: return 'No reminder';
  }
};
