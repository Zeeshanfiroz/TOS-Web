import { useRef, useState } from 'react';

/**
 * Lightweight magnetic hover effect without the heavy animation library.
 */
export default function MagneticButton({ children, className = '', strength = 0.3 }) {
  const ref = useRef(null);
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  const onMove = (e) => {
    const r = ref.current.getBoundingClientRect();
    const x = (e.clientX - r.left - r.width / 2) * strength;
    const y = (e.clientY - r.top - r.height / 2) * strength;
    setOffset({ x, y });
  };

  const onLeave = () => setOffset({ x: 0, y: 0 });

  return (
    <div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      style={{
        transform: `translate(${offset.x}px, ${offset.y}px)`,
        transition: 'transform 180ms ease-out',
      }}
      className={`inline-block ${className}`}
    >
      {children}
    </div>
  );
}
