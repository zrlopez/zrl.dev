import { forwardRef, useId } from 'react';
import { classes } from '~/utils/style';
import styles from './monogram.module.css';

export const Monogram = forwardRef(({ highlight, className, ...props }, ref) => {
  const id = useId();
  const clipId = `${id}monogram-clip`;

  return (
    <svg
      aria-hidden
      className={classes(styles.monogram, className)}
      width="48"
      height="29"
      viewBox="0 0 48 29"
      ref={ref}
      {...props}
    >
      <defs>
        <clipPath id={clipId}>
          {/* Z built like Hamish's W: thick bars, thinner diagonal, rounded outer corner, accent mark */}
          <path d="M0 0h33.6A2.4 2.4 0 0 1 36 2.4V6.5H0ZM0 22.5H36V29H0ZM32.37 5.26 36.18 7.74 4.18 23.74.37 21.26ZM46.7 2.8A2 2 0 0 0 45 0h-7l5.5 10 3.2-7.2Z" />
        </clipPath>
      </defs>
      <rect clipPath={`url(#${clipId})`} width="100%" height="100%" />
      {highlight && (
        <g clipPath={`url(#${clipId})`}>
          <rect className={styles.highlight} width="100%" height="100%" />
        </g>
      )}
    </svg>
  );
});
