import { Footer } from '~/components/footer';
import { Icon } from '~/components/icon';
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

const linkIcons = {
  Code: 'github',
  Demo: 'flask-conical',
  Docs: 'book-open',
  'Case study': 'link',
  'Live site': 'link',
};

function ProjectLink({ href, label }) {
  return (
    <Link className={styles.projectLink} href={href}>
      <Icon
        className={styles.projectLinkIcon}
        icon={linkIcons[label] || 'link'}
        size={12}
      />
      <span className={styles.projectLinkLabel}>{label}</span>
    </Link>
  );
}

const projects = [
  {
    title: 'ML Incident Response Playbook + Runbook System',
    meta: 'Author / Engineer — 2025-Present — Data Operations',
    description:
      'Production-grade ML incident response framework with structured runbooks, taxonomy governance, audit trails, and a live anomaly detection demo.',
    links: [
      ['Docs', 'https://mlops.zrl.dev'],
      ['Demo', 'https://huggingface.co/spaces/zrlo/ml-incident-api'],
      ['Code', 'https://github.com/zrlopez/ml-incident-response-playbook'],
    ],
  },
  {
    title: 'Annotation Analytics Dashboard',
    meta: 'Developer — 2025-Present — Analytics',
    description:
      'Interactive dashboard for annotation quality trends, ML support metrics, alert thresholds, capacity forecasting, and workflow performance patterns.',
    links: [
      ['Demo', '/projects/annotation-dashboard#live-demo'],
      ['Case study', '/projects/annotation-dashboard'],
      ['Code', 'https://github.com/zrlopez/performance-analytics-tool'],
    ],
  },
  {
    title: 'AI Agent Orchestration Platform',
    meta: 'Agent Architecture — 2026-Present — AI Systems',
    description:
      'Multi-agent research, execution, and task automation across local and cloud-hosted models, with durable memory and skill routing.',
    links: [['Case study', '/projects/ai-agent-platform']],
  },
  {
    title: 'Portfolio Website',
    meta: 'Developer — 2025-Present — Web Development',
    description:
      'The zrl.dev portfolio, evolving from Next.js, TypeScript, and Tailwind into a Remix/Vite redesign deployed through Vercel and Cloudflare.',
    links: [
      ['Live site', 'https://zrl.dev'],
      ['Code', 'https://github.com/zrlopez/zrl.dev'],
    ],
  },
  {
    title: 'AI/ML Experiment Suite',
    meta: 'Lead — 2024-2026 — Data Operations',
    description:
      'Ten-plus NLP annotation experiments using Python and SQL to evaluate labeling consistency, test workflow assumptions, and reduce variance by 15%.',
    links: [],
  },
  {
    title: 'Data Pipeline Prototypes',
    meta: 'Engineer — 2025-2026 — Data Engineering',
    description:
      'ETL and data-validation prototypes built with Pandas and SQLite to automate quality checks and produce Tableau-ready reporting outputs.',
    links: [],
  },
  {
    title: 'Health Record System',
    meta: 'Developer — Aug 2025 — Data Engineering',
    description:
      'Local SQLite and React health-record application for aggregating PDFs, XML, and JSON medical documents with privacy-conscious storage and visualization.',
    links: [],
  },
];

export const meta = () =>
  baseMeta({
    title: 'Projects',
    description:
      'Data operations, ML/AI tooling, and engineering projects by Zachary Ryan Lopez.',
  });

export default function Projects() {
  return (
    <>
      <ProjectContainer className={styles.tools}>
        <ProjectBackground
          src={usesBackground}
          placeholder={usesBackgroundPlaceholder}
          opacity={0.6}
        />
        <ProjectHeader
          title="Projects"
          description="Data operations, ML/AI tooling, and engineering work built around real workflow pressure: incident response, annotation quality, pipelines, and practical web systems."
        />
        <ProjectSection padding="none" className={styles.section}>
          <ProjectSectionContent>
            {projects.map(project => (
              <ProjectTextRow width="m" key={project.title}>
                <ProjectSectionHeading>{project.title}</ProjectSectionHeading>
                <ProjectSectionText as="div">
                  <List>
                    <ListItem>{project.meta}</ListItem>
                    <ListItem>{project.description}</ListItem>
                  </List>
                  {!!project.links.length && (
                    <div className={styles.projectActions}>
                      {project.links.map(([label, href]) => (
                        <span className={styles.projectLinkItem} key={href}>
                          <ProjectLink href={href} label={label} />
                        </span>
                      ))}
                    </div>
                  )}
                </ProjectSectionText>
              </ProjectTextRow>
            ))}
          </ProjectSectionContent>
        </ProjectSection>
      </ProjectContainer>
      <Footer />
    </>
  );
}
