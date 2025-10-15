import React from 'react';

interface ToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  description?: string;
  disabled?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const Toggle: React.FC<ToggleProps> = ({
  checked,
  onChange,
  label,
  description,
  disabled = false,
  size = 'md',
  className = '',
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.checked);
  };

  return (
    <div className={`toggle-container ${size} ${className}`}>
      <label className="toggle-label">
        <input
          type="checkbox"
          checked={checked}
          onChange={handleChange}
          disabled={disabled}
          className="toggle-input"
        />
        <span className="toggle-switch">
          <span className="toggle-thumb" />
        </span>
        <div className="toggle-content">
          {label && <span className="toggle-label-text">{label}</span>}
          {description && <span className="toggle-description">{description}</span>}
        </div>
      </label>
    </div>
  );
};

export default Toggle;
