import { useState } from 'react';

/**
 * PasswordInput — Formik <Field component={PasswordInput} /> ke saath use hota hai.
 * Eye toggle se password show/hide hota hai.
 */
export default function PasswordInput({ field, className = '', ...props }) {
  const [show, setShow] = useState(false);

  return (
    <div className="relative">
      <input
        {...field}
        {...props}
        type={show ? 'text' : 'password'}
        className={`${className} pr-12`}
      />
      <button
        type="button"
        onClick={() => setShow((s) => !s)}
        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-forest-600 transition-colors"
        aria-label={show ? 'Hide password' : 'Show password'}
        tabIndex={-1}
      >
        {show ? (
          /* Eye-off */
          <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M13.875 18.825A10.05 10.05 0 0 1 12 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 0 1 1.563-3.029m5.858.908a3 3 0 1 1 4.243 4.243M9.878 9.878 9.88 9.88m4.242 4.242 3.29 3.29M5 12H4a1 1 0 0 1 0-2h1m5-5V4a1 1 0 1 1 2 0v1.5m4.5 0V4a1 1 0 1 0-2 0v1.5"
            />
          </svg>
        ) : (
          /* Eye */
          <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
            />
          </svg>
        )}
      </button>
    </div>
  );
}
