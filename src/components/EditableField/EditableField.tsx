import React from 'react';
import './EditableField.css';
import Button from '../../design-system/components/Button';

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
        <Button 
          color="neutrals3" 
          variant="solid" 
          size="default"
          onClick={onEdit}
        >
          Edit
        </Button>
      </div>
    </div>
  );
};

