/**
 * ConnectedAccount Component
 * Migrated to inline styles for Tailwind compatibility
 */

import React from 'react';
import Button from '../../design-system/components/Button';
import Icon from '../Icon';

export interface ConnectedAccountProps {
  provider: 'google' | 'facebook' | 'apple';
  accountName?: string;
  isConnected?: boolean;
  onConnect?: () => void;
  className?: string;
}

export const ConnectedAccount: React.FC<ConnectedAccountProps> = ({ 
  provider, 
  accountName,
  isConnected = false,
  onConnect,
  className = '',
}) => {
  const getProviderIcon = () => {
    switch (provider) {
      case 'google':
        return <Icon name="google_logo" size={40} style={{ color: '#4285F4' }} />;
      case 'facebook':
        return <Icon name="facebook_logo" size={40} style={{ color: '#1877F2' }} />;
      case 'apple':
        return <Icon name="apple_logo" size={40} style={{ color: '#141416' }} />;
    }
  };

  const getProviderName = () => {
    return provider.charAt(0).toUpperCase() + provider.slice(1);
  };

  // Container styles
  const containerStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 'var(--spacing-3, 24px)',
    width: '100%',
    padding: 'var(--spacing-2, 16px)',
    background: 'var(--color-neutrals-8, #FCFCFD)',
    border: '1px solid var(--color-neutrals-6, #E6E8EC)',
    borderRadius: 'var(--border-radius-lg, 16px)',
    boxShadow: 'var(--shadow-depth-1, 0 1px 2px rgba(20, 20, 22, 0.02))',
  };

  // Icon container styles
  const iconStyle: React.CSSProperties = {
    width: '48px',
    height: '48px',
    flexShrink: 0,
    borderRadius: 'var(--border-radius-md, 8px)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'var(--color-white, #FFFFFF)',
    boxShadow: 'var(--shadow-depth-5, 0 4px 20px rgba(20, 20, 22, 0.06))',
  };

  // Content styles
  const contentStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
    flex: 1,
  };

  // Name styles
  const nameStyle: React.CSSProperties = {
    fontFamily: 'var(--font-heading, Poppins, sans-serif)',
    fontWeight: 600,
    fontSize: '16px',
    color: 'var(--color-neutrals-1, #141416)',
  };

  // Account name styles
  const accountNameStyle: React.CSSProperties = {
    fontFamily: 'var(--font-body, Geist, sans-serif)',
    fontWeight: 500,
    fontSize: '14px',
    color: 'var(--color-neutrals-4, #6E7481)',
  };

  // Actions styles
  const actionsStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    flexShrink: 0,
  };

  // Connected text styles
  const connectedStyle: React.CSSProperties = {
    fontFamily: 'var(--font-body, Geist, sans-serif)',
    fontWeight: 500,
    fontSize: '14px',
    color: 'var(--color-semantic-success, #34A853)',
    textAlign: 'right',
  };

  return (
    <div className={className} style={containerStyle}>
      <div style={iconStyle}>
        {getProviderIcon()}
      </div>
      <div style={contentStyle}>
        <span style={nameStyle}>{getProviderName()}</span>
        {isConnected && accountName && (
          <span style={accountNameStyle}>{accountName}</span>
        )}
      </div>
      <div style={actionsStyle}>
        {isConnected ? (
          <span style={connectedStyle}>Connected</span>
        ) : (
          <Button 
            color="neutrals3" 
            variant="solid" 
            size="default"
            onClick={onConnect}
          >
            Connect
          </Button>
        )}
      </div>
    </div>
  );
};
