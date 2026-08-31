import agentOrchLarge from '~/assets/agent-orchestration-large.jpg';
import agentOrchPlaceholder from '~/assets/agent-orchestration-placeholder.jpg';
import agentOrch from '~/assets/agent-orchestration.jpg';
import mlopsProfileLarge from '~/assets/mlops-profile-large.jpg';
import mlopsProfilePlaceholder from '~/assets/mlops-profile-placeholder.jpg';
import mlopsProfile from '~/assets/mlops-profile.jpg';
import sliceAnnotation from '~/assets/slice-annotation.png';
import sliceAnnotationLarge from '~/assets/slice-annotation-large.png';
import sliceAnnotationPlaceholder from '~/assets/slice-annotation-placeholder.png';
import { Footer } from '~/components/footer';
import { baseMeta } from '~/utils/meta';
import { Impact } from './impact';
import { Intro } from './intro';
import { Profile } from './profile';
import { ProjectSummary } from './project-summary';
import { useEffect, useRef, useState } from 'react';
import config from '~/config.json';
import styles from './home.module.css';

// Prefetch draco decoader wasm
export const links = () => {
  return [
    {
      rel: 'prefetch',
      href: '/draco/draco_wasm_wrapper.js',
      as: 'script',
      type: 'text/javascript',
      importance: 'low',
    },
    {
      rel: 'prefetch',
      href: '/draco/draco_decoder.wasm',
      as: 'fetch',
      type: 'application/wasm',
      importance: 'low',
    },
  ];
};

export const meta = () => {
  return baseMeta({
    title: 'AI/ML Data Ops',
    description: `Portfolio of ${config.name} — an AI/ML Data Operations Analyst building Python and SQL tools, validating high-volume datasets, and improving labeling pipelines.`,
  });
};

export const Home = () => {
  const [visibleSections, setVisibleSections] = useState([]);
  const [scrollIndicatorHidden, setScrollIndicatorHidden] = useState(false);
  const intro = useRef();
  const projectOne = useRef();
  const projectTwo = useRef();
  const projectThree = useRef();
  const impact = useRef();
  const details = useRef();

  useEffect(() => {
    const sections = [intro, projectOne, projectTwo, projectThree, impact, details];

    const sectionObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const section = entry.target;
            observer.unobserve(section);
            if (visibleSections.includes(section)) return;
            setVisibleSections(prevSections => [...prevSections, section]);
          }
        });
      },
      { rootMargin: '0px 0px -10% 0px', threshold: 0.1 }
    );

    const indicatorObserver = new IntersectionObserver(
      ([entry]) => {
        setScrollIndicatorHidden(!entry.isIntersecting);
      },
      { rootMargin: '-100% 0px 0px 0px' }
    );

    sections.forEach(section => {
      sectionObserver.observe(section.current);
    });

    indicatorObserver.observe(intro.current);

    return () => {
      sectionObserver.disconnect();
      indicatorObserver.disconnect();
    };
  }, [visibleSections]);

  return (
    <div className={styles.home}>
      <Intro
        id="intro"
        sectionRef={intro}
        scrollIndicatorHidden={scrollIndicatorHidden}
      />
      <ProjectSummary
        id="project-1"
        sectionRef={projectOne}
        visible={visibleSections.includes(projectOne.current)}
        index={1}
        title="AI Agent Orchestration Platform"
        description="A multi-agent AI system for research, execution, and task automation across local and cloud-hosted models"
        buttonText="View project"
        buttonLink="/projects/ai-agent-platform"
        model={{
          type: 'laptop',
          alt: 'AI Agent Orchestration Platform',
          textures: [
            {
              srcSet: `${agentOrch} 1280w, ${agentOrchLarge} 2560w`,
              placeholder: agentOrchPlaceholder,
            },
          ],
        }}
      />
      <ProjectSummary
        id="project-2"
        alternate
        sectionRef={projectTwo}
        visible={visibleSections.includes(projectTwo.current)}
        index={2}
        title="ML Incident Response System"
        description="A production-grade response system with audit trails, SEV1–SEV3 state handling, and versioned runbooks"
        buttonText="View project"
        buttonLink="/projects/ml-incident-response"
        model={{
          type: 'laptop',
          alt: 'ML Incident Response System runbook browser',
          textures: [
            {
              srcSet: `${mlopsProfile} 800w, ${mlopsProfileLarge} 1920w`,
              placeholder: mlopsProfilePlaceholder,
            },
          ],
        }}
      />
      <ProjectSummary
        id="project-3"
        sectionRef={projectThree}
        visible={visibleSections.includes(projectThree.current)}
        index={3}
        title="Annotation Analytics Dashboard"
        description="A real-time annotation analytics dashboard tracking labeling quality trends and workflow performance"
        buttonText="View live demo"
        buttonLink="/projects/annotation-dashboard#live-demo"
        model={{
          type: 'laptop',
          alt: 'Real-time annotation analytics dashboard',
          textures: [
            {
              srcSet: `${sliceAnnotation} 1280w, ${sliceAnnotationLarge} 2560w`,
              placeholder: sliceAnnotationPlaceholder,
            },
          ],
        }}
      />
      <Impact
        id="impact"
        sectionRef={impact}
        visible={visibleSections.includes(impact.current)}
      />
      <Profile
        sectionRef={details}
        visible={visibleSections.includes(details.current)}
        id="details"
      />
      <Footer />
    </div>
  );
};
