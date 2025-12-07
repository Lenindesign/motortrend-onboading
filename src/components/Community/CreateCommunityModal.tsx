/**
 * Create Community Modal Component
 * Migrated to inline styles for Tailwind compatibility
 */

import React, { useState } from 'react';
import { createCommunity } from '../../api/communityApi';
import Icon from '../Icon';

interface CreateCommunityModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCommunityCreated: (slug: string) => void;
}

export const CreateCommunityModal: React.FC<CreateCommunityModalProps> = ({
  isOpen,
  onClose,
  onCommunityCreated
}) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [icon, setIcon] = useState('');
  const [isCloseHovered, setIsCloseHovered] = useState(false);
  const [isCancelHovered, setIsCancelHovered] = useState(false);
  const [isSubmitHovered, setIsSubmitHovered] = useState(false);
  const [isNameFocused, setIsNameFocused] = useState(false);
  const [isDescFocused, setIsDescFocused] = useState(false);
  const [isIconFocused, setIsIconFocused] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) return;

    const newCommunity = createCommunity(name, description, icon || undefined);
    
    // Reset and close
    setName('');
    setDescription('');
    setIcon('');
    onCommunityCreated(newCommunity.slug);
    onClose();
  };

  // Styles
  const overlayStyle: React.CSSProperties = {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000
  };

  const modalStyle: React.CSSProperties = {
    width: '100%',
    maxWidth: '500px',
    backgroundColor: 'var(--color-white, #FFFFFF)',
    borderRadius: 'var(--border-radius-md, 8px)',
    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
    display: 'flex',
    flexDirection: 'column'
  };

  const headerStyle: React.CSSProperties = {
    padding: '16px',
    borderBottom: '1px solid var(--color-neutrals-6, #E6E8EC)',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  };

  const headerTitleStyle: React.CSSProperties = {
    margin: 0,
    fontSize: '16px',
    fontWeight: 600,
    color: 'var(--color-black, #000000)'
  };

  const closeButtonStyle: React.CSSProperties = {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    color: isCloseHovered ? 'var(--color-black, #000000)' : 'var(--color-neutrals-4, #6E7481)',
    padding: '4px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'color 0.2s'
  };

  const contentStyle: React.CSSProperties = {
    padding: '16px'
  };

  const infoStyle: React.CSSProperties = {
    marginBottom: '8px'
  };

  const infoTitleStyle: React.CSSProperties = {
    fontSize: '16px',
    fontWeight: 600,
    margin: '0 0 4px 0',
    color: 'var(--color-black, #000000)'
  };

  const infoDescStyle: React.CSSProperties = {
    fontSize: '12px',
    color: 'var(--color-neutrals-4, #6E7481)',
    margin: 0
  };

  const inputWrapperStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    border: `1px solid ${isNameFocused ? 'var(--color-black, #000000)' : 'var(--color-neutrals-6, #E6E8EC)'}`,
    borderRadius: 'var(--border-radius-sm, 4px)',
    padding: '0 12px',
    marginBottom: '4px',
    backgroundColor: 'var(--color-white, #FFFFFF)',
    transition: 'border-color 0.2s'
  };

  const prefixStyle: React.CSSProperties = {
    color: 'var(--color-neutrals-4, #6E7481)',
    fontWeight: 500,
    marginRight: '4px'
  };

  const inputStyle: React.CSSProperties = {
    flex: 1,
    border: 'none',
    background: 'none',
    padding: '12px 0',
    fontSize: '14px',
    outline: 'none',
    color: 'var(--color-black, #000000)'
  };

  const charCountStyle: React.CSSProperties = {
    fontSize: '12px',
    color: 'var(--color-neutrals-4, #6E7481)',
    marginBottom: '24px'
  };

  const textareaStyle: React.CSSProperties = {
    width: '100%',
    border: `1px solid ${isDescFocused ? 'var(--color-black, #000000)' : 'var(--color-neutrals-6, #E6E8EC)'}`,
    borderRadius: 'var(--border-radius-sm, 4px)',
    padding: '12px',
    fontSize: '14px',
    marginBottom: '24px',
    resize: 'vertical',
    backgroundColor: 'var(--color-white, #FFFFFF)',
    color: 'var(--color-black, #000000)',
    outline: 'none',
    fontFamily: 'inherit',
    transition: 'border-color 0.2s',
    boxSizing: 'border-box'
  };

  const iconInputStyle: React.CSSProperties = {
    ...textareaStyle,
    border: `1px solid ${isIconFocused ? 'var(--color-black, #000000)' : 'var(--color-neutrals-6, #E6E8EC)'}`,
    minHeight: 'auto',
    height: 'auto',
    resize: 'none'
  };

  const footerStyle: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '12px',
    backgroundColor: 'var(--color-neutrals-7, #F4F5F6)',
    margin: '0 -16px -16px -16px',
    padding: '16px',
    borderRadius: '0 0 8px 8px'
  };

  const cancelButtonStyle: React.CSSProperties = {
    padding: '8px 16px',
    border: '1px solid var(--color-neutrals-6, #E6E8EC)',
    backgroundColor: isCancelHovered ? 'var(--color-neutrals-7, #F4F5F6)' : 'var(--color-white, #FFFFFF)',
    borderRadius: 'var(--border-radius-pill, 999px)',
    cursor: 'pointer',
    fontWeight: 600,
    color: 'var(--color-neutrals-4, #6E7481)',
    transition: 'background-color 0.2s'
  };

  const submitButtonStyle: React.CSSProperties = {
    padding: '8px 24px',
    backgroundColor: !name 
      ? 'var(--color-neutrals-5, #B1B5C3)' 
      : isSubmitHovered 
        ? 'var(--color-neutrals-1, #141416)' 
        : 'var(--color-primary-1, #E90C17)',
    color: 'white',
    border: 'none',
    borderRadius: 'var(--border-radius-pill, 999px)',
    cursor: !name ? 'not-allowed' : 'pointer',
    fontWeight: 600,
    opacity: !name ? 0.5 : 1,
    transition: 'background-color 0.2s'
  };

  return (
    <div style={overlayStyle} onClick={onClose}>
      <div style={modalStyle} onClick={e => e.stopPropagation()}>
        <div style={headerStyle}>
          <h2 style={headerTitleStyle}>Create a Community</h2>
          <button 
            style={closeButtonStyle} 
            onClick={onClose}
            onMouseEnter={() => setIsCloseHovered(true)}
            onMouseLeave={() => setIsCloseHovered(false)}
          >
            <Icon name="close" size={24} />
          </button>
        </div>

        <div style={contentStyle}>
          <div style={infoStyle}>
            <h3 style={infoTitleStyle}>Name</h3>
            <p style={infoDescStyle}>Community names including capitalization cannot be changed.</p>
          </div>
          
          <form onSubmit={handleSubmit}>
            <div style={inputWrapperStyle}>
              <span style={prefixStyle}>c/</span>
              <input 
                type="text" 
                style={inputStyle}
                value={name}
                onChange={e => setName(e.target.value)}
                onFocus={() => setIsNameFocused(true)}
                onBlur={() => setIsNameFocused(false)}
                maxLength={21}
                required
              />
            </div>
            <div style={charCountStyle}>
              {21 - name.length} Characters remaining
            </div>

            <div style={infoStyle}>
               <h3 style={infoTitleStyle}>Description</h3>
               <p style={infoDescStyle}>What is this community about?</p>
            </div>

            <textarea
               style={textareaStyle}
               value={description}
               onChange={e => setDescription(e.target.value)}
               onFocus={() => setIsDescFocused(true)}
               onBlur={() => setIsDescFocused(false)}
               maxLength={500}
               rows={4}
            />

            <div style={infoStyle}>
               <h3 style={infoTitleStyle}>Icon (Optional)</h3>
               <p style={infoDescStyle}>URL to an image for your community icon.</p>
            </div>

            <input
               type="url"
               style={iconInputStyle}
               value={icon}
               onChange={e => setIcon(e.target.value)}
               onFocus={() => setIsIconFocused(true)}
               onBlur={() => setIsIconFocused(false)}
               placeholder="https://example.com/icon.png"
            />

            <div style={footerStyle}>
              <button 
                type="button" 
                style={cancelButtonStyle} 
                onClick={onClose}
                onMouseEnter={() => setIsCancelHovered(true)}
                onMouseLeave={() => setIsCancelHovered(false)}
              >
                Cancel
              </button>
              <button 
                type="submit" 
                style={submitButtonStyle}
                disabled={!name}
                onMouseEnter={() => setIsSubmitHovered(true)}
                onMouseLeave={() => setIsSubmitHovered(false)}
              >
                Create Community
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
