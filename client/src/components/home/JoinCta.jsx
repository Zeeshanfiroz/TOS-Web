import SectionHeading from './SectionHeading';
import Button from '../ui/Button';

/**
 * Join CTA — the intent moment. Tight copy, one action, generous
 * bottom whitespace before the footer (Stage 4 spacing spec).
 */
export default function JoinCta() {
  return (
    /* Tonal break #2 — full Humus dark closing beat (Stage: section rhythm) */
    <section className="join-section paper-texture bg-humus py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 md:grid md:grid-cols-[180px_1fr] md:gap-12">
        <SectionHeading eyebrow="Join" dark />
        <div className="join-copy mt-6 md:mt-0">
          <h2 className="max-w-xl font-display text-[clamp(1.75rem,3vw,2.25rem)] font-semibold leading-[1.15] tracking-[-0.015em] text-kraft">
            The best time to plant was last year. The second best is December.
          </h2>
          <p className="mt-5 max-w-lg text-[15px] font-medium leading-relaxed text-kraft/85">
            Post-monsoon soil holds what you give it. You don't need a degree or
            documentation to join — only a December Saturday morning. We teach
            the rest: nursery care, compost turns, the logging habit.
          </p>
          <Button variant="kraft" to="/signup" className="mt-8">
            Join the December planting →
          </Button>
        </div>
      </div>
    </section>
  );
}
