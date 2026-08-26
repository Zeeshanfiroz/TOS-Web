import SectionHeading from './SectionHeading';
import Button from '../ui/Button';

/**
 * Join CTA — the intent moment. Tight copy, one action, generous
 * bottom whitespace before the footer (Stage 4 spacing spec).
 */
export default function JoinCta() {
  return (
    <section className="join-section mx-auto max-w-6xl px-4 pb-24 pt-12 sm:px-6">
      <div className="md:grid md:grid-cols-[180px_1fr] md:gap-12">
        <SectionHeading eyebrow="Join" />
        <div className="join-copy mt-6 md:mt-0">
          <h2 className="max-w-xl font-display text-[clamp(1.75rem,3vw,2.25rem)] font-semibold leading-[1.15] tracking-[-0.015em] text-humus">
            The best time to plant was last year. The second best is December.
          </h2>
          <p className="mt-5 max-w-lg text-[15px] leading-relaxed text-humus/70">
            Post-monsoon soil holds what you give it. You don't need a degree or
            documentation to join — only a December Saturday morning. We teach
            the rest: nursery care, compost turns, the logging habit.
          </p>
          <Button to="/signup" className="mt-8">
            Join the December planting →
          </Button>
        </div>
      </div>
    </section>
  );
}
