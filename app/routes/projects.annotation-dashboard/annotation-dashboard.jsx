import { Footer } from '~/components/footer';
import { Button } from '~/components/button';
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
import { Fragment } from 'react';
import { AnnotationDashboardDemo } from './dashboard/AnnotationDashboardDemo';
import './dashboard.css';
import styles from './annotation-dashboard.module.css';

const title = 'Annotation Analytics Dashboard';
const description =
  'Real-time KPI, alert thresholds, and capacity forecasting across six-tab workflow visibility — rebuilt JS → Next.js/TS/Recharts, 40% reporting time cut.';
const roles = ['Next.js / Recharts', 'Pandas / SQLite', 'Annotation QA'];

const tech = [
  'Next.js 15',
  'TypeScript',
  'Recharts',
  'Tailwind CSS',
  'React Hooks',
  'Real-time State',
];

const highlights = [
  {
    title: 'Live KPI metrics',
    description:
      'Throughput, error rate, team efficiency, and capacity utilization update every 5 seconds with independent variation.',
  },
  {
    title: 'Alert threshold engine',
    description:
      'Warning states stay wired to current KPI values, so alerting mirrors live dashboard state instead of static seed values.',
  },
  {
    title: 'Team performance view',
    description:
      'Per-member productivity cards, task completion bars, and a weekly utilization heatmap keep quality and staffing in the same picture.',
  },
  {
    title: 'Capacity forecasting',
    description:
      'Historical vs predicted capacity trends help surface resource pressure before it turns into a workflow bottleneck.',
  },
];

const fixes = [
  'Independent +/-2.5% variation per metric with no correlated ticks',
  'Live trend badge text re-rendered each interval',
  'Error rate precision preserved to 2 decimal places',
  'Lower error rate correctly reads as healthier state',
  'Alert threshold current values synced to live KPIs',
  'Theme toggle stays isolated to the embedded dashboard',
];

export const meta = () => baseMeta({ title, description, prefix: 'Projects' });

export const AnnotationDashboard = () => (
  <Fragment>
    <ProjectContainer className={styles.page}>
      <ProjectBackground src={usesBackground} placeholder={usesBackgroundPlaceholder} opacity={0.6} />
      <ProjectHeader
        title={title}
        description={description}
        url="#live-demo"
        linkLabel="Jump to live demo"
        roles={roles}
      />
      <ProjectSection>
        <ProjectSectionContent width="xl">
          <ProjectTextRow width="l" className={styles.overviewRow}>
            <div className={styles.overviewCopy}>
              <ProjectSectionHeading>Overview</ProjectSectionHeading>
              <ProjectSectionText>
                Built to simulate the operational visibility used in ML data
                operations: tracking pipeline throughput, annotation error rates,
                team efficiency, and capacity planning in one live surface.
              </ProjectSectionText>
              <ProjectSectionText>
                ETL and validation pipelines in Pandas and SQLite feed the same
                style of workflow monitoring highlighted on the{' '}
                <Link href="/experience">experience</Link> page. The demo below is
                the live revamp version, not a static screenshot.
              </ProjectSectionText>
              <div className={styles.actionRow}>
                <Button href="https://github.com/zrlopez/performance-analytics-tool" icon="github">
                  View code
                </Button>
              </div>
            </div>
            <div className={styles.detailCard}>
              <h3 className={styles.cardTitle}>Project details</h3>
              <dl className={styles.detailList}>
                <div>
                  <dt>Role</dt>
                  <dd>Developer</dd>
                </div>
                <div>
                  <dt>Year</dt>
                  <dd>2025-Present</dd>
                </div>
                <div>
                  <dt>Type</dt>
                  <dd>Frontend / Analytics</dd>
                </div>
                <div>
                  <dt>Tabs</dt>
                  <dd>6 views</dd>
                </div>
                <div>
                  <dt>Refresh</dt>
                  <dd>Every 5 seconds</dd>
                </div>
              </dl>
              <ul className={styles.techChips} aria-label="Tech stack">
                {tech.map(item => (
                  <li key={item} className={styles.techChip}>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </ProjectTextRow>
        </ProjectSectionContent>
      </ProjectSection>
      <ProjectSection>
        <ProjectSectionContent width="xl">
          <ProjectTextRow width="l">
            <ProjectSectionHeading>Feature highlights</ProjectSectionHeading>
            <div className={styles.highlightGrid}>
              {highlights.map(item => (
                <article key={item.title} className={styles.highlightCard}>
                  <h3 className={styles.highlightTitle}>{item.title}</h3>
                  <p className={styles.highlightCopy}>{item.description}</p>
                </article>
              ))}
            </div>
          </ProjectTextRow>
        </ProjectSectionContent>
      </ProjectSection>
      <ProjectSection light id="live-demo">
        <ProjectSectionContent width="xl">
          <ProjectTextRow width="l">
            <ProjectSectionHeading>Live Demo — 6 tabs</ProjectSectionHeading>
            <ProjectSectionText>
              Fully interactive — throughput, error rate, team efficiency, and capacity
              update independently (+/-2.5% jitter). Toggle dark mode inside the demo;
              it stays isolated from the site theme.
            </ProjectSectionText>
          </ProjectTextRow>
          <div className={`dashboard-root ${styles.demoFrame}`}>
            <div className={styles.demoViewport}>
              <AnnotationDashboardDemo />
            </div>
          </div>
        </ProjectSectionContent>
      </ProjectSection>
      <ProjectSection>
        <ProjectSectionContent width="xl">
          <ProjectTextRow width="l">
            <ProjectSectionHeading>Review fixes and implementation notes</ProjectSectionHeading>
            <ProjectSectionText as="div">
              <List>
                {fixes.map(item => (
                  <ListItem key={item}>{item}</ListItem>
                ))}
              </List>
            </ProjectSectionText>
          </ProjectTextRow>
        </ProjectSectionContent>
      </ProjectSection>
      <ProjectSection>
        <ProjectSectionContent width="xl">
          <ProjectTextRow width="l">
            <div className={styles.actionRow}>
              <Button href="/projects" iconEnd="arrow-right">
                Back to projects
              </Button>
            </div>
          </ProjectTextRow>
        </ProjectSectionContent>
      </ProjectSection>
    </ProjectContainer>
    <Footer />
  </Fragment>
);
