"use client";
import {
  ResponsiveContainer, LineChart, Line, BarChart, Bar,
  PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
} from "recharts";
import { DashboardChartCard } from "../DashboardChartCard";
import { CHART_COLORS, CHART_THEME } from "../chartTheme";
import type { SEED_DATA } from "../dashboardData";

interface Props { isDark: boolean; data: typeof SEED_DATA; }

export function ThroughputTab({ isDark, data }: Props) {
  const theme = isDark ? CHART_THEME.dark : CHART_THEME.light;
  const peakHours = [...data.throughputData.hourly].sort((a, b) => b.value - a.value).slice(0, 6);
  const fmt = (v: string) => new Date(v).toLocaleDateString("en-US", { month: "short", day: "numeric" });

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
      <DashboardChartCard title="Hourly Throughput" subtitle="Requests per hour today">
        <ResponsiveContainer width="100%" height={220}>
          <LineChart data={data.throughputData.hourly}>
            <CartesianGrid strokeDasharray="3 3" stroke={theme.grid} />
            <XAxis dataKey="time" tick={{ fill: theme.text, fontSize: 11 }} interval={3} />
            <YAxis tick={{ fill: theme.text, fontSize: 11 }} />
            <Tooltip contentStyle={{ background: theme.tooltip.bg, border: `1px solid ${theme.tooltip.border}`, borderRadius: 8 }} />
            <Line type="monotone" dataKey="value" stroke={CHART_COLORS[0]} strokeWidth={2} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </DashboardChartCard>

      <DashboardChartCard title="Daily Throughput" subtitle="Last 25 days">
        <ResponsiveContainer width="100%" height={220}>
          <LineChart data={data.throughputData.daily}>
            <CartesianGrid strokeDasharray="3 3" stroke={theme.grid} />
            <XAxis dataKey="date" tick={{ fill: theme.text, fontSize: 10 }} interval={6} tickFormatter={fmt} />
            <YAxis tick={{ fill: theme.text, fontSize: 11 }} />
            <Tooltip contentStyle={{ background: theme.tooltip.bg, border: `1px solid ${theme.tooltip.border}`, borderRadius: 8 }} labelFormatter={(v) => new Date(v).toLocaleDateString()} />
            <Line type="monotone" dataKey="value" stroke={CHART_COLORS[1]} strokeWidth={2} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </DashboardChartCard>

      <DashboardChartCard title="Process Breakdown" subtitle="Share of total throughput">
        <ResponsiveContainer width="100%" height={220}>
          <PieChart>
            <Pie data={data.throughputData.byProcess} dataKey="value" nameKey="process" cx="50%" cy="50%" outerRadius={80} label={(props: import('recharts').PieLabelRenderProps) => `${props.percent != null ? (Number(props.percent) * 100).toFixed(1) : 0}%`}>
              {data.throughputData.byProcess.map((_, i) => <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />)}
            </Pie>
            <Tooltip contentStyle={{ background: theme.tooltip.bg, border: `1px solid ${theme.tooltip.border}`, borderRadius: 8 }} />
            <Legend wrapperStyle={{ fontSize: 12, color: theme.text }} />
          </PieChart>
        </ResponsiveContainer>
      </DashboardChartCard>

      <DashboardChartCard title="Peak Hours" subtitle="Top 6 busiest hours">
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={peakHours}>
            <CartesianGrid strokeDasharray="3 3" stroke={theme.grid} />
            <XAxis dataKey="time" tick={{ fill: theme.text, fontSize: 11 }} />
            <YAxis tick={{ fill: theme.text, fontSize: 11 }} />
            <Tooltip contentStyle={{ background: theme.tooltip.bg, border: `1px solid ${theme.tooltip.border}`, borderRadius: 8 }} />
            <Bar dataKey="value" fill={CHART_COLORS[2]} radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </DashboardChartCard>
    </div>
  );
}
