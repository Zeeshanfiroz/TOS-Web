import { useEffect } from 'react';
import { motion } from 'framer-motion';
import useFocusTrap from '../../hooks/useFocusTrap';
import useLockBodyScroll from '../../hooks/useLockBodyScroll';

/**
 * Lightbox — THE shared detail modal for images and event write-ups.
 * Gallery and the Home work grid both render through this; do not fork
 * another modal. Includes focus trap, body scroll lock, Escape to close,
 * and arrow-key navigation (when onPrev/onNext are provided).
 *
 * Props:
 *   open     — render toggle (wrap in <AnimatePresence> at call site)
 *   onClose  — called by overlay click, × button, or Escape
 *   item     — { src?, alt?, title, meta?, description?: string[], photoCount? }
 *   onPrev / onNext — optional; arrows render + arrow keys work when given
 *   label    — accessible dialog name
 */
export default function Lightbox({
  open,
  onClose,
  item,
  onPrev,
  onNext,
  label = 'Details',
}) {
  const trapRef = useFocusTrap(open);
  useLockBodyScroll(open);

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key === 'Escape') onClose?.();
      if (e.key === 'ArrowLeft' && onPrev) onPrev();
      if (e.key === 'ArrowRight' && onNext) onNext();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose, onPrev, onNext]);

  if (!open || !item) return null;

  return (
    <motion.div
      ref={trapRef}
      role="dialog"
      aria-modal="true"
      aria-label={label}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-humus/95 p-4"
      onClick={onClose}
    >
      <button
        onClick={onClose}
        aria-label="Close"
        className="absolute right-5 top-5 rounded-md px-2 py-1 text-3xl leading-none text-kraft/80 hover:text-kraft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-kraft"
      >
        ×
      </button>

      {onPrev && (
        <button
          className="absolute left-4 px-3 text-4xl text-kraft/70 hover:text-kraft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-kraft"
          onClick={(e) => {
            e.stopPropagation();
            onPrev();
          }}
          aria-label="Previous"
        >
          ‹
        </button>
      )}

      <motion.div
        key={item.title}
        initial={{ scale: 0.96 }}
        animate={{ scale: 1 }}
        className="max-h-[88vh] w-full max-w-2xl overflow-y-auto rounded-lg border border-kraft/15 bg-humus"
        onClick={(e) => e.stopPropagation()}
      >
        {item.src && (
          <img
            src={item.src}
            alt={item.alt || item.title}
            className="max-h-[55vh] w-full object-cover"
          />
        )}
        <div className="p-6 md:p-8">
          <h3 className="font-display text-2xl font-semibold leading-tight text-kraft">
            {item.title}
          </h3>
          {item.meta && (
            <p className="mt-1.5 text-xs uppercase tracking-[0.08em] text-kraft/60">
              {item.meta}
            </p>
          )}
          {item.photoCount > 0 && (
            <p className="mt-2 inline-block rounded-full border border-kraft/25 px-3 py-0.5 text-[11px] uppercase tracking-[0.06em] text-kraft/70">
              {item.photoCount} photo{item.photoCount > 1 ? 's' : ''} in the archive
            </p>
          )}
          {(item.description?.length ?? 0) > 0 && (
            <div className="mt-4 space-y-3 border-t border-kraft/10 pt-4 text-[14px] leading-relaxed text-kraft/85">
              {item.description.map((para, i) => (
                <p key={i}>{para}</p>
              ))}
            </div>
          )}
        </div>
      </motion.div>

      {onNext && (
        <button
          className="absolute right-4 px-3 text-4xl text-kraft/70 hover:text-kraft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-kraft"
          onClick={(e) => {
            e.stopPropagation();
            onNext();
          }}
          aria-label="Next"
        >
          ›
        </button>
      )}
    </motion.div>
  );
}
