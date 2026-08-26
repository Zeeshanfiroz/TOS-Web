import { useEffect } from 'react';

/**
 * Locks body scroll while `locked` is true (modals, lightboxes, drawers).
 * Restores the previous overflow value on release/unmount — safe to use in
 * multiple components without them fighting over document.body.style.
 *
 * Usage:  useLockBodyScroll(showModal);
 */
export default function useLockBodyScroll(locked) {
  useEffect(() => {
    if (!locked) return;

    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = previous;
    };
  }, [locked]);
}

