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
import sprTexture from '~/assets/spr-lesson-builder-dark.jpg';
import sprTexturePlaceholder from '~/assets/spr-lesson-builder-dark-placeholder.jpg';
import sprTextureLarge from '~/assets/spr-lesson-builder-dark-large.jpg';
import { Image } from '~/components/image';
import { Fragment } from 'react';
import { media } from '~/utils/style';

const title = 'AI Agent Orchestration Platform';
const description =
  'Multi-agent research, execution, and task automation across local (Ollama 127.0.0.1:11434) and cloud-hosted models — with durable memory, skill routing, and hardened CI.';
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
            srcSet={`${sprTexture} 1280w, ${sprTextureLarge} 2560w`}
            placeholder={sprTexturePlaceholder}
            width={1280}
            height={800}
            alt="AI Agent Orchestration Platform — model texture placeholder"
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
              across Tilde, Rover, and peers via skills, keeps durable context in
              supermemory/OpenViking, and ships with Ollama (§11434) for zero-egress
              inference. Replace this texture with a real screen of the agent graph when
              ready.
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
              system: TruffleHog, Trivy, Cosign, CodeQL. Private journal stays local
              (Tilde owns that store) — see <Link href="/uses">uses</Link>.
            </ProjectSectionText>
          </ProjectTextRow>
        </ProjectSectionContent>
      </ProjectSection>
    </ProjectContainer>
    <Footer />
  </Fragment>
);
