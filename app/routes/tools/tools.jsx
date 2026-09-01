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
    title: 'Tools & skills',
    description:
      'Languages, data systems, ML tooling, craft skills, and platforms used by Zachary Ryan Lopez.',
  });
};

/**
 * Tools (what I use) + skills (how I work), one surface.
 * URL stays /tools — nav label is Tools & skills.
 * @type {{ title: string, blurb: string, items: { label: string, core?: boolean }[] }[]}
 */
const groups = [
  {
    title: 'Languages & data',
    blurb: 'What I write in and the stores that hold the work.',
    items: [
      { label: 'Python', core: true },
      { label: 'SQL', core: true },
      { label: 'TypeScript' },
      { label: 'Swift' },
      { label: 'JSON / YAML' },
      { label: 'Pandas', core: true },
      { label: 'SQLite', core: true },
      { label: 'Jupyter' },
      { label: 'Tableau' },
      { label: 'Power BI' },
      { label: 'Excel' },
      { label: 'Recharts' },
    ],
  },
  {
    title: 'Annotation & ML ops',
    blurb: 'Label quality, evaluation, and model support loops.',
    items: [
      { label: 'Annotation QA', core: true },
      { label: 'NLP evaluation', core: true },
      { label: 'Prompt engineering', core: true },
      { label: 'RLHF' },
      { label: 'Taxonomy governance' },
      { label: 'Ontology design' },
      { label: 'IAA / IRR' },
      { label: 'Error analysis' },
      { label: 'PII handling' },
      { label: 'A/B testing' },
      { label: 'ETL pipelines', core: true },
      { label: 'Data validation', core: true },
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
    blurb: 'APIs, front ends, deploy, and the checks around them.',
    items: [
      { label: 'FastAPI', core: true },
      { label: 'Pydantic' },
      { label: 'async SQLAlchemy' },
      { label: 'Remix' },
      { label: 'React' },
      { label: 'Vite' },
      { label: 'Next.js' },
      { label: 'Tailwind CSS' },
      { label: 'Three.js' },
      { label: 'Docker' },
      { label: 'Git / GitHub', core: true },
      { label: 'Vercel' },
      { label: 'Cloudflare', core: true },
      { label: 'Turnstile' },
      { label: 'TruffleHog' },
      { label: 'Trivy' },
      { label: 'CodeQL' },
      { label: 'Cosign' },
      { label: 'structlog' },
      { label: 'VS Code' },
      { label: 'Xcode' },
    ],
  },
  {
    title: 'Practice & craft',
    blurb: 'How work is coordinated, documented, and handed off — plus creative tools.',
    items: [
      { label: 'SOP / runbook authoring', core: true },
      { label: 'Stakeholder communication' },
      { label: 'Training & enablement' },
      { label: 'Escalation resolution' },
      { label: 'Cross-functional ops' },
      { label: 'Experiment design' },
      { label: 'Process automation' },
      { label: 'Jira' },
      { label: 'Linear' },
      { label: 'Notion' },
      { label: 'Confluence' },
      { label: 'Figma' },
      { label: 'Final Cut Pro' },
      { label: 'Logic Pro' },
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
          title="Tools & skills"
          description="What I use and how I work — stacked for annotation QA, ML ops, and the systems I ship."
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
