import React, { useState } from 'react';
import { createCommunity } from '../../api/communityApi';
import Icon from '../Icon';
import './CreateCommunityModal.css';

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

  return (
    <div className="create-community-modal-overlay" onClick={onClose}>
      <div className="create-community-modal" onClick={e => e.stopPropagation()}>
        <div className="create-community-modal__header">
          <h2>Create a Community</h2>
          <button className="create-community-modal__close" onClick={onClose}>
            <Icon name="close" size={24} />
          </button>
        </div>

        <div className="create-community-modal__content">
          <div className="create-community-modal__info">
            <h3>Name</h3>
            <p>Community names including capitalization cannot be changed.</p>
          </div>
          
          <form onSubmit={handleSubmit}>
            <div className="create-community-modal__input-wrapper">
              <span className="create-community-modal__prefix">c/</span>
              <input 
                type="text" 
                className="create-community-modal__input"
                value={name}
                onChange={e => setName(e.target.value)}
                maxLength={21}
                required
              />
            </div>
            <div className="create-community-modal__char-count">
              {21 - name.length} Characters remaining
            </div>

            <div className="create-community-modal__info">
               <h3>Description</h3>
               <p>What is this community about?</p>
            </div>

            <textarea
               className="create-community-modal__textarea"
               value={description}
               onChange={e => setDescription(e.target.value)}
               maxLength={500}
               rows={4}
            />

            <div className="create-community-modal__info">
               <h3>Icon (Optional)</h3>
               <p>URL to an image for your community icon.</p>
            </div>

            <input
               type="url"
               className="create-community-modal__textarea"
               value={icon}
               onChange={e => setIcon(e.target.value)}
               placeholder="https://example.com/icon.png"
               style={{ minHeight: 'auto', height: 'auto', padding: '12px' }}
            />

            <div className="create-community-modal__footer">
              <button type="button" className="create-community-modal__cancel" onClick={onClose}>
                Cancel
              </button>
              <button 
                type="submit" 
                className="create-community-modal__submit"
                disabled={!name}
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


