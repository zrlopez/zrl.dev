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
import sliceApp from '~/assets/slice-app.jpg';
import sliceAppLarge from '~/assets/slice-app-large.jpg';
import sliceAppPlaceholder from '~/assets/slice-app-placeholder.jpg';
import { Image } from '~/components/image';
import { Fragment } from 'react';
import { media } from '~/utils/style';

const title = 'ML Incident Response Playbook';
const description =
  'Production-grade SEV1–SEV3 response system with audit trails, versioned runbooks (8), model cards, and governance artifacts — FastAPI + async SQLAlchemy + structlog.';
const roles = ['FastAPI / SQLAlchemy', 'Incident Ops', 'Governance'];

export const meta = () => baseMeta({ title, description, prefix: 'Projects' });

export const MlIncidentResponse = () => (
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
        url="https://mlops.zrl.dev"
        roles={roles}
      />
      <ProjectSection padding="top">
        <ProjectSectionContent>
          <Image
            srcSet={`${sliceApp} 800w, ${sliceAppLarge} 1920w`}
            placeholder={sliceAppPlaceholder}
            width={800}
            height={500}
            alt="ML Incident Response runbook browser placeholder"
            sizes={`(max-width: ${media.mobile}px) 100vw, 80vw`}
          />
        </ProjectSectionContent>
      </ProjectSection>
      <ProjectSection>
        <ProjectSectionContent>
          <ProjectTextRow>
            <ProjectSectionHeading>Runbooks & model cards</ProjectSectionHeading>
            <ProjectSectionText>
              Eight versioned runbooks + model cards, SEV state machine, and audit trails.
              Docs previously on MkDocs Material, now Nextra 3.2.1 at{' '}
              <Link href="https://mlops.zrl.dev">mlops.zrl.dev</Link> (46 pages). Replace
              this Slice placeholder with a real runbook screenshot.
            </ProjectSectionText>
          </ProjectTextRow>
        </ProjectSectionContent>
      </ProjectSection>
      <ProjectSection light>
        <ProjectSectionContent>
          <ProjectTextRow>
            <ProjectSectionHeading>Hardening</ProjectSectionHeading>
            <ProjectSectionText>
              TruffleHog, Trivy, Cosign, CodeQL in CI; deterministic builds;
              policy-compliant labeling lineage from Siri-scale ops. See{' '}
              <Link href="/experience">experience</Link> for 43% faster escalation stats.
            </ProjectSectionText>
          </ProjectTextRow>
        </ProjectSectionContent>
      </ProjectSection>
    </ProjectContainer>
    <Footer />
  </Fragment>
);
