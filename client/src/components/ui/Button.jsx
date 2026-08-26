import { Link } from 'react-router-dom';

/**
 * Button — the only button component on redesigned pages. Enforces the
 * Stage 2 token system. Sustainability-forward: primary is deep Neem
 * green (7.64:1 contrast on white text), hover is darker Neem + 1px
 * lift — luminance-based, colorblind-safe (checkpoint 3).
 *
 * Props:
 *   variant  — 'primary' (Neem solid) | 'outline' (Humus border) | 'text'
 *   to       — renders a react-router <Link> when provided
 *   className — extra classes (e.g. 'w-full')
 */
const variants = {
  primary:
    'bg-neem text-kraft hover:bg-neem-dark hover:-translate-y-px ' +
    'shadow-[0_10px_24px_-12px_rgba(47,93,58,0.55)] hover:shadow-[0_14px_28px_-12px_rgba(36,73,44,0.6)]',
  outline:
    'bg-transparent text-humus border border-humus/25 hover:border-neem hover:text-neem',
  text: 'text-neem hover:text-laterite underline-offset-4 hover:underline',
  kraft:
    'bg-kraft text-humus hover:bg-white hover:-translate-y-px ' +
    'shadow-[0_10px_24px_-12px_rgba(0,0,0,0.45)]',
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
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neem ' +
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
