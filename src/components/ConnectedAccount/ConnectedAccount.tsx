import React from 'react';
import './ConnectedAccount.css';

export interface ConnectedAccountProps {
  provider: 'google' | 'facebook' | 'apple';
  accountName?: string;
  isConnected?: boolean;
  onConnect?: () => void;
  onDisconnect?: () => void;
}

export const ConnectedAccount: React.FC<ConnectedAccountProps> = ({ 
  provider, 
  accountName,
  isConnected = false,
  onConnect,
  onDisconnect
}) => {
  const getProviderIcon = () => {
    switch (provider) {
      case 'google':
        return (
          <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
            <path d="M39.2 20.45C39.2 19.05 39.09 17.65 38.87 16.27H20V24.07H30.65C30.2 26.57 28.83 28.85 26.77 30.34V35.25H33.27C37.07 31.77 39.2 26.67 39.2 20.45Z" fill="#4285F4"/>
            <path d="M20 40C25.5 40 30.12 38.2 33.27 35.25L26.77 30.34C25 31.57 22.7 32.32 20 32.32C14.7 32.32 10.22 28.8 8.65 24.08H1.93V29.13C5.15 35.53 12.25 40 20 40Z" fill="#34A853"/>
            <path d="M8.65 24.08C7.85 21.58 7.85 18.43 8.65 15.93V10.88H1.93C-0.66 16.05 -0.66 21.96 1.93 27.13L8.65 24.08Z" fill="#FBBC05"/>
            <path d="M20 7.68C22.87 7.64 25.65 8.72 27.75 10.69L33.47 4.97C30.01 1.72 25.47 -0.04 20 0C12.25 0 5.15 4.47 1.93 10.88L8.65 15.93C10.22 11.2 14.7 7.68 20 7.68Z" fill="#EA4335"/>
          </svg>
        );
      case 'facebook':
        return (
          <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
            <rect width="40" height="40" rx="8" fill="#1877F2"/>
            <path d="M27.11 25.16L28.06 20H23.06V16.72C23.06 15.27 23.79 13.86 26.17 13.86H28.26V9.53C28.26 9.53 26.09 9.18 24.01 9.18C19.66 9.18 16.72 11.82 16.72 16.11V20H12V25.16H16.72V37.18C17.61 37.32 18.52 37.4 19.44 37.4C20.36 37.4 21.27 37.32 22.16 37.18V25.16H27.11Z" fill="white"/>
          </svg>
        );
      case 'apple':
        return (
          <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
            <rect width="40" height="40" rx="8" fill="white" stroke="#E6E8EC"/>
            <path d="M25.85 20.82C25.84 17.34 28.69 15.65 28.83 15.56C27.2 13.22 24.72 12.89 23.82 12.86C21.72 12.64 19.69 14.14 18.63 14.14C17.55 14.14 15.89 12.88 14.18 12.92C11.96 12.95 9.9 14.29 8.77 16.33C6.46 20.48 8.17 26.61 10.39 30.03C11.5 31.7 12.8 33.55 14.51 33.49C16.19 33.42 16.83 32.41 18.86 32.41C20.87 32.41 21.48 33.49 23.22 33.44C25.02 33.42 26.15 31.78 27.23 30.1C28.53 28.19 29.06 26.32 29.08 26.23C29.04 26.21 25.87 24.97 25.85 20.82Z" fill="black"/>
            <path d="M22.45 10.71C23.37 9.59 23.99 8.07 23.82 6.53C22.51 6.6 20.89 7.45 19.94 8.54C19.1 9.51 18.37 11.08 18.56 12.57C20.03 12.68 21.53 11.83 22.45 10.71Z" fill="black"/>
          </svg>
        );
    }
  };

  const getProviderName = () => {
    return provider.charAt(0).toUpperCase() + provider.slice(1);
  };

  return (
    <div className="connected-account">
      <div className="connected-account__icon">
        {getProviderIcon()}
      </div>
      <div className="connected-account__content">
        <div className="connected-account__info">
          <span className="connected-account__name">{getProviderName()}</span>
          {isConnected ? (
            <div className="connected-account__status">
              <span className="connected-account__account-name">{accountName}</span>
              <span className="connected-account__connected">Connected</span>
            </div>
          ) : (
            <button className="connected-account__connect-btn" onClick={onConnect}>
              Connect
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

