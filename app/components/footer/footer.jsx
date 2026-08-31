import { Link } from '~/components/link';
import { Text } from '~/components/text';
import { classes } from '~/utils/style';
import config from '~/config.json';
import styles from './footer.module.css';

export const Footer = ({ className }) => (
  <footer className={classes(styles.footer, className)}>
    <Text className={styles.text} size="s" align="center">
      <span className={styles.date}>
        {`© ${new Date().getFullYear()} ${config.name}.`}
      </span>
      <Link secondary className={styles.link} href="/humans.txt" target="_self">
        Crafted by yours truly
      </Link>
      <Link secondary className={styles.link} href="/privacy" target="_self">
        Privacy
      </Link>
      <Link secondary className={styles.link} href="/terms" target="_self">
        Terms
      </Link>
      <Link secondary className={styles.link} href="/.well-known/security.txt" target="_self">
        Security
      </Link>
    </Text>
  </footer>
);
