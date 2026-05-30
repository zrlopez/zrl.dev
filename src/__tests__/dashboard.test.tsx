import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { renderHook, act } from '@testing-library/react';
import { DashboardChartCard } from '@/app/projects/annotation-dashboard/_components/DashboardChartCard';
import { DashboardKpiRow } from '@/app/projects/annotation-dashboard/_components/DashboardKpiRow';
import { DashboardTabs } from '@/app/projects/annotation-dashboard/_components/DashboardTabs';
import { AnnotationDashboardDemo } from '@/app/projects/annotation-dashboard/_components/AnnotationDashboardDemo';
import { OverviewTab } from '@/app/projects/annotation-dashboard/_components/tabs/OverviewTab';
import { ThroughputTab } from '@/app/projects/annotation-dashboard/_components/tabs/ThroughputTab';
import { ErrorsTab } from '@/app/projects/annotation-dashboard/_components/tabs/ErrorsTab';
import { TeamPerformanceTab } from '@/app/projects/annotation-dashboard/_components/tabs/TeamPerformanceTab';
import { CapacityForecastingTab } from '@/app/projects/annotation-dashboard/_components/tabs/CapacityForecastingTab';
import { AlertsTab } from '@/app/projects/annotation-dashboard/_components/tabs/AlertsTab';

jest.mock('recharts', () => ({
  ResponsiveContainer: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  LineChart: ({ children }: { children: React.ReactNode }) => <svg>{children}</svg>,
  BarChart: ({ children }: { children: React.ReactNode }) => <svg>{children}</svg>,
  AreaChart: ({ children }: { children: React.ReactNode }) => <svg>{children}</svg>,
  ComposedChart: ({ children }: { children: React.ReactNode }) => <svg>{children}</svg>,
  PieChart: ({ children }: { children: React.ReactNode }) => <svg>{children}</svg>,
  Line: () => null,
  Bar: () => null,
  Area: () => null,
  Pie: () => null,
  Cell: () => null,
  XAxis: () => null,
  YAxis: () => null,
  CartesianGrid: () => null,
  Tooltip: () => null,
  Legend: () => null,
  ReferenceLine: () => null,
}));

jest.mock('@/app/projects/annotation-dashboard/_components/useLiveKpis', () => ({
  useLiveKpis: () => ({
    totalThroughput: 1234,
    throughputChange: '+5.0%',
    errorRate: 2.1,
    errorRateChange: '-0.3%',
    teamEfficiency: 87,
    teamEfficiencyChange: '+2.0%',
    capacityUtilization: 73,
    capacityUtilizationChange: '+1.0%',
  }),
}));

global.ResizeObserver = class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
};

const MOCK_KPIS = {
  totalThroughput: 1234,
  throughputChange: '+5.0%',
  errorRate: 2.1,
  errorRateChange: '-0.3%',
  teamEfficiency: 87,
  teamEfficiencyChange: '+2.0%',
  capacityUtilization: 73,
  capacityUtilizationChange: '+1.0%',
};

function getSeedData() {
  const mod = jest.requireActual('@/app/projects/annotation-dashboard/_components/dashboardData');
  return mod.SEED_DATA;
}

function getTabProps() {
  return { kpis: MOCK_KPIS, isDark: false, data: getSeedData() };
}

describe('<DashboardChartCard />', () => {
  it('renders title and children', () => {
    render(
      <DashboardChartCard title="Test Chart">
        <p>chart content</p>
      </DashboardChartCard>
    );
    expect(screen.getByText('Test Chart')).toBeTruthy();
    expect(screen.getByText('chart content')).toBeTruthy();
  });

  it('renders optional subtitle', () => {
    render(
      <DashboardChartCard title="Test" subtitle="Sub text">
        <p>child</p>
      </DashboardChartCard>
    );
    expect(screen.getByText('Sub text')).toBeTruthy();
  });
});

describe('<DashboardKpiRow />', () => {
  it('renders without crashing', () => {
    const { container } = render(<DashboardKpiRow kpis={MOCK_KPIS} />);
    expect(container).toBeTruthy();
  });

  it('renders all four KPI labels', () => {
    render(<DashboardKpiRow kpis={MOCK_KPIS} />);
    expect(screen.getByText('Total Throughput')).toBeTruthy();
    expect(screen.getByText('Error Rate')).toBeTruthy();
    expect(screen.getByText('Team Efficiency')).toBeTruthy();
    expect(screen.getByText('Capacity Utilization')).toBeTruthy();
  });

  it('shows positive throughput change in green', () => {
    render(<DashboardKpiRow kpis={MOCK_KPIS} />);
    const el = screen.getByText('+5.0% vs last period');
    expect(el.className).toContain('emerald');
  });

  it('shows negative error rate change as good (green)', () => {
    render(<DashboardKpiRow kpis={MOCK_KPIS} />);
    const el = screen.getByText('-0.3% vs last period');
    expect(el.className).toContain('emerald');
  });
});

describe('<DashboardTabs />', () => {
  it('renders all tab buttons', () => {
    render(<DashboardTabs active="overview" onChange={jest.fn()} />);
    expect(screen.getByRole('button', { name: /overview/i })).toBeTruthy();
    expect(screen.getByRole('button', { name: /throughput/i })).toBeTruthy();
    expect(screen.getByRole('button', { name: /errors/i })).toBeTruthy();
    expect(screen.getByRole('button', { name: /team/i })).toBeTruthy();
    expect(screen.getByRole('button', { name: /capacity/i })).toBeTruthy();
    expect(screen.getByRole('button', { name: /alerts/i })).toBeTruthy();
  });

  it('calls onChange with correct tab id', () => {
    const onChange = jest.fn();
    render(<DashboardTabs active="overview" onChange={onChange} />);
    fireEvent.click(screen.getByRole('button', { name: /throughput/i }));
    expect(onChange).toHaveBeenCalledWith('throughput');
  });
});

describe('<AnnotationDashboardDemo />', () => {
  it('renders without crashing', () => {
    const { container } = render(<AnnotationDashboardDemo />);
    expect(container).toBeTruthy();
  });

  it('renders the dashboard heading', () => {
    render(<AnnotationDashboardDemo />);
    expect(screen.getByText('Annotation Dashboard')).toBeTruthy();
  });

  it('renders dark/light toggle button', () => {
    render(<AnnotationDashboardDemo />);
    expect(screen.getByRole('button', { name: /dark|light/i })).toBeTruthy();
  });

  it('toggles dark mode', () => {
    render(<AnnotationDashboardDemo />);
    const btn = screen.getByRole('button', { name: /dark|light/i });
    fireEvent.click(btn);
    expect(btn.textContent).toMatch(/light/i);
    fireEvent.click(btn);
    expect(btn.textContent).toMatch(/dark/i);
  });

  it('switches tabs on click', () => {
    render(<AnnotationDashboardDemo />);
    fireEvent.click(screen.getByRole('button', { name: /throughput/i }));
    expect(screen.getByRole('button', { name: /throughput/i })).toBeTruthy();
  });
});

describe('<OverviewTab />', () => {
  it('renders without crashing', () => {
    const { container } = render(<OverviewTab {...getTabProps()} />);
    expect(container).toBeTruthy();
  });

  it('renders Throughput Trend card', () => {
    render(<OverviewTab {...getTabProps()} />);
    expect(screen.getByText('Throughput Trend (7d)')).toBeTruthy();
  });

  it('renders all four chart cards', () => {
    render(<OverviewTab {...getTabProps()} />);
    expect(screen.getByText('Error Rate Trend (7d)')).toBeTruthy();
    expect(screen.getByText('Team Efficiency (7d)')).toBeTruthy();
    expect(screen.getByText('Capacity Utilization (7d)')).toBeTruthy();
  });
});

describe('<ThroughputTab />', () => {
  it('renders without crashing', () => {
    const { container } = render(<ThroughputTab {...getTabProps()} />);
    expect(container).toBeTruthy();
  });

  it('renders throughput content', () => {
    render(<ThroughputTab {...getTabProps()} />);
    expect(screen.getAllByText(/throughput/i).length).toBeGreaterThan(0);
  });
});

describe('<ErrorsTab />', () => {
  it('renders without crashing', () => {
    const { container } = render(<ErrorsTab {...getTabProps()} />);
    expect(container).toBeTruthy();
  });

  it('renders error content', () => {
    render(<ErrorsTab {...getTabProps()} />);
    expect(screen.getAllByText(/error/i).length).toBeGreaterThan(0);
  });
});

describe('<TeamPerformanceTab />', () => {
  it('renders without crashing', () => {
    const { container } = render(<TeamPerformanceTab {...getTabProps()} />);
    expect(container).toBeTruthy();
  });

  it('renders team content', () => {
    render(<TeamPerformanceTab {...getTabProps()} />);
    expect(screen.getAllByText(/team/i).length).toBeGreaterThan(0);
  });
});

describe('<CapacityForecastingTab />', () => {
  it('renders without crashing', () => {
    const { container } = render(<CapacityForecastingTab {...getTabProps()} />);
    expect(container).toBeTruthy();
  });

  it('renders capacity content', () => {
    render(<CapacityForecastingTab {...getTabProps()} />);
    expect(screen.getAllByText(/capacity/i).length).toBeGreaterThan(0);
  });
});

describe('<AlertsTab />', () => {
  it('renders without crashing', () => {
    const { container } = render(<AlertsTab {...getTabProps()} />);
    expect(container).toBeTruthy();
  });

  it('renders Active Alerts card', () => {
    render(<AlertsTab {...getTabProps()} />);
    expect(screen.getByText('Active Alerts')).toBeTruthy();
  });

  it('renders in dark mode', () => {
    const { container } = render(
      <AlertsTab kpis={MOCK_KPIS} isDark={true} data={getSeedData()} />
    );
    expect(container).toBeTruthy();
  });
});

describe('useLiveKpis() (real hook)', () => {
  beforeAll(() => {
    jest.unmock('@/app/projects/annotation-dashboard/_components/useLiveKpis');
  });

  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('returns all expected KPI keys on mount', () => {
    const mod = jest.requireActual('@/app/projects/annotation-dashboard/_components/useLiveKpis');
    const { result } = renderHook(() => mod.useLiveKpis(5000));
    const keys = [
      'totalThroughput', 'throughputChange',
      'errorRate', 'errorRateChange',
      'teamEfficiency', 'teamEfficiencyChange',
      'capacityUtilization', 'capacityUtilizationChange',
    ];
    keys.forEach((k) => expect(result.current).toHaveProperty(k));
  });

  it('updates values after interval fires', () => {
    const mod = jest.requireActual('@/app/projects/annotation-dashboard/_components/useLiveKpis');
    const { result } = renderHook(() => mod.useLiveKpis(1000));
    act(() => { jest.advanceTimersByTime(1100); });
    expect(typeof result.current.totalThroughput).toBe('number');
  });
});
