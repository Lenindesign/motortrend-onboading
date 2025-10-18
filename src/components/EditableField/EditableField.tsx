import React from 'react';
import './EditableField.css';

export interface EditableFieldProps {
  label: string;
  value: string;
  onEdit?: () => void;
  isPassword?: boolean;
}

export const EditableField: React.FC<EditableFieldProps> = ({ 
  label, 
  value, 
  onEdit,
  isPassword = false 
}) => {
  return (
    <div className="editable-field">
      <label className="editable-field__label">{label}</label>
      <div className="editable-field__row">
        <span className="editable-field__value">
          {isPassword ? value : value}
        </span>
        <button className="editable-field__edit-btn" onClick={onEdit}>
          Edit
        </button>
      </div>
    </div>
  );
};

