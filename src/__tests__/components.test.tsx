/**
 * components.test.tsx
 * Render tests for all section and layout components.
 *
 * Strategy: render each component and assert key landmark text/roles are present.
 * framer-motion and lucide-react are mocked to avoid animation/SVG overhead.
 * next/link, next-themes, and next/navigation are also mocked.
 */

import React from 'react';
import { render, screen } from '@testing-library/react';

// ── Global mocks ──────────────────────────────────────────────────────────────

jest.mock('framer-motion', () => ({
  motion: new Proxy({}, {
    get: (_: unknown, tag: string) =>
      ({ children, ...rest }: React.HTMLAttributes<HTMLElement> & { children?: React.ReactNode }) =>
        React.createElement(tag === 'div' ? 'div' : tag, rest, children),
  }),
  AnimatePresence: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  useInView: () => true,
  useAnimation: () => ({ start: jest.fn() }),
}));

jest.mock('lucide-react', () =>
  new Proxy({}, {
    get: (_: unknown, name: string) =>
      () => <svg data-testid={`icon-${name}`} />,
  })
);

jest.mock('next/link', () => {
  function MockLink({ children, href }: { children: React.ReactNode; href: string }) {
    return <a href={href}>{children}</a>;
  }
  return MockLink;
});

jest.mock('next/navigation', () => ({
  useRouter: () => ({ push: jest.fn() }),
  usePathname: () => '/',
}));

jest.mock('next-themes', () => ({
  useTheme: () => ({ theme: 'light', setTheme: jest.fn(), resolvedTheme: 'light' }),
  ThemeProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

// Stub window.matchMedia for jsdom
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation((query: string) => ({
    matches: false, media: query, onchange: null,
    addListener: jest.fn(), removeListener: jest.fn(),
    addEventListener: jest.fn(), removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

// ── Hero ──────────────────────────────────────────────────────────────────────

import { Hero } from '@/components/sections/hero';

describe('<Hero />', () => {
  it('renders without crashing', () => {
    const { container } = render(<Hero />);
    expect(container).toBeTruthy();
  });

  it('contains a primary heading', () => {
    render(<Hero />);
    const heading = screen.getByRole('heading', { level: 1 });
    expect(heading).toBeTruthy();
  });
});

// ── About ─────────────────────────────────────────────────────────────────────

import { About } from '@/components/sections/about';

describe('<About />', () => {
  it('renders without crashing', () => {
    const { container } = render(<About />);
    expect(container).toBeTruthy();
  });

  it('renders an About heading', () => {
    render(<About />);
    expect(screen.getByText(/about/i)).toBeTruthy();
  });
});

// ── Stats ─────────────────────────────────────────────────────────────────────

import { Stats } from '@/components/sections/stats';

describe('<Stats />', () => {
  beforeEach(() => jest.useFakeTimers());
  afterEach(() => jest.useRealTimers());

  it('renders without crashing', () => {
    const { container } = render(<Stats />);
    expect(container).toBeTruthy();
  });

  it('renders a Stats heading', () => {
    render(<Stats />);
    expect(screen.getByText(/stats/i)).toBeTruthy();
  });
});

// ── Skills ────────────────────────────────────────────────────────────────────

import { Skills } from '@/components/sections/skills';

describe('<Skills />', () => {
  it('renders without crashing', () => {
    const { container } = render(<Skills />);
    expect(container).toBeTruthy();
  });

  it('renders a Skills heading', () => {
    render(<Skills />);
    expect(screen.getByRole('heading', { name: /^skills$/i, level: 2 })).toBeTruthy();
  });
});

// ── Experience ────────────────────────────────────────────────────────────────

import { Experience } from '@/components/sections/experience';

describe('<Experience />', () => {
  it('renders without crashing', () => {
    const { container } = render(<Experience />);
    expect(container).toBeTruthy();
  });

  it('renders an Experiences heading', () => {
    render(<Experience />);
    expect(screen.getByRole('heading', { name: /^experiences$/i, level: 2 })).toBeTruthy();
  });
});

// ── Tools ─────────────────────────────────────────────────────────────────────

import { Tools } from '@/components/sections/tools';

describe('<Tools />', () => {
  it('renders without crashing', () => {
    const { container } = render(<Tools />);
    expect(container).toBeTruthy();
  });

  it('renders a Tools & Technologies heading', () => {
    render(<Tools />);
    expect(screen.getByRole('heading', { name: /tools & technologies/i, level: 2 })).toBeTruthy();
  });
});

// ── Projects ──────────────────────────────────────────────────────────────────

import { Projects } from '@/components/sections/projects';

describe('<Projects />', () => {
  it('renders without crashing', () => {
    const { container } = render(<Projects />);
    expect(container).toBeTruthy();
  });

  it('renders a Projects heading', () => {
    render(<Projects />);
    expect(screen.getByRole('heading', { name: /^projects$/i, level: 2 })).toBeTruthy();
  });
});

// ── Certifications ────────────────────────────────────────────────────────────

import { Certifications } from '@/components/sections/certifications';

describe('<Certifications />', () => {
  it('renders without crashing', () => {
    const { container } = render(<Certifications />);
    expect(container).toBeTruthy();
  });

  it('renders a Certifications heading', () => {
    render(<Certifications />);
    expect(screen.getByRole('heading', { name: /^certifications$/i, level: 2 })).toBeTruthy();
  });
});

// ── Contact ───────────────────────────────────────────────────────────────────

import { Contact } from '@/components/sections/contact';

// Stub Turnstile on window
beforeAll(() => {
  Object.defineProperty(window, 'turnstile', {
    writable: true,
    value: {
      render: jest.fn().mockReturnValue('widget-id'),
      reset: jest.fn(),
      remove: jest.fn(),
    },
  });
});

describe('<Contact />', () => {
  beforeEach(() => jest.useFakeTimers());
  afterEach(() => jest.useRealTimers());

  it('renders without crashing', () => {
    const { container } = render(<Contact />);
    expect(container).toBeTruthy();
  });

  it('renders name, email, subject, and message fields', () => {
    render(<Contact />);
    expect(screen.getByRole('textbox', { name: /name/i })).toBeTruthy();
    expect(screen.getByRole('textbox', { name: /email/i })).toBeTruthy();
    expect(screen.getByRole('textbox', { name: /subject/i })).toBeTruthy();
    expect(screen.getByRole('textbox', { name: /message/i })).toBeTruthy();
  });

  it('renders a send button', () => {
    render(<Contact />);
    expect(screen.getByRole('button', { name: /send/i })).toBeTruthy();
  });
});

// ── Navigation ────────────────────────────────────────────────────────────────

import { Navigation } from '@/components/navigation';

describe('<Navigation />', () => {
  it('renders without crashing', () => {
    const { container } = render(<Navigation />);
    expect(container).toBeTruthy();
  });

  it('renders a nav element', () => {
    render(<Navigation />);
    expect(screen.getByRole('navigation')).toBeTruthy();
  });
});

// ── Footer ────────────────────────────────────────────────────────────────────

import { Footer } from '@/components/footer';

describe('<Footer />', () => {
  it('renders without crashing', () => {
    const { container } = render(<Footer />);
    expect(container).toBeTruthy();
  });

  it('renders footer element', () => {
    render(<Footer />);
    expect(screen.getByRole('contentinfo')).toBeTruthy();
  });
});

// ── LegalLayout ───────────────────────────────────────────────────────────────

import LegalLayout from '@/components/LegalLayout';

describe('<LegalLayout />', () => {
  it('renders children', () => {
    render(
      <LegalLayout title="Test Title">
        <p>Test content</p>
      </LegalLayout>
    );
    expect(screen.getByText('Test Title')).toBeTruthy();
    expect(screen.getByText('Test content')).toBeTruthy();
  });
});

// ── ThemeProvider ─────────────────────────────────────────────────────────────

import { ThemeProvider } from '@/components/theme-provider';

describe('<ThemeProvider />', () => {
  it('renders children', () => {
    render(
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <div>theme child</div>
      </ThemeProvider>
    );
    expect(screen.getByText('theme child')).toBeTruthy();
  });
});
