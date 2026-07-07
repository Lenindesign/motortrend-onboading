import type { AuthPromptAction } from './AuthPromptModal';

export interface AuthPromptIntent {
  action: AuthPromptAction;
  returnTo: string;
  contextId?: string;
  createdAt: number;
}

const PENDING_AUTH_PROMPT_KEY = 'motortrend:auth-prompt-intent';
const INTENT_MAX_AGE_MS = 60 * 60 * 1000;

function canUseSessionStorage(): boolean {
  try {
    return typeof window !== 'undefined' && typeof window.sessionStorage !== 'undefined';
  } catch {
    return false;
  }
}

export function saveAuthPromptIntent(intent: AuthPromptIntent): void {
  if (!canUseSessionStorage()) return;

  window.sessionStorage.setItem(PENDING_AUTH_PROMPT_KEY, JSON.stringify(intent));
}

export function getAuthPromptIntent(): AuthPromptIntent | null {
  if (!canUseSessionStorage()) return null;

  try {
    const rawIntent = window.sessionStorage.getItem(PENDING_AUTH_PROMPT_KEY);
    if (!rawIntent) return null;

    const intent = JSON.parse(rawIntent) as AuthPromptIntent;
    if (!intent.createdAt || Date.now() - intent.createdAt > INTENT_MAX_AGE_MS) {
      window.sessionStorage.removeItem(PENDING_AUTH_PROMPT_KEY);
      return null;
    }

    return intent;
  } catch {
    window.sessionStorage.removeItem(PENDING_AUTH_PROMPT_KEY);
    return null;
  }
}

export function clearAuthPromptIntent(): void {
  if (!canUseSessionStorage()) return;

  window.sessionStorage.removeItem(PENDING_AUTH_PROMPT_KEY);
}
