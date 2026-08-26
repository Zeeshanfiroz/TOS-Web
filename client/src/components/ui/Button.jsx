import { Link } from 'react-router-dom';

/**
 * Button — the only button component on redesigned pages. Encforces the
 * Stage 2 token system (Laterite primary, luminance-safe hover per
 * checkpoint 3: hover = darker Laterite + 1px lift, never a hue shift).
 *
 * Props:
 *   variant  — 'primary' (Laterite solid) | 'outline' (Humus border) | 'text'
 *   to       — renders a react-router <Link> when provided
 *   className — extra classes (e.g. 'w-full')
 */
const variants = {
  primary:
    'bg-laterite text-kraft hover:bg-laterite-dark hover:-translate-y-px ' +
    'shadow-[0_10px_24px_-12px_rgba(138,59,38,0.55)] hover:shadow-[0_14px_28px_-12px_rgba(111,47,30,0.6)]',
  outline:
    'bg-transparent text-humus border border-humus/25 hover:border-laterite hover:text-laterite',
  text: 'text-laterite hover:text-terracotta underline-offset-4 hover:underline',
};

export default function Button({
  variant = 'primary',
  to,
  className = '',
  children,
  ...rest
}) {
  const cls =
    'inline-flex items-center justify-center gap-2 rounded-lg px-6 py-3 ' +
    'text-sm font-semibold tracking-wide transition-all duration-200 ' +
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-laterite ' +
    'focus-visible:ring-offset-2 focus-visible:ring-offset-kraft ' +
    `disabled:opacity-50 disabled:pointer-events-none ${variants[variant]} ${className}`;

  if (to) {
    return (
      <Link to={to} className={cls} {...rest}>
        {children}
      </Link>
    );
  }
  return (
    <button className={cls} {...rest}>
      {children}
    </button>
  );
}
