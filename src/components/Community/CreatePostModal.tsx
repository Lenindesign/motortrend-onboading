import React, { useState, useEffect } from 'react';
import type { Community } from '../../api/communityApi';
import { createPost } from '../../api/communityApi';
import Icon from '../Icon';
import './CreatePostModal.css';

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

  return (
    <div className="create-post-modal-overlay" onClick={onClose}>
      <div className="create-post-modal" onClick={e => e.stopPropagation()}>
        <div className="create-post-modal__header">
          <h2>Create a post</h2>
          <button className="create-post-modal__close" onClick={onClose}>
            <Icon name="close" size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Community Selector */}
          <div className="create-post-modal__selector-wrapper">
             <select 
               className="create-post-modal__selector"
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
          <div className="create-post-modal__tabs">
            <button 
              type="button"
              className={`create-post-modal__tab ${tab === 'text' ? 'create-post-modal__tab--active' : ''}`}
              onClick={() => setTab('text')}
            >
              <Icon name="article" size={20} />
              Post
            </button>
            <button 
              type="button"
              className={`create-post-modal__tab ${tab === 'image' ? 'create-post-modal__tab--active' : ''}`}
              onClick={() => setTab('image')}
            >
              <Icon name="image" size={20} />
              Image & Video
            </button>
          </div>

          <div className="create-post-modal__body">
            <input 
              type="text" 
              className="create-post-modal__title-input"
              placeholder="Title"
              value={title}
              onChange={e => setTitle(e.target.value)}
              maxLength={300}
              required
            />

            {tab === 'text' && (
              <textarea 
                className="create-post-modal__content-input"
                placeholder="Text (optional)"
                value={content}
                onChange={e => setContent(e.target.value)}
                rows={10}
              />
            )}

            {tab === 'image' && (
              <div className="create-post-modal__image-section">
                 <input 
                   type="url"
                   className="create-post-modal__url-input"
                   placeholder="Paste image URL"
                   value={imageUrl}
                   onChange={e => setImageUrl(e.target.value)}
                 />
                 <textarea 
                   className="create-post-modal__caption-input"
                   placeholder="Caption / Text (optional)"
                   value={content}
                   onChange={e => setContent(e.target.value)}
                   rows={4}
                 />
              </div>
            )}
          </div>

          <div className="create-post-modal__footer">
             <button type="button" className="create-post-modal__cancel" onClick={onClose}>
               Cancel
             </button>
             <button 
               type="submit" 
               className="create-post-modal__submit"
               disabled={!selectedCommunityId || !title}
             >
               Post
             </button>
          </div>
        </form>
      </div>
    </div>
  );
};


