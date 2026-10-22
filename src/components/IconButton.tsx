import type { ReactNode } from 'react';

export function IconButton({
  label,
  pressed,
  expanded,
  controls,
  toggle,
  onClick,
  children,
}: {
  label: string;
  pressed?: boolean;
  expanded?: boolean;
  controls?: string;
  toggle?: boolean;
  onClick?: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      className="icon-button"
      data-tip={label}
      data-panel-toggle={toggle ? '' : undefined}
      aria-label={label}
      aria-pressed={pressed}
      aria-expanded={expanded}
      aria-controls={controls}
      onClick={onClick}
    >
      {children}
    </button>
  );
}
