import usesBackgroundPlaceholder from '~/assets/uses-background-placeholder.jpg';
import usesBackground from '~/assets/uses-background.mp4';
import { Footer } from '~/components/footer';
import { Link } from '~/components/link';
import { List, ListItem } from '~/components/list';
import { Table, TableBody, TableCell, TableHeadCell, TableRow } from '~/components/table';
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
import styles from './uses.module.css';

export const meta = () => {
  return baseMeta({
    title: 'Uses',
    description: 'Tools, languages, and software I use for AI/ML Data Operations.',
  });
};

export const Uses = () => {
  return (
    <>
      <ProjectContainer className={styles.uses}>
        <ProjectBackground
          src={usesBackground}
          placeholder={usesBackgroundPlaceholder}
          opacity={0.7}
        />
        <ProjectHeader
          title="Uses"
          description="A somewhat comprehensive list of the tools, technologies, software, and platforms I use to build data systems, analyze workflows, and manage AI operations."
        />
        <ProjectSection padding="none" className={styles.section}>
          <ProjectSectionContent>
            <ProjectTextRow width="m">
              <ProjectSectionHeading>Data & ML</ProjectSectionHeading>
              <ProjectSectionText as="div">
                <List>
                  <ListItem>
                    <Link href="https://www.python.org">Python</Link>,{' '}
                    <Link href="https://pandas.pydata.org">Pandas</Link>,{' '}
                    <Link href="https://jupyter.org">Jupyter</Link>, and{' '}
                    <Link href="https://www.sqlite.org">SQLite</Link> for ETL,
                    validation, and high-volume dataset audits — the core of both the{' '}
                    <Link href="/projects/annotation-dashboard">annotation dashboard</Link>
                    {' '}and the{' '}
                    <Link href="/projects/ml-incident-response">ML incident system</Link>.
                  </ListItem>
                  <ListItem>
                    <Link href="https://tableau.com">Tableau</Link> and{' '}
                    <Link href="https://powerbi.microsoft.com">Power BI</Link> for
                    reporting;{' '}
                    <Link href="https://recharts.org">Recharts</Link> for the live
                    dashboard.
                  </ListItem>
                  <ListItem>
                    Annotation QA, taxonomy governance, RLHF, and prompt engineering —
                    the ops layer behind Siri-scale labeling pipelines.
                  </ListItem>
                </List>
              </ProjectSectionText>
            </ProjectTextRow>
          </ProjectSectionContent>
        </ProjectSection>
        <ProjectSection padding="none" className={styles.section}>
          <ProjectSectionContent>
            <ProjectTextRow width="m">
              <ProjectSectionHeading>Development</ProjectSectionHeading>
              <ProjectSectionText as="div">
                <List>
                  <ListItem>
                    <Link href="https://remix.run">Remix 2.7</Link> +{' '}
                    <Link href="https://react.dev">React 18</Link> +{' '}
                    <Link href="https://vitejs.dev">Vite</Link> +{' '}
                    <Link href="https://www.framer.com/motion/">Framer Motion</Link> for
                    this site.{' '}
                    <Link href="https://nextjs.org">Next.js 15</Link> +{' '}
                    <Link href="https://www.typescriptlang.org">TypeScript</Link> +{' '}
                    <Link href="https://tailwindcss.com">Tailwind</Link> for the
                    dashboard.{' '}
                    <Link href="https://fastapi.tiangolo.com">FastAPI</Link> +{' '}
                    <Link href="https://www.structlog.org/">structlog</Link> for the
                    incident response service.
                  </ListItem>
                  <ListItem>
                    <Link href="https://code.visualstudio.com">VS Code</Link>{' '}
                    (Catppuccin, Vim bindings), deployed via{' '}
                    <Link href="https://vercel.com">Vercel</Link> +{' '}
                    <Link href="https://www.cloudflare.com">Cloudflare</Link>.
                  </ListItem>
                  <ListItem>
                    For 3D/effects: <Link href="https://threejs.org">three.js</Link> (kept
                    from this template) and Draco for the models. For isolation:{' '}
                    <Link href="https://storybook.js.org">Storybook 7</Link>.
                  </ListItem>
                </List>
              </ProjectSectionText>
            </ProjectTextRow>
          </ProjectSectionContent>
        </ProjectSection>
        <ProjectSection padding="none" className={styles.section}>
          <ProjectSectionContent>
            <ProjectTextRow width="m">
              <ProjectSectionHeading>Workflow</ProjectSectionHeading>
              <ProjectSectionText as="div">
                <List>
                  <ListItem>
                    <Link href="https://github.com">GitHub</Link> +{' '}
                    <Link href="https://git-scm.com">Git</Link> (Conventional Commits),{' '}
                    <Link href="https://www.atlassian.com/software/jira">Jira</Link>, and{' '}
                    <Link href="https://www.atlassian.com/software/confluence">
                      Confluence
                    </Link>{' '}
                    for SOPs and runbooks.
                  </ListItem>
                  <ListItem>
                    <Link href="https://trufflesecurity.com/trufflehog">TruffleHog</Link>,{' '}
                    <Link href="https://aquasecurity.github.io/trivy/">Trivy</Link>,{' '}
                    <Link href="https://www.sigstore.dev">Cosign</Link>, and{' '}
                    <Link href="https://codeql.github.com">CodeQL</Link> in CI.
                  </ListItem>

                </List>
              </ProjectSectionText>
            </ProjectTextRow>
          </ProjectSectionContent>
        </ProjectSection>
        <ProjectSection padding="none" className={styles.section}>
          <ProjectSectionContent>
            <ProjectTextRow stretch width="m">
              <ProjectSectionHeading>System</ProjectSectionHeading>
              <Table>
                <TableBody>
                  <TableRow>
                    <TableHeadCell>Operating system</TableHeadCell>
                    <TableCell>macOS 27</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableHeadCell>Browser</TableHeadCell>
                    <TableCell>Brave</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableHeadCell>Monitor</TableHeadCell>
                    <TableCell>MSI MPG 274URDFW E16M</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableHeadCell>Keyboard</TableHeadCell>
                    <TableCell>Keychron Q6 HE 8K Magnetic Switch</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableHeadCell>Mouse</TableHeadCell>
                    <TableCell>Magic Trackpad (USB-C)</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableHeadCell>Laptop</TableHeadCell>
                    <TableCell>16" Macbook Pro M4 Pro</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableHeadCell>Headphones</TableHeadCell>
                    <TableCell>AirPod Max/AirPod Pro 3</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </ProjectTextRow>
          </ProjectSectionContent>
        </ProjectSection>
      </ProjectContainer>
      <Footer />
    </>
  );
};
