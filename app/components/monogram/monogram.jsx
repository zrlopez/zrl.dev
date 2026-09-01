import { forwardRef } from 'react';
import { classes } from '~/utils/style';
import styles from './monogram.module.css';
import zMask from '~/assets/z-blk.png';

/**
 * Z mark as a CSS mask. With `highlight`, fill fades textLight →
 * Harvard Crimson (--accent) on hover — same treatment as nav social icons.
 */
export const Monogram = forwardRef(({ highlight, className, ...props }, ref) => {
  return (
    <span
      aria-hidden
      className={classes(styles.monogram, highlight && styles.highlight, className)}
      style={{
        '--monogram-mask': `url(${zMask})`,
      }}
      ref={ref}
      {...props}
    />
  );
});
