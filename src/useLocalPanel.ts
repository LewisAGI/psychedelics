import { useEffect, useRef, useState } from 'react';

/** One icon pop-out. Outside pointer or Escape closes it. */
export function useLocalPanel() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onDown = (event: PointerEvent) => {
      const element = event.target instanceof Element ? event.target : null;
      if (!element || !ref.current?.contains(element)) setOpen(false);
    };
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false);
    };
    document.addEventListener('pointerdown', onDown);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('pointerdown', onDown);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  return {
    open,
    ref,
    toggle: () => setOpen((value) => !value),
    close: () => setOpen(false),
  };
}
