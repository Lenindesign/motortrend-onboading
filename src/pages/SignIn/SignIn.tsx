/**
 * Sign In Page
 * Based on Figma Community design system
 */

import React, { useState } from 'react';
import { Button, TextField } from '../../design-system/components';
import './SignIn.css';
import motorTrendLogo from '../../assets/images/motortrend-logo.png';
import googleLogo from '../../assets/images/google-logo.svg';
import facebookIcon from '../../assets/icons/facebook-icon.svg';
import appleIcon from '../../assets/icons/apple-icon.svg';

export interface SignInProps {
  onSignIn?: (email: string, password: string) => void;
  onSocialSignIn?: (provider: 'google' | 'facebook' | 'apple') => void;
  onSignUpClick?: () => void;
  onForgotPasswordClick?: () => void;
}

export const SignIn: React.FC<SignInProps> = ({
  onSignIn,
  onSocialSignIn,
  onSignUpClick,
  onForgotPasswordClick,
}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSignIn?.(email, password);
  };

  const handleSocialSignIn = (provider: 'google' | 'facebook' | 'apple') => {
    onSocialSignIn?.(provider);
  };

  return (
    <div className="sign-in-page">
      <div className="sign-in-card">
        {/* Header */}
        <div className="sign-in-card__header">
          <img 
            src={motorTrendLogo} 
            alt="MotorTrend" 
            className="sign-in-card__logo"
          />
          <h1 className="sign-in-card__title">Sign In</h1>
        </div>

        {/* Social Sign In Buttons */}
        <div className="sign-in-card__social">
          <button 
            className="social-btn social-btn--google"
            onClick={() => handleSocialSignIn('google')}
          >
            <img src={googleLogo} alt="" className="social-btn__icon" />
            <span className="social-btn__label">Continue with Google</span>
          </button>

          <button 
            className="social-btn social-btn--facebook"
            onClick={() => handleSocialSignIn('facebook')}
          >
            <img src={facebookIcon} alt="" className="social-btn__icon" />
            <span className="social-btn__label">Continue with Facebook</span>
          </button>

          <button 
            className="social-btn social-btn--apple"
            onClick={() => handleSocialSignIn('apple')}
          >
            <img src={appleIcon} alt="" className="social-btn__icon" />
            <span className="social-btn__label">Continue with Apple</span>
          </button>
        </div>

        {/* Divider */}
        <div className="sign-in-card__divider">
          <div className="sign-in-card__divider-line" />
          <span className="sign-in-card__divider-text">Or</span>
          <div className="sign-in-card__divider-line" />
        </div>

        {/* Email/Password Form */}
        <form className="sign-in-card__form" onSubmit={handleSubmit}>
          <TextField
            label="Email Address"
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            fullWidth
            required
          />

          <div className="sign-in-card__password-field">
            <TextField
              label="Password"
              type={showPassword ? 'text' : 'password'}
              placeholder="Enter Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              fullWidth
              required
              icon={
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              }
              iconPosition="right"
              onIconClick={() => setShowPassword(!showPassword)}
            />
            <button
              type="button"
              className="sign-in-card__forgot-password"
              onClick={onForgotPasswordClick}
            >
              Forgot or need a password?
            </button>
          </div>

          <Button
            type="submit"
            color="neutrals3"
            size="large"
            variant="solid"
            fullWidth
          >
            Continue
          </Button>

          <p className="sign-in-card__sign-up-text">
            Don't have an account?{' '}
            <button
              type="button"
              className="sign-in-card__sign-up-link"
              onClick={onSignUpClick}
            >
              Sign Up
            </button>
          </p>
        </form>
      </div>
    </div>
  );
};

export default SignIn;

