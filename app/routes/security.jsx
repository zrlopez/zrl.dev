import { Footer } from '~/components/footer';
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
import { Link } from '~/components/link';
import { List, ListItem } from '~/components/list';
import { baseMeta } from '~/utils/meta';
import usesBackgroundPlaceholder from '~/assets/uses-background-placeholder.jpg';
import usesBackground from '~/assets/uses-background.mp4';
import styles from './tools/tools.module.css';

export const meta = () =>
  baseMeta({
    title: 'Security',
    description: 'Responsible disclosure policy for zrl.dev (RFC 9116 security.txt).',
  });

export default function SecurityPolicy() {
  return (
    <>
      <ProjectContainer className={styles.tools}>
        <ProjectBackground
          src={usesBackground}
          placeholder={usesBackgroundPlaceholder}
          opacity={0.6}
        />
        <ProjectHeader
          title="Security"
          description="How to report vulnerabilities on zrl.dev. Good-faith research is welcome."
        />
        <ProjectSection padding="none" className={styles.section}>
          <ProjectSectionContent>
            <ProjectTextRow width="m">
              <ProjectSectionHeading>Contact</ProjectSectionHeading>
              <ProjectSectionText>
                Email{' '}
                <Link href="mailto:security@duloup.co">security@duloup.co</Link>. Machine-readable
                contact lives at{' '}
                <Link href="/.well-known/security.txt">/.well-known/security.txt</Link> (RFC 9116).
              </ProjectSectionText>
              <ProjectSectionHeading>Scope</ProjectSectionHeading>
              <ProjectSectionText as="div">
                <List>
                  <ListItem>zrl.dev and its production deploy surfaces</ListItem>
                  <ListItem>Contact form abuse protections and related APIs</ListItem>
                  <ListItem>Authentication, session, and header configuration on this site</ListItem>
                </List>
              </ProjectSectionText>
              <ProjectSectionHeading>Out of scope</ProjectSectionHeading>
              <ProjectSectionText as="div">
                <List>
                  <ListItem>Social engineering of personal accounts</ListItem>
                  <ListItem>Denial-of-service / volumetric flooding</ListItem>
                  <ListItem>Findings that require physical access or stolen credentials</ListItem>
                </List>
              </ProjectSectionText>
              <ProjectSectionHeading>Expectations</ProjectSectionHeading>
              <ProjectSectionText>
                Please include steps to reproduce, impact, and any proof-of-concept that stays
                non-destructive. I aim to acknowledge within a few business days. Do not publicly
                disclose before a fix is available unless we agree otherwise.
              </ProjectSectionText>
            </ProjectTextRow>
          </ProjectSectionContent>
        </ProjectSection>
      </ProjectContainer>
      <Footer />
    </>
  );
}
