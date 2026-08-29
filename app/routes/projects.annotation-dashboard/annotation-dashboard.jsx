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
import sliceAnnotation from '~/assets/slice-annotation.png';
import sliceAnnotationLarge from '~/assets/slice-annotation-large.png';
import sliceAnnotationPlaceholder from '~/assets/slice-annotation-placeholder.png';
import { Image } from '~/components/image';
import { Fragment } from 'react';
import { media } from '~/utils/style';

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
      <ProjectHeader title={title} description={description} roles={roles} />
      <ProjectSection padding="top">
        <ProjectSectionContent>
          <Image
            srcSet={`${sliceAnnotation} 440w, ${sliceAnnotationLarge} 880w`}
            placeholder={sliceAnnotationPlaceholder}
            width={440}
            height={340}
            alt="Annotation dashboard placeholder — slice annotation texture until real Recharts screenshot"
            sizes={`(max-width: ${media.mobile}px) 90vw, 440px`}
          />
        </ProjectSectionContent>
      </ProjectSection>
      <ProjectSection>
        <ProjectSectionContent>
          <ProjectTextRow>
            <ProjectSectionHeading>What it tracks</ProjectSectionHeading>
            <ProjectSectionText>
              Live KPIs, error and throughput trends, and capacity forecasts. ETL +
              validation pipelines (Pandas/SQLite) automate high-volume checks — see{' '}
              <Link href="/experience">experience</Link> for the ops layer.
            </ProjectSectionText>
          </ProjectTextRow>
        </ProjectSectionContent>
      </ProjectSection>
      <ProjectSection light>
        <ProjectSectionContent>
          <ProjectTextRow>
            <ProjectSectionHeading>Next</ProjectSectionHeading>
            <ProjectSectionText>
              Replace this placeholder with a real dashboard capture (Recharts). Keep the
              Slice annotation texture as a stopgap — it signals annotation work without
              implying final UI.
            </ProjectSectionText>
          </ProjectTextRow>
        </ProjectSectionContent>
      </ProjectSection>
    </ProjectContainer>
    <Footer />
  </Fragment>
);
