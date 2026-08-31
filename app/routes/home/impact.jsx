import { Heading } from '~/components/heading';
import { Section } from '~/components/section';
import { Text } from '~/components/text';
import { Transition } from '~/components/transition';
import { useEffect, useState } from 'react';
import { useReducedMotion } from 'framer-motion';
import styles from './impact.module.css';

const STATS = [
  { value: 7, suffix: '', label: 'Years in Apple ecosystem' },
  { value: 12, suffix: '%', label: 'Accuracy lift (targeted domains)' },
  { value: 500, suffix: '', label: 'Assistant interactions/day reviewed' },
  { value: 20, suffix: '%', label: 'Repeat visits reduced' },
];

function useCountUp(target, active, durationMs = 1400) {
  const [count, setCount] = useState(0);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    if (!active) return undefined;
    if (reduceMotion) {
      setCount(target);
      return undefined;
    }

    let frame = 0;
    const start = performance.now();

    const tick = now => {
      const progress = Math.min((now - start) / durationMs, 1);
      const eased = 1 - Math.pow(1 - progress, 4);
      setCount(Math.floor(target * eased));
      if (progress < 1) {
        frame = requestAnimationFrame(tick);
      } else {
        setCount(target);
      }
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [active, durationMs, reduceMotion, target]);

  return count;
}

function StatCard({ value, suffix, label, visible, delay }) {
  const count = useCountUp(value, visible);

  return (
    <div
      className={styles.card}
      data-visible={visible}
      style={{ '--delay': `${delay}ms` }}
    >
      <p className={styles.value}>
        <span className={styles.number}>{count}</span>
        {suffix}
      </p>
      <p className={styles.label}>{label}</p>
    </div>
  );
}

export function Impact({ id, sectionRef, visible }) {
  const titleId = `${id}-title`;

  return (
    <Section
      className={styles.impact}
      as="section"
      id={id}
      ref={sectionRef}
      aria-labelledby={titleId}
      tabIndex={-1}
    >
      <Transition in={visible} timeout={0}>
        {({ visible: transitionVisible, nodeRef }) => (
          <div className={styles.inner} ref={nodeRef}>
            <div className={styles.header} data-visible={transitionVisible}>
              <Heading level={3} as="h2" id={titleId} className={styles.title}>
                Impact
              </Heading>
              <Text size="m" as="p" className={styles.lede}>
                Headline numbers from Apple data ops and annotation QA work —
                not vanity metrics, just the ones that still shape how I build.
              </Text>
            </div>
            <div className={styles.grid}>
              {STATS.map((stat, index) => (
                <StatCard
                  key={stat.label}
                  {...stat}
                  visible={transitionVisible}
                  delay={index * 90}
                />
              ))}
            </div>
          </div>
        )}
      </Transition>
    </Section>
  );
}
