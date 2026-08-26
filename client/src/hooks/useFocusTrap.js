import { useEffect, useRef } from 'react';

/**
 * Traps keyboard focus inside a modal/lightbox while `active` is true:
 *  - Tab / Shift+Tab cycle within the container (never escape to the page)
 *  - Focus moves into the container on open
 *  - On close, focus returns to the element that was focused before opening
 *
 * Usage:
 *   const trapRef = useFocusTrap(showModal);
 *   <div ref={trapRef} role="dialog" aria-modal="true">...</div>
 */
export default function useFocusTrap(active) {
  const ref = useRef(null);

  useEffect(() => {
    if (!active || !ref.current) return;

    const container = ref.current;
    const previouslyFocused = document.activeElement;

    // Move focus into the modal on open (first focusable element)
    const focusables = () =>
      container.querySelectorAll(
        'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])'
      );
    focusables()[0]?.focus();

    const onKeyDown = (e) => {
      if (e.key !== 'Tab') return;

      const list = Array.from(focusables()).filter(
        (el) => el.offsetParent !== null // visible only
      );
      if (list.length === 0) return;

      const first = list[0];
      const last = list[list.length - 1];

      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };

    container.addEventListener('keydown', onKeyDown);
    return () => {
      container.removeEventListener('keydown', onKeyDown);
      // Return focus to wherever the user was before opening
      previouslyFocused?.focus?.();
    };
  }, [active]);

  return ref;
}
