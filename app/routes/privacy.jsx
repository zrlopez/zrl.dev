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
          description="Last updated: August 31, 2026. This policy explains how zrl.dev handles information across the portfolio, project pages, and contact workflow."
        />
        <ProjectSection padding="none" className={styles.section}>
          <ProjectSectionContent>
            <ProjectTextRow width="m">
              <ProjectSectionHeading>Information collected</ProjectSectionHeading>
              <ProjectSectionText as="div">
                <List>
                  <ListItem>Identifiers such as your name and email address if you contact me.</ListItem>
                  <ListItem>Communications and project details you choose to include in a contact form message.</ListItem>
                  <ListItem>Basic request metadata such as browser details, page path, and diagnostic information used to keep the site reliable and secure.</ListItem>
                  <ListItem>I do not intentionally collect sensitive personal data.</ListItem>
                </List>
              </ProjectSectionText>
            </ProjectTextRow>
            <ProjectTextRow width="m">
              <ProjectSectionHeading>How information is collected</ProjectSectionHeading>
              <ProjectSectionText>
                Information may be collected directly from you, such as through the contact
                form; automatically through your browser or device when pages load; and
                through trusted service providers that help host the site, verify bot
                protection, or deliver email.
              </ProjectSectionText>
            </ProjectTextRow>
            <ProjectTextRow width="m">
              <ProjectSectionHeading>How information is used</ProjectSectionHeading>
              <ProjectSectionText as="div">
                <List>
                  <ListItem>Operate, maintain, and improve zrl.dev.</ListItem>
                  <ListItem>Respond to inquiries or requests.</ListItem>
                  <ListItem>Review portfolio traffic and site performance at a high level.</ListItem>
                  <ListItem>Detect, prevent, and address spam, abuse, or technical security issues.</ListItem>
                  <ListItem>Comply with legal obligations and protect rights.</ListItem>
                </List>
              </ProjectSectionText>
            </ProjectTextRow>
            <ProjectTextRow width="m">
              <ProjectSectionHeading>Service providers and sharing</ProjectSectionHeading>
              <ProjectSectionText>
                Personal information may be processed by service providers that host the
                site, protect the contact workflow from abuse, or deliver email responses.
                It may also be disclosed when required by law. I do not sell personal
                information or use it for targeted advertising.
              </ProjectSectionText>
            </ProjectTextRow>
            <ProjectTextRow width="m">
              <ProjectSectionHeading>Cookies, sessions, and analytics</ProjectSectionHeading>
              <ProjectSectionText>
                zrl.dev may use essential cookies or session data for site preferences,
                along with limited analytics or request logs to understand performance and
                investigate abuse. You can adjust your browser settings to manage cookies.
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
                above or as required by law. Reasonable safeguards such as security headers,
                verification checks, and service-level protections are used, but no internet
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
