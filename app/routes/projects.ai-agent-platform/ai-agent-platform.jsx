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
import { List, ListItem } from '~/components/list';
import { baseMeta } from '~/utils/meta';
import usesBackgroundPlaceholder from '~/assets/uses-background-placeholder.jpg';
import usesBackground from '~/assets/uses-background.mp4';
import agentOrch from '~/assets/agent-orchestration.jpg';
import agentOrchPlaceholder from '~/assets/agent-orchestration-placeholder.jpg';
import agentOrchLarge from '~/assets/agent-orchestration-large.jpg';
import { Image } from '~/components/image';
import { Fragment } from 'react';
import { media } from '~/utils/style';

const title = 'AI Agent Orchestration Platform';
const description =
  'Cross-agent orchestration for research → execution loops: specialized agents, durable memory, skill routing, and local-first inference with cloud fallback.';
const roles = ['Agent architecture', 'Python / JS', 'Systems ops'];

export const meta = () => baseMeta({ title, description, prefix: 'Projects' });

export const AiAgentPlatform = () => (
  <Fragment>
    <ProjectContainer>
      <ProjectBackground
        src={usesBackground}
        placeholder={usesBackgroundPlaceholder}
        opacity={0.6}
      />
      <ProjectHeader title={title} description={description} roles={roles} />
      <ProjectSection padding="top">
        <ProjectSectionContent width="xl">
          <Image
            srcSet={`${agentOrch} 1280w, ${agentOrchLarge} 2560w`}
            placeholder={agentOrchPlaceholder}
            width={1280}
            height={800}
            alt="Agent orchestration console — live graph, agents, queue, and model mix"
            sizes={`(max-width: ${media.mobile}px) 100vw, 80vw`}
          />
        </ProjectSectionContent>
      </ProjectSection>

      <ProjectSection>
        <ProjectSectionContent width="xl">
          <ProjectTextRow width="l">
            <ProjectSectionHeading>Problem</ProjectSectionHeading>
            <ProjectSectionText>
              Single-chat agents collapse under real work: context rot, no handoff
              discipline, and no separation between research, execution, and review.
              I needed a control plane that treats agents as a fleet — not one
              omniscient prompt — with durable memory and clear ownership of each step.
            </ProjectSectionText>
          </ProjectTextRow>
        </ProjectSectionContent>
      </ProjectSection>

      <ProjectSection light>
        <ProjectSectionContent width="xl">
          <ProjectTextRow width="l">
            <ProjectSectionHeading>Cross-agent orchestration</ProjectSectionHeading>
            <ProjectSectionText>
              Work enters as a goal. A planner decomposes it into tasks; specialists
              claim work by skill (code, research, ops, review). A router picks the
              model and runtime per task — local open-weight for private or bulk work,
              cloud models when quality or tool access demands it. Results flow back
              through a shared queue with status, retries, and human checkpoints when
              confidence is low.
            </ProjectSectionText>
            <ProjectSectionText as="div">
              <List>
                <ListItem>
                  <strong>Specialists, not one mega-agent</strong> — each agent has a
                  narrow charter and tool surface so failures stay contained.
                </ListItem>
                <ListItem>
                  <strong>Skill routing</strong> — tasks match packaged skills
                  (workflows + tools + constraints) instead of free-form prompting.
                </ListItem>
                <ListItem>
                  <strong>Durable memory</strong> — OpenViking (and related stores)
                  keep facts, decisions, and session residue across turns so agents
                  do not re-derive the same context every call.
                </ListItem>
                <ListItem>
                  <strong>Local-first inference</strong> — private loops stay on-box;
                  cloud is a deliberate escalation, not the default.
                </ListItem>
                <ListItem>
                  <strong>Hardened delivery</strong> — CI mirrors the ML incident
                  stack: secret scan, image/scan, signing, and CodeQL on the paths
                  that ship.
                </ListItem>
              </List>
            </ProjectSectionText>
          </ProjectTextRow>
        </ProjectSectionContent>
      </ProjectSection>

      <ProjectSection>
        <ProjectSectionContent width="xl">
          <ProjectTextRow width="l">
            <ProjectSectionHeading>Runtime shape</ProjectSectionHeading>
            <ProjectSectionText>
              The console in the still above is the operator view: live agent graph,
              queue depth, model mix, and recent log lines. Underneath, orchestration
              is event-driven — task claimed → tool run → memory write → next hop —
              with isolation between agent profiles so one profile’s credentials and
              memory cannot leak into another.
            </ProjectSectionText>
            <ProjectSectionText>
              Multi-agent coordination uses explicit A2A-style ports and a fleet
              roster rather than informal chat ping-pong. That keeps research agents
              from stomping execution state, and keeps review agents read-mostly until
              a merge gate opens.
            </ProjectSectionText>
          </ProjectTextRow>
        </ProjectSectionContent>
      </ProjectSection>

      <ProjectSection light>
        <ProjectSectionContent width="xl">
          <ProjectTextRow width="l">
            <ProjectSectionHeading>What this is not</ProjectSectionHeading>
            <ProjectSectionText>
              Not a chatbot wrapper. Not a single vendor lock-in demo. The point is
              operational: reliable handoffs, memory that survives sessions, and a
              path to ship agent work with the same hygiene as any other production
              system. Inventory of the surrounding stack lives on{' '}
              <Link href="/tools">Tools &amp; skills</Link>.
            </ProjectSectionText>
          </ProjectTextRow>
        </ProjectSectionContent>
      </ProjectSection>
    </ProjectContainer>
    <Footer />
  </Fragment>
);
