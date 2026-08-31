import { Footer } from '~/components/footer';
import { Icon } from '~/components/icon';
import { Link } from '~/components/link';
import {
  ProjectBackground,
  ProjectContainer,
  ProjectHeader,
  ProjectSection,
  ProjectSectionContent,
  ProjectTextRow,
} from '~/layouts/project';
import { baseMeta } from '~/utils/meta';
import usesBackgroundPlaceholder from '~/assets/uses-background-placeholder.jpg';
import usesBackground from '~/assets/uses-background.mp4';
import { useCallback, useEffect, useState } from 'react';
import styles from './certifications.module.css';

const CERTIFICATIONS = [
  {
    id: 'harvard-cs50p',
    title: 'Programming with Python (CS50P)',
    issuer: 'Harvard University',
    date: 'May 20, 2026',
    image: '/certs/Harvard-CS50P-Zachary-Ryan-Lopez.png',
    verifyUrl:
      'https://cs50.harvard.edu/certificates/a2fb0892-7781-498c-b3e0-2552de74b397',
  },
  {
    id: 'kaggle-python',
    title: 'Python',
    issuer: 'Kaggle',
    date: 'May 18, 2026',
    image: '/certs/Zachary-Ryan-Lopez-Python.png',
    verifyUrl: 'https://www.kaggle.com/learn/certification/zrlopez/python',
  },
  {
    id: 'kaggle-pandas',
    title: 'Pandas',
    issuer: 'Kaggle',
    date: 'May 19, 2026',
    image: '/certs/Zachary-Ryan-Lopez-Pandas.png',
    verifyUrl: 'https://www.kaggle.com/learn/certification/zrlopez/pandas',
  },
  {
    id: 'kaggle-ml',
    title: 'Intermediate Machine Learning',
    issuer: 'Kaggle',
    date: 'May 19, 2026',
    image: '/certs/Zachary-Ryan-Lopez-Intermediate-Machine-Learning.png',
    verifyUrl:
      'https://www.kaggle.com/learn/certification/zrlopez/intermediate-machine-learning',
  },
  {
    id: 'kaggle-sql',
    title: 'Advanced SQL',
    issuer: 'Kaggle',
    date: 'May 19, 2026',
    image: '/certs/Zachary-Ryan-Lopez-Advanced-SQL.png',
    verifyUrl: 'https://www.kaggle.com/learn/certification/zrlopez/advanced-sql',
  },
  {
    id: 'hubspot-seoii',
    title: 'SEO II Certification',
    issuer: 'HubSpot Academy',
    date: 'May 18, 2026',
    image: '/certs/HubSpot_SEO_II_Certification_Zachary_Lopez_May_2026.png',
    verifyUrl:
      'https://app-na2.hubspot.com/academy/achievements/3z03ccxd/en/1/zachary-lopez/seo-ii',
  },
  {
    id: 'hubspot-servicehub',
    title: 'Service Hub Software Certified',
    issuer: 'HubSpot Academy',
    date: 'May 18, 2026',
    image: '/certs/HubSpot_Service_Hub_Software_Zachary_Lopez_2026.png',
    verifyUrl:
      'https://app-na2.hubspot.com/academy/achievements/6dhmh4p0/en/1/zachary-lopez/service-hub-software',
  },
  {
    id: 'apple-acit',
    title: 'Apple Certified iOS Technician (ACiT)',
    issuer: 'Apple',
    date: 'March 14, 2019',
    image: null,
    verifyUrl: '',
  },
];

export const meta = () =>
  baseMeta({
    title: 'Certifications',
    description:
      'Certifications across Python, SQL, data science, machine learning, service operations, and digital marketing.',
  });

function CertLightbox({ cert, onClose, titleId }) {
  const [loaded, setLoaded] = useState(false);

  // Lock page scroll only while the dialog is open — mounting this
  // effect with cert=null was freezing /certifications with overflow:hidden.
  useEffect(() => {
    if (!cert) return undefined;

    const onKey = event => {
      if (event.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = previousOverflow;
    };
  }, [cert, onClose]);

  useEffect(() => {
    setLoaded(false);
  }, [cert?.id]);

  if (!cert) return null;

  return (
    <div
      className={styles.lightbox}
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
    >
      <button
        type="button"
        className={styles.backdrop}
        aria-label="Close certificate"
        onClick={onClose}
      />
      <div className={styles.panel}>
        <div className={styles.panelHeader}>
          <div>
            <h2 className={styles.panelTitle} id={titleId}>
              {cert.title}
            </h2>
            <p className={styles.panelMeta}>
              {cert.issuer} · {cert.date}
            </p>
          </div>
          <button
            type="button"
            className={styles.closeButton}
            onClick={onClose}
            aria-label="Close certificate"
          >
            <Icon icon="close" />
          </button>
        </div>

        <div className={styles.panelBody}>
          {cert.image ? (
            <>
              {!loaded && <p className={styles.loading}>Loading certificate…</p>}
              <img
                className={styles.certificateImage}
                src={cert.image}
                alt={`${cert.title} — ${cert.issuer} certificate`}
                onLoad={() => setLoaded(true)}
                data-loaded={loaded}
              />
            </>
          ) : (
            <div className={styles.missingImage}>
              <p>Certificate image coming soon.</p>
            </div>
          )}
        </div>

        <div className={styles.panelFooter}>
          {!!cert.verifyUrl && (
            <Link href={cert.verifyUrl} className={styles.verifyLink}>
              Open verification
              <Icon icon="link" />
            </Link>
          )}
          <button type="button" className={styles.closeText} onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

export default function Certifications() {
  const [openCert, setOpenCert] = useState(null);
  const titleId = 'certificate-dialog-title';
  const closeLightbox = useCallback(() => setOpenCert(null), []);

  return (
    <>
      <ProjectContainer>
        <ProjectBackground
          src={usesBackground}
          placeholder={usesBackgroundPlaceholder}
          opacity={0.6}
        />
        <ProjectHeader
          title="Certifications"
          description="A compact gallery of credentials across programming, data science, machine learning, SQL, service operations, and digital marketing — click any card to view the certificate."
        />
        <ProjectSection padding="none" className={styles.section}>
          <ProjectSectionContent>
            <ProjectTextRow stretch width="l">
              <ul className={styles.grid}>
                {CERTIFICATIONS.map(cert => (
                  <li key={cert.id} className={styles.card}>
                    <button
                      type="button"
                      className={styles.cardButton}
                      onClick={() => setOpenCert(cert)}
                      aria-haspopup="dialog"
                    >
                      <div className={styles.thumb}>
                        {cert.image ? (
                          <img
                            src={cert.image}
                            alt=""
                            loading="lazy"
                            className={styles.thumbImage}
                          />
                        ) : (
                          <span className={styles.thumbFallback}>ACiT</span>
                        )}
                      </div>
                      <div className={styles.cardBody}>
                        <h3 className={styles.cardTitle}>{cert.title}</h3>
                        <p className={styles.cardMeta}>
                          {cert.issuer} · {cert.date}
                        </p>
                        <span className={styles.cardAction}>View certificate</span>
                      </div>
                    </button>
                    {!!cert.verifyUrl && (
                      <Link href={cert.verifyUrl} className={styles.cardVerify}>
                        Verify credential
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </ProjectTextRow>
          </ProjectSectionContent>
        </ProjectSection>
      </ProjectContainer>
      {openCert && (
        <CertLightbox
          cert={openCert}
          onClose={closeLightbox}
          titleId={titleId}
        />
      )}
      <Footer />
    </>
  );
}
