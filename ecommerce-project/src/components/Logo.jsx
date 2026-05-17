import './Logo.css';

/**
 * Senaye wordmark.
 *  - Desktop: "Senaye." with an orange accent dot
 *  - Mobile (≤575px): a circular "S" badge
 */
export function Logo({ variant = 'desktop' }) {
  if (variant === 'mobile') {
    return (
      <span className="logo-mark logo-mobile" aria-label="Senaye">
        <span className="logo-badge">S</span>
      </span>
    );
  }

  return (
    <span className="logo-mark logo-desktop" aria-label="Senaye">
      <span className="logo-text">Senaye</span>
      <span className="logo-dot">.</span>
    </span>
  );
}
