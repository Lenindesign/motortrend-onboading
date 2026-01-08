/**
 * useAuthPrompt Hook
 * Provides a convenient way to show the auth prompt modal
 * when users attempt actions requiring authentication
 */

import { useState, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';
import type { AuthPromptAction } from '../components/AuthPromptModal';

interface UseAuthPromptReturn {
  /** Whether the auth prompt modal is open */
  isAuthPromptOpen: boolean;
  /** The action type that triggered the prompt */
  promptAction: AuthPromptAction;
  /** Open the auth prompt modal */
  openAuthPrompt: (action?: AuthPromptAction) => void;
  /** Close the auth prompt modal */
  closeAuthPrompt: () => void;
  /** 
   * Check if user is authenticated, if not show prompt and return false
   * If authenticated, return true so the action can proceed
   */
  requireAuth: (action?: AuthPromptAction) => boolean;
  /**
   * Wrap an action function to require authentication
   * If not authenticated, shows prompt. If authenticated, executes the action.
   */
  withAuthCheck: <T extends (...args: unknown[]) => unknown>(
    action: T,
    promptAction?: AuthPromptAction
  ) => (...args: Parameters<T>) => ReturnType<T> | void;
}

export function useAuthPrompt(): UseAuthPromptReturn {
  const { isAuthenticated } = useAuth();
  const [isAuthPromptOpen, setIsAuthPromptOpen] = useState(false);
  const [promptAction, setPromptAction] = useState<AuthPromptAction>('default');

  const openAuthPrompt = useCallback((action: AuthPromptAction = 'default') => {
    setPromptAction(action);
    setIsAuthPromptOpen(true);
  }, []);

  const closeAuthPrompt = useCallback(() => {
    setIsAuthPromptOpen(false);
  }, []);

  const requireAuth = useCallback((action: AuthPromptAction = 'default'): boolean => {
    if (isAuthenticated) {
      return true;
    }
    openAuthPrompt(action);
    return false;
  }, [isAuthenticated, openAuthPrompt]);

  const withAuthCheck = useCallback(<T extends (...args: unknown[]) => unknown>(
    action: T,
    promptActionType: AuthPromptAction = 'default'
  ) => {
    return (...args: Parameters<T>): ReturnType<T> | void => {
      if (requireAuth(promptActionType)) {
        return action(...args) as ReturnType<T>;
      }
    };
  }, [requireAuth]);

  return {
    isAuthPromptOpen,
    promptAction,
    openAuthPrompt,
    closeAuthPrompt,
    requireAuth,
    withAuthCheck,
  };
}

export default useAuthPrompt;
