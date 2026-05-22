"use client";
import {
  ResponsiveContainer, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend,
} from "recharts";
import { DashboardChartCard } from "../DashboardChartCard";
import { CHART_COLORS, CHART_THEME, SEVERITY_CLASSES } from "../chartTheme";

interface Props {
  isDark: boolean;
   typeof import("../dashboardData").SEED_DATA;
}

export function CapacityForecastingTab({ isDark, data }: Props) {
  const theme = isDark ? CHART_THEME.dark : CHART_THEME.light;

  // Merge historical + forecast into one series for the combo chart
  const combined = [
    ...data.capacityData.historical.map((d) => ({
      date: d.date, actual: d.actual, predicted: d.predicted, forecast: null as number | null,
    })),
    ...data.capacityData.forecast.map((d) => ({
      date: d.date, actual: null as number | null, predicted: null as number | null, forecast: d.predicted,
    })),
  ];

  const growthData = data.throughputData.daily.slice(-10);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <DashboardChartCard title="Capacity Forecast" subtitle="Historical actual vs predicted + 10-day forecast">
          <ResponsiveContainer width="100%" height={240}>
            <LineChart data={combined}>
              <CartesianGrid strokeDasharray="3 3" stroke={theme.grid} />
              <XAxis dataKey="date" tick={{ fill: theme.text, fontSize: 10 }} interval={3}
                tickFormatter={(v) => new Date(v).toLocaleDateString("en-US", { month: "short", day: "numeric" })} />
              <YAxis tick={{ fill: theme.text, fontSize: 11 }} unit="%" />
              <Tooltip
                contentStyle={{ background: theme.tooltip.bg, border: `1px solid ${theme.tooltip.border}`, borderRadius: 8 }}
                labelFormatter={(v) => new Date(v).toLocaleDateString()}
              />
              <Legend wrapperStyle={{ fontSize: 12, color: theme.text }} />
              <Line type="monotone" dataKey="actual"    stroke={CHART_COLORS[0]} strokeWidth={2} dot={false} name="Actual" connectNulls={false} />
              <Line type="monotone" dataKey="predicted" stroke={CHART_COLORS[1]} strokeWidth={2} dot={false} name="Predicted (hist)" strokeDasharray="4 4" connectNulls={false} />
              <Line type="monotone" dataKey="forecast"  stroke={CHART_COLORS[4]} strokeWidth={2} dot={false} name="Forecast" strokeDasharray="6 3" connectNulls={false} />
            </LineChart>
          </ResponsiveContainer>
        </DashboardChartCard>

        <DashboardChartCard title="Growth Projection" subtitle="Throughput trend last 10 days">
          <ResponsiveContainer width="100%" height={240}>
            <LineChart data={growthData}>
              <CartesianGrid strokeDasharray="3 3" stroke={theme.grid} />
              <XAxis dataKey="date" tick={{ fill: theme.text, fontSize: 10 }}
                tickFormatter={(v) => new Date(v).toLocaleDateString("en-US", { month: "short", day: "numeric" })} />
              <YAxis tick={{ fill: theme.text, fontSize: 11 }} />
              <Tooltip
                contentStyle={{ background: theme.tooltip.bg, border: `1px solid ${theme.tooltip.border}`, borderRadius: 8 }}
                labelFormatter={(v) => new Date(v).toLocaleDateString()}
              />
              <Line type="monotone" dataKey="value" stroke={CHART_COLORS[0]} strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </DashboardChartCard>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <DashboardChartCard title="Resource Bottlenecks" subtitle="Current utilization by resource">
          <div className="space-y-3 py-1">
            {data.capacityData.bottlenecks.map((b) => (
              <div key={b.resource} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-foreground font-medium">{b.resource}</span>
                  <div className="flex items-center gap-2">
                    <span className={`rounded px-2 py-0.5 text-xs font-semibold ${SEVERITY_CLASSES[b.severity]}`}>
                      {b.severity}
                    </span>
                    <span className="tabular-nums text-muted-foreground">{b.utilization}%</span>
                  </div>
                </div>
                <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all"
                    style={{
                      width: `${b.utilization}%`,
                      backgroundColor: b.utilization >= 90 ? CHART_COLORS[2] : b.utilization >= 75 ? CHART_COLORS[1] : CHART_COLORS[0],
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </DashboardChartCard>

        <DashboardChartCard title="Recommendations">
          <div className="space-y-2 py-1">
            {data.capacityData.recommendations.map((rec, i) => (
              <div key={i} className="rounded-lg border border-border bg-muted/30 p-3 space-y-1">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-semibold text-foreground">
                    {rec.type}: {rec.resource}
                  </span>
                  <span className={`rounded px-2 py-0.5 text-xs font-semibold ${SEVERITY_CLASSES[rec.priority]}`}>
                    {rec.priority}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground">{rec.impact}</p>
              </div>
            ))}
          </div>
        </DashboardChartCard>
      </div>
    </div>
  );
}
