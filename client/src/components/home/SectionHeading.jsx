/**
 * SectionHeading — the notebook margin column: terracotta tick + eyebrow
 * label + optional Fraunces section title. Sits in the left column of a
 * `md:grid-cols-[180px_1fr]` section grid (Stage 2 layout system).
 *
 * Props:
 *   eyebrow — small uppercase label, e.g. 'The Log'
 *   title   — optional Fraunces H2 rendered under the eyebrow
 */
export default function SectionHeading({ eyebrow, title }) {
  return (
    <div>
      <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.08em] text-mahanadi">
        <span className="h-1.5 w-1.5 rounded-full bg-terracotta" aria-hidden="true" />
        {eyebrow}
      </p>
      {title && (
        <h2 className="mt-3 font-display text-[clamp(1.75rem,3vw,2.25rem)] font-semibold leading-[1.15] tracking-[-0.015em] text-humus">
          {title}
        </h2>
      )}
      <span className="mt-4 block h-px w-16 bg-humus/20" aria-hidden="true" />
    </div>
  );
}
