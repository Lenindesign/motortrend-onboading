/**
 * Sign In Page
 * Based on Figma Community design system
 */

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, TextField } from '../../design-system/components';
import './SignIn.css';
// Using MotorTrend main logo from URL
const motorTrendLogo = 'https://d2kde5ohu8qb21.cloudfront.net/files/68f3fc9ccfecd100026f4650/mtlogo.png';
import googleLogo from '../../assets/images/google-logo.svg';
import facebookIcon from '../../assets/icons/facebook-icon.svg';
import appleIcon from '../../assets/icons/apple-icon.svg';
import Icon from '../../components/Icon';

export interface SignInProps {
  onSignIn?: (email: string, password: string) => void;
  onSocialSignIn?: (provider: 'google' | 'facebook' | 'apple') => void;
  onSignUpClick?: () => void;
  onForgotPasswordClick?: () => void;
}

export const SignIn: React.FC<SignInProps> = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Sign in with:', email, password);
    // Navigate to onboarding step 1
    navigate('/onboarding/step1');
  };

  const handleSocialSignIn = (provider: 'google' | 'facebook' | 'apple') => {
    console.log('Sign in with:', provider);
    // Navigate to onboarding step 1
    navigate('/onboarding/step1');
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
              icon={<Icon name={showPassword ? 'visibility' : 'visibility_off'} size={24} />}
              iconPosition="right"
              onIconClick={() => setShowPassword(!showPassword)}
            />
            <button
              type="button"
              className="sign-in-card__forgot-password"
              onClick={() => console.log('Forgot password clicked')}
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
              onClick={() => console.log('Sign up clicked')}
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

