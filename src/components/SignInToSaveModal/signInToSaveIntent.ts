export type SignInToSaveItemType = 'vehicle' | 'article' | 'video';

export interface SignInToSaveIntent {
  itemType: SignInToSaveItemType;
  itemName?: string;
  itemImage?: string;
  returnTo: string;
  createdAt: number;
}

const PENDING_SAVE_KEY = 'motortrend:sign-in-to-save';
const INTENT_MAX_AGE_MS = 60 * 60 * 1000;

function canUseSessionStorage(): boolean {
  try {
    return typeof window !== 'undefined' && typeof window.sessionStorage !== 'undefined';
  } catch {
    return false;
  }
}

export function saveSignInToSaveIntent(intent: SignInToSaveIntent): void {
  if (!canUseSessionStorage()) return;

  window.sessionStorage.setItem(PENDING_SAVE_KEY, JSON.stringify(intent));
}

export function getSignInToSaveIntent(): SignInToSaveIntent | null {
  if (!canUseSessionStorage()) return null;

  try {
    const rawIntent = window.sessionStorage.getItem(PENDING_SAVE_KEY);
    if (!rawIntent) return null;

    const intent = JSON.parse(rawIntent) as SignInToSaveIntent;
    if (!intent.createdAt || Date.now() - intent.createdAt > INTENT_MAX_AGE_MS) {
      window.sessionStorage.removeItem(PENDING_SAVE_KEY);
      return null;
    }

    return intent;
  } catch {
    window.sessionStorage.removeItem(PENDING_SAVE_KEY);
    return null;
  }
}

export function clearSignInToSaveIntent(): void {
  if (!canUseSessionStorage()) return;

  window.sessionStorage.removeItem(PENDING_SAVE_KEY);
}
