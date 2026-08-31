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

export const meta = () =>
  baseMeta({
    title: 'Privacy Policy',
    description: 'Privacy policy for zrl.dev.',
  });

export default function Privacy() {
  return (
    <>
      <ProjectContainer className={styles.uses}>
        <ProjectBackground
          src={usesBackground}
          placeholder={usesBackgroundPlaceholder}
          opacity={0.6}
        />
        <ProjectHeader
          title="Privacy Policy"
          description="Last updated: November 2025. This page explains how zrl.dev handles personal information when you visit the site or send a message."
        />
        <ProjectSection padding="none" className={styles.section}>
          <ProjectSectionContent>
            <ProjectTextRow width="m">
              <ProjectSectionHeading>Information collected</ProjectSectionHeading>
              <ProjectSectionText as="div">
                <List>
                  <ListItem>Identifiers such as your name and email address if you contact me.</ListItem>
                  <ListItem>Device and usage data such as browser details and pages viewed to understand site performance.</ListItem>
                  <ListItem>Communications and any information you choose to include in a message.</ListItem>
                </List>
              </ProjectSectionText>
            </ProjectTextRow>
            <ProjectTextRow width="m">
              <ProjectSectionHeading>Use and sharing</ProjectSectionHeading>
              <ProjectSectionText>
                Information is used to operate and improve the site, respond to inquiries,
                detect technical or security issues, and comply with legal obligations.
                I do not sell personal information or use it for targeted advertising.
              </ProjectSectionText>
            </ProjectTextRow>
            <ProjectTextRow width="m">
              <ProjectSectionHeading>Your choices</ProjectSectionHeading>
              <ProjectSectionText>
                Depending on where you live, you may have rights to access, correct,
                delete, or receive a copy of your personal information. To make a privacy
                request, email <Link href="mailto:privacy@zrl.dev">privacy@zrl.dev</Link>.
              </ProjectSectionText>
            </ProjectTextRow>
            <ProjectTextRow width="m">
              <ProjectSectionHeading>Retention and security</ProjectSectionHeading>
              <ProjectSectionText>
                Personal information is retained only as long as necessary for the purposes
                above or as required by law. Reasonable safeguards are used, but no internet
                transmission is guaranteed to be perfectly secure.
              </ProjectSectionText>
            </ProjectTextRow>
          </ProjectSectionContent>
        </ProjectSection>
      </ProjectContainer>
      <Footer />
    </>
  );
}
