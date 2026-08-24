import { motion } from 'framer-motion';

/**
 * Reveal — buttery scroll-triggered entrance.
 * Usage: <Reveal delay={0.1} y={40}>...</Reveal>
 */
export default function Reveal({
  children,
  delay = 0,
  y = 36,
  x = 0,
  scale = 1,
  once = true,
  className = '',
  duration = 0.7,
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y, x, scale }}
      whileInView={{ opacity: 1, y: 0, x: 0, scale: 1 }}
      viewport={{ once, margin: '-60px' }}
      transition={{ duration, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
