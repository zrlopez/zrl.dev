import { forwardRef } from 'react';
import { classes } from '~/utils/style';
import styles from './monogram.module.css';
import zWht from '~/assets/z-wht.png';
import zBlk from '~/assets/z-blk.png';

export const Monogram = forwardRef(({ className, ...props }, ref) => {
  return (
    <span
      aria-hidden
      className={classes(styles.monogram, className)}
      ref={ref}
      {...props}
    >
      <img
        src={zWht}
        alt=""
        className={styles.image}
        data-theme="dark"
        width="48"
        height="45"
        loading="eager"
        decoding="async"
      />
      <img
        src={zBlk}
        alt=""
        className={styles.image}
        data-theme="light"
        width="48"
        height="45"
        loading="eager"
        decoding="async"
      />
    </span>
  );
});
