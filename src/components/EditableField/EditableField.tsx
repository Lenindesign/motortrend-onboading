import React, { useState } from 'react';
import './EditableField.css';
import Button from '../../design-system/components/Button';
import Icon from '../Icon';

export interface EditableFieldProps {
  label: string;
  value: string;
  onSave?: (newValue: string) => void;
  isPassword?: boolean;
  placeholder?: string;
}

export const EditableField: React.FC<EditableFieldProps> = ({ 
  label, 
  value, 
  onSave,
  isPassword = false,
  placeholder
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(value);

  const handleEdit = () => {
    setIsEditing(true);
    setEditValue(value);
  };

  const handleSave = () => {
    if (editValue.trim() !== '' && editValue !== value) {
      onSave?.(editValue.trim());
    }
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditValue(value);
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSave();
    } else if (e.key === 'Escape') {
      handleCancel();
    }
  };

  return (
    <div className="editable-field">
      <label className="editable-field__label">{label}</label>
      <div className="editable-field__row">
        {isEditing ? (
          <div className="editable-field__edit-container">
            <input
              type={isPassword ? 'password' : 'text'}
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              onKeyDown={handleKeyDown}
              className="editable-field__input"
              placeholder={placeholder}
              autoFocus
            />
            <div className="editable-field__edit-actions">
              <button
                className="editable-field__action-btn editable-field__action-btn--save"
                onClick={handleSave}
                title="Save changes"
              >
                <Icon name="check" size={16} />
              </button>
              <button
                className="editable-field__action-btn editable-field__action-btn--cancel"
                onClick={handleCancel}
                title="Cancel editing"
              >
                <Icon name="close" size={16} />
              </button>
            </div>
          </div>
        ) : (
          <>
            <span className="editable-field__value">
              {isPassword ? '****************' : value}
            </span>
            <Button 
              color="neutrals3" 
              variant="solid" 
              size="default"
              onClick={handleEdit}
            >
              Edit
            </Button>
          </>
        )}
      </div>
    </div>
  );
};

