import { Link } from '~/components/link';
import { Text } from '~/components/text';
import { classes } from '~/utils/style';
import config from '~/config.json';
import { useId, useState } from 'react';
import pixelHeart from '~/assets/pixel-heart.png';
import styles from './footer.module.css';

const moreLinks = [
  ['Résumé', '/resume.pdf'],
  ['Privacy', '/privacy'],
  ['Terms', '/terms'],
  ['Security', '/security'],
];

export const Footer = ({ className }) => {
  const [moreOpen, setMoreOpen] = useState(false);
  const moreId = useId();

  return (
    <footer className={classes(styles.footer, className)}>
      <Text className={styles.text} size="s" align="center">
        <span className={styles.date}>{`© ${new Date().getFullYear()} ${config.name}.`}</span>
        <span className={styles.linkGroup}>
          <span className={styles.separator} aria-hidden="true">
            /
          </span>
          <Link
            secondary
            className={classes(styles.link, styles.madeLink)}
            href="/humans.txt"
            target="_self"
          >
            <span>Made with</span>
            <img
              className={styles.pixelHeart}
              src={pixelHeart}
              width={11}
              height={10}
              alt=""
              aria-hidden="true"
              draggable={false}
            />
            <span className={styles.srOnly}>love</span>
            <span>in ATX</span>
          </Link>
        </span>
        <span className={styles.linkGroup}>
          <span className={styles.separator} aria-hidden="true">
            /
          </span>
          <button
            type="button"
            className={styles.moreToggle}
            aria-expanded={moreOpen}
            aria-controls={moreId}
            onClick={() => setMoreOpen(open => !open)}
          >
            More
            <span className={styles.moreChevron} data-open={moreOpen} aria-hidden>
              ▾
            </span>
          </button>
        </span>
        {moreOpen && (
          <span id={moreId} className={styles.morePanel} role="group" aria-label="More footer links">
            {moreLinks.map(([label, href], index) => (
              <span className={styles.linkGroup} key={href}>
                {index > 0 && (
                  <span className={styles.separator} aria-hidden="true">
                    /
                  </span>
                )}
                <Link secondary className={styles.link} href={href} target="_self">
                  {label}
                </Link>
              </span>
            ))}
          </span>
        )}
      </Text>
    </footer>
  );
};
