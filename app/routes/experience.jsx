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

export const meta = () => {
  return baseMeta({
    title: 'Experience',
    description:
      'Work history and selected projects from an AI/ML Data Operations Analyst focused on annotation QA and workflow systems.',
  });
};

export const Experience = () => {
  return (
    <>
      <ProjectContainer className={styles.tools}>
        <ProjectBackground
          src={usesBackground}
          placeholder={usesBackgroundPlaceholder}
          opacity={0.6}
        />
        <ProjectHeader
          title="Experience"
          description="Seven-plus years across Apple Data Operations and independent AI/ML R&D — shipping Python/SQL tooling, hardened incident systems, and dashboards that cut reporting time by 40%."
        />
        <ProjectSection padding="none" className={styles.section}>
          <ProjectSectionContent>
            <ProjectTextRow width="m">
              <ProjectSectionHeading>
                Independent — AI/ML Data Operations Researcher
              </ProjectSectionHeading>
              <ProjectSectionText as="div">
                <List>
                  <ListItem>Austin, TX — Jun 2024–Present</ListItem>
                  <ListItem>
                    Built ML incident-response system (Python, FastAPI, async SQLAlchemy)
                    with SEV1–SEV3 state, audit trails, versioned runbooks (8), model
                    cards, and TruffleHog/Trivy/Cosign/CodeQL hardening.
                  </ListItem>
                  <ListItem>
                    Annotation analytics dashboard — live KPIs, alert thresholds, capacity
                    forecasting, six-tab workflow visibility (rebuilt JS →
                    Next.js/TS/Recharts) at{' '}
                    <Link href="/projects/annotation-dashboard#live-demo">
                      zrl.dev/projects/annotation-dashboard#live-demo
                    </Link>
                    .
                  </ListItem>
                  <ListItem>
                    ETL + validation pipelines (Pandas/SQLite) automating high-volume
                    checks; portfolio at <Link href="https://zrl.dev">zrl.dev</Link>{' '}
                    with the revamp moving toward Remix, Vite, Vercel, and Cloudflare.
                  </ListItem>
                </List>
              </ProjectSectionText>
            </ProjectTextRow>
          </ProjectSectionContent>
        </ProjectSection>
        <ProjectSection padding="none" className={styles.section}>
          <ProjectSectionContent>
            <ProjectTextRow width="m">
              <ProjectSectionHeading>
                Apple — Data Operations Analyst
              </ProjectSectionHeading>
              <ProjectSectionText as="div">
                <List>
                  <ListItem>Austin, TX — Sep 2021–Jun 2024</ListItem>
                  <ListItem>
                    Partnered cross-functionally to close annotation workflow gaps — 43%
                    faster escalation resolution.
                  </ListItem>
                  <ListItem>
                    Audited high-volume audiovisual datasets vs Siri NLP guidelines;
                    maintained policy-compliant labeling through fast review cycles and
                    linguistic judgment on ambiguous utterances.
                  </ListItem>
                </List>
              </ProjectSectionText>
            </ProjectTextRow>
          </ProjectSectionContent>
        </ProjectSection>
        <ProjectSection padding="none" className={styles.section}>
          <ProjectSectionContent>
            <ProjectTextRow width="m">
              <ProjectSectionHeading>Apple — Technical Expert</ProjectSectionHeading>
              <ProjectSectionText as="div">
                <List>
                  <ListItem>Austin, TX — Mar 2019–Sep 2021</ListItem>
                  <ListItem>
                    Diagnosed recurring faults via log/trend analysis — 20% fewer repeat
                    contacts; playbooks adopted by 5+ teammates. 1,200+ escalations, 95%
                    first-time fix, 4.9/5 CSAT.
                  </ListItem>
                </List>
              </ProjectSectionText>
            </ProjectTextRow>
          </ProjectSectionContent>
        </ProjectSection>
        <ProjectSection padding="none" className={styles.section}>
          <ProjectSectionContent>
            <ProjectTextRow width="m">
              <ProjectSectionHeading>Earlier</ProjectSectionHeading>
              <ProjectSectionText as="div">
                <List>
                  <ListItem>
                    Apple Pay Business Development Specialist — Jan–Jun 2021 — merchant
                    onboarding & integration.
                  </ListItem>
                  <ListItem>
                    AppleCare Support Advisor — Mar 2020–Jan 2021 — 90%+ same-call
                    resolution, 2,000+ cases.
                  </ListItem>
                  <ListItem>
                    Apple Specialist — Apr 2017–Mar 2019 — $10K+/mo sales, 30% attach, SMB
                    workflows.
                  </ListItem>
                  <ListItem>
                    Starbucks Shift Lead — Sep 2016–Mar 2017 — 7+ baristas, 4+ hires
                    mentored.
                  </ListItem>
                  <ListItem>
                    Target Guest Service Attendant / Front-End Supervisor — Aug 2015–Nov
                    2016 — 10+ trained.
                  </ListItem>
                </List>
              </ProjectSectionText>
            </ProjectTextRow>
          </ProjectSectionContent>
        </ProjectSection>
        <ProjectSection padding="none" className={styles.section}>
          <ProjectSectionContent>
            <ProjectTextRow width="m">
              <ProjectSectionHeading>Selected Projects</ProjectSectionHeading>
              <ProjectSectionText as="div">
                <List>
                  <ListItem>
                    <Link href="/projects/ai-agent-platform">
                      AI Agent Orchestration Platform
                    </Link>{' '}
                    — multi-agent research/execution automation (Jun 2026–Present).
                  </ListItem>
                  <ListItem>
                    <Link href="/projects/ml-incident-response">
                      ML Incident Response Playbook + Runbook System
                    </Link>{' '}
                    — FastAPI + governance artifacts (May 2026–Present).
                  </ListItem>
                  <ListItem>
                    <Link href="/projects/annotation-dashboard#live-demo">
                      Annotation Analytics Dashboard
                    </Link>{' '}
                    — live KPI/ML visibility (Sep 2025–Present).
                  </ListItem>
                  <ListItem>
                    <Link href="/projects">Project archive</Link> — AI/ML experiments,
                    ETL prototypes, the portfolio rebuild, and selected data systems.
                  </ListItem>
                </List>
              </ProjectSectionText>
            </ProjectTextRow>
          </ProjectSectionContent>
        </ProjectSection>
      </ProjectContainer>
      <Footer />
    </>
  );
};

export default Experience;
