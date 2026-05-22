"use client";
import type { Kpis } from "./dashboardData";

interface KpiTileProps {
  label: string;
  value: string | number;
  change: string;
  unit?: string;
}

function KpiTile({ label, value, change, unit }: KpiTileProps) {
  const positive = change.startsWith("+");
  const negative = change.startsWith("-");
  const isGoodNegative = label.toLowerCase().includes("error");
  const good = isGoodNegative ? negative : positive;
  return (
    <div className="rounded-xl border border-border bg-card p-4 space-y-1">
      <p className="text-xs text-muted-foreground font-medium">{label}</p>
      <p className="text-2xl font-bold text-foreground tabular-nums">
        {typeof value === "number" ? value.toLocaleString() : value}
        {unit && <span className="text-base font-normal ml-0.5">{unit}</span>}
      </p>
      <p className={`text-xs font-semibold ${good ? "text-emerald-600 dark:text-emerald-400" : "text-red-600 dark:text-red-400"}`}>
        {change} vs last period
      </p>
    </div>
  );
}

export function DashboardKpiRow({ kpis }: { kpis: Kpis }) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      <KpiTile label="Total Throughput"      value={kpis.totalThroughput}      change={kpis.throughputChange} />
      <KpiTile label="Error Rate"            value={kpis.errorRate}            change={kpis.errorRateChange}          unit="%" />
      <KpiTile label="Team Efficiency"       value={kpis.teamEfficiency}       change={kpis.teamEfficiencyChange}     unit="%" />
      <KpiTile label="Capacity Utilization"  value={kpis.capacityUtilization}  change={kpis.capacityUtilizationChange} unit="%" />
    </div>
  );
}
