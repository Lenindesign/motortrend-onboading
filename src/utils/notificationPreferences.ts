export interface NotificationPreferences {
  breakingNews: boolean;
  savedVehicleUpdates: boolean;
  communityActivity: boolean;
  weeklyDigest: boolean;
  quietHours: boolean;
  quietHoursStart: string;
  quietHoursEnd: string;
}

const STORAGE_KEY = 'motortrendNotificationPreferences';

export const defaultNotificationPreferences: NotificationPreferences = {
  breakingNews: true,
  savedVehicleUpdates: true,
  communityActivity: true,
  weeklyDigest: true,
  quietHours: false,
  quietHoursStart: '22:00',
  quietHoursEnd: '07:00',
};

export function getNotificationPreferences(): NotificationPreferences {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return defaultNotificationPreferences;
    return { ...defaultNotificationPreferences, ...JSON.parse(stored) };
  } catch {
    return defaultNotificationPreferences;
  }
}

export function saveNotificationPreferences(preferences: NotificationPreferences): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(preferences));
  window.dispatchEvent(new CustomEvent('notificationPreferencesUpdated', { detail: preferences }));
}
