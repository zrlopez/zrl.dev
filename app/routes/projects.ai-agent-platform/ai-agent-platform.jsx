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
import agentOrch from '~/assets/agent-orchestration.jpg';
import agentOrchPlaceholder from '~/assets/agent-orchestration-placeholder.jpg';
import agentOrchLarge from '~/assets/agent-orchestration-large.jpg';
import { Image } from '~/components/image';
import { Fragment } from 'react';
import { media } from '~/utils/style';

const title = 'AI Agent Orchestration Platform';
const description =
  'Multi-agent research, execution, and task automation across local and cloud-hosted models — with durable memory, skill routing, and hardened CI.';
const roles = ['Agent Architecture', 'Python / JS', 'MLOps'];

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
        <ProjectSectionContent>
          <Image
            srcSet={`${agentOrch} 1280w, ${agentOrchLarge} 2560w`}
            placeholder={agentOrchPlaceholder}
            width={1280}
            height={800}
            alt="AI Agent Orchestration Platform console — live graph, agents, and task queue"
            sizes={`(max-width: ${media.mobile}px) 100vw, 80vw`}
          />
        </ProjectSectionContent>
      </ProjectSection>
      <ProjectSection>
        <ProjectSectionContent>
          <ProjectTextRow>
            <ProjectSectionHeading>What it does</ProjectSectionHeading>
            <ProjectSectionText>
              Local-first orchestration for research → execution loops. Routes tasks
              across agents via skills, keeps durable context in
              supermemory/OpenViking, and uses open-weight models for zero-egress
              inference.
            </ProjectSectionText>
          </ProjectTextRow>
        </ProjectSectionContent>
      </ProjectSection>
      <ProjectSection light>
        <ProjectSectionContent>
          <ProjectTextRow>
            <ProjectSectionHeading>Stack & hardening</ProjectSectionHeading>
            <ProjectSectionText>
              Python, FastAPI, Remix/React, Three.js. CI hardening mirrors the ML incident
              system: TruffleHog, Trivy, Cosign, CodeQL. Journal and memory stay local —
              see <Link href="/tools">tools</Link>.
            </ProjectSectionText>
          </ProjectTextRow>
        </ProjectSectionContent>
      </ProjectSection>
    </ProjectContainer>
    <Footer />
  </Fragment>
);
