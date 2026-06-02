export interface Project {
  id: number
  title: string
  summary: string
  role: string
  year: string
  tags: string[]
  category: string
  featured: boolean
  flagship?: boolean
  link?: string
  github?: string
  docs?: string
  demo?: string
}

export const projects: Project[] = [
  {
    id: 0,
    title: 'ML Incident Response Playbook + Runbook System',
    summary:
      'Designed a production-grade ML incident response framework with structured runbooks, taxonomy governance, and a live anomaly detection demo — deployed as MkDocs documentation and a Hugging Face Spaces API.',
    role: 'Author / Engineer',
    year: '2025–Present',
    tags: ['MLOps', 'Incident Response', 'Python', 'MkDocs', 'Anomaly Detection'],
    category: 'Data Operations',
    featured: true,
    flagship: true,
    github: 'https://github.com/zrlopez/ml-incident-response-playbook',
    docs: 'https://mlops.zrl.dev',
    demo: 'https://huggingface.co/spaces/zrlo/ml-incident-api',
  },
  {
    id: 3,
    title: 'Annotation Analytics Dashboard',
    summary:
      'Developed an interactive dashboard to track annotation quality trends, ML support metrics, and workflow performance patterns.',
    role: 'Developer',
    year: '2025–Present',
    tags: ['Analytics', 'Dashboard', 'ML Metrics'],
    category: 'Analytics',
    featured: true,
    link: 'https://zrl.dev/projects/annotation-dashboard',
    github: 'https://github.com/zrlopez/performance-analytics-tool',
  },
  {
    id: 5,
    title: 'Portfolio Website',
    summary:
      'Designed and built this portfolio using Next.js, TypeScript, and Tailwind CSS — deployed on Vercel with Cloudflare handling DNS and CDN.',
    role: 'Developer',
    year: '2025–Present',
    tags: ['Next.js', 'TypeScript', 'Tailwind', 'Vercel'],
    category: 'Web Development',
    featured: true,
    link: 'https://zrl.dev',
    github: 'https://github.com/zrlopez/zrl.dev',
  },
  {
    id: 1,
    title: 'AI/ML Experiment Suite',
    summary:
      'Designed and executed 10+ NLP annotation experiments using Python and SQL to evaluate labeling consistency and test workflow assumptions, reducing variance by 15%.',
    role: 'Lead',
    year: '2024–2026',
    tags: ['NLP', 'Python', 'SQL', 'Annotation QA'],
    category: 'Data Operations',
    featured: true,
  },
  {
    id: 2,
    title: 'Data Pipeline Prototypes',
    summary:
      'Engineered ETL and data-validation pipelines with Pandas and SQLite, automating quality checks and generating Tableau-ready outputs — reducing reporting processing time by 40%.',
    role: 'Engineer',
    year: '2025–2026',
    tags: ['ETL', 'Pandas', 'SQLite', 'Tableau'],
    category: 'Data Engineering',
    featured: true,
  },
  {
    id: 4,
    title: 'Health Record System',
    summary:
      'Built a secure SQLite-based personal health record application with a React frontend for aggregating medical documents (PDFs, XMLs, JSON) with HIPAA-compliant local storage and data visualization.',
    role: 'Developer',
    year: 'Aug 2025',
    tags: ['SQLite', 'React', 'HIPAA', 'Python'],
    category: 'Data Engineering',
    featured: true,
  },
]
