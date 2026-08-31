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
import styles from './tools/tools.module.css';

export const meta = () =>
  baseMeta({
    title: 'Privacy Policy',
    description: 'Privacy policy for zrl.dev.',
  });

export default function Privacy() {
  return (
    <>
      <ProjectContainer className={styles.tools}>
        <ProjectBackground
          src={usesBackground}
          placeholder={usesBackgroundPlaceholder}
          opacity={0.6}
        />
        <ProjectHeader
          title="Privacy Policy"
          description="Last updated: August 31, 2026. This page explains how zrl.dev handles personal information when you visit the site or send a message."
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
                  <ListItem>I do not intentionally collect sensitive personal data.</ListItem>
                </List>
              </ProjectSectionText>
            </ProjectTextRow>
            <ProjectTextRow width="m">
              <ProjectSectionHeading>How information is collected</ProjectSectionHeading>
              <ProjectSectionText>
                Information may be collected directly from you, such as through the contact
                form; automatically through your browser or device; and through trusted
                service providers that help operate the site, deliver messages, or
                understand site performance.
              </ProjectSectionText>
            </ProjectTextRow>
            <ProjectTextRow width="m">
              <ProjectSectionHeading>How information is used</ProjectSectionHeading>
              <ProjectSectionText as="div">
                <List>
                  <ListItem>Operate, maintain, and improve zrl.dev.</ListItem>
                  <ListItem>Respond to inquiries or requests.</ListItem>
                  <ListItem>Understand site performance and user experience.</ListItem>
                  <ListItem>Detect, prevent, and address technical or security issues.</ListItem>
                  <ListItem>Comply with legal obligations and protect rights.</ListItem>
                </List>
              </ProjectSectionText>
            </ProjectTextRow>
            <ProjectTextRow width="m">
              <ProjectSectionHeading>Sharing information</ProjectSectionHeading>
              <ProjectSectionText>
                Personal information may be shared with service providers that host the
                site, deliver email, or provide analytics; with legal authorities when
                required by law; or with parties involved in a sale, merger, or similar
                transaction. I do not sell personal information or use it for targeted
                advertising.
              </ProjectSectionText>
            </ProjectTextRow>
            <ProjectTextRow width="m">
              <ProjectSectionHeading>Cookies and analytics</ProjectSectionHeading>
              <ProjectSectionText>
                zrl.dev may use essential cookies and privacy-preserving analytics tools to
                understand how the site is used. You can adjust your browser settings to
                manage cookies.
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
            <ProjectTextRow width="m">
              <ProjectSectionHeading>Children and transfers</ProjectSectionHeading>
              <ProjectSectionText>
                The site is not intended for children under 13, and I do not knowingly
                collect personal information from children. Information may be processed in
                the United States and other countries where service providers operate.
              </ProjectSectionText>
            </ProjectTextRow>
            <ProjectTextRow width="m">
              <ProjectSectionHeading>Changes and contact</ProjectSectionHeading>
              <ProjectSectionText>
                This policy may be updated from time to time by revising the last-updated
                date above. Questions about this policy can be sent to{' '}
                <Link href="mailto:privacy@zrl.dev">privacy@zrl.dev</Link>.
              </ProjectSectionText>
            </ProjectTextRow>
          </ProjectSectionContent>
        </ProjectSection>
      </ProjectContainer>
      <Footer />
    </>
  );
}
