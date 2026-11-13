import React from 'react';

/**
 * Shared SectionHeading Component
 * Layout:
 * - margin-bottom: 24px (--space-3)
 * - h2: 28/36 desktop, 24/30 mobile, Inter 600, tight line-height
 * - subtitle: body 16/26 text-secondary
 * - Optional right-side actions / badge slot
 */
export default function SectionHeading({
  title,
  subtitle,
  badge,
  action,
  className = '',
  titleClassName = '',
  ...props
}) {
  return (
    <div className={`section-heading flex flex-col md:flex-row md:items-end justify-between gap-3 ${className}`.trim()} {...props}>
      <div>
        {badge && <div className="mb-2">{badge}</div>}
        <h2 className={`section-heading-title ${titleClassName}`.trim()}>
          {title}
        </h2>
        {subtitle && (
          <p className="section-heading-desc">
            {subtitle}
          </p>
        )}
      </div>
      {action && (
        <div className="flex-shrink-0 mt-2 md:mt-0">
          {action}
        </div>
      )}
    </div>
  );
}
