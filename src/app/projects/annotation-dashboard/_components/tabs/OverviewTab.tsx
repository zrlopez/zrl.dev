"use client";
import { ResponsiveContainer, LineChart, Line } from "recharts";
import { DashboardChartCard } from "../DashboardChartCard";
import { CHART_COLORS } from "../chartTheme";
import type { Kpis } from "../dashboardData";
import type { SEED_DATA } from "../dashboardData";

interface Props {
  kpis: Kpis;
  isDark: boolean; data:
   typeof SEED_DATA;
}

function Sparkline({ values, color }: { values: number[]; color: string }) {
  const d = values.map((value, i) => ({ i, value }));
  return (
    <ResponsiveContainer width="100%" height={48}>
      <LineChart data={d} margin={{ top: 4, right: 0, left: 0, bottom: 0 }}>
        <Line type="monotone" dataKey="value" stroke={color} strokeWidth={2} dot={false} />
      </LineChart>
    </ResponsiveContainer>
  );
}

export function OverviewTab({ data }: Props) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <DashboardChartCard title="Throughput Trend (7d)">
          <Sparkline values={data.throughputData.daily.slice(-7).map((d) => d.value)} color={CHART_COLORS[0]} />
        </DashboardChartCard>
        <DashboardChartCard title="Error Rate Trend (7d)">
          <Sparkline values={data.errorData.trends.slice(-7).map((d) => d.value)} color={CHART_COLORS[2]} />
        </DashboardChartCard>
        <DashboardChartCard title="Team Efficiency (7d)">
          <Sparkline values={data.teamData.productivity.slice(-7).map((d) => d.value)} color={CHART_COLORS[1]} />
        </DashboardChartCard>
        <DashboardChartCard title="Capacity Utilization (7d)">
          <Sparkline values={data.capacityData.historical.slice(-7).map((d) => d.actual ?? 0)} color={CHART_COLORS[3]} />
        </DashboardChartCard>
      </div>
      <DashboardChartCard title="Throughput by Process">
        <div className="divide-y divide-border text-sm">
          {data.throughputData.byProcess.map((row) => (
            <div key={row.process} className="flex items-center justify-between py-2">
              <span className="text-muted-foreground">{row.process}</span>
              <div className="flex items-center gap-3">
                <div className="w-24 h-1.5 rounded-full bg-muted overflow-hidden">
                  <div className="h-full rounded-full" style={{ width: `${row.percentage}%`, backgroundColor: CHART_COLORS[0] }} />
                </div>
                <span className="font-semibold text-foreground w-12 text-right tabular-nums">{row.value.toLocaleString()}</span>
                <span className="text-muted-foreground w-10 text-right tabular-nums">{row.percentage}%</span>
              </div>
            </div>
          ))}
        </div>
      </DashboardChartCard>
    </div>
  );
}
