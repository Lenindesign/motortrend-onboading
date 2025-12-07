/**
 * EditableField Component
 * Migrated to inline styles for Tailwind compatibility
 */

import React, { useState } from 'react';
import Button from '../../design-system/components/Button';
import Icon from '../Icon';

export interface EditableFieldProps {
  label: string;
  value: string;
  onSave?: (newValue: string) => void;
  isPassword?: boolean;
  placeholder?: string;
  className?: string;
}

export const EditableField: React.FC<EditableFieldProps> = ({ 
  label, 
  value, 
  onSave,
  isPassword = false,
  placeholder,
  className = '',
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(value);
  const [isFocused, setIsFocused] = useState(false);
  const [isSaveHovered, setIsSaveHovered] = useState(false);
  const [isCancelHovered, setIsCancelHovered] = useState(false);

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

  // Container styles
  const containerStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: 'var(--spacing-component-sm, 8px)',
    width: '100%',
  };

  // Label styles
  const labelStyle: React.CSSProperties = {
    fontFamily: 'var(--font-body, Geist, sans-serif)',
    fontWeight: 500,
    fontSize: '14px',
    lineHeight: '1.5em',
    color: 'var(--color-neutrals-4, #6E7481)',
  };

  // Row styles
  const rowStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 'var(--spacing-3, 24px)',
    width: '100%',
  };

  // Value styles
  const valueStyle: React.CSSProperties = {
    fontFamily: 'var(--font-heading, Poppins, sans-serif)',
    fontWeight: 600,
    fontSize: '18px',
    lineHeight: '1.56em',
    color: 'var(--color-neutrals-1, #141416)',
    minHeight: '44px',
    display: 'flex',
    alignItems: 'center',
    flex: 1,
  };

  // Edit container styles
  const editContainerStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 'var(--spacing-component-sm, 8px)',
    width: '100%',
    flex: 1,
  };

  // Input styles
  const inputStyle: React.CSSProperties = {
    flex: 1,
    padding: '8px 12px',
    border: `2px solid ${isFocused ? 'var(--color-primary-1, #E90C17)' : 'var(--color-primary-1, #E90C17)'}`,
    borderRadius: 'var(--border-radius-md, 8px)',
    fontFamily: 'var(--font-body, Geist, sans-serif)',
    fontWeight: 400,
    fontSize: '16px',
    lineHeight: '1.56em',
    color: 'var(--color-neutrals-1, #141416)',
    backgroundColor: 'var(--color-white, #FFFFFF)',
    outline: 'none',
    transition: 'border-color 150ms ease-in-out, box-shadow 150ms ease-in-out',
    boxShadow: isFocused ? '0 0 0 3px rgba(233, 12, 23, 0.15)' : 'none',
  };

  // Edit actions styles
  const editActionsStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'row',
    gap: '4px',
  };

  // Action button base styles
  const actionBtnBaseStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '28px',
    height: '28px',
    border: 'none',
    borderRadius: '100px',
    cursor: 'pointer',
    transition: 'transform 150ms ease-in-out',
  };

  // Save button styles
  const saveBtnStyle: React.CSSProperties = {
    ...actionBtnBaseStyle,
    backgroundColor: 'var(--color-semantic-success, #34A853)',
    color: 'var(--color-white, #FFFFFF)',
    transform: isSaveHovered ? 'translateY(-1px)' : 'none',
  };

  // Cancel button styles
  const cancelBtnStyle: React.CSSProperties = {
    ...actionBtnBaseStyle,
    backgroundColor: 'var(--color-neutrals-5, #B1B5C3)',
    color: 'var(--color-neutrals-2, #23262F)',
    transform: isCancelHovered ? 'translateY(-1px)' : 'none',
  };

  return (
    <div className={className} style={containerStyle}>
      <label style={labelStyle}>{label}</label>
      <div style={rowStyle}>
        {isEditing ? (
          <div style={editContainerStyle}>
            <input
              type={isPassword ? 'password' : 'text'}
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              onKeyDown={handleKeyDown}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              style={inputStyle}
              placeholder={placeholder}
              autoFocus
            />
            <div style={editActionsStyle}>
              <button
                style={saveBtnStyle}
                onClick={handleSave}
                onMouseEnter={() => setIsSaveHovered(true)}
                onMouseLeave={() => setIsSaveHovered(false)}
                title="Save changes"
              >
                <Icon name="check" size={16} />
              </button>
              <button
                style={cancelBtnStyle}
                onClick={handleCancel}
                onMouseEnter={() => setIsCancelHovered(true)}
                onMouseLeave={() => setIsCancelHovered(false)}
                title="Cancel editing"
              >
                <Icon name="close" size={16} />
              </button>
            </div>
          </div>
        ) : (
          <>
            <span style={valueStyle}>
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

