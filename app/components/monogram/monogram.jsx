import { forwardRef } from 'react';
import { classes } from '~/utils/style';
import styles from './monogram.module.css';
import zMask from '~/assets/z-blk.png';

/**
 * Z mark as a CSS mask so fill can swap to Harvard Crimson (--accent)
 * on hover when `highlight` is set (navbar logo).
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
