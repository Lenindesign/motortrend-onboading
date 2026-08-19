/**
 * Authentication Modal Component
 * Sign in / Sign up modal for Community features
 */

import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { canUseSupabase } from '../../lib/supabase';
import Icon from '../Icon';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: 'signin' | 'signup';
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  initialMode = 'signin',
}) => {
  const [mode, setMode] = useState<'signin' | 'signup'>(initialMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);
  
  // Hover states
  const [isCloseHovered, setIsCloseHovered] = useState(false);
  const [isSubmitHovered, setIsSubmitHovered] = useState(false);
  const [isGoogleHovered, setIsGoogleHovered] = useState(false);
  const [focusedInput, setFocusedInput] = useState<string | null>(null);
  
  const { signIn, signUp, signInWithGoogle, setDemoUser, error: authError, clearError } = useAuth();

  if (!isOpen) return null;

  const isSupabaseMode = canUseSupabase();
  const error = localError || authError;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);
    clearError();
    setIsSubmitting(true);

    try {
      if (!isSupabaseMode) {
        // Demo mode - just set the display name
        if (!displayName.trim()) {
          setLocalError('Please enter a display name');
          setIsSubmitting(false);
          return;
        }
        setDemoUser(displayName);
        onClose();
        return;
      }

      if (mode === 'signin') {
        await signIn(email, password);
      } else {
        if (!displayName.trim()) {
          setLocalError('Please enter a display name');
          setIsSubmitting(false);
          return;
        }
        await signUp(email, password, displayName);
      }
      onClose();
    } catch (err) {
      // Error is handled by auth context
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setLocalError(null);
    try {
      await signInWithGoogle();
    } catch {
      // Error handled by auth context
    }
  };

  // Styles
  const overlayStyle: React.CSSProperties = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
    backdropFilter: 'blur(4px)',
  };

  const modalStyle: React.CSSProperties = {
    width: '100%',
    maxWidth: '420px',
    backgroundColor: 'var(--color-white, #FFFFFF)',
    borderRadius: 'var(--border-radius-lg, 16px)',
    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
    overflow: 'hidden',
  };

  const headerStyle: React.CSSProperties = {
    padding: '24px 24px 0',
    textAlign: 'center',
    position: 'relative',
  };

  const closeButtonStyle: React.CSSProperties = {
    position: 'absolute',
    top: '16px',
    right: '16px',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    color: isCloseHovered ? 'var(--color-black)' : 'var(--color-neutrals-4)',
    padding: '8px',
    borderRadius: 'var(--border-radius-circle)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.2s',
  };

  const logoStyle: React.CSSProperties = {
    width: '48px',
    height: '48px',
    marginBottom: '16px',
    borderRadius: 'var(--border-radius-circle)',
  };

  const titleStyle: React.CSSProperties = {
    margin: '0 0 8px',
    fontSize: '24px',
    fontWeight: 700,
    fontFamily: 'var(--font-heading)',
    color: 'var(--color-black)',
  };

  const subtitleStyle: React.CSSProperties = {
    margin: 0,
    fontSize: '14px',
    color: 'var(--color-neutrals-4)',
    lineHeight: 1.5,
  };

  const bodyStyle: React.CSSProperties = {
    padding: '24px',
  };

  const inputGroupStyle: React.CSSProperties = {
    marginBottom: '16px',
  };

  const labelStyle: React.CSSProperties = {
    display: 'block',
    marginBottom: '6px',
    fontSize: '14px',
    fontWeight: 500,
    color: 'var(--color-neutrals-3)',
  };

  const getInputStyle = (inputName: string): React.CSSProperties => ({
    width: '100%',
    padding: '12px 14px',
    fontSize: '15px',
    border: focusedInput === inputName 
      ? '2px solid var(--color-primary-1)' 
      : '1px solid var(--color-neutrals-6)',
    borderRadius: 'var(--border-radius-md)',
    outline: 'none',
    transition: 'border-color 0.2s',
    boxSizing: 'border-box',
    color: 'var(--color-black)',
    backgroundColor: 'var(--color-white)',
  });

  const submitButtonStyle: React.CSSProperties = {
    width: '100%',
    padding: '14px',
    fontSize: '16px',
    fontWeight: 600,
    fontFamily: 'var(--font-heading)',
    backgroundColor: isSubmitHovered 
      ? 'var(--color-neutrals-1)' 
      : 'var(--color-primary-1)',
    color: 'var(--color-white)',
    border: 'none',
    borderRadius: 'var(--border-radius-pill)',
    cursor: isSubmitting ? 'not-allowed' : 'pointer',
    opacity: isSubmitting ? 0.7 : 1,
    transition: 'all 0.2s',
    marginTop: '8px',
  };

  const dividerStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    margin: '24px 0',
    gap: '16px',
  };

  const dividerLineStyle: React.CSSProperties = {
    flex: 1,
    height: '1px',
    backgroundColor: 'var(--color-neutrals-6)',
  };

  const dividerTextStyle: React.CSSProperties = {
    fontSize: '13px',
    color: 'var(--color-neutrals-4)',
    fontWeight: 500,
  };

  const googleButtonStyle: React.CSSProperties = {
    width: '100%',
    padding: '12px',
    fontSize: '15px',
    fontWeight: 500,
    backgroundColor: isGoogleHovered ? 'var(--color-neutrals-7)' : 'var(--color-white)',
    color: 'var(--color-black)',
    border: '1px solid var(--color-neutrals-6)',
    borderRadius: 'var(--border-radius-pill)',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '12px',
    transition: 'all 0.2s',
  };

  const switchModeStyle: React.CSSProperties = {
    textAlign: 'center',
    marginTop: '24px',
    fontSize: '14px',
    color: 'var(--color-neutrals-4)',
  };

  const switchLinkStyle: React.CSSProperties = {
    color: 'var(--color-primary-1)',
    fontWeight: 600,
    cursor: 'pointer',
    marginLeft: '4px',
    textDecoration: 'none',
  };

  const errorStyle: React.CSSProperties = {
    padding: '12px 16px',
    backgroundColor: '#FEF2F2',
    border: '1px solid #FCA5A5',
    borderRadius: 'var(--border-radius-md)',
    color: '#DC2626',
    fontSize: '14px',
    marginBottom: '16px',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  };

  const demoNoticeStyle: React.CSSProperties = {
    padding: '12px 16px',
    backgroundColor: '#F0F9FF',
    border: '1px solid #BAE6FD',
    borderRadius: 'var(--border-radius-md)',
    color: '#0369A1',
    fontSize: '13px',
    marginBottom: '16px',
    lineHeight: 1.5,
  };

  return (
    <div style={overlayStyle} onClick={onClose}>
      <div style={modalStyle} onClick={(e) => e.stopPropagation()}>
        <div style={headerStyle}>
          <button
            style={closeButtonStyle}
            onClick={onClose}
            onMouseEnter={() => setIsCloseHovered(true)}
            onMouseLeave={() => setIsCloseHovered(false)}
          >
            <Icon name="close" size={24} />
          </button>
          
          <img
            src="https://www.motortrend.com/files/68f6de8441f73a00024a546f/mtavatar.svg"
            alt="MotorTrend"
            style={logoStyle}
          />
          
          <h2 style={titleStyle}>
            {mode === 'signin' ? 'Welcome Back' : 'Join the Community'}
          </h2>
          <p style={subtitleStyle}>
            {mode === 'signin' 
              ? 'Sign in to participate in discussions and share your thoughts.'
              : 'Create an account to join discussions, share posts, and connect with car enthusiasts.'}
          </p>
        </div>

        <div style={bodyStyle}>
          {error && (
            <div style={errorStyle}>
              <Icon name="error" size={18} />
              {error}
            </div>
          )}

          {!isSupabaseMode && (
            <div style={demoNoticeStyle}>
              <strong>Demo Mode:</strong> Enter a display name to continue. Your data will be saved locally in your browser.
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {isSupabaseMode && (
              <>
                <div style={inputGroupStyle}>
                  <label style={labelStyle}>Email</label>
                  <input
                    type="email"
                    style={getInputStyle('email')}
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onFocus={() => setFocusedInput('email')}
                    onBlur={() => setFocusedInput(null)}
                    required
                  />
                </div>

                <div style={inputGroupStyle}>
                  <label style={labelStyle}>Password</label>
                  <input
                    type="password"
                    style={getInputStyle('password')}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onFocus={() => setFocusedInput('password')}
                    onBlur={() => setFocusedInput(null)}
                    required
                    minLength={6}
                  />
                </div>
              </>
            )}

            {(mode === 'signup' || !isSupabaseMode) && (
              <div style={inputGroupStyle}>
                <label style={labelStyle}>Display Name</label>
                <input
                  type="text"
                  style={getInputStyle('displayName')}
                  placeholder="What should we call you?"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  onFocus={() => setFocusedInput('displayName')}
                  onBlur={() => setFocusedInput(null)}
                  required
                  maxLength={50}
                />
              </div>
            )}

            <button
              type="submit"
              style={submitButtonStyle}
              disabled={isSubmitting}
              onMouseEnter={() => setIsSubmitHovered(true)}
              onMouseLeave={() => setIsSubmitHovered(false)}
            >
              {isSubmitting ? 'Please wait...' : (mode === 'signin' ? 'Sign In' : 'Create Account')}
            </button>
          </form>

          {isSupabaseMode && (
            <>
              <div style={dividerStyle}>
                <div style={dividerLineStyle} />
                <span style={dividerTextStyle}>or continue with</span>
                <div style={dividerLineStyle} />
              </div>

              <button
                type="button"
                style={googleButtonStyle}
                onClick={handleGoogleSignIn}
                onMouseEnter={() => setIsGoogleHovered(true)}
                onMouseLeave={() => setIsGoogleHovered(false)}
              >
                <img
                  src="https://www.google.com/favicon.ico"
                  alt="Google"
                  style={{ width: '18px', height: '18px' }}
                />
                Google
              </button>
            </>
          )}

          <div style={switchModeStyle}>
            {mode === 'signin' ? (
              <>
                Don't have an account?
                <span 
                  style={switchLinkStyle} 
                  onClick={() => setMode('signup')}
                >
                  Sign up
                </span>
              </>
            ) : (
              <>
                Already have an account?
                <span 
                  style={switchLinkStyle} 
                  onClick={() => setMode('signin')}
                >
                  Sign in
                </span>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthModal;

