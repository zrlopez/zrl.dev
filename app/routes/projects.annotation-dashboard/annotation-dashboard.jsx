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
import { baseMeta } from '~/utils/meta';
import usesBackgroundPlaceholder from '~/assets/uses-background-placeholder.jpg';
import usesBackground from '~/assets/uses-background.mp4';
import { Fragment } from 'react';
import { AnnotationDashboardDemo } from './dashboard/AnnotationDashboardDemo';
import './dashboard.css';

const title = 'Annotation Analytics Dashboard';
const description =
  'Real-time KPI, alert thresholds, and capacity forecasting across six-tab workflow visibility — rebuilt JS → Next.js/TS/Recharts, 40% reporting time cut.';
const roles = ['Next.js / Recharts', 'Pandas / SQLite', 'Annotation QA'];

export const meta = () => baseMeta({ title, description, prefix: 'Projects' });

export const AnnotationDashboard = () => (
  <Fragment>
    <ProjectContainer>
      <ProjectBackground
        src={usesBackground}
        placeholder={usesBackgroundPlaceholder}
        opacity={0.6}
      />
      <ProjectHeader
        title={title}
        description={description}
        url="/projects/annotation-dashboard#live-demo"
        linkLabel="Jump to live demo"
        roles={roles}
      />
      <ProjectSection>
        <ProjectSectionContent>
          <ProjectTextRow>
            <ProjectSectionHeading>What it tracks</ProjectSectionHeading>
            <ProjectSectionText>
              Live KPIs, error and throughput trends, and capacity forecasts. ETL +
              validation pipelines (Pandas/SQLite) automate high-volume checks — see{' '}
              <Link href="/experience">experience</Link> for the ops layer. The
              interactive demo below mirrors the Next.js production dashboard at{' '}
              <Link href="/projects/annotation-dashboard#live-demo">
                live dashboard section
              </Link>{' '}
              — KPIs refresh every 5 seconds.
            </ProjectSectionText>
          </ProjectTextRow>
        </ProjectSectionContent>
      </ProjectSection>
      <ProjectSection light id="live-demo">
        <ProjectSectionContent>
          <ProjectTextRow>
            <ProjectSectionHeading>Live Demo — 6 tabs</ProjectSectionHeading>
            <ProjectSectionText>
              Fully interactive — throughput, error rate, team efficiency, and capacity
              update independently (±2.5% jitter). Toggle dark mode inside the demo; it’s
              isolated from the site theme. The home laptop preview uses a live capture of
              this dashboard.
            </ProjectSectionText>
          </ProjectTextRow>
          <div
            className="dashboard-root"
            style={{
              marginTop: 32,
              borderRadius: 16,
              border: '1px solid color-mix(in lab, var(--text) 10%, transparent)',
              overflow: 'hidden',
            }}
          >
            <div style={{ maxHeight: 900, overflowY: 'auto' }}>
              <AnnotationDashboardDemo />
            </div>
          </div>
        </ProjectSectionContent>
      </ProjectSection>
      <ProjectSection>
        <ProjectSectionContent>
          <ProjectTextRow>
            <ProjectSectionHeading>Stack</ProjectSectionHeading>
            <ProjectSectionText>
              <Link href="https://nextjs.org">Next.js 15</Link> + TypeScript +{' '}
              <Link href="https://recharts.org">Recharts</Link> + Tailwind, ported into
              this Remix route with{' '}
              <Link href="https://www.npmjs.com/package/recharts">recharts</Link> +{' '}
              <Link href="https://www.npmjs.com/package/lucide-react">lucide-react</Link>.
              Data from <code>dashboardData.ts</code> + <code>useLiveKpis(5000)</code>.
            </ProjectSectionText>
          </ProjectTextRow>
        </ProjectSectionContent>
      </ProjectSection>
    </ProjectContainer>
    <Footer />
  </Fragment>
);
