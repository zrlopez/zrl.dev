/**
 * chartTheme.test.ts
 * Unit tests for annotation dashboard chart theme constants.
 * Pure config module — no mocks required.
 */

import { CHART_COLORS, CHART_THEME, SEVERITY_CLASSES } from '@/app/projects/annotation-dashboard/_components/chartTheme';

const HEX_RE = /^#[0-9A-Fa-f]{6}$/;

// ── CHART_COLORS ───────────────────────────────────────────────────────────────

describe('CHART_COLORS', () => {
  it('is a non-empty array', () => {
    expect(Array.isArray(CHART_COLORS)).toBe(true);
    expect(CHART_COLORS.length).toBeGreaterThan(0);
  });

  it('every entry is a valid 6-digit hex color', () => {
    CHART_COLORS.forEach(color => {
      expect(HEX_RE.test(color)).toBe(true);
    });
  });

  it('has no duplicate colors', () => {
    const unique = new Set(CHART_COLORS);
    expect(unique.size).toBe(CHART_COLORS.length);
  });
});

// ── CHART_THEME ───────────────────────────────────────────────────────────────

describe('CHART_THEME', () => {
  it('has both light and dark variants', () => {
    expect(CHART_THEME).toHaveProperty('light');
    expect(CHART_THEME).toHaveProperty('dark');
  });

  it.each(['light', 'dark'] as const)('%s variant has grid, text, and tooltip', (mode) => {
    expect(CHART_THEME[mode]).toHaveProperty('grid');
    expect(CHART_THEME[mode]).toHaveProperty('text');
    expect(CHART_THEME[mode]).toHaveProperty('tooltip');
  });

  it.each(['light', 'dark'] as const)('%s tooltip has bg, border, and text', (mode) => {
    const { tooltip } = CHART_THEME[mode];
    expect(tooltip).toHaveProperty('bg');
    expect(tooltip).toHaveProperty('border');
    expect(tooltip).toHaveProperty('text');
  });

  it('light and dark grid colors differ', () => {
    expect(CHART_THEME.light.grid).not.toBe(CHART_THEME.dark.grid);
  });

  it('light and dark text colors differ', () => {
    expect(CHART_THEME.light.text).not.toBe(CHART_THEME.dark.text);
  });
});

// ── SEVERITY_CLASSES ──────────────────────────────────────────────────────────

describe('SEVERITY_CLASSES', () => {
  it('has entries for high, medium, low, ok, and warning', () => {
    (['high', 'medium', 'low', 'ok', 'warning'] as const).forEach(level => {
      expect(SEVERITY_CLASSES).toHaveProperty(level);
    });
  });

  it('every class string is non-empty', () => {
    Object.values(SEVERITY_CLASSES).forEach(cls => {
      expect(cls.length).toBeGreaterThan(0);
    });
  });

  it('high severity uses red classes', () => {
    expect(SEVERITY_CLASSES.high).toContain('red');
  });

  it('medium and warning use amber classes', () => {
    expect(SEVERITY_CLASSES.medium).toContain('amber');
    expect(SEVERITY_CLASSES.warning).toContain('amber');
  });

  it('low and ok use green classes', () => {
    expect(SEVERITY_CLASSES.low).toContain('green');
    expect(SEVERITY_CLASSES.ok).toContain('green');
  });

  it('all class strings include dark mode variants', () => {
    Object.values(SEVERITY_CLASSES).forEach(cls => {
      expect(cls).toContain('dark:');
    });
  });
});
