import React from 'react'
import { render, screen } from '@testing-library/react'
import AnnotationDashboardPage from '../app/projects/annotation-dashboard/page'

function omitMotionProps(props: Record<string, unknown>) {
  const {
    animate,
    exit,
    initial,
    layout,
    transition,
    viewport,
    whileHover,
    whileInView,
    whileTap,
    ...domProps
  } = props

  void animate
  void exit
  void initial
  void layout
  void transition
  void viewport
  void whileHover
  void whileInView
  void whileTap

  return domProps
}

jest.mock('framer-motion', () => ({
  motion: new Proxy({}, {
    get: (_: unknown, tag: string) =>
      ({ children, ...rest }: React.HTMLAttributes<HTMLElement> & { children?: React.ReactNode }) =>
        React.createElement(tag, omitMotionProps(rest), children),
  }),
}))

jest.mock('next/link', () => {
  function MockLink({ children, href }: { children: React.ReactNode; href: string }) {
    return <a href={href}>{children}</a>
  }
  return MockLink
})

jest.mock('lucide-react', () =>
  new Proxy({}, {
    get: (_: unknown, name: string) =>
      function Icon() { return <svg data-testid={`icon-${name}`} /> },
  })
)

jest.mock('../app/projects/annotation-dashboard/_components/AnnotationDashboardDemo', () => ({
  AnnotationDashboardDemo: () => <div data-testid="annotation-demo" />,
}))

describe('AnnotationDashboardPage', () => {
  beforeEach(() => render(<AnnotationDashboardPage />))

  it('renders the page title', () => {
    expect(screen.getByText('Annotation Analytics Dashboard')).toBeInTheDocument()
  })

  it('renders Back to Projects links', () => {
    const links = screen.getAllByText(/Back to Projects/i)
    expect(links.length).toBeGreaterThan(0)
  })

  it('renders the GitHub link', () => {
    expect(screen.getByText(/View on GitHub/i)).toBeInTheDocument()
  })

  it('renders all tech stack badges', () => {
    const techItems = ['Next.js 15', 'TypeScript', 'Recharts', 'Tailwind CSS', 'React Hooks', 'Real-time State']
    techItems.forEach(tech => {
      expect(screen.getByText(tech)).toBeInTheDocument()
    })
  })

  it('renders all highlight titles', () => {
    const titles = ['Live KPI Metrics', 'Alert Threshold Engine', 'Team Performance View', 'Capacity Forecasting']
    titles.forEach(title => {
      expect(screen.getByText(title)).toBeInTheDocument()
    })
  })

  it('renders all engineering fixes', () => {
    expect(screen.getByText(/Independent ±2.5% variation per metric/)).toBeInTheDocument()
    expect(screen.getByText(/Inverted color logic for error rate/)).toBeInTheDocument()
    expect(screen.getByText(/Inline theme script prevents light-mode flash/)).toBeInTheDocument()
  })

  it('renders the AnnotationDashboardDemo component', () => {
    expect(screen.getByTestId('annotation-demo')).toBeInTheDocument()
  })

  it('renders the Overview section', () => {
    expect(screen.getByText('Overview')).toBeInTheDocument()
  })

  it('renders the Analytics badge', () => {
    expect(screen.getByText('Analytics')).toBeInTheDocument()
  })
})
