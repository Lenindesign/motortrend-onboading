import React, { useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { useLocation, useNavigate } from 'react-router-dom';
import appleIcon from '../../assets/icons/apple-icon.svg';
import facebookIcon from '../../assets/icons/facebook-icon.svg';
import googleLogo from '../../assets/images/google-logo.svg';
import { canUseSupabase, signInWithProvider } from '../../lib/supabase';
import Icon from '../Icon';
import './SignInToSaveModal.css';
import { saveSignInToSaveIntent } from './signInToSaveIntent';
import type { SignInToSaveItemType } from './signInToSaveIntent';

export interface SignInToSaveModalProps {
  isOpen: boolean;
  onClose: () => void;
  itemType: SignInToSaveItemType;
  itemName?: string;
  itemImage?: string;
}

const itemConfig: Record<SignInToSaveItemType, { label: string; icon: string; copy: string }> = {
  vehicle: {
    label: 'vehicle',
    icon: 'directions_car',
    copy: 'Create a free account to save vehicles, get price alerts, and access your research from any device.',
  },
  article: {
    label: 'article',
    icon: 'article',
    copy: 'Create a free account to save articles, build your reading list, and access your research from any device.',
  },
  video: {
    label: 'video',
    icon: 'play_circle',
    copy: 'Create a free account to save videos, build your watch list, and access your research from any device.',
  },
};

const focusableSelector = [
  'a[href]',
  'button:not([disabled])',
  'textarea:not([disabled])',
  'input:not([disabled])',
  'select:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(',');

export const SignInToSaveModal: React.FC<SignInToSaveModalProps> = ({
  isOpen,
  onClose,
  itemType,
  itemName,
  itemImage,
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const modalRef = useRef<HTMLDivElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);
  const [showImage, setShowImage] = useState(Boolean(itemImage));
  const [authError, setAuthError] = useState<string | null>(null);
  const config = itemConfig[itemType];
  const currentPath = `${location.pathname}${location.search}${location.hash}`;

  const title = `Sign in to save this ${config.label}`;
  const titleId = useMemo(() => `sign-in-save-title-${itemType}`, [itemType]);
  const descriptionId = useMemo(() => `sign-in-save-description-${itemType}`, [itemType]);

  useEffect(() => {
    setShowImage(Boolean(itemImage));
  }, [itemImage]);

  useEffect(() => {
    if (!isOpen) return;

    previousFocusRef.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    window.setTimeout(() => {
      const focusable = modalRef.current?.querySelectorAll<HTMLElement>(focusableSelector);
      const firstFocusable = focusable?.[0];
      (firstFocusable ?? modalRef.current)?.focus();
    }, 0);

    return () => {
      document.body.style.overflow = originalOverflow;

      if (previousFocusRef.current && document.contains(previousFocusRef.current)) {
        previousFocusRef.current.focus();
      }
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        const isDesktop = window.matchMedia('(min-width: 768px)').matches;
        if (isDesktop) {
          event.preventDefault();
          onClose();
        }
        return;
      }

      if (event.key !== 'Tab' || !modalRef.current) return;

      const focusable = Array.from(modalRef.current.querySelectorAll<HTMLElement>(focusableSelector))
        .filter((element) => !element.hasAttribute('disabled') && element.offsetParent !== null);

      if (focusable.length === 0) {
        event.preventDefault();
        modalRef.current.focus();
        return;
      }

      const firstFocusable = focusable[0];
      const lastFocusable = focusable[focusable.length - 1];

      if (event.shiftKey && document.activeElement === firstFocusable) {
        event.preventDefault();
        lastFocusable.focus();
      } else if (!event.shiftKey && document.activeElement === lastFocusable) {
        event.preventDefault();
        firstFocusable.focus();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || typeof document === 'undefined') return null;

  const persistIntent = () => {
    saveSignInToSaveIntent({
      itemType,
      itemName,
      itemImage,
      returnTo: currentPath,
      createdAt: Date.now(),
    });
  };

  const routeToAuth = (mode: 'signin' | 'signup', provider?: 'google' | 'facebook' | 'apple') => {
    persistIntent();

    const params = new URLSearchParams();
    if (mode === 'signup') params.set('mode', 'signup');
    if (provider) params.set('provider', provider);
    params.set('returnTo', currentPath);

    onClose();
    navigate(`/signin?${params.toString()}`);
  };

  const handleSocialAuth = async (provider: 'google' | 'facebook' | 'apple') => {
    persistIntent();
    setAuthError(null);

    if (canUseSupabase()) {
      try {
        await signInWithProvider(provider, `${window.location.origin}${currentPath}`);
        return;
      } catch {
        setAuthError('We could not start that sign-in option. Try another method or continue with email.');
        return;
      }
    }

    routeToAuth('signin', provider);
  };

  const handleBackdropClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (event.target === event.currentTarget) {
      onClose();
    }
  };

  return createPortal(
    <div className="sign-in-save-overlay" onMouseDown={handleBackdropClick}>
      <div
        ref={modalRef}
        className="sign-in-save-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={descriptionId}
        tabIndex={-1}
      >
        <button
          type="button"
          className="sign-in-save-modal__close"
          onClick={onClose}
          aria-label="Close sign in to save modal"
        >
          <Icon name="close" size={20} />
        </button>

        <div className="sign-in-save-modal__inner">
          <header className="sign-in-save-modal__header">
            <div className="sign-in-save-modal__badge" aria-hidden="true">
              <Icon name={config.icon} variant="outlined" size={30} />
            </div>
            <p className="sign-in-save-modal__brand">MotorTrend</p>
            <h2 className="sign-in-save-modal__title" id={titleId}>
              {title}
            </h2>
            {itemName && (
              <p className="sign-in-save-modal__item-name">{itemName}</p>
            )}
            <p className="sign-in-save-modal__copy" id={descriptionId}>
              {config.copy}
            </p>
          </header>

          {itemImage && showImage && (
            <div className="sign-in-save-modal__media">
              <img
                src={itemImage}
                alt={itemName ? `${itemName} preview` : `${config.label} preview`}
                onError={() => setShowImage(false)}
              />
            </div>
          )}

          <div className="sign-in-save-modal__actions">
            <button
              type="button"
              className="sign-in-save-modal__social"
              onClick={() => handleSocialAuth('google')}
            >
              <img src={googleLogo} alt="" />
              <span>Continue with Google</span>
            </button>
            <button
              type="button"
              className="sign-in-save-modal__social"
              onClick={() => handleSocialAuth('facebook')}
            >
              <img src={facebookIcon} alt="" />
              <span>Continue with Facebook</span>
            </button>
            <button
              type="button"
              className="sign-in-save-modal__social"
              onClick={() => handleSocialAuth('apple')}
            >
              <img src={appleIcon} alt="" />
              <span>Continue with Apple</span>
            </button>

            <div className="sign-in-save-modal__divider">or</div>

            <button
              type="button"
              className="sign-in-save-modal__primary"
              onClick={() => routeToAuth('signup')}
            >
              Create Free Account
            </button>
            <button
              type="button"
              className="sign-in-save-modal__secondary"
              onClick={() => routeToAuth('signin')}
            >
              Sign In
            </button>
          </div>

          {authError && (
            <p className="sign-in-save-modal__error" role="alert">
              {authError}
            </p>
          )}

          <p className="sign-in-save-modal__legal">
            By continuing, you agree to our <a href="/terms">Terms</a> and{' '}
            <a href="/privacy">Privacy Policy</a>.
          </p>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default SignInToSaveModal;
