import React from 'react';
import { render, screen } from '@testing-library/react';

jest.mock('next/font/google', () => ({
  Nunito: () => ({ variable: '--font-nunito', className: 'nunito' }),
}));

jest.mock('@/components/theme-provider', () => ({
  ThemeProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

jest.mock('@/components/navigation', () => ({
  Navigation: () => <nav data-testid="navigation" />,
}));

jest.mock('@/components/footer', () => ({
  Footer: () => <footer data-testid="footer" />,
}));

jest.mock('@/components/sections/hero', () => ({
  Hero: () => <section data-testid="hero" />,
}));

jest.mock('@/components/sections/about', () => ({
  About: () => <section data-testid="about" />,
}));

jest.mock('@/components/sections/stats', () => ({
  Stats: () => <section data-testid="stats" />,
}));

jest.mock('@/components/sections/skills', () => ({
  Skills: () => <section data-testid="skills" />,
}));

jest.mock('@/components/sections/experience', () => ({
  Experience: () => <section data-testid="experience" />,
}));

jest.mock('@/components/sections/projects', () => ({
  Projects: () => <section data-testid="projects" />,
}));

jest.mock('@/components/sections/certifications', () => ({
  Certifications: () => <section data-testid="certifications" />,
}));

jest.mock('@/components/sections/contact', () => ({
  Contact: () => <section data-testid="contact" />,
}));

jest.mock('@/components/LegalLayout', () => ({
  __esModule: true,
  default: ({ title, children }: { title: string; children: React.ReactNode }) => (
    <main>
      <h1>{title}</h1>
      {children}
    </main>
  ),
}));

describe('HomePage', () => {
  it('renders without crashing', async () => {
    const { default: HomePage } = await import('@/app/page');
    const { container } = render(<HomePage />);
    expect(container).toBeTruthy();
  });

  it('renders all section placeholders', async () => {
    const { default: HomePage } = await import('@/app/page');
    render(<HomePage />);
    expect(document.querySelector('[data-testid="hero"]')).toBeTruthy();
    expect(document.querySelector('[data-testid="about"]')).toBeTruthy();
    expect(document.querySelector('[data-testid="contact"]')).toBeTruthy();
  });
});

describe('PrivacyPage', () => {
  it('renders without crashing', async () => {
    const { default: PrivacyPage } = await import('@/app/privacy/page');
    const { container } = render(<PrivacyPage />);
    expect(container).toBeTruthy();
  });

  it('renders Privacy Policy heading', async () => {
    const { default: PrivacyPage } = await import('@/app/privacy/page');
    render(<PrivacyPage />);
    expect(screen.getByText('Privacy Policy')).toBeTruthy();
  });
});

describe('TermsPage', () => {
  it('renders without crashing', async () => {
    const { default: TermsPage } = await import('@/app/terms/page');
    const { container } = render(<TermsPage />);
    expect(container).toBeTruthy();
  });

  it('renders Terms of Service heading', async () => {
    const { default: TermsPage } = await import('@/app/terms/page');
    render(<TermsPage />);
    expect(screen.getByText('Terms of Service')).toBeTruthy();
  });
});

describe('RootLayout', () => {
  it('renders children without crashing', async () => {
    const { default: RootLayout } = await import('@/app/layout');
    const { container } = render(
      <RootLayout>
        <div data-testid="child">hello</div>
      </RootLayout>
    );
    expect(container).toBeTruthy();
    expect(document.querySelector('[data-testid="child"]')).toBeTruthy();
  });

  it('renders navigation and footer', async () => {
    const { default: RootLayout } = await import('@/app/layout');
    render(
      <RootLayout>
        <div />
      </RootLayout>
    );
    expect(document.querySelector('[data-testid="navigation"]')).toBeTruthy();
    expect(document.querySelector('[data-testid="footer"]')).toBeTruthy();
  });
});
