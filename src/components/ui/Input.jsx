import React from 'react';

/**
 * Shared Input Component
 * Sizing: Height 44px
 * Focus: High-visibility focus ring
 */
export default function Input({
  type = 'text',
  value,
  onChange,
  placeholder,
  className = '',
  icon: Icon,
  disabled = false,
  ...props
}) {
  if (Icon) {
    return (
      <div className="relative flex items-center w-full">
        <div className="absolute left-3.5 pointer-events-none text-muted flex items-center">
          <Icon size={18} />
        </div>
        <input
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled}
          className={`input-field pl-10 ${className}`.trim()}
          {...props}
        />
      </div>
    );
  }

  return (
    <input
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      disabled={disabled}
      className={`input-field ${className}`.trim()}
      {...props}
    />
  );
}
