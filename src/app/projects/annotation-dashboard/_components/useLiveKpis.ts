"use client";
import { useState, useEffect } from "react";
import { BASE_KPIS, type Kpis } from "./dashboardData";

function nudge(base: number, pct: number): number {
  return parseFloat((base * (1 + (Math.random() - 0.5) * pct)).toFixed(1));
}

function signedPct(current: number, base: number): string {
  const diff = ((current - base) / base) * 100;
  return (diff >= 0 ? "+" : "") + diff.toFixed(1) + "%";
}

export function useLiveKpis(intervalMs = 5000): Kpis {
  const [kpis, setKpis] = useState<Kpis>(BASE_KPIS);

  useEffect(() => {
    const id = setInterval(() => {
      const t  = nudge(BASE_KPIS.totalThroughput,      0.04);
      const e  = nudge(BASE_KPIS.errorRate,            0.08);
      const ef = nudge(BASE_KPIS.teamEfficiency,       0.03);
      const c  = nudge(BASE_KPIS.capacityUtilization,  0.03);
      setKpis({
        totalThroughput:           t,
        throughputChange:          signedPct(t,  BASE_KPIS.totalThroughput),
        errorRate:                 e,
        errorRateChange:           signedPct(e,  BASE_KPIS.errorRate),
        teamEfficiency:            ef,
        teamEfficiencyChange:      signedPct(ef, BASE_KPIS.teamEfficiency),
        capacityUtilization:       c,
        capacityUtilizationChange: signedPct(c,  BASE_KPIS.capacityUtilization),
      });
    }, intervalMs);
    return () => clearInterval(id);
  }, [intervalMs]);

  return kpis;
}
