import { Footer } from '~/components/footer';
import { Link } from '~/components/link';
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

export const meta = () =>
  baseMeta({
    title: 'Terms of Service',
    description: 'Terms of service for zrl.dev.',
  });

export default function Terms() {
  return (
    <>
      <ProjectContainer className={styles.uses}>
        <ProjectBackground
          src={usesBackground}
          placeholder={usesBackgroundPlaceholder}
          opacity={0.6}
        />
        <ProjectHeader
          title="Terms of Service"
          description="Last updated: November 2025. These terms cover use of zrl.dev as a personal portfolio and professional contact site."
        />
        <ProjectSection padding="none" className={styles.section}>
          <ProjectSectionContent>
            <ProjectTextRow width="m">
              <ProjectSectionHeading>Purpose</ProjectSectionHeading>
              <ProjectSectionText>
                zrl.dev is a personal portfolio showcasing work experience, projects,
                qualifications, and contact information. It is provided for informational,
                networking, recruiting, and business purposes.
              </ProjectSectionText>
            </ProjectTextRow>
            <ProjectTextRow width="m">
              <ProjectSectionHeading>Acceptable use</ProjectSectionHeading>
              <ProjectSectionText>
                You may use the site for lawful professional purposes. You agree not to
                interfere with site security, misrepresent your identity, submit harmful
                code, or use the site for fraudulent or unlawful activity.
              </ProjectSectionText>
            </ProjectTextRow>
            <ProjectTextRow width="m">
              <ProjectSectionHeading>Content and links</ProjectSectionHeading>
              <ProjectSectionText>
                Site content is owned by me or licensors and may not be reproduced or
                distributed without permission. Third-party links are provided for
                convenience, and their content and practices are outside my control.
              </ProjectSectionText>
            </ProjectTextRow>
            <ProjectTextRow width="m">
              <ProjectSectionHeading>Privacy and contact</ProjectSectionHeading>
              <ProjectSectionText>
                See the <Link href="/privacy">Privacy Policy</Link> for information about
                personal data. Questions about these terms can be sent through the{' '}
                <Link href="/contact">contact page</Link>.
              </ProjectSectionText>
            </ProjectTextRow>
          </ProjectSectionContent>
        </ProjectSection>
      </ProjectContainer>
      <Footer />
    </>
  );
}
