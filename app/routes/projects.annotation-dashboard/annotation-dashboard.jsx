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
  'Operational visibility for annotation pipelines: live KPIs, alert thresholds, team performance, and capacity forecasting — six tabs, one control surface.';
const roles = ['Analytics UI', 'Annotation QA', 'Python / SQL'];

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
          <ProjectTextRow width="l">
            <ProjectSectionHeading>Problem</ProjectSectionHeading>
            <ProjectSectionText>
              Annotation ops drown in spreadsheets: throughput, error classes, staffing,
              and capacity live in different tools and go stale by the next stand-up.
              Leads need one surface that answers “are we healthy right now?” without a
              reporting lag that eats half a day.
            </ProjectSectionText>
            <ProjectSectionText>
              This dashboard is that surface — built for ML data operations pressure,
              not a generic analytics template. It tracks pipeline throughput, annotation
              error rates, team efficiency, and capacity planning together, the same
              monitoring shape used on the{' '}
              <Link href="/experience">experience</Link> page.
            </ProjectSectionText>
          </ProjectTextRow>
        </ProjectSectionContent>
      </ProjectSection>

      <ProjectSection light>
        <ProjectSectionContent width="xl">
          <ProjectTextRow width="l">
            <ProjectSectionHeading>What the live system does</ProjectSectionHeading>
            <ProjectSectionText>
              Six tabs share one live KPI spine. Metrics refresh on a five-second loop
              with independent jitter so charts and badges move like production traffic —
              not a locked seed. Alert thresholds re-bind to current values each tick, so
              warning state tracks reality instead of yesterday’s CSV.
            </ProjectSectionText>
            <ProjectSectionText as="div">
              <List>
                <ListItem>
                  <strong>Live KPI spine</strong> — throughput, error rate, team efficiency,
                  and capacity utilization update independently (±2.5%), with trend badges
                  re-rendered every interval.
                </ListItem>
                <ListItem>
                  <strong>Alert threshold engine</strong> — thresholds sync to live KPIs;
                  lower error rate correctly reads as healthier, not “down is bad.”
                </ListItem>
                <ListItem>
                  <strong>Team performance</strong> — per-member cards, completion bars, and
                  a utilization heatmap keep quality and staffing in one frame.
                </ListItem>
                <ListItem>
                  <strong>Capacity forecasting</strong> — historical vs predicted capacity
                  surfaces resource pressure before it becomes a queue fire.
                </ListItem>
                <ListItem>
                  <strong>Isolated demo theme</strong> — dark/light inside the frame stays
                  local so the portfolio chrome is never yanked around by the demo.
                </ListItem>
              </List>
            </ProjectSectionText>
            <div className={styles.actionRow}>
              <Button href="https://github.com/zrlopez/performance-analytics-tool" icon="github">
                View code
              </Button>
            </div>
          </ProjectTextRow>
        </ProjectSectionContent>
      </ProjectSection>

      <ProjectSection>
        <ProjectSectionContent width="xl">
          <ProjectTextRow width="l">
            <ProjectSectionHeading>Data path</ProjectSectionHeading>
            <ProjectSectionText>
              Upstream, Pandas and SQLite handle ETL and validation the way production
              annotation QA does: clean feeds, explicit error classes, and rollups a
              dashboard can trust. The embedded demo drives UI state from
              <code>dashboardData</code> and <code>useLiveKpis(5000)</code> so the
              interaction model is real even when the feed is simulated.
            </ProjectSectionText>
            <ProjectSectionText>
              That split matters: the case study is about operational design — what
              managers see, what alerts mean, how capacity is forecast — not about
              wiring charts to a fake JSON blob and calling it done.
            </ProjectSectionText>
          </ProjectTextRow>
        </ProjectSectionContent>
      </ProjectSection>

      <ProjectSection light id="live-demo">
        <ProjectSectionContent width="xl">
          <ProjectTextRow width="l">
            <ProjectSectionHeading>Live demo</ProjectSectionHeading>
            <ProjectSectionText>
              Full interactive console — not a screenshot. Switch tabs, watch KPIs drift,
              flip the in-demo theme. This is the product surface, given room to breathe.
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
            <ProjectSectionHeading>Hardening notes</ProjectSectionHeading>
            <ProjectSectionText as="div">
              <List>
                <ListItem>Independent metric jitter — no correlated fake “everything moves together”</ListItem>
                <ListItem>Error rate precision held to two decimals; polarity correct (lower = healthier)</ListItem>
                <ListItem>Alert “current” values always equal live KPIs after each tick</ListItem>
                <ListItem>Trend badge copy re-rendered with the data, not stale on first paint</ListItem>
                <ListItem>Demo theme isolated from site theme</ListItem>
              </List>
            </ProjectSectionText>
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
