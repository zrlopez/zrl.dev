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
              <ProjectSectionHeading>1. Site description and purpose</ProjectSectionHeading>
              <ProjectSectionText>
                zrl.dev is a personal portfolio showcasing work experience, projects,
                qualifications, embedded third-party links, and a contact form. It is
                provided for informational, networking, recruiting, and business purposes.
              </ProjectSectionText>
            </ProjectTextRow>
            <ProjectTextRow width="m">
              <ProjectSectionHeading>2. Eligibility and account security</ProjectSectionHeading>
              <ProjectSectionText as="div">
                <List>
                  <ListItem>You must be at least the age of majority in your jurisdiction.</ListItem>
                  <ListItem>The site is intended for professional use, including networking, recruiting, and business inquiries.</ListItem>
                  <ListItem>If account-based features are ever offered, you are responsible for safeguarding your credentials.</ListItem>
                </List>
              </ProjectSectionText>
            </ProjectTextRow>
            <ProjectTextRow width="m">
              <ProjectSectionHeading>3. Acceptable use</ProjectSectionHeading>
              <ProjectSectionText as="div">
                <List>
                  <ListItem>Use the site only for lawful, professional purposes.</ListItem>
                  <ListItem>Do not interfere with site security, functionality, or availability.</ListItem>
                  <ListItem>Do not misrepresent your identity or qualifications.</ListItem>
                  <ListItem>Do not upload, transmit, or attempt to introduce harmful code.</ListItem>
                </List>
              </ProjectSectionText>
            </ProjectTextRow>
            <ProjectTextRow width="m">
              <ProjectSectionHeading>4. Intellectual property</ProjectSectionHeading>
              <ProjectSectionText>
                Site content, including text, graphics, logos, icons, and code, is owned
                by me or licensors and is protected by intellectual-property laws. You may
                view and download content for personal, non-commercial use, but may not
                reproduce or distribute it without permission.
              </ProjectSectionText>
            </ProjectTextRow>
            <ProjectTextRow width="m">
              <ProjectSectionHeading>5. User submissions</ProjectSectionHeading>
              <ProjectSectionText>
                If you provide feedback, comments, or other submissions through a contact
                form, you grant permission to use those submissions for the purpose of
                responding to you and improving the site.
              </ProjectSectionText>
            </ProjectTextRow>
            <ProjectTextRow width="m">
              <ProjectSectionHeading>6. Third-party links</ProjectSectionHeading>
              <ProjectSectionText>
                The site may contain links to third-party websites for convenience. I do
                not control those websites and am not responsible for their content,
                security, or practices.
              </ProjectSectionText>
            </ProjectTextRow>
            <ProjectTextRow width="m">
              <ProjectSectionHeading>7. Privacy</ProjectSectionHeading>
              <ProjectSectionText>
                Please see the <Link href="/privacy">Privacy Policy</Link> for information
                about how personal information is collected, used, and protected.
              </ProjectSectionText>
            </ProjectTextRow>
            <ProjectTextRow width="m">
              <ProjectSectionHeading>8. Disclaimers and liability</ProjectSectionHeading>
              <ProjectSectionText>
                The site is provided as is and as available, without warranties of any kind
                regarding accuracy, completeness, reliability, or availability. To the
                maximum extent permitted by law, I will not be liable for indirect,
                incidental, consequential, or punitive damages arising from use of the site.
              </ProjectSectionText>
            </ProjectTextRow>
            <ProjectTextRow width="m">
              <ProjectSectionHeading>9. Indemnification and termination</ProjectSectionHeading>
              <ProjectSectionText>
                You agree to indemnify and hold me harmless from claims or expenses arising
                out of your use of the site or violation of these terms. Access to the site
                may be suspended or terminated at any time, and you may stop using the site
                at any time.
              </ProjectSectionText>
            </ProjectTextRow>
            <ProjectTextRow width="m">
              <ProjectSectionHeading>10. Governing law and contact</ProjectSectionHeading>
              <ProjectSectionText>
                These terms are governed by the laws of the State of Texas, without regard
                to conflict-of-law principles. Questions can be sent through the{' '}
                <Link href="/contact">contact page</Link>. These terms may be updated by
                revising the last-updated date above.
              </ProjectSectionText>
            </ProjectTextRow>
          </ProjectSectionContent>
        </ProjectSection>
      </ProjectContainer>
      <Footer />
    </>
  );
}
