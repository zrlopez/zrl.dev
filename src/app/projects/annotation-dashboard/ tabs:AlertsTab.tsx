"use client";
import {
  ResponsiveContainer, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend,
} from "recharts";
import { DashboardChartCard } from "../DashboardChartCard";
import { CHART_COLORS, CHART_THEME, SEVERITY_CLASSES } from "../chartTheme";
import type { Kpis } from "../dashboardData";

interface Props {
  kpis: Kpis;
  isDark: boolean;
   typeof import("../dashboardData").SEED_DATA;
}

const STATUS_CLASSES: Record<string, string> = {
  active:       "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
  acknowledged: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
  resolved:     "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
};

export function AlertsTab({ kpis, isDark, data }: Props) {
  const theme = isDark ? CHART_THEME.dark : CHART_THEME.light;

  // Sync live KPI values into threshold display
  const liveThresholds = data.alertsData.thresholds.map((t) => {
    if (t.metric === "Error Rate")
      return { ...t, current: kpis.errorRate, status: kpis.errorRate >= t.threshold ? "warning" : "ok" };
    if (t.metric === "Capacity Utilization")
      return { ...t, current: kpis.capacityUtilization, status: kpis.capacityUtilization >= t.threshold ? "warning" : "ok" };
    return t;
  });

  return (
    <div className="space-y-4">
      {/* Active alerts */}
      <DashboardChartCard title="Active Alerts" subtitle={`${data.alertsData.active.filter(a => a.status === "active").length} unacknowledged`}>
        <div className="space-y-2 py-1">
          {data.alertsData.active.map((alert) => (
            <div key={alert.id} className={`rounded-lg border p-3 ${alert.priority === "high" ? "border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/10" : "border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-900/10"}`}>
              <div className="flex items-start justify-between gap-2">
                <p className="text-sm text-foreground leading-snug">{alert.message}</p>
                <div className="flex items-center gap-1.5 shrink-0">
                  <span className={`rounded px-2 py-0.5 text-xs font-semibold ${SEVERITY_CLASSES[alert.priority]}`}>
                    {alert.priority}
                  </span>
                  <span className={`rounded px-2 py-0.5 text-xs font-semibold ${STATUS_CLASSES[alert.status]}`}>
                    {alert.status}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </DashboardChartCard>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <DashboardChartCard title="Alert History" subtitle="Last 5 days — total, resolved, pending">
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={data.alertsData.history}>
              <CartesianGrid strokeDasharray="3 3" stroke={theme.grid} />
              <XAxis dataKey="date" tick={{ fill: theme.text, fontSize: 10 }}
                tickFormatter={(v) => new Date(v).toLocaleDateString("en-US", { month: "short", day: "numeric" })} />
              <YAxis tick={{ fill: theme.text, fontSize: 11 }} />
              <Tooltip
                contentStyle={{ background: theme.tooltip.bg, border: `1px solid ${theme.tooltip.border}`, borderRadius: 8 }}
                labelFormatter={(v) => new Date(v).toLocaleDateString()}
              />
              <Legend wrapperStyle={{ fontSize: 12, color: theme.text }} />
              <Bar dataKey="total"    fill={CHART_COLORS[2]} stackId="a" name="Total" />
              <Bar dataKey="resolved" fill={CHART_COLORS[0]} stackId="b" name="Resolved" />
              <Bar dataKey="pending"  fill={CHART_COLORS[1]} stackId="b" name="Pending" />
            </BarChart>
          </ResponsiveContainer>
        </DashboardChartCard>

        <DashboardChartCard title="Alert Thresholds" subtitle="Live KPI values vs configured limits">
          <div className="space-y-3 py-1">
            {liveThresholds.map((t) => (
              <div key={t.metric} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-medium text-foreground">{t.metric}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-muted-foreground tabular-nums">
                      {t.current} / {t.threshold}
                    </span>
                    <span className={`rounded px-2 py-0.5 font-semibold ${SEVERITY_CLASSES[t.status]}`}>
                      {t.status}
                    </span>
                  </div>
                </div>
                <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${Math.min(100, (t.current / t.threshold) * 100)}%`,
                      backgroundColor: t.status === "warning" ? CHART_COLORS[2] : CHART_COLORS[0],
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </DashboardChartCard>
      </div>
    </div>
  );
}
