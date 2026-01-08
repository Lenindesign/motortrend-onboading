/**
 * AuthPromptModal Component
 * Displays a modal encouraging users to sign in or sign up
 * when they attempt actions requiring authentication
 */

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ModalShell } from '../atoms/ModalShell/ModalShell';

export type AuthPromptAction = 'save' | 'comment' | 'review' | 'rate' | 'bookmark' | 'default';

interface AuthPromptModalProps {
  isOpen: boolean;
  onClose: () => void;
  action?: AuthPromptAction;
  /** Custom title override */
  title?: string;
  /** Custom description override */
  description?: string;
}

// Action-specific content
const actionContent: Record<AuthPromptAction, { title: string; description: string }> = {
  save: {
    title: 'Want to save this article?',
    description: "Create an account and you'll be able to save and revisit articles. It's free!",
  },
  comment: {
    title: 'Want to join the conversation?',
    description: "Create an account to comment and engage with the community. It's free!",
  },
  review: {
    title: 'Want to share your review?',
    description: "Create an account to write reviews and help other car enthusiasts. It's free!",
  },
  rate: {
    title: 'Want to rate this vehicle?',
    description: "Create an account to rate vehicles and see personalized recommendations. It's free!",
  },
  bookmark: {
    title: 'Want to bookmark this vehicle?',
    description: "Create an account to save vehicles and build your garage. It's free!",
  },
  default: {
    title: 'Sign in to continue',
    description: "Create an account to unlock all features and personalize your experience. It's free!",
  },
};

export const AuthPromptModal: React.FC<AuthPromptModalProps> = ({
  isOpen,
  onClose,
  action = 'default',
  title: customTitle,
  description: customDescription,
}) => {
  const navigate = useNavigate();
  
  const content = actionContent[action];
  const title = customTitle || content.title;
  const description = customDescription || content.description;

  const handleSignUp = () => {
    onClose();
    navigate('/signin?mode=signup');
  };

  const handleSignIn = () => {
    onClose();
    navigate('/signin');
  };

  // Styles
  const containerStyle: React.CSSProperties = {
    padding: '48px 40px',
    textAlign: 'center',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '16px',
  };

  const titleStyle: React.CSSProperties = {
    fontFamily: 'var(--font-heading, "Geist", sans-serif)',
    fontSize: '28px',
    fontWeight: 700,
    color: 'var(--color-neutrals-1, #141416)',
    margin: 0,
    lineHeight: 1.2,
  };

  const descriptionStyle: React.CSSProperties = {
    fontFamily: 'var(--font-body, "Geist", sans-serif)',
    fontSize: '16px',
    fontWeight: 400,
    color: 'var(--color-neutrals-4, #6F6F77)',
    margin: 0,
    lineHeight: 1.5,
    maxWidth: '320px',
  };

  const buttonContainerStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    marginTop: '16px',
  };

  const signUpButtonStyle: React.CSSProperties = {
    fontFamily: 'var(--font-body, "Geist", sans-serif)',
    fontSize: '14px',
    fontWeight: 600,
    color: 'var(--color-white, #FFFFFF)',
    backgroundColor: 'var(--color-neutrals-1, #141416)',
    border: 'none',
    borderRadius: '8px',
    padding: '14px 32px',
    cursor: 'pointer',
    transition: 'background-color 0.2s ease, transform 0.1s ease',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  };

  const signInButtonStyle: React.CSSProperties = {
    fontFamily: 'var(--font-body, "Geist", sans-serif)',
    fontSize: '14px',
    fontWeight: 600,
    color: 'var(--color-neutrals-1, #141416)',
    backgroundColor: 'transparent',
    border: 'none',
    padding: '14px 16px',
    cursor: 'pointer',
    textDecoration: 'underline',
    textUnderlineOffset: '4px',
    transition: 'color 0.2s ease',
  };

  return (
    <ModalShell
      isOpen={isOpen}
      onClose={onClose}
      maxWidth="440px"
      overlayVariant="medium"
      animation="fade-slide"
      zIndex={1100}
    >
      <div style={containerStyle}>
        <h2 style={titleStyle}>{title}</h2>
        <p style={descriptionStyle}>{description}</p>
        
        <div style={buttonContainerStyle}>
          <button
            style={signUpButtonStyle}
            onClick={handleSignUp}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'var(--color-neutrals-2, #23262F)';
              e.currentTarget.style.transform = 'translateY(-1px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'var(--color-neutrals-1, #141416)';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            Sign Up
          </button>
          
          <button
            style={signInButtonStyle}
            onClick={handleSignIn}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = 'var(--color-neutrals-3, #353945)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = 'var(--color-neutrals-1, #141416)';
            }}
          >
            Sign In
          </button>
        </div>
      </div>
    </ModalShell>
  );
};

export default AuthPromptModal;
