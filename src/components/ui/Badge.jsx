import React from 'react';

/**
 * Shared Badge Component
 * Variants:
 * - neutral: neutral grey for general metadata
 * - success: green for active/verified listings
 * - warning: gold for highlights & alerts
 * - danger: red for tight deadlines
 */
export default function Badge({
  children,
  variant = 'neutral',
  className = '',
  icon: Icon,
  ...props
}) {
  const variantClass = {
    neutral: 'badge-neutral',
    success: 'badge-success',
    warning: 'badge-warning',
    danger: 'badge-danger'
  }[variant] || 'badge-neutral';

  return (
    <span className={`badge ${variantClass} ${className}`.trim()} {...props}>
      {Icon && <Icon size={12} className="flex-shrink-0" />}
      <span>{children}</span>
    </span>
  );
}
