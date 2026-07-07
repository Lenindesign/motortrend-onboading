/**
 * AuthPromptModal Component
 * Displays a modal encouraging users to sign in or sign up.
 * Layout matches reference: icon, title, optional vehicle, benefits, social/email CTAs, footer.
 */

import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ModalShell } from '../atoms/ModalShell/ModalShell';
import Icon from '../Icon';
import type { IconVariant } from '../Icon';
import { saveAuthPromptIntent } from './authPromptIntent';

export type AuthPromptAction = 'save' | 'comment' | 'review' | 'rate' | 'bookmark' | 'default';

interface AuthPromptModalProps {
  isOpen: boolean;
  onClose: () => void;
  action?: AuthPromptAction;
  /** Custom title override */
  title?: string;
  /** Custom description override */
  description?: string;
  /** Optional vehicle name (e.g. for bookmark action) */
  vehicleName?: string;
  /** Optional vehicle image URL (shown when provided) */
  vehicleImageUrl?: string;
  /** Stable page/action context used to resume the gated action after auth */
  contextId?: string;
}

// Action-specific content (keep our new community copy for save/bookmark/default)
const actionContent: Record<AuthPromptAction, { title: string; supportingCopy: string; description: string; primaryButtonText?: string }> = {
  save: {
    title: 'Join for Free!',
    supportingCopy: 'Save this article to revisit it later and keep your MotorTrend research in one place.',
    description: 'Personalized experience\nCustom user profile page\nExclusive content\nSaved content',
    primaryButtonText: 'Join the Community',
  },
  comment: {
    title: 'Want to join the conversation?',
    supportingCopy: 'Sign in to add your perspective and help keep the discussion useful for other readers.',
    description: "Create an account to comment and engage with the community. It's free!",
  },
  review: {
    title: 'Want to share your review?',
    supportingCopy: 'Share your ownership experience to help other shoppers understand what this vehicle is like in real life.',
    description: "Create an account to write reviews and help other car enthusiasts. It's free!",
  },
  rate: {
    title: 'Want to rate this vehicle?',
    supportingCopy: 'Rate this vehicle to help other shoppers compare real community feedback while they research their next car.',
    description: "Create an account to rate vehicles and see personalized recommendations. It's free!",
  },
  bookmark: {
    title: 'Join for Free!',
    supportingCopy: 'Save this vehicle to track your research, compare options, and come back from any device.',
    description: 'Personalized experience\nCustom user profile page\nExclusive content\nSaved content',
    primaryButtonText: 'Join the Community',
  },
  default: {
    title: 'Join for Free!',
    supportingCopy: 'Create a free account to save your MotorTrend research and pick up where you left off.',
    description: 'Personalized experience\nCustom user profile page\nExclusive content\nSaved content',
    primaryButtonText: 'Join the Community',
  },
};

const PRIMARY = 'var(--color-primary-1, #E90C17)';

const actionIcon: Record<AuthPromptAction, { name: string; variant: IconVariant }> = {
  save: { name: 'bookmark', variant: 'outlined' },
  comment: { name: 'forum', variant: 'outlined' },
  review: { name: 'rate_review', variant: 'outlined' },
  rate: { name: 'star', variant: 'filled' },
  bookmark: { name: 'bookmark', variant: 'outlined' },
  default: { name: 'bookmark', variant: 'outlined' },
};

export const AuthPromptModal: React.FC<AuthPromptModalProps> = ({
  isOpen,
  onClose,
  action = 'default',
  title: customTitle,
  description: customDescription,
  vehicleName,
  vehicleImageUrl,
  contextId,
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const content = actionContent[action];
  const title = customTitle || content.title;
  const supportingCopy = content.supportingCopy;
  const description = customDescription ?? content.description;
  const primaryButtonText = content.primaryButtonText ?? 'Sign Up';
  const descriptionLines = description.split('\n').filter(Boolean);
  const icon = actionIcon[action];
  const currentPath = `${location.pathname}${location.search}${location.hash}`;

  const persistIntent = () => {
    saveAuthPromptIntent({
      action,
      returnTo: currentPath,
      contextId,
      createdAt: Date.now(),
    });
  };

  const routeToAuth = (mode: 'signin' | 'signup', provider?: 'google' | 'apple') => {
    persistIntent();

    const params = new URLSearchParams();
    if (mode === 'signup') params.set('mode', 'signup');
    if (provider) params.set('provider', provider);
    params.set('returnTo', currentPath);

    onClose();
    navigate(`/signin?${params.toString()}`);
  };

  const handleSocialAuth = (provider: 'google' | 'apple') => {
    routeToAuth('signin', provider);
  };

  const handleSignUp = () => {
    routeToAuth('signup');
  };

  const handleSignIn = () => {
    routeToAuth('signin');
  };

  const handleApple = () => {
    handleSocialAuth('apple');
  };

  const handleGoogle = () => {
    handleSocialAuth('google');
  };

  return (
    <ModalShell
      isOpen={isOpen}
      onClose={onClose}
      maxWidth="440px"
      width="440px"
      overlayVariant="medium"
      animation="fade-slide"
      zIndex={1100}
    >
      <div style={{ position: 'relative', padding: '32px 28px 24px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        {/* Close button */}
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          style={{
            position: 'absolute',
            top: '16px',
            right: '16px',
            width: '32px',
            height: '32px',
            borderRadius: '50%',
            border: 'none',
            background: 'var(--color-neutrals-7, #F4F4F5)',
            color: 'var(--color-neutrals-4, #6E7481)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Icon name="close" size={18} />
        </button>

        {/* Circular action icon */}
        <div
          style={{
            width: '56px',
            height: '56px',
            borderRadius: '50%',
            background: PRIMARY,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '16px',
          }}
        >
          <Icon name={icon.name} variant={icon.variant} size={28} style={{ color: '#fff' }} />
        </div>

        {/* Title */}
        <h2
          style={{
            fontFamily: 'var(--font-heading, Poppins, sans-serif)',
            fontSize: '22px',
            fontWeight: 700,
            color: 'var(--color-neutrals-1, #141416)',
            margin: 0,
            lineHeight: 1.3,
            textAlign: 'center',
            maxWidth: '340px',
          }}
        >
          {title}
        </h2>

        <p
          style={{
            fontFamily: 'var(--font-body, Geist, sans-serif)',
            fontSize: '16px',
            fontWeight: 500,
            color: 'var(--color-neutrals-3, #353945)',
            margin: '8px 0 0',
            lineHeight: 1.4,
            textAlign: 'center',
            maxWidth: '340px',
          }}
        >
          {supportingCopy}
        </p>

        {/* Optional vehicle name */}
        {vehicleName && (
          <p
            style={{
              fontFamily: 'var(--font-body, Geist, sans-serif)',
              fontSize: '15px',
              fontWeight: 600,
              color: PRIMARY,
              margin: '6px 0 0',
            }}
          >
            {vehicleName}
          </p>
        )}

        {/* Description / benefits */}
        <div style={{ width: '100%', maxWidth: '340px', marginTop: '12px', textAlign: descriptionLines.length > 1 ? 'left' : 'center' }}>
          {descriptionLines.length > 1 ? (
            descriptionLines.map((line, i) => (
              <p
                key={i}
                style={{
                  fontFamily: 'var(--font-body, Geist, sans-serif)',
                  fontSize: '14px',
                  fontWeight: 400,
                  color: 'var(--color-neutrals-3, #353945)',
                  margin: 0,
                  marginTop: i === 0 ? 0 : '6px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                }}
              >
                <span style={{ color: PRIMARY, flexShrink: 0 }}>•</span>
                <span>{line}</span>
              </p>
            ))
          ) : (
            <p
              style={{
                fontFamily: 'var(--font-body, Geist, sans-serif)',
                fontSize: '14px',
                color: 'var(--color-neutrals-3, #353945)',
                margin: 0,
                lineHeight: 1.5,
              }}
            >
              {description}
            </p>
          )}
        </div>

        {/* Optional vehicle image */}
        {vehicleImageUrl && (
          <div
            style={{
              width: '100%',
              maxWidth: '340px',
              height: '120px',
              borderRadius: 'var(--border-radius-md, 8px)',
              overflow: 'hidden',
              marginTop: '16px',
              background: 'var(--color-neutrals-7)',
            }}
          >
            <img
              src={vehicleImageUrl}
              alt=""
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          </div>
        )}

        {/* Buttons: Google, Apple, or, Primary, Sign In */}
        <div style={{ width: '100%', maxWidth: '340px', marginTop: '24px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <button
            type="button"
            onClick={handleGoogle}
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '10px',
              padding: '12px 16px',
              background: '#fff',
              color: 'var(--color-neutrals-1)',
              border: '1px solid var(--color-neutrals-6, #E6E8EC)',
              borderRadius: 'var(--border-radius-md, 8px)',
              fontFamily: 'var(--font-body, Geist, sans-serif)',
              fontSize: '15px',
              fontWeight: 500,
              cursor: 'pointer',
            }}
          >
            <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
              <path fill="#4285F4" d="M16.51 8H8.98v3h4.3c-.18 1-.74 1.48-1.6 2.04v2.01h2.6a7.8 7.8 0 0 0 2.38-5.88c0-.57-.05-.66-.15-1.18z" />
              <path fill="#34A853" d="M8.98 17c2.16 0 3.97-.72 5.3-1.94l-2.6-2a4.8 4.8 0 0 1-7.18-2.54H1.83v2.07A8 8 0 0 0 8.98 17z" />
              <path fill="#FBBC05" d="M4.5 10.52a4.8 4.8 0 0 1 0-3.04V5.41H1.83a8 8 0 0 0 0 7.18l2.67-2.07z" />
              <path fill="#EA4335" d="M8.98 4.18c1.17 0 2.23.4 3.06 1.2l2.3-2.3A8 8 0 0 0 1.83 5.4L4.5 7.49a4.77 4.77 0 0 1 4.48-3.3z" />
            </svg>
            Continue with Google
          </button>

          <button
            type="button"
            onClick={handleApple}
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '10px',
              padding: '12px 16px',
              background: 'var(--color-neutrals-1, #141416)',
              color: '#fff',
              border: 'none',
              borderRadius: 'var(--border-radius-md, 8px)',
              fontFamily: 'var(--font-body, Geist, sans-serif)',
              fontSize: '15px',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 6.98.48 9.13-.57 1.5-1.31 2.99-2.54 4.09zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
            </svg>
            Continue with Apple
          </button>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', margin: '4px 0' }}>
            <span style={{ flex: 1, height: 1, background: 'var(--color-neutrals-6)' }} />
            <span style={{ fontFamily: 'var(--font-body)', fontSize: '13px', color: 'var(--color-neutrals-5)' }}>or</span>
            <span style={{ flex: 1, height: 1, background: 'var(--color-neutrals-6)' }} />
          </div>

          <button
            type="button"
            onClick={handleSignUp}
            style={{
              width: '100%',
              padding: '12px 16px',
              background: 'var(--color-neutrals-1, #141416)',
              color: '#fff',
              border: 'none',
              borderRadius: 'var(--border-radius-md, 8px)',
              fontFamily: 'var(--font-body, Geist, sans-serif)',
              fontSize: '15px',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            {primaryButtonText}
          </button>

          <button
            type="button"
            onClick={handleSignIn}
            style={{
              width: '100%',
              padding: '12px 16px',
              background: 'transparent',
              color: 'var(--color-neutrals-1, #141416)',
              border: '2px solid var(--color-neutrals-1, #141416)',
              borderRadius: 'var(--border-radius-md, 8px)',
              fontFamily: 'var(--font-body, Geist, sans-serif)',
              fontSize: '15px',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            Sign In
          </button>
        </div>

        {/* Footer */}
        <p
          style={{
            marginTop: '20px',
            fontFamily: 'var(--font-body, Geist, sans-serif)',
            fontSize: '12px',
            color: 'var(--color-neutrals-5, #B1B5C3)',
            textAlign: 'center',
            maxWidth: '320px',
          }}
        >
          By continuing, you agree to our{' '}
          <a href="/terms" style={{ color: 'var(--color-neutrals-1, #141416)', textDecoration: 'underline' }}>Terms</a>
          {' '}and{' '}
          <a href="/privacy" style={{ color: 'var(--color-neutrals-1, #141416)', textDecoration: 'underline' }}>Privacy Policy</a>.
        </p>
      </div>
    </ModalShell>
  );
};

export default AuthPromptModal;
