import { Field, ErrorMessage } from 'formik';

/**
 * Shared input classes — single source of truth for form field styling.
 * (Phase 6 item 18: kills the copy-paste drift across Login/Signup/Contact.)
 */
export const inputClasses =
  'w-full px-4 py-3 rounded-xl border border-gray-200 bg-white focus:outline-none ' +
  'focus:ring-2 focus:ring-forest-300 focus:border-forest-400';

/**
 * TextField — labelled Formik text/email input with built-in a11y:
 *  - <label htmlFor> wired to the input
 *  - aria-describedby → the error paragraph
 *  - aria-invalid flips automatically from Formik's `errors` object
 *
 * Props:
 *   label      — visible label text
 *   name       — Formik field name (also used as the input id)
 *   type       — input type (default 'text')
 *   placeholder — placeholder text
 *   errors     — Formik `errors` object (pass from the render prop)
 *   ...rest    — forwarded to <Field> (autoComplete, inputMode, etc.)
 */
export default function TextField({
  label,
  name,
  type = 'text',
  placeholder,
  errors,
  ...rest
}) {
  const errorId = `${name}-error`;
  const invalid = errors?.[name] ? true : undefined;

  return (
    <div>
      <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1.5">
        {label}
      </label>
      <Field
        id={name}
        name={name}
        type={type}
        placeholder={placeholder}
        aria-describedby={errorId}
        aria-invalid={invalid}
        className={inputClasses}
        {...rest}
      />
      <ErrorMessage
        id={errorId}
        name={name}
        component="p"
        className="text-xs text-red-500 mt-1"
      />
    </div>
  );
}

/**
 * TextArea — same contract as TextField but renders a multi-line field.
 *
 * Props:
 *   rows — visible line count (default 5)
 */
export function TextArea({ label, name, rows = 5, placeholder, errors, ...rest }) {
  const errorId = `${name}-error`;
  const invalid = errors?.[name] ? true : undefined;

  return (
    <div>
      <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1.5">
        {label}
      </label>
      <Field
        as="textarea"
        id={name}
        name={name}
        rows={rows}
        placeholder={placeholder}
        aria-describedby={errorId}
        aria-invalid={invalid}
        className={`${inputClasses} resize-none`}
        {...rest}
      />
      <ErrorMessage
        id={errorId}
        name={name}
        component="p"
        className="text-xs text-red-500 mt-1"
      />
    </div>
  );
}
