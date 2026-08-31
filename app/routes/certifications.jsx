import { Footer } from '~/components/footer';
import { Link } from '~/components/link';
import { List, ListItem } from '~/components/list';
import {
  ProjectBackground,
  ProjectContainer,
  ProjectHeader,
  ProjectSection,
  ProjectSectionContent,
  ProjectSectionHeading,
  ProjectSectionText,
  ProjectTextRow,
} from '~/layouts/project';
import { baseMeta } from '~/utils/meta';
import usesBackgroundPlaceholder from '~/assets/uses-background-placeholder.jpg';
import usesBackground from '~/assets/uses-background.mp4';
import styles from './uses/uses.module.css';

const certifications = [
  ['Programming with Python (CS50P)', 'Harvard University', 'May 20, 2026', 'https://cs50.harvard.edu/certificates/a2fb0892-7781-498c-b3e0-2552de74b397'],
  ['Python', 'Kaggle', 'May 18, 2026', 'https://www.kaggle.com/learn/certification/zrlopez/python'],
  ['Pandas', 'Kaggle', 'May 19, 2026', 'https://www.kaggle.com/learn/certification/zrlopez/pandas'],
  ['Intermediate Machine Learning', 'Kaggle', 'May 19, 2026', 'https://www.kaggle.com/learn/certification/zrlopez/intermediate-machine-learning'],
  ['Advanced SQL', 'Kaggle', 'May 19, 2026', 'https://www.kaggle.com/learn/certification/zrlopez/advanced-sql'],
  ['SEO II Certification', 'HubSpot Academy', 'May 18, 2026', 'https://app-na2.hubspot.com/academy/achievements/3z03ccxd/en/1/zachary-lopez/seo-ii'],
  ['Service Hub Software Certified', 'HubSpot Academy', 'May 18, 2026', 'https://app-na2.hubspot.com/academy/achievements/6dhmh4p0/en/1/zachary-lopez/service-hub-software'],
  ['Apple Certified iOS Technician (ACiT)', 'Apple', 'March 14, 2019', ''],
];

export const meta = () =>
  baseMeta({
    title: 'Certifications',
    description:
      'Certifications across Python, SQL, data science, machine learning, service operations, and digital marketing.',
  });

export default function Certifications() {
  return (
    <>
      <ProjectContainer className={styles.uses}>
        <ProjectBackground
          src={usesBackground}
          placeholder={usesBackgroundPlaceholder}
          opacity={0.6}
        />
        <ProjectHeader
          title="Certifications"
          description="A compact record of credentials across programming, data science, machine learning, SQL, service operations, and digital marketing."
        />
        <ProjectSection padding="none" className={styles.section}>
          <ProjectSectionContent>
            {certifications.map(([title, issuer, date, url]) => (
              <ProjectTextRow width="m" key={`${issuer}-${title}`}>
                <ProjectSectionHeading>{title}</ProjectSectionHeading>
                <ProjectSectionText as="div">
                  <List>
                    <ListItem>{issuer} — {date}</ListItem>
                    {!!url && (
                      <ListItem>
                        <Link href={url}>Verify credential</Link>
                      </ListItem>
                    )}
                  </List>
                </ProjectSectionText>
              </ProjectTextRow>
            ))}
          </ProjectSectionContent>
        </ProjectSection>
      </ProjectContainer>
      <Footer />
    </>
  );
}
