import { Link } from '~/components/link';
import { Text } from '~/components/text';
import { classes } from '~/utils/style';
import config from '~/config.json';
import styles from './footer.module.css';

const footerLinks = [
  ['Crafted by yours truly', '/humans.txt'],
  ['Privacy', '/privacy'],
  ['Terms', '/terms'],
  ['Security', '/.well-known/security.txt'],
];

export const Footer = ({ className }) => (
  <footer className={classes(styles.footer, className)}>
    <Text className={styles.text} size="s" align="center">
      <span className={styles.date}>
        {`© ${new Date().getFullYear()} ${config.name}.`}
      </span>
      {footerLinks.map(([label, href], index) => (
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
    </Text>
  </footer>
);
