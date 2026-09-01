import config from '~/config.json';

export const navLinks = [
  {
    label: 'Projects',
    pathname: '/projects',
  },
  {
    label: 'Tools & skills',
    pathname: '/tools',
  },
  {
    label: 'Experience',
    pathname: '/experience',
  },
  {
    label: 'Certifications',
    pathname: '/certifications',
  },
  {
    label: 'Contact',
    pathname: '/contact',
  },
];

export const socialLinks = [
  {
    label: 'LinkedIn',
    url: `https://linkedin.com/in/${config.linkedin}`,
    icon: 'linkedin',
  },
  {
    label: 'Github',
    url: `https://github.com/${config.github}`,
    icon: 'github',
  },
  {
    label: 'Kaggle',
    url: `https://kaggle.com/${config.kaggle}`,
    icon: 'kaggle',
  },
];
