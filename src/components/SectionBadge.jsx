import React from 'react';

/**
 * Reusable SectionBadge / IconLabel Component
 * Guarantees consistent icon-to-text spacing, flex alignment, and non-shrinking icons
 * across all pages, badges, section headings, and meta tags.
 */
export default function SectionBadge({
  icon: Icon,
  children,
  variant = 'default',
  size = 'md',
  className = '',
  style = {},
  uppercase = false,
  as: Component = 'div'
}) {
  const variantClassMap = {
    default: 'section-badge-default',
    govt: 'badge-govt',
    verified: 'badge-verified',
    urgent: 'badge-urgent',
    private: 'badge-private',
    flagship: 'section-badge-flagship',
    emerald: 'section-badge-emerald',
    blue: 'section-badge-blue',
    amber: 'section-badge-amber',
    purple: 'section-badge-purple',
    subtle: 'section-badge-subtle',
    outline: 'section-badge-outline'
  };

  const sizeClassMap = {
    xs: 'section-badge-xs',
    sm: 'section-badge-sm',
    md: 'section-badge-md',
    lg: 'section-badge-lg'
  };

  const selectedVariantClass = variantClassMap[variant] || variantClassMap.default;
  const selectedSizeClass = sizeClassMap[size] || sizeClassMap.md;
  const uppercaseClass = uppercase ? 'uppercase tracking-wider' : '';

  return (
    <Component
      className={`section-badge ${selectedVariantClass} ${selectedSizeClass} ${uppercaseClass} ${className}`.trim()}
      style={style}
    >
      {Icon && (
        <span className="section-badge-icon">
          {React.isValidElement(Icon) ? Icon : <Icon size={size === 'xs' ? 12 : size === 'sm' ? 13 : size === 'lg' ? 18 : 15} />}
        </span>
      )}
      <span className="section-badge-text">{children}</span>
    </Component>
  );
}
