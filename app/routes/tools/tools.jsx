import usesBackgroundPlaceholder from '~/assets/uses-background-placeholder.jpg';
import usesBackground from '~/assets/uses-background.mp4';
import { Footer } from '~/components/footer';
import { Table, TableBody, TableCell, TableHeadCell, TableRow } from '~/components/table';
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

/** @type {{ title: string, blurb?: string, items: { label: string, core?: boolean }[] }[]} */
const groups = [
  {
    title: 'Languages',
    items: [
      { label: 'Python', core: true },
      { label: 'SQL', core: true },
      { label: 'TypeScript' },
      { label: 'Swift' },
      { label: 'JSON / YAML' },
    ],
  },
  {
    title: 'Data systems',
    blurb: 'High-volume validation, ETL, and reporting pipelines.',
    items: [
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
    title: 'AI / ML ops',
    blurb: 'Label quality, model support, and evaluation loops.',
    items: [
      { label: 'Annotation QA', core: true },
      { label: 'NLP evaluation', core: true },
      { label: 'Prompt engineering', core: true },
      { label: 'RLHF' },
      { label: 'Taxonomy governance' },
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
    title: 'Build',
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
    ],
  },
  {
    title: 'Ship & secure',
    items: [
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
    title: 'Evaluation',
    blurb: 'How labeling quality and model support get measured.',
    items: [
      { label: 'A/B testing' },
      { label: 'Ontology design' },
      { label: 'UX evaluation' },
      { label: 'IAA' },
      { label: 'IRR' },
      { label: 'Error analysis' },
      { label: 'NLP evaluation', core: true },
    ],
  },
  {
    title: 'Collaborate',
    items: [
      { label: 'Jira' },
      { label: 'Confluence' },
      { label: 'Linear' },
      { label: 'Notion' },
      { label: 'Figma' },
      { label: 'SOP / runbook authoring', core: true },
      { label: 'Cross-functional ops' },
      { label: 'Experiment design' },
    ],
  },
  {
    title: 'Professional practice',
    blurb: 'The people-and-process side of high-volume annotation ops.',
    items: [
      { label: 'Stakeholder communication' },
      { label: 'Training & enablement' },
      { label: 'Escalation resolution' },
      { label: 'Project coordination' },
      { label: 'Workflow improvement' },
      { label: 'Process automation' },
      { label: 'Cross-functional collaboration' },
      { label: 'SOP & guideline authoring', core: true },
    ],
  },
  {
    title: 'Creative',
    items: [
      { label: 'Xcode' },
      { label: 'Final Cut Pro' },
      { label: 'Logic Pro' },
    ],
  },
];

const system = [
  ['Laptop', '16″ MacBook Pro · M4 Pro'],
  ['OS', 'macOS 15 Sequoia'],
  ['Monitor', 'MSI MPG 274URDFW E16M'],
  ['Keyboard', 'Keychron Q6 HE 8K'],
  ['Pointer', 'Magic Trackpad (USB-C)'],
  ['Audio', 'AirPods Max / AirPods Pro 3'],
  ['Browser', 'Brave'],
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
          description="The stack behind annotation QA, ML incident response, and the systems I ship — languages and data first, then model ops, evaluation practice, collaboration, and desk."
        />

        {groups.map(group => (
          <ProjectSection padding="none" className={styles.section} key={group.title}>
            <ProjectSectionContent>
              <ProjectTextRow width="m">
                <div className={styles.groupHead}>
                  <ProjectSectionHeading>{group.title}</ProjectSectionHeading>
                  {group.blurb && <p className={styles.blurb}>{group.blurb}</p>}
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

        <ProjectSection padding="none" className={styles.section}>
          <ProjectSectionContent>
            <ProjectTextRow stretch width="m">
              <ProjectSectionHeading>Desk</ProjectSectionHeading>
              <Table>
                <TableBody>
                  {system.map(([k, v]) => (
                    <TableRow key={k}>
                      <TableHeadCell>{k}</TableHeadCell>
                      <TableCell>{v}</TableCell>
                    </TableRow>
                  ))}
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
