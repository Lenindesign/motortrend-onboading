/**
 * User Profile Menu Component
 * Shows current user status and provides sign in/out functionality
 */

import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import Icon from '../Icon';

interface UserProfileMenuProps {
  onSignInClick: () => void;
}

export const UserProfileMenu: React.FC<UserProfileMenuProps> = ({ onSignInClick }) => {
  const { user, isAuthenticated, signOut, isLoading } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSignOut = async () => {
    try {
      await signOut();
      setIsOpen(false);
    } catch {
      // Error handled by context
    }
  };

  // Styles
  const containerStyle: React.CSSProperties = {
    position: 'relative',
    display: 'inline-block',
  };

  const buttonStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '8px 12px',
    backgroundColor: isHovered ? 'var(--color-neutrals-7)' : 'transparent',
    border: '1px solid var(--color-neutrals-6)',
    borderRadius: 'var(--border-radius-pill)',
    cursor: 'pointer',
    transition: 'all 0.2s',
    minWidth: '140px',
    justifyContent: 'center',
  };

  const avatarStyle: React.CSSProperties = {
    width: '28px',
    height: '28px',
    borderRadius: 'var(--border-radius-circle)',
    backgroundColor: 'var(--color-primary-1)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'var(--color-white)',
    fontSize: '12px',
    fontWeight: 600,
    overflow: 'hidden',
  };

  const avatarImgStyle: React.CSSProperties = {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  };

  const nameStyle: React.CSSProperties = {
    fontSize: '14px',
    fontWeight: 500,
    color: 'var(--color-black)',
    maxWidth: '100px',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  };

  const dropdownStyle: React.CSSProperties = {
    position: 'absolute',
    top: '100%',
    right: 0,
    marginTop: '8px',
    backgroundColor: 'var(--color-white)',
    border: '1px solid var(--color-neutrals-6)',
    borderRadius: 'var(--border-radius-md)',
    boxShadow: '0 10px 40px rgba(0, 0, 0, 0.15)',
    minWidth: '200px',
    zIndex: 100,
    overflow: 'hidden',
  };

  const dropdownHeaderStyle: React.CSSProperties = {
    padding: '16px',
    borderBottom: '1px solid var(--color-neutrals-6)',
  };

  const userNameStyle: React.CSSProperties = {
    fontSize: '15px',
    fontWeight: 600,
    color: 'var(--color-black)',
    margin: 0,
  };

  const userEmailStyle: React.CSSProperties = {
    fontSize: '13px',
    color: 'var(--color-neutrals-4)',
    margin: '4px 0 0',
  };

  const menuItemStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '12px 16px',
    width: '100%',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    fontSize: '14px',
    color: 'var(--color-neutrals-3)',
    transition: 'background-color 0.2s',
    textAlign: 'left',
  };

  const signInButtonStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '10px 20px',
    backgroundColor: 'var(--color-primary-1)',
    color: 'var(--color-white)',
    border: 'none',
    borderRadius: 'var(--border-radius-pill)',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: 600,
    transition: 'all 0.2s',
  };

  if (isLoading) {
    return (
      <div style={{ ...buttonStyle, cursor: 'default', opacity: 0.7 }}>
        <div style={{ ...avatarStyle, backgroundColor: 'var(--color-neutrals-5)' }}>
          <Icon name="person" size={16} />
        </div>
        <span style={nameStyle}>Loading...</span>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return (
      <button
        style={signInButtonStyle}
        onClick={onSignInClick}
        onMouseEnter={(e) => {
          (e.target as HTMLButtonElement).style.backgroundColor = 'var(--color-neutrals-1)';
        }}
        onMouseLeave={(e) => {
          (e.target as HTMLButtonElement).style.backgroundColor = 'var(--color-primary-1)';
        }}
      >
        <Icon name="login" size={18} />
        Sign In
      </button>
    );
  }

  const initials = user.displayName
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <div style={containerStyle} ref={menuRef}>
      <button
        style={buttonStyle}
        onClick={() => setIsOpen(!isOpen)}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div style={avatarStyle}>
          {user.avatarUrl ? (
            <img src={user.avatarUrl} alt={user.displayName} style={avatarImgStyle} />
          ) : (
            initials || <Icon name="person" size={16} />
          )}
        </div>
        <span style={nameStyle}>{user.displayName}</span>
        <Icon name={isOpen ? 'expand_less' : 'expand_more'} size={20} />
      </button>

      {isOpen && (
        <div style={dropdownStyle}>
          <div style={dropdownHeaderStyle}>
            <p style={userNameStyle}>{user.displayName}</p>
            <p style={userEmailStyle}>{user.email}</p>
            {user.isAnonymous && (
              <p style={{ ...userEmailStyle, color: 'var(--color-blue)', fontSize: '11px', marginTop: '8px' }}>
                Demo Mode
              </p>
            )}
          </div>
          
          <div>
            <button
              style={menuItemStyle}
              onClick={handleSignOut}
              onMouseEnter={(e) => {
                (e.target as HTMLButtonElement).style.backgroundColor = 'var(--color-neutrals-7)';
              }}
              onMouseLeave={(e) => {
                (e.target as HTMLButtonElement).style.backgroundColor = 'transparent';
              }}
            >
              <Icon name="logout" size={20} />
              Sign Out
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserProfileMenu;

