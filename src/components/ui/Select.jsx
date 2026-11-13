import React from 'react';

/**
 * Shared Select Component
 * Sizing: Height 44px
 * Focus: High-visibility focus ring
 */
export default function Select({
  value,
  onChange,
  children,
  className = '',
  disabled = false,
  ...props
}) {
  return (
    <select
      value={value}
      onChange={onChange}
      disabled={disabled}
      className={`select-field ${className}`.trim()}
      {...props}
    >
      {children}
    </select>
  );
}
