import { useRef, useState } from 'react';

/**
 * Lightweight 3D tilt using CSS transforms instead of the heavy animation library.
 */
export default function TiltCard({ children, className = '', max = 8 }) {
  const ref = useRef(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  const onMove = (e) => {
    const r = ref.current.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width;
    const py = (e.clientY - r.top) / r.height;
    setTilt({
      x: (0.5 - py) * max * 2,
      y: (px - 0.5) * max * 2,
    });
  };

  const onLeave = () => setTilt({ x: 0, y: 0 });

  return (
    <div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      style={{
        transform: `perspective(900px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
        transformStyle: 'preserve-3d',
        transition: 'transform 180ms ease-out',
      }}
      className={className}
    >
      {children}
    </div>
  );
}
