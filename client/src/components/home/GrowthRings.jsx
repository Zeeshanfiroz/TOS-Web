/**
 * GrowthRings — the signature element (Stage 2). Three concentric rings,
 * one per year of real logged club history (2024 founded · 2025 first
 * mass plantation · 2026 this site). Pure SVG, no text inside — year
 * legends live in HTML beside (desktop) or below (mobile) the rings.
 *
 * Every circle carries pathLength="1" + className="hero-ring" so the hero
 * GSAP timeline can draw them via stroke-dashoffset. With
 * prefers-reduced-motion the rings render fully drawn (no animation).
 *
 * Props:
 *   className — size/position classes on the <svg>
 */
const RINGS = [
  { r: 78, color: '#2F5D3A', width: 2.5 }, // 2024 — innermost
  { r: 132, color: '#2F5D3A', width: 2, opacity: 0.65 }, // 2025
  { r: 188, color: '#3E7A4C', width: 2.5 }, // 2026 — outermost, this year
];

export default function GrowthRings({ className = '' }) {
  return (
    <svg
      viewBox="0 0 420 420"
      className={className}
      role="img"
      aria-label="Three concentric growth rings — one for each year of the club's logged work, 2023 to 2025"
    >
      {/* faint engineering-drawing crosshairs */}
      <g stroke="#26201A" strokeOpacity="0.12" strokeWidth="1">
        <line x1="210" y1="8" x2="210" y2="412" />
        <line x1="8" y1="210" x2="412" y2="210" />
      </g>

      {RINGS.map((ring) => (
        <circle
          key={ring.r}
          className="hero-ring"
          cx="210"
          cy="210"
          r={ring.r}
          fill="none"
          stroke={ring.color}
          strokeWidth={ring.width}
          strokeOpacity={ring.opacity ?? 1}
          pathLength="1"
          strokeDasharray="1"
        />
      ))}

      {/* center pith dot */}
      <circle cx="210" cy="210" r="3.5" fill="#26201A" />

      {/* survey tick marks on the outer ring */}
      <g stroke="#8A3B26" strokeWidth="1.5">
        <line x1="210" y1="16" x2="210" y2="30" />
        <line x1="210" y1="390" x2="210" y2="404" />
        <line x1="16" y1="210" x2="30" y2="210" />
        <line x1="390" y1="210" x2="404" y2="210" />
      </g>
    </svg>
  );
}
