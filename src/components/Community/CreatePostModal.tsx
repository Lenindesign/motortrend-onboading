/**
 * Create Post Modal Component
 * Migrated to inline styles for Tailwind compatibility
 */

import React, { useState, useEffect } from 'react';
import type { Community } from '../../api/communityApi';
import { createPost } from '../../api/communityApi';
import Icon from '../Icon';

interface CreatePostModalProps {
  isOpen: boolean;
  onClose: () => void;
  communities: Community[];
  initialCommunityId?: string;
  onPostCreated: () => void;
}

export const CreatePostModal: React.FC<CreatePostModalProps> = ({
  isOpen,
  onClose,
  communities,
  initialCommunityId,
  onPostCreated
}) => {
  const [selectedCommunityId, setSelectedCommunityId] = useState(initialCommunityId || '');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [tab, setTab] = useState<'text' | 'image'>('text');
  const [isCloseHovered, setIsCloseHovered] = useState(false);
  const [hoveredTab, setHoveredTab] = useState<string | null>(null);
  const [isCancelHovered, setIsCancelHovered] = useState(false);
  const [isSubmitHovered, setIsSubmitHovered] = useState(false);
  const [focusedInput, setFocusedInput] = useState<string | null>(null);

  useEffect(() => {
    if (initialCommunityId) {
      setSelectedCommunityId(initialCommunityId);
    }
  }, [initialCommunityId]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCommunityId || !title || !content) return;

    createPost(selectedCommunityId, title, content, imageUrl);
    
    // Reset and close
    setTitle('');
    setContent('');
    setImageUrl('');
    onPostCreated();
    onClose();
  };

  const isSubmitDisabled = !selectedCommunityId || !title;

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
    maxWidth: '700px',
    backgroundColor: 'var(--color-white, #FFFFFF)',
    borderRadius: 'var(--border-radius-md, 8px)',
    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
    display: 'flex',
    flexDirection: 'column',
    maxHeight: '90vh',
    overflowY: 'auto'
  };

  const headerStyle: React.CSSProperties = {
    padding: '16px 24px',
    borderBottom: '1px solid var(--color-neutrals-6, #E6E8EC)',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  };

  const headerTitleStyle: React.CSSProperties = {
    margin: 0,
    fontSize: '18px',
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

  const selectorWrapperStyle: React.CSSProperties = {
    padding: '16px 24px'
  };

  const selectorStyle: React.CSSProperties = {
    width: '300px',
    padding: '8px 12px',
    borderRadius: 'var(--border-radius-sm, 4px)',
    border: '1px solid var(--color-neutrals-6, #E6E8EC)',
    fontSize: '14px',
    backgroundColor: 'var(--color-white, #FFFFFF)',
    color: 'var(--color-black, #000000)',
    cursor: 'pointer'
  };

  const tabsStyle: React.CSSProperties = {
    display: 'flex',
    padding: '0 24px',
    gap: '8px'
  };

  const getTabStyle = (tabName: string): React.CSSProperties => {
    const isActive = tab === tabName;
    const isHovered = hoveredTab === tabName;
    return {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      padding: '12px 24px',
      background: isHovered && !isActive ? 'var(--color-neutrals-7, #F4F5F6)' : 'none',
      border: 'none',
      borderBottom: `2px solid ${isActive ? 'var(--color-primary-1, #E90C17)' : 'transparent'}`,
      cursor: 'pointer',
      fontWeight: 600,
      color: isActive ? 'var(--color-primary-1, #E90C17)' : 'var(--color-neutrals-4, #6E7481)',
      transition: 'all 0.2s'
    };
  };

  const bodyStyle: React.CSSProperties = {
    padding: '24px',
    display: 'flex',
    flexDirection: 'column',
    gap: '16px'
  };

  const titleInputStyle: React.CSSProperties = {
    padding: '12px',
    fontSize: '16px',
    border: focusedInput === 'title' 
      ? '2px solid var(--color-primary-1, #E90C17)' 
      : '1px solid var(--color-neutrals-6, #E6E8EC)',
    borderRadius: 'var(--border-radius-sm, 4px)',
    width: '100%',
    color: 'var(--color-black, #000000)',
    outline: 'none',
    boxSizing: 'border-box'
  };

  const contentInputStyle: React.CSSProperties = {
    padding: '12px',
    fontSize: '14px',
    border: focusedInput === 'content' 
      ? '2px solid var(--color-primary-1, #E90C17)' 
      : '1px solid var(--color-neutrals-6, #E6E8EC)',
    borderRadius: 'var(--border-radius-sm, 4px)',
    width: '100%',
    resize: 'vertical',
    fontFamily: 'inherit',
    color: 'var(--color-black, #000000)',
    outline: 'none',
    boxSizing: 'border-box'
  };

  const urlInputStyle: React.CSSProperties = {
    padding: '12px',
    fontSize: '14px',
    border: focusedInput === 'url' 
      ? '2px solid var(--color-primary-1, #E90C17)' 
      : '1px solid var(--color-neutrals-6, #E6E8EC)',
    borderRadius: 'var(--border-radius-sm, 4px)',
    width: '100%',
    marginBottom: '16px',
    color: 'var(--color-black, #000000)',
    outline: 'none',
    boxSizing: 'border-box'
  };

  const captionInputStyle: React.CSSProperties = {
    ...contentInputStyle,
    border: focusedInput === 'caption' 
      ? '2px solid var(--color-primary-1, #E90C17)' 
      : '1px solid var(--color-neutrals-6, #E6E8EC)'
  };

  const footerStyle: React.CSSProperties = {
    padding: '16px 24px',
    borderTop: '1px solid var(--color-neutrals-6, #E6E8EC)',
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '12px'
  };

  const cancelButtonStyle: React.CSSProperties = {
    padding: '8px 16px',
    border: '1px solid var(--color-neutrals-6, #E6E8EC)',
    background: isCancelHovered ? 'var(--color-neutrals-7, #F4F5F6)' : 'none',
    borderRadius: 'var(--border-radius-pill, 999px)',
    cursor: 'pointer',
    fontWeight: 600,
    color: 'var(--color-neutrals-4, #6E7481)',
    transition: 'background-color 0.2s'
  };

  const submitButtonStyle: React.CSSProperties = {
    padding: '8px 24px',
    backgroundColor: isSubmitDisabled 
      ? 'var(--color-neutrals-5, #B1B5C3)' 
      : isSubmitHovered 
        ? 'var(--color-neutrals-1, #141416)' 
        : 'var(--color-primary-1, #E90C17)',
    color: 'white',
    border: 'none',
    borderRadius: 'var(--border-radius-pill, 999px)',
    cursor: isSubmitDisabled ? 'not-allowed' : 'pointer',
    fontWeight: 600,
    opacity: isSubmitDisabled ? 0.5 : 1,
    transition: 'background-color 0.2s'
  };

  return (
    <div style={overlayStyle} onClick={onClose}>
      <div style={modalStyle} onClick={e => e.stopPropagation()}>
        <div style={headerStyle}>
          <h2 style={headerTitleStyle}>Create a post</h2>
          <button 
            style={closeButtonStyle} 
            onClick={onClose}
            onMouseEnter={() => setIsCloseHovered(true)}
            onMouseLeave={() => setIsCloseHovered(false)}
          >
            <Icon name="close" size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Community Selector */}
          <div style={selectorWrapperStyle}>
             <select 
               style={selectorStyle}
               value={selectedCommunityId}
               onChange={e => setSelectedCommunityId(e.target.value)}
               required
             >
               <option value="" disabled>Choose a community</option>
               {communities.map(c => (
                 <option key={c.id} value={c.id}>c/{c.name}</option>
               ))}
             </select>
          </div>

          {/* Tabs */}
          <div style={tabsStyle}>
            <button 
              type="button"
              style={getTabStyle('text')}
              onClick={() => setTab('text')}
              onMouseEnter={() => setHoveredTab('text')}
              onMouseLeave={() => setHoveredTab(null)}
            >
              <Icon name="article" size={20} />
              Post
            </button>
            <button 
              type="button"
              style={getTabStyle('image')}
              onClick={() => setTab('image')}
              onMouseEnter={() => setHoveredTab('image')}
              onMouseLeave={() => setHoveredTab(null)}
            >
              <Icon name="image" size={20} />
              Image & Video
            </button>
          </div>

          <div style={bodyStyle}>
            <input 
              type="text" 
              style={titleInputStyle}
              placeholder="Title"
              value={title}
              onChange={e => setTitle(e.target.value)}
              onFocus={() => setFocusedInput('title')}
              onBlur={() => setFocusedInput(null)}
              maxLength={300}
              required
            />

            {tab === 'text' && (
              <textarea 
                style={contentInputStyle}
                placeholder="Text (optional)"
                value={content}
                onChange={e => setContent(e.target.value)}
                onFocus={() => setFocusedInput('content')}
                onBlur={() => setFocusedInput(null)}
                rows={10}
              />
            )}

            {tab === 'image' && (
              <div>
                 <input 
                   type="url"
                   style={urlInputStyle}
                   placeholder="Paste image URL"
                   value={imageUrl}
                   onChange={e => setImageUrl(e.target.value)}
                   onFocus={() => setFocusedInput('url')}
                   onBlur={() => setFocusedInput(null)}
                 />
                 <textarea 
                   style={captionInputStyle}
                   placeholder="Caption / Text (optional)"
                   value={content}
                   onChange={e => setContent(e.target.value)}
                   onFocus={() => setFocusedInput('caption')}
                   onBlur={() => setFocusedInput(null)}
                   rows={4}
                 />
              </div>
            )}
          </div>

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
               disabled={isSubmitDisabled}
               onMouseEnter={() => setIsSubmitHovered(true)}
               onMouseLeave={() => setIsSubmitHovered(false)}
             >
               Post
             </button>
          </div>
        </form>
      </div>
    </div>
  );
};
