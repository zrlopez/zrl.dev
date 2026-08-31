import usesBackgroundPlaceholder from '~/assets/uses-background-placeholder.jpg';
import usesBackground from '~/assets/uses-background.mp4';
import { Footer } from '~/components/footer';
import {
  ProjectBackground,
  ProjectContainer,
  ProjectHeader,
  ProjectSection,
  ProjectSectionContent,
  ProjectSectionHeading,
  ProjectTextRow,
} from '~/layouts/project';
import { baseMeta } from '~/utils/meta';
import { classes } from '~/utils/style';
import styles from './tools.module.css';

export const meta = () => {
  return baseMeta({
    title: 'Tools',
    description:
      'Languages, data systems, ML tooling, and platforms used by Zachary Ryan Lopez — AI/ML Data Operations Analyst.',
  });
};

/**
 * Four workstreams. Every group has a blurb so section headers share
 * the same vertical rhythm.
 * @type {{ title: string, blurb: string, items: { label: string, core?: boolean }[] }[]}
 */
const groups = [
  {
    title: 'Languages & data',
    blurb: 'What I write in and the pipelines that move the data.',
    items: [
      { label: 'Python', core: true },
      { label: 'SQL', core: true },
      { label: 'TypeScript' },
      { label: 'Swift' },
      { label: 'JSON / YAML' },
      { label: 'Pandas', core: true },
      { label: 'SQLite', core: true },
      { label: 'Jupyter' },
      { label: 'ETL pipelines', core: true },
      { label: 'Data validation', core: true },
      { label: 'Tableau' },
      { label: 'Power BI' },
      { label: 'Excel' },
      { label: 'Recharts' },
    ],
  },
  {
    title: 'Annotation & ML',
    blurb: 'Label quality, model support, and how results get measured.',
    items: [
      { label: 'Annotation QA', core: true },
      { label: 'NLP evaluation', core: true },
      { label: 'Prompt engineering', core: true },
      { label: 'RLHF' },
      { label: 'Taxonomy governance' },
      { label: 'Ontology design' },
      { label: 'IAA' },
      { label: 'IRR' },
      { label: 'A/B testing' },
      { label: 'UX evaluation' },
      { label: 'Error analysis' },
      { label: 'PII handling' },
      { label: 'MLOps', core: true },
      { label: 'Hugging Face' },
      { label: 'scikit-learn' },
      { label: 'Gradio' },
      { label: 'LangChain' },
      { label: 'Weights & Biases' },
      { label: 'OpenAI API' },
      { label: 'Anthropic API' },
    ],
  },
  {
    title: 'Build & ship',
    blurb: 'APIs, front ends, deploy targets, and the security checks around them.',
    items: [
      { label: 'FastAPI', core: true },
      { label: 'Pydantic' },
      { label: 'async SQLAlchemy' },
      { label: 'Next.js' },
      { label: 'Remix' },
      { label: 'React' },
      { label: 'Vite' },
      { label: 'Tailwind CSS' },
      { label: 'Three.js' },
      { label: 'Storybook' },
      { label: 'structlog' },
      { label: 'Xcode' },
      { label: 'Docker' },
      { label: 'Git / GitHub', core: true },
      { label: 'Vercel' },
      { label: 'Cloudflare', core: true },
      { label: 'Turnstile' },
      { label: 'TruffleHog' },
      { label: 'Trivy' },
      { label: 'CodeQL' },
      { label: 'Cosign' },
      { label: 'VS Code' },
    ],
  },
  {
    title: 'Practice',
    blurb: 'How the work gets coordinated, documented, and handed off.',
    items: [
      { label: 'Jira' },
      { label: 'Confluence' },
      { label: 'Linear' },
      { label: 'Notion' },
      { label: 'Figma' },
      { label: 'SOP / runbook authoring', core: true },
      { label: 'Stakeholder communication' },
      { label: 'Training & enablement' },
      { label: 'Escalation resolution' },
      { label: 'Project coordination' },
      { label: 'Workflow improvement' },
      { label: 'Process automation' },
      { label: 'Cross-functional ops' },
      { label: 'Experiment design' },
    ],
  },
];

function Chip({ label, core }) {
  return (
    <li className={classes(styles.chip, core && styles.chipCore)}>
      {core && <span className={styles.chipDot} aria-hidden />}
      <span>{label}</span>
      {core && <span className={styles.chipBadge}>Core</span>}
    </li>
  );
}

export const Tools = () => {
  return (
    <>
      <ProjectContainer className={styles.tools}>
        <ProjectBackground
          src={usesBackground}
          placeholder={usesBackgroundPlaceholder}
          opacity={0.7}
        />
        <ProjectHeader
          title="Tools"
          description="Four workstreams behind the annotation QA, ML incident response, and systems I ship."
        />

        {groups.map(group => (
          <ProjectSection padding="none" className={styles.section} key={group.title}>
            <ProjectSectionContent>
              <ProjectTextRow width="m">
                <div className={styles.groupHead}>
                  <ProjectSectionHeading>{group.title}</ProjectSectionHeading>
                  <p className={styles.blurb}>{group.blurb}</p>
                </div>
                <ul className={styles.chips} aria-label={group.title}>
                  {group.items.map(item => (
                    <Chip key={item.label} label={item.label} core={item.core} />
                  ))}
                </ul>
              </ProjectTextRow>
            </ProjectSectionContent>
          </ProjectSection>
        ))}
      </ProjectContainer>
      <Footer />
    </>
  );
};
